"use client";

import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveLeft, Compass, Shield, Truck, Check } from "lucide-react";
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
      toast.error("All billing and destination details are required");
      return;
    }
    
    setIsOrdered(true);
    clearCart();
    toast.success("Order logged in showroom registry.");
  };

  const total = getCartTotal();

  if (isOrdered) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center space-y-6 bg-[#F9F7F2]">
        <div className="mx-auto w-16 h-16 bg-white text-[#121212] flex items-center justify-center rounded-none border border-[#121212]">
          <Check className="h-8 w-8 stroke-[1.5]" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">Verified</span>
        <h1 className="font-serif text-4xl font-light uppercase tracking-tight">Order Confirmed</h1>
        <p className="text-xs text-[#4a4a4a] max-w-sm mx-auto leading-relaxed">
          Your reservation details are processed. Our custom packaging studio will contact you shortly to coordinate white-glove inside delivery and assembly.
        </p>
        <div className="pt-6">
          <Link
            href="/furnish"
            className="inline-block bg-[#121212] text-white hover:bg-[#d4af37] transition-all px-8 py-4 uppercase text-[10px] font-black tracking-widest rounded-none border border-[#121212]"
          >
            Back to Showroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12 bg-[#F9F7F2]">
      <Link
        href="/furnish/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#121212]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Collection
      </Link>

      <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-tight">Showroom Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-sm text-[#121212]/50">Your catalog list is empty.</p>
          <Link
            href="/furnish/shop"
            className="inline-block bg-[#121212] text-white hover:bg-[#d4af37] transition-all px-6 py-3 uppercase text-[10px] font-black tracking-widest rounded-none"
          >
            View Pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Billing Form - Architect flat style */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-lg font-normal border-b border-[#121212]/10 pb-2 uppercase tracking-wider">1. Showroom Delivery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-serif text-lg font-normal border-b border-[#121212]/10 pb-2 uppercase tracking-wider">2. Material Guarantee Deposit</h3>
              <div className="grid grid-cols-1 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="4000 1234 5678 9010"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="12/28"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold uppercase tracking-wider text-[10px] text-[#4a4a4a]">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-[#121212]/30 bg-transparent rounded-none outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#121212] text-white hover:bg-[#d4af37] transition-all py-4 uppercase text-[10px] font-black tracking-widest rounded-none border border-[#121212]"
            >
              Order Furniture Pieces – R{total}
            </button>
          </form>

          {/* Catalog Summary */}
          <div className="lg:col-span-5 bg-white p-8 border border-[#121212]/10 rounded-none space-y-6">
            <h3 className="font-serif text-lg font-normal uppercase tracking-wider">Showroom Summary</h3>
            <div className="divide-y divide-[#121212]/10">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 justify-between items-center text-xs">
                  <div className="flex gap-3 items-center">
                    <span className="font-serif text-sm bg-[#F9F7F2] border border-[#121212]/10 px-2 py-1 rounded-none">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold line-clamp-1 max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span className="font-serif font-bold">R{(item.product.sale_price ?? item.product.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#121212]/10 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4a4a4a]">Items Subtotal</span>
                <span>R{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a4a4a]">White-Glove Delivery</span>
                <span className="text-green-600 font-bold uppercase tracking-wider text-[9px]">Included</span>
              </div>
              <div className="flex justify-between border-t border-[#121212]/10 pt-3 text-sm font-bold">
                <span>Total Amount</span>
                <span className="font-serif text-base">R{total}</span>
              </div>
            </div>

            <div className="border-t border-[#121212]/10 pt-4 flex flex-col gap-3 text-[10px] uppercase tracking-wider text-[#4a4a4a]">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#d4af37]" /> <span>White-glove inside delivery & assembly</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#d4af37]" /> <span>Material authentication certificates</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
