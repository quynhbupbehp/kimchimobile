const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="salesSearchBoxWrapper"');
console.log('=== salesSearchBoxWrapper ===');
console.log(html.slice(sIdx - 50, sIdx + 700));

const bangaIdx = html.indexOf('DANH SÁCH GÀ ĐÃ BÁN');
console.log('=== banga search box ===');
console.log(html.slice(bangaIdx - 50, bangaIdx + 900));

