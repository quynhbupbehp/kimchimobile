const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace the current close button in mobileRevenueStatsModal
const oldBtn = `      <!-- NÚT ĐÓNG TRÊN CÙNG BÊN PHẢI (TRONG GÓC KHUNG, KHÔNG BỊ TRÀN HAY BỊ LẤP MẤT GÓC) -->
      <button type="button" class="stats-top-outer-close-btn" onclick="closeMobileRevenueStatsModal()"
        style="position: absolute; top: 12px; right: 12px; z-index: 10; background: #ef4444; border: 2px solid #ffffff; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(239,68,68,0.5); font-weight: 900; font-size: 1rem; line-height: 1; padding: 0;"
        title="Đóng bảng theo dõi">
        ✕
      </button>`;

const newBtn = `      <!-- NÚT ĐÓNG TINH TẾ GÓC PHẢI (ĐẸP TRÊN CẢ WEB LẪN MOBILE) -->
      <button type="button" class="stats-top-outer-close-btn" onclick="closeMobileRevenueStatsModal()"
        style="position: absolute; top: 10px; right: 12px; z-index: 20; background: transparent; border: none; color: #94a3b8; font-size: 1.35rem; font-weight: 900; width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1; padding: 0; transition: all 0.2s ease;"
        onmouseover="this.style.color='#ffffff'; this.style.background='rgba(239,68,68,0.85)';"
        onmouseout="this.style.color='#94a3b8'; this.style.background='transparent';"
        title="Đóng bảng theo dõi">✕</button>`;

const normalize = s => s.replace(/\r\n/g, '\n');
let norm = normalize(html);

if (norm.includes(normalize(oldBtn))) {
  norm = norm.replace(normalize(oldBtn), normalize(newBtn));
  fs.writeFileSync('index.html', norm, 'utf8');
  console.log('Successfully updated close button style!');
} else {
  console.log('Old button target not found');
}

