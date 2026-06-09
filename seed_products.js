const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
let env = {};
try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    console.log('Read .env.local, length:', envFile.length);
    envFile.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
            env[key] = value;
        }
    });
    console.log('Loaded keys:', Object.keys(env));
} catch (e) {
    console.error('Could not read .env.local', e.message);
    process.exit(1);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have credentials
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    // console.log('Parsed env:', env); // SECURITY RISK: Don't do this
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = JSON.parse(fs.readFileSync('products_cleaned.json', 'utf8'));

// Categories map based on previous SQL query
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
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const generatedSlugs = new Set();

async function processProduct(p, isVariant = false, parentName = '') {
    const name = isVariant ? p.name : p.name;
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (generatedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    generatedSlugs.add(slug);

    let catId = null;
    if (p.categories) {
        const cats = p.categories.split(',').map(c => c.trim());
        for (const c of cats) {
            if (categoryMap[c]) {
                catId = categoryMap[c];
                break;
            }
        }
    }

    const price = parseFloat(p.price || 0);
    const stock = p.stock || 50;
    const description = p.description || '';
    const images = (p.images || []);

    const productData = {
        title: name,
        slug: slug,
        description: description,
        price: price,
        category_id: catId,
        image_urls: images,
        stock_quantity: stock,
        is_featured: false,
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'slug' })
        .select();

    if (error) {
        console.error(`Error inserting ${slug}:`, error.message);
    } else {
        // success
    }
}

async function main() {
    for (const p of products) {
        if (p.type === 'variable' && p.variations.length > 0) {
            for (const v of p.variations) {
                v.categories = p.categories;
                v.description = v.description || p.description;
                await processProduct(v, true, p.name);
            }
        } else {
            await processProduct(p);
        }
    }
    console.log('Seeding completed.');
}

main();
