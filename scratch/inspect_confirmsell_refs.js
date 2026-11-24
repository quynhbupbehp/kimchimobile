const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find renderPhoneGrid lines around btn-confirm-sell or form onsubmit
let idx = mainJs.indexOf('confirmSellPhone');
while (idx !== -1) {
  console.log('Match at', idx, ':', mainJs.substring(idx - 50, idx + 100).replace(/\n/g, ' '));
  idx = mainJs.indexOf('confirmSellPhone', idx + 1);
}

