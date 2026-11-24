const fs = require('fs');

function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 25) {
  let b = String(brand || '').toUpperCase().trim();
  let n = String(phoneName || '').toUpperCase().trim();
  if (b === 'MÁY NGOÀI' || b === '❤️❤️❤️' || n.startsWith('❤️❤️❤️') || n.startsWith('MÁY NGOÀI')) {
    return '';
  }
  let detected = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(brand, phoneName) : b;

  // 1. HÃNG IPHONE + IPAD: Logo táo khuyết nền cam táo khuyết trắng
  if (detected === 'IPHONE' || detected === 'IPAD' || detected === 'APPLE') {
    let boxSize = sizePx || 25;
    let iconSize = Math.round(boxSize * 0.64);
    return `<span class="phone-brand-logo phone-brand-badge-apple" style="width: ${boxSize}px !important; height: ${boxSize}px !important; min-width: ${boxSize}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="${detected}"><svg viewBox="0 0 170 170" width="${iconSize}" height="${iconSize}" fill="#ffffff" style="display: block !important;"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.1-9.5-10.83-20.24-14.19-32.22-3.36-11.98-5.04-23.3-5.04-33.96 0-14.47 3.58-26.65 10.74-36.54 7.16-9.89 16.27-14.96 27.34-15.21 4.58 0 9.87 1.25 15.88 3.75 6 2.5 10.02 3.81 12.06 3.93 1.96-.12 6.18-1.49 12.67-4.11 6.49-2.62 12.02-3.81 16.59-3.57 12.52.61 22.45 5.17 29.79 13.68-10.99 6.64-16.36 15.82-16.11 27.53.25 9.17 3.76 16.92 10.53 23.25 6.77 6.33 14.88 10.01 24.34 11.04-2.18 6.6-4.75 13.07-7.72 19.41zM119.22 33.09c0-7.39 2.66-14.39 7.98-21 5.32-6.61 11.96-10.99 19.92-13.14.73 3.42 1.1 6.55 1.1 9.38 0 7.39-2.73 14.34-8.19 20.85-5.46 6.51-12.19 10.77-20.19 12.79-.37-2.93-.62-5.89-.62-8.88z"/></svg></span>`;
  }

  // 2. HÃNG OPPO: chữ trắng nền xanh lá
  if (detected === 'OPPO') {
    return `<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #16a34a !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: ${sizePx}px !important; min-height: ${sizePx}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">OPPO</span>`;
  }

  // 3. HÃNG REDMI: chữ trắng nền đỏ
  if (detected === 'REDMI' || detected === 'XIAOMI') {
    return `<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #dc2626 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: ${sizePx}px !important; min-height: ${sizePx}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REDMI</span>`;
  }

  // 4. HÃNG SAMSUNG: chữ trắng nền xanh dương
  if (detected === 'SAMSUNG') {
    return `<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #1d4ed8 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: ${sizePx}px !important; min-height: ${sizePx}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">SAMSUNG</span>`;
  }

  // 5. HÃNG POCO: chữ trắng nền vàng
  if (detected === 'POCO') {
    return `<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #eab308 !important; color: #ffffff !important; font-weight: 900 !important; font-size: 0.72rem !important; height: ${sizePx}px !important; min-height: ${sizePx}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.6) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">POCO</span>`;
  }

  // 6. HÃNG REALME: chữ Đỏ nền vàng
  if (detected === 'REALME') {
    return `<span class="phone-brand-logo phone-brand-badge-text" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; background: #facc15 !important; color: #dc2626 !important; font-weight: 900 !important; font-size: 0.72rem !important; height: ${sizePx}px !important; min-height: ${sizePx}px !important; padding: 0 5px !important; border-radius: 5px !important; letter-spacing: 0.3px !important; vertical-align: middle !important; margin-right: 6px !important; line-height: 1 !important; flex-shrink: 0 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;">REALME</span>`;
  }

  // 7. HÃNG VIVO: để nguyên (logo img/logo_vivo.jpg)
  if (detected === 'VIVO') {
    let boxSize = sizePx || 25;
    return `<img src="img/logo_vivo.jpg" alt="Vivo" class="phone-brand-logo" style="width: ${boxSize}px !important; height: ${boxSize}px !important; max-height: ${boxSize}px !important; border-radius: 4px !important; object-fit: contain !important; display: inline-block !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; background: rgba(255,255,255,0.08); padding: 1px;" />`;
  }

  // Mặc định: Logo Apple nền cam nếu là máy chưa rõ hoặc chung chung
  let boxSize = sizePx || 25;
  let iconSize = Math.round(boxSize * 0.64);
  return `<span class="phone-brand-logo phone-brand-badge-apple" style="width: ${boxSize}px !important; height: ${boxSize}px !important; min-width: ${boxSize}px !important; border-radius: 6px !important; background: #ea580c !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 6px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;" title="${detected}"><svg viewBox="0 0 170 170" width="${iconSize}" height="${iconSize}" fill="#ffffff" style="display: block !important;"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.1-9.5-10.83-20.24-14.19-32.22-3.36-11.98-5.04-23.3-5.04-33.96 0-14.47 3.58-26.65 10.74-36.54 7.16-9.89 16.27-14.96 27.34-15.21 4.58 0 9.87 1.25 15.88 3.75 6 2.5 10.02 3.81 12.06 3.93 1.96-.12 6.18-1.49 12.67-4.11 6.49-2.62 12.02-3.81 16.59-3.57 12.52.61 22.45 5.17 29.79 13.68-10.99 6.64-16.36 15.82-16.11 27.53.25 9.17 3.76 16.92 10.53 23.25 6.77 6.33 14.88 10.01 24.34 11.04-2.18 6.6-4.75 13.07-7.72 19.41zM119.22 33.09c0-7.39 2.66-14.39 7.98-21 5.32-6.61 11.96-10.99 19.92-13.14.73 3.42 1.1 6.55 1.1 9.38 0 7.39-2.73 14.34-8.19 20.85-5.46 6.51-12.19 10.77-20.19 12.79-.37-2.93-.62-5.89-.62-8.88z"/></svg></span>`;
}

// Load detectPhoneBrand from main.js
const mainJs = fs.readFileSync('js/main.js', 'utf8');
const code = mainJs.slice(mainJs.indexOf('function isPhoneBrandIphone'), mainJs.indexOf('window.detectPhoneBrand = detectPhoneBrand;'));
eval(code);

console.log('Testing iPhone:');
console.log(getPhoneBrandLogoHtml('IPHONE', 'XR', 25));
console.log('\nTesting OPPO:');
console.log(getPhoneBrandLogoHtml('OPPO', 'A5X 5G', 25));
console.log('\nTesting REDMI:');
console.log(getPhoneBrandLogoHtml('REDMI', 'A1', 25));
console.log('\nTesting SAMSUNG:');
console.log(getPhoneBrandLogoHtml('SAMSUNG', 'A03S', 25));
console.log('\nTesting POCO:');
console.log(getPhoneBrandLogoHtml('POCO', 'X3', 25));
console.log('\nTesting REALME:');
console.log(getPhoneBrandLogoHtml('REALME', 'C2', 25));
console.log('\nTesting VIVO:');
console.log(getPhoneBrandLogoHtml('VIVO', 'Y91', 25));
