const fs = require('fs');

let code = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(code);
let phones = window.SEED_PHONES_DATA;
let sold = window.SEED_SOLD_DATA;

console.log('Seed phones:', phones.length);
console.log('Seed sold:', sold.length);

// 1. Phân loại theo status
let conHang = phones.filter(p => p.status === 'Còn hàng');
let chuaXuLy = phones.filter(p => p.status === 'Chưa Xử Lý');
console.log('Còn hàng:', conHang.length, '| Chưa xử lý:', chuaXuLy.length);

// 2. Tìm các máy trong sold có trùng imei hoặc id với phones
let soldIds = new Set(sold.map(s => String(s.id)));
let soldImeis = new Set(sold.filter(s => s.imei && s.imei !== '....').map(s => String(s.imei).trim().toLowerCase()));

let soldInConHang = conHang.filter(p => {
  let pImei = String(p.imei || '').trim().toLowerCase();
  return soldIds.has(String(p.id)) || (pImei && soldImeis.has(pImei));
});
console.log('Máy còn hàng có trong sold list:', soldInConHang.length);
soldInConHang.forEach(p => console.log(p.id, p.name, p.imei));

