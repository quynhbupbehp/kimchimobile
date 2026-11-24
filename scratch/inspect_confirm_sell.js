const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find "Không tìm thấy thông tin máy trong kho!"
let idx = mainJs.indexOf('Không tìm thấy thông tin máy trong kho');
console.log('Found message index:', idx);
if (idx !== -1) {
  console.log(mainJs.substring(idx - 400, idx + 800));
}

