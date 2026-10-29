/* ============================================================
   KẾT NỐI VÀ TỰ ĐỘNG ĐỒNG BỘ CLOUD FIRESTORE TỨC THÌ (REALTIME)
   ============================================================ */
function initFirebaseRealtimeSync() {
  if (typeof db === 'undefined') {
    console.warn("Chưa tìm thấy biến kết nối Firebase (db)!");
    return;
  }

  // 1. Đồng bộ Kho Bán Máy (phones)
  db.collection('phones').onSnapshot(snapshot => {
    let list = [];
    snapshot.forEach(doc => list.push(doc.data()));
    if (list.length > 0) {
      phoneDatabase = list;
      localStorage.setItem('KIMCHI_PHONE_DB', JSON.stringify(phoneDatabase));
      if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
    }
  }, err => console.error("Lỗi sync phones:", err));

  // 2. Đồng bộ Bảo Hành (sold_phones)
  db.collection('sold_phones').onSnapshot(snapshot => {
    let list = [];
    snapshot.forEach(doc => list.push(doc.data()));
    if (list.length > 0) {
      soldPhoneDatabase = list;
      localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
      if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
    }
  }, err => console.error("Lỗi sync sold_phones:", err));

  // 3. Đồng bộ Main - Xác (mainxac)
  db.collection('mainxac').onSnapshot(snapshot => {
    let list = [];
    snapshot.forEach(doc => list.push(doc.data()));
    if (list.length > 0) {
      mainXacDatabase = list;
      localStorage.setItem('KIMCHI_MAIN_XAC_DB', JSON.stringify(list));
      if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
    }
  }, err => console.error("Lỗi sync mainxac:", err));

  // 4. Đồng bộ Sửa Chữa (repairs)
  db.collection('repairs').onSnapshot(snapshot => {
    let list = [];
    snapshot.forEach(doc => list.push(doc.data()));
    if (list.length > 0) {
      repairDatabase = list;
      localStorage.setItem('KIMCHI_REPAIR_DB', JSON.stringify(list));
      if (typeof renderRepairTable === 'function') renderRepairTable();
    }
  }, err => console.error("Lỗi sync repairs:", err));

  // 5. Đồng bộ Bán Gà (banga)
  db.collection('banga').onSnapshot(snapshot => {
    let list = [];
    snapshot.forEach(doc => list.push(doc.data()));
    if (list.length > 0) {
      bangaDatabase = list;
      localStorage.setItem('KIMCHI_BANGA_DB', JSON.stringify(bangaDatabase));
      if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
    }
  }, err => console.error("Lỗi sync banga:", err));
}

/* ============================================================
   HỆ THỐNG THÔNG BÁO TỰ TẮT SAU 2 GIÂY (TOAST NOTIFICATION)
   ============================================================ */
let _globalToastTimer = null;

