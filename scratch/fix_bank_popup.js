const fs = require('fs');

// 1. Cập nhật js/main.js: openKimchiBankModal và closeKimchiBankModal
let js = fs.readFileSync('js/main.js', 'utf8');

const oldBlock = `function openKimchiBankModal() {
  const modal = document.getElementById('kimchiBankModal');
  const frame = document.getElementById('kimchiBankFrame');
  if (modal && frame) {
    frame.src = 'https://kimchimobile-bank.vercel.app/?v=' + Date.now();
    modal.style.display = 'flex';
  }
}
window.openKimchiBankModal = openKimchiBankModal;

function closeKimchiBankModal() {
  const modal = document.getElementById('kimchiBankModal');
  if (modal) {
    modal.style.display = 'none';
  }
}`;

const newBlock = `function openKimchiBankModal() {
  const modal = document.getElementById('kimchiBankModal');
  const frame = document.getElementById('kimchiBankFrame');
  if (modal) {
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');
    modal.style.zIndex = '99999999';
    if (frame) {
      if (!frame.src || frame.src === '' || frame.src.indexOf('kimchimobile-bank') === -1) {
        frame.src = 'https://kimchimobile-bank.vercel.app/?v=' + Date.now();
      }
    }
  }
}
window.openKimchiBankModal = openKimchiBankModal;

function closeKimchiBankModal() {
  const modal = document.getElementById('kimchiBankModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
  }
}`;

let normJs = js.replace(/\r\n/g, '\n');
let normOld = oldBlock.replace(/\r\n/g, '\n');
let normNew = newBlock.replace(/\r\n/g, '\n');

if (normJs.includes(normOld)) {
  let updated = normJs.replace(normOld, normNew);
  if (js.includes('\r\n')) updated = updated.replace(/\n/g, '\r\n');
  fs.writeFileSync('js/main.js', updated, 'utf8');
  console.log('SUCCESS: Updated openKimchiBankModal & closeKimchiBankModal');
} else {
  console.log('FAILED: oldBlock not found in js/main.js');
}

// 2. Thêm CSS cho #kimchiBankModal trên mobile để giao diện full tràn đẹp mắt
let css = fs.readFileSync('css/style.css', 'utf8');
const modalCss = `
/* POPUP KIMCHI BANK TRÊN MOBILE */
#kimchiBankModal.active {
  display: flex !important;
  z-index: 99999999 !important;
  position: fixed !important;
  inset: 0 !important;
  padding: 4px !important;
  align-items: center !important;
  justify-content: center !important;
}
#kimchiBankModal.active > div {
  width: 98vw !important;
  max-width: 98vw !important;
  height: 94vh !important;
  max-height: 94vh !important;
  margin: 0 !important;
  padding: 0 !important;
}
`;

css += '\n' + modalCss;
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('SUCCESS: Added modalCss to css/style.css');

