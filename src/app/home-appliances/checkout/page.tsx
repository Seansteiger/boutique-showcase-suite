"use client";

import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveLeft, CreditCard, Shield, Truck, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process simulated order
    setIsOrdered(true);
    clearCart();
    toast.success("Order processed successfully!");
  };

  const total = getCartTotal();

  if (isOrdered) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 flex items-center justify-center rounded-full border border-green-200">
          <Check className="h-8 w-8 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Success</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight">Order Confirmed</h1>
        <p className="text-xs text-[#1b1c1c]/70 max-w-sm mx-auto leading-relaxed">
          Your order has been logged and sent to our precision manufacturing center. A shipment tracking link will be sent to your email.
        </p>
        <div className="pt-6">
          <Link
            href="/home-appliances"
            className="inline-block bg-[#1b1c1c] text-white hover:bg-[#d4af37] transition-all px-8 py-4 uppercase text-[10px] font-black tracking-widest rounded-[4px]"
          >
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/home-appliances/shop"
        className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c]/60 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
      >
        <MoveLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-sm text-[#1b1c1c]/50">Your shopping bag is empty.</p>
          <Link
            href="/home-appliances/shop"
            className="inline-block bg-[#1b1c1c] text-white hover:bg-[#d4af37] transition-all px-6 py-3 uppercase text-[10px] font-black tracking-widest rounded-[4px]"
          >
            Go Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
            {/* Shipping Info */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold border-b border-[#e5e2e1] pb-2">1. Delivery Destination</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold border-b border-[#e5e2e1] pb-2">2. Secure Payment</h3>
              <div className="grid grid-cols-1 gap-6 text-xs">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4000 1234 5678 9010"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 pl-8 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                    />
                    <CreditCard className="absolute left-0 bottom-2.5 h-4 w-4 text-[#1b1c1c]/40" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="12/28"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-[10px] text-[#1b1c1c]/60">CVV *</label>
                    <input
                      type="password"
                      name="cvv"
                      placeholder="***"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full pb-2 border-b border-[#e5e2e1] bg-transparent outline-none focus:border-b-2 focus:border-[#d4af37] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1b1c1c] text-white hover:bg-[#d4af37] transition-all py-4 uppercase text-[10px] font-black tracking-widest rounded-[4px]"
            >
              Confirm Purchase & Pay R{total}
            </button>
          </form>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 bg-[#efeded]/30 p-8 border border-[#e5e2e1]/60 rounded-[8px] space-y-6">
            <h3 className="font-serif text-lg font-semibold">Order Summary</h3>
            <div className="divide-y divide-[#e5e2e1]/40">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 justify-between items-center text-xs">
                  <div className="flex gap-3 items-center">
                    <span className="font-serif font-bold text-sm bg-white border border-[#e5e2e1]/60 px-2 py-1 rounded-[4px]">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold line-clamp-1 max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span className="font-serif font-bold">R{(item.product.sale_price ?? item.product.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e5e2e1]/60 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#1b1c1c]/60">Subtotal</span>
                <span>R{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1b1c1c]/60">Delivery</span>
                <span className="text-green-600 font-bold uppercase tracking-wider text-[9px]">Free</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e2e1]/60 pt-3 text-sm font-bold">
                <span>Total Due</span>
                <span className="font-serif text-base">R{total}</span>
              </div>
            </div>

            <div className="border-t border-[#e5e2e1]/60 pt-4 flex flex-col gap-3 text-[10px] uppercase tracking-wider text-[#1b1c1c]/60">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#d4af37]" /> <span>Secure SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#d4af37]" /> <span>Tracked Couriered Shipping</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
