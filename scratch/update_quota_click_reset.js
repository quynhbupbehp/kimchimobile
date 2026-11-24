const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = '<div id="firestoreQuotaTracker" style="display: inline-flex;';
const replacement = '<div id="firestoreQuotaTracker" onclick="if(confirm(\'Bạn có muốn đặt lại bộ đếm lượt Đọc / Ghi hôm nay về 0 không?\')){resetFsDailyUsage();}" title="Click để đặt lại bộ đếm Đọc / Ghi về 0" style="cursor: pointer; display: inline-flex;';

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated firestoreQuotaTracker with click to reset');
} else {
  console.log('Target not found in index.html');
}

