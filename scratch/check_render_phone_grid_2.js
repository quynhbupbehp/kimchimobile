const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 12760-12795 ---');
console.log(lines.slice(12760, 12795).join('\n'));

