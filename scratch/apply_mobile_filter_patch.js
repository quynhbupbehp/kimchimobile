const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

const targetSection = `  let filtered = (currentPhoneStatusFilter === 'CHUA_XU_LY')
    ? phoneDatabase.filter(p => p.status === 'Chưa Xử Lý' || (p.status && p.status.toLowerCase().includes('chưa xử lý')))
    : phoneDatabase.filter(p => p.status !== 'Chưa Xử Lý' && (!p.status || !p.status.toLowerCase().includes('chưa xử lý')));`;

const replacementSection = `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
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

if (normJs.includes(targetSection)) {
  normJs = normJs.replace(targetSection, replacementSection);
  const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
  fs.writeFileSync('js/main.js', finalJs, 'utf8');
  console.log('SUCCESS: Patched mobile filter: only còn hàng on mobile!');
} else {
  console.error('ERROR: targetSection not found');
}

