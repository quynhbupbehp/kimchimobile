const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const isCRLF = html.includes('\r\n');
const normalize = s => isCRLF ? s.replace(/\r?\n/g, '\r\n') : s.replace(/\r\n/g, '\n');

const oldHtml = normalize(`          <!-- 1. Ô TÌM KIẾM -->
          <div class="search-box-bm"
            style="width: 260px; max-width: 280px; flex: none; height: 38px; box-sizing: border-box; padding: 6px 12px; position: relative;">
            <span class="search-label-single-line" style="color: #ffffff; font-weight: 800;">TÌM KIẾM</span>
            <input type="text" id="soldPhoneSearchInput" class="search-input-field" inputmode="text"
              placeholder="🔍 Tìm tên máy, IMEI" oninput="handleSoldPhoneSearchInput(this)"
              onfocus="handleSoldPhoneSearchInput(this)" onkeydown="handleSoldPhoneSearchKeydown(event)"
              autocomplete="off">
            <button type="button" id="btnClearSoldPhoneSearch" class="btn-clear-search" onclick="clearSoldPhoneSearch()"
              title="Xóa tìm kiếm">✕</button>
            <div id="soldPhoneSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
          </div>`);

const newHtml = normalize(`          <!-- 1. Ô TÌM KIẾM -->
          <div class="search-box-bm" style="height: 38px; box-sizing: border-box; position: relative;">
            <span class="search-label-single-line">TÌM KIẾM</span>
            <input type="text" id="soldPhoneSearchInput" class="search-input-field" inputmode="text"
              placeholder="🔍 tìm theo tên máy hoặc imei" oninput="handleSoldPhoneSearchInput(this)"
              onfocus="handleSoldPhoneSearchInput(this)" onkeydown="handleSoldPhoneSearchKeydown(event)"
              autocomplete="off">
            <button type="button" id="btnClearSoldPhoneSearch" class="btn-clear-search" onclick="clearSoldPhoneSearch()"
              title="Xóa tìm kiếm">✕</button>
            <div id="soldPhoneSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
          </div>`);

if (!html.includes(oldHtml)) {
  console.error('oldHtml not found!');
  process.exit(1);
}
html = html.replace(oldHtml, newHtml);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html search box for tab baohanh!');

