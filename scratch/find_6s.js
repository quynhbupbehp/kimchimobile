const fs = require('fs');
const seeds = fs.readFileSync('js/seeds.js', 'utf8');
const lines = seeds.split('\n');
lines.forEach((l, i) => {
  if (l.includes('6S') || l.includes('5008') || l.includes('Tài Khoản Ẩn')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

