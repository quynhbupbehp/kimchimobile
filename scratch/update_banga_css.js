const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const oldMobileCss = `        #tab-banga #bangaRevenueBadge #bangaMonthRevenueVal {
          color: #22c55e !important;
          font-weight: 900 !important;
          font-size: 1.15rem !important;
          line-height: 1 !important;
        }
        #tab-banga #bangaRevenueBadge svg {
          width: 20px !important;
          height: 20px !important;
          flex-shrink: 0 !important;
        }
        #tab-banga #bangaRevenueBadge #bangaDayRevenueVal {
          color: #ffffff !important;
          font-weight: 900 !important;
          font-size: 1.15rem !important;
          line-height: 1 !important;
        }`;

const newMobileCss = `        #tab-banga #bangaRevenueBadge #bangaMonthRevenueVal {
          color: #22c55e !important;
          font-weight: 900 !important;
          font-size: 0.95rem !important;
          line-height: 1 !important;
          white-space: nowrap !important;
        }
        #tab-banga #bangaRevenueBadge svg {
          width: 18px !important;
          height: 18px !important;
          flex-shrink: 0 !important;
        }
        #tab-banga #bangaRevenueBadge #bangaDayRevenueVal {
          color: #ffffff !important;
          font-weight: 900 !important;
          font-size: 0.95rem !important;
          line-height: 1 !important;
          white-space: nowrap !important;
        }`;

const normalize = s => s.replace(/\r\n/g, '\n');
let normCss = normalize(css);
let normOld = normalize(oldMobileCss);

if (normCss.includes(normOld)) {
  normCss = normCss.replace(normOld, normalize(newMobileCss));
  fs.writeFileSync('css/style.css', normCss, 'utf8');
  console.log('Updated mobile CSS font sizes successfully!');
} else {
  console.log('Mobile CSS target not found');
}

