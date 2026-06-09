import { Product, Category } from "@/types/database";
import { unstable_cache } from "next/cache";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { MOCK_SETTINGS, MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_ADS } from "./mockData";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210";
const convex = new ConvexHttpClient(convexUrl);

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop';

function mapToAppProduct(p: any) {
    let displayPrice = p.price;
    let totalStock = p.stockQuantity ?? p.stock_quantity ?? 0;
    let effectiveSalePrice: number | null = p.salePrice ?? p.sale_price ?? null;

    if (p.product_variations && p.product_variations.length > 0) {
        const prices = p.product_variations
            .map((v: any) => v.price)
            .filter((price: any): price is number => price !== null && price !== undefined);

        if (prices.length > 0) {
            const cheapestVariation = Math.min(...prices);
            if (effectiveSalePrice) {
                displayPrice = p.price;
            } else {
                displayPrice = cheapestVariation;
            }
        }
        totalStock = p.product_variations.reduce((sum: number, v: any) => sum + (v.stockQuantity ?? v.stock_quantity ?? 0), 0);
    }

    const imageUrls = p.imageUrls ?? p.image_urls;

    return {
        id: p.id ?? p._id?.toString(),
        name: p.title,
        slug: p.slug,
        status: p.status || 'published',
        description: p.description || '',
        price: displayPrice,
        salePrice: effectiveSalePrice,
        category: p.categories?.name ?? p.category ?? 'Uncategorized',
        categorySlug: p.categories?.slug ?? p.categorySlug ?? 'uncategorized',
        image: (imageUrls && imageUrls.length > 0) ? imageUrls[0] : PLACEHOLDER_IMAGE,
        images: (imageUrls && imageUrls.length > 0) ? imageUrls : [PLACEHOLDER_IMAGE],
        stock: totalStock,
        features: p.features || [],
        brand: p.brand || null,
        categoryId: p.categoryId ?? p.category_id
    };
}

const fetchProducts = async () => {
    try {
        const products = await convex.query(api.products.getProducts);
        if (!products || products.length === 0) {
            return MOCK_PRODUCTS;
        }
        return products.map(mapToAppProduct);
    } catch (e) {
        console.error('Error fetching products from Convex, falling back to mock products:', e);
        return MOCK_PRODUCTS;
    }
};

export const getProducts = process.env.NODE_ENV === "development"
    ? fetchProducts
    : unstable_cache(fetchProducts, ["products-list"], { revalidate: 60, tags: ["products"] });

export async function getAllProducts(status?: string, sort?: string, categoryId?: string, search?: string) {
    try {
        const products = await convex.query(api.products.getAllProducts, {
            status: status === 'all' ? undefined : status,
            sort,
            categoryId: categoryId === 'all' ? undefined : categoryId,
            search
        });
        if (!products || products.length === 0) {
            return MOCK_PRODUCTS;
        }
        return products.map(mapToAppProduct);
    } catch (e) {
        console.error('Error fetching all products from Convex, falling back to mock data:', e);
        let filtered = [...MOCK_PRODUCTS];
        if (categoryId && categoryId !== 'all') {
            filtered = filtered.filter(p => p.categoryId === categoryId);
        }
        if (search) {
            const query = search.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
        }
        return filtered;
    }
}

