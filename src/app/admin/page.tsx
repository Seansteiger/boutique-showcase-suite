import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, ArrowUpRight, TrendingUp, Calendar } from "lucide-react";
import { OverviewChart } from "@/components/admin/OverviewChart";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

async function getAdminStats() {
    try {
        const products = await convex.query(api.products.getProducts);
        const orders = await convex.query(api.orders.getAllOrders);

        const productCount = products.length;

        const successfulOrders = orders.filter((o: any) =>
            ['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(o.status.toLowerCase())
        );

        const recentSales = orders.slice(0, 5).map((order: any) => ({
            id: order._id?.toString() || order.id,
            total_amount: order.total,
            created_at: new Date(order.createdAt).toISOString(),
            status: order.status,
            profile: {
                full_name: order.customerName,
                email: (order.shippingAddress as any)?.email || "No email"
            }
        }));

        const totalRevenue = successfulOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

        const uniqueBuyers = new Set(successfulOrders.map((o: any) => o.userId)).size;

        const monthlyData = [
            { name: 'Jan', total: 0 }, { name: 'Feb', total: 0 }, { name: 'Mar', total: 0 },
            { name: 'Apr', total: 0 }, { name: 'May', total: 0 }, { name: 'Jun', total: 0 },
            { name: 'Jul', total: 0 }, { name: 'Aug', total: 0 }, { name: 'Sep', total: 0 },
            { name: 'Oct', total: 0 }, { name: 'Nov', total: 0 }, { name: 'Dec', total: 0 },
        ];

        successfulOrders.forEach((order: any) => {
            const date = new Date(order.createdAt);
            const month = date.getMonth();
            monthlyData[month].total += (order.total || 0);
        });

        const currentMonth = new Date().getMonth();
        const chartData = monthlyData.slice(0, currentMonth + 1);

        return {
            productCount,
            orderCount: successfulOrders.length,
            totalRevenue,
            activeUsers: uniqueBuyers,
            chartData,
            recentSales
        };
    } catch (e) {
        console.error("Error loading Convex admin stats:", e);
        return {
            productCount: 0,
            orderCount: 0,
            totalRevenue: 0,
            activeUsers: 0,
            chartData: [],
            recentSales: []
        };
    }
}

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8 pb-12">

            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Here's what's happening with your store today.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 dark:border-slate-800/30 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Real-time Analytics</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Revenue Card */}
                <Card className="relative overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Revenue</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <DollarSign className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                            R{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1 mt-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>+12.4% vs last month</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Orders Card */}
                <Card className="relative overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Orders</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <ShoppingCart className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                            +{stats.orderCount}
                        </div>
                        <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1 mt-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>+8.2% vs last month</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Products Card */}
                <Card className="relative overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Products</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                            <Package className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                            {stats.productCount}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            Across all store categories
                        </p>
                    </CardContent>
                </Card>

                {/* Active Customers Card */}
                <Card className="relative overflow-hidden group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all duration-300 shadow-md hover:shadow-lg">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-105 transition-transform duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Customers</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                            {stats.activeUsers}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            Unique buyers this period
                        </p>
                    </CardContent>
                </Card>

            </div>

            {/* Chart and Recent Sales Section */}
            <div className="grid gap-6 lg:grid-cols-7">

                {/* Revenue Chart Panel */}
                <Card className="lg:col-span-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
                            <CardDescription className="text-xs">Monthly earnings trend from student orders.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <OverviewChart data={stats.chartData} />
                        </div>
                    </CardContent>
                </Card>

                {/* Real-time Recent Sales Panel */}
                <Card className="lg:col-span-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/20 dark:border-slate-800/30 shadow-md flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Recent Sales</CardTitle>
                            <CardDescription className="text-xs">Latest student orders processed.</CardDescription>
                        </div>
                        <Link href="/admin/orders" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 hover:underline">
                            <span>View All</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-4">
                            {stats.recentSales.length === 0 ? (
                                <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
                                    No sales history available yet.
                                </div>
                            ) : (
                                stats.recentSales.map((sale: any) => {
                                    const buyerName = sale.profile?.full_name || sale.profile?.username || "Guest Student";
                                    const initials = buyerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

                                    return (
                                        <div key={sale.id} className="flex items-center justify-between py-2 border-b border-slate-100/50 dark:border-slate-800/30 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm">
                                                    {initials}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{buyerName}</p>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{sale.profile?.email || "No email"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                                                    R{sale.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                                <Badge className="text-[9px] h-4.5 font-bold tracking-wide uppercase px-1.5" variant={
                                                    sale.status === 'completed' || sale.status === 'delivered' ? 'secondary' :
                                                        sale.status === 'pending' || sale.status === 'unpaid' ? 'outline' : 'default'
                                                }>
                                                    {sale.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
