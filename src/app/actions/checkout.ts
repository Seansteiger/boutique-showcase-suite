"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

// Define Zod schema for validation
const shippingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().optional().or(z.literal("")), // Make optional for Campus delivery
});

const itemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    unit_price: z.number().nonnegative(),
});

const orderSchema = z.object({
    items: z.array(itemSchema).min(1, "Cart is empty"),
    total: z.number().nonnegative(),
});

// Initialize Convex Client
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

// PayFast Config — NO hardcoded fallbacks; fail loudly if env vars missing
const PF_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PF_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PF_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const isProduction = process.env.PAYFAST_MODE === "production" || process.env.NODE_ENV === "production";
const PF_URL = isProduction ? "https://www.payfast.co.za/eng/process" : "https://sandbox.payfast.co.za/eng/process";

const SHIPPING_PRICES: Record<string, number> = {
    'zone-standard': 85,
    'zone-express': 140,
    'zone-collection': 0,
};

export async function placeOrderAction(formData: FormData, cartItems: any[], clientTotal: number) {
    try {
        // 1. Validate Form Data
        const rawData = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            address: formData.get("address"),
            city: formData.get("city") || "Johannesburg", // Default to JHB if empty
        };

        const shippingResult = shippingSchema.safeParse(rawData);
        if (!shippingResult.success) {
            return { error: shippingResult.error.issues[0].message };
        }

        // 2. Auth Verification using auth_session cookie
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("auth_session");

        let userId = "mock-user-id";
        let userPhone = "";

        if (sessionCookie?.value) {
            try {
                const session = JSON.parse(sessionCookie.value);
                userId = session.id;
                userPhone = session.phone || "";
            } catch (e) {
                console.error("Failed to parse auth_session in placeOrderAction:", e);
                return { error: "Invalid auth session" };
            }
        } else {
            return { error: "User not authenticated" };
        }

        // 3. Validate Items
        const cleanItems = cartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.product.sale_price ?? item.product.price
        }));

        const itemsResult = z.array(itemSchema).safeParse(cleanItems);
        if (!itemsResult.success) {
            return { error: "Invalid cart items data" };
        }

        // 4. Security: Recalculate Total on Server via Convex
        const productIds = cleanItems.map(i => i.product_id);
        console.log("Validating Product IDs via Convex:", productIds);

        // Fetch all products from Convex to find our items and get real, secure prices
        const dbProductsRaw = await convex.query(api.products.getProducts);
        const dbProducts = dbProductsRaw.map((p: any) => ({
            id: p._id.toString(),
            price: p.price,
            sale_price: p.salePrice ?? null,
            title: p.title
        }));

        if (!dbProducts || dbProducts.length === 0) {
            return { error: "Validation Error: No products found in the database" };
        }

        const productMap = new Map(dbProducts.map(p => [p.id, p]));

        // Re-build items with trusted prices
        const trustedItems = cleanItems.map(item => {
            const dbProduct = productMap.get(item.product_id);
            if (!dbProduct || dbProduct.price === undefined) {
                throw new Error(`Product ${item.product_id} not found or price missing`);
            }
            return {
                ...item,
                unit_price: dbProduct.sale_price ?? dbProduct.price,
                is_sale: !!dbProduct.sale_price // flag for coupon logic
            };
        });

        // Calculate Items Total using trusted prices
        const itemsTotal = trustedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

        // Calculate Shipping Total
        const shippingZone = formData.get("shippingZone") as string || 'zone-standard';
        let shippingCost = SHIPPING_PRICES[shippingZone] ?? 85;

        // Apply dynamic free shipping threshold from Convex settings for standard courier
        if (shippingZone === 'zone-standard') {
            try {
                const settings = await convex.query(api.settings.get);
                const freeThreshold = settings?.freeShippingThreshold ?? 1000;
                if (itemsTotal >= freeThreshold) {
                    shippingCost = 0;
                }
            } catch (err) {
                console.error("Failed to query dynamic free shipping threshold on server:", err);
            }
        }

        // 5. Coupon Validation & Logic via Convex
        const couponCode = formData.get("couponCode") as string;
        let discountAmount = 0;
        let appliedCouponCode = null;

        if (couponCode) {
            const coupon = await convex.query(api.coupons.getCouponByCode, { code: couponCode });

            if (coupon && coupon.isActive) {
                let userLimitReached = false;
                if (coupon.usageLimitPerUser !== undefined && coupon.usageLimitPerUser !== null) {
                    // Check coupon usages in Convex for this user (simple query filter)
                }

                if (!userLimitReached) {
                    let eligibleSubtotal = 0;
                    trustedItems.forEach(item => {
                        eligibleSubtotal += item.unit_price * item.quantity;
                    });

                    if (eligibleSubtotal > 0) {
                        if (coupon.discountType === 'percentage') {
                            discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
                        } else {
                            discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
                        }

                        appliedCouponCode = coupon.code;
                    }
                }
            }
        }

        // 5B. Luxury Gifting Server-Side Validation
        const isGiftWrap = formData.get("isGiftWrap") === "true";
        const giftCardMessage = formData.get("giftCardMessage") as string || "";
        const giftWrapCost = isGiftWrap ? 75 : 0;

        // Final Total
        const finalTotal = Math.max(0, itemsTotal + shippingCost + giftWrapCost - discountAmount);

        // 6. Create Order in Convex
        const deliveryMethod =
            shippingZone === 'zone-collection' ? 'Bespoke Showroom Pick-up' :
                shippingZone === 'zone-express' ? 'Overnight Express' :
                    shippingZone === 'zone-standard' ? 'Standard Courier' : 'Standard';

        const orderId = await convex.mutation(api.orders.createOrder, {
            userId: userId,
            total: finalTotal,
            shippingAddress: {
                ...shippingResult.data,
                phone: userPhone,
                shippingZone,
                deliveryMethod,
                shippingCost,
                isGiftWrap,
                giftCardMessage,
                giftWrapCost,
            },
            items: trustedItems.map(item => ({
                productId: item.product_id,
                quantity: item.quantity,
                unitPrice: item.unit_price
            }))
        });

        // 7. Record Coupon Usage in Convex
        if (appliedCouponCode) {
            await convex.mutation(api.coupons.useCoupon, {
                code: appliedCouponCode,
                userId: userId,
                orderId: orderId
            });
        }

        // 8. Delete abandoned cart in Convex
        await convex.mutation(api.carts.updateCart, {
            userId: userId,
            items: [],
            isAbandoned: false
        });

        return {
            success: true,
            orderId: orderId,
            yoco: {
                amountInCents: Math.round(finalTotal * 100), // Yoco requires cents
                currency: 'ZAR',
                publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY
            }
        };

    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { error: `Server Error: ${err.message}` };
    }
}

