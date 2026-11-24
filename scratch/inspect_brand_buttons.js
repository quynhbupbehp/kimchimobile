const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('filterBrand') || l.includes('brand-btn-h')) {
    console.log((idx + 1) + ': ' + l);
  }
});

