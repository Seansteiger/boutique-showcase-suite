
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
import { OrderWithProfile } from "@/types/orders";
import { useState, useEffect } from "react";

interface FulfillmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderWithProfile | null;
    onConfirm: (orderId: string, trackingNumber: string, provider: string) => Promise<void>;
}

export function FulfillmentDialog({ open, onOpenChange, order, onConfirm }: FulfillmentDialogProps) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [provider, setProvider] = useState("Paxi");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (order) {
            setTrackingNumber(order.tracking_number || "");
            const address = order.shipping_address;
            setProvider(
                order.shipping_provider ||
                (address?.shippingZone?.includes('Paxi') ? 'Paxi' : 'Uber Connect')
            );
        }
    }, [order]);

    const handleConfirm = async () => {
        if (!order) return;
        setLoading(true);
        await onConfirm(order.id, trackingNumber, provider);
        setLoading(false);
    };

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Fulfill Order</DialogTitle>
                    <DialogDescription>
                        Enter tracking details for Order #{order.id.slice(0, 8)}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Shipping Provider</Label>
                        <Select value={provider} onValueChange={setProvider}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Paxi">Paxi (PEP)</SelectItem>
                                <SelectItem value="Uber Connect">Uber Connect</SelectItem>
                                <SelectItem value="The Courier Guy">The Courier Guy</SelectItem>
                                <SelectItem value="Internal Driver">Internal Driver</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tracking">Tracking Number / Valid PIN</Label>
                        <Input
                            id="tracking"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="e.g. D123456 or 1599"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={loading}>{loading ? 'Saving...' : 'Save & Mark Shipped'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
