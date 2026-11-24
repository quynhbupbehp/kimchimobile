const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

// 1. Nâng cấp bộ quản lý Overrides máy bền vững (lưu toàn bộ thông tin sửa)
const oldOverrideBlock = normalize(`// QUẢN LÝ TRẠNG THÁI MÁY BỀN VỮNG (CHỐNG BỊ SEED HOẶC CLOUD ĐÈ LẠI KHI F5)
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
window.applyPhoneStatusOverrides = applyPhoneStatusOverrides;`);

const newOverrideBlock = normalize(`// QUẢN LÝ THÔNG TIN & TRẠNG THÁI MÁY BỀN VỮNG (CHỐNG BỊ SEED HOẶC CLOUD ĐÈ LẠI KHI F5)
function getPhoneEditOverrides() {
  try {
    const raw = localStorage.getItem('KIMCHI_PHONE_EDIT_OVERRIDES');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function setPhoneEditOverride(savedItem) {
  try {
    if (!savedItem || (!savedItem.id && !savedItem.imei)) return;
    const map = getPhoneEditOverrides();
    const copy = JSON.parse(JSON.stringify(savedItem));
    if (copy.id) map[String(copy.id)] = copy;
    if (copy.imei && String(copy.imei).trim()) {
      map['imei_' + String(copy.imei).trim().toLowerCase()] = copy;
    }
    localStorage.setItem('KIMCHI_PHONE_EDIT_OVERRIDES', JSON.stringify(map));
  } catch (e) {}
}
function removePhoneEditOverride(id, imei) {
  try {
    const map = getPhoneEditOverrides();
    if (id && map[String(id)]) delete map[String(id)];
    if (imei && map['imei_' + String(imei).trim().toLowerCase()]) {
      delete map['imei_' + String(imei).trim().toLowerCase()];
    }
    localStorage.setItem('KIMCHI_PHONE_EDIT_OVERRIDES', JSON.stringify(map));
  } catch (e) {}
}
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
  const statusMap = getPhoneStatusOverrides();
  const editMap = getPhoneEditOverrides();
  list.forEach((p, idx) => {
    if (!p) return;
    const idKey = p.id ? String(p.id) : '';
    const imeiKey = p.imei ? ('imei_' + String(p.imei).trim().toLowerCase()) : '';
    const overrideObj = (idKey && editMap[idKey]) || (imeiKey && editMap[imeiKey]);
    if (overrideObj) {
      Object.assign(p, overrideObj);
    }
    if (idKey && statusMap[idKey]) {
      p.status = statusMap[idKey];
    } else if (imeiKey && statusMap[imeiKey]) {
      p.status = statusMap[imeiKey];
    }
  });
  return list;
}
window.getPhoneEditOverrides = getPhoneEditOverrides;
window.setPhoneEditOverride = setPhoneEditOverride;
window.removePhoneEditOverride = removePhoneEditOverride;
window.getPhoneStatusOverrides = getPhoneStatusOverrides;
window.setPhoneStatusOverride = setPhoneStatusOverride;
window.applyPhoneStatusOverrides = applyPhoneStatusOverrides;`);

// 2. Cập nhật saveNewPhone: so sánh String(x.id) === String(editId) và gọi setPhoneEditOverride
const oldSaveNewPhoneMatch = normalize(`  const editId = document.getElementById('mEditId').value;
  const brandSelectVal = document.getElementById('mBrandSelect') ? document.getElementById('mBrandSelect').value : '';
  const existingP = editId ? phoneDatabase.find(x => x.id == editId) : null;`);

const newSaveNewPhoneMatch = normalize(`  const editId = document.getElementById('mEditId').value;
  const brandSelectVal = document.getElementById('mBrandSelect') ? document.getElementById('mBrandSelect').value : '';
  const existingP = editId ? phoneDatabase.find(x => String(x.id) === String(editId) || x.id == editId) : null;`);

const oldSaveNewPhoneFind = normalize(`  if (editId) {
    const p = phoneDatabase.find(item => item.id == editId);`);

const newSaveNewPhoneFind = normalize(`  if (editId) {
    const p = phoneDatabase.find(item => String(item.id) === String(editId) || item.id == editId);`);

const oldSaveNewPhoneEnd = normalize(`  if (savedItem && savedItem.status && typeof setPhoneStatusOverride === 'function') {
    setPhoneStatusOverride(savedItem.id, savedItem.status, savedItem.imei);
  }
  savePhoneStorage(savedItem);`);

const newSaveNewPhoneEnd = normalize(`  if (savedItem) {
    if (typeof setPhoneEditOverride === 'function') {
      setPhoneEditOverride(savedItem);
    }
    if (savedItem.status && typeof setPhoneStatusOverride === 'function') {
      setPhoneStatusOverride(savedItem.id, savedItem.status, savedItem.imei);
    }
  }
  savePhoneStorage(savedItem);`);

// 3. Cập nhật deletePhone: xóa cả override nếu máy bị xóa
const oldDeletePhoneClean = normalize(`      if (typeof recordDeletedPhoneId === 'function') {
        recordDeletedPhoneId(id, p ? p.imei : null);
      }`);

const newDeletePhoneClean = normalize(`      if (typeof recordDeletedPhoneId === 'function') {
        recordDeletedPhoneId(id, p ? p.imei : null);
      }
      if (typeof removePhoneEditOverride === 'function') {
        removePhoneEditOverride(id, p ? p.imei : null);
      }`);

if (!js.includes(oldOverrideBlock)) {
  console.error('oldOverrideBlock not found!');
  process.exit(1);
}
if (!js.includes(oldSaveNewPhoneMatch)) {
  console.error('oldSaveNewPhoneMatch not found!');
  process.exit(1);
}
if (!js.includes(oldSaveNewPhoneFind)) {
  console.error('oldSaveNewPhoneFind not found!');
  process.exit(1);
}
if (!js.includes(oldSaveNewPhoneEnd)) {
  console.error('oldSaveNewPhoneEnd not found!');
  process.exit(1);
}
if (!js.includes(oldDeletePhoneClean)) {
  console.error('oldDeletePhoneClean not found!');
  process.exit(1);
}

js = js.replace(oldOverrideBlock, newOverrideBlock);
js = js.replace(oldSaveNewPhoneMatch, newSaveNewPhoneMatch);
js = js.replace(oldSaveNewPhoneFind, newSaveNewPhoneFind);
js = js.replace(oldSaveNewPhoneEnd, newSaveNewPhoneEnd);
js = js.replace(oldDeletePhoneClean, newDeletePhoneClean);

fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated js/main.js with persistent phone edit overrides!');

