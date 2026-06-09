import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-10 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 dark:border-slate-800/20 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    <Skeleton className="h-10 flex-1 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                        <Skeleton className="h-10 w-full sm:w-[180px] rounded bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-10 w-full sm:w-[160px] rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    <Skeleton className="h-9 w-full sm:w-[350px] rounded bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>

            {/* Metrics Skeletons Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white/40 dark:bg-slate-900/40 p-6 rounded-xl border border-white/10 dark:border-slate-800/20 shadow-sm space-y-3">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                        </div>
                        <Skeleton className="h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                ))}
            </div>

            {/* Content Body Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Large visual table placeholder */}
                <div className="lg:col-span-5 bg-white/40 dark:bg-slate-900/40 p-6 rounded-xl border border-white/10 dark:border-slate-800/20 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                            <Skeleton className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                        </div>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-900">
                                <Skeleton className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smaller secondary placeholder */}
                <div className="lg:col-span-2 bg-white/40 dark:bg-slate-900/40 p-6 rounded-xl border border-white/10 dark:border-slate-800/20 shadow-sm space-y-6">
                    <Skeleton className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
