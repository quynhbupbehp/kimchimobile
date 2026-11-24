const fs = require('fs');

function cleanLeadingBrand(displayName, brand) {
  let name = displayName;
  name = name.replace(/^(?:SAMSUNG|OPPO|REALME|XIAOMI|REDMI|POCO|VIVO|HONOR|IPHONE|IPAD|APPLE)\s*[-–—:]*\s*/i, '');
  if (brand && brand !== 'MÁY NGOÀI' && brand !== '❤️❤️❤️') {
    const bReg = new RegExp('^' + brand.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-–—:]*\\s*', 'i');
    name = name.replace(bReg, '');
  }
  return name.trim();
}

console.log('Test cleanLeadingBrand:');
console.log('A03S with brand SAMSUNG =>', cleanLeadingBrand('A03S', 'SAMSUNG'));
console.log('SAMSUNG A03S with brand SAMSUNG =>', cleanLeadingBrand('SAMSUNG A03S', 'SAMSUNG'));
console.log('A1 with brand REDMI =>', cleanLeadingBrand('A1', 'REDMI'));
console.log('A5X 5G with brand OPPO =>', cleanLeadingBrand('A5X 5G', 'OPPO'));
console.log('7 PLUS with brand IPHONE =>', cleanLeadingBrand('7 PLUS', 'IPHONE'));
console.log('IPHONE 7 PLUS with brand IPHONE =>', cleanLeadingBrand('IPHONE 7 PLUS', 'IPHONE'));

