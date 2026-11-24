const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find all code in confirmSellPhone to check if there is an error between line 11210 and 11332
let idxStart = mainJs.indexOf('function confirmSellPhone(');
let idxEnd = mainJs.indexOf('function openExternalSellPhoneModal(');
console.log(mainJs.substring(idxStart, idxEnd));

