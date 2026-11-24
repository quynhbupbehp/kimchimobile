const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 11000-14500 ===');
console.log(html.slice(swIdx + 11000, swIdx + 14500));

