const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Cập nhật openSwNotesModal và closeSwNotesModal
const oldSwNotes = `function openSwNotesModal() {
  const modal = document.getElementById('swNotesModal');
  if (!modal) return;
  resetSwNoteForm();
  const form = document.getElementById('swLinkForm');
  if (form) form.style.display = 'none';
  const searchInput = document.getElementById('swLinkSearchInput');
  if (searchInput) searchInput.value = '';
  renderSwNotesList();
  modal.style.display = 'flex';
}
window.openSwNotesModal = openSwNotesModal;
window.openSwLinksModal = openSwNotesModal;

function closeSwNotesModal() {
  const modal = document.getElementById('swNotesModal');
  if (modal) modal.style.display = 'none';
  resetSwNoteForm();
  const form = document.getElementById('swLinkForm');
  if (form) form.style.display = 'none';
}`;

const newSwNotes = `function openSwNotesModal() {
  const modal = document.getElementById('swNotesModal');
  if (!modal) return;
  resetSwNoteForm();
  const form = document.getElementById('swLinkForm');
  if (form) form.style.display = 'none';
  const searchInput = document.getElementById('swLinkSearchInput');
  if (searchInput) searchInput.value = '';
  renderSwNotesList();
  modal.classList.add('active');
  modal.style.setProperty('display', 'flex', 'important');
  modal.style.zIndex = '10000000';
}
window.openSwNotesModal = openSwNotesModal;
window.openSwLinksModal = openSwNotesModal;

function closeSwNotesModal() {
  const modal = document.getElementById('swNotesModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
  }
  resetSwNoteForm();
  const form = document.getElementById('swLinkForm');
  if (form) form.style.display = 'none';
}`;

// 2. Cập nhật viewSoftwareTicket để hiển thị popup chắc chắn và hỗ trợ 2 lần chạm
const oldViewSw = `    viewModal.classList.add('active');
    viewModal.style.display = 'flex';
  } else {
    alert(\`CHI TIẾT ĐƠN PHẦN MỀM:\\n- Khách hàng: \${item.customer}\\n- Thiết bị: \${item.device}\\n- Báo giá: \${formatPriceStr(item.price)}\\n- Phí dịch vụ: \${formatPriceStr(item.cost)}\\n- Lãi: \${formatPriceStr(item.profit)}\\n- Thời gian: \${item.dayMonth}-\${item.year || '2026'} lúc \${item.time}\\n- Trạng thái: \${item.paymentStatus}\`);
  }`;

const newViewSw = `    viewModal.classList.add('active');
    viewModal.style.setProperty('display', 'flex', 'important');
    viewModal.style.zIndex = '10000000';
  } else {
    alert(\`CHI TIẾT ĐƠN PHẦN MỀM:\\n- Khách hàng: \${item.customer}\\n- Thiết bị: \${item.device}\\n- Báo giá: \${formatPriceStr(item.price)}\\n- Phí dịch vụ: \${formatPriceStr(item.cost)}\\n- Lãi: \${formatPriceStr(item.profit)}\\n- Thời gian: \${item.dayMonth}-\${item.year || '2026'} lúc \${item.time}\\n- Trạng thái: \${item.paymentStatus}\`);
  }`;

// 3. Cho phép nháy đúp hoặc 2 lần chạm trên cả dòng <tr> của bảng phần mềm thay vì chỉ ô tên khách
const oldTr = `    return \`
          <tr>
            <td class="sw-col-check" style="text-align: center;">`;

const newTr = `    return \`
          <tr ondblclick="viewSoftwareTicket('\${safeId}')" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<450){ viewSoftwareTicket('\${safeId}'); } this._lastTap=now;" style="cursor: pointer;" title="Nháy 2 lần để xem chi tiết đơn">
            <td class="sw-col-check" style="text-align: center;">`;

let normJs = js.replace(/\r\n/g, '\n');
let normOldSwNotes = oldSwNotes.replace(/\r\n/g, '\n');
let normNewSwNotes = newSwNotes.replace(/\r\n/g, '\n');
let normOldViewSw = oldViewSw.replace(/\r\n/g, '\n');
let normNewViewSw = newViewSw.replace(/\r\n/g, '\n');
let normOldTr = oldTr.replace(/\r\n/g, '\n');
let normNewTr = newTr.replace(/\r\n/g, '\n');

let count = 0;
if (normJs.includes(normOldSwNotes)) {
  normJs = normJs.replace(normOldSwNotes, normNewSwNotes);
  count++;
} else {
  console.log('FAILED: oldSwNotes not found');
}

if (normJs.includes(normOldViewSw)) {
  normJs = normJs.replace(normOldViewSw, normNewViewSw);
  count++;
} else {
  console.log('FAILED: oldViewSw not found');
}

if (normJs.includes(normOldTr)) {
  normJs = normJs.replace(normOldTr, normNewTr);
  count++;
} else {
  console.log('FAILED: oldTr not found');
}

if (count === 3) {
  if (js.includes('\r\n')) normJs = normJs.replace(/\n/g, '\r\n');
  fs.writeFileSync('js/main.js', normJs, 'utf8');
  console.log('SUCCESS: Updated js/main.js for software notes and double tap view ticket');
}

