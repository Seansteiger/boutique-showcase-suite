import { getProducts } from "@/lib/products";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

export const revalidate = 60;

export default async function FurnishPage() {
  const allProducts = await getProducts();

  // Filter products belonging to the Furnish. brand
  const furnishProducts = allProducts.filter(p => p.brand === "Furnish.");

  const displayProducts = furnishProducts.length > 0 ? furnishProducts : allProducts.slice(0, 4);

  return (
    <div className="flex flex-col space-y-32 pb-32 bg-[#F9F7F2]">
      {/* Quiet Opulence Hero - Asymmetric grid spread */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              Quiet Opulence
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#121212] leading-[1.05]">
              Form is <br />
              <span className="italic font-normal">Materiality.</span>
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#4a4a4a] max-w-sm leading-relaxed">
              Curated architectural furniture designed for the discerning collector. Timeless works of oak, cast stone, and hand-woven boucle.
            </p>
            <div className="pt-4">
              <Link
                href="/furnish/shop"
                className="inline-block bg-[#121212] text-white hover:bg-[#d4af37] transition-all px-8 py-4 uppercase text-[10px] font-black tracking-widest rounded-none border border-[#121212]"
              >
                Browse Collection
              </Link>
            </div>
          </div>
          
          {/* Asymmetrical Double Image Grid */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-5 aspect-[3/4] overflow-hidden bg-[#efeded] border border-[#121212]/10 rounded-none shadow-md">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop"
                alt="Minimal Chair"
                className="object-cover h-full w-full"
              />
            </div>
            <div className="col-span-7 aspect-square overflow-hidden bg-[#efeded] border border-[#121212]/10 rounded-none shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1200&auto=format&fit=crop"
                alt="Sleek Modern Lounge Setup"
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Gallery Philosophy - Wide negative space text */}
      <section className="bg-[#121212] text-[#F9F7F2] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#d4af37]">First Principles</span>
          <p className="font-serif text-2xl md:text-4xl font-light italic leading-relaxed">
            "We do not decorate. We architecturalize. True luxury resides in the invisible weight of custom craftsmanship, clean edges, and negative space."
          </p>
          <div className="w-8 h-[1px] bg-[#d4af37] mx-auto pt-2" />
        </div>
      </section>

      {/* Showroom Catalog Grid */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#121212]/10 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">Collection Showcase</span>
            <h2 className="font-serif text-3xl font-normal text-[#121212]">The Collection</h2>
          </div>
          <Link
            href="/furnish/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#121212] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 mt-2"
          >
            Show All Works <MoveRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayProducts.map((product) => (
            <div key={product.id} className="group flex flex-col justify-between space-y-4 rounded-none bg-white p-6 border border-[#121212]/10 hover:shadow-xl transition-all duration-300">
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
                  <h3 className="font-serif text-lg font-normal hover:text-[#d4af37] transition-colors leading-tight line-clamp-1">
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
      </section>

      {/* Crafted Showcase */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 aspect-[16/10] overflow-hidden border border-[#121212]/10 rounded-none shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
            alt="Interior design showcase"
            className="object-cover h-full w-full"
          />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">Showroom Tour</span>
          <h3 className="font-serif text-3xl font-normal leading-tight">Visit the Gallery</h3>
          <p className="text-xs text-[#4a4a4a] leading-relaxed">
            Our physical showrooms are curated environments where sunlight and materials interact. We welcome private viewings to experience the texture of our boucle weaves and the grain of our hand-finished solid oak.
          </p>
          <div className="pt-4">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-[#121212]/50">Hours</span>
            <span className="block text-xs font-semibold mt-1">Monday – Saturday, by appointment only.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
