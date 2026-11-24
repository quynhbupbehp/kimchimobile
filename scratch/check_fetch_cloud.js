const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 2515-2550 ---');
console.log(lines.slice(2515, 2550).join('\n'));

