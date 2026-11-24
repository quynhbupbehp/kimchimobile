const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Find the block around 10463:
const targetBlock = `        /* Đảm bảo nút ghi chú và BIDV hiển thị 100% trên Mobile tab Bán Hàng */
        #tab-banhang #btnSalesNotePadMobile {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 38px !important;
          min-width: 38px !important;
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
        #tab-banhang .btn-bank-bidv,
        #tab-banhang button.btn-bank-bidv,
        #btnSalesBidvMobile {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 38px !important;
          min-width: 38px !important;
          height: 38px !important;
          padding: 0 !important;
          background: #000000 !important;
          border: 1.5px solid #059669 !important;
          border-radius: 9px !important;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4) !important;
          cursor: pointer !important;
          overflow: hidden !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }`;

// We wrap it inside @media (max-width: 768px) and add explicit desktop rule:
const replacementBlock = `        /* CHỈ hiển thị nút ghi chú mobile và nút BIDV trên MOBILE (< 768px) tab Bán Hàng */
        @media (max-width: 768px) {
          #tab-banhang #btnSalesNotePadMobile {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 38px !important;
            min-width: 38px !important;
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
          #tab-banhang .btn-bank-bidv,
          #tab-banhang button.btn-bank-bidv,
          #btnSalesBidvMobile {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 38px !important;
            min-width: 38px !important;
            height: 38px !important;
            padding: 0 !important;
            background: #000000 !important;
            border: 1.5px solid #059669 !important;
            border-radius: 9px !important;
            box-shadow: 0 2px 8px rgba(5, 150, 105, 0.4) !important;
            cursor: pointer !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }
        }

        /* Trên Desktop (>= 769px): TUYỆT ĐỐI ẨN #btnSalesNotePadMobile */
        @media (min-width: 769px) {
          #tab-banhang #btnSalesNotePadMobile,
          #btnSalesNotePadMobile,
          .btn-sales-notepad-mobile {
            display: none !important;
          }
        }`;

const normalize = s => s.replace(/\r\n/g, '\n');
let normCss = normalize(css);

if (normCss.includes(normalize(targetBlock))) {
  normCss = normCss.replace(normalize(targetBlock), normalize(replacementBlock));
  fs.writeFileSync('css/style.css', normCss, 'utf8');
  console.log('Successfully wrapped mobile rules and forced desktop hide!');
} else {
  console.error('Target block not found in css/style.css');
}

