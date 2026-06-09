"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";

export default function ReturnPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        // Clear cart on successful return
        clearCart();

        router.push("/account");
    }, [orderId, router, clearCart]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p>Redirecting you to your order confirmation...</p>
        </div>
    );
}
