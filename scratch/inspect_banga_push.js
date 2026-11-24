const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// find modal submit for banga or where banga items are pushed
let regex = /bangaDatabase\.push/g;
let match;
while ((match = regex.exec(mainJs)) !== null) {
  let start = Math.max(0, match.index - 200);
  let end = Math.min(mainJs.length, match.index + 400);
  console.log('--- FOUND bangaDatabase.push ---');
  console.log(mainJs.substring(start, end));
}

// Also check lines around line 1745 of index.html:
// <span>Máy đã bán : <span id="bangaFootSold" style="color: #ffffff; font-weight: 800;">0</span></span>
// Let's find where bangaFootSold is updated!
let footSoldMatch = mainJs.indexOf('bangaFootSold');
console.log('bangaFootSold index in main.js:', footSoldMatch);
if (footSoldMatch !== -1) {
  console.log(mainJs.substring(footSoldMatch - 200, footSoldMatch + 400));
}

