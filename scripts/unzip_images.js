const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zipPath = 'C:/Users/MELVILLE/Downloads/pics.zip';
const outputDir = 'C:/Users/MELVILLE/Downloads/ExtractedImages';

async function unzipImages() {
    if (!fs.existsSync(zipPath)) {
        console.log('pics.zip not found.');
        return;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`Unzipping ${zipPath} to ${outputDir}...`);

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);
        console.log('Unzip complete.');

        // List extracted files
        const files = fs.readdirSync(outputDir);
        console.log(`Extracted ${files.length} files/folders.`);
        files.slice(0, 10).forEach(f => console.log(` - ${f}`));
    } catch (e) {
        console.error('Error unzipping:', e);
    }
}

unzipImages();
