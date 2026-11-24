const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf8');
const isCRLF = css.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

const target = normalize(`    /* GIAO DIỆN BẢNG DANH SÁCH MÁY THEO HÀNG NGANG (MẪU CHUẨN) */
    .phone-table-container {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      box-sizing: border-box;
      overflow-x: auto;
      border-radius: 8px;
      background: #0b111a;
      border: 1.5px solid #1e293b;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      margin-top: 4px;
    }

    .phone-horizontal-table {
      width: 100%;
      border-collapse: collapse;
      white-space: nowrap;
    }

    .phone-horizontal-table thead th {
      background: #141c2b;
      color: #94a3b8;
      font-weight: 800;
      font-size: 0.97rem;
      letter-spacing: 0.5px;
      padding: 11px 8px;
      border-bottom: 2px solid #1e293b;
      text-transform: uppercase;
      user-select: none;
    }`);

const replacement = normalize(`    /* GIAO DIỆN BẢNG DANH SÁCH MÁY THEO HÀNG NGANG (MẪU CHUẨN) */
    .phone-table-container {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      box-sizing: border-box;
      overflow-x: auto;
      overflow-y: auto;
      max-height: calc(100vh - 240px);
      min-height: 350px;
      position: relative;
      border-radius: 8px;
      background: #0b111a;
      border: 1.5px solid #1e293b;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      margin-top: 4px;
    }

    .phone-horizontal-table {
      width: 100%;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      white-space: nowrap;
    }

    .phone-horizontal-table thead {
      position: sticky;
      top: 0;
      z-index: 25;
    }

    .phone-horizontal-table thead th {
      background: #141c2b !important;
      color: #94a3b8;
      font-weight: 800;
      font-size: 0.97rem;
      letter-spacing: 0.5px;
      padding: 11px 8px;
      border-bottom: 2px solid #1e293b;
      text-transform: uppercase;
      user-select: none;
      position: sticky !important;
      top: 0 !important;
      z-index: 25 !important;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
    }`);

if (css.includes(target)) {
  css = css.replace(target, replacement);
  fs.writeFileSync('css/style.css', css, 'utf8');
  console.log('Successfully updated css/style.css!');
} else {
  console.log('Target not found in css/style.css');
}

