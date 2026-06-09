const fs = require('fs');
const https = require('https');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Config
const XML_PATH = 'C:/Users/MELVILLE/Downloads/Image export-jozistudenthub.WordPress.2026-01-16.xml';
const TEMP_DIR = 'temp_images';
const BUCKET_NAME = 'products';

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Env vars missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Regex to find URLs
const URL_REGEX = /<wp:attachment_url><!\[CDATA\[(.*?)\]\]><\/wp:attachment_url>/g;

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const req = https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 MirrorBot/1.0' },
            timeout: 15000
        }, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Status ${res.statusCode}`));
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve());
            });
        });

        req.on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function uploadToSupabase(filePath, fileName) {
    const fileContent = fs.readFileSync(filePath);
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileContent, {
            contentType: 'image/jpeg', // Defaulting to jpeg, Supabase might auto-detect or we can be more smart
            upsert: true
        });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

async function main() {
    console.log('Starting migration...');

    if (!fs.existsSync(XML_PATH)) {
        console.error('XML file not found:', XML_PATH);
        return;
    }

    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR);
    }

    const xmlContent = fs.readFileSync(XML_PATH, 'utf8');
    const urls = [];
    let match;
    while ((match = URL_REGEX.exec(xmlContent)) !== null) {
        urls.push(match[1]);
    }

    const uniqueUrls = [...new Set(urls)];
    console.log(`Found ${uniqueUrls.length} unique images.`);

    const results = [];

    for (const [index, url] of uniqueUrls.entries()) {
        const fileName = path.basename(url);
        const localPath = path.join(TEMP_DIR, fileName);

        console.log(`[${index + 1}/${uniqueUrls.length}] Processing: ${fileName}`);

        try {
            // 1. Download
            if (!fs.existsSync(localPath)) {
                console.log(`  Downloading...`);
                await downloadImage(url, localPath);
            } else {
                console.log(`  Using cached...`);
            }

            // 2. Upload
            console.log(`  Uploading to Supabase...`);
            const publicUrl = await uploadToSupabase(localPath, fileName);
            console.log(`  Success: ${publicUrl}`);

            results.push({ original: url, supabase: publicUrl });

        } catch (err) {
            console.error(`  Failed: ${err.message}`);
        }
    }

    // Save map
    fs.writeFileSync('image_migration_map.json', JSON.stringify(results, null, 2));
    console.log('Migration complete. Mapping saved to image_migration_map.json');
}

main();
