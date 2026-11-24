const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find setBangaMode definition
let idx = mainJs.indexOf('function setBangaMode');
if (idx !== -1) {
  console.log(mainJs.substring(idx, idx + 800));
}

