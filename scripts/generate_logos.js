const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/images/payment');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// PayFast SVG (Based on official brand colors)
const payFastSvg = `
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="none"/>
  <text x="5" y="42" font-family="Arial, sans-serif" font-weight="bold" font-size="38" fill="#1a1a1a">Pay</text>
  <text x="75" y="42" font-family="Arial, sans-serif" font-weight="bold" font-size="38" fill="#D32F2F">Fast</text>
  <path d="M160 15 L175 30 L160 45 M170 15 L185 30 L170 45" stroke="#D32F2F" stroke-width="4" fill="none"/>
</svg>
`;

// Yoco SVG (Official Blue)
const yocoSvg = `
<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="none"/>
  <circle cx="35" cy="30" r="18" fill="#2F80ED"/>
  <text x="65" y="42" font-family="Arial, sans-serif" font-weight="bold" font-size="36" fill="#2F80ED">Yoco</text>
  <circle cx="28" cy="24" r="4" fill="white"/>
  <circle cx="42" cy="36" r="4" fill="white"/>
</svg>
`;

fs.writeFileSync(path.join(dir, 'payfast.svg'), payFastSvg.trim());
fs.writeFileSync(path.join(dir, 'yoco.svg'), yocoSvg.trim());

console.log('Logos generated successfully.');
