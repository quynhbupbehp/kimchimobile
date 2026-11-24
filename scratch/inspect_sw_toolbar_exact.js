const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('class="sw-toolbar"');
console.log(html.slice(sIdx - 30, sIdx + 450));

