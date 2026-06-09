"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const clearCart = useCartStore((state) => state.clearCart);
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'paid' | 'pending' | 'cancelled' | 'error'>('verifying');

    // Clear cart when success page loads
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    // Verify Payment
    useEffect(() => {
        if (!orderId) {
            setVerificationStatus('error');
            return;
        }

        const verify = async () => {
            try {
                const { verifyYocoPayment } = await import("@/app/actions/payment");
                const res = await verifyYocoPayment(orderId);

                if (res.success && ['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(res.status || '')) {
                    setVerificationStatus('paid');
                    return true;
                } else if (res.status === 'cancelled') {
                    setVerificationStatus('cancelled');
                    return true; // Stop polling on cancellation
                } else {
                    // Start polling or just set to pending
                    setVerificationStatus('pending');
                }
            } catch (e) {
                console.error("Verify failed", e);
                setVerificationStatus('pending');
            }
            return false;
        };

        let isStopped = false;
        const runVerify = async () => {
            const shouldStop = await verify();
            if (shouldStop || isStopped) {
                clearInterval(interval);
            }
        };

        runVerify();
        // Optional: Poll every 5 seconds for 30 seconds?
        const interval = setInterval(runVerify, 5000);
        const timeout = setTimeout(() => {
            isStopped = true;
            clearInterval(interval);
        }, 30000); // Stop after 30s

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [orderId]);

    return (
        <div className="max-w-md mx-auto text-center space-y-6">
            <div className="flex justify-center">
                {verificationStatus === 'verifying' ? (
                    <Loader2 className="h-24 w-24 text-blue-500 animate-spin" />
                ) : verificationStatus === 'paid' ? (
                    <CheckCircle className="h-24 w-24 text-green-500" />
                ) : verificationStatus === 'pending' ? (
                    <div className="h-24 w-24 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                        <span className="text-3xl">⏳</span>
                    </div>
                ) : (
                    <AlertCircle className="h-24 w-24 text-red-500" />
                )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
                {verificationStatus === 'paid' 
                    ? "Order Confirmed!" 
                    : verificationStatus === 'cancelled'
                    ? "Order Cancelled"
                    : verificationStatus === 'pending' 
                    ? "Processing Payment..." 
                    : "Order Placed"}
            </h1>

            <p className="text-muted-foreground">
                {verificationStatus === 'paid'
                    ? "Thank you for your purchase. We have received your payment."
                    : verificationStatus === 'cancelled'
                    ? "Your order and payment process have been cancelled."
                    : "We are verifying your payment. You will receive an email confirmation shortly."}
            </p>

            {orderId && (
                <div className="space-y-2">
                    <div className="p-4 bg-secondary/5 rounded-md border">
                        <p className="text-sm font-medium">Order ID:</p>
                        <p className="font-mono text-lg">{orderId}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="w-full">
                    <Link href="/account">Go to My Account</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-20 bg-background">
            <Suspense fallback={<div className="text-center">Loading confirmation...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
