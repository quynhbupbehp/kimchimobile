const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find function showToast
let idx = mainJs.indexOf('function showToast');
console.log('showToast idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 100, idx + 800));
}

