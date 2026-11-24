const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

let lines = js.split('\n');
lines.forEach((l, i) => {
  if (l.includes("doc('phones').set") || l.includes("doc('sold_phones').set")) {
    console.log((i + 1) + ': ' + l.trim());
  }
});

