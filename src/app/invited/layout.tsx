"use client";

import { Bodoni_Moda, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Image as ImageIcon, Mail, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
});

export default function InvitedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#d4af37]/20 selection:text-[#1a1a1a] pb-24 md:pb-0",
        bodoni.variable,
        montserrat.variable
      )}
      style={{
        "--radius": "4px",
        "--font-sans": "var(--font-montserrat), sans-serif",
        "--font-serif": "var(--font-bodoni), serif",
      } as React.CSSProperties}
    >
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1A1A1A]/10 bg-[#F9F8F6]/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Brand Wordmark Logo */}
            <div className="flex">
              <Link href="/invited" className="font-serif text-2xl font-medium tracking-tighter text-[#1A1A1A] uppercase">
                INVITED<span className="text-[#d4af37]">.</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/invited"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname === "/invited" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                Home
              </Link>
              <Link
                href="/invited/about"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname === "/invited/about" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                About
              </Link>
              <Link
                href="/invited/gallery"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname === "/invited/gallery" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                Gallery
              </Link>
              <Link
                href="/invited/contact"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname === "/invited/contact" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                Contact
              </Link>
              <Link
                href="/invited/admin"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname.startsWith("/invited/admin") ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                Admin
              </Link>
            </nav>

            {/* Subtle branding or action placeholder for balanced flexbox spacing */}
            <div className="hidden md:flex items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 font-semibold font-sans">
                Showcase Suite
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Contents */}
      <main className="flex-grow">{children}</main>

      {/* Floating App-like Bottom Navigation for Mobile */}
      {mounted && (
        <div className="md:hidden fixed bottom-6 inset-x-4 z-50 flex justify-center">
          <nav className="flex items-center justify-around w-full max-w-md bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 px-4 py-3.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.3)] text-white">
            <Link
              href="/invited"
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                pathname === "/invited" ? "text-[#d4af37]" : "text-white/60 hover:text-white"
              )}
            >
              <Home className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Home</span>
              {pathname === "/invited" && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              )}
            </Link>
            
            <Link
              href="/invited/about"
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                pathname === "/invited/about" ? "text-[#d4af37]" : "text-white/60 hover:text-white"
              )}
            >
              <Info className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider font-medium">About</span>
              {pathname === "/invited/about" && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              )}
            </Link>

            <Link
              href="/invited/gallery"
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                pathname === "/invited/gallery" ? "text-[#d4af37]" : "text-white/60 hover:text-white"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Gallery</span>
              {pathname === "/invited/gallery" && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              )}
            </Link>

            <Link
              href="/invited/contact"
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                pathname === "/invited/contact" ? "text-[#d4af37]" : "text-white/60 hover:text-white"
              )}
            >
              <Mail className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Contact</span>
              {pathname === "/invited/contact" && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              )}
            </Link>

            <Link
              href="/invited/admin"
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
                pathname.startsWith("/invited/admin") ? "text-[#d4af37]" : "text-white/60 hover:text-white"
              )}
            >
              <Shield className="h-5 w-5" />
              <span className="text-[9px] uppercase tracking-wider font-medium">Admin</span>
              {pathname.startsWith("/invited/admin") && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
              )}
            </Link>
          </nav>
        </div>
      )}

      {/* Luxury Event Footer */}
      <footer className="bg-[#1A1A1A] text-[#F9F8F6]/80 py-16 border-t border-[#1A1A1A]/10 pb-32 md:pb-16">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-serif text-2xl font-medium tracking-tighter text-white uppercase mb-4">
                INVITED<span className="text-[#d4af37]">.</span>
              </h3>
              <p className="text-xs max-w-xs leading-relaxed text-[#F9F8F6]/60 mx-auto md:mx-0 font-light font-sans">
                Exclusive digital suites for bespoke events. Seamlessly planning attendance, seating codes, and guest registries.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">The Events</h4>
              <ul className="space-y-2 text-xs font-light">
                <li><Link href="/invited" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/invited/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/invited/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/invited/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/invited/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">Concierge</h4>
              <p className="text-xs leading-relaxed text-[#F9F8F6]/60 font-light font-sans">
                All details governed by the Ivory Committee. For assistance, contact the Gala organizers directly.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#F9F8F6]/10 text-center text-[10px] uppercase tracking-[0.2em] text-[#F9F8F6]/40 font-sans">
            © {new Date().getFullYear()} INVITED. Managed by Ivory Committee.
          </div>
        </div>
      </footer>
    </div>
  );
}
