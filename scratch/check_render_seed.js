const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 12735-12770 ---');
console.log(lines.slice(12735, 12770).join('\n'));

