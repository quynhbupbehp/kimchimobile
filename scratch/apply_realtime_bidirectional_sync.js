const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// 1. Khi nhận Cloud bundle phones (fetchDirectCloudSync)
const oldFetchPhones = `          } else {
            phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;
            if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);
          }`;

const newFetchPhones = `          } else {
            // Đồng bộ trực tiếp 100% từ Cloud: Thiết bị này (Web/Mobile) nhận đúng những gì thiết bị kia đã tạo/sửa/xóa
            phoneDatabase = Array.isArray(data.list) ? data.list : [];
            if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);
          }`;

if (normJs.includes(oldFetchPhones)) {
  normJs = normJs.replace(oldFetchPhones, newFetchPhones);
  console.log('SUCCESS: Patched fetchDirectCloudSync phones');
} else {
  console.error('ERROR: oldFetchPhones not found');
}

// 2. Khi nhận Cloud bundle phones Realtime (onSnapshot)
const oldSnapPhones = `          phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(data.list) : data.list;
          if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);`;

const newSnapPhones = `          // Đồng bộ trực tiếp 100% từ Cloud Realtime: Web hay Mobile thêm/sửa/xóa là bên kia cập nhật tức thì
          phoneDatabase = Array.isArray(data.list) ? data.list : [];
          if (typeof applyPhoneStatusOverrides === 'function') applyPhoneStatusOverrides(phoneDatabase);`;

if (normJs.includes(oldSnapPhones)) {
  normJs = normJs.replace(oldSnapPhones, newSnapPhones);
  console.log('SUCCESS: Patched onSnapshot phones');
} else {
  console.error('ERROR: oldSnapPhones not found');
}

// 3. Tương tự cho sold_phones (Bảo hành) để 2 bên đồng bộ tức thì
const oldFetchSold = `          } else {
            soldPhoneDatabase = (typeof mergeWithSeedSoldPhones === 'function') ? mergeWithSeedSoldPhones(data.list) : data.list;
          }`;

const newFetchSold = `          } else {
            soldPhoneDatabase = Array.isArray(data.list) ? data.list : [];
          }`;

if (normJs.includes(oldFetchSold)) {
  normJs = normJs.replace(oldFetchSold, newFetchSold);
  console.log('SUCCESS: Patched fetchDirectCloudSync sold_phones');
}

const oldSnapSold = `          soldPhoneDatabase = (typeof mergeWithSeedSoldPhones === 'function') ? mergeWithSeedSoldPhones(data.list) : data.list;`;
const newSnapSold = `          soldPhoneDatabase = Array.isArray(data.list) ? data.list : [];`;

if (normJs.includes(oldSnapSold)) {
  normJs = normJs.replace(oldSnapSold, newSnapSold);
  console.log('SUCCESS: Patched onSnapshot sold_phones');
}

// 4. Khi render Bán máy: đảm bảo trên Mobile CHỈ hiển thị máy CÒN HÀNG
const oldRenderMobileFilter = `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  let filtered = (currentPhoneStatusFilter === 'CHUA_XU_LY')
    ? phoneDatabase.filter(p => p.status === 'Chưa Xử Lý' || (p.status && p.status.toLowerCase().includes('chưa xử lý')))
    : phoneDatabase.filter(p => p.status !== 'Chưa Xử Lý' && (!p.status || !p.status.toLowerCase().includes('chưa xử lý')));`;

const newRenderMobileFilter = `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  let filtered = (currentPhoneStatusFilter === 'CHUA_XU_LY')
    ? phoneDatabase.filter(p => p.status === 'Chưa Xử Lý' || (p.status && p.status.toLowerCase().includes('chưa xử lý')))
    : phoneDatabase.filter(p => p.status !== 'Chưa Xử Lý' && (!p.status || !p.status.toLowerCase().includes('chưa xử lý')));

  // TRÊN MOBILE: TAB BÁN MÁY CHỈ HIỂN THỊ DUY NHẤT CÁC MÁY CÒN HÀNG (LOẠI BỎ HẲN MÁY ĐÃ BÁN, CHƯA XỬ LÝ)
  if (isMobileScreen) {
    filtered = filtered.filter(p => {
      let st = (p.status || '').toLowerCase().trim();
      if (!st || st === 'còn hàng' || st === 'con hang') return true;
      if (st.includes('chưa xử lý') || st.includes('đã bán') || st.includes('da ban') || st.includes('main xác')) return false;
      return true;
    });
  }`;

if (normJs.includes(oldRenderMobileFilter)) {
  normJs = normJs.replace(oldRenderMobileFilter, newRenderMobileFilter);
  console.log('SUCCESS: Patched mobile only còn hàng filter');
} else {
  console.error('ERROR: oldRenderMobileFilter not found');
}

// 5. Khi xóa máy trong deletePhone(): đảm bảo đồng bộ tức thì lên Cloud
const oldDeleteSave = `      phoneDatabase = phoneDatabase.filter(item => String(item.id) !== String(id) && item.id != id);
      savePhoneStorage();`;

const newDeleteSave = `      phoneDatabase = phoneDatabase.filter(item => String(item.id) !== String(id) && item.id != id);
      savePhoneStorage();
      if (typeof syncPhoneBundleDebounced === 'function') syncPhoneBundleDebounced();`;

if (normJs.includes(oldDeleteSave)) {
  normJs = normJs.replace(oldDeleteSave, newDeleteSave);
  console.log('SUCCESS: Patched deletePhone instant cloud sync');
}

const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
fs.writeFileSync('js/main.js', finalJs, 'utf8');
console.log('ALL MAIN.JS REALTIME SYNC UPDATES COMPLETE!');

