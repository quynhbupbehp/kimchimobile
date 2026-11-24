const fs = require('fs');
const code = fs.readFileSync('js/main.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('#ea580c')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

