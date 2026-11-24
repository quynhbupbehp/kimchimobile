const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// Target 1: getPhoneBrandLogoHtml
const startMarker1 = 'function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 25) {';
const endMarker1 = 'window.getPhoneBrandLogoHtml = getPhoneBrandLogoHtml;';

const idxStart1 = js.indexOf(startMarker1);
const idxEnd1 = js.indexOf(endMarker1);

if (idxStart1 === -1 || idxEnd1 === -1) {
  console.error('Markers 1 not found!');
  process.exit(1);
}

const appleSvgOfficial = `<svg viewBox="0 0 384 512" width="15" height="15" fill="#ffffff" style="display: block !important;"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;

const newFn = `function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 25) {
  let b = String(brand || '').toUpperCase().trim();
  let n = String(phoneName || '').toUpperCase().trim();
  if (b === 'MÁY NGOÀI' || b === '❤️❤️❤️' || n.startsWith('❤️❤️❤️') || n.startsWith('MÁY NGOÀI')) {
    return '';
  }
  let detected = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(brand, phoneName) : b;
  let boxH = sizePx || 25;

  // 1. HÃNG IPHONE + IPAD: Logo táo khuyết chuẩn quốc tế nền cam táo khuyết trắng
  if (detected === 'IPHONE' || detected === 'IPAD' || detected === 'APPLE') {
    return \`<span class="phone-brand-logo phone-brand-badge-apple" style="width: \${boxH}px !important; min-width: \${boxH}px !important; height: \${boxH}px !important; min-height: \${boxH}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="\${detected}">${appleSvgOfficial}</span>\`;
  }

  // 2. HÃNG OPPO: Chữ trắng nền xanh lá
  if (detected === 'OPPO') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #16a34a !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; width: auto !important; min-width: unset !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">OPPO</span>\`;
  }

  // 3. HÃNG REDMI: Chữ trắng nền đỏ
  if (detected === 'REDMI' || detected === 'XIAOMI') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #dc2626 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; width: auto !important; min-width: unset !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REDMI</span>\`;
  }

  // 4. HÃNG SAMSUNG: Chữ trắng nền xanh dương
  if (detected === 'SAMSUNG') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #1d4ed8 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; width: auto !important; min-width: unset !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">SAMSUNG</span>\`;
  }

  // 5. HÃNG POCO: Chữ trắng nền vàng
  if (detected === 'POCO') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #eab308 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; width: auto !important; min-width: unset !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">POCO</span>\`;
  }

  // 6. HÃNG REALME: Chữ Đỏ nền vàng
  if (detected === 'REALME') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #facc15 !important; color: #dc2626 !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; width: auto !important; min-width: unset !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REALME</span>\`;
  }

  // 7. HÃNG VIVO: Để nguyên (dùng ảnh logo_vivo.jpg)
  if (detected === 'VIVO') {
    return \`<img src="img/logo_vivo.jpg" alt="Vivo" class="phone-brand-logo" style="width: \${boxH}px !important; min-width: \${boxH}px !important; height: \${boxH}px !important; max-height: \${boxH}px !important; border-radius: 4px !important; object-fit: contain !important; display: inline-block !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; background: rgba(255,255,255,0.08); padding: 1px;" />\`;
  }

  // Mặc định: Logo Apple nền cam nếu là máy chưa xác định
  return \`<span class="phone-brand-logo phone-brand-badge-apple" style="width: \${boxH}px !important; min-width: \${boxH}px !important; height: \${boxH}px !important; min-height: \${boxH}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="\${detected}">${appleSvgOfficial}</span>\`;
}
`;

js = js.slice(0, idxStart1) + newFn + js.slice(idxEnd1);

// Target 2: displayName inside renderPhoneGrid
const lines = js.split('\n');
let targetIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('logoHtml = getPhoneBrandLogoHtml(p.brand, p.name, 25);')) {
    targetIndex = i;
    break;
  }
}

if (targetIndex === -1) {
  console.error('Target 2 line not found!');
  process.exit(1);
}

console.log('Found target 2 at line', targetIndex + 1);
console.log('Original line + 1:', lines[targetIndex + 1]);
console.log('Original line + 2:', lines[targetIndex + 2]);

// Replace lines[targetIndex + 1] and lines[targetIndex + 2]
const newLines = [
  '        // Trên Mobile: Loại bỏ tên hãng ở đầu tên máy để không bị trùng lặp chèn lấp',
  "        displayName = displayName.replace(/^(?:SAMSUNG|OPPO|REALME|XIAOMI|REDMI|POCO|VIVO|HONOR|IPHONE|IPAD|APPLE)\\s*[-–—:]*\\s*/i, '');",
  "        let bStr = (p.brand || '').trim();",
  "        if (bStr && bStr !== 'MÁY NGOÀI' && bStr !== '❤️❤️❤️') {",
  "          const bReg = new RegExp('^' + bStr.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + '\\\\s*[-–—:]*\\\\s*', 'i');",
  "          displayName = displayName.replace(bReg, '');",
  '        }',
  '        // Thay thế cụm PRO MAX thành PRM để tên máy không bị dài che khuất',
  "        displayName = displayName.replace(/pro\\s*max/gi, 'PRM');"
];

lines.splice(targetIndex + 1, 2, ...newLines);

fs.writeFileSync('js/main.js', lines.join('\n'), 'utf8');
console.log('Successfully updated js/main.js by lines splice!');
