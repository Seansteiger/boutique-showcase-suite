"use client";

import { Bodoni_Moda, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Menu, X, Shield } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#d4af37]/20 selection:text-[#1a1a1a]",
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
              {/* Authentic Serif Wordmark Logo (Stitch Design) */}
              <Link href="/invited" className="font-serif text-2xl font-medium tracking-tighter text-[#1A1A1A] uppercase">
                INVITED<span className="text-[#d4af37]">.</span>
              </Link>
              {/* Alternate dot logo kept for custom white-label client branding:
              <Link href="/invited" className="font-serif text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                Invited<span className="text-[#d4af37]">.</span>
              </Link>
              */}
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
                The Gala
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
                href="/invited/rsvp"
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:text-[#d4af37]",
                  pathname === "/invited/rsvp" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                RSVP
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
                  pathname === "/invited/admin" ? "text-[#d4af37]" : "text-[#1A1A1A]"
                )}
              >
                Guest List
              </Link>
            </nav>

            {/* Calendar Icon CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/invited/rsvp"
                className="hidden sm:flex items-center gap-2 border border-[#d4af37] px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
              >
                <Calendar className="h-3.5 w-3.5 text-[#d4af37]" /> Reserve Seat
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden text-[#1A1A1A] hover:text-[#d4af37] transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 z-30 bg-[#F9F8F6] border-b border-[#1A1A1A]/10 py-6 px-8 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/invited"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              The Gala
            </Link>
            <Link
              href="/invited/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              About
            </Link>
            <Link
              href="/invited/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              Gallery
            </Link>
            <Link
              href="/invited/rsvp"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              RSVP
            </Link>
            <Link
              href="/invited/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              Contact
            </Link>
            <Link
              href="/invited/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#d4af37]"
            >
              Guest List
            </Link>
          </nav>
        </div>
      )}

      {/* Main Contents */}
      <main className="flex-grow">{children}</main>

      {/* Luxury Event Footer */}
      <footer className="bg-[#1A1A1A] text-[#F9F8F6]/80 py-16 border-t border-[#1A1A1A]/10">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-serif text-2xl font-medium tracking-tighter text-white uppercase mb-4">
                INVITED<span className="text-[#d4af37]">.</span>
              </h3>
              <p className="text-xs max-w-xs leading-relaxed text-[#F9F8F6]/60 mx-auto md:mx-0 font-light">
                Exclusive digital suites for bespoke events. Seamlessly planning attendance, seating codes, and guest registries.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">The Events</h4>
              <ul className="space-y-2 text-xs font-light">
                <li><Link href="/invited" className="hover:text-white transition-colors">The Ivory Gala 2026</Link></li>
                <li><Link href="/invited/about" className="hover:text-white transition-colors">About the Gala</Link></li>
                <li><Link href="/invited/gallery" className="hover:text-white transition-colors">Event Gallery</Link></li>
                <li><Link href="/invited/rsvp" className="hover:text-white transition-colors">Attendance RSVP</Link></li>
                <li><Link href="/invited/contact" className="hover:text-white transition-colors">Concierge Inquiry</Link></li>
                <li><Link href="/invited/admin" className="hover:text-white transition-colors">Guest Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-4">Concierge</h4>
              <p className="text-xs leading-relaxed text-[#F9F8F6]/60 font-light">
                All details governed by the Ivory Committee. For assistance, contact the Gala organizers directly.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#F9F8F6]/10 text-center text-[10px] uppercase tracking-[0.2em] text-[#F9F8F6]/40">
            © {new Date().getFullYear()} Invited Suite. Managed by Ivory Committee.
          </div>
        </div>
      </footer>
    </div>
  );
}
