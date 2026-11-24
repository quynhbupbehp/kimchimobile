const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find renderSoldPhoneTable
let idx = mainJs.indexOf('function renderSoldPhoneTable');
console.log('renderSoldPhoneTable idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 400));
}

