const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Find #sellPhoneModal and .global-system-toast in CSS
let lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('sellPhoneModal') || l.includes('global-system-toast') || l.includes('globalSystemToast')) {
    console.log(`L${idx+1}: ${l}`);
  }
});

