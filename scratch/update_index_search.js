const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Thay thế ô tìm kiếm tab Bán Hàng
const oldSalesSearch = `          <!-- Cụm TÌM KIẾM TRONG KHUNG -->
          <div id="salesSearchBoxWrapper"
            style="display: flex; align-items: center; gap: 8px; height: 36px; box-sizing: border-box; background: #0c121e; border: 1.5px solid #1e293b; border-radius: 8px; padding: 0 12px; flex-shrink: 0; flex-wrap: nowrap;">
            <span
              style="display: inline-flex; align-items: center; font-size: 0.82rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.5px; white-space: nowrap; user-select: none;">TÌM
              KIẾM:</span>
            <input type="text" class="search-sales-input" inputmode="text"
              style="height: 100%; line-height: 36px; box-sizing: border-box; width: 200px; padding: 0 4px; font-size: 0.85rem; border: none !important; outline: none !important; background: transparent !important; color: #ffffff; box-shadow: none !important;"
              placeholder="🔍 Tìm khách / hàng..." oninput="handleSearchSales(this)">
          </div>`;

const newSalesSearch = `          <!-- Cụm TÌM KIẾM TRONG KHUNG TAB BÁN HÀNG -->
          <div class="search-box-bm" id="salesSearchBoxWrapper"
            style="height: 38px; box-sizing: border-box; position: relative; z-index: 9999; flex-shrink: 0;">
            <span class="search-label-single-line">TÌM KIẾM</span>
            <input type="text" id="salesSearchInput" class="search-input-field search-sales-input" inputmode="text"
              placeholder="🔍 Tìm khách / hàng..." oninput="handleSalesSearchInput(this)"
              onfocus="handleSalesSearchInput(this)" onkeydown="handleSalesSearchKeydown(event)"
              autocomplete="off" style="width: 200px;">
            <button type="button" id="btnClearSalesSearch" class="btn-clear-search" onclick="clearSalesSearch()"
              title="Xóa tìm kiếm">✕</button>
            <div id="salesSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
          </div>`;

// 2. Thay thế ô tìm kiếm tab Bán Gà
const oldBangaSearch = `            <!-- CỤM TÌM KIẾM BÁN GÀ -->
            <div class="search-box-bm"
              style="display: inline-flex; align-items: center; gap: 6px; background: #0b1120; border: 1px solid #334155; border-radius: 8px; padding: 4px 10px; width: auto; flex-shrink: 0;">
              <span
                style="font-size: 0.8rem; font-weight: 800; color: #f59e0b; letter-spacing: 0.5px; white-space: nowrap;">TÌM
                KIẾM</span>
              <span style="color: #94a3b8; font-size: 0.85rem;">🔍</span>
              <input type="text" class="search-input-field" placeholder="Tìm tên máy, phụ kiện..." inputmode="text"
                oninput="handleSearchBanga(this)"
                style="background: transparent; border: none; outline: none; color: #ffffff; font-size: 0.85rem; width: 175px;">
              <button type="button" class="btn-clear-search" onclick="clearBangaSearch(this)" title="Xóa tìm kiếm"
                style="display: none; background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 0 2px;">✕</button>
            </div>`;

const newBangaSearch = `            <!-- CỤM TÌM KIẾM BÁN GÀ -->
            <div class="search-box-bm" id="bangaSearchBoxWrapper"
              style="height: 38px; box-sizing: border-box; position: relative; z-index: 9999; flex-shrink: 0;">
              <span class="search-label-single-line">TÌM KIẾM</span>
              <input type="text" id="bangaSearchInput" class="search-input-field" inputmode="text"
                placeholder="🔍 Tìm tên máy, phụ kiện..." oninput="handleBangaSearchInput(this)"
                onfocus="handleBangaSearchInput(this)" onkeydown="handleBangaSearchKeydown(event)"
                autocomplete="off" style="width: 200px;">
              <button type="button" id="btnClearBangaSearch" class="btn-clear-search" onclick="clearBangaSearchNew()"
                title="Xóa tìm kiếm">✕</button>
              <div id="bangaSearchSuggestions" class="phone-search-suggestions-dropdown" style="display: none;"></div>
            </div>`;

let successCount = 0;

if (html.includes(oldSalesSearch)) {
  html = html.replace(oldSalesSearch, newSalesSearch);
  successCount++;
  console.log('Replaced sales search in html (LF)');
} else if (html.includes(oldSalesSearch.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldSalesSearch.replace(/\n/g, '\r\n'), newSalesSearch.replace(/\n/g, '\r\n'));
  successCount++;
  console.log('Replaced sales search in html (CRLF)');
} else {
  console.log('Old sales search not found');
}

if (html.includes(oldBangaSearch)) {
  html = html.replace(oldBangaSearch, newBangaSearch);
  successCount++;
  console.log('Replaced banga search in html (LF)');
} else if (html.includes(oldBangaSearch.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldBangaSearch.replace(/\n/g, '\r\n'), newBangaSearch.replace(/\n/g, '\r\n'));
  successCount++;
  console.log('Replaced banga search in html (CRLF)');
} else {
  console.log('Old banga search not found');
}

if (successCount === 2) {
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html updated successfully!');
}

