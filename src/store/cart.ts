import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price?: number | null;
    image: string;
    category?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    discount: number;
    couponCode: string | null;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string, discount: number) => void;
    removeCoupon: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    setItems: (items: CartItem[]) => void;
}

function getCartStorageKey(defaultName: string): string {
    if (typeof window === 'undefined') return defaultName;
    const path = window.location.pathname.toLowerCase();
    const host = window.location.hostname.toLowerCase();
    
    if (host.includes('hhm') || path.startsWith('/hhm')) return 'hhm-cart-storage';
    if (host.includes('scented') || path.startsWith('/scented')) return 'scented-cart-storage';
    if (host.includes('furnish') || path.startsWith('/furnish')) return 'furnish-cart-storage';
    if (host.includes('foodco') || host.includes('food-co') || path.startsWith('/food-co')) return 'foodco-cart-storage';
    if (host.includes('home-appliances') || path.startsWith('/home-appliances')) return 'homeappliances-cart-storage';
    if (host.includes('invited') || path.startsWith('/invited')) return 'invited-cart-storage';
    
    return defaultName;
}

const customStateStorage = {
    getItem: (name: string): string | null => {
        const key = getCartStorageKey(name);
        return localStorage.getItem(key);
    },
    setItem: (name: string, value: string): void => {
        const key = getCartStorageKey(name);
        localStorage.setItem(key, value);
    },
    removeItem: (name: string): void => {
        const key = getCartStorageKey(name);
        localStorage.removeItem(key);
    }
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            discount: 0,
            couponCode: null,
            isOpen: false, // Initial state
            setIsOpen: (open) => set({ isOpen: open }),
            setItems: (items) => set({ items }),
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.product.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    set({ items: get().items.filter((item) => item.product.id !== productId) });
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ items: [], discount: 0, couponCode: null }),
            applyCoupon: (couponCode, discount) => set({ couponCode, discount }),
            removeCoupon: () => set({ couponCode: null, discount: 0 }),
            getCartTotal: () => {
                const subtotal = get().items.reduce((total, item) => {
                    const activePrice = item.product.sale_price !== null && item.product.sale_price !== undefined 
                                        ? item.product.sale_price 
                                        : item.product.price;
                    return total + activePrice * item.quantity;
                }, 0);
                return Math.max(0, subtotal - get().discount);
            },
            getCartCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'jsh-cart-storage',
            storage: createJSONStorage(() => customStateStorage),
            partialize: (state) => {
                const { isOpen, setIsOpen, ...rest } = state;
                return rest;
            },
        }
    )
);

