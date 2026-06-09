"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    sizes?: string;
}

export function SafeImage({ src, alt, fill, width, height, className, priority, sizes }: SafeImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
        console.warn(`Failed to load image: ${src}`);
        setHasError(true);
        setIsLoading(false);
    };

    // If even the fallback fails, show a placeholder
    if (hasError) {
        return (
            <div className={cn("flex items-center justify-center bg-secondary/10", fill && 'absolute inset-0', className)}>
                <div className="text-center text-muted-foreground">
                    <ImageOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Image unavailable</p>
                </div>
            </div>
        );
    }

    const imageProps = {
        src,
        alt,
        className: cn(
            "transition-opacity duration-300 ease-in-out",
            isLoading ? "opacity-0" : "opacity-100",
            className
        ),
        onError: handleError,
        onLoad: () => setIsLoading(false),
        priority,
        sizes: sizes || (fill ? '(max-width: 768px) 100vw, 50vw' : undefined),
        quality: 85,
        ...(fill ? { fill: true } : { width, height })
    };

    return (
        <div className={cn("relative overflow-hidden bg-secondary/10", fill ? "absolute inset-0" : "w-full h-full text-[0]", className)}>
            {isLoading && (
                <div className="absolute inset-0 z-10 animate-pulse bg-secondary/20" />
            )}
            <Image {...imageProps} />
        </div>
    );
}
