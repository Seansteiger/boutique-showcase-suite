"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Megaphone, Tags, TrendingUp, Menu, X, TicketPercent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/categories", label: "Categories", icon: Tags },
        { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
        { href: "/admin/ads", label: "Ads", icon: Megaphone },
        { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.06),rgba(15,23,42,0))] overflow-hidden">

            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                        className="mr-3 hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="text-lg font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                        JSH Admin
                    </Link>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    AD
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed md:static z-50 h-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col w-64 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-white text-sm font-black">J</span>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                            JSH Store
                        </span>
                    </Link>
                    {/* Close button — mobile only */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-600 dark:text-orange-500 shadow-sm border-l-4 border-orange-500 pl-3"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-100"
                                )}
                            >
                                <Icon className={cn(
                                    "h-5 w-5 transition-transform duration-300",
                                    isActive ? "text-orange-500 scale-105" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:scale-105"
                                )} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-semibold rounded-lg transition-all"
                        onClick={async () => {
                            const { logoutUser } = await import("@/app/actions/auth");
                            await logoutUser();
                            localStorage.removeItem("white_label_user");
                            window.location.href = '/login'; // Force full reload to clear state
                        }}
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-slate-50/30 dark:bg-slate-950/30">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
