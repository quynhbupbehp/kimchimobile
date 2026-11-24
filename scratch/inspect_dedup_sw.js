const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find removeDuplicateSoftwareItems
let idx = mainJs.indexOf('removeDuplicateSoftwareItems');
if (idx !== -1) {
  console.log(mainJs.substring(idx - 100, idx + 600));
} else {
  console.log('Not found');
}

