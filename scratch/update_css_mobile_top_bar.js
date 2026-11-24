const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');
const isCRLF = css.includes('\r\n');
let normCss = css.replace(/\r\n/g, '\n');

const targetStr = `        .banmay-top-bar {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin-bottom: 6px !important;
          width: 100% !important;
        }`;

const endMarkerStr = `        .banmay-sticky-price-row .btn-sell-external-desktop {
          display: none !important;
        }`;

const idxStart = normCss.lastIndexOf(targetStr);
const idxEnd = normCss.lastIndexOf(endMarkerStr);

if (idxStart !== -1 && idxEnd !== -1) {
  const replacement = `        /* CỐ ĐỊNH HÀNG TÌM KIẾM TRÊN MOBILE (STICKY TOP) */
        .banmay-top-bar {
          position: sticky !important;
          top: 104px !important;
          z-index: 850 !important;
          background: #060a14 !important;
          padding: 6px 0 !important;
          margin-bottom: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.75) !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          width: 100% !important;
        }
        .banmay-top-bar > div:first-child {
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .banmay-top-bar .search-box-bm {
          flex: 1 1 50% !important;
          width: auto !important;
          min-width: 0 !important;
          height: 40px !important;
          background: #0b101d !important;
          border: 1.5px solid #1e293b !important;
          border-radius: 8px !important;
          display: flex !important;
          align-items: center !important;
          padding: 0 8px !important;
          box-sizing: border-box !important;
        }
        .banmay-top-bar .search-label-single-line {
          color: #f59e0b !important;
          font-weight: 900 !important;
          font-size: 0.85rem !important;
          margin-right: 6px !important;
          white-space: nowrap !important;
        }
        .banmay-top-bar .search-input-field {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          color: #ffffff !important;
          font-size: 0.85rem !important;
          flex: 1 1 auto !important;
          min-width: 0 !important;
          height: 36px !important;
        }
        /* TĂNG KÍCH THƯỚC Ô LỌC GIÁ BÁN TRÀN VÀO PHẦN THỪA CỦA Ô CỜ */
        .banmay-top-bar .price-filter-box-bm {
          display: flex !important;
          flex: 1 1 50% !important;
          width: auto !important;
          min-width: 0 !important;
          height: 40px !important;
          background: #0b101d !important;
          border: 1.5px solid #1e293b !important;
          border-radius: 8px !important;
          align-items: center !important;
          padding: 0 8px !important;
          box-sizing: border-box !important;
          margin: 0 !important;
        }
        .banmay-top-bar .price-filter-label {
          color: #38bdf8 !important;
          font-weight: 900 !important;
          font-size: 0.85rem !important;
          white-space: nowrap !important;
          margin-right: 6px !important;
        }
        .banmay-top-bar select {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          background: transparent !important;
          border: none !important;
          color: #f59e0b !important;
          font-weight: 900 !important;
          font-size: 0.85rem !important;
          outline: none !important;
        }
        /* BỎ Ô LÁ CỜ ĐỎ SAO VÀNG TRÊN MOBILE */
        #btnPhoneViewModeToggle,
        .banmay-top-bar #btnPhoneViewModeToggle {
          display: none !important;
        }
        #addPhoneBtnWrapper {
          display: none !important;
        }
        .banmay-sticky-price-row {
          display: none !important;
        }`;

  normCss = normCss.substring(0, idxStart) + replacement + normCss.substring(idxEnd + endMarkerStr.length);
  const finalCss = isCRLF ? normCss.replace(/\n/g, '\r\n') : normCss;
  fs.writeFileSync('css/style.css', finalCss, 'utf8');
  console.log('SUCCESS: Replaced banmay-top-bar mobile styles with clean sticky bar and widened price filter');
} else {
  console.error('ERROR: Could not find idxStart or idxEnd', idxStart, idxEnd);
}
