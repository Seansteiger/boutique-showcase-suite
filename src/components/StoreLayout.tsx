"use client";

import { usePathname } from "next/navigation";

interface StoreLayoutProps {
    children: React.ReactNode;
    hideOnCheckout?: boolean;
    showOnlyOnHome?: boolean;
    pathname?: string;
    subdomain?: string;
}

export function StoreLayout({ children, hideOnCheckout = false, showOnlyOnHome = false, pathname: serverPathname, subdomain: serverSubdomain }: StoreLayoutProps) {
    const clientPathname = usePathname();
    const pathname = clientPathname || serverPathname;

    // Detect client-side subdomain if window is defined
    const clientSubdomain = typeof window !== "undefined"
        ? (window.location.hostname.includes("scented") ? "scented" : "")
        : "";
    const subdomain = clientSubdomain || serverSubdomain;

    const isIsolatedBrand = pathname?.startsWith("/home-appliances") ||
                            pathname?.startsWith("/furnish") ||
                            pathname?.startsWith("/invited") ||
                            pathname?.startsWith("/food-co") ||
                            pathname?.startsWith("/hhm");

    const isLaunchpad = (pathname === "/" || pathname === "") && (subdomain !== "scented");

    if (isIsolatedBrand || isLaunchpad) return null;

    const isAdmin = pathname?.startsWith("/admin");
    const isCheckout = pathname?.startsWith("/checkout");
    const isHome = pathname === "/scented" || (pathname === "/" && subdomain === "scented");

    if (isAdmin) return null;
    if (hideOnCheckout && isCheckout) return null;
    if (showOnlyOnHome && !isHome) return null;

    return <>{children}</>;
}
