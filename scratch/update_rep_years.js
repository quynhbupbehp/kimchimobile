const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldYearSelect = `            <select id="repSelectYear" onchange="changeReportMonthYear()"
              style="background: transparent; border: none; color: #facc15; font-weight: 900; font-size: 0.95rem; cursor: pointer; outline: none; padding: 0 4px;">
              <option value="2024" style="background: #0d121d; color: #fff;">2024</option>
              <option value="2025" style="background: #0d121d; color: #fff;">2025</option>
              <option value="2026" style="background: #0d121d; color: #fff;">2026</option>
              <option value="2027" style="background: #0d121d; color: #fff;">2027</option>
              <option value="2028" style="background: #0d121d; color: #fff;">2028</option>
            </select>`;

const newYearSelect = `            <select id="repSelectYear" onchange="changeReportMonthYear()"
              style="background: transparent; border: none; color: #facc15; font-weight: 900; font-size: 0.95rem; cursor: pointer; outline: none; padding: 0 4px;">
              <option value="2026" style="background: #0d121d; color: #fff;">2026</option>
              <option value="2027" style="background: #0d121d; color: #fff;">2027</option>
              <option value="2028" style="background: #0d121d; color: #fff;">2028</option>
              <option value="2029" style="background: #0d121d; color: #fff;">2029</option>
              <option value="2030" style="background: #0d121d; color: #fff;">2030</option>
            </select>`;

if (html.includes(oldYearSelect)) {
  html = html.replace(oldYearSelect, newYearSelect);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced year options in index.html (LF)');
} else if (html.includes(oldYearSelect.replace(/\n/g, '\r\n'))) {
  html = html.replace(oldYearSelect.replace(/\n/g, '\r\n'), newYearSelect.replace(/\n/g, '\r\n'));
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced year options in index.html (CRLF)');
} else {
  console.log('oldYearSelect not found in index.html');
}

