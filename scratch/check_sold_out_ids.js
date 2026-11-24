const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 9760-9810 ---');
console.log(lines.slice(9760, 9810).join('\n'));

