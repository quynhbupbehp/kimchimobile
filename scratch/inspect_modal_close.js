const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find where sellPhoneModal is opened or where closeSellPhoneModal is defined
let idx = mainJs.indexOf('function closeSellPhoneModal');
console.log('closeSellPhoneModal idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 400, idx + 400));
}

// Find alert function in mainJs
let alertIdx = mainJs.indexOf('window.alert =');
console.log('window.alert index:', alertIdx);
if (alertIdx !== -1) {
  console.log(mainJs.substring(alertIdx, alertIdx + 600));
}

