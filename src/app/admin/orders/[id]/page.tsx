"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Package, MapPin, User, Mail, Phone, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [updating, setUpdating] = useState(false);

    // Query order from Convex reactively
    const order = useQuery(api.orders.getOrderById, { id: params.id as string });
    const mutateOrderStatus = useMutation(api.orders.updateOrderStatus);

    if (order === undefined) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    if (!order) {
        return (
            <div className="p-8 text-center space-y-4">
                <p>Order not found</p>
                <Button asChild>
                    <Link href="/admin/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const updateStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            await mutateOrderStatus({
                id: order.id,
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const shipping = order.shippingAddress || {};

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/orders">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Select
                        defaultValue={order.status}
                        onValueChange={updateStatus}
                        disabled={updating}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order Items */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-4 w-4" /> Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4 border-b last:border-0 pb-4 last:pb-0">
                                <div className="h-16 w-16 bg-secondary/20 rounded-md relative overflow-hidden flex-shrink-0">
                                    {item.product?.imageUrls?.[0] ? (
                                        <Image
                                            src={item.product.imageUrls[0]}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Package className="h-8 w-8 m-auto text-muted-foreground opacity-50 absolute inset-0" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{item.product?.title || "Unknown Product"}</h4>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    <p className="text-sm text-muted-foreground">R{item.unitPrice?.toFixed(2)}</p>
                                </div>
                                <div className="text-right font-medium">
                                    R{(item.unitPrice * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                        <div className="pt-4 flex justify-between items-center border-t mt-4">
                            <span className="font-medium">Subtotal</span>
                            <span>R{(order.total - (shipping.shippingCost || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Shipping</span>
                            <span>R{shipping.shippingCost?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold pt-2">
                            <span>Total</span>
                            <span>R{order.total?.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4" /> Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{shipping.firstName || "Guest"} {shipping.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="break-all">{shipping.email || "No email"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-4 w-4" /> {shipping.address?.includes('[Collection]') ? 'Collection Information' : 'Shipping Address'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>{shipping.address || shipping.streetAddress}</p>
                            {shipping.suburb && <p>{shipping.suburb}</p>}
                            <p>{shipping.city || shipping.campus}, {shipping.province || shipping.campusLocation}</p>
                            <p>{shipping.postalCode}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4" /> Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <Badge variant={order.status === 'pending' ? 'destructive' : 'default'}>
                                {order.status === 'pending' ? 'UNPAID' : 'PAID'}
                            </Badge>
                            <p className="mt-2 text-muted-foreground text-xs">Method: PayFast / Yoco</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
