"use client";

import { useCartStore, Product } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export function AddToCartButton({ product }: { product: any }) {
  const { addItem, setIsOpen } = useCartStore();

  const handleAdd = () => {
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
    toast.success(`${product.name} added to showroom list`);
    setIsOpen(true);
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full mt-4 bg-[#121212] text-white hover:bg-[#d4af37] transition-all py-3.5 uppercase text-[9px] font-semibold tracking-widest flex items-center justify-center gap-2 rounded-none"
    >
      <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
      Select Piece
    </button>
  );
}
