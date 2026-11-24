const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 9990-10030 ---');
console.log(lines.slice(9990, 10030).join('\n'));

