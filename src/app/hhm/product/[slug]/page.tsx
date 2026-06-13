"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveLeft, ShoppingBag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function HHMProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const allProducts = useQuery(api.products.getProducts);
  const addItem = useCartStore((state) => state.addItem);

  // Find active product
  const product = allProducts?.find((p) => p.slug === slug);

  // Find related products (HHM brand, excluding current one)
  const relatedProducts = allProducts
    ? allProducts.filter((p) => p.brand === "Hotel Hope" && p.slug !== slug).slice(0, 4)
    : [];

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (product && product.imageUrls && product.imageUrls.length > 0) {
      setActiveImage(product.imageUrls[0]);
    }
  }, [product]);

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Load anims for product main info
      gsap.fromTo(
        ".gsap-prod-load",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        }
      );

      // Scroll reveals
      gsap.utils.toArray<HTMLElement>(".gsap-prod-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 45, opacity: 0 },
          {
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          }
        );
      });
    });

    return () => ctx.revert();
  }, [product]);

  if (!allProducts) {
    return (
      <div className="bg-[#FFF9F0] min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E87D2E]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#FFF9F0] min-h-screen flex flex-col justify-center items-center text-center p-6">
        <h2 className="font-serif text-3xl font-bold text-[#6F4E37] mb-2">Product Not Found</h2>
        <p className="text-sm text-[#564338] mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/hhm/shop" className="bg-[#E87D2E] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      slug: product.slug,
      price: product.price,
      image: product.imageUrls?.[0] || "",
      category: product.categories?.name || "Uncategorized",
    });
    toast.success(`${product.title} added to cart!`);
  };

  // Helper to get specs based on slug
  const getSpecs = (prodSlug: string) => {
    switch (prodSlug) {
      case "vintage-oak-sideboard":
        return [
          { name: "Material", value: "Reclaimed Solid Oak" },
          { name: "Dimensions", value: "120cm x 45cm x 75cm" },
          { name: "Condition", value: "Gently Used / Restored" },
        ];
      case "handwoven-throw-blanket":
        return [
          { name: "Material", value: "100% Organic Cotton" },
          { name: "Dimensions", value: "150cm x 200cm" },
          { name: "Condition", value: "New / Artisanal" },
        ];
      case "antique-literature-set":
        return [
          { name: "Material", value: "Leather-bound hardcovers, gold foil accents" },
          { name: "Dimensions", value: "5 Collectible Volumes" },
          { name: "Condition", value: "Excellent Collectible Quality" },
        ];
      case "ceramic-table-lamp":
        return [
          { name: "Material", value: "Hand-glazed Stoneware, Linen Shade" },
          { name: "Dimensions", value: "30cm base, 55cm height" },
          { name: "Condition", value: "Gently Used / Rewired" },
        ];
      case "handwoven-storage-basket":
        return [
          { name: "Material", value: "Handcrafted Elephant Grass" },
          { name: "Dimensions", value: "40cm diameter, 45cm height" },
          { name: "Condition", value: "New / Community-Sourced" },
        ];
      default:
        return [
          { name: "Program Type", value: "Direct Nurseries Intake Support" },
          { name: "Coverage", value: "7 Days of feeding & care supplies" },
          { name: "Impact", value: "100% proceeds go directly to program" },
        ];
    }
  };

  const getImpactMessage = (prodSlug: string) => {
    if (prodSlug.includes("sideboard")) {
      return (
        <>
          This purchase supports <strong>2 nights of safe care</strong> for a baby in need.
        </>
      );
    }
    if (prodSlug.includes("blanket") || prodSlug.includes("lamp")) {
      return (
        <>
          This purchase supports <strong>1 night of safe care</strong> for a baby in need.
        </>
      );
    }
    if (prodSlug.includes("literature")) {
      return (
        <>
          This purchase funds <strong>specialized early childhood education</strong> materials.
        </>
      );
    }
    if (prodSlug.includes("basket")) {
      return (
        <>
          This purchase provides <strong>warm, nutritious porridge</strong> for a mother and child.
        </>
      );
    }
    return (
      <>
        This donation goes <strong>100% directly</strong> towards feeding and care programs.
      </>
    );
  };

  const specs = getSpecs(product.slug);
  const impactMsg = getImpactMessage(product.slug);

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-16">
        
        {/* Back Link */}
        <div className="mb-8 gsap-prod-load opacity-0">
          <Link
            href="/hhm/shop"
            className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] text-[#6F4E37] hover:text-[#E87D2E] transition-colors"
          >
            <MoveLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Gallery (Left) */}
          <div className="space-y-4 gsap-prod-load opacity-0">
            <div className="w-full aspect-square rounded-xl bg-white shadow-sm border border-[#6F4E37]/10 overflow-hidden relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#f8e4da] text-[#E87D2E]">
                  <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    favorite
                  </span>
                </div>
              )}
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg bg-white border overflow-hidden transition-all ${
                      activeImage === img ? "border-[#E87D2E] ring-2 ring-[#E87D2E]/25" : "border-[#6F4E37]/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info (Right) */}
          <div className="flex flex-col gsap-prod-load opacity-0 h-full">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-[#f8e4da] text-[#6F4E37] font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] rounded-full mb-4 border border-[#6F4E37]/10">
                {product.categories?.name || "Restored Furniture"}
              </span>
            </div>
            <h1 className="font-serif text-[32px] md:text-[48px] font-bold leading-[40px] md:leading-[56px] tracking-tight md:tracking-[-0.02em] text-[#332F2C] mb-4">
              {product.title}
            </h1>
            <p className="font-serif text-[32px] font-semibold leading-[40px] text-[#E87D2E] mb-6">
              R {product.price.toFixed(2)}
            </p>

            {/* Impact Badge */}
            <div className="flex items-start gap-4 p-4 mb-8 bg-[#fff8f5] rounded-lg border border-[#E87D2E]/30 shadow-sm">
              <div className="text-[#E87D2E] mt-1 shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <div>
                <h4 className="font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] text-[#6F4E37] mb-1">
                  Impact Made
                </h4>
                <p className="font-sans text-[16px] font-normal leading-[24px] text-[#564338]">
                  {impactMsg}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="font-sans text-[18px] font-normal leading-[28px] text-[#564338] leading-relaxed">
                {product.description || "Every purchase from Hotel Hope Interiors breathes new life into beautiful items and supports our mission to provide safe, loving care for abandoned and surrendered infants."}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-10">
              <h3 className="font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] text-[#6F4E37] uppercase tracking-wider mb-3">
                Specifications
              </h3>
              <ul className="space-y-2 font-sans text-[16px] font-normal leading-[24px] text-[#564338]">
                {specs.map((spec, index) => (
                  <li key={index} className="flex justify-between border-b border-[#6F4E37]/10 pb-2">
                    <span className="text-[#332F2C]">{spec.name}:</span>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-grow flex-1 bg-[#E87D2E] hover:bg-[#984800] text-white font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] py-4 px-6 rounded-lg shadow-[0_4px_14px_0_rgba(232,125,46,0.39)] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  window.location.href = "/hhm/cart";
                }}
                className="flex-grow flex-1 bg-transparent border-2 border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37]/5 font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] py-4 px-6 rounded-lg transition-all duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>

        {/* The Story Behind the Piece */}
        <section className="mb-24 py-16 px-6 md:px-12 bg-white rounded-2xl border border-[#6F4E37]/10 shadow-sm relative overflow-hidden gsap-prod-reveal opacity-0">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8e4da] rounded-full blur-3xl opacity-35 -mr-20 -mt-20 z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            <div className="w-full md:w-1/3 flex justify-center">
              <div
                className="aspect-square w-64 shadow-md overflow-hidden bg-[#f2dfd5]"
                style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
              >
                <img
                  alt="Hotel Hope community children"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLsv7uDSaFivwjO3f4wHZemKnvjuFEphHnd70V6wG2vE8Vm8C3q2JuW1X1vHXuD8QuV2do1ZTahjhOxcawCHTp5MDXEdmcFLAxXYYYsE5H_Ctw-5NvSiKjqA76CCFrCpSI0NSC9Qd2lblg3JOMr-55NrEySsKPHcHc08pZM7s_yYe6BvKALB55q6coje5GAe_W-n_h4eX2XQd0R2HdGqbovwCu9PHqWJM26nF6VAfOrLD6KuR2q-vpmQ6za8"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <h2 className="font-serif text-[32px] font-semibold leading-[40px] text-[#6F4E37] mb-6">
                The Story Behind the Piece
              </h2>
              <p className="font-serif text-[18px] md:text-[24px] italic text-[#332F2C] leading-relaxed mb-6 font-medium">
                &ldquo;When you bring a piece of Hotel Hope into your home, you&apos;re not just decorating a room. You&apos;re helping us build a home for a child who needs one.&rdquo;
              </p>
              <p className="font-sans text-[16px] font-normal leading-[24px] text-[#564338] leading-relaxed">
                Our donated goods are carefully curated, cleaned, and sometimes restored by our dedicated team of volunteers and staff. By shopping with us, you are participating in a cycle of compassionate renewal—giving furniture a second life, and helping us provide a loving, safe environment for the children in our care.
              </p>
            </div>
          </div>
        </section>

        {/* You Might Also Like */}
        {relatedProducts.length > 0 && (
          <section className="gsap-prod-reveal opacity-0">
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-serif text-[32px] font-semibold leading-[40px] text-[#6F4E37]">
                You Might Also Like
              </h2>
              <div className="flex gap-2">
                <Link
                  href="/hhm/shop"
                  className="px-4 py-2 border border-[#6F4E37]/20 rounded-full font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] text-[#6F4E37] hover:bg-[#6F4E37]/5 transition-colors"
                >
                  View All Shop
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => {
                const img = p.imageUrls?.[0];
                return (
                  <Link
                    key={p.id}
                    href={`/hhm/product/${p.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(111,78,55,0.12)] transition-shadow duration-300 flex flex-col h-full cursor-pointer border border-[#6F4E37]/5"
                  >
                    <div className="aspect-square relative overflow-hidden bg-[#f2dfd5] rounded-t-xl">
                      {img ? (
                        <img
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={img}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#f8e4da] text-[#E87D2E]">
                          <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                            favorite
                          </span>
                        </div>
                      )}
                      {p.categories?.name && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-block px-2 py-1 bg-white/90 text-[#6F4E37] font-sans text-[12px] font-semibold leading-[18px] tracking-[0.05em] rounded-md shadow-sm">
                            {p.categories.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-sans text-[18px] font-normal leading-[28px] text-[#332F2C] mb-1 line-clamp-1 group-hover:text-[#E87D2E] transition-colors">
                        {p.title}
                      </h3>
                      <p className="font-sans text-[14px] font-semibold leading-[20px] tracking-[0.05em] text-[#E87D2E] mt-auto">
                        R {p.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
