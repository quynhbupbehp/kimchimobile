const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const logicCode = `
// =========================================================
// TÌM KIẾM THÔNG MINH CÓ GỢI Ý (DROPDOWN) - TAB BÁN HÀNG
// =========================================================
let currentSalesSuggestionIndex = -1;

function getSalesSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  const custMap = new Map();
  const prodMap = new Map();

  const pool = Array.isArray(salesDatabase) ? salesDatabase : [];
  pool.forEach(item => {
    const cust = (item.customer || '').trim();
    const prod = (item.name || '').trim();

    if (cust) {
      const cNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(cust) : cust).toLowerCase();
      if (cNorm.includes(qNorm)) {
        custMap.set(cust, (custMap.get(cust) || 0) + 1);
      }
    }

    if (prod) {
      const pNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(prod) : prod).toLowerCase();
      if (pNorm.includes(qNorm)) {
        prodMap.set(prod, (prodMap.get(prod) || 0) + 1);
      }
    }
  });

  const list = [];
  custMap.forEach((count, name) => {
    list.push({ type: 'customer', icon: '👤', label: 'Khách', name, count });
  });
  prodMap.forEach((count, name) => {
    list.push({ type: 'product', icon: '📦', label: 'Hàng', name, count });
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

function renderSalesSearchSuggestions(query) {
  const dropdown = document.getElementById('salesSearchSuggestions');
  if (!dropdown) return;

  const suggestions = getSalesSuggestions(query);
  currentSalesSuggestionIndex = -1;

  if (!suggestions || suggestions.length === 0) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    return;
  }

  dropdown.innerHTML = suggestions.map((item, index) => {
    return \`
      <div class="phone-suggestion-item" data-index="\${index}" data-name="\${escapeHtml(item.name)}" onclick="selectSalesSearchSuggestion(this.getAttribute('data-name'))">
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

function selectSalesSearchSuggestion(name) {
  const input = document.getElementById('salesSearchInput') || document.querySelector('#tab-banhang .search-sales-input');
  if (!input) return;
  input.value = name;
  const clearBtn = document.getElementById('btnClearSalesSearch');
  if (clearBtn) clearBtn.style.display = 'block';
  hideSalesSearchSuggestions();
  renderSalesTable(salesDatabase);
}
window.selectSalesSearchSuggestion = selectSalesSearchSuggestion;

function hideSalesSearchSuggestions() {
  const dropdown = document.getElementById('salesSearchSuggestions');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  currentSalesSuggestionIndex = -1;
}
window.hideSalesSearchSuggestions = hideSalesSearchSuggestions;

function updateSalesSuggestionHighlight(items) {
  items.forEach((it, idx) => {
    if (idx === currentSalesSuggestionIndex) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function handleSalesSearchKeydown(e) {
  const dropdown = document.getElementById('salesSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentSalesSuggestionIndex = (currentSalesSuggestionIndex + 1) % items.length;
    updateSalesSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentSalesSuggestionIndex = (currentSalesSuggestionIndex - 1 + items.length) % items.length;
    updateSalesSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentSalesSuggestionIndex >= 0 && currentSalesSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentSalesSuggestionIndex].click();
    } else {
      hideSalesSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideSalesSearchSuggestions();
  }
}
window.handleSalesSearchKeydown = handleSalesSearchKeydown;

function handleSalesSearchInput(input) {
  const clearBtn = document.getElementById('btnClearSalesSearch');
  if (input.value.trim() !== '') {
    if (clearBtn) clearBtn.style.display = 'block';
    renderSalesSearchSuggestions(input.value);
  } else {
    if (clearBtn) clearBtn.style.display = 'none';
    hideSalesSearchSuggestions();
  }
  renderSalesTable(salesDatabase);
}
window.handleSalesSearchInput = handleSalesSearchInput;

function clearSalesSearch() {
  const input = document.getElementById('salesSearchInput') || document.querySelector('#tab-banhang .search-sales-input');
  if (input) {
    input.value = '';
    const clearBtn = document.getElementById('btnClearSalesSearch');
    if (clearBtn) clearBtn.style.display = 'none';
    hideSalesSearchSuggestions();
    input.focus();
    renderSalesTable(salesDatabase);
  }
}
window.clearSalesSearch = clearSalesSearch;

document.addEventListener('click', function (e) {
  if (!e.target.closest('#tab-banhang #salesSearchBoxWrapper')) {
    hideSalesSearchSuggestions();
  }
});

// =========================================================
// TÌM KIẾM THÔNG MINH CÓ GỢI Ý (DROPDOWN) - TAB BÁN GÀ
// =========================================================
let currentBangaSuggestionIndex = -1;

function getBangaSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  const phoneMap = new Map();
  const accMap = new Map();

  const pool = Array.isArray(bangaDatabase) ? bangaDatabase : [];
  pool.forEach(item => {
    const phone = (item.name || '').trim();
    const acc = (item.accessory || '').trim();

    if (phone) {
      const pNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(phone) : phone).toLowerCase();
      if (pNorm.includes(qNorm)) {
        phoneMap.set(phone, (phoneMap.get(phone) || 0) + 1);
      }
    }

    if (acc) {
      const aNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(acc) : acc).toLowerCase();
      if (aNorm.includes(qNorm)) {
        accMap.set(acc, (accMap.get(acc) || 0) + 1);
      }
    }
  });

  const list = [];
  phoneMap.forEach((count, name) => {
    list.push({ type: 'phone', icon: '📱', label: 'Máy', name, count });
  });
  accMap.forEach((count, name) => {
    list.push({ type: 'accessory', icon: '🔌', label: 'Phụ kiện', name, count });
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

function renderBangaSearchSuggestions(query) {
  const dropdown = document.getElementById('bangaSearchSuggestions');
  if (!dropdown) return;

  const suggestions = getBangaSuggestions(query);
  currentBangaSuggestionIndex = -1;

  if (!suggestions || suggestions.length === 0) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    return;
  }

  dropdown.innerHTML = suggestions.map((item, index) => {
    return \`
      <div class="phone-suggestion-item" data-index="\${index}" data-name="\${escapeHtml(item.name)}" onclick="selectBangaSearchSuggestion(this.getAttribute('data-name'))">
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

function selectBangaSearchSuggestion(name) {
  const input = document.getElementById('bangaSearchInput') || document.querySelector('#tab-banga input.search-input-field');
  if (!input) return;
  input.value = name;
  const clearBtn = document.getElementById('btnClearBangaSearch');
  if (clearBtn) clearBtn.style.display = 'block';
  hideBangaSearchSuggestions();
  renderBangaTable(bangaDatabase);
}
window.selectBangaSearchSuggestion = selectBangaSearchSuggestion;

function hideBangaSearchSuggestions() {
  const dropdown = document.getElementById('bangaSearchSuggestions');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
  currentBangaSuggestionIndex = -1;
}
window.hideBangaSearchSuggestions = hideBangaSearchSuggestions;

function updateBangaSuggestionHighlight(items) {
  items.forEach((it, idx) => {
    if (idx === currentBangaSuggestionIndex) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function handleBangaSearchKeydown(e) {
  const dropdown = document.getElementById('bangaSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentBangaSuggestionIndex = (currentBangaSuggestionIndex + 1) % items.length;
    updateBangaSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentBangaSuggestionIndex = (currentBangaSuggestionIndex - 1 + items.length) % items.length;
    updateBangaSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentBangaSuggestionIndex >= 0 && currentBangaSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentBangaSuggestionIndex].click();
    } else {
      hideBangaSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideBangaSearchSuggestions();
  }
}
window.handleBangaSearchKeydown = handleBangaSearchKeydown;

function handleBangaSearchInput(input) {
  const clearBtn = document.getElementById('btnClearBangaSearch');
  if (input.value.trim() !== '') {
    if (clearBtn) clearBtn.style.display = 'block';
    renderBangaSearchSuggestions(input.value);
  } else {
    if (clearBtn) clearBtn.style.display = 'none';
    hideBangaSearchSuggestions();
  }
  renderBangaTable(bangaDatabase);
}
window.handleBangaSearchInput = handleBangaSearchInput;

function clearBangaSearchNew() {
  const input = document.getElementById('bangaSearchInput') || document.querySelector('#tab-banga input.search-input-field');
  if (input) {
    input.value = '';
    const clearBtn = document.getElementById('btnClearBangaSearch');
    if (clearBtn) clearBtn.style.display = 'none';
    hideBangaSearchSuggestions();
    input.focus();
    renderBangaTable(bangaDatabase);
  }
}
window.clearBangaSearchNew = clearBangaSearchNew;

document.addEventListener('click', function (e) {
  if (!e.target.closest('#tab-banga #bangaSearchBoxWrapper')) {
    hideBangaSearchSuggestions();
  }
});
`;

const target = `function handleSearchSales(input) {
  renderSalesTable(salesDatabase);
}`;

if (js.includes(target.replace(/\n/g, '\r\n'))) {
  js = js.replace(target.replace(/\n/g, '\r\n'), target.replace(/\n/g, '\r\n') + '\r\n' + logicCode.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Appended suggestions logic to main.js (CRLF)');
} else if (js.includes(target)) {
  js = js.replace(target, target + '\n' + logicCode);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Appended suggestions logic to main.js (LF)');
} else {
  console.log('Target handleSearchSales not found in main.js');
}

