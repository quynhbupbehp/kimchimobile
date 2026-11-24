const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- Lines 12755-12775 ---');
console.log(lines.slice(12755, 12775).join('\n'));

