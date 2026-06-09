"use client";

export const dynamic = 'force-dynamic';

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { Loader2, X, MapPin, Truck, Gift, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { useStoreSettings } from "@/hooks/useStoreSettings";

const shippingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    streetAddress: z.string().min(5, "Street address is required"),
    suburb: z.string().min(2, "Suburb is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal Code is required"),
});

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getCartTotal, clearCart, couponCode, removeItem } = useCartStore();
    const cartTotal = getCartTotal();
    const settings = useStoreSettings();

    // Auth & UI State
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Shipping State
    const [selectedZoneId, setSelectedZoneId] = useState('zone-standard');
    const [shippingCost, setShippingCost] = useState(85);
    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const [addressValues, setAddressValues] = useState({
        streetAddress: "",
        suburb: "",
        city: "",
        postalCode: ""
    });

    // Premium Gifting States
    const [isGiftWrap, setIsGiftWrap] = useState(false);
    const [giftCardMessage, setGiftCardMessage] = useState("");

    // Google Maps Autocomplete State
    const streetAddressRef = useRef<HTMLInputElement>(null);
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

    // Dynamic shipping zones based on the order value and store settings
    const freeThreshold = settings?.freeShippingThreshold ?? 1000;
    const isFreeStandard = cartTotal >= freeThreshold;

    const zones = [
        { 
            id: 'zone-standard', 
            name: 'Standard Courier Delivery (Nationwide)', 
            price: isFreeStandard ? 0 : 85, 
            desc: isFreeStandard 
                ? `Complimentary delivery (order exceeds R${freeThreshold})` 
                : `Deliver directly to your door (2-4 business days)` 
        },
        { 
            id: 'zone-express', 
            name: 'Overnight Express Delivery (Nationwide)', 
            price: 140, 
            desc: 'Prioritized overnight/express courier (1-2 business days)' 
        },
        { 
            id: 'zone-collection', 
            name: 'Bespoke Showroom Pick-up', 
            price: 0, 
            desc: 'Collect from our main Sandton showroom hub (Mon-Fri, 9am-5pm)' 
        },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
            setIsGoogleMapsLoaded(true);
        }
    }, []);

    // Initialize Autocomplete
    useEffect(() => {
        if (!isGoogleMapsLoaded || !streetAddressRef.current || typeof window === 'undefined' || !(window as any).google) return;

        try {
            const autocomplete = new (window as any).google.maps.places.Autocomplete(streetAddressRef.current, {
                componentRestrictions: { country: "za" },
                fields: ["address_components", "geometry"],
                types: ["address"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.address_components) return;

                let streetNumber = "";
                let route = "";
                let suburb = "";
                let city = "";
                let postalCode = "";

                place.address_components.forEach((component: any) => {
                    const types = component.types;
                    if (types.includes("street_number")) streetNumber = component.long_name;
                    if (types.includes("route")) route = component.long_name;
                    if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) suburb = component.long_name;
                    if (types.includes("locality") || types.includes("administrative_area_level_2")) city = component.long_name;
                    if (types.includes("postal_code")) postalCode = component.long_name;
                });

                setAddressValues(prev => {
                    const newAddress = { ...prev };
                    const newStreet = `${streetNumber} ${route}`.trim();
                    if (newStreet) newAddress.streetAddress = newStreet;
                    
                    if (suburb) {
                        newAddress.suburb = suburb;
                    } else if (city) {
                        newAddress.suburb = city;
                    }

                    if (city) newAddress.city = city;
                    if (postalCode) newAddress.postalCode = postalCode;

                    return newAddress;
                });

                setShowAddressDetails(true);
            });
        } catch (e) {
            console.error("Google Maps Autocomplete Error:", e);
        }
    }, [isGoogleMapsLoaded]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Update shipping cost when zone changes
    useEffect(() => {
        const zone = zones.find(z => z.id === selectedZoneId);
        setShippingCost(zone ? zone.price : 85);
    }, [selectedZoneId, isFreeStandard]);

    // Cart Reconstruction & Coupon Hydration from URL Parameters (Auto-recovery support)
    const searchParams = useSearchParams();
    const convex = useConvex();
    const { setItems: overwriteCartItems } = useCartStore();

    useEffect(() => {
        const hydrateFromRecovery = async () => {
            const recoverCartId = searchParams.get("recover_cart");
            const couponParam = searchParams.get("coupon");

            if (recoverCartId) {
                try {
                    const recoveredCart = await convex.query(
                        api.carts.getCartById,
                        { cartId: recoverCartId as any }
                    );

                    if (recoveredCart && recoveredCart.items && recoveredCart.items.length > 0) {
                        overwriteCartItems(recoveredCart.items);
                        toast.success("Welcome back! Your premium cart has been restored.");
                    }
                } catch (err) {
                    console.error("Cart recovery hydration failed:", err);
                }
            }

            if (couponParam) {
                setTimeout(() => {
                    const couponInputEl = document.querySelector('input[placeholder="Enter discount code"]') as HTMLInputElement;
                    if (couponInputEl) {
                        couponInputEl.value = couponParam.toUpperCase();
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                        nativeInputValueSetter?.call(couponInputEl, couponParam.toUpperCase());
                        couponInputEl.dispatchEvent(new Event('input', { bubbles: true }));

                        const applyBtn = couponInputEl.nextElementSibling as HTMLButtonElement;
                        if (applyBtn) applyBtn.click();
                    }
                }, 1500);
            }
        };

        hydrateFromRecovery();
    }, [searchParams, convex, overwriteCartItems]);

    // Check User & Fetch Session
    useEffect(() => {
        const checkUser = () => {
            try {
                const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
                if (!savedUserStr) {
                    router.push("/login?redirect=/checkout");
                    return;
                }
                setUser(JSON.parse(savedUserStr));
            } catch (err) {
                console.error("Auth check failed:", err);
                setError("Failed to authenticate. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, [router]);

    const giftWrapCost = isGiftWrap ? 75 : 0;
    const totalAmount = cartTotal + shippingCost + giftWrapCost;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        if (!user) {
            setError("You must be logged in to place an order.");
            setIsProcessing(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const rawData = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            streetAddress: formData.get("streetAddress"),
            suburb: formData.get("suburb"),
            city: formData.get("city"),
            postalCode: formData.get("postalCode"),
        };

        let finalAddress = "";

        if (selectedZoneId === 'zone-collection') {
            if (!rawData.firstName || !rawData.lastName || !rawData.email) {
                setValidationErrors({ 
                    firstName: !rawData.firstName ? "Required" : "", 
                    lastName: !rawData.lastName ? "Required" : "", 
                    email: !rawData.email ? "Required" : "" 
                });
                setIsProcessing(false);
                return;
            }
            finalAddress = `[Collection] Sandton Showroom Pick-up Hub`;
        } else {
            const result = shippingSchema.safeParse(rawData);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                let hasHiddenErrors = false;

                result.error.issues.forEach((issue) => {
                    const fieldName = String(issue.path[0]);
                    fieldErrors[fieldName] = issue.message;

                    if (['suburb', 'city', 'postalCode'].includes(fieldName)) {
                        hasHiddenErrors = true;
                    }
                });

                setValidationErrors(fieldErrors);

                if (hasHiddenErrors) {
                    setShowAddressDetails(true);
                }

                setIsProcessing(false);
                window.scrollTo({ top: 300, behavior: 'smooth' });
                return;
            }
            const aptSuite = formData.get("aptSuite") as string;
            const province = formData.get("province") as string;
            finalAddress = [
                rawData.streetAddress,
                aptSuite ? `(Unit: ${aptSuite})` : '',
                rawData.suburb,
                rawData.city,
                rawData.postalCode,
                province
            ].filter(Boolean).join(", ");
        }

        formData.append("address", finalAddress);
        setValidationErrors({});

        formData.append("userId", user.id);
        formData.append("shippingZone", selectedZoneId);
        formData.append("shippingCost", shippingCost.toString());
        formData.append("isGiftWrap", isGiftWrap ? "true" : "false");
        formData.append("giftCardMessage", giftCardMessage);
        if (couponCode) formData.append("couponCode", couponCode);

        try {
            const { placeOrderAction } = await import("@/app/actions/checkout");
            const result = await placeOrderAction(formData, items, totalAmount);

            if (result.error) throw new Error(result.error);

            if (result.success && result.yoco) {
                if (user?.role === "wholesale_stockist") {
                    clearCart();
                    router.push(`/checkout/success?order_id=${result.orderId}&b2b=true`);
                    return;
                }

                // Redirect to Yoco payment gateway
                const paymentUrl = new URL("https://pay.yoco.com/scented-checkout-gateway");
                paymentUrl.searchParams.append("amount", totalAmount.toFixed(2));
                paymentUrl.searchParams.append("reference", result.orderId || "Order");

                const successUrl = `${window.location.origin}/checkout/success?order_id=${result.orderId}`;
                paymentUrl.searchParams.append("redirectOnPaymentSuccess", successUrl);

                window.location.href = paymentUrl.toString();
                return;

            } else if (result.success && result.orderId) {
                clearCart();
                router.push(`/checkout/success?order_id=${result.orderId}`);
            } else {
                throw new Error("Order placement failed without error message.");
            }
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to place order.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-sans text-xs">Loading checkout...</div>;

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-6 max-w-md">
                <h1 className="text-2xl font-serif uppercase tracking-widest text-primary">Your cart is empty</h1>
                <p className="text-xs text-muted-foreground">Select signature items from our catalog to proceed.</p>
                <Button asChild className="rounded-[2rem_0.5rem_2rem_0.5rem] px-8 py-5">
                    <Link href="/shop">Explore Collection</Link>
                </Button>
            </div>
        )
    }

    const defaultFirstName = user?.name ? user.name.split(" ")[0] : "";
    const defaultLastName = user?.name ? user.name.split(" ").slice(1).join(" ") : "";

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="afterInteractive"
                onLoad={() => setIsGoogleMapsLoaded(true)}
            />
            <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-6xl font-sans text-xs mb-24">
                
                {/* Visual Editorial Header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-border/10">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Secured Transaction</span>
                        <h1 className="text-2xl md:text-3xl font-serif uppercase tracking-wider text-primary mt-1">Checkout Workspace</h1>
                    </div>
                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 hover:bg-secondary/35 rounded-full shrink-0">
                        <Link href="/shop" onClick={() => window.dispatchEvent(new CustomEvent('cart-sheet-state', { detail: { open: true } }))}>
                            <X className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {error && (
                    <div className="mb-6">
                        <Alert variant="destructive" className="rounded-xl border-red-500/10 bg-red-500/5">
                            <AlertDescription className="text-red-700 text-xs">{error}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {user?.role === "wholesale_stockist" && cartTotal < 3000 && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <Alert className="border-amber-500 bg-amber-500/5 rounded-xl">
                            <AlertDescription className="text-amber-700 text-xs font-semibold flex items-center gap-2">
                                <span>⚠️</span>
                                <span><strong>B2B Minimum Order Required:</strong> Your wholesale subtotal must be at least <strong>R3,000.00</strong> to complete checkout. Current cart: <strong>R{cartTotal.toFixed(2)}</strong>.</span>
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                    
                    {/* Left Column - Shipping & Billing Fields */}
                    <div className="md:col-span-7 space-y-10">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            
                            {/* Step 1: Delivery Mode */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center font-sans text-[9px] font-bold">1</span>
                                    Select Shipping Method
                                </h3>
                                
                                <RadioGroup
                                    value={selectedZoneId}
                                    onValueChange={setSelectedZoneId}
                                    className="grid grid-cols-1 gap-3.5"
                                >
                                    {zones.map((zone) => (
                                        <div 
                                            key={zone.id} 
                                            className={cn(
                                                "flex items-start gap-3 p-4 border rounded-2xl transition-all cursor-pointer relative",
                                                selectedZoneId === zone.id 
                                                    ? "border-accent bg-accent/5 shadow-sm" 
                                                    : "border-border/10 bg-card hover:bg-secondary/15"
                                            )}
                                            onClick={() => setSelectedZoneId(zone.id)}
                                        >
                                            <RadioGroupItem value={zone.id} id={zone.id} className="mt-0.5 text-accent border-accent focus:ring-accent" />
                                            <div className="grid gap-1 w-full leading-normal">
                                                <div className="flex justify-between items-center w-full">
                                                    <Label htmlFor={zone.id} className="font-bold text-[10px] tracking-wide text-foreground uppercase cursor-pointer">
                                                        {zone.name}
                                                    </Label>
                                                    <span className="font-bold text-accent">
                                                        {zone.price === 0 ? 'FREE' : `R${zone.price}`}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {zone.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Step 2: Customer Contact info */}
                            <div className="space-y-4">
                                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center font-sans text-[9px] font-bold">2</span>
                                    Billing Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firstName" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                                        <Input id="firstName" name="firstName" defaultValue={defaultFirstName} required className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.firstName && "border-red-500")} />
                                        {validationErrors.firstName && <p className="text-[9px] text-red-500 mt-1">{validationErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lastName" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                                        <Input id="lastName" name="lastName" defaultValue={defaultLastName} required className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.lastName && "border-red-500")} />
                                        {validationErrors.lastName && <p className="text-[9px] text-red-500 mt-1">{validationErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                    <Input id="email" name="email" type="email" defaultValue={user?.email} required className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.email && "border-red-500")} />
                                    {validationErrors.email && <p className="text-[9px] text-red-500 mt-1">{validationErrors.email}</p>}
                                </div>
                            </div>

                            {/* Step 3: Address (Hidden if collection selected) */}
                            {selectedZoneId !== 'zone-collection' ? (
                                <div className="space-y-4">
                                    <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                        <span className="h-5 w-5 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center font-sans text-[9px] font-bold">3</span>
                                        Delivery Address
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="streetAddress" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                                            <Input
                                                id="streetAddress"
                                                name="streetAddress"
                                                placeholder="Search or enter address manually"
                                                required
                                                className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.streetAddress && "border-red-500")}
                                                value={addressValues.streetAddress}
                                                onChange={handleAddressChange}
                                                ref={streetAddressRef}
                                                autoComplete="off"
                                            />
                                            {validationErrors.streetAddress && <p className="text-[9px] text-red-500 mt-1">{validationErrors.streetAddress}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="aptSuite" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Apartment, Suite, Unit (Optional)</Label>
                                            <Input id="aptSuite" name="aptSuite" placeholder="e.g. Unit 25" className="bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl" />
                                        </div>

                                        {!showAddressDetails && !validationErrors.suburb && !validationErrors.city && !validationErrors.postalCode && (
                                            <button
                                                type="button"
                                                className="text-[9px] font-bold uppercase tracking-wider text-accent hover:underline flex items-center gap-1.5 mt-2"
                                                onClick={() => setShowAddressDetails(true)}
                                            >
                                                + Enter Suburb/City Details Manually
                                            </button>
                                        )}

                                        <div className={cn("space-y-4", showAddressDetails || validationErrors.suburb || validationErrors.city || validationErrors.postalCode ? "block animate-in fade-in slide-in-from-top-2" : "hidden")}>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="suburb" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Suburb</Label>
                                                <Input
                                                    id="suburb"
                                                    name="suburb"
                                                    placeholder="e.g. Sandton"
                                                    required={selectedZoneId !== 'zone-collection'}
                                                    className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.suburb && "border-red-500")}
                                                    value={addressValues.suburb}
                                                    onChange={handleAddressChange}
                                                />
                                                {validationErrors.suburb && <p className="text-[9px] text-red-500 mt-1">{validationErrors.suburb}</p>}
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-1 space-y-1.5">
                                                    <Label htmlFor="postalCode" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Postal Code</Label>
                                                    <Input
                                                        id="postalCode"
                                                        name="postalCode"
                                                        placeholder="2196"
                                                        required={selectedZoneId !== 'zone-collection'}
                                                        className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.postalCode && "border-red-500")}
                                                        value={addressValues.postalCode}
                                                        onChange={handleAddressChange}
                                                    />
                                                    {validationErrors.postalCode && <p className="text-[9px] text-red-500 mt-1">{validationErrors.postalCode}</p>}
                                                </div>
                                                <div className="col-span-2 space-y-1.5">
                                                    <Label htmlFor="city" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">City</Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        placeholder="Sandton"
                                                        required={selectedZoneId !== 'zone-collection'}
                                                        className={cn("bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl", validationErrors.city && "border-red-500")}
                                                        value={addressValues.city}
                                                        onChange={handleAddressChange}
                                                    />
                                                    {validationErrors.city && <p className="text-[9px] text-red-500 mt-1">{validationErrors.city}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="province" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Province</Label>
                                                <Input id="province" name="province" defaultValue="Gauteng" className="bg-secondary/15 border-border/10 text-xs px-3.5 py-4 rounded-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                        <span className="h-5 w-5 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center font-sans text-[9px] font-bold">3</span>
                                        Showroom Pickup
                                    </h3>
                                    <div className="p-5 bg-accent/5 border border-accent/25 rounded-2xl space-y-2 leading-relaxed">
                                        <div className="flex items-center gap-2 font-bold text-accent uppercase text-[9px] tracking-widest">
                                            <MapPin className="h-3.5 w-3.5" /> Main Brand Showroom Hub
                                        </div>
                                        <p className="text-foreground font-semibold mt-1">Sandton City Galleria, Sandton, 2196</p>
                                        <p className="text-muted-foreground text-[10px] mt-0.5">
                                            Collection timing instructions and a pickup PIN will be securely generated and sent directly to your registered WhatsApp phone number once our showroom curators prep your items.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Luxury Gifting Options Block */}
                            <Card className="border border-amber-500/20 bg-amber-500/5 overflow-hidden rounded-2xl p-6 space-y-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-serif text-xs font-bold uppercase tracking-wide text-foreground">
                                            <Gift className="h-4 w-4 text-accent shrink-0" />
                                            <span>Luxury Gift Packaging & Card</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                                            Includes our gold-embossed textured box, silk ribbon, and a custom message transcribed by hand in calligraphy on ivory stock paper.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">+R75</span>
                                        <input
                                            type="checkbox"
                                            checked={isGiftWrap}
                                            onChange={(e) => setIsGiftWrap(e.target.checked)}
                                            className="h-4 w-4 rounded border-border text-amber-600 focus:ring-amber-500 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {isGiftWrap && (
                                    <div className="space-y-3 pt-3 border-t border-amber-500/10 animate-in fade-in slide-in-from-top-2">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="giftCardMessage" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                                Write Your Calligraphy Gift Message
                                            </Label>
                                            <textarea
                                                id="giftCardMessage"
                                                value={giftCardMessage}
                                                onChange={(e) => setGiftCardMessage(e.target.value)}
                                                rows={3}
                                                maxLength={250}
                                                placeholder="Write your special message here (Max 250 characters). Leave blank if you prefer a blank card."
                                                className="w-full text-xs bg-background border border-border/80 rounded-xl p-3 focus:outline-none focus:border-amber-500 text-foreground"
                                            />
                                            <div className="text-[9px] text-muted-foreground text-right">
                                                {giftCardMessage.length}/250 characters
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Trust Badge Section */}
                            <div className="p-4 bg-secondary/5 border border-border/10 rounded-2xl space-y-3 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Secured Checkout Gateway</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <span className="text-[8px] text-slate-500 font-bold bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded shadow-sm">VISA</span>
                                        <span className="text-[8px] text-slate-500 font-bold bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded shadow-sm">MC</span>
                                        <span className="text-[8px] text-slate-500 font-bold bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded shadow-sm">APPLE PAY</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                    Your personal information is protected, and card credentials are fully encrypted under strict PCI-DSS standards. We do not store your credit card details on our servers.
                                </p>
                            </div>

                            <input type="hidden" name="payment" value="yoco" />

                            <Button 
                                type="submit" 
                                className="w-full text-xs uppercase tracking-widest font-bold h-12 rounded-[2rem_0.5rem_2rem_0.5rem] bg-primary text-secondary hover:bg-accent transition-all duration-300 shadow-md"
                                disabled={isProcessing || (user?.role === "wholesale_stockist" && cartTotal < 3000)}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Securing Order...
                                    </span>
                                ) : user?.role === "wholesale_stockist" && cartTotal < 3000 ? (
                                    "Wholesale Minimum Order Unmet"
                                ) : user?.role === "wholesale_stockist" ? (
                                    `Submit B2B Invoice Order (R${totalAmount.toFixed(2)})`
                                ) : (
                                    `Complete Secure Checkout (R${totalAmount.toFixed(2)})`
                                )}
                            </Button>
                        </form>
                    </div>
                    
                    {/* Right Column - Dynamic Sticky Order Summary */}
                    <div className="md:col-span-5">
                        <div className="h-fit sticky top-24 space-y-6">
                            <CheckoutSummary
                                shippingCost={shippingCost}
                                selectedZoneName={zones.find(z => z.id === selectedZoneId)?.name.split(' (')[0] || ""}
                                totalAmount={totalAmount}
                                user={user}
                                isGiftWrap={isGiftWrap}
                                giftWrapCost={75}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
