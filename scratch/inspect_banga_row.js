const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Let's check how filtered items in tab banga are defined or how other tabs count phones vs accessories
let bangaTableBodyCode = mainJs.indexOf('tbody.innerHTML = html;');
console.log('tbody.innerHTML index:', bangaTableBodyCode);

// Let's see how each row in renderBangaTable determines if an item is a phone or accessory
let bangaRowMatch = mainJs.substring(bangaTableBodyCode - 1000, bangaTableBodyCode + 200);
console.log('Row rendering snippet:', bangaRowMatch);

