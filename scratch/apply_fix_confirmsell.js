const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// 1. In openSellPhoneModal & closeSellPhoneModal
const targetOldOpenClose = `function openSellPhoneModal(id) {
  const p = phoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
  if (!p) return;

  currentSellingPhone = p;
  document.getElementById('sellPhoneId').value = p.id;
  let cleanStorage = (p.storage || '').replace(/[()]/g, '');

  document.getElementById('sellPhoneSummaryTitle').innerText = \`\${p.brand} - \${p.name} \${cleanStorage ? \`(\${cleanStorage})\` : ''}\`;
  document.getElementById('sellPhoneSummaryImei').innerText = p.imei || 'Chưa có';

  let dotColor = getHexColor(p.color);
  let summaryDot = document.getElementById('sellPhoneSummaryDot');
  if (summaryDot) {
    summaryDot.style.backgroundColor = dotColor;
    summaryDot.style.boxShadow = \`0 0 8px \${dotColor}66\`;
  }

  let pinVal = formatPinByBrand(p.pin, p.brand, p.name);
  document.getElementById('sellPhoneSummaryDetails').innerText = \`\${p.condition || 'Zin Đẹp 99%'} - Pin : \${pinVal} - QG: \${p.origin || 'VN/A'} - Giá Nhập : \${p.priceIn || '0'}\`;

  document.getElementById('sellCustomerName').value = '';
  document.getElementById('sellCustomerName').placeholder = 'Khách Lẻ';

  let defaultPrice = p.price || '';
  let priceInput = document.getElementById('sellPriceOut');
  priceInput.value = '';
  priceInput.placeholder = defaultPrice;
  priceInput.dataset.defaultPrice = defaultPrice;

  document.getElementById('sellTargetList').value = '';
  document.getElementById('sellPaymentMethod').value = '';
  document.getElementById('sellWarranty').value = '';

  ['giftSac', 'giftOp', 'giftCluc', 'giftKhac'].forEach(gid => {
    let inputEl = document.getElementById(gid);
    inputEl.value = '';
    inputEl.placeholder = '0';
  });

  document.getElementById('sellDateVal').value = getCurrentDateStr();

  calcSellProfit();
  checkGiftsEntered();
  document.getElementById('sellPhoneModal').classList.add('active');
}
window.openSellPhoneModal = openSellPhoneModal;

function closeSellPhoneModal() {
  document.getElementById('sellPhoneModal').classList.remove('active');
}`;

const newOpenClose = `function openSellPhoneModal(id) {
  const p = phoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
  if (!p) return;

  currentSellingPhone = p;
  document.getElementById('sellPhoneId').value = p.id;
  let cleanStorage = (p.storage || '').replace(/[()]/g, '');

  document.getElementById('sellPhoneSummaryTitle').innerText = \`\${p.brand} - \${p.name} \${cleanStorage ? \`(\${cleanStorage})\` : ''}\`;
  document.getElementById('sellPhoneSummaryImei').innerText = p.imei || 'Chưa có';

  let dotColor = getHexColor(p.color);
  let summaryDot = document.getElementById('sellPhoneSummaryDot');
  if (summaryDot) {
    summaryDot.style.backgroundColor = dotColor;
    summaryDot.style.boxShadow = \`0 0 8px \${dotColor}66\`;
  }

  let pinVal = formatPinByBrand(p.pin, p.brand, p.name);
  document.getElementById('sellPhoneSummaryDetails').innerText = \`\${p.condition || 'Zin Đẹp 99%'} - Pin : \${pinVal} - QG: \${p.origin || 'VN/A'} - Giá Nhập : \${p.priceIn || '0'}\`;

  document.getElementById('sellCustomerName').value = '';
  document.getElementById('sellCustomerName').placeholder = 'Khách Lẻ';

  let defaultPrice = p.price || '';
  let priceInput = document.getElementById('sellPriceOut');
  priceInput.value = '';
  priceInput.placeholder = defaultPrice;
  priceInput.dataset.defaultPrice = defaultPrice;

  document.getElementById('sellTargetList').value = '';
  document.getElementById('sellPaymentMethod').value = '';
  document.getElementById('sellWarranty').value = '';

  ['giftSac', 'giftOp', 'giftCluc', 'giftKhac'].forEach(gid => {
    let inputEl = document.getElementById(gid);
    inputEl.value = '';
    inputEl.placeholder = '0';
  });

  document.getElementById('sellDateVal').value = getCurrentDateStr();

  calcSellProfit();
  checkGiftsEntered();
  
  const btnConfirm = document.getElementById('btnConfirmSellPhone');
  if (btnConfirm) {
    btnConfirm.disabled = false;
    btnConfirm.style.pointerEvents = 'auto';
  }

  const modal = document.getElementById('sellPhoneModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}
window.openSellPhoneModal = openSellPhoneModal;

function closeSellPhoneModal() {
  const modal = document.getElementById('sellPhoneModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
  const btnConfirm = document.getElementById('btnConfirmSellPhone');
  if (btnConfirm) {
    btnConfirm.disabled = false;
    btnConfirm.style.pointerEvents = 'auto';
  }
}`;

