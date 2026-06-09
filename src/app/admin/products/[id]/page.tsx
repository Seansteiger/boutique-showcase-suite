"use client";

export const dynamic = 'force-dynamic';

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { revalidateShop } from "@/app/actions/revalidate";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const product = useQuery(api.products.getProductById, { id });
    const updateProduct = useMutation(api.products.upsertProduct);

    const handleUpdate = async (values: any) => {
        try {
            await updateProduct({
                id: id,
                title: values.title,
                slug: values.slug,
                description: values.description,
                price: Number(values.price),
                salePrice: values.sale_price ? Number(values.sale_price) : undefined,
                stockQuantity: Number(values.stock_quantity),
                categoryId: values.category_id || undefined,
                imageUrls: values.image_urls || [],
                features: values.features || [],
                brand: values.brand || undefined,
                status: values.status,
                isFeatured: product?.isFeatured ?? false,
                variations: (values.variations || []).map((v: any) => ({
                    attributes: v.attributes.reduce((acc: any, curr: any) => {
                        if (curr.key) acc[curr.key] = curr.value;
                        return acc;
                    }, {}),
                    price: v.price ? Number(v.price) : undefined,
                    stockQuantity: Number(v.stock_quantity),
                    imageUrl: v.image_url || undefined
                }))
            });

            toast.success("Product updated successfully");
            
            // 3. Purge storefront cache
            await revalidateShop();

            router.push("/admin/products");
        } catch (error: any) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product: " + error.message);
        }
    };

    if (product === undefined) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    if (product === null) {
        toast.error("Product not found");
        router.push("/admin/products");
        return null;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <ProductForm initialData={product} onSubmit={handleUpdate} />
        </div>
    );
}
