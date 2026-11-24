const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

// Kiểm tra các máy có giá = 0 hoặc priceIn = 0 hoặc giá rỗng
let zeroPrice = conHang.filter(p => !p.price || p.price === '0' || p.price === 0);
console.log('Zero price in còn hàng:', zeroPrice.length);
zeroPrice.forEach(p => console.log(p.name, p.brand, p.imei, p.price));

// Kiểm tra các máy chưa xử lý có giá = 0
let chuaXuLy = phones.filter(p => p.status === 'Chưa Xử Lý');
let zeroPriceCXL = chuaXuLy.filter(p => !p.price || p.price === '0' || p.price === 0);
console.log('Zero price in chưa xử lý:', zeroPriceCXL.length);

