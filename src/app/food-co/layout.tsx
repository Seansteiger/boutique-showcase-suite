"use client";

import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Trash2, Plus, Minus, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

export default function FoodCoLayout({
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
        "min-h-screen bg-[#f9f9f9] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#7D8C7C]/20 selection:text-[#1a1a1a] pb-24 md:pb-0",
        bodoni.variable,
        hanken.variable
      )}
      style={{
        "--radius": "8px",
        "--font-sans": "var(--font-hanken), sans-serif",
        "--font-serif": "var(--font-bodoni), serif",
      } as React.CSSProperties}
    >
      {/* Top Glassmorphic Navigation Bar - rounded style */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Brand Wordmark Logo */}
            <div className="flex">
              <Link href="/food-co" className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
                Food<span className="text-[#7D8C7C]">.co</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/food-co"
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest transition-colors hover:text-[#7D8C7C]",
                  pathname === "/food-co" ? "text-[#7D8C7C]" : "text-[#1A1A1A]"
                )}
              >
                Home
              </Link>
              <Link
                href="/food-co/shop"
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest transition-colors hover:text-[#7D8C7C]",
                  pathname?.startsWith("/food-co/shop") ? "text-[#7D8C7C]" : "text-[#1A1A1A]"
                )}
              >
                Shop
              </Link>
            </nav>

            {/* Utilitarian Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-[#1A1A1A] hover:text-[#7D8C7C] transition-colors rounded-lg"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#7D8C7C] text-[9px] font-bold text-white ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden text-[#1A1A1A] hover:text-[#7D8C7C] transition-colors rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 z-30 bg-white/95 border-b border-white/10 py-6 px-8 shadow-lg animate-fade-in rounded-b-2xl">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/food-co"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] hover:text-[#7D8C7C]"
            >
              Home
            </Link>
            <Link
              href="/food-co/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] hover:text-[#7D8C7C]"
            >
              Shop
            </Link>

          </nav>
        </div>
      )}

      {/* Main Contents */}
      <main className="flex-grow">{children}</main>

      {/* Floating App-like Bottom Navigation for Mobile */}
      {mounted && (
        <div className="md:hidden fixed bottom-6 inset-x-4 z-45 flex justify-center">
          <nav className="flex items-center justify-around w-full max-w-md bg-[#7D8C7C]/95 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-[24px] shadow-[0_8px_32px_rgba(125,140,124,0.35)] text-white">
            <Link
              href="/food-co"
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative w-full",
                pathname === "/food-co" ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              <Home className="h-[20px] w-[20px] stroke-[1.5]" />
              <span className="text-[8px] uppercase tracking-wider font-semibold">Home</span>
              {pathname === "/food-co" && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
            </Link>

            <Link
              href="/food-co/shop"
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative w-full",
                pathname?.startsWith("/food-co/shop") ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              <ShoppingBag className="h-[20px] w-[20px] stroke-[1.5]" />
              <span className="text-[8px] uppercase tracking-wider font-semibold">Shop</span>
              {pathname?.startsWith("/food-co/shop") && (
                <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
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
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center bg-white text-[8px] font-bold text-[#7D8C7C] rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[8px] uppercase tracking-wider font-semibold">Cart</span>
            </button>
          </nav>
        </div>
      )}

      {/* Luxury Culinary Footer */}
      <footer className="bg-[#1A1A1A] text-white/80 py-16 border-t border-[#1A1A1A]/10 rounded-none">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white mb-4">
                Food<span className="text-[#7D8C7C]">.co</span>
              </h3>
              <p className="text-xs max-w-xs leading-relaxed text-white/60">
                Premium culinary marketplace for organic ingredients and bespoke kitchenware. Elegant, organic, local.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Catalog</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><Link href="/food-co" className="hover:text-white transition-colors">Pantry Pantry</Link></li>
                <li><Link href="/food-co/shop" className="hover:text-white transition-colors">Gourmet Culinary</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">Sourcing</h4>
              <p className="text-xs leading-relaxed text-white/60">
                We team up with local organic farms and artisanal co-ops to bring fresh, unadulterated culinary items to your table.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-[10px] uppercase tracking-wider text-white/40">
            © {new Date().getFullYear()} Food.co. Certified Organic Ingredients.
          </div>
        </div>
      </footer>

      {/* Local Cart Drawer Overlay - Rounded style */}
      {mounted && isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-md bg-[#f9f9f9] shadow-2xl border-l border-white/10 transition-transform duration-300 transform translate-x-0 p-6 flex flex-col justify-between rounded-l-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/20">
                <h2 className="font-serif text-lg font-bold tracking-tight">Gourmet Cart ({cartCount})</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:text-[#7D8C7C] transition-colors rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                {items.length === 0 ? (
                  <p className="text-xs text-center py-12 text-[#1A1A1A]/50">Your gourmet cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b border-white/10 pb-4">
                      <div className="h-16 w-16 bg-[#efeded] relative overflow-hidden rounded-lg border border-white/10 shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-semibold leading-tight line-clamp-1">{item.product.name}</h4>
                          <span className="text-xs font-semibold text-[#1A1A1A]/60 mt-1 block">R{item.product.sale_price ?? item.product.price}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-md border border-[#1A1A1A]/20 hover:bg-[#efeded] transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-md border border-[#1A1A1A]/20 hover:bg-[#efeded] transition-colors"
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
              <div className="pt-6 border-t border-white/20 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold uppercase tracking-widest text-xs">Total Due</span>
                  <span className="font-serif text-lg font-bold">R{getCartTotal()}</span>
                </div>
                <Link
                  href="/food-co/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-[#1A1A1A] text-white hover:bg-[#7D8C7C] transition-all py-4 uppercase text-[10px] font-semibold tracking-widest rounded-lg"
                >
                  Checkout Gourmet
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
