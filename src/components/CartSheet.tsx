"use client";

import { useEffect, useState, useRef } from "react";
import { X, Minus, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { useConvex, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { formatPrice } from "@/lib/currency";

export function CartSheet() {
    const { items, removeItem, updateQuantity, getCartTotal, discount, couponCode, applyCoupon, removeCoupon, isOpen, setIsOpen } = useCartStore();
    const onClose = () => setIsOpen(false);
    const [mounted, setMounted] = useState(false);
    const [inputCode, setInputCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [currencySettings, setCurrencySettings] = useState<any>(null);
    const convex = useConvex();
    
    // Convex settings
    const settings = useStoreSettings();
    const isNavigatingRef = useRef(false);

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

    const handleApplyCoupon = async () => {
        if (!inputCode) return;
        setVerifying(true);
        try {
            const coupon = await convex.query(
                api.coupons.getCouponByCode,
                { code: inputCode.toUpperCase() }
            );

            if (coupon) {
                const subtotal = getCartTotal() + discount; // Get gross total

                if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
                    alert(`Minimum spend of R${coupon.minOrderAmount} required.`);
                    setVerifying(false);
                    return;
                }

                let eligibleSubtotal = 0;
                items.forEach((item) => {
                    const activePrice = item.product.sale_price !== null && item.product.sale_price !== undefined 
                                        ? item.product.sale_price 
                                        : item.product.price;
                    eligibleSubtotal += activePrice * item.quantity;
                });

                if (eligibleSubtotal === 0) {
                    alert("Coupon not valid for the items in your cart.");
                    setVerifying(false);
                    return;
                }

                let discountAmount = 0;
                if (coupon.discountType === 'percentage') {
                    discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
                } else {
                    discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
                }

                applyCoupon(coupon.code, discountAmount);
                setInputCode("");
            } else {
                alert("Invalid or expired coupon.");
            }
        } catch (err: any) {
            alert("Error applying coupon: " + err.message);
        }
        setVerifying(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll, broadcast cart state, and handle browser history
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.dispatchEvent(new CustomEvent('cart-sheet-state', { detail: { open: true } }));
            
            // Push history state to handle back button
            window.history.pushState({ cartOpen: true }, '', '');
            
            const handlePopState = (e: PopStateEvent) => {
                onClose();
            };
            
            window.addEventListener('popstate', handlePopState);
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('popstate', handlePopState);
            };
        } else {
            document.body.style.overflow = '';
            window.dispatchEvent(new CustomEvent('cart-sheet-state', { detail: { open: false } }));
        }
    }, [isOpen, onClose]);

    // Handle manual closure (clicking X or backdrop) to clear history entry
    const handleClose = () => {
        if (isOpen && window.history.state?.cartOpen) {
            window.history.back();
        } else {
            onClose();
        }
    };

    if (!mounted) return null;

    // Free shipping threshold calculations
    const thresholdAmount = settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 1000;
    const baseSubtotal = getCartTotal();
    const remainingAmount = Math.max(thresholdAmount - baseSubtotal, 0);
    const progressPercent = Math.min((baseSubtotal / thresholdAmount) * 100, 100);

    const btnRadiusClass = settings?.theme?.buttonRadius === "0px"
        ? "rounded-none"
        : settings?.theme?.buttonRadius === "4px"
            ? "rounded-sm"
            : settings?.theme?.buttonRadius === "8px"
                ? "rounded-lg"
                : settings?.theme?.buttonRadius === "9999px"
                    ? "rounded-full"
                    : "rounded-[2rem_0.5rem_2rem_0.5rem]"; // default Scented asymmetric

    const cardRadiusClass = settings?.theme?.cardStyle === "sharp" 
        ? "rounded-none" 
        : settings?.theme?.cardStyle === "pill" 
            ? "rounded-2xl" 
            : settings?.theme?.cardStyle === "curved"
                ? "rounded-xl"
                : "rounded-[1.5rem_0.35rem_1.5rem_0.35rem]"; // asymmetric

    const showBorders = (settings?.theme as any)?.borderWidth && (settings?.theme as any)?.borderWidth !== "none";

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
            />

            {/* Slide-over Panel */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-xl transition-transform duration-300 ease-in-out transform border-l border-border/10",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full font-sans">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
                        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Shopping Cart</h2>
                        <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-lg">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Dynamic Free Shipping Progress Banner */}
                    {items.length > 0 && (
                        <div className="px-6 py-4 bg-secondary/30 border-b border-border/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <Truck className="h-4 w-4 text-accent shrink-0" />
                                {remainingAmount > 0 ? (
                                    <span className="font-medium text-muted-foreground">
                                        Add <strong className="text-primary font-bold">{formatPrice(remainingAmount, currencySettings)}</strong> more for <strong className="text-accent uppercase font-bold">free shipping</strong>!
                                    </span>
                                ) : (
                                    <span className="font-bold text-accent uppercase tracking-wider animate-pulse">
                                        Congratulations! Free Shipping Unlocked! 🎉
                                    </span>
                                )}
                            </div>
                            
                            {/* Track bar */}
                            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div 
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        remainingAmount === 0 ? "bg-green-600" : "bg-accent"
                                    )} 
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <p className="text-sm tracking-wide text-muted-foreground">Your cart is empty.</p>
                                <Button 
                                    onClick={handleClose} 
                                    className={cn("tracking-widest text-[10px] uppercase font-black py-5", btnRadiusClass)}
                                    asChild
                                >
                                    <Link href="/shop">Continue Shopping</Link>
                                </Button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.product.id} className="flex gap-4">
                                    <div className={cn(
                                        "relative h-20 w-20 overflow-hidden bg-secondary/5 shrink-0", 
                                        cardRadiusClass,
                                        showBorders ? "border border-border" : "border-none"
                                    )}>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="grid gap-1">
                                            <h3 className="font-serif uppercase text-sm font-semibold text-primary line-clamp-1">{item.product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-primary">
                                                    {formatPrice(item.product.sale_price ?? item.product.price, currencySettings)}
                                                </p>
                                                {item.product.sale_price && (
                                                    <p className="text-[10px] text-muted-foreground line-through">
                                                        {formatPrice(item.product.price, currencySettings)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg"
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 ml-auto text-destructive hover:text-destructive/90 rounded-lg"
                                                onClick={() => removeItem(item.product.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-border/10 px-6 py-6 space-y-4">
                            {/* Coupon Logic */}
                            <div className="space-y-2">
                                {couponCode ? (
                                    <div className="flex items-center justify-between text-xs bg-green-500/10 p-2 rounded-xl text-green-600 font-semibold border border-green-500/20">
                                        <span>Coupon: {couponCode}</span>
                                        <Button variant="ghost" size="sm" onClick={() => removeCoupon()} className="h-6 w-6 p-0 hover:bg-transparent text-green-600 rounded-full">
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Promo Code"
                                            value={inputCode}
                                            onChange={(e) => setInputCode(e.target.value)}
                                            className="h-9 text-xs rounded-xl bg-secondary/20"
                                        />
                                        <Button size="sm" onClick={handleApplyCoupon} disabled={verifying} variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold shrink-0">
                                            {verifying ? "..." : "Apply"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 pt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getCartTotal() + discount, currencySettings)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-xs text-green-600 font-semibold">
                                        <span>Discount</span>
                                        <span>-{formatPrice(discount, currencySettings)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm font-bold pt-2 text-primary uppercase tracking-wider border-t border-border/10 mt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(getCartTotal(), currencySettings)}</span>
                                </div>
                            </div>

                            <Button 
                                className={cn("w-full py-6 tracking-[0.2em] text-[10px] uppercase font-black shadow-lg", btnRadiusClass)}
                                asChild
                            >
                                <Link
                                    href="/checkout"
                                    onClick={() => {
                                        isNavigatingRef.current = true;
                                        onClose();
                                    }}
                                >
                                    Proceed to Checkout
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
