const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove "Lưu trữ mọi thông tin ghi chú, nhắc việc, tài khoản hoặc liên hệ"
const targetSubtitle1 = `<div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">\r\n              Lưu trữ mọi thông tin ghi chú, nhắc việc, tài khoản hoặc liên hệ\r\n            </div>`;
const targetSubtitle2 = `<div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">\n              Lưu trữ mọi thông tin ghi chú, nhắc việc, tài khoản hoặc liên hệ\n            </div>`;

if (html.includes(targetSubtitle1)) {
  html = html.replace(targetSubtitle1, '');
  console.log('Removed subtitle CRLF');
} else if (html.includes(targetSubtitle2)) {
  html = html.replace(targetSubtitle2, '');
  console.log('Removed subtitle LF');
} else {
  console.log('Subtitle not matched directly, using regex replace');
  html = html.replace(/<div style="font-size: 0\.8rem; color: #94a3b8; font-weight: 600;">\s*Lưu trữ mọi thông tin ghi chú, nhắc việc, tài khoản hoặc liên hệ\s*<\/div>/g, '');
}

// 2. Change "🗑️ Xóa Trắng" to "🗑️ Xóa"
if (html.includes('🗑️ Xóa Trắng')) {
  html = html.replace('🗑️ Xóa Trắng', '🗑️ Xóa');
  console.log('Replaced 🗑️ Xóa Trắng -> 🗑️ Xóa');
} else {
  console.log('🗑️ Xóa Trắng not found');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully!');

