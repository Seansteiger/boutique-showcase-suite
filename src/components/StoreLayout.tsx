"use client";

import { usePathname } from "next/navigation";

interface StoreLayoutProps {
    children: React.ReactNode;
    hideOnCheckout?: boolean;
    showOnlyOnHome?: boolean;
    pathname?: string;
}

export function StoreLayout({ children, hideOnCheckout = false, showOnlyOnHome = false, pathname: serverPathname }: StoreLayoutProps) {
    const clientPathname = usePathname();
    const pathname = clientPathname || serverPathname;

    const isIsolatedBrand = pathname?.startsWith("/home-appliances") ||
                            pathname?.startsWith("/furnish") ||
                            pathname?.startsWith("/invited") ||
                            pathname?.startsWith("/food-co") ||
                            pathname?.startsWith("/hhm") ||
                            pathname === "/";

    if (isIsolatedBrand) return null;

    const isAdmin = pathname?.startsWith("/admin");
    const isCheckout = pathname?.startsWith("/checkout");
    const isHome = pathname === "/scented";

    if (isAdmin) return null;
    if (hideOnCheckout && isCheckout) return null;
    if (showOnlyOnHome && !isHome) return null;

    return <>{children}</>;
}
