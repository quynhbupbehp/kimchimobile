const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Target snippet in main.js:
const targetOld = `function openSellPhoneModal(id) {
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

console.log('Target old found:', mainJs.includes(targetOld));

