const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBlock = `            <button type="button" onclick="openKimchiBankModal()" class="btn-bank-bidv"
              title="Mở Kim Chi Mobile Bank (BIDV)"
              style="width: 32px; height: 32px; padding: 0; background: transparent; border: 1.5px solid #059669; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; box-shadow: 0 2px 6px rgba(5,150,105,0.35); flex-shrink: 0; transition: transform 0.1s;">
              <img src="img/logo_bidv.jpg" alt="BIDV"
                style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </button>
            <button type="button" id="btnSalesNotePadMobile" class="btn-sales-notepad-mobile"
              title="Bấm để mở Sổ Tay Ghi Chú Bán Hàng"
              onclick="openSalesNotePadModal()"
              style="display: none;">
              <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: #f59e0b; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; display: block;">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>`;

const newBlock = `            <!-- 1. NÚT VIẾT GHI CHÚ (SỔ TAY) TRÊN MOBILE -->
            <button type="button" id="btnSalesNotePadMobile" class="btn-sales-notepad-mobile"
              title="Bấm để mở Sổ Tay Ghi Chú Bán Hàng"
              onclick="openSalesNotePadModal()"
              style="display: none;">
              <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: #f59e0b; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; display: block;">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <!-- 2. ICON BIDV BÊN PHẢI NÚT GHI CHÚ -->
            <button type="button" onclick="openKimchiBankModal()" class="btn-bank-bidv"
              title="Mở Kim Chi Mobile Bank (BIDV)"
              style="width: 32px; height: 32px; padding: 0; background: transparent; border: 1.5px solid #059669; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; box-shadow: 0 2px 6px rgba(5,150,105,0.35); flex-shrink: 0; transition: transform 0.1s;">
              <img src="img/logo_bidv.jpg" alt="BIDV"
                style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </button>`;

// Normalize CRLF
let normalizedHtml = html.replace(/\r\n/g, '\n');
let normalizedOld = oldBlock.replace(/\r\n/g, '\n');
let normalizedNew = newBlock.replace(/\r\n/g, '\n');

if (normalizedHtml.includes(normalizedOld)) {
  let updated = normalizedHtml.replace(normalizedOld, normalizedNew);
  if (html.includes('\r\n')) {
    updated = updated.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync('index.html', updated, 'utf8');
  console.log('SUCCESS: Swapped note button and BIDV button in index.html');
} else {
  console.log('FAILED: oldBlock not found in index.html');
}

