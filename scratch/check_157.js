const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

console.log('Tổng máy Còn hàng trong seed:', conHang.length); // 168

// Trên Web: 149 máy còn hàng => đã có 168 - 149 = 19 máy được bán hoặc loại trừ!
// Trên Mobile: 157 máy => 168 - 157 = 11 máy được loại trừ!
console.log('168 - 149 =', 168 - 149);
console.log('168 - 157 =', 168 - 157);

