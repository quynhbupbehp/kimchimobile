const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBtn = `<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"
              title="Quản lý link web phần mềm">LINK WEB</button>`;
const newBtn = `<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"
              title="Quản lý link web phần mềm">GHI CHÚ</button>`;

let normHtml = html.replace(/\r\n/g, '\n');
let normOld = oldBtn.replace(/\r\n/g, '\n');
let normNew = newBtn.replace(/\r\n/g, '\n');

if (normHtml.includes(normOld)) {
  normHtml = normHtml.replace(normOld, normNew);
  if (html.includes('\r\n')) normHtml = normHtml.replace(/\n/g, '\r\n');
  fs.writeFileSync('index.html', normHtml, 'utf8');
  console.log('SUCCESS: Replaced LINK WEB with GHI CHÚ in index.html');
} else {
  console.log('FAILED: oldBtn not found');
}

