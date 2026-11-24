const fs = require('fs');

// 1. Thêm CSS vào style.css
const cssRule = `
/* Badge thương hiệu điện thoại: đảm bảo nền và màu chữ hiển thị chuẩn */
.brand-text-badge {
  display: inline-block !important;
  font-weight: 900 !important;
  font-size: 0.95rem !important;
  padding: 2px 8px !important;
  border-radius: 5px !important;
  letter-spacing: 0.5px !important;
  vertical-align: middle !important;
  line-height: 1.25 !important;
}
.brand-text-badge-iphone {
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #ea580c !important;
  border: 1px solid #fed7aa !important;
}
`;

fs.appendFileSync('css/style.css', '\n' + cssRule);
console.log('Updated css/style.css');

// 2. Cập nhật main.js getPhoneBrandBadgeHtml
let mainJs = fs.readFileSync('js/main.js', 'utf8');

const oldTarget = `  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff';
    color = '#ea580c';
    border = '1px solid #fed7aa';
  } else if (detected === 'IPAD') {`;

const newTarget = `  let customClass = '';
  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff !important';
    color = '#ea580c !important';
    border = '1px solid #fed7aa !important';
    customClass = 'brand-text-badge-iphone';
    extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';
  } else if (detected === 'IPAD') {`;

if (mainJs.includes(oldTarget)) {
  mainJs = mainJs.replace(oldTarget, newTarget);
  // Thay thế luôn thẻ span trả về để có class customClass
  mainJs = mainJs.replace(
    'return `<span class="brand-text-badge" style="display: inline-block; background: ${bg}; color: ${color}; font-weight: 900; font-size: 0.95rem; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px; line-height: 1.25; ${borderStyle} ${extraStyle}">${escapeHtml(text)}</span>`;',
    'return `<span class="brand-text-badge ${customClass}" style="display: inline-block; background: ${bg}; color: ${color}; font-weight: 900; font-size: 0.95rem; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px; line-height: 1.25; ${borderStyle} ${extraStyle}">${escapeHtml(text)}</span>`;'
  );
  fs.writeFileSync('js/main.js', mainJs, 'utf8');
  console.log('Updated js/main.js');
} else {
  console.log('Warning: oldTarget not found in main.js');
}

// 3. Cập nhật baogia.html (cũng có getBrandBadgeHtml)
let baogia = fs.readFileSync('baogia.html', 'utf8');
const oldBaoGia = `} else if (b.includes('IPHONE') || b.includes('APPLE')) {
                badgeText = 'IPHONE';
                bg = '#000000';
                color = '#ffffff';
                border = '1px solid #475569';`;
const newBaoGia = `} else if (b.includes('IPHONE') || b.includes('APPLE')) {
                badgeText = 'IPHONE';
                bg = '#ffffff !important';
                color = '#ea580c !important';
                border = '1px solid #fed7aa !important';
                extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';`;

if (baogia.includes(oldBaoGia)) {
  baogia = baogia.replace(oldBaoGia, newBaoGia);
  fs.writeFileSync('baogia.html', baogia, 'utf8');
  console.log('Updated baogia.html');
}

// 4. Bump version
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const vString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

fs.writeFileSync('version.json', JSON.stringify({ version: ts, updated: vString }, null, 2), 'utf8');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/main\.js\?v=[^"'\s>]+/g, `main.js?v=${ts}`);
indexHtml = indexHtml.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${ts}`);
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Bumped version to', ts);

