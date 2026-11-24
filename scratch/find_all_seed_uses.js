const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const lines = js.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('SEED_PHONES_DATA') || l.includes('mergeWithSeedPhones')) {
    console.log((idx + 1) + ': ' + l);
  }
});

