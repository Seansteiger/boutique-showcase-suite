const https = require('https');

const endpoints = [
    'https://online.yoco.com/v1/charges/',
    'https://payments.yoco.com/api/v1/charges/',
    'https://api.yoco.com/v1/charges/'
];

endpoints.forEach(url => {
    const req = https.request(url, { method: 'POST' }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`URL: ${url}`);
            console.log(`Status: ${res.statusCode}`);
            console.log(`Body: ${data.substring(0, 100)}...`); // First 100 chars
            console.log('---');
        });
    });

    req.on('error', (e) => {
        console.error(`URL: ${url} - Error: ${e.message}`);
    });

    req.end();
});
