const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldTarget = `          <div class="sw-toolbar"
            style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; margin-bottom: 14px;">
            <!-- Cột 1 (Trái): DANH SÁCH PHẦN MỀM (NỀN HỒNG) + Ô CHỌN KHÁCH HÀNG -->
            <div style="display: flex; align-items: center; justify-content: flex-start; gap: 10px;">`;

const newTarget = `          <div class="sw-toolbar"
            style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; width: 100%; flex-wrap: nowrap;">
            <!-- Cột 1 (Trái): DANH SÁCH PHẦN MỀM (NỀN HỒNG) + Ô CHỌN KHÁCH HÀNG -->
            <div style="display: flex; align-items: center; justify-content: flex-start; gap: 10px; flex-shrink: 0;">`;

const oldMiddle = `            <!-- Cột 2 (Giữa): BỘ LỌC XEM THEO THỐNG NHẤT (CHUẨN MẪU MỚI: [Ngày ▼] [<] 24/10/2026 [>] [📅]) - CĂN CHÍNH GIỮA TUYỆT ĐỐI -->
            <div style="display: flex; align-items: center; justify-content: center;">`;

const newMiddle = `            <!-- Cột 2 (Giữa): BỘ LỌC XEM THEO THỐNG NHẤT (NẰM CHÍNH GIỮA 2 Ô: Ô KHÁCH HÀNG VÀ Ô TÌM KIẾM) -->
            <div style="display: flex; align-items: center; justify-content: center; flex: 1 1 auto; min-width: 0;">`;

const oldRight = `            <!-- Cột 3 (Phải): Ô TÌM KIẾM + BIDV + NÚT ẨN + NÚT TẠO ĐƠN MỚI -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">`;

const newRight = `            <!-- Cột 3 (Phải): Ô TÌM KIẾM + BIDV + NÚT ẨN + NÚT TẠO ĐƠN MỚI -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-shrink: 0;">`;

let modified = false;

if (html.includes(oldTarget)) {
  html = html.replace(oldTarget, newTarget);
  html = html.replace(oldMiddle, newMiddle);
  html = html.replace(oldRight, newRight);
  modified = true;
  console.log('Updated in LF mode');
} else if (html.includes(oldTarget.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldTarget.replace(/\n/g, '\r\n'), newTarget.replace(/\n/g, '\r\n'));
  html = html.replace(oldMiddle.replace(/\n/g, '\r\n'), newMiddle.replace(/\n/g, '\r\n'));
  html = html.replace(oldRight.replace(/\n/g, '\r\n'), newRight.replace(/\n/g, '\r\n'));
  modified = true;
  console.log('Updated in CRLF mode');
} else {
  console.log('Targets not found');
}

if (modified) {
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html updated successfully!');
}

