"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { SafeImage } from "@/components/SafeImage";
import { AddToCartButton } from "@/components/AddToCartButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PaymentIcons } from "@/components/PaymentIcons";

interface Attribute {
    key: string;
    value: string;
}

interface Variation {
    id: string;
    attributes: Record<string, string> | Attribute[]; // Handle both shapes to be safe
    price: number | null;
    stock: number;
    image: string | null;
}

interface ProductViewProps {
    product: any;
    variations: Variation[];
}

export function ProductView({ product, variations }: ProductViewProps) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryOverridden, setGalleryOverridden] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Browser back button closes lightbox instead of leaving the page
    const openLightbox = useCallback(() => {
        setLightboxOpen(true);
        window.history.pushState({ lightbox: true }, '');
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
    }, []);

    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            if (lightboxOpen) {
                setLightboxOpen(false);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [lightboxOpen]);

    // 1. Clean Gallery Logic
    const baseImages = useMemo(() => {
        const images = new Set<string>();
        if (product.image) images.add(product.image);
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach((img: string) => images.add(img));
        }
        return Array.from(images);
    }, [product.image, product.images]);
    // 2. Extract all unique Attributes and Options
    const attributeOptions = useMemo(() => {
        const options: Record<string, Set<string>> = {};

        variations.forEach(v => {
            const attrs = Array.isArray(v.attributes)
                ? v.attributes
                : Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value }));

            attrs.forEach(attr => {
                if (!options[attr.key]) options[attr.key] = new Set();
                options[attr.key].add(attr.value);
            });
        });

        return Object.entries(options).map(([key, values]) => ({
            key,
            values: Array.from(values).sort()
        }));
    }, [variations]);

    // 3. Find Matching Variation
    const selectedVariation = useMemo(() => {
        return variations.find(v => {
            const vAttrs = Array.isArray(v.attributes)
                ? v.attributes.reduce((acc: any, curr) => ({ ...acc, [curr.key]: curr.value }), {})
                : v.attributes;

            return Object.entries(selectedAttributes).every(([key, value]) =>
                vAttrs[key] === value
            );
        });
    }, [variations, selectedAttributes]);

    // 4. Pricing Logic (with proportional variation discounts)
    const { currentPrice, currentSalePrice, hasDiscount, discountPercentage } = useMemo(() => {
        const basePrice = product.price || 0;
        const baseSalePrice = product.salePrice || null;
        const isBaseOnSale = !!baseSalePrice && baseSalePrice < basePrice;

        const discountFactor = isBaseOnSale ? (basePrice - baseSalePrice) / basePrice : 0;
        const pct = Math.round(discountFactor * 100);

        let price = basePrice;
        let salePrice = baseSalePrice;

        if (selectedVariation?.price) {
            if (isBaseOnSale && discountFactor < 1) {
                // Variation price is treated as the SALE price
                salePrice = selectedVariation.price;
                // Reverse calculation to get the original "Was" price proportionally
                price = salePrice / (1 - discountFactor);
            } else {
                // No base sale, just use variation price as the regular price
                price = selectedVariation.price;
                salePrice = null;
            }
        }

        return {
            currentPrice: price,
            currentSalePrice: salePrice,
            hasDiscount: !!salePrice && salePrice < price,
            discountPercentage: pct
        };
    }, [product, selectedVariation]);

    // 5. Determine best default selection
    useEffect(() => {
        if (variations.length > 0 && Object.keys(selectedAttributes).length === 0) {
            const first = variations[0];
            const attrs = Array.isArray(first.attributes)
                ? first.attributes.reduce((acc: any, curr) => ({ ...acc, [curr.key]: curr.value }), {})
                : first.attributes;

            setSelectedAttributes(attrs as any);
        }
        // Reset gallery override when a new variation is chosen
        setGalleryOverridden(false);
    }, [variations, selectedAttributes]);

    // 6. Current Display Image logic
    // If user manually clicked a thumbnail, show it. 
    // Otherwise, if a variant image exists, show it. 
    // Finally, fallback to baseImages gallery.
    const currentImage = useMemo(() => {
        if (galleryOverridden) return baseImages[currentImageIndex] || product.image;
        if (selectedVariation?.image) return selectedVariation.image;
        return baseImages[currentImageIndex] || product.image;
    }, [galleryOverridden, selectedVariation, baseImages, currentImageIndex, product.image]);

    // Reset gallery index when searching thumbnails, but variation image takes priority if active
    const selectThumbnail = (idx: number) => {
        setCurrentImageIndex(idx);
        setGalleryOverridden(true);
    };

    // Mobile swipe handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (baseImages.length > 1) {
            if (isLeftSwipe) {
                setCurrentImageIndex(prev => (prev === baseImages.length - 1 ? 0 : prev + 1));
            }
            if (isRightSwipe) {
                setCurrentImageIndex(prev => (prev === 0 ? baseImages.length - 1 : prev - 1));
            }
        }
    };

    const priceToDisplay = currentSalePrice || currentPrice;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20">
                {/* Product Image Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div
                        className="relative aspect-square overflow-hidden rounded-xl bg-secondary/5 border group cursor-zoom-in"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onClick={openLightbox}
                    >
                        <SafeImage
                            src={currentImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain transition-transform duration-500"
                            priority
                        />

                        {/* Navigation Arrows (Gallery Only) */}
                        {!selectedVariation?.image && baseImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === 0 ? baseImages.length - 1 : prev - 1));
                                    }}
                                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === baseImages.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Pagination Dots (Mobile) */}
                        {!selectedVariation?.image && baseImages.length > 1 && (
                            <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {baseImages.map((_: string, idx: number) => (
                                    <span key={idx} className={cn("w-2 h-2 rounded-full", currentImageIndex === idx ? "bg-white" : "bg-white/50")} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Gallery (Base Images Only) */}
                    {baseImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {baseImages.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => selectThumbnail(idx)}
                                    className={cn(
                                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                        ((galleryOverridden || !selectedVariation?.image) && currentImageIndex === idx) ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                                    )}
                                >
                                    <SafeImage src={img} alt={`${product.name} ${idx}`} fill className="object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary/5 text-secondary text-xs font-semibold tracking-wide mb-2 uppercase">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{product.name}</h1>
                    </div>

                    {/* Price UI (Proportional Variation Sales) */}
                    <div className="space-y-1">
                        {hasDiscount ? (
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sale price active</span>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-3xl md:text-4xl font-bold text-red-600">R{priceToDisplay.toFixed(2)}</p>
                                    <p className="text-lg text-muted-foreground line-through decoration-red-400/50">R{currentPrice.toFixed(2)}</p>
                                    <span className="inline-block text-xs font-bold px-2 py-0.5 bg-red-600 text-white rounded-sm">
                                        -{discountPercentage}%
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-3xl md:text-4xl font-bold text-primary">R{priceToDisplay.toFixed(2)}</p>
                        )}
                    </div>

                    {/* Dynamic Attribute Selectors */}
                    {attributeOptions.map((option: any) => (
                        <div key={option.key} className="space-y-3">
                            <label className="text-sm font-medium leading-none">
                                {option.key}: <span className="text-muted-foreground">{selectedAttributes[option.key]}</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {option.values.map((val: string) => (
                                    <Button
                                        key={val}
                                        variant={selectedAttributes[option.key] === val ? "default" : "outline"}
                                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [option.key]: val }))}
                                        className={cn(
                                            "min-w-[3rem] px-3",
                                            selectedAttributes[option.key] === val ? "ring-2 ring-primary ring-offset-2" : ""
                                        )}
                                    >
                                        {val}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Description */}
                    <div className="prose prose-slate max-w-none text-muted-foreground">
                        {product.description.split('\n').map((paragraph: string, index: number) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Add To Cart */}
                    <div className="flex flex-col gap-6 pt-4 border-t border-b py-6">
                        <AddToCartButton
                            product={{
                                ...product,
                                price: currentPrice, // Original price (for cart display/logic if needed)
                                sale_price: currentSalePrice, // Current sale price
                                name: selectedVariation ? `${product.name} (${Object.values(selectedAttributes).join(', ')})` : product.name,
                                id: selectedVariation ? selectedVariation.id : product.id,
                                stock: selectedVariation ? selectedVariation.stock : (product.stock || 0)
                            }}
                        />

                        {/* Trust Bar */}
                        <div className="space-y-6 pt-6">
                            <div className="flex flex-col items-center gap-4 p-5 rounded-2xl bg-secondary/30 dark:bg-white/15 border-2 border-primary/20 shadow-sm transition-all duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="h-px w-8 bg-primary/30" />
                                    <span className="text-xs font-black text-foreground uppercase tracking-[0.3em]">Safe & Secure Payments</span>
                                    <div className="h-px w-8 bg-primary/30" />
                                </div>
                                <PaymentIcons variant="color" size="sm" className="justify-center" />
                            </div>
                        </div>
                    </div>

                    {/* Accordions — COLLAPSED by default */}
                    <div className="space-y-4">
                        <details className="group border-b pb-4 cursor-pointer">
                            <summary className="flex items-center justify-between font-medium list-none text-lg">
                                <span>Features & Specifications</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="mt-4 space-y-2 text-muted-foreground text-sm">
                                {(product.features && product.features.length > 0) ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {product.features.map((feature: string, i: number) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No specific features listed for this product.</p>
                                )}
                            </div>
                        </details>

                        <details className="group border-b pb-4 cursor-pointer">
                            <summary className="flex items-center justify-between font-medium list-none">
                                <span>Shipping & Delivery</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-muted-foreground mt-2">
                                Free shipping to all UJ & Wits campuses and areas surrounding Auckland Park.
                                Delivery charges may apply to areas outside a 2km radius of Auckland Park.
                            </p>
                        </details>
                    </div>

                </div>
            </div>

            {/* Fullscreen Image Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => { window.history.back(); }}
                >
                    {/* Close button */}
                    <button
                        onClick={() => { window.history.back(); }}
                        className="absolute top-4 right-4 z-[60] text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation in lightbox (Gallery Only) */}
                    {!selectedVariation?.image && baseImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(prev => (prev === 0 ? baseImages.length - 1 : prev - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(prev => (prev === baseImages.length - 1 ? 0 : prev + 1));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Lightbox image */}
                    <div
                        className="relative w-full h-[85vh] max-w-5xl cursor-zoom-out"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <SafeImage
                            src={currentImage}
                            alt={product.name}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Image counter */}
                    {!selectedVariation?.image && baseImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                            {currentImageIndex + 1} / {baseImages.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
