const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const oldTarget = `function handleRepairSearchInput(val) {
  const btnClear = document.getElementById('btnClearRepairSearch');
  if (btnClear) {
    btnClear.style.display = (val && val.trim()) ? 'block' : 'none';
  }
  renderRepairTable();
}

function clearRepairSearch() {
  const inp = document.getElementById('repairSearchInput');
  if (inp) inp.value = '';
  const btnClear = document.getElementById('btnClearRepairSearch');
  if (btnClear) btnClear.style.display = 'none';
  renderRepairTable();
}`;

const newRepairSearchLogic = `// =========================================================
// TÌM KIẾM THÔNG MINH CÓ GỢI Ý (DROPDOWN) - TAB SỬA CHỮA
// =========================================================
let currentRepairSuggestionIndex = -1;

function getRepairSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  const deviceMap = new Map();
  const custMap = new Map();

  const pool = Array.isArray(repairDatabase) ? repairDatabase : [];
  pool.forEach(item => {
    const dev = (item.device || '').trim();
    const cust = (item.customer || '').trim();

    if (dev) {
      const dNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(dev) : dev).toLowerCase();
      if (dNorm.includes(qNorm)) {
        deviceMap.set(dev, (deviceMap.get(dev) || 0) + 1);
      }
    }

    if (cust) {
      const cNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(cust) : cust).toLowerCase();
      if (cNorm.includes(qNorm)) {
        custMap.set(cust, (custMap.get(cust) || 0) + 1);
      }
    }
  });

  const list = [];
  deviceMap.forEach((count, name) => {
    list.push({ type: 'device', icon: '📱', label: 'Máy', name, count });
  });
  custMap.forEach((count, name) => {
    list.push({ type: 'customer', icon: '👤', label: 'Khách', name, count });
  });

  list.sort((a, b) => {
    let aLower = (typeof normalizeQuery === 'function' ? normalizeQuery(a.name) : a.name).toLowerCase();
    let bLower = (typeof normalizeQuery === 'function' ? normalizeQuery(b.name) : b.name).toLowerCase();
    let aExact = aLower === qNorm;
    let bExact = bLower === qNorm;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    let aStarts = aLower.startsWith(qNorm);
    let bStarts = bLower.startsWith(qNorm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return b.count - a.count;
  });

  return list.slice(0, 10);
}

function renderRepairSearchSuggestions(query) {
  const dropdown = document.getElementById('repairSearchSuggestions');
  if (!dropdown) return;

  const suggestions = getRepairSuggestions(query);
  currentRepairSuggestionIndex = -1;

  if (!suggestions || suggestions.length === 0) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    return;
  }

  dropdown.innerHTML = suggestions.map((item, index) => {
    return \`
      <div class="phone-suggestion-item" data-index="\${index}" data-name="\${escapeHtml(item.name)}" onclick="selectRepairSearchSuggestion(this.getAttribute('data-name'))">
        <span class="suggestion-model-name">
          <span style="font-size: 1.05rem;">\${item.icon}</span>
          <span>\${highlightSuggestionMatch(item.name, query)}</span>
        </span>
        <span class="suggestion-count">\${item.count} đơn</span>
      </div>
    \`;
  }).join('');

  dropdown.style.display = 'block';
}

function selectRepairSearchSuggestion(name) {
  const input = document.getElementById('repairSearchInput');
  if (!input) return;
  input.value = name;
  const clearBtn = document.getElementById('btnClearRepairSearch');
  if (clearBtn) clearBtn.style.display = 'block';
  hideRepairSearchSuggestions();
  renderRepairTable();
}
window.selectRepairSearchSuggestion = selectRepairSearchSuggestion;

function hideRepairSearchSuggestions() {
  const dropdown = document.getElementById('repairSearchSuggestions');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  currentRepairSuggestionIndex = -1;
}
window.hideRepairSearchSuggestions = hideRepairSearchSuggestions;

function updateRepairSuggestionHighlight(items) {
  items.forEach((it, idx) => {
    if (idx === currentRepairSuggestionIndex) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function handleRepairSearchKeydown(e) {
  const dropdown = document.getElementById('repairSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentRepairSuggestionIndex = (currentRepairSuggestionIndex + 1) % items.length;
    updateRepairSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentRepairSuggestionIndex = (currentRepairSuggestionIndex - 1 + items.length) % items.length;
    updateRepairSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentRepairSuggestionIndex >= 0 && currentRepairSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentRepairSuggestionIndex].click();
    } else {
      hideRepairSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideRepairSearchSuggestions();
  }
}
window.handleRepairSearchKeydown = handleRepairSearchKeydown;

function handleRepairSearchInput(inputOrVal) {
  const val = (inputOrVal && typeof inputOrVal === 'object' && inputOrVal.value !== undefined) ? inputOrVal.value : String(inputOrVal || '');
  const btnClear = document.getElementById('btnClearRepairSearch');
  if (val.trim() !== '') {
    if (btnClear) btnClear.style.display = 'block';
    renderRepairSearchSuggestions(val);
  } else {
    if (btnClear) btnClear.style.display = 'none';
    hideRepairSearchSuggestions();
  }
  renderRepairTable();
}
window.handleRepairSearchInput = handleRepairSearchInput;

function clearRepairSearch() {
  const inp = document.getElementById('repairSearchInput');
  if (inp) {
    inp.value = '';
    inp.focus();
  }
  const btnClear = document.getElementById('btnClearRepairSearch');
  if (btnClear) btnClear.style.display = 'none';
  hideRepairSearchSuggestions();
  renderRepairTable();
}
window.clearRepairSearch = clearRepairSearch;

document.addEventListener('click', function (e) {
  if (!e.target.closest('#tab-suachua #repairSearchBoxWrapper')) {
    hideRepairSearchSuggestions();
  }
});`;

if (js.includes(oldTarget.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldTarget.replace(/\n/g, '\r\n'), newRepairSearchLogic.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced handleRepairSearchInput in main.js (CRLF)');
} else if (js.includes(oldTarget)) {
  js = js.replace(oldTarget, newRepairSearchLogic);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced handleRepairSearchInput in main.js (LF)');
} else {
  console.log('oldTarget not found in main.js');
}

