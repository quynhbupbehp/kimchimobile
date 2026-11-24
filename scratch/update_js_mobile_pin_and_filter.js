const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// 1. Thêm hàm formatMobilePinDisplay trước renderPhoneGrid
const helperFunc = `// Định dạng hiển thị Dung Lượng Pin riêng cho mobile (100% -> 100, 4.100 mAh -> 4.1K)
function formatMobilePinDisplay(rawPin) {
  if (!rawPin && rawPin !== 0) return '';
  let str = String(rawPin).trim();
  if (!str) return '';

  let mahMatch = str.match(/([\\d.,]+)\\s*mAh/i);
  if (mahMatch) {
    let cleanNum = mahMatch[1].replace(/[.,]/g, '');
    let num = parseFloat(cleanNum);
    if (!isNaN(num) && num >= 1000) {
      let val = (num / 1000).toString();
      val = parseFloat(val).toString();
      return val + 'K';
    }
  }

  if (str.includes('%')) {
    return str.replace(/%/g, '').replace(/\\s+/g, ' ').trim();
  }

  return str;
}

`;

const targetAnchor = 'function renderPhoneGrid() {';
if (!normJs.includes('function formatMobilePinDisplay(')) {
  normJs = normJs.replace(targetAnchor, helperFunc + targetAnchor);
}

// 2. Lọc chỉ hiển thị còn hàng trên mobile
const oldFilter = `  let filtered = (currentPhoneStatusFilter === 'CHUA_XU_LY')
    ? phoneDatabase.filter(p => p.status === 'Chưa Xử Lý' || (p.status && p.status.toLowerCase().includes('chưa xử lý')))
    : phoneDatabase.filter(p => p.status !== 'Chưa Xử Lý' && (!p.status || !p.status.toLowerCase().includes('chưa xử lý')));`;

const newFilter = `  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
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

if (normJs.includes(oldFilter)) {
  normJs = normJs.replace(oldFilter, newFilter);
} else {
  console.error('Could not find oldFilter');
}

// 3. Định dạng displayPinPct trên thẻ máy mobile
const oldPinCard = `      let displayPinStatus = p.pinStatus || 'Pin Zin';
      let displayPinPct = (p.pin || p.battery || p.batteryCap || '').trim();
      let displayOrigin = p.origin || 'VN/A';
      let displayCondition = p.condition || 'Zin Đẹp 99%';
      let dotColor = getHexColor(p.color);

      let isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;`;

const newPinCard = `      let displayPinStatus = p.pinStatus || 'Pin Zin';
      let displayPinPct = (p.pin || p.battery || p.batteryCap || '').trim();
      let displayOrigin = p.origin || 'VN/A';
      let displayCondition = p.condition || 'Zin Đẹp 99%';
      let dotColor = getHexColor(p.color);

      let isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
      if (!isDesktop) {
        displayPinPct = formatMobilePinDisplay(displayPinPct);
      }`;

if (normJs.includes(oldPinCard)) {
  normJs = normJs.replace(oldPinCard, newPinCard);
} else {
  console.error('Could not find oldPinCard');
}

const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
fs.writeFileSync('js/main.js', finalJs, 'utf8');
console.log('SUCCESS: Updated js/main.js');

