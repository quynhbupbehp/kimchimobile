const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');
let lines = mainJs.split('\n');

lines.forEach((line, i) => {
  if (line.includes('openTicketModalWithTarget') && line.includes('Bán Gà')) {
    console.log(`${i + 1}: ${line}`);
  }
});

// Look for where banga items are created / schema
let sampleBangaIdx = mainJs.indexOf('bangaDatabase');
console.log('bangaDatabase found at char:', sampleBangaIdx);

