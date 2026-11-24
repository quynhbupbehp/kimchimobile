const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

const dedupFunctions = `
/* ============================================================
   BỘ HÀM LỌC TRÙNG & CHỐNG TRÙNG THÔNG MINH CHO CÁC TAB
   ============================================================ */

// 1. Lọc trùng Tab Bán Hàng
function removeDuplicateSalesItems() {
  if (!Array.isArray(salesDatabase) || salesDatabase.length === 0) {
    alert("Danh sách Bán Hàng đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  salesDatabase.forEach(item => {
    if (!item) return;
    // Lấy ngày chuẩn DD/MM/YYYY
    let rawDate = item.dateTime || '';
    let datePart = rawDate.includes(' - ') ? rawDate.split(' - ')[1].trim() : rawDate.trim();
    let nameKey = (item.name || '').trim().toLowerCase();
    let priceKey = String(parsePriceNum(item.total) || 0);
    let custKey = (item.customer || '').trim().toLowerCase();
    
    // Khóa trùng: Cùng ngày + cùng tên hàng + cùng giá (hoặc cùng khách)
    let key = \`\${datePart}|\${nameKey}|\${priceKey}\`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện đơn bán hàng nào bị trùng lặp!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} đơn Bán Hàng trùng lặp trong cùng ngày (cùng tên hàng & giá tiền).\\n\\nBạn có chắc muốn xóa \${duplicates.length} đơn trùng này và chỉ giữ lại duy nhất 1 đơn không?\`)) {
    return;
  }

  // Xóa trên Firestore nếu có
  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('sales').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  salesDatabase = uniqueList;
  if (typeof saveSalesStorage === 'function') saveSalesStorage();
  if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
  if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} đơn trùng lặp trong Bán Hàng.\`);
}
window.removeDuplicateSalesItems = removeDuplicateSalesItems;

// 2. Lọc trùng Tab Bán Gà
function removeDuplicateBangaItems() {
  if (!Array.isArray(bangaDatabase) || bangaDatabase.length === 0) {
    alert("Danh sách Bán Gà đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  bangaDatabase.forEach(item => {
    if (!item) return;
    let rawDate = item.dateTime || item.date || '';
    let datePart = rawDate.includes(' - ') ? rawDate.split(' - ')[1].trim() : rawDate.trim();
    let nameKey = (item.name || item.accessory || '').trim().toLowerCase();
    let priceKey = String(parsePriceNum(item.total) || 0);

    let key = \`\${datePart}|\${nameKey}|\${priceKey}\`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện đơn Bán Gà nào bị trùng lặp!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} đơn Bán Gà trùng lặp trong cùng ngày (cùng tên món & giá bán).\\n\\nBạn có chắc muốn xóa \${duplicates.length} đơn trùng này và chỉ giữ lại duy nhất 1 đơn không?\`)) {
    return;
  }

  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('banga').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  bangaDatabase = uniqueList;
  if (typeof saveBangaStorage === 'function') saveBangaStorage();
  if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
  if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} đơn trùng lặp trong Bán Gà.\`);
}
window.removeDuplicateBangaItems = removeDuplicateBangaItems;

// 3. Lọc trùng Tab Sửa Chữa
function removeDuplicateRepairItems() {
  if (!Array.isArray(repairDatabase) || repairDatabase.length === 0) {
    alert("Danh sách Sửa Chữa đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  repairDatabase.forEach(item => {
    if (!item) return;
    let datePart = (item.dateFormatted || item.date || '').trim();
    let custKey = (item.customer || '').trim().toLowerCase();
    let devKey = (item.device || '').trim().toLowerCase();
    let issueKey = (item.issue || '').trim().toLowerCase();
    let priceKey = String(parsePriceNum(item.price) || 0);

    let key = \`\${datePart}|\${custKey}|\${devKey}|\${issueKey}|\${priceKey}\`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện đơn Sửa Chữa nào bị trùng lặp!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} đơn Sửa Chữa trùng lặp trong cùng ngày (cùng khách, máy, lỗi & giá tiền).\\n\\nBạn có chắc muốn xóa \${duplicates.length} đơn trùng này và chỉ giữ lại duy nhất 1 đơn không?\`)) {
    return;
  }

  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('repairs').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  repairDatabase = uniqueList;
  if (typeof saveRepairStorage === 'function') saveRepairStorage();
  if (typeof renderRepairTable === 'function') renderRepairTable(repairDatabase);
  if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} đơn trùng lặp trong Sửa Chữa.\`);
}
window.removeDuplicateRepairItems = removeDuplicateRepairItems;

// 4. Lọc trùng Tab Bán Máy (Còn Hàng)
function removeDuplicatePhoneItems() {
  if (!Array.isArray(phoneDatabase) || phoneDatabase.length === 0) {
    alert("Danh sách Bán Máy đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  phoneDatabase.forEach(item => {
    if (!item) return;
    let imei = (item.imei || '').trim().toLowerCase();
    let key = '';
    if (imei && typeof isDummyImei === 'function' && !isDummyImei(imei)) {
      key = \`imei:\${imei}\`;
    } else {
      let nameKey = (item.name || '').trim().toLowerCase();
      let colorKey = (item.color || '').trim().toLowerCase();
      let storageKey = (item.storage || '').trim().toLowerCase();
      let statusKey = (item.status || 'Còn Hàng').trim().toLowerCase();
      let priceInKey = String(parsePriceNum(item.priceIn) || 0);
      key = \`info:\${nameKey}|\${colorKey}|\${storageKey}|\${statusKey}|\${priceInKey}\`;
    }

    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện máy nào bị trùng lặp trong kho Bán Máy!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} máy trùng lặp (trùng IMEI hoặc trùng tên, màu, dung lượng & giá).\\n\\nBạn có chắc muốn xóa \${duplicates.length} máy trùng này và chỉ giữ lại duy nhất 1 máy không?\`)) {
    return;
  }

  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('phones').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  phoneDatabase = uniqueList;
  if (typeof savePhoneStorage === 'function') savePhoneStorage();
  if (typeof renderPhoneTable === 'function') renderPhoneTable(phoneDatabase);

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} máy trùng lặp trong kho Bán Máy.\`);
}
window.removeDuplicatePhoneItems = removeDuplicatePhoneItems;

// 5. Lọc trùng Tab Bảo Hành (Máy đã bán)
function removeDuplicateSoldPhoneItems() {
  if (!Array.isArray(soldPhoneDatabase) || soldPhoneDatabase.length === 0) {
    alert("Danh sách Bảo Hành đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  soldPhoneDatabase.forEach(item => {
    if (!item) return;
    let imei = (item.imei || '').trim().toLowerCase();
    let key = '';
    if (imei && typeof isDummyImei === 'function' && !isDummyImei(imei)) {
      key = \`imei:\${imei}\`;
    } else {
      let nameKey = (item.name || '').trim().toLowerCase();
      let colorKey = (item.color || '').trim().toLowerCase();
      let storageKey = (item.storage || '').trim().toLowerCase();
      let soldDateKey = (item.soldDate || item.dateTime || '').trim();
      key = \`info:\${nameKey}|\${colorKey}|\${storageKey}|\${soldDateKey}\`;
    }

    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện máy nào bị trùng lặp trong danh sách Bảo Hành!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} máy trùng lặp trong danh sách Bảo Hành.\\n\\nBạn có chắc muốn xóa \${duplicates.length} máy trùng này và chỉ giữ lại duy nhất 1 máy không?\`)) {
    return;
  }

  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('sold_phones').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  soldPhoneDatabase = uniqueList;
  if (typeof saveSoldPhoneStorage === 'function') saveSoldPhoneStorage();
  if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable(soldPhoneDatabase);
  if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} máy trùng lặp trong danh sách Bảo Hành.\`);
}
window.removeDuplicateSoldPhoneItems = removeDuplicateSoldPhoneItems;

// 6. Lọc trùng Tab Main - Xác
function removeDuplicateMainXacItems() {
  if (!Array.isArray(mainXacDatabase) || mainXacDatabase.length === 0) {
    alert("Danh sách Main Xác đang trống!");
    return;
  }
  const seen = new Set();
  const uniqueList = [];
  const duplicates = [];

  mainXacDatabase.forEach(item => {
    if (!item) return;
    let imei = (item.imei || '').trim().toLowerCase();
    let key = '';
    if (imei && typeof isDummyImei === 'function' && !isDummyImei(imei)) {
      key = \`imei:\${imei}\`;
    } else {
      let nameKey = (item.name || '').trim().toLowerCase();
      let colorKey = (item.color || '').trim().toLowerCase();
      let statusKey = (item.status || '').trim().toLowerCase();
      key = \`info:\${nameKey}|\${colorKey}|\${statusKey}\`;
    }

    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    } else {
      duplicates.push(item);
    }
  });

  if (duplicates.length === 0) {
    alert("✅ Không phát hiện mục nào bị trùng lặp trong kho Main - Xác!");
    return;
  }

  if (!confirm(\`🧹 Tìm thấy \${duplicates.length} mục trùng lặp trong kho Main - Xác.\\n\\nBạn có chắc muốn xóa \${duplicates.length} mục trùng này và chỉ giữ lại duy nhất 1 mục không?\`)) {
    return;
  }

  if (typeof db !== 'undefined' && db) {
    duplicates.forEach(item => {
      if (item && item.id) {
        db.collection('main_xac').doc(String(item.id)).delete().catch(console.error);
      }
    });
  }

  mainXacDatabase = uniqueList;
  if (typeof saveMainXacStorage === 'function') saveMainXacStorage();
  if (typeof renderMainXacTable === 'function') renderMainXacTable(mainXacDatabase);

  alert(\`✅ Đã lọc sạch thành công! Đã loại bỏ \${duplicates.length} mục trùng lặp trong kho Main - Xác.\`);
}
window.removeDuplicateMainXacItems = removeDuplicateMainXacItems;
`;

mainJs += dedupFunctions;
fs.writeFileSync('js/main.js', mainJs, 'utf8');
console.log('Appended dedup functions to js/main.js successfully!');

