"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

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

export async function getProductsForCoupons() {
    await requireAdmin();
    try {
        const dbProducts = await convex.query(api.products.getProducts);
        
        return { 
            products: dbProducts.map((p: any) => ({
                id: p._id.toString(),
                title: p.title
            })) 
        };
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return { error: error.message };
    }
}

export async function getCoupons() {
    await requireAdmin();
    try {
        const dbCoupons = await convex.query(api.coupons.getAllCoupons);
        
        // Map Convex schema to legacy Supabase frontend format
        const coupons = dbCoupons.map((c: any) => ({
            id: c._id.toString(),
            code: c.code,
            discount_type: c.discountType,
            discount_value: c.discountValue,
            min_order_amount: c.minOrderAmount,
            start_date: c.startDate,
            expires_at: c.expiresAt || null,
            usage_limit_total: c.usageLimitTotal || null,
            usage_limit_per_user: c.usageLimitPerUser || null,
            used_count: c.usedCount || 0,
            is_active: c.isActive,
            included_products: null,
            excluded_products: null,
            exclude_sale_items: false
        }));

        return { coupons };
    } catch (error: any) {
        console.error("Error fetching coupons:", error);
        return { error: error.message };
    }
}

export async function createCoupon(formData: FormData) {
    await requireAdmin();
    try {
        const code = (formData.get('code') as string).toUpperCase();
        const discountType = formData.get('discount_type') as "percentage" | "fixed";
        const discountValue = Number(formData.get('discount_value'));
        const minOrderAmount = Number(formData.get('min_order_amount')) || 0;
        const startDate = formData.get('start_date') ? new Date(formData.get('start_date') as string).toISOString() : new Date().toISOString();
        const expiresAt = formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : undefined;
        const usageLimitTotal = formData.get('usage_limit_total') ? Number(formData.get('usage_limit_total')) : undefined;
        const usageLimitPerUser = formData.get('usage_limit_per_user') ? Number(formData.get('usage_limit_per_user')) : undefined;
        const isActive = formData.get('is_active') === 'true' || formData.get('is_active') === 'true' || formData.get('is_active') !== 'false';

        const couponId = await convex.mutation(api.coupons.upsertCoupon, {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            startDate,
            expiresAt,
            usageLimitTotal,
            usageLimitPerUser,
            isActive
        });

        revalidatePath('/admin/coupons');
        return { 
            success: true, 
            coupon: {
                id: couponId,
                code,
                discount_type: discountType,
                discount_value: discountValue,
                min_order_amount: minOrderAmount,
                start_date: startDate,
                expires_at: expiresAt || null,
                usage_limit_total: usageLimitTotal || null,
                usage_limit_per_user: usageLimitPerUser || null,
                is_active: isActive,
                used_count: 0
            } 
        };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updateCoupon(id: string, formData: FormData) {
    await requireAdmin();
    try {
        const code = (formData.get('code') as string).toUpperCase();
        const discountType = formData.get('discount_type') as "percentage" | "fixed";
        const discountValue = Number(formData.get('discount_value'));
        const minOrderAmount = Number(formData.get('min_order_amount')) || 0;
        const startDate = formData.get('start_date') ? new Date(formData.get('start_date') as string).toISOString() : new Date().toISOString();
        const expiresAt = formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : undefined;
        const usageLimitTotal = formData.get('usage_limit_total') ? Number(formData.get('usage_limit_total')) : undefined;
        const usageLimitPerUser = formData.get('usage_limit_per_user') ? Number(formData.get('usage_limit_per_user')) : undefined;
        const isActive = formData.get('is_active') === 'true' || formData.get('is_active') !== 'false';

        await convex.mutation(api.coupons.upsertCoupon, {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            startDate,
            expiresAt,
            usageLimitTotal,
            usageLimitPerUser,
            isActive
        });

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteCoupon(id: string) {
    await requireAdmin();
    try {
        // Fetch all coupons to match ID back to code
        const dbCoupons = await convex.query(api.coupons.getAllCoupons);
        const match = dbCoupons.find(c => c._id.toString() === id);
        
        if (match) {
            await convex.mutation(api.coupons.deleteCoupon, { code: match.code });
        }

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
    await requireAdmin();
    try {
        const dbCoupons = await convex.query(api.coupons.getAllCoupons);
        const match = dbCoupons.find(c => c._id.toString() === id);

        if (match) {
            await convex.mutation(api.coupons.upsertCoupon, {
                code: match.code,
                discountType: match.discountType,
                discountValue: match.discountValue,
                minOrderAmount: match.minOrderAmount,
                startDate: match.startDate,
                expiresAt: match.expiresAt,
                usageLimitTotal: match.usageLimitTotal,
                usageLimitPerUser: match.usageLimitPerUser,
                isActive: isActive
            });
        }

        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
