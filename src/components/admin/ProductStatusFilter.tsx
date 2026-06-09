"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProductStatusFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentStatus = searchParams.get("status") || "all";

    const handleValueChange = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val === "all") {
            params.delete("status");
        } else {
            params.set("status", val);
        }
        router.push(`/admin/products?${params.toString()}`);
    };

    return (
        <Tabs defaultValue={currentStatus} onValueChange={handleValueChange} className="w-[400px]">
            <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
