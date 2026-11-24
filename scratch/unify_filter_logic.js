const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// Tìm đoạn lọc khác biệt trên mobile:
const oldMobileFilter = `  // Trên Mobile: Luôn chỉ hiển thị danh sách còn hàng (loại bỏ máy chưa xử lý, main xác hoặc đã bán)
  if (isMobileScreen) {
    filtered = filtered.filter(p => {
      let st = (p.status || '').toLowerCase().trim();
      if (!st || st === 'còn hàng' || st === 'con hang') return true;
      if (st.includes('chưa xử lý') || st.includes('đã bán') || st.includes('da ban')) return false;
      return true;
    });
  }`;

// Thay thế: Cả Web và Mobile đều dùng chung 1 logic lọc còn hàng chuẩn xác:
// Khi ở chế độ Còn Hàng (không phải CHUA_XU_LY):
// Loại trừ tất cả các máy có trạng thái 'Chưa Xử Lý', 'Đã bán'
const newStandardFilter = `  // Đồng nhất 100% logic lọc Còn Hàng giữa Web & Mobile:
  // Loại bỏ hoàn toàn các máy Chưa Xử Lý / Main Xác hoặc Đã Bán
  filtered = filtered.filter(p => {
    let st = (p.status || '').toLowerCase().trim();
    if (currentPhoneStatusFilter === 'CHUA_XU_LY') {
      return st.includes('chưa xử lý') || st.includes('main xác');
    }
    if (st.includes('chưa xử lý') || st.includes('main xác') || st.includes('đã bán') || st.includes('da ban')) {
      return false;
    }
    return true;
  });`;

const targetSection = `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  let filtered = (currentPhoneStatusFilter === 'CHUA_XU_LY')
    ? phoneDatabase.filter(p => p.status === 'Chưa Xử Lý' || (p.status && p.status.toLowerCase().includes('chưa xử lý')))
    : phoneDatabase.filter(p => p.status !== 'Chưa Xử Lý' && (!p.status || !p.status.toLowerCase().includes('chưa xử lý')));

  // Trên Mobile: Luôn chỉ hiển thị danh sách còn hàng (loại bỏ máy chưa xử lý, main xác hoặc đã bán)
  if (isMobileScreen) {
    filtered = filtered.filter(p => {
      let st = (p.status || '').toLowerCase().trim();
      if (!st || st === 'còn hàng' || st === 'con hang') return true;
      if (st.includes('chưa xử lý') || st.includes('đã bán') || st.includes('da ban')) return false;
      return true;
    });
  }`;

const replacementSection = `  // Đồng nhất 100% logic lọc máy giữa Web & Mobile:
  let filtered = phoneDatabase.filter(p => {
    let st = (p.status || '').toLowerCase().trim();
    if (currentPhoneStatusFilter === 'CHUA_XU_LY') {
      return st.includes('chưa xử lý') || st.includes('main xác');
    }
    // Chế độ Còn Hàng: Loại bỏ máy Chưa Xử Lý và máy Đã Bán
    if (st.includes('chưa xử lý') || st.includes('main xác') || st.includes('đã bán') || st.includes('da ban')) {
      return false;
    }
    return true;
  });`;

if (normJs.includes(targetSection)) {
  normJs = normJs.replace(targetSection, replacementSection);
  const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
  fs.writeFileSync('js/main.js', finalJs, 'utf8');
  console.log('SUCCESS: Unified filter logic across Web and Mobile in js/main.js');
} else {
  console.error('ERROR: targetSection not found in main.js');
}

