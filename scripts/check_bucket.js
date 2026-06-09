const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBucket() {
    console.log('Checking for "products" bucket...');
    const { data, error } = await supabase.storage.getBucket('products');

    if (error) {
        console.error('Error fetching bucket:', error.message);
        if (error.message.includes('not found')) {
            console.log('Bucket "products" does not exist. Attempting to create...');
            const { data: createData, error: createError } = await supabase.storage.createBucket('products', {
                public: true
            });
            if (createError) {
                console.error('Failed to create bucket:', createError.message);
            } else {
                console.log('Bucket "products" created successfully!');
            }
        }
    } else {
        console.log('Bucket "products" exists and is ready.');
        console.log('Public:', data.public);
    }
}

checkBucket();
