"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

export function Hero() {
    return (
        <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-primary/20 bg-[length:400%_400%] animate-gradient" />

            <div className="container relative z-20 px-4 md:px-6 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4 border border-primary/20">
                        #1 Student Store in Jozi
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground max-w-5xl mx-auto leading-[1.1]">
                        UP YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">VIBE</span> <br />
                        THIS SEMESTER
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                >
                    From dorm decor to late-night study snacks. We got you.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-center gap-4 pt-4"
                >
                    <Button size="lg" className="h-14 px-10 text-xl rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow" asChild>
                        <Link href="/shop">Shop Now</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
