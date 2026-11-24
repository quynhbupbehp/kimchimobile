const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

const targetCode = `/* ============================================================
   SỔ TAY GHI CHÚ BÁN HÀNG (POPUP BẢNG GHI CHÚ TIỆN LỢI)
   ============================================================ */
function getSalesNotePadContent() {
  try {
    let stored = localStorage.getItem('KIMCHI_SALES_NOTEPAD');
    if (stored && typeof stored === 'string') return stored;
  } catch (e) { }
  return '';
}

function saveSalesNotePad(showAlert = false) {
  const ta = document.getElementById('salesNotePadTextarea');
  const val = ta ? ta.value : '';
  try {
    localStorage.setItem('KIMCHI_SALES_NOTEPAD', val);
  } catch (e) { }
  if (typeof db !== 'undefined' && db) {
    try {
      db.collection('settings').doc('sales_notepad').set({
        content: val,
        updatedAt: Date.now()
      }).catch(console.error);
    } catch (e) { }
  }
  const statusEl = document.getElementById('salesNotePadStatusText');
  if (statusEl) {
    statusEl.innerText = '✓ Đã lưu thành công!';
    statusEl.style.color = '#10b981';
    setTimeout(() => {
      if (statusEl) {
        statusEl.innerText = '✓ Tự động lưu';
        statusEl.style.color = '#10b981';
      }
    }, 2500);
  }
  if (showAlert) {
    alert('✅ Đã lưu sổ tay ghi chú bán hàng thành công!');
  }
}
window.saveSalesNotePad = saveSalesNotePad;

function autoSaveSalesNotePad() {
  saveSalesNotePad(false);
}
window.autoSaveSalesNotePad = autoSaveSalesNotePad;

function openSalesNotePadModal() {
  const modal = document.getElementById('salesNotePadModal');
  const ta = document.getElementById('salesNotePadTextarea');
  if (ta) {
    ta.value = getSalesNotePadContent();
  }
  if (modal) {
    modal.style.zIndex = '100000';
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  if (ta) {
    setTimeout(() => { ta.focus(); }, 100);
  }
}
window.openSalesNotePadModal = openSalesNotePadModal;

function closeSalesNotePadModal() {
  autoSaveSalesNotePad();
  const modal = document.getElementById('salesNotePadModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closeSalesNotePadModal = closeSalesNotePadModal;

function clearSalesNotePad() {
  const ta = document.getElementById('salesNotePadTextarea');
  if (!ta || !ta.value.trim()) return;
  if (confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ nội dung trong sổ tay ghi chú không?')) {
    ta.value = '';
    saveSalesNotePad(false);
    ta.focus();
  }
}
window.clearSalesNotePad = clearSalesNotePad;

// Lắng nghe đồng bộ Firestore realtime cho sổ tay ghi chú bán hàng
try {
  if (typeof db !== 'undefined' && db) {
    db.collection('settings').doc('sales_notepad').onSnapshot(doc => {
      if (doc && doc.exists) {
        const d = doc.data();
        if (d && typeof d.content === 'string') {
          try { localStorage.setItem('KIMCHI_SALES_NOTEPAD', d.content); } catch (e) { }
          const modal = document.getElementById('salesNotePadModal');
          const ta = document.getElementById('salesNotePadTextarea');
          if (ta && (!modal || modal.style.display === 'none')) {
            ta.value = d.content;
          }
        }
      }
    }, err => console.warn('Sync sales_notepad notice:', err.code || err));
  }
} catch (e) { }`;

