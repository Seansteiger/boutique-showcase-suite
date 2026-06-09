
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProduct() {
    const id = 'c6e05f24-d00c-49a3-b88e-b18082b22f67';
    const { data, error } = await supabase
        .from('products')
        .select('id, title')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error:', error);
    } else if (!data) {
        console.log(`Product ${id} NOT FOUND in DB.`);
    } else {
        console.log(`Product found: ${data.name} (${data.id})`);
    }
}

checkProduct();
