const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

const targetFunction = `function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 26) {
  let b = String(brand || '').toUpperCase().trim();
  let n = String(phoneName || '').toUpperCase().trim();
  if (b === 'MÁY NGOÀI' || b === '❤️❤️❤️' || n.startsWith('❤️❤️❤️') || n.startsWith('MÁY NGOÀI')) {
    return '';
  }
  let detected = detectPhoneBrand(brand, phoneName);
  let logoSrc = '';
  let altText = detected;
  let isWide = false;

  if (detected === 'IPHONE' || detected === 'IPAD' || detected === 'APPLE') {
    logoSrc = 'img/brand_apple.png';
    altText = 'Apple';
    isWide = false;
  } else if (detected === 'SAMSUNG') {
    logoSrc = 'img/brand_samsung.png';
    altText = 'Samsung';
    isWide = true;
  } else if (detected === 'REDMI' || detected === 'XIAOMI' || detected === 'POCO') {
    logoSrc = 'img/brand_redmi_poco.jpg';
    altText = 'Redmi / POCO';
    isWide = true;
  } else if (detected === 'OPPO' || detected === 'REALME') {
    logoSrc = 'img/brand_oppo_realme.jpg';
    altText = 'Oppo / Realme';
    isWide = true;
  } else if (detected === 'VIVO') {
    logoSrc = 'img/logo_vivo.jpg';
    altText = 'Vivo';
    isWide = false;
  } else {
    logoSrc = 'img/brand_apple.png';
    altText = 'Apple';
    isWide = false;
  }

  if (!logoSrc) return '';
  let styleWidth = isWide ? (sizePx * 2.6) + 'px' : sizePx + 'px';
  let styleHeight = sizePx + 'px';
  return \`<img src="\${logoSrc}" alt="\${altText}" class="phone-brand-logo" style="width: \${styleWidth} !important; height: \${styleHeight} !important; max-height: \${styleHeight} !important; border-radius: 4px !important; object-fit: contain !important; display: inline-block !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; background: rgba(255,255,255,0.08); padding: 1px;" />\`;
}`;

