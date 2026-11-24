const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Thay đổi khởi tạo reportSelectedMonth theo tháng/năm hiện tại
const oldInit = `let reportViewMode = 'month';
let reportSelectedMonth = '10/2026';
let reportFilterCustom = null;`;

const newInit = `let reportViewMode = 'month';
const _dNow = new Date();
let reportSelectedMonth = \`\${String(_dNow.getMonth() + 1).padStart(2, '0')}/\${_dNow.getFullYear()}\`;
let reportFilterCustom = null;

function changeReportMonthYear() {
  const selMonth = document.getElementById('repSelectMonth');
  const selYear = document.getElementById('repSelectYear');
  const now = new Date();
  const mm = selMonth ? selMonth.value : String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = selYear ? selYear.value : String(now.getFullYear());
  reportSelectedMonth = \`\${mm}/\${yyyy}\`;
  setReportMode('month');
}
window.changeReportMonthYear = changeReportMonthYear;

function initReportMonthYearPickers() {
  const now = new Date();
  const curMm = String(now.getMonth() + 1).padStart(2, '0');
  const curYyyy = String(now.getFullYear());

  const selMonth = document.getElementById('repSelectMonth');
  const selYear = document.getElementById('repSelectYear');

  if (selMonth) {
    selMonth.value = curMm;
  }
  if (selYear) {
    // Đảm bảo option của năm hiện tại có mặt
    if (!Array.from(selYear.options).some(o => o.value === curYyyy)) {
      const opt = document.createElement('option');
      opt.value = curYyyy;
      opt.textContent = curYyyy;
      selYear.appendChild(opt);
    }
    selYear.value = curYyyy;
  }
  reportSelectedMonth = \`\${curMm}/\${curYyyy}\`;
}
window.initReportMonthYearPickers = initReportMonthYearPickers;`;

if (js.includes(oldInit.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldInit.replace(/\n/g, '\r\n'), newInit.replace(/\n/g, '\r\n'));
  console.log('Replaced init (CRLF)');
} else if (js.includes(oldInit)) {
  js = js.replace(oldInit, newInit);
  console.log('Replaced init (LF)');
} else {
  console.log('oldInit not found');
}

// 2. Cập nhật renderFinancialReports
const oldRender = `  // Lấy tháng đang chọn từ menu sổ xuống
  const selBox = document.getElementById('repSelectMonth');
  if (selBox && selBox.value) {
    reportSelectedMonth = selBox.value;
  }
  let [selMm, selYyyy] = (reportSelectedMonth || \`\${mm}/\${yyyy}\`).split('/');
  if (!selMm || !selYyyy) {
    selMm = mm;
    selYyyy = yyyy;
  }`;

const newRender = `  // Lấy tháng và năm đang chọn từ 2 menu sổ xuống
  const selMonth = document.getElementById('repSelectMonth');
  const selYear = document.getElementById('repSelectYear');
  if (selMonth && selYear && selMonth.value && selYear.value) {
    reportSelectedMonth = \`\${selMonth.value}/\${selYear.value}\`;
  }
  let [selMm, selYyyy] = (reportSelectedMonth || \`\${mm}/\${yyyy}\`).split('/');
  if (!selMm || !selYyyy) {
    selMm = mm;
    selYyyy = yyyy;
  }
  // Đồng bộ lại giá trị được chọn trên dropdown nếu chưa khớp
  if (selMonth && selMonth.value !== selMm) selMonth.value = selMm;
  if (selYear && selYear.value !== selYyyy) selYear.value = selYyyy;`;

if (js.includes(oldRender.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldRender.replace(/\n/g, '\r\n'), newRender.replace(/\n/g, '\r\n'));
  console.log('Replaced render (CRLF)');
} else if (js.includes(oldRender)) {
  js = js.replace(oldRender, newRender);
  console.log('Replaced render (LF)');
} else {
  console.log('oldRender not found');
}

// 3. Tự động gọi initReportMonthYearPickers khi switch tab hoặc khởi động
const switchTarget = `function switchMainTab(tabId) {`;
const switchCall = `function switchMainTab(tabId) {
  if (tabId === 'hethong' || tabId === 'baocao') {
    if (typeof initReportMonthYearPickers === 'function') initReportMonthYearPickers();
  }`;

if (js.includes(switchTarget.replace(/\n/g, '\r\n'))) {
  js = js.replace(switchTarget.replace(/\n/g, '\r\n'), switchCall.replace(/\n/g, '\r\n'));
  console.log('Updated switchMainTab (CRLF)');
} else if (js.includes(switchTarget)) {
  js = js.replace(switchTarget, switchCall);
  console.log('Updated switchMainTab (LF)');
} else {
  console.log('switchTarget not found');
}

fs.writeFileSync('js/main.js', js, 'utf8');
console.log('main.js updated successfully!');

