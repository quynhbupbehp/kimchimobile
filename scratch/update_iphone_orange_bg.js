const fs = require('fs');

// 1. Cập nhật js/main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');
const searchMain = `  let customClass = '';
  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff !important';
    color = '#ea580c !important';
    border = '1px solid #fed7aa !important';
    customClass = 'brand-text-badge-iphone';
    extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';
  } else if (detected === 'IPAD') {`;

const replaceMain = `  let customClass = '';
  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ea580c !important';
    color = '#ffffff !important';
    border = 'none';
    customClass = 'brand-text-badge-iphone';
    extraStyle = 'background-color: #ea580c !important; color: #ffffff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5);';
  } else if (detected === 'IPAD') {`;

if (mainJs.includes(searchMain)) {
  mainJs = mainJs.replace(searchMain, replaceMain);
  fs.writeFileSync('js/main.js', mainJs, 'utf8');
  console.log('Updated js/main.js to Orange background + White text');
} else {
  console.error('searchMain not found in js/main.js');
}

// 2. Cập nhật css/style.css
let styleCss = fs.readFileSync('css/style.css', 'utf8');
const searchCss = `.brand-text-badge-iphone {
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #ea580c !important;
  border: 1px solid #fed7aa !important;
}`;

const replaceCss = `.brand-text-badge-iphone {
  background: #ea580c !important;
  background-color: #ea580c !important;
  color: #ffffff !important;
  border: none !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}`;

if (styleCss.includes(searchCss)) {
  styleCss = styleCss.replace(searchCss, replaceCss);
  fs.writeFileSync('css/style.css', styleCss, 'utf8');
  console.log('Updated css/style.css to Orange background + White text');
} else {
  console.error('searchCss not found in css/style.css');
}

// 3. Cập nhật baogia.html
let baogia = fs.readFileSync('baogia.html', 'utf8');
const searchBaogia = `} else if (b.includes('IPHONE') || b.includes('APPLE')) {
                badgeText = 'IPHONE';
                bg = '#ffffff !important';
                color = '#ea580c !important';
                border = '1px solid #fed7aa !important';
                extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';`;

const replaceBaogia = `} else if (b.includes('IPHONE') || b.includes('APPLE')) {
                badgeText = 'IPHONE';
                bg = '#ea580c !important';
                color = '#ffffff !important';
                border = 'none';
                extraStyle = 'background-color: #ea580c !important; color: #ffffff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.5);';`;

if (baogia.includes(searchBaogia)) {
  baogia = baogia.replace(searchBaogia, replaceBaogia);
  fs.writeFileSync('baogia.html', baogia, 'utf8');
  console.log('Updated baogia.html');
}

// 4. Bump version đồng bộ
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const vString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

fs.writeFileSync('version.json', JSON.stringify({ version: ts, updated: vString }, null, 2), 'utf8');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/var CURRENT_PAGE_VERSION = "[^"]*";/, `var CURRENT_PAGE_VERSION = "${ts}";`);
indexHtml = indexHtml.replace(/css\/style\.css\?v=[^"'\s>]+/g, `css/style.css?v=${ts}`);
indexHtml = indexHtml.replace(/js\/main\.js\?v=[^"'\s>]+/g, `js/main.js?v=${ts}`);
fs.writeFileSync('index.html', indexHtml, 'utf8');

baogia = fs.readFileSync('baogia.html', 'utf8');
baogia = baogia.replace(/css\/style\.css\?v=[^"'\s>]+/g, `css/style.css?v=${ts}`);
fs.writeFileSync('baogia.html', baogia, 'utf8');

console.log('Bumped all versions to:', ts);

