"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Upload, Loader2, Check, Folder, ChevronRight, Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Pre-seeded high-fidelity luxury perfume stock images
const PRE_SEEDED_IMAGES = [
    {
        name: "Ratio 1.0 Amber Botanical",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
        isFolder: false,
    },
    {
        name: "Ratio 1.6 Golden Neroli",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXIZiYTlORnGWaBgApGMLmyWJAzrDXzLSi3rYpF1Ec8lUAfWWnEgS3aJzeIUuJ2iFpLG_H9D2qPohNBQbSyoPOw-s14wv9Sixn4OTQFMJpep-oYlsBP51DQ8aukc9xRgV8efwJ8hOyU2a2pqpeEiZaruI_0BL56H8n0n1Ool9692tM00vgE2lzq8iVefeDaQf-2jEhLGKP8NOkAne8F-BrEa8e0cPLeCSOb7ElRixwSsysTfUBMvrjjOV8f6E5N8-x2GCiBOEBc9AI",
        isFolder: false,
    },
    {
        name: "Ratio 2.6 Spiced Cardamom",
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD57NLOXCoD_sIfrkZJ0C1QOFq_ZqCsLV2XLYSCTFPWGzSEVuywQD-yNWDkbwO8sgGVGQLxUbSKInmaq2pmJkVFAxUx_sjTK62Q9qnVIfVEzoO1BFnl6JAogJsJBnSVv6MWYJcskk3HEWwqJsjrQMTv-cVCngx4NgCsVBu2Eh95TESsNKhj6jxbMwdt6kIF1AjI-wRvZ1U_6nFAg7S1X0DYeXi_-ZZ7HNt8n0ox96hFXPdgCTWGPRjXUrMNiRXi5T9dUqIMvUqyThIn",
        isFolder: false,
    },
    {
        name: "Ratio 3.4 Scented Soy Candle",
        url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
        isFolder: false,
    },
    {
        name: "Ratio 5.0 Sommeil Ritual Oil",
        url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
        isFolder: false,
    },
    {
        name: "Ratio 6.0 Brume de Rose",
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600",
        isFolder: false,
    },
    {
        name: "Atelier Scent Discovery",
        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
        isFolder: false,
    },
    {
        name: "Vetiver Coeur Essence",
        url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600",
        isFolder: false,
    }
];

interface MediaLibraryProps {
    onSelect?: (url: string) => void;
    onSelectMultiple?: (urls: string[]) => void;
    allowMultiple?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    bucketName?: string;
}

