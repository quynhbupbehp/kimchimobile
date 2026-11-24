const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('id="tab-phanmem"');
console.log('=== tab-phanmem 17000-19000 ===');
console.log(html.slice(swIdx + 17000, swIdx + 19000));

