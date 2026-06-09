import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getProductBySlug, getFeaturedProducts, getProducts } from "@/lib/products";
import { VariantSelector } from "@/components/VariantSelector";
import { Metadata } from "next";
import { Reviews } from "@/components/Reviews";
import { ProductView } from "@/components/ProductView";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export const revalidate = 60; // Refresh cache every 60 seconds
export const dynamicParams = true; // Fallback to ISR for any new products

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getProductBySlug(slug);

    if (!data || !data.product) {
        return {
            title: "Product Not Found",
            description: "The requested product does not exist."
        };
    }

    const { product } = data;
    const description = product.description.substring(0, 160) + (product.description.length > 160 ? "..." : "");
    const images = product.image ? [product.image] : [];

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    let brandName = "White-Label Store";
    try {
        if (convexUrl && convexUrl.startsWith("http")) {
            const convexHttp = new ConvexHttpClient(convexUrl);
            const settings = await convexHttp.query(api.settings.get);
            if (settings) {
                brandName = settings.brandName;
            }
        }
    } catch (e) {}

    return {
        title: product.name,
        description: description,
        keywords: [product.category, "luxury fragrances", "scents", "handcrafted candles", product.name],
        openGraph: {
            title: product.name,
            description: description,
            url: `/shop/${product.slug}`,
            images: images.map(url => ({
                url,
                width: 800,
                height: 800,
                alt: product.name,
            })),
            type: 'website',
            locale: 'en_ZA',
            siteName: brandName,
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description,
            images: images,
        },
        alternates: {
            canonical: `/shop/${product.slug}`,
        }
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log("Fetching product for slug:", slug);
    const data = await getProductBySlug(slug);

    const relatedProducts = await getFeaturedProducts();
    // const relatedProducts: any[] = [];

    if (!data || !data.product) {
        console.log("Product not found for slug:", slug);
        return notFound();
    }

    const { product, variations: variants } = data;

    // Fetch brand name dynamically for schema
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
    let brandName = "White-Label Store";
    try {
        if (convexUrl && convexUrl.startsWith("http")) {
            const convexHttp = new ConvexHttpClient(convexUrl);
            const settings = await convexHttp.query(api.settings.get);
            if (settings) {
                brandName = settings.brandName;
            }
        }
    } catch (e) {}

    // Filter out current product from upsells
    const upsells = relatedProducts
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6 mb-24">
            <Breadcrumbs
                items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: product.category, href: `/shop?category=${product.category.toLowerCase().replace(' ', '-')}` },
                    { label: product.name, href: `/shop/${product.slug}` },
                ]}
                className="mb-8"
            />

            <ProductView product={product} variations={variants || []} />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.name,
                        image: product.image ? [product.image] : [],
                        description: product.description,
                        sku: product.id,
                        offers: {
                            "@type": "Offer",
                            url: `/shop/${product.slug}`,
                            priceCurrency: "ZAR",
                            price: product.salePrice || product.price,
                            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                            itemCondition: "https://schema.org/NewCondition",
                            shippingDetails: {
                                "@type": "OfferShippingDetails",
                                "shippingRate": {
                                    "@type": "MonetaryAmount",
                                    "value": 0,
                                    "currency": "ZAR"
                                },
                                "shippingDestination": {
                                    "@type": "DefinedRegion",
                                    "addressCountry": "ZA",
                                    "addressRegion": "Gauteng"
                                },
                                "deliveryTime": {
                                    "@type": "ShippingDeliveryTime",
                                    "handlingTime": {
                                        "@type": "QuantitativeValue",
                                        "minValue": 0,
                                        "maxValue": 1,
                                        "unitCode": "DAY"
                                    },
                                    "transitTime": {
                                        "@type": "QuantitativeValue",
                                        "minValue": 1,
                                        "maxValue": 3,
                                        "unitCode": "DAY"
                                    }
                                }
                            }
                        },
                        brand: {
                            "@type": "Brand",
                            name: brandName
                        }
                    })
                }}
            />

            {/* Upsell Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Complete the Vibe</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {upsells.map(p => (
                        <Link key={p.id} href={`/shop/${p.slug}`} className="group relative block">
                            <div className="aspect-square bg-secondary/5 rounded-lg overflow-hidden mb-2">
                                <Image src={p.image} alt={p.name} width={200} height={200} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{p.name}</h3>
                            <p className="text-xs text-muted-foreground">R{p.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