// 2. In confirmSellPhone
const targetOldConfirm = `function confirmSellPhone(e) {
  e.preventDefault();
  const id = parseFloat(document.getElementById('sellPhoneId').value);
  const idx = phoneDatabase.findIndex(p => p.id === id);
  if (idx === -1) {
    alert('Không tìm thấy thông tin máy trong kho!');
    return;
  }

  const targetList = document.getElementById('sellTargetList').value;
  if (!targetList) {
    alert('Vui lòng chọn danh mục "Lưu Vào" (Bán Hàng hoặc Bán Gà)!');
    return;
  }

  const paymentMethod = document.getElementById('sellPaymentMethod').value;
  if (!paymentMethod) {
    alert('Vui lòng chọn hình thức "Thanh Toán" (Tiền Mặt hoặc Chuyển Khoản)!');
    return;
  }

  const warranty = document.getElementById('sellWarranty').value;
  if (!warranty) {
    alert('Vui lòng chọn gói "Bảo Hành"!');
    return;
  }

  const gSac = document.getElementById('giftSac').value.trim();
  const gOp = document.getElementById('giftOp').value.trim();
  const gCluc = document.getElementById('giftCluc').value.trim();
  const gKhac = document.getElementById('giftKhac').value.trim();
  if (!gSac && !gOp && !gCluc && !gKhac) {
    alert('Vui lòng nhập thông tin quà tặng vào ít nhất 1 trong 4 ô phụ kiện tặng kèm!');
    return;
  }

  const customerName = toTitleCase(document.getElementById('sellCustomerName').value.trim()) || 'Khách Lẻ';
  const priceInput = document.getElementById('sellPriceOut');
  const actualPriceOut = priceInput.value.trim() || priceInput.dataset.defaultPrice || currentSellingPhone.price || '0';
  const dateVal = document.getElementById('sellDateVal').value.trim() || getCurrentDateStr();
  const timeVal = getCurrentTimeStr();
  const fullDateTime = \`\${timeVal} - \${dateVal}\`;

  let gifts = [];
  if (gSac) gifts.push(\`Sạc: \${gSac}\`);
  if (gOp) gifts.push(\`Ốp: \${gOp}\`);
  if (gCluc) gifts.push(\`C.Lực: \${gCluc}\`);
  if (gKhac) gifts.push(\`Khác: \${gKhac}\`);
  let giftStr = gifts.length > 0 ? \` [Quà Tặng: \${gifts.join(', ')}]\` : '';

  let profitValStr = document.getElementById('sellProfitVal').value;

  let soldItem = phoneDatabase.splice(idx, 1)[0];

  let totalGiftMoney = parsePriceNum(document.getElementById('sellTotalGiftMoney') ? document.getElementById('sellTotalGiftMoney').value : 0);

  soldItem.price = actualPriceOut;
  soldItem.soldDate = dateVal;
  soldItem.customer = customerName;
  soldItem.warranty = warranty;
  soldItem.targetList = targetList;
  soldItem.giftStr = giftStr;
  soldItem.totalGiftMoney = totalGiftMoney;
  soldItem.soldDateTime = fullDateTime;
  soldItem.status = 'Đã bán (Còn Cái Nịt)';

  soldPhoneDatabase.unshift(soldItem);

  let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
  let soldName = formatBrandDeviceName(soldItem.name || '');
  let displayName = \`\${soldItem.brand} - \${soldName} \${cleanStorage ? cleanStorage : ''} (\${soldItem.imei})\`.trim();

  let record = {
    id: 'sale_' + soldItem.id,
    soldPhoneId: soldItem.id,
    phoneId: soldItem.id,
    name: displayName,
    brand: soldItem.brand,
    phoneName: soldItem.name,
    storage: cleanStorage,
    color: soldItem.color,
    imei: soldItem.imei,
    condition: soldItem.condition,
    pinStatus: soldItem.pinStatus,
    pin: soldItem.pin,
    origin: soldItem.origin,
    accessory: targetList === 'Bán Gà' ? 'Bán Máy' : undefined,
    total: actualPriceOut,
    priceIn: soldItem.priceIn || '0',
    profit: profitValStr,
    method: paymentMethod,
    paymentMethod: paymentMethod,
    dateTime: fullDateTime,
    date: dateVal,
    customer: customerName
  };

  if (targetList === 'Bán Gà') {
    bangaDatabase.unshift(record);
    saveBangaStorage(record);
    renderBangaTable(bangaDatabase);
  } else {
    salesDatabase.unshift(record);
    saveSalesStorage(record);
    renderSalesTable(salesDatabase);
  }

  if (typeof logActivity === 'function') {
    logActivity('EDIT', 'banmay', 'Bán máy', \`Bán máy: \${displayName} cho \${customerName} - Giá: \${actualPriceOut} (Lãi: \${profitValStr})\`, null, soldItem, soldItem.id);
    logActivity('ADD', 'baohanh', 'Bảo hành', \`Thêm máy vào sổ bảo hành: \${displayName} - Khách: \${customerName}\`, null, soldItem, soldItem.id);
  }

  recordSoldPhoneId(soldItem.id, soldItem.imei);
  savePhoneStorage();
  saveSoldPhoneStorage(soldItem);
  closeSellPhoneModal();

  renderPhoneGrid();
  renderSoldPhoneTable();

  alert(\`Đã xác nhận bán máy \${soldItem.name} (\${soldItem.imei}) thành công!\\n- Lưu vào: \${targetList}\\n- Thanh toán: \${paymentMethod}\\n- Bảo hành: \${warranty}.\`);
}`;

