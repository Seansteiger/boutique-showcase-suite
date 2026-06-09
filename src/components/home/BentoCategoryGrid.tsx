"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import Image from "next/image";
import { Category } from "@/types/database";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils";

interface BentoCategoryGridProps {
  categories: Category[];
}

const FALLBACK_IMAGES: Record<string, string> = {
  "les-parfums": "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800",
  "bougies": "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800",
  "huiles": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600",
  "brumes": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600"
};

export function BentoCategoryGrid({ categories }: BentoCategoryGridProps) {
  const settings = useStoreSettings();
  const brandName = settings?.brandName || "SCENTED";
  const brandKey = brandName.toLowerCase();

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.slug === "les-parfums") return -1;
    if (b.slug === "les-parfums") return 1;
    return 0;
  });

  const cardRadiusClass = settings?.theme?.cardStyle === "sharp"
      ? "rounded-none"
      : settings?.theme?.cardStyle === "pill"
          ? "rounded-[2.5rem]"
          : settings?.theme?.cardStyle === "curved"
              ? "rounded-2xl"
              : "rounded-[2.5rem_0.5rem_2.5rem_0.5rem]";

  // 1. SLATE & CO (TECH MINIMALIST CATEGORY GRID)
  if (brandKey.includes("slate")) {
    return (
      <section className="container px-6 py-12 mx-auto font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="space-y-1">
            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-accent">Gear Index</span>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-primary">Browse Modules</h2>
          </div>
          <Link href="/shop" className="text-[10px] font-bold tracking-widest uppercase text-accent flex items-center hover:opacity-80 transition-opacity">
            Full Index <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sortedCategories.slice(0, 4).map((category) => {
            const image = category.image_url || (category as any).image || FALLBACK_IMAGES[category.slug] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
            return (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group flex flex-col gap-3">
                <div className={cn("aspect-square w-full overflow-hidden border border-border/10 bg-secondary/15 relative transition-all duration-300 group-hover:border-accent/40", cardRadiusClass)}>
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-103"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="space-y-0.5 px-1 font-sans">
                  <h3 className="text-[10px] font-bold uppercase tracking-wide text-foreground">{category.name}</h3>
                  <p className="text-[9px] text-muted-foreground font-mono">SPECIFIED MODULE // SELECT</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // 2. L'ARTELIER (STARK BLACK-WHITE EDITORIAL GRID)
  if (brandKey.includes("artelier") || brandKey.includes("editorial")) {
    return (
      <section className="container px-6 py-16 mx-auto font-serif text-black bg-white border-t border-black">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">01 / CATEGORIES</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-black mt-1">THE COLLECTION INDEX</h2>
          </div>
          <Link href="/shop" className="text-[10px] font-bold tracking-[0.25em] uppercase text-black hover:underline underline-offset-4 decoration-2">
            EXPLORE ALL <ArrowRight className="inline-block ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t-2 border-l-2 border-black">
          {sortedCategories.slice(0, 4).map((category, index) => {
            const image = category.image_url || (category as any).image || FALLBACK_IMAGES[category.slug] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
            return (
              <Link 
                key={category.id} 
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden aspect-[3/4] bg-white border-r-2 border-b-2 border-black flex flex-col justify-between p-6 rounded-none transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover filter grayscale contrast-125"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="z-20 flex justify-between items-start font-sans font-bold text-xs text-black group-hover:text-white transition-colors duration-300">
                  <span>0{index + 1}.</span>
                  <span className="text-[9px] uppercase tracking-widest bg-zinc-100 group-hover:bg-transparent border border-black group-hover:border-white px-2 py-0.5">CAT</span>
                </div>

                <div className="z-20 space-y-2 mt-auto">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-black group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 font-sans font-bold text-[9px] tracking-widest uppercase text-accent group-hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                    ENTER ARCHIVE <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // 3. OASIS CO (WARM EARTH POTTERY GRID)
  if (brandKey.includes("oasis") || brandKey.includes("sandstone")) {
    return (
      <section className="container px-6 py-12 mx-auto font-serif">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D97706]">Clayware & Textiles</span>
          <h2 className="text-3xl font-light text-[#402014] uppercase tracking-wide">Artisanal Pockets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedCategories.slice(0, 4).map((category) => {
            const image = category.image_url || (category as any).image || FALLBACK_IMAGES[category.slug] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
            return (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group flex flex-col gap-4 text-center">
                <div className="aspect-[4/3] w-full overflow-hidden bg-white border border-[#402014]/10 rounded-[2rem] relative shadow-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#402014]/35 to-transparent" />
                </div>
                <div>
                  <h3 className="text-lg font-light text-[#402014] uppercase tracking-wide">{category.name}</h3>
                  <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-[#D97706] hover:underline">Explore Pottery</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // 4. OCEAN MIST (COASTAL CAPSULE SWIPER)
  if (brandKey.includes("ocean") || brandKey.includes("mist")) {
    return (
      <section className="container px-6 py-12 mx-auto font-sans">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-cyan-600 text-[9px] font-bold uppercase tracking-widest">
              <Compass className="h-3 w-3 animate-spin-slow" /> Active Wellness
            </span>
            <h2 className="text-2xl font-black text-cyan-950 uppercase tracking-tight">Active Hubs</h2>
          </div>
          <Link href="/shop" className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#14B8A6] flex items-center hover:opacity-80 transition-opacity">
            All Cabinets <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sortedCategories.slice(0, 4).map((category) => {
            const image = category.image_url || (category as any).image || FALLBACK_IMAGES[category.slug] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";
            return (
              <Link 
                key={category.id} 
                href={`/shop?category=${category.slug}`} 
                className="group flex flex-col items-center text-center gap-3"
              >
                <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-white/60 bg-white shadow-md transition-all duration-500 group-hover:border-[#14B8A6] group-hover:shadow-cyan-100 group-hover:shadow-lg">
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover p-2 rounded-full"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-cyan-950/5 rounded-full" />
                </div>
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-950 mt-1">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // 5. DEFAULT: SCENTED (ASYMMETRIC BENTO GRID)
  return (
    <section className="container px-6 py-12 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Bespoke Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-light tracking-[0.1em] uppercase text-foreground">
            SENSORY DEPARTMENTS
          </h2>
        </div>
        <Link 
          href="/shop" 
          className="text-xs font-semibold tracking-[0.2em] uppercase text-accent flex items-center hover:opacity-80 transition-opacity"
        >
          View All Collections <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[620px]">
        {sortedCategories.slice(0, 4).map((category, index) => {
          let gridSpan = "";
          if (index === 0) gridSpan = "md:col-span-2 md:row-span-2 h-[350px] md:h-auto";
          else if (index === 1) gridSpan = "md:col-span-2 md:row-span-1 h-[240px] md:h-auto";
          else gridSpan = "md:col-span-1 md:row-span-1 h-[240px] md:h-auto";

          const image = category.image_url || (category as any).image || FALLBACK_IMAGES[category.slug] || "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600";

          return (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className={`group relative overflow-hidden bg-secondary/10 flex flex-col justify-end border border-border/10 ${cardRadiusClass} ${gridSpan} transition-all duration-500 hover:shadow-xl ambient-glow`}
            >
              <div className="absolute inset-0 transition-transform duration-[1.5s] ease-out group-hover:scale-105">
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-85 z-10 transition-opacity" />

              <div className="absolute inset-x-3 bottom-3 p-4 md:p-5 z-20 backdrop-blur-xl bg-background/90 dark:bg-black/85 border border-border/10 rounded-[1.5rem_0.35rem_1.5rem_0.35rem] flex items-center justify-between transition-all duration-500 group-hover:-translate-y-1">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-serif font-medium text-primary tracking-wide uppercase capitalize">
                    {category.name}
                  </h3>
                  <p className="text-[9px] font-sans tracking-[0.2em] text-accent uppercase font-semibold opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore Collection
                  </p>
                </div>
                <div className="h-8 w-8 rounded-none border border-accent bg-accent/10 flex items-center justify-center opacity-0 transform translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
