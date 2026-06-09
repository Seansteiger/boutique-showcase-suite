import { getProducts, getCategories } from "@/lib/products";
import { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShopClient } from "@/components/shop/ShopClient";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 60; // Refresh cache every 60 seconds

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export async function generateMetadata(): Promise<Metadata> {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    let brandName = "White-Label Store";
    try {
        if (convexUrl && convexUrl.startsWith("http")) {
            const convexHttp = new ConvexHttpClient(convexUrl);
            const settings = await convexHttp.query(api.settings.get);
            if (settings) {
                brandName = settings.brandName;
            }
        }
    } catch (e) {}

    return {
        title: `Shop All | ${brandName}`,
        description: `Browse our full range of curated premium products. Handcrafted scented candles, therapeutic oils, mists, and luxury fragrances at ${brandName}.`,
        keywords: ["luxury fragrances", "scents", "handcrafted candles", "aromatherapy", "premium lifestyle"]
    };
}

export default async function ShopPage() {
    // Fetch all products exactly ONCE during build-time
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
    ]);

    // Keep only fragrance/ritual products for the SCENTED store registry
    const scentProducts = products.filter(p => p.brand === "SCENTED");

    return (
        <div className="container mx-auto px-4 py-8 md:px-6">
            <Breadcrumbs className="mb-6" />
            <Suspense fallback={<div className="h-[60vh] flex flex-col items-center justify-center space-y-4"><Skeleton className="w-[80vw] h-8 max-w-lg mb-8" /><Skeleton className="w-[80vw] h-[40vh] rounded-2xl" /></div>}>
                <ShopClient initialProducts={scentProducts} categories={categories} />
            </Suspense>
        </div>
    );
}
