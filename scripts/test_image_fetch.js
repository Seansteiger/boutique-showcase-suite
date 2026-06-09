const fs = require('fs');
const https = require('https');

const url = 'https://jozistudenthub.co.za/wp-content/uploads/2025/07/Room-decor.jpg';
const dest = 'scripts/test_image.jpg';

console.log(`Attempting to download ${url}...`);

const file = fs.createWriteStream(dest);

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    timeout: 10000 // 10s timeout
}, (response) => {
    console.log(`Status Code: ${response.statusCode}`);

    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => {
                console.log('Download completed: scripts/test_image.jpg');
                const stats = fs.statSync(dest);
                console.log(`File size: ${stats.size} bytes`);
            });
        });
    } else {
        console.error('Download failed with status:', response.statusCode);
        response.resume(); // Consume response data to free up memory
    }
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
