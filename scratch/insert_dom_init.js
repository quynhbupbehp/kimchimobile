const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const target = `window.addEventListener('DOMContentLoaded', () => {
  initAllTabsToVietnamToday();`;

const replacement = `window.addEventListener('DOMContentLoaded', () => {
  initAllTabsToVietnamToday();
  if (typeof initReportMonthYearPickers === 'function') initReportMonthYearPickers();`;

if (js.includes(target.replace(/\n/g, '\r\n'))) {
  js = js.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Added initReportMonthYearPickers to DOMContentLoaded (CRLF)');
} else if (js.includes(target)) {
  js = js.replace(target, replacement);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Added initReportMonthYearPickers to DOMContentLoaded (LF)');
} else {
  console.log('Target not found');
}