function showToast(msg, duration = 2000) {
  if (msg === undefined || msg === null) return;
  const text = String(msg).trim();
  if (!text) return;

  let toast = document.getElementById('globalSystemToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalSystemToast';
    toast.className = 'global-system-toast';
    toast.onclick = function() { hideToast(); };
    toast.title = 'Bấm để tắt thông báo';
    document.body.appendChild(toast);
  }

  const isDanger = /lỗi|thất bại|không thể|cảnh báo|chưa nhập|xóa|vui lòng/i.test(text);
  const isWarn = /chú ý|cần|lưu ý/i.test(text);

  let iconHtml = '✔';
  let borderColor = '#10b981';
  let glowColor = 'rgba(16, 185, 129, 0.45)';
  let iconBg = '#065f46';
  let iconColor = '#34d399';

  if (isDanger) {
    iconHtml = '✕';
    borderColor = '#ef4444';
    glowColor = 'rgba(239, 68, 68, 0.45)';
    iconBg = '#7f1d1d';
    iconColor = '#f87171';
  } else if (isWarn) {
    iconHtml = '⚠️';
    borderColor = '#f59e0b';
    glowColor = 'rgba(245, 158, 11, 0.45)';
    iconBg = '#78350f';
    iconColor = '#fbbf24';
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let contentHtml = '';
  if (lines.length > 0) {
    contentHtml += `<div style="font-weight: 800; font-size: 0.98rem; color: #ffffff; margin-bottom: ${lines.length > 1 ? '6px' : '0'}; line-height: 1.4;">${escapeHtmlToast(lines[0])}</div>`;
    for (let i = 1; i < lines.length; i++) {
      contentHtml += `<div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; padding-left: 2px;">${escapeHtmlToast(lines[i])}</div>`;
    }
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
      <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.95rem; margin-top: 1px;">${iconHtml}</div>
      <div style="flex: 1; word-break: break-word;">${contentHtml}</div>
      <button type="button" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; line-height: 1; cursor: pointer; padding: 0 4px; margin-left: 4px;" title="Đóng">×</button>
    </div>
    <div id="globalToastProgressBar" style="position: absolute; bottom: 0; left: 0; height: 3px; background: ${borderColor}; width: 100%; border-radius: 0 0 12px 12px; transition: width ${duration}ms linear;"></div>
  `;

  toast.style.borderColor = borderColor;
  toast.style.boxShadow = `0 14px 40px rgba(0, 0, 0, 0.75), 0 0 20px ${glowColor}`;

  toast.classList.add('show');

  const pBar = document.getElementById('globalToastProgressBar');
  if (pBar) {
    void pBar.offsetWidth;
    pBar.style.width = '0%';
  }

  clearTimeout(_globalToastTimer);
  _globalToastTimer = setTimeout(() => {
    hideToast();
  }, duration);
}

function hideToast() {
  const toast = document.getElementById('globalSystemToast');
  if (toast) {
    toast.classList.remove('show');
  }
  clearTimeout(_globalToastTimer);
}

function escapeHtmlToast(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.alert = function(msg) {
  showToast(msg, 2000);
};
window.showToast = showToast;
window.hideToast = hideToast;

/* ============================================================
   HÀM RÚT GỌN TÊN MÁY TRONG BẢNG BÁN HÀNG
   ============================================================ */
function formatSalesShortDeviceName(name, item) {
  if (!name) return '';
  let str = name;

  let isPhoneItem = (item && (item.phoneName || item.imei || item.brand || (item.accessory && String(item.accessory).includes('Bán Máy')))) ||
                    /\([0-9a-zA-Z\s]{2,}\)$/.test(str) ||
                    /^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|sony|vsmart|google|pixel|máy ngoài|❤️❤️❤️)\s*[-–]/i.test(str);

  if (!isPhoneItem) {
    return (item && item.name) ? item.name.replace(/\s*\(x1\)/gi, '').trim() : str;
  }

  if (item && item.phoneName) {
    str = item.phoneName;
  }

  str = str.replace(/^(?:<[^>]+>|❤️❤️❤️|MÁY NGOÀI)\s*[-–]?\s*/gi, '');
  str = str.replace(/\s*\([A-Za-z0-9\s]+\)\s*$/, '');
  str = str.replace(/^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|apple\s*watch|sony|lg|google\s*pixel|pixel|asus|zte|lenovo|vsmart)\s*[-–]?\s*/gi, '');
  str = str.replace(/^[A-Za-z0-9\s]+?\s*[-–]\s*/, '');
  str = str.replace(/\b\d+\s*(?:gb|tb|mb|g|t)\b/gi, '');
  str = str.replace(/\(\s*\)/g, '');
  str = str.replace(/\s+/g, ' ').trim();

  return str || name;
}
window.formatSalesShortDeviceName = formatSalesShortDeviceName;

function switchMainTab(tabName, btnElement) {
  document.querySelectorAll('.main-tab-btn-v').forEach(b => b.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    const matchingBtn = document.querySelector(`.main-tab-btn-v[onclick*="${tabName}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }

  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const targetTab = document.getElementById('tab-' + tabName);
  if (targetTab) targetTab.classList.add('active');

  if (tabName === 'baogia') {
    if (typeof renderPartsTable === 'function') renderPartsTable();
  }
  if (tabName === 'phanmem') {
    const titleBar = document.getElementById('swMainTitleBar');
    const btnCongNo = document.getElementById('swBtnCongNo');
    if (titleBar) {
      if (typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) {
        titleBar.innerText = 'DANH SÁCH NỢ';
        titleBar.classList.add('is-debt');
        titleBar.style.color = '#facc15';
      } else {
        titleBar.innerText = 'DANH SÁCH PHẦN MỀM';
        titleBar.classList.remove('is-debt');
        titleBar.style.color = '#ffffff';
      }
    }
    if (btnCongNo) {
      btnCongNo.innerText = (typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) ? 'PHẦN MỀM' : 'CÔNG NỢ';
      if (typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) btnCongNo.classList.add('active');
      else btnCongNo.classList.remove('active');
    }
    if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
    if (typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive && typeof renderSoftwareDebtTable === 'function') {
      renderSoftwareDebtTable();
    }
  }
  if (tabName === 'banhang') {
    renderSalesTable(salesDatabase);
  }
  if (tabName === 'banga') {
    renderBangaTable(bangaDatabase);
  }
  if (tabName === 'banmay') {
    renderPhoneGrid();
  }
  if (tabName === 'baohanh') {
    renderSoldPhoneTable();
  }
  if (tabName === 'suachua') {
    if (typeof renderRepairTable === 'function') renderRepairTable();
  }
  if (tabName === 'congno') {
    if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
  }
  if (tabName === 'baocao') {
    if (typeof renderFinancialReports === 'function') renderFinancialReports();
    if (typeof renderActivityLogTable === 'function') renderActivityLogTable();
    if (typeof renderSystemAccountsTable === 'function') renderSystemAccountsTable();
  }
  if (tabName === 'quynhbupbe') {
    if (typeof loadQuynhNotes === 'function') loadQuynhNotes();
    if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
  }
}
window.switchMainTab = switchMainTab;

function validatePriceKeypress(e) {
  let charCode = e.charCode ? e.charCode : e.keyCode;
  let charStr = String.fromCharCode(charCode);
  let inputVal = e.target.value;

  if (!/[0-9\.]/.test(charStr)) {
    e.preventDefault();
    return;
  }

  if (charStr === '.' && inputVal.includes('.')) {
    e.preventDefault();
    return;
  }

  let cleanDigits = inputVal.replace(/\D/g, '');
  if (cleanDigits.length >= 5 && charStr !== '.') {
    e.preventDefault();
  }
}

function formatPriceStr(val) {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') {
    val = Math.round(val);
  }
  let str = val.toString().trim();
  let isNeg = str.startsWith('-');
  let clean = str.replace(/\D/g, '');
  if (!clean) return '';
  clean = clean.replace(/^0+(?=\d)/, '');
  let formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return isNeg ? `-${formatted}` : formatted;
}

function parsePriceNum(val) {
  if (val === null || val === undefined || val === '') return 0;
  let str = val.toString().trim();
  let isNeg = str.startsWith('-');
  let clean = str.replace(/\D/g, '');
  if (!clean) return 0;
  let num = parseInt(clean, 10);
  return isNeg ? -num : num;
}

function autoExpandMoney(val) {
  if (val === null || val === undefined || val === '') return '';
  return formatPriceStr(val);
}
window.autoExpandMoney = autoExpandMoney;

function parseRawNumber(val) {
  return parsePriceNum(val);
}

function formatCurrencyInput(input) {
  let cursorPosition = input.selectionStart;
  let originalLength = input.value.length;
  input.value = formatPriceStr(input.value);
  let newLength = input.value.length;
  cursorPosition = cursorPosition + (newLength - originalLength);
  if (cursorPosition < 0) cursorPosition = 0;
  input.setSelectionRange(cursorPosition, cursorPosition);
}

function formatBrandDeviceName(str) {
  if (!str || typeof str !== 'string') return str || '';
  let res = str;
  res = res.replace(/(?<!\p{L})(iphone|Iphone)(?!\p{L})/gu, 'iPhone');
  res = res.replace(/(?<!\p{L})(ipad|Ipad)(?!\p{L})/gu, 'iPad');
  res = res.replace(/(?<!\p{L})se(?!\p{L})/gui, 'SE');
  return res;
}

function toTitleCase(str) {
  if (!str || typeof str !== 'string') return '';
  let chunks = str.split(/(\s+)/);
  let res = chunks.map(chunk => {
    if (!chunk || /^\s+$/.test(chunk)) return chunk;
    if (chunk.length > 7) return chunk;

    return chunk.replace(/[\p{L}\p{N}]+/gu, function(word) {
      if (word === 'IPHONE') return 'IPHONE';
      if (word === 'IPAD') return 'IPAD';
      if (word.toLowerCase() === 'iphone') return 'iPhone';
      if (word.toLowerCase() === 'ipad') return 'iPad';
      if (/^\d+\p{L}+$/u.test(word)) return word;
      if (word.length === 2) {
        if (word.toLowerCase() === 'se') return 'SE';
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  }).join('');

  res = res.replace(/\bSA Mạc\b/gi, 'Sa Mạc');
  res = res.replace(/\bSA Mac\b/gi, 'Sa Mạc');
  return res;
}

function formatStorageValue(str) {
  if (!str || typeof str !== 'string') return '';
  let s = str.trim().replace(/\s+/g, ' ');

  s = s.replace(/\b(\d+)\s*\/\s*(\d+)(\s*gb)?\b/gi, '$1/$2GB');
  s = s.replace(/\b(\d+)\s*\+\s*(\d+)(\s*gb)?\b/gi, '$1+$2GB');
  if (/^\d+$/.test(s)) return `${s}GB`;
  s = s.replace(/(\d+)\s*(gb|tb|mb|kb)\b/gi, (match, num, unit) => num + unit.toUpperCase());
  s = s.replace(/(\d+)\s*(g|t)\b/gi, (match, num, unit) => num + unit.toUpperCase());
  s = s.replace(/(^|[\s\/\-\(\[\{.,:+])(gb|tb|mb|kb)\b/gi, (match, sep, unit) => sep + unit.toUpperCase());

  return s;
}
window.formatStorageValue = formatStorageValue;
window.formatStorageDisplay = formatStorageValue;

function formatStorageInput(input) {
  if (!input || !input.value) return;
  input.value = formatStorageValue(input.value);
}
window.formatStorageInput = formatStorageInput;

function formatTitleCaseInput(input) {
  if (!input) return;
  let val = input.value;
  if (!val) return;
  if (/\s$/.test(val)) {
    let cursorPosition = input.selectionStart;
    let formatted = toTitleCase(val);
    if (formatted !== val) {
      input.value = formatted;
      if (cursorPosition !== null) {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }
  }
}

function getHexColor(colorName) {
  if (!colorName) return '#f59e0b';
  let raw = colorName.toString().trim().toLowerCase();
  let c = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  
  if (c.includes('xanh la') || c.includes('green')) return '#10b981';
  if (c.includes('den') || c.includes('black')) return '#1f2937';
  if (c.includes('trang') || c.includes('white')) return '#ffffff';
  if (c.includes('vang') || c.includes('gold')) return '#eab308';
  if (c.includes('tim') || c.includes('purple')) return '#a855f7';
  if (c.includes('sa mac') || c.includes('desert')) return '#d4a373';
  if (c.includes('tu nhien') || c.includes('natural') || c.includes('titan')) return '#9ca3af';
  if (c.includes('xam') || c.includes('grey') || c.includes('gray') || c.includes('space')) return '#64748b';
  if (c.includes('xanh duong') || c.includes('xanh bien') || c.includes('blue')) return '#3b82f6';
  if (c.includes('do') || c.includes('red')) return '#ef4444';
  if (c.includes('hong') || c.includes('pink')) return '#ec4899';
  if (c.includes('cam') || c.includes('orange')) return '#f97316';
  if (c.includes('bac') || c.includes('silver')) return '#e2e8f0';
  
  return '#f59e0b';
}

function getColorDotHtml(colorName, sizePx = 28) {
  let raw = (colorName || '').toString().trim().toLowerCase();
  let c = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  let isBlack = c.includes('den') || c.includes('black');
  let isWhite = c.includes('trang') || c.includes('white');
  let hex = getHexColor(colorName);

  if (isBlack) {
    return `<span style="width: ${sizePx}px; height: ${sizePx}px; border-radius: 50%; box-sizing: border-box; background: radial-gradient(circle at 35% 35%, #475569 0%, #1e293b 45%, #000000 100%); display: inline-block; flex-shrink: 0; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.85);" title="Màu: ${escapeHtml(colorName || 'Đen')}"></span>`;
  }

  if (isWhite) {
    return `<span style="width: ${sizePx}px; height: ${sizePx}px; border-radius: 50%; box-sizing: border-box; background-color: #ffffff; display: inline-block; flex-shrink: 0; border: 2px solid #94a3b8; box-shadow: 0 0 8px rgba(255, 255, 255, 0.65);" title="Màu: ${escapeHtml(colorName || 'Trắng')}"></span>`;
  }

  return `<span style="width: ${sizePx}px; height: ${sizePx}px; border-radius: 50%; box-sizing: border-box; background-color: ${hex}; display: inline-block; flex-shrink: 0; border: 1.5px solid rgba(255, 255, 255, 0.45); box-shadow: 0 0 8px ${hex}aa;" title="Màu: ${escapeHtml(colorName || 'Mặc định')}"></span>`;
}

function formatPinByBrand(rawVal, brand = null, phoneName = null) {
  if (rawVal === undefined || rawVal === null || String(rawVal).trim() === '') {
    let isIp = false;
    if (brand || phoneName) {
      isIp = isPhoneBrandIphone(brand, phoneName);
    } else if (typeof currentBrandFilter !== 'undefined') {
      isIp = (currentBrandFilter === 'IPHONE');
    }
    return isIp ? '100%' : '5.000 mAh';
  }

  let str = String(rawVal).trim();
  let digits = str.replace(/[^\d]/g, '');
  if (digits) {
    let num = parseInt(digits, 10);
    if (num >= 50 && num <= 100) return `${num}%`;
    if (num >= 101) {
      let formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${formatted} mAh`;
    }
    if (/mah/i.test(str)) return `${digits} mAh`;
    return `${num}%`;
  }

  return str;
}
window.formatPinByBrand = formatPinByBrand;

function formatBatteryInput(input) {
  if (!input || !input.value) return;
  let brand = (typeof currentBrandFilter !== 'undefined') ? currentBrandFilter : null;
  let editId = document.getElementById('mEditId') ? document.getElementById('mEditId').value : null;
  let phoneName = document.getElementById('mName') ? document.getElementById('mName').value : '';
  if (editId && typeof phoneDatabase !== 'undefined') {
    let p = phoneDatabase.find(x => x.id == editId);
    if (p && p.brand) brand = p.brand;
  }
  input.value = formatPinByBrand(input.value, brand, phoneName);
}

let dropdownConfigs = {
  name: {
    listId: 'mNameList',
    storageKey: 'KIMCHI_OPT_NAME',
    defaults: ["X", "XS", "XS Max", "11", "11 Pro Max", "12", "12 Pro Max", "13", "13 Pro Max", "14", "14 Pro Max", "15", "15 Pro Max", "16 Pro Max"]
  },
  color: {
    listId: 'mColorList',
    storageKey: 'KIMCHI_OPT_COLOR',
    defaults: ["Đen", "Trắng", "Titan Tự Nhiên", "Titan Sa Mạc", "Vàng Gold", "Xanh Dương", "Tím", "Xám", "Xanh Lá"]
  },
  storage: {
    listId: 'mStorageList',
    storageKey: 'KIMCHI_OPT_STORAGE',
    defaults: ["64GB", "128GB", "256GB", "512GB", "1TB"]
  },
  pinStatus: {
    listId: 'mPinStatusList',
    storageKey: 'KIMCHI_OPT_PIN_STATUS',
    defaults: ["Pin Zin", "Pin Thay", "Pin New"]
  },
  pinPct: {
    listId: 'mPinPctList',
    storageKey: 'KIMCHI_OPT_PIN_PCT',
    defaults: ["100%", "99%", "98%", "97%", "95%", "90%", "88%", "4.500 mAh", "5.000 mAh", "6.000 mAh"]
  },
  condition: {
    listId: 'mConditionList',
    storageKey: 'KIMCHI_OPT_CONDITION',
    defaults: ["Likenew 99%", "Zin Đẹp 99%", "Kính Phẩy Nhẹ", "Máy 98%"]
  },
  origin: {
    listId: 'mOriginList',
    storageKey: 'KIMCHI_OPT_ORIGIN',
    defaults: ["VN/A", "LL/A", "KH/A", "JA/A"]
  }
};

function getDropdownItems(type) {
  let cfg = dropdownConfigs[type];
  if (!cfg) return [];
  let stored = localStorage.getItem(cfg.storageKey);
  if (stored !== null) {
    try { 
      let list = JSON.parse(stored);
      if (Array.isArray(list)) return list;
    } catch(e){}
  }
  return [...cfg.defaults];
}

function renderDropdownDatalist(type) {
  let cfg = dropdownConfigs[type];
  if (!cfg) return;
  let datalist = document.getElementById(cfg.listId);
  if (!datalist) return;
  let items = getDropdownItems(type);
  datalist.innerHTML = items.map(v => `<option value="${v}">`).join('');
}

function renderAllDropdowns() {
  Object.keys(dropdownConfigs).forEach(t => renderDropdownDatalist(t));
}

function getVietnamDate() {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const p = {};
    parts.forEach(part => { p[part.type] = part.value; });
    return new Date(parseInt(p.year, 10), parseInt(p.month, 10) - 1, parseInt(p.day, 10), parseInt(p.hour, 10), parseInt(p.minute, 10), parseInt(p.second, 10));
  } catch (e) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 7));
  }
}

function getCurrentTimeStr() {
  const d = getVietnamDate();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getCurrentDateStr() {
  const d = getVietnamDate();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ============================================================
   XỬ LÝ ĐĂNG NHẬP / ĐĂNG XUẤT CHUẨN XÁC
   ============================================================ */
function handleLogin(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const passInput = document.getElementById('loginPass');
  const rememberMe = document.getElementById('rememberMe');
  const errBox = document.getElementById('loginError');
  const pass = passInput ? passInput.value.trim() : '';

  if (pass === '123456' || pass !== '') {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (errBox) errBox.style.display = 'none';
    if (document.body) document.body.classList.remove('login-active');

    sessionStorage.setItem('KIMCHI_LOGGED', 'true');
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem('KIMCHI_LOGGED', 'true');
    }
    showToast('✔ Đăng nhập thành công! Chào mừng bạn.');
    return false;
  } else {
    if (errBox) {
      errBox.style.display = 'block';
      errBox.innerText = 'Vui lòng nhập mật khẩu!';
    }
    return false;
  }
}

function handleLogout() {
  sessionStorage.removeItem('KIMCHI_LOGGED');
  localStorage.removeItem('KIMCHI_LOGGED');
  const loginScreen = document.getElementById('loginScreen');
  if (loginScreen) loginScreen.style.display = 'flex';
  if (document.body) document.body.classList.add('login-active');
  const passInput = document.getElementById('loginPass');
  if (passInput) passInput.value = '';
}
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;

function checkAutoLogin() {
  const isLoggedSession = sessionStorage.getItem('KIMCHI_LOGGED') === 'true';
  const isLoggedLocal = localStorage.getItem('KIMCHI_LOGGED') === 'true';
  if (isLoggedSession || isLoggedLocal) {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (document.body) document.body.classList.remove('login-active');
  } else {
    if (document.body) document.body.classList.add('login-active');
  }
}

/* ============================================================
   KHỞI TẠO BỘ NHỚ LOCAL (FALLBACK KHI CHƯA LOAD XONG FIRESTORE)
   ============================================================ */
let salesDatabase = JSON.parse(localStorage.getItem('KIMCHI_SALES_DB')) || [];
let bangaDatabase = JSON.parse(localStorage.getItem('KIMCHI_BANGA_DB')) || (window.SEED_BANGA_DATA || []);
let phoneDatabase = JSON.parse(localStorage.getItem('KIMCHI_PHONE_DB')) || (window.SEED_PHONES_DATA || []);
let soldPhoneDatabase = JSON.parse(localStorage.getItem('KIMCHI_SOLD_PHONE_DB')) || (window.SEED_SOLD_DATA || []);
let mainXacDatabase = JSON.parse(localStorage.getItem('KIMCHI_MAIN_XAC_DB')) || (window.SEED_MAINXAC_DATA || []);
let repairDatabase = JSON.parse(localStorage.getItem('KIMCHI_REPAIR_DB')) || (window.SEED_REPAIRS_DATA || []);
let softwareDatabase = JSON.parse(localStorage.getItem('KIMCHI_PHANMEM_DB')) || [];

function savePhoneStorage() {
  localStorage.setItem('KIMCHI_PHONE_DB', JSON.stringify(phoneDatabase));
  localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
}
function saveSalesStorage() {
  localStorage.setItem('KIMCHI_SALES_DB', JSON.stringify(salesDatabase));
}
function saveBangaStorage() {
  localStorage.setItem('KIMCHI_BANGA_DB', JSON.stringify(bangaDatabase));
}
function saveRepairDb() {
  localStorage.setItem('KIMCHI_REPAIR_DB', JSON.stringify(repairDatabase));
}

let currentBrandFilter = "ALL";
let currentPriceFilter = "ALL";
let isPhonePricesHidden = false;
let phoneViewMode = localStorage.getItem('kimchi_phone_view_mode') || 'grid';

function calcModalProfit() {
  const pIn = parsePriceNum(document.getElementById('mPriceIn')?.value);
  const pOut = parsePriceNum(document.getElementById('mPriceOut')?.value);
  const profitEl = document.getElementById('mProfit');
  const profitDisplayEl = document.getElementById('mProfitDisplay');
  if (pOut > 0) {
    let profit = pOut - pIn;
    const profitStr = (profit < 0 ? '-' : '') + formatPriceStr(Math.abs(profit));
    if (profitEl) profitEl.value = profitStr;
    if (profitDisplayEl) {
      profitDisplayEl.innerText = profitStr;
      profitDisplayEl.style.color = profit >= 0 ? 'var(--green-badge)' : '#f87171';
    }
  } else {
    if (profitEl) profitEl.value = '';
    if (profitDisplayEl) {
      profitDisplayEl.innerText = '0';
      profitDisplayEl.style.color = 'var(--green-badge)';
    }
  }
}

/* ============================================================
   HÀM BẬT / TẮT POPUP BÁN MÁY CHUẨN XÁC
   ============================================================ */
function openPhoneModal(editId = null) {
  renderAllDropdowns();
  const elEditId = document.getElementById('mEditId');
  if (elEditId) elEditId.value = '';

  const elTitle = document.getElementById('phoneModalTitle');
  if (elTitle) elTitle.innerText = "Thêm Thông Tin Máy Mới";

  ['mName', 'mImei', 'mColor', 'mStorage', 'mCondition', 'mPinStatus', 'mPinPct', 'mOrigin', 'mPriceIn', 'mPriceOut', 'mNote'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });

  const profitEl = document.getElementById('mProfit');
  if (profitEl) profitEl.value = '';

  const profitDisplayEl = document.getElementById('mProfitDisplay');
  if (profitDisplayEl) {
    profitDisplayEl.innerText = '0';
    profitDisplayEl.style.color = 'var(--green-badge)';
  }

  const statusEl = document.getElementById('mStatus');
  if (statusEl) statusEl.value = 'Còn Hàng';

  const dateEl = document.getElementById('mDateVal');
  if (dateEl) dateEl.value = getCurrentDateStr();

  if (editId) {
    const p = phoneDatabase.find(item => item.id == editId);
    if (p) {
      if (elTitle) elTitle.innerText = "Sửa Thông Tin Máy";
      if (elEditId) elEditId.value = p.id;
      if (document.getElementById('mName')) document.getElementById('mName').value = p.name || '';
      if (document.getElementById('mColor')) document.getElementById('mColor').value = p.color || '';
      if (document.getElementById('mImei')) document.getElementById('mImei').value = p.imei || '';
      if (document.getElementById('mStorage')) document.getElementById('mStorage').value = toTitleCase((p.storage || '').replace(/[()]/g, ''));
      if (document.getElementById('mCondition')) document.getElementById('mCondition').value = p.condition || '';
      if (document.getElementById('mPinStatus')) document.getElementById('mPinStatus').value = p.pinStatus || '';
      if (document.getElementById('mPinPct')) document.getElementById('mPinPct').value = formatPinByBrand(p.pin, p.brand, p.name);
      if (document.getElementById('mOrigin')) document.getElementById('mOrigin').value = p.origin || '';
      if (document.getElementById('mPriceIn')) document.getElementById('mPriceIn').value = p.priceIn || '';
      if (document.getElementById('mPriceOut')) document.getElementById('mPriceOut').value = p.price || '';
      if (statusEl) statusEl.value = p.status || 'Còn Hàng';
      if (document.getElementById('mNote')) document.getElementById('mNote').value = p.note || '';
      if (dateEl) dateEl.value = p.date || getCurrentDateStr();
      calcModalProfit();
    }
  }

  const modal = document.getElementById('phoneModal');
  if (modal) {
    modal.style.zIndex = '100000';
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closePhoneModal() {
  const modal = document.getElementById('phoneModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}
window.openPhoneModal = openPhoneModal;
window.closePhoneModal = closePhoneModal;

/* ============================================================
   HÀM BẬT / TẮT POPUP TẠO PHIẾU BÁN HÀNG
   ============================================================ */
function openTicketModalWithTarget(target) {
  const modal = document.getElementById('ticketModal');
  const targetSelect = document.getElementById('tTargetList');
  if (targetSelect) targetSelect.value = target;

  const titleSpan = document.querySelector('#ticketModal .ticket-header span');
  if (titleSpan) {
    titleSpan.innerText = target === 'Bán Gà' ? 'Tạo Phiếu Bán Gà' : 'Tạo Phiếu Bán Hàng';
  }

  const dateInput = document.getElementById('tDateVal');
  if (dateInput) dateInput.value = getCurrentDateStr();
  const timeInput = document.getElementById('tTimeVal');
  if (timeInput) timeInput.value = getCurrentTimeStr();

  if (modal) {
    modal.style.zIndex = '100000';
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closeTicketModal() {
  const modal = document.getElementById('ticketModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}
window.openTicketModalWithTarget = openTicketModalWithTarget;
window.closeTicketModal = closeTicketModal;

/* ============================================================
   HÀM THÊM / SỬA MÁY MỚI LƯU TRỰC TIẾP LÊN CLOUD FIRESTORE
   ============================================================ */
async function saveNewPhone(e) {
  e.preventDefault();
  const editId = document.getElementById('mEditId')?.value;
  const existingP = editId ? phoneDatabase.find(x => x.id == editId) : null;
  let resolvedBrand = existingP ? (existingP.brand || (currentBrandFilter === 'ALL' ? 'IPHONE' : currentBrandFilter)) : (currentBrandFilter === 'ALL' ? 'IPHONE' : currentBrandFilter);
  const brand = resolvedBrand;
  const name = toTitleCase(document.getElementById('mName')?.value.trim() || '');
  const color = toTitleCase(document.getElementById('mColor')?.value.trim() || '');
  const imei = document.getElementById('mImei')?.value.trim() || '';
  const storage = formatStorageValue(toTitleCase(document.getElementById('mStorage')?.value.trim() || ''));
  const condition = toTitleCase(document.getElementById('mCondition')?.value.trim() || '');
  const pinStatus = toTitleCase(document.getElementById('mPinStatus')?.value.trim() || '');
  
  let pinPctRaw = document.getElementById('mPinPct')?.value.trim() || '';
  const pinPct = formatPinByBrand(pinPctRaw, brand, name);

  const origin = document.getElementById('mOrigin')?.value.trim().toUpperCase() || 'VN/A';
  const priceOut = document.getElementById('mPriceOut')?.value.trim() || '0';
  const priceIn = document.getElementById('mPriceIn')?.value.trim() || '0';
  const status = document.getElementById('mStatus') ? document.getElementById('mStatus').value : 'Còn Hàng';
  const note = toTitleCase(document.getElementById('mNote')?.value.trim() || '');
  const dateIn = document.getElementById('mDateVal')?.value.trim() || getCurrentDateStr();

  const phoneItem = {
    id: editId ? (parseFloat(editId) || editId) : (Date.now() + Math.random()),
    brand,
    name,
    color,
    storage: storage ? `(${storage})` : '',
    imei,
    price: priceOut,
    condition,
    pinStatus,
    pin: pinPct,
    origin,
    priceIn: priceIn || '0',
    status: status || 'Còn Hàng',
    note,
    date: dateIn
  };

  // 1. Đẩy dữ liệu lưu lên Cloud Firestore
  if (typeof db !== 'undefined') {
    try {
      await db.collection('phones').doc(String(phoneItem.id)).set(phoneItem);
    } catch (err) {
      console.error("Lỗi đẩy máy lên Firebase:", err);
    }
  }

  // 2. Cập nhật mảng cục bộ
  if (editId) {
    const idx = phoneDatabase.findIndex(x => x.id == editId);
    if (idx !== -1) phoneDatabase[idx] = phoneItem;
  } else {
    phoneDatabase.unshift(phoneItem);
  }

  savePhoneStorage();
  closePhoneModal();
  renderPhoneGrid();
  showToast("✔ Đã lưu máy thành công lên Firebase!");
}
window.saveNewPhone = saveNewPhone;

/* ============================================================
   HÀM XÓA MÁY ĐỒNG BỘ FIRESTORE
   ============================================================ */
async function deletePhone(id) {
  const p = phoneDatabase.find(item => item.id == id);
  const confirmWord = prompt("⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn máy này khỏi kho!\n\nNhập chữ \"yes\" để xác nhận xóa:");
  if (confirmWord !== null && confirmWord.trim().toLowerCase() === "yes") {
    if (typeof db !== 'undefined') {
      try {
        await db.collection('phones').doc(String(id)).delete();
      } catch (err) {
        console.error("Lỗi xóa document trên Firestore:", err);
      }
    }

    phoneDatabase = phoneDatabase.filter(item => item.id != id);
    savePhoneStorage();
    renderPhoneGrid();
    showToast("Đã xóa máy khỏi kho thành công!");
  }
}
window.deletePhone = deletePhone;

/* ============================================================
   HÀM XÁC NHẬN BÁN MÁY ĐỒNG BỘ CLOUD (phones -> sold_phones)
   ============================================================ */
function confirmSellPhone(e) {
  e.preventDefault();
  const id = document.getElementById('sellPhoneId')?.value;
  const idx = phoneDatabase.findIndex(p => p.id == id);
  if (idx === -1) {
    alert('Không tìm thấy thông tin máy trong kho!');
    return;
  }

  const targetList = document.getElementById('sellTargetList')?.value;
  const paymentMethod = document.getElementById('sellPaymentMethod')?.value;
  const warranty = document.getElementById('sellWarranty')?.value;

  if (!targetList || !paymentMethod || !warranty) {
    alert('Vui lòng chọn đầy đủ: Lưu Vào, Thanh Toán và Bảo Hành!');
    return;
  }

  const customerName = toTitleCase(document.getElementById('sellCustomerName')?.value.trim() || '') || 'Khách Lẻ';
  const actualPriceOut = document.getElementById('sellPriceOut')?.value.trim() || '0';
  const dateVal = document.getElementById('sellDateVal')?.value.trim() || getCurrentDateStr();
  const timeVal = getCurrentTimeStr();
  const fullDateTime = `${timeVal} - ${dateVal}`;

  const gSac = document.getElementById('giftSac')?.value.trim() || '';
  const gOp = document.getElementById('giftOp')?.value.trim() || '';
  const gCluc = document.getElementById('giftCluc')?.value.trim() || '';
  const gKhac = document.getElementById('giftKhac')?.value.trim() || '';

  let gifts = [];
  if (gSac) gifts.push(`Sạc: ${gSac}`);
  if (gOp) gifts.push(`Ốp: ${gOp}`);
  if (gCluc) gifts.push(`C.Lực: ${gCluc}`);
  if (gKhac) gifts.push(`Khác: ${gKhac}`);
  let giftStr = gifts.length > 0 ? ` [Quà Tặng: ${gifts.join(', ')}]` : '';
  let profitValStr = document.getElementById('sellProfitVal')?.value || '0';

  let soldItem = phoneDatabase.splice(idx, 1)[0];
  let totalGiftMoney = parsePriceNum(document.getElementById('sellTotalGiftMoney')?.value || 0);

  soldItem.price = actualPriceOut;
  soldItem.soldDate = dateVal;
  soldItem.customer = customerName;
  soldItem.warranty = warranty;
  soldItem.targetList = targetList;
  soldItem.giftStr = giftStr;
  soldItem.totalGiftMoney = totalGiftMoney;
  soldItem.soldDateTime = fullDateTime;
  soldItem.status = 'Đã bán';

  soldPhoneDatabase.unshift(soldItem);

  // ĐỒNG BỘ CLOUD FIRESTORE TỨC THÌ
  if (typeof db !== 'undefined') {
    db.collection('phones').doc(String(soldItem.id)).delete().catch(console.error);
    db.collection('sold_phones').doc(String(soldItem.id)).set(soldItem).catch(console.error);
  }

  let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
  let soldName = formatStorageDisplay(soldItem.name || '');
  let displayName = formatStorageDisplay(`${soldItem.brand} - ${soldName} ${cleanStorage ? cleanStorage : ''} (${soldItem.imei})`);

  let record = {
    id: Date.now() + Math.random(),
    name: displayName,
    brand: soldItem.brand,
    phoneName: soldItem.name,
    storage: cleanStorage,
    color: soldItem.color,
    imei: soldItem.imei,
    total: actualPriceOut,
    priceIn: soldItem.priceIn || '0',
    profit: profitValStr,
    method: paymentMethod,
    dateTime: fullDateTime,
    customer: customerName
  };

  if (targetList === 'Bán Gà') {
    bangaDatabase.unshift(record);
    saveBangaStorage();
    if (typeof db !== 'undefined') db.collection('banga').doc(String(record.id)).set(record).catch(console.error);
    renderBangaTable(bangaDatabase);
  } else {
    salesDatabase.unshift(record);
    saveSalesStorage();
    renderSalesTable(salesDatabase);
  }

  savePhoneStorage();
  closeSellPhoneModal();
  renderPhoneGrid();
  renderSoldPhoneTable();

  alert(`Đã bán máy thành công và chuyển vào sổ Bảo Hành đám mây!`);
}
window.confirmSellPhone = confirmSellPhone;

function openSellPhoneModal(id) {
  const p = phoneDatabase.find(item => item.id == id);
  if (!p) return;
  document.getElementById('sellPhoneId').value = p.id;
  document.getElementById('sellPhoneSummaryTitle').innerText = `${p.brand} - ${p.name}`;
  document.getElementById('sellPhoneSummaryImei').innerText = p.imei || 'Chưa có';
  document.getElementById('sellPriceOut').value = p.price || '';
  document.getElementById('sellDateVal').value = getCurrentDateStr();

  const modal = document.getElementById('sellPhoneModal');
  if (modal) {
    modal.style.zIndex = '100000';
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}
window.openSellPhoneModal = openSellPhoneModal;

function closeSellPhoneModal() {
  const modal = document.getElementById('sellPhoneModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}
window.closeSellPhoneModal = closeSellPhoneModal;

// CÁC HÀM TIỆN ÍCH GIAO DIỆN
function filterBrand(brandName, btn) {
  currentBrandFilter = brandName;
  document.querySelectorAll('.brand-tabs-horizontal .brand-btn-h').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const actionBtn = document.getElementById('btnTopActionPhone');
  if (actionBtn) {
    if (brandName === 'ALL') {
      actionBtn.innerText = 'CHUYỂN GIAO DIỆN';
      actionBtn.onclick = function() { togglePhoneViewMode(); };
    } else {
      actionBtn.innerText = '+ THÊM MÁY MỚI';
      actionBtn.onclick = function() { openPhoneModal(); };
    }
  }
  renderPhoneGrid();
}
window.filterBrand = filterBrand;

function togglePhoneViewMode() {
  phoneViewMode = (phoneViewMode === 'grid') ? 'table' : 'grid';
  localStorage.setItem('kimchi_phone_view_mode', phoneViewMode);
  renderPhoneGrid();
}
window.togglePhoneViewMode = togglePhoneViewMode;

function renderPhoneGrid() {
  const container = document.getElementById('phoneGridContainer');
  if (!container) return;

  let filtered = phoneDatabase;
  if (currentBrandFilter !== 'ALL') {
    filtered = filtered.filter(p => (p.brand || '').toUpperCase().includes(currentBrandFilter));
  }

  const elInvCount = document.getElementById('phoneInventoryCountText');
  if (elInvCount) elInvCount.innerText = `${filtered.length} Máy`;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #94a3b8;">Không có máy nào trong kho</div>`;
    return;
  }

  container.className = phoneViewMode === 'table' ? 'phone-table-container' : 'phone-grid';

  if (phoneViewMode === 'table') {
    container.innerHTML = `
      <table class="phone-horizontal-table">
        <thead>
          <tr>
            <th style="text-align: left; padding-left: 18px;">TÊN MÁY</th>
            <th style="text-align: center;">DUNG LƯỢNG</th>
            <th style="text-align: center;">GIÁ BÁN</th>
            <th style="text-align: center;">MÀU SẮC</th>
            <th style="text-align: center;">PIN</th>
            <th style="text-align: right;">GIÁ NHẬP</th>
            <th style="text-align: right; padding-right: 18px;">THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td style="text-align: left; padding-left: 18px; font-weight: 800; color: #10b981; font-size: 1.2rem;">
                ${escapeHtmlToast(p.name)} <span style="color: #ef4444; margin-left: 6px;">(${p.imei})</span>
              </td>
              <td style="text-align: center; color: #facc15; font-weight: 800;">${p.storage || '—'}</td>
              <td style="text-align: center; font-weight: 900; color: #f87171; font-size: 1.2rem;">${p.price}</td>
              <td style="text-align: center;">${p.color || '—'}</td>
              <td style="text-align: center;">${p.pin || '100%'}</td>
              <td style="text-align: right; color: #cbd5e1;">${p.priceIn || '0'}</td>
              <td style="text-align: right; padding-right: 18px;">
                <button type="button" onclick="openPhoneModal('${p.id}')" style="background:#1e293b; color:#38bdf8; border:1px solid #334155; border-radius:6px; padding:4px 8px; cursor:pointer;">Sửa</button>
                <button type="button" onclick="deletePhone('${p.id}')" style="background:#7f1d1d; color:#fca5a5; border:1px solid #991b1b; border-radius:6px; padding:4px 8px; cursor:pointer; margin-left:4px;">Xóa</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    container.innerHTML = filtered.map(p => `
      <div class="phone-card" ondblclick="openPhoneModal('${p.id}')">
        <div class="phone-card-header">
          <div class="phone-header-left">
            <span class="phone-card-name">${escapeHtmlToast(p.name)}</span>
            ${getColorDotHtml(p.color, 20)}
            <span class="phone-card-storage">${p.storage || ''}</span>
          </div>
          <div class="phone-header-center">
            <span class="phone-card-price">${p.price}</span>
          </div>
          <div class="phone-header-right">
            <span class="phone-card-imei">${p.imei}</span>
          </div>
        </div>
        <div class="phone-card-specs">
          <div class="phone-spec-col col-origin">${p.origin || 'VN/A'}</div>
          <div class="phone-spec-col col-condition">${p.condition || 'Zin'}</div>
          <div class="phone-spec-col col-pin-status">${p.pinStatus || 'Pin Zin'}</div>
          <div class="phone-spec-col col-pin-pct">${p.pin || '100%'}</div>
        </div>
      </div>
    `).join('');
  }
}
window.renderPhoneGrid = renderPhoneGrid;

function renderSalesTable() {
  const tbody = document.getElementById('salesTableBody');
  if (!tbody) return;
  tbody.innerHTML = salesDatabase.map(item => `
    <tr>
      <td style="font-weight: 800; font-size: 1.15rem;">${escapeHtmlToast(item.name)}</td>
      <td style="text-align: center; color: #facc15; font-weight: 900; font-size: 1.3rem;">${item.total}</td>
      <td style="text-align: center; font-weight: 800;">${item.priceIn || '0'}</td>
      <td style="text-align: center; color: #10b981; font-weight: 900;">${item.profit || '0'}</td>
      <td style="text-align: center;">${item.method || 'Tiền mặt'}</td>
      <td style="text-align: center;">${item.dateTime || ''}</td>
      <td style="text-align: center;"><span class="badge-payment-paid">ĐÃ TRẢ</span></td>
    </tr>
  `).join('');
}
window.renderSalesTable = renderSalesTable;

function renderBangaTable() {
  const tbody = document.getElementById('bangaTableBody');
  if (!tbody) return;
  tbody.innerHTML = bangaDatabase.map(item => `
    <tr>
      <td style="font-weight: 800; font-size: 1.15rem;">${escapeHtmlToast(item.name)}</td>
      <td style="text-align: center; color: #f87171; font-weight: 900; font-size: 1.3rem;">${item.total}</td>
      <td style="text-align: center; font-weight: 800;">${item.priceIn || '0'}</td>
      <td style="text-align: center; color: #eab308; font-weight: 900;">${item.profit || '0'}</td>
      <td style="text-align: center;">${item.method || 'Tiền mặt'}</td>
      <td style="text-align: center;">${item.dateTime || ''}</td>
      <td style="text-align: center;"><span class="badge-payment-paid">ĐÃ TRẢ</span></td>
    </tr>
  `).join('');
}
window.renderBangaTable = renderBangaTable;

function renderSoldPhoneTable() {
  const tbody = document.getElementById('soldPhoneTableBody');
  if (!tbody) return;
  tbody.innerHTML = soldPhoneDatabase.map(p => `
    <tr>
      <td style="font-weight: 800; font-size: 1.15rem;">${escapeHtmlToast(p.name)} (${p.imei})</td>
      <td style="text-align: center; color: #f87171; font-weight: 900; font-size: 1.3rem;">${p.price || p.total}</td>
      <td style="text-align: center; font-weight: 800;">${p.priceIn || '0'}</td>
      <td style="text-align: center; color: #eab308; font-weight: 900;">${p.profit || '0'}</td>
      <td style="text-align: center;">${p.method || 'Tiền mặt'}</td>
      <td style="text-align: center;">${p.soldDate || p.date || ''}</td>
      <td style="text-align: center;">${p.warranty || '3 Tháng'}</td>
    </tr>
  `).join('');
}
window.renderSoldPhoneTable = renderSoldPhoneTable;

/* ============================================================
   KHỞI CHẠY HỆ THỐNG KHI TẢI TRANG
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  checkAutoLogin();
  renderAllDropdowns();
  renderPhoneGrid();
  renderSalesTable();
  renderBangaTable();
  renderSoldPhoneTable();
  initFirebaseRealtimeSync();
});
/* ============================================================
   XỬ LÝ GIỎ HÀNG & LƯU PHIẾU BÁN HÀNG / BÁN GÀ ĐỒNG BỘ CLOUD
   ============================================================ */
let tempCart = [];

function adjustQty(delta) {
  let qInput = document.getElementById('tQty');
  let current = parseInt(qInput.value) || 1;
  current += delta;
  if (current < 1) current = 1;
  qInput.value = current;
}
window.adjustQty = adjustQty;

function adjustTicketDate(days) {
  const dateInput = document.getElementById('tDateVal');
  let parts = (dateInput.value || '').split('/');
  if (parts.length === 3) {
    let d = new Date(parts[2], parts[1] - 1, parts[0]);
    d.setDate(d.getDate() + days);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    dateInput.value = `${day}/${month}/${year}`;
  } else {
    dateInput.value = getCurrentDateStr();
  }
}
window.adjustTicketDate = adjustTicketDate;

function addToCartPreview() {
  const nameInput = document.getElementById('tItemName');
  const name = nameInput ? nameInput.value.trim() : '';
  const qty = parseInt(document.getElementById('tQty')?.value) || 1;
  
  let rawOutStr = document.getElementById('tPriceOut')?.value.trim() || '0';
  let rawInStr = document.getElementById('tPriceIn')?.value.trim() || '0';

  let priceOut = parsePriceNum(rawOutStr);
  let priceIn = parsePriceNum(rawInStr);

  if (!name && priceOut <= 0 && priceIn <= 0) {
    showToast('Vui lòng nhập thông tin món hàng!');
    return;
  }

  const total = priceOut * qty;
  const totalIn = priceIn * qty;
  const profit = total - totalIn;

  tempCart.push({ 
    name: name || 'Phụ kiện', 
    qty, 
    total: formatPriceStr(total), 
    priceIn: formatPriceStr(totalIn), 
    profit: formatPriceStr(profit) 
  });

  updateCartUI();

  if (nameInput) nameInput.value = '';
  if (document.getElementById('tQty')) document.getElementById('tQty').value = '1';
  if (document.getElementById('tPriceOut')) document.getElementById('tPriceOut').value = '';
  if (document.getElementById('tPriceIn')) document.getElementById('tPriceIn').value = '';
}
window.addToCartPreview = addToCartPreview;

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.innerText = tempCart.length;
  const container = document.getElementById('cartContent');
  const totalSummaryEl = document.getElementById('ticketTotalSummary');

  if (!container) return;

  if (tempCart.length === 0) {
    container.className = 'cart-empty';
    container.innerText = 'Giỏ trống';
    if (totalSummaryEl) {
      totalSummaryEl.innerHTML = `Tổng: <span style="font-size: 1.25em; color: #fff; font-weight: 900;">0</span> - <span style="color: var(--amber-color); font-weight: 900;">0</span> = <span style="color: var(--green-badge); font-weight: 900;">0</span>`;
    }
    return;
  }

  container.className = '';
  let sumTotal = 0, sumIn = 0, sumProfit = 0;

  container.innerHTML = tempCart.map((item, idx) => {
    sumTotal += parsePriceNum(item.total);
    sumIn += parsePriceNum(item.priceIn);
    sumProfit += parsePriceNum(item.profit);

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #0c121e; border: 1px solid #1e293b; border-radius: 8px; padding: 6px 12px; margin-bottom: 6px;">
        <span style="color: #ffffff; font-weight: 800;">${item.name} ${item.qty > 1 ? `(x${item.qty})` : ''}</span>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="color: #facc15; font-weight: 900;">${item.total}</span>
          <span style="color: #cbd5e1;">- Vốn: ${item.priceIn}</span>
          <span style="color: #10b981; font-weight: 800;">= Lãi: ${item.profit}</span>
          <button type="button" onclick="removeCartItem(${idx})" style="background: none; border: none; color: #f87171; font-weight: 900; font-size: 1.1rem; cursor: pointer;">✕</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalSummaryEl) {
    totalSummaryEl.innerHTML = `Tổng: <span style="font-size: 1.25em; color: #fff; font-weight: 900;">${formatPriceStr(sumTotal)}</span> - <span style="color: var(--amber-color); font-weight: 900;">${formatPriceStr(sumIn)}</span> = <span style="color: var(--green-badge); font-weight: 900;">${formatPriceStr(sumProfit)}</span>`;
  }
}
window.updateCartUI = updateCartUI;

function removeCartItem(idx) {
  tempCart.splice(idx, 1);
  updateCartUI();
}
window.removeCartItem = removeCartItem;

// HÀM LƯU PHIẾU BÁN HÀNG
async function saveTicket(e) {
  if (e) e.preventDefault();

  if (tempCart.length === 0) {
    const name = document.getElementById('tItemName')?.value.trim();
    const priceOut = parsePriceNum(document.getElementById('tPriceOut')?.value);
    const priceIn = parsePriceNum(document.getElementById('tPriceIn')?.value);
    const qty = parseInt(document.getElementById('tQty')?.value) || 1;

    if (name || priceOut > 0) {
      const total = priceOut * qty;
      const totalIn = priceIn * qty;
      const profit = total - totalIn;

      tempCart.push({ 
        name: name || 'Phụ kiện', 
        qty, 
        total: formatPriceStr(total), 
        priceIn: formatPriceStr(totalIn), 
        profit: formatPriceStr(profit) 
      });
    }
  }

  if (tempCart.length === 0) {
    showToast('⚠️ Vui lòng nhập tên phụ kiện hoặc giá bán trước khi lưu!');
    return;
  }

  const method = document.getElementById('tPaymentMethod')?.value || 'Tiền mặt';
  const targetList = document.getElementById('tTargetList')?.value || 'Bán Hàng';
  const timeVal = document.getElementById('tTimeVal')?.value.trim() || getCurrentTimeStr();
  const dateVal = document.getElementById('tDateVal')?.value.trim() || getCurrentDateStr();
  const fullDateTime = `${timeVal} - ${dateVal}`;
  const paymentStatus = document.getElementById('tPaymentStatus')?.value || 'Đã Trả';

  for (let item of tempCart) {
    let qtyLabel = (item.qty && Number(item.qty) > 1) ? ` (x${item.qty})` : '';
    let record = {
      id: Date.now() + Math.random(),
      name: `${item.name}${qtyLabel}`,
      accessory: item.name,
      total: item.total,
      priceIn: item.priceIn,
      profit: item.profit,
      method: method,
      dateTime: fullDateTime,
      customer: "Khách lẻ",
      paymentStatus: paymentStatus
    };

    if (targetList === 'Bán Gà') {
      bangaDatabase.unshift(record);
      saveBangaStorage();
      if (typeof db !== 'undefined') {
        db.collection('banga').doc(String(record.id)).set(record).catch(console.error);
      }
    } else {
      salesDatabase.unshift(record);
      saveSalesStorage();
      if (typeof db !== 'undefined') {
        db.collection('sales').doc(String(record.id)).set(record).catch(console.error);
      }
    }
  }

  tempCart = [];
  updateCartUI();
  closeTicketModal();

  if (typeof renderSalesTable === 'function') renderSalesTable();
  if (typeof renderBangaTable === 'function') renderBangaTable();

  showToast(`✔ Đã lưu đơn ${targetList} thành công lên hệ thống!`);
}
window.saveTicket = saveTicket;
/* ============================================================
   BỘ LỌC NGÀY / THÁNG / NĂM CHO TAB BÁN HÀNG
   ============================================================ */
let salesViewMode = 'day';
let currentSalesDateFilter = new Date(2026, 9, 29); // Mặc định về ngày 29/10/2026
let currentSalesMonthFilter = { month: 9, year: 2026 };
let currentSalesYearFilter = 2026;
let currentSalesPaymentFilter = 'ALL';

function setSalesMode(mode) {
  salesViewMode = mode;
  const selMode = document.getElementById('salesModeSelect');
  if (selMode) selMode.value = mode;

  const dayBox = document.getElementById('salesDateFilterBox');
  const monthBox = document.getElementById('salesMonthFilterBox');
  const yearBox = document.getElementById('salesYearFilterBox');

  if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
  if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
  if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

  renderSalesTable();
}
window.setSalesMode = setSalesMode;

function changeSalesFilterDate(delta) {
  currentSalesDateFilter.setDate(currentSalesDateFilter.getDate() + delta);
  const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
  const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
  const yyyy = currentSalesDateFilter.getFullYear();
  const el = document.getElementById('filterSalesDateDisplay');
  if (el) el.innerText = `${dd}/${mm}/${yyyy}`;
  renderSalesTable();
}
window.changeSalesFilterDate = changeSalesFilterDate;

function changeSalesFilterMonth(delta) {
  currentSalesMonthFilter.month += delta;
  if (currentSalesMonthFilter.month > 11) {
    currentSalesMonthFilter.month = 0;
    currentSalesMonthFilter.year++;
  } else if (currentSalesMonthFilter.month < 0) {
    currentSalesMonthFilter.month = 11;
    currentSalesMonthFilter.year--;
  }
  const mm = String(currentSalesMonthFilter.month + 1).padStart(2, '0');
  const el = document.getElementById('filterSalesMonthDisplay');
  if (el) el.innerText = `${mm}/${currentSalesMonthFilter.year}`;
  renderSalesTable();
}
window.changeSalesFilterMonth = changeSalesFilterMonth;

function changeSalesFilterYear(delta) {
  currentSalesYearFilter += delta;
  const el = document.getElementById('filterSalesYearDisplay');
  if (el) el.innerText = String(currentSalesYearFilter);
  renderSalesTable();
}
window.changeSalesFilterYear = changeSalesFilterYear;

function setSalesPaymentFilter(method) {
  currentSalesPaymentFilter = method;
  const btnAll = document.getElementById('salesMethodAllBtn');
  const btnTm = document.getElementById('salesMethodTmBtn');
  const btnCk = document.getElementById('salesMethodCkBtn');

  if (btnAll) btnAll.classList.toggle('active', method === 'ALL');
  if (btnTm) btnTm.classList.toggle('active', method === 'Tiền Mặt');
  if (btnCk) btnCk.classList.toggle('active', method === 'Chuyển Tiền');

  renderSalesTable();
}
window.setSalesPaymentFilter = setSalesPaymentFilter;

// Nâng cấp hàm renderSalesTable có đầy đủ tính năng lọc theo ngày và tính tổng
function renderSalesTable() {
  const tbody = document.getElementById('salesTableBody');
  if (!tbody) return;

  const searchInput = document.querySelector('#tab-banhang .search-sales-input');
  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
  const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
  const yyyy = currentSalesDateFilter.getFullYear();
  const targetDateStr = `${dd}/${mm}/${yyyy}`;

  // Cập nhật text hiển thị trên nút ngày nếu chưa đúng
  const dispDate = document.getElementById('filterSalesDateDisplay');
  if (dispDate && salesViewMode === 'day') dispDate.innerText = targetDateStr;

  let filtered = salesDatabase.filter(item => {
    let datePart = '';
    if (item.dateTime) {
      let parts = item.dateTime.split(' - ');
      datePart = parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }

    let matchTime = false;
    if (salesViewMode === 'day') {
      matchTime = (datePart === targetDateStr);
    } else if (salesViewMode === 'month') {
      let dp = datePart.split('/');
      if (dp.length === 3) {
        let m = parseInt(dp[1], 10) - 1;
        let y = parseInt(dp[2], 10);
        matchTime = (m === currentSalesMonthFilter.month && y === currentSalesMonthFilter.year);
      }
    } else if (salesViewMode === 'year') {
      let dp = datePart.split('/');
      if (dp.length === 3) {
        matchTime = (parseInt(dp[2], 10) === currentSalesYearFilter);
      }
    } else {
      matchTime = true;
    }

    if (!matchTime) return false;

    // Lọc theo hình thức thanh toán
    if (currentSalesPaymentFilter !== 'ALL') {
      let methodStr = (item.method || '').toLowerCase().trim();
      let isTm = (methodStr === 'tiền mặt' || methodStr === 'tm');
      let isCk = (methodStr === 'chuyển khoản' || methodStr === 'chuyển tiền' || methodStr === 'ck');
      if (currentSalesPaymentFilter === 'Tiền Mặt' && !isTm) return false;
      if (currentSalesPaymentFilter === 'Chuyển Tiền' && !isCk) return false;
    }

    // Lọc tìm kiếm
    if (searchVal) {
      let name = (item.name || '').toLowerCase();
      let cust = (item.customer || '').toLowerCase();
      return name.includes(searchVal) || cust.includes(searchVal);
    }

    return true;
  });

  // Tính tổng
  let totalRevenue = 0, totalCost = 0, totalProfit = 0;
  let tmTotal = 0, ckTotal = 0, debtTotal = 0;
  let tmCount = 0, ckCount = 0, debtCount = 0;

  filtered.forEach(i => {
    let t = parsePriceNum(i.total);
    let c = parsePriceNum(i.priceIn);
    let p = parsePriceNum(i.profit);
    totalRevenue += t;
    totalCost += c;
    totalProfit += p;

    let isDebt = (i.paymentStatus === 'Nợ Dai VL' || i.method === 'Nợ');
    if (isDebt) {
      debtTotal += t;
      debtCount++;
    } else {
      let m = (i.method || '').toLowerCase();
      if (m.includes('chuyển') || m.includes('ck')) {
        ckTotal += t;
        ckCount++;
      } else {
        tmTotal += t;
        tmCount++;
      }
    }
  });

  // Cập nhật số liệu trên thanh bar
  const dayRevEl = document.getElementById('salesDayRevenueVal');
  if (dayRevEl) dayRevEl.innerText = formatPriceStr(totalRevenue);

  const monthRevEl = document.getElementById('salesMonthRevenueVal');
  if (monthRevEl) monthRevEl.innerText = formatPriceStr(totalRevenue);

  const dayPfEl = document.getElementById('salesDayProfitVal');
  if (dayPfEl) dayPfEl.innerText = formatPriceStr(totalProfit);

  const monthPfEl = document.getElementById('salesMonthProfitVal');
  if (monthPfEl) monthPfEl.innerText = formatPriceStr(totalProfit);

  const countTextEl = document.getElementById('salesCountText');
  if (countTextEl) {
    countTextEl.innerHTML = `Hiển thị <strong>${filtered.length}</strong> phiếu.`;
  }

  const summaryStatsEl = document.getElementById('salesSummaryStats');
  if (summaryStatsEl) {
    summaryStatsEl.innerHTML = `Thanh Toán: Tiền Mặt ${formatPriceStr(tmTotal)} (${tmCount}) · Chuyển Khoản ${formatPriceStr(ckTotal)} (${ckCount}) · Nợ ${formatPriceStr(debtTotal)} (${debtCount})`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #94a3b8;">Không có phiếu bán hàng nào phù hợp với ngày đang chọn</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td style="font-weight: 800; font-size: 1.15rem; color: #ffffff;">${escapeHtmlToast(item.name)}</td>
      <td style="text-align: center; color: #facc15; font-weight: 900; font-size: 1.3rem;">${item.total}</td>
      <td style="text-align: center; font-weight: 800; color: #cbd5e1;">${item.priceIn || '0'}</td>
      <td style="text-align: center; color: #10b981; font-weight: 900;">${item.profit || '0'}</td>
      <td style="text-align: center; font-weight: 700;">${item.method || 'Tiền mặt'}</td>
      <td style="text-align: center;">
        <button type="button" onclick="deleteSale('${item.id}')" style="background:#7f1d1d; color:#fca5a5; border:1px solid #991b1b; border-radius:6px; padding:3px 8px; cursor:pointer;">Xóa</button>
      </td>
      <td style="text-align: center; color: #ffffff;">${item.dateTime || ''}</td>
      <td style="text-align: center;"><span class="badge-payment-paid">ĐÃ TRẢ</span></td>
    </tr>
  `).join('');
}
window.renderSalesTable = renderSalesTable;