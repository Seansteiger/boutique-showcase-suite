"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { motion } from "framer-motion";

const phrases = [
    "Exquisite Fragrances & Sensory Lifestyle",
    "Handcrafted Scent Curations",
    "Fast Door-to-Door Nationwide Delivery",
    "100% Secure Encrypted Payments",
    "Precious Artisanal Ingredients",
    "Curated Luxury Living"
];

// Duplicate phrases a few times to ensure seamless infinite scroll on ultra-wide screens
const duplicatedPhrases = [...phrases, ...phrases, ...phrases, ...phrases];

export function TrustTicker() {
    return (
        <div className="w-full bg-secondary/30 bg-gradient-to-r from-secondary/40 via-secondary/10 to-secondary/40 border-y border-border py-4 overflow-hidden flex items-center shadow-inner relative">
            <motion.div
                className="flex items-center gap-12 whitespace-nowrap min-w-max px-6"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 35, // Adjust duration for scroll speed
                }}
            >
                {duplicatedPhrases.map((phrase, i) => (
                    <div key={i} className="flex items-center gap-2 text-foreground/80 font-semibold tracking-wide" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <Star className="h-4 w-4 fill-primary text-primary drop-shadow-sm" />
                        <span>{phrase}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
