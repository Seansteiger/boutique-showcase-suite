import { Order, Database } from './database';

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode?: string;
    province?: string;
    email: string;
    phone: string;
    shippingZone?: string;
    deliveryMethod?: string;
}

// Safe definition using Omit to replace properties
export interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    products?: {
        title: string;
        image_urls: string[] | null;
    } | null;
}

export type OrderWithProfile = Omit<Order, 'shipping_address'> & {
    profiles: {
        username: string | null;
        full_name: string | null;
        email: string | null;
    } | null;
    shipping_address: ShippingAddress | null;
    total_amount?: number; // Add missing property from DB schema alias or mismatch
    order_items?: OrderItem[];
    coupon_usages?: { coupon_code: string }[];
};
