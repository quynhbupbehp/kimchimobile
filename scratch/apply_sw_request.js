const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Đổi mục GHI CHÚ thành LINK WEB trong cụm nút shortcut
const oldBtn = `<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"
              title="Quản lý link web phần mềm">GHI CHÚ</button>`;
const newBtn = `<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"
              title="Quản lý link web phần mềm">LINK WEB</button>`;

let normHtml = html.replace(/\r\n/g, '\n');
let normOld = oldBtn.replace(/\r\n/g, '\n');
let normNew = newBtn.replace(/\r\n/g, '\n');

if (normHtml.includes(normOld)) {
  normHtml = normHtml.replace(normOld, normNew);
  console.log('SUCCESS: Replaced GHI CHÚ with LINK WEB');
} else {
  console.log('FAILED: oldBtn not found');
}

// 2. Chuyển nút TẠO ĐƠN MỚI sang nền màu vàng (bỏ inline style màu hồng)
const oldCreateBtn = `<button type="button" class="sw-btn-create-new" onclick="openSoftwareModal()"
                style="background: linear-gradient(180deg, #ec4899 0%, #db2777 100%) !important; border: 1px solid #f472b6 !important; box-shadow: 0 3px 12px rgba(236, 72, 153, 0.45) !important;">`;

const newCreateBtn = `<button type="button" class="sw-btn-create-new" onclick="openSoftwareModal()"
                style="background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important; border: 1px solid #facc15 !important; box-shadow: 0 3px 12px rgba(245, 158, 11, 0.45) !important;">`;

let normOldCreate = oldCreateBtn.replace(/\r\n/g, '\n');
let normNewCreate = newCreateBtn.replace(/\r\n/g, '\n');

if (normHtml.includes(normOldCreate)) {
  normHtml = normHtml.replace(normOldCreate, normNewCreate);
  console.log('SUCCESS: Changed TẠO ĐƠN MỚI to yellow background in index.html');
} else {
  console.log('FAILED: oldCreateBtn not found');
}

if (html.includes('\r\n')) normHtml = normHtml.replace(/\n/g, '\r\n');
fs.writeFileSync('index.html', normHtml, 'utf8');

// 3. Đảm bảo css/style.css cho .sw-btn-create-new trên cả web và mobile đồng bộ màu vàng chuẩn
let css = fs.readFileSync('css/style.css', 'utf8');
const oldCssCreate = `.sw-btn-create-new {
      background: linear-gradient(180deg, #ec4899 0%, #db2777 100%) !important;
      border: 1px solid #f472b6 !important;`;
const newCssCreate = `.sw-btn-create-new {
      background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important;
      border: 1px solid #facc15 !important;`;

let normCss = css.replace(/\r\n/g, '\n');
if (normCss.includes(oldCssCreate)) {
  normCss = normCss.replace(oldCssCreate, newCssCreate);
  if (css.includes('\r\n')) normCss = normCss.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/style.css', normCss, 'utf8');
  console.log('SUCCESS: Updated default CSS for .sw-btn-create-new');
}

