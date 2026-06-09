"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { OrderWithProfile } from "@/types/orders";

import { OrderTable } from "@/components/admin/OrderTable";
import { FulfillmentDialog } from "@/components/admin/FulfillmentDialog";
import { DeliveryDetailsDialog } from "@/components/admin/DeliveryDetailsDialog";
import { OrderItemsDialog } from "@/components/admin/OrderItemsDialog";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    // Fulfillment Modal State
    const [isFulfillOpen, setIsFulfillOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithProfile | null>(null);

    // Address Modal State
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [selectedAddressOrder, setSelectedAddressOrder] = useState<OrderWithProfile | null>(null);

    // Items Modal State
    const [isItemsOpen, setIsItemsOpen] = useState(false);
    const [selectedItemsOrder, setSelectedItemsOrder] = useState<OrderWithProfile | null>(null);

    // Filter State
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

    const filteredOrders = orders.filter(order => {
        const status = order.status.toLowerCase();
        const isArchived = ['delivered', 'cancelled', 'completed'].includes(status);
        return activeTab === 'archived' ? isArchived : !isArchived;
    });

    const handleViewAddress = (order: OrderWithProfile) => {
        setSelectedAddressOrder(order);
        setIsAddressOpen(true);
    };

    const handleViewItems = (order: OrderWithProfile) => {
        setSelectedItemsOrder(order);
        setIsItemsOpen(true);
    };

    // Fetch orders lazily
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { getAdminOrders } = await import("@/app/actions/admin");
            const { orders, error } = await getAdminOrders();

            if (error) {
                console.error("Error fetching orders:", error);
                alert("Failed to fetch orders: " + error);
            } else {
                setOrders((orders as unknown as OrderWithProfile[]) || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (order: OrderWithProfile, newStatus: string) => {
        if (newStatus === 'shipped' || newStatus === 'out_for_delivery') {
            // Open Modal
            setSelectedOrder(order);
            setIsFulfillOpen(true);
        } else {
            // Just update immediately
            updateStatus(order.id, newStatus);
        }
    };

    const confirmFulfillment = async (orderId: string, trackingNumber: string, provider: string) => {
        setUpdating(orderId);
        const { updateOrderStatus } = await import("@/app/actions/admin");
        const { error } = await updateOrderStatus(orderId, 'shipped', trackingNumber, provider);

        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? {
                ...o,
                status: 'shipped',
                tracking_number: trackingNumber,
                shipping_provider: provider
            } : o));
            setIsFulfillOpen(false);
        } else {
            alert("Failed to update tracking info");
        }
        setUpdating(null);
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdating(orderId);
        const { updateOrderStatus } = await import("@/app/actions/admin");
        const { error } = await updateOrderStatus(orderId, newStatus);

        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } else {
            alert("Failed to update status");
        }
        setUpdating(null);
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <Button variant="outline" onClick={fetchOrders}>Refresh</Button>
            </div>

            <div className="flex space-x-2 mb-4">
                <Button
                    variant={activeTab === 'active' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('active')}
                    className="gap-2"
                >
                    Active Orders
                    <Badge variant="secondary" className="ml-1 text-xs">
                        {orders.filter(o => !['delivered', 'cancelled', 'completed'].includes(o.status)).length}
                    </Badge>
                </Button>
                <Button
                    variant={activeTab === 'archived' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('archived')}
                    className="gap-2"
                >
                    Archived
                </Button>
            </div>

            <OrderTable
                orders={filteredOrders}
                activeTab={activeTab}
                updatingId={updating}
                onStatusChange={handleStatusChange}
                onViewAddress={handleViewAddress}
                onViewItems={handleViewItems}
            />

            <FulfillmentDialog
                open={isFulfillOpen}
                onOpenChange={setIsFulfillOpen}
                order={selectedOrder}
                onConfirm={confirmFulfillment}
            />

            <DeliveryDetailsDialog
                open={isAddressOpen}
                onOpenChange={setIsAddressOpen}
                order={selectedAddressOrder}
            />

            <OrderItemsDialog
                open={isItemsOpen}
                onOpenChange={setIsItemsOpen}
                order={selectedItemsOrder}
            />
        </div>
    );
}
