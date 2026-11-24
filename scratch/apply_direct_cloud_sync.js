const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// 1. Chỉnh sửa tại fetchDirectCloudSync (dòng ~2526)
const oldSync1 = `          } else {
            phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;
            if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);
          }`;

const newSync1 = `          } else {
            // Lấy trực tiếp danh sách từ Cloud làm chuẩn để Web và Mobile luôn khớp nhau 100%
            phoneDatabase = Array.isArray(data.list) ? data.list : [];
            if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);
          }`;

if (normJs.includes(oldSync1)) {
  normJs = normJs.replace(oldSync1, newSync1);
  console.log('SUCCESS: Updated fetchDirectCloudSync phones');
} else {
  console.error('ERROR: oldSync1 not found');
}

// 2. Chỉnh sửa tại onSnapshot phones (dòng ~2887)
const oldSync2 = `          phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;
          if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);`;

const newSync2 = `          // Đồng bộ trực tiếp danh sách từ Cloud Realtime 100% - Không chèn seed làm lệch số lượng máy
          phoneDatabase = Array.isArray(data.list) ? data.list : [];
          if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);`;

if (normJs.includes(oldSync2)) {
  normJs = normJs.replace(oldSync2, newSync2);
  console.log('SUCCESS: Updated onSnapshot phones');
} else {
  console.error('ERROR: oldSync2 not found');
}

// 3. Chỉnh sửa tại loadInitialPhones: nếu local cache đã có dữ liệu hợp lệ thì dùng trực tiếp
const oldLoadInitial = `function loadInitialPhones() {
  try {
    const localRaw = localStorage.getItem('KIMCHI_PHONES_LOCAL');
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(parsed) : parsed;
      }
    }
  } catch (e) {}
  return (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones([]) : (window.SEED_PHONES_DATA || []);
}`;

const newLoadInitial = `function loadInitialPhones() {
  try {
    const localRaw = localStorage.getItem('KIMCHI_PHONES_LOCAL');
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Dùng trực tiếp dữ liệu đã lưu trong máy, không tự ý chèn seed làm lệch số lượng
        return parsed;
      }
    }
  } catch (e) {}
  return (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones([]) : (window.SEED_PHONES_DATA || []);
}`;

if (normJs.includes(oldLoadInitial)) {
  normJs = normJs.replace(oldLoadInitial, newLoadInitial);
  console.log('SUCCESS: Updated loadInitialPhones');
} else {
  console.error('ERROR: oldLoadInitial not found');
}

// 4. Đồng bộ sold_phones tương tự để bảo hành cũng không bị chèn seed lệch
const oldSoldSync1 = `          } else {
            soldPhoneDatabase = (typeof mergeWithSeedSoldPhones === 'function') ? mergeWithSeedSoldPhones(data.list) : data.list;
          }`;

const newSoldSync1 = `          } else {
            soldPhoneDatabase = Array.isArray(data.list) ? data.list : [];
          }`;

if (normJs.includes(oldSoldSync1)) {
  normJs = normJs.replace(oldSoldSync1, newSoldSync1);
  console.log('SUCCESS: Updated fetchDirectCloudSync sold_phones');
}

const oldSoldSync2 = `          soldPhoneDatabase = (typeof mergeWithSeedSoldPhones === 'function') ? mergeWithSeedSoldPhones(data.list) : data.list;`;
const newSoldSync2 = `          soldPhoneDatabase = Array.isArray(data.list) ? data.list : [];`;

if (normJs.includes(oldSoldSync2)) {
  normJs = normJs.replace(oldSoldSync2, newSoldSync2);
  console.log('SUCCESS: Updated onSnapshot sold_phones');
}

const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
fs.writeFileSync('js/main.js', finalJs, 'utf8');
console.log('ALL UPDATES COMPLETE!');

