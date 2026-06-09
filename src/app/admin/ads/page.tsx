"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminAdsPage() {
    const rawAds = useQuery(api.ads.getAllAds);

    const ads = rawAds ? rawAds.map((ad: any) => ({
        id: ad._id.toString(),
        title: ad.title,
        link: ad.link || "",
        image_url: ad.imageUrl,
        is_active: ad.isActive
    })) : [];

    const loading = rawAds === undefined;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Ads Management</h1>
                <Button asChild>
                    <Link href="/admin/ads/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Ad
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="py-3 px-4 font-medium">Image</th>
                            <th className="py-3 px-4 font-medium">Title</th>
                            <th className="py-3 px-4 font-medium">Link</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center">
                                    <Loader2 className="animate-spin h-6 w-6 mx-auto text-primary" />
                                </td>
                            </tr>
                        ) : ads.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                    No ads found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            ads.map((ad: any) => (
                                <tr key={ad.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="relative w-16 h-10 rounded-md overflow-hidden bg-gray-100">
                                            <Image src={ad.image_url} alt={ad.title} fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 font-medium">{ad.title}</td>
                                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[200px]">{ad.link || '-'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ad.is_active
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                            }`}>
                                            {ad.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/ads/${ad.id}`}>Edit</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
