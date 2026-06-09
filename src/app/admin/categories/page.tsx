"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Loader2, ChevronRight, CornerDownRight } from "lucide-react";
import { mapCategoriesToTree, flattenCategoryTree } from "@/lib/utils/category-tree";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminCategoriesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", image_url: "", parent_id: "none" as string | null });

    // Convex queries and mutations
    const rawCategories = useQuery(api.products.getCategories);
    const mutateUpsertCategory = useMutation(api.products.upsertCategory);
    const mutateDeleteCategory = useMutation(api.products.deleteCategory);

    // Map Convex schema to expected frontend format
    const categories = rawCategories ? rawCategories.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        image_url: c.imageUrl || "",
        parent_id: c.parentId || null
    })) : [];

    const tree = mapCategoriesToTree(categories);
    const flatTree = flattenCategoryTree(tree);
    const loading = rawCategories === undefined;

    const handleSave = async () => {
        if (!formData.name || !formData.slug) return alert("Name and Slug are required");

        const parentId = formData.parent_id === "none" ? undefined : (formData.parent_id || undefined);

        try {
            await mutateUpsertCategory({
                id: editingCategory ? editingCategory.id : undefined,
                name: formData.name,
                slug: formData.slug,
                imageUrl: formData.image_url || undefined,
                parentId: parentId
            });
            setIsDialogOpen(false);
            setEditingCategory(null);
            setFormData({ name: "", slug: "", image_url: "", parent_id: "none" });
        } catch (error: any) {
            alert(`Error saving category: ${error.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect products and subcategories linked to this category.")) return;
        try {
            await mutateDeleteCategory({ id });
        } catch (error: any) {
            alert("Error deleting category: " + error.message);
        }
    };

    const openEdit = (cat: any) => {
        setEditingCategory(cat);
        setFormData({ 
            name: cat.name, 
            slug: cat.slug, 
            image_url: cat.image_url || "",
            parent_id: cat.parent_id || "none"
        });
        setIsDialogOpen(true);
    };

    const openAddSubcategory = (parent: any) => {
        setEditingCategory(null);
        setFormData({ 
            name: "", 
            slug: "", 
            image_url: "", 
            parent_id: parent.id 
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { 
                            setEditingCategory(null); 
                            setFormData({ name: "", slug: "", image_url: "", parent_id: "none" }); 
                        }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                        setFormData({ ...formData, name, slug: editingCategory ? formData.slug : slug });
                                    }}
                                    placeholder="e.g. Textbooks"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g. textbooks"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Parent Category</label>
                                <Select 
                                    value={formData.parent_id || "none"} 
                                    onValueChange={(val) => setFormData({ ...formData, parent_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Parent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        {categories
                                            .filter(c => c.id !== editingCategory?.id) // Prevent circular reference
                                            .map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URL</label>
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="/categories-v2/image.png"
                                />
                            </div>
                            <Button onClick={handleSave} className="w-full">
                                {editingCategory ? "Update" : "Create"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : flatTree.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            flatTree.map((cat) => (
                                <TableRow key={cat.id} className={cat.depth > 0 ? "bg-muted/30" : ""}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center" style={{ marginLeft: `${cat.depth * 24}px` }}>
                                            {cat.depth > 0 && <CornerDownRight className="h-4 w-4 mr-2 text-muted-foreground" />}
                                            {cat.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                    <TableCell className="max-w-[100px] truncate" title={cat.image_url || undefined}>{cat.image_url || 'No Image'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 px-2 flex items-center gap-1 text-xs"
                                                onClick={() => openAddSubcategory(cat)}
                                            >
                                                <Plus className="h-3 w-3" /> Sub
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(cat.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
