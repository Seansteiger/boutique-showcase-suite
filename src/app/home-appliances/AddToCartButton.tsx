"use client";

import { useCartStore, Product } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function AddToCartButton({ product }: { product: any }) {
  const { addItem, setIsOpen } = useCartStore();

  const handleAdd = () => {
    // Map to the cart store format
    const itemToAdd: Product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.salePrice,
      image: product.image,
      category: product.category,
    };
    
    addItem(itemToAdd);
    toast.success(`${product.name} added to your bag`);
    setIsOpen(true); // Open the cart sidebar
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full mt-4 bg-[#1b1c1c] text-white hover:bg-[#d4af37] transition-all py-3.5 uppercase text-[9px] font-black tracking-widest flex items-center justify-center gap-2 rounded-[4px]"
    >
      <ShoppingBag className="h-4 w-4 stroke-[2]" />
      Add to Bag
    </button>
  );
}
