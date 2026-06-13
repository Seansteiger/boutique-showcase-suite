"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HHMDonatePage() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleDonate = (amount: number, description: string) => {
    if (amount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    addItem({
      id: `donation-${amount}-${Date.now()}`,
      name: `Donation: ${description}`,
      slug: `donation-${amount}`,
      price: amount,
      image: "",
      category: "Donation",
    });

    toast.success(`R${amount} donation added to your cart!`);
    router.push("/hhm/checkout");
  };

  const handleCustomDonate = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid custom amount");
      return;
    }
    handleDonate(amount, `Custom Support Tier`);
  };

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-16 bg-[#f8e4da] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 z-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#984800]">
              Be the Hero of Their Story.
            </h1>
            <p className="text-base md:text-lg text-[#564338] leading-relaxed">
              Your contribution, no matter the size, provides a second chance for families and a foundation for vulnerable children. Join us in cultivating compassionate renewal.
            </p>
          </div>
          <div className="relative z-10 hidden lg:block">
            <div
              className="overflow-hidden w-full max-w-md mx-auto aspect-square relative shadow-lg"
              style={{
                borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              }}
            >
              <img
                alt="Child smiling joyfully"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AP1WRLtg49CaxpodIL1AbcnyXj7Ye5ImNWKFzp24GlWx7jhEPMv2_Eh9C-7jF7UGPqUPArrOSMgYJbUg1qpO4ZT5lnV0w0kvPozCGzhk18pK-pse2vr9ARJ_v1EKILmXywI0JPTROdp_ykb5tQVomgsL_fJH3Qbb_SExyDrxcp6J1WXleba6O_4TdeXW541Kqros-d2he9eEmrjn4ouxRrShCfQwREaxIV-arm_okN9-XXnE54pQgSp2lyMORQYH"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#332F2C]">
            Choose Your Impact
          </h2>
          <p className="text-sm md:text-base text-[#564338] max-w-2xl mx-auto">
            Select a monthly or one-time gift. Every tier directly supports our core missions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#6F4E37]/10 text-center flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#FFF9F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E87D2E]">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                child_care
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#984800] mb-2">
              R200
            </h3>
            <p className="text-sm text-[#564338] mb-8 flex-grow">
              Provides a week of vital baby formula.
            </p>
            <button
              onClick={() => handleDonate(200, "Vital Baby Formula (1 Week)")}
              className="w-full bg-[#FFF9F0] text-[#6F4E37] border border-[#6F4E37]/30 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:border-[#E87D2E] hover:text-[#E87D2E] transition-colors"
            >
              Select Tier
            </button>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="bg-white rounded-xl p-8 shadow-md border-2 border-[#E87D2E] text-center flex flex-col h-full relative transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E87D2E] text-white px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">
              Most Popular
            </div>
            <div className="w-16 h-16 bg-[#FFF9F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E87D2E]">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#984800] mb-2">
              R500
            </h3>
            <p className="text-sm text-[#564338] mb-8 flex-grow">
              Funds a professional counseling session for a family in need.
            </p>
            <button
              onClick={() => handleDonate(500, "Professional Family Counseling")}
              className="w-full bg-[#E87D2E] text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shadow-sm"
            >
              Select Tier
            </button>
          </div>

          {/* Tier 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-[#6F4E37]/10 text-center flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-[#FFF9F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#E87D2E]">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                home
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#984800] mb-2">
              R1000
            </h3>
            <p className="text-sm text-[#564338] mb-8 flex-grow">
              Contributes to secure housing and community rebuilding efforts.
            </p>
            <button
              onClick={() => handleDonate(1000, "Secure Housing & Community Rebuilding")}
              className="w-full bg-[#FFF9F0] text-[#6F4E37] border border-[#6F4E37]/30 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:border-[#E87D2E] hover:text-[#E87D2E] transition-colors"
            >
              Select Tier
            </button>
          </div>
        </div>

        {/* Custom Amount */}
        <form onSubmit={handleCustomDonate} className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-[#6F4E37]/10 max-w-2xl mx-auto flex flex-col md:flex-row items-end gap-6">
          <div className="flex-grow w-full">
            <label className="block text-xs font-bold text-[#564338] mb-2 uppercase tracking-wider" htmlFor="custom-amount">
              Custom Amount (R)
            </label>
            <input
              required
              className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
              id="custom-amount"
              placeholder="Enter amount"
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#6F4E37] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shrink-0 w-full md:w-auto h-[46px]"
          >
            Donate
          </button>
        </form>
      </section>

      {/* Quote / Reflection Section */}
      <section className="py-24 bg-[#feeae0]">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-sm relative aspect-[4/3]">
              <img
                alt="Moment of prayer and contemplation"
                className="w-full h-full object-cover rounded-lg"
                src="https://lh3.googleusercontent.com/aida/AP1WRLuRtytpnJZin1zL531PnzleFM1Od14K1ezOCVXIDLc0jdd3dM4Mn4_XUh6k-g5_MbUHMfa1AX5fitC90tYuolGwlBAax1O42cr3EwWnDzeUwb9u5J9m-XF2_wafOxvYd9sExO-aIeuOcHGeXp5Tn5W2KAzHh-G5hKL47IUM8eV09w43DLADplkcjtho-MPoUPfCPyEC4ha_0PoG1k41HYBAMDEcwOPFXGOAtNHXvOqKt46XwVUCuq00Glyc"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl italic text-[#984800] font-bold">
              &ldquo;Hope is the anchor of the soul.&rdquo;
            </h2>
            <p className="text-sm md:text-base text-[#564338] leading-relaxed">
              We believe in the power of prayer, contemplation, and action. Every donation is a testament to the shared belief that a better tomorrow is possible for every family we touch.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#332F2C] mb-12">
          Our Powerful Partners
        </h2>
        <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:opacity-75 transition-opacity duration-300">
          <div className="h-12 w-32 bg-[#6F4E37]/20 rounded-lg flex items-center justify-center text-xs font-semibold text-[#564338]">Partner I</div>
          <div className="h-12 w-32 bg-[#6F4E37]/20 rounded-lg flex items-center justify-center text-xs font-semibold text-[#564338]">Partner II</div>
          <div className="h-12 w-32 bg-[#6F4E37]/20 rounded-lg flex items-center justify-center text-xs font-semibold text-[#564338]">Partner III</div>
          <div className="h-12 w-32 bg-[#6F4E37]/20 rounded-lg flex items-center justify-center text-xs font-semibold text-[#564338]">Partner IV</div>
        </div>
      </section>
    </div>
  );
}
