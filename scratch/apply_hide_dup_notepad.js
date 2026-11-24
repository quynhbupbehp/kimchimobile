const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Add rule: on Web (desktop, screen width > 768px), hide #btnSalesNotePadMobile
const hideDesktopNotePadMobileRule = `
/* Ẩn nút ghi chú mobile btnSalesNotePadMobile khi ở trên Web Desktop để tránh xuất hiện 2 icon ghi chú */
@media screen and (min-width: 769px) {
  #btnSalesNotePadMobile,
  .btn-sales-notepad-mobile {
    display: none !important;
  }
}
`;

css += hideDesktopNotePadMobileRule;
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('Appended rule to hide btnSalesNotePadMobile on desktop');

