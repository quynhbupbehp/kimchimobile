const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

console.log('--- fetchDirectCloudSync phones (2515-2535) ---');
console.log(lines.slice(2515, 2535).join('\n'));

console.log('--- onSnapshot phones (2880-2900) ---');
console.log(lines.slice(2880, 2900).join('\n'));

console.log('--- onSnapshot sold_phones (2895-2915) ---');
console.log(lines.slice(2895, 2915).join('\n'));

