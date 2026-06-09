const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const csvFilePath = 'Imports/user_export_2026-01-16-12-19-57.csv';

const importUsers = async () => {
    const users = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', async () => {
            console.log(`Found ${users.length} users to import.`);

            for (const user of users) {
                const email = user.user_email;
                const password = 'TemporaryPassword123!'; // Dummy password
                const displayName = user.display_name || user.user_login;

                if (!email) {
                    console.warn(`Skipping user with no email: ${user.user_login}`);
                    continue;
                }

                console.log(`Importing: ${email}...`);

                const { data, error } = await supabase.auth.admin.createUser({
                    email: email,
                    password: password,
                    email_confirm: true, // Auto-confirm to avoid spam
                    user_metadata: {
                        full_name: displayName,
                        username: user.user_login,
                        legacy_import: true
                    }
                });

                if (error) {
                    console.error(`Error importing ${email}:`, error.message);
                } else {
                    console.log(`Success: ${email} (ID: ${data.user.id})`);
                }
            }
            console.log('User import completed.');
        });
};

importUsers();
