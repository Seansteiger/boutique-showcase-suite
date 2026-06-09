import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 space-y-12 pb-16 pt-6">
          {/* Hero Ads Skeleton */}
          <Skeleton className="w-full h-[50vw] sm:h-[40vw] md:h-[35vw] lg:h-[400px] xl:h-[480px] rounded-2xl" />
          
          {/* Trust Ticker Skeleton */}
          <div className="w-full h-12 flex gap-4 overflow-hidden pt-4">
             {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="flex-shrink-0 w-32 h-12 rounded-md" />
             ))}
          </div>

          {/* On Sale Carousel Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-8 w-48 mb-4 max-w-[80vw]" />
             <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="flex-shrink-0 w-[240px] md:w-[280px] space-y-4">
                      <Skeleton className="w-full aspect-[4/5] rounded-xl" />
                      <Skeleton className="h-4 w-3/4 max-w-[150px]" />
                      <Skeleton className="h-4 w-1/2 max-w-[100px]" />
                   </div>
                ))}
             </div>
          </div>

          {/* Category Grid Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-8 w-48 mb-4 max-w-[80vw]" />
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                   <Skeleton key={i} className="w-full aspect-square rounded-2xl" />
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
