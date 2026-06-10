"use client";

import { Playfair_Display, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Trash2, Plus, Minus, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal, isOpen, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div
      className={cn(
        "min-h-screen bg-[#fbf9f9] text-[#1b1c1c] font-sans antialiased flex flex-col pb-24 md:pb-0",
        playfair.variable,
        inter.variable
      )}
      style={{
        "--radius": "4px",
        "--font-sans": "var(--font-inter), sans-serif",
        "--font-serif": "var(--font-playfair), serif",
      } as React.CSSProperties}
    >
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e5e2e1]/40 bg-[#fbf9f9]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Brand Wordmark Logo */}
            <div className="flex">
              <Link href="/home-appliances" className="font-serif text-2xl font-bold tracking-tight text-[#1b1c1c]">
                Home<span className="text-[#d4af37]">.</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                href="/home-appliances"
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest transition-colors hover:text-[#d4af37]",
                  pathname === "/home-appliances" ? "text-[#d4af37]" : "text-[#1b1c1c]"
                )}
              >
                Home
              </Link>
              <Link
                href="/home-appliances/shop"
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest transition-colors hover:text-[#d4af37]",
                  pathname?.startsWith("/home-appliances/shop") ? "text-[#d4af37]" : "text-[#1b1c1c]"
                )}
              >
                Shop
              </Link>
            </nav>

            {/* Utilitarian Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-[#1b1c1c] hover:text-[#d4af37] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1b1c1c] text-[9px] font-bold text-white ring-2 ring-[#fbf9f9]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden text-[#1b1c1c] hover:text-[#d4af37] transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 z-30 bg-[#fbf9f9] border-b border-[#e5e2e1]/40 py-6 px-8 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/home-appliances"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c] hover:text-[#d4af37]"
            >
              Home
            </Link>
            <Link
              href="/home-appliances/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-widest text-[#1b1c1c] hover:text-[#d4af37]"
            >
              Shop
            </Link>
          </nav>
        </div>
      )}

      {/* Main Contents */}
      <main className="flex-1">{children}</main>

      {/* Floating App-like Bottom Navigation for Mobile */}
      {mounted && (
        <div className="md:hidden fixed bottom-6 inset-x-4 z-45 flex justify-center">
          <nav className="flex items-center justify-around w-full max-w-md bg-[#1b1c1c]/95 backdrop-blur-md border border-[#e5e2e1]/20 px-4 py-2.5 rounded-[4px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-white">
            <Link
              href="/home-appliances"
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative w-full",
                pathname === "/home-appliances" ? "text-[#ffe088]" : "text-white/60 hover:text-white"
              )}
            >
              <Home className="h-[20px] w-[20px] stroke-[1.5]" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Home</span>
            </Link>

            <Link
              href="/home-appliances/shop"
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative w-full",
                pathname?.startsWith("/home-appliances/shop") ? "text-[#ffe088]" : "text-white/60 hover:text-white"
              )}
            >
              <ShoppingBag className="h-[20px] w-[20px] stroke-[1.5]" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Shop</span>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative w-full text-white/60 hover:text-white"
              )}
            >
              <div className="relative">
                <ShoppingBag className="h-[20px] w-[20px] stroke-[1.5]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center bg-[#ffe088] text-[8px] font-bold text-[#1b1c1c] rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[8px] uppercase tracking-widest font-bold">Cart</span>
            </button>
          </nav>
        </div>
      )}

      {/* Luxury Footer */}
      <footer className="bg-[#1c1b1b] text-[#ffe088]/80 py-16 border-t border-[#e5e2e1]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white mb-4">
                Home<span className="text-[#d4af37]">.</span>
              </h3>
              <p className="text-xs max-w-xs leading-relaxed">
                Quiet luxury appliances engineered for modern architecture. Silence, craftsmanship, and understated status.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Marketplace</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/home-appliances" className="hover:text-white transition-colors">Collection</Link></li>
                <li><Link href="/home-appliances/shop" className="hover:text-white transition-colors">Catalog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">The Philosophy</h4>
              <p className="text-xs leading-relaxed">
                Allspacing between elements conforms to our strict 8px rhythm. Built upon the pillars of Atmospheric Luxury.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#e5e2e1]/10 text-center text-[10px] uppercase tracking-wider text-[#ffe088]/40">
            © {new Date().getFullYear()} Home. All rights reserved. Precision Engineering.
          </div>
        </div>
      </footer>

      {/* Local Cart Drawer Overlay */}
      {mounted && isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-md bg-[#fbf9f9] shadow-2xl border-l border-[#e5e2e1]/30 transition-transform duration-300 transform translate-x-0 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#e5e2e1]/40">
                <h2 className="font-serif text-lg font-bold tracking-tight">Shopping bag ({cartCount})</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:text-[#d4af37] transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                {items.length === 0 ? (
                  <p className="text-xs text-center py-12 text-[#1b1c1c]/50">Your shopping bag is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-[#e5e2e1]/20 pb-4">
                      <div className="h-16 w-16 bg-[#efeded] relative overflow-hidden rounded-[4px] border border-[#e5e2e1]/40 shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-semibold leading-tight line-clamp-1">{item.product.name}</h4>
                          <span className="text-xs font-semibold text-[#1b1c1c]/60 mt-1 block">R{item.product.sale_price ?? item.product.price}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded border border-[#e5e2e1]/80 hover:bg-[#efeded] transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded border border-[#e5e2e1]/80 hover:bg-[#efeded] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-red-600 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="pt-6 border-t border-[#e5e2e1]/40 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold uppercase tracking-widest text-xs">Total</span>
                  <span className="font-serif text-lg font-bold">R{getCartTotal()}</span>
                </div>
                <Link
                  href="/home-appliances/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-[#1b1c1c] text-white hover:bg-[#d4af37] transition-all py-4 uppercase text-[10px] font-black tracking-widest rounded-[4px]"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
