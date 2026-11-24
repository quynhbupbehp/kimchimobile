const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Let's trace lines 11211 to 11332 carefully:
let idxStart = mainJs.indexOf('function confirmSellPhone(');
let code = mainJs.substring(idxStart, idxStart + 4000);

// Check:
// 1. targetList:
// const targetList = document.getElementById('sellTargetList').value;
// in index.html, what are the options of sellTargetList?
let html = fs.readFileSync('index.html', 'utf8');
let idxTargetList = html.indexOf('id="sellTargetList"');
console.log('sellTargetList HTML:', html.substring(idxTargetList - 50, idxTargetList + 300));

// 2. priceInput:
// const priceInput = document.getElementById('sellPriceOut');
// const actualPriceOut = priceInput.value.trim() || priceInput.dataset.defaultPrice || currentSellingPhone.price || '0';

// 3. let soldItem = phoneDatabase.splice(idx, 1)[0];

// 4. let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
// What is formatStorageDisplay? Does it throw if something is undefined?
console.log('formatStorageDisplay defined?:', mainJs.includes('function formatStorageDisplay'));

// 5. formatBrandDeviceName(soldItem.name || '');
console.log('formatBrandDeviceName defined?:', mainJs.includes('function formatBrandDeviceName'));

// 6. logActivity
console.log('logActivity defined?:', mainJs.includes('function logActivity'));

// 7. recordSoldPhoneId(soldItem.id, soldItem.imei);
console.log('recordSoldPhoneId defined?:', mainJs.includes('function recordSoldPhoneId'));

// 8. savePhoneStorage();
// 9. saveSoldPhoneStorage(soldItem);
// 10. closeSellPhoneModal();
// 11. renderPhoneGrid();
// 12. renderSoldPhoneTable();
// 13. alert(...)

