const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find function savePhoneStorage
let idx = mainJs.indexOf('function savePhoneStorage(');
console.log(mainJs.substring(idx, idx + 1000));

