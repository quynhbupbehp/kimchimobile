const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
let normJs = js.replace(/\r\n/g, '\n');

// 1. Thêm helper format pin
const pinHelper = `// Định dạng pin gọn gàng trên mobile
function formatMobilePinDisplay(rawPin) {
  if (!rawPin && rawPin !== 0) return '';
  let str = String(rawPin).trim();
  if (!str) return '';
  let mahMatch = str.match(/([\\d.,]+)\\s*mAh/i);
  if (mahMatch) {
    let cleanNum = mahMatch[1].replace(/[.,]/g, '');
    let num = parseFloat(cleanNum);
    if (!isNaN(num) && num >= 1000) {
      let val = (num / 1000).toString();
      val = parseFloat(val).toString();
      return val + 'K';
    }
  }
  if (str.includes('%')) {
    return str.replace(/%/g, '').replace(/\\s+/g, ' ').trim();
  }
  return str;
}

`;

const targetFunc = 'function renderPhoneGrid() {';
if (!normJs.includes('function formatMobilePinDisplay(')) {
  normJs = normJs.replace(targetFunc, pinHelper + targetFunc);
}

// 2. Format pin khi !isDesktop
const targetPinCall = `      let isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
      let displayName = pName;`;

const newPinCall = `      let isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
      if (!isDesktop) {
        displayPinPct = formatMobilePinDisplay(displayPinPct);
      }
      let displayName = pName;`;

if (normJs.includes(targetPinCall)) {
  normJs = normJs.replace(targetPinCall, newPinCall);
}

const finalJs = isCRLF ? normJs.replace(/\n/g, '\r\n') : normJs;
fs.writeFileSync('js/main.js', finalJs, 'utf8');
console.log('SUCCESS: Cleanly injected formatMobilePinDisplay into js/main.js');

