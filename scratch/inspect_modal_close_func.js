const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find closeSellPhoneModal
let idx = mainJs.indexOf('function closeSellPhoneModal');
console.log(mainJs.substring(idx - 100, idx + 500));

