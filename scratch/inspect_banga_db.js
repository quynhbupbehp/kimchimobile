const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Let's inspect bangaDatabase items from localStorage if any, or mock some items
// Let's see what items in bangaDatabase look like:
console.log('Sample items in bangaDatabase:');
let regex = /bangaDatabase\s*=\s*\[/g;
let m = regex.exec(mainJs);
if (m) {
  console.log(mainJs.substring(m.index, m.index + 500));
}

