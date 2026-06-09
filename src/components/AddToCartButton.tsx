"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, Product } from "@/store/cart";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


interface AddToCartButtonProps {
    product: Product & { stock?: number };
    variantId?: string;
    disabled?: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export function AddToCartButton({ product, variantId, disabled = false, className, size = "default" }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { trackCartAdd } = useAnalytics();
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const isOutOfStock = (product.stock || 0) <= 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            toast.error("This item is currently out of stock");
            return;
        }

        setLoading(true);
        addItem(product); // removed variantId as it's not in store interface currently or handled differently
        trackCartAdd(product.id);

        // Simulate small delay for feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
        toast.success(`Added ${product.name} to cart`, { duration: 1000 });
    };

    return (
        <motion.div
            animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={cn("w-full md:w-auto", className)}
        >
            <Button
                size={size}
                className="w-full"
                onClick={handleAddToCart}
                disabled={disabled || loading}
                variant={isOutOfStock ? "secondary" : "default"}
            >
                {/* Icon handling */}
                {isOutOfStock ? (
                    <ShoppingCart className="mr-2 h-5 w-5 opacity-50" />
                ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                )}

                {/* Text handling */}
                {loading ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
        </motion.div>
    );
}
