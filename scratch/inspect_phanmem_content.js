const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 2000-5000 ===');
console.log(html.slice(swIdx + 2000, swIdx + 4500));

