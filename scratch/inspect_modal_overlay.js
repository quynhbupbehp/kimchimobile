const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Search for .modal-overlay
let lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('.modal-overlay')) {
    console.log(`L${idx+1}: ${l}`);
  }
});

