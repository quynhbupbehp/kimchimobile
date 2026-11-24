const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// What if an error occurred in confirmSellPhone before reaching alert?
// Let's check each line after splice:
// 1: soldItem.price = actualPriceOut;
// 2: soldItem.soldDate = dateVal;
// 3: soldItem.customer = customerName;
// 4: soldItem.warranty = warranty;
// 5: soldItem.targetList = targetList;
// 6: soldItem.giftStr = giftStr;
// 7: soldItem.totalGiftMoney = totalGiftMoney;
// 8: soldItem.soldDateTime = fullDateTime;
// 9: soldItem.status = 'Đã bán (Còn Cái Nịt)';
// 10: soldPhoneDatabase.unshift(soldItem);
// 11: let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
// 12: let soldName = formatBrandDeviceName(soldItem.name || '');
// 13: let displayName = `${soldItem.brand} - ${soldName} ${cleanStorage ? cleanStorage : ''} (${soldItem.imei})`.trim();
// 14: let record = { ... };
// 15: if (targetList === 'Bán Gà') { ... } else {
//       salesDatabase.unshift(record);
//       saveSalesStorage(record);
//       renderSalesTable(salesDatabase);
//     }
// 16: if (typeof logActivity === 'function') {
//       logActivity('EDIT', 'banmay', 'Bán máy', `Bán máy: ${displayName} cho ${customerName} - Giá: ${actualPriceOut} (Lãi: ${profitValStr})`, null, soldItem, soldItem.id);
//       logActivity('ADD', 'baohanh', 'Bảo hành', `Thêm máy vào sổ bảo hành: ${displayName} - Khách: ${customerName}`, null, soldItem, soldItem.id);
//     }
// 17: recordSoldPhoneId(soldItem.id, soldItem.imei);
// 18: savePhoneStorage();
// 19: saveSoldPhoneStorage(soldItem);
// 20: closeSellPhoneModal();
// 21: renderPhoneGrid();
// 22: renderSoldPhoneTable();
// 23: alert(`Đã xác nhận bán máy ...`);

// LOOK AT LINE 15:
// renderSalesTable(salesDatabase);
// Does renderSalesTable exist?
console.log('renderSalesTable exists?', mainJs.includes('function renderSalesTable'));

// LOOK AT LINE 22:
// renderSoldPhoneTable();
console.log('renderSoldPhoneTable exists?', mainJs.includes('function renderSoldPhoneTable'));

// What about renderPhoneGrid()?
console.log('renderPhoneGrid exists?', mainJs.includes('function renderPhoneGrid'));

