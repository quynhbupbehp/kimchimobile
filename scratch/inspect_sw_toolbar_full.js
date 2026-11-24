const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('class="sw-toolbar"');
console.log('=== FULL SW-TOOLBAR ===');
console.log(html.slice(sIdx, sIdx + 4500));

