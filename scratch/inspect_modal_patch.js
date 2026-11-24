const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the bottom close button from footer
const bottomBtnStr1 = `        <!-- CỤM BÊN PHẢI NGOÀI CÙNG: NÚT ĐÓNG (84px, CHỮ 0.85rem) -->
        <button type="button" class="stats-close-btn" onclick="closeMobileRevenueStatsModal()"
          style="flex: 0 0 84px; width: 84px; min-width: 84px; display: inline-flex; align-items: center; justify-content: center; text-align: center; line-height: 34px; background: #ef4444; border: 1.5px solid #ef4444; color: #ffffff; height: 34px; max-height: 34px; min-height: 34px; padding: 0; border-radius: 6px; font-size: 0.85rem; font-weight: 900; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; transition: transform 0.1s; box-shadow: 0 2px 8px rgba(239,68,68,0.3); box-sizing: border-box; margin: 0;">
          <span style="display: inline-block; line-height: 1; text-align: center;">ĐÓNG</span>
        </button>`;

// 2. Add wrapper with floating top-right close button outside the frame
const modalInnerOld = `<div class="stats-modal-inner">`;

const modalInnerNew = `<div class="stats-modal-wrapper" style="position: relative; width: 100%; max-width: 560px; margin: auto;">
      <!-- NÚT ĐÓNG BÊN NGOÀI KHUNG TRÊN CÙNG BÊN PHẢI -->
      <button type="button" onclick="closeMobileRevenueStatsModal()"
        style="position: absolute; top: -16px; right: -12px; z-index: 10; background: #ef4444; border: 2px solid #ffffff; color: #ffffff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.8), 0 0 10px rgba(239,68,68,0.6); font-weight: 900; font-size: 1.15rem; line-height: 1; padding: 0;"
        title="Đóng bảng theo dõi">
        ✕
      </button>

      <div class="stats-modal-inner">`;

const modalEndOld = `      </div>

    </div>
  </div>`;

const modalEndNew = `      </div>

    </div>
    </div>
  </div>`;

console.log('Found bottomBtn:', html.includes(bottomBtnStr1));
console.log('Found modalInnerOld:', html.includes(modalInnerOld));

