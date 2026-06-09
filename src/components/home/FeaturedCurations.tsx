"use client";

import { ProductCard } from "../ProductCard";
import { ArrowRight, Compass, Cpu } from "lucide-react";
import Link from "next/link";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils";

interface FeaturedCurationsProps {
  initialProducts: any[];
}

export function FeaturedCurations({ initialProducts }: FeaturedCurationsProps) {
  const settings = useStoreSettings();
  const brandName = settings?.brandName || "SCENTED";
  const brandKey = brandName.toLowerCase();

  if (!initialProducts || initialProducts.length === 0) return null;

  const productsList = initialProducts.slice(0, 4).map((product) => ({
    id: product.id || product._id?.toString(),
    name: product.title || product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    category: product.category || (product.categories?.name) || "Les Parfums",
    image: product.image || (product.imageUrls?.[0]) || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
    brand: product.brand || brandName,
    stock: product.stock !== undefined ? product.stock : (product.stockQuantity !== undefined ? product.stockQuantity : 10),
  }));

  // 1. SLATE & CO (TECH MINIMALIST 4-COLUMN SYMMETRIC ROW)
  if (brandKey.includes("slate")) {
    return (
      <section className="container px-6 py-16 mx-auto border-t border-border/10 font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-accent flex items-center gap-1.5">
              <Cpu className="h-3 w-3" /> Technical Inventory // In-Stock
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-primary">
              SPECIFICATION CURATIONS
            </h2>
            <p className="text-xs text-muted-foreground font-light max-w-md">Precision engineering meets aesthetic utility. Refined modular hardware components.</p>
          </div>
          <Link 
            href="/shop" 
            className="text-[10px] font-bold tracking-widest uppercase text-accent flex items-center hover:opacity-85 transition-opacity"
          >
            Browse Registry <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productsList.map((product) => (
            <div key={product.id} className="border border-border/10 p-2 bg-secondary/5 rounded-xl">
              <ProductCard 
                product={product} 
                showSaleBadge={true}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 2. L'ARTELIER (STARK BOLD MONOCHROME COLUMN INDEX)
  if (brandKey.includes("artelier") || brandKey.includes("editorial")) {
    return (
      <section className="container px-6 py-20 mx-auto border-t-2 border-black bg-white text-black font-serif">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0 border-b-2 border-black pb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
              03 / FEATURED PIECES
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-black mt-2">
              THE EDITORIAL INDEX
            </h2>
            <p className="font-sans text-xs font-light text-zinc-500 max-w-md mt-2">Stark monochrome lookbook frames showcasing clean zero-radius boutique craftsmanship.</p>
          </div>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase border-2 border-black hover:bg-transparent hover:text-black transition-colors rounded-none"
          >
            VIEW CATALOGUE <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 border-l-2 border-t-2 border-black">
          {productsList.map((product) => (
            <div key={product.id} className="border-r-2 border-b-2 border-black p-4 rounded-none bg-white">
              <ProductCard 
                product={product} 
                showSaleBadge={true}
                className="rounded-none shadow-none border-none hover:shadow-none hover:translate-y-0"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 3. OASIS CO (WARM CENTERED ARTISANAL CELLS)
  if (brandKey.includes("oasis") || brandKey.includes("sandstone")) {
    return (
      <section className="container px-6 py-16 md:py-24 mx-auto border-t border-orange-200/20 font-serif text-center">
        <div className="max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D97706]">
            Fired Clay & Textiles
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#402014] uppercase tracking-wide">
            THE CLAYROOM EDIT
          </h2>
          <p className="font-sans text-xs font-light text-[#5c3e35] max-w-md mx-auto leading-relaxed">
            Formed organically by hand, dried under the warm midday sun. Earthy finishes for the modern sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {productsList.map((product) => (
            <div key={product.id} className="bg-white border border-[#402014]/5 rounded-[2rem] p-3 shadow-md shadow-[#402014]/5 hover:shadow-lg transition-all duration-300">
              <ProductCard 
                product={product} 
                showSaleBadge={true}
              />
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2.5 px-10 py-4.5 bg-[#402014] text-[#FAF8F5] hover:bg-[#D97706] text-[10px] font-bold tracking-widest uppercase transition-colors rounded-full shadow-lg shadow-[#402014]/10"
          >
            Explore Workshop <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  // 4. OCEAN MIST (COASTAL WELLNESS HORIZONTAL SCROLLER)
  if (brandKey.includes("ocean") || brandKey.includes("mist")) {
    return (
      <section className="container px-6 py-16 mx-auto border-t border-blue-100/30 font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-cyan-600 text-[9px] font-bold uppercase tracking-widest bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full">
              <Compass className="h-3 w-3 animate-spin-slow" /> Active Restorative Hydration
            </span>
            <h2 className="text-3xl font-black text-cyan-950 uppercase tracking-tight">
              THE HYDROLINEUP
            </h2>
            <p className="text-xs text-cyan-800/80 font-light max-w-sm">Rejuvenating coastal wellness capsules formulated for active bodies and clear minds.</p>
          </div>
          <Link 
            href="/shop" 
            className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#14B8A6] flex items-center hover:opacity-80 transition-opacity"
          >
            All Formulations <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Horizontal scroll, desktop flex row */}
        <div className="flex gap-6 overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
          {productsList.map((product) => (
            <div key={product.id} className="min-w-[280px] md:min-w-0 bg-white/40 backdrop-blur-md border border-white/60 p-3 rounded-[2.5rem] shadow-xl hover:shadow-cyan-50 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
              <ProductCard 
                product={product} 
                showSaleBadge={true}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 5. DEFAULT: SCENTED (LUXURY ASYMMETRIC STAGGER)
  return (
    <section className="container px-6 py-16 md:py-24 mx-auto border-t border-border/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
        <div className="space-y-2 font-sans">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-accent block">
            Hand-Selected Fragrances
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-primary leading-tight">
            THE FIBONACCI COLLECTION
          </h2>
          <p className="text-sm font-sans font-light text-muted-foreground">A sequence of perfectly balanced olfactory experiences.</p>
        </div>
        <Link 
          href="/shop" 
          className="text-xs font-semibold tracking-[0.2em] uppercase text-accent flex items-center hover:opacity-80 transition-opacity"
        >
          Explore All <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-16">
        {productsList.map((product, index) => {
          // Asymmetric Stagger: Shift odd cards down on desktop viewports
          const staggerClass = index % 2 === 1 ? "md:translate-y-12" : "";

          return (
            <div key={product.id} className={staggerClass}>
              <ProductCard 
                product={product} 
                showSaleBadge={true}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
