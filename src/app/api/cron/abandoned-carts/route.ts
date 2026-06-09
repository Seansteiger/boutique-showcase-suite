import { NextResponse } from "next/server";
import { generateAbandonedCartEmail, sendEmail } from "@/lib/email";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { sendWhatsAppRecovery } from "@/lib/whatsapp";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function GET(request: Request) {
    try {
        // 1. Verify Vercel Cron Secret
        const authHeader = request.headers.get("Authorization");
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Fetch all carts from Convex
        const allCarts = await convex.query(api.carts.getAllCarts);

        // Filter carts older than 2 hours, isAbandoned = true, recoveryStatus = "none"
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
        const abandonedCarts = allCarts.filter((cart: any) => 
            cart.isAbandoned && 
            cart.recoveryStatus === "none" && 
            cart.updatedAt < twoHoursAgo &&
            cart.userId
        );

        if (abandonedCarts.length === 0) {
            return NextResponse.json({ message: "No abandoned carts found." });
        }

        // 3. Fetch User Profiles to get Emails
        const profiles = await convex.query(api.profiles.getAllProfiles);
        const profileMap = new Map<string, any>(profiles.map((p: any) => [p.userId, p]));

        // 3B. Fetch active store name for dynamic concept styling
        const settings = await convex.query(api.settings.get);
        const storeName = settings?.brandName || "SCENTED";

        // 4. Process Each Cart
        let sentCount = 0;

        for (const cart of abandonedCarts) {
            const profile = profileMap.get(cart.userId!) as any;
            if (!profile || !profile.userId) continue;

            const email = profile.userId.includes("admin") ? "admin@scented.co" : (profile.userId.includes("manager") ? "manager@scented.co" : "customer@scented.co");
            const customerName = profile.fullName?.split(" ")[0] || "there";
            const items = cart.items || [];

            if (items.length === 0) continue;

            // Generate unique 10% off coupon code for 24 hours
            const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
            const couponCode = `COMEBACK-${randomString}`;
            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

            // Create coupon in Convex
            await convex.mutation(api.coupons.upsertCoupon, {
                code: couponCode,
                discountType: "percentage",
                discountValue: 10,
                minOrderAmount: 0,
                startDate: new Date().toISOString(),
                expiresAt: tomorrow,
                isActive: true
            });

            // Generate Email HTML
            const emailHtml = generateAbandonedCartEmail(customerName, items, couponCode);

            // Send Email
            const emailSent = await sendEmail({
                to: email,
                subject: `Hey ${customerName}, you left something in your cart!`,
                html: emailHtml
            });

            if (emailSent) {
                // Send matching WhatsApp Recovery notification
                const itemsSummary = items.map((i: any) => `${i.product.name} (x${i.quantity})`).join(", ");
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
                const checkoutUrl = `${siteUrl}/checkout?recover_cart=${cart._id}&coupon=${couponCode}`;
                
                await sendWhatsAppRecovery({
                    to: profile.phone || "+27821234567",
                    customerName,
                    storeName,
                    itemsSummary,
                    checkoutUrl,
                    couponCode
                });

                // Update cart recovery status in Convex so we don't email/whatsapp them again
                await convex.mutation(api.carts.updateCart, {
                    userId: cart.userId!,
                    items: cart.items,
                    isAbandoned: true,
                    recoveryStatus: "emailed"
                });

                sentCount++;
            }
        }

        return NextResponse.json({ message: `Successfully processed abandoned carts`, sentCount });

    } catch (err: any) {
        console.error("Cron Exception:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
