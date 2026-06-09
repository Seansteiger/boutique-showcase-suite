"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, ShoppingCart, User, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { motion, AnimatePresence } from "framer-motion";
import { SearchAutocomplete } from "./SearchAutocomplete";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen: isCartOpen, setIsOpen } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));

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

  if (!mounted) return null;

  // Setup navigation items
  const navItems = [
    {
      label: "Home",
      href: "/scented",
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
      label: "Search",
      href: "#",
      icon: Search,
      action: () => setIsSearchOpen(true)
    },
    {
      label: "Cart",
      href: "#", // Prevent navigation
      icon: ShoppingCart,
      action: () => setIsOpen(true),
      count: cartCount
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
          "fixed bottom-0 left-0 right-0 z-[49] bg-background/80 backdrop-blur-xl border-t border-border/40 md:hidden transition-transform duration-300", 
          isCartOpen && "translate-y-full"
        )}
      >
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Determine active state
            const isActive = item.href === "/" 
              ? pathname === "/" 
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
                  "flex flex-col items-center justify-center w-full h-full space-y-1 relative focus:outline-none transition-colors",
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
                      className="absolute -top-2 w-6 h-1 bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <Icon 
                    className={cn(
                      "h-[22px] w-[22px] transition-transform duration-300 ease-out", 
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
                  "text-[9px] font-medium tracking-wide transition-all duration-300",
                  isActive && isNativeBottomNav && "text-foreground font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        {/* Safe area padding for iPhones with home indicator */}
        <div className="h-safe-area-bottom w-full bg-background/80 backdrop-blur-xl" />
      </div>

      {/* Dynamic Native Fullscreen Search Sheet */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-0 z-50 bg-background flex flex-col p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light tracking-[0.2em] uppercase text-foreground">Search</h2>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full bg-secondary hover:bg-secondary/80 focus:outline-none"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            
            <div className="flex-grow space-y-4">
              <SearchAutocomplete onSelect={() => setIsSearchOpen(false)} />
              
              <div className="pt-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {["Oud", "Sandalwood", "Bougies", "Cerise"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/shop?search=${tag}`);
                      }}
                      className="px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
