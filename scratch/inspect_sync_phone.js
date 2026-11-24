const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find syncPhoneBundleDebounced definition
let idx = mainJs.indexOf('function syncPhoneBundleDebounced');
console.log('function syncPhoneBundleDebounced:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 800));
}

