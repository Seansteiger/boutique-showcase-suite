"use client";

import Link from "next/link";
import { ArrowLeft, Save, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function EditAdPage() {
    const router = useRouter();
    const params = useParams();
    const adId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [mediaOpen, setMediaOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        link: '',
        is_active: true
    });

    // Convex queries and mutations
    const allAds = useQuery(api.ads.getAllAds);
    const mutateUpsertAd = useMutation(api.ads.upsertAd);
    const mutateDeleteAd = useMutation(api.ads.deleteAd);

    const matchedAd = allAds?.find((a: any) => a._id.toString() === adId);

    useEffect(() => {
        if (matchedAd) {
            setFormData({
                title: matchedAd.title || '',
                image_url: matchedAd.imageUrl || '',
                link: matchedAd.link || '',
                is_active: matchedAd.isActive ?? true
            });
        }
    }, [matchedAd]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.image_url) {
            alert('Title and Image are required');
            return;
        }

        setLoading(true);
        try {
            await mutateUpsertAd({
                id: adId,
                title: formData.title,
                imageUrl: formData.image_url,
                link: formData.link || undefined,
                isActive: formData.is_active
            });
            router.push('/admin/ads');
        } catch (error: any) {
            console.error('Error updating ad:', error);
            alert('Failed to update ad: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this ad? This cannot be undone.')) return;

        setDeleting(true);
        try {
            await mutateDeleteAd({ id: adId });
            router.push('/admin/ads');
        } catch (error: any) {
            console.error('Error deleting ad:', error);
            alert('Failed to delete ad: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const fetching = allAds === undefined;

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (allAds && !matchedAd) {
        return (
            <div className="p-8 text-center space-y-4">
                <p>Ad not found</p>
                <Button asChild>
                    <Link href="/admin/ads">Back to Ads</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/ads">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Ad</h1>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? 'Deleting...' : 'Delete Ad'}
                </Button>
            </div>

            <div className="space-y-6 border p-6 rounded-lg bg-card bg-white dark:bg-slate-950">
                <div className="space-y-2">
                    <Label htmlFor="title">Headline / Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Back to School Sale"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Ad Image</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            id="image_url"
                            placeholder="Select an image from the library..."
                            value={formData.image_url}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMediaOpen(true)}
                        >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Library
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Use a high-quality landscape image (approx 21:9 ratio).
                    </p>
                </div>

                <MediaLibrary
                    open={mediaOpen}
                    onOpenChange={setMediaOpen}
                    onSelect={(url) => {
                        setFormData(prev => ({ ...prev, image_url: url }));
                        setMediaOpen(false);
                    }}
                />

                {formData.image_url && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden bg-muted">
                        <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="link">Link (Optional)</Label>
                    <Input
                        id="link"
                        placeholder="/shop?category=stationery"
                        value={formData.link}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="is_active">Active (Show on Homepage)</Label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/ads">Cancel</Link>
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