export function MediaLibrary({ 
    onSelect, 
    onSelectMultiple,
    allowMultiple = false,
    open, 
    onOpenChange, 
    bucketName = "products" 
}: MediaLibraryProps) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [layoutOpen, setLayoutOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    const fetchItems = () => {
        setLoading(true);
        try {
            // Load custom uploaded base64 images from localStorage
            const localUploadsKey = `jsh_media_${bucketName}_${currentPath || 'root'}`;
            const savedStr = typeof window !== 'undefined' ? localStorage.getItem(localUploadsKey) : null;
            const saved = savedStr ? JSON.parse(savedStr) : [];

            // Root static folders and pre-seeded images
            let directoryContent: any[] = [];

            if (!currentPath) {
                // Seed some visual folders in root for premium layout
                directoryContent = [
                    { name: "Collections", isFolder: true, fullPath: "collections", url: "" },
                    { name: "Campaigns", isFolder: true, fullPath: "campaigns", url: "" },
                    ...PRE_SEEDED_IMAGES.map(img => ({
                        ...img,
                        fullPath: img.name.toLowerCase().replace(/ /g, "-")
                    })),
                    ...saved
                ];
            } else if (currentPath === "collections") {
                directoryContent = [
                    {
                        name: "Golden Fibonacci",
                        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7zgen8w3OqE9kK1qVkGjkaWKrKZcz7Z2tEBcJGAQbcoSPJTtjTxuuZ8mbCmlaBxuo9rxa750Neihex2thoQByfUJET9MJ6BgdB44P0Fkn_M1aohIyZgy6XduOy2OWRsJ0aro1JUcwCAUE-wsoh_3NQy9MIaxN8-w-vODBFiYFAuHOmWys8ElMFYhL6jBUv9lOyk11m8fSsor_Cuk7kP36i6sbsgkaTvg2w-ik8JFK__EIZ-g03fmg33Y_mHuFZY5Uirk1xXLMc_PE",
                        isFolder: false,
                        fullPath: "collections/fibonacci"
                    },
                    ...saved
                ];
            } else if (currentPath === "campaigns") {
                directoryContent = [
                    {
                        name: "Editorial Scent Campaign",
                        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
                        isFolder: false,
                        fullPath: "campaigns/editorial"
                    },
                    ...saved
                ];
            } else {
                directoryContent = saved;
            }

            setItems(directoryContent);
        } catch (error) {
            console.error("Error fetching media items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when opened or path changes
    useEffect(() => {
        if (open || layoutOpen) {
            fetchItems();
        }
    }, [open, layoutOpen, currentPath]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        try {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64data = reader.result as string;
                const newItem = {
                    name: file.name,
                    url: base64data,
                    isFolder: false,
                    fullPath: currentPath ? `${currentPath}/${file.name}` : file.name
                };

                const localUploadsKey = `jsh_media_${bucketName}_${currentPath || 'root'}`;
                const savedStr = typeof window !== 'undefined' ? localStorage.getItem(localUploadsKey) : null;
                const saved = savedStr ? JSON.parse(savedStr) : [];
                
                const updated = [...saved, newItem];
                localStorage.setItem(localUploadsKey, JSON.stringify(updated));
                
                fetchItems();
                setUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (error: any) {
            alert("Upload failed: " + error.message);
            setUploading(false);
        }
    };

    const navigateUp = () => {
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    };

    const handleSelect = (item: any) => {
        if (item.isFolder) {
            setCurrentPath(item.fullPath);
        } else {
            if (allowMultiple) {
                setSelectedUrls(prev => {
                    if (prev.includes(item.url)) {
                        return prev.filter(u => u !== item.url);
                    }
                    return [...prev, item.url];
                });
            } else {
                if (onSelect) onSelect(item.url);
                if (onOpenChange) onOpenChange(false);
                setLayoutOpen(false);
            }
        }
    };

    const handleConfirmMultiple = () => {
        if (onSelectMultiple && selectedUrls.length > 0) {
            onSelectMultiple(selectedUrls);
            setSelectedUrls([]);
            if (onOpenChange) onOpenChange(false);
            setLayoutOpen(false);
        }
    };

    const breadcrumbs = currentPath.split('/').filter(Boolean);

    const Content = (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border border-muted-foreground/10">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={cn("h-7 px-2", !currentPath && "bg-secondary text-secondary-foreground")}
                        onClick={() => setCurrentPath('')}
                    >
                        <Home className="h-4 w-4" />
                    </Button>
                    
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn("h-7 px-2", idx === breadcrumbs.length - 1 && "bg-secondary text-secondary-foreground")}
                                onClick={() => {
                                    const newPath = breadcrumbs.slice(0, idx + 1).join('/');
                                    setCurrentPath(newPath);
                                }}
                            >
                                {crumb}
                            </Button>
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleUpload}
                            accept="image/*"
                            disabled={uploading}
                        />
                        <Button disabled={uploading} size="sm" className="h-8">
                            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3 mr-1" />}
                            {uploading ? "Uploading..." : "Upload Here"}
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[450px] border rounded-md p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                        <p>No files in this folder</p>
                        {currentPath && (
                            <Button variant="link" size="sm" onClick={navigateUp}>
                                <ArrowLeft className="h-3 w-3 mr-1" /> Go back
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {currentPath && (
                            <div
                                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors opacity-60 hover:opacity-100"
                                onClick={navigateUp}
                            >
                                <ArrowLeft className="h-8 w-8 text-muted-foreground mb-1" />
                                <span className="text-[10px] font-medium">Go Up</span>
                            </div>
                        )}
                        {items.map((item) => (
                            <div
                                key={item.name}
                                className={cn(
                                    "group relative aspect-square border rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md",
                                    item.isFolder ? "bg-muted/40 hover:bg-muted" : (
                                        selectedUrls.includes(item.url) 
                                            ? "ring-2 ring-orange-500 shadow-inner" 
                                            : "hover:ring-2 ring-primary"
                                    )
                                )}
                                onClick={() => handleSelect(item)}
                            >
                                {item.isFolder ? (
                                    <div className="flex flex-col items-center justify-center h-full p-2 text-center">
                                        <Folder className="h-10 w-10 text-orange-400 mb-2 fill-current opacity-80" />
                                        <span className="text-xs font-medium truncate w-full px-1">{item.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Image
                                            src={item.url}
                                            alt={item.name}
                                            fill
                                            className={cn(
                                                "object-cover transition-opacity",
                                                selectedUrls.includes(item.url) && "opacity-60"
                                            )}
                                            sizes="(max-width: 768px) 33vw, 20vw"
                                        />

                                        {/* Selection Numbers */}
                                        {allowMultiple && selectedUrls.includes(item.url) && (
                                            <div className="absolute top-2 right-2 h-6 w-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white z-10 animate-in zoom-in-50">
                                                {selectedUrls.indexOf(item.url) + 1}
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform">
                                            <p className="text-[10px] text-white p-1 truncate">{item.name}</p>
                                        </div>
                                        <div className={cn(
                                            "absolute inset-0 bg-black/10 transition-opacity flex items-center justify-center",
                                            selectedUrls.includes(item.url) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            <Check className={cn(
                                                "text-white h-5 w-5 transition-transform",
                                                selectedUrls.includes(item.url) && "scale-125"
                                            )} />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {allowMultiple && selectedUrls.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg animate-in slide-in-from-bottom-2">
                    <p className="text-sm font-medium text-orange-800">
                        {selectedUrls.length} image{selectedUrls.length > 1 ? 's' : ''} selected in order
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUrls([])}>
                            Clear
                        </Button>
                        <Button size="sm" onClick={handleConfirmMultiple} className="bg-orange-600 hover:bg-orange-700">
                            Insert Selected
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    // If controlled
    if (onOpenChange === undefined) {
        return (
            <Dialog open={layoutOpen} onOpenChange={setLayoutOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" /> Media Library
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Select Image</DialogTitle>
                    </DialogHeader>
                    {Content}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Image</DialogTitle>
                </DialogHeader>
                {Content}
            </DialogContent>
        </Dialog>
    );
}
