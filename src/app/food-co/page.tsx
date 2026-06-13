import { getProducts } from "@/lib/products";
import Link from "next/link";
import { MoveRight, Sprout, Award, HelpCircle } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

export const revalidate = 60;

export default async function FoodCoPage() {
  const allProducts = await getProducts();

  // Filter products belonging to the Food.co brand
  const foodProducts = allProducts.filter(p => p.brand === "Food.co");

  const displayProducts = foodProducts.length > 0 ? foodProducts : allProducts.slice(0, 4);

  return (
    <div className="flex flex-col space-y-28 pb-28 bg-[#f9f9f9]">
      {/* Gourmet Food.co Hero Section */}
      <section className="relative h-[85vh] flex items-center bg-[#1c1b1b] text-white overflow-hidden rounded-b-[2rem] shadow-md">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-102"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1800&auto=format&fit=crop')` }}
        />

        <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 bg-[#7D8C7C]/30 text-[#bbcbb9] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-sm">
              <Sprout className="h-4.5 w-4.5" /> Gourmet Sourcing
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Honest food. <br />
              <span className="font-light italic text-[#bbcbb9]">Artisanal</span> craft.
            </h1>
            <p className="font-sans text-sm md:text-base leading-relaxed text-white/80 max-w-md">
              Fresh organic pantry essentials and premium kitchenware designed to turn daily meals into celebrated rituals.
            </p>
            <div className="pt-4 flex gap-4">
              <Link
                href="/food-co/shop"
                className="bg-[#7D8C7C] text-white hover:bg-[#c5a059] transition-all px-8 py-4 uppercase text-[10px] font-semibold tracking-widest flex items-center gap-2 rounded-lg"
              >
                Shop Collection <MoveRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Metrics Grid */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white p-8 border border-black/5 rounded-[1.5rem] shadow-sm">
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-[#7D8C7C]">100%</h3>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Traceable Ingredients</span>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
              We catalog every partner farm and small artisanal co-op transparently.
            </p>
          </div>
          <div className="space-y-2 border-y md:border-y-0 md:border-x border-black/10 py-6 md:py-0">
            <h3 className="font-serif text-3xl font-bold text-[#7D8C7C]">Local</h3>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Artisanal Sourcing</span>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
              Supporting local agrarian families to foster regional community wellness.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-[#7D8C7C]">Zero</h3>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Chemical Preservatives</span>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-light">
              Delivering unadulterated products exactly as nature intended them.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Collection */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/10 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7D8C7C]">Organic Offerings</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A]">Curated Kitchen & Pantry</h2>
          </div>
          <Link
            href="/food-co/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#7D8C7C] hover:text-[#c5a059] transition-colors flex items-center gap-1.5 mt-2"
          >
            Explore Catalog <MoveRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <div key={product.id} className="group flex flex-col justify-between space-y-4 bg-white p-6 border border-black/5 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300">
              <Link href={`/food-co/product/${product.slug}`} className="block overflow-hidden relative aspect-square bg-[#efeded] rounded-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover h-full w-full transform transition-transform duration-700 group-hover:scale-103"
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
                  <h3 className="font-serif text-lg font-bold hover:text-[#7D8C7C] transition-colors leading-tight line-clamp-1">
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
      </section>

      {/* Culinary Kitchen Backdrop section */}
      <section className="bg-white py-24 border-y border-black/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-black/5 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1200&auto=format&fit=crop"
              alt="Fresh organic layout"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7D8C7C]">Bespoke Craft</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">Artisanal Culinary Equipment.</h2>
            <p className="text-xs md:text-sm text-[#1A1A1A]/80 leading-relaxed font-light">
              From marble coated frying pans to cast iron cookware, we source kitchenware that maximizes nutritional preservation and heat distribution. Combined with our unbleached packaging tissue, we ensure your kitchen remains healthy, natural, and beautiful.
            </p>
            <div className="pt-4 border-t border-black/10 flex items-center gap-4">
              <div className="p-3 bg-[#7D8C7C]/10 text-[#7D8C7C] rounded-full">
                <Award className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold tracking-wider text-[#1A1A1A]/80">Award Winning Sustainable Agricultural Sourcing</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
