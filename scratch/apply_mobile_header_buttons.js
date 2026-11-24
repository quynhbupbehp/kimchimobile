const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetTag = 'id="btnSyncAllCloud"';
const pos = html.indexOf(targetTag);
console.log('Pos of targetTag:', pos);

// Find beginning of button
const btnStart = html.lastIndexOf('<button', pos);
const btnEnd = html.indexOf('</button>', pos) + '</button>'.length;

const originalBtn = html.substring(btnStart, btnEnd);
console.log('Found originalBtn:', originalBtn);

const replacementBtn = `<button type="button" id="btnSalesNotePadMobile" class="btn-sales-notepad-mobile"
              title="Bấm để mở Sổ Tay Ghi Chú Bán Hàng"
              onclick="openSalesNotePadModal()"
              style="display: none;">
              <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: #f59e0b; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; display: block;">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            ` + originalBtn;

html = html.substring(0, btnStart) + replacementBtn + html.substring(btnEnd);
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully!');

// Update css/style.css
let css = fs.readFileSync('css/style.css', 'utf8');

const targetDesktop = "@media (min-width: 1024px) {";
const replacementDesktop = `@media (min-width: 1024px) {
      .btn-sales-notepad-mobile {
        display: none !important;
      }`;

if (!css.includes('.btn-sales-notepad-mobile')) {
  css = css.replace(targetDesktop, replacementDesktop);
}

const targetActionsMobile = '#btnSalesToggleHide {';
const posHide = css.indexOf(targetActionsMobile);
console.log('Pos of targetActionsMobile:', posHide);

const endHide = css.indexOf('}', posHide) + 1;
const originalHideRule = css.substring(posHide, endHide);

const replacementMobileRules = `/* 1. Ẩn icon đám mây trên Mobile tab Bán Hàng */
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

css = css.substring(0, posHide) + replacementMobileRules + css.substring(endHide);
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('style.css updated successfully!');

