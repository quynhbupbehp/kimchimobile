const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 10300-10340 ---');
console.log(lines.slice(10300, 10340).join('\n'));

