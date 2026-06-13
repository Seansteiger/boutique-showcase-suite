"use client";

import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveLeft, Sprout, Shield, Truck, Check } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.cardNumber) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsOrdered(true);
    clearCart();
    toast.success("Gourmet order submitted successfully.");
  };

  const total = getCartTotal();

  if (isOrdered) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center space-y-6 bg-[#f9f9f9]">
        <div className="mx-auto w-16 h-16 bg-white text-[#7D8C7C] flex items-center justify-center rounded-full border border-black/5 shadow-sm">
          <Check className="h-8 w-8 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">Purity Assured</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">Order Received</h1>
        <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto leading-relaxed">
          Your organic selections are registered. Our local packing facility is prepping your basket for insulated cold-chain delivery.
        </p>
        <div className="pt-6">
          <Link
            href="/food-co/shop"
            className="inline-block bg-[#1A1A1A] text-white hover:bg-[#7D8C7C] transition-all px-8 py-4 uppercase text-[10px] font-semibold tracking-widest rounded-lg"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#f9f9f9]">
      <Link
        href="/food-co/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#7D8C7C] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">Gourmet Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-sm text-[#1A1A1A]/50">Your basket is empty.</p>
          <Link
            href="/food-co/shop"
            className="inline-block bg-[#1A1A1A] text-white hover:bg-[#7D8C7C] transition-all px-6 py-3 uppercase text-[10px] font-semibold tracking-widest rounded-lg"
          >
            Go Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form - rounded inputs */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold border-b border-black/10 pb-2">1. Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold border-b border-black/10 pb-2">2. Secure Card Payment</h3>
              <div className="grid grid-cols-1 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4000 1234 5678 9010"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="12/28"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]/60">CVV *</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-black/20 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#1A1A1A] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-white hover:bg-[#7D8C7C] transition-all py-4 uppercase text-[10px] font-semibold tracking-widest rounded-lg"
            >
              Order Gourmet Selections – R{total}
            </button>
          </form>

          {/* Basket Summary */}
          <div className="lg:col-span-5 bg-white p-8 border border-black/5 rounded-[1.5rem] space-y-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold">Basket Summary</h3>
            <div className="divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 justify-between items-center text-xs">
                  <div className="flex gap-3 items-center">
                    <span className="font-serif font-bold text-sm bg-[#f9f9f9] border border-black/5 px-2.5 py-1 rounded-md">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold line-clamp-1 max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span className="font-serif font-bold">R{(item.product.sale_price ?? item.product.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Items Subtotal</span>
                <span>R{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Insulated cold-chain shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-wider text-[9px]">Free</span>
              </div>
              <div className="flex justify-between border-t border-black/5 pt-3 text-sm font-bold">
                <span>Total Due</span>
                <span className="font-serif text-base">R{total}</span>
              </div>
            </div>

            <div className="border-t border-black/5 pt-4 flex flex-col gap-3 text-[10px] uppercase tracking-wider text-[#1A1A1A]/60">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-[#7D8C7C]" /> <span>Insulated cold-chain fresh packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#7D8C7C]" /> <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
