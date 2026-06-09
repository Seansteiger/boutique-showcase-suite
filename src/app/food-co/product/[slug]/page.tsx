import { getProductBySlug } from "@/lib/products";
import { AddToCartButton } from "../../AddToCartButton";
import Link from "next/link";
import { MoveLeft, HelpCircle, Heart, Shield, Sprout } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result || !result.product) {
    notFound();
  }

  const { product } = result;

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#f9f9f9]">
      <Link
        href="/food-co/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#7D8C7C] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Pantry
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#efeded] rounded-[1.5rem] overflow-hidden border border-black/5 shadow-sm">
            <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-[#efeded] rounded-xl overflow-hidden border border-black/5">
                <img src={img} alt={`${product.name} gallery ${idx}`} className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details & Specs */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059]">{product.category}</span>
              <span className="bg-[#7D8C7C]/10 text-[#7D8C7C] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Traceable</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">{product.name}</h1>
            
            <div className="flex items-center gap-4 pt-2">
              <span className="text-2xl font-bold text-[#1A1A1A]">R{product.salePrice ?? product.price}</span>
              {product.salePrice && (
                <span className="text-base text-[#1A1A1A]/40 line-through">R{product.price}</span>
              )}
            </div>
          </div>

          <div className="prose prose-sm text-[#1A1A1A]/80 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart Container */}
          <div className="max-w-md pt-4 border-t border-black/10">
            <AddToCartButton product={product} />
          </div>

          {/* Ingredient Specifications */}
          <div className="space-y-4 pt-6 border-t border-black/10">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Pantry Profiling</h3>
            <div className="border border-black/5 rounded-[1rem] overflow-hidden text-xs shadow-sm bg-white">
              <div className="grid grid-cols-2 p-3 border-b border-black/5">
                <span className="font-semibold text-[#1A1A1A]/60 uppercase tracking-wider text-[10px]">Sourcing</span>
                <span>Certified Local Organic Agrarian Farms</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-black/5">
                <span className="font-semibold text-[#1A1A1A]/60 uppercase tracking-wider text-[10px]">Purity</span>
                <span>Chemical & Pesticide Free Certification</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-black/5">
                <span className="font-semibold text-[#1A1A1A]/60 uppercase tracking-wider text-[10px]">Allergens</span>
                <span>Refer to description specifications</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="font-semibold text-[#1A1A1A]/60 uppercase tracking-wider text-[10px]">Sustainably Made</span>
                <span>Low emission carbon carbon footprint</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Sprout className="h-5 w-5 text-[#7D8C7C]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/60">100% Organic</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Heart className="h-5 w-5 text-[#7D8C7C]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/60">Preservative Free</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-5 w-5 text-[#7D8C7C]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]/60">Ethical Sourced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
