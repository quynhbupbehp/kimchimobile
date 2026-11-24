const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 2430-2465 ---');
console.log(lines.slice(2430, 2465).join('\n'));

console.log('--- Lines 2875-2905 ---');
console.log(lines.slice(2875, 2905).join('\n'));

