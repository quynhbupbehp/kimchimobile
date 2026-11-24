const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 2880-2915 ---');
console.log(lines.slice(2880, 2915).join('\n'));

