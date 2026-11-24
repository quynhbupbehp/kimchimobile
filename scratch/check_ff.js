const fs = require('fs');
const h = fs.readFileSync('baogia.html', 'utf8');
const lines = h.split('\n');
lines.forEach((l, i) => {
  if (l.includes('font-family')) console.log((i+1) + ': ' + l.trim());
});

