const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find all occurrences of recordSoldPhoneId
let idx = mainJs.indexOf('function recordSoldPhoneId');
console.log('recordSoldPhoneId idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 100, idx + 400));
}

