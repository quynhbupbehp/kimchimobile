const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

let lines = mainJs.split('\n');
lines.forEach((l, i) => {
  if (l.includes('getBangaPhoneDetails')) {
    console.log(`${i+1}: ${l}`);
  }
});

