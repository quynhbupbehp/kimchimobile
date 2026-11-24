const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Let's inspect the entire confirmSellPhone logic and find where an error could throw
let start = mainJs.indexOf('function confirmSellPhone(');
let end = mainJs.indexOf('function openExternalSellPhoneModal(');
let fnStr = mainJs.substring(start, end);

// Let's check variables in confirmSellPhone:
console.log(fnStr);