const newConfirm = `function confirmSellPhone(e) {
  e.preventDefault();
  const rawId = document.getElementById('sellPhoneId').value;
  const numId = parseFloat(rawId);
  
  // Tìm máy linh hoạt theo cả chuỗi ID và số ID để tránh lệch kiểu dữ liệu
  const idx = phoneDatabase.findIndex(p => String(p.id) === String(rawId) || p.id == numId || (p.id && String(p.id) === String(numId)));
  if (idx === -1) {
    alert('Không tìm thấy thông tin máy trong kho!');
    return;
  }

  const targetList = document.getElementById('sellTargetList').value;
  if (!targetList) {
    alert('Vui lòng chọn danh mục "Lưu Vào" (Bán Hàng hoặc Bán Gà)!');
    return;
  }

  const paymentMethod = document.getElementById('sellPaymentMethod').value;
  if (!paymentMethod) {
    alert('Vui lòng chọn hình thức "Thanh Toán" (Tiền Mặt hoặc Chuyển Khoản)!');
    return;
  }

  const warranty = document.getElementById('sellWarranty').value;
  if (!warranty) {
    alert('Vui lòng chọn gói "Bảo Hành"!');
    return;
  }

  const gSac = document.getElementById('giftSac').value.trim();
  const gOp = document.getElementById('giftOp').value.trim();
  const gCluc = document.getElementById('giftCluc').value.trim();
  const gKhac = document.getElementById('giftKhac').value.trim();
  if (!gSac && !gOp && !gCluc && !gKhac) {
    alert('Vui lòng nhập thông tin quà tặng vào ít nhất 1 trong 4 ô phụ kiện tặng kèm!');
    return;
  }

  // Khóa nút Xác Nhận ngay để chống bấm liên tiếp 2 lần
  const btnConfirm = document.getElementById('btnConfirmSellPhone');
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.style.pointerEvents = 'none';
  }

  const customerName = toTitleCase(document.getElementById('sellCustomerName').value.trim()) || 'Khách Lẻ';
  const priceInput = document.getElementById('sellPriceOut');
  const actualPriceOut = priceInput.value.trim() || priceInput.dataset.defaultPrice || (currentSellingPhone ? currentSellingPhone.price : '0') || '0';
  const dateVal = document.getElementById('sellDateVal').value.trim() || getCurrentDateStr();
  const timeVal = getCurrentTimeStr();
  const fullDateTime = \`\${timeVal} - \${dateVal}\`;

  let gifts = [];
  if (gSac) gifts.push(\`Sạc: \${gSac}\`);
  if (gOp) gifts.push(\`Ốp: \${gOp}\`);
  if (gCluc) gifts.push(\`C.Lực: \${gCluc}\`);
  if (gKhac) gifts.push(\`Khác: \${gKhac}\`);
  let giftStr = gifts.length > 0 ? \` [Quà Tặng: \${gifts.join(', ')}]\` : '';

  let profitValStr = document.getElementById('sellProfitVal').value;

  let soldItem = phoneDatabase.splice(idx, 1)[0];

  let totalGiftMoney = parsePriceNum(document.getElementById('sellTotalGiftMoney') ? document.getElementById('sellTotalGiftMoney').value : 0);

  soldItem.price = actualPriceOut;
  soldItem.soldDate = dateVal;
  soldItem.customer = customerName;
  soldItem.warranty = warranty;
  soldItem.targetList = targetList;
  soldItem.giftStr = giftStr;
  soldItem.totalGiftMoney = totalGiftMoney;
  soldItem.soldDateTime = fullDateTime;
  soldItem.status = 'Đã bán (Còn Cái Nịt)';

  soldPhoneDatabase.unshift(soldItem);

  let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
  let soldName = formatBrandDeviceName(soldItem.name || '');
  let displayName = \`\${soldItem.brand} - \${soldName} \${cleanStorage ? cleanStorage : ''} (\${soldItem.imei})\`.trim();

  let record = {
    id: 'sale_' + soldItem.id,
    soldPhoneId: soldItem.id,
    phoneId: soldItem.id,
    name: displayName,
    brand: soldItem.brand,
    phoneName: soldItem.name,
    storage: cleanStorage,
    color: soldItem.color,
    imei: soldItem.imei,
    condition: soldItem.condition,
    pinStatus: soldItem.pinStatus,
    pin: soldItem.pin,
    origin: soldItem.origin,
    accessory: targetList === 'Bán Gà' ? 'Bán Máy' : undefined,
    total: actualPriceOut,
    priceIn: soldItem.priceIn || '0',
    profit: profitValStr,
    method: paymentMethod,
    paymentMethod: paymentMethod,
    dateTime: fullDateTime,
    date: dateVal,
    customer: customerName
  };

  if (targetList === 'Bán Gà') {
    bangaDatabase.unshift(record);
    saveBangaStorage(record);
    renderBangaTable(bangaDatabase);
  } else {
    salesDatabase.unshift(record);
    saveSalesStorage(record);
    renderSalesTable(salesDatabase);
  }

  if (typeof logActivity === 'function') {
    logActivity('EDIT', 'banmay', 'Bán máy', \`Bán máy: \${displayName} cho \${customerName} - Giá: \${actualPriceOut} (Lãi: \${profitValStr})\`, null, soldItem, soldItem.id);
    logActivity('ADD', 'baohanh', 'Bảo hành', \`Thêm máy vào sổ bảo hành: \${displayName} - Khách: \${customerName}\`, null, soldItem, soldItem.id);
  }

  recordSoldPhoneId(soldItem.id, soldItem.imei);
  savePhoneStorage();
  saveSoldPhoneStorage(soldItem);
  closeSellPhoneModal();

  renderPhoneGrid();
  renderSoldPhoneTable();

  alert(\`Đã xác nhận bán máy \${soldItem.name} (\${soldItem.imei}) thành công!\\n- Lưu vào: \${targetList}\\n- Thanh toán: \${paymentMethod}\\n- Bảo hành: \${warranty}.\`);
}`;

const normalize = s => s.replace(/\r\n/g, '\n');
let normMain = normalize(mainJs);

normMain = normMain.replace(normalize(targetOldOpenClose), normalize(newOpenClose));
normMain = normMain.replace(normalize(targetOldConfirm), normalize(newConfirm));

fs.writeFileSync('js/main.js', normMain, 'utf8');
console.log('Updated js/main.js successfully!');

// Also update index.html to ensure sellPhoneModal has inline style="display: none;"
let html = fs.readFileSync('index.html', 'utf8');
const oldHtmlModal = '<div class="modal-overlay" id="sellPhoneModal">';
const newHtmlModal = '<div class="modal-overlay" id="sellPhoneModal" style="display: none;">';

if (html.includes(oldHtmlModal)) {
  html = html.replace(oldHtmlModal, newHtmlModal);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Updated index.html sellPhoneModal display style!');
}

