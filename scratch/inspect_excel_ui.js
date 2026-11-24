const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all excel actions containers across tabs
let lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('ExcelActionsBox') || l.includes('ExcelToggle') || l.includes('Xóa Toàn Bộ') || l.includes('Xóa Hết')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

