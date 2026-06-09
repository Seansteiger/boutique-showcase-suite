"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShopClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const categoryFilter = searchParams.get("category");
    const subcategoryFilter = searchParams.get("subcategory");
    const searchQuery = searchParams.get("search");

    let filteredProducts = initialProducts;

    // Get current category and its subcategories
    const currentCategory = categoryFilter 
        ? categories.find(c => c.slug === categoryFilter)
        : null;
    
    const subcategories = currentCategory 
        ? categories.filter(c => c.parent_id === currentCategory.id)
        : [];

    // Apply category and subcategory filters
    if (subcategoryFilter) {
        // If a specific subcategory is selected, show ONLY products in that exact subcategory
        filteredProducts = filteredProducts.filter(p => p.categorySlug === subcategoryFilter);
    } else if (categoryFilter) {
        // If only a main category is selected, show products mapped to it OR any of its subcategories
        const validSlugs = [categoryFilter, ...subcategories.map(s => s.slug)];
        filteredProducts = filteredProducts.filter(p => validSlugs.includes(p.categorySlug));
    }

    // Search by name, description, OR brand
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            (p.brand && p.brand.toLowerCase().includes(query))
        );
    }

    // Sort alphabetically by product name (A-Z)
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));

    const toggleSubcategory = (slug: string) => {
        const params = new URLSearchParams(searchParams);
        if (subcategoryFilter === slug) {
            params.delete("subcategory");
        } else {
            params.set("subcategory", slug);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 capitalize">
                        {searchQuery ? `Search: "${searchQuery}"` : (categoryFilter ? `${categoryFilter.replace(/-/g, ' ')}` : 'All Products')}
                    </h1>
                    <p className="text-muted-foreground">Found {filteredProducts.length} items</p>
                </div>
            </div>

            {/* Subcategory Filter Chips */}
            {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 py-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
                    {subcategories.map((sub) => (
                        <button
                            key={sub.id}
                            onClick={() => toggleSubcategory(sub.slug)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                                subcategoryFilter === sub.slug
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "bg-secondary/20 hover:bg-secondary/40 text-muted-foreground border-transparent"
                            )}
                        >
                            {sub.name}
                            {subcategoryFilter === sub.slug && (
                                <X className="ml-2 h-3 w-3 inline-block" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index < 8} showSaleBadge={true} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground bg-secondary/5 rounded-xl border border-dashed">
                    No products found matching the selected filters.
                </div>
            )}
        </div>
    );
}
