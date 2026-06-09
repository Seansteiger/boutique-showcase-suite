import { getProducts } from "@/lib/products";
import Link from "next/link";
import { AddToCartButton } from "../AddToCartButton";

export const revalidate = 60;

export default async function FurnishShopPage() {
  const allProducts = await getProducts();

  const keywords = ["sofa", "rug", "cushion", "lamp", "notebook", "tote"];
  const furnishProducts = allProducts.filter(p =>
    keywords.some(k => p.name.toLowerCase().includes(k)) ||
    p.categorySlug === "room-decor" || 
    p.categorySlug === "lifestyle"
  );

  const displayProducts = furnishProducts.length > 0 ? furnishProducts : allProducts;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#F9F7F2]">
      {/* Catalog Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">Showroom List</span>
        <h1 className="font-serif text-4xl font-normal uppercase tracking-tight">The Furniture Collection</h1>
        <div className="w-12 h-[1px] bg-[#121212] mx-auto mt-4" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayProducts.map((product) => (
          <div key={product.id} className="group flex flex-col justify-between space-y-4 bg-white p-6 border border-[#121212]/10 rounded-none transition-all duration-300 hover:shadow-xl">
            <Link href={`/furnish/product/${product.slug}`} className="block overflow-hidden relative aspect-square bg-[#efeded] rounded-none">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover h-full w-full transform transition-transform duration-750 group-hover:scale-103"
              />
            </Link>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a4a4a]">
                {product.category}
              </span>
              <Link href={`/furnish/product/${product.slug}`}>
                <h3 className="font-serif text-base font-normal hover:text-[#d4af37] transition-colors leading-tight line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#121212]">
                  R{product.salePrice ?? product.price}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-[#121212]/40 line-through">
                    R{product.price}
                  </span>
                )}
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
