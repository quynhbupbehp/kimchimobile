const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

let redmi = conHang.filter(p => p.brand === 'REDMI');
console.log('REDMI count:', redmi.length);
console.log('157 - 8 = 149! Chênh lệch 8 máy!');

