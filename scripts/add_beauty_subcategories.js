const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addBeautySubcategories() {
  console.log('--- Adding Beauty & Cosmetics Subcategories ---');

  // 1. Find the parent category ID
  const { data: parent, error: pError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', '%Beauty & Cosmetics%')
    .single();

  if (pError || !parent) {
    console.error('Error finding Beauty & Cosmetics category:', pError?.message || 'Not found');
    return;
  }

  const parentId = parent.id;
  console.log(`Found parent category ID: ${parentId}`);

  const subcategories = [
    { name: 'Nails', slug: 'nails', parent_id: parentId },
    { name: 'Makeup', slug: 'makeup', parent_id: parentId },
    { name: 'Hair', slug: 'hair', parent_id: parentId }
  ];

  for (const sub of subcategories) {
    console.log(`Checking/Adding: ${sub.name}...`);
    
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', sub.name)
      .eq('parent_id', parentId)
      .single();

    if (existing) {
      console.log(`[Skip] ${sub.name} already exists under this parent.`);
      continue;
    }

    const { error: iError } = await supabase
      .from('categories')
      .insert([sub]);

    if (iError) {
      console.error(`Error inserting ${sub.name}:`, iError.message);
    } else {
      console.log(`[Added] ${sub.name} successfully.`);
    }
  }

  console.log('--- DB Update Complete ---');
}

addBeautySubcategories();
