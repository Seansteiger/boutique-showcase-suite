"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { motion, AnimatePresence } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen: isCartOpen, setIsOpen } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // Convex settings
  const settings = useStoreSettings();
  const isNativeBottomNav = settings === undefined ? true : settings?.enabledWidgets?.includes("native-bottom-nav");

  useEffect(() => {
    setMounted(true);
    
    // Dynamic mock auth context matching Convex SaaS profiles
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Determine dynamic Home link based on subdomain vs subdirectory
  const [homeHref, setHomeHref] = useState("/scented");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.startsWith("scented.") || hostname === "scented") {
        setHomeHref("/");
      }
    }
  }, []);

  if (!mounted) return null;

  // Setup navigation items
  const navItems: {
    label: string;
    href: string;
    icon: any;
    action: (() => void) | null;
    count?: number;
  }[] = [
    {
      label: "Home",
      href: homeHref,
      icon: Home,
      action: null
    },
    {
      label: "Shop",
      href: "/shop",
      icon: ShoppingBag,
      action: null
    },
    {
      label: "Profile",
      href: user ? "/account" : "/login",
      icon: User,
      action: null
    },
  ];

  return (
    <>
      <div 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 w-[260px] z-[49] bg-background/80 backdrop-blur-md border border-accent/20 px-2 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.15)] md:hidden transition-all duration-300", 
          isCartOpen ? "translate-y-28 opacity-0" : "translate-y-0"
        )}
        style={{
          borderRadius: settings?.theme?.buttonRadius || "var(--radius, 1rem)"
        }}
      >
        <div className="flex items-center justify-around h-14 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Determine active state
            const isActive = item.href === "/" 
              ? pathname === "/" || pathname === "/scented"
              : item.href !== "#" && pathname?.startsWith(item.href);

            const handleClick = (e: React.MouseEvent) => {
              if (item.action) {
                e.preventDefault();
                item.action();
              }
            };

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-0.5 relative focus:outline-none transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative flex flex-col items-center">
                  {/* Sliding Golden Dot or Capsule active indicator */}
                  {isActive && isNativeBottomNav && (
                    <motion.span
                      layoutId="navBubble"
                      className="absolute -top-1 w-6 h-0.5 bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <Icon 
                    className={cn(
                      "h-[20px] w-[20px] transition-transform duration-300 ease-out", 
                      isActive && isNativeBottomNav && "scale-110 text-accent"
                    )} 
                  />
                  {item.count !== undefined && item.count > 0 ? (
                    <span className="absolute -top-1.5 -right-2.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground ring-1 ring-background">
                      {item.count}
                    </span>
                  ) : null}
                </div>
                <span className={cn(
                  "text-[8px] font-medium tracking-wide transition-all duration-300",
                  isActive && isNativeBottomNav && "text-foreground font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>


    </>
  );
}
