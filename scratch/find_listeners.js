const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf("addEventListener('click'", pos)) !== -1) {
  console.log('pos:', pos, js.slice(pos, pos + 100).replace(/\n/g, ' '));
  pos += 20;
}

