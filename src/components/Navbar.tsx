"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

import { useStoreSettings } from "@/hooks/useStoreSettings";


const CURRENCIES = [
  { code: "ZAR", symbol: "R", name: "ZAR (R)" },
  { code: "USD", symbol: "$", name: "USD ($)" },
  { code: "EUR", symbol: "€", name: "EUR (€)" },
  { code: "GBP", symbol: "£", name: "GBP (£)" },
];

export function Navbar({ initialCategories = [] }: { initialCategories?: any[] }) {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [activeCurrency, setActiveCurrency] = useState("ZAR");
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    
    // Convex Brand settings lookup
    const settings = useStoreSettings();
    const brandName = settings?.brandName || "SCENTED";

    const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
    const setIsCartOpen = useCartStore((state) => state.setIsOpen);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        
        // Dynamic mock auth context matching Convex SaaS profiles
        const savedUser = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Initialize currency selector from local storage or Convex settings
        const savedCurrency = typeof window !== "undefined" ? localStorage.getItem("user_currency") : null;
        if (savedCurrency) {
            setActiveCurrency(savedCurrency);
        } else if (settings?.currency) {
            setActiveCurrency(settings.currency);
        }
    }, [settings]);

    const handleUserClick = () => {
        if (user) {
            router.push("/account");
        } else {
            router.push("/login");
        }
    };

    const handleCurrencySelect = (code: string) => {
        setActiveCurrency(code);
        setIsCurrencyOpen(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("user_currency", code);
            // Dispatch a custom event to notify all components to re-render prices
            window.dispatchEvent(new Event("currency_changed"));
        }
    };

    const isAppHeaderBlur = settings === undefined ? true : settings?.enabledWidgets?.includes("app-header-blur");
    
    // Check if Announcement bar is enabled
    const showAnnouncement = settings === undefined 
        ? true 
        : (settings?.enabledWidgets?.includes("announcement-bar") || settings?.customTexts?.announcementBarText);
    
    const announcementText = settings?.customTexts?.announcementBarText || "Complimentary worldwide botanical shipping on orders over R1000";

    const navbarLayout = settings?.theme?.navbarStyle || "glass"; // "glass" | "editorial" | "minimal"

    return (
        <>
            {/* dynamic top Announcement Bar */}
            {mounted && showAnnouncement && announcementText && (
                <div className="w-full bg-accent text-accent-foreground py-2 px-4 text-center text-xs tracking-widest uppercase font-bold transition-all duration-300">
                    <p className="inline-block animate-fade-in">{announcementText}</p>
                </div>
            )}

            {/* Translucent Minimal iOS App Header for Mobile Viewports */}
            {isAppHeaderBlur && (
                <div className="sticky top-0 z-[49] w-full backdrop-blur-xl bg-background/80 border-b border-border/10 py-3.5 px-6 flex items-center justify-between md:hidden">
                    <Link href="/scented" className="font-serif italic text-2xl text-accent font-medium tracking-wide absolute left-1/2 -translate-x-1/2">
                        {brandName}
                    </Link>
                    <div className="flex items-center space-x-4 shrink-0 ml-auto">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-1 focus:outline-none"
                            aria-label="Open Cart"
                        >
                            <ShoppingCart className="h-[18px] w-[18px] text-foreground" />
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8px] font-black text-black ring-1 ring-background">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <nav className={cn(
                "sticky top-0 z-[49] w-full bg-background/80 backdrop-blur-xl transition-all duration-300",
                isAppHeaderBlur ? "hidden md:block" : "",
                navbarLayout === "editorial" ? "border-b-2 border-primary" : "border-b border-border/10",
            )}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className={cn(
                        "flex items-center justify-between relative gap-4",
                        navbarLayout === "minimal" ? "h-16" : "h-20"
                    )}>
                        
                        {/* 1. GLASS LAYOUT: Left Links, Center Logo, Right Actions */}
                        {navbarLayout === "glass" && (
                            <>
                                <div className="hidden md:flex items-center space-x-8 font-body text-xs tracking-widest uppercase font-semibold text-primary/80">
                                    <Link href="/shop" className="hover:text-accent transition-colors">
                                        Collections
                                    </Link>
                                    <Link href="/scent-discovery" className="hover:text-accent transition-colors">
                                        Scent Discovery
                                    </Link>
                                    <Link href="/contact" className="hover:text-accent transition-colors">
                                        Support
                                    </Link>
                                </div>

                                <Link 
                                    href="/scented" 
                                    className="font-serif italic font-normal text-2xl md:text-3.5xl text-accent absolute left-1/2 -translate-x-1/2 select-none hover:opacity-85 transition-opacity"
                                >
                                    {brandName}
                                </Link>
                            </>
                        )}

                        {/* 2. EDITORIAL LAYOUT: Left Bold Branding, Center Links, Right Actions */}
                        {navbarLayout === "editorial" && (
                            <>
                                <Link 
                                    href="/scented" 
                                    className="font-serif italic font-black text-2xl md:text-3.5xl text-accent tracking-wider select-none hover:opacity-85"
                                >
                                    {brandName}.
                                </Link>

                                <div className="hidden md:flex items-center space-x-10 font-body text-xs tracking-widest uppercase font-bold text-primary">
                                    <Link href="/shop" className="hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
                                        Collections
                                    </Link>
                                    <Link href="/scent-discovery" className="hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
                                        Scent Discovery
                                    </Link>
                                    <Link href="/contact" className="hover:underline decoration-accent decoration-2 underline-offset-4 transition-all">
                                        Support
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* 3. MINIMAL LAYOUT: Left Logo, Center inline links, Right Actions */}
                        {navbarLayout === "minimal" && (
                            <>
                                <div className="flex items-center space-x-8">
                                    <Link href="/scented" className="font-sans font-black tracking-tighter text-xl text-accent uppercase">
                                        {brandName}
                                    </Link>
                                    <div className="hidden lg:flex items-center space-x-6 font-body text-xs tracking-wider text-muted-foreground">
                                        <Link href="/shop" className="hover:text-primary transition-colors">
                                            Shop
                                        </Link>
                                        <Link href="/scent-discovery" className="hover:text-primary transition-colors">
                                            Discovery
                                        </Link>
                                        <Link href="/contact" className="hover:text-primary transition-colors">
                                            Support
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Right-Aligned Search, Currency & Shopping Actions */}
                        <div className="flex items-center space-x-2 md:space-x-3 shrink-0 ml-auto">

                            {/* Dynamic Currency Selector Badge */}
                            {mounted && (
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        className="h-9 px-2 flex items-center gap-1 text-[11px] font-bold tracking-wider bg-secondary/30 rounded-lg hover:bg-secondary/60 text-primary border border-border/10 focus:outline-none"
                                    >
                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                        <span>{activeCurrency}</span>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </button>

                                    {isCurrencyOpen && (
                                        <div className="absolute right-0 mt-1.5 w-28 rounded-xl bg-card border border-border/40 shadow-xl py-1 z-[99] animate-slide-up">
                                            {CURRENCIES.map((curr) => (
                                                <button
                                                    key={curr.code}
                                                    onClick={() => handleCurrencySelect(curr.code)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition-colors flex justify-between items-center",
                                                        activeCurrency === curr.code ? "text-accent bg-accent/5" : "text-primary"
                                                    )}
                                                >
                                                    <span>{curr.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <ModeToggle />
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative hover:bg-secondary/40"
                                aria-label="Cart"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                {mounted && cartCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-black ring-2 ring-background">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>

                            <Button 
                                variant="ghost" 
                                size="icon" 
                                aria-label="Account" 
                                onClick={handleUserClick} 
                                className="hidden md:flex hover:bg-secondary/40"
                            >
                                <User className={cn("h-5 w-5 text-primary", user ? "fill-accent/20" : "")} />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
