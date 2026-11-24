const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let conHang = phones.filter(p => p.status === 'Còn hàng');

console.log('--- Kiểu dáng / condition ---');
let conditions = {};
conHang.forEach(p => {
  conditions[p.condition] = (conditions[p.condition] || 0) + 1;
});
console.log(conditions);

