const fs = require('fs');

// Load seed data
const seedContent = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(seedContent);

console.log('SEED_SOLD_DATA length:', window.SEED_SOLD_DATA.length);
const xsSold = window.SEED_SOLD_DATA.filter(p => (p.name || '').toLowerCase().includes('xs'));
console.log('XS in SEED_SOLD_DATA:', xsSold.map(p => ({ brand: p.brand, name: p.name, imei: p.imei })));

