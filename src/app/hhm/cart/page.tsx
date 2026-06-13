"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function HHMCartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E87D2E]"></div>
      </div>
    );
  }

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
      totalMeals += 14 * qty; // represents formula meals
    } else {
      totalMeals += 2 * qty;
    }
  });

  const cartTotal = getCartTotal();

  return (
    <div className="bg-[#FFF9F0] text-[#332F2C] min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#984800] mb-4">
            Your Cart
          </h1>
          <p className="text-sm md:text-base text-[#564338]/90">
            Review your selections. Every item brings hope closer to home.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#6F4E37]/10 p-8 max-w-2xl mx-auto">
            <span
              className="material-symbols-outlined text-[64px] text-[#E87D2E] mb-4"
              style={{ fontVariationSettings: '"FILL" 0' }}
            >
              shopping_cart
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#6F4E37] mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-[#564338]/90 mb-8">
              Explore our collection of handpicked furniture and home decor to make a difference today.
            </p>
            <Link
              href="/hhm/shop"
              className="inline-block bg-[#E87D2E] text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List (Left Side) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {items.map((item) => {
                const imageUrl = item.product.image;
                const price = item.product.price;
                const activePrice = item.product.sale_price ?? price;

                return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10 flex flex-col sm:flex-row gap-6 relative overflow-hidden group"
                  >
                    <div
                      className="w-full sm:w-32 h-32 shrink-0 bg-[#f2dfd5] flex items-center justify-center overflow-hidden"
                      style={{
                        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[#E87D2E] text-[32px]">
                          favorite
                        </span>
                      )}
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-[#332F2C] mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#564338] mb-2">
                            {item.product.category || "Decor"}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          aria-label="Remove item"
                          className="text-[#564338] hover:text-[#ba1a1a] transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-lg">
                            close
                          </span>
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        <div className="flex items-center gap-3 border border-[#6F4E37]/30 rounded-lg px-2.5 py-1 bg-[#FFF9F0]">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="text-[#6F4E37] hover:text-[#984800] transition-colors p-0.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              remove
                            </span>
                          </button>
                          <span className="text-sm font-bold min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="text-[#6F4E37] hover:text-[#984800] transition-colors p-0.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              add
                            </span>
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-lg font-bold text-[#984800]">
                            R{(activePrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 flex justify-between items-center">
                <Link
                  href="/hhm/shop"
                  className="inline-flex items-center gap-2 text-[#6F4E37] hover:text-[#E87D2E] transition-colors font-bold text-sm group"
                >
                  <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary (Right Side) */}
            <div className="lg:col-span-4 mt-8 lg:mt-0 sticky top-28">
              {/* Impact Card */}
              <div className="bg-[#f8e4da] rounded-xl p-6 mb-6 border border-[#E87D2E]/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span
                    className="material-symbols-outlined text-[80px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#984800] mb-2 relative z-10">
                  Your Impact
                </h3>
                <div className="flex items-start gap-3 mb-2 relative z-10">
                  <span
                    className="material-symbols-outlined text-[#E87D2E] mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    night_shelter
                  </span>
                  <p className="text-sm font-semibold text-[#332F2C]">
                    This cart supports: <br />
                    {totalNights > 0 && (
                      <span className="text-[#E87D2E] font-bold block">
                        • {totalNights} Nights of Safe Care
                      </span>
                    )}
                    {totalMeals > 0 && (
                      <span className="text-[#E87D2E] font-bold block">
                        • {totalMeals} Nutritious Meals
                      </span>
                    )}
                    {totalNights === 0 && totalMeals === 0 && (
                      <span className="text-[#E87D2E] font-bold block">
                        • Critical infant care materials
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-xs text-[#564338] relative z-10 italic mt-4">
                  Thank you for bringing hope home.
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#6F4E37]/10">
                <h2 className="font-serif text-lg font-bold text-[#332F2C] mb-6 pb-4 border-b border-[#6F4E37]/10">
                  Order Summary
                </h2>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#564338]">Subtotal</span>
                    <span className="text-[#332F2C] font-semibold">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#564338]">Shipping</span>
                    <span className="text-[#332F2C] text-xs">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#6F4E37]/10 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base font-bold text-[#332F2C]">
                      Total
                    </span>
                    <span className="font-serif text-xl font-bold text-[#984800]">
                      R{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/hhm/checkout"
                  className="w-full bg-[#E87D2E] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#984800] transition-colors duration-300 shadow-md shadow-[#E87D2E]/10 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-[#564338]/75">
                  <span className="material-symbols-outlined text-[16px]">
                    lock
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    Secure checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
