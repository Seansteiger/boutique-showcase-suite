"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function getOrderDetails(orderId: string, userId: string) {
    if (!orderId || !userId) return { error: "Missing parameters" };

    try {
        const data = await convex.query(api.orders.getOrderById, { id: orderId });
        if (!data) {
            return { error: "Order not found or access denied." };
        }
        
        // SECURITY: Ensure the user actually owns this order
        if (data.userId !== userId) {
            return { error: "Order not found or access denied." };
        }

        // Normalize format for legacy Supabase client compatibility
        return { 
            order: {
                ...data,
                created_at: data.createdAt,
                order_items: data.items.map((i: any) => ({
                    ...i,
                    price: i.unitPrice,
                    products: i.product ? { title: i.product.title, image_urls: i.product.imageUrls } : null
                }))
            } 
        };
    } catch (err: any) {
        console.error("Server Action Error:", err);
        return { error: err.message };
    }
}

export async function getUserOrders(userId: string) {
    if (!userId) return { error: "Missing User ID" };

    try {
        const data = await convex.query(api.orders.getUserOrders, { userId });
        
        return { 
            orders: data.map((o: any) => ({
                ...o,
                created_at: o.createdAt
            })) 
        };
    } catch (err: any) {
        return { error: err.message };
    }
}
