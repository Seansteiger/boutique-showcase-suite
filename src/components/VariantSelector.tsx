"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Variant {
    id: string
    name: string
    slug: string
    price: number
    image: string
}

interface VariantSelectorProps {
    variants: Variant[]
    currentSlug: string
}

export function VariantSelector({ variants, currentSlug }: VariantSelectorProps) {
    const router = useRouter()

    if (variants.length <= 1) return null

    // Extract the "Variant Name" (e.g. "Red" from "Fluffy Cushions - Red")
    // Use the first variant's name to determine the "Base Name" prefix length.
    // Heuristic: If all started with "Name - ", then we remove "Name - ".

    // Find common prefix
    const first = variants[0].name;
    const separator = " - ";
    const prefix = first.includes(separator) ? first.split(separator)[0] + separator : "";

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Choose Options
            </label>
            <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                    const isActive = variant.slug === currentSlug
                    // If prefix exists, strip it. If not, showing full name is safer.
                    const displayName = prefix && variant.name.startsWith(prefix)
                        ? variant.name.substring(prefix.length)
                        : variant.name;

                    return (
                        <Button
                            key={variant.id}
                            variant={isActive ? "default" : "outline"}
                            className={cn(
                                "min-w-[3rem] px-3",
                                isActive ? "ring-2 ring-primary ring-offset-2" : ""
                            )}
                            onClick={() => router.push(`/shop/${variant.slug}`)}
                        >
                            {displayName}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
