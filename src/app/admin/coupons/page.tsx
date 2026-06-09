"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Tag, Percent, ArrowRight } from "lucide-react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CouponDialog } from "@/components/admin/CouponDialog";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from "@/app/actions/coupons";
import { toast } from "sonner";

// Matches Database Type roughly
interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount: number;
    start_date: string;
    expires_at: string | null;
    usage_limit_total: number | null;
    usage_limit_per_user: number | null;
    used_count: number;
    is_active: boolean;
    included_products: string[] | null;
    excluded_products: string[] | null;
    exclude_sale_items: boolean;
}

export default function AdminCouponsPage() {
    // const { toast } = useToast(); // Sonner uses direct export
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const fetchCoupons = async () => {
        setLoading(true);
        const { coupons, error } = await getCoupons();
        if (error) {
            toast.error("Error", { description: "Failed to fetch coupons" });
        } else {
            setCoupons((coupons as Coupon[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreate = () => {
        setSelectedCoupon(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon? This cannot be undone.")) return;

        const { success, error } = await deleteCoupon(id);
        if (success) {
            setCoupons(prev => prev.filter(c => c.id !== id));
            toast.success("Deleted", { description: "Coupon deleted successfully" });
        } else {
            toast.error("Error", { description: error });
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));

        const { success, error } = await toggleCouponStatus(id, !currentStatus);
        if (!success) {
            // Revert on failure
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: currentStatus } : c));
            toast.error("Error", { description: "Failed to update status" });
        }
    };

    const handleSave = async (formData: FormData) => {
        let result;
        if (selectedCoupon?.id) {
            result = await updateCoupon(selectedCoupon.id, formData);
        } else {
            result = await createCoupon(formData);
        }

        if (result.success) {
            toast.success("Success", { description: `Coupon ${selectedCoupon ? 'updated' : 'created'} successfully` });
            fetchCoupons(); // Refresh list to get standardized data from DB
        } else {
            toast.error("Error", { description: result.error });
            // Re-throw to keep dialog open? The dialog handles its own separate loading/close logic usually, 
            // but here the dialog calls onSave and awaits it.
            // If we want to keep it open on error, we should throw.
            throw new Error(result.error);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage discounts and promotions.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Create Coupon
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiry</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No coupons found. Create your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-lg">{coupon.code}</span>
                                            {coupon.min_order_amount > 0 && (
                                                <span className="text-xs text-muted-foreground">Min Spend: R{coupon.min_order_amount}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal">
                                            {coupon.discount_type === 'percentage' ? (
                                                <div className="flex items-center"><Percent className="h-3 w-3 mr-1" /> {coupon.discount_value}%</div>
                                            ) : (
                                                `R${coupon.discount_value} OFF`
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span>{coupon.used_count || 0} uses</span>
                                            {coupon.usage_limit_total ? (
                                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full"
                                                        style={{ width: `${Math.min(100, ((coupon.used_count || 0) / coupon.usage_limit_total) * 100)}%` }}
                                                    />
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] w-fit">Unlimited</Badge>
                                            )}
                                        </div>
                                        {coupon.usage_limit_per_user && (
                                            <div className="text-xs text-muted-foreground">
                                                Max {coupon.usage_limit_per_user} per user
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={coupon.is_active}
                                            onCheckedChange={() => handleToggleStatus(coupon.id, coupon.is_active)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {coupon.expires_at ? (
                                            <span className={new Date(coupon.expires_at) < new Date() ? "text-red-500 font-bold" : ""}>
                                                {new Date(coupon.expires_at).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">Never</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(coupon.id)}>
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

            <CouponDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                coupon={selectedCoupon}
                onSave={handleSave}
            />
        </div>
    );
}
