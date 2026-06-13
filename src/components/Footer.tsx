"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Pin } from "lucide-react";
import { PaymentIcons } from "./PaymentIcons";

import { useStoreSettings } from "@/hooks/useStoreSettings";
import { cn } from "@/lib/utils";

export function Footer() {
    const settings = useStoreSettings();
    const brandName = settings?.brandName || "SCENTED";
    
    // Custom footer parameters
    const footerCopyright = settings?.footerCopyright || "A tribute to botanical artistry and tactile olfactory balance.";
    const showPayments = settings === undefined ? true : settings.showPaymentsAccepted !== false;

    // Social Links
    const instagramUrl = settings?.socialInstagram || "";
    const facebookUrl = settings?.socialFacebook || "";
    const pinterestUrl = settings?.socialPinterest || "";
    const whatsappNumber = settings?.socialWhatsapp || "";

    const hasAnySocial = instagramUrl || facebookUrl || pinterestUrl || whatsappNumber;

    return (
        <footer className="w-full border-t border-border/10 bg-secondary/50 text-foreground py-16 font-sans">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-4 space-y-4">
                        <Link href="/" className="font-serif italic text-3xl text-accent font-normal tracking-wide hover:opacity-85 transition-opacity inline-block">
                            {brandName}
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            Discover fragrances designed with the precision of nature. A tactile journey through scent, space, and time, crafted for the discerning soul.
                        </p>
                    </div>
                    
                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-primary">Collections</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-accent transition-colors">Shop All</Link></li>
                            <li><Link href="/shop?category=les-parfums" className="hover:text-accent transition-colors">Les Parfums</Link></li>
                            <li><Link href="/shop?category=bougies" className="hover:text-accent transition-colors">Bougies Parfumées</Link></li>
                            <li><Link href="/shop?category=huiles" className="hover:text-accent transition-colors">Huiles Rituelles</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-primary">Assistance</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-accent transition-colors">Privacy Statement</Link></li>
                            <li><Link href="/legal/returns" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        {hasAnySocial && (
                            <>
                                <h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 text-primary">Connect</h4>
                                <div className="flex flex-wrap gap-3">
                                    {instagramUrl && (
                                        <a 
                                            href={instagramUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="border border-border/45 p-2.5 rounded-full hover:border-accent hover:text-accent transition-all bg-background/50 hover:-translate-y-1 block"
                                            aria-label="Instagram"
                                        >
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                    {facebookUrl && (
                                        <a 
                                            href={facebookUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="border border-border/45 p-2.5 rounded-full hover:border-accent hover:text-accent transition-all bg-background/50 hover:-translate-y-1 block"
                                            aria-label="Facebook"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                    )}
                                    {pinterestUrl && (
                                        <a 
                                            href={pinterestUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="border border-border/45 p-2.5 rounded-full hover:border-accent hover:text-accent transition-all bg-background/50 hover:-translate-y-1 block"
                                            aria-label="Pinterest"
                                        >
                                            <Pin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {whatsappNumber && (
                                        <a 
                                            href={`https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="border border-border/45 p-2.5 rounded-full hover:border-accent hover:text-accent transition-all bg-background/50 hover:-translate-y-1 block"
                                            aria-label="WhatsApp Support"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-12 border-t border-border/10 flex flex-col items-center gap-10">
                    
                    {/* Dynamic payments accepted list */}
                    {showPayments && (
                        <div className="flex flex-col items-center gap-6 w-full">
                            <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-accent text-center">Secure Payments Accepted</h4>
                            <div className="bg-secondary/20 dark:bg-white/5 p-4 rounded-xl border border-border/10 self-stretch max-w-xl mx-auto flex justify-center">
                                <PaymentIcons variant="color" size="md" className="justify-center" />
                            </div>
                        </div>
                    )}
                    
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left pt-4">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} {brandName}. {footerCopyright}
                        </p>
                        <div className="flex gap-6 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                            <Link href="/legal/terms" className="hover:text-accent transition-colors">Terms</Link>
                            <Link href="/legal/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
