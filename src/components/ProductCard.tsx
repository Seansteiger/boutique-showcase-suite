"use client";

import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Check, ShoppingCart, X, Cpu, Compass } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { formatPrice } from "@/lib/currency";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        salePrice?: number | null;
        category: string;
        image: string;
        brand?: string | null;
        stock?: number;
    };
    className?: string;
    priority?: boolean;
    showSaleBadge?: boolean;
}

export function ProductCard({ product, className, priority = false, showSaleBadge = false }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);
    const [shake, setShake] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currencySettings, setCurrencySettings] = useState<any>(null);
    const { trackView } = useAnalytics();
    
    const settings = useStoreSettings();
    const brandName = settings?.brandName || "SCENTED";
    const brandKey = brandName.toLowerCase();
    const isHapticEnabled = settings?.enabledWidgets?.includes("haptic-feedback-mock");

    const [userRole, setUserRole] = useState<string>("customer");

    useEffect(() => {
        const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
        if (savedUserStr) {
            try {
                const parsed = JSON.parse(savedUserStr);
                if (parsed.role) setUserRole(parsed.role);
            } catch (e) {}
        }
    }, []);

    const isOutOfStock = (product.stock || 0) <= 0;
    const isSale = Boolean(product.salePrice && product.salePrice < product.price);

    const retailPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const wholesalePrice = retailPrice * 0.55; 

    // Multi-currency live local sync
    useEffect(() => {
        const updateCurrency = () => {
            const savedCurrency = localStorage.getItem("user_currency");
            if (savedCurrency && settings) {
                let multiplier = 1.0;
                let symbol = "R";
                if (savedCurrency === "USD") { symbol = "$"; multiplier = 0.052; }
                else if (savedCurrency === "EUR") { symbol = "€"; multiplier = 0.048; }
                else if (savedCurrency === "GBP") { symbol = "£"; multiplier = 0.041; }
                setCurrencySettings({ currency: savedCurrency, currencySymbol: symbol, currencyMultiplier: multiplier });
            } else if (settings) {
                setCurrencySettings({
                    currency: settings.currency || "ZAR",
                    currencySymbol: settings.currencySymbol || "R",
                    currencyMultiplier: settings.currencyMultiplier || 1.0
                });
            }
        };

        updateCurrency();
        window.addEventListener("currency_changed", updateCurrency);
        return () => window.removeEventListener("currency_changed", updateCurrency);
    }, [settings]);

    const triggerHaptic = () => {
        if (isHapticEnabled) {
            if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(10);
            }
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        triggerHaptic();

        if (isOutOfStock) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        const isWholesale = userRole === "wholesale_stockist";
        const priceToSubmit = isWholesale ? wholesalePrice : product.salePrice;

        addItem({ 
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: isWholesale ? wholesalePrice : product.price,
            sale_price: priceToSubmit,
            image: product.image,
            category: product.category
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleProductClick = (e: React.MouseEvent) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            e.preventDefault();
            triggerHaptic();
            setIsDrawerOpen(true);
            trackView(product.id);
        } else {
            trackView(product.id);
        }
    };

    const cardRadiusClass = settings?.theme?.cardStyle === "sharp" 
        ? "rounded-none" 
        : settings?.theme?.cardStyle === "pill" 
            ? "rounded-[2.5rem]" 
            : settings?.theme?.cardStyle === "curved"
                ? "rounded-2xl"
                : "rounded-[2rem_0.5rem_2rem_0.5rem]";

    const btnRadiusClass = settings?.theme?.buttonRadius === "0px"
        ? "rounded-none"
        : settings?.theme?.buttonRadius === "4px"
            ? "rounded-sm"
            : settings?.theme?.buttonRadius === "8px"
                ? "rounded-lg"
                : settings?.theme?.buttonRadius === "9999px"
                    ? "rounded-full"
                    : "rounded-[2rem_0.5rem_2rem_0.5rem]";

    const showBorders = (settings?.theme as any)?.borderWidth && (settings?.theme as any)?.borderWidth !== "none";

    // ==========================================
    // 1. SLATE & CO (TECHNICAL PRODUCT CARD)
    // ==========================================
    if (brandKey.includes("slate")) {
        return (
            <>
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "group relative overflow-hidden bg-secondary/10 border border-border/10 font-sans shadow-sm hover:border-accent/40",
                        cardRadiusClass,
                        className
                    )}
                >
                    <Link href={`/shop/${product.slug}`} className="block overflow-hidden aspect-square relative bg-secondary/20" onClick={handleProductClick}>
                        <SafeImage
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={300}
                            priority={priority}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                        />
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
                            {isOutOfStock && (
                                <Badge className="bg-red-900/80 text-white rounded-none border border-red-500/20 text-[8px] tracking-wider uppercase font-mono px-2 py-0.5">
                                    [OUT_OF_STOCK]
                                </Badge>
                            )}
                            {showSaleBadge && isSale && !isOutOfStock && (
                                <Badge className="bg-accent text-black rounded-none border border-accent/25 text-[8px] tracking-wider uppercase font-mono px-2 py-0.5">
                                    [SALE_OFFER]
                                </Badge>
                            )}
                        </div>
                        
                        {/* Technical Specs overlay on hover */}
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 font-mono text-[9px] text-slate-300">
                            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                                <span>MODEL // CARRY</span>
                                <span>VER. 1.8</span>
                            </div>
                            <div className="space-y-1 text-left">
                                <p><span className="text-slate-500">CONSTRUCTION:</span> ALLOY SEAL</p>
                                <p><span className="text-slate-500">ORIGIN:</span> SOUTH AFRICA</p>
                                <p><span className="text-slate-500">SPECIFICATION:</span> OPTIMIZED</p>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={cn(
                                    "w-full py-2.5 bg-primary text-secondary hover:bg-accent hover:text-black font-bold uppercase tracking-widest text-[9px] transition-colors border border-primary/20",
                                    btnRadiusClass
                                )}
                            >
                                {isAdded ? "ADDED TO SYSTEM" : isOutOfStock ? "UNAVAILABLE" : "EXECUTE ADD"}
                            </button>
                        </div>
                    </Link>

                    <div className="p-4 space-y-2 text-left font-sans">
                        <div className="space-y-0.5">
                            <span className="text-[8px] font-mono text-accent uppercase tracking-widest block">
                                {product.brand || "SLATE & CO"} // CODE.{product.slug.substring(0, 3).toUpperCase()}
                            </span>
                            <h3 className="text-xs font-bold uppercase tracking-tight text-foreground line-clamp-1">
                                <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>{product.name}</Link>
                            </h3>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-border/5">
                            <span className="text-[10px] font-mono font-bold text-foreground">
                                {product.salePrice ? formatPrice(product.salePrice, currencySettings) : formatPrice(product.price, currencySettings)}
                            </span>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={isOutOfStock}
                                className="text-[8px] font-mono font-extrabold uppercase text-accent border border-accent/20 px-2 py-0.5 rounded-sm hover:bg-accent hover:text-black transition-colors"
                            >
                                {isAdded ? "ADDED" : "ADD"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* SLATE MOBILE SHEET */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" />
                            <motion.div
                                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-slate-800 p-6 pb-12 shadow-2xl flex flex-col md:hidden text-slate-100 font-sans"
                            >
                                <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6" onClick={() => setIsDrawerOpen(false)} />
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[8px] font-mono tracking-widest text-accent font-bold uppercase">SYSTEM CONFIGURATION SPEC //</span>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="relative aspect-square w-full max-w-[240px] mx-auto bg-slate-950 border border-slate-800 overflow-hidden rounded-xl">
                                        <SafeImage src={product.image} alt={product.name} width={240} height={240} className="object-cover h-full w-full" />
                                    </div>
                                    <div className="space-y-1 text-center font-mono">
                                        <h2 className="text-sm font-bold uppercase tracking-tight text-white">{product.name}</h2>
                                        <p className="text-[9px] text-accent font-bold uppercase tracking-widest">{product.brand || "SLATE & CO"}</p>
                                        <p className="text-xs text-white pt-1">{formatPrice(product.salePrice || product.price, currencySettings)}</p>
                                    </div>
                                    <div className="border border-slate-800 p-4 rounded-lg bg-slate-950/50 font-mono text-[9px] text-slate-400 space-y-1 text-left">
                                        <p><span className="text-slate-600">ID // REGISTRY:</span> {product.id.substring(0, 12)}</p>
                                        <p><span className="text-slate-600">SPECIFICATION:</span> MODULAR ENCLOSURE</p>
                                        <p><span className="text-slate-600">AVAILABILITY:</span> {isOutOfStock ? "UNAVAILABLE" : "INSTOCK // OPTIMIZED"}</p>
                                    </div>
                                    <Button
                                        onClick={(e) => { handleAddToCart(e); setTimeout(() => setIsDrawerOpen(false), 800); }}
                                        className="w-full py-6 bg-primary text-secondary hover:bg-accent hover:text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-none border border-slate-800"
                                        disabled={isOutOfStock}
                                    >
                                        {isAdded ? "ADDED TO CONFIG" : "INITIALIZE ADD (" + formatPrice(product.salePrice || product.price, currencySettings) + ")"}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ==========================================
    // 2. L'ARTELIER (STARK EDITORIAL CARD)
    // ==========================================
    if (brandKey.includes("artelier") || brandKey.includes("editorial")) {
        return (
            <>
                <div
                    className={cn(
                        "group relative overflow-hidden bg-white text-black border-2 border-black rounded-none transition-all duration-300 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
                        className
                    )}
                >
                    <Link href={`/shop/${product.slug}`} className="block overflow-hidden aspect-[3/4] relative bg-zinc-100 border-b-2 border-black" onClick={handleProductClick}>
                        <SafeImage
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={400}
                            priority={priority}
                            className="h-full w-full object-cover filter grayscale contrast-115 transition-all duration-[1s] group-hover:grayscale-0 group-hover:scale-103"
                        />
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                            {isOutOfStock && (
                                <Badge className="bg-black text-white rounded-none border-none text-[8px] tracking-[0.2em] uppercase font-sans font-black px-2.5 py-1">
                                    SOLD OUT
                                </Badge>
                            )}
                            {showSaleBadge && isSale && !isOutOfStock && (
                                <Badge className="bg-white text-black border border-black rounded-none text-[8px] tracking-[0.2em] uppercase font-sans font-black px-2.5 py-1">
                                    REDUCED
                                </Badge>
                            )}
                        </div>
                    </Link>

                    <div className="p-4 space-y-3 font-serif bg-white text-black text-left">
                        <div className="space-y-1">
                            <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-zinc-400 block">
                                {product.brand || "L'ARTELIER"} // ARCHIVE
                            </span>
                            <h3 className="text-sm font-black uppercase tracking-tight text-black line-clamp-1 leading-tight">
                                <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>{product.name}</Link>
                            </h3>
                        </div>
                        <div className="flex justify-between items-center border-t border-black pt-2 font-sans">
                            <span className="text-xs font-black text-black">
                                {product.salePrice ? formatPrice(product.salePrice, currencySettings) : formatPrice(product.price, currencySettings)}
                            </span>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={isOutOfStock}
                                className="text-[9px] font-black tracking-widest uppercase text-black border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors duration-250 rounded-none"
                            >
                                {isAdded ? "ADDED" : "ACQUIRE"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* EDITORIAL STARK MOBILE SHEET */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-none md:hidden" />
                            <motion.div
                                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                                transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black p-6 pb-12 shadow-2xl flex flex-col md:hidden text-black font-serif rounded-none"
                            >
                                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                                    <span className="text-[10px] font-sans font-black tracking-[0.3em] text-black uppercase">L&apos;ARTELIER ARCHIVE SPECIFICATION SHEET</span>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-1 border border-black hover:bg-black hover:text-white"><X className="h-4.5 w-4.5" /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="relative aspect-[3/4] w-full max-w-[220px] mx-auto bg-zinc-100 border-2 border-black overflow-hidden rounded-none">
                                        <SafeImage src={product.image} alt={product.name} width={220} height={293} className="object-cover h-full w-full filter grayscale contrast-110" />
                                    </div>
                                    <div className="space-y-1 text-center font-sans">
                                        <h2 className="text-lg font-black uppercase tracking-tight text-black leading-none">{product.name}</h2>
                                        <p className="text-[9px] tracking-[0.25em] font-bold text-zinc-500 uppercase">{product.brand || "L'ARTELIER"}</p>
                                        <p className="text-sm font-black text-black pt-1">{formatPrice(product.salePrice || product.price, currencySettings)}</p>
                                    </div>
                                    <div className="border-t border-b border-black py-4 font-sans text-[10px] text-zinc-600 space-y-1 text-left leading-relaxed">
                                        <p>Stark minimalist lookbook archive items represent high-density architectural craftsmanship. Strictly zero curves. Manufactured under verified local white label control.</p>
                                    </div>
                                    <Button
                                        onClick={(e) => { handleAddToCart(e); setTimeout(() => setIsDrawerOpen(false), 800); }}
                                        className="w-full py-6 bg-black text-white hover:bg-white hover:text-black font-sans text-[10px] uppercase font-black tracking-[0.3em] rounded-none border-2 border-black transition-colors"
                                        disabled={isOutOfStock}
                                    >
                                        {isAdded ? "ARCHIVED IN BAG" : "ACQUIRE SELECTION (" + formatPrice(product.salePrice || product.price, currencySettings) + ")"}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ==========================================
    // 3. OASIS CO (WARM ARTISANAL CARD)
    // ==========================================
    if (brandKey.includes("oasis") || brandKey.includes("sandstone")) {
        return (
            <>
                <div
                    className={cn(
                        "group relative overflow-hidden bg-white border border-[#402014]/5 rounded-[2.5rem] shadow-md hover:shadow-lg transition-all duration-500 font-serif text-left",
                        className
                    )}
                >
                    <Link href={`/shop/${product.slug}`} className="block overflow-hidden aspect-[4/5] relative bg-orange-50/20 p-2" onClick={handleProductClick}>
                        <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                            <SafeImage
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={375}
                                priority={priority}
                                className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-104"
                            />
                            <div className="absolute inset-0 bg-[#402014]/5 pointer-events-none" />
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                            {isOutOfStock && (
                                <Badge className="bg-[#402014] text-[#FAF8F5] hover:bg-[#402014] rounded-full text-[8px] tracking-widest uppercase px-3 py-1 font-sans border-none shadow-sm">
                                    Sold Out
                                </Badge>
                            )}
                            {showSaleBadge && isSale && !isOutOfStock && (
                                <Badge className="bg-[#D97706] text-white hover:bg-[#D97706] rounded-full text-[8px] tracking-widest uppercase px-3 py-1 font-sans border-none shadow-sm">
                                    Artisan Offer
                                </Badge>
                            )}
                        </div>
                    </Link>

                    <div className="p-5 pt-3 space-y-2 font-serif text-[#402014]">
                        <div className="space-y-0.5">
                            <span className="text-[9px] font-sans font-semibold tracking-widest uppercase text-[#D97706] block">
                                {product.brand || "OASIS CO"} // Handcrafted
                            </span>
                            <h3 className="text-base font-light tracking-wide text-[#402014] line-clamp-1 leading-snug">
                                <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>{product.name}</Link>
                            </h3>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-orange-100">
                            <span className="text-sm font-semibold">
                                {product.salePrice ? formatPrice(product.salePrice, currencySettings) : formatPrice(product.price, currencySettings)}
                            </span>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={isOutOfStock}
                                className="text-[9px] font-bold tracking-widest uppercase bg-[#402014] hover:bg-[#D97706] text-[#FAF8F5] px-4 py-1.5 transition-colors rounded-full shadow-sm"
                            >
                                {isAdded ? "Added" : "Acquire"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* SANDSTONE WARM ARTISANAL MOBILE SHEET */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-50 bg-[#402014]/30 backdrop-blur-sm md:hidden" />
                            <motion.div
                                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 28, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5] border-t border-orange-100 rounded-t-[3rem] p-6 pb-12 shadow-2xl flex flex-col md:hidden text-[#402014] font-serif"
                            >
                                <div className="w-12 h-1 bg-orange-200/50 rounded-full mx-auto mb-6" onClick={() => setIsDrawerOpen(false)} />
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[9px] font-sans tracking-widest text-[#D97706] font-bold uppercase">ARTISANAL WORKROOM CHAMBER SPEC //</span>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-full bg-orange-100 text-[#402014] hover:bg-orange-200"><X className="h-4 w-4" /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="relative aspect-square w-full max-w-[240px] mx-auto bg-white border border-orange-100 overflow-hidden rounded-[2.5rem] p-2 shadow-inner">
                                        <SafeImage src={product.image} alt={product.name} width={240} height={240} className="object-cover h-full w-full rounded-[2rem]" />
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <h2 className="text-lg font-light uppercase tracking-wide">{product.name}</h2>
                                        <p className="text-[9px] font-sans tracking-[0.2em] font-semibold text-[#D97706] uppercase">{product.brand || "OASIS CO"}</p>
                                        <p className="text-sm font-bold pt-1">{formatPrice(product.salePrice || product.price, currencySettings)}</p>
                                    </div>
                                    <div className="border border-orange-100/50 p-4 rounded-[1.5rem] bg-white/60 font-sans text-[11px] text-[#5c3e35] text-center leading-relaxed">
                                        Each piece is dried in the warm sun. Variations in color, curves, and textures are to be expected and celebrated.
                                    </div>
                                    <Button
                                        onClick={(e) => { handleAddToCart(e); setTimeout(() => setIsDrawerOpen(false), 800); }}
                                        className="w-full py-6 bg-[#402014] hover:bg-[#D97706] text-[#FAF8F5] font-sans text-[10px] uppercase font-bold tracking-widest rounded-full shadow-lg shadow-[#402014]/15"
                                        disabled={isOutOfStock}
                                    >
                                        {isAdded ? "Acquired to Collection" : "Acquire Piece (" + formatPrice(product.salePrice || product.price, currencySettings) + ")"}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ==========================================
    // 4. OCEAN MIST (COASTAL CAPSULE CARD)
    // ==========================================
    if (brandKey.includes("ocean") || brandKey.includes("mist")) {
        return (
            <>
                <motion.div
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "group relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-cyan-100/30 rounded-[2.5rem] shadow-lg hover:shadow-cyan-100/40 hover:shadow-xl font-sans text-left",
                        className
                    )}
                >
                    <Link href={`/shop/${product.slug}`} className="block overflow-hidden aspect-[4/5] relative bg-cyan-50/10 p-2" onClick={handleProductClick}>
                        <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                            <SafeImage
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={375}
                                priority={priority}
                                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                            />
                            <div className="absolute inset-0 bg-cyan-950/5 pointer-events-none" />
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                            {isOutOfStock && (
                                <Badge className="bg-[#14B8A6]/90 text-white rounded-full text-[8px] tracking-widest uppercase px-3 py-1 font-bold border-none shadow-sm">
                                    SOLD OUT
                                </Badge>
                            )}
                            {showSaleBadge && isSale && !isOutOfStock && (
                                <Badge className="bg-white/80 backdrop-blur-sm text-[#14B8A6] rounded-full text-[8px] tracking-widest uppercase px-3 py-1 font-extrabold border border-cyan-100 shadow-sm">
                                    ACTIVE OFFER
                                </Badge>
                            )}
                        </div>
                    </Link>

                    <div className="p-5 pt-3 space-y-2 font-sans text-cyan-950">
                        <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold tracking-widest uppercase text-cyan-600 block flex items-center gap-1">
                                <Compass className="h-3 w-3 animate-spin-slow" /> {product.brand || "OCEAN MIST"}
                            </span>
                            <h3 className="text-base font-extrabold uppercase tracking-tight text-cyan-950 line-clamp-1 leading-snug">
                                <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>{product.name}</Link>
                            </h3>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-cyan-100/50">
                            <span className="text-sm font-extrabold text-cyan-900">
                                {product.salePrice ? formatPrice(product.salePrice, currencySettings) : formatPrice(product.price, currencySettings)}
                            </span>
                            <button 
                                onClick={handleAddToCart} 
                                disabled={isOutOfStock}
                                className="text-[9px] font-extrabold tracking-widest uppercase bg-[#14B8A6] hover:bg-cyan-700 text-white px-4 py-2 transition-all rounded-full shadow-md hover:scale-105 active:scale-95"
                            >
                                {isAdded ? "Added" : "Acquire"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* OCEAN MIST COASTAL WELLNESS MOBILE SHEET */}
                <AnimatePresence>
                    {isDrawerOpen && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 z-50 bg-cyan-950/20 backdrop-blur-md md:hidden" />
                            <motion.div
                                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-[#F0F9FF] border-t border-white rounded-t-[3rem] p-6 pb-12 shadow-2xl flex flex-col md:hidden text-cyan-950 font-sans"
                            >
                                <div className="w-12 h-1 bg-cyan-200 rounded-full mx-auto mb-6" onClick={() => setIsDrawerOpen(false)} />
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[9px] tracking-widest text-cyan-600 font-extrabold uppercase flex items-center gap-1"><Compass className="h-3 w-3 animate-spin-slow" /> ACTIVE WELLNESS REGISTRY //</span>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 rounded-full bg-white text-cyan-950 hover:bg-cyan-100"><X className="h-4.5 w-4.5" /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="relative aspect-square w-full max-w-[240px] mx-auto bg-white border border-white p-2 overflow-hidden rounded-[2.5rem] shadow-xl">
                                        <SafeImage src={product.image} alt={product.name} width={240} height={240} className="object-cover h-full w-full rounded-[2rem]" />
                                    </div>
                                    <div className="space-y-1 text-center">
                                        <h2 className="text-lg font-black uppercase tracking-tight text-cyan-950">{product.name}</h2>
                                        <p className="text-[9px] tracking-[0.2em] font-extrabold text-cyan-600 uppercase">{product.brand || "OCEAN MIST"}</p>
                                        <p className="text-sm font-black pt-1 text-cyan-900">{formatPrice(product.salePrice || product.price, currencySettings)}</p>
                                    </div>
                                    <div className="border border-white p-4 rounded-[2rem] bg-white/50 text-[11px] text-cyan-800 text-center leading-relaxed">
                                        Rejuvenate daily. Coastal wellness capsule formulations are engineered specifically for active bodies.
                                    </div>
                                    <Button
                                        onClick={(e) => { handleAddToCart(e); setTimeout(() => setIsDrawerOpen(false), 800); }}
                                        className="w-full py-6 bg-[#14B8A6] hover:bg-cyan-700 text-white font-sans text-[10px] uppercase font-bold tracking-widest rounded-full shadow-lg shadow-cyan-950/15"
                                        disabled={isOutOfStock}
                                    >
                                        {isAdded ? "Added to Wellness Bag" : "Acquire Formulation (" + formatPrice(product.salePrice || product.price, currencySettings) + ")"}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // ==========================================
    // 5. DEFAULT: SCENTED (LUXURY CARD RETAINED)
    // ==========================================
    return (
        <>
            <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "group relative overflow-hidden bg-card transition-all hover:shadow-xl hover:border-accent/40 ambient-glow",
                    cardRadiusClass,
                    showBorders ? "border custom-border border-border" : "border-none",
                    className
                )}
            >
                <Link 
                    href={`/shop/${product.slug}`} 
                    className="block overflow-hidden aspect-[3/4] relative bg-secondary/10" 
                    onClick={handleProductClick}
                >
                    <SafeImage
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={400}
                        priority={priority}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                        {isOutOfStock && (
                            <motion.div
                                animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <Badge variant="destructive" className="font-bold tracking-wide rounded-none uppercase text-[9px] px-2.5 py-1">
                                    Sold Out
                                </Badge>
                            </motion.div>
                        )}

                        {showSaleBadge && isSale && !isOutOfStock && (
                            <Badge className="bg-accent text-black font-semibold tracking-widest rounded-none uppercase text-[9px] px-2.5 py-1 border-none hover:bg-accent">
                                Special Offer
                            </Badge>
                        )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1] hidden md:block">
                        <Button
                            onClick={handleAddToCart}
                            className={cn(
                                "w-full tracking-[0.2em] text-[10px] uppercase font-bold transition-all duration-300 py-5 shadow-sm border",
                                btnRadiusClass,
                                isAdded 
                                    ? "bg-green-600 border-green-600 hover:bg-green-700 text-white" 
                                    : "border-primary bg-primary text-secondary hover:bg-transparent hover:text-primary hover:border-primary"
                            )}
                            size="default"
                            disabled={isOutOfStock}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="h-3.5 w-3.5 mr-1" /> Added
                                </>
                            ) : isOutOfStock ? (
                                "Sold Out"
                            ) : (
                                <>
                                    <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Quick Add
                                </>
                            )}
                        </Button>
                    </div>
                </Link>

                <div className="p-4 space-y-2 text-left">
                    <div className="space-y-1">
                        <p className="text-[9px] font-semibold text-accent uppercase tracking-[0.25em]">
                            {product.brand || "SCENTED"}
                        </p>
                        <h3 className="font-serif font-medium text-base tracking-wide text-primary uppercase line-clamp-1">
                            <Link href={`/shop/${product.slug}`} onClick={handleProductClick}>
                                {product.name}
                            </Link>
                        </h3>
                    </div>

                    <div className="flex items-baseline gap-2">
                        {userRole === "wholesale_stockist" ? (
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground line-through">
                                    Retail: R{retailPrice.toFixed(2)}
                                </span>
                                <span className="text-sm font-extrabold text-amber-600 flex items-center gap-1">
                                    R{wholesalePrice.toFixed(2)} <span className="text-[9px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Wholesale</span>
                                </span>
                            </div>
                        ) : product.salePrice && product.salePrice < product.price ? (
                            <>
                                <span className="text-[11px] text-muted-foreground line-through">
                                    {formatPrice(product.price, currencySettings)}
                                </span>
                                <span className="text-sm font-bold text-red-500">
                                    {formatPrice(product.salePrice, currencySettings)}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-primary">
                                {formatPrice(product.price, currencySettings)}
                            </span>
                        )}
                    </div>

                    <button
                        className={cn(
                            "md:hidden rounded-full h-8 w-8 flex items-center justify-center border transition-colors absolute bottom-4 right-4",
                            isAdded ? "bg-green-600 border-green-600 text-white" : "bg-secondary/35 hover:bg-secondary/60 text-primary border-border/10"
                        )}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isAdded ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 z-50 bg-black backdrop-blur-sm md:hidden"
                        />
                        
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[32px] border-t border-border/10 p-6 pb-12 shadow-2xl flex flex-col md:hidden max-h-[88vh] overflow-y-auto text-left"
                        >
                            <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6 shrink-0" onClick={() => setIsDrawerOpen(false)} />
                            
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <span className="text-[10px] tracking-[0.3em] font-semibold text-accent uppercase">
                                    Sensory Detail Sheet
                                </span>
                                <button 
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="p-1 rounded-full bg-secondary/60 hover:bg-secondary focus:outline-none"
                                >
                                    <X className="h-4.5 w-4.5" />
                                </button>
                            </div>

                            <div className="space-y-6 font-sans">
                                <div className={cn("relative aspect-[3/4] w-full max-w-[260px] mx-auto bg-secondary/10 border border-border/10 overflow-hidden shadow-inner", cardRadiusClass)}>
                                    <SafeImage
                                        src={product.image}
                                        alt={product.name}
                                        width={260}
                                        height={347}
                                        className="object-cover h-full w-full"
                                    />
                                </div>

                                <div className="space-y-2 text-center">
                                    <h2 className="text-xl font-serif font-medium uppercase tracking-wide text-primary">
                                        {product.name}
                                    </h2>
                                    <p className="text-xs font-semibold text-accent uppercase tracking-widest">
                                        {product.brand || "SCENTED"}
                                    </p>
                                    <div className="text-base font-bold text-primary">
                                        {product.salePrice ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xs text-muted-foreground line-through">
                                                    {formatPrice(product.price, currencySettings)}
                                                </span>
                                                <span className="text-red-500">
                                                    {formatPrice(product.salePrice, currencySettings)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>{formatPrice(product.price, currencySettings)}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-[1px] bg-border/10" />
                                    <p className="text-xs font-light text-muted-foreground leading-relaxed text-center">
                                        Experience extreme sensory elegance. Carefully refined and aged in standard luxury cellars.
                                    </p>
                                    <div className="h-[1px] bg-border/10" />
                                </div>

                                <div className="pt-2 shrink-0">
                                    <Button
                                        onClick={(e) => {
                                            handleAddToCart(e);
                                            setTimeout(() => setIsDrawerOpen(false), 800);
                                        }}
                                        className={cn(
                                            "w-full py-6 tracking-[0.25em] text-[10px] uppercase font-bold shadow-lg transition-all duration-300",
                                            btnRadiusClass,
                                            isAdded ? "bg-green-600 text-white hover:bg-green-700" : "bg-primary text-secondary hover:bg-transparent hover:text-primary hover:border hover:border-primary"
                                        )}
                                        disabled={isOutOfStock}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check className="h-4 w-4 mr-1" /> Added to Cart
                                            </>
                                        ) : isOutOfStock ? (
                                            "Sold Out"
                                        ) : (
                                            <>
                                                <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart ({formatPrice(product.salePrice || product.price, currencySettings)})
                                            </>
                                        )}
                                    </Button>
                                    <button 
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="w-full text-center text-[9px] uppercase tracking-widest font-semibold text-muted-foreground pt-4 hover:underline"
                                    >
                                        Continue Exploring
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
