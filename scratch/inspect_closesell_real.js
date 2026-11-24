const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at closeSellPhoneModal():
let idx = mainJs.indexOf('function closeSellPhoneModal()');
console.log(mainJs.substring(idx, idx + 400));