const replacementFunction = `function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 25) {
  let b = String(brand || '').toUpperCase().trim();
  let n = String(phoneName || '').toUpperCase().trim();
  if (b === 'MÁY NGOÀI' || b === '❤️❤️❤️' || n.startsWith('❤️❤️❤️') || n.startsWith('MÁY NGOÀI')) {
    return '';
  }
  let detected = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(brand, phoneName) : b;
  let boxH = sizePx || 25;

  // 1. HÃNG IPHONE + IPAD: Đổi thành logo táo khuyết nền cam táo khuyết trắng
  if (detected === 'IPHONE' || detected === 'IPAD' || detected === 'APPLE') {
    let iconSize = Math.round(boxH * 0.64);
    return \`<span class="phone-brand-logo phone-brand-badge-apple" style="width: \${boxH}px !important; height: \${boxH}px !important; min-width: \${boxH}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="\${detected}"><svg viewBox="0 0 170 170" width="\${iconSize}" height="\${iconSize}" fill="#ffffff" style="display: block !important;"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.1-9.5-10.83-20.24-14.19-32.22-3.36-11.98-5.04-23.3-5.04-33.96 0-14.47 3.58-26.65 10.74-36.54 7.16-9.89 16.27-14.96 27.34-15.21 4.58 0 9.87 1.25 15.88 3.75 6 2.5 10.02 3.81 12.06 3.93 1.96-.12 6.18-1.49 12.67-4.11 6.49-2.62 12.02-3.81 16.59-3.57 12.52.61 22.45 5.17 29.79 13.68-10.99 6.64-16.36 15.82-16.11 27.53.25 9.17 3.76 16.92 10.53 23.25 6.77 6.33 14.88 10.01 24.34 11.04-2.18 6.6-4.75 13.07-7.72 19.41zM119.22 33.09c0-7.39 2.66-14.39 7.98-21 5.32-6.61 11.96-10.99 19.92-13.14.73 3.42 1.1 6.55 1.1 9.38 0 7.39-2.73 14.34-8.19 20.85-5.46 6.51-12.19 10.77-20.19 12.79-.37-2.93-.62-5.89-.62-8.88z"/></svg></span>\`;
  }

  // 2. HÃNG OPPO: Chữ trắng nền xanh lá
  if (detected === 'OPPO') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #16a34a !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">OPPO</span>\`;
  }

  // 3. HÃNG REDMI: Chữ trắng nền đỏ
  if (detected === 'REDMI' || detected === 'XIAOMI') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #dc2626 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REDMI</span>\`;
  }

  // 4. HÃNG SAMSUNG: Chữ trắng nền xanh dương
  if (detected === 'SAMSUNG') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #1d4ed8 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">SAMSUNG</span>\`;
  }

  // 5. HÃNG POCO: Chữ trắng nền vàng
  if (detected === 'POCO') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #eab308 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">POCO</span>\`;
  }

  // 6. HÃNG REALME: Chữ Đỏ nền vàng
  if (detected === 'REALME') {
    return \`<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #facc15 !important; color: #dc2626 !important; font-weight: 900 !important; font-size: 0.72rem !important; height: \${boxH}px !important; min-height: \${boxH}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REALME</span>\`;
  }

  // 7. HÃNG VIVO: Để nguyên (dùng ảnh logo_vivo.jpg)
  if (detected === 'VIVO') {
    return \`<img src="img/logo_vivo.jpg" alt="Vivo" class="phone-brand-logo" style="width: \${boxH}px !important; height: \${boxH}px !important; max-height: \${boxH}px !important; border-radius: 4px !important; object-fit: contain !important; display: inline-block !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; background: rgba(255,255,255,0.08); padding: 1px;" />\`;
  }

  // Mặc định: Logo Apple nền cam nếu là máy chưa xác định
  let iconSize = Math.round(boxH * 0.64);
  return \`<span class="phone-brand-logo phone-brand-badge-apple" style="width: \${boxH}px !important; height: \${boxH}px !important; min-width: \${boxH}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="\${detected}"><svg viewBox="0 0 170 170" width="\${iconSize}" height="\${iconSize}" fill="#ffffff" style="display: block !important;"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.1-9.5-10.83-20.24-14.19-32.22-3.36-11.98-5.04-23.3-5.04-33.96 0-14.47 3.58-26.65 10.74-36.54 7.16-9.89 16.27-14.96 27.34-15.21 4.58 0 9.87 1.25 15.88 3.75 6 2.5 10.02 3.81 12.06 3.93 1.96-.12 6.18-1.49 12.67-4.11 6.49-2.62 12.02-3.81 16.59-3.57 12.52.61 22.45 5.17 29.79 13.68-10.99 6.64-16.36 15.82-16.11 27.53.25 9.17 3.76 16.92 10.53 23.25 6.77 6.33 14.88 10.01 24.34 11.04-2.18 6.6-4.75 13.07-7.72 19.41zM119.22 33.09c0-7.39 2.66-14.39 7.98-21 5.32-6.61 11.96-10.99 19.92-13.14.73 3.42 1.1 6.55 1.1 9.38 0 7.39-2.73 14.34-8.19 20.85-5.46 6.51-12.19 10.77-20.19 12.79-.37-2.93-.62-5.89-.62-8.88z"/></svg></span>\`;
}`;

// Normalize line endings for replacement
let normalizedMain = mainJs.replace(/\r\n/g, '\n');
let normalizedTarget = targetFunction.replace(/\r\n/g, '\n');

if (!normalizedMain.includes(normalizedTarget)) {
  console.error('Target not found in js/main.js!');
  process.exit(1);
}

let updated = normalizedMain.replace(normalizedTarget, replacementFunction);
if (mainJs.includes('\r\n')) {
  updated = updated.replace(/\n/g, '\r\n');
}

fs.writeFileSync('js/main.js', updated, 'utf8');
console.log('Successfully updated getPhoneBrandLogoHtml in js/main.js!');

