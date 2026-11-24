const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find where logActivity is defined
let idx = mainJs.indexOf('function logActivity(');
console.log('function logActivity:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 600));
}

