const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bhStart = html.indexOf('id="tab-banhang"');
console.log('=== TAB BAN HANG 2500-6000 ===');
console.log(html.slice(bhStart + 2000, bhStart + 5000));

const bgStart = html.indexOf('id="tab-banga"');
console.log('=== TAB BAN GA 2000-5000 ===');
console.log(html.slice(bgStart + 2000, bgStart + 5000));

