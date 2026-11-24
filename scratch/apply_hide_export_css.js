const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const hideExportMobileCss = `
/* ============================================================
   ẨN TẤT CẢ NÚT XUẤT EXCEL TRÊN MOBILE THEO YÊU CẦU
   ============================================================ */
@media screen and (max-width: 768px) {
  .btn-export-excel-action,
  button[onclick*="exportSalesToExcel"],
  button[onclick*="exportSoftwareToExcel"],
  button[onclick*="exportRepairToExcel"],
  button[onclick*="exportPhoneToExcel"],
  button[onclick*="exportBangaToExcel"],
  button[onclick*="exportSoldPhoneToExcel"],
  button[onclick*="exportDebtSoftwareToExcel"],
  button[onclick*="exportMainXacToExcel"] {
    display: none !important;
  }
}
`;

css += hideExportMobileCss;
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('Appended mobile hide export CSS successfully!');

