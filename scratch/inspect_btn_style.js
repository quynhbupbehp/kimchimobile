const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Search for btn-confirm-sell-main in CSS
let idx = css.indexOf('.btn-confirm-sell-main');
console.log('btn-confirm-sell-main in CSS:', idx);
if (idx !== -1) {
  console.log(css.substring(idx - 100, idx + 600));
}

