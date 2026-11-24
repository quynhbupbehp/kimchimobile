const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

const targetSalesCloudBtn = `<button type="button" onclick="manualSyncAllToFirestore()" id="btnSyncAllCloud"
              title="Đồng bộ toàn bộ dữ liệu tất cả các tab lên Cloud Firebase"
              style="width: 32px; height: 32px; padding: 0; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); border: 1.5px solid #38bdf8; border-radius: 8px; color: #ffffff; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4); flex-shrink: 0; transition: transform 0.1s;">
              ☁️
            </button>`;

const replacementWithNotepad = `<button type="button" id="btnSalesNotePadMobile" class="btn-sales-notepad-mobile"
              title="Bấm để mở Sổ Tay Ghi Chú Bán Hàng"
              onclick="openSalesNotePadModal()"
              style="display: none;">
              <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: #f59e0b; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; display: block;">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button type="button" onclick="manualSyncAllToFirestore()" id="btnSyncAllCloud"
              title="Đồng bộ toàn bộ dữ liệu tất cả các tab lên Cloud Firebase"
              style="width: 32px; height: 32px; padding: 0; background: linear-gradient(180deg, #0284c7 0%, #0369a1 100%); border: 1.5px solid #38bdf8; border-radius: 8px; color: #ffffff; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.4); flex-shrink: 0; transition: transform 0.1s;">
              ☁️
            </button>`;

// Check CRLF or LF
if (html.includes(targetSalesCloudBtn)) {
  html = html.replace(targetSalesCloudBtn, replacementWithNotepad);
  console.log("Replaced in index.html (CRLF)");
} else {
  const targetLF = targetSalesCloudBtn.replace(/\r\n/g, '\n');
  const replLF = replacementWithNotepad.replace(/\r\n/g, '\n');
  if (html.includes(targetLF)) {
    html = html.replace(targetLF, replLF);
    console.log("Replaced in index.html (LF)");
  } else {
    console.error("Target sales cloud btn not found in index.html");
    process.exit(1);
  }
}
fs.writeFileSync('index.html', html, 'utf8');

// 2. Update css/style.css
let css = fs.readFileSync('css/style.css', 'utf8');

// Check desktop min-width: 1024px to ensure .btn-sales-notepad-mobile is display: none !important
const targetDesktopQuery = "@media (min-width: 1024px) {";
const replacementDesktopQuery = `@media (min-width: 1024px) {
      .btn-sales-notepad-mobile {
        display: none !important;
      }`;

if (css.includes(targetDesktopQuery)) {
  css = css.replace(targetDesktopQuery, replacementDesktopQuery);
  console.log("Updated desktop query to hide mobile notepad button");
}

// In @media (max-width: 767px), update actions row styling:
// Hide cloud icon: #btnSyncAllCloud { display: none !important; }
// Show notepad button: #btnSalesNotePadMobile { display: inline-flex !important; ... }
// Hide hide/show button: #btnSalesToggleHide { display: none !important; }
// Show BIDV button on mobile tab sales: #tab-banhang .btn-bank-bidv { display: inline-flex !important; ... }

const targetSalesActionsMobile = `.sales-actions-row > div:last-child {
          order: 1 !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        #btnSalesToggleHide {
          height: 38px !important;
          width: 65px !important;
          flex-shrink: 0 !important;
          border-radius: 9px !important;
          font-size: 0.92rem !important;
          font-weight: 800 !important;
          background: #0f172a !important;
          border: 1.5px solid #1e293b !important;
          color: #ffffff !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
        }`;

const replacementSalesActionsMobile = `.sales-actions-row > div:last-child {
          order: 1 !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        /* 1. Ẩn icon đám mây trên Mobile */
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
        /* 2. Ẩn nút Ẩn/Hiện trên Mobile */
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

if (css.includes(targetSalesActionsMobile)) {
  css = css.replace(targetSalesActionsMobile, replacementSalesActionsMobile);
  console.log("Updated sales actions row in style.css (CRLF)");
} else {
  const targetLF = targetSalesActionsMobile.replace(/\r\n/g, '\n');
  const replLF = replacementSalesActionsMobile.replace(/\r\n/g, '\n');
  if (css.includes(targetLF)) {
    css = css.replace(targetLF, replLF);
    console.log("Updated sales actions row in style.css (LF)");
  } else {
    console.error("targetSalesActionsMobile not found in style.css");
    process.exit(1);
  }
}

fs.writeFileSync('css/style.css', css, 'utf8');
console.log("style.css updated successfully!");

