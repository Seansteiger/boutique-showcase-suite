import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q');

    if (!rawQuery || rawQuery.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const query = rawQuery.trim().slice(0, 100);

    try {
        const products = await convex.query(api.products.getAllProducts, {
            status: 'published',
            search: query
        });

        // Limit to 8 results
        const results = products.slice(0, 8).map((p: any) => {
            let displayPrice = p.price;
            let salePrice: number | null = p.salePrice ?? null;

            if (p.product_variations && p.product_variations.length > 0) {
                const prices = p.product_variations
                    .map((v: any) => v.price)
                    .filter((price: number | null) => price !== null && price !== undefined);

                if (prices.length > 0) {
                    const cheapest = Math.min(...prices);
                    if (!salePrice && cheapest < p.price) {
                        salePrice = cheapest;
                        displayPrice = p.price;
                    }
                }
            }

            return {
                id: p.id,
                name: p.title,
                slug: p.slug,
                image: (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : null,
                price: displayPrice,
                salePrice: salePrice,
                category: p.categories?.name || 'Uncategorized'
            };
        });

        return NextResponse.json({ results });
    } catch (e: any) {
        console.error("Search API Error:", e);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}

