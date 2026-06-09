"use client";

export const dynamic = 'force-dynamic';

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, MapPin, Package, Truck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// Defined statuses in order
const STEPS = [
    { id: "pending", label: "Preparing Order", icon: Clock },
    { id: "paid", label: "Payment Received", icon: CheckCircle2 },
    { id: "processing", label: "Processing", icon: Package },
    { id: "shipped", label: "Left Warehouse", icon: Truck },
    { id: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
    const params = useParams();
    const orderId = params.id as string;

    // Reactively query the order from Convex
    const order = useQuery(api.orders.getOrderById, { id: orderId });

    if (order === undefined) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading order details...</span>
            </div>
        );
    }

    if (order === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    We couldn't find an order with the ID: <span className="font-mono">{orderId}</span>. Please verify your link.
                </p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        );
    }

    // Determine current step index
    const normalizedStatus = order.status === 'paid' ? 'pending' : order.status;
    const currentStatusIndex = STEPS.findIndex(s => s.id === normalizedStatus) !== -1
        ? STEPS.findIndex(s => s.id === normalizedStatus)
        : 0;

    // Handle cancelled
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Order Tracking</CardTitle>
                        <Badge variant={isCancelled ? "destructive" : "outline"}>
                            {isCancelled ? "Cancelled" : `Order #${order.id.slice(0, 8)}`}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </CardHeader>
                <CardContent>
                    {isCancelled ? (
                        <div className="text-center py-8 text-red-500 font-medium">
                            This order has been cancelled.
                        </div>
                    ) : (
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-8 md:gap-0 mt-4">
                            {/* Progress Line (Desktop) */}
                            <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-10 hidden md:block" />
                            <div
                                className="absolute top-5 left-0 h-1 bg-primary -z-10 hidden md:block transition-all duration-500"
                                style={{ width: `${(currentStatusIndex / (STEPS.length - 1)) * 100}%` }}
                            />

                            {STEPS.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;

                                return (
                                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 relative bg-background md:bg-transparent p-2 md:p-0 rounded-md w-full md:w-auto">
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 z-10 bg-background",
                                            isCompleted ? "border-primary bg-primary text-secondary" : "border-muted text-muted-foreground",
                                            isCurrent && "ring-4 ring-primary/20"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="md:text-center">
                                            <p className={cn("text-sm font-medium", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-xs text-primary animate-pulse hidden md:block">Current Status</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <div>
                                    <p className="font-medium">{item.product?.title || "Product"}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">R{item.unitPrice}</p>
                            </div>
                        ))}
                        <div className="flex justify-between pt-4 font-bold text-lg">
                            <span>Total</span>
                            <span>R{order.total?.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
