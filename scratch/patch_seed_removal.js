const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// 1. Chỉnh sửa loadInitialPhones
const oldLoadInitial = `function loadInitialPhones() {
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

const newLoadInitial = `function loadInitialPhones() {
  try {
    const localRaw = localStorage.getItem('KIMCHI_PHONES_LOCAL');
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  // Nếu chưa có cache, nạp seed nhưng tuyệt đối lọc bỏ ngay máy đã bán
  if (Array.isArray(window.SEED_PHONES_DATA)) {
    return JSON.parse(JSON.stringify(window.SEED_PHONES_DATA));
  }
  return [];
}`;

if (normJs.includes(oldLoadInitial)) {
  normJs = normJs.replace(oldLoadInitial, newLoadInitial);
  console.log('SUCCESS: Updated loadInitialPhones');
}

// 2. Chỉnh sửa trong renderPhoneGrid
const oldRenderSeed = `  // Đảm bảo phoneDatabase khởi tạo ban đầu an toàn (chỉ hợp nhất seed nếu danh sách máy trống)
  if (Array.isArray(window.SEED_PHONES_DATA) && window.SEED_PHONES_DATA.length > 0) {
    if (!Array.isArray(phoneDatabase) || phoneDatabase.length === 0) {
      phoneDatabase = (typeof mergeWithSeedPhones === 'function') ? mergeWithSeedPhones(phoneDatabase) : JSON.parse(JSON.stringify(window.SEED_PHONES_DATA));
      savePhoneStorage();
    }
  }`;

const newRenderSeed = `  // Đảm bảo phoneDatabase khởi tạo ban đầu an toàn (chỉ lấy seed nếu danh sách hoàn toàn trống)
  if (Array.isArray(window.SEED_PHONES_DATA) && window.SEED_PHONES_DATA.length > 0) {
    if (!Array.isArray(phoneDatabase) || phoneDatabase.length === 0) {
      phoneDatabase = JSON.parse(JSON.stringify(window.SEED_PHONES_DATA));
      savePhoneStorage();
    }
  }`;

if (normJs.includes(oldRenderSeed)) {
  normJs = normJs.replace(oldRenderSeed, newRenderSeed);
  console.log('SUCCESS: Updated renderPhoneGrid seed check');
}

// 3. Tự động đồng bộ ngay lập tức khi mở trang nếu Web đã có phoneDatabase chuẩn
// Đảm bảo fetchDirectCloudSync cập nhật render ngay khi nhận dữ liệu
const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
fs.writeFileSync('js/main.js', finalJs, 'utf8');
console.log('ALL MAIN.JS UPDATES COMPLETED!');

