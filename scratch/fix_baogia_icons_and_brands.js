const fs = require('fs');

let content = fs.readFileSync('baogia.html', 'utf8');

// 1. Sửa phông chữ: Không đè lên i, .fa, .fa-*, [class*="fa-"]
const oldStylePart1 = `*, *::before, *::after {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }`;

const newStylePart1 = `body, input, select, textarea, button, span:not([class*="fa-"]), div, p, label, a, table, th, td, h1, h2, h3 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        i, [class*="fa-"], [class^="fa-"] {
            font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "FontAwesome" !important;
        }`;

const oldStylePart2 = `input, select, textarea, button, span, div, p, label, a, table, th, td, h1, h2, h3 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }`;

content = content.replace(oldStylePart1.replace(/\n/g, '\r\n'), newStylePart1.replace(/\n/g, '\r\n'));
content = content.replace(oldStylePart1, newStylePart1);
content = content.replace(oldStylePart2.replace(/\n/g, '\r\n'), '');
content = content.replace(oldStylePart2, '');

// 2. Sửa badge hãng:
// - OPPO - REALME: Chuyển thành OPPO (nền xanh lá chữ trắng)
// - REDMI - POCO: Chuyển thành MI (nền đỏ chữ trắng)
const targetFuncStart = "function getBrandBadgeHtml(brand, isMobile = false, nameStr = '') {";
const targetFuncEnd = "function renderDeviceNames(";

const startIdx = content.indexOf(targetFuncStart);
const endIdx = content.indexOf(targetFuncEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newFunc = `function getBrandBadgeHtml(brand, isMobile = false, nameStr = '') {
            let b = (brand || '').trim().toUpperCase();

            // Nếu không có brand hoặc brand là TẤT CẢ / HẾT HÀNG, thử lấy currentBrand hoặc suy đoán từ nameStr
            if (!b || b === 'TẤT CẢ' || b === 'HẾT HÀNG') {
                if (typeof currentBrand !== 'undefined' && currentBrand && currentBrand !== 'TẤT CẢ' && currentBrand !== 'HẾT HÀNG' && currentBrand !== 'NHẬP HÀNG') {
                    b = currentBrand.trim().toUpperCase();
                } else if (nameStr) {
                    const n = nameStr.trim().toUpperCase();
                    if (/\\b(IPAD)\\b/i.test(n)) {
                        b = 'IPAD';
                    } else if (/\\b(IPHONE|APPLE)\\b/i.test(n) || /^\\d{1,2}(\\s*(PRO|PRM|PLUS|MINI|MAX))?$/i.test(n)) {
                        b = 'IPHONE';
                    } else if (/\\b(SAMSUNG|GALAXY)\\b/i.test(n) || /^[SAMUNG\\s]*[ASM]\\d+/i.test(n) || /\\bNOTE\\s*\\d+/i.test(n) || /\\bS\\d{1,2}\\b/i.test(n)) {
                        b = 'SAMSUNG';
                    } else if (/\\b(REDMI|POCO|XIAOMI|MI)\\b/i.test(n) || /\\bK\\d{2}\\b/i.test(n)) {
                        b = 'MI';
                    } else if (/\\b(OPPO|REALME|RENO)\\b/i.test(n) || /\\bF\\d{1,2}\\b/i.test(n)) {
                        b = 'OPPO';
                    } else if (/\\b(VIVO|IQOO)\\b/i.test(n) || /\\b(Y\\d{2}|V\\d{2})\\b/i.test(n)) {
                        b = 'VIVO';
                    } else if (/\\b(VSMART|JOY|STAR|LIVE|ACTIVE)\\b/i.test(n)) {
                        b = 'VSMART';
                    }
                }
            }

            if (!b) return '';

            // Yêu cầu hiển thị thương hiệu chuẩn:
            // 1. IPHONE / IPAD: nền đen chữ trắng đậm
            // 2. SAMSUNG: nền xanh dương chữ trắng đậm
            // 3. OPPO - REALME -> Hiển thị chữ OPPO nền xanh lá chữ trắng
            // 4. REDMI - POCO -> Hiển thị chữ MI nền đỏ chữ trắng
            // 5. VIVO: nền tím chữ trắng đậm
            let badgeText = '';
            let bg = '#000000';
            let color = '#ffffff';
            let border = 'none';
            let extraStyle = '';

            if (b.includes('IPAD')) {
                badgeText = 'IPAD';
                bg = '#000000';
                color = '#ffffff';
                border = '1px solid #475569';
            } else if (b.includes('IPHONE') || b.includes('APPLE')) {
                badgeText = 'IPHONE';
                bg = '#000000';
                color = '#ffffff';
                border = '1px solid #475569';
            } else if (b.includes('SAMSUNG')) {
                badgeText = 'SAMSUNG';
                bg = '#1d4ed8'; // xanh dương
                color = '#ffffff';
            } else if (b.includes('OPPO') || b.includes('REALME')) {
                // Tên hiển thị hãng OPPO - REALME chuyển thành OPPO nền xanh lá chữ trắng
                badgeText = 'OPPO';
                bg = '#16a34a'; // xanh lá
                color = '#ffffff';
            } else if (b.includes('REDMI') || b.includes('POCO') || b.includes('XIAOMI') || b.includes('MI')) {
                // Tên hiển thị hãng REDMI - POCO chuyển thành MI nền đỏ chữ trắng
                badgeText = 'MI';
                bg = '#dc2626'; // nền đỏ
                color = '#ffffff';
            } else if (b.includes('VIVO') || b.includes('IQOO')) {
                badgeText = 'VIVO';
                bg = '#7c3aed'; // nền tím
                color = '#ffffff';
            } else if (b.includes('VSMART')) {
                badgeText = 'VSMART';
                bg = '#ea580c';
                color = '#ffffff';
            } else {
                badgeText = b;
                bg = '#334155';
                color = '#ffffff';
            }

            const borderStyle = border !== 'none' ? 'border: ' + border + ';' : '';
            const padStyle = isMobile ? 'padding: 1px 5px; font-size: 9px;' : 'padding: 2px 7px; font-size: 11px;';

            return '<span class="brand-text-badge" style="display: inline-block; background: ' + bg + '; color: ' + color + '; font-weight: 900; ' + padStyle + ' border-radius: 4px; letter-spacing: 0.5px; vertical-align: middle; margin-right: 5px; line-height: 1.25; ' + borderStyle + ' ' + extraStyle + '">' + badgeText + '</span>';
        }

        `;
    content = content.slice(0, startIdx) + newFunc + content.slice(endIdx);
    console.log('Updated getBrandBadgeHtml');
}

fs.writeFileSync('baogia.html', content, 'utf8');
console.log('Successfully updated baogia.html');

