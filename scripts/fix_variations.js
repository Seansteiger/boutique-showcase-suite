const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Manually parse .env.local
let env = {};
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            env[key] = value;
        }
    });
} catch (e) {
    console.error('Could not read .env.local', e.message);
    process.exit(1);
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../products_cleaned.json'), 'utf8'));

// Category Map
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

async function fixVariations() {
    console.log('Starting variation fix...');

    // Filter only variable products
    const variableProducts = products.filter(p => p.type === 'variable' && p.variations.length > 0);
    console.log(`Found ${variableProducts.length} variable products to process.`);

    for (const p of variableProducts) {
        console.log(`Processing Parent: ${p.name}`);
        const parentSlug = slugify(p.name);

        // 1. Resolve Category ID
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

        // 2. Upsert Parent Product
        const parentData = {
            title: p.name,
            slug: parentSlug,
            description: p.description,
            price: parseFloat(p.price || 0), // Base price (often 0 for variables, logic might need min price)
            sale_price: p.salePrice ? parseFloat(p.salePrice) : null,
            category_id: catId,
            image_urls: p.images || [],
            stock_quantity: 100, // Aggregate or default
            updated_at: new Date().toISOString()
        };

        const { data: parentProduct, error: parentError } = await supabase
            .from('products')
            .upsert(parentData, { onConflict: 'slug' })
            .select()
            .single();

        if (parentError) {
            console.error(`Error upserting parent ${p.name}:`, parentError.message);
            continue;
        }

        console.log(`  > Upserted Parent ID: ${parentProduct.id}`);

        // 3. Process Variations
        for (const v of p.variations) {
            const variantSlug = slugify(v.name);
            console.log(`    > Fixing Variant: ${v.name} (${variantSlug})`);

            // A. DELETE the loose product if it exists
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('slug', variantSlug);

            if (deleteError) console.error(`      Error deleting loose variant: ${deleteError.message}`);

            // B. Insert into product_variations
            const variantData = {
                product_id: parentProduct.id,
                attributes: v.attributes || {}, // Check if attributes exist
                price: parseFloat(v.price || 0),
                stock_quantity: 50, // Default
                image_url: v.image || null
            };

            // Avoid duplicates
            const { error: variationError } = await supabase
                .from('product_variations')
                .upsert(variantData, { onConflict: 'product_id, attributes' }); // Requires unique index

            if (variationError) {
                // If unique constraint violation, try to match manually or ignore
                console.error(`      Error creation variation row: ${variationError.message}`);
            }
        }
    }

    console.log('Variation fix complete.');
}

fixVariations();
