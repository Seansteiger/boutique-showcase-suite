"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/database";
import { CouponWallet } from "@/components/CouponWallet";

export default function AccountPage() {
    const router = useRouter();
    const pathname = usePathname();
    const prefix = pathname.startsWith("/food-co") ? "/food-co" :
                   pathname.startsWith("/furnish") ? "/furnish" :
                   pathname.startsWith("/home-appliances") ? "/home-appliances" : "";
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("white_label_user") : null;
            if (!savedUserStr) {
                router.push(`${prefix}/login`);
                return;
            }

            const savedUser = JSON.parse(savedUserStr);
            setUser(savedUser);

            // Fetch orders via Server Action (Bypasses RLS issues)
            try {
                const { getUserOrders } = await import("@/app/actions/orders");
                const { orders, error } = await getUserOrders(savedUser.id);

                if (error) {
                    console.error("Error fetching orders:", error);
                } else if (orders) {
                    // Display all user orders so they can trace their history
                    setOrders(orders);
                }
            } catch (e) {
                console.error("Action failed:", e);
            }

            setLoading(false);
        };

        checkUser();
    }, [router, prefix]);

    const handleSignOut = async () => {
        const { logoutUser } = await import("@/app/actions/auth");
        await logoutUser();
        localStorage.removeItem("white_label_user");
        router.push(`${prefix}/login`);
    };

    if (loading) return <div className="p-20 text-center">Loading account...</div>;

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:px-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Account</h1>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="p-6 border rounded-lg bg-card">
                        <h2 className="font-semibold text-lg mb-4">Profile</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
                            <p><span className="text-muted-foreground">ID:</span> {user?.id.substring(0, 8)}...</p>
                        </div>
                    </div>

                    {/* Coupon Wallet */}
                    {user && <CouponWallet userId={user.id} />}
                </div>

                {/* Orders */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="font-semibold text-xl">Order History</h2>
                    {orders.length === 0 ? (
                        <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
                            You haven't placed any orders yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-4 border rounded-lg flex justify-between items-center bg-card"
                                >
                                    <div>
                                        <p className="font-medium text-primary">Order #{order.id.substring(0, 8)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            order.status === 'pending' || order.status === 'processing' || order.status === 'paid' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                            {order.status === 'pending' || order.status === 'paid' ? 'Preparing Order' :
                                                order.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                        {order.tracking_number && (
                                            <div className="mt-2 text-xs font-mono text-muted-foreground bg-secondary/50 p-1 rounded w-fit">
                                                📦 {order.shipping_provider}: {order.tracking_number}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">R{(order.total || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
