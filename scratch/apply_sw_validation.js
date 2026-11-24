const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

// Hàm kiểm tra form phần mềm: Bắt buộc điền đủ khách hàng, tên máy, báo giá
const checkSwValidityCode = `function checkSoftwareFormValidity() {
  const submitBtn = document.getElementById('swSubmitBtn');
  if (!submitBtn) return;

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const custVal = (document.getElementById('swCustomerInput')?.value || '').trim();
  const devVal = (document.getElementById('swDeviceInput')?.value || '').trim();
  const priceVal = (document.getElementById('swPriceInput')?.value || '').trim();

  // Bắt buộc nhập đủ Khách hàng, Tên máy và Báo giá
  const isValid = Boolean(custVal && devVal && priceVal);

  if (isMobile) {
    if (isValid) {
      submitBtn.disabled = false;
      submitBtn.classList.add('active');
      submitBtn.style.opacity = '1';
      submitBtn.style.filter = 'none';
      submitBtn.style.cursor = 'pointer';
      submitBtn.style.pointerEvents = 'auto';
      submitBtn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.55)';
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove('active');
      submitBtn.style.opacity = '0.35';
      submitBtn.style.filter = 'grayscale(0.6)';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.boxShadow = 'none';
    }
  } else {
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.filter = 'none';
    submitBtn.style.cursor = 'pointer';
    submitBtn.style.pointerEvents = 'auto';
  }
}
window.checkSoftwareFormValidity = checkSoftwareFormValidity;
`;

// Chèn checkSoftwareFormValidity() vào cuối openSoftwareModal
const oldOpenSw = `  document.getElementById('softwareModal').classList.add('active');
}
window.openSoftwareModal = openSoftwareModal;`;

const newOpenSw = `  document.getElementById('softwareModal').classList.add('active');
  checkSoftwareFormValidity();
}
window.openSoftwareModal = openSoftwareModal;
` + checkSwValidityCode;

// Chèn gọi checkSoftwareFormValidity() vào selectSwDropdownItem
const oldSelectSw = `    input.dispatchEvent(new Event('change'));
  }
  const menu = document.getElementById(meta.menuId);`;

const newSelectSw = `    input.dispatchEvent(new Event('change'));
    if (typeof checkSoftwareFormValidity === 'function') checkSoftwareFormValidity();
  }
  const menu = document.getElementById(meta.menuId);`;

let normJs = js.replace(/\r\n/g, '\n');
let normOldOpenSw = oldOpenSw.replace(/\r\n/g, '\n');
let normNewOpenSw = newOpenSw.replace(/\r\n/g, '\n');
let normOldSelectSw = oldSelectSw.replace(/\r\n/g, '\n');
let normNewSelectSw = newSelectSw.replace(/\r\n/g, '\n');

let ok = true;
if (normJs.includes(normOldOpenSw)) {
  normJs = normJs.replace(normOldOpenSw, normNewOpenSw);
  console.log('SUCCESS: Injected checkSoftwareFormValidity');
} else {
  console.log('FAILED: oldOpenSw not found');
  ok = false;
}

if (normJs.includes(normOldSelectSw)) {
  normJs = normJs.replace(normOldSelectSw, normNewSelectSw);
  console.log('SUCCESS: Injected checkSoftwareFormValidity in selectSwDropdownItem');
} else {
  console.log('FAILED: oldSelectSw not found');
  ok = false;
}

if (ok) {
  if (js.includes('\r\n')) normJs = normJs.replace(/\n/g, '\r\n');
  fs.writeFileSync('js/main.js', normJs, 'utf8');
}

// Cập nhật index.html: gắn oninput="checkSoftwareFormValidity()" vào các ô nhập liệu
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  'id="swCustomerInput" placeholder="Chọn hoặc nhập" required\n                autocomplete="off" onfocus="openSwDropdown(\'customer\')"\n                oninput="filterSwDropdown(\'customer\', this.value)"',
  'id="swCustomerInput" placeholder="Chọn hoặc nhập" required\n                autocomplete="off" onfocus="openSwDropdown(\'customer\')"\n                oninput="filterSwDropdown(\'customer\', this.value); checkSoftwareFormValidity();"'
);

html = html.replace(
  'id="swDeviceInput" placeholder="Chọn hoặc nhập" required\n                autocomplete="off" onfocus="openSwDropdown(\'device\')"\n                oninput="filterSwDropdown(\'device\', this.value); handleSwDeviceChange(this.value)"\n                onchange="handleSwDeviceChange(this.value)"',
  'id="swDeviceInput" placeholder="Chọn hoặc nhập" required\n                autocomplete="off" onfocus="openSwDropdown(\'device\')"\n                oninput="filterSwDropdown(\'device\', this.value); handleSwDeviceChange(this.value); checkSoftwareFormValidity();"\n                onchange="handleSwDeviceChange(this.value); checkSoftwareFormValidity();"'
);

html = html.replace(
  'id="swPriceInput" placeholder="Nhập giá"\n                required autocomplete="off" oninput="formatCurrencyInput(this); filterSwDropdown(\'price\', this.value)"',
  'id="swPriceInput" placeholder="Nhập giá"\n                required autocomplete="off" oninput="formatCurrencyInput(this); filterSwDropdown(\'price\', this.value); checkSoftwareFormValidity();"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: Added checkSoftwareFormValidity listeners to input fields');

