import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/products'

export const revalidate = 3600; // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts();
    const categories = await getCategories();

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `https://jozistudenthub.co.za/shop/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `https://jozistudenthub.co.za/shop?category=${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const staticEntries: MetadataRoute.Sitemap = [
        {
            url: 'https://jozistudenthub.co.za',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://jozistudenthub.co.za/shop',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://jozistudenthub.co.za/legal/returns',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        }
    ];

    return [...staticEntries, ...categoryEntries, ...productEntries];
}
