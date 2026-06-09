import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-12 space-y-8">
      <div className="flex flex-col md:flex-row items-baseline md:items-center justify-between gap-4">
        <ShimmerSkeleton className="h-10 w-48 max-w-[50vw]" />
        <ShimmerSkeleton className="h-10 w-full md:w-64" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4 border border-border/10 p-3 bg-card rounded-none">
               <ShimmerSkeleton className="w-full aspect-[3/4]" />
               <ShimmerSkeleton className="h-3 w-1/3" />
               <ShimmerSkeleton className="h-5 w-2/3" />
               <ShimmerSkeleton className="h-4 w-1/4" />
            </div>
         ))}
      </div>
    </div>
  );
}
