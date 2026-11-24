const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find where openSellModal / openSellPhoneModal is called or defined
let idx = mainJs.indexOf('function openSellModal(');
console.log('openSellModal idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 1000));
} else {
  let idx2 = mainJs.indexOf('sellPhoneId');
  console.log('sellPhoneId in mainJs:', idx2);
  if (idx2 !== -1) {
    console.log(mainJs.substring(idx2 - 200, idx2 + 800));
  }
}

