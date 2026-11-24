const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 12730-12755 ---');
console.log(lines.slice(12730, 12755).join('\n'));

