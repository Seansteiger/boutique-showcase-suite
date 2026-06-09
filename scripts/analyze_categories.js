const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://etargayvjbhxthzpwmno.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YXJnYXl2amJoeHRoenB3bW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0NzcyMCwiZXhwIjoyMDgzODIzNzIwfQ.dYmxxsh_wqZehqaxudrRVs8WIv9TGWTmMtRSVJoHWqM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function analyzeCategories() {
    console.log('Fetching categories and product counts...');

    // 1. Get all categories
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug');

    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    // 2. Get all products to count usage
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, category_id, title');

    if (prodError) {
        console.error('Error fetching products:', prodError);
        return;
    }

    // 3. Aggregate
    const stats = {};
    categories.forEach(c => {
        stats[c.id] = { ...c, count: 0, products: [] };
    });

    products.forEach(p => {
        if (stats[p.category_id]) {
            stats[p.category_id].count++;
            stats[p.category_id].products.push(p.title); // Store titles for context
        } else {
            // Handle uncategorized or orphaned IDs
            if (!stats['orphaned']) stats['orphaned'] = { name: 'ORPHANED', count: 0, products: [] };
            stats['orphaned'].count++;
            stats['orphaned'].products.push(p.title);
        }
    });

    // 4. Output
    console.log('\n--- Category Analysis ---');
    console.log('ID | Name | Slug | Product Count');

    // Convert to array for sorting
    const list = Object.values(stats).sort((a, b) => b.count - a.count); // Most populated first

    list.forEach(c => {
        console.log(`${c.id} | "${c.name}" | ${c.slug} | ${c.count} products`);
        if (c.count < 5 && c.products.length > 0) {
            console.log(`   Sample products: ${c.products.slice(0, 3).join(', ')}`);
        }
    });
}

analyzeCategories();
