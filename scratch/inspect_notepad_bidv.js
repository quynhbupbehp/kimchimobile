const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of openSalesNotePadModal in index.html
let lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('openSalesNotePadModal') || l.includes('BIDV') || l.includes('openBidvAccountModal')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

