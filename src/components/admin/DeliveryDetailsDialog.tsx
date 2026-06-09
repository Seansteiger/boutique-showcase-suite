
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

interface DeliveryDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderWithProfile | null;
}

export function DeliveryDetailsDialog({ open, onOpenChange, order }: DeliveryDetailsDialogProps) {
    if (!order) return null;

    const address = order.shipping_address;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delivery Details</DialogTitle>
                    <DialogDescription>
                        Full shipping address for Order #{order.id.slice(0, 8)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-semibold text-muted-foreground">Contact Name:</div>
                        <div>
                            {address?.firstName} {address?.lastName}
                        </div>

                        <div className="font-semibold text-muted-foreground">Email:</div>
                        <div className="truncate">{address?.email}</div>

                        <div className="font-semibold text-muted-foreground">Address:</div>
                        <div className="col-span-2 bg-muted p-2 rounded text-xs font-mono mt-1">
                            {address?.address}
                            <br />
                            {address?.city}
                        </div>

                        <div className="font-semibold text-muted-foreground">Method:</div>
                        <div>{address?.deliveryMethod || 'Standard'}</div>

                        <div className="font-semibold text-muted-foreground">Zone:</div>
                        <div>{address?.shippingZone}</div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
