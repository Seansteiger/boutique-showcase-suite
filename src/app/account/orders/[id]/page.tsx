"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
            if (!savedUserStr) {
                router.push(`/login?redirect=/account/orders/${params.id}`);
                return;
            }
            const user = JSON.parse(savedUserStr);

            // Accessing via secure Server Action instead.
            try {
                const { getOrderDetails } = await import("@/app/actions/orders");
                const { order, error } = await getOrderDetails(params.id as string, user.id);

                if (error || !order) {
                    console.error("Fetch Order Error:", error);
                    setError(error || "Order not found or access denied.");
                } else {
                    setOrder(order);
                }
            } catch (err) {
                console.error("Action Error:", err);
                setError("Failed to load order.");
            }

            setLoading(false);
        };

        if (params.id) fetchOrder();
    }, [params.id, router]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (error) return <div className="p-20 text-center text-red-500">{error} <br /><Button variant="link" onClick={() => router.back()}>Go Back</Button></div>;
    if (!order) return null;

    const shippingAddress = order.shippingAddress as any; // Type casting for convenience

    // Helper for Status Badge
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
            case 'processing': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'shipped': return "bg-purple-100 text-purple-700 border-purple-200";
            case 'delivered': return "bg-green-100 text-green-700 border-green-200";
            case 'cancelled': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" className="mb-6 gap-2" asChild>
                <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Order #{order.id.slice(0, 8)}
                        <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(order.status)} font-medium uppercase tracking-wide`}>
                            {order.status.replace('_', ' ')}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                </div>
                {order.status === 'pending' && (
                    <Button onClick={() => window.location.href = `/checkout/retry/${order.id}`} variant="default">
                        Complete Payment
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="border rounded-lg bg-card overflow-hidden">
                        <div className="bg-muted/40 px-6 py-4 border-b font-medium flex items-center gap-2">
                            <Package className="h-4 w-4" /> Items
                        </div>
                        <div className="divide-y">
                            {order.order_items?.map((item: any) => (
                                <div key={item.id} className="p-6 flex gap-4 items-center">
                                    <div className="h-20 w-20 bg-secondary/10 rounded-md overflow-hidden relative flex-shrink-0 border">
                                        <Image
                                            src={item.products?.image_urls?.[0] || "/images/placeholder.png"}
                                            alt={item.products?.title || "Product"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.products?.title}</h3>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold">
                                        R{item.price.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline / Tracking */}
                    {order.tracking_number && (
                        <div className="border rounded-lg bg-card overflow-hidden">
                            <div className="bg-muted/40 px-6 py-4 border-b font-medium flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Delivery Tracking
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Provider:</span>
                                    <span className="font-medium">{order.shipping_provider || 'Courier'}</span>
                                </div>
                                <div className="flex justify-between items-center bg-secondary/10 p-4 rounded text-center">
                                    <span className="font-mono text-xl tracking-widest w-full">{order.tracking_number}</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Use this tracking number on the courier's website to track your parcel.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Summary & Address */}
                <div className="space-y-6">
                    <div className="border rounded-lg bg-card overflow-hidden">
                        <div className="bg-muted/40 px-6 py-4 border-b font-medium">Order Summary</div>
                        <div className="p-6 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>R{(order.total - (shippingAddress?.shippingCost || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>R{(shippingAddress?.shippingCost || 0).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3 mt-2 flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>R{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg bg-card overflow-hidden">
                        <div className="bg-muted/40 px-6 py-4 border-b font-medium">Delivery Details</div>
                        <div className="p-6 text-sm space-y-1">
                            <p className="font-semibold">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                            <p>{shippingAddress?.streetAddress}</p>
                            <p>{shippingAddress?.suburb || shippingAddress?.campusLocation}, {shippingAddress?.city || shippingAddress?.campus}</p>
                            <p>{shippingAddress?.postalCode}</p>
                            <p className="mt-2 text-muted-foreground">{shippingAddress?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
