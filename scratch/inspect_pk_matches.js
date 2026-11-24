const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find tab ban may / tab ban hang statistics (where PK : ... Máy : ... or similar is calculated)
let matches = [];
let re = /PK\s*:\s*/g;
let m;
while ((m = re.exec(mainJs)) !== null) {
  matches.push(mainJs.substring(Math.max(0, m.index - 100), Math.min(mainJs.length, m.index + 200)));
}

console.log('Matches for PK :', matches);

