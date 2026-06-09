"use server";

import { generateReceiptEmail, sendEmail } from "@/lib/email";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

const YOCO_SECRET = process.env.YOCO_SECRET_KEY!;

export async function verifyYocoPayment(orderId: string) {
    if (!orderId) return { error: "Missing Order ID" };

    try {
        // 1. Get Order from Convex
        const order = await convex.query(api.orders.getOrderById, { id: orderId });

        if (!order) return { error: "Order not found" };

        // If order has been cancelled
        if (order.status === 'cancelled') {
            return { success: false, status: 'cancelled', message: "This order has been cancelled." };
        }

        // If already paid or completed
        if (['paid', 'processing', 'shipped', 'delivered', 'completed'].includes(order.status)) {
            return { success: true, status: order.status };
        }

        return { success: false, message: "Payment verification pending. Please check your email." };
    } catch (err: any) {
        console.error("Payment Verify Error:", err);
        return { error: err.message };
    }
}

// Internal function to finalize order (used by Webhook)
export async function markOrderPaid(orderId: string, providerId: string, amountPaidInCents?: number) {
    console.log(`Marking order ${orderId} as PAID in Convex (Provider: ${providerId})`);

    // 1. Fetch Order FIRST to verify amount
    const order = await convex.query(api.orders.getOrderById, { id: orderId });

    if (!order) {
        console.error("Order not found for payment:", orderId);
        return false;
    }

    // 2. Verify Amount (if provided)
    if (amountPaidInCents !== undefined) {
        const orderTotalCents = Math.round(order.total * 100);
        const difference = Math.abs(amountPaidInCents - orderTotalCents);

        // Allow R1.00 (100 cents) difference for potential rounding issues
        if (difference > 100) {
            console.error(`Payment Mismatch! Paid: ${amountPaidInCents}, Expected: ${orderTotalCents}`);
            return false;
        }
    }

    // 3. Update DB in Convex
    await convex.mutation(api.orders.updateOrderStatus, {
        id: orderId,
        status: 'paid',
        paymentId: providerId
    });

    // 4. Send Email
    if (order) {
        const shippingAddr = order.shippingAddress as any;
        const emailHtml = generateReceiptEmail({
            orderId: order.id,
            customerName: `${shippingAddr?.firstName || ''} ${shippingAddr?.lastName || ''}`.trim() || "Customer",
            customerEmail: shippingAddr?.email || "",
            date: new Date(),
            items: order.items.map((i: any) => ({
                name: i.product?.title || "Product",
                quantity: i.quantity,
                price: i.unitPrice,
                image: i.product?.imageUrls?.[0] || "https://jozistudenthub.co.za/images/placeholder.png"
            })),
            subtotal: order.total - (shippingAddr?.shippingCost || 0),
            shipping: shippingAddr?.shippingCost || 0,
            total: order.total,
            shippingAddress: {
                address: shippingAddr?.streetAddress || shippingAddr?.address || "Address",
                city: shippingAddr?.city || "City"
            },
            paymentMethod: "Yoco (Card)",
            isAdmin: false
        });

        const recipientEmail = shippingAddr?.email;
        if (recipientEmail) {
            await sendEmail({
                to: recipientEmail,
                subject: `Order Receipt #${order.id.slice(0, 8)} - Jozi Student Hub`,
                html: emailHtml
            });

            // Send Admin Notification
            await sendEmail({
                to: "admin@jozistudenthub.co.za",
                subject: `[New Order] #${order.id.slice(0, 8)} Paid via Yoco`,
                html: generateReceiptEmail({
                    orderId: order.id,
                    customerName: `${shippingAddr?.firstName || ''} ${shippingAddr?.lastName || ''}`.trim() || "Customer",
                    customerEmail: shippingAddr?.email || "",
                    date: new Date(),
                    items: order.items.map((i: any) => ({
                        name: i.product?.title || "Product",
                        quantity: i.quantity,
                        price: i.unitPrice,
                        image: i.product?.imageUrls?.[0] || "https://jozistudenthub.co.za/images/placeholder.png"
                    })),
                    subtotal: order.total - (shippingAddr?.shippingCost || 0),
                    shipping: shippingAddr?.shippingCost || 0,
                    total: order.total,
                    shippingAddress: {
                        address: shippingAddr?.streetAddress || shippingAddr?.address || "Address",
                        city: shippingAddr?.city || "City"
                    },
                    paymentMethod: "Yoco (Card)",
                    isAdmin: true
                })
            });
        }
    }

    return true;
}
