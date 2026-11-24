const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Search for renderPhoneGrid or where phone items are rendered in tab Bán Máy
let idx = mainJs.indexOf('function renderPhoneGrid');
console.log('renderPhoneGrid idx:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 1200));
}

