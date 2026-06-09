const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://etargayvjbhxthzpwmno.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YXJnYXl2amJoeHRoenB3bW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0NzcyMCwiZXhwIjoyMDgzODIzNzIwfQ.dYmxxsh_wqZehqaxudrRVs8WIv9TGWTmMtRSVJoHWqM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function consolidate() {
    console.log('Starting consolidation...');

    // Helper to get ID by name (fuzzy or exact)
    const { data: allCats, error: catError } = await supabase.from('categories').select('id, name, slug');

    if (catError || !allCats) {
        console.error("Failed to fetch categories:", catError);
        return;
    }

    const findCat = (nameStr) => allCats.find(c => c.name.toLowerCase() === nameStr.toLowerCase());

    // 1. Rename 'Electronics' to 'Tech'
    // But check if 'Tech' already exists (it does, empty). We must delete the empty 'Tech' first or merge?
    // Actually, if we rename 'Electronics' to 'Tech', it might conflict with existing 'Tech' slug.
    // So:
    // A. Delete existing empty 'Tech'
    // B. Rename 'Electronics' to 'Tech'

    const techEmpty = findCat('Tech');
    const electronics = findCat('Electronics');

    if (techEmpty && electronics) {
        console.log(`Deleting empty 'Tech' (${techEmpty.id})...`);
        await supabase.from('categories').delete().eq('id', techEmpty.id);

        console.log(`Renaming 'Electronics' (${electronics.id}) to 'Tech'...`);
        await supabase.from('categories').update({ name: 'Tech', slug: 'tech' }).eq('id', electronics.id);
    } else if (electronics && !techEmpty) {
        console.log(`Renaming 'Electronics' to 'Tech' (No conflict)...`);
        await supabase.from('categories').update({ name: 'Tech', slug: 'tech' }).eq('id', electronics.id);
    }

    // 2. Merge Study stuff
    // 'Desk Essentials' -> 'Study'
    // 'Study Essentials' -> 'Study'
    const study = findCat('Study');
    if (study) {
        const toMerge = ['Desk Essentials', 'Study Essentials'];
        for (const name of toMerge) {
            const cat = findCat(name);
            if (cat) {
                console.log(`Merging '${cat.name}' into 'Study'...`);
                // Move products
                const { error: moveError } = await supabase
                    .from('products')
                    .update({ category_id: study.id })
                    .eq('category_id', cat.id);

                if (!moveError) {
                    // Delete category
                    await supabase.from('categories').delete().eq('id', cat.id);
                }
            }
        }
    }

    // 3. Delete Empty Duplicates
    // 'Tech & Gadgets', 'Tech Accessories', 'Kitchen Essentials', 'Gamenight', 'Self-care', 'Study Gear'
    const toDelete = [
        'Tech & Gadgets',
        'Tech Accessories',
        'Kitchen Essentials',
        'Gamenight',
        'Self-care',
        'Study Gear'
    ];

    for (const name of toDelete) {
        const cat = findCat(name);
        if (cat) {
            console.log(`Deleting empty '${cat.name}'...`);
            await supabase.from('categories').delete().eq('id', cat.id);
        }
    }

    console.log('Consolidation complete.');
}

consolidate();
