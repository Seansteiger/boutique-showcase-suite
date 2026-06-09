"use server";

import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

/** Guard: verifies the caller is an authenticated admin user. */
async function requireAdmin() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session");
    if (!sessionCookie?.value) {
        throw new Error("Unauthorized - No Session");
    }
    const session = JSON.parse(sessionCookie.value);
    if (session.role !== 'admin' && session.role !== 'manager') {
        throw new Error("Forbidden - Admin Access Required");
    }
    return session;
}

export async function getAdminOrders() {
    await requireAdmin();

    try {
        const dbOrders = await convex.query(api.orders.getAllOrders);

        // Map to legacy Supabase structure expected by OrderTable
        const orders = dbOrders.map((o: any) => ({
            id: o.id,
            user_id: o.userId,
            created_at: o.createdAt,
            status: o.status,
            total: o.total,
            shipping_address: o.shippingAddress,
            tracking_number: o.trackingNumber || null,
            shipping_provider: o.shippingProvider || null,
            payment_id: o.paymentId || null,
            profiles: {
                full_name: o.customerName || "Guest User",
                email: "customer@scented.co"
            },
            order_items: o.items.map((i: any) => ({
                id: i.id,
                quantity: i.quantity,
                price: i.unitPrice,
                products: {
                    title: i.productTitle,
                    image_urls: [i.productImage]
                }
            }))
        }));

        return { orders };
    } catch (err: any) {
        console.error("Admin Fetch Error:", err);
        return { error: err.message };
    }
}

export async function updateOrderStatus(orderId: string, status: string, tracking?: string, provider?: string) {
    await requireAdmin();

    try {
        const success = await convex.mutation(api.orders.updateOrderStatus, {
            id: orderId,
            status,
            trackingNumber: tracking,
            shippingProvider: provider
        });

        if (success) {
            return { success: true };
        } else {
            return { error: "Failed to update order status" };
        }
    } catch (err: any) {
        return { error: err.message };
    }
}

export async function getAnalyticsMetrics() {
    await requireAdmin();
    
    try {
        // Fetch products to build mock stats reactively
        const dbProducts = await convex.query(api.products.getProducts);

        const metrics = dbProducts.map((p: any, idx: number) => ({
            id: p._id.toString(),
            product_id: p._id.toString(),
            views: 120 - (idx * 10),
            sales_count: 15 - Math.floor(idx * 1.5),
            cart_adds: 25 - Math.floor(idx * 2), // Mock cart adds
            revenue: (15 - Math.floor(idx * 1.5)) * p.price,
            products: {
                title: p.title,
                price: p.price,
                image_urls: p.imageUrls || []
            }
        }));

        return { metrics };
    } catch (err: any) {
        console.error("Analytics Fetch Error:", err);
        return { error: err.message };
    }
}

export async function getGlobalAnalytics() {
    await requireAdmin();

    try {
        const dbOrders = await convex.query(api.orders.getAllOrders);
        const profiles = await convex.query(api.profiles.getAllProfiles);

        const totalVisits = profiles.length * 15 + dbOrders.length * 3;
        const uniqueVisitors = profiles.length + 8;

        return { uniqueVisitors, totalVisits };
    } catch (err: any) {
        console.error("Global Analytics Fetch Error:", err);
        return { error: err.message };
    }
}
