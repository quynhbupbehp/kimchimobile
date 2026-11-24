const fs = require('fs');

let content = fs.readFileSync('baogia.html', 'utf8');

const targetStart = 'function getBrandBadgeHtml(brand, isMobile = false, nameStr = \'\') {';
const targetEnd = 'function renderDeviceNames(';

const startIdx = content.indexOf(targetStart);
const endIdx = content.indexOf(targetEnd, startIdx);

if (startIdx === -1 || endIdx === -1) {
    console.error('Target not found', { startIdx, endIdx });
    process.exit(1);
}

const replacement = `function getBrandBadgeHtml(brand, isMobile = false, nameStr = '') {
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
                    } else if (/\\bPOCO\\b/i.test(n)) {
                        b = 'POCO';
                    } else if (/\\b(REDMI|XIAOMI|MI)\\b/i.test(n) || /\\bK\\d{2}\\b/i.test(n)) {
                        b = 'REDMI';
                    } else if (/\\bREALME\\b/i.test(n)) {
                        b = 'REALME';
                    } else if (/\\b(OPPO|RENO)\\b/i.test(n) || /\\bF\\d{1,2}\\b/i.test(n)) {
                        b = 'OPPO';
                    } else if (/\\b(VIVO|IQOO)\\b/i.test(n) || /\\b(Y\\d{2}|V\\d{2})\\b/i.test(n)) {
                        b = 'VIVO';
                    } else if (/\\b(VSMART|JOY|STAR|LIVE|ACTIVE)\\b/i.test(n)) {
                        b = 'VSMART';
                    }
                }
            }

            if (!b) return '';

            // Chuẩn hóa tên thương hiệu chính xác theo 8 quy tắc:
            // 1. IPHONE: nền đen chữ trắng đậm
            // 2. SAMSUNG: nền xanh dương chữ trắng đậm
            // 3. OPPO: nền xanh lá chữ trắng đậm
            // 4. VIVO: nền tím chữ trắng đậm
            // 5. REALME: nền vàng chữ trắng đậm (text-shadow)
            // 6. POCO: nền vàng chữ Đen
            // 7. REDMI: nền đỏ chữ trắng đậm
            // 8. IPAD: nền đen chữ trắng đậm
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
            } else if (b.includes('REALME')) {
                badgeText = 'REALME';
                bg = '#eab308'; // nền vàng
                color = '#ffffff';
                extraStyle = 'text-shadow: 0 1px 2px rgba(0,0,0,0.7);';
            } else if (b.includes('POCO')) {
                badgeText = 'POCO';
                bg = '#facc15'; // nền vàng
                color = '#000000'; // chữ Đen
            } else if (b.includes('OPPO')) {
                badgeText = 'OPPO';
                bg = '#16a34a'; // xanh lá
                color = '#ffffff';
            } else if (b.includes('REDMI') || b.includes('XIAOMI') || b.includes('MI')) {
                badgeText = 'REDMI';
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

content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
fs.writeFileSync('baogia.html', content, 'utf8');
console.log('Successfully updated baogia.html');

