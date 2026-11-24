const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const swIdx = html.indexOf('class="sw-toolbar"');
console.log(html.slice(swIdx, swIdx + 1200));

