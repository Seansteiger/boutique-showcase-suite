const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(__dirname, '../public/images/payment');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const download = (url, filename) => {
    const file = fs.createWriteStream(path.join(dir, filename));
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(() => console.log('Downloaded ' + filename));
        });
    }).on('error', function (err) {
        fs.unlink(filename);
        console.error('Error downloading ' + filename, err.message);
    });
};

download('https://raw.githubusercontent.com/PayFast/payfast-logos/master/payfast_logo_color.png', 'payfast.png');
// Using a better Yoco source if possible, or the wiki one
download('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Yoco_Logo.svg/512px-Yoco_Logo.svg.png', 'yoco.png');