export async function getFeaturedProducts(limit = 4) {
    try {
        const products = await getProducts();
        return products.filter(p => p.status === 'published').slice(0, limit);
    } catch (e) {
        console.error('Error fetching featured products:', e);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    const getCachedProduct = unstable_cache(
        async (productSlug: string) => {
            try {
                const res = await convex.query(api.products.getProductBySlug, { slug: productSlug });
                if (!res) {
                    const mockProd = MOCK_PRODUCTS.find(p => p.slug === productSlug);
                    if (mockProd) {
                        return {
                            product: {
                                id: mockProd.id,
                                name: mockProd.name,
                                slug: mockProd.slug,
                                status: mockProd.status,
                                description: mockProd.description,
                                price: mockProd.price,
                                salePrice: mockProd.salePrice,
                                category: mockProd.category,
                                categorySlug: mockProd.categorySlug,
                                image: mockProd.image,
                                images: mockProd.images,
                                stock: mockProd.stock,
                                features: mockProd.features,
                                brand: mockProd.brand,
                                categoryId: mockProd.categoryId
                            },
                            variations: [
                                { id: "v1", attributes: { "Size": "100ml" }, price: mockProd.price, stock: mockProd.stock, image: null },
                                { id: "v2", attributes: { "Size": "50ml Travel" }, price: Math.floor(mockProd.price * 0.6), stock: mockProd.stock, image: null }
                            ]
                        };
                    }
                    return null;
                }

                return {
                    product: res.product,
                    variations: res.variations.map((v: any) => ({
                        id: v.id,
                        attributes: v.attributes,
                        price: v.price ?? null,
                        stock: v.stock,
                        image: v.image ?? null
                    }))
                };
            } catch (e) {
                console.error('Error fetching product by slug from Convex, falling back to mock:', e);
                const mockProd = MOCK_PRODUCTS.find(p => p.slug === productSlug);
                if (mockProd) {
                    return {
                        product: {
                            id: mockProd.id,
                            name: mockProd.name,
                            slug: mockProd.slug,
                            status: mockProd.status,
                            description: mockProd.description,
                            price: mockProd.price,
                            salePrice: mockProd.salePrice,
                            category: mockProd.category,
                            categorySlug: mockProd.categorySlug,
                            image: mockProd.image,
                            images: mockProd.images,
                            stock: mockProd.stock,
                            features: mockProd.features,
                            brand: mockProd.brand,
                            categoryId: mockProd.categoryId
                        },
                        variations: [
                            { id: "v1", attributes: { "Size": "100ml" }, price: mockProd.price, stock: mockProd.stock, image: null },
                            { id: "v2", attributes: { "Size": "50ml Travel" }, price: Math.floor(mockProd.price * 0.6), stock: mockProd.stock, image: null }
                        ]
                    };
                }
                return null;
            }
        },
        [`product-${slug}`],
        { revalidate: 60, tags: [`product-${slug}`, "products"] }
    );
    return getCachedProduct(slug);
}

const fetchCategories = async (): Promise<any[]> => {
    try {
        const categories = await convex.query(api.products.getCategories);
        if (!categories || categories.length === 0) {
            return MOCK_CATEGORIES;
        }
        return categories.map((c: any) => ({
            id: c._id.toString(),
            name: c.name,
            slug: c.slug,
            imageUrl: c.imageUrl || null,
            parentId: c.parentId || null,
            createdAt: c.createdAt
        }));
    } catch (e) {
        console.error('Error fetching categories from Convex, falling back to mock categories:', e);
        return MOCK_CATEGORIES;
    }
};

export const getCategories = process.env.NODE_ENV === "development"
    ? fetchCategories
    : unstable_cache(fetchCategories, ["categories-list"], { revalidate: 360, tags: ["categories"] });

const fetchAds = async () => {
    try {
        const ads = await convex.query(api.ads.getAds);
        if (!ads || ads.length === 0) {
            return MOCK_ADS;
        }
        return ads.map((ad: any) => ({
            id: ad._id.toString(),
            title: ad.title,
            subtitle: ad.subtitle || null,
            imageUrl: ad.imageUrl,
            link: ad.link || null,
            isActive: ad.isActive,
            type: ad.type || 'banner',
            createdAt: ad.createdAt
        }));
    } catch (e) {
        console.error('Error fetching ads from Convex, falling back to mock ads:', e);
        return MOCK_ADS;
    }
};

export const getAds = process.env.NODE_ENV === "development"
    ? fetchAds
    : unstable_cache(fetchAds, ["active-ads"], { revalidate: 180, tags: ["ads"] });

const fetchOnSaleProducts = async () => {
    try {
        const products = await getProducts();
        return products.filter(p => p.salePrice !== null && p.salePrice !== undefined && p.salePrice < p.price);
    } catch (e) {
        console.error('Error fetching on-sale products from Convex:', e);
        return [];
    }
};

export const getOnSaleProducts = process.env.NODE_ENV === "development"
    ? fetchOnSaleProducts
    : unstable_cache(fetchOnSaleProducts, ["products-on-sale"], { revalidate: 60, tags: ["products"] });
