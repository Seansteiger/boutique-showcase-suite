"use client";

import { cn } from "@/lib/utils";

export function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted/40 animate-pulse rounded-none",
        className
      )}
    >
      {/* Dynamic shimmer gloss sweep overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4 border border-border/10 p-3 bg-card rounded-none">
          {/* Strict 3:4 Aspect Ratio bottle skeleton */}
          <ShimmerSkeleton className="aspect-[3/4] w-full" />
          
          <div className="space-y-2">
            {/* Brand indicator */}
            <ShimmerSkeleton className="h-3 w-1/3" />
            {/* Title block */}
            <ShimmerSkeleton className="h-5 w-2/3" />
            {/* Price block */}
            <ShimmerSkeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
