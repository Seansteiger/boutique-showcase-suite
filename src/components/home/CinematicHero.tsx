"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Check, Compass, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Button } from "@/components/ui/button";

export function CinematicHero() {
  const settings = useStoreSettings();
  const brandName = settings?.brandName || "SCENTED";
  const brandKey = brandName.toLowerCase();

  const heroTitle = settings?.customTexts?.heroTitle || "Atmospheric Elegance.";
  const heroSubtitle = settings?.customTexts?.heroSubtitle || "Discover products designed with the precision of nature.";
  const heroCtaText = settings?.customTexts?.heroCtaText || "Explore Collection";

  const btnRadiusClass = settings?.theme?.buttonRadius === "0px"
      ? "rounded-none"
      : settings?.theme?.buttonRadius === "4px"
          ? "rounded-sm"
          : settings?.theme?.buttonRadius === "8px"
              ? "rounded-lg"
              : settings?.theme?.buttonRadius === "9999px"
                  ? "rounded-full"
                  : "rounded-[2rem_0.5rem_2rem_0.5rem]";

  const cardRadiusClass = settings?.theme?.cardStyle === "sharp"
      ? "rounded-none"
      : settings?.theme?.cardStyle === "pill"
          ? "rounded-[2.5rem]"
          : settings?.theme?.cardStyle === "curved"
              ? "rounded-2xl"
              : "rounded-[3rem_1rem_3rem_1rem]";

  // Magnetic Button Hooks
  const buttonRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set((clientX - centerX) * 0.35);
    mouseY.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 1. SLATE & CO (TECH MINIMALIST HERO)
  if (brandKey.includes("slate")) {
    return (
      <section className="relative w-full py-16 md:py-28 bg-background border-b border-border/10 font-sans">
        <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Tech Details */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                <Cpu className="h-3 w-3" /> Core Carry Architecture
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-primary leading-none">
                {heroTitle}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed font-light">
                {heroSubtitle}
              </p>
            </div>

            {/* Specifications Box */}
            <div className="grid grid-cols-2 gap-4 border border-border/10 p-4 rounded-xl bg-secondary/10">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Construction</span>
                <p className="text-[10px] text-foreground font-semibold">Anodized Space-grade Alloy</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Efficiency</span>
                <p className="text-[10px] text-foreground font-semibold">Optimized modular segments</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Weight Yield</span>
                <p className="text-[10px] text-foreground font-semibold">Ultra-lightweight pack structure</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-accent uppercase tracking-widest">Protection</span>
                <p className="text-[10px] text-foreground font-semibold">IP67 Waterproof seal limits</p>
              </div>
            </div>

            <Button asChild className={cn("px-8 py-5 text-[10px] font-bold uppercase tracking-widest bg-primary text-secondary hover:bg-accent border border-primary transition-all", btnRadiusClass)}>
              <Link href="/shop" className="flex items-center gap-2">
                {heroCtaText} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Right Column: Spec Card */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className={cn("relative overflow-hidden aspect-square w-full max-w-md bg-secondary/25 border border-border/10 p-6 flex flex-col justify-between shadow-lg", cardRadiusClass)}>
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="flex justify-between items-start z-10">
                <span className="text-[9px] font-bold tracking-widest text-primary border border-primary/20 px-2 py-0.5 rounded">SLATE SPEC // v1.8</span>
                <span className="text-[9px] font-bold text-accent">ACTIVE</span>
              </div>
              <div className="relative aspect-[4/3] w-full z-10 my-4 rounded-lg overflow-hidden border border-border/10">
                <img
                  src="https://images.unsplash.com/photo-1555532538-dcdbd01d373d?q=80&w=800"
                  alt="Slate Specs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center z-10 text-[9px] text-muted-foreground border-t border-border/10 pt-2 font-mono">
                <span>LATITUDE: 26.1076° S</span>
                <span>SYSTEM STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. L'ARTELIER (STARK EDITORIAL MONOCHROME HERO)
  if (brandKey.includes("artelier") || brandKey.includes("editorial")) {
    return (
      <section className="relative w-full py-16 md:py-32 bg-white text-black border-b-2 border-black font-serif">
        <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Bold Text */}
          <div className="space-y-10 order-2 md:order-1 border-l-2 border-black pl-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block">L&apos;ARTELIER ARCHIVES</span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-black">
                {heroTitle}
              </h1>
              <p className="font-sans text-xs font-light text-zinc-600 max-w-sm leading-relaxed tracking-wide pt-2">
                {heroSubtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase border-2 border-black hover:bg-transparent hover:text-black transition-colors rounded-none"
              >
                {heroCtaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Monochrome Portrait */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="border-2 border-black p-2 bg-white rounded-none w-full max-w-sm">
              <div className="aspect-[3/4] overflow-hidden relative border border-zinc-200">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800"
                  alt="Monochrome Lookbook"
                  className="w-full h-full object-cover filter grayscale contrast-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. OASIS CO (WARM ARTISANAL POTTERY HERO)
  if (brandKey.includes("oasis") || brandKey.includes("sandstone")) {
    return (
      <section className="relative w-full py-16 md:py-24 bg-[#FAF8F5] grain-bg border-b border-orange-200/20 font-serif">
        <div className="container max-w-5xl mx-auto px-6 text-center space-y-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D97706] block">HANDCRAFTED IN SOUTH AFRICA</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#402014] leading-[1.1] max-w-3xl mx-auto">
            {heroTitle}
          </h1>
          <p className="font-sans text-xs md:text-sm font-light text-[#5c3e35] max-w-lg mx-auto leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex justify-center pt-2">
            <div className="relative p-2 bg-white border border-orange-100 rounded-[3rem] shadow-md max-w-md">
              <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem]">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800"
                  alt="Artisanal pottery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/shop"
              className={cn(
                "inline-flex items-center gap-2.5 px-10 py-4.5 bg-[#402014] text-[#FAF8F5] hover:bg-[#D97706] text-[10px] font-bold tracking-widest uppercase transition-colors shadow-lg shadow-[#402014]/10",
                btnRadiusClass
              )}
            >
              {heroCtaText} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 4. OCEAN MIST (COASTAL WELLNESS CAPSULE HERO)
  if (brandKey.includes("ocean") || brandKey.includes("mist")) {
    return (
      <section className="relative w-full py-16 md:py-28 bg-[#F0F9FF] border-b border-blue-100/30 overflow-hidden font-sans">
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-300/10 blur-[120px] pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 order-2 md:order-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-150 border border-cyan-200 text-cyan-700 text-[9px] font-bold uppercase tracking-widest rounded-full">
              <Compass className="h-3 w-3 animate-spin-slow" /> Rejuvenate Daily
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-cyan-950 leading-tight tracking-tight uppercase">
              {heroTitle}
            </h1>
            <p className="text-xs md:text-sm text-cyan-800/80 max-w-md mx-auto md:mx-0 leading-relaxed font-light">
              {heroSubtitle}
            </p>
            
            <div className="pt-2 flex justify-center md:justify-start">
              <Link
                href="/shop"
                className={cn(
                  "inline-flex items-center gap-2 px-10 py-5 bg-[#14B8A6] text-white hover:bg-cyan-700 text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-md shadow-cyan-950/15 hover:scale-105 active:scale-95",
                  btnRadiusClass
                )}
              >
                {heroCtaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className={cn("aspect-[1.25/1] w-full max-w-md overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 p-4 shadow-xl flex items-center justify-center relative", cardRadiusClass)}>
              <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800"
                  alt="Coastal Wellness Activewear"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 5. DEFAULT: SCENTED (LUXURY ASYMMETRIC HERO)
  return (
    <section className="relative w-full py-12 md:py-24 bg-background select-none">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="golden-ratio-grid items-center min-h-[70vh]">
          {/* Left Column: Elegant Editorial Text */}
          <div className="order-2 md:order-1 flex flex-col justify-center pr-0 md:pr-12 space-y-6 pt-8 md:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-accent block">
                The Awakening
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl font-serif font-light text-primary leading-[1.1] tracking-tight">
                {heroTitle.includes(".") ? (
                  <>
                    {heroTitle.split(".")[0]}
                    <span className="italic">.</span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base md:text-lg font-sans font-light tracking-wide text-muted-foreground max-w-md leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-start pt-4"
            >
              <div
                ref={buttonRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative py-4 pr-12 cursor-pointer flex items-center justify-start"
              >
                <motion.div
                  style={{ x: springX, y: springY }}
                  className="relative shadow-sm"
                >
                  <Link
                    href="/shop"
                    className={cn(
                      "group relative flex items-center gap-3 px-8 py-4 border border-primary bg-primary text-[10px] font-semibold tracking-[0.25em] uppercase text-secondary hover:bg-transparent hover:text-primary transition-all duration-500 overflow-hidden",
                      btnRadiusClass
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {heroCtaText}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Asymmetric Organic Frame holding Premium Bottle */}
          <div className="order-1 md:order-2 h-full w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn("aspect-[1.3/1] md:aspect-[1.15/1] w-full overflow-hidden ambient-glow relative border border-border/10", cardRadiusClass)}
            >
              <img
                src="/images/scented_hero_hd.png"
                alt="SCENTED Atmosphere"
                className="absolute inset-0 w-full h-full object-cover scale-[1.01] hover:scale-103 transition-transform duration-[2.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
