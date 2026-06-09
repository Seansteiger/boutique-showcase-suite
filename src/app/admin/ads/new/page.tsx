"use client";

import Link from "next/link";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function NewAdPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mediaOpen, setMediaOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        link: '',
        is_active: true
    });

    const mutateUpsertAd = useMutation(api.ads.upsertAd);

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
                title: formData.title,
                imageUrl: formData.image_url,
                link: formData.link || undefined,
                isActive: formData.is_active,
                type: 'banner'
            });

            router.push('/admin/ads');
        } catch (error: any) {
            console.error('Error creating ad:', error);
            alert('Failed to create ad: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/ads">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Create New Ad</h1>
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
                        {loading ? 'Saving...' : 'Save Ad'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
