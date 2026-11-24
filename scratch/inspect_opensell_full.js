const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at openSellPhoneModal:
let idxOpen = mainJs.indexOf('function openSellPhoneModal(id)');
console.log(mainJs.substring(idxOpen, idxOpen + 1200));

