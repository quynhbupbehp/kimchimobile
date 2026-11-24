const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('class="sw-toolbar"');
console.log('=== PART 3 OF SW-TOOLBAR ===');
console.log(html.slice(sIdx + 3000, sIdx + 5500));

