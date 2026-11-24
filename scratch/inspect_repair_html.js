const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const rStart = html.indexOf('repairSearchInput');
console.log(html.slice(rStart - 300, rStart + 500));

