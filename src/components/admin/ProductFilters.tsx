"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search, Tags, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProductFiltersProps {
    categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Local states to make inputs feel responsive before pushing to URL
    const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
    const currentStatus = searchParams.get("status") || "all";
    const currentCategory = searchParams.get("category") || "all";
    const currentSort = searchParams.get("sort") || "newest";

    // Debounce search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchVal.trim()) {
                params.set("search", searchVal.trim());
            } else {
                params.delete("search");
            }
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchVal, pathname, router]);

    const updateParam = (key: string, val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val === "all") {
            params.delete(key);
        } else {
            params.set(key, val);
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const clearAllFilters = () => {
        setSearchVal("");
        startTransition(() => {
            router.push(pathname);
        });
    };

    const hasActiveFilters = searchVal || currentStatus !== "all" || currentCategory !== "all" || currentSort !== "newest";

    return (
        <div className="space-y-4 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-slate-800/30 shadow-md">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <Input
                        placeholder="Search products by title..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="pl-9 bg-white/50 dark:bg-slate-950/50 border-white/10 dark:border-slate-800/50 hover:border-primary/50 focus-visible:ring-primary/50 pr-8"
                    />
                    {searchVal && (
                        <button 
                            onClick={() => setSearchVal("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>

                {/* Category & Sort Selector */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Category Select */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <Tags className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <Select 
                            value={currentCategory} 
                            onValueChange={(val) => updateParam("category", val)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] bg-white/50 dark:bg-slate-950/50 border-white/10 dark:border-slate-800/50">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Select */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <Select 
                            value={currentSort} 
                            onValueChange={(val) => updateParam("sort", val)}
                        >
                            <SelectTrigger className="w-full sm:w-[160px] bg-white/50 dark:bg-slate-950/50 border-white/10 dark:border-slate-800/50">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="a-z">A-Z</SelectItem>
                                <SelectItem value="z-a">Z-A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Button */}
                    {hasActiveFilters && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearAllFilters}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 px-3 shrink-0 ml-auto sm:ml-0"
                        >
                            Reset
                        </Button>
                    )}

                    {/* Loading Indicator */}
                    {isPending && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                </div>
            </div>

            {/* Status Tabs */}
            <div className="border-t border-white/10 dark:border-slate-800/50 pt-3 flex items-center justify-between">
                <Tabs 
                    value={currentStatus} 
                    onValueChange={(val) => updateParam("status", val)} 
                    className="w-full sm:w-auto"
                >
                    <TabsList className="bg-slate-100/50 dark:bg-slate-950/50 border border-white/10 dark:border-slate-800/50 p-0.5 rounded-lg">
                        <TabsTrigger value="all" className="px-4 py-1.5 text-xs font-semibold rounded-md">All Products</TabsTrigger>
                        <TabsTrigger value="published" className="px-4 py-1.5 text-xs font-semibold rounded-md">Published</TabsTrigger>
                        <TabsTrigger value="draft" className="px-4 py-1.5 text-xs font-semibold rounded-md">Drafts</TabsTrigger>
                        <TabsTrigger value="archived" className="px-4 py-1.5 text-xs font-semibold rounded-md">Archived</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}
