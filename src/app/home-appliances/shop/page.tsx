import { getProducts, getCategories } from "@/lib/products";
import Link from "next/link";
import { AddToCartButton } from "../AddToCartButton";

export const revalidate = 60;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // Filter products belonging to the Home. brand
  const appliances = products.filter(p => p.brand === "Home.");
  
  const displayProducts = appliances.length > 0 ? appliances : products;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">Collection Catalog</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">The Culinary Suite</h1>
        <div className="w-12 h-[2px] bg-[#d4af37] mx-auto mt-4" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {displayProducts.map((product) => (
          <div key={product.id} className="group flex flex-col justify-between space-y-4 bg-white p-6 border border-[#e5e2e1]/40 rounded-[8px] transition-all duration-300 hover:shadow-xl">
            <Link href={`/home-appliances/product/${product.slug}`} className="block overflow-hidden relative aspect-square bg-[#efeded] rounded-[4px]">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover h-full w-full transform transition-transform duration-700 group-hover:scale-105"
              />
            </Link>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                {product.category}
              </span>
              <Link href={`/home-appliances/product/${product.slug}`}>
                <h3 className="font-serif text-base font-semibold hover:text-[#d4af37] transition-colors leading-tight line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1b1c1c]">
                  R{product.salePrice ?? product.price}
                </span>
                {product.salePrice && (
                  <span className="text-xs text-[#1b1c1c]/50 line-through">
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
