const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const targetOld = `      let brandDisplay = formatBrandDeviceName(p.brand || '');
      let pName = formatBrandDeviceName(p.name || '');
      // Bỏ tên hãng đi theo yêu cầu (ví dụ: IPHONE - SE - 2020 thì chỉ hiển thị SE - 2020)
      let brandAndName = pName;
      if (brandDisplay && brandDisplay !== 'MÁY NGOÀI' && brandDisplay !== '❤️❤️❤️') {
        const regex = new RegExp(\`^\${brandDisplay}\\\\s*[-–—:]*\\\\s*\`, 'i');
        brandAndName = brandAndName.replace(regex, '');
      }
      brandAndName = formatBrandDeviceName(brandAndName);`;

const targetNew = `      let brandDisplay = formatBrandDeviceName(p.brand || '');
      let pName = formatBrandDeviceName(p.name || '');
      let logoHtml = getPhoneBrandLogoHtml(p.brand, p.name, 25);
      // Trên Mobile: Loại bỏ tên hãng ở đầu tên máy để logo không bị trùng lặp
      let brandAndName = pName.replace(/^(?:SAMSUNG|OPPO|REALME|XIAOMI|REDMI|POCO|VIVO|HONOR|IPHONE|IPAD|APPLE)\\s*[-–—:]*\\s*/i, '');
      if (brandDisplay && brandDisplay !== 'MÁY NGOÀI' && brandDisplay !== '❤️❤️❤️') {
        const regex = new RegExp(\`^\${brandDisplay}\\\\s*[-–—:]*\\\\s*\`, 'i');
        brandAndName = brandAndName.replace(regex, '');
      }
      // Thay thế cụm PRO MAX thành PRM để tên máy gọn gàng
      brandAndName = brandAndName.replace(/pro\\s*max/gi, 'PRM');
      brandAndName = formatBrandDeviceName(brandAndName);`;

let normJs = js.replace(/\r\n/g, '\n');
let normTargetOld = targetOld.replace(/\r\n/g, '\n');
let normTargetNew = targetNew.replace(/\r\n/g, '\n');

if (normJs.includes(normTargetOld)) {
  normJs = normJs.replace(normTargetOld, normTargetNew);
  console.log('SUCCESS: Replaced brand logo prep in renderSoldPhoneGrid');
} else {
  console.log('FAILED: targetOld not found');
}

// Thay thế ${escapeHtml(brandAndName)} thành ${logoHtml}<span class="phone-card-name">${escapeHtml(brandAndName)}</span>
const cardHeaderOld = `<div class="phone-header-left">
                  <span class="phone-card-name">\${escapeHtml(brandAndName)}</span>`;
const cardHeaderNew = `<div class="phone-header-left">
                  \${logoHtml}
                  <span class="phone-card-name">\${escapeHtml(brandAndName)}</span>`;

let normCardHeaderOld = cardHeaderOld.replace(/\r\n/g, '\n');
let normCardHeaderNew = cardHeaderNew.replace(/\r\n/g, '\n');

if (normJs.includes(normCardHeaderOld)) {
  normJs = normJs.replace(normCardHeaderOld, normCardHeaderNew);
  console.log('SUCCESS: Added logoHtml before phone name in card header');
} else {
  console.log('FAILED: cardHeaderOld not found');
}

if (js.includes('\r\n')) {
  normJs = normJs.replace(/\n/g, '\r\n');
}
fs.writeFileSync('js/main.js', normJs, 'utf8');

