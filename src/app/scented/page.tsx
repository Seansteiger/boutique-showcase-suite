import { getCategories } from "@/lib/products";
import { TrustTicker } from "@/components/home/TrustTicker";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroAds } from '@/components/home/HeroAds';
import { OnSaleCarousel } from '@/components/home/OnSaleCarousel';
import { getAds, getOnSaleProducts } from "@/lib/products";

import { cookies } from "next/headers";
import { getStoreSettings } from "@/lib/settings";

import type { Metadata } from "next";

// Luxury boutique component imports
import { CinematicHero } from "@/components/home/CinematicHero";
import { BentoCategoryGrid } from "@/components/home/BentoCategoryGrid";
import { FragranceFinder } from "@/components/home/FragranceFinder";
import { FeaturedCurations } from "@/components/home/FeaturedCurations";

export const revalidate = 60; // Cache for 1 minute

export async function generateMetadata(): Promise<Metadata> {
  let brandName = "White-Label Store";
  try {
    const cookieStore = await cookies();
    const preview = cookieStore.get("theme_preview")?.value;
    const settings = await getStoreSettings(preview);
    brandName = settings.brandName;
  } catch (e) {}

  return {
    title: `${brandName} | #1 Essentials Store`,
    description: `Shop the best home and room essentials at ${brandName}. Free delivery available on selected orders.`,
  };
}

export default async function ScentedHomepage() {
  const [allCategories, ads, onSaleProducts] = await Promise.all([
    getCategories(),
    getAds(),
    getOnSaleProducts()
  ]);

  // Keep only scent categories for flagship Scented showcase
  const targetSlugs = ['les-parfums', 'bougies', 'huiles', 'brumes'];
  const categories = allCategories.filter(c => targetSlugs.includes(c.slug));

  // Filter products to show only Scented products on the flagship storefront
  const scentOnSaleProducts = onSaleProducts.filter(p => p.brand === "SCENTED");

  // 1. Fetch Convex store settings and resolve active preview override
  const cookieStore = await cookies();
  const preview = cookieStore.get("theme_preview")?.value;
  const settings = await getStoreSettings(preview);

  // 2. Map configuration identifiers to structural layout blocks
  const renderSection = (section: string) => {
    // Check if the widget is enabled
    if (!settings.enabledWidgets.includes(section)) return null;

    switch (section) {
      case "hero":
        return <HeroAds key="hero" initialAds={ads} />;
      case "ticker":
        return <TrustTicker key="ticker" />;
      case "onsale":
        return <OnSaleCarousel key="onsale" initialProducts={scentOnSaleProducts} />;
      case "categories":
        return <CategoryGrid key="categories" categories={categories} />;
      case "cinematic-hero-loop":
        return <CinematicHero key="cinematic-hero-loop" />;
      case "bento-category-grid":
        return <BentoCategoryGrid key="bento-category-grid" categories={categories} />;
      case "interactive-fragrance-finder":
      case "scent-discovery":
        return <FragranceFinder key="scent-discovery" />;
      case "featured-curations":
        return <FeaturedCurations key="featured-curations" initialProducts={scentOnSaleProducts} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="space-y-16 pb-16 pt-0">
          {/* Dynamically sequence components based on database layoutOrder */}
          {settings.layoutOrder.map((sectionName) => renderSection(sectionName))}
        </div>
      </main>
    </div>
  );
}
