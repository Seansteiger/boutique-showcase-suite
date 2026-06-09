"use client";

import { ImageLoaderProps } from "next/image";

/**
 * Custom Next.js Image Loader
 * Intercepts every <Image /> request and routes it to our custom self-hosted Node.js /api/image endpoint
 * This completely bypasses the Vercel Image Optimization quota while preserving Next.js scaling logic.
 */
export default function customImageLoader({ src, width, quality }: ImageLoaderProps) {
    // If the image is a local static asset (starts with /), don't pass it to the external fetch proxy
    if (src.startsWith('/')) {
        return src;
    }

    const q = quality || 80;

    // Use our custom proxy route for external domains
    return `/api/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
