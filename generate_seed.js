const fs = require('fs');

const products = JSON.parse(fs.readFileSync('products_cleaned.json', 'utf8'));

const categoryMap = {
    "Study Essentials": "c92002a2-c929-4c22-9291-75a4ff82fd82",
    "Tech Accessories": "215a0086-16ed-402f-a1a0-07b87c868f06",
    "Desk Essentials": "92881287-b294-466d-8377-1dc6a8efb6e5",
    "Electronics": "fbf1a69c-8894-40aa-b026-429e152aba72",
    "Hygiene": "d3eb742f-8a3a-4fd9-9ebe-19438ed053d6",
    "Self-care": "0140f260-e422-4a9e-975f-a2736a55e515",
    "Gamenight": "56a6ea74-76bb-47bd-a4ef-fe8cc1d032e4",
    "Lifestyle": "cd4a59bd-11c5-44b6-9b45-d68d471e3c29",
    "Room Decor": "4901dbf0-ad73-4f73-a23d-4f04473bc467",
    "Kitchenware": "bee65c00-35c4-4296-a1ed-38ddcbd35e0c"
};

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = '';
const generatedSlugs = new Set();

function processProduct(p, isVariant = false, parentName = '') {
    const name = isVariant ? p.name : p.name;
    // Ensure unique slugs
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (generatedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    generatedSlugs.add(slug);

    // Map categories
    // The CSV had categories as comma separated string "Room Decor, Lifestyle"
    // We'll try to find the first matching ID
    let catId = 'NULL';
    if (p.categories) {
        const cats = p.categories.split(',').map(c => c.trim());
        for (const c of cats) {
            if (categoryMap[c]) {
                catId = `'${categoryMap[c]}'`;
                break;
            }
        }
    }

    const price = parseFloat(p.price || 0);
    const stock = p.stock || 50; // Default stock if missing
    // Clean description slightly more for SQL safe text (basic escape is handled, but check for weird chars if needed)
    const description = p.description || '';
    const images = (p.images || []).length > 0 ? `ARRAY[${p.images.map(i => escapeSql(i)).join(',')}]` : 'NULL';

    // Construct SQL
    // Using gen_random_uuid() for ID if it's a new insert
    // We match on SLUG for conflicts

    return `
INSERT INTO public.products (title, slug, description, price, category_id, image_urls, stock_quantity, is_featured, created_at, updated_at)
VALUES (
    ${escapeSql(name)},
    ${escapeSql(slug)},
    ${escapeSql(description)},
    ${price},
    ${catId},
    ${images},
    ${stock},
    false,
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    image_urls = EXCLUDED.image_urls,
    stock_quantity = EXCLUDED.stock_quantity,
    updated_at = NOW();
`;
}

products.forEach(p => {
    // If it's a variable product, we might want to insert the parent AND variations, 
    // OR just the variations if the parent is abstract.
    // The user requirement was "integrate... cleanly". 
    // Often in simple e-com models, variations are just separate products or there is a parent-child.
    // The supabase schema 'products' table doesn't have parent_id. 
    // So we will flatten everything into individual products.

    // HOWEVER, 'variable' parents in WooCommerce often act as a shell.
    // Let's inspect: if it has variations, we skip the parent row itself IF the parent row doesn't have a distinct price/stock?
    // The JSON shows parent has price "" often.

    if (p.type === 'variable' && p.variations.length > 0) {
        p.variations.forEach(v => {
            // Inherit categories/desc from parent if missing
            v.categories = p.categories;
            v.description = v.description || p.description;
            // Merge attributes into name for clarity if not already there
            // e.g. Name: "Fluffy cushions - Grey" is already good.

            sql += processProduct(v, true, p.name);
        });
    } else {
        // Simple product or variable with no variations (treated as simple)
        sql += processProduct(p);
    }
});

fs.writeFileSync('seed.sql', sql);
console.log('Generated seed.sql');
