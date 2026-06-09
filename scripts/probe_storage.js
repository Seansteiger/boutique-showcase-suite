const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles() {
  const { data, error } = await supabase.storage.from('products').list('', { limit: 100 });
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('--- Current Storage State ---');
  data.forEach(item => {
    console.log(`[${item.id ? 'File' : 'Folder'}] ${item.name}`);
  });
}

listFiles();
