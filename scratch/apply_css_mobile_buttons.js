const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// 1. Desktop rule
const targetDesktop = "@media (min-width: 1024px) {";
const replacementDesktop = `@media (min-width: 1024px) {
      .btn-sales-notepad-mobile {
        display: none !important;
      }`;

if (!css.includes('.btn-sales-notepad-mobile')) {
  css = css.replace(targetDesktop, replacementDesktop);
}

// 2. Locate #btnSalesToggleHide in media query (max-width: 767px)
// We know it is around line 7264
const targetMarker = "gap: 6px !important;\r\n        }\r\n        #btnSalesToggleHide {";
const targetMarkerLF = "gap: 6px !important;\n        }\n        #btnSalesToggleHide {";

let pos = css.indexOf(targetMarker);
let isLF = false;
if (pos === -1) {
  pos = css.indexOf(targetMarkerLF);
  isLF = true;
}

if (pos === -1) {
  console.error("targetMarker not found");
  process.exit(1);
}

const hideStart = pos + (isLF ? targetMarkerLF.length - "#btnSalesToggleHide {".length : targetMarker.length - "#btnSalesToggleHide {".length);
const hideEnd = css.indexOf("}\r\n        .btn-create-ticket", hideStart);
let hideEndActual = hideEnd;
if (hideEnd === -1) {
  hideEndActual = css.indexOf("}\n        .btn-create-ticket", hideStart);
}

if (hideEndActual === -1) {
  console.error("hideEndActual not found");
  process.exit(1);
}
hideEndActual += 1; // include closing bracket '}'

const replacementMobileRule = `/* 1. Ẩn icon đám mây trên Mobile tab Bán Hàng */
        #tab-banhang #btnSyncAllCloud {
          display: none !important;
        }
        /* Thay vào đó là icon sổ tay ghi chú */
        #tab-banhang #btnSalesNotePadMobile {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 44px !important;
          min-width: 44px !important;
          height: 38px !important;
          padding: 0 !important;
          background: #0f172a !important;
          border: 1.5px solid #f59e0b !important;
          border-radius: 9px !important;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35) !important;
          cursor: pointer !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }
        /* 2. Ẩn nút Ẩn/Hiện trên Mobile tab Bán Hàng */
        #tab-banhang #btnSalesToggleHide {
          display: none !important;
        }
        /* Thay vào đó là logo BIDV để chuyển khoản */
        #tab-banhang .btn-bank-bidv {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 44px !important;
          min-width: 44px !important;
          height: 38px !important;
          padding: 0 !important;
          background: transparent !important;
          border: 1.5px solid #059669 !important;
          border-radius: 9px !important;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4) !important;
          cursor: pointer !important;
          overflow: hidden !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }
        #tab-banhang .btn-bank-bidv img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 7px !important;
        }`;

css = css.substring(0, hideStart) + replacementMobileRule + css.substring(hideEndActual);

// 3. Update bottom BIDV mobile rule:
const targetOldBidv = "/* ẨN NÚT BIDV BANK TRÊN GIAO DIỆN MOBILE (< 768px và < 900px) */";
const posBidv = css.indexOf(targetOldBidv);
if (posBidv !== -1) {
  const endBidv = css.indexOf("}", css.indexOf("@media (max-width: 768px)", posBidv)) + 1;
  const replacementBidv = `/* ẨN NÚT BIDV BANK TRÊN GIAO DIỆN MOBILE (< 768px) CHO CÁC TAB KHÁC */
@media (max-width: 768px) {
  .btn-bank-bidv-sw {
    display: none !important;
  }
  :not(#tab-banhang) > * > .btn-bank-bidv,
  :not(#tab-banhang) .btn-bank-bidv {
    display: none !important;
  }
}`;
  css = css.substring(0, posBidv) + replacementBidv + css.substring(endBidv);
  console.log("Updated bottom BIDV mobile rule");
}

fs.writeFileSync('css/style.css', css, 'utf8');
console.log("css/style.css updated cleanly!");
