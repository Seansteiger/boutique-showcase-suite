"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function CartSync() {
    const items = useCartStore((state) => state.items);
    const [anonymousId, setAnonymousId] = useState<string | null>(null);
    const pathname = usePathname();
    const updateCart = useMutation(api.carts.updateCart);

    // 1. Initialize Anonymous ID
    useEffect(() => {
        let id = localStorage.getItem("jsh_anonymous_id");
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem("jsh_anonymous_id", id);
        }
        setAnonymousId(id);
    }, []);

    // 2. Sync Logic (Debounced)
    useEffect(() => {
        if (!anonymousId) return;

        const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
        const user = savedUserStr ? JSON.parse(savedUserStr) : null;
        const userId = user?.id;

        if (items.length === 0) {
            const clearAbandonedCart = async () => {
                if (userId) {
                    // Update Convex cart to empty items
                    try {
                        await updateCart({
                            userId: userId,
                            anonymousId: anonymousId,
                            items: [],
                            isAbandoned: false,
                        });
                    } catch (err) {
                        console.error("Cart Clear Error:", err);
                    }
                }
            };
            clearAbandonedCart();
            return;
        }

        const syncCart = async () => {
            try {
                if (!userId) return; // Only track abandoned carts for logged in users

                // Sync with Convex
                await updateCart({
                    userId,
                    anonymousId: anonymousId,
                    items: items,
                    isAbandoned: true,
                    recoveryStatus: "none",
                });

            } catch (err) {
                console.error("Cart Sync Failed:", err);
            }
        };

        const timeoutId = setTimeout(syncCart, 3000); // 3s debounce

        return () => clearTimeout(timeoutId);
    }, [items, anonymousId, pathname, updateCart]);

    return null; // Headless component
}

