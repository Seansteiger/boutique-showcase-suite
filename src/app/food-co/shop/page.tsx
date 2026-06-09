import { getProducts } from "@/lib/products";
import Link from "next/link";
import { AddToCartButton } from "../AddToCartButton";

export const revalidate = 60;

export default async function FoodCoShopPage() {
  const allProducts = await getProducts();

  const keywords = ["pan", "pot", "liquid", "tissue", "kettle", "coffee", "maker"];
  const foodProducts = allProducts.filter(p =>
    keywords.some(k => p.name.toLowerCase().includes(k)) ||
    p.categorySlug === "kitchenware" ||
    p.categorySlug === "hygiene"
  );

  const displayProducts = foodProducts.length > 0 ? foodProducts : allProducts;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#f9f9f9]">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7D8C7C]">Gourmet Selection</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">The Culinary Catalog</h1>
        <div className="w-12 h-[2px] bg-[#7D8C7C] mx-auto mt-4" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayProducts.map((product) => (
          <div key={product.id} className="group flex flex-col justify-between space-y-4 bg-white p-6 border border-black/5 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300">
            <Link href={`/food-co/product/${product.slug}`} className="block overflow-hidden relative aspect-square bg-[#efeded] rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover h-full w-full transform transition-transform duration-750 group-hover:scale-103"
              />
              <span className="absolute top-3 left-3 bg-[#7D8C7C] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                Organic
              </span>
            </Link>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                {product.category}
              </span>
              <Link href={`/food-co/product/${product.slug}`}>
                <h3 className="font-serif text-base font-bold hover:text-[#7D8C7C] transition-colors leading-tight line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1A1A1A]">
                  R{product.salePrice ?? product.price}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-[#1A1A1A]/40 line-through">
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
