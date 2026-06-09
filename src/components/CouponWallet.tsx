"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Copy, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvailableCoupon {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
}

export function CouponWallet({ userId }: { userId: string }) {
    const rawCoupons = useQuery(api.coupons.getUserAvailableCoupons, { userId });

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied!");
    };

    if (rawCoupons === undefined) return <div className="text-center py-4"><Loader2 className="animate-spin h-5 w-5 mx-auto" /></div>;

    const coupons: AvailableCoupon[] = rawCoupons.map((c: any) => ({
        code: c.code,
        discount_type: c.discountType,
        discount_value: c.discountValue,
        min_order_amount: c.minOrderAmount,
    }));

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Ticket className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-xl">My Coupons</h2>
            </div>

            {coupons.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed rounded-lg text-muted-foreground bg-secondary/10">
                    <p>No active coupons found.</p>
                    <p className="text-xs mt-1">Check your email for new offers!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {coupons.map((coupon) => (
                        <Card key={coupon.code} className="border-dashed border-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                                Active
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span>{coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `R${coupon.discount_value} OFF`}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted p-3 rounded-md flex justify-between items-center border border-dashed border-gray-300">
                                    <code className="font-mono font-bold text-lg tracking-wider text-primary">{coupon.code}</code>
                                    <Button size="icon" variant="ghost" onClick={() => copyCode(coupon.code)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    {coupon.min_order_amount > 0 ? `Min spend: R${coupon.min_order_amount}` : "No minimum spend"}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
