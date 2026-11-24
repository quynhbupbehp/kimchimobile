const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find syncSoldPhoneBundleDebounced
let idx = mainJs.indexOf('syncSoldPhoneBundleDebounced');
console.log('syncSoldPhoneBundleDebounced:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 100, idx + 600));
}

