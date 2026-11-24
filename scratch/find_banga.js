const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let lines = html.split('\n');

lines.forEach((line, i) => {
  if (line.includes('banga') || line.includes('Bán Gà') || line.includes('BANGA') || line.includes('TẠO BÁN GÀ')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});

