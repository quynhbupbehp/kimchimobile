const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('class="sw-toolbar"');
console.log(html.slice(sIdx - 50, sIdx + 400));

