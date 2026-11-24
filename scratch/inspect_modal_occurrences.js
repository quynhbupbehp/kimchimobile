const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find all matches for sellPhoneModal in mainJs:
let matches = [];
let re = /sellPhoneModal/g;
let m;
while ((m = re.exec(mainJs)) !== null) {
  matches.push(mainJs.substring(Math.max(0, m.index - 50), Math.min(mainJs.length, m.index + 80)).replace(/\n/g, ' '));
}
console.log('sellPhoneModal in mainJs:', matches);

