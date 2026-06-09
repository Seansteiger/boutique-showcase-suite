export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    sale_price: number | null;
    category_id: string | null;
    image_urls: string[] | null;
    stock_quantity: number;
    is_featured: boolean;
    features: string[] | null;
    brand: string | null;
    status: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    parent_id: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    status: string;
    total: number;
    shipping_address: Json | null;
    created_at: string;
    tracking_number: string | null;
    shipping_provider: string | null;
}

export interface Database {
    public: {
        Tables: {
            products: { 
                Row: Product; 
                Insert: Omit<Product, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Product>;
            };
            categories: { 
                Row: Category;
                Insert: Omit<Category, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Category>;
            };
            orders: { 
                Row: Order;
                Insert: Omit<Order, 'id' | 'created_at'> & { id?: string; created_at?: string };
                Update: Partial<Order>;
            };
        }
    }
}
