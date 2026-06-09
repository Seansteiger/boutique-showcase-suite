"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
    items?: { label: string; href: string }[]
}

export function Breadcrumbs({ className, items, ...props }: BreadcrumbsProps) {
    const pathname = usePathname()

    const breadcrumbs = React.useMemo(() => {
        if (items) return items

        const asPathNestedRoutes = pathname.split("/").filter((v) => v.length > 0)

        const crumbs = asPathNestedRoutes.map((subpath, idx) => {
            const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/")
            const label = subpath.charAt(0).toUpperCase() + subpath.slice(1).replace(/-/g, " ")
            return { href, label }
        })

        return [{ href: "/", label: "Home" }, ...crumbs]
    }, [pathname, items])

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("flex items-center text-sm text-muted-foreground", className)}
            {...props}
        >
            <ol className="flex items-center space-x-2">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    return (
                        <li key={item.href} className="flex items-center">
                            {index > 0 && <ChevronRight className="mb-0.5 h-4 w-4 text-muted-foreground/50 mx-1" />}
                            {isLast ? (
                                <span className="font-medium text-foreground">{item.label}</span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="transition-colors hover:text-foreground flex items-center gap-1"
                                >
                                    {index === 0 && <Home className="h-3.5 w-3.5 mb-0.5" />}
                                    {index !== 0 && item.label}
                                    {index === 0 && <span className="sr-only">Home</span>}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
