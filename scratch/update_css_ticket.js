const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');

const target = `        .btn-create-ticket {
          flex: 1 1 auto !important;`;

const replacement = `        #tab-banhang .btn-create-ticket {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          padding: 0 8px !important;
          font-size: 0.88rem !important;
        }
        .btn-create-ticket {
          flex: 1 1 auto !important;`;

let normCss = css.replace(/\r\n/g, '\n');
let normTarget = target.replace(/\r\n/g, '\n');
let normRepl = replacement.replace(/\r\n/g, '\n');

if (normCss.includes(normTarget)) {
  let updated = normCss.replace(normTarget, normRepl);
  if (css.includes('\r\n')) updated = updated.replace(/\n/g, '\r\n');
  fs.writeFileSync('css/style.css', updated, 'utf8');
  console.log('SUCCESS: Updated css for mobile create ticket button');
} else {
  console.log('FAILED to find target in css');
}

