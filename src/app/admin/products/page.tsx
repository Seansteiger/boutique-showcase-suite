import Link from "next/link";
import { Plus, Pencil, Trash2, MoreHorizontal, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllProducts, getCategories } from "@/lib/products";
import { SafeImage } from "@/components/SafeImage";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; sort?: string; category?: string; search?: string }>;
}) {
    const params = await searchParams;
    const statusFilter = params?.status;
    const sortOrder = params?.sort;
    const categoryFilter = params?.category;
    const searchFilter = params?.search;

    const [products, categories] = await Promise.all([
        getAllProducts(statusFilter, sortOrder, categoryFilter, searchFilter),
        getCategories()
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Products</h1>
                    <p className="text-sm text-muted-foreground">Manage your JSH store product catalog and inventory.</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-md transition-all duration-300">
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <ProductFilters categories={categories} />

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name / Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                        {products.map((product: any) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 rounded bg-secondary/10 overflow-hidden flex items-center justify-center">
                                        {product.image ? (
                                            <SafeImage
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{product.name}</span>
                                        <div className="flex gap-2">
                                            <Badge variant={
                                                product.status === 'published' ? 'secondary' :
                                                    product.status === 'draft' ? 'outline' : 'destructive'
                                            } className="text-[10px] h-5 px-1.5 uppercase tracking-wide">
                                                {product.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>R{product.price?.toFixed(2)}</TableCell>
                                <TableCell>
                                    {product.stock != null && product.stock > 0 ? (
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary-foreground hover:bg-primary/80 text-black">
                                            {product.stock} in stock
                                        </span>
                                    ) : product.stock === 0 ? (
                                        <span className="text-red-500 text-xs font-bold">Out of Stock</span>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">--</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DeleteProductButton productId={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
