import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-6 border-b">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 pb-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-4 overflow-hidden">
             {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl flex-shrink-0" />
             ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-8">
          <div className="space-y-4">
             <Skeleton className="h-10 w-3/4 max-w-[400px]" />
             <Skeleton className="h-8 w-1/3 max-w-[150px]" />
             <div className="flex gap-2">
                 <Skeleton className="h-6 w-24 rounded-full" />
                 <Skeleton className="h-6 w-20 rounded-full" />
             </div>
          </div>
          
          {/* Description Lines */}
          <div className="space-y-3 pt-4">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[95%]" />
             <Skeleton className="h-4 w-[90%]" />
             <Skeleton className="h-4 w-[80%]" />
             <Skeleton className="h-4 w-[60%]" />
          </div>

          <div className="pt-6">
             <Skeleton className="h-12 w-full rounded-full" /> 
          </div>
        </div>
      </div>
    </div>
  );
}
