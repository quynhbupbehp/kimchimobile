const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');
let lines = mainJs.split('\n');

lines.forEach((line, i) => {
  if (line.includes('bangaRevenueBadge') || line.includes('bangaMonthRevenueVal') || line.includes('renderBanga') || line.includes('bangaDayRevenueVal')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});

