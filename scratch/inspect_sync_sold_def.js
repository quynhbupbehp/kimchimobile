const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find syncSoldPhoneBundleDebounced definition
let idx = mainJs.indexOf('function syncSoldPhoneBundleDebounced');
console.log('function syncSoldPhoneBundleDebounced:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 800));
}

