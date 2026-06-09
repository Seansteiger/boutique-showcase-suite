import { getProductBySlug } from "@/lib/products";
import { AddToCartButton } from "../../AddToCartButton";
import Link from "next/link";
import { MoveLeft, Shield, CheckCircle, RotateCcw } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/home-appliances/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-[#efeded] rounded-[8px] overflow-hidden border border-[#e5e2e1]/40 shadow-sm">
            <img src={product.image} alt={product.name} className="object-cover h-full w-full" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-[#efeded] rounded-[4px] overflow-hidden border border-[#e5e2e1]/20">
                <img src={img} alt={`${product.name} gallery ${idx}`} className="object-cover h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details & Specs */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">{product.category}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1b1c1c]">{product.name}</h1>
            
            <div className="flex items-center gap-4 pt-2">
              <span className="text-2xl font-bold text-[#1b1c1c]">R{product.salePrice ?? product.price}</span>
              {product.salePrice && (
                <span className="text-base text-[#1b1c1c]/50 line-through">R{product.price}</span>
              )}
            </div>
          </div>

          <div className="prose prose-sm text-[#1b1c1c]/80 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Add to Cart Container */}
          <div className="max-w-md pt-4 border-t border-[#e5e2e1]/60">
            <AddToCartButton product={product} />
          </div>

          {/* Technical Specifications Spec Sheet */}
          <div className="space-y-4 pt-6 border-t border-[#e5e2e1]/60">
            <h3 className="font-serif text-lg font-semibold text-[#1b1c1c]">Technical Specifications</h3>
            <div className="border border-[#e5e2e1]/60 rounded-[4px] overflow-hidden text-xs">
              <div className="grid grid-cols-2 p-3 bg-[#fbf9f9] border-b border-[#e5e2e1]/40">
                <span className="font-semibold text-[#1b1c1c]/60 uppercase tracking-wider text-[10px]">Material</span>
                <span>Grade 304 Stainless Steel</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-[#e5e2e1]/40">
                <span className="font-semibold text-[#1b1c1c]/60 uppercase tracking-wider text-[10px]">Acoustics</span>
                <span>Silent Operation (&lt; 35dB)</span>
              </div>
              <div className="grid grid-cols-2 p-3 bg-[#fbf9f9] border-b border-[#e5e2e1]/40">
                <span className="font-semibold text-[#1b1c1c]/60 uppercase tracking-wider text-[10px]">Controls</span>
                <span>PID Intelligent Heat Calibration</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="font-semibold text-[#1b1c1c]/60 uppercase tracking-wider text-[10px]">Warranty</span>
                <span>10-Year Craftsmanship Promise</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#e5e2e1]/60 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1b1c1c]/60">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1b1c1c]/60">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <RotateCcw className="h-5 w-5 text-[#d4af37]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1b1c1c]/60">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
