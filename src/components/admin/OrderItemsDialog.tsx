
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { OrderWithProfile } from "@/types/orders";
import Image from "next/image";

interface OrderItemsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderWithProfile | null;
}

export function OrderItemsDialog({ open, onOpenChange, order }: OrderItemsDialogProps) {
    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Order Items</DialogTitle>
                    <DialogDescription>
                        Products included in Order #{order.id.slice(0, 8)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
                    {order.order_items && order.order_items.length > 0 ? (
                        <div className="space-y-3">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-start space-x-3 border-b pb-3 last:border-0 last:pb-0">
                                    <div className="relative h-16 w-16 min-w-[64px] rounded overflow-hidden bg-muted">
                                        {item.products?.image_urls?.[0] ? (
                                            <Image
                                                src={item.products.image_urls[0]}
                                                alt={item.products.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium">{item.products?.title || 'Unknown Product'}</h4>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Quantity: {item.quantity}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm font-medium">
                                        {item.unit_price ? `R${item.unit_price.toFixed(2)}` : 'R0.00'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            No items found for this order.
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Total Items: {order.order_items?.reduce((sum, i) => sum + i.quantity, 0) || 0}</span>
                        {order.coupon_usages && order.coupon_usages.length > 0 && (
                            <span className="text-xs text-primary font-medium">
                                Coupon Used: <span className="font-bold">{order.coupon_usages[0].coupon_code}</span>
                            </span>
                        )}
                    </div>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
