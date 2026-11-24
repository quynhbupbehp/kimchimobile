const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

let samsung17 = conHang.filter(p => p.brand === 'SAMSUNG').length; // 17
let poco2 = conHang.filter(p => p.brand === 'POCO').length; // 2
console.log('SAMSUNG (17) + POCO (2) =', samsung17 + poco2); // 19!
console.log('168 - 19 =', 168 - (samsung17 + poco2)); // 149!

