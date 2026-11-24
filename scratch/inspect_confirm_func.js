const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find confirmSellPhone function definition
let idx = mainJs.indexOf('function confirmSellPhone(');
console.log('confirmSellPhone index:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 1500));
}

