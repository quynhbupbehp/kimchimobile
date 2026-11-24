const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find sellPhoneModal
let idx = html.indexOf('id="sellPhoneModal"');
console.log('sellPhoneModal in HTML:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 1000));
}

