const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://etargayvjbhxthzpwmno.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YXJnYXl2amJoeHRoenB3bW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0NzcyMCwiZXhwIjoyMDgzODIzNzIwfQ.dYmxxsh_wqZehqaxudrRVs8WIv9TGWTmMtRSVJoHWqM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRoles() {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log('Profiles:', profiles);
}

checkRoles();
