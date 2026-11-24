const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find savePhoneStorage and saveSoldPhoneStorage
let idx1 = mainJs.indexOf('function savePhoneStorage(');
console.log('savePhoneStorage:', mainJs.substring(idx1, idx1 + 400));

let idx2 = mainJs.indexOf('function saveSoldPhoneStorage(');
console.log('saveSoldPhoneStorage:', mainJs.substring(idx2, idx2 + 400));

