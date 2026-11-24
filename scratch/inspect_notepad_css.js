const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Find btnSalesNotePadMobile
let lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('btnSalesNotePadMobile') || l.includes('btn-sales-notepad-mobile')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

