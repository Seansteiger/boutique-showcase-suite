const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'products';

async function organizeStorage() {
  console.log('--- Starting Storage Organization ---');

  // 1. Fetch all products and variations
  const { data: products, error: pError } = await supabase.from('products').select('id, name, brand, category_id, image_url, images');
  const { data: variations, error: vError } = await supabase.from('product_variations').select('id, product_id, image_url');

  if (pError || vError) {
    console.error('Error fetching data:', pError || vError);
    return;
  }

  // 2. Fetch all files in the root of the bucket
  const { data: files, error: fError } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1000 });
  if (fError) {
    console.error('Error listing files:', fError);
    return;
  }

  const rootFiles = files.filter(f => f.metadata); // Only actual files, not "folders"
  console.log(`Found ${rootFiles.length} files at the root.`);

  for (const file of rootFiles) {
    const fileName = file.name;
    const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data.publicUrl;

    // Find if this file is used by any product or variation
    const matchingProducts = products.filter(p => p.image_url === publicUrl || (Array.isArray(p.images) && p.images.includes(publicUrl)));
    const matchingVariations = variations.filter(v => v.image_url === publicUrl);

    if (matchingProducts.length === 0 && matchingVariations.length === 0) {
      console.log(`[Skip] ${fileName} not associated with any active product.`);
      continue;
    }

    // Determine the destination folder
    // Priority: Brand > Category > "unorganized"
    let targetFolder = 'unorganized';
    if (matchingProducts.length > 0) {
      const brand = matchingProducts[0].brand;
      if (brand) {
        targetFolder = `brands/${brand.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        targetFolder = `categories/product-${matchingProducts[0].id.substring(0, 4)}`;
      }
    } else if (matchingVariations.length > 0) {
      // Find the parent product's brand for the variation
      const parentProd = products.find(p => p.id === matchingVariations[0].product_id);
      if (parentProd && parentProd.brand) {
        targetFolder = `brands/${parentProd.brand.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }

    const newPath = `${targetFolder}/${fileName}`;
    console.log(`[Move] ${fileName} -> ${newPath}`);

    // 3. Move the file
    const { error: mError } = await supabase.storage.from(BUCKET_NAME).move(fileName, newPath);
    if (mError) {
      if (mError.message.includes('already exists')) {
        console.log(`[Info] ${newPath} already exists, skipping move but will update DB.`);
      } else {
        console.error(`Error moving ${fileName}:`, mError);
        continue;
      }
    }

    // 4. Update Database records
    const newPublicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(newPath).data.publicUrl;

    for (const p of matchingProducts) {
      const updates = {};
      if (p.image_url === publicUrl) updates.image_url = newPublicUrl;
      if (Array.isArray(p.images)) {
        updates.images = p.images.map(img => img === publicUrl ? newPublicUrl : img);
      }

      const { error: upError } = await supabase.from('products').update(updates).eq('id', p.id);
      if (upError) console.error(`Error updating product ${p.id}:`, upError);
    }

    for (const v of matchingVariations) {
      const { error: uvError } = await supabase.from('product_variations').update({ image_url: newPublicUrl }).eq('id', v.id);
      if (uvError) console.error(`Error updating variation ${v.id}:`, uvError);
    }
  }

  console.log('--- Organization Complete ---');
}

organizeStorage();
