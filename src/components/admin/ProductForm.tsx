"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Plus, Upload, ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MediaLibrary } from "./MediaLibrary";
import { ProductVariationsTable } from "./ProductVariationsTable";
import { mapCategoriesToTree, flattenCategoryTree } from "@/lib/utils/category-tree";

// Schema
const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    sale_price: z.coerce.number().optional(),
    stock_quantity: z.coerce.number().int().min(0).default(0),
    category_id: z.string().optional(),
    brand: z.string().nullable().optional().or(z.literal("")),
    features: z.array(z.string()).optional(),
    image_urls: z.array(z.string()).optional(),
    variations: z.array(z.object({
        attributes: z.array(z.object({
            key: z.string().min(1, "Key is required"),
            value: z.string().min(1, "Value is required")
        })),
        price: z.coerce.number().optional().nullable(),
        stock_quantity: z.coerce.number().int().min(0).default(0),
        image_url: z.string().optional().nullable()
    })).optional()
}).superRefine((data, ctx) => {
    if (data.status === 'published') {
        if (!data.description) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Description is required to publish.", path: ["description"] });
        if (data.price === undefined || data.price <= 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Price is required to publish.", path: ["price"] });
        if (!data.category_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Category is required to publish.", path: ["category_id"] });
        if (!data.image_urls || data.image_urls.length === 0 || !data.image_urls[0]) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "At least one image is required.", path: ["image_urls"] });
        
        // Variations validation for published products
        if (data.variations && data.variations.length > 0) {
            data.variations.forEach((v, i) => {
                if (v.stock_quantity === undefined || v.stock_quantity === null) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Variation ${i + 1} stock is required.`, path: ["variations", i, "stock_quantity"] });
                }
            });
        }
    }
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: any;
    onSubmit: (data: ProductFormValues) => Promise<void>;
    bucketName?: string;
}

export function ProductForm({ initialData, onSubmit, bucketName = "products" }: ProductFormProps) {
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);


    // Transform initialData 
    const transformedInitialData = initialData ? {
        ...initialData,
        status: initialData.status || 'draft',
        category_id: initialData.category_id || initialData.category,
        variations: initialData.variations?.map((v: any) => ({
            ...v,
            price: v.price === null ? undefined : v.price,
            stock_quantity: v.stock_quantity ?? 0,
            image_url: v.image_url || "",
            attributes: Array.isArray(v.attributes) 
                ? v.attributes 
                : Object.entries(v.attributes || {}).map(([key, value]) => ({ key: String(key), value: String(value) }))
        })) || []
    } : undefined;

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: transformedInitialData || {
            title: "",
            slug: "",
            status: "draft",
            description: "",
            price: 0,
            stock_quantity: 0,
            category_id: "",
            brand: "",
            features: [""],
            image_urls: [""],
            variations: []
        }
    });

    // Scroll to error logic
    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            form.setFocus(firstErrorKey as any);
            // Fallback scroll if setFocus doesn't work for some fields (like Select)
            const element = document.querySelector(`[name="${firstErrorKey}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('animate-pulse', 'ring-2', 'ring-red-500', 'rounded-md'); // Enhanced visual cue
                setTimeout(() => {
                    element.classList.remove('animate-pulse', 'ring-2', 'ring-red-500');
                }, 3000); // Clear after 3 seconds
            }

            // Also show a toast listing the errors
            const errorMessages: string[] = [];
            
            const extractErrors = (obj: any, parentKey = "") => {
                if (!obj) return;
                if (obj.message) {
                    errorMessages.push(`${parentKey}: ${obj.message}`);
                } else if (typeof obj === 'object') {
                    Object.entries(obj).forEach(([key, value]) => {
                        const newKey = parentKey ? `${parentKey}.${key}` : key;
                        extractErrors(value, newKey);
                    });
                }
            };

            extractErrors(errors);

            toast.error("Form Validation Error", {
                description: errorMessages.slice(0, 3).join(", ") + (errorMessages.length > 3 ? "..." : "")
            });
            console.error("Form Validation Errors:", errors);
        }
    };

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control: form.control,
        name: "image_urls" as any
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
        control: form.control,
        name: "features" as any
    });

    const categoriesData = useQuery(api.products.getCategories) || [];

    useEffect(() => {
        if (categoriesData.length > 0) {
            const tree = mapCategoriesToTree(categoriesData);
            const flat = flattenCategoryTree(tree);
            setCategories(flat);
        }
    }, [categoriesData]);

    // Slug Check logic
    const [slugError, setSlugError] = useState<string | null>(null);

    const checkSlug = async (slug: string) => {
        if (!slug) return;
        if (initialData && initialData.slug === slug) {
            setSlugError(null);
            return;
        }
        setSlugError(null);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        form.setValue("title", title);

        if (!initialData) {
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            form.setValue("slug", slug);
            checkSlug(slug);
        }
    };

    // AI Refine Logic
    const [isRefining, setIsRefining] = useState(false);
    const handleAIRefine = async () => {
        const title = form.getValues("title");
        const description = form.getValues("description");
        const features = form.getValues("features");

        if (!title) return alert("Please enter a title first.");

        setIsRefining(true);
        try {
            const res = await fetch("/api/ai/refine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, features })
            });
            const { success, data } = await res.json();

            if (success && data) {
                form.setValue("title", data.title);
                form.setValue("description", data.description);
                // Handle features (string or array)
                if (Array.isArray(data.features)) {
                    // Clear and append
                    if (data.features.length > 0) {
                        form.setValue("features", data.features);
                    }
                } else if (typeof data.features === 'string') {
                    // Try to split logic if AI returns text
                    // But for now, we asked for JSON in route.
                }
                // form.trigger(); // Re-validate
            } else {
                alert("AI Refine failed: " + (data?.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Network error during refine.");
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Title <span className="text-red-500">*</span></Label>
                        <Input
                            {...form.register("title")}
                            onChange={handleTitleChange}
                            placeholder="Product Name"
                            className={form.formState.errors.title ? "border-red-500" : ""}
                        />
                        {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Slug <span className="text-red-500">*</span></Label>
                        <Input
                            {...form.register("slug")}
                            placeholder="product-slug"
                            onBlur={(e) => checkSlug(e.target.value)}
                            className={slugError || form.formState.errors.slug ? "border-red-500" : ""}
                        />
                        {slugError && <p className="text-red-500 text-xs">{slugError}</p>}
                        {form.formState.errors.slug && <p className="text-red-500 text-xs">{form.formState.errors.slug.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Description</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                onClick={handleAIRefine}
                                disabled={isRefining}
                            >
                                {isRefining ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                                {isRefining ? "Refining..." : "Refine with AI"}
                            </Button>
                        </div>
                        <Textarea
                            {...form.register("description")}
                            className={`h-32 ${form.formState.errors.description ? "border-red-500" : ""}`}
                        />
                        {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Price (R)</Label>
                            <Input
                                {...form.register("price")}
                                type="number"
                                step="0.01"
                                className={form.formState.errors.price ? "border-red-500" : ""}
                            />
                            {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Sale Price (Optional)</Label>
                            <Input {...form.register("sale_price")} type="number" step="0.01" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input {...form.register("stock_quantity")} type="number" />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                onValueChange={(val) => {
                                    form.setValue("category_id", val);
                                    form.clearErrors("category_id");
                                }}
                                defaultValue={form.getValues("category_id")}
                            >
                                <SelectTrigger className={form.formState.errors.category_id ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.depth > 0 ? "— ".repeat(cat.depth) + cat.name : cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.category_id && <p className="text-red-500 text-xs">{form.formState.errors.category_id.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Brand (Optional)</Label>
                        <Input
                            {...form.register("brand")}
                            placeholder="e.g. Sokany, Samsung, Nivea"
                            className={form.formState.errors.brand ? "border-red-500" : ""}
                        />
                        {form.formState.errors.brand && <p className="text-red-500 text-xs">{form.formState.errors.brand.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label>Features</Label>
                        {featureFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <Input {...form.register(`features.${index}` as any)} placeholder="Feature (e.g. 1000W Power)" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendFeature("")}>
                            <Plus className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card className={form.formState.errors.image_urls ? "border-red-500" : ""}>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Images</Label>
                                <MediaLibrary
                                    allowMultiple={true}
                                    onSelectMultiple={(urls) => {
                                        urls.forEach(url => {
                                            // Only append if it's not already empty or check if it's a new entry
                                            if (form.getValues("image_urls")?.length === 1 && !form.getValues("image_urls")?.[0]) {
                                                form.setValue("image_urls.0", url);
                                            } else {
                                                appendImage(url);
                                            }
                                        });
                                    }}
                                    bucketName={bucketName}
                                />
                            </div>
                            {form.formState.errors.image_urls && <p className="text-red-500 text-xs">{form.formState.errors.image_urls.message}</p>}
                            {imageFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center">
                                    <Input {...form.register(`image_urls.${index}`)} placeholder="Image URL" />
                                    <MediaLibrary
                                        onSelect={(url) => form.setValue(`image_urls.${index}`, url)}
                                        bucketName={bucketName}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendImage("")}>
                                <Plus className="mr-2 h-4 w-4" /> Add One Row
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="border rounded-md p-4">
                        <Label className="mb-4 block">Variations</Label>
                        <ProductVariationsTable control={form.control} register={form.register} />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 sticky bottom-4 bg-background p-4 border rounded-md shadow-lg z-10">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (slugError) return alert("Please resolve the URL conflict first.");
                        form.setValue('status', 'draft');
                        form.handleSubmit(onSubmit, onError)();
                    }}
                    disabled={form.formState.isSubmitting}
                >
                    Save as Draft
                </Button>

                <Button
                    type="button"
                    onClick={() => {
                        if (slugError) return alert("Please resolve the URL conflict first.");
                        form.setValue('status', 'published');
                        form.handleSubmit(onSubmit, onError)();
                    }}
                    disabled={form.formState.isSubmitting}
                    className="bg-primary"
                >
                    {form.formState.isSubmitting ? "Publishing..." : "Publish Product"}
                </Button>
            </div>
        </form>
    );
}
