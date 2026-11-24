const fs = require('fs');

const seedContent = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(seedContent);

if (window.SEED_BANGA_DATA) {
  console.log('SEED_BANGA_DATA length:', window.SEED_BANGA_DATA.length);
  console.log('Sample BANGA item:', window.SEED_BANGA_DATA[0]);
}

if (window.SEED_SALES_DATA) {
  console.log('SEED_SALES_DATA length:', window.SEED_SALES_DATA.length);
  console.log('Sample SALES item:', window.SEED_SALES_DATA[0]);
}

