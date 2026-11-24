const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Find media queries for mobile affecting bangaRevenueBadge or sales-header-bar
let lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('bangaRevenueBadge') || l.includes('tab-banga')) {
    console.log(`${i+1}: ${l}`);
  }
});

