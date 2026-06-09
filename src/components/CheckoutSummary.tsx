"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useQuery, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ShoppingBag, ShieldCheck } from "lucide-react";

interface CheckoutSummaryProps {
    shippingCost: number;
    selectedZoneName: string;
    totalAmount: number;
    user: any;
    isGiftWrap?: boolean;
    giftWrapCost?: number;
}

export function CheckoutSummary({ shippingCost, selectedZoneName, totalAmount, user, isGiftWrap, giftWrapCost }: CheckoutSummaryProps) {
    const { items, discount, couponCode, applyCoupon, removeCoupon } = useCartStore();
    const [isOpen, setIsOpen] = useState(false);
    const [inputCoupon, setInputCoupon] = useState("");
    const [couponMessage, setCouponMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const convex = useConvex();
    
    // Fetch Wallet Coupons via Convex
    const availableCoupons = useQuery(
        api.coupons.getUserAvailableCoupons, 
        user ? { userId: user.id } : "skip"
    ) || [];

    const handleApplyCoupon = async () => {
        if (!inputCoupon) return;
        setCouponMessage(null);

        try {
            const coupon = await convex.query(
                api.coupons.getCouponByCode, 
                { code: inputCoupon.toUpperCase() }
            );

            if (!coupon) {
                setCouponMessage({ text: "Invalid or expired coupon.", type: 'error' });
                return;
            }

            const subtotal = items.reduce((total, item) => total + (item.product.sale_price ?? item.product.price) * item.quantity, 0);

            if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
                setCouponMessage({ text: `Minimum spend of R${coupon.minOrderAmount} required.`, type: 'error' });
                return;
            }

            let eligibleSubtotal = 0;
            // Since included_products / excluded_products were Supabase JSON columns, check if they exist on the Convex schema
            // If they are optional or not defined in schema.ts, let's fall back gracefully.
            const hasInclusions = false; // Convex schema.ts doesn't have included/excluded products in coupons defineTable
            const hasExclusions = false;

            items.forEach((item) => {
                const activePrice = item.product.sale_price ?? item.product.price;
                const isSale = !!item.product.sale_price;

                // Convex schema uses isActive and excludeSaleItems can be checked if defined
                // But let's check what properties exist in Convex schema for coupons:
                // coupons: defineTable({ code, discountType, discountValue, minOrderAmount, startDate, expiresAt, usageLimitTotal, usageLimitPerUser, usedCount, isActive })
                // There is no excludeSaleItems, included_products, excluded_products on Convex schema!
                eligibleSubtotal += activePrice * item.quantity;
            });

            if (eligibleSubtotal === 0) {
                setCouponMessage({ text: "Coupon not valid for the items in your cart.", type: 'error' });
                return;
            }

            let discountAmount = 0;
            if (coupon.discountType === 'percentage') {
                discountAmount = (eligibleSubtotal * coupon.discountValue) / 100;
            } else {
                discountAmount = Math.min(coupon.discountValue, eligibleSubtotal);
            }

            applyCoupon(coupon.code, discountAmount);
            setCouponMessage({ text: `Coupon applied! Saved R${discountAmount.toFixed(2)}`, type: 'success' });
        } catch (e: any) {
            setCouponMessage({ text: "Failed to apply coupon: " + e.message, type: 'error' });
        }
    };


    return (
        <div className="bg-card border border-border shadow-xl rounded-xl p-5 hover:border-primary/20 transition-all duration-300">
            {/* Clickable Toggle Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
            >
                <div className="space-y-1">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                        <span>Order Summary</span>
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                        </span>
                    </h2>
                    {!isOpen && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[240px] md:max-w-[180px] lg:max-w-[220px]">
                            {items.map(i => `${i.product.name} (x${i.quantity})`).join(", ")}
                        </p>
                    )}
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                    {!isOpen && (
                        <span className="text-base font-black text-primary">
                            R{totalAmount.toFixed(2)}
                        </span>
                    )}
                    {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm items-start gap-4">
                                <span className="text-muted-foreground leading-snug">
                                    {item.product.name}{" "}
                                    <span className="text-primary font-bold whitespace-nowrap">(x{item.quantity})</span>
                                </span>
                                <span className="font-semibold text-foreground shrink-0">
                                    R{((item.product.sale_price ?? item.product.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border/50 mt-4 pt-4 space-y-4 shadow-sm pb-2">
                        {/* Coupon Section */}
                        <div className="space-y-2.5">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">
                                Have a Promo Coupon?
                            </Label>

                            {/* Wallet Selection */}
                            {availableCoupons.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-1">
                                    {availableCoupons.map((c) => (
                                        <button
                                            key={c.code}
                                            type="button"
                                            onClick={() => setInputCoupon(c.code)}
                                            className="text-[11px] border border-primary/20 bg-primary/5 text-primary px-2.5 py-1 rounded-full hover:bg-primary/10 transition-colors flex items-center gap-1 font-bold shadow-sm"
                                        >
                                            <span>{c.code}</span>
                                            <span className="opacity-75">({c.discount_type === 'percentage' ? `${c.discount_value}%` : `R${c.discount_value}`})</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter discount code"
                                    value={inputCoupon}
                                    onChange={(e) => setInputCoupon(e.target.value)}
                                    className="bg-secondary/10 border-border/50 focus-visible:ring-primary/50 text-xs h-9 px-3"
                                />
                                <Button 
                                    type="button" 
                                    size="sm"
                                    className="shadow-sm h-9 px-4 font-semibold shrink-0" 
                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </Button>
                            </div>
                            {couponMessage && (
                                <p className={cn("text-[11px] font-semibold mt-1 animate-in fade-in slide-in-from-top-1", couponMessage.type === 'error' ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                                    {couponMessage.text}
                                </p>
                            )}
                            {couponCode && (
                                <div className="flex justify-between items-center bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/30 p-2.5 rounded-lg text-xs text-green-800 dark:text-green-300 shadow-sm mt-2 animate-in fade-in zoom-in-95">
                                    <span className="font-bold">Active: {couponCode}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-auto p-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-bold transition-colors shrink-0" 
                                        onClick={removeCoupon}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-muted-foreground pt-3 border-t border-border/30 text-xs">
                            <span>Subtotal</span>
                            <span className="font-semibold text-foreground">
                                R{(items.reduce((total, item) => total + (item.product.sale_price ?? item.product.price) * item.quantity, 0)).toFixed(2)}
                            </span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400 text-xs font-semibold">
                                <span>Discount</span>
                                <span>-R{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-muted-foreground text-xs">
                            <span>
                                Delivery{" "}
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-medium ml-1">
                                    {selectedZoneName}
                                </span>
                            </span>
                            <span className="font-semibold text-foreground">
                                {shippingCost === 0 ? 'FREE' : `R${shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        {isGiftWrap && giftWrapCost !== undefined && (
                            <div className="flex justify-between text-muted-foreground text-xs animate-in fade-in slide-in-from-top-1">
                                <span>🎁 Gift Packaging & Calligraphy Card</span>
                                <span className="font-semibold text-foreground">
                                    R{giftWrapCost.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-border/50 mt-3 pt-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground">Total Pay</span>
                        <span className="text-xl font-black text-primary drop-shadow-sm">
                            R{totalAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}


