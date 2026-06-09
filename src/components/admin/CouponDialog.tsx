
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Coupon {
    id?: string;
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

interface CouponDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    coupon?: Coupon | null;
    onSave: (formData: FormData) => Promise<void>;
}

export function CouponDialog({ open, onOpenChange, coupon, onSave }: CouponDialogProps) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{ id: string, title: string }[]>([]);

    useEffect(() => {
        if (open) {
            import("@/app/actions/coupons").then(({ getProductsForCoupons }) => {
                getProductsForCoupons().then(res => {
                    if (res.products) setProducts(res.products as { id: string, title: string }[]);
                });
            });
        }
    }, [open]);

    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: 0,
        start_date: new Date().toISOString().split('T')[0],
        expires_at: null,
        usage_limit_total: null,
        usage_limit_per_user: 1,
        is_active: true,
        included_products: [],
        excluded_products: [],
        exclude_sale_items: false
    });

    useEffect(() => {
        if (coupon) {
            setFormData({
                ...coupon,
                start_date: coupon.start_date.split('T')[0],
                expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : null,
                included_products: coupon.included_products || [],
                excluded_products: coupon.excluded_products || [],
                exclude_sale_items: coupon.exclude_sale_items || false
            });
        } else {
            setFormData({
                code: '',
                discount_type: 'percentage',
                discount_value: 0,
                min_order_amount: 0,
                start_date: new Date().toISOString().split('T')[0],
                expires_at: null,
                usage_limit_total: null,
                usage_limit_per_user: 1,
                is_active: true,
                included_products: [],
                excluded_products: [],
                exclude_sale_items: false
            });
        }
    }, [coupon, open]);

    const handleChange = (field: keyof Coupon, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        if (coupon?.id) data.append('id', coupon.id);

        Object.keys(formData).forEach(key => {
            const val = formData[key as keyof Coupon];
            if (val !== null && val !== undefined) {
                if (Array.isArray(val)) {
                    val.forEach(v => data.append(key, String(v)));
                } else {
                    data.append(key, String(val));
                }
            }
        });

        await onSave(data);
        setLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{coupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
                    <DialogDescription>
                        {coupon ? 'Modify usage limits and details.' : 'Add a new discount code.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Coupon Code *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={e => handleChange('code', e.target.value.toUpperCase())}
                                placeholder="e.g. SUMMER25"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="isActive">Status</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Switch
                                    id="isActive"
                                    checked={formData.is_active}
                                    onCheckedChange={checked => handleChange('is_active', checked)}
                                />
                                <span className="text-sm text-muted-foreground">{formData.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Discount Type</Label>
                            <Select
                                value={formData.discount_type}
                                onValueChange={val => handleChange('discount_type', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount (R)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Value *</Label>
                            <Input
                                id="value"
                                type="number"
                                value={formData.discount_value}
                                onChange={e => handleChange('discount_value', e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="minSpend">Minimum Spend (Optional)</Label>
                        <Input
                            id="minSpend"
                            type="number"
                            value={formData.min_order_amount}
                            onChange={e => handleChange('min_order_amount', e.target.value)}
                            min="0"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.start_date}
                                onChange={e => handleChange('start_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                            <Input
                                id="expiryDate"
                                type="date"
                                value={formData.expires_at || ''}
                                onChange={e => handleChange('expires_at', e.target.value || null)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limitTotal">Total Usage Limit (Optional)</Label>
                            <Input
                                id="limitTotal"
                                type="number"
                                value={formData.usage_limit_total || ''}
                                onChange={e => handleChange('usage_limit_total', e.target.value || null)}
                                placeholder="Unlimited"
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="limitUser">Limit Per User (Optional)</Label>
                            <Input
                                id="limitUser"
                                type="number"
                                value={formData.usage_limit_per_user || ''}
                                onChange={e => handleChange('usage_limit_per_user', e.target.value || null)}
                                placeholder="1"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excludeSaleItems">Exclude Sale Items</Label>
                        <div className="flex items-center space-x-2 h-10">
                            <Switch
                                id="excludeSaleItems"
                                checked={formData.exclude_sale_items}
                                onCheckedChange={checked => handleChange('exclude_sale_items', checked)}
                            />
                            <span className="text-sm text-muted-foreground">{formData.exclude_sale_items ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Included Products (Optional)</Label>
                            <p className="text-xs text-muted-foreground">If selected, coupon ONLY applies to these.</p>
                            <div className="h-32 overflow-y-auto border rounded-md p-2 space-y-2 bg-background">
                                {products.map(p => (
                                    <div key={p.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`inc-${p.id}`}
                                            checked={formData.included_products?.includes(p.id) || false}
                                            onChange={(e) => {
                                                const current = formData.included_products || [];
                                                if (e.target.checked) handleChange('included_products', [...current, p.id]);
                                                else handleChange('included_products', current.filter(id => id !== p.id));
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor={`inc-${p.id}`} className="text-sm font-normal cursor-pointer line-clamp-1">{p.title}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Excluded Products (Optional)</Label>
                            <p className="text-xs text-muted-foreground">Coupon will NEVER apply to these.</p>
                            <div className="h-32 overflow-y-auto border rounded-md p-2 space-y-2 bg-background">
                                {products.map(p => (
                                    <div key={p.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`exc-${p.id}`}
                                            checked={formData.excluded_products?.includes(p.id) || false}
                                            onChange={(e) => {
                                                const current = formData.excluded_products || [];
                                                if (e.target.checked) handleChange('excluded_products', [...current, p.id]);
                                                else handleChange('excluded_products', current.filter(id => id !== p.id));
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor={`exc-${p.id}`} className="text-sm font-normal cursor-pointer line-clamp-1">{p.title}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Coupon
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
