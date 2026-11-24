const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at confirmSellPhone:
// Look at:
// const id = parseFloat(document.getElementById('sellPhoneId').value);
// const idx = phoneDatabase.findIndex(p => p.id === id);
// If p.id in phoneDatabase is a String:
// e.g. p.id = "phone_12345" or p.id = "1731252839219"
// If p.id is a string, then p.id === id (strict comparison) is:
// "1731252839219" === 1731252839219  => FALSE!
// Let's test this in JS:
console.log('"123" === 123 is:', "123" === 123); // FALSE!
console.log('String("123") == 123 is:', "123" == 123); // TRUE!

// What if phoneDatabase was loaded from LocalStorage or Firestore?
// In JSON.parse, if id was saved as string, p.id === id is FALSE!
// But wait! When openSellPhoneModal(id) is called:
// const p = phoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
// document.getElementById('sellPhoneId').value = p.id;
// Then in confirmSellPhone:
// const id = parseFloat(document.getElementById('sellPhoneId').value);
// const idx = phoneDatabase.findIndex(p => p.id === id);
// If p.id was a string in phoneDatabase, idx will be -1!
// If p.id was a string like "p_173...", parseFloat is NaN, so idx is -1!

