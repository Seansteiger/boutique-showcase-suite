"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
            <p className="text-muted-foreground">You have cancelled the payment process.</p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/checkout">Retry Checkout</Link>
                </Button>
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}
