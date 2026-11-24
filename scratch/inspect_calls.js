const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find where openSellPhoneModal is called in renderPhoneGrid
let matches = [];
let re = /openSellPhoneModal/g;
let m;
while ((m = re.exec(mainJs)) !== null) {
  let snippet = mainJs.substring(Math.max(0, m.index - 80), Math.min(mainJs.length, m.index + 120));
  matches.push(`Pos ${m.index}: ${snippet.replace(/\n/g, ' ')}`);
}

console.log('openSellPhoneModal calls:', matches);

