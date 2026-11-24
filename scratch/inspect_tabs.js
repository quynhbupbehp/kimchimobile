const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bhStart = html.indexOf('id="tab-banhang"');
console.log('=== TAB BAN HANG SEARCH ===');
console.log(html.slice(bhStart, bhStart + 2500));

const bgStart = html.indexOf('id="tab-banga"');
console.log('=== TAB BAN GA SEARCH ===');
console.log(html.slice(bgStart, bgStart + 2500));

