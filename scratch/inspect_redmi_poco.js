const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

let redmiPoco = conHang.filter(p => p.brand === 'REDMI' || p.brand === 'POCO');
console.log('REDMI + POCO count:', redmiPoco.length);
redmiPoco.forEach(p => console.log(p.brand, p.name, p.imei));

