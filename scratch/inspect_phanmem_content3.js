const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 7500-11000 ===');
console.log(html.slice(swIdx + 7500, swIdx + 11000));

