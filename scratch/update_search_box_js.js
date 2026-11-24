const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');
const isCRLF = js.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

// 1. Cập nhật getSoldPhoneNameSuggestions và render/select
const oldSuggestionsBlock = normalize(`function getSoldPhoneNameSuggestions(query) {
  const qNorm = (query || '').trim().toLowerCase();
  const pool = soldPhoneDatabase || [];
  const nameMap = new Map();

  pool.forEach(p => {
    let rawName = (p.name || '').trim();
    if (!rawName) return;

    let cleanedName = rawName
      .replace(/\\s*-\\s*\\(?(đang\\s*)?thất\\s*lạc\\)?/gi, '')
      .replace(/\\s*\\([^)]*vân\\s*tay[^)]*\\)/gi, '')
      .replace(/\\s*-\\s*cất\\s*trong\\s*nhà/gi, '')
      .trim();

    let displayModel = formatBrandDeviceName(cleanedName || rawName);
    let key = displayModel.toLowerCase();
    let normModel = key;
    let normFullName = \`\${(p.brand || '').toLowerCase()} \${key}\`;

    let isMatch = !qNorm || normModel.includes(qNorm) || normFullName.includes(qNorm) || rawName.toLowerCase().includes(qNorm);

    if (isMatch) {
      if (!nameMap.has(key)) {
        nameMap.set(key, { name: displayModel, count: 1, brand: p.brand || '' });
      } else {
        nameMap.get(key).count++;
      }
    }
  });

  const list = Array.from(nameMap.values());
  list.sort((a, b) => {
    if (qNorm) {
      let aLower = a.name.toLowerCase();
      let bLower = b.name.toLowerCase();
      let aExact = aLower === qNorm;
      let bExact = bLower === qNorm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      let aStarts = aLower.startsWith(qNorm);
      let bStarts = bLower.startsWith(qNorm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
    }
    return b.count - a.count;
  });

  return list.slice(0, 10);
}`);

const newSuggestionsBlock = normalize(`function getSoldPhoneNameSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  let pool = soldPhoneDatabase || [];
  if (currentSoldPhoneBrandFilter && currentSoldPhoneBrandFilter !== 'ALL') {
    const cbf = (currentSoldPhoneBrandFilter || '').toUpperCase().trim();
    pool = pool.filter(p => {
      let pBrand = (p.brand || '').trim().toUpperCase();
      let pDet = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(p.brand, p.name).toUpperCase() : pBrand;
      let match = (pBrand === cbf || pDet === cbf);
      if (cbf === 'IPHONE' && (pBrand === 'IPAD' || pDet === 'IPAD')) match = true;
      return match;
    });
  }

  const nameMap = new Map();
  pool.forEach(p => {
    let rawName = (p.name || '').trim();
    if (!rawName) return;

    let cleanedName = rawName
      .replace(/\\s*-\\s*\\(?(đang\\s*)?thất\\s*lạc\\)?/gi, '')
      .replace(/\\s*\\([^)]*vân\\s*tay[^)]*\\)/gi, '')
      .replace(/\\s*-\\s*cất\\s*trong\\s*nhà/gi, '')
      .trim();

    let displayModel = formatBrandDeviceName(cleanedName || rawName);
    let key = displayModel.toLowerCase();

    let normModel = (typeof normalizeQuery === 'function' ? normalizeQuery(displayModel) : displayModel).toLowerCase();
    let normFullName = (typeof normalizeQuery === 'function' ? normalizeQuery(\`\${p.brand || ''} \${displayModel}\`) : \`\${p.brand || ''} \${displayModel}\`).toLowerCase();

    let isMatch = normModel.includes(qNorm) ||
      normFullName.includes(qNorm) ||
      rawName.toLowerCase().includes(qNorm);

    if (isMatch) {
      if (!nameMap.has(key)) {
        nameMap.set(key, { name: displayModel, count: 1, brand: p.brand || '' });
      } else {
        nameMap.get(key).count++;
      }
    }
  });

  const list = Array.from(nameMap.values());
  list.sort((a, b) => {
    let aLower = a.name.toLowerCase();
    let bLower = b.name.toLowerCase();
    let aExact = aLower === qNorm;
    let bExact = bLower === qNorm;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    let aStarts = aLower.startsWith(qNorm);
    let bStarts = bLower.startsWith(qNorm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    if (a.name.length !== b.name.length) {
      return a.name.length - b.name.length;
    }
    return a.name.localeCompare(b.name);
  });

  return list.slice(0, 10);
}`);

