const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace the top-outer button with an inside button positioned at top-right inside stats-modal-inner
const oldBtnWrapper = `<div class="stats-modal-wrapper" style="position: relative; width: 100%; max-width: 560px; margin: auto;">
      <!-- NÚT ĐÓNG BÊN NGOÀI KHUNG TRÊN CÙNG BÊN PHẢI -->
      <button type="button" class="stats-top-outer-close-btn" onclick="closeMobileRevenueStatsModal()"
        style="position: absolute; top: -16px; right: -10px; z-index: 10; background: #ef4444; border: 2.5px solid #ffffff; color: #ffffff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.85), 0 0 12px rgba(239,68,68,0.8); font-weight: 900; font-size: 1.15rem; line-height: 1; padding: 0;"
        title="Đóng bảng theo dõi">
        ✕
      </button>

      <div class="stats-modal-inner">`;

const newBtnWrapper = `<div class="stats-modal-inner" style="position: relative;">
      <!-- NÚT ĐÓNG TRÊN CÙNG BÊN PHẢI (TRONG GÓC KHUNG, KHÔNG BỊ TRÀN HAY BỊ LẤP MẤT GÓC) -->
      <button type="button" class="stats-top-outer-close-btn" onclick="closeMobileRevenueStatsModal()"
        style="position: absolute; top: 12px; right: 12px; z-index: 10; background: #ef4444; border: 2px solid #ffffff; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(239,68,68,0.5); font-weight: 900; font-size: 1rem; line-height: 1; padding: 0;"
        title="Đóng bảng theo dõi">
        ✕
      </button>`;

const oldEnd = `      </div>

    </div>
    </div>
  </div>`;

const newEnd = `      </div>

    </div>
  </div>`;

const normalize = s => s.replace(/\r\n/g, '\n');
let norm = normalize(html);

norm = norm.replace(normalize(oldBtnWrapper), normalize(newBtnWrapper));
norm = norm.replace(normalize(oldEnd), normalize(newEnd));

fs.writeFileSync('index.html', norm, 'utf8');
console.log('Fixed close button placement inside top-right corner!');

