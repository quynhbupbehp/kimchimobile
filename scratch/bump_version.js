const fs = require('fs');
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ts = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const vString = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

fs.writeFileSync('version.json', JSON.stringify({ version: ts, updated: vString }, null, 2), 'utf8');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/main\.js\?v=[^"'\s>]+/g, `main.js?v=${ts}`);
indexHtml = indexHtml.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${ts}`);
indexHtml = indexHtml.replace(/var CURRENT_PAGE_VERSION = "[^"]+";/, `var CURRENT_PAGE_VERSION = "${ts}";`);
fs.writeFileSync('index.html', indexHtml, 'utf8');

let baogia = fs.readFileSync('baogia.html', 'utf8');
baogia = baogia.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${ts}`);
fs.writeFileSync('baogia.html', baogia, 'utf8');

console.log('Bumped cache version to:', ts);
