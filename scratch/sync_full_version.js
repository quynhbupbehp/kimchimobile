const fs = require('fs');

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const vString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

// 1. Cập nhật version.json
fs.writeFileSync('version.json', JSON.stringify({ version: ts, updated: vString }, null, 2), 'utf8');

// 2. Cập nhật index.html: CURRENT_PAGE_VERSION, style.css?v=, main.js?v=
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/var CURRENT_PAGE_VERSION = "[^"]*";/, `var CURRENT_PAGE_VERSION = "${ts}";`);
indexHtml = indexHtml.replace(/css\/style\.css\?v=[^"'\s>]+/g, `css/style.css?v=${ts}`);
indexHtml = indexHtml.replace(/js\/main\.js\?v=[^"'\s>]+/g, `js/main.js?v=${ts}`);
fs.writeFileSync('index.html', indexHtml, 'utf8');

// 3. Cập nhật baogia.html
let baogia = fs.readFileSync('baogia.html', 'utf8');
baogia = baogia.replace(/css\/style\.css\?v=[^"'\s>]+/g, `css/style.css?v=${ts}`);
fs.writeFileSync('baogia.html', baogia, 'utf8');

console.log('Bumped version and updated CURRENT_PAGE_VERSION to:', ts);

