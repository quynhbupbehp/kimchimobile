const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldWrap = `          <!-- Menu sổ xuống chọn tháng nằm góc phải cùng hàng với tab -->
          <div id="repMonthPickerWrap" style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #94a3b8;">📅 Chọn Tháng :</span>
            <select id="repSelectMonth" onchange="changeReportSelectedMonth(this.value)"
              style="background: #111724; border: 1px solid #1f2a3e; color: #facc15; font-weight: 900; font-size: 0.9rem; padding: 6px 14px; border-radius: 8px; cursor: pointer; outline: none;">
              <option value="01/2026">Tháng 01/2026</option>
              <option value="02/2026">Tháng 02/2026</option>
              <option value="03/2026">Tháng 03/2026</option>
              <option value="04/2026">Tháng 04/2026</option>
              <option value="05/2026">Tháng 05/2026</option>
              <option value="06/2026">Tháng 06/2026</option>
              <option value="07/2026">Tháng 07/2026</option>
              <option value="08/2026">Tháng 08/2026</option>
              <option value="09/2026">Tháng 09/2026</option>
              <option value="10/2026" selected>Tháng 10/2026</option>
              <option value="11/2026">Tháng 11/2026</option>
              <option value="12/2026">Tháng 12/2026</option>
            </select>
          </div>`;

const newWrap = `          <!-- Menu sổ xuống chọn tháng & năm nằm góc phải cùng hàng với tab -->
          <div id="repMonthPickerWrap" style="display: flex; align-items: center; gap: 6px; background: #000000; border: 1.5px solid #334155; border-radius: 9px; padding: 2px 10px; height: 38px; box-sizing: border-box;">
            <span style="font-size: 1rem; line-height: 1;">📅</span>
            <select id="repSelectMonth" onchange="changeReportMonthYear()"
              style="background: transparent; border: none; color: #facc15; font-weight: 900; font-size: 0.95rem; cursor: pointer; outline: none; padding: 0 4px;">
              <option value="01" style="background: #0d121d; color: #fff;">Tháng 1</option>
              <option value="02" style="background: #0d121d; color: #fff;">Tháng 2</option>
              <option value="03" style="background: #0d121d; color: #fff;">Tháng 3</option>
              <option value="04" style="background: #0d121d; color: #fff;">Tháng 4</option>
              <option value="05" style="background: #0d121d; color: #fff;">Tháng 5</option>
              <option value="06" style="background: #0d121d; color: #fff;">Tháng 6</option>
              <option value="07" style="background: #0d121d; color: #fff;">Tháng 7</option>
              <option value="08" style="background: #0d121d; color: #fff;">Tháng 8</option>
              <option value="09" style="background: #0d121d; color: #fff;">Tháng 9</option>
              <option value="10" style="background: #0d121d; color: #fff;">Tháng 10</option>
              <option value="11" style="background: #0d121d; color: #fff;">Tháng 11</option>
              <option value="12" style="background: #0d121d; color: #fff;">Tháng 12</option>
            </select>
            <span style="color: #64748b; font-weight: 900; font-size: 1rem; user-select: none;">/</span>
            <select id="repSelectYear" onchange="changeReportMonthYear()"
              style="background: transparent; border: none; color: #facc15; font-weight: 900; font-size: 0.95rem; cursor: pointer; outline: none; padding: 0 4px;">
              <option value="2024" style="background: #0d121d; color: #fff;">2024</option>
              <option value="2025" style="background: #0d121d; color: #fff;">2025</option>
              <option value="2026" style="background: #0d121d; color: #fff;">2026</option>
              <option value="2027" style="background: #0d121d; color: #fff;">2027</option>
              <option value="2028" style="background: #0d121d; color: #fff;">2028</option>
            </select>
          </div>`;

if (html.includes(oldWrap)) {
  html = html.replace(oldWrap, newWrap);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced in index.html (LF)');
} else if (html.includes(oldWrap.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldWrap.replace(/\n/g, '\r\n'), newWrap.replace(/\n/g, '\r\n'));
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced in index.html (CRLF)');
} else {
  console.log('oldWrap not found in index.html');
}

