const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all export excel buttons across tabs
let lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('export') || l.includes('Xuất') || l.includes('btnExport') || l.includes('exportToExcel')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

