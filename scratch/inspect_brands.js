const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

let brandCounts = {};
conHang.forEach(p => {
  brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
});
console.log('Brand counts in còn hàng:', brandCounts);

// 168 - 149 = 19
// 168 - 157 = 11
// Nếu trên web là 149 và mobile là 157:
console.log('Total:', conHang.length);

