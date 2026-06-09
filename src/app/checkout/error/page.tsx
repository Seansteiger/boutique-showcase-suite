"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutErrorPage() {
    return (
        <div className="container mx-auto px-4 py-20 bg-background">
            <div className="max-w-md mx-auto text-center space-y-6">
                <div className="flex justify-center">
                    <XCircle className="h-24 w-24 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Failed</h1>
                <p className="text-muted-foreground">
                    Something went wrong with your payment. No funds were deducted.
                </p>
                <div className="flex flex-col gap-2 pt-4">
                    <Button asChild className="w-full">
                        <Link href="/cart">Return to Cart & Try Again</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
