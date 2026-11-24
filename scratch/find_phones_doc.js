const fs = require('fs');

const js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

lines.forEach((l, idx) => {
  if (l.includes("doc('phones')") || l.includes('doc("phones")')) {
    console.log((idx + 1) + ': ' + l);
  }
});

