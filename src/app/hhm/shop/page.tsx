"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCartStore } from "@/store/cart";
import Link from "next/link";
import { toast } from "sonner";

export default function HHMShopPage() {
  const allProducts = useQuery(api.products.getProducts);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "furniture",
    "decor",
    "books",
    "donation",
  ]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const addItem = useCartStore((state) => state.addItem);

  // Filter HHM products
  const hhmProducts = allProducts
    ? allProducts.filter((p) => p.brand === "Hotel Hope")
    : [];

  const handleCategoryChange = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const filteredProducts = hhmProducts.filter((p) => {
    // Category Filter
    const catSlug = p.categories?.slug || "uncategorized";
    if (selectedCategories.length > 0 && !selectedCategories.includes(catSlug)) {
      return false;
    }

    // Price Filter
    const price = p.price;
    if (minPrice && price < parseFloat(minPrice)) return false;
    if (maxPrice && price > parseFloat(maxPrice)) return false;

    return true;
  });

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      name: product.title,
      slug: product.slug,
      price: product.price,
      image: product.imageUrls?.[0] || "",
      category: product.categories?.name || "Uncategorized",
    });

    toast.success(`${product.title} added to cart!`);
  };

  // Helper to get supports text based on product
  const getSupportText = (slug: string) => {
    if (slug.includes("sideboard")) return "Supports 2 Nights of Care";
    if (slug.includes("blanket") || slug.includes("lamp")) return "Supports 1 Night of Care";
    if (slug.includes("literature")) return "Supports Educational Play";
    if (slug.includes("basket")) return "Funds Community Meals";
    return "100% Direct Impact";
  };

  const getQuickImpactText = (slug: string) => {
    if (slug.includes("sideboard")) return "Buying this provides 2 weeks of diapers for our nursery.";
    if (slug.includes("blanket")) return "Buying this provides 5 nutritious meals for a toddler.";
    if (slug.includes("literature")) return "Buying this funds 1 hour of specialized early childhood education.";
    if (slug.includes("lamp")) return "Buying this helps maintain a safe, warm nursery environment.";
    if (slug.includes("basket")) return "Buying this provides warm nutritious porridge for a mother and child.";
    return "This donation goes 100% directly towards feeding and care programs.";
  };

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#6F4E37] mb-4">
            Curated for Change
          </h1>
          <p className="text-base md:text-lg text-[#564338]/90 max-w-2xl leading-relaxed">
            Every purchase from Hotel Hope Interiors breathes new life into beautiful items and supports our mission to provide safe, loving care for abandoned and surrendered infants.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-1/4 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10">
              <h2 className="font-serif text-xl font-bold text-[#332F2C] mb-6">
                Filters
              </h2>
              <div className="mb-8">
                <h3 className="text-xs font-bold text-[#6F4E37] mb-3 uppercase tracking-wider">
                  Category
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Furniture", slug: "furniture" },
                    { name: "Decor", slug: "decor" },
                    { name: "Books", slug: "books" },
                    { name: "Donation", slug: "donation" },
                  ].map((cat) => (
                    <label
                      key={cat.slug}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="form-checkbox h-4 w-4 text-[#E87D2E] border-[#897266] rounded focus:ring-[#E87D2E]"
                      />
                      <span className="text-sm font-medium text-[#332F2C] group-hover:text-[#E87D2E] transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#6F4E37] mb-3 uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors"
                  />
                  <span className="text-[#564338] text-xs">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Product Grid */}
          <div className="w-full md:w-3/4">
            {!allProducts ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E87D2E]"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-[#6F4E37]/10 p-6">
                <p className="text-lg font-bold text-[#6F4E37] mb-2">
                  No products found
                </p>
                <p className="text-sm text-[#564338]">
                  Try adjusting your filter settings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => {
                  const supportText = getSupportText(product.slug);
                  const impactText = getQuickImpactText(product.slug);
                  const imageUrl = product.imageUrls?.[0];

                  return (
                    <Link
                      key={product.id}
                      href={`/hhm/product/${product.slug}`}
                      className="group relative bg-white rounded-xl shadow-sm border border-[#6F4E37]/10 overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#f2dfd5] rounded-t-lg">
                        {imageUrl ? (
                          <img
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={imageUrl}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#f8e4da] text-[#E87D2E]">
                            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                              favorite
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#6F4E37]/20 flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[16px] text-[#E87D2E]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            favorite
                          </span>
                          <span className="font-semibold text-[10px] text-[#6F4E37] uppercase tracking-wider">
                            {supportText}
                          </span>
                        </div>

                        {/* Hover Impact Overlay */}
                        <div className="absolute inset-0 bg-[#6F4E37]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-20">
                          <span
                            className="material-symbols-outlined text-[40px] text-[#E87D2E] mb-2"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            volunteer_activism
                          </span>
                          <p className="font-serif text-[#FFF9F0] text-lg font-bold mb-1">
                            Quick Impact
                          </p>
                          <p className="text-xs text-[#FFF9F0]/90 leading-relaxed mb-6">
                            {impactText}
                          </p>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="bg-[#E87D2E] text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-white hover:text-[#E87D2E] transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="font-serif text-[#332F2C] text-lg font-bold leading-tight line-clamp-1">
                            {product.title}
                          </h3>
                          <span className="font-serif font-bold text-[#E87D2E] text-lg whitespace-nowrap">
                            R{product.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#564338] mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-2">
                          <span className="bg-[#f8e4da] text-[#6F4E37] px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            {product.categories?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
