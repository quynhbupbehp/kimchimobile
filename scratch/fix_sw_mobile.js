const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const targetOld = `        /* Hàng 5 - Phải: Tạo Đơn Mới (Vàng) */
        #tab-phanmem .sw-toolbar > div:last-child {
          grid-column: 2 / 3 !important;
          grid-row: 2 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          margin: 0 !important;
          width: 100% !important;
        }
        #tab-phanmem .sw-btn-pay,
        #tab-phanmem .sw-eye-toggle-btn {
          display: none !important;
        }`;

const targetNew = `        /* Hàng 5 - Phải: Tạo Đơn Mới (Hồng/Vàng) - Ẩn ô tìm kiếm và các nút thừa trên mobile */
        #tab-phanmem .sw-toolbar > div:last-child {
          grid-column: 2 / 3 !important;
          grid-row: 2 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          margin: 0 !important;
          width: 100% !important;
        }
        #tab-phanmem #swSearchBoxWrapper,
        #tab-phanmem .btn-bank-bidv-sw,
        #tab-phanmem .sw-btn-pay,
        #tab-phanmem .sw-eye-toggle-btn,
        #btnSwHide {
          display: none !important;
        }`;

let normCss = css.replace(/\r\n/g, '\n');
let normTargetOld = targetOld.replace(/\r\n/g, '\n');
let normTargetNew = targetNew.replace(/\r\n/g, '\n');

if (normCss.includes(normTargetOld)) {
  normCss = normCss.replace(normTargetOld, normTargetNew);
  if (css.includes('\r\n')) normCss = normCss.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/style.css', normCss, 'utf8');
  console.log('SUCCESS: Hidden search box on mobile for tab phanmem');
} else {
  console.log('FAILED: targetOld not found in css/style.css');
}

