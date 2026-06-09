"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { revalidateShop } from "@/app/actions/revalidate";

export default function NewProductPage() {
    const router = useRouter();
    const upsertProduct = useMutation(api.products.upsertProduct);

    const handleSubmit = async (data: any) => {
        try {
            // Call Convex Atomic mutation
            await upsertProduct({
                title: data.title,
                slug: data.slug,
                description: data.description,
                price: Number(data.price),
                salePrice: data.sale_price ? Number(data.sale_price) : undefined,
                stockQuantity: Number(data.stock_quantity),
                categoryId: data.category_id || undefined,
                features: data.features || [],
                brand: data.brand || undefined,
                imageUrls: data.image_urls,
                status: data.status,
                isFeatured: false,
                variations: (data.variations || []).map((v: any) => ({
                    attributes: v.attributes.reduce((acc: any, curr: any) => {
                        if (curr.key) acc[curr.key] = curr.value;
                        return acc;
                    }, {}),
                    price: v.price ? Number(v.price) : undefined,
                    stockQuantity: Number(v.stock_quantity),
                    imageUrl: v.image_url || undefined
                }))
            });

            alert("Product created successfully!");
            
            // 3. Purge storefront cache
            await revalidateShop();

            router.push("/admin/products");
            router.refresh();

        } catch (error: any) {
            console.error("Error creating product:", error);
            alert("Failed: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
            </div>

            <div className="border p-6 rounded-lg bg-card">
                <ProductForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
