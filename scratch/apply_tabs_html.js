const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const searchStr = 'id="salesNotePadTextarea"';
const idx = html.indexOf(searchStr);
console.log('Found index:', idx);

const parentDiv = '<div style="margin-bottom: 1rem;">\r\n        <textarea id="salesNotePadTextarea"';
const parentDivLF = '<div style="margin-bottom: 1rem;">\n        <textarea id="salesNotePadTextarea"';

const tabsHtml = `<!-- THANH TAB GHI CHÚ (HUYỀN, QUỲNH, +...) -->
      <div class="sales-notepad-tabs-bar" id="salesNotePadTabsBar" style="display: flex; align-items: flex-end; gap: 6px; border-bottom: 2px solid #334155; margin-bottom: 12px; overflow-x: auto; padding-bottom: 0;"></div>

      `;

if (html.includes(parentDiv)) {
  html = html.replace(parentDiv, tabsHtml + parentDiv);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced CRLF version successfully!');
} else if (html.includes(parentDivLF)) {
  html = html.replace(parentDivLF, tabsHtml + parentDivLF);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced LF version successfully!');
} else {
  console.log('Neither matched');
}
