"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Simple Cart Context Placeholder to fix build
// This should be replaced by real Cart Logic if it exists elsewhere or expanded
interface CartContextType {
    items: any[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState([]);

    return (
        <CartContext.Provider value={{ items, addToCart: () => { }, removeFromCart: () => { }, clearCart: () => { }, total: 0 }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
