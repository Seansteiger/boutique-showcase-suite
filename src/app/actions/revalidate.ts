"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidates the shop and home pages to ensure fresh data is served.
 */
export async function revalidateShop() {
    try {
        console.log("Revalidating shop paths and cache tags...");
        
        // 1. Revalidate Next.js Data Cache tags (with immediate expiration for Next.js 16)
        revalidateTag("products", { expire: 0 });
        revalidateTag("categories", { expire: 0 });
        revalidateTag("ads", { expire: 0 });

        // 2. Revalidate Router paths
        revalidatePath("/shop");
        revalidatePath("/");
        revalidatePath("/shop/[slug]", "page");
        
        console.log("Revalidation successful");
        return { success: true };
    } catch (error) {
        console.error("Revalidation failed:", error);
        return { success: false, error };
    }
}
