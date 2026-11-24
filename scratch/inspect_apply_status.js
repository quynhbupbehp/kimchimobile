const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find applyPhoneStatusOverrides
let idx = mainJs.indexOf('function applyPhoneStatusOverrides');
console.log('function applyPhoneStatusOverrides:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 800));
}

