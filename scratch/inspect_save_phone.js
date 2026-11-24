const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 10300-10335 ---');
console.log(lines.slice(10300, 10335).join('\n'));

