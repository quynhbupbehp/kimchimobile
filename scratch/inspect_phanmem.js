const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem ===');
console.log(html.slice(swIdx, swIdx + 2500));

