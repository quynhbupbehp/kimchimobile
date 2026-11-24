const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. In fetchDirectCloudSync, add loading for repairs and mainxac bundles
const needleDirect = "    // 5. Tải Sold Phones (Bảo Hành) Bundle";
const posDirect = js.indexOf(needleDirect);
if (posDirect === -1) {
  console.error("needleDirect not found");
  process.exit(1);
}

// Find the end of sold_phones block: }).catch(function (e) { console.warn('fetchDirectCloudSync sold_phones:', e); });
const needleDirectEnd = "}).catch(function (e) { console.warn('fetchDirectCloudSync sold_phones:', e); });";
const posDirectEnd = js.indexOf(needleDirectEnd, posDirect);
if (posDirectEnd === -1) {
  console.error("needleDirectEnd not found");
  process.exit(1);
}

const directAdditions = needleDirectEnd + `

    // 6. Tải Sửa Chữa (repairs) Bundle
    db.collection('sync_bundles').doc('repairs').get().then(function (doc) {
      if (doc && doc.exists) {
        var data = doc.data();
        if (data && Array.isArray(data.list) && data.list.length > 0) {
          var list = data.list;
          list.sort(function (a, b) { return getItemTimestamp(b) - getItemTimestamp(a); });
          repairDatabase = list;
          if (typeof renderRepairTable === 'function') renderRepairTable();
          if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
        }
      }
    }).catch(function (e) { console.warn('fetchDirectCloudSync repairs:', e); });

    // 7. Tải Main Xác (mainxac) Bundle
    db.collection('sync_bundles').doc('mainxac').get().then(function (doc) {
      if (doc && doc.exists) {
        var data = doc.data();
        if (data && Array.isArray(data.list) && data.list.length > 0) {
          var list = data.list;
          list.sort(function (a, b) { return (Number(b.id) || 0) - (Number(a.id) || 0); });
          mainXacDatabase = list;
          if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
        }
      }
    }).catch(function (e) { console.warn('fetchDirectCloudSync mainxac:', e); });`;

js = js.substring(0, posDirectEnd) + directAdditions + js.substring(posDirectEnd + needleDirectEnd.length);
console.log("Updated fetchDirectCloudSync successfully");

// 2. Add repairs and mainxac onSnapshot listeners to sync_bundles,
// and remove collection('sales'), collection('banga'), collection('mainxac'), collection('repairs'), collection('software') listeners.
const needleBundleSold = "db.collection('sync_bundles').doc('sold_phones').onSnapshot";
const posBundleSold = js.indexOf(needleBundleSold);
if (posBundleSold === -1) {
  console.error("needleBundleSold not found");
  process.exit(1);
}

const needleCatchSold = "}, err => console.warn('Bundle sync sold_phones notice:', err.code || err));\n  } catch (e) { }";
const needleCatchSoldCRLF = "}, err => console.warn('Bundle sync sold_phones notice:', err.code || err));\r\n  } catch (e) { }";

let posSoldEnd = js.indexOf(needleCatchSold, posBundleSold);
let soldEndLen = needleCatchSold.length;
if (posSoldEnd === -1) {
  posSoldEnd = js.indexOf(needleCatchSoldCRLF, posBundleSold);
  soldEndLen = needleCatchSoldCRLF.length;
}

if (posSoldEnd === -1) {
  console.error("posSoldEnd not found");
  process.exit(1);
}

// Find where custom_brands begins
const needleCustomBrands = "// 8. Đồng bộ Danh sách Hãng Điện Thoại Mới (custom brands)";
const posCustomBrands = js.indexOf(needleCustomBrands, posSoldEnd);
if (posCustomBrands === -1) {
  console.error("needleCustomBrands not found");
  process.exit(1);
}

const bundleAdditions = `

  // Đồng bộ Sửa Chữa (repairs) siêu tốc qua sync_bundles
  try {
    db.collection('sync_bundles').doc('repairs').onSnapshot(doc => {
      if (doc && doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.list) && data.list.length > 0) {
          let list = data.list;
          list.sort((a, b) => getItemTimestamp(b) - getItemTimestamp(a));
          repairDatabase = list;
          if (typeof renderRepairTable === 'function') renderRepairTable();
          if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
        }
      }
    }, err => console.warn('Bundle sync repairs notice:', err.code || err));
  } catch (e) { }

  // Đồng bộ Main - Xác (mainxac) siêu tốc qua sync_bundles
  try {
    db.collection('sync_bundles').doc('mainxac').onSnapshot(doc => {
      if (doc && doc.exists) {
        const data = doc.data();
        if (data && Array.isArray(data.list) && data.list.length > 0) {
          let list = data.list;
          list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
          mainXacDatabase = list;
          if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
        }
      }
    }, err => console.warn('Bundle sync mainxac notice:', err.code || err));
  } catch (e) { }

  // ĐÃ CHUYỂN TOÀN BỘ CÁC TAB SANG CƠ CHẾ SYNC_BUNDLES SIÊU TIẾT KIỆM QUOTA (RULE 6)
  // Tuyệt đối không dùng onSnapshot trên collection lớn để loại bỏ bão đọc Firestore.

  `;

js = js.substring(0, posSoldEnd + soldEndLen) + bundleAdditions + js.substring(posCustomBrands);
console.log("Updated sync_bundles and removed heavy collection listeners successfully");

// 3. Reset daily usage counter in localStorage check if needed or add reset function
// Add resetFsUsageCounter helper so user / UI resets immediately
if (!js.includes("window.resetFsDailyUsage")) {
  const insertBefore = "function getFsDailyUsage() {";
  const resetFn = `function resetFsDailyUsage() {
  try {
    const key = getFsTodayKey();
    localStorage.removeItem(key);
    updateFsUsageUI({ reads: 0, writes: 0 });
  } catch (e) {}
}
window.resetFsDailyUsage = resetFsDailyUsage;

`;
  js = js.replace(insertBefore, resetFn + insertBefore);
}

fs.writeFileSync('js/main.js', js, 'utf8');
console.log("main.js updated successfully!");

