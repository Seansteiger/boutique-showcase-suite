
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import Link from "next/link";
import { OrderWithProfile } from "@/types/orders";

interface OrderTableProps {
    orders: OrderWithProfile[];
    activeTab: 'active' | 'archived';
    updatingId: string | null;
    onStatusChange: (order: OrderWithProfile, newStatus: string) => void;
    onViewAddress: (order: OrderWithProfile) => void;
    onViewItems: (order: OrderWithProfile) => void;
}

export function OrderTable({
    orders,
    activeTab,
    updatingId,
    onStatusChange,

    onViewAddress,
    onViewItems
}: OrderTableProps) {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                No {activeTab} orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => {
                            const address = order.shipping_address;
                            const deliveryMethod = address?.deliveryMethod || 'Standard';
                            const shippingZone = address?.shippingZone || '';
                            const customerName = order.profiles?.username || order.profiles?.full_name || order.profiles?.email || 'Guest';

                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{customerName}</span>
                                            <span className="text-xs text-muted-foreground">{address?.firstName} {address?.lastName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={order.status.toLowerCase()}
                                            onValueChange={(val) => onStatusChange(order, val)}
                                            disabled={updatingId === order.id}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 text-xs border ${order.status.toLowerCase() === 'paid' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                order.status.toLowerCase() === 'shipped' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                                                    order.status.toLowerCase() === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                                                        order.status.toLowerCase() === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                                                            ''
                                                }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending Payment</SelectItem>
                                                <SelectItem value="paid">Paid / Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                                <SelectItem value="delivered">Delivered / Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className="flex flex-col cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                                            onClick={() => onViewAddress(order)}
                                            title="Click to view full address"
                                        >
                                            <Badge variant="secondary" className="w-fit text-xs font-normal mb-1 pointer-events-none">
                                                {deliveryMethod}
                                            </Badge>
                                            {shippingZone && <span className="text-[10px] text-muted-foreground uppercase">{shippingZone.replace('zone-', '')}</span>}
                                        </div>

                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors w-fit"
                                            onClick={() => onViewItems(order)}
                                        >
                                            <Badge variant="secondary" className="font-mono">
                                                {order.order_items?.reduce((sum, i) => sum + i.quantity, 0) || 0}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground underline decoration-dashed">View</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>

                                        {order.tracking_number ? (
                                            <div className="flex flex-col text-xs space-y-1">
                                                <Badge variant="outline" className="w-fit font-normal">
                                                    {order.shipping_provider || 'Courier'}
                                                </Badge>
                                                <span className="font-mono bg-muted/50 px-1 rounded select-all">
                                                    {order.tracking_number}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No tracking</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {order.total ? `R${Number(order.total).toFixed(2)}` : 'R0.00'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
