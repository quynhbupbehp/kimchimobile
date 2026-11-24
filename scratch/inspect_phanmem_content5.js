const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 14500-17500 ===');
console.log(html.slice(swIdx + 14500, swIdx + 17500));

