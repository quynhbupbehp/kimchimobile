const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const target = "let methodColor = (method === 'Chuyển Khoản' || method === 'CK') ? '#38bdf8' : '#10b981';";
const replacement = "let methodColor = (method === 'Chuyển Khoản' || method === 'CK') ? '#ff3b30' : '#10b981';";

if (!js.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}
js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated methodColor to bright red #ff3b30!');

