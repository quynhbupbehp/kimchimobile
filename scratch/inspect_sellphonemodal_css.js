const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Find all occurrences of #sellPhoneModal in style.css
let lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('#sellPhoneModal')) {
    console.log(`L${idx+1}: ${l}`);
  }
});

