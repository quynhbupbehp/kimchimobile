const fs = require('fs');

// 1. Cập nhật CSS: Đảm bảo class .btn-bank-bidv và #btnSalesNotePadMobile luôn hiển thị inline-flex trên Mobile
let css = fs.readFileSync('css/style.css', 'utf8');

// Loại bỏ selector :not(#tab-banhang) .btn-bank-bidv nếu nó đang vô tình gây ẩn
css = css.replace(
  `:not(#tab-banhang) > * > .btn-bank-bidv,\n  :not(#tab-banhang) .btn-bank-bidv {\n    display: none !important;\n  }`,
  `#tab-banga .btn-bank-bidv,\n  #tab-mainxac .btn-bank-bidv {\n    display: none !important;\n  }`
);

// Thêm rule trực tiếp và rõ ràng cho nút BIDV và nút Note trên Mobile tab Bán Hàng
const bidvMobileRule = `
        /* Đảm bảo nút ghi chú và BIDV hiển thị 100% trên Mobile tab Bán Hàng */
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
        #tab-banhang .btn-bank-bidv img,
        #btnSalesBidvMobile img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 7px !important;
          display: block !important;
        }
`;

css += '\n' + bidvMobileRule;
fs.writeFileSync('css/style.css', css, 'utf8');

// 2. Thêm id="btnSalesBidvMobile" vào nút BIDV trong index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('class="btn-bank-bidv"', 'id="btnSalesBidvMobile" class="btn-bank-bidv"');
fs.writeFileSync('index.html', html, 'utf8');

console.log('Successfully updated CSS and HTML for BIDV button');

