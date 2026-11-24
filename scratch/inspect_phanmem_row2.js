const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('DANH SÁCH PHẦN MỀM');
console.log('=== DANH SÁCH PHẦN MỀM row ===');
console.log(html.slice(swIdx - 100, swIdx + 2000));

