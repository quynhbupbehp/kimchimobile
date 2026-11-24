const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const targetOld = `        /* === TAB 2: PHẦN MỀM MOBILE (< 768PX) - CHUẨN Y CHANG ẢNH MẪU 100% === */
        #tab-phanmem .sw-top-header-bar {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 8px !important;
          width: 100% !important;
          margin-bottom: 8px !important;
        }
        /* HÀNG 1: ẨN DOANH THU TRÊN MOBILE, CHỈ HIỂN THỊ THẺ LÃI THÁNG & NGÀY */
        #tab-phanmem .sw-top-header-bar > div:first-child {
          display: none !important;
        }
        #swRevenueBadge {
          display: none !important;
        }
        #tab-phanmem .sw-top-header-bar > div:last-child {
          grid-column: 1 / -1 !important;
          grid-row: 1 !important;
          width: 100% !important;
          margin: 0 !important;
          display: flex !important;
        }
        #tab-phanmem .sw-top-header-bar > div:last-child > .sw-stat-pill {
          width: 100% !important;
          height: 42px !important;
          justify-content: space-between !important;
          box-sizing: border-box !important;
          padding: 0 16px !important;
          margin: 0 !important;
          background: #000000 !important;
          border: 1.5px solid #334155 !important;
          border-radius: 9px !important;
        }
        #tab-phanmem #swProfitBadge #swMonthProfitText {
          font-size: 1.15rem !important;
          color: #ef4444 !important;
          font-weight: 900 !important;
        }
        #tab-phanmem #swProfitBadge #swProfitEmojiIcon {
          width: 22px !important;
          height: 22px !important;
          object-fit: contain !important;
          flex-shrink: 0 !important;
        }
        /* GIẢM KÍCH CỠ CHỮ LÃI NGÀY 20% TRÊN MOBILE (1.15rem -> 0.92rem) */
        #tab-phanmem #swProfitBadge #swDayProfitText {
          font-size: 0.92rem !important;
          color: #ffffff !important;
          font-weight: 900 !important;
        }
        #btnSwExcelToggle, #swExcelActionsBox {
          display: none !important;
        }

        /* HÀNG 2: 3 NÚT PHÍM TẮT TRÊN MOBILE (LINK TOOL - TESTPOINT - CÔNG NỢ) */
        .sw-shortcuts-container,
        #tab-phanmem .sw-top-header-bar > div:nth-child(2) {
          grid-column: 1 / -1 !important;
          grid-row: 2 !important;
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 6px !important;
          width: 100% !important;
          margin: 0 !important;
        }
        .sw-shortcuts-container .sw-pill-btn,
        #tab-phanmem .sw-pill-btn {
          width: 100% !important;
          height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 4px !important;
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          box-sizing: border-box !important;
          border-radius: 8px !important;
          background: #0f1623 !important;
          border: 1.5px solid #1e293b !important;
          color: #ffffff !important;
          margin: 0 !important;
          white-space: nowrap !important;
        }
        .sw-shortcuts-container .sw-pill-btn .sw-link-text,
        #tab-phanmem .sw-pill-btn .sw-link-text {
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
        }
        .sw-shortcuts-container .sw-btn-congno.active {
          background: #8b5cf6 !important;
          border-color: #a78bfa !important;
          color: #ffffff !important;
          box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4) !important;
        }

        /* ẨN Ô TÀI KHOẢN, GHI CHÚ, LINK ROM TRÊN MOBILE THEO YÊU CẦU */
        .sw-shortcuts-container .sw-shortcut-rom,
        .sw-shortcuts-container .sw-shortcut-accounts,
        .sw-shortcuts-container .sw-shortcut-notes,
        #tab-phanmem .sw-shortcut-rom,
        #tab-phanmem .sw-shortcut-accounts,
        #tab-phanmem .sw-shortcut-notes {
          display: none !important;
        }
        .sw-shortcuts-container .sw-shortcut-tool,
        #tab-phanmem .sw-shortcut-tool {
          order: 1 !important;
        }
        .sw-shortcuts-container .sw-shortcut-testpoint,
        #tab-phanmem .sw-shortcut-testpoint {
          order: 2 !important;
        }
        .sw-shortcuts-container .sw-shortcut-congno,
        #tab-phanmem .sw-shortcut-congno {
          order: 3 !important;
        }`;