// 2. Sửa hàm updateSuggestionHighlight và handleSoldPhoneSearchKeydown để highlight chuẩn
const oldKeydownBlock = normalize(`function handleSoldPhoneSearchKeydown(e) {
  const dropdown = document.getElementById('soldPhoneSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentSoldSuggestionIndex = (currentSoldSuggestionIndex + 1) % items.length;
    updateSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentSoldSuggestionIndex = (currentSoldSuggestionIndex - 1 + items.length) % items.length;
    updateSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentSoldSuggestionIndex >= 0 && currentSoldSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentSoldSuggestionIndex].click();
    } else {
      hideSoldPhoneSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideSoldPhoneSearchSuggestions();
  }
}`);

const newKeydownBlock = normalize(`function updateSoldSuggestionHighlight(items) {
  items.forEach((it, idx) => {
    if (idx === currentSoldSuggestionIndex) {
      it.classList.add('active');
      it.scrollIntoView({ block: 'nearest' });
    } else {
      it.classList.remove('active');
    }
  });
}

function handleSoldPhoneSearchKeydown(e) {
  const dropdown = document.getElementById('soldPhoneSearchSuggestions');
  if (!dropdown || dropdown.style.display === 'none') return;
  const items = dropdown.querySelectorAll('.phone-suggestion-item');
  if (items.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentSoldSuggestionIndex = (currentSoldSuggestionIndex + 1) % items.length;
    updateSoldSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentSoldSuggestionIndex = (currentSoldSuggestionIndex - 1 + items.length) % items.length;
    updateSoldSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    if (currentSoldSuggestionIndex >= 0 && currentSoldSuggestionIndex < items.length) {
      e.preventDefault();
      items[currentSoldSuggestionIndex].click();
    } else {
      hideSoldPhoneSearchSuggestions();
    }
  } else if (e.key === 'Escape') {
    hideSoldPhoneSearchSuggestions();
  }
}`);

// 3. Sửa handleSoldPhoneSearchInput: ẩn hiện nút clear & gọi render dropdown
const oldSearchInputFn = normalize(`function handleSoldPhoneSearchInput(input) {
  const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
  if (clearBtn) {
    clearBtn.style.display = input.value.trim() !== "" ? 'block' : 'none';
  }
  renderSoldPhoneSearchSuggestions(input.value);
  renderSoldPhoneTable();
}`);

const newSearchInputFn = normalize(`function handleSoldPhoneSearchInput(input) {
  const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
  if (input.value.trim() !== "") {
    if (clearBtn) clearBtn.style.display = 'block';
    renderSoldPhoneSearchSuggestions(input.value);
  } else {
    if (clearBtn) clearBtn.style.display = 'none';
    hideSoldPhoneSearchSuggestions();
  }
  renderSoldPhoneTable();
}`);

if (!js.includes(oldSuggestionsBlock)) {
  console.error('oldSuggestionsBlock not found!');
  process.exit(1);
}
if (!js.includes(oldKeydownBlock)) {
  console.error('oldKeydownBlock not found!');
  process.exit(1);
}
if (!js.includes(oldSearchInputFn)) {
  console.error('oldSearchInputFn not found!');
  process.exit(1);
}

js = js.replace(oldSuggestionsBlock, newSuggestionsBlock);
js = js.replace(oldKeydownBlock, newKeydownBlock);
js = js.replace(oldSearchInputFn, newSearchInputFn);

fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Successfully updated js/main.js search suggestions for tab baohanh!');

