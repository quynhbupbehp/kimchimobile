const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find all import excel functions
let lines = mainJs.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('handleImport') || l.includes('import') && l.includes('Excel') || l.includes('triggerImport')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

