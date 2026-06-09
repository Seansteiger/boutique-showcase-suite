import fs from 'fs';

const content = fs.readFileSync('JSH_Products_Catalog.md', 'utf-8');
const lines = content.split('\n');
const products = [];

for (const line of lines) {
    if (line.startsWith('## ')) {
        products.push(line.substring(3).trim());
    }
}

console.log(JSON.stringify(products, null, 2));
