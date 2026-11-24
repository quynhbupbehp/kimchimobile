const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

let redmiPoco = conHang.filter(p => p.brand === 'REDMI' || p.brand === 'POCO').length;
let oppoRealme = conHang.filter(p => p.brand === 'OPPO' || p.brand === 'REALME').length;
let ipad = conHang.filter(p => p.brand === 'IPAD').length;
let samsung = conHang.filter(p => p.brand === 'SAMSUNG').length;
let vivo = conHang.filter(p => p.brand === 'VIVO').length;

console.log('REDMI (9) + POCO (2) =', redmiPoco); // 11!
console.log('168 - 11 =', 168 - redmiPoco); // 157!
console.log('OPPO (14) + REALME (7) =', oppoRealme); // 21
console.log('168 - 19 =', 168 - 19); // 149!

