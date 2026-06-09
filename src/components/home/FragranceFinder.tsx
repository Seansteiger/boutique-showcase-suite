"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useCartStore } from "@/store/cart";
import { Check, Sparkles, RefreshCw, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export function FragranceFinder() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const products = useQuery(api.products.getProducts);
  const addItem = useCartStore((state) => state.addItem);
  const settings = useStoreSettings();
  const isHapticEnabled = settings?.enabledWidgets?.includes("haptic-feedback-mock");

  // Mock haptic feedback function
  const triggerHaptic = () => {
    if (isHapticEnabled) {
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(12); // Short haptic pulse
      }
      console.log("[Haptic Feedback] Subtle hardware vibration triggered.");
    }
  };

  const steps = [
    {
      id: 1,
      question: "Where will you wear this fragrance?",
      key: "occasion",
      options: [
        { label: "Elegant Evening Soirées", value: "evening" },
        { label: "Sun-Drenched Days", value: "day" },
        { label: "Intimate Nocturnal Encounters", value: "nocturnal" },
      ],
    },
    {
      id: 2,
      question: "What sensory notes draw you in?",
      key: "notes",
      options: [
        { label: "Rich, Warm Woods & Oud", value: "woody" },
        { label: "Sweet, Hypnotic Gourmands", value: "gourmand" },
        { label: "Ethereal Aromatics & Lavande", value: "aromatic" },
      ],
    },
    {
      id: 3,
      question: "Choose your sensory aura.",
      key: "vibe",
      options: [
        { label: "Sophisticated & Regal", value: "regal" },
        { label: "Sensual & Enigmatic", value: "enigmatic" },
        { label: "Ethereal & Serene", value: "serene" },
      ],
    },
  ];

  const handleSelectOption = (key: string, value: string) => {
    triggerHaptic();
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      setStep(4); // Result
    }
  };

  const handleReset = () => {
    triggerHaptic();
    setAnswers({});
    setStep(1);
  };

  // Determine recommended product
  const getRecommendation = () => {
    const activeProducts = products || MOCK_PRODUCTS;
    if (!activeProducts || activeProducts.length === 0) return null;
    
    const notes = answers.notes;
    const vibe = answers.vibe;
    const occasion = answers.occasion;

    if (notes === "woody" && vibe === "regal") {
      return activeProducts.find((p) => p.slug === "elysian-oud" || p.slug === "ratio-2-6") || activeProducts[0];
    }
    if (notes === "gourmand" || occasion === "nocturnal") {
      return activeProducts.find((p) => p.slug === "nectar-de-cerise" || p.slug === "ratio-1-0") || activeProducts[1] || activeProducts[0];
    }
    if (notes === "woody" && vibe === "serene") {
      return activeProducts.find((p) => p.slug === "santal-imperial-candle" || p.slug === "ratio-3-4-candle") || activeProducts[2] || activeProducts[0];
    }
    return activeProducts.find((p) => p.slug === "brumes-de-reve" || p.slug === "ratio-6-0-mist") || activeProducts[3] || activeProducts[0];
  };

  const recommendedProduct = getRecommendation();

  const handleAddToCart = () => {
    triggerHaptic();
    if (!recommendedProduct) return;

    addItem({
      id: recommendedProduct.id ?? (recommendedProduct as any)._id?.toString(),
      name: recommendedProduct.title || (recommendedProduct as any).name,
      slug: recommendedProduct.slug,
      price: recommendedProduct.price,
      sale_price: recommendedProduct.salePrice || null,
      category: "Les Parfums",
      image: recommendedProduct.imageUrls?.[0] || (recommendedProduct as any).image || "",
    });

    toast.success(`${recommendedProduct.title || (recommendedProduct as any).name} added to your cart.`);
  };

  return (
    <section id="fragrance-finder" className="w-full bg-secondary/30 py-16 md:py-24 border-y border-border/10 font-sans">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column: Scent Discovery Quiz / Results */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-accent block">
                Scent Discovery
              </span>
              <h2 className="text-3xl md:text-4.5xl font-serif font-light text-primary leading-tight">
                Allow your <span className="italic">intuition</span> to guide you.
              </h2>
              <p className="text-sm font-sans font-light tracking-wide text-muted-foreground leading-relaxed max-w-md">
                Select sensory options to discover a sequence of perfectly balanced olfactory formulations.
              </p>
            </div>

            <div className="relative min-h-[340px] bg-background border border-border/10 p-6 md:p-8 rounded-[2rem_0.5rem_2rem_0.5rem] shadow-sm flex flex-col justify-center overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent pointer-events-none opacity-40" />

              <AnimatePresence mode="wait">
                {step <= 3 ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 w-full"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] tracking-[0.25em] font-semibold text-accent uppercase block">
                        Family Selection 0{step}
                      </span>
                      <h3 className="text-lg md:text-xl font-serif font-normal text-primary">
                        {steps[step - 1].question}
                      </h3>
                    </div>

                    <div className="flex flex-col space-y-3 pt-1">
                      {steps[step - 1].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectOption(steps[step - 1].key, opt.value)}
                          className="w-full text-left px-5 py-3.5 border border-border/20 rounded-[2rem_0.5rem_2rem_0.5rem] bg-secondary/10 text-xs font-sans font-medium tracking-wider text-primary hover:border-accent hover:bg-accent/5 transition-all duration-300 focus:outline-none flex items-center justify-between group"
                        >
                          <span>{opt.label}</span>
                          <span className="h-2 w-2 bg-transparent border border-primary/30 rounded-full group-hover:bg-accent group-hover:border-accent transition-all duration-300" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    {recommendedProduct ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="relative aspect-[3/4] w-20 rounded-[1rem_0.25rem_1rem_0.25rem] overflow-hidden border border-border/10 shrink-0">
                            <Image
                              src={recommendedProduct.imageUrls?.[0] || "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600"}
                              alt={recommendedProduct.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] tracking-[0.25em] font-semibold text-accent uppercase flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> Intuitive Matching
                            </span>
                            <h3 className="text-base md:text-lg font-serif font-medium text-primary uppercase tracking-wide">
                              {recommendedProduct.title}
                            </h3>
                            <p className="text-sm font-semibold text-primary">
                              R{recommendedProduct.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs font-sans font-light tracking-wide text-muted-foreground leading-relaxed">
                          {recommendedProduct.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={handleAddToCart}
                            className="flex-grow flex items-center justify-center gap-2 px-6 py-3 border border-primary bg-primary text-[10px] font-semibold tracking-[0.25em] uppercase text-secondary rounded-[2rem_0.5rem_2rem_0.5rem] hover:bg-transparent hover:text-primary transition-all duration-300 focus:outline-none shadow-sm"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                          </button>
                          <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 px-5 py-3 border border-border/20 bg-transparent text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground hover:text-primary rounded-[2rem_0.5rem_2rem_0.5rem] transition-all duration-300 focus:outline-none"
                          >
                            <RefreshCw className="h-3 w-3" /> Retry Quiz
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-4">
                        <p className="text-xs text-muted-foreground font-light">Analyzing olfactive registers...</p>
                        <button onClick={handleReset} className="text-xs text-accent uppercase tracking-widest font-semibold hover:underline">
                          Reset Finder
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Macro swirling circular fluid sphere */}
          <div className="flex justify-center items-center">
            <div className="aspect-square w-full max-w-[340px] md:max-w-[420px] rounded-full overflow-hidden ambient-glow border border-border/10 relative">
              <img 
                className="w-full h-full object-cover opacity-85 hover:scale-103 transition-transform duration-[4s]" 
                alt="Blending organic essential oils macro fluids" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4xA5UaNHLGZR-LunOxsj1MEmKcsIC4Oc5DcAG16DZ9MUYvEg0B_CJJNLKIQ8mGepxpNC140fH4RGhWcYxYbf9Yv2_eR-ZfYJsXCzkwidOcmF8T3-jTzmX32t9qnlTudC-ibENeWrovEOeUl2H7dfLrAru34_MdSuIyAZpStB-629wAqaGn0GgyXd81i6Oe7qKKvl3CrrLuSV-6eIfkPwWDYvr_OoBkSgv2JXZ0yAEmckG_buDu1PHfVgS8knPAWsC-HPmm2B9bZt"
              />
              {/* Radial gloss layer */}
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/5 to-primary/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