const targetNew = `        /* === TAB 2: PHẦN MỀM MOBILE (< 768PX) - CHUẨN Y CHANG ẢNH MẪU 100% === */
        #tab-phanmem .sw-top-header-bar {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 8px !important;
          width: 100% !important;
          margin-bottom: 8px !important;
        }
        /* HÀNG 1: DOANH THU (TRÁI) & LÃI (PHẢI) CÙNG 1 HÀNG */
        #tab-phanmem .sw-top-header-bar > div:first-child {
          grid-column: 1 / 2 !important;
          grid-row: 1 !important;
          width: 100% !important;
          margin: 0 !important;
          display: flex !important;
        }
        #tab-phanmem #swRevenueBadge,
        #swRevenueBadge {
          display: flex !important;
          width: 100% !important;
          height: 42px !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          padding: 0 10px !important;
          margin: 0 !important;
          background: #000000 !important;
          border: 1.5px solid #334155 !important;
          border-radius: 9px !important;
        }
        #tab-phanmem .sw-top-header-bar > div:last-child {
          grid-column: 2 / 3 !important;
          grid-row: 1 !important;
          width: 100% !important;
          margin: 0 !important;
          display: flex !important;
        }
        #tab-phanmem .sw-top-header-bar > div:last-child > .sw-stat-pill {
          width: 100% !important;
          height: 42px !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          padding: 0 10px !important;
          margin: 0 !important;
          background: #000000 !important;
          border: 1.5px solid #334155 !important;
          border-radius: 9px !important;
        }
        #tab-phanmem #swProfitBadge #swMonthProfitText {
          font-size: 1.15rem !important;
          color: #4ade80 !important;
          font-weight: 900 !important;
        }
        #tab-phanmem #swProfitBadge #swProfitEmojiIcon {
          width: 22px !important;
          height: 22px !important;
          object-fit: contain !important;
          flex-shrink: 0 !important;
        }
        #tab-phanmem #swProfitBadge #swDayProfitText {
          font-size: 1.15rem !important;
          color: #ffffff !important;
          font-weight: 900 !important;
        }
        #btnSwExcelToggle, #swExcelActionsBox {
          display: none !important;
        }

        /* HÀNG 2 & 3: LƯỚI 6 NÚT PHÍM TẮT (3 CỘT X 2 HÀNG) Y CHANG ẢNH MẪU */
        .sw-shortcuts-container,
        #tab-phanmem .sw-top-header-bar > div:nth-child(2) {
          grid-column: 1 / -1 !important;
          grid-row: 2 !important;
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 6px !important;
          width: 100% !important;
          margin: 0 !important;
        }
        .sw-shortcuts-container .sw-pill-btn,
        #tab-phanmem .sw-pill-btn {
          width: 100% !important;
          height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 4px !important;
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          box-sizing: border-box !important;
          border-radius: 8px !important;
          background: #0f1623 !important;
          border: 1.5px solid #1e293b !important;
          color: #ffffff !important;
          margin: 0 !important;
          white-space: nowrap !important;
        }
        .sw-shortcuts-container .sw-pill-btn .sw-link-text,
        #tab-phanmem .sw-pill-btn .sw-link-text {
          font-size: 0.82rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
        }
        .sw-shortcuts-container .sw-btn-congno.active {
          background: #8b5cf6 !important;
          border-color: #a78bfa !important;
          color: #ffffff !important;
          box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4) !important;
        }
        /* HIỂN THỊ ĐẦY ĐỦ 6 NÚT TRÊN MOBILE */
        .sw-shortcuts-container .sw-shortcut-rom,
        .sw-shortcuts-container .sw-shortcut-accounts,
        .sw-shortcuts-container .sw-shortcut-notes,
        #tab-phanmem .sw-shortcut-rom,
        #tab-phanmem .sw-shortcut-accounts,
        #tab-phanmem .sw-shortcut-notes {
          display: inline-flex !important;
        }`;

let normCss = css.replace(/\r\n/g, '\n');
let normTargetOld = targetOld.replace(/\r\n/g, '\n');
let normTargetNew = targetNew.replace(/\r\n/g, '\n');

if (normCss.includes(normTargetOld)) {
  normCss = normCss.replace(normTargetOld, normTargetNew);
  if (css.includes('\r\n')) normCss = normCss.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/style.css', normCss, 'utf8');
  console.log('SUCCESS: Restored 2 revenue/profit pills & 6 shortcut buttons on mobile phan mem');
} else {
  console.log('FAILED: targetOld not found');
}

// Cập nhật lại nhãn nút trong index.html: "GHI CHÚ" thay vì "LINK WEB"
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  '<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"\n              title="Quản lý link web phần mềm">LINK WEB</button>',
  '<button type="button" class="sw-pill-btn sw-btn-black sw-shortcut-notes" onclick="openSwNotesModal()"\n              title="Quản lý link web phần mềm">GHI CHÚ</button>'
);
fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: Checked label GHI CHÚ in index.html');

