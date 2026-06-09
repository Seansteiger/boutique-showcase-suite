"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ShoppingCart, TrendingUp, AlertCircle, Loader2, Users, Activity } from "lucide-react";

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [globalStats, setGlobalStats] = useState({ uniqueVisitors: 0, totalVisits: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { getAnalyticsMetrics, getGlobalAnalytics } = await import("@/app/actions/admin");

                // Fetch product analytics
                const { metrics, error } = await getAnalyticsMetrics();
                if (error) {
                    console.error("Error fetching product analytics:", error);
                } else {
                    setMetrics(metrics || []);
                }

                // Fetch global traffic analytics
                const globalData = await getGlobalAnalytics();
                if (globalData.error) {
                    console.error("Error fetching global analytics:", globalData.error);
                } else {
                    setGlobalStats(globalData as { uniqueVisitors: number; totalVisits: number });
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Derived Stats
    const totalViews = metrics.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalCarts = metrics.reduce((acc, curr) => acc + (curr.cart_adds || 0), 0);
    const avgConversion = totalViews > 0 ? (totalCarts / totalViews * 100).toFixed(1) : "0";

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-orange-600 h-8 w-8" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <div className="text-sm text-muted-foreground">Live Data</div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Distinct Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{globalStats.uniqueVisitors}</div>
                        <p className="text-xs text-muted-foreground">Unique browsers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Site Hits</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{globalStats.totalVisits}</div>
                        <p className="text-xs text-muted-foreground">Global traffic</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cart Adds</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCarts}</div>
                        <p className="text-xs text-muted-foreground">Intent to purchase</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cart Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgConversion}%</div>
                        <p className="text-xs text-muted-foreground">Adds per View</p>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Products</CardTitle>
                    <CardDescription>Ranked by engagement (Views & Cart Adds)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Cart Adds</TableHead>
                                <TableHead className="text-right">Conv. Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metrics.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No data available yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                metrics.map((m) => {
                                    const conv = m.views > 0 ? (m.cart_adds / m.views * 100).toFixed(1) : "0.0";
                                    return (
                                        <TableRow key={m.id}>
                                            <TableCell>
                                                <div className="h-10 w-10 relative overflow-hidden rounded bg-secondary">
                                                    {m.products?.image_urls?.[0] && (
                                                        <img
                                                            src={m.products.image_urls[0]}
                                                            alt=""
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{m.products?.title || "Unknown Product"}</TableCell>
                                            <TableCell className="text-right">R{m.products?.price}</TableCell>
                                            <TableCell className="text-right font-mono">{m.views}</TableCell>
                                            <TableCell className="text-right font-mono">{m.cart_adds}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${Number(conv) > 5 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'}`}>
                                                    {conv}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
