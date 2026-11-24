const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="repSelectYear"');
console.log(html.slice(sIdx - 50, sIdx + 500));

