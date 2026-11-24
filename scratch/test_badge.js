const fs = require('fs');
const content = fs.readFileSync('js/main.js', 'utf8');

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const fnDetect = content.slice(content.indexOf('function detectPhoneBrand'), content.indexOf('window.detectPhoneBrand = detectPhoneBrand;'));
const fnBadge = content.slice(content.indexOf('function getPhoneBrandBadgeHtml'), content.indexOf('window.getPhoneBrandBadgeHtml = getPhoneBrandBadgeHtml;'));

eval(fnDetect);
eval(fnBadge);

console.log('Result for IPHONE, 11 PRO MAX:');
console.log(getPhoneBrandBadgeHtml('IPHONE', '11 PRO MAX'));

