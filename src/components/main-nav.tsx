"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
    categories?: Category[];
}

export function MainNav({
    className,
    categories = [],
}: MainNavProps) {
    return (
        <nav className={cn("flex items-center space-x-6", className)}>
            <Link
                href="/shop"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Shop All
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium transition-colors hover:text-primary outline-none data-[state=open]:text-primary">
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px] p-2 bg-background border border-border shadow-lg rounded-md mt-2">
                    {categories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild className="cursor-pointer capitalize px-2 py-2">
                            <Link href={`/shop?category=${category.slug}`} className="w-full block">
                                {category.name}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}
