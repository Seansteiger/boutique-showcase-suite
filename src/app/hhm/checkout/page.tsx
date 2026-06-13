"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";

export default function HHMCheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getCartTotal, clearCart } = useCartStore();
  const createOrder = useMutation(api.orders.createOrder);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [heroUp, setHeroUp] = useState(false);

  // Checkout Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-populate from local storage user profile if available
    const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        setFullName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
      } catch (e) {
        console.error("Failed to parse user profile for checkout:", e);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-[#FFF9F0]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E87D2E]"></div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 80 : 0;
  const heroUpCost = heroUp ? 50 : 0;
  const totalAmount = subtotal + shipping + heroUpCost;

  // Calculate dynamic impact metrics based on cart items
  let totalNights = 0;
  let totalMeals = 0;

  items.forEach((item) => {
    const slug = item.product.slug;
    const qty = item.quantity;
    if (slug.includes("sideboard")) {
      totalNights += 2 * qty;
    } else if (slug.includes("blanket") || slug.includes("lamp")) {
      totalNights += 1 * qty;
    } else if (slug.includes("basket")) {
      totalMeals += 10 * qty;
    } else if (slug.includes("formula")) {
      totalMeals += 14 * qty;
    } else {
      totalMeals += 2 * qty;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!email || !phone || !fullName || !streetAddress || !city || !postalCode) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
      let userId = "guest_hhm";
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          userId = user.id || "guest_hhm";
        } catch (e) {}
      }

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.sale_price ?? item.product.price,
      }));

      const shippingAddress = {
        fullName,
        streetAddress,
        city,
        postalCode,
        email,
        phone,
        heroUp,
        shippingCost: shipping,
        heroUpCost,
        brand: "Hotel Hope Ministries",
      };

      const id = await createOrder({
        userId,
        total: totalAmount,
        shippingAddress,
        items: orderItems,
      });

      setOrderId(id);
      clearCart();
      toast.success("Thank you for your order and your generous impact!");
    } catch (error: any) {
      console.error("Error submitting order to Convex:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully placed, show thank you screen
  if (orderId) {
    return (
      <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen py-16 px-6 md:px-16 flex flex-col justify-center items-center">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full border border-[#6F4E37]/10 shadow-[0_8px_30px_rgba(232,125,46,0.08)] text-center space-y-6">
          <div className="w-20 h-20 bg-[#E87D2E]/10 rounded-full flex items-center justify-center mx-auto text-[#E87D2E]">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#6F4E37]">
            Thank You for Your Order!
          </h1>
          <p className="text-base text-[#564338] max-w-md mx-auto">
            Your purchase is complete. You have directly funded crucial support for families and babies.
          </p>

          <div className="bg-[#FFF9F0] p-6 rounded-lg border border-[#E87D2E]/10 space-y-4 text-left">
            <h3 className="font-serif font-bold text-[#984800] text-center border-b border-[#6F4E37]/10 pb-2 mb-2">
              Collective Impact Accomplished
            </h3>
            <div className="flex flex-col gap-2">
              {totalNights > 0 && (
                <div className="flex items-center gap-2 text-sm text-[#332F2C]">
                  <span className="material-symbols-outlined text-[#E87D2E] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    night_shelter
                  </span>
                  <span><strong>{totalNights} Nights</strong> of Safe Care & shelter for infants</span>
                </div>
              )}
              {totalMeals > 0 && (
                <div className="flex items-center gap-2 text-sm text-[#332F2C]">
                  <span className="material-symbols-outlined text-[#E87D2E] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_dining
                  </span>
                  <span><strong>{totalMeals} Nutritious Meals</strong> provided to children & mothers</span>
                </div>
              )}
              {totalNights === 0 && totalMeals === 0 && (
                <div className="flex items-center gap-2 text-sm text-[#332F2C]">
                  <span className="material-symbols-outlined text-[#E87D2E] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                  <span>Essential direct support for abandoned babies</span>
                </div>
              )}
              {heroUp && (
                <div className="flex items-center gap-2 text-sm text-[#332F2C]">
                  <span className="material-symbols-outlined text-[#E87D2E] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    volunteer_activism
                  </span>
                  <span>Internal logistics covered with Hero Up addition</span>
                </div>
              )}
            </div>
            <div className="text-xs text-[#564338]/80 text-center border-t border-[#6F4E37]/10 pt-4 mt-2">
              Order ID: <span className="font-mono text-[#E87D2E]">{orderId}</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/hhm/shop"
              className="inline-block bg-[#E87D2E] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shadow-sm"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-20">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#6F4E37] mb-4">
            Checkout
          </h1>
          <p className="text-base text-[#564338] max-w-2xl leading-relaxed">
            Complete your order and turn your contribution into real-life changes for vulnerable children and mothers.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#6F4E37]/10 p-8 max-w-xl mx-auto">
            <span className="material-symbols-outlined text-[64px] text-[#E87D2E] mb-4">
              shopping_bag
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#6F4E37] mb-2">
              No items in your checkout
            </h2>
            <p className="text-sm text-[#564338]/90 mb-8">
              Please add items to your cart from our shop page before checking out.
            </p>
            <Link
              href="/hhm/shop"
              className="inline-block bg-[#E87D2E] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shadow-sm"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items & Forms */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Cart Items List */}
              <section className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10">
                <h2 className="font-serif text-xl font-bold text-[#6F4E37] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E87D2E]">shopping_bag</span>
                  Your Items
                </h2>
                <div className="flex flex-col gap-6">
                  {items.map((item) => {
                    const price = item.product.price;
                    const activePrice = item.product.sale_price ?? price;
                    return (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 pb-6 border-b border-[#6F4E37]/10 last:pb-0 last:border-b-0"
                      >
                        <div
                          className="w-16 h-16 rounded-lg overflow-hidden bg-[#f2dfd5] shrink-0 flex items-center justify-center text-[#E87D2E]"
                          style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 75% 70%" }}
                        >
                          {item.product.image ? (
                            <img
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              src={item.product.image}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">favorite</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-serif text-sm font-bold text-[#332F2C] leading-snug">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#564338]/80 mt-1">
                            Qty: {item.quantity} × R{activePrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif font-bold text-sm text-[#6F4E37]">
                            R{(activePrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Multi-step Form */}
              <section className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10 space-y-8">
                {/* Contact */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#6F4E37] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E87D2E]/10 text-[#E87D2E] text-xs font-bold flex items-center justify-center">1</span>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                      placeholder="Email Address"
                    />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#6F4E37] mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E87D2E]/10 text-[#E87D2E] text-xs font-bold flex items-center justify-center">2</span>
                    Shipping Details
                  </h3>
                  <div className="flex flex-col gap-4">
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                      placeholder="Full Name"
                    />
                    <input
                      required
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                      placeholder="Street Address"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                        placeholder="City"
                      />
                      <input
                        required
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-[#FFF9F0] border border-[#6F4E37]/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E87D2E] focus:ring-1 focus:ring-[#E87D2E] transition-colors text-[#332F2C]"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Impact & Summary */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
              {/* Impact Summary Sidebar */}
              <div className="bg-[#ffede5] rounded-xl p-6 border border-[#E87D2E]/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E87D2E] opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="font-serif text-xl font-bold text-[#984800] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#E87D2E]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    volunteer_activism
                  </span>
                  Your Collective Impact
                </h3>
                <p className="text-sm text-[#564338] mb-4">
                  By completing this order, you are directly funding second chances.
                </p>
                <div className="bg-white/80 rounded-lg p-4 backdrop-blur-sm border border-[#E87D2E]/10">
                  <p className="text-sm text-[#6F4E37] text-center font-semibold flex flex-col gap-1 items-center">
                    <span className="text-xs text-[#564338]">Total Impact:</span>
                    <span className="text-[#E87D2E] font-bold text-base">
                      {totalNights > 0 ? `${totalNights} nights of care` : ""}
                      {totalNights > 0 && totalMeals > 0 ? " & " : ""}
                      {totalMeals > 0 ? `${totalMeals} meals` : ""}
                      {totalNights === 0 && totalMeals === 0 ? "Infant support supplies" : ""}
                    </span>
                  </p>
                </div>
              </div>

              {/* Order Summary & Payment */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10">
                <h3 className="font-serif text-xl font-bold text-[#6F4E37] mb-6">Order Summary</h3>
                <div className="flex flex-col gap-3 pb-6 border-b border-[#6F4E37]/10 mb-6">
                  <div className="flex justify-between text-sm text-[#564338]">
                    <span>Subtotal</span>
                    <span>R {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#564338]">
                    <span>Shipping</span>
                    <span>R {shipping.toFixed(2)}</span>
                  </div>
                  {heroUp && (
                    <div className="flex justify-between text-sm text-[#564338]">
                      <span>Hero Up Donation</span>
                      <span>R {heroUpCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* 'Hero Up' Toggle Feature */}
                <div className="bg-[#feeae0] rounded-lg p-4 mb-6 flex items-start gap-4">
                  <div className="pt-1">
                    <input
                      checked={heroUp}
                      onChange={(e) => setHeroUp(e.target.checked)}
                      className="w-5 h-5 rounded border-[#6F4E37]/45 text-[#E87D2E] focus:ring-[#E87D2E] cursor-pointer"
                      id="hero-up"
                      type="checkbox"
                    />
                  </div>
                  <div>
                    <label className="font-serif text-sm font-bold text-[#6F4E37] cursor-pointer flex items-center gap-1.5" htmlFor="hero-up">
                      Hero Up (+R50)
                      <span className="material-symbols-outlined text-[#E87D2E] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_shipping
                      </span>
                    </label>
                    <p className="text-xs text-[#564338]/90 mt-1 leading-relaxed">
                      Cover our internal logistics costs so 100% of your purchase impacts the children.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-[#6F4E37]/10 pt-4">
                  <span className="font-serif font-bold text-[#6F4E37] text-lg">Total</span>
                  <span className="font-serif font-bold text-[#E87D2E] text-2xl">R {totalAmount.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#E87D2E] hover:bg-[#984800] text-white font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-sm text-sm uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Complete Purchase
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-[#564338]/80 mt-4 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Payments are secure and encrypted.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
