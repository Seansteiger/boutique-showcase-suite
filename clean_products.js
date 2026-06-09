const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'wc-product-export-13-1-2026-1768308700904.csv');

// Helper to strip HTML tags
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

// Simple CSV Parser handling quoted fields
function parseCsv(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField);
                currentField = '';
            } else if (char === '\n' || char === '\r') {
                if (currentField || currentLine.length > 0) {
                    currentLine.push(currentField);
                    lines.push(currentLine);
                }
                currentLine = [];
                currentField = '';
                if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
            } else {
                currentField += char;
            }
        }
    }
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
    }
    return lines;
}

try {
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    const rows = parseCsv(fileContent);

    if (rows.length < 2) {
        console.error('CSV file is empty or only has headers');
        process.exit(1);
    }

    const headers = rows[0].map(h => h.trim());
    const data = rows.slice(1);

    // Map headers to indices
    const getIdx = (name) => headers.indexOf(name);

    const idIdx = getIdx('ID');
    const typeIdx = getIdx('Type');
    const nameIdx = getIdx('Name');
    const descIdx = getIdx('Description');
    const shortDescIdx = getIdx('Short description');
    const regPriceIdx = getIdx('Regular price');
    const salePriceIdx = getIdx('Sale price');
    const categoriesIdx = getIdx('Categories');
    const imagesIdx = getIdx('Images');
    const parentIdx = getIdx('Parent');
    const attr1NameIdx = getIdx('Attribute 1 name');
    const attr1ValIdx = getIdx('Attribute 1 value(s)');

    const products = {};

    // First pass: Process simple and variable (parent) products
    data.forEach(row => {
        const type = row[typeIdx];
        const id = row[idIdx];

        if (type === 'simple' || type === 'variable') {
            products[id] = {
                id,
                name: row[nameIdx],
                type,
                description: stripHtml(row[descIdx] || row[shortDescIdx]),
                price: row[salePriceIdx] || row[regPriceIdx],
                regularPrice: row[regPriceIdx],
                salePrice: row[salePriceIdx],
                categories: row[categoriesIdx],
                images: (row[imagesIdx] || '').split(',').map(s => s.trim()).filter(Boolean),
                variations: [],
                attributes: []
            };

            // Capture base attributes if defined on parent
            if (row[attr1NameIdx]) {
                products[id].attributes.push({
                    name: row[attr1NameIdx],
                    values: row[attr1ValIdx]
                });
            }
        }
    });

    // Second pass: Process variations and attach to parents
    data.forEach(row => {
        const type = row[typeIdx];

        if (type === 'variation') {
            const parentId = row[parentIdx]?.replace('id:', '');

            if (parentId && products[parentId]) {
                products[parentId].variations.push({
                    id: row[idIdx],
                    name: row[nameIdx],
                    price: row[salePriceIdx] || row[regPriceIdx],
                    regularPrice: row[regPriceIdx],
                    salePrice: row[salePriceIdx],
                    image: (row[imagesIdx] || '').split(',').map(s => s.trim()).shift(), // main variation image
                    attributes: {
                        [row[attr1NameIdx]]: row[attr1ValIdx]
                    }
                });
            }
        }
    });

    const cleanedProducts = Object.values(products);

    // Output JSON
    fs.writeFileSync('products_cleaned.json', JSON.stringify(cleanedProducts, null, 2));

    // Output Text Summary
    let summary = '';
    cleanedProducts.forEach(p => {
        summary += `Name: ${p.name}\n`;
        summary += `Type: ${p.type}\n`;
        if (p.price) summary += `Price: R${p.price}\n`;
        if (p.description) summary += `Description:\n${p.description}\n`;

        if (p.variations.length > 0) {
            summary += `Variations:\n`;
            p.variations.forEach(v => {
                let attrs = Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ');
                summary += `  - ${v.name} | Price: R${v.price || p.price} | ${attrs}\n`;
            });
        }
        summary += `--------------------------------------------------\n\n`;
    });

    fs.writeFileSync('products_summary.txt', summary);

    console.log(`Successfully cleaned ${cleanedProducts.length} products.`);
    console.log('Created products_cleaned.json and products_summary.txt');

} catch (err) {
    console.error('Error processing CSV:', err);
}
