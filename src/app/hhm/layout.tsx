"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  variable: "--font-libre-caslon",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

export default function HHMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/hhm/shop" },
    { name: "About", href: "/hhm/stories" },
    { name: "Contact", href: "/hhm/contact" },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-[#FFF9F0] text-[#332F2C] font-sans antialiased flex flex-col selection:bg-[#E87D2E]/20 selection:text-[#332F2C]",
        libreCaslon.variable,
        plusJakarta.variable
      )}
      style={{
        "--font-sans": "var(--font-plus-jakarta), sans-serif",
        "--font-serif": "var(--font-libre-caslon), serif",
      } as React.CSSProperties}
    >
      {/* TopNavBar */}
      <header
        className="sticky top-0 z-50 bg-[#FFF9F0] shadow-sm w-full transition-all duration-300 border-b border-[#6F4E37]/10"
        id="main-nav"
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-7xl mx-auto">
          <Link
            href="/hhm"
            className="flex items-center gap-2 group"
          >
            <img
              src="https://hotelhopeministries.org/wp-content/uploads/2025/11/Logo-1024x297.png"
              alt="Hotel Hope Store"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[#564338] hover:text-[#6F4E37] font-semibold text-sm transition-all duration-200 pb-1 border-b-2",
                    isActive
                      ? "text-[#E87D2E] border-[#E87D2E]"
                      : "border-transparent"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/hhm/cart"
              className="text-[#984800] hover:text-[#E87D2E] transition-colors duration-200 relative p-2 flex items-center"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#E87D2E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/hhm/donate"
              className="hidden md:flex bg-[#E87D2E] text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#984800] transition-colors shadow-sm"
            >
              Donate
            </Link>

            {/* Mobile Nav Menu Trigger (simply links to shop/donate for mobile simplicity) */}
            <Link
              href="/hhm/shop"
              className="md:hidden text-[#984800] p-2 flex items-center"
            >
              <span className="material-symbols-outlined">menu</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-[#f8e4da] border-t border-[#6F4E37]/10 mt-auto">
        <div className="w-full px-6 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
            <img
              src="https://hotelhopeministries.org/wp-content/uploads/2025/11/Logo-1024x297.png"
              alt="Hotel Hope Ministries Logo"
              className="h-10 w-auto object-contain mb-3"
            />
            <p className="text-sm text-[#564338]/80 max-w-sm font-sans">
              © {new Date().getFullYear()} Hotel Hope Ministries. Restoring dignity, one home at a time.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/hhm/stories" className="text-[#564338] hover:text-[#E87D2E] hover:underline transition-all">
              Our Mission
            </Link>
            <Link href="/hhm/shop" className="text-[#564338] hover:text-[#E87D2E] hover:underline transition-all">
              Shop
            </Link>
            <Link href="/hhm/donate" className="text-[#564338] hover:text-[#E87D2E] hover:underline transition-all">
              Donate
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
