const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

let idx = mainJs.indexOf('function confirmSellPhone(');
console.log(mainJs.substring(idx + 1400, idx + 3500));

