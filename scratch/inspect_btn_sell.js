const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find renderPhoneGrid to see how openSellPhoneModal is called:
let idx = mainJs.indexOf('action-btn-sell');
console.log('action-btn-sell index:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 200, idx + 400));
}

