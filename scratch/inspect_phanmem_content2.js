const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 4500-7500 ===');
console.log(html.slice(swIdx + 4500, swIdx + 7500));