const newCode = `/* ============================================================
   SỔ TAY GHI CHÚ BÁN HÀNG MULTI-TAB (HUYỀN, QUỲNH, +...)
   ============================================================ */
function getSalesNotePadData() {
  const defaultData = {
    activeTab: 'HUYỀN',
    tabs: {
      'HUYỀN': '',
      'QUỲNH': ''
    }
  };
  try {
    let stored = localStorage.getItem('KIMCHI_SALES_NOTEPAD');
    if (!stored) return defaultData;

    // Nếu dữ liệu cũ là chuỗi thuần (single string), chuyển sang cấu trúc multi-tab
    if (stored.trim().startsWith('{')) {
      try {
        let parsed = JSON.parse(stored);
        if (parsed && typeof parsed.tabs === 'object' && parsed.tabs !== null) {
          if (!parsed.activeTab || !parsed.tabs[parsed.activeTab]) {
            const keys = Object.keys(parsed.tabs);
            parsed.activeTab = keys.length > 0 ? keys[0] : 'HUYỀN';
          }
          // Đảm bảo tối thiểu có HUYỀN và QUỲNH
          if (!parsed.tabs['HUYỀN']) parsed.tabs['HUYỀN'] = parsed.tabs['HUYỀN'] || '';
          if (!parsed.tabs['QUỲNH']) parsed.tabs['QUỲNH'] = parsed.tabs['QUỲNH'] || '';
          return parsed;
        }
      } catch (pe) { }
    }
    // Dữ liệu cũ dạng text
    defaultData.tabs['HUYỀN'] = stored;
    return defaultData;
  } catch (e) { }
  return defaultData;
}

function renderSalesNotePadTabs() {
  const container = document.getElementById('salesNotePadTabsBar');
  if (!container) return;
  const data = getSalesNotePadData();
  const activeTab = data.activeTab || 'HUYỀN';
  const tabNames = Object.keys(data.tabs);

  let html = '';
  tabNames.forEach(name => {
    const isActive = (name === activeTab);
    const canDelete = (tabNames.length > 1 && name !== 'HUYỀN' && name !== 'QUỲNH');
    html += \`<button type="button" class="sales-note-tab-btn \${isActive ? 'active' : ''}" onclick="switchSalesNotePadTab('\${name.replace(/'/g, "\\\\'")}')">
      \${name}
      \${canDelete ? \`<span class="tab-delete-x" title="Xóa tab này" onclick="event.stopPropagation(); removeSalesNotePadTab('\${name.replace(/'/g, "\\\\'")}')">✕</span>\` : ''}
    </button>\`;
  });

  // Nút [+] thêm tab mới bên phải
  html += \`<button type="button" class="sales-note-tab-add-btn" onclick="addNewSalesNotePadTab()" title="Thêm tab ghi chú mới">+</button>\`;

  container.innerHTML = html;
}
window.renderSalesNotePadTabs = renderSalesNotePadTabs;

function switchSalesNotePadTab(tabName) {
  const ta = document.getElementById('salesNotePadTextarea');
  let data = getSalesNotePadData();
  
  // Lưu nội dung của tab hiện tại trước khi chuyển
  if (ta && data.activeTab && data.tabs.hasOwnProperty(data.activeTab)) {
    data.tabs[data.activeTab] = ta.value;
  }
  
  if (data.tabs.hasOwnProperty(tabName)) {
    data.activeTab = tabName;
  } else {
    data.tabs[tabName] = '';
    data.activeTab = tabName;
  }

  try {
    localStorage.setItem('KIMCHI_SALES_NOTEPAD', JSON.stringify(data));
  } catch (e) { }

  if (ta) {
    ta.value = data.tabs[data.activeTab] || '';
  }

  renderSalesNotePadTabs();
  autoSaveSalesNotePad();
}
window.switchSalesNotePadTab = switchSalesNotePadTab;

function addNewSalesNotePadTab() {
  const name = prompt('Nhập tên tab ghi chú mới (ví dụ: TÊN NHÂN VIÊN / CHỦ ĐỀ):');
  if (!name || !name.trim()) return;
  const cleanName = name.trim().toUpperCase();

  let data = getSalesNotePadData();
  const ta = document.getElementById('salesNotePadTextarea');
  if (ta && data.activeTab && data.tabs.hasOwnProperty(data.activeTab)) {
    data.tabs[data.activeTab] = ta.value;
  }

  if (!data.tabs[cleanName]) {
    data.tabs[cleanName] = '';
  }
  data.activeTab = cleanName;

  try {
    localStorage.setItem('KIMCHI_SALES_NOTEPAD', JSON.stringify(data));
  } catch (e) { }

  if (ta) {
    ta.value = data.tabs[cleanName] || '';
    ta.focus();
  }

  renderSalesNotePadTabs();
  autoSaveSalesNotePad();
}
window.addNewSalesNotePadTab = addNewSalesNotePadTab;

function removeSalesNotePadTab(tabName) {
  if (tabName === 'HUYỀN' || tabName === 'QUỲNH') {
    alert('Không thể xóa tab mặc định!');
    return;
  }
  if (!confirm('Bạn có chắc chắn muốn xóa tab "' + tabName + '" cùng toàn bộ nội dung của tab này?')) {
    return;
  }
  let data = getSalesNotePadData();
  delete data.tabs[tabName];
  if (data.activeTab === tabName) {
    data.activeTab = 'HUYỀN';
  }
  try {
    localStorage.setItem('KIMCHI_SALES_NOTEPAD', JSON.stringify(data));
  } catch (e) { }

  const ta = document.getElementById('salesNotePadTextarea');
  if (ta) {
    ta.value = data.tabs[data.activeTab] || '';
  }

  renderSalesNotePadTabs();
  autoSaveSalesNotePad();
}
window.removeSalesNotePadTab = removeSalesNotePadTab;

function saveSalesNotePad(showAlert = false) {
  const ta = document.getElementById('salesNotePadTextarea');
  const val = ta ? ta.value : '';
  let data = getSalesNotePadData();
  if (!data.activeTab) data.activeTab = 'HUYỀN';
  if (!data.tabs) data.tabs = {};
  data.tabs[data.activeTab] = val;

  const serialized = JSON.stringify(data);
  try {
    localStorage.setItem('KIMCHI_SALES_NOTEPAD', serialized);
  } catch (e) { }

  if (typeof db !== 'undefined' && db) {
    try {
      db.collection('settings').doc('sales_notepad').set({
        content: serialized,
        data: data,
        updatedAt: Date.now()
      }).catch(console.error);
    } catch (e) { }
  }

  const statusEl = document.getElementById('salesNotePadStatusText');
  if (statusEl) {
    statusEl.innerText = '✓ Đã lưu thành công!';
    statusEl.style.color = '#10b981';
    setTimeout(() => {
      if (statusEl) {
        statusEl.innerText = '✓ Tự động lưu';
        statusEl.style.color = '#10b981';
      }
    }, 2500);
  }
  if (showAlert) {
    alert('✅ Đã lưu sổ tay ghi chú bán hàng thành công!');
  }
}
window.saveSalesNotePad = saveSalesNotePad;

function autoSaveSalesNotePad() {
  saveSalesNotePad(false);
}
window.autoSaveSalesNotePad = autoSaveSalesNotePad;

function openSalesNotePadModal() {
  const modal = document.getElementById('salesNotePadModal');
  const ta = document.getElementById('salesNotePadTextarea');
  const data = getSalesNotePadData();
  
  renderSalesNotePadTabs();

  if (ta) {
    ta.value = data.tabs[data.activeTab] || '';
  }
  if (modal) {
    modal.style.zIndex = '100000';
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
  if (ta) {
    setTimeout(() => { ta.focus(); }, 100);
  }
}
window.openSalesNotePadModal = openSalesNotePadModal;

function closeSalesNotePadModal() {
  autoSaveSalesNotePad();
  const modal = document.getElementById('salesNotePadModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closeSalesNotePadModal = closeSalesNotePadModal;

function clearSalesNotePad() {
  const ta = document.getElementById('salesNotePadTextarea');
  let data = getSalesNotePadData();
  const curTab = data.activeTab || 'HUYỀN';
  if (!ta || !ta.value.trim()) return;
  if (confirm('⚠️ Bạn có chắc chắn muốn xóa toàn bộ nội dung trong tab "' + curTab + '" không?')) {
    ta.value = '';
    saveSalesNotePad(false);
    ta.focus();
  }
}
window.clearSalesNotePad = clearSalesNotePad;

// Lắng nghe đồng bộ Firestore realtime cho sổ tay ghi chú bán hàng
try {
  if (typeof db !== 'undefined' && db) {
    db.collection('settings').doc('sales_notepad').onSnapshot(doc => {
      if (doc && doc.exists) {
        const d = doc.data();
        if (d && (d.content || d.data)) {
          let incomingContent = d.content;
          if (typeof incomingContent === 'string') {
            try { localStorage.setItem('KIMCHI_SALES_NOTEPAD', incomingContent); } catch (e) { }
            const modal = document.getElementById('salesNotePadModal');
            const ta = document.getElementById('salesNotePadTextarea');
            if (ta && (!modal || modal.style.display === 'none')) {
              const currentData = getSalesNotePadData();
              ta.value = currentData.tabs[currentData.activeTab] || '';
              renderSalesNotePadTabs();
            }
          }
        }
      }
    }, err => console.warn('Sync sales_notepad notice:', err.code || err));
  }
} catch (e) { }`;

const normalize = str => str.replace(/\r\n/g, '\n');
const normMainJs = normalize(mainJs);
const normTarget = normalize(targetCode);

if (normMainJs.includes(normTarget)) {
  const updated = normMainJs.replace(normTarget, normalize(newCode));
  fs.writeFileSync('js/main.js', updated, 'utf8');
  console.log('Replaced in js/main.js successfully!');
} else {
  console.error('Target code not found in js/main.js');
}

