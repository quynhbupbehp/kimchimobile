const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

const targetOld = `/* ẨN NÚT BIDV BANK TRÊN GIAO DIỆN MOBILE (< 768px và < 900px) */\r
@media (max-width: 768px) {\r
  .btn-bank-bidv,\r
  .btn-bank-bidv-sw {\r
    display: none !important;\r
  }\r
}`;

const targetNew = `/* ẨN NÚT BIDV BANK TRÊN GIAO DIỆN MOBILE (< 768px) CHO CÁC TAB KHÁC */\r
@media (max-width: 768px) {\r
  .btn-bank-bidv-sw {\r
    display: none !important;\r
  }\r
  :not(#tab-banhang) > * > .btn-bank-bidv,\r
  :not(#tab-banhang) .btn-bank-bidv {\r
    display: none !important;\r
  }\r
}`;

if (css.includes(targetOld)) {
  css = css.replace(targetOld, targetNew);
  console.log('Replaced BIDV mobile rule');
} else {
  console.log('Not matched');
}

fs.writeFileSync('css/style.css', css, 'utf8');
