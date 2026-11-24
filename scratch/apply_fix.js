const fs = require('fs');

let code = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = code.includes('\r\n');
const normalize = str => isCRLF ? str.replace(/\r?\n/g, '\r\n') : str.replace(/\r\n/g, '\n');

// 1. Thêm bộ quản lý status override vĩnh viễn
const overrideHelper = normalize(`
// QUẢN LÝ TRẠNG THÁI MÁY BỀN VỮNG (CHỐNG BỊ SEED HOẶC CLOUD ĐÈ LẠI KHI F5)
function getPhoneStatusOverrides() {
  try {
    const raw = localStorage.getItem('KIMCHI_PHONE_STATUS_OVERRIDES');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function setPhoneStatusOverride(id, status, imei) {
  try {
    if (!id && !imei) return;
    const map = getPhoneStatusOverrides();
    if (id) map[String(id)] = status;
    if (imei && String(imei).trim()) map['imei_' + String(imei).trim().toLowerCase()] = status;
    localStorage.setItem('KIMCHI_PHONE_STATUS_OVERRIDES', JSON.stringify(map));
  } catch (e) {}
}
function applyPhoneStatusOverrides(list) {
  if (!Array.isArray(list)) return list;
  const map = getPhoneStatusOverrides();
  list.forEach(p => {
    if (!p) return;
    const idKey = p.id ? String(p.id) : '';
    const imeiKey = p.imei ? ('imei_' + String(p.imei).trim().toLowerCase()) : '';
    if (idKey && map[idKey]) {
      p.status = map[idKey];
    } else if (imeiKey && map[imeiKey]) {
      p.status = map[imeiKey];
    }
  });
  return list;
}
window.getPhoneStatusOverrides = getPhoneStatusOverrides;
window.setPhoneStatusOverride = setPhoneStatusOverride;
window.applyPhoneStatusOverrides = applyPhoneStatusOverrides;
`);

if (!code.includes('function getPhoneStatusOverrides()')) {
  code = code.replace(normalize('function getDeletedPhoneIds()'), overrideHelper + normalize('\nfunction getDeletedPhoneIds()'));
}

// 2. mergeWithSeedPhones trả về applyPhoneStatusOverrides(combined)
code = code.replace(
  normalize('  return combined;\n}\nwindow.mergeWithSeedPhones = mergeWithSeedPhones;'),
  normalize('  if (typeof applyPhoneStatusOverrides === \'function\') {\n    combined = applyPhoneStatusOverrides(combined);\n  }\n  return combined;\n}\nwindow.mergeWithSeedPhones = mergeWithSeedPhones;')
);

// 3. saveNewPhone: gọi setPhoneStatusOverride khi lưu
code = code.replace(
  normalize('  savePhoneStorage(savedItem);'),
  normalize('  if (savedItem && savedItem.status && typeof setPhoneStatusOverride === \'function\') {\n    setPhoneStatusOverride(savedItem.id, savedItem.status, savedItem.imei);\n  }\n  savePhoneStorage(savedItem);')
);

// 4. savePhoneStorage: đảm bảo đồng bộ bundle tức thì lên Firestore kèm debounce
const oldSavePhoneStorage = normalize(`function savePhoneStorage(itemToSync) {
  try {
    localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase));
  } catch (e) {}
  if (typeof db !== 'undefined' && db) {
    if (itemToSync && itemToSync.id) {
      db.collection('phones').doc(String(itemToSync.id)).set(itemToSync, { merge: true }).catch(console.error);
    }
    syncPhoneBundleDebounced();
  }
}`);

const newSavePhoneStorage = normalize(`function savePhoneStorage(itemToSync) {
  try {
    if (typeof applyPhoneStatusOverrides === 'function') {
      applyPhoneStatusOverrides(phoneDatabase);
    }
    localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase));
  } catch (e) {}
  if (typeof db !== 'undefined' && db) {
    if (itemToSync && itemToSync.id) {
      db.collection('phones').doc(String(itemToSync.id)).set(itemToSync, { merge: true }).catch(console.error);
    }
    try {
      db.collection('sync_bundles').doc('phones').set({
        list: phoneDatabase,
        updatedAt: Date.now()
      }, { merge: true }).catch(console.error);
    } catch (e) {}
    syncPhoneBundleDebounced();
  }
}`);

code = code.replace(oldSavePhoneStorage, newSavePhoneStorage);

// 5. fetchDirectCloudSync phones & onSnapshot phones: áp dụng applyPhoneStatusOverrides
code = code.replace(
  normalize(`phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;\n          }\n          try { localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase)); } catch (e) {}`),
  normalize(`phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;\n            if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);\n          }\n          try { localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase)); } catch (e) {}`)
);

code = code.replace(
  normalize(`phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;\n          try { localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase)); } catch (e) {}`),
  normalize(`phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;\n          if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);\n          try { localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase)); } catch (e) {}`)
);

// 6. fixPhoneDatabaseStatus: không bao giờ ghi đè nếu đã có status hoặc có trong override
const oldFixPhone = normalize(`function fixPhoneDatabaseStatus() {
  if (!Array.isArray(phoneDatabase)) return;
  let changed = false;
  phoneDatabase.forEach(p => {
    if (!p) return;
    // Nếu trạng thái đang để trống thì tự động điền 'Còn Hàng'
    if (!p.status || !String(p.status).trim()) {
      p.status = 'Còn Hàng';
      changed = true;
    }
  });
  if (changed) {
    savePhoneStorage();
  }
}`);

const newFixPhone = normalize(`function fixPhoneDatabaseStatus() {
  if (!Array.isArray(phoneDatabase)) return;
  if (typeof applyPhoneStatusOverrides === 'function') {
    applyPhoneStatusOverrides(phoneDatabase);
  }
  let changed = false;
  phoneDatabase.forEach(p => {
    if (!p) return;
    // Nếu trạng thái đang để trống thì tự động điền 'Còn Hàng'
    if (!p.status || !String(p.status).trim()) {
      p.status = 'Còn Hàng';
      changed = true;
    }
  });
  if (changed) {
    try {
      localStorage.setItem('KIMCHI_PHONES_LOCAL', JSON.stringify(phoneDatabase));
    } catch (e) {}
  }
}`);

code = code.replace(oldFixPhone, newFixPhone);

fs.writeFileSync('js/main.js', code, 'utf8');
console.log('Update main.js completed successfully!');

