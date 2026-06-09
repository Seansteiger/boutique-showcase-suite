import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Sliders, Database, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique Showcase Suite | Universal Store Engine",
  description: "Explore five distinct custom frontends tailored to show design-system versatility.",
};

const BRANDS = [
  {
    name: "SCENTED",
    tagline: "Luxury Fragrances & Rituals",
    description: "An elegant, sensory fragrance store utilizing organic mesh patterns, golden accents, and asymmetric soft corners to deliver a high-end, tactile experience.",
    path: "/scented",
    color: "#d4af37",
    borderColor: "border-[#d4af37]/30 hover:border-[#d4af37]",
    accentBg: "bg-[#d4af37]/5",
    badge: "Luxury Fragrance",
    fontClass: "font-serif italic font-normal tracking-wide",
    radius: "rounded-[1.5rem_0.5rem_1.5rem_0.5rem]",
    bgImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
    specs: ["Playfair Display & Hanken", "Asymmetric Corners", "Mesh Ambient Texture", "Complete Scent Catalog"]
  },
  {
    name: "Home.",
    tagline: "Atmospheric Precision Appliances",
    description: "Architecturally inspired kitchen tools featuring silent acoustics, solid brushed steel surfaces, and a minimalist 4px design rhythm.",
    path: "/home-appliances",
    color: "#ffe088",
    borderColor: "border-white/10 hover:border-[#ffe088]",
    accentBg: "bg-[#ffe088]/5",
    badge: "Atmospheric Tech",
    fontClass: "font-mono font-bold tracking-tighter text-white",
    radius: "rounded-[4px]",
    bgImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600",
    specs: ["Playfair & Inter Fonts", "Brushed Steel Theme", "Soft 4px Corners", "Appliance Suite Catalog"]
  },
  {
    name: "Furnish.",
    tagline: "Quiet Opulence Sculptural Furniture",
    description: "A luxury retail showcase prioritizing raw oak, stone materials, and heavy negative space with strict 0px border radii for a slab-of-stone feel.",
    path: "/furnish",
    color: "#c5a059",
    borderColor: "border-white/10 hover:border-[#c5a059]",
    accentBg: "bg-[#c5a059]/5",
    badge: "Architectural Slab",
    fontClass: "font-serif font-light uppercase tracking-[0.15em] text-[#fbf9f8]",
    radius: "rounded-none",
    bgImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600",
    specs: ["Manrope Typography", "Sandstone & Oak Palette", "Strict 0px Sharp Corners", "Minimalist Slab Layouts"]
  },
  {
    name: "Food.co",
    tagline: "Artisanal Pantry & Culinary Goods",
    description: "An organic culinary marketplace featuring fresh sage green accents, highly rounded 24px containers, and transparent agricultural sourcing grids.",
    path: "/food-co",
    color: "#7D8C7C",
    borderColor: "border-white/10 hover:border-[#7D8C7C]",
    accentBg: "bg-[#7D8C7C]/5",
    badge: "Organic Pantry",
    fontClass: "font-sans font-black tracking-tight text-[#bbcbb9]",
    radius: "rounded-[1.5rem]",
    bgImage: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600",
    specs: ["Hanken Grotesk & Serif", "Sage Green Theme", "Highly Rounded 24px Radius", "Artisanal Hygiene & Olive Oils"]
  },
  {
    name: "Invited",
    tagline: "Bespoke Event & RSVP Suite",
    description: "A luxury, non-commercial boutique featuring ultra-thin gold hairlines, Montserrat typography, and elegant, custom-coded database RSVP forms.",
    path: "/invited",
    color: "#d4af37",
    borderColor: "border-[#d4af37]/20 hover:border-[#d4af37]",
    accentBg: "bg-[#d4af37]/5",
    badge: "RSVP Registry",
    fontClass: "font-sans font-light tracking-[0.2em] uppercase text-white",
    radius: "rounded-[4px]",
    bgImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600",
    specs: ["Montserrat Typography", "0.5px Gold Hairlines", "Convex RSVP Database Sync", "Eased Bezier Transitions"]
  }
];

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-[#070907] text-[#efeded] font-sans selection:bg-[#d4af37] selection:text-[#070907] flex flex-col relative overflow-hidden">
      
      {/* Background Cinematic Aura Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-radial from-[#1b3022]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-radial from-[#7d8c7c]/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Hero Header Block */}
      <header className="relative z-10 pt-20 pb-16 max-w-5xl mx-auto px-6 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#d4af37] animate-pulse">
          <Sparkles className="h-3.5 w-3.5" /> Frontend Engineering Showcase
        </span>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-[1.1]">
          The Boutique <span className="font-serif italic text-[#d4af37] font-normal">Showcase</span> Suite
        </h1>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          A premium visual agency portal demonstrating the complete range of visual styles, custom palettes, radii, and layouts tailorable from a unified Next.js + Convex database schema.
        </p>
      </header>

      {/* Grid List of Boutique Brands */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-grow pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className={`group relative flex flex-col justify-between p-6 bg-white/[0.02] border ${brand.borderColor} ${brand.radius} transition-all duration-500 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-[#d4af37]/5 hover:-translate-y-1`}
            >
              {/* Card Background Overlay Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundImage: `url('${brand.bgImage}')`, borderRadius: 'inherit' }}
              />

              <div className="space-y-4 relative z-10">
                {/* Visual Accent Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    {brand.badge}
                  </span>
                  <div className={`h-1.5 w-1.5 rounded-full`} style={{ backgroundColor: brand.color }} />
                </div>

                {/* Brand Logo Wordmark */}
                <h2 className={`${brand.fontClass} text-2xl pt-2 border-b border-white/5 pb-3`}>
                  {brand.name}
                </h2>

                {/* Subtitle Tagline */}
                <p className="text-xs font-semibold" style={{ color: brand.color }}>
                  {brand.tagline}
                </p>

                {/* Philosophy Description */}
                <p className="text-[11px] text-white/50 leading-relaxed font-light">
                  {brand.description}
                </p>
              </div>

              {/* Specifications Block */}
              <div className="mt-8 pt-4 border-t border-white/5 space-y-4 relative z-10">
                <div className="space-y-1.5">
                  {brand.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-[9px] text-white/40">
                      <div className="h-1 w-1 bg-white/30 rounded-full" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={brand.path}
                  className={`w-full py-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 text-[#070907]`}
                  style={{ backgroundColor: brand.color, borderRadius: brand.radius.includes("none") ? "0px" : "4px" }}
                >
                  Enter Store <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Specs Info Strip */}
        <div className="mt-20 border border-white/5 bg-white/[0.01] rounded-2xl p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#d4af37]">
              <Sliders className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Visual Presets</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Tailor primary, secondary, and accent colors, font configurations, border-radii, and border widths dynamically.
            </p>
          </div>
          <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/5 py-6 md:py-0 md:px-8">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#ffe088]">
              <Database className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Convex Realtime DB</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              All visual settings, categories, catalog items, and RSVP event registrants sync instantly in a unified server-side datastore.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#7D8C7C]">
              <Layers className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Isolated Execution</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-light">
              Each store path operates under completely isolated routing layouts, disabling global overlays to preserve brand independence.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Block */}
      <footer className="relative z-10 border-t border-white/5 bg-[#060806] py-12 text-center text-[10px] uppercase tracking-wider text-white/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Boutique Suite Showcase. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/scented" className="hover:text-[#d4af37] transition-colors">Fragrance Flagship</Link>
            <span className="text-white/10">|</span>
            <Link href="/admin" className="hover:text-[#d4af37] transition-colors">Command Tower</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
