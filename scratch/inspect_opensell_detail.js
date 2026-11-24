const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Check line 11210:
// const id = parseFloat(document.getElementById('sellPhoneId').value);
// const idx = phoneDatabase.findIndex(p => p.id === id);

// Let's inspect where sellPhoneId is set in openSellPhoneModal:
let idxOpen = mainJs.indexOf('function openSellPhoneModal(');
console.log(mainJs.substring(idxOpen, idxOpen + 800));

