const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Let's check checkGiftsEntered() in mainJs!
let idxGifts = mainJs.indexOf('function checkGiftsEntered');
console.log('checkGiftsEntered:', idxGifts);
if (idxGifts !== -1) {
  console.log(mainJs.substring(idxGifts, idxGifts + 600));
}

