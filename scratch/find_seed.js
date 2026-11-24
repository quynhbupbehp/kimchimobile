const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

const idx = js.indexOf('SEED_SOLD_DATA');
console.log('Context of SEED_SOLD_DATA:');
console.log(js.slice(idx - 50, idx + 200));

