const fs = require('fs');

function searchFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('IPHONE') && (l.includes('style') || l.includes('badge') || l.includes('background') || l.includes('color') || l.includes('span'))) {
      console.log(`${file}:${idx+1}: ${l.trim().substring(0, 140)}`);
    }
  });
}

searchFile('js/main.js');
searchFile('index.html');
searchFile('css/style.css');

