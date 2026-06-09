"use client";

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getOnSaleProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export function OnSaleCarousel({ initialProducts = [] }: { initialProducts?: any[] }) {
    const [emblaRef] = useEmblaCarousel(
        { align: 'start', dragFree: true, loop: true },
        [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]
    );
    const [products, setProducts] = useState<any[]>(initialProducts);

    useEffect(() => {
        if (initialProducts.length > 0) return; // Skip fetch if data provided by server

        async function fetchProducts() {
            const data = await getOnSaleProducts();
            setProducts(data);
        }
        fetchProducts();
    }, [initialProducts]);

    if (products.length === 0) return null;

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#FFD700] animate-pulse drop-shadow-[0_0_10px_rgba(255,140,0,0.8)]">
                        ON SALE
                    </span>
                </h2>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {products.map((product, index) => (
                        <div key={product.id} className="flex-[0_0_160px] md:flex-[0_0_200px] min-w-0">
                            <ProductCard product={product} priority={index < 4} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
