import { getProductBySlug } from "@/lib/products";
import { AddToCartButton } from "../../AddToCartButton";
import Link from "next/link";
import { MoveLeft, Compass, Feather, Award } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#F9F7F2]">
      <Link
        href="/furnish/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#121212]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#efeded] rounded-none overflow-hidden border border-[#121212]/10 shadow-sm">
            <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-[#efeded] rounded-none overflow-hidden border border-[#121212]/10">
                <img src={img} alt={`${product.name} gallery ${idx}`} className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details & Specs */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">{product.category}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-[#121212]">{product.name}</h1>
            
            <div className="flex items-center gap-4 pt-2">
              <span className="text-2xl font-bold text-[#121212]">R{product.salePrice ?? product.price}</span>
              {product.salePrice && (
                <span className="text-base text-[#121212]/40 line-through">R{product.price}</span>
              )}
            </div>
          </div>

          <div className="prose prose-sm text-[#4a4a4a] leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart Container */}
          <div className="max-w-md pt-4 border-t border-[#121212]/10">
            <AddToCartButton product={product} />
          </div>

          {/* Technical Specifications Spec Sheet - sharp list style */}
          <div className="space-y-4 pt-6 border-t border-[#121212]/10">
            <h3 className="font-serif text-lg font-normal text-[#121212]">Material Details</h3>
            <div className="border border-[#121212]/10 rounded-none overflow-hidden text-xs">
              <div className="grid grid-cols-2 p-3 bg-white border-b border-[#121212]/10">
                <span className="font-semibold text-[#4a4a4a] uppercase tracking-wider text-[10px]">Materiality</span>
                <span>Solid European Oak, Woven Wool Bouclé</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-[#121212]/10">
                <span className="font-semibold text-[#4a4a4a] uppercase tracking-wider text-[10px]">Contours</span>
                <span>Pure Architectural Lines (0px Radius UI)</span>
              </div>
              <div className="grid grid-cols-2 p-3 bg-white border-b border-[#121212]/10">
                <span className="font-semibold text-[#4a4a4a] uppercase tracking-wider text-[10px]">Finishing</span>
                <span>Matte clear protective coating</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="font-semibold text-[#4a4a4a] uppercase tracking-wider text-[10px]">Guarantee</span>
                <span>5-Year Structural Soundness Warranty</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#121212]/10 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Compass className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#121212]/60">Architectural Design</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Feather className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#121212]/60">Boucle Upholstery</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Award className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#121212]/60">Exquisite Craft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
