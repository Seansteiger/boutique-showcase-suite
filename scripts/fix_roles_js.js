const { createClient } = require('@supabase/supabase-js');

// Hardcoded for reliability in this script, based on .env.local view
const supabaseUrl = 'https://etargayvjbhxthzpwmno.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0YXJnYXl2amJoeHRoenB3bW5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODI0NzcyMCwiZXhwIjoyMDgzODIzNzIwfQ.dYmxxsh_wqZehqaxudrRVs8WIv9TGWTmMtRSVJoHWqM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixRoles() {
    console.log('Starting role audit...');

    // 1. Get ALL users from Auth
    let allUsers = [];
    let page = 1;
    const perPage = 50;

    while (true) {
        const { data: { users }, error } = await supabase.auth.admin.listUsers({
            page: page,
            perPage: perPage
        });

        if (error) {
            console.error('Error listing users:', error);
            break;
        }

        if (!users || users.length === 0) break;

        allUsers = [...allUsers, ...users];
        if (users.length < perPage) break;
        page++;
    }

    console.log(`Scanned ${allUsers.length} users.`);

    // 2. Check each user's profile role
    for (const user of allUsers) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            // console.error(`No profile for ${user.email}`); // Common for new auth entries
            continue;
        }

        if (profile && profile.role === 'admin') {
            if (user.email === 'nsdsekatane@gmail.com') {
                console.log(`CONFIRMED ADMIN: ${user.email} (Keeping)`);
            } else {
                console.log(`FOUND EXTRA ADMIN: ${user.email}. Demoting...`);
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ role: 'customer' })
                    .eq('id', user.id);

                if (updateError) {
                    console.error(`Failed to demote ${user.email}:`, updateError.message);
                } else {
                    console.log(`Successfully demoted ${user.email} to customer.`);
                }
            }
        }
    }

    console.log('Audit complete.');
}

fixRoles();
