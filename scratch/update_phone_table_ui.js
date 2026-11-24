const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

// 1. Thay đổi thứ tự trong pinInfoHtml: Tình Trạng Pin trước, Dung Lượng Pin sau
const oldPinBlock = normalize(`      let cleanPct = (displayPinPct || '').trim();
      let pinInfoHtml = '';
      if (cleanPct && cleanStatus) {
        pinInfoHtml = \`<span style="color: #ffffff; font-weight: 800;">\${escapeHtml(cleanPct)}</span><span style="color: #64748b; font-weight: 700; margin: 0 5px;">-</span><span style="color: #f59e0b; font-weight: 900;">\${escapeHtml(cleanStatus)}</span>\`;
      } else if (cleanPct) {
        pinInfoHtml = \`<span style="color: #ffffff; font-weight: 800;">\${escapeHtml(cleanPct)}</span>\`;
      } else if (cleanStatus) {
        pinInfoHtml = \`<span style="color: #f59e0b; font-weight: 900;">\${escapeHtml(cleanStatus)}</span>\`;
      } else {
        pinInfoHtml = \`<span style="color: #64748b;">—</span>\`;
      }`);

const newPinBlock = normalize(`      let cleanPct = (displayPinPct || '').trim();
      let pinInfoHtml = '';
      if (cleanPct && cleanStatus) {
        pinInfoHtml = \`<span style="color: #f59e0b; font-weight: 900;">\${escapeHtml(cleanStatus)}</span><span style="color: #64748b; font-weight: 700; margin: 0 5px;">-</span><span style="color: #ffffff; font-weight: 800;">\${escapeHtml(cleanPct)}</span>\`;
      } else if (cleanStatus) {
        pinInfoHtml = \`<span style="color: #f59e0b; font-weight: 900;">\${escapeHtml(cleanStatus)}</span>\`;
      } else if (cleanPct) {
        pinInfoHtml = \`<span style="color: #ffffff; font-weight: 800;">\${escapeHtml(cleanPct)}</span>\`;
      } else {
        pinInfoHtml = \`<span style="color: #64748b;">—</span>\`;
      }`);

// 2. Bỏ vòng tròn màu ở cột MÀU SẮC
const oldColorTd = normalize(`                    <td style="text-align: center; color: #cbd5e1; font-weight: 700; font-size: 1.07rem;">
                      <span style="display: inline-flex; align-items: center; gap: 8px; justify-content: center;">
                        \${getColorDotHtml(p.color, 30)}
                        <span>\${escapeHtml(p.color || 'Mặc định')}</span>
                      </span>
                    </td>`);

const newColorTd = normalize(`                    <td style="text-align: center; color: #cbd5e1; font-weight: 700; font-size: 1.07rem;">
                      <span>\${escapeHtml(p.color || 'Mặc định')}</span>
                    </td>`);

if (!js.includes(oldPinBlock)) {
  console.error('oldPinBlock not found!');
  process.exit(1);
}
if (!js.includes(oldColorTd)) {
  console.error('oldColorTd not found!');
  process.exit(1);
}

js = js.replace(oldPinBlock, newPinBlock);
js = js.replace(oldColorTd, newColorTd);

fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated js/main.js!');

