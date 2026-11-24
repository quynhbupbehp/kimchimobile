const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldTarget = `            <!-- Cột 3 (Phải): NÚT ẨN + NÚT TẠO ĐƠN MỚI -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
              <button type="button" onclick="openKimchiBankModal()" class="btn-bank-bidv-sw"
                title="Mở Kim Chi Mobile Bank (BIDV)"
                style="width: 34px; height: 34px; padding: 0; background: transparent; border: 1.5px solid #059669; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; box-shadow: 0 2px 6px rgba(5,150,105,0.35); flex-shrink: 0; transition: transform 0.1s;">
                <img src="img/logo_bidv.jpg" alt="BIDV"
                  style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </button>`;

const newReplacement = `            <!-- Cột 3 (Phải): Ô TÌM KIẾM + BIDV + NÚT ẨN + NÚT TẠO ĐƠN MỚI -->
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
              <!-- Ô TÌM KIẾM PHẦN MỀM -->
              <div class="search-box-bm" id="swSearchBoxWrapper"
                style="height: 38px; box-sizing: border-box; position: relative; z-index: 9999; flex-shrink: 0;">
                <span class="search-label-single-line">TÌM KIẾM</span>
                <input type="text" id="swSearchInput" class="search-input-field" inputmode="text"
                  placeholder="🔍 Tìm khách / tên máy..." oninput="handleSoftwareSearchInput(this)"
                  onfocus="handleSoftwareSearchInput(this)" onkeydown="handleSoftwareSearchKeydown(event)"
                  autocomplete="off" style="width: 200px;">
                <button type="button" id="btnClearSwSearch" class="btn-clear-search" onclick="clearSoftwareSearch()"
                  title="Xóa tìm kiếm">✕</button>
                <div id="swSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
              </div>

              <button type="button" onclick="openKimchiBankModal()" class="btn-bank-bidv-sw"
                title="Mở Kim Chi Mobile Bank (BIDV)"
                style="width: 34px; height: 34px; padding: 0; background: transparent; border: 1.5px solid #059669; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; box-shadow: 0 2px 6px rgba(5,150,105,0.35); flex-shrink: 0; transition: transform 0.1s;">
                <img src="img/logo_bidv.jpg" alt="BIDV"
                  style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </button>`;

if (html.includes(oldTarget)) {
  html = html.replace(oldTarget, newReplacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced in index.html (LF)');
} else if (html.includes(oldTarget.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldTarget.replace(/\n/g, '\r\n'), newReplacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced in index.html (CRLF)');
} else {
  console.log('Target not found in index.html');
}

