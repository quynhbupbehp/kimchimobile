const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('class="sw-toolbar"');
console.log('=== PART 2 OF SW-TOOLBAR ===');
console.log(html.slice(sIdx + 2000, sIdx + 4500));

