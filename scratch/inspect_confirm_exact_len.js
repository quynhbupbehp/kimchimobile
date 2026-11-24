const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Also check confirmSellPhone in mainJs:
let confirmStart = mainJs.indexOf('function confirmSellPhone(e) {');
let confirmEnd = mainJs.indexOf('/* ============================================================', confirmStart);
let confirmSnippet = mainJs.substring(confirmStart, confirmEnd);
console.log('Found confirmSellPhone length:', confirmSnippet.length);

