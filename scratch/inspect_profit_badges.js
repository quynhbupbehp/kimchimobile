const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find all profit badges across tabs:
// Tab Bán Hàng: salesProfitBadge / salesProfitVal / salesMonthProfitVal
// Tab Phần Mềm: swProfitBadge / ...
// Tab Sửa Chữa: repairProfitBadge / ...
// Tab Bán Máy: phoneProfitBadge / ...
// Tab Bán Gà: bangaProfitBadge / ...
// Tab Bảo Hành: soldPhoneProfitBadge / ...

let lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('ProfitBadge') || l.includes('Lãi') && l.includes('Tháng') && l.includes('Ngày') || l.includes('LÃI NGÀY')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

