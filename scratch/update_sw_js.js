const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// 1. Cập nhật renderSoftwareTable để nhận diện tìm kiếm swSearchInput
const oldRenderSw = `  const tbody = document.getElementById('softwareTableBody');
  if (!tbody) return;

  let filtered = database.filter(item => {`;

const newRenderSw = `  const tbody = document.getElementById('softwareTableBody');
  if (!tbody) return;

  const swSearchEl = document.getElementById('swSearchInput');
  const swSearchVal = swSearchEl ? swSearchEl.value.trim().toLowerCase() : '';

  let filtered = database.filter(item => {
    // 1. Lọc theo từ khóa tìm kiếm (khi tìm thì lọc trên toàn bộ danh sách)
    if (swSearchVal) {
      const custName = (item.customer || '').toLowerCase();
      const devName = (item.device || '').toLowerCase();
      const noteStr = (item.note || '').toLowerCase();
      const fullMatch = \`\${custName} \${devName} \${noteStr}\`;
      return fullMatch.includes(swSearchVal);
    }`;

if (js.includes(oldRenderSw.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldRenderSw.replace(/\n/g, '\r\n'), newRenderSw.replace(/\n/g, '\r\n'));
  console.log('Updated renderSoftwareTable (CRLF)');
} else if (js.includes(oldRenderSw)) {
  js = js.replace(oldRenderSw, newRenderSw);
  console.log('Updated renderSoftwareTable (LF)');
} else {
  console.log('oldRenderSw not found');
}

// 2. Thêm logic gợi ý tìm kiếm phần mềm
const swLogic = `
// =========================================================
// TÌM KIẾM THÔNG MINH CÓ GỢI Ý (DROPDOWN) - TAB PHẦN MỀM
// =========================================================
let currentSwSuggestionIndex = -1;

function getSoftwareSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  const custMap = new Map();
  const devMap = new Map();

  const pool = Array.isArray(softwareDatabase) ? softwareDatabase : [];
  pool.forEach(item => {
    const cust = (item.customer || '').trim();
    const dev = (item.device || '').trim();

    if (cust) {
      const cNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(cust) : cust).toLowerCase();
      if (cNorm.includes(qNorm)) {
        custMap.set(cust, (custMap.get(cust) || 0) + 1);
      }
    }

    if (dev) {
      const dNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(dev) : dev).toLowerCase();
      if (dNorm.includes(qNorm)) {
        devMap.set(dev, (devMap.get(dev) || 0) + 1);
      }
    }
  });

  const list = [];
  custMap.forEach((count, name) => {
    list.push({ type: 'customer', icon: '👤', label: 'Khách', name, count });
  });
  devMap.forEach((count, name) => {
    list.push({ type: 'device', icon: '📱', label: 'Máy', name, count });
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

function renderSoftwareSearchSuggestions(query) {
  const dropdown = document.getElementById('swSearchSuggestions');
  if (!dropdown) return;

  const suggestions = getSoftwareSuggestions(query);
  currentSwSuggestionIndex = -1;

  if (!suggestions || suggestions.length === 0) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    return;
  }

  dropdown.innerHTML = suggestions.map((item, index) => {
    return \`
      <div class="phone-suggestion-item" data-index="\${index}" data-name="\${escapeHtml(item.name)}" onclick="selectSoftwareSearchSuggestion(this.getAttribute('data-name'))">
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

function selectSoftwareSearchSuggestion(name) {
  const input = document.getElementById('swSearchInput');
  if (!input) return;
  input.value = name;
  const clearBtn = document.getElementById('btnClearSwSearch');
  if (clearBtn) clearBtn.style.display = 'block';
  hideSoftwareSearchSuggestions();
  renderSoftwareTable(softwareDatabase);
}
window.selectSoftwareSearchSuggestion = selectSoftwareSearchSuggestion;

function hideSoftwareSearchSuggestions() {
  const dropdown = document.getElementById('swSearchSuggestions');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  currentSwSuggestionIndex = -1;
}
window.hideSoftwareSearchSuggestions = hideSoftwareSearchSuggestions;

function updateSoftwareSuggestionHighlight(items) {
  items.forEach((it, idx) => {
    if (idx === currentSwSuggestionIndex) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function handleSoftwareSearchKeydown(e) {
  const dropdown = document.getElementById('swSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentSwSuggestionIndex = (currentSwSuggestionIndex + 1) % items.length;
    updateSoftwareSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentSwSuggestionIndex = (currentSwSuggestionIndex - 1 + items.length) % items.length;
    updateSoftwareSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentSwSuggestionIndex >= 0 && currentSwSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentSwSuggestionIndex].click();
    } else {
      hideSoftwareSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideSoftwareSearchSuggestions();
  }
}
window.handleSoftwareSearchKeydown = handleSoftwareSearchKeydown;

function handleSoftwareSearchInput(input) {
  const clearBtn = document.getElementById('btnClearSwSearch');
  if (input.value.trim() !== '') {
    if (clearBtn) clearBtn.style.display = 'block';
    renderSoftwareSearchSuggestions(input.value);
  } else {
    if (clearBtn) clearBtn.style.display = 'none';
    hideSoftwareSearchSuggestions();
  }
  renderSoftwareTable(softwareDatabase);
}
window.handleSoftwareSearchInput = handleSoftwareSearchInput;

function clearSoftwareSearch() {
  const input = document.getElementById('swSearchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  const clearBtn = document.getElementById('btnClearSwSearch');
  if (clearBtn) clearBtn.style.display = 'none';
  hideSoftwareSearchSuggestions();
  renderSoftwareTable(softwareDatabase);
}
window.clearSoftwareSearch = clearSoftwareSearch;

document.addEventListener('click', function (e) {
  if (!e.target.closest('#tab-phanmem #swSearchBoxWrapper')) {
    hideSoftwareSearchSuggestions();
  }
});
`;

const anchor = `// =========================================================
// TÌM KIẾM THÔNG MINH CÓ GỢI Ý (DROPDOWN) - TAB SỬA CHỮA`;

if (js.includes(anchor.replace(/\n/g, '\r\n'))) {
  js = js.replace(anchor.replace(/\n/g, '\r\n'), swLogic.replace(/\n/g, '\r\n') + '\r\n' + anchor.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Inserted software search logic into main.js (CRLF)');
} else if (js.includes(anchor)) {
  js = js.replace(anchor, swLogic + '\n' + anchor);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Inserted software search logic into main.js (LF)');
} else {
  console.log('Anchor for software search logic not found');
}

