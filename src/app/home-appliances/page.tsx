import { getProducts } from "@/lib/products";
import Link from "next/link";
import { MoveRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

export const revalidate = 60; // Cache for 1 minute

export default async function HomeAppliancesPage() {
  const allProducts = await getProducts();
  
  // Filter products belonging to the Home. brand
  const appliances = allProducts.filter(p => p.brand === "Home.");

  // Fallback to featured ones if list is short
  const displayProducts = appliances.length > 0 ? appliances : allProducts.slice(0, 4);

  return (
    <div className="flex flex-col space-y-24 pb-24">
      {/* Cinematic Architectural Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-[#1c1b1b] text-white overflow-hidden">
        {/* Subtle Ambient Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        
        {/* Architectural Kitchen Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 transition-transform duration-10000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1800&auto=format&fit=crop')` }}
        />

        <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37]">
              Atmospheric Luxury
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.15]">
              Silence. <br />
              <span className="font-light italic text-[#f5f3f3]">Precision.</span> Craft.
            </h1>
            <p className="font-sans text-sm md:text-base leading-relaxed text-white/80 max-w-md">
              A curated collection of minimalist kitchen appliances designed to blend seamlessly with premium stone surfaces and oak cabinetry.
            </p>
            <div className="pt-4 flex gap-4">
              <Link
                href="/home-appliances/shop"
                className="bg-white text-[#1b1c1c] hover:bg-[#d4af37] hover:text-white transition-all px-8 py-4 uppercase text-[10px] font-black tracking-widest flex items-center gap-2 rounded-[4px]"
              >
                Explore Catalog <MoveRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Precision (Value Proposition Grid) */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-[#e5e2e1] py-16">
          <div className="flex flex-col space-y-3">
            <Zap className="h-6 w-6 text-[#d4af37] stroke-[1.5]" />
            <h3 className="font-serif text-lg font-semibold text-[#1b1c1c]">Whisper Technology</h3>
            <p className="text-xs text-[#1b1c1c]/70 leading-relaxed">
              Every appliance is acoustic-tuned to operate below 35dB, ensuring your culinary sanctuary remains undisturbed.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <ShieldCheck className="h-6 w-6 text-[#d4af37] stroke-[1.5]" />
            <h3 className="font-serif text-lg font-semibold text-[#1b1c1c]">Solid Cast Materials</h3>
            <p className="text-xs text-[#1b1c1c]/70 leading-relaxed">
              Formed in grade-304 brushed stainless steel and volcanic stone coatings to guarantee decades of resilient beauty.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <Sparkles className="h-6 w-6 text-[#d4af37] stroke-[1.5]" />
            <h3 className="font-serif text-lg font-semibold text-[#1b1c1c]">Precision Control</h3>
            <p className="text-xs text-[#1b1c1c]/70 leading-relaxed">
              Fitted with multi-stage heat sensors and intelligent PID chips to regulate thermal thresholds with zero variance.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Appliance Collection */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              The Kitchen Suite
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1b1c1c]">
              Curated Masterpieces
            </h2>
          </div>
          <Link
            href="/home-appliances/shop"
            className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c] hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
          >
            Browse All Appliances <MoveRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

              {/* Add to Cart button (using Client component AddToCartButton) */}
              <AddToCartButton product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Gallery Showcase */}
      <section className="bg-[#efeded]/30 py-24 border-y border-[#e5e2e1]/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
              Design Heritage
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Integrating Form and Function.
            </h2>
            <p className="text-xs md:text-sm text-[#1b1c1c]/80 leading-relaxed">
              We believe home appliances should not be loud intrusions. Our engineering team designs from first-principles to deliver tools that honor structural materials—combining high-diffusion glass panels, matte black steels, and precise dial controls.
            </p>
            <div className="pt-4 border-t border-[#e5e2e1]/80 grid grid-cols-2 gap-8">
              <div>
                <span className="font-serif text-3xl font-bold">10-Year</span>
                <p className="text-[10px] uppercase tracking-widest text-[#1b1c1c]/60 mt-1">Material Guarantee</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold">0.5s</span>
                <p className="text-[10px] uppercase tracking-widest text-[#1b1c1c]/60 mt-1">Thermal Response</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-[8px] overflow-hidden border border-[#e5e2e1]/40 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Espresso Coffee Setup"
              className="object-cover h-full w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
