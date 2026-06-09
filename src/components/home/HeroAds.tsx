"use client";

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { getAds } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Autoplay from 'embla-carousel-autoplay';

export function HeroAds({ initialAds = [] }: { initialAds?: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 8000 })]);
    const [ads, setAds] = useState<any[]>(initialAds);

    useEffect(() => {
        if (initialAds.length > 0) return; // Skip fetch if data provided by server

        async function fetchAds() {
            const data = await getAds();
            setAds(data);
        }
        fetchAds();
    }, [initialAds]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (ads.length === 0) return null;

    return (
        <div className="relative group overflow-hidden rounded-xl">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {ads.map((ad, index) => (
                        <div key={ad.id} className="relative flex-[0_0_100%] min-w-0 aspect-[21/9] md:aspect-[3/1]">
                            <Image
                                src={ad.image_url}
                                alt={ad.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 md:p-12">
                                <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">{ad.title}</h2>
                                {ad.link && (
                                    <Button asChild variant="default" size="lg" className="w-fit">
                                        <Link href={ad.link}>Explore Now</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-background/80 backdrop-blur-sm"
                onClick={scrollPrev}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-background/80 backdrop-blur-sm"
                onClick={scrollNext}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div >
    );
}
