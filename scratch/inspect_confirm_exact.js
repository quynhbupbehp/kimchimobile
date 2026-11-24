const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find all code in confirmSellPhone:
let idxStart = mainJs.indexOf('function confirmSellPhone(');
let idxEnd = mainJs.indexOf('function openExternalSellPhoneModal(');
let code = mainJs.substring(idxStart, idxEnd);

console.log(code);

