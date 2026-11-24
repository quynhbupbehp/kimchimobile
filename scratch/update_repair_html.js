const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldRepairSearch = `            <!-- Cột 2 (Giữa): TÌM KIẾM + TRẠNG THÁI + MŨI TÊN EXCEL (CĂN CHÍNH GIỮA) -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
              <span
                style="font-size: 0.85rem; color: #94a3b8; font-weight: 900; letter-spacing: 0.5px; white-space: nowrap;">TÌM
                KIẾM</span>
              <div class="repair-search-wrap"
                style="position: relative; height: 38px; width: 230px; display: flex; align-items: center; background: #0c121d; border: 1px solid #1f293d; border-radius: 8px;">
                <svg viewBox="0 0 24 24"
                  style="width: 15px; height: 15px; fill: none; stroke: #94a3b8; stroke-width: 2.5; margin-left: 10px; flex-shrink: 0;">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" id="repairSearchInput" placeholder="Tìm tên máy, khách hàng" inputmode="text"
                  oninput="handleRepairSearchInput(this.value)"
                  style="padding-right: 28px; width: 100%; border: none; background: transparent; outline: none; padding-left: 8px; color: #fff; font-size: 0.85rem; font-weight: 600;">
                <button type="button" id="btnClearRepairSearch" onclick="clearRepairSearch()"
                  style="display: none; position: absolute; right: 8px; background: none; border: none; color: #ef4444; font-size: 1rem; font-weight: 900; cursor: pointer; padding: 0 4px; line-height: 1;"
                  title="Xóa tìm kiếm">✕</button>
              </div>`;

const newRepairSearch = `            <!-- Cột 2 (Giữa): TÌM KIẾM + TRẠNG THÁI + MŨI TÊN EXCEL (CĂN CHÍNH GIỮA) -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
              <div class="search-box-bm" id="repairSearchBoxWrapper"
                style="height: 38px; box-sizing: border-box; position: relative; z-index: 9999; flex-shrink: 0;">
                <span class="search-label-single-line">TÌM KIẾM</span>
                <input type="text" id="repairSearchInput" class="search-input-field" inputmode="text"
                  placeholder="🔍 Tìm tên máy, khách..." oninput="handleRepairSearchInput(this)"
                  onfocus="handleRepairSearchInput(this)" onkeydown="handleRepairSearchKeydown(event)"
                  autocomplete="off" style="width: 200px;">
                <button type="button" id="btnClearRepairSearch" class="btn-clear-search" onclick="clearRepairSearch()"
                  title="Xóa tìm kiếm">✕</button>
                <div id="repairSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
              </div>`;

if (html.includes(oldRepairSearch)) {
  html = html.replace(oldRepairSearch, newRepairSearch);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced repair search in index.html (LF)');
} else if (html.includes(oldRepairSearch.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldRepairSearch.replace(/\n/g, '\r\n'), newRepairSearch.replace(/\n/g, '\r\n'));
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced repair search in index.html (CRLF)');
} else {
  console.log('oldRepairSearch not found in index.html');
}

