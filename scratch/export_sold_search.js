const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

const target = normalize(`function clearSoldPhoneSearch() {
  const input = document.getElementById('soldPhoneSearchInput');
  if (input) {
    input.value = '';
    const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
    if (clearBtn) clearBtn.style.display = 'none';
    hideSoldPhoneSearchSuggestions();
    input.focus();
    renderSoldPhoneTable();
  }
}`);

const replacement = normalize(`function clearSoldPhoneSearch() {
  const input = document.getElementById('soldPhoneSearchInput');
  if (input) {
    input.value = '';
    const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
    if (clearBtn) clearBtn.style.display = 'none';
    hideSoldPhoneSearchSuggestions();
    input.focus();
    renderSoldPhoneTable();
  }
}
window.handleSoldPhoneSearchInput = handleSoldPhoneSearchInput;
window.clearSoldPhoneSearch = clearSoldPhoneSearch;
window.renderSoldPhoneSearchSuggestions = renderSoldPhoneSearchSuggestions;
window.getSoldPhoneNameSuggestions = getSoldPhoneNameSuggestions;`);

if (!js.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}
js = js.replace(target, replacement);
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully exported sold phone search functions to window!');

