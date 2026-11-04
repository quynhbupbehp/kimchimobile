    /* ============================================================
       HỆ THỐNG THÔNG BÁO TỰ TẮT SAU 2 GIÂY (TOAST NOTIFICATION)
       Thay thế toàn bộ window.alert chuẩn của trình duyệt
       ============================================================ */
    let _globalToastTimer = null;

    function showToast(msg, duration = 2000) {
      if (msg === undefined || msg === null) return;
      const text = String(msg).trim();
      if (!text) return;

      let toast = document.getElementById('globalSystemToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalSystemToast';
        toast.className = 'global-system-toast';
        toast.onclick = function() { hideToast(); };
        toast.title = 'Bấm để tắt thông báo';
        document.body.appendChild(toast);
      }

      const isDanger = /lỗi|thất bại|không thể|cảnh báo|chưa nhập|xóa|vui lòng/i.test(text);
      const isWarn = /chú ý|cần|lưu ý/i.test(text);

      let iconHtml = '✔';
      let borderColor = '#10b981';
      let glowColor = 'rgba(16, 185, 129, 0.45)';
      let iconBg = '#065f46';
      let iconColor = '#34d399';

      if (isDanger) {
        iconHtml = '✕';
        borderColor = '#ef4444';
        glowColor = 'rgba(239, 68, 68, 0.45)';
        iconBg = '#7f1d1d';
        iconColor = '#f87171';
      } else if (isWarn) {
        iconHtml = '⚠️';
        borderColor = '#f59e0b';
        glowColor = 'rgba(245, 158, 11, 0.45)';
        iconBg = '#78350f';
        iconColor = '#fbbf24';
      }

      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      let contentHtml = '';
      if (lines.length > 0) {
        contentHtml += `<div style="font-weight: 800; font-size: 0.98rem; color: #ffffff; margin-bottom: ${lines.length > 1 ? '6px' : '0'}; line-height: 1.4;">${escapeHtmlToast(lines[0])}</div>`;
        for (let i = 1; i < lines.length; i++) {
          contentHtml += `<div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; padding-left: 2px;">${escapeHtmlToast(lines[i])}</div>`;
        }
      }

      toast.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
          <div style="width: 28px; height: 28px; min-width: 28px; border-radius: 50%; background: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.95rem; margin-top: 1px;">${iconHtml}</div>
          <div style="flex: 1; word-break: break-word;">${contentHtml}</div>
          <button type="button" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; line-height: 1; cursor: pointer; padding: 0 4px; margin-left: 4px;" title="Đóng">×</button>
        </div>
        <div id="globalToastProgressBar" style="position: absolute; bottom: 0; left: 0; height: 3px; background: ${borderColor}; width: 100%; border-radius: 0 0 12px 12px; transition: width ${duration}ms linear;"></div>
      `;

      toast.style.borderColor = borderColor;
      toast.style.boxShadow = `0 14px 40px rgba(0, 0, 0, 0.75), 0 0 20px ${glowColor}`;

      toast.classList.add('show');

      const pBar = document.getElementById('globalToastProgressBar');
      if (pBar) {
        void pBar.offsetWidth;
        pBar.style.width = '0%';
      }

      clearTimeout(_globalToastTimer);
      _globalToastTimer = setTimeout(() => {
        hideToast();
      }, duration);
    }

    function hideToast() {
      const toast = document.getElementById('globalSystemToast');
      if (toast) {
        toast.classList.remove('show');
      }
      clearTimeout(_globalToastTimer);
    }

    function escapeHtmlToast(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Override toàn cục window.alert để tất cả thông báo tự động tắt sau 2 giây
    window.alert = function(msg) {
      showToast(msg, 2000);
    };
    window.showToast = showToast;
    window.hideToast = hideToast;

    /* ============================================================
       HÀM RÚT GỌN TÊN MÁY TRONG BẢNG BÁN HÀNG
       Chỉ hiển thị ngắn gọn tên máy (bỏ hãng, dung lượng và imei)
       ============================================================ */
    function formatSalesShortDeviceName(name, item) {
      if (!name) return '';
      let str = name;

      let isPhoneItem = (item && (item.phoneName || item.imei || item.brand || (item.accessory && String(item.accessory).includes('Bán Máy')))) ||
                        /\([0-9a-zA-Z\s]{2,}\)$/.test(str) ||
                        /^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|sony|vsmart|google|pixel|máy ngoài|❤️❤️❤️)\s*[-–]/i.test(str);

      if (!isPhoneItem) {
        return (item && item.name) ? item.name.replace(/\s*\(x1\)/gi, '').trim() : str;
      }

      if (item && item.phoneName) {
        str = item.phoneName;
      }

      // 1. Xóa bỏ icon tim hoặc MÁY NGOÀI
      str = str.replace(/^(?:<[^>]+>|❤️❤️❤️|MÁY NGOÀI)\s*[-–]?\s*/gi, '');

      // 2. Xóa bỏ IMEI ở đuôi: (1221), (3344)...
      str = str.replace(/\s*\([A-Za-z0-9\s]+\)\s*$/, '');

      // 3. Xóa bỏ hãng ở đầu:
      str = str.replace(/^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|apple\s*watch|sony|lg|google\s*pixel|pixel|asus|zte|lenovo|vsmart)\s*[-–]?\s*/gi, '');

      // 4. Nếu vẫn còn dạng Hãng - Tên Máy với dấu gạch ngang
      str = str.replace(/^[A-Za-z0-9\s]+?\s*[-–]\s*/, '');

      // 5. Xóa bỏ dung lượng: 16GB, 32GB, 64GB, 128GB, 256GB, 512GB, 1TB, 2TB, 64g, 128g...
      str = str.replace(/\b\d+\s*(?:gb|tb|mb|g|t)\b/gi, '');

      // 6. Xóa bỏ dấu ngoặc đơn trống nếu còn sót
      str = str.replace(/\(\s*\)/g, '');

      // 7. Chuẩn hóa khoảng trắng
      str = str.replace(/\s+/g, ' ').trim();

      return str || name;
    }
    window.formatSalesShortDeviceName = formatSalesShortDeviceName;

    function toggleMobileSidebar() {
      const sidebar = document.querySelector('aside.sidebar');
      const overlay = document.getElementById('mobileSidebarOverlay');
      if (sidebar) sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('active');
    }
    window.toggleMobileSidebar = toggleMobileSidebar;

    function closeMobileSidebar() {
      const sidebar = document.querySelector('aside.sidebar');
      const overlay = document.getElementById('mobileSidebarOverlay');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
    }
    window.closeMobileSidebar = closeMobileSidebar;

    function switchMainTab(tabName, btnElement) {
      document.querySelectorAll('.main-tab-btn-v').forEach(b => b.classList.remove('active'));
      if (btnElement && btnElement.classList && btnElement.classList.contains('main-tab-btn-v')) {
        btnElement.classList.add('active');
      } else {
        const matchingBtn = document.querySelector(`.main-tab-btn-v[onclick*="${tabName}"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
      }

      // Đồng bộ thanh cuộn ngang tab trên điện thoại (chỉ cuộn thanh tab ngang, không giật màn hình)
      document.querySelectorAll('.mobile-tab-pill').forEach(pill => {
        if (pill.getAttribute('data-tab') === tabName) {
          pill.classList.add('active');
          try {
            const nav = pill.parentElement;
            if (nav && nav.classList.contains('mobile-quick-nav')) {
              const scrollLeft = pill.offsetLeft - (nav.clientWidth / 2) + (pill.clientWidth / 2);
              nav.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
            }
          } catch (e) {}
        } else {
          pill.classList.remove('active');
        }
      });

      // Tự động đóng mobile drawer nếu đang mở
      closeMobileSidebar();

      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const targetTab = document.getElementById('tab-' + tabName);
      if (targetTab) {
        targetTab.classList.add('active');
        // Cuộn mượt lên đầu nội dung tab trên điện thoại
        if (window.innerWidth <= 1023) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }

      if (tabName === 'baogia') {
        if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
        if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();
        if (typeof renderPartsTable === 'function') renderPartsTable();
      }
      if (tabName === 'phanmem') {
        const isDebt = typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive;
        const titleBar = document.getElementById('swMainTitleBar');
        const btnCongNo = document.getElementById('swBtnCongNo');
        if (titleBar) {
          if (isDebt) {
            titleBar.innerText = 'DANH SÁCH NỢ';
            titleBar.classList.add('is-debt');
            titleBar.style.color = '#facc15';
          } else {
            titleBar.innerText = 'DANH SÁCH PHẦN MỀM';
            titleBar.classList.remove('is-debt');
            titleBar.style.color = '#ffffff';
          }
        }
        if (btnCongNo) {
          btnCongNo.innerText = isDebt ? 'PHẦN MỀM' : 'CÔNG NỢ';
          btnCongNo.title = isDebt ? 'Bấm vào để quay lại tab danh sách phần mềm' : 'Xem sổ công nợ phần mềm';
          if (isDebt) btnCongNo.classList.add('active');
          else btnCongNo.classList.remove('active');
        }
        // Mỗi khi vào tab phần mềm, tự động đồng bộ bộ lọc ngày về ngày hiện tại
        const vnNow = getVietnamDate();
        const ddStr = String(vnNow.getDate()).padStart(2, '0');
        const mmStr = String(vnNow.getMonth() + 1).padStart(2, '0');
        const yyyy = vnNow.getFullYear();
        const curTodayStr = `${ddStr}/${mmStr}/${yyyy}`;

        swFilterDate = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
        currentSoftwareMonthFilter = { month: vnNow.getMonth(), year: yyyy };
        currentSoftwareYearFilter = yyyy;

        const swDateDisp = document.getElementById('filterSoftwareDateDisplay');
        if (swDateDisp) {
          if (swDateDisp.tagName === 'INPUT') swDateDisp.value = curTodayStr;
          swDateDisp.innerText = curTodayStr;
        }

        if (typeof renderSoftwareTable === 'function') {
          renderSoftwareTable(typeof softwareDatabase !== 'undefined' ? softwareDatabase : []);
        }
        if (isDebt && typeof renderSoftwareDebtTable === 'function') {
          renderSoftwareDebtTable();
        }
      }
      if (tabName === 'banhang') {
        if (typeof renderSalesTable === 'function') renderSalesTable(typeof salesDatabase !== 'undefined' ? salesDatabase : []);
      }
      if (tabName === 'banga') {
        if (typeof renderBangaTable === 'function') renderBangaTable(typeof bangaDatabase !== 'undefined' ? bangaDatabase : []);
      }
      if (tabName === 'banmay') {
        if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
      }
      if (tabName === 'baohanh') {
        if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
      }
      if (tabName === 'suachua') {
        if (typeof renderRepairTable === 'function') renderRepairTable();
      }
      if (tabName === 'congno') {
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
      }
      if (tabName === 'baocao') {
        if (typeof renderFinancialReports === 'function') renderFinancialReports();
        if (typeof renderActivityLogTable === 'function') renderActivityLogTable();
        if (typeof renderSystemAccountsTable === 'function') renderSystemAccountsTable();
      }
      if (tabName === 'quynhbupbe') {
        if (typeof loadQuynhNotes === 'function') loadQuynhNotes();
        if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
      }
      if (typeof initUniversalSearchClearButtons === 'function') {
        setTimeout(initUniversalSearchClearButtons, 30);
      }
      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }
    window.switchMainTab = switchMainTab;


    function validatePriceKeypress(e) {
      let charCode = e.charCode ? e.charCode : e.keyCode;
      let charStr = String.fromCharCode(charCode);
      let inputVal = e.target.value;

      if (!/[0-9\.]/.test(charStr)) {
        e.preventDefault();
        return;
      }

      if (charStr === '.' && inputVal.includes('.')) {
        e.preventDefault();
        return;
      }

      let cleanDigits = inputVal.replace(/\D/g, '');
      if (cleanDigits.length >= 5 && charStr !== '.') {
        e.preventDefault();
      }
    }

    function formatPriceStr(val) {
      if (val === null || val === undefined || val === '') return '';
      if (typeof val === 'number') {
        val = Math.round(val);
      }
      let str = val.toString().trim();
      let isNeg = str.startsWith('-');
      let clean = str.replace(/\D/g, '');
      if (!clean) return '';
      clean = clean.replace(/^0+(?=\d)/, '');
      let formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return isNeg ? `-${formatted}` : formatted;
    }

    function parsePriceNum(val) {
      if (val === null || val === undefined || val === '') return 0;
      let str = val.toString().trim();
      let isNeg = str.startsWith('-');
      let clean = str.replace(/\D/g, '');
      if (!clean) return 0;
      let num = parseInt(clean, 10);
      return isNeg ? -num : num;
    }

    function autoExpandMoney(val) {
      if (val === null || val === undefined || val === '') return '';
      return formatPriceStr(val);
    }
    window.autoExpandMoney = autoExpandMoney;

    function parseRawNumber(val) {
      return parsePriceNum(val);
    }

    function formatCurrencyInput(input) {
      let cursorPosition = input.selectionStart;
      let originalLength = input.value.length;
      input.value = formatPriceStr(input.value);
      let newLength = input.value.length;
      cursorPosition = cursorPosition + (newLength - originalLength);
      if (cursorPosition < 0) cursorPosition = 0;
      input.setSelectionRange(cursorPosition, cursorPosition);
    }

    function formatSoftwareItemDateTime(item) {
      if (!item) return { dateStr: '--/--/----', timeStr: '' };
      let rawDM = String(item.dayMonth || '').trim();
      let rawYear = String(item.year || '').trim();
      let rawTime = String(item.time || '').trim();

      let d = '01', m = '01', y = rawYear || '2026';

      // 1. Kiểm tra nếu item.dayMonth chứa cả YYYY-MM-DD hoặc DD/MM/YYYY
      let mIso = rawDM.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (mIso) {
        y = mIso[1];
        m = mIso[2].padStart(2, '0');
        d = mIso[3].padStart(2, '0');
      } else {
        let parts = rawDM.replace(/\//g, '-').split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            y = parts[0]; m = parts[1].padStart(2, '0'); d = parts[2].padStart(2, '0');
          } else {
            d = parts[0].padStart(2, '0'); m = parts[1].padStart(2, '0'); y = parts[2];
          }
        } else if (parts.length === 2) {
          d = parts[0].padStart(2, '0');
          m = parts[1].padStart(2, '0');
        }
      }

      if (!y || y.length < 4) y = '2026';

      let dateStr = `${d}/${m}/${y}`;

      // 2. Chuẩn hóa time: Nếu là '00:00', rỗng hoặc không có giờ -> để trống
      let timeStr = '';
      if (rawTime && rawTime !== '00:00' && rawTime !== '0:0' && rawTime !== '00:00:00') {
        timeStr = rawTime;
      }

      return { dateStr, timeStr };
    }
    window.formatSoftwareItemDateTime = formatSoftwareItemDateTime;

    function formatBrandDeviceName(str) {
      if (!str || typeof str !== 'string') return str || '';
      let res = str;
      // Loại bỏ GB bị thêm nhầm sau 1 hoặc 2 số của tên máy (VD: 9GB, 11GB, 12GB, 14GB -> 9, 11, 12, 14)
      res = res.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1');
      // Riêng iphone và ipad: người dùng ghi iphone/ipad thì hiển thị iPhone/iPad, còn ghi IPHONE/IPAD thì hiển thị đúng như vậy
      res = res.replace(/(?<!\p{L})(iphone|Iphone)(?!\p{L})/gu, 'iPhone');
      res = res.replace(/(?<!\p{L})(ipad|Ipad)(?!\p{L})/gu, 'iPad');
      // Chữ se: người dùng ghi se thì viết thành SE
      res = res.replace(/(?<!\p{L})se(?!\p{L})/gui, 'SE');
      return res;
    }

    function toTitleCase(str) {
      if (!str || typeof str !== 'string') return '';
      
      // Quy tắc: Từ/chữ nào quá 7 kí tự mà KHÔNG ngăn cách bởi dấu cách thì KHÔNG tự ý viết hoa,
      // người dùng viết sao hiển thị vậy (VD: quynhbupbe hay QuynhBupBe, file.unlocktool.net, rom_fix_lag.zip...)
      // Do đó ta phân tách chuỗi theo ranh giới DẤU CÁCH (\s+):
      let chunks = str.split(/(\s+)/);
      let res = chunks.map(chunk => {
        // Nếu là khoảng trắng (dấu cách): giữ nguyên
        if (!chunk || /^\s+$/.test(chunk)) return chunk;

        // Nếu từ/cụm từ không có dấu cách dài hơn 7 ký tự:
        // Người dùng viết sao hiển thị y như thế, không can thiệp viết hoa
        if (chunk.length > 7) {
          return chunk;
        }

        // Với các từ <= 7 ký tự: áp dụng quy tắc Title Case
        return chunk.replace(/[\p{L}\p{N}]+/gu, function(word) {
          // Riêng iphone và ipad:
          // Nếu người dùng ghi IPHONE, IPAD thì hiển thị đúng như vậy
          if (word === 'IPHONE') return 'IPHONE';
          if (word === 'IPAD') return 'IPAD';
          // Người dùng ghi iphone, ipad thì hiển thị iPhone, iPad
          if (word.toLowerCase() === 'iphone') return 'iPhone';
          if (word.toLowerCase() === 'ipad') return 'iPad';

          // Nếu ghi dạng số kèm chữ (ví dụ 6S, 6s, 7s, 8S, 5G, 4G...): chữ sau số hiển thị đúng ý người dùng
          if (/^\d+\p{L}+$/u.test(word)) {
            return word;
          }

          // Những từ có 2 kí tự:
          if (word.length === 2) {
            // SE: người dùng ghi SE thì hiển thị SE, người dùng ghi sE/se thì hiển thị SE
            if (word.toLowerCase() === 'se') {
              return 'SE';
            }
            // Các từ 2 ký tự khác: viết hoa chữ cái đầu, phần sau theo đúng người dùng viết
            return word.charAt(0).toUpperCase() + word.slice(1);
          }

          // Tự động viết hoa chữ cái đầu tiên của 1 chữ
          return word.charAt(0).toUpperCase() + word.slice(1);
        });
      }).join('');

      // Giữ nguyên màu sắc đặc thù tiếng Việt
      res = res.replace(/\bSA Mạc\b/gi, 'Sa Mạc');
      res = res.replace(/\bSA Mac\b/gi, 'Sa Mạc');

      return res;
    }

    function formatStorageValue(str) {
      if (!str || typeof str !== 'string') return '';
      let s = str.trim();
      if (!s) return '';

      // Chuẩn hóa khoảng trắng dư thừa
      s = s.replace(/\s+/g, ' ');

      // 1. RAM/ROM kết hợp: 4/64, 3/32, 6/128, 8/256... tự động thêm GB phía sau
      // Hỗ trợ cả gõ: "4/64", "4 / 64", "4/64gb", "4/64GB" -> "4/64GB"
      s = s.replace(/\b(\d+)\s*\/\s*(\d+)(\s*gb)?\b/gi, '$1/$2GB');

      // 2. RAM + ROM: 4+64, 6+128... -> "4+64GB"
      s = s.replace(/\b(\d+)\s*\+\s*(\d+)(\s*gb)?\b/gi, '$1+$2GB');

      // 3. Số dung lượng thuần túy: 16, 32, 64, 128, 256, 512, 1024... tự động thêm GB
      if (/^\d+$/.test(s)) {
        return `${s}GB`;
      }

      // 4. Số kèm ggb, gb, g viết thường hoặc cách ra: 256 ggb -> 256GB, 64 gb, 64g, 64GB -> 64GB
      s = s.replace(/(\d+)\s*ggb\b/gi, '$1GB');
      s = s.replace(/(\d+)\s*(gb|tb|mb|kb)\b/gi, (match, num, unit) => num + unit.toUpperCase());
      s = s.replace(/(\d+)\s*g\b/gi, '$1GB');
      s = s.replace(/(\d+)\s*t\b/gi, '$1TB');

      // 5. Chuẩn hóa đơn vị viết hoa
      s = s.replace(/(^|[\s\/\-\(\[\{.,:+])(gb|tb|mb|kb)\b/gi, (match, sep, unit) => sep + unit.toUpperCase());

      return s;
    }
    window.formatStorageValue = formatStorageValue;

    function formatStorageDisplay(str) {
      return formatStorageValue(str);
    }
    window.formatStorageDisplay = formatStorageDisplay;

    function formatStorageInput(input) {
      if (!input || !input.value) return;
      input.value = formatStorageValue(input.value);
    }
    window.formatStorageInput = formatStorageInput;


    function formatTitleCaseInput(input) {
      if (!input) return;
      let val = input.value;
      if (!val) return;
      // Chỉ tự động định dạng khi vừa gõ phím DẤU CÁCH (để từ > 7 ký tự liền không dấu cách như quynhbupbe, file.unlocktool.net không bị ép viết hoa chữ cái đầu giữa chừng)
      if (/\s$/.test(val)) {
        let cursorPosition = input.selectionStart;
        let formatted = toTitleCase(val);
        if (formatted !== val) {
          input.value = formatted;
          if (cursorPosition !== null) {
            input.setSelectionRange(cursorPosition, cursorPosition);
          }
        }
      }
    }

    /* ============================================================
       TỰ ĐỘNG VIẾT HOA CHỮ CÁI ĐẦU & VIẾT HOA TỪ 1-2 KÝ TỰ KHÔNG DẤU
       ÁP DỤNG CHO TOÀN BỘ CÁC TAB & MODAL TRÊN TOÀN BỘ WEBSITE
       ============================================================ */
    function isAutoTitleCaseInput(input) {
      if (!input || !input.tagName) return false;
      if (input.readOnly || input.disabled) return false;

      let tag = input.tagName.toUpperCase();
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') return false;
      if (tag === 'INPUT' && input.type && !['text', 'search', ''].includes(input.type)) return false;

      // Các trường ngoại lệ (không viết hoa Title Case):
      let id = (input.id || '').toLowerCase();
      let name = (input.name || '').toLowerCase();
      let cls = (input.className || '').toLowerCase();
      let oninput = (input.getAttribute('oninput') || '').toLowerCase();

      // Bỏ qua mật khẩu
      if (input.type === 'password' || id.includes('pass')) return false;
      // Bỏ qua tài khoản, username, user, login
      if (id.includes('user') || name.includes('user') || cls.includes('user') || id.includes('login') || id.includes('acc') || id.includes('taikhoan')) return false;
      // Bỏ qua IMEI, serial
      if (id.includes('imei') || name.includes('imei') || cls.includes('imei') || id.includes('serial')) return false;
      // Bỏ qua Tiền tệ (price, money, cost, amount, profit, formatcurrencyinput)
      if (id.includes('price') || id.includes('money') || id.includes('cost') || id.includes('amount') || id.includes('profit') || oninput.includes('formatcurrencyinput')) return false;
      // Bỏ qua Ngày tháng, giờ (date, time)
      if (id.includes('date') || id.includes('time')) return false;
      // Bỏ qua Số điện thoại
      if (id.includes('sdt') || id.includes('phone_number') || id.includes('phonenumber') || id.includes('tel')) return false;

      return true;
    }
    const isPopupTextInput = isAutoTitleCaseInput;

    // 1. Khi rời ô (blur) hoặc đổi giá trị (change): Chuẩn hóa toàn bộ thành Title Case
    document.addEventListener('blur', function(e) {
      let el = e.target;
      if (isAutoTitleCaseInput(el)) {
        let raw = el.value;
        if (raw) {
          let formatted = toTitleCase(raw);
          if (raw !== formatted) {
            el.value = formatted;
          }
        }
      }
    }, true);

    document.addEventListener('change', function(e) {
      let el = e.target;
      if (isAutoTitleCaseInput(el)) {
        let raw = el.value;
        if (raw) {
          let formatted = toTitleCase(raw);
          if (raw !== formatted) {
            el.value = formatted;
          }
        }
      }
    }, true);

    // 2. Khi đang gõ (input): Tự động viết hoa từ vừa gõ khi bấm dấu cách
    document.addEventListener('input', function(e) {
      let el = e.target;
      if (!isAutoTitleCaseInput(el)) return;

      let val = el.value;
      if (!val) return;

      let oninputAttr = el.getAttribute('oninput') || '';
      if (oninputAttr.includes('formatTitleCaseInput')) return;

      // Nếu vừa gõ dấu cách (để từ liền > 7 ký tự như file.unlocktool.net không bị format giữa chừng):
      if (/\s$/.test(val)) {
        let cursor = el.selectionStart;
        let formatted = toTitleCase(val);
        if (formatted !== val) {
          el.value = formatted;
          if (cursor !== null) {
            el.setSelectionRange(cursor, cursor);
          }
        }
      }
    }, true);

    // 3. Khi dán (paste): Tự động viết hoa toàn bộ chuỗi được dán vào
    document.addEventListener('paste', function(e) {
      let el = e.target;
      if (!isAutoTitleCaseInput(el)) return;
      setTimeout(() => {
        let val = el.value;
        if (val) {
          el.value = toTitleCase(val);
        }
      }, 0);
    }, true);

    function normalizeColorStr(colorName) {
      if (!colorName) return '';
      let s = String(colorName).trim().toLowerCase();
      // Khử dấu tiếng Việt trực tiếp đảm bảo chính xác 100% trên mọi trình duyệt
      s = s.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
           .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
           .replace(/[ìíịỉĩ]/g, 'i')
           .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
           .replace(/[ùúụủũưừứựửữ]/g, 'u')
           .replace(/[ỳýỵỷỹ]/g, 'y')
           .replace(/đ/g, 'd');
      try {
        s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      } catch (e) {}
      return s.trim();
    }

    function getHexColor(colorName) {
      if (!colorName) return '#94a3b8';
      let raw = String(colorName).trim().toLowerCase();
      let c = normalizeColorStr(colorName);

      // 1. Tông Trắng / White / Starlight / Bạc sáng (ƯU TIÊN HÀNG ĐẦU)
      if (c.includes('trang') || raw.includes('trắng') || c.includes('white') || c.includes('starlight')) return '#ffffff';

      // 2. Tổ hợp màu Titan & từ ghép đặc biệt
      if (c.includes('titan xanh') || c.includes('blue titan')) return '#3b82f6';
      if (c.includes('titan sa mac') || c.includes('desert titan') || c.includes('sa mac') || raw.includes('sa mạc') || c.includes('desert')) return '#d4a373';
      if (c.includes('titan den') || raw.includes('titan đen') || c.includes('black titan')) return '#111827';
      if (c.includes('titan trang') || raw.includes('titan trắng') || c.includes('white titan')) return '#ffffff';
      if (c.includes('titan tu nhien') || raw.includes('tự nhiên') || c.includes('natural titan') || c.includes('titan')) return '#9ca3af';

      // 3. Tổ hợp màu Vàng hồng / Rose Gold (trước vàng và hồng đơn lẻ)
      if (c.includes('rose gold') || c.includes('vang hong') || raw.includes('vàng hồng') || c.includes('hong vang') || c.includes('rose')) return '#f472b6';

      // 4. Tông Xanh lá / Xanh rêu / Xanh mint / Xanh lục
      if (c.includes('xanh la') || raw.includes('xanh lá') || c.includes('green') || c.includes('reu') || raw.includes('rêu') || c.includes('luc') || raw.includes('lục') || c.includes('mint') || c.includes('alpine') || c.includes('olive') || c.includes('emerald') || c.includes('bo doi')) return '#10b981';

      // 5. Tông Xanh ngọc / Teal / Cyan
      if (c.includes('xanh ngoc') || raw.includes('xanh ngọc') || c.includes('teal') || c.includes('cyan')) return '#14b8a6';

      // 6. Tông Xanh dương / Blue / Xanh thông thường (bao gồm khi chỉ nhập "Xanh")
      if (c.includes('xanh duong') || raw.includes('xanh dương') || c.includes('xanh bien') || raw.includes('xanh biển') || c.includes('blue') || c.includes('navy') || c.includes('lam') || c.includes('lo') || c.includes('coban') || c.includes('pacific') || c.includes('sierra') || c.includes('sky') || c.includes('xanh')) return '#3b82f6';

      // 7. Tông Đen / Midnight / Tối
      if (c.includes('den') || raw.includes('đen') || c.includes('black') || c.includes('midnight') || c.includes('jet black')) return '#111827';

      // 8. Tông Xám / Graphite / Space Gray
      if (c.includes('graphite') || c.includes('space') || c.includes('xam') || raw.includes('xám') || c.includes('grey') || c.includes('gray')) return '#64748b';

      // 9. Tông Vàng / Gold / Yellow
      if (c.includes('vang') || raw.includes('vàng') || c.includes('gold') || c.includes('yellow') || c.includes('anh kim')) return '#eab308';

      // 10. Tông Đỏ / Red
      if (c.includes('do') || raw.includes('đỏ') || c.includes('red')) return '#ef4444';

      // 11. Tông Hồng / Pink
      if (c.includes('hong') || raw.includes('hồng') || c.includes('pink')) return '#ec4899';

      // 12. Tông Tím / Purple
      if (c.includes('tim') || raw.includes('tím') || c.includes('purple')) return '#a855f7';

      // 13. Tông Cam / Orange / Coral
      if (c.includes('cam') || c.includes('orange') || c.includes('coral')) return '#f97316';

      // 14. Tông Bạc / Silver
      if (c.includes('bac') || raw.includes('bạc') || c.includes('silver')) return '#e2e8f0';

      return '#94a3b8';
    }

    function getColorDotHtml(colorName, sizePx = 28) {
      if (!colorName) return '';
      let raw = String(colorName).trim().toLowerCase();
      let c = normalizeColorStr(colorName);

      // 1. Kiểm tra màu Trắng (ƯU TIÊN HÀNG ĐẦU: nền trắng sáng rõ, viền mạ bạc nổi bật)
      let isWhite = c.includes('trang') || raw.includes('trắng') || c.includes('white') || c.includes('starlight');
      if (isWhite) {
        return `<span style="width: ${sizePx}px !important; height: ${sizePx}px !important; min-width: ${sizePx}px !important; border-radius: 50% !important; box-sizing: border-box !important; background: #ffffff !important; background-color: #ffffff !important; display: inline-block !important; flex-shrink: 0 !important; border: 2px solid #cbd5e1 !important; box-shadow: 0 0 10px rgba(255, 255, 255, 0.95), inset 0 0 2px rgba(0, 0, 0, 0.15) !important;" title="Màu: ${escapeHtml(colorName || 'Trắng')}"></span>`;
      }

      // 2. Kiểm tra màu Đen (Đá Onyx ánh kim viền trắng bạc sáng)
      let isBlack = c.includes('den') || raw.includes('đen') || c.includes('black') || c.includes('midnight') || c.includes('jet black');
      if (isBlack) {
        return `<span style="width: ${sizePx}px !important; height: ${sizePx}px !important; min-width: ${sizePx}px !important; border-radius: 50% !important; box-sizing: border-box !important; background: radial-gradient(circle at 35% 35%, #475569 0%, #1e293b 45%, #000000 100%) !important; display: inline-block !important; flex-shrink: 0 !important; border: 2px solid #ffffff !important; box-shadow: 0 0 8px rgba(255, 255, 255, 0.85), inset 0 0 4px rgba(255, 255, 255, 0.4) !important;" title="Màu: ${escapeHtml(colorName || 'Đen')}"></span>`;
      }

      // 3. Các màu sắc khác theo mã hex
      let hex = getHexColor(colorName);
      return `<span style="width: ${sizePx}px !important; height: ${sizePx}px !important; min-width: ${sizePx}px !important; border-radius: 50% !important; box-sizing: border-box !important; background-color: ${hex} !important; background: ${hex} !important; display: inline-block !important; flex-shrink: 0 !important; border: 1.5px solid rgba(255, 255, 255, 0.5) !important; box-shadow: 0 0 8px ${hex}cc !important;" title="Màu: ${escapeHtml(colorName || 'Mặc định')}"></span>`;
    }

    function isPhoneBrandIphone(brand, phoneName) {
      let b = (brand || '').toUpperCase().trim();
      let n = (phoneName || '').toUpperCase().trim();
      if (b === 'IPHONE' || b.includes('APPLE')) return true;
      if (n.startsWith('IPHONE') || n.includes('IPHONE')) return true;
      return false;
    }

    function getPhoneBrandLogoHtml(brand, phoneName, sizePx = 25) {
      let b = String(brand || '').toUpperCase().trim();
      let n = String(phoneName || '').toUpperCase().trim();
      let logoSrc = '';
      let altText = b || 'Logo';

      // 1. Nhận diện Apple / iPhone
      if (
        b === 'IPHONE' || b === 'IPAD' || b.includes('APPLE') ||
        isPhoneBrandIphone(b, n) ||
        /^(?:\d{1,2}|X|XS|XR|SE)\b/i.test(n) ||
        n.includes('PRO MAX') || n.includes('PLUS') || n.includes('IPHONE') || n.includes('IPAD') ||
        /^\d+/i.test(n)
      ) {
        logoSrc = 'img/logo_apple.jpg';
        altText = 'Apple';
      }
      // 2. Nhận diện Samsung
      else if (
        b.includes('SAMSUNG') || n.includes('SAMSUNG') ||
        /^(?:GALAXY|NOTE\s*\d+|Z\s*FLIP|Z\s*FOLD)\b/i.test(n) ||
        /^(?:A\d+|S\d+|M\d+)\b/i.test(n)
      ) {
        logoSrc = 'img/logo_samsung.jpg';
        altText = 'Samsung';
      }
      // 3. Nhận diện Xiaomi / Redmi / Poco
      else if (
        b.includes('XIAOMI') || b.includes('REDMI') || b.includes('POCO') ||
        n.includes('REDMI') || n.includes('XIAOMI') || n.includes('POCO') ||
        /^MI\b/i.test(n)
      ) {
        logoSrc = 'img/logo_xiaomi.jpg';
        altText = 'Xiaomi';
      }
      // 4. Nhận diện Oppo
      else if (
        b.includes('OPPO') || n.includes('OPPO') || n.includes('RENO') ||
        /^A\d+[XS]?\b/i.test(n) || /^F\d+\b/i.test(n)
      ) {
        logoSrc = 'img/logo_oppo.jpg';
        altText = 'Oppo';
      }
      // 5. Nhận diện Vivo
      else if (
        b.includes('VIVO') || n.includes('VIVO') || n.includes('IQOO') ||
        /^Y\d+\b/i.test(n)
      ) {
        logoSrc = 'img/logo_vivo.jpg';
        altText = 'Vivo';
      }
      // 6. Nhận diện Realme
      else if (
        b.includes('REALME') || n.includes('REALME') ||
        /^C\d+\b/i.test(n)
      ) {
        logoSrc = 'img/logo_realme.jpg';
        altText = 'Realme';
      } else {
        logoSrc = 'img/logo_apple.jpg';
        altText = 'Apple';
      }

      if (!logoSrc) return '';
      return `<img src="${logoSrc}" alt="${altText}" class="phone-brand-logo" style="width: ${sizePx}px !important; height: ${sizePx}px !important; min-width: ${sizePx}px !important; border-radius: 6px !important; object-fit: cover !important; display: inline-block !important; flex-shrink: 0 !important; vertical-align: middle !important; margin-right: 4px !important;" />`;
    }
    window.getPhoneBrandLogoHtml = getPhoneBrandLogoHtml;

    function normalizeMahText(text) {
      if (!text && text !== 0) return '';
      return String(text)
        .replace(/(\d[\d.]*)\s*(?:mah|MAh|Mah|MAH)(?:\s*%)?/gi, '$1 mAh')
        .replace(/\b(?:mah|MAh|Mah|MAH)(?:\s*%)?\b/gi, 'mAh')
        .replace(/mAh%/gi, 'mAh')
        .replace(/mAh\s*%/gi, 'mAh');
    }

    function formatPinByBrand(rawVal, brand = null, phoneName = null) {
      if (rawVal === undefined || rawVal === null || String(rawVal).trim() === '') {
        let isIp = false;
        if (brand || phoneName) {
          isIp = isPhoneBrandIphone(brand, phoneName);
        } else if (typeof currentBrandFilter !== 'undefined') {
          isIp = (currentBrandFilter === 'IPHONE');
        }
        return isIp ? '100%' : '5.000 mAh';
      }

      let str = String(rawVal).trim();
      let digits = str.replace(/[^\d]/g, '');
      if (digits) {
        let num = parseInt(digits, 10);
        // Từ 50 đến 100 thì tự động thêm % vào sau
        if (num >= 50 && num <= 100) {
          return `${num}%`;
        }
        // Từ 101 trở lên thì tự động thêm mAh đằng sau
        if (num >= 101) {
          let formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          return `${formatted} mAh`;
        }
        // Dưới 50: nếu chuỗi có chữ mah thì định dạng mAh, còn lại mặc định %
        if (/mah/i.test(str)) {
          return `${digits} mAh`;
        }
        return `${num}%`;
      }

      return str;
    }
    window.formatPinByBrand = formatPinByBrand;

    function formatBatteryString(rawVal, brand = null, phoneName = null) {
      return formatPinByBrand(rawVal, brand, phoneName);
    }

    function formatBatteryInput(input) {
      if (!input || !input.value) return;
      let brand = (typeof currentBrandFilter !== 'undefined') ? currentBrandFilter : null;
      let editId = document.getElementById('mEditId') ? document.getElementById('mEditId').value : null;
      let phoneName = document.getElementById('mName') ? document.getElementById('mName').value : '';
      if (editId && typeof phoneDatabase !== 'undefined') {
        let p = phoneDatabase.find(x => x.id == editId);
        if (p && p.brand) brand = p.brand;
      }
      input.value = formatPinByBrand(input.value, brand, phoneName);
    }

    let dropdownConfigs = {
      name: {
        listId: 'mNameList',
        storageKey: 'KIMCHI_OPT_NAME',
        defaults: ["X", "XS", "XS Max", "11", "11 Pro Max", "12", "12 Pro Max", "13", "13 Pro Max", "14", "14 Pro Max", "15", "15 Pro Max", "16 Pro Max"]
      },
      color: {
        listId: 'mColorList',
        storageKey: 'KIMCHI_OPT_COLOR',
        defaults: ["Đen", "Trắng", "Titan Tự Nhiên", "Titan Sa Mạc", "Vàng Gold", "Xanh Dương", "Tím", "Xám", "Xanh Lá"]
      },
      storage: {
        listId: 'mStorageList',
        storageKey: 'KIMCHI_OPT_STORAGE',
        defaults: ["64GB", "128GB", "256GB", "512GB", "1TB"]
      },
      pinStatus: {
        listId: 'mPinStatusList',
        storageKey: 'KIMCHI_OPT_PIN_STATUS',
        defaults: ["Pin Zin", "Pin Thay", "Pin New"]
      },
      pinPct: {
        listId: 'mPinPctList',
        storageKey: 'KIMCHI_OPT_PIN_PCT',
        defaults: ["100%", "99%", "98%", "97%", "95%", "90%", "88%", "4.500 mAh", "5.000 mAh", "6.000 mAh"]
      },
      condition: {
        listId: 'mConditionList',
        storageKey: 'KIMCHI_OPT_CONDITION',
        defaults: ["Likenew 99%", "Zin Đẹp 99%", "Kính Phẩy Nhẹ", "Máy 98%"]
      },
      brand: {
        listId: 'mBrandList',
        storageKey: 'KIMCHI_OPT_BRAND',
        defaults: ["IPHONE", "SAMSUNG", "OPPO", "REALME", "REDMI", "POCO", "VIVO", "XIAOMI", "KHÁC"]
      },
      origin: {
        listId: 'mOriginList',
        storageKey: 'KIMCHI_OPT_ORIGIN',
        defaults: ["VN/A", "LL/A", "KH/A", "JA/A"]
      }
    };

    function getDropdownItems(type) {
      let cfg = dropdownConfigs[type];
      if (!cfg) return [];
      let stored = localStorage.getItem(cfg.storageKey);
      if (stored !== null) {
        try { 
          let list = JSON.parse(stored);
          if (Array.isArray(list)) {
            if (type === 'storage') {
              return list.map(item => toTitleCase(item));
            }
            return list;
          }
        } catch(e){}
      }
      return [...cfg.defaults];
    }

    function saveDropdownItems(type, items) {
      let cfg = dropdownConfigs[type];
      if (!cfg) return;
      localStorage.setItem(cfg.storageKey, JSON.stringify(items));
      renderDropdownDatalist(type);
    }

    function renderDropdownDatalist(type) {
      let cfg = dropdownConfigs[type];
      if (!cfg) return;
      let datalist = document.getElementById(cfg.listId);
      if (!datalist) return;
      let items = getDropdownItems(type);

      if (type === 'pinPct') {
        if (currentBrandFilter === 'IPHONE') {
          items = items.filter(v => !/mah/i.test(v));
          if (items.length === 0) items = ["100%", "99%", "98%", "97%", "95%", "90%", "88%"];
        } else if (currentBrandFilter !== 'ALL') {
          items = items.filter(v => /mah/i.test(v) || (!v.includes('%') && parseInt(v.replace(/\D/g, ''), 10) >= 300));
          if (items.length === 0) items = ["5.000 mAh", "4.500 mAh", "6.000 mAh", "7.000 mAh", "4.000 mAh"];
        }
      }

      datalist.innerHTML = items.map(v => `<option value="${v}">`).join('');
    }

    function renderAllDropdowns() {
      Object.keys(dropdownConfigs).forEach(t => renderDropdownDatalist(t));
    }

    function addNewDropdownOption(type, inputId, promptText, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      let el = document.getElementById(inputId);
      let currentVal = el ? el.value.trim() : '';
      let clean = '';

      if (currentVal !== "") {
        // TỰ ĐỘNG LẤY GIÁ TRỊ ĐÃ GÕ TRONG Ô, KHÔNG BẮT GÕ LẠI
        clean = toTitleCase(currentVal);
      } else {
        // Nếu ô đang để trống mới mở prompt để nhập
        let val = prompt(promptText || 'Thêm mục mới:', '');
        if (val !== null && val.trim() !== "") {
          clean = toTitleCase(val.trim());
        }
      }

      if (clean !== "") {
        if (type === 'pinPct') clean = formatPinByBrand(clean);
        if (type === 'storage') clean = formatStorageValue(clean);
        if (type === 'brand') clean = clean.toUpperCase();
        let items = getDropdownItems(type);
        let exists = items.some(x => x.toLowerCase().trim() === clean.toLowerCase().trim());
        if (!exists) {
          items.unshift(clean);
          saveDropdownItems(type, items);
          if (el) el.value = clean;
          alert(`✓ Đã thêm "${clean}" vào danh mục gợi ý thành công!`);
        } else {
          if (el) el.value = clean;
          alert(`Mục "${clean}" đã có sẵn trong danh mục gợi ý!`);
        }
      }
    }

    function editDropdownOption(type, inputId, promptText, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      let el = document.getElementById(inputId);
      let currentVal = el ? el.value.trim() : '';
      let val = prompt(promptText, currentVal);
      if (val !== null && val.trim() !== "") {
        let newVal = toTitleCase(val.trim());
        if (type === 'pinPct') newVal = formatPinByBrand(newVal);
        if (type === 'storage') newVal = formatStorageValue(newVal);
        if (type === 'brand') newVal = newVal.toUpperCase();
        let items = getDropdownItems(type);
        let idx = items.findIndex(x => x.toLowerCase().trim() === currentVal.toLowerCase());
        if (idx !== -1) {
          items[idx] = newVal;
        } else {
          items.unshift(newVal);
        }
        saveDropdownItems(type, items);
        if (el) el.value = newVal;
        alert(`Đã cập nhật thành "${newVal}"!`);
      }
    }

    function deleteDropdownOption(type, inputId, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      let el = document.getElementById(inputId);
      let currentVal = el ? el.value.trim() : '';
      let items = getDropdownItems(type);

      if (items.length === 0) {
        alert('Danh sách gợi ý đang trống!');
        return;
      }

      let targetVal = currentVal;
      if (!targetVal) {
        let pick = prompt(`Nhập chính xác tên mục muốn xóa khỏi menu gợi ý:\n(Hiện có: ${items.join(', ')})`);
        if (!pick || !pick.trim()) return;
        targetVal = pick.trim();
      }

      let cleanTarget = targetVal.toLowerCase().trim();
      let matchIdx = items.findIndex(x => x.toLowerCase().trim() === cleanTarget);

      if (matchIdx === -1) {
        alert(`Không tìm thấy "${targetVal}" trong danh mục gợi ý!`);
        return;
      }

      let actualName = items[matchIdx];
      if (confirm(`Bạn có chắc chắn muốn xóa "${actualName}" khỏi danh mục gợi ý không?`)) {
        let newItems = items.filter((_, idx) => idx !== matchIdx);
        saveDropdownItems(type, newItems);
        if (el && el.value.trim().toLowerCase() === cleanTarget) {
          el.value = '';
          el.focus();
        }
        alert(`Đã xóa "${actualName}" khỏi danh mục gợi ý thành công!`);
      }
    }

    function clearInput(elementId, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      const el = document.getElementById(elementId);
      if (el) {
        if (el.value.trim() !== "") {
          if (confirm(`Bạn có muốn xóa dữ liệu ô này không?`)) {
            el.value = '';
            if (typeof closeUniversalSmartDropdown === 'function') closeUniversalSmartDropdown();
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.blur();
          }
        } else {
          el.value = '';
          if (typeof closeUniversalSmartDropdown === 'function') closeUniversalSmartDropdown();
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.blur();
        }
      }
    }

    function addItemNameOption(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      const el = document.getElementById('tItemName');
      let currentVal = el ? el.value.trim() : '';
      let clean = '';
      if (currentVal !== "") {
        clean = toTitleCase(currentVal);
      } else {
        let val = prompt("Nhập tên hàng hóa / phụ kiện mới muốn thêm vào danh mục gợi ý:", "");
        if (val !== null && val.trim() !== "") {
          clean = toTitleCase(val.trim());
        }
      }
      if (clean !== "") {
        const datalist = document.getElementById('itemNameList');
        if (datalist) {
          let exists = Array.from(datalist.options).some(o => o.value.toLowerCase().trim() === clean.toLowerCase().trim());
          if (!exists) {
            const opt = document.createElement('option');
            opt.value = clean;
            datalist.appendChild(opt);
          }
        }
        if (el) el.value = clean;
        alert(`Đã thêm "${clean}" vào danh mục gợi ý thành công!`);
      }
    }



    /* ============================================================
       UNIVERSAL SMART DROPDOWN CHO TOÀN BỘ POPUP TRÊN WEBSITE
       Cho phép bấm vào menu để chọn lại mọi tùy chọn bất kỳ lúc nào,
       kể cả khi ô nhập đã có chữ / chọn sai, không bắt buộc xóa chữ cũ.
       ============================================================ */
    let activeUniversalDropdown = null;
    let currentUniversalInput = null;

    function closeUniversalSmartDropdown() {
      if (activeUniversalDropdown) {
        activeUniversalDropdown.remove();
        activeUniversalDropdown = null;
        currentUniversalInput = null;
      }
    }

    function openUniversalSmartDropdown(input, filterText = null) {
      if (!input) return;
      // TRÊN GIAO DIỆN MOBILE: Chỉ gợi ý tên phụ kiện (tItemName), KHÔNG mở dropdown cho giá bán và giá nhập (chỉ nhập trực tiếp)
      if (window.innerWidth <= 768 && (input.id === 'tPriceOut' || input.id === 'tPriceIn')) {
        closeUniversalSmartDropdown();
        return;
      }

      // Nếu input đang nằm trong một modal bị ẩn thì không mở
      const modal = input.closest('.modal-overlay, .modal, .sw-modal-overlay');
      if (modal && (modal.style.display === 'none' || (modal.classList && !modal.classList.contains('active') && !modal.classList.contains('show') && getComputedStyle(modal).display === 'none'))) {
        closeUniversalSmartDropdown();
        return;
      }

      // Xác định datalist id
      let listId = input.dataset.originalList || input.getAttribute('list');
      if (!listId && input.id) {
        if (document.getElementById(input.id + 'List')) listId = input.id + 'List';
        else if (document.getElementById(input.id + 'Datalist')) listId = input.id + 'Datalist';
      }
      if (!listId) return;

      // Lưu lại để không bao giờ mất liên kết
      if (!input.dataset.originalList) {
        input.dataset.originalList = listId;
      }

      // Gỡ bỏ thuộc tính list để trình duyệt không hiện popup xám lọc 1 dòng
      if (input.hasAttribute('list')) {
        input.removeAttribute('list');
      }

      // Thu thập toàn bộ options đầy đủ
      let options = [];

      // 1. Kiểm tra dropdownConfigs của main.js nếu có
      if (typeof dropdownConfigs !== 'undefined') {
        for (let key in dropdownConfigs) {
          if (dropdownConfigs[key].listId === listId) {
            options = getDropdownItems(key);
            break;
          }
        }
      }

      // 2. Kiểm tra repairDropdownConfigs nếu có
      if (options.length === 0 && typeof repairDropdownConfigs !== 'undefined') {
        for (let key in repairDropdownConfigs) {
          if (repairDropdownConfigs[key].listId === listId) {
            options = getRepairDropdownItems(key);
            break;
          }
        }
      }

      // 3. Nếu chưa có hoặc mảng rỗng, đọc từ thẻ datalist và kết hợp localStorage
      if (options.length === 0) {
        const datalist = document.getElementById(listId);
        if (datalist) {
          const opts = Array.from(datalist.querySelectorAll('option'));
          options = opts.map(o => (o.value || o.textContent || '').trim()).filter(Boolean);
        }
        try {
          let storageKey = 'KIMCHI_DL_' + listId.toUpperCase();
          let savedCustom = JSON.parse(localStorage.getItem(storageKey)) || [];
          if (Array.isArray(savedCustom) && savedCustom.length > 0) {
            // Các mục thêm sau sẽ hiển thị ở cuối danh sách, KHÔNG nhảy lên đầu
            options = [...options, ...savedCustom];
          }
        } catch(e){}
      }

      if (options.length === 0) {
        closeUniversalSmartDropdown();
        return;
      }

      // Khử trùng lặp
      options = Array.from(new Set(options));
      input._universalOptions = options;
      input._universalListId = listId;

      // Lọc nếu người dùng đang chủ động gõ phím vào ô nhập
      let isFiltering = false;
      let displayOptions = options;
      let cleanFilter = '';
      if (filterText !== null && typeof filterText === 'string') {
        cleanFilter = filterText.trim();
        if (cleanFilter !== '') {
          isFiltering = true;
          const kw = cleanFilter.toLowerCase();
          displayOptions = options.filter(opt => opt.toLowerCase().includes(kw));
        }
      }

      // Đóng dropdown trước đó nếu đang mở
      closeUniversalSmartDropdown();

      // Tạo giao diện dropdown nổi
      const dropdownEl = document.createElement('div');
      dropdownEl.className = 'universal-smart-dropdown';
      dropdownEl.setAttribute('role', 'listbox');

      const currentValue = (input.value || '').trim().toLowerCase();

      // KIỂM TRA XEM GIÁ TRỊ VỪA GÕ ĐÃ CÓ TRONG DANH SÁCH CHƯA
      const hasExactMatch = cleanFilter !== '' && options.some(opt => opt.toLowerCase().trim() === cleanFilter.toLowerCase());

      // NẾU LỌC KHÔNG CÓ KẾT QUẢ HOẶC CHƯA CÓ TRONG DANH SÁCH (ÁP DỤNG TRÊN DESKTOP)
      if (isFiltering && displayOptions.length === 0) {
        if (window.innerWidth <= 768) {
          closeUniversalSmartDropdown();
          return;
        }
        const escaped = cleanFilter.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const noResultBox = document.createElement('div');
        noResultBox.style.cssText = 'padding: 14px 18px; text-align: center; width: 100%; box-sizing: border-box;';
        noResultBox.innerHTML = `
          <div style="color: #94a3b8; font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.2px;">Chưa có trong danh sách gợi ý</div>
          <button type="button" class="universal-btn-quick-add"
            style="background: #10b981; color: #ffffff; border: none; border-radius: 8px; padding: 9px 18px; font-weight: 800; font-size: 0.92rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(16,185,129,0.35); width: auto; max-width: 100%; margin: 0 auto; transition: all 0.15s ease;">
            + Thêm &ldquo;${escaped}&rdquo; vào gợi ý
          </button>
        `;

        const quickBtn = noResultBox.querySelector('.universal-btn-quick-add');
        quickBtn.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
          saveUniversalNewOption(input, listId, cleanFilter);
          closeUniversalSmartDropdown();
        });

        dropdownEl.appendChild(noResultBox);
      } else {
        displayOptions.forEach(opt => {
          const itemEl = document.createElement('div');
          itemEl.className = 'universal-smart-item';
          const isSelected = currentValue && (opt.toLowerCase() === currentValue);
          if (isSelected) {
            itemEl.classList.add('is-selected');
          }

          itemEl.innerHTML = `
            <span>${opt}</span>
            ${isSelected ? '<span class="smart-check">✓</span>' : ''}
          `;

          itemEl.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            input.value = opt;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            closeUniversalSmartDropdown();
            input.focus();
          });

          dropdownEl.appendChild(itemEl);
        });

        // Nếu đang gõ lọc trên Desktop và giá trị gõ chưa có trong danh sách -> hiển thị nút gợi ý thêm ở dưới
        if (isFiltering && !hasExactMatch && window.innerWidth > 768 && cleanFilter.length > 0) {
          const escaped = cleanFilter.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const extraAddBox = document.createElement('div');
          extraAddBox.style.cssText = 'padding: 10px 14px; text-align: center; width: 100%; box-sizing: border-box; border-top: 1px dashed #334155; margin-top: 4px;';
          extraAddBox.innerHTML = `
            <button type="button" class="universal-btn-quick-add"
              style="background: #10b981; color: #ffffff; border: none; border-radius: 8px; padding: 7px 14px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(16,185,129,0.35); width: auto; max-width: 100%; margin: 0 auto; transition: all 0.15s ease;">
              + Thêm &ldquo;${escaped}&rdquo; vào gợi ý
            </button>
          `;
          const quickBtn = extraAddBox.querySelector('.universal-btn-quick-add');
          quickBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            saveUniversalNewOption(input, listId, cleanFilter);
            closeUniversalSmartDropdown();
          });
          dropdownEl.appendChild(extraAddBox);
        }
      }

      document.body.appendChild(dropdownEl);
      activeUniversalDropdown = dropdownEl;
      currentUniversalInput = input;

      positionUniversalSmartDropdown(input, dropdownEl);

      // Định vị lại sau khi bàn phím ảo đẩy viewport trên điện thoại (iOS / Android)
      setTimeout(() => {
        if (activeUniversalDropdown === dropdownEl && currentUniversalInput === input) {
          positionUniversalSmartDropdown(input, dropdownEl);
        }
      }, 50);
      setTimeout(() => {
        if (activeUniversalDropdown === dropdownEl && currentUniversalInput === input) {
          positionUniversalSmartDropdown(input, dropdownEl);
        }
      }, 150);
      setTimeout(() => {
        if (activeUniversalDropdown === dropdownEl && currentUniversalInput === input) {
          positionUniversalSmartDropdown(input, dropdownEl);
        }
      }, 300);
    }

    function positionUniversalSmartDropdown(input, dropdownEl) {
      if (!input || !dropdownEl) return;
      const targetEl = input.closest('.input-with-actions') || input;

      if (window.innerWidth <= 768) {
        // TRÊN MOBILE: Gắn dropdown trực tiếp vào container ô nhập dạng ABSOLUTE
        // Menu sẽ luôn luôn nằm dính chặt dưới đáy của ô nhập, không bị bàn phím ảo hay viewport đẩy đè lên ô
        if (targetEl !== dropdownEl.parentNode) {
          targetEl.style.position = 'relative';
          targetEl.appendChild(dropdownEl);
        }
        dropdownEl.style.position = 'absolute';
        dropdownEl.style.top = 'calc(100% + 8px)';
        dropdownEl.style.bottom = 'auto';
        dropdownEl.style.left = '0';
        dropdownEl.style.width = '100%';
        dropdownEl.style.minWidth = '100%';
        dropdownEl.style.maxWidth = '100%';
        dropdownEl.style.maxHeight = '185px';
        dropdownEl.style.boxSizing = 'border-box';
        dropdownEl.style.overflowY = 'auto';
        dropdownEl.style.zIndex = '999999999';
        return;
      }

      // TRÊN DESKTOP: Gắn vào document.body dạng FIXED
      // Menu nổi độc lập ngoài DOM, tính toán chính xác toạ độ theo getBoundingClientRect()
      // Không bao giờ bị overflow: hidden hay overflow: auto của modal che khuất
      if (dropdownEl.parentNode !== document.body) {
        document.body.appendChild(dropdownEl);
      }
      dropdownEl.style.position = 'fixed';
      const rect = targetEl.getBoundingClientRect();
      const viewportHeight = (window.visualViewport && window.visualViewport.height) 
        ? window.visualViewport.height 
        : window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropDownOffset = 6;

      if (spaceBelow < 120 && spaceAbove > spaceBelow) {
        dropdownEl.style.top = 'auto';
        dropdownEl.style.bottom = `${Math.round(viewportHeight - rect.top + 6)}px`;
        dropdownEl.style.maxHeight = `${Math.min(260, Math.max(90, spaceAbove - 16))}px`;
      } else {
        dropdownEl.style.bottom = 'auto';
        dropdownEl.style.top = `${Math.round(rect.bottom + dropDownOffset)}px`;
        dropdownEl.style.maxHeight = `${Math.min(260, Math.max(90, spaceBelow - dropDownOffset - 12))}px`;
      }
      dropdownEl.style.left = `${Math.max(6, Math.round(rect.left))}px`;
      dropdownEl.style.width = `${Math.max(Math.round(rect.width), 160)}px`;
      dropdownEl.style.minWidth = `${Math.max(Math.round(rect.width), 160)}px`;
      dropdownEl.style.maxWidth = `${Math.min(window.innerWidth - 12, Math.max(Math.round(rect.width), 340))}px`;
      dropdownEl.style.overflowY = 'auto';
      dropdownEl.style.zIndex = '999999999';
    }

    function saveUniversalNewOption(input, listId, val) {
      if (!input || !val) return;
      const cleanVal = (typeof toTitleCase === 'function' && isNaN(Number(val))) ? toTitleCase(val) : val.trim();
      if (!cleanVal) return;

      // 1. Kiểm tra dropdownConfigs của main.js
      let saved = false;
      if (typeof dropdownConfigs !== 'undefined') {
        for (let key in dropdownConfigs) {
          if (dropdownConfigs[key].listId === listId) {
            let items = getDropdownItems(key);
            if (!items.some(x => x.toLowerCase().trim() === cleanVal.toLowerCase())) {
              items.unshift(cleanVal);
              saveDropdownItems(key, items);
              saved = true;
            }
            break;
          }
        }
      }

      // 2. Kiểm tra repairDropdownConfigs
      if (!saved && typeof repairDropdownConfigs !== 'undefined') {
        for (let key in repairDropdownConfigs) {
          if (repairDropdownConfigs[key].listId === listId) {
            let items = getRepairDropdownItems(key);
            if (!items.some(x => x.toLowerCase().trim() === cleanVal.toLowerCase())) {
              items.unshift(cleanVal);
              saveRepairDropdownItems(key, items);
              saved = true;
            }
            break;
          }
        }
      }

      // 3. Nếu là datalist thông thường (itemNameList, creditorDatalist, etc.)
      const datalist = document.getElementById(listId);
      if (datalist) {
        let hasOpt = Array.from(datalist.options).some(o => (o.value || '').toLowerCase().trim() === cleanVal.toLowerCase());
        if (!hasOpt) {
          const optEl = document.createElement('option');
          optEl.value = cleanVal;
          datalist.appendChild(optEl);
        }
        try {
          let storageKey = 'KIMCHI_DL_' + listId.toUpperCase();
          let cur = [];
          try { cur = JSON.parse(localStorage.getItem(storageKey)) || []; } catch(e){}
          if (!cur.some(x => x.toLowerCase().trim() === cleanVal.toLowerCase())) {
            cur.push(cleanVal);
            localStorage.setItem(storageKey, JSON.stringify(cur));
          }
        } catch(e){}
      }

      input.value = cleanVal;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.focus();
    }

    // Gắn sự kiện toàn cục cho toàn bộ trang web
    // Tự động gỡ bỏ thuộc tính list để trình duyệt không tự hiện dropdown xám đè lên menu tùy chỉnh
    function detachNativeDatalists() {
      document.querySelectorAll('input[list]').forEach(inp => {
        const listId = inp.getAttribute('list');
        if (listId) {
          inp.dataset.originalList = listId;
          inp.removeAttribute('list');
          inp.setAttribute('autocomplete', 'off');
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detachNativeDatalists);
    } else {
      detachNativeDatalists();
    }

    document.addEventListener('mousedown', function(e) {
      const input = e.target.closest('input');
      if (input) {
        const listId = input.dataset.originalList || input.getAttribute('list');
        const isDatalistInput = listId || 
          (input.id && (document.getElementById(input.id + 'List') || document.getElementById(input.id + 'Datalist')));
        if (isDatalistInput) {
          if (input.hasAttribute('list')) {
            input.dataset.originalList = input.getAttribute('list');
            input.removeAttribute('list');
          }
          input.setAttribute('autocomplete', 'off');
        }
      }
    }, true);

    document.addEventListener('click', function(e) {
      detachNativeDatalists();

      if (activeUniversalDropdown && activeUniversalDropdown.contains(e.target)) return;

      const input = e.target.closest('input');
      if (input) {
        const listId = input.dataset.originalList || input.getAttribute('list');
        const isDatalistInput = listId || 
          (input.id && (document.getElementById(input.id + 'List') || document.getElementById(input.id + 'Datalist')));

        if (isDatalistInput) {
          openUniversalSmartDropdown(input);
          return;
        }
      }

      closeUniversalSmartDropdown();
    }, true);

    document.addEventListener('focusin', function(e) {
      const input = e.target.closest('input');
      if (input) {
        const listId = input.dataset.originalList || input.getAttribute('list');
        const isDatalistInput = listId || 
          (input.id && (document.getElementById(input.id + 'List') || document.getElementById(input.id + 'Datalist')));
        if (isDatalistInput) {
          if (input.hasAttribute('list')) {
            input.dataset.originalList = input.getAttribute('list');
            input.removeAttribute('list');
          }
          input.setAttribute('autocomplete', 'off');
          openUniversalSmartDropdown(input);
        }
      }
    });

    document.addEventListener('input', function(e) {
      const input = e.target.closest('input');
      if (input) {
        if (window.innerWidth <= 768 && (input.id === 'tPriceOut' || input.id === 'tPriceIn')) return;
        const listId = input.dataset.originalList || input.getAttribute('list') || (input.id ? (input.id + 'List') : null);
        if (listId && (document.getElementById(listId) || input._universalOptions)) {
          openUniversalSmartDropdown(input, input.value);
        }
      }
    }, true);

    document.addEventListener('keyup', function(e) {
      const input = e.target.closest('input');
      if (input && e.key !== 'Escape' && e.key !== 'Enter') {
        if (window.innerWidth <= 768 && (input.id === 'tPriceOut' || input.id === 'tPriceIn')) return;
        const listId = input.dataset.originalList || input.getAttribute('list') || (input.id ? (input.id + 'List') : null);
        if (listId && (document.getElementById(listId) || input._universalOptions)) {
          openUniversalSmartDropdown(input, input.value);
        }
      }
    }, true);

    document.addEventListener('keydown', function(e) {
      if (!activeUniversalDropdown) return;
      if (e.key === 'Escape') {
        closeUniversalSmartDropdown();
      }
    });

    window.addEventListener('scroll', function() {
      if (activeUniversalDropdown && currentUniversalInput) {
        positionUniversalSmartDropdown(currentUniversalInput, activeUniversalDropdown);
      }
    }, true);

    window.addEventListener('resize', function() {
      if (activeUniversalDropdown && currentUniversalInput) {
        positionUniversalSmartDropdown(currentUniversalInput, activeUniversalDropdown);
      }
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function() {
        if (activeUniversalDropdown && currentUniversalInput) {
          positionUniversalSmartDropdown(currentUniversalInput, activeUniversalDropdown);
        }
      });
      window.visualViewport.addEventListener('scroll', function() {
        if (activeUniversalDropdown && currentUniversalInput) {
          positionUniversalSmartDropdown(currentUniversalInput, activeUniversalDropdown);
        }
      });
    }

    function editItemNameOption(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      const el = document.getElementById('tItemName');
      let currentVal = el ? el.value.trim() : '';
      let val = prompt("Chỉnh sửa tên phụ kiện:", currentVal);
      if (val !== null && val.trim() !== "") {
        let newVal = toTitleCase(val.trim());
        el.value = newVal;
      }
    }

    function deleteItemNameOption(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      const el = document.getElementById('tItemName');
      let currentVal = el ? el.value.trim() : '';
      const datalist = document.getElementById('itemNameList');

      let options = [];
      if (datalist) {
        options = Array.from(datalist.options).map(o => o.value).filter(Boolean);
      }
      try {
        let saved = JSON.parse(localStorage.getItem('KIMCHI_DL_ITEMNAMELIST')) || [];
        options = Array.from(new Set([...options, ...saved]));
      } catch(e){}

      let targetVal = currentVal;
      if (!targetVal) {
        let pick = prompt(`Nhập chính xác tên phụ kiện muốn xóa khỏi danh mục:\n(Hiện có: ${options.join(', ')})`);
        if (!pick || !pick.trim()) return;
        targetVal = pick.trim();
      }

      let cleanTarget = targetVal.toLowerCase().trim();
      let matchVal = options.find(o => o.toLowerCase().trim() === cleanTarget);

      if (!matchVal) {
        alert(`Không tìm thấy "${targetVal}" trong danh mục gợi ý!`);
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xóa "${matchVal}" khỏi danh mục gợi ý không?`)) {
        if (datalist) {
          Array.from(datalist.options).forEach(o => {
            if (o.value.toLowerCase().trim() === cleanTarget) o.remove();
          });
        }
        try {
          let saved = JSON.parse(localStorage.getItem('KIMCHI_DL_ITEMNAMELIST')) || [];
          saved = saved.filter(x => x.toLowerCase().trim() !== cleanTarget);
          localStorage.setItem('KIMCHI_DL_ITEMNAMELIST', JSON.stringify(saved));
        } catch(e){}

        if (el && el.value.trim().toLowerCase() === cleanTarget) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.blur();
        }
        if (typeof closeUniversalSmartDropdown === 'function') closeUniversalSmartDropdown();
        alert(`Đã xóa "${matchVal}" khỏi danh mục thành công!`);
      }
    }

    // Xóa mệnh giá Bán / Nhập khi bấm thẳng vào chữ Giá bán / Giá nhập màu xanh trên giao diện Web/Desktop
    function deleteTicketPriceOption(inputId, listId, labelName) {
      const el = document.getElementById(inputId);
      const currentVal = el ? el.value.trim() : '';
      const datalist = document.getElementById(listId);
      if (!datalist) return;

      let targetVal = currentVal;
      if (!targetVal) {
        alert(`Vui lòng chọn hoặc nhập giá trị ${labelName} cần xóa trước!`);
        if (el) el.focus();
        return;
      }

      // Chuẩn hóa so sánh (ví dụ: 20, 50, 60 hoặc đã format)
      let cleanTarget = targetVal.replace(/[^\d]/g, '');
      if (!cleanTarget && targetVal === '0') cleanTarget = '0';
      if (!cleanTarget) cleanTarget = targetVal.trim();

      // Tìm trong thẻ datalist
      let matchOpt = Array.from(datalist.options).find(o => {
        let optVal = (o.value || '').trim();
        let optClean = optVal.replace(/[^\d]/g, '');
        if (!optClean && optVal === '0') optClean = '0';
        return optClean === cleanTarget || optVal.toLowerCase() === targetVal.toLowerCase();
      });

      if (!matchOpt) {
        alert(`Không tìm thấy "${targetVal}" trong danh sách sổ xuống của ${labelName}!`);
        return;
      }

      const valToDelete = matchOpt.value;
      if (confirm(`Bạn có muốn xóa "${valToDelete}" khỏi danh sách sổ xuống ${labelName} không?`)) {
        matchOpt.remove();

        // Xóa trong localStorage nếu đã từng lưu
        try {
          const storageKey = 'KIMCHI_DL_' + listId.toUpperCase();
          let cur = JSON.parse(localStorage.getItem(storageKey)) || [];
          if (Array.isArray(cur)) {
            let filtered = cur.filter(x => {
              let xClean = String(x).replace(/[^\d]/g, '');
              if (!xClean && String(x).trim() === '0') xClean = '0';
              return xClean !== cleanTarget && String(x).trim().toLowerCase() !== targetVal.toLowerCase();
            });
            localStorage.setItem(storageKey, JSON.stringify(filtered));
          }
        } catch (e) {}

        // Đóng dropdown nổi nếu đang mở
        if (typeof closeUniversalSmartDropdown === 'function') {
          closeUniversalSmartDropdown();
        }

        // Xóa giá trị trong ô input
        if (el) {
          el.value = '';
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.focus();
        }

        alert(`Đã xóa thành công "${valToDelete}" khỏi danh sách ${labelName}!`);
      }
    }
    window.deleteTicketPriceOption = deleteTicketPriceOption;
    window.clearInput = clearInput;
    window.addItemNameOption = addItemNameOption;
    window.editItemNameOption = editItemNameOption;
    window.deleteItemNameOption = deleteItemNameOption;

    function getVietnamDate() {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        const parts = formatter.formatToParts(now);
        const p = {};
        parts.forEach(part => { p[part.type] = part.value; });
        return new Date(parseInt(p.year, 10), parseInt(p.month, 10) - 1, parseInt(p.day, 10), parseInt(p.hour, 10), parseInt(p.minute, 10), parseInt(p.second, 10));
      } catch (e) {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 7));
      }
    }

    function getCurrentTimeStr() {
      const d = getVietnamDate();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${min}`;
    }

    function getCurrentDateStr() {
      const d = getVietnamDate();
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }

    function initAllTabsToVietnamToday() {
      const vnNow = getVietnamDate();
      const dd = String(vnNow.getDate()).padStart(2, '0');
      const mm = String(vnNow.getMonth() + 1).padStart(2, '0');
      const yyyy = vnNow.getFullYear();
      const dateStr = `${dd}/${mm}/${yyyy}`;
      const monthStr = `${mm}/${yyyy}`;

      // 1. Tab BÁN HÀNG
      currentSalesDateFilter = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
      currentSalesMonthFilter = { month: vnNow.getMonth(), year: yyyy };
      const salesDateDisp = document.getElementById('filterSalesDateDisplay');
      if (salesDateDisp) salesDateDisp.innerText = dateStr;
      const salesMonthDisp = document.getElementById('filterSalesMonthDisplay');
      if (salesMonthDisp) salesMonthDisp.innerText = monthStr;

      // 2. Tab BÁN GÀ
      currentBangaDateFilter = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
      currentBangaMonthFilter = { month: vnNow.getMonth(), year: yyyy };
      const bangaDateDisp = document.getElementById('filterBangaDateDisplay');
      if (bangaDateDisp) bangaDateDisp.innerText = dateStr;
      const bangaMonthDisp = document.getElementById('filterBangaMonthDisplay');
      if (bangaMonthDisp) bangaMonthDisp.innerText = monthStr;
      const bangaModeSelect = document.getElementById('bangaModeSelect');
      if (bangaModeSelect) bangaModeSelect.value = 'day';
      const bangaDayBox = document.getElementById('bangaDateFilterBox');
      if (bangaDayBox) bangaDayBox.style.display = 'inline-flex';
      const bangaMonthBox = document.getElementById('bangaMonthFilterBox');
      if (bangaMonthBox) bangaMonthBox.style.display = 'none';

      // 3. Tab PHẦN MỀM
      swFilterDate = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
      currentSoftwareMonthFilter = { month: vnNow.getMonth(), year: yyyy };
      currentSoftwareYearFilter = yyyy;
      const swDateDisp = document.getElementById('filterSoftwareDateDisplay');
      if (swDateDisp) {
        if (swDateDisp.tagName === 'INPUT') swDateDisp.value = dateStr;
        swDateDisp.innerText = dateStr;
      }
      const swMonthDisp = document.getElementById('filterSoftwareMonthDisplay');
      if (swMonthDisp) swMonthDisp.innerText = monthStr;
      const swYearDisp = document.getElementById('filterSoftwareYearDisplay');
      if (swYearDisp) swYearDisp.innerText = String(yyyy);

      // 4. Tab SỬA CHỮA
      repairFilterDate = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
      const repDateDisp = document.getElementById('filterRepairDateDisplay');
      if (repDateDisp) repDateDisp.innerText = dateStr;
      const repairModeSelect = document.getElementById('repairModeSelect');
      if (repairModeSelect) repairModeSelect.value = 'day';
      const repairDayBox = document.getElementById('repairDateFilterBox');
      if (repairDayBox) repairDayBox.style.display = 'inline-flex';
      const repairMonthBox = document.getElementById('repairMonthFilterBox');
      if (repairMonthBox) repairMonthBox.style.display = 'none';
      const repairYearBox = document.getElementById('repairYearFilterBox');
      if (repairYearBox) repairYearBox.style.display = 'none';
      if (typeof updateRepairDateDisplay === 'function') {
        updateRepairDateDisplay();
      }

      // 5. Tab BẢO HÀNH (MÁY ĐÃ BÁN)
      currentSoldPhoneDateFilter = new Date(yyyy, vnNow.getMonth(), vnNow.getDate());
      currentSoldPhoneMonthFilter = { month: vnNow.getMonth(), year: yyyy };
      const soldPhoneDateDisp = document.getElementById('filterSoldPhoneDateDisplay');
      if (soldPhoneDateDisp) soldPhoneDateDisp.innerText = dateStr;
      const soldPhoneMonthDisp = document.getElementById('filterSoldPhoneMonthDisplay');
      if (soldPhoneMonthDisp) soldPhoneMonthDisp.innerText = monthStr;
    }

    function adjustTicketDate(days) {
      const dateInput = document.getElementById('tDateVal');
      let parts = dateInput.value.split('/');
      if (parts.length === 3) {
        let d = new Date(parts[2], parts[1] - 1, parts[0]);
        d.setDate(d.getDate() + days);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        dateInput.value = `${day}/${month}/${year}`;
      } else {
        dateInput.value = getCurrentDateStr();
      }
    }

    function adjustPhoneDate(days) {
      const dateInput = document.getElementById('mDateVal');
      let parts = dateInput.value.split('/');
      if (parts.length === 3) {
        let d = new Date(parts[2], parts[1] - 1, parts[0]);
        d.setDate(d.getDate() + days);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        dateInput.value = `${day}/${month}/${year}`;
      } else {
        dateInput.value = getCurrentDateStr();
      }
    }

    function adjustSellDate(days) {
      const dateInput = document.getElementById('sellDateVal');
      let parts = dateInput.value.split('/');
      if (parts.length === 3) {
        let d = new Date(parts[2], parts[1] - 1, parts[0]);
        d.setDate(d.getDate() + days);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        dateInput.value = `${day}/${month}/${year}`;
      } else {
        dateInput.value = getCurrentDateStr();
      }
    }

    function handleLogin(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      const userEl = document.getElementById('loginUser');
      const passEl = document.getElementById('loginPass');
      const user = userEl ? userEl.value.trim().toLowerCase() : '';
      // Loại bỏ ký tự tàng hình / zero-width space do bàn phím iOS tạo ra
      const pass = passEl ? passEl.value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '';
      const masterPassList = ["250991", "250995", "Huyen@95", "123456"];
      
      // Lấy danh sách tài khoản hệ thống từ localStorage hoặc mặc định
      let accountsList = [];
      try {
        const stored = JSON.parse(localStorage.getItem('KIMCHI_SYSTEM_ACCOUNTS'));
        if (Array.isArray(stored) && stored.length > 0) {
          accountsList = stored;
        }
      } catch (err) {}
      if (accountsList.length === 0 && typeof DEFAULT_SYSTEM_ACCOUNTS !== 'undefined') {
        accountsList = DEFAULT_SYSTEM_ACCOUNTS;
      }

      // Tìm tài khoản trùng khớp username (không phân biệt hoa thường)
      let foundAcc = accountsList.find(a => (a.username || '').trim().toLowerCase() === user || (a.id || '').trim().toLowerCase() === user);

      // Cho phép đăng nhập đặc cách cho admin / quynhbupbe nếu chưa có trong DB
      if (!foundAcc && (user === 'admin' || user === 'quynhbupbe')) {
        foundAcc = {
          id: user,
          username: user,
          name: user === 'admin' ? 'ADMIN' : 'Quynh Búp Bê',
          role: 'Owner · full',
          isOwner: true,
          status: 'Active',
          password: ''
        };
      }

      const err = document.getElementById('loginError');

      if (!foundAcc) {
        if (err) {
          err.innerText = 'Tài khoản không chính xác!';
          err.style.display = 'block';
        }
        return false;
      }

      // Kiểm tra trạng thái tài khoản
      if (foundAcc.status === 'Inactive') {
        if (err) {
          err.innerText = 'Tài khoản này đã bị tạm khóa (Inactive)! Vui lòng liên hệ Quản trị viên.';
          err.style.display = 'block';
        }
        return false;
      }

      // Kiểm tra mật khẩu: mật khẩu riêng của tài khoản hoặc một trong các master password
      let isPassValid = false;
      if (foundAcc.password && pass === foundAcc.password) {
        isPassValid = true;
      } else if (masterPassList.includes(pass)) {
        isPassValid = true;
      } else if (!foundAcc.password && pass === '123456') {
        isPassValid = true;
      }

      if (isPassValid) {
        const sc = document.getElementById('loginScreen');
        if (sc) sc.style.display = 'none';
        document.body.classList.remove('login-locked', 'login-active');
        document.documentElement.classList.add('user-is-logged');
        try {
          sessionStorage.setItem('KIMCHI_AUTH_TOKEN', pass || 'logged');
          sessionStorage.setItem('KIMCHI_LOGGED', 'true');
          sessionStorage.setItem('KIMCHI_CURRENT_USER', foundAcc.username || user);
          const rem = document.getElementById('rememberMe');
          if (rem && rem.checked) {
            localStorage.setItem('KIMCHI_AUTH_TOKEN', pass || 'logged');
            localStorage.setItem('KIMCHI_LOGGED', 'true');
            localStorage.setItem('KIMCHI_CURRENT_USER', foundAcc.username || user);
          } else {
            localStorage.removeItem('KIMCHI_AUTH_TOKEN');
            localStorage.removeItem('KIMCHI_LOGGED');
            localStorage.removeItem('KIMCHI_CURRENT_USER');
          }
        } catch (errStorage) {
          console.warn('Storage warning:', errStorage);
        }
        if (err) err.style.display = 'none';
        return false;
      } else {
        if (err) {
          err.innerText = 'Mật khẩu không chính xác! Vui lòng thử lại.';
          err.style.display = 'block';
        }
        return false;
      }
    }

    function handleLogout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
        try {
          sessionStorage.removeItem('KIMCHI_AUTH_TOKEN');
          localStorage.removeItem('KIMCHI_AUTH_TOKEN');
          sessionStorage.removeItem('KIMCHI_LOGGED');
          localStorage.removeItem('KIMCHI_LOGGED');
          sessionStorage.removeItem('KIMCHI_CURRENT_USER');
          localStorage.removeItem('KIMCHI_CURRENT_USER');
        } catch (err) {}
        window.location.reload();
      }
    }
    window.handleLogin = handleLogin;
    window.handleLogout = handleLogout;

    function migrateStorageUnits() {
      try {
        if (typeof salesDatabase !== 'undefined' && Array.isArray(salesDatabase)) {
          let sChanged = false;
          salesDatabase.forEach(item => {
            if (item.name && /(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui.test(item.name)) {
              let updated = item.name.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1').trim();
              if (updated !== item.name) { item.name = updated; sChanged = true; }
            }
          });
          if (sChanged && typeof saveSalesStorage === 'function') saveSalesStorage();
        }

        if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
          let bChanged = false;
          bangaDatabase.forEach(item => {
            if (item.name && /(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui.test(item.name)) {
              let updated = item.name.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1').trim();
              if (updated !== item.name) { item.name = updated; bChanged = true; }
            }
            if (item.storage && /gb|tb|mb/i.test(item.storage)) {
              let updated = formatStorageDisplay(item.storage);
              if (updated !== item.storage) { item.storage = updated; bChanged = true; }
            }
          });
          if (bChanged && typeof saveBangaStorage === 'function') saveBangaStorage();
        }

        if (typeof phoneDatabase !== 'undefined' && Array.isArray(phoneDatabase)) {
          let pChanged = false;
          phoneDatabase.forEach(p => {
            if (p.storage && /gb|tb|mb/i.test(p.storage)) {
              let updated = formatStorageDisplay(p.storage);
              if (updated !== p.storage) { p.storage = updated; pChanged = true; }
            }
            if (p.name && /(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui.test(p.name)) {
              let updated = p.name.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1').trim();
              if (updated !== p.name) { p.name = updated; pChanged = true; }
            }
          });
          if (pChanged && typeof savePhoneStorage === 'function') savePhoneStorage();
        }

        if (typeof soldPhoneDatabase !== 'undefined' && Array.isArray(soldPhoneDatabase)) {
          let spChanged = false;
          soldPhoneDatabase.forEach(p => {
            if (p.storage && /gb|tb|mb/i.test(p.storage)) {
              let updated = formatStorageDisplay(p.storage);
              if (updated !== p.storage) { p.storage = updated; spChanged = true; }
            }
            if (p.name && /(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui.test(p.name)) {
              let updated = p.name.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1').trim();
              if (updated !== p.name) { p.name = updated; spChanged = true; }
            }
          });
          if (spChanged) localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
        }

        if (typeof softwareDatabase !== 'undefined' && Array.isArray(softwareDatabase)) {
          let swChanged = false;
          softwareDatabase.forEach(item => {
            if (item.device && /(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui.test(item.device)) {
              let updated = item.device.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1').trim();
              if (updated !== item.device) { item.device = updated; swChanged = true; }
            }
          });
          if (swChanged && typeof saveSoftwareStorage === 'function') saveSoftwareStorage();
        }
      } catch (e) {
        console.warn("Lỗi migrateStorageUnits:", e);
      }
    }

    /* ============================================================
       KẾT NỐI VÀ TỰ ĐỘNG ĐỒNG BỘ CLOUD FIRESTORE TỨC THÌ (REALTIME)
       ============================================================ */
    function initFirebaseRealtimeSync() {
      if (typeof db === 'undefined' || !db) {
        console.warn("Chưa tìm thấy kết nối Firebase Firestore (db)!");
        return;
      }

      // 1. Đồng bộ Bán Hàng (sales) thời gian thực
      try {
        db.collection('sales').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            list.forEach(item => {
              if (item) {
                if (item.total !== undefined && item.total !== null && item.total !== '') item.total = formatPriceStr(item.total);
                if (item.price !== undefined && item.price !== null && item.price !== '') item.price = formatPriceStr(item.price);
                if (item.priceIn !== undefined && item.priceIn !== null && item.priceIn !== '') item.priceIn = formatPriceStr(item.priceIn);
                if (item.profit !== undefined && item.profit !== null && item.profit !== '') item.profit = formatPriceStr(item.profit);
              }
            });
            salesDatabase = list;
            try { localStorage.setItem('KIMCHI_SALES_DB', JSON.stringify(salesDatabase)); } catch(e){}
            if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
            if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
            if (typeof syncCustomerDebtsToCloud === 'function') {
        if (Array.isArray(itemOrListToSync)) {
          let cSet = new Set();
          itemOrListToSync.forEach(it => { if (it && it.customer) cSet.add(it.customer.trim()); });
          cSet.forEach(c => syncCustomerDebtsToCloud(c));
        } else if (itemOrListToSync && itemOrListToSync.customer) {
          syncCustomerDebtsToCloud(itemOrListToSync.customer.trim());
        } else {
          syncCustomerDebtsToCloud();
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
          }
        }, err => console.error("Lỗi sync sales realtime:", err));
      } catch (err) {
        console.error("Lỗi setup sync sales:", err);
      }

      // 2. Đồng bộ Bán Gà (banga) thời gian thực
      try {
        db.collection('banga').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            list.forEach(item => {
              if (item) {
                if (item.total !== undefined && item.total !== null && item.total !== '') item.total = formatPriceStr(item.total);
                if (item.price !== undefined && item.price !== null && item.price !== '') item.price = formatPriceStr(item.price);
                if (item.priceIn !== undefined && item.priceIn !== null && item.priceIn !== '') item.priceIn = formatPriceStr(item.priceIn);
                if (item.profit !== undefined && item.profit !== null && item.profit !== '') item.profit = formatPriceStr(item.profit);
              }
            });
            bangaDatabase = list;
            try { localStorage.setItem('KIMCHI_BANGA_DB', JSON.stringify(bangaDatabase)); } catch(e){}
            if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
            if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
          }
        }, err => console.error("Lỗi sync banga realtime:", err));
      } catch (err) {
        console.error("Lỗi setup sync banga:", err);
      }

      // 3. Đồng bộ Kho Bán Máy (phones) thời gian thực
      try {
        db.collection('phones').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            // Sắp xếp ID giảm dần (máy mới thêm luôn ở đầu bảng trên cả Mobile và Web)
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            phoneDatabase = list;
            try { localStorage.setItem('KIMCHI_PHONE_DB', JSON.stringify(phoneDatabase)); } catch(e){}
            if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
          }
        }, err => console.error("Lỗi sync phones:", err));
      } catch (err) {
        console.error("Lỗi setup sync phones:", err);
      }

      // 4. Đồng bộ Bảo Hành (sold_phones) thời gian thực
      try {
        db.collection('sold_phones').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            soldPhoneDatabase = list;
            try { localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase)); } catch(e){}
            if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
          }
        }, err => console.error("Lỗi sync sold_phones:", err));
      } catch (err) {
        console.error("Lỗi setup sync sold_phones:", err);
      }

      // 5. Đồng bộ Main - Xác (mainxac) thời gian thực
      try {
        db.collection('mainxac').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            mainXacDatabase = list;
            try { localStorage.setItem('KIMCHI_MAIN_XAC_DB', JSON.stringify(mainXacDatabase)); } catch(e){}
            if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
          }
        }, err => console.error("Lỗi sync mainxac:", err));
      } catch (err) {
        console.error("Lỗi setup sync mainxac:", err);
      }

      // 6. Đồng bộ Sửa Chữa (repairs) thời gian thực
      try {
        db.collection('repairs').onSnapshot(snapshot => {
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            if (!data.id) data.id = doc.id;
            list.push(data);
          });
          if (list.length > 0) {
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            repairDatabase = list;
            try { localStorage.setItem('KIMCHI_REPAIR_DB', JSON.stringify(repairDatabase)); } catch(e){}
            if (typeof renderRepairTable === 'function') renderRepairTable();
            if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
          }
        }, err => console.error("Lỗi sync repairs:", err));
      } catch (err) {
        console.error("Lỗi setup sync repairs:", err);
      }

      // 7. Đồng bộ Phần Mềm (software) thời gian thực giữa Web và Mobile
      try {
        db.collection('software').onSnapshot(snapshot => {
          const isSoftwareCleared = localStorage.getItem('KIMCHI_PHANMEM_CLEARED') === 'true';
          let list = [];
          snapshot.forEach(doc => {
            let data = doc.data();
            data.id = doc.id; // LUÔN dùng Firestore doc ID — đảm bảo sync đúng document
            list.push(data);
          });
          if (list.length > 0) {
            if (isSoftwareCleared) {
              // Người dùng vừa xóa sạch dữ liệu trên thiết bị này, không ghi đè lại
              return;
            }
            // Sắp xếp ID lớn nhất / mới nhất lên đầu
            list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
            softwareDatabase = list;
            try { localStorage.setItem('KIMCHI_PHANMEM_DB', JSON.stringify(softwareDatabase)); } catch(e){}
            if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
            if (typeof renderSwCustomerFilterOptions === 'function') renderSwCustomerFilterOptions();
            if (typeof renderSoftwareDebtTable === 'function' && typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) {
              renderSoftwareDebtTable();
            }
            if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
          } else {
            // Khi Firestore đã xóa hết hoặc trống
            if (isSoftwareCleared || softwareDatabase.length === 0) {
              softwareDatabase = [];
              try { localStorage.setItem('KIMCHI_PHANMEM_DB', JSON.stringify(softwareDatabase)); } catch(e){}
              if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
              if (typeof renderSwCustomerFilterOptions === 'function') renderSwCustomerFilterOptions();
              if (typeof renderSoftwareDebtTable === 'function' && typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) {
                renderSoftwareDebtTable();
              }
              if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
            }
          }
        }, err => console.error("Lỗi sync software realtime:", err));
      } catch (err) {
        console.error("Lỗi setup sync software:", err);
      }

      // 8. Đồng bộ Danh sách Hãng Điện Thoại Mới (custom brands)
      try {
        db.collection('settings').doc('custom_brands').onSnapshot(doc => {
          if (doc.exists) {
            let data = doc.data();
            if (data && Array.isArray(data.list)) {
              try { localStorage.setItem('KIMCHI_CUSTOM_BRANDS', JSON.stringify(data.list)); } catch(e){}
              if (typeof renderCustomBrandTabs === 'function') renderCustomBrandTabs();
            }
          }
        }, err => console.error("Lỗi sync custom brands:", err));
      } catch (err) {
        console.error("Lỗi setup sync custom brands:", err);
      }
    }
    window.initFirebaseRealtimeSync = initFirebaseRealtimeSync;

    // HÀM TỰ ĐỘNG BẬT BÀN PHÍM SỐ TRÊN MOBILE CHO MỤC NHẬP GIÁ VÀ IMEI TOÀN BỘ WEB
    function initNumericKeyboardsForMobile() {
      const isSearchInput = (el) => {
        if (!el || el.tagName !== 'INPUT') return false;
        const id = (el.id || '').toLowerCase();
        const cls = (el.className || '').toLowerCase();
        const name = (el.name || '').toLowerCase();
        const ph = (el.placeholder || '').toLowerCase();
        return id.includes('search') || cls.includes('search') || name.includes('search') ||
               ph.includes('tìm') || ph.includes('search') || id.includes('tim') || cls.includes('tim');
      };

      const isPriceOrImei = (el) => {
        if (!el || el.tagName !== 'INPUT') return false;
        if (isSearchInput(el)) return false; // CÁC Ô TÌM KIẾM LUÔN DÙNG BÀN PHÍM CHỮ!
        const type = (el.type || '').toLowerCase();
        if (type === 'checkbox' || type === 'radio' || type === 'file' || type === 'date' || type === 'time') return false;
        const id = (el.id || '').toLowerCase();
        const cls = (el.className || '').toLowerCase();
        const name = (el.name || '').toLowerCase();
        const ph = (el.placeholder || '').toLowerCase();
        const onin = (el.getAttribute('oninput') || '').toLowerCase();

        // Kiểm tra từ khóa Giá hoặc IMEI
        const keywords = ['price', 'gia', 'cost', 'fee', 'profit', 'imei', 'thu', 'von', 'lai', 'sac', 'op', 'cluc', 'cuoc', 'bbrestsell', 'bbnextsell', 'bbbuyback', 'bbsell', 'bboriginal'];
        if (keywords.some(k => id.includes(k) || cls.includes(k) || name.includes(k) || ph.includes(k))) return true;
        if (onin.includes('currency') || onin.includes('formatprice') || onin.includes('parseprice') || onin.includes('imei')) return true;
        return false;
      };

      const applyNumeric = (el) => {
        if (isSearchInput(el)) {
          // BẮT BUỘC BẬT BÀN PHÍM VIẾT CHỮ (TEXT) CHO TẤT CẢ CÁC Ô TÌM KIẾM TRÊN CÁC TAB
          el.setAttribute('inputmode', 'text');
          el.removeAttribute('pattern');
          return;
        }
        if (isPriceOrImei(el)) {
          el.setAttribute('inputmode', 'numeric');
          el.removeAttribute('pattern');
        }
      };

      // 1. Quét toàn bộ input hiện có trong DOM
      document.querySelectorAll('input').forEach(applyNumeric);

      // 2. Lắng nghe sự kiện focusin để bắt mọi input mới mở hoặc modal mới render
      document.addEventListener('focusin', (e) => {
        if (e.target && e.target.tagName === 'INPUT') {
          applyNumeric(e.target);
        }
      }, true);

      // 3. Quan sát DOM tự động gán khi có modal hay thành phần mới xuất hiện
      if (window.MutationObserver) {
        const obs = new MutationObserver((mutations) => {
          mutations.forEach(m => {
            m.addedNodes.forEach(node => {
              if (node.nodeType === 1) {
                if (node.tagName === 'INPUT') applyNumeric(node);
                node.querySelectorAll && node.querySelectorAll('input').forEach(applyNumeric);
              }
            });
          });
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      initAllTabsToVietnamToday();
      migrateStorageUnits();
      initFirebaseRealtimeSync();
      initNumericKeyboardsForMobile();
      const curToken = sessionStorage.getItem('KIMCHI_AUTH_TOKEN') || localStorage.getItem('KIMCHI_AUTH_TOKEN');
      const isLoggedFlag = (sessionStorage.getItem('KIMCHI_LOGGED') === 'true' || localStorage.getItem('KIMCHI_LOGGED') === 'true');
      const isAuth = isLoggedFlag || ['250991', '250995', 'Huyen@95', '123456', 'logged'].includes(curToken) || (curToken && curToken.length >= 4);
      const sc = document.getElementById('loginScreen');
      if (isAuth) {
        if (sc) sc.style.display = 'none';
        document.body.classList.remove('login-locked', 'login-active');
        document.documentElement.classList.add('user-is-logged');
      } else {
        if (sc) sc.style.display = 'flex';
        document.body.classList.add('login-locked');
        document.documentElement.classList.remove('user-is-logged');
      }
      renderAllDropdowns();
      renderAllRepairDropdowns();
      if (typeof renderCustomBrandTabs === 'function') renderCustomBrandTabs();
      filterBrand('ALL', document.querySelector('.brand-tabs-horizontal .brand-btn-h'));
      renderSalesTable(salesDatabase);
      renderBangaTable(bangaDatabase);
      renderPhoneGrid();
      renderSoldPhoneTable();
      renderSoftwareTable(softwareDatabase);
      renderRepairTable();
      renderSystemAccountsTable();
      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    });

    // Dữ liệu mẫu khởi tạo chuẩn Phần Mềm
    const DEFAULT_SOFTWARE_DATA = [
      { id: 1, customer: "A Huy", device: "A3s", price: "100", cost: "0", profit: "100", dayMonth: "23-10", year: "2026", time: "11:37", paymentStatus: "ĐÃ THANH TOÁN", selected: false },
      { id: 2, customer: "Tấn Phát", device: "A3s", price: "150", cost: "0", profit: "150", dayMonth: "23-10", year: "2026", time: "11:36", paymentStatus: "ĐÃ THANH TOÁN", selected: false },
      { id: 3, customer: "Kỳ Hường", device: "C71", price: "100", cost: "0", profit: "100", dayMonth: "23-10", year: "2026", time: "11:36", paymentStatus: "NỢ DAI", selected: false },
      { id: 4, customer: "Tấn Phát", device: "A3s", price: "150", cost: "0", profit: "150", dayMonth: "23-10", year: "2026", time: "11:20", paymentStatus: "NỢ DAI", selected: false },
      { id: 5, customer: "Kỳ Hường", device: "C71 + F11", price: "250", cost: "0", profit: "250", dayMonth: "23-10", year: "2026", time: "11:15", paymentStatus: "NỢ DAI", selected: false },
      { id: 6, customer: "Diệu (An Lâm)", device: "iPhone 7 Plus", price: "100", cost: "0", profit: "100", dayMonth: "23-10", year: "2026", time: "10:50", paymentStatus: "NỢ DAI", selected: false },
      { id: 7, customer: "Nguyễn Đức Hạnh (Lương)", device: "Y91c", price: "50", cost: "0", profit: "50", dayMonth: "23-10", year: "2026", time: "10:30", paymentStatus: "NỢ DAI", selected: false },
      { id: 8, customer: "Cường Apple", device: "A5s + A15s", price: "100", cost: "0", profit: "100", dayMonth: "23-10", year: "2026", time: "10:05", paymentStatus: "NỢ DAI", selected: false },
      { id: 9, customer: "Tuyến Thảo", device: "Redmi Note 7 Pro + A32", price: "50", cost: "0", profit: "50", dayMonth: "22-10", year: "2026", time: "16:40", paymentStatus: "NỢ DAI", selected: false },
      { id: 10, customer: "Quang Trung HY", device: "A06", price: "100", cost: "0", profit: "100", dayMonth: "22-10", year: "2026", time: "15:20", paymentStatus: "NỢ DAI", selected: false }
    ];

    let softwareDatabase = [];
    try {
      const isSoftwareCleared = localStorage.getItem('KIMCHI_PHANMEM_CLEARED') === 'true';
      const stored = localStorage.getItem('KIMCHI_PHANMEM_DB');
      if (isSoftwareCleared) {
        softwareDatabase = [];
      } else if (stored !== null) {
        softwareDatabase = JSON.parse(stored) || [];
      } else {
        softwareDatabase = DEFAULT_SOFTWARE_DATA;
        localStorage.setItem('KIMCHI_PHANMEM_DB', JSON.stringify(softwareDatabase));
      }
    } catch (e) {
      softwareDatabase = [];
    }

    // Dữ liệu Bán Hàng & Bán Gà: Khởi tạo an toàn kèm đồng bộ Firebase Firestore
    let salesDatabase = [];
    try {
      const sRaw = localStorage.getItem('KIMCHI_SALES_DB');
      if (sRaw) {
        salesDatabase = JSON.parse(sRaw) || [];
        salesDatabase.forEach(item => {
          if (item) {
            if (item.total !== undefined && item.total !== null && item.total !== '') item.total = formatPriceStr(item.total);
            if (item.price !== undefined && item.price !== null && item.price !== '') item.price = formatPriceStr(item.price);
            if (item.priceIn !== undefined && item.priceIn !== null && item.priceIn !== '') item.priceIn = formatPriceStr(item.priceIn);
            if (item.profit !== undefined && item.profit !== null && item.profit !== '') item.profit = formatPriceStr(item.profit);
          }
        });
      }
    } catch(e) {}

    // Helper kiểm tra một phiếu bán hàng có khớp với phạm vi thời gian đang chọn (Ngày, Tháng, Năm, Tất Cả) hay không
    function isSaleItemMatchingCurrentFilter(item) {
      if (!item || !item.dateTime) return false;
      if (typeof salesViewMode === 'undefined' || salesViewMode === 'all') return true;
      let parts = String(item.dateTime).split(' - ');
      if (parts.length < 2) return false;
      let datePart = parts[1].trim();
      let [d, m, y] = datePart.split('/').map(n => parseInt(n, 10));
      if (!y || !m) return false;

      if (salesViewMode === 'day') {
        const curD = currentSalesDateFilter.getDate();
        const curM = currentSalesDateFilter.getMonth() + 1;
        const curY = currentSalesDateFilter.getFullYear();
        return d === curD && m === curM && y === curY;
      } else if (salesViewMode === 'month') {
        return (m - 1) === currentSalesMonthFilter.month && y === currentSalesMonthFilter.year;
      } else if (salesViewMode === 'year') {
        return y === currentSalesYearFilter;
      }
      return true;
    }
    window.isSaleItemMatchingCurrentFilter = isSaleItemMatchingCurrentFilter;

    // Helper lấy nhãn phạm vi thời gian đang chọn của tab Bán Hàng
    function getCurrentSalesScopeLabel() {
      if (typeof salesViewMode === 'undefined' || salesViewMode === 'all') {
        return 'TẤT CẢ';
      }
      if (salesViewMode === 'day') {
        const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentSalesDateFilter.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (salesViewMode === 'month') {
        const mm = String(currentSalesMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSalesMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (salesViewMode === 'year') {
        return `NĂM ${currentSalesYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentSalesScopeLabel = getCurrentSalesScopeLabel;

    // Helper kiểm tra một đơn Phần Mềm có khớp với phạm vi thời gian đang chọn
    function isSoftwareItemMatchingCurrentFilter(item) {
      if (!item) return false;
      if (typeof swViewMode === 'undefined' || swViewMode === 'all') return true;
      let dayMonth = String(item.dayMonth || '').trim();
      let year = String(item.year || '2026').trim();

      if (swViewMode === 'day') {
        if (typeof swFilterDate === 'undefined' || !swFilterDate) return true;
        const dd = String(swFilterDate.getDate()).padStart(2, '0');
        const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = String(swFilterDate.getFullYear());
        return dayMonth === `${dd}-${mm}` && year === yyyy;
      } else if (swViewMode === 'month') {
        if (typeof currentSoftwareMonthFilter === 'undefined' || !currentSoftwareMonthFilter) return true;
        const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
        const yyyy = String(currentSoftwareMonthFilter.year);
        let parts = dayMonth.split('-');
        let m = parts.length === 2 ? parts[1] : '';
        return m === mm && year === yyyy;
      } else if (swViewMode === 'year') {
        if (typeof currentSoftwareYearFilter === 'undefined') return true;
        const yyyy = String(currentSoftwareYearFilter);
        return year === yyyy;
      }
      return true;
    }
    window.isSoftwareItemMatchingCurrentFilter = isSoftwareItemMatchingCurrentFilter;

    function getCurrentSoftwareScopeLabel() {
      if (typeof swViewMode === 'undefined' || swViewMode === 'all') return 'TẤT CẢ';
      if (swViewMode === 'day') {
        const dd = String(swFilterDate.getDate()).padStart(2, '0');
        const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = swFilterDate.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (swViewMode === 'month') {
        const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSoftwareMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (swViewMode === 'year') {
        return `NĂM ${currentSoftwareYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentSoftwareScopeLabel = getCurrentSoftwareScopeLabel;

    // Helper kiểm tra một đơn Sửa Chữa có khớp với phạm vi thời gian đang chọn
    function isRepairItemMatchingCurrentFilter(item) {
      if (!item) return false;
      if (typeof repairViewMode === 'undefined' || repairViewMode === 'all') return true;
      let dateFormatted = String(item.dateFormatted || '').trim();
      let parts = dateFormatted.split('/');
      if (parts.length < 3) return false;
      let d = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);

      if (repairViewMode === 'day') {
        if (typeof repairFilterDate === 'undefined' || !repairFilterDate) return true;
        const curD = repairFilterDate.getDate();
        const curM = repairFilterDate.getMonth() + 1;
        const curY = repairFilterDate.getFullYear();
        return d === curD && m === curM && y === curY;
      } else if (repairViewMode === 'month') {
        if (typeof currentRepairMonthFilter === 'undefined' || !currentRepairMonthFilter) return true;
        return (m - 1) === currentRepairMonthFilter.month && y === currentRepairMonthFilter.year;
      } else if (repairViewMode === 'year') {
        if (typeof currentRepairYearFilter === 'undefined') return true;
        return y === currentRepairYearFilter;
      }
      return true;
    }
    window.isRepairItemMatchingCurrentFilter = isRepairItemMatchingCurrentFilter;

    function getCurrentRepairScopeLabel() {
      if (typeof repairViewMode === 'undefined' || repairViewMode === 'all') return 'TẤT CẢ';
      if (repairViewMode === 'day') {
        const dd = String(repairFilterDate.getDate()).padStart(2, '0');
        const mm = String(repairFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = repairFilterDate.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (repairViewMode === 'month') {
        const mm = String(currentRepairMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentRepairMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (repairViewMode === 'year') {
        return `NĂM ${currentRepairYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentRepairScopeLabel = getCurrentRepairScopeLabel;

    // Helper kiểm tra một đơn Bán Gà có khớp với phạm vi thời gian đang chọn
    function isBangaItemMatchingCurrentFilter(item) {
      if (!item || !item.dateTime) return false;
      if (typeof bangaViewMode === 'undefined' || bangaViewMode === 'all') return true;
      let parts = String(item.dateTime).split(' - ');
      if (parts.length < 2) return false;
      let datePart = parts[1].trim();
      let [d, m, y] = datePart.split('/').map(n => parseInt(n, 10));
      if (!y || !m) return false;

      if (bangaViewMode === 'day') {
        if (typeof currentBangaDateFilter === 'undefined' || !currentBangaDateFilter) return true;
        const curD = currentBangaDateFilter.getDate();
        const curM = currentBangaDateFilter.getMonth() + 1;
        const curY = currentBangaDateFilter.getFullYear();
        return d === curD && m === curM && y === curY;
      } else if (bangaViewMode === 'month') {
        if (typeof currentBangaMonthFilter === 'undefined' || !currentBangaMonthFilter) return true;
        return (m - 1) === currentBangaMonthFilter.month && y === currentBangaMonthFilter.year;
      } else if (bangaViewMode === 'year') {
        if (typeof currentBangaYearFilter === 'undefined') return true;
        return y === currentBangaYearFilter;
      }
      return true;
    }
    window.isBangaItemMatchingCurrentFilter = isBangaItemMatchingCurrentFilter;

    function getCurrentBangaScopeLabel() {
      if (typeof bangaViewMode === 'undefined' || bangaViewMode === 'all') return 'TẤT CẢ';
      if (bangaViewMode === 'day') {
        const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentBangaDateFilter.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (bangaViewMode === 'month') {
        const mm = String(currentBangaMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentBangaMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (bangaViewMode === 'year') {
        return `NĂM ${currentBangaYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentBangaScopeLabel = getCurrentBangaScopeLabel;

    // Helper kiểm tra một đơn Bảo Hành (SoldPhone) có khớp với phạm vi thời gian đang chọn
    function isSoldPhoneItemMatchingCurrentFilter(item) {
      if (!item) return false;
      if (typeof soldPhoneViewMode === 'undefined' || soldPhoneViewMode === 'all') return true;
      let dtStr = item.dateTime || item.soldDate || item.date || '';
      let datePart = dtStr;
      if (dtStr.includes(' - ')) {
        datePart = dtStr.split(' - ')[1].trim();
      }
      let parts = datePart.split('/');
      if (parts.length < 3) return false;
      let d = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      if (!y || !m) return false;

      if (soldPhoneViewMode === 'day') {
        if (typeof currentSoldPhoneDateFilter === 'undefined' || !currentSoldPhoneDateFilter) return true;
        const curD = currentSoldPhoneDateFilter.getDate();
        const curM = currentSoldPhoneDateFilter.getMonth() + 1;
        const curY = currentSoldPhoneDateFilter.getFullYear();
        return d === curD && m === curM && y === curY;
      } else if (soldPhoneViewMode === 'month') {
        if (typeof currentSoldPhoneMonthFilter === 'undefined' || !currentSoldPhoneMonthFilter) return true;
        return (m - 1) === currentSoldPhoneMonthFilter.month && y === currentSoldPhoneMonthFilter.year;
      } else if (soldPhoneViewMode === 'year') {
        if (typeof currentSoldPhoneYearFilter === 'undefined') return true;
        return y === currentSoldPhoneYearFilter;
      }
      return true;
    }
    window.isSoldPhoneItemMatchingCurrentFilter = isSoldPhoneItemMatchingCurrentFilter;

    function getCurrentSoldPhoneScopeLabel() {
      if (typeof soldPhoneViewMode === 'undefined' || soldPhoneViewMode === 'all') return 'TẤT CẢ';
      if (soldPhoneViewMode === 'day') {
        const dd = String(currentSoldPhoneDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentSoldPhoneDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentSoldPhoneDateFilter.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (soldPhoneViewMode === 'month') {
        const mm = String(currentSoldPhoneMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSoldPhoneMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (soldPhoneViewMode === 'year') {
        return `NĂM ${currentSoldPhoneYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentSoldPhoneScopeLabel = getCurrentSoldPhoneScopeLabel;

    // Helper kiểm tra một đơn Main Xác có khớp với phạm vi thời gian đang chọn
    function isMainXacItemMatchingCurrentFilter(item) {
      if (!item) return false;
      if (typeof mainXacViewMode === 'undefined' || mainXacViewMode === 'all') return true;
      let dateStr = String(item.date || '').trim();
      let parts = dateStr.split('/');
      if (parts.length < 3) return false;
      let d = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10);
      let y = parseInt(parts[2], 10);
      if (!y || !m) return false;

      if (mainXacViewMode === 'day') {
        if (typeof currentMainXacDateFilter === 'undefined' || !currentMainXacDateFilter) return true;
        const curD = currentMainXacDateFilter.getDate();
        const curM = currentMainXacDateFilter.getMonth() + 1;
        const curY = currentMainXacDateFilter.getFullYear();
        return d === curD && m === curM && y === curY;
      } else if (mainXacViewMode === 'month') {
        if (typeof currentMainXacMonthFilter === 'undefined' || !currentMainXacMonthFilter) return true;
        return (m - 1) === currentMainXacMonthFilter.month && y === currentMainXacMonthFilter.year;
      } else if (mainXacViewMode === 'year') {
        if (typeof currentMainXacYearFilter === 'undefined') return true;
        return y === currentMainXacYearFilter;
      }
      return true;
    }
    window.isMainXacItemMatchingCurrentFilter = isMainXacItemMatchingCurrentFilter;

    function getCurrentMainXacScopeLabel() {
      if (typeof mainXacViewMode === 'undefined' || mainXacViewMode === 'all') return 'TẤT CẢ';
      if (mainXacViewMode === 'day') {
        const dd = String(currentMainXacDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentMainXacDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentMainXacDateFilter.getFullYear();
        return `NGÀY ${dd}/${mm}/${yyyy}`;
      }
      if (mainXacViewMode === 'month') {
        const mm = String(currentMainXacMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentMainXacMonthFilter.year;
        return `THÁNG ${mm}/${yyyy}`;
      }
      if (mainXacViewMode === 'year') {
        return `NĂM ${currentMainXacYearFilter}`;
      }
      return 'TẤT CẢ';
    }
    window.getCurrentMainXacScopeLabel = getCurrentMainXacScopeLabel;

    function clearAllSalesData() {
      let scopeLabel = getCurrentSalesScopeLabel();
      let itemsToDelete = salesDatabase.filter(isSaleItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có phiếu bán hàng nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      let confirmText = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} phiếu Bán Hàng thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmText === null) {
        return; // Người dùng bấm Hủy
      }
      
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'đồng ý' || clean === 'dong y' || clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok') {
        let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));
        
        if (typeof db !== 'undefined' && db) {
          itemsToDelete.forEach(item => {
            if (item && item.id) {
              db.collection('sales').doc(String(item.id)).delete().catch(console.error);
            }
          });
        }

        // Cập nhật lại salesDatabase: chỉ giữ lại các mục không bị xóa
        salesDatabase = salesDatabase.filter(it => !deleteIds.has(String(it.id)));
        try { localStorage.setItem('KIMCHI_SALES_DB', JSON.stringify(salesDatabase)); } catch(e){}
        renderSalesTable(salesDatabase);
        alert(`Đã xóa thành công ${itemsToDelete.length} phiếu Bán Hàng thuộc [${scopeLabel}]!`);
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllSalesData = clearAllSalesData;

    function sanitizeRecordPrice(item) {
      if (!item) return;
      let t = parsePriceNum(item.total || item.price);
      let pi = parsePriceNum(item.priceIn);
      // Chỉ chuẩn hóa nếu người dùng nhập đơn vị Đồng đầy đủ (>= 1.000.000đ)
      if (t >= 1000000 && t % 1000 === 0) t = Math.round(t / 1000);
      if (pi >= 1000000 && pi % 1000 === 0) pi = Math.round(pi / 1000);
      let p = (item.profit !== undefined && item.profit !== null && item.profit !== '') ? parsePriceNum(item.profit) : (t - pi);
      if (t > 0 && pi > 0 && (p === 0 || p === undefined)) {
        p = t - pi;
      }
      if (item.total !== undefined) item.total = formatPriceStr(t);
      if (item.price !== undefined) item.price = formatPriceStr(t);
      item.priceIn = formatPriceStr(pi);
      item.profit = formatPriceStr(p);
    }

    let bangaDatabase = [];
    try {
      const bgRaw = localStorage.getItem('KIMCHI_BANGA_DB');
      if (bgRaw) {
        bangaDatabase = JSON.parse(bgRaw) || [];
      } else if (Array.isArray(window.SEED_BANGA_DATA) && window.SEED_BANGA_DATA.length > 0) {
        bangaDatabase = JSON.parse(JSON.stringify(window.SEED_BANGA_DATA));
      }
      bangaDatabase.forEach(item => {
        if (item) {
          if (item.total !== undefined && item.total !== null && item.total !== '') item.total = formatPriceStr(item.total);
          if (item.price !== undefined && item.price !== null && item.price !== '') item.price = formatPriceStr(item.price);
          if (item.priceIn !== undefined && item.priceIn !== null && item.priceIn !== '') item.priceIn = formatPriceStr(item.priceIn);
          if (item.profit !== undefined && item.profit !== null && item.profit !== '') item.profit = formatPriceStr(item.profit);
        }
      });
    } catch(e) {}

    function saveSalesStorage(itemToSync) {
      try { localStorage.setItem('KIMCHI_SALES_DB', JSON.stringify(salesDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('sales').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          salesDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('sales').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
    }

    function saveBangaStorage(itemToSync) {
      try { localStorage.setItem('KIMCHI_BANGA_DB', JSON.stringify(bangaDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('banga').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          bangaDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('banga').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
    }

    let tempCart = [];

    // BÁN HÀNG VIEW MODE (DAY / MONTH)
    let salesViewMode = 'day';
    let currentSalesDateFilter = getVietnamDate();
    let currentSalesMonthFilter = { month: currentSalesDateFilter.getMonth(), year: currentSalesDateFilter.getFullYear() };
    let currentSalesYearFilter = currentSalesDateFilter.getFullYear();

    /* ============================================================
       HÀM CHỈNH SỬA THỦ CÔNG NGÀY / THÁNG / NĂM KHI CLICK CHUỘT
       ============================================================ */
    function makeDateDisplayEditable(el, tabKey, modeType) {
      if (!el || el.dataset.editing === 'true') return;
      el.dataset.editing = 'true';

      const originalText = el.innerText.trim();
      const input = document.createElement('input');
      input.type = 'text';
      input.value = originalText;
      input.style.width = Math.max(76, el.offsetWidth + 18) + 'px';
      input.style.background = '#000000';
      input.style.color = '#ffffff';
      input.style.border = '1.5px solid #334155';
      input.style.borderRadius = '6px';
      input.style.fontWeight = '900';
      input.style.fontSize = window.getComputedStyle(el).fontSize || '0.95rem';
      input.style.textAlign = 'center';
      input.style.outline = 'none';
      input.style.padding = '2px 4px';
      input.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.2)';

      el.style.display = 'none';
      el.parentNode.insertBefore(input, el);
      input.focus();
      input.select();

      let finished = false;
      function finishEdit() {
        if (finished) return;
        finished = true;
        const rawVal = input.value.trim();
        input.remove();
        el.style.display = '';
        delete el.dataset.editing;

        if (!rawVal) {
          el.innerText = originalText;
          return;
        }

        applyCustomDateFilter(tabKey, modeType, rawVal, el, originalText);
      }

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          finishEdit();
        } else if (e.key === 'Escape') {
          finished = true;
          input.remove();
          el.style.display = '';
          delete el.dataset.editing;
          el.innerText = originalText;
        }
      });

      input.addEventListener('blur', finishEdit);
    }
    window.makeDateDisplayEditable = makeDateDisplayEditable;

    function applyCustomDateFilter(tabKey, modeType, rawVal, el, originalText) {
      const now = new Date();
      if (modeType === 'day') {
        let parts = rawVal.replace(/-/g, '/').split('/');
        let d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
        if (parts.length === 3) {
          d = parseInt(parts[0], 10);
          m = parseInt(parts[1], 10);
          y = parseInt(parts[2], 10);
        } else if (parts.length === 2) {
          d = parseInt(parts[0], 10);
          m = parseInt(parts[1], 10);
        } else if (parts.length === 1 && !isNaN(parseInt(parts[0], 10))) {
          d = parseInt(parts[0], 10);
        }
        if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12) {
          el.innerText = originalText;
          if (typeof showToast === 'function') showToast('Ngày không hợp lệ! Vui lòng nhập dạng dd/mm/yyyy');
          return;
        }
        const targetDate = new Date(y, m - 1, d);
        const formatted = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
        el.innerText = formatted;

        if (tabKey === 'sales') {
          currentSalesDateFilter = targetDate;
          renderSalesTable(salesDatabase);
        } else if (tabKey === 'sw') {
          swFilterDate = targetDate;
          renderSoftwareTable(softwareDatabase);
        } else if (tabKey === 'repair') {
          repairFilterDate = targetDate;
          renderRepairTable();
        } else if (tabKey === 'banga') {
          currentBangaDateFilter = targetDate;
          renderBangaTable(bangaDatabase);
        } else if (tabKey === 'soldPhone') {
          currentSoldPhoneDateFilter = targetDate;
          renderSoldPhoneTable();
        } else if (tabKey === 'mainXac') {
          currentMainXacDateFilter = targetDate;
          renderMainXacGrid();
        }
      } else if (modeType === 'month') {
        let parts = rawVal.replace(/-/g, '/').split('/');
        let m = now.getMonth() + 1, y = now.getFullYear();
        if (parts.length >= 2) {
          m = parseInt(parts[0], 10);
          y = parseInt(parts[1], 10);
        } else if (parts.length === 1 && !isNaN(parseInt(parts[0], 10))) {
          m = parseInt(parts[0], 10);
        }
        if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
          el.innerText = originalText;
          if (typeof showToast === 'function') showToast('Tháng không hợp lệ! Vui lòng nhập dạng mm/yyyy');
          return;
        }
        const formatted = `${String(m).padStart(2, '0')}/${y}`;
        el.innerText = formatted;

        if (tabKey === 'sales') {
          currentSalesMonthFilter = { month: m - 1, year: y };
          renderSalesTable(salesDatabase);
        } else if (tabKey === 'sw') {
          currentSoftwareMonthFilter = { month: m - 1, year: y };
          renderSoftwareTable(softwareDatabase);
        } else if (tabKey === 'repair') {
          currentRepairMonthFilter = { month: m - 1, year: y };
          renderRepairTable();
        } else if (tabKey === 'banga') {
          currentBangaMonthFilter = { month: m - 1, year: y };
          renderBangaTable(bangaDatabase);
        } else if (tabKey === 'soldPhone') {
          currentSoldPhoneMonthFilter = { month: m - 1, year: y };
          renderSoldPhoneTable();
        } else if (tabKey === 'mainXac') {
          currentMainXacMonthFilter = { month: m - 1, year: y };
          renderMainXacGrid();
        }
      } else if (modeType === 'year') {
        let y = parseInt(rawVal, 10);
        if (isNaN(y) || y < 1900 || y > 2100) {
          el.innerText = originalText;
          if (typeof showToast === 'function') showToast('Năm không hợp lệ! Vui lòng nhập 4 chữ số (ví dụ: 2026)');
          return;
        }
        el.innerText = String(y);

        if (tabKey === 'sales') {
          currentSalesYearFilter = y;
          renderSalesTable(salesDatabase);
        } else if (tabKey === 'sw') {
          currentSoftwareYearFilter = y;
          renderSoftwareTable(softwareDatabase);
        } else if (tabKey === 'repair') {
          currentRepairYearFilter = y;
          renderRepairTable();
        } else if (tabKey === 'banga') {
          currentBangaYearFilter = y;
          renderBangaTable(bangaDatabase);
        } else if (tabKey === 'soldPhone') {
          currentSoldPhoneYearFilter = y;
          renderSoldPhoneTable();
        } else if (tabKey === 'mainXac') {
          currentMainXacYearFilter = y;
          renderMainXacGrid();
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }
    window.applyCustomDateFilter = applyCustomDateFilter;

    function openDatePicker(tabKey) {
      const input = document.getElementById('nativeDatePicker_' + tabKey);
      if (!input) return;

      let curD = null;
      if (tabKey === 'sales') curD = currentSalesDateFilter;
      else if (tabKey === 'sw') curD = swFilterDate;
      else if (tabKey === 'repair') curD = repairFilterDate;
      else if (tabKey === 'banga') curD = currentBangaDateFilter;
      else if (tabKey === 'soldPhone') curD = currentSoldPhoneDateFilter;
      else if (tabKey === 'mainXac') curD = currentMainXacDateFilter;

      if (curD instanceof Date && !isNaN(curD.getTime())) {
        const y = curD.getFullYear();
        const m = String(curD.getMonth() + 1).padStart(2, '0');
        const d = String(curD.getDate()).padStart(2, '0');
        input.value = `${y}-${m}-${d}`;
      }

      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
          return;
        } catch (e) {
          console.warn('showPicker error:', e);
        }
      }
      input.focus();
      input.click();
    }
    window.openDatePicker = openDatePicker;

    function handleNativeDateChange(tabKey, val) {
      if (!val) return;
      const parts = val.split('-');
      if (parts.length !== 3) return;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return;

      const targetDate = new Date(y, m - 1, d);
      const formatted = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;

      if (tabKey === 'sales') {
        currentSalesDateFilter = targetDate;
        const el = document.getElementById('filterSalesDateDisplay');
        if (el) el.innerText = formatted;
        renderSalesTable(salesDatabase);
      } else if (tabKey === 'sw') {
        swFilterDate = targetDate;
        const el = document.getElementById('filterSoftwareDateDisplay');
        if (el) {
          if (el.tagName === 'INPUT') el.value = formatted;
          else el.innerText = formatted;
        }
        renderSwCustomerFilterOptions();
        renderSoftwareTable(softwareDatabase);
      } else if (tabKey === 'repair') {
        repairFilterDate = targetDate;
        const el = document.getElementById('filterRepairDateDisplay');
        if (el) el.innerText = formatted;
        renderRepairTable();
      } else if (tabKey === 'banga') {
        currentBangaDateFilter = targetDate;
        const el = document.getElementById('filterBangaDateDisplay');
        if (el) el.innerText = formatted;
        renderBangaTable(bangaDatabase);
      } else if (tabKey === 'soldPhone') {
        currentSoldPhoneDateFilter = targetDate;
        const el = document.getElementById('filterSoldPhoneDateDisplay');
        if (el) el.innerText = formatted;
        renderSoldPhoneTable();
      } else if (tabKey === 'mainXac') {
        currentMainXacDateFilter = targetDate;
        const el = document.getElementById('filterMainXacDateDisplay');
        if (el) el.innerText = formatted;
        renderMainXacGrid();
      }
      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }
    window.handleNativeDateChange = handleNativeDateChange;

    function setSalesMode(mode) {
      salesViewMode = mode;
      const selMode = document.getElementById('salesModeSelect');
      if (selMode) selMode.value = mode;
      const btnDay = document.getElementById('salesModeDayBtn');
      const btnMonth = document.getElementById('salesModeMonthBtn');
      const btnYear = document.getElementById('salesModeYearBtn');
      const dayBox = document.getElementById('salesDateFilterBox');
      const monthBox = document.getElementById('salesMonthFilterBox');
      const yearBox = document.getElementById('salesYearFilterBox');

      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnYear) btnYear.classList.toggle('active', mode === 'year');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderSalesTable(salesDatabase);
    }
    window.setSalesMode = setSalesMode;

    function toggleSalesViewMode() {
      if (salesViewMode === 'day') {
        setSalesMode('month');
      } else {
        setSalesMode('day');
      }
    }
    window.toggleSalesViewMode = toggleSalesViewMode;

    function changeSalesFilterDate(delta) {
      currentSalesDateFilter.setDate(currentSalesDateFilter.getDate() + delta);
      const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentSalesDateFilter.getFullYear();
      document.getElementById('filterSalesDateDisplay').innerText = `${dd}/${mm}/${yyyy}`;
      renderSalesTable(salesDatabase);
    }
    window.changeSalesFilterDate = changeSalesFilterDate;

    function changeSalesFilterMonth(delta) {
      currentSalesMonthFilter.month += delta;
      if (currentSalesMonthFilter.month > 11) {
        currentSalesMonthFilter.month = 0;
        currentSalesMonthFilter.year++;
      } else if (currentSalesMonthFilter.month < 0) {
        currentSalesMonthFilter.month = 11;
        currentSalesMonthFilter.year--;
      }
      const mm = String(currentSalesMonthFilter.month + 1).padStart(2, '0');
      document.getElementById('filterSalesMonthDisplay').innerText = `${mm}/${currentSalesMonthFilter.year}`;
      renderSalesTable(salesDatabase);
    }
    window.changeSalesFilterMonth = changeSalesFilterMonth;

    function changeSalesFilterYear(delta) {
      currentSalesYearFilter += delta;
      const el = document.getElementById('filterSalesYearDisplay');
      if (el) el.innerText = String(currentSalesYearFilter);
      renderSalesTable(salesDatabase);
    }
    window.changeSalesFilterYear = changeSalesFilterYear;

    // THUẬT TOÁN ÂM LỊCH VIỆT NAM (HỒ NGỌC ĐỨC) - CHÍNH XÁC 100%
    function intDiv(d) { return Math.floor(d); }

    function jdFromDateVN(dd, mm, yy) {
      let a = intDiv((14 - mm) / 12);
      let y = yy + 4800 - a;
      let m = mm + 12 * a - 3;
      let jd = dd + intDiv((153 * m + 2) / 5) + 365 * y + intDiv(y / 4) - intDiv(y / 100) + intDiv(y / 400) - 32045;
      if (jd < 2299161) {
        jd = dd + intDiv((153 * m + 2) / 5) + 365 * y + intDiv(y / 4) - 32083;
      }
      return jd;
    }

    function getNewMoonDayVN(k, timeZone) {
      let T = k / 1236.85;
      let T2 = T * T;
      let T3 = T2 * T;
      let dr = Math.PI / 180;
      let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
      Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
      let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
      let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
      let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
      let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
      C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
      C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
      C1 += 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
      C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
      C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
      C1 += 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
      let deltat;
      if (T < -11) deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
      else deltat = -0.000078 + 0.000089 * T;
      let JdNew = Jd1 + C1 - deltat;
      return intDiv(JdNew + 0.5 + timeZone / 24);
    }

    function getSunLongitudeVN(jdn, timeZone) {
      let T = (jdn - 2451545.0 + 0.5 - timeZone / 24) / 36525;
      let T2 = T * T;
      let dr = Math.PI / 180;
      let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
      let M = 357.5291 + 35999.05029 * T - 0.0001537 * T2;
      let C = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr);
      C += (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.000289 * Math.sin(3 * M * dr);
      let theta = L0 + C;
      theta = theta * dr;
      theta = theta - Math.PI * 2 * intDiv(theta / (Math.PI * 2));
      return intDiv(theta / Math.PI * 6);
    }

    function getLunarMonth11VN(yy, timeZone) {
      let off = jdFromDateVN(31, 12, yy) - 2415021;
      let k = intDiv(off / 29.530588853);
      let nm = getNewMoonDayVN(k, timeZone);
      let sunLong = getSunLongitudeVN(nm, timeZone);
      if (sunLong >= 9) nm = getNewMoonDayVN(k - 1, timeZone);
      return nm;
    }

    function getLeapMonthOffsetVN(a11, timeZone) {
      let k = intDiv((a11 - 2415021.076998695) / 29.530588853 + 0.5);
      let last = 0;
      let i = 1;
      let arc = getSunLongitudeVN(getNewMoonDayVN(k + i, timeZone), timeZone);
      do {
        last = arc;
        i++;
        arc = getSunLongitudeVN(getNewMoonDayVN(k + i, timeZone), timeZone);
      } while (arc !== last && i < 14);
      return i - 1;
    }

    function convertSolar2LunarVN(dd, mm, yy, timeZone = 7) {
      let dayNumber = jdFromDateVN(dd, mm, yy);
      let k = intDiv((dayNumber - 2415021.076998695) / 29.530588853);
      let monthStart = getNewMoonDayVN(k + 1, timeZone);
      if (monthStart > dayNumber) {
        monthStart = getNewMoonDayVN(k, timeZone);
      }
      let a11 = getLunarMonth11VN(yy, timeZone);
      let b11 = a11;
      let lunarYear;
      if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11VN(yy - 1, timeZone);
      } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11VN(yy + 1, timeZone);
      }
      let lunarDay = dayNumber - monthStart + 1;
      let diff = intDiv((monthStart - a11) / 29);
      let lunarLeap = 0;
      let lunarMonth = diff + 11;
      if (b11 - a11 > 365) {
        let leapMonthDiff = getLeapMonthOffsetVN(a11, timeZone);
        if (diff >= leapMonthDiff) {
          lunarMonth = diff + 10;
          if (diff === leapMonthDiff) lunarLeap = 1;
        }
      }
      if (lunarMonth > 12) lunarMonth -= 12;
      if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
      return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
    }
    window.convertSolar2LunarVN = convertSolar2LunarVN;

    // HÀM CẬP NHẬT ÂM LỊCH & THỨ THEO NGÀY DƯƠNG ĐANG CHỌN
    function updateSalesLunarAndDayDisplay(dateObj) {
      if (!dateObj || !(dateObj instanceof Date)) return;
      const d = dateObj.getDate();
      const m = dateObj.getMonth() + 1;
      const y = dateObj.getFullYear();

      // 1. Thứ trong tuần (T2, T3, T4, T5, T6, T7, CN)
      const daysOfWeekMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dowStr = daysOfWeekMap[dateObj.getDay()] || 'T3';
      const dowEl = document.getElementById('salesDayOfWeekDisplay');
      if (dowEl) dowEl.innerText = dowStr;

      // 2. Âm lịch
      const lunar = convertSolar2LunarVN(d, m, y, 7);
      const lunarDayStr = String(lunar.day).padStart(2, '0');
      const lunarMonthStr = String(lunar.month).padStart(2, '0');
      const lunarYearStr = lunar.year;
      const lunarDateDisplayEl = document.getElementById('salesLunarDateDisplay');
      if (lunarDateDisplayEl) {
        lunarDateDisplayEl.innerText = `${lunarDayStr}/${lunarMonthStr}/${lunarYearStr}`;
      }
    }
    window.updateSalesLunarAndDayDisplay = updateSalesLunarAndDayDisplay;

    // ĐỒNG HỒ SỐ CHẠY THỜI GIAN THỰC (GIỜ : PHÚT : GIÂY)
    function startSalesLiveClock() {
      function tick() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const clockEl = document.getElementById('salesLiveClock');
        if (clockEl) {
          clockEl.innerText = `${hh}:${mm}:${ss}`;
        }
      }
      tick();
      setInterval(tick, 1000);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startSalesLiveClock);
    } else {
      startSalesLiveClock();
    }

    // DỰ BÁO THỜI TIẾT TỰ ĐỘNG CẬP NHẬT TẠI X. NAM SÁCH - TP. HẢI PHÒNG
    function fetchSalesWeather() {
      // Tọa độ Nam Sách: lat=20.97, lon=106.33
      fetch('https://api.open-meteo.com/v1/forecast?latitude=20.97&longitude=106.33&current_weather=true')
        .then(res => res.json())
        .then(data => {
          if (!data || !data.current_weather) return;
          const cw = data.current_weather;
          const temp = Math.round(cw.temperature);
          const code = cw.weathercode;

          let icon = '🌤️';
          let desc = 'Quang đãng';
          if (code === 0) { icon = '☀️'; desc = 'Trời nắng'; }
          else if (code === 1 || code === 2) { icon = '🌤️'; desc = 'Ít mây'; }
          else if (code === 3) { icon = '☁️'; desc = 'Nhiều mây'; }
          else if ([51, 53, 55, 61, 63, 65].includes(code)) { icon = '🌧️'; desc = 'Mưa nhỏ'; }
          else if ([80, 81, 82].includes(code)) { icon = '🌧️'; desc = 'Mưa rào'; }
          else if ([95, 96, 99].includes(code)) { icon = '⛈️'; desc = 'Dông bão'; }
          else if ([45, 48].includes(code)) { icon = '🌫️'; desc = 'Có sương mù'; }

          const condEl = document.getElementById('salesWeatherCondition');
          if (condEl) {
            condEl.innerHTML = `<span>${icon} ${temp}°C, ${desc}</span>`;
          }
        })
        .catch(err => {
          console.warn('Lỗi lấy thời tiết Nam Sách:', err);
        });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fetchSalesWeather);
    } else {
      fetchSalesWeather();
    }
    // Cập nhật lại thời tiết mỗi 30 phút
    setInterval(fetchSalesWeather, 30 * 60 * 1000);

    let isSalesSensitiveHidden = false;

    function toggleSalesSensitive() {
      isSalesSensitiveHidden = !isSalesSensitiveHidden;
      const btn = document.getElementById('btnSalesToggleHide');
      if (btn) {
        btn.innerHTML = isSalesSensitiveHidden ? '👁 Hiện' : '👁 Ẩn';
      }
      renderSalesTable(salesDatabase);
    }

    let currentSalesPaymentFilter = 'ALL';

    function setSalesPaymentFilter(method) {
      currentSalesPaymentFilter = method;
      const selectEl = document.getElementById('salesPaymentMethodSelect');
      if (selectEl && selectEl.value !== method) {
        selectEl.value = method;
      }
      const btnAll = document.getElementById('salesMethodAllBtn');
      const btnTm = document.getElementById('salesMethodTmBtn');
      const btnCk = document.getElementById('salesMethodCkBtn');

      if (btnAll) btnAll.classList.toggle('active', method === 'ALL');
      if (btnTm) btnTm.classList.toggle('active', method === 'Tiền Mặt');
      if (btnCk) btnCk.classList.toggle('active', method === 'Chuyển Tiền' || method === 'Chuyển Khoản');
      renderSalesTable(salesDatabase);
    }

    // Hàm kiểm tra xem đơn bán hàng có thiếu 1 trong 3 thông tin bắt buộc: Tên phụ kiện, Giá bán, Giá nhập
    function isMissingRequiredSalesInfo(name, totalVal, priceInVal) {
      let cleanName = (name || '').replace(/\s*\(x\d+\)/gi, '').trim();
      let hasName = (cleanName !== '' && cleanName !== 'Chưa nhập tên phụ kiện' && cleanName !== 'Chưa nhập tên');
      let pOut = parsePriceNum(totalVal);
      let pIn = parsePriceNum(priceInVal);
      let hasPriceOut = (pOut > 0);
      let hasPriceIn = (pIn > 0);
      return (!hasName || !hasPriceOut || !hasPriceIn);
    }
    window.isMissingRequiredSalesInfo = isMissingRequiredSalesInfo;

    function renderSalesTable(items) {
      if (typeof updateSalesLunarAndDayDisplay === 'function') {
        updateSalesLunarAndDayDisplay(currentSalesDateFilter);
      }
      const tbody = document.getElementById('salesTableBody');
      const searchInputVal = document.querySelector('#tab-banhang .search-sales-input').value.trim().toLowerCase();

      let filtered = items.filter(i => {
        let parts = i.dateTime.split(' - ');
        if (parts.length < 2) return false;
        let datePart = parts[1].trim();

        let matchTime = false;
        if (salesViewMode === 'day') {
          const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
          const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
          const yyyy = currentSalesDateFilter.getFullYear();
          let targetDateStr = `${dd}/${mm}/${yyyy}`;
          matchTime = (datePart === targetDateStr);
        } else if (salesViewMode === 'month') {
          let datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            let m = parseInt(datePieces[1], 10) - 1;
            let y = parseInt(datePieces[2], 10);
            matchTime = (m === currentSalesMonthFilter.month && y === currentSalesMonthFilter.year);
          }
        } else if (salesViewMode === 'year') {
          let datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            let y = parseInt(datePieces[2], 10);
            matchTime = (y === currentSalesYearFilter);
          }
        } else {
          matchTime = true;
        }

        if (!matchTime) return false;

        // Lọc theo hình thức thanh toán: Tiền Mặt / Chuyển Tiền / Tất Cả
        if (currentSalesPaymentFilter !== 'ALL') {
          let methodStr = (i.method || '').toLowerCase().trim();
          let isTm = (methodStr === 'tiền mặt' || methodStr === 'tm');
          let isCk = (methodStr === 'chuyển khoản' || methodStr === 'ck' || methodStr === 'chuyển tiền');

          if (currentSalesPaymentFilter === 'Tiền Mặt') {
            if (!isTm) return false;
          } else if (currentSalesPaymentFilter === 'Chuyển Tiền' || currentSalesPaymentFilter === 'Chuyển Khoản') {
            if (!isCk) return false;
          }
        }

        if (searchInputVal) {
          let mainName = (i.name || '').toLowerCase();
          let custName = (i.customer || '').toLowerCase();
          return mainName.includes(searchInputVal) || custName.includes(searchInputVal);
        }

        return true;
      });

      // Sắp xếp filtered theo thời gian mới nhất lên đầu
      filtered.sort((a, b) => {
        let getTs = (dtStr) => {
          if (!dtStr) return 0;
          let parts = String(dtStr).split(' - ');
          if (parts.length >= 2) {
            let [hh, min] = parts[0].split(':').map(n => parseInt(n, 10) || 0);
            let [d, m, y] = parts[1].split('/').map(n => parseInt(n, 10) || 0);
            return new Date(y, m - 1, d, hh, min).getTime();
          }
          let t = new Date(dtStr).getTime();
          return isNaN(t) ? 0 : t;
        };
        return getTs(b.dateTime) - getTs(a.dateTime);
      });

      let totalRevenue = 0;
      let totalCost = 0;
      let salesProfit = 0;
      let tmTotal = 0, ckTotal = 0, debtTotal = 0;

      filtered.forEach(i => {
        let tNum = parsePriceNum(i.total);
        let cNum = parsePriceNum(i.priceIn);
        let pNum = parsePriceNum(i.profit);
        totalRevenue += tNum;
        totalCost += cNum;
        salesProfit += pNum;

        let isDebt = (i.paymentStatus === 'Nợ Dai VL' || i.paymentStatus === 'NỢ DAI VL' || i.paymentStatus === 'Nợ' || i.paymentStatus === 'nợ' || i.method === 'Nợ' || i.method === 'nợ');
        if (isDebt) {
          debtTotal += tNum;
        } else {
          let m = (i.method || '').toLowerCase().trim();
          if (m.includes('tiền mặt') || m === 'tm') {
            tmTotal += tNum;
          } else {
            ckTotal += tNum;
          }
        }
      });

      // 1. Xác định ngày và tháng mục tiêu đang chọn trong tab Bán Hàng
      const ddStr = String(currentSalesDateFilter.getDate()).padStart(2, '0');
      const mmStr = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyyStr = currentSalesDateFilter.getFullYear();
      const targetDateStr = `${ddStr}/${mmStr}/${yyyyStr}`;

      let targetMonth, targetYear;
      if (salesViewMode === 'day') {
        targetMonth = currentSalesDateFilter.getMonth();
        targetYear = currentSalesDateFilter.getFullYear();
      } else {
        targetMonth = currentSalesMonthFilter.month;
        targetYear = currentSalesMonthFilter.year;
      }

      // Lấy danh sách sửa chữa an toàn
      let repairsList = [];
      try {
        if (typeof repairDatabase !== 'undefined' && Array.isArray(repairDatabase)) {
          repairsList = repairDatabase;
        } else {
          const savedRep = localStorage.getItem('KIMCHI_REPAIR_DB');
          repairsList = savedRep ? JSON.parse(savedRep) : [];
        }
      } catch (e) {
        repairsList = [];
      }

      // 2. Tính LÃI NGÀY & DOANH THU NGÀY = Lãi bán hàng + Lãi bán máy + Lãi bán gà + Lãi sửa chữa (trong 1 ngày đang chọn)
      let daySalesProfit = 0;
      let daySalesRevenue = 0;
      if (Array.isArray(salesDatabase)) {
        salesDatabase.forEach(item => {
          if (!item.dateTime) return;
          let parts = item.dateTime.split(' - ');
          if (parts.length >= 2 && parts[1].trim() === targetDateStr) {
            daySalesProfit += parsePriceNum(item.profit);
            daySalesRevenue += parsePriceNum(item.total);
          }
        });
      }

      let dayRepairProfit = 0;
      let dayRepairRevenue = 0;
      if (Array.isArray(repairsList)) {
        repairsList.forEach(item => {
          let dateStr = item.dateFormatted || '';
          if (dateStr.trim() === targetDateStr) {
            dayRepairProfit += parsePriceNum(item.profit);
            dayRepairRevenue += parsePriceNum(item.price);
          }
        });
      }

      let dayBangaProfit = 0;
      let dayBangaRevenue = 0;
      if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
        bangaDatabase.forEach(bg => {
          if (!bg.dateTime) return;
          let parts = bg.dateTime.split(' - ');
          if (parts.length >= 2 && parts[1].trim() === targetDateStr) {
            dayBangaProfit += parsePriceNum(bg.profit);
            dayBangaRevenue += parsePriceNum(bg.total);
          }
        });
      }

      // 3. Tính LÃI THÁNG & DOANH THU THÁNG = Bán hàng + Bán gà + Sửa chữa
      let monthSalesProfit = 0;
      let monthSalesRevenue = 0;
      if (Array.isArray(salesDatabase)) {
        salesDatabase.forEach(item => {
          if (!item.dateTime) return;
          let parts = item.dateTime.split(' - ');
          if (parts.length >= 2) {
            let dp = parts[1].trim().split('/');
            if (dp.length === 3) {
              let m = parseInt(dp[1], 10) - 1;
              let y = parseInt(dp[2], 10);
              if (m === targetMonth && y === targetYear) {
                monthSalesProfit += parsePriceNum(item.profit);
                monthSalesRevenue += parsePriceNum(item.total);
              }
            }
          }
        });
      }

      let monthRepairProfit = 0;
      let monthRepairRevenue = 0;
      if (Array.isArray(repairsList)) {
        repairsList.forEach(item => {
          let dateStr = item.dateFormatted || '';
          if (dateStr) {
            let dp = dateStr.trim().split('/');
            if (dp.length === 3) {
              let m = parseInt(dp[1], 10) - 1;
              let y = parseInt(dp[2], 10);
              if (m === targetMonth && y === targetYear) {
                monthRepairProfit += parsePriceNum(item.profit);
                monthRepairRevenue += parsePriceNum(item.price);
              }
            }
          }
        });
      }

      let monthBangaProfit = 0;
      let monthBangaRevenue = 0;
      if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
        bangaDatabase.forEach(bg => {
          if (!bg.dateTime) return;
          let parts = bg.dateTime.split(' - ');
          if (parts.length >= 2) {
            let dp = parts[1].trim().split('/');
            if (dp.length === 3) {
              let m = parseInt(dp[1], 10) - 1;
              let y = parseInt(dp[2], 10);
              if (m === targetMonth && y === targetYear) {
                monthBangaProfit += parsePriceNum(bg.profit);
                monthBangaRevenue += parsePriceNum(bg.total);
              }
            }
          }
        });
      }

      let daySoftwareProfit = 0;
      let daySoftwareRevenue = 0;
      let monthSoftwareProfit = 0;
      let monthSoftwareRevenue = 0;
      if (typeof softwareDatabase !== 'undefined' && Array.isArray(softwareDatabase)) {
        softwareDatabase.forEach(item => {
          let prof = parsePriceNum(item.profit) || 0;
          let rev = parsePriceNum(item.price) || 0;
          let itemYear = parseInt(item.year || targetYear, 10);
          let itemParts = (item.dayMonth || '').replace(/\//g, '-').split('-');
          if (itemParts.length === 2) {
            let d = parseInt(itemParts[0], 10);
            let m = parseInt(itemParts[1], 10) - 1;
            if (m === targetMonth && itemYear === targetYear) {
              monthSoftwareProfit += prof;
              monthSoftwareRevenue += rev;
              if (d === currentSalesDateFilter.getDate()) {
                daySoftwareProfit += prof;
                daySoftwareRevenue += rev;
              }
            }
          }
        });
      }

      // ============================================================
      // CÔNG THỨC CHUẨN XÁC THEO YÊU CẦU:
      // 1. Ô DOANH THU BÁN HÀNG (trên nút Danh sách bán hàng):
      //    - Doanh thu ngày = Tổng giá bán của tab Bán Hàng trong 1 ngày (daySalesRevenue)
      //    - Doanh thu tháng = Tổng giá bán của tab Bán Hàng trong 1 tháng (monthSalesRevenue)
      //
      // 2. Ô LÃI BÁN HÀNG (trên nút Tạo phiếu mới):
      //    - Lãi ngày = Lãi của riêng tab Bán Hàng trong 1 ngày (daySalesProfit)
      //    - Lãi tháng = Lãi của riêng tab Bán Hàng trong 1 tháng (monthSalesProfit)
      //
      // 3. CỤM LÃI ĐĂNG XUẤT (ở góc dưới sidebar):
      //    - Lãi ngày = Lãi của (Bán hàng + Sửa chữa + Bán gà + Phần mềm) trong 1 ngày
      //    - Lãi tháng = Lãi của (Bán hàng + Sửa chữa + Bán gà + Phần mềm) trong 1 tháng
      // ============================================================

      // 1. Cập nhật Ô DOANH THU BÁN HÀNG
      const salesMonthRevenueEl = document.getElementById('salesMonthRevenueVal');
      if (salesMonthRevenueEl) {
        salesMonthRevenueEl.innerText = isSalesSensitiveHidden ? '***' : formatPriceStr(monthSalesRevenue);
        salesMonthRevenueEl.title = `Doanh thu Tháng Bán Hàng (${formatPriceStr(monthSalesRevenue)})`;
      }

      const salesDayRevenueEl = document.getElementById('salesDayRevenueVal');
      if (salesDayRevenueEl) {
        salesDayRevenueEl.innerText = isSalesSensitiveHidden ? '***' : formatPriceStr(daySalesRevenue);
        salesDayRevenueEl.title = `Doanh thu Ngày Bán Hàng (${formatPriceStr(daySalesRevenue)})`;
      }

      const salesDoanhThuEl = document.getElementById('salesDoanhThuVal');
      if (salesDoanhThuEl) {
        salesDoanhThuEl.innerText = isSalesSensitiveHidden ? '***' : formatPriceStr(totalRevenue);
      }

      // 2. Cập nhật Ô LÃI BÁN HÀNG (CHỈ TÍNH RIÊNG TAB BÁN HÀNG)
      const salesMonthProfitEl = document.getElementById('salesMonthProfitVal');
      if (salesMonthProfitEl) {
        salesMonthProfitEl.innerText = isSalesSensitiveHidden ? '***' : formatPriceStr(monthSalesProfit);
        salesMonthProfitEl.title = `Lãi Tháng Bán Hàng (${formatPriceStr(monthSalesProfit)})`;
      }

      const salesDayProfitEl = document.getElementById('salesDayProfitVal') || document.getElementById('salesLaiVal');
      if (salesDayProfitEl) {
        salesDayProfitEl.innerText = isSalesSensitiveHidden ? '***' : formatPriceStr(daySalesProfit);
        salesDayProfitEl.title = `Lãi Ngày Bán Hàng (${formatPriceStr(daySalesProfit)})`;
      }

      // CẬP NHẬT ICON LÃI NGÀY BÁN HÀNG: 0 - 999 MẶT KHÓC, >= 1000 MẶT CƯỜI
      const salesProfitEmojiEl = document.getElementById('salesProfitEmojiIcon');
      if (salesProfitEmojiEl) {
        let dayProfitVal = parsePriceNum(daySalesProfit);
        if (dayProfitVal >= 1000) {
          salesProfitEmojiEl.src = 'img/icon_happy.png';
          salesProfitEmojiEl.title = 'Lãi ngày bán hàng: ' + formatPriceStr(daySalesProfit) + ' (Đạt từ 1.000 trở lên)';
        } else {
          salesProfitEmojiEl.src = 'img/icon_crying.png';
          salesProfitEmojiEl.title = 'Lãi ngày bán hàng: ' + formatPriceStr(daySalesProfit) + ' (Từ 0 - 999)';
        }
      }

      const salesCountEl = document.getElementById('salesCountText');
      if (salesCountEl) {
        if (isSalesSensitiveHidden) {
          salesCountEl.innerHTML = `Đã Bán : ${filtered.length} &nbsp;&nbsp;-&nbsp;&nbsp; Tổng : <span style="color: #ef4444; font-weight: 800;">***</span> &nbsp;&nbsp;-&nbsp;&nbsp; Vốn : <span style="color: #ffffff; font-weight: 800;">***</span> &nbsp;&nbsp;=&nbsp;&nbsp; Lãi : <span style="color: #eab308; font-weight: 800;">***</span>`;
        } else {
          salesCountEl.innerHTML = `Đã Bán : ${filtered.length} &nbsp;&nbsp;-&nbsp;&nbsp; Tổng : <span style="color: #ef4444; font-weight: 800;">${formatPriceStr(totalRevenue)}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Vốn : <span style="color: #ffffff; font-weight: 800;">${formatPriceStr(totalCost)}</span> &nbsp;&nbsp;=&nbsp;&nbsp; Lãi : <span style="color: #eab308; font-weight: 800;">${formatPriceStr(salesProfit)}</span>`;
        }
      }

      const salesSummaryEl = document.getElementById('salesSummaryStats');
      if (salesSummaryEl) {
        if (isSalesSensitiveHidden) {
          salesSummaryEl.innerHTML = `Tiền Mặt = <span style="color: #10b981; font-weight: 800;">***</span> &nbsp;&nbsp;-&nbsp;&nbsp; Chuyển Tiền = <span style="color: #ef4444; font-weight: 800;">***</span> &nbsp;&nbsp;,&nbsp;&nbsp; Nợ = <span style="color: #eab308; font-weight: 800;">***</span>`;
        } else {
          salesSummaryEl.innerHTML = `Tiền Mặt = <span style="color: #10b981; font-weight: 800;">${formatPriceStr(tmTotal)}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Chuyển Tiền = <span style="color: #ef4444; font-weight: 800;">${formatPriceStr(ckTotal)}</span> &nbsp;&nbsp;,&nbsp;&nbsp; Nợ = <span style="color: #eab308; font-weight: 800;">${formatPriceStr(debtTotal)}</span>`;
        }
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-sub);">Không có phiếu bán hàng nào phù hợp</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        let isCash = (item.method === 'Tiền mặt' || item.method === 'Tiền Mặt');
        let methodColor = isCash ? '#10b981' : '#f87171';
        let rawName = (item.name || '').replace(/\s*\(x1\)/gi, '').trim();
        let displayName = formatSalesShortDeviceName(rawName, item);
        displayName = formatBrandDeviceName(displayName);

        // Kiểm tra xem đơn này có thiếu 1 trong 3 thông tin bắt buộc: Tên phụ kiện, Giá bán khác 0, Giá nhập khác 0
        let isMissing = isMissingRequiredSalesInfo(item.name || item.accessory, item.total, item.priceIn);
        let trClass = isMissing ? ' class="row-missing-info-blink"' : '';
        let tdClass = isMissing ? ' class="cell-missing-blink"' : '';
        let missingTitle = isMissing ? ' title="⚠️ Phiếu này còn thiếu thông tin bắt buộc (Tên phụ kiện, Giá bán khác 0 hoặc Giá nhập khác 0). Bấm Sửa để bổ sung!"' : '';

        // Khi thiếu thông tin bắt buộc: Toàn bộ hàng ngang tô màu vàng nhạt và phát sáng hào quang như menu
        let nameColorStyle = isMissing ? 'color: #ffffff !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8);' : '';
        let totalColor = isMissing ? '#ffffff' : '#f87171';
        let priceInColor = isMissing ? '#ffffff' : '#ffffff';
        let profitColor = isMissing ? '#ffffff' : '#eab308';
        let methodColorVal = isMissing ? '#ffffff' : methodColor;
        let dateTimeColor = isMissing ? '#ffffff' : '#ffffff';

        let displayTotal = formatPriceStr(item.total);
        let displayPriceIn = formatPriceStr(item.priceIn || '0');
        let displayProfit = formatPriceStr(item.profit || '0');
        let displayMethod = 'Tiền Mặt 😊';
        if (item.method === 'Chuyển khoản' || item.method === 'Chuyển Khoản' || (item.method && item.method.toLowerCase().includes('chuyển'))) {
          displayMethod = 'Chuyển Tiền';
        } else if (item.method === 'Nợ' || item.method === 'nợ') {
          displayMethod = 'Nợ';
        }

        return `
          <tr${trClass}${missingTitle} ondblclick="editSale(${item.id})" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<350){ editSale(${item.id}); } this._lastTap=now;" style="cursor: pointer;" title="Nháy 2 lần để xem chi tiết phiếu">
            <td${tdClass} class="sales-td-name" style="font-weight: 800; font-size: 1.386rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ${nameColorStyle}">${displayName}</td>
            <td${tdClass} class="sales-td-price" style="text-align: center; vertical-align: middle;">
              <span class="sales-price-badge" style="display: inline-block; background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); color: #ffffff !important; font-weight: 900; font-size: 1.232rem; padding: 2px 8px; border-radius: 6px; border: 1px solid #fcd34d; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.45); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); letter-spacing: 0.5px;">${displayTotal}</span>
            </td>
            <td${tdClass} class="sales-td-cost" style="color: ${priceInColor} !important; font-weight: 900; font-size: 1.239rem; text-align: center;">${isSalesSensitiveHidden ? '***' : displayPriceIn}</td>
            <td${tdClass} class="sales-td-profit" style="font-weight: 900; color: ${profitColor} !important; font-size: 1.239rem; text-align: center;">${isSalesSensitiveHidden ? '***' : displayProfit}</td>
            <td${tdClass} style="text-align: center;"><span style="font-weight: 800; font-size: 1.1rem; color: ${methodColorVal} !important; cursor: default; user-select: none;">${displayMethod}</span></td>
            <td${tdClass} style="text-align: center;">
              <div class="action-btn-group" style="justify-content: center;">
                <button type="button" class="action-btn-icon action-btn-view" onclick="viewSale(${item.id})" title="Xem chi tiết">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-edit" onclick="editSale(${item.id})" title="Sửa đơn">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-del" onclick="deleteSale(${item.id})" title="Xóa đơn">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
            <td${tdClass} style="color: ${dateTimeColor} !important; font-weight: 700; font-size: 1.1025rem; text-align: center;">${item.dateTime}</td>
            <td${tdClass} style="text-align: center;">
              <span class="${(item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') ? 'badge-payment-debt' : 'badge-payment-paid'}" style="cursor: default; user-select: none; ${(item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') ? '' : 'color: #ffffff !important;'}">
                ${(item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') ? '💀 NỢ DAI VL' : '✔ ĐÃ TRẢ <span style="font-size: 0.86rem; margin-left: 2px;">💰</span>'}
              </span>
            </td>
          </tr>
        `;
      }).join('');

      updateSidebarOverallProfits();
    }

    /* ============================================================
       CẬP NHẬT TỔNG LÃI THÁNG & LÃI NGÀY Ở NÚT DƯỚI CÙNG SIDEBAR (DESKTOP)
       - Lãi tháng = Lãi bán hàng + Lãi sửa chữa + Lãi bán máy + Lãi bán gà trong tháng
       - Lãi ngày = Lãi bán hàng + Lãi sửa chữa + Lãi bán máy + Lãi bán gà trong ngày
       - Chỉ hiển thị số, không kèm chữ
       ============================================================ */
    function updateSidebarOverallProfits() {
      const monthEl = document.getElementById('sidebarTotalMonthProfitVal');
      const dayEl = document.getElementById('sidebarTotalDayProfitVal');
      if (!monthEl && !dayEl) return;

      // Xác định ngày và tháng mục tiêu:
      // Ưu tiên ngày đang xem trên giao diện Bán Hàng (nếu có), fallback là ngày hiện tại Việt Nam
      let targetD, targetM, targetY;
      if (typeof currentSalesDateFilter !== 'undefined' && currentSalesDateFilter instanceof Date && !isNaN(currentSalesDateFilter.getTime())) {
        targetD = currentSalesDateFilter.getDate();
        targetM = currentSalesDateFilter.getMonth();
        targetY = currentSalesDateFilter.getFullYear();
      } else {
        const vnNow = getVietnamDate();
        targetD = vnNow.getDate();
        targetM = vnNow.getMonth();
        targetY = vnNow.getFullYear();
      }

      let totalMonth = 0;
      let totalDay = 0;

      // Helper bóc tách ngày, tháng, năm từ chuỗi bất kỳ ("DD/MM/YYYY", "HH:mm - DD/MM/YYYY", "DD-MM-YYYY", v.v.)
      function parseItemDMY(dateRaw) {
        if (!dateRaw) return null;
        let s = String(dateRaw).trim();
        let parts = s.split(' - ');
        let dStr = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
        let match = dStr.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/);
        if (match) {
          let d = parseInt(match[1], 10);
          let m = parseInt(match[2], 10) - 1;
          let y = match[3] ? parseInt(match[3], 10) : targetY;
          return { d, m, y };
        }
        return null;
      }

      // 1. BÁN HÀNG (salesDatabase)
      if (Array.isArray(salesDatabase)) {
        salesDatabase.forEach(item => {
          let prof = parsePriceNum(item.profit || 0);
          let dmy = parseItemDMY(item.dateTime);
          if (dmy) {
            if (dmy.m === targetM && dmy.y === targetY) {
              totalMonth += prof;
              if (dmy.d === targetD) {
                totalDay += prof;
              }
            }
          }
        });
      }

      // 2. SỬA CHỮA (repairDatabase)
      let rList = [];
      try {
        if (typeof repairDatabase !== 'undefined' && Array.isArray(repairDatabase)) {
          rList = repairDatabase;
        } else {
          const savedRep = localStorage.getItem('KIMCHI_REPAIR_DB');
          rList = savedRep ? JSON.parse(savedRep) : [];
        }
      } catch (e) {
        rList = [];
      }
      if (Array.isArray(rList)) {
        rList.forEach(item => {
          let prof = parsePriceNum(item.profit || 0);
          let dmy = parseItemDMY(item.dateFormatted || item.dateTime);
          if (dmy) {
            if (dmy.m === targetM && dmy.y === targetY) {
              totalMonth += prof;
              if (dmy.d === targetD) {
                totalDay += prof;
              }
            }
          }
        });
      }

      // 3. BÁN GÀ (bangaDatabase)
      if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
        bangaDatabase.forEach(bg => {
          let prof = parsePriceNum(bg.profit || 0);
          let dmy = parseItemDMY(bg.dateTime);
          if (dmy) {
            if (dmy.m === targetM && dmy.y === targetY) {
              totalMonth += prof;
              if (dmy.d === targetD) {
                totalDay += prof;
              }
            }
          }
        });
      }

      // 4. PHẦN MỀM (softwareDatabase)
      if (typeof softwareDatabase !== 'undefined' && Array.isArray(softwareDatabase)) {
        softwareDatabase.forEach(item => {
          let prof = parsePriceNum(item.profit || 0);
          let itemYear = parseInt(item.year || targetY, 10);
          let rawDM = item.dayMonth || '';
          let dmy = parseItemDMY(rawDM + (item.year ? `-${item.year}` : `-${targetY}`));
          if (dmy) {
            if (dmy.m === targetM && itemYear === targetY) {
              totalMonth += prof;
              if (dmy.d === targetD) {
                totalDay += prof;
              }
            }
          }
        });
      }

      if (monthEl) {
        monthEl.innerText = formatPriceStr(totalMonth);
        monthEl.title = `Lãi Tháng = Bán Hàng + Sửa Chữa + Phần Mềm + Bán Gà (${formatPriceStr(totalMonth)})`;
      }
      if (dayEl) {
        dayEl.innerText = formatPriceStr(totalDay);
        dayEl.title = `Lãi Ngày = Bán Hàng + Sửa Chữa + Phần Mềm + Bán Gà (${formatPriceStr(totalDay)})`;
      }

      // Tự động cập nhật bảng số liệu thống kê mobile nếu modal đang mở
      const statsModal = document.getElementById('mobileRevenueStatsModal');
      if (statsModal && statsModal.style.display === 'flex') {
        renderMobileRevenueStats();
      }
    }
    window.updateSidebarOverallProfits = updateSidebarOverallProfits;

    // ==================== BẢNG SỐ LIỆU / BẢNG THEO DÕI DOANH THU TRÊN MOBILE & WEB/DESKTOP ====================
    let currentMobileStatsMode = 'day'; // 'day' (Ngày), 'month' (Tháng), 'all' (Tất Cả)
    window.currentMobileStatsMode = currentMobileStatsMode;

    let mStatsSelectedDate = null;  // Date object riêng cho modal Doanh Thu (Ngày/Tháng/Năm)
    let mStatsSelectedMonth = null; // { month: 0-11, year: YYYY }

    function initMobileStatsDates() {
      if (!mStatsSelectedDate || isNaN(mStatsSelectedDate.getTime())) {
        if (typeof currentSalesDateFilter !== 'undefined' && currentSalesDateFilter instanceof Date && !isNaN(currentSalesDateFilter.getTime())) {
          mStatsSelectedDate = new Date(currentSalesDateFilter.getTime());
        } else {
          const vnNow = getVietnamDate();
          mStatsSelectedDate = new Date(vnNow.getFullYear(), vnNow.getMonth(), vnNow.getDate());
        }
      }
      if (!mStatsSelectedMonth || typeof mStatsSelectedMonth.month !== 'number') {
        if (typeof currentSalesMonthFilter !== 'undefined' && currentSalesMonthFilter && typeof currentSalesMonthFilter.month === 'number') {
          mStatsSelectedMonth = { month: currentSalesMonthFilter.month, year: currentSalesMonthFilter.year };
        } else {
          const vnNow = getVietnamDate();
          mStatsSelectedMonth = { month: vnNow.getMonth(), year: vnNow.getFullYear() };
        }
      }
    }

    function setMobileStatsMode(mode) {
      currentMobileStatsMode = mode || 'day';
      window.currentMobileStatsMode = currentMobileStatsMode;
      const selectEl = document.getElementById('mStatsPeriodSelect');
      if (selectEl && selectEl.value !== currentMobileStatsMode) {
        selectEl.value = currentMobileStatsMode;
      }
      renderMobileRevenueStats();
    }
    window.setMobileStatsMode = setMobileStatsMode;

    function changeMobileStatsDate(delta) {
      initMobileStatsDates();
      mStatsSelectedDate.setDate(mStatsSelectedDate.getDate() + delta);
      // Cập nhật cả tháng tương ứng
      mStatsSelectedMonth = { month: mStatsSelectedDate.getMonth(), year: mStatsSelectedDate.getFullYear() };
      renderMobileRevenueStats();
    }
    window.changeMobileStatsDate = changeMobileStatsDate;

    function changeMobileStatsMonth(delta) {
      initMobileStatsDates();
      mStatsSelectedMonth.month += delta;
      if (mStatsSelectedMonth.month > 11) {
        mStatsSelectedMonth.month = 0;
        mStatsSelectedMonth.year++;
      } else if (mStatsSelectedMonth.month < 0) {
        mStatsSelectedMonth.month = 11;
        mStatsSelectedMonth.year--;
      }
      mStatsSelectedDate = new Date(mStatsSelectedMonth.year, mStatsSelectedMonth.month, 1);
      renderMobileRevenueStats();
    }
    window.changeMobileStatsMonth = changeMobileStatsMonth;

    function resetMobileStatsToCurrentDate() {
      const vnNow = (typeof getVietnamDate === 'function') ? getVietnamDate() : new Date();
      mStatsSelectedDate = new Date(vnNow.getFullYear(), vnNow.getMonth(), vnNow.getDate());
      mStatsSelectedMonth = { month: vnNow.getMonth(), year: vnNow.getFullYear() };
      currentMobileStatsMode = 'day';
      window.currentMobileStatsMode = 'day';
      const selectEl = document.getElementById('mStatsPeriodSelect');
      if (selectEl) selectEl.value = 'day';
      renderMobileRevenueStats();
    }
    window.resetMobileStatsToCurrentDate = resetMobileStatsToCurrentDate;

    function openMobileStatsNativeDatePicker() {
      const picker = document.getElementById('mStatsNativeDatePicker');
      if (!picker) return;
      initMobileStatsDates();
      const y = mStatsSelectedDate.getFullYear();
      const m = String(mStatsSelectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(mStatsSelectedDate.getDate()).padStart(2, '0');
      picker.value = `${y}-${m}-${d}`;
      if (typeof picker.showPicker === 'function') {
        try { picker.showPicker(); return; } catch(err){}
      }
      picker.click();
    }
    window.openMobileStatsNativeDatePicker = openMobileStatsNativeDatePicker;

    function handleMobileStatsNativeDate(dateVal) {
      if (!dateVal) return;
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        mStatsSelectedDate = new Date(y, m, d);
        mStatsSelectedMonth = { month: m, year: y };
        renderMobileRevenueStats();
      }
    }
    window.handleMobileStatsNativeDate = handleMobileStatsNativeDate;

    function renderMobileRevenueStats() {
      initMobileStatsDates();

      const mode = currentMobileStatsMode || 'day';

      const targetD = mStatsSelectedDate.getDate();
      const targetM = (mode === 'month') ? mStatsSelectedMonth.month : mStatsSelectedDate.getMonth();
      const targetY = (mode === 'month') ? mStatsSelectedMonth.year : mStatsSelectedDate.getFullYear();

      const dd = String(targetD).padStart(2, '0');
      const mm = String(targetM + 1).padStart(2, '0');
      const yyyy = targetY;

      // Cập nhật nhãn tiêu đề và bộ điều khiển
      const titleLabelEl = document.getElementById('mStatsCurrentPeriodLabel');
      const dateNavBox = document.getElementById('mStatsDateNavBox');
      const dateNavLabel = document.getElementById('mStatsDateNavLabel');
      const monthNavBox = document.getElementById('mStatsMonthNavBox');
      const monthNavLabel = document.getElementById('mStatsMonthNavLabel');

      if (mode === 'day') {
        if (titleLabelEl) titleLabelEl.innerHTML = `📅 Ngày: ${dd}/${mm}/${yyyy}`;
        if (dateNavBox) dateNavBox.style.display = 'inline-flex';
        if (dateNavLabel) dateNavLabel.innerText = `${dd}/${mm}/${yyyy}`;
        if (monthNavBox) monthNavBox.style.display = 'none';
      } else if (mode === 'month') {
        if (titleLabelEl) titleLabelEl.innerHTML = `📆 Tháng: ${mm}/${yyyy}`;
        if (dateNavBox) dateNavBox.style.display = 'none';
        if (monthNavBox) monthNavBox.style.display = 'inline-flex';
        if (monthNavLabel) monthNavLabel.innerText = `Tháng ${mm}/${yyyy}`;
      } else {
        if (titleLabelEl) titleLabelEl.innerHTML = `📊 Toàn Bộ Thời Gian`;
        if (dateNavBox) dateNavBox.style.display = 'none';
        if (monthNavBox) monthNavBox.style.display = 'none';
      }

      function isItemMatchPeriod(dmy) {
        if (!dmy) return false;
        if (mode === 'all') return true;
        if (mode === 'month') {
          return dmy.m === targetM && dmy.y === targetY;
        }
        // mode === 'day'
        return dmy.d === targetD && dmy.m === targetM && dmy.y === targetY;
      }

      function parseItemDMY(dateRaw) {
        if (!dateRaw) return null;
        let s = String(dateRaw).trim();
        let parts = s.split(' - ');
        let dStr = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
        let match = dStr.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{4}))?/);
        if (match) {
          let d = parseInt(match[1], 10);
          let m = parseInt(match[2], 10) - 1;
          let y = match[3] ? parseInt(match[3], 10) : targetY;
          return { d, m, y };
        }
        return null;
      }

      let countBanhang = 0, profitBanhang = 0;
      let countSuachua = 0, profitSuachua = 0;
      let countBanga = 0, profitBanga = 0;
      let countPhanmem = 0, profitPhanmem = 0;

      // 1. Bán Hàng
      if (typeof salesDatabase !== 'undefined' && Array.isArray(salesDatabase)) {
        salesDatabase.forEach(item => {
          let dmy = parseItemDMY(item.dateTime);
          if (isItemMatchPeriod(dmy)) {
            countBanhang++;
            profitBanhang += parsePriceNum(item.profit || 0);
          }
        });
      }

      // 2. Sửa Chữa
      let rList = [];
      try {
        if (typeof repairDatabase !== 'undefined' && Array.isArray(repairDatabase)) {
          rList = repairDatabase;
        } else {
          const savedRep = localStorage.getItem('KIMCHI_REPAIR_DB');
          rList = savedRep ? JSON.parse(savedRep) : [];
        }
      } catch (e) {
        rList = [];
      }
      if (Array.isArray(rList)) {
        rList.forEach(item => {
          let dmy = parseItemDMY(item.dateFormatted || item.dateTime);
          if (isItemMatchPeriod(dmy)) {
            countSuachua++;
            profitSuachua += parsePriceNum(item.profit || 0);
          }
        });
      }

      // 3. Bán Gà
      if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
        bangaDatabase.forEach(bg => {
          let dmy = parseItemDMY(bg.dateTime);
          if (isItemMatchPeriod(dmy)) {
            countBanga++;
            profitBanga += parsePriceNum(bg.profit || 0);
          }
        });
      }

      // 4. Phần Mềm
      if (typeof softwareDatabase !== 'undefined' && Array.isArray(softwareDatabase)) {
        softwareDatabase.forEach(item => {
          let itemYear = parseInt(item.year || targetY, 10);
          let rawDM = item.dayMonth || '';
          let dmy = parseItemDMY(rawDM + (item.year ? `-${item.year}` : `-${targetY}`));
          if (mode === 'all') {
            countPhanmem++;
            profitPhanmem += parsePriceNum(item.profit || 0);
          } else if (mode === 'month') {
            if (dmy && dmy.m === targetM && itemYear === targetY) {
              countPhanmem++;
              profitPhanmem += parsePriceNum(item.profit || 0);
            }
          } else {
            // mode === 'day'
            if (dmy && dmy.d === targetD && dmy.m === targetM && itemYear === targetY) {
              countPhanmem++;
              profitPhanmem += parsePriceNum(item.profit || 0);
            }
          }
        });
      }

      const totalProfit = profitBanhang + profitSuachua + profitBanga + profitPhanmem;

      const elCountBanhang = document.getElementById('mStatsCountBanhang');
      const elProfitBanhang = document.getElementById('mStatsProfitBanhang');
      const elCountSuachua = document.getElementById('mStatsCountSuachua');
      const elProfitSuachua = document.getElementById('mStatsProfitSuachua');
      const elCountBanga = document.getElementById('mStatsCountBanga');
      const elProfitBanga = document.getElementById('mStatsProfitBanga');
      const elCountPhanmem = document.getElementById('mStatsCountPhanmem');
      const elProfitPhanmem = document.getElementById('mStatsProfitPhanmem');
      const elTotalProfit = document.getElementById('mStatsTotalProfit');
      const elTargetStatus = document.getElementById('mStatsTargetStatus');
      const elTargetLabelVal = document.getElementById('mStatsTargetLabelVal');

      if (elCountBanhang) elCountBanhang.textContent = countBanhang;
      if (elProfitBanhang) elProfitBanhang.textContent = formatPriceStr(profitBanhang);
      if (elCountSuachua) elCountSuachua.textContent = countSuachua;
      if (elProfitSuachua) elProfitSuachua.textContent = formatPriceStr(profitSuachua);
      if (elCountBanga) elCountBanga.textContent = countBanga;
      if (elProfitBanga) elProfitBanga.textContent = formatPriceStr(profitBanga);
      if (elCountPhanmem) elCountPhanmem.textContent = countPhanmem;
      if (elProfitPhanmem) elProfitPhanmem.textContent = formatPriceStr(profitPhanmem);
      if (elTotalProfit) elTotalProfit.textContent = formatPriceStr(totalProfit);

      // Đánh giá chỉ tiêu: ngày (2.500K), tháng (75.000K), tất cả (75.000K)
      let targetK = 2500;
      if (mode === 'month') targetK = 75000;
      else if (mode === 'all') targetK = 75000;

      if (elTargetLabelVal) {
        elTargetLabelVal.textContent = mode === 'month' ? '75.000K' : (mode === 'all' ? 'TỔNG' : '2.500K');
      }

      if (elTargetStatus) {
        const thresholdVal = targetK >= 1000 ? targetK : targetK;
        const isTargetReached = totalProfit >= thresholdVal * 1000 || (totalProfit >= thresholdVal && totalProfit < 1000000);
        if (isTargetReached) {
          elTargetStatus.textContent = 'XUẤT SẮC (Cần Phát Huy)';
          elTargetStatus.style.color = '#10b981';
        } else {
          elTargetStatus.textContent = 'CHƯA ĐẠT (Cần Cố Gắng)';
          elTargetStatus.style.color = '#ef4444';
        }
      }
    }
    window.renderMobileRevenueStats = renderMobileRevenueStats;

    function openMobileRevenueStatsModal() {
      const modal = document.getElementById('mobileRevenueStatsModal');
      if (modal) {
        initMobileStatsDates();
        renderMobileRevenueStats();
        modal.style.display = 'flex';
      }
    }
    window.openMobileRevenueStatsModal = openMobileRevenueStatsModal;

    function closeMobileRevenueStatsModal() {
      const modal = document.getElementById('mobileRevenueStatsModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
    window.closeMobileRevenueStatsModal = closeMobileRevenueStatsModal;

    function toggleSalePaymentStatus(id) {
      const item = salesDatabase.find(x => x.id === id);
      if (item) {
        if (item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') {
          item.paymentStatus = 'Đã Trả';
          if (item.method === 'Nợ') item.method = 'Tiền mặt';
        } else {
          item.paymentStatus = 'Nợ Dai VL';
        }
        saveSalesStorage();
        renderSalesTable(salesDatabase);
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
      }
    }

    /* ============================================================
       CHECK GIAO DỊCH BÁN HÀNG (POPUP TRÁI TIM ❤️)
       - Lọc toàn bộ giao dịch bán hàng theo ngày/tháng/năm
       - Phân chia 2 cột song song: CHUYỂN KHOẢN & TIỀN MẶT
       - Nháy đúp chuột (hoặc bấm nút) để chuyển đổi Đã check / Chưa check
       - Tự động lưu trạng thái vào salesDatabase & localStorage
       ============================================================ */
    let currentReconcileDateFilter = getVietnamDate();
    let currentReconcileMode = 'day';

    function openSalesReconcileModal() {
      // Đảm bảo mặc định ban đầu toàn bộ đơn nợ/giao dịch là Chưa Check (chỉ chạy 1 lần duy nhất)
      if (!localStorage.getItem('KIMCHI_RECONCILE_DEFAULT_UNCHECKED_V2')) {
        salesDatabase.forEach(s => {
          s.isChecked = false;
        });
        saveSalesStorage();
        localStorage.setItem('KIMCHI_RECONCILE_DEFAULT_UNCHECKED_V2', 'true');
      }

      if (currentSalesDateFilter) {
        currentReconcileDateFilter = new Date(currentSalesDateFilter.getTime());
      } else {
        currentReconcileDateFilter = getVietnamDate();
      }
      currentReconcileMode = salesViewMode || 'day';

      const sel = document.getElementById('reconcileModeSelect');
      if (sel) sel.value = currentReconcileMode;

      updateReconcileDateDisplay();
      renderSalesReconcileModal();

      const modal = document.getElementById('salesReconcileModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    function closeSalesReconcileModal() {
      const modal = document.getElementById('salesReconcileModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    function updateReconcileDateDisplay() {
      const disp = document.getElementById('filterReconcileDateDisplay');
      if (!disp) return;

      const dd = String(currentReconcileDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentReconcileDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentReconcileDateFilter.getFullYear();

      if (currentReconcileMode === 'day') {
        disp.innerText = `${dd}/${mm}/${yyyy}`;
      } else if (currentReconcileMode === 'month') {
        disp.innerText = `${mm}/${yyyy}`;
      } else {
        disp.innerText = `${yyyy}`;
      }
    }

    function setReconcileMode(mode) {
      currentReconcileMode = mode;
      updateReconcileDateDisplay();
      renderSalesReconcileModal();
    }

    function changeReconcileDate(delta) {
      if (currentReconcileMode === 'day') {
        currentReconcileDateFilter.setDate(currentReconcileDateFilter.getDate() + delta);
      } else if (currentReconcileMode === 'month') {
        currentReconcileDateFilter.setMonth(currentReconcileDateFilter.getMonth() + delta);
      } else {
        currentReconcileDateFilter.setFullYear(currentReconcileDateFilter.getFullYear() + delta);
      }
      updateReconcileDateDisplay();
      renderSalesReconcileModal();
    }

    function openReconcileDatePicker() {
      const input = document.getElementById('nativeDatePicker_reconcile');
      if (!input) return;
      const yyyy = currentReconcileDateFilter.getFullYear();
      const mm = String(currentReconcileDateFilter.getMonth() + 1).padStart(2, '0');
      const dd = String(currentReconcileDateFilter.getDate()).padStart(2, '0');
      input.value = `${yyyy}-${mm}-${dd}`;
      try {
        if (typeof input.showPicker === 'function') input.showPicker();
        else input.click();
      } catch (err) {
        input.click();
      }
    }

    function handleNativeReconcileDateChange(val) {
      if (!val) return;
      const [yyyy, mm, dd] = val.split('-').map(Number);
      if (yyyy && mm && dd) {
        currentReconcileDateFilter = new Date(yyyy, mm - 1, dd);
        updateReconcileDateDisplay();
        renderSalesReconcileModal();
      }
    }

    function toggleReconcileItemCheck(itemId) {
      const item = salesDatabase.find(x => x.id === itemId);
      if (item) {
        // Mặc định ban đầu là false (Chưa Check), nháy đúp sẽ đảo ngược trạng thái
        item.isChecked = !item.isChecked;
        saveSalesStorage();
        renderSalesReconcileModal();
      }
    }

    function batchSetReconcileStatus(status) {
      const items = getFilteredReconcileSales();
      if (items.length === 0) return;
      items.forEach(it => {
        it.isChecked = !!status;
      });
      saveSalesStorage();
      renderSalesReconcileModal();
      showToast(status ? `✅ Đã đánh dấu ${items.length} giao dịch là Đã Check!` : `Đã chuyển ${items.length} giao dịch sang Chưa Check!`);
    }

    function getFilteredReconcileSales() {
      return salesDatabase.filter(i => {
        if (!i.dateTime) return false;
        const parts = i.dateTime.split(' - ');
        if (parts.length < 2) return false;
        const datePart = parts[1].trim();

        if (currentReconcileMode === 'day') {
          const dd = String(currentReconcileDateFilter.getDate()).padStart(2, '0');
          const mm = String(currentReconcileDateFilter.getMonth() + 1).padStart(2, '0');
          const yyyy = currentReconcileDateFilter.getFullYear();
          return (datePart === `${dd}/${mm}/${yyyy}`);
        } else if (currentReconcileMode === 'month') {
          const datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            const m = parseInt(datePieces[1], 10) - 1;
            const y = parseInt(datePieces[2], 10);
            return (m === currentReconcileDateFilter.getMonth() && y === currentReconcileDateFilter.getFullYear());
          }
          return false;
        } else if (currentReconcileMode === 'year') {
          const datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            const y = parseInt(datePieces[2], 10);
            return (y === currentReconcileDateFilter.getFullYear());
          }
          return false;
        }
        return true;
      });
    }

    function renderSalesReconcileModal() {
      const ckListEl = document.getElementById('reconcileCkList');
      const tmListEl = document.getElementById('reconcileTmList');
      if (!ckListEl || !tmListEl) return;

      const items = getFilteredReconcileSales();

      items.sort((a, b) => (b.id || 0) - (a.id || 0));

      const ckItems = [];
      const tmItems = [];

      items.forEach(item => {
        const methodStr = (item.method || '').toLowerCase().trim();
        const isCk = (methodStr === 'chuyển khoản' || methodStr === 'ck' || methodStr === 'chuyển tiền');
        if (isCk) {
          ckItems.push(item);
        } else {
          tmItems.push(item);
        }
      });

      let checkedCount = 0;
      let uncheckedCount = 0;

      items.forEach(it => {
        // MẶC ĐỊNH LÀ CHƯA CHECK (false)
        if (it.isChecked === undefined || it.isChecked === null) {
          it.isChecked = false;
        }
        if (it.isChecked) checkedCount++;
        else uncheckedCount++;
      });

      const checkedEl = document.getElementById('reconcileCheckedCount');
      const uncheckedEl = document.getElementById('reconcileUncheckedCount');
      if (checkedEl) checkedEl.innerText = String(checkedCount);
      if (uncheckedEl) uncheckedEl.innerText = String(uncheckedCount);

      function createReconcileCard(item) {
        const isChecked = !!item.isChecked;
        const parts = (item.dateTime || '').split(' - ');
        const timeStr = parts[0] ? parts[0].trim() : '';
        const nameStr = item.name || 'Hàng hóa';
        const priceStr = formatPriceStr(item.total);

        return `
          <div class="reconcile-item-card"
            ondblclick="toggleReconcileItemCheck(${item.id})"
            onclick="/* Chỉ chuyển khi nháy đúp chuột */"
            title="Nháy đúp chuột (Double click) để chuyển trạng thái"
            style="background: #0f1626; border: 1px solid #1e293b; border-radius: 6px; padding: 6px 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; transition: all 0.15s; min-height: 42px; box-sizing: border-box;"
            onmouseover="this.style.background='#141f33'; this.style.borderColor='#334155';"
            onmouseout="this.style.background='#0f1626'; this.style.borderColor='#1e293b';">
            
            <div style="display: flex; align-items: baseline; gap: 10px; max-width: 68%; overflow: hidden;">
              <span style="font-size: 1.15rem; font-weight: 900; color: #ffffff; letter-spacing: 0.3px; line-height: 1; flex-shrink: 0;">
                ${priceStr}
              </span>
              <span style="font-size: 0.8rem; color: #8e9db3; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${escapeHtml(timeStr)} - ${escapeHtml(nameStr)}
              </span>
            </div>

            <div style="pointer-events: none; flex-shrink: 0;">
              ${isChecked ? `
                <span style="background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; color: #34d399; font-size: 0.74rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                  ✔ Đã Check
                </span>
              ` : `
                <span style="background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; color: #f87171; font-size: 0.74rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                  ✖ Chưa Check
                </span>
              `}
            </div>
          </div>
        `;
      }

      if (ckItems.length === 0) {
        ckListEl.innerHTML = `<div style="text-align: center; color: #64748b; padding: 2.5rem 1rem; font-weight: 700; font-size: 0.9rem;">Không có giao dịch chuyển khoản nào</div>`;
      } else {
        ckListEl.innerHTML = ckItems.map(createReconcileCard).join('');
      }

      if (tmItems.length === 0) {
        tmListEl.innerHTML = `<div style="text-align: center; color: #64748b; padding: 2.5rem 1rem; font-weight: 700; font-size: 0.9rem;">Không có giao dịch tiền mặt nào</div>`;
      } else {
        tmListEl.innerHTML = tmItems.map(createReconcileCard).join('');
      }

      const ckTotal = ckItems.reduce((sum, it) => sum + (parsePriceNum(it.total) || 0), 0);
      const tmTotal = tmItems.reduce((sum, it) => sum + (parsePriceNum(it.total) || 0), 0);
      const grandTotal = ckTotal + tmTotal;

      const ckTotalEl = document.getElementById('reconcileCkTotalVal');
      const tmTotalEl = document.getElementById('reconcileTmTotalVal');
      const grandTotalEl = document.getElementById('reconcileGrandTotalVal');
      const ckBadge = document.getElementById('reconcileCkCountBadge');
      const tmBadge = document.getElementById('reconcileTmCountBadge');
      const txCountEl = document.getElementById('reconcileTotalTxCount');

      if (ckTotalEl) ckTotalEl.innerText = formatPriceStr(ckTotal);
      if (tmTotalEl) tmTotalEl.innerText = formatPriceStr(tmTotal);
      if (grandTotalEl) grandTotalEl.innerText = formatPriceStr(grandTotal);
      if (ckBadge) ckBadge.innerText = `${ckItems.length} giao dịch`;
      if (tmBadge) tmBadge.innerText = `${tmItems.length} giao dịch`;
      if (txCountEl) txCountEl.innerText = String(items.length);
    }

    window.openSalesReconcileModal = openSalesReconcileModal;
    window.closeSalesReconcileModal = closeSalesReconcileModal;
    window.updateReconcileDateDisplay = updateReconcileDateDisplay;
    window.setReconcileMode = setReconcileMode;
    window.changeReconcileDate = changeReconcileDate;
    window.openReconcileDatePicker = openReconcileDatePicker;
    window.handleNativeReconcileDateChange = handleNativeReconcileDateChange;
    window.toggleReconcileItemCheck = toggleReconcileItemCheck;
    window.batchSetReconcileStatus = batchSetReconcileStatus;
    window.renderSalesReconcileModal = renderSalesReconcileModal;



    // BÁN GÀ VIEW MODE (DAY / MONTH / YEAR)
    let bangaViewMode = 'day';
    let currentBangaDateFilter = getVietnamDate();
    let currentBangaMonthFilter = { month: currentBangaDateFilter.getMonth(), year: currentBangaDateFilter.getFullYear() };
    let currentBangaYearFilter = currentBangaDateFilter.getFullYear();
    let isBangaSensitiveHidden = false;

    function toggleBangaSensitive() {
      isBangaSensitiveHidden = !isBangaSensitiveHidden;
      const btn = document.getElementById('btnBangaToggleHide');
      if (btn) {
        btn.innerHTML = '👁️';
        btn.title = isBangaSensitiveHidden ? 'Bấm để hiện thông tin' : 'Bấm để ẩn thông tin';
      }
      renderBangaTable(bangaDatabase);
    }

    function setBangaMode(mode) {
      bangaViewMode = mode;
      const selMode = document.getElementById('bangaModeSelect');
      if (selMode) selMode.value = mode;
      const btnDay = document.getElementById('bangaModeDayBtn');
      const btnMonth = document.getElementById('bangaModeMonthBtn');
      const btnYear = document.getElementById('bangaModeYearBtn');
      const dayBox = document.getElementById('bangaDateFilterBox');
      const monthBox = document.getElementById('bangaMonthFilterBox');
      const yearBox = document.getElementById('bangaYearFilterBox');

      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnYear) btnYear.classList.toggle('active', mode === 'year');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderBangaTable(bangaDatabase);
    }
    window.setBangaMode = setBangaMode;

    function changeBangaFilterDate(delta) {
      currentBangaDateFilter.setDate(currentBangaDateFilter.getDate() + delta);
      const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentBangaDateFilter.getFullYear();
      document.getElementById('filterBangaDateDisplay').innerText = `${dd}/${mm}/${yyyy}`;
      renderBangaTable(bangaDatabase);
    }
    window.changeBangaFilterDate = changeBangaFilterDate;

    function changeBangaFilterMonth(delta) {
      currentBangaMonthFilter.month += delta;
      if (currentBangaMonthFilter.month > 11) {
        currentBangaMonthFilter.month = 0;
        currentBangaMonthFilter.year++;
      } else if (currentBangaMonthFilter.month < 0) {
        currentBangaMonthFilter.month = 11;
        currentBangaMonthFilter.year--;
      }
      const mm = String(currentBangaMonthFilter.month + 1).padStart(2, '0');
      document.getElementById('filterBangaMonthDisplay').innerText = `${mm}/${currentBangaMonthFilter.year}`;
      renderBangaTable(bangaDatabase);
    }
    window.changeBangaFilterMonth = changeBangaFilterMonth;

    function changeBangaFilterYear(delta) {
      currentBangaYearFilter += delta;
      const el = document.getElementById('filterBangaYearDisplay');
      if (el) el.innerText = String(currentBangaYearFilter);
      renderBangaTable(bangaDatabase);
    }
    window.changeBangaFilterYear = changeBangaFilterYear;

    function getBangaPhoneDetails(item) {
      let brand = item.brand || '';
      let phoneName = item.phoneName || '';
      let storage = item.storage || '';
      let color = item.color || '';
      let imei = item.imei || '';
      let condition = item.condition || '';
      let pinStatus = item.pinStatus || '';
      let pin = item.pin || '';
      let origin = item.origin || '';
      let warranty = item.warranty || '';

      // Tìm trong soldPhoneDatabase hoặc phoneDatabase nếu có IMEI
      let match = (item.name || '').match(/\((\d{4,})\)/);
      let extractedImei = match ? match[1] : (item.imei || '');

      let matchedPhone = (extractedImei && soldPhoneDatabase && soldPhoneDatabase.find(p => p.imei && p.imei === extractedImei)) || 
                         (extractedImei && phoneDatabase && phoneDatabase.find(p => p.imei && p.imei === extractedImei));

      if (matchedPhone) {
        brand = brand || matchedPhone.brand || '';
        phoneName = phoneName || matchedPhone.name || '';
        storage = storage || (matchedPhone.storage ? matchedPhone.storage.replace(/[()]/g, '') : '');
        color = color || matchedPhone.color || '';
        imei = imei || matchedPhone.imei || '';
        condition = condition || matchedPhone.condition || '';
        pinStatus = pinStatus || matchedPhone.pinStatus || '';
        pin = pin || matchedPhone.pin || '';
        origin = origin || matchedPhone.origin || '';
        warranty = warranty || matchedPhone.warranty || '';
      }

      // Parse từ name dạng "Hãng - Tên Máy (IMEI)" nếu có dấu gạch ngang phân tách
      if ((!phoneName || !brand) && item.name) {
        let cleanName = item.name.replace(/\(\d+\)/, '').trim();
        let parts = cleanName.split('-');
        if (parts.length > 1) {
          let candidateBrand = parts[0].trim().toUpperCase();
          let recognizedBrands = ['IPHONE', 'SAMSUNG', 'OPPO', 'XIAOMI', 'REDMI', 'VIVO', 'REALME', 'NOKIA', 'HUAWEI', 'IPAD', 'SONY', 'VSMART', 'GOOGLE', 'PIXEL', 'MÁY NGOÀI', '❤️❤️❤️'];
          if (recognizedBrands.includes(candidateBrand)) {
            brand = brand || parts[0].trim();
            let rest = parts.slice(1).join('-').trim();
            let restWords = rest.split(/\s+/);
            let lastWord = restWords[restWords.length - 1];
            if (lastWord && lastWord.toUpperCase().includes('GB')) {
              storage = storage || lastWord;
              phoneName = restWords.slice(0, -1).join(' ');
            } else {
              phoneName = rest;
            }
          }
        }
      }

      // Nếu name bắt đầu bằng tên hãng như "Oppo A78"
      let brandStartMatch = (item.name || '').match(/^(IPHONE|SAMSUNG|OPPO|XIAOMI|REDMI|VIVO|REALME|NOKIA|HUAWEI|IPAD|SONY|VSMART|GOOGLE|PIXEL)\s+(.+)$/i);
      if (brandStartMatch) {
        brand = brand || brandStartMatch[1].toUpperCase();
        if (!phoneName) phoneName = item.name;
      }

      // Từ khóa phụ kiện / dịch vụ / khác: Tuyệt đối KHÔNG PHẢI MÁY
      const nonMachineRegex = /bán thẻ|thẻ nhớ|nạp|cầm đồ|thay lưng|sửa|míc|mic|ép kính|sim|bán màn|đớp|viettel|huy linh|rút tiền|bộ sạc|dây sạc|củ sạc|tai nghe|cường lực|ốp lưng|dán|pin|vỏ|camera|loa|hòa/i;
      let isNonMachine = nonMachineRegex.test(item.name || '') || (item.accessory && item.accessory !== 'Bán Máy' && item.accessory !== 'Máy');

      let isPhone = false;
      if (!isNonMachine) {
        if (item.accessory === 'Bán Máy' || item.accessory === 'Máy') {
          isPhone = true;
        } else if (imei || extractedImei || brand) {
          isPhone = true;
        } else {
          let phonePattern = /^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|sony|vsmart|google|pixel|\d{1,2}\s*(?:pro\s*max|pro|plus|mini)?|xs\s*max|xs|xr|x|se|gen\s*\d+|a\d+[a-z]?|m\d+[a-z]?|c\d+[a-z]?|note\s*\d+)/i;
          isPhone = phonePattern.test((item.name || '').trim());
        }
      }

      return {
        brand: brand,
        phoneName: phoneName || item.name || '',
        storage: storage ? storage.replace(/[()]/g, '') : '',
        color: color,
        imei: imei || extractedImei || '',
        condition: condition || (isPhone ? 'Zin Đẹp 99%' : ''),
        pinStatus: pinStatus || (isPhone ? 'Pin Zin' : ''),
        pin: pin || (isPhone ? '100%' : ''),
        origin: origin || (isPhone ? 'VN/A' : ''),
        warranty: warranty || (isPhone ? '3 Tháng' : 'Không'),
        isPhone: isPhone
      };
    }

    function renderBangaTable(items) {
      const tbody = document.getElementById('bangaTableBody');
      const searchInputEl = document.querySelector('#tab-banga .search-input-field') || document.querySelector('#tab-banga input[type="text"]');
      const searchInputVal = searchInputEl ? searchInputEl.value.trim().toLowerCase() : '';
      
      let filtered = items.filter(i => {
        // Tìm kiếm: khi tìm thì lọc theo toàn bộ mục đã bán, không phải lọc theo ngày hiện tại
        if (searchInputVal) {
          let mainName = (i.name || '').toLowerCase();
          let accName = (i.accessory || '').toLowerCase();
          let custName = (i.customer || '').toLowerCase();
          return mainName.includes(searchInputVal) || accName.includes(searchInputVal) || custName.includes(searchInputVal);
        }

        let parts = i.dateTime.split(' - ');
        if (parts.length < 2) return false;
        let datePart = parts[1].trim();

        let matchTime = false;
        if (bangaViewMode === 'day') {
          const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
          const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
          const yyyy = currentBangaDateFilter.getFullYear();
          let targetDateStr = `${dd}/${mm}/${yyyy}`;
          matchTime = (datePart === targetDateStr);
        } else if (bangaViewMode === 'month') {
          let datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            let m = parseInt(datePieces[1], 10) - 1;
            let y = parseInt(datePieces[2], 10);
            matchTime = (m === currentBangaMonthFilter.month && y === currentBangaMonthFilter.year);
          }
        } else if (bangaViewMode === 'year') {
          let datePieces = datePart.split('/');
          if (datePieces.length === 3) {
            let y = parseInt(datePieces[2], 10);
            matchTime = (y === currentBangaYearFilter);
          }
        } else {
          matchTime = true;
        }

        return matchTime;
      });

      // Sắp xếp filtered theo thời gian mới nhất lên đầu
      filtered.sort((a, b) => {
        let getTs = (dtStr) => {
          if (!dtStr) return 0;
          let parts = String(dtStr).split(' - ');
          if (parts.length >= 2) {
            let [hh, min] = parts[0].split(':').map(n => parseInt(n, 10) || 0);
            let [d, m, y] = parts[1].split('/').map(n => parseInt(n, 10) || 0);
            return new Date(y, m - 1, d, hh, min).getTime();
          }
          let t = new Date(dtStr).getTime();
          return isNaN(t) ? 0 : t;
        };
        return getTs(b.dateTime) - getTs(a.dateTime);
      });

      const countEl = document.getElementById('bangaCountText');
      if (countEl) {
        let bgDebt = filtered.filter(i => (i.paymentStatus === 'Nợ Dai VL' || i.method === 'Nợ')).length;
        let bgPaid = filtered.length - bgDebt;
        countEl.innerHTML = `Tổng = <span style="color: #ffffff; font-weight: 800;">${filtered.length}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Thanh Toán = <span style="color: #10b981; font-weight: 800;">${bgPaid}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Nợ Dai = <span style="color: #ef4444; font-weight: 800;">${bgDebt}</span>`;
      }

      let totalRev = 0;
      let totalCost = 0;
      let totalProf = 0;

      filtered.forEach(i => {
        let rev = parsePriceNum(i.total);
        let prof = parsePriceNum(i.profit);
        let cost = parsePriceNum(i.priceIn);
        if (!cost && rev && prof) {
          cost = rev - prof;
        }
        totalRev += rev;
        totalCost += cost;
        totalProf += prof;
      });

      // Tính toán Doanh thu & Lãi (Ngày & Tháng & Năm & Tất cả) cho 2 box trên đầu chuẩn mẫu Bán Hàng / Sửa Chữa
      let bangaDayRev = 0;
      let bangaDayProf = 0;
      let bangaMonthRev = 0;
      let bangaMonthProf = 0;
      let bangaYearRev = 0;
      let bangaYearProf = 0;
      let bangaAllRev = 0;
      let bangaAllProf = 0;

      const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentBangaDateFilter.getFullYear();
      let targetDateStr = `${dd}/${mm}/${yyyy}`;
      let targetMonth = bangaViewMode === 'month' ? currentBangaMonthFilter.month : currentBangaDateFilter.getMonth();
      let targetYear = (bangaViewMode === 'month' ? currentBangaMonthFilter.year : (bangaViewMode === 'year' ? currentBangaYearFilter : currentBangaDateFilter.getFullYear()));

      items.forEach(i => {
        let rev = parsePriceNum(i.total);
        let prof = parsePriceNum(i.profit);
        bangaAllRev += rev;
        bangaAllProf += prof;

        let parts = (i.dateTime || '').split(' - ');
        if (parts.length >= 2) {
          let datePart = parts[1].trim();

          if (datePart === targetDateStr) {
            bangaDayRev += rev;
            bangaDayProf += prof;
          }

          let dp = datePart.split('/');
          if (dp.length === 3) {
            let m = parseInt(dp[1], 10) - 1;
            let y = parseInt(dp[2], 10);
            if (m === targetMonth && y === targetYear) {
              bangaMonthRev += rev;
              bangaMonthProf += prof;
            }
            if (y === currentBangaYearFilter) {
              bangaYearRev += rev;
              bangaYearProf += prof;
            }
          }
        }
      });

      // Cập nhật Box tím bên trái (Doanh thu Tháng/Năm [xanh] & Doanh thu Ngày [trắng])
      const mRevEl = document.getElementById('bangaMonthRevenueVal');
      const dRevEl = document.getElementById('bangaDayRevenueVal');
      const mProfEl = document.getElementById('bangaMonthProfitVal');
      const dProfEl = document.getElementById('bangaDayProfitVal');

      if (bangaViewMode === 'year') {
        if (mRevEl) {
          mRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaYearRev);
          mRevEl.title = `Doanh thu Năm ${currentBangaYearFilter}`;
        }
        if (dRevEl) {
          dRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayRev);
          dRevEl.title = 'Doanh thu Ngày';
        }
        if (mProfEl) {
          mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaYearProf);
          mProfEl.title = `Lãi Năm ${currentBangaYearFilter}`;
        }
        if (dProfEl) {
          dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
          dProfEl.title = 'Lãi Ngày';
        }
      } else if (bangaViewMode === 'all') {
        if (mRevEl) {
          mRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaAllRev);
          mRevEl.title = 'Tổng Doanh thu Tất cả';
        }
        if (dRevEl) {
          dRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayRev);
          dRevEl.title = 'Doanh thu Ngày';
        }
        if (mProfEl) {
          mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaAllProf);
          mProfEl.title = 'Tổng Lãi Tất cả';
        }
        if (dProfEl) {
          dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
          dProfEl.title = 'Lãi Ngày';
        }
      } else {
        if (mRevEl) {
          mRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaMonthRev);
          mRevEl.title = `Doanh thu Tháng ${targetMonth + 1}/${targetYear}`;
        }
        if (dRevEl) {
          dRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayRev);
          dRevEl.title = 'Doanh thu Ngày';
        }
        if (mProfEl) {
          mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaMonthProf);
          mProfEl.title = `Lãi Tháng ${targetMonth + 1}/${targetYear}`;
        }
        if (dProfEl) {
          dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
          dProfEl.title = 'Lãi Ngày';
        }
      }

      // CẬP NHẬT ICON LÃI NGÀY BÁN GÀ: 0 - 999 MẶT KHÓC, >= 1000 MẶT CƯỜI
      const bangaProfitEmojiEl = document.getElementById('bangaProfitEmojiIcon');
      if (bangaProfitEmojiEl) {
        let bDayProfitVal = parsePriceNum(bangaDayProf);
        if (bDayProfitVal >= 1000) {
          bangaProfitEmojiEl.src = 'img/icon_happy.png';
          bangaProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(bangaDayProf) + ' (Đạt từ 1.000 trở lên)';
        } else {
          bangaProfitEmojiEl.src = 'img/icon_crying.png';
          bangaProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(bangaDayProf) + ' (Từ 0 - 999)';
        }
      }

      const topDt = document.getElementById('bangaDoanhThuVal');
      if (topDt) topDt.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(totalRev);

      const topLai = document.getElementById('bangaLaiVal');
      if (topLai) topLai.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(totalProf);

      const footSold = document.getElementById('bangaFootSold');
      if (footSold) footSold.innerText = filtered.length;

      const footRev = document.getElementById('bangaFootRev');
      if (footRev) footRev.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(totalRev);

      const footCost = document.getElementById('bangaFootCost');
      if (footCost) footCost.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(totalCost);

      const footProfit = document.getElementById('bangaFootProfit');
      if (footProfit) footProfit.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(totalProf);

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-sub);">Không có dữ liệu bán gà phù hợp</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        let details = getBangaPhoneDetails(item);
        let dotColor = getHexColor(details.color);
        let isCash = (item.method === 'Tiền mặt' || item.method === 'Tiền Mặt');
        let methodColor = isCash ? '#10b981' : '#f87171';

        // Tên hàng / máy hiển thị
        let nameHtml = '';
        if (details.isPhone) {
          let displayName = '';
          let rawDeviceName = details.phoneName || item.name || '';
          // Bỏ tiền tố hãng nếu có ở đầu
          rawDeviceName = rawDeviceName.replace(/^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|sony|vsmart|google|pixel)\s*[-–]?\s*/i, '');
          if (details.brand && (details.brand === 'MÁY NGOÀI' || details.brand === '❤️❤️❤️')) {
            displayName = `<span style="color: #ef4444; font-size: 1.15rem; letter-spacing: 1px;">❤️❤️❤️</span> - ${formatBrandDeviceName(rawDeviceName)}`;
          } else {
            displayName = formatBrandDeviceName(rawDeviceName);
          }

          // Dấu chấm màu: CHỈ hiển thị nếu có màu thực tế, vẽ SVG Circle để đảm bảo TRÒN TUYỆT ĐỐI 100%, không bao giờ bị méo elip
          let dotHtml = '';
          if (details.color && details.color.trim()) {
            let hex = getHexColor(details.color);
            let rawC = String(details.color).toLowerCase();
            let isW = rawC.includes('trắng') || rawC.includes('trang') || rawC.includes('white');
            let strokeColor = isW ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)';
            dotHtml = `
              <span class="banga-dot-circle" title="Màu: ${escapeHtml(details.color)}">
                <svg viewBox="0 0 20 20" width="20" height="20" style="display: block; width: 20px; height: 20px; min-width: 20px; min-height: 20px;">
                  <circle cx="10" cy="10" r="8.5" fill="${hex}" stroke="${strokeColor}" stroke-width="1.8"></circle>
                </svg>
              </span>
            `;
          }
          let cleanStorageStr = details.storage ? formatStorageDisplay(details.storage).replace(/GB$/i, '').trim() : '';
          let storagePart = cleanStorageStr ? `<span>${cleanStorageStr}</span>` : '';
          let imeiPart = details.imei ? `<span style="border: 1px solid #ef4444; color: #ffffff; font-weight: 900; font-size: 1.27rem; padding: 2px 7px; border-radius: 4px; display: inline-block; letter-spacing: 0.5px;">${details.imei}</span>` : '';

          nameHtml = `
            <div style="display: inline-flex; align-items: center; justify-content: flex-start; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
              <span style="font-size: 1.27rem; font-weight: 800; white-space: nowrap;">${displayName}</span>
              ${dotHtml}
              ${storagePart ? `<span style="color: #eab308; font-weight: 700; font-size: 1.16rem; white-space: nowrap;">${storagePart}</span>` : ''}
              ${imeiPart}
            </div>
          `;
        } else {
          let customName = formatBrandDeviceName(item.name || item.accessory || '');
          if (customName.includes('MÁY NGOÀI')) {
            customName = customName.replace(/^MÁY NGOÀI\s*[-–]?\s*/i, '<span style="color: #ef4444; font-size: 1.27rem; letter-spacing: 1px;">❤️❤️❤️</span> - ');
          }
          nameHtml = `<div style="display: inline-flex; align-items: center; justify-content: flex-start; width: 100%; white-space: nowrap;"><span style="font-size: 1.27rem; font-weight: 800; white-space: nowrap;">${customName}</span></div>`;
        }

        let bangaTotal = formatPriceStr(item.total);
        let bangaPriceIn = formatPriceStr(item.priceIn || '0');
        let bangaProfit = formatPriceStr(item.profit || '0');

            let bangaMethodDisplay = 'Tiền Mặt 😊';
            if (item.method === 'Chuyển khoản' || item.method === 'Chuyển Khoản' || (item.method && item.method.toLowerCase().includes('chuyển'))) {
              bangaMethodDisplay = 'Chuyển Tiền';
            } else if (item.method === 'Nợ' || item.method === 'nợ') {
              bangaMethodDisplay = 'Nợ';
            }

            return `
              <tr ondblclick="editBangaSale('${item.id}')" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<350){ editBangaSale('${item.id}'); } this._lastTap=now;" style="cursor: pointer;" title="Nháy đúp để xem và sửa chi tiết đơn">
                <td style="font-weight: 800; text-align: left; padding-left: 16px; vertical-align: middle; white-space: nowrap;">
                  ${nameHtml}
                </td>
                <td style="font-weight: 900; color: #f87171; font-size: 1.38rem; text-align: center; vertical-align: middle;">${bangaTotal}</td>
                <td style="color: #ffffff; font-weight: 900; font-size: 1.05rem; text-align: center; vertical-align: middle;">${isBangaSensitiveHidden ? '***' : bangaPriceIn}</td>
                <td style="font-weight: 900; color: #eab308; font-size: 1.05rem; text-align: center; vertical-align: middle;">${isBangaSensitiveHidden ? '***' : bangaProfit}</td>
                <td style="text-align: center; vertical-align: middle;"><span style="font-weight: 900; font-size: 1.05rem; color: ${methodColor}; cursor: default; user-select: none;">${bangaMethodDisplay}</span></td>
            <td style="color: #ec4899; font-weight: 900; font-size: 1.05rem; text-align: center; vertical-align: middle;">${item.dateTime}</td>
            <td style="text-align: center; vertical-align: middle;">
              <div class="action-btn-group" style="justify-content: center;">
                <button type="button" class="action-btn-icon action-btn-view" onclick="viewBangaSale('${item.id}')" title="Xem chi tiết">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-edit" onclick="editBangaSale('${item.id}')" title="Sửa đơn">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-del" onclick="deleteBangaSale('${item.id}')" title="Xóa đơn">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <span class="${(item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') ? 'badge-payment-debt' : 'badge-payment-paid'}" style="cursor: default; user-select: none;">
                ${(item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') ? '💀 NỢ DAI VL' : '✔ ĐÃ TRẢ <span style="font-size: 0.80rem; margin-left: 2px;">💰</span>'}
              </span>
            </td>
          </tr>
        `;
      }).join('');

      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }

    function toggleBangaMethod(id) {
      const item = bangaDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (item) {
        let isCash = (item.method === 'Tiền mặt' || item.method === 'Tiền Mặt');
        item.method = isCash ? 'Chuyển khoản' : 'Tiền mặt';
        saveBangaStorage();
        renderBangaTable(bangaDatabase);
      }
    }
    window.toggleBangaMethod = toggleBangaMethod;

    function toggleSalesMethod(id) {
      const item = salesDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (item) {
        let isCash = (item.method === 'Tiền mặt' || item.method === 'Tiền Mặt');
        item.method = isCash ? 'Chuyển khoản' : 'Tiền mặt';
        saveSalesStorage();
        renderSalesTable(salesDatabase);
      }
    }
    window.toggleSalesMethod = toggleSalesMethod;

    function toggleBangaPaymentStatus(id) {
      const item = bangaDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (item) {
        if (item.paymentStatus === 'Nợ Dai VL' || item.method === 'Nợ') {
          item.paymentStatus = 'Đã Trả';
          if (item.method === 'Nợ') item.method = 'Tiền mặt';
        } else {
          item.paymentStatus = 'Nợ Dai VL';
        }
        saveBangaStorage();
        renderBangaTable(bangaDatabase);
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
      }
    }

    function openTicketModal() {
      tempCart = [];
      document.getElementById('tItemName').value = '';
      document.getElementById('tQty').value = '1';
      document.getElementById('tPriceOut').value = '';
      document.getElementById('tPriceIn').value = '';
      document.getElementById('tPaymentMethod').value = 'Tiền mặt';
      document.getElementById('tTargetList').value = 'Bán Hàng';
      
      document.getElementById('tTimeVal').value = getCurrentTimeStr();
      document.getElementById('tDateVal').value = getCurrentDateStr();
      const statusEl = document.getElementById('tPaymentStatus');
      if (statusEl) statusEl.value = 'Đã Trả';

      const titleSpan = document.querySelector('#ticketModal .ticket-header span');
      if (titleSpan) titleSpan.innerText = 'Tạo Phiếu Bán Hàng';

      updateCartUI();
      const m = document.getElementById('ticketModal');
      if (m) {
        m.style.zIndex = '100000';
        m.classList.add('active');
        m.style.display = 'flex';
      }
    }

    function openTicketModalWithTarget(target) {
      try {
        openTicketModal();
      } catch (err) {
        console.error('Error in openTicketModal:', err);
      }
      const m = document.getElementById('ticketModal');
      if (m) {
        m.classList.add('active');
        m.style.display = 'flex';
        m.style.zIndex = '1000000';
      }

      const targetSelect = document.getElementById('tTargetList');
      if (targetSelect) targetSelect.value = target;

      const titleSpan = document.querySelector('#ticketModal .ticket-header span');
      if (titleSpan) {
        titleSpan.innerText = target === 'Bán Gà' ? 'Tạo Phiếu Bán Gà' : 'Tạo Phiếu Bán Hàng';
      }

      try {
        if (target === 'Bán Gà') {
          if (typeof currentBangaDateFilter !== 'undefined') {
            const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
            const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
            const yyyy = currentBangaDateFilter.getFullYear();
            const dateEl = document.getElementById('tDateVal');
            if (dateEl) dateEl.value = `${dd}/${mm}/${yyyy}`;
          }
        } else {
          if (typeof currentSalesDateFilter !== 'undefined') {
            const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
            const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
            const yyyy = currentSalesDateFilter.getFullYear();
            const dateEl = document.getElementById('tDateVal');
            if (dateEl) dateEl.value = `${dd}/${mm}/${yyyy}`;
          }
        }
      } catch (e) {}
    }
    window.openTicketModalWithTarget = openTicketModalWithTarget;
    window.openTicketModal = openTicketModal;

    function closeTicketModal() {
      closeUniversalSmartDropdown();
      const m = document.getElementById('ticketModal');
      if (m) {
        m.classList.remove('active');
        m.style.display = 'none';
      }
    }
    window.closeTicketModal = closeTicketModal;

    function checkAndApplySoftwareTicketAutoSync() {
      if (typeof window === 'undefined' || window.innerWidth <= 768) return;
      const nameEl = document.getElementById('tItemName');
      if (!nameEl) return;
      const name = (nameEl.value || '').trim().toLowerCase();
      // Kiểm tra tên có phải là phần mềm không
      const isSoftware = name.includes('phần mềm') || name.includes('phan mem') || name === 'pm';
      if (!isSoftware) return;

      // 1. Thanh toán tự nhảy sang chuyển khoản
      const paySelect = document.getElementById('tPaymentMethod');
      if (paySelect && paySelect.value !== 'Chuyển khoản') {
        paySelect.value = 'Chuyển khoản';
      }

      // 2. Giá nhập ghi bằng giá bán
      const priceOutEl = document.getElementById('tPriceOut');
      const priceInEl = document.getElementById('tPriceIn');
      if (priceOutEl && priceInEl) {
        priceInEl.value = priceOutEl.value;
      }
    }

    document.addEventListener('input', function(e) {
      if (typeof window === 'undefined' || window.innerWidth <= 768) return;
      if (e.target && (e.target.id === 'tItemName' || e.target.id === 'tPriceOut')) {
        checkAndApplySoftwareTicketAutoSync();
      }
    });

    document.addEventListener('change', function(e) {
      if (typeof window === 'undefined' || window.innerWidth <= 768) return;
      if (e.target && (e.target.id === 'tItemName' || e.target.id === 'tPriceOut')) {
        checkAndApplySoftwareTicketAutoSync();
      }
    });

    function adjustQty(val) {
      let qInput = document.getElementById('tQty');
      let current = parseInt(qInput.value) || 1;
      current += val;
      if (current < 1) current = 1;
      qInput.value = current;
    }

    function addToCartPreview() {
      const name = document.getElementById('tItemName').value.trim();
      const qty = parseInt(document.getElementById('tQty').value) || 1;
      
      let rawOutStr = document.getElementById('tPriceOut').value.trim();
      let rawInStr = document.getElementById('tPriceIn').value.trim();

      let priceOut = parsePriceNum(rawOutStr);
      let priceIn = parsePriceNum(rawInStr);

      if (!name && priceOut <= 0 && priceIn <= 0) {
        alert('Vui lòng nhập thông tin phụ kiện trước khi thêm vào giỏ hàng!');
        return;
      }

      const total = priceOut * qty;
      const totalIn = priceIn * qty;
      const profit = total - totalIn;

      const fmtOut = formatPriceStr(priceOut);
      const fmtInSingle = formatPriceStr(priceIn);
      const fmtTotal = formatPriceStr(total);
      const fmtInTotal = totalIn > 0 ? formatPriceStr(totalIn) : '0';
      const fmtProfit = formatPriceStr(profit);

      tempCart.push({ 
        name: name || 'Chưa nhập tên phụ kiện', 
        qty, 
        rawOut: fmtOut, 
        rawIn: fmtInSingle, 
        rawProfit: fmtProfit,
        total: fmtTotal, 
        priceIn: fmtInTotal, 
        profit: fmtProfit 
      });

      updateCartUI();

      document.getElementById('tItemName').value = '';
      document.getElementById('tQty').value = '1';
      document.getElementById('tPriceOut').value = '';
      document.getElementById('tPriceIn').value = '';
    }

    function updateCartUI() {
      document.getElementById('cartCount').innerText = tempCart.length;
      const container = document.getElementById('cartContent');
      const saveBtn = document.getElementById('btnSaveTicket');

      if (tempCart.length === 0) {
        container.className = 'cart-empty';
        container.innerText = 'Giỏ trống';
        document.getElementById('ticketTotalSummary').innerHTML = `<span style="color: #10b981; font-weight: 800;">Tổng:</span> <span style="font-size: 1.3em; color: #fff;">0</span> - <span style="color: var(--amber-color);">0</span> = <span style="color: var(--green-badge);">0</span>`;
        saveBtn.classList.remove('active');
        return;
      }

      saveBtn.classList.add('active');
      container.className = '';
      let sumTotal = 0, sumIn = 0, sumProfit = 0;
      
      container.innerHTML = tempCart.map((item, idx) => {
        sumTotal += parsePriceNum(item.total);
        sumIn += parsePriceNum(item.priceIn);
        sumProfit += parsePriceNum(item.profit);
        
        let profitVal = parsePriceNum(item.rawProfit);
        let profitStr = profitVal < 0 ? `-${formatPriceStr(Math.abs(profitVal))}` : formatPriceStr(profitVal);

        return `
          <div class="cart-row-item" style="display: flex; align-items: center; justify-content: space-between; background: #0d121d; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 8px; margin-bottom: 8px; gap: 4px; box-sizing: border-box; width: 100%;">
            <div class="cart-col-name" style="display: flex; align-items: center; gap: 4px; min-width: 0; flex: 1;">
              <span class="cart-item-name" style="font-weight: 800; font-size: 0.95rem; color: #fff; word-break: break-word; line-height: 1.25;">${item.name}${item.qty > 1 ? ` <span style="color: var(--text-sub); font-size: 0.85rem;">(x${item.qty})</span>` : ''}</span>
            </div>

            <div class="cart-col-inputs" style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
              <div class="cart-col-price-out" style="display: flex; flex-direction: column; align-items: center;">
                <span class="cart-sub-label" style="font-size: 0.65rem; color: #9ca3af; font-weight: 700; margin-bottom: 2px;">Giá bán</span>
                <input type="text" class="cart-input-val cart-input-price-out" value="${item.rawOut}" onblur="updateCartItemField(${idx}, 'rawOut', this.value)" oninput="formatCurrencyInput(this)" onkeypress="validatePriceKeypress(event)" style="width: 66px; background: #141c2b; border: 1px solid #28354d; border-radius: 6px; color: #10b981; font-weight: 900; text-align: center; padding: 5px 2px; font-size: 0.81rem; outline: none; box-sizing: border-box;">
              </div>

              <div class="cart-col-price-in" style="display: flex; flex-direction: column; align-items: center;">
                <span class="cart-sub-label" style="font-size: 0.65rem; color: #9ca3af; font-weight: 700; margin-bottom: 2px;">Giá nhập</span>
                <input type="text" class="cart-input-val cart-input-price-in" value="${item.rawIn}" onblur="updateCartItemField(${idx}, 'rawIn', this.value)" oninput="formatCurrencyInput(this)" onkeypress="validatePriceKeypress(event)" style="width: 66px; background: #141c2b; border: 1px solid #28354d; border-radius: 6px; color: #fff; font-weight: 800; text-align: center; padding: 5px 2px; font-size: 0.81rem; outline: none; box-sizing: border-box;">
              </div>

              <button type="button" class="cart-btn-del" onclick="removeCartItem(${idx})" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-top: 14px; flex-shrink: 0;" title="Xóa">
                <svg viewBox="0 0 24 24" style="width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 2.2;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join('');

      let totalStr = formatPriceStr(sumTotal);
      let inStr = formatPriceStr(sumIn);
      let profitStr = formatPriceStr(sumProfit);

      document.getElementById('ticketTotalSummary').innerHTML = `<span style="color: #10b981; font-weight: 800;">Tổng:</span> <span style="font-size: 1.3em; color: #fff;">${totalStr}</span> - <span style="color: var(--amber-color);">${inStr}</span> = <span style="color: var(--green-badge);">${profitStr}</span>`;
    }

    function updateCartItemField(idx, field, val) {
      let cleanVal = formatPriceStr(val);
      tempCart[idx][field] = cleanVal || '0';

      let item = tempCart[idx];
      let priceOutNum = parsePriceNum(item.rawOut);
      let priceInNum = parsePriceNum(item.rawIn);
      let total = priceOutNum * item.qty;
      let totalIn = priceInNum * item.qty;
      let profit = total - totalIn;

      item.total = formatPriceStr(total);
      item.priceIn = formatPriceStr(totalIn);
      item.profit = formatPriceStr(profit);
      item.rawProfit = item.profit;

      let profitVal = parsePriceNum(item.rawProfit);
      let profitStr = profitVal < 0 ? `-${formatPriceStr(Math.abs(profitVal))}` : formatPriceStr(profitVal);

      const profitDiv = document.getElementById(`profit_view_${idx}`);
      if (profitDiv) profitDiv.innerText = profitStr;

      let sumTotal = 0, sumIn = 0, sumProfit = 0;
      tempCart.forEach(i => {
        sumTotal += parsePriceNum(i.total);
        sumIn += parsePriceNum(i.priceIn);
        sumProfit += parsePriceNum(i.profit);
      });

    }

    function removeCartItem(idx) {
      tempCart.splice(idx, 1);
      updateCartUI();
    }

    function saveTicket(e) {
      if (e) e.preventDefault();
      
      // Nếu giỏ hàng đang trống, tự động lấy sản phẩm đang nhập trên các ô input
      if (tempCart.length === 0) {
        const name = document.getElementById('tItemName').value.trim();
        let rawOutStr = document.getElementById('tPriceOut').value.trim();
        let rawInStr = document.getElementById('tPriceIn').value.trim();
        const priceOut = parsePriceNum(rawOutStr);
        const priceIn = parsePriceNum(rawInStr);
        const qty = parseInt(document.getElementById('tQty').value) || 1;

        if (name || priceOut > 0 || priceIn > 0) {
          const total = priceOut * qty;
          const totalIn = priceIn * qty;
          const profit = total - totalIn;

          const fmtTotal = formatPriceStr(total);
          const fmtIn = formatPriceStr(totalIn);
          const fmtProfit = formatPriceStr(profit);

          tempCart.push({ 
            name: name || 'Chưa nhập tên phụ kiện', 
            qty, 
            rawOut: rawOutStr || '0', 
            rawIn: rawInStr || '0', 
            rawProfit: fmtProfit,
            total: fmtTotal, 
            priceIn: fmtIn, 
            profit: fmtProfit 
          });
        }
      }

      if (tempCart.length === 0) {
        alert('Vui lòng nhập thông tin phiếu bán hàng trước khi lưu!');
        return;
      }

      // Kiểm tra xem có món nào bị thiếu 1 trong 3 thông tin bắt buộc (Tên phụ kiện, Giá bán, Giá nhập)
      let hasMissingInfo = false;
      tempCart.forEach(item => {
        if (isMissingRequiredSalesInfo(item.name, item.total, item.priceIn)) {
          hasMissingInfo = true;
        }
      });

      if (hasMissingInfo) {
        alert('⚠️ CẢNH BÁO: Phiếu bán hàng còn thiếu thông tin bắt buộc (Tên phụ kiện, Giá bán hoặc Giá nhập)!\n\nHệ thống vẫn cho phép lưu phiếu, nhưng hàng này sẽ NHÁY HỒNG ngoài danh sách cho đến khi bạn sửa bổ sung đầy đủ thông tin.');
      }

      let method = document.getElementById('tPaymentMethod').value;
      if (!method) {
        method = 'Tiền mặt';
        document.getElementById('tPaymentMethod').value = 'Tiền mặt';
      }

      const targetList = document.getElementById('tTargetList').value || 'Bán Hàng';
      const timeVal = document.getElementById('tTimeVal').value.trim() || getCurrentTimeStr();
      const dateVal = document.getElementById('tDateVal').value.trim() || getCurrentDateStr();
      const fullDateTime = `${timeVal} - ${dateVal}`;
      const paymentStatus = document.getElementById('tPaymentStatus') ? document.getElementById('tPaymentStatus').value : 'Đã Trả';

      if (tempCart.length >= 2) {
        // KHI THÊM VÀO GIỎ HÀNG TỪ 2 SẢN PHẨM TRỞ LÊN:
        // Gộp toàn bộ thành 1 phiếu hiển thị duy nhất: Tên 1 + Tên 2 (kèm số lượng nếu có), tổng giá bán và tổng giá nhập
        let combinedNames = tempCart.map(item => {
          let qtyLabel = (item.qty && Number(item.qty) > 1) ? ` (x${item.qty})` : '';
          return `${item.name}${qtyLabel}`;
        }).join(' + ');

        let sumTotalNum = 0;
        let sumPriceInNum = 0;
        let hasMissing = false;

        tempCart.forEach(item => {
          let tNum = parsePriceNum(item.total);
          let inNum = parsePriceNum(item.priceIn);
          sumTotalNum += tNum;
          sumPriceInNum += inNum;
          if (isMissingRequiredSalesInfo(item.name, item.total, item.priceIn)) {
            hasMissing = true;
          }
        });

        let totalVal = formatPriceStr(sumTotalNum);
        let priceInVal = formatPriceStr(sumPriceInNum);
        let profitVal = formatPriceStr(sumTotalNum - sumPriceInNum);

        let record = {
          id: Date.now(),
          name: combinedNames,
          accessory: combinedNames,
          total: totalVal,
          priceIn: priceInVal,
          profit: profitVal,
          method: method,
          dateTime: fullDateTime,
          customer: "Khách lẻ",
          paymentStatus: paymentStatus,
          isMissingInfo: hasMissing,
          cartItems: JSON.parse(JSON.stringify(tempCart))
        };

        if (targetList === 'Bán Gà') {
          bangaDatabase.unshift(record);
          if (typeof logActivity === 'function') {
            logActivity('ADD', 'banga', 'Bán gà', `Tạo đơn bán gà: ${record.name} - ${record.total}`, null, record, record.id);
          }
        } else {
          salesDatabase.unshift(record);
          if (typeof logActivity === 'function') {
            logActivity('ADD', 'banhang', 'Bán hàng', `Tạo phiếu bán hàng: ${record.name} - ${record.total}`, null, record, record.id);
          }
        }
      } else {
        // Trường hợp 1 sản phẩm: lưu bình thường
        tempCart.forEach(item => {
          let qtyLabel = (item.qty && Number(item.qty) > 1) ? ` (x${item.qty})` : '';
          let totalVal = formatPriceStr(parsePriceNum(item.total));
          let priceInVal = formatPriceStr(parsePriceNum(item.priceIn));
          let profitVal = formatPriceStr(parsePriceNum(item.profit));
          let isMissing = isMissingRequiredSalesInfo(item.name, totalVal, priceInVal);

          let record = {
            id: Date.now() + Math.random(),
            name: `${item.name}${qtyLabel}`,
            accessory: item.name,
            total: totalVal,
            priceIn: priceInVal,
            profit: profitVal,
            method: method,
            dateTime: fullDateTime,
            customer: "Khách lẻ",
            paymentStatus: paymentStatus,
            isMissingInfo: isMissing
          };

          if (targetList === 'Bán Gà') {
            bangaDatabase.unshift(record);
            if (typeof logActivity === 'function') {
              logActivity('ADD', 'banga', 'Bán gà', `Tạo đơn bán gà: ${record.name} - ${record.total}`, null, record, record.id);
            }
          } else {
            salesDatabase.unshift(record);
            if (typeof logActivity === 'function') {
              logActivity('ADD', 'banhang', 'Bán hàng', `Tạo phiếu bán hàng: ${record.name} - ${record.total}`, null, record, record.id);
            }
          }
        });
      }

      saveSalesStorage();
      saveBangaStorage();

      // Đồng bộ ngày xem của tab tương ứng về đúng ngày của đơn vừa tạo để hiển thị ngay lập tức
      let dateParts = dateVal.split('/');
      if (dateParts.length === 3) {
        let d = parseInt(dateParts[0], 10);
        let m = parseInt(dateParts[1], 10) - 1;
        let y = parseInt(dateParts[2], 10);
        if (targetList === 'Bán Gà') {
          currentBangaDateFilter = new Date(y, m, d);
          currentBangaMonthFilter = { month: m, year: y };
          const disp = document.getElementById('filterBangaDateDisplay');
          if (disp) disp.innerText = dateVal;
        } else {
          currentSalesDateFilter = new Date(y, m, d);
          currentSalesMonthFilter = { month: m, year: y };
          const disp = document.getElementById('filterSalesDateDisplay');
          if (disp) disp.innerText = dateVal;
        }
      }

      tempCart = [];
      updateCartUI();
      closeTicketModal();
      renderSalesTable(salesDatabase);
      renderBangaTable(bangaDatabase);
      alert(`Đã tạo phiếu ${targetList} thành công!`);
    }

    /* ============================================================
       CHỨC NĂNG NHẬP / XUẤT EXCEL TAB BÁN HÀNG
       ============================================================ */
    function toggleSalesExcelActions() {
      const box = document.getElementById('salesExcelActionsBox');
      const arrow = document.getElementById('salesExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleSalesExcelActions = toggleSalesExcelActions;

    /* ============================================================
       XUẤT EXCEL BÁN HÀNG THEO NGÀY, THÁNG, NĂM HOẶC TẤT CẢ DÙNG SHEETJS (.XLSX)
       ============================================================ */
    function openSalesExportModal() {
      const modal = document.getElementById('salesExportModal');
      if (modal) {
        modal.style.display = 'flex';
        updateSalesExportModalUI();
      } else {
        exportSalesToExcel('full');
      }
    }
    window.openSalesExportModal = openSalesExportModal;

    function closeSalesExportModal() {
      const modal = document.getElementById('salesExportModal');
      if (modal) modal.style.display = 'none';
    }
    window.closeSalesExportModal = closeSalesExportModal;

    function exportSalesToExcel(type) {
      if (!type) {
        openSalesExportModal();
      } else {
        executeExportSales(type);
      }
    }
    window.exportSalesToExcel = exportSalesToExcel;

    function getSalesDataForExport() {
      if (!Array.isArray(salesDatabase)) return [];
      return salesDatabase.filter(isSaleItemMatchingCurrentFilter);
    }

    function updateSalesExportModalUI() {
      const disp = document.getElementById('exportSalesMonthDisplay');
      const countDisp = document.getElementById('exportSalesCountText');
      let scopeLabel = getCurrentSalesScopeLabel();

      if (disp) {
        disp.innerText = scopeLabel;
      }

      const items = getSalesDataForExport();
      if (countDisp) {
        if (items.length > 0) {
          countDisp.innerHTML = `Tìm thấy <strong style="color: #10b981; font-size: 1.05rem;">${items.length}</strong> phiếu bán hàng thuộc <strong>${scopeLabel}</strong> sẵn sàng xuất.`;
        } else {
          countDisp.innerHTML = `<span style="color: #f87171;">Không có phiếu bán hàng nào thuộc <strong>${scopeLabel}</strong> để xuất.</span>`;
        }
      }
    }
    window.updateSalesExportModalUI = updateSalesExportModalUI;

    function executeExportSales(type) {
      const items = getSalesDataForExport();
      let scopeLabel = getCurrentSalesScopeLabel();
      if (items.length === 0) {
        alert(`Không có phiếu bán hàng nào phù hợp với [${scopeLabel}] để xuất!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (salesViewMode === 'day') {
        const dd = String(currentSalesDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentSalesDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentSalesDateFilter.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (salesViewMode === 'month') {
        const mm = String(currentSalesMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSalesMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (salesViewMode === 'year') {
        timeSuffix = `Nam_${currentSalesYearFilter}`;
      }

      let headerArr = [];
      let rowsArr = [];
      let colsArr = [];
      let fileName = "";
      let sheetName = "";

      if (type === 'full') {
        // Kiểu 1: Đầy đủ thông tin
        fileName = `KimChiMobile_BanHang_DayDu_${timeSuffix}`;
        sheetName = `BanHang_${timeSuffix}`;
        headerArr = ["Mã Phiếu", "Tên Hàng Hóa", "Giá Bán", "Giá Nhập", "Lãi", "Hình Thức", "Giờ - Ngày Bán", "Khách Hàng"];
        colsArr = [
          { wch: 18 }, // Mã Phiếu
          { wch: 35 }, // Tên Hàng Hóa
          { wch: 15 }, // Giá Bán
          { wch: 15 }, // Giá Nhập
          { wch: 15 }, // Lãi
          { wch: 16 }, // Hình Thức
          { wch: 22 }, // Giờ - Ngày Bán
          { wch: 20 }  // Khách Hàng
        ];

        rowsArr = items.map(item => {
          let id = String(item.id || '');
          let name = String(item.name || '');
          let totalNum = parsePriceNum(item.total || item.price);
          let priceInNum = parsePriceNum(item.priceIn);
          let profitNum = item.profit !== undefined && item.profit !== null && item.profit !== '' 
            ? parsePriceNum(item.profit) 
            : (totalNum - priceInNum);
          let method = String(item.method || '');
          let dateTime = String(item.dateTime || '');
          let customer = String(item.customer || 'Khách lẻ');
          return [id, name, totalNum, priceInNum, profitNum, method, dateTime, customer];
        });
      } else {
        // Kiểu 2: Rút gọn (Tên hàng, Giá bán, Hình thức, Giờ, Ngày bán)
        fileName = `KimChiMobile_BanHang_RutGon_${timeSuffix}`;
        sheetName = `BanHang_RutGon_${timeSuffix}`;
        headerArr = ["Tên Hàng Hóa", "Giá Bán", "Hình Thức", "Giờ", "Ngày Bán"];
        colsArr = [
          { wch: 38 }, // Tên Hàng Hóa
          { wch: 16 }, // Giá Bán
          { wch: 18 }, // Hình Thức
          { wch: 12 }, // Giờ
          { wch: 16 }  // Ngày Bán
        ];

        rowsArr = items.map(item => {
          let name = String(item.name || '');
          let totalNum = parsePriceNum(item.total || item.price);
          let method = String(item.method || '');
          let dateTime = String(item.dateTime || '');
          let timeVal = '';
          let dateVal = dateTime;
          if (dateTime.includes(' - ')) {
            let parts = dateTime.split(' - ');
            timeVal = parts[0].trim();
            dateVal = parts[1].trim();
          }
          return [name, totalNum, method, timeVal, dateVal];
        });
      }

      // 1. Xuất file chuẩn Microsoft Excel .xlsx bằng thư viện SheetJS
      if (typeof XLSX !== 'undefined') {
        try {
          const aoa = [headerArr, ...rowsArr];
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          ws['!cols'] = colsArr;
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          if (typeof closeSalesExportModal === 'function') closeSalesExportModal();
          alert(`Đã xuất thành công ${items.length} phiếu (${type === 'full' ? 'Kiểu 1: Đầy đủ' : 'Kiểu 2: Rút gọn'}) ra file Excel: ${fileName}.xlsx`);
          return;
        } catch (err) {
          console.warn("Lỗi xuất file XLSX qua SheetJS, chuyển sang CSV fallback:", err);
        }
      }

      // 2. Fallback CSV UTF-8 với BOM nếu không load được XLSX
      let csvContent = "\uFEFF";
      csvContent += headerArr.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\n';
      rowsArr.forEach(row => {
        csvContent += row.map(c => `"${String(c !== undefined && c !== null ? c : '').replace(/"/g, '""')}"`).join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (typeof closeSalesExportModal === 'function') closeSalesExportModal();
      alert(`Đã xuất thành công ${items.length} phiếu Bán Hàng!`);
    }
    window.executeExportSales = executeExportSales;

    function triggerImportSalesExcel() {
      const fileInput = document.getElementById('salesExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportSalesExcel = triggerImportSalesExcel;

    function getCurrentVietnamDateTimeStr() {
      return `${getCurrentTimeStr()} - ${getCurrentDateStr()}`;
    }
    window.getCurrentVietnamDateTimeStr = getCurrentVietnamDateTimeStr;

    function formatImportDateTime(val) {
      if (!val) return getCurrentVietnamDateTimeStr();

      // Nếu là Date object hợp lệ
      if (val instanceof Date && !isNaN(val.getTime())) {
        const hh = String(val.getHours()).padStart(2, '0');
        const min = String(val.getMinutes()).padStart(2, '0');
        const dd = String(val.getDate()).padStart(2, '0');
        const mm = String(val.getMonth() + 1).padStart(2, '0');
        const yyyy = val.getFullYear();
        return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
      }

      // Nếu là số serial date của Excel (khoảng 20000 -> 90000)
      if (typeof val === 'number' && !isNaN(val) && val > 20000 && val < 90000) {
        try {
          const date = new Date(Math.round((val - 25569) * 86400 * 1000));
          const hh = String(date.getUTCHours()).padStart(2, '0');
          const min = String(date.getUTCMinutes()).padStart(2, '0');
          const dd = String(date.getUTCDate()).padStart(2, '0');
          const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
          const yyyy = date.getUTCFullYear();
          return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
        } catch (e) {}
      }

      let s = String(val).trim();
      if (!s) return getCurrentVietnamDateTimeStr();

      // Dạng đặc biệt từ Excel Sửa Chữa: "DD-MMYYYYHH:mm" (ví dụ: "29-09202623:22" hoặc "26-10202620:10")
      let mCondensed = s.match(/^(\d{1,2})[\/\-](\d{1,2})(\d{4})(\d{1,2}):(\d{2})$/);
      if (mCondensed) {
        let dd = mCondensed[1].padStart(2, '0');
        let mm = mCondensed[2].padStart(2, '0');
        let yyyy = mCondensed[3];
        let hh = mCondensed[4].padStart(2, '0');
        let min = mCondensed[5].padStart(2, '0');
        return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
      }

      // Dạng "DD-MM-YYYY HH:mm" hoặc "DD-MM-YYYYHH:mm"
      let mCondensed2 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s*(\d{1,2}):(\d{2})$/);
      if (mCondensed2) {
        let dd = mCondensed2[1].padStart(2, '0');
        let mm = mCondensed2[2].padStart(2, '0');
        let yyyy = mCondensed2[3];
        let hh = mCondensed2[4].padStart(2, '0');
        let min = mCondensed2[5].padStart(2, '0');
        return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
      }

      // Dạng 1: Chuẩn "HH:mm - DD/MM/YYYY" hoặc "HH:mm-DD/MM/YYYY"
      let mExact = s.match(/^(\d{1,2}):(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mExact) {
        return `${mExact[1].padStart(2, '0')}:${mExact[2].padStart(2, '0')} - ${mExact[3].padStart(2, '0')}/${mExact[4].padStart(2, '0')}/${mExact[5]}`;
      }

      // Dạng 2: ISO "YYYY-MM-DDTHH:mm" hoặc "YYYY-MM-DD HH:mm" (ví dụ: 2026-10-25T19:31)
      let mIso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T\s](\d{1,2}):(\d{1,2})(?::\d{1,2})?/);
      if (mIso) {
        return `${mIso[4].padStart(2, '0')}:${mIso[5].padStart(2, '0')} - ${mIso[3].padStart(2, '0')}/${mIso[2].padStart(2, '0')}/${mIso[1]}`;
      }

      // Dạng 3: "DD/MM/YYYY HH:mm" hoặc "DD-MM-YYYY HH:mm"
      let mDmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})[\sT]+(\d{1,2}):(\d{1,2})/);
      if (mDmy) {
        return `${mDmy[4].padStart(2, '0')}:${mDmy[5].padStart(2, '0')} - ${mDmy[1].padStart(2, '0')}/${mDmy[2].padStart(2, '0')}/${mDmy[3]}`;
      }

      // Dạng 4: Chỉ có ngày "YYYY-MM-DD"
      let mOnlyYmd = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (mOnlyYmd) {
        return `${getCurrentTimeStr()} - ${mOnlyYmd[3].padStart(2, '0')}/${mOnlyYmd[2].padStart(2, '0')}/${mOnlyYmd[1]}`;
      }

      // Dạng 5: Chỉ có ngày "DD/MM/YYYY"
      let mOnlyDmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mOnlyDmy) {
        return `${getCurrentTimeStr()} - ${mOnlyDmy[1].padStart(2, '0')}/${mOnlyDmy[2].padStart(2, '0')}/${mOnlyDmy[3]}`;
      }

      // Thử dùng Date.parse
      let parsed = new Date(s);
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
        const hh = String(parsed.getHours()).padStart(2, '0');
        const min = String(parsed.getMinutes()).padStart(2, '0');
        const dd = String(parsed.getDate()).padStart(2, '0');
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const yyyy = parsed.getFullYear();
        return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
      }

      return getCurrentVietnamDateTimeStr();
    }
    window.formatImportDateTime = formatImportDateTime;

    function normalizePaymentMethod(val) {
      if (!val) return 'Tiền mặt';
      let str = String(val).trim();
      let clean = str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      // Kiểm tra Chuyển khoản / Chuyển tiền / Banking / CK
      if (
        clean.includes('chuyen') || 
        clean.includes('khoan') || 
        clean.includes('tien chuyen') ||
        clean.includes('chuyen tien') ||
        clean.includes('ck') || 
        clean.includes('bank') || 
        clean.includes('atm') || 
        clean.includes('the') || 
        clean.includes('quet') || 
        clean.includes('vi') ||
        /^(ck|bank)$/i.test(str)
      ) {
        return 'Chuyển khoản';
      }

      // Kiểm tra Nợ
      if (clean.includes('no') || clean.includes('dai') || clean.includes('chua')) {
        return 'Nợ';
      }

      return 'Tiền mặt';
    }
    window.normalizePaymentMethod = normalizePaymentMethod;

    function handleImportSalesExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];

          // Sử dụng thư viện SheetJS XLSX để đọc file .xlsx, .xls, .csv
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          } else {
            // Dự phòng text nếu không có XLSX
            const textDecoder = new TextDecoder('utf-8');
            const content = textDecoder.decode(e.target.result);
            const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let startIndex = 1; // Mặc định dòng đầu là header
          let headerRow = rows[0];

          // Chuẩn hóa header (bỏ dấu tiếng Việt, chữ thường)
          let cleanHeader = headerRow.map(h => 
            String(h || '')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .trim()
          );

          let colIdxDate = -1;
          let colIdxCustomer = -1;
          let colIdxName = -1;
          let colIdxPrice = -1;
          let colIdxPriceIn = -1;
          let colIdxProfit = -1;
          let colIdxMethod = -1;

          cleanHeader.forEach((col, idx) => {
            // Ưu tiên 1: Cột ngày giờ bán
            if (col.includes('gio') || col.includes('ngay') || col.includes('thoi gian')) {
              colIdxDate = idx;
            }
            // Ưu tiên 2: Cột khách hàng
            else if (col.includes('khach') || col.includes('mua') || col.includes('customer')) {
              colIdxCustomer = idx;
            }
            // Ưu tiên 3: Tên hàng hóa
            else if (col.includes('ten') || col.includes('hang') || col.includes('may') || col.includes('san pham') || col.includes('phu kien')) {
              colIdxName = idx;
            }
            // Ưu tiên 4: Giá nhập / vốn
            else if (col.includes('gia nhap') || col.includes('nhap') || col.includes('von')) {
              colIdxPriceIn = idx;
            }
            // Ưu tiên 5: Lãi / lợi nhuận
            else if (col.includes('lai') || col.includes('loi nhuan')) {
              colIdxProfit = idx;
            }
            // Ưu tiên 6: Giá bán / Tổng tiền (không dính chữ ngày, giờ)
            else if (col.includes('gia ban') || col.includes('tong') || (col.includes('ban') && !col.includes('ngay') && !col.includes('gio'))) {
              colIdxPrice = idx;
            }
            // Ưu tiên 7: Hình thức thanh toán
            else if (col.includes('hinh thuc') || col.includes('thanh toan') || col.includes('phuong thuc') || col.includes('method') || col.includes('httt')) {
              colIdxMethod = idx;
            }
          });

          // Nếu không map được tên sản phẩm, fallback kiểm tra nếu dòng 0 có header hay là data luôn
          if (colIdxName === -1 && colIdxPrice === -1) {
            // Cấu trúc mặc định 7 cột của Kim Chi Mobile (như trong file 222222.xlsx):
            // 0: Giờ - Ngày bán | 1: Khách hàng | 2: Tên hàng hóa | 3: Giá bán | 4: Giá nhập | 5: Lãi | 6: Hình thức
            colIdxDate = 0;
            colIdxCustomer = 1;
            colIdxName = 2;
            colIdxPrice = 3;
            colIdxPriceIn = 4;
            colIdxProfit = 5;
            colIdxMethod = 6;
            startIndex = 1;
          }

          // Đảm bảo colIdxMethod luôn có giá trị (mặc định cột 6 nếu có >= 7 cột)
          if (colIdxMethod === -1) {
            colIdxMethod = 6;
          }

          let newRecords = [];
          let updatedRecords = [];
          let updatedCount = 0;

          for (let i = startIndex; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let name = '';
            let rawPrice = '0';
            let rawPriceIn = '0';
            let rawProfit = '';
            let rawMethod = '';
            let rawDate = '';
            let customer = 'Khách lẻ';

            if (colIdxName !== -1 && row[colIdxName] !== undefined) {
              name = String(row[colIdxName]).trim();
              if (colIdxPrice !== -1 && row[colIdxPrice] !== undefined) rawPrice = String(row[colIdxPrice]).trim();
              if (colIdxPriceIn !== -1 && row[colIdxPriceIn] !== undefined) rawPriceIn = String(row[colIdxPriceIn]).trim();
              if (colIdxProfit !== -1 && row[colIdxProfit] !== undefined) rawProfit = String(row[colIdxProfit]).trim();
              if (colIdxMethod !== -1 && row[colIdxMethod] !== undefined && row[colIdxMethod] !== null) rawMethod = row[colIdxMethod];
              if (colIdxDate !== -1 && row[colIdxDate] !== undefined) rawDate = row[colIdxDate];
              if (colIdxCustomer !== -1 && row[colIdxCustomer]) customer = String(row[colIdxCustomer]).trim();
            } else {
              rawDate = row[0] || '';
              customer = String(row[1] || 'Khách lẻ').trim();
              name = String(row[2] || '').trim();
              rawPrice = String(row[3] || '0').trim();
              rawPriceIn = String(row[4] || '0').trim();
              rawProfit = String(row[5] || '').trim();
              rawMethod = row[6] || '';
            }

            // Nếu ô hình thức đang trống, kiểm tra cột 6
            if (!rawMethod && row[6] !== undefined && row[6] !== null) {
              rawMethod = row[6];
            }

            if (!name) continue;

            // Chuẩn hóa tên và khách hàng
            name = toTitleCase(name);
            customer = customer ? toTitleCase(customer) : 'Khách lẻ';

            // Chuẩn hóa số tiền
            let totalNum = parsePriceNum(rawPrice);
            let priceInNum = parsePriceNum(rawPriceIn);
            let profitNum = rawProfit ? parsePriceNum(rawProfit) : (totalNum - priceInNum);

            let total = formatPriceStr(totalNum);
            let priceIn = formatPriceStr(priceInNum);
            let profit = profitNum < 0 ? `-${formatPriceStr(Math.abs(profitNum))}` : formatPriceStr(profitNum);

            // Chuẩn hóa hình thức thanh toán (hỗ trợ không dấu, Chuyển khoản, Tiền mặt, Nợ)
            let method = normalizePaymentMethod(rawMethod);
            let paymentStatus = (method === 'Nợ') ? 'Nợ Dai VL' : 'Đã Trả';

            // Chuẩn hóa ngày giờ sang dạng "HH:mm - DD/MM/YYYY"
            let dateTime = formatImportDateTime(rawDate);


            // Kiểm tra xem đơn hàng này đã tồn tại trong salesDatabase chưa (theo dateTime + name + totalNum)
            let existingItem = salesDatabase.find(s => 
              s.dateTime === dateTime && 
              s.name.toLowerCase().trim() === name.toLowerCase().trim() &&
              parsePriceNum(s.total) === totalNum
            );

            if (existingItem) {
              // Cập nhật lại hình thức thanh toán chuẩn từ file Excel (tránh tạo đơn trùng lặp)
              existingItem.method = method;
              existingItem.paymentStatus = paymentStatus;
              existingItem.priceIn = priceIn;
              existingItem.profit = profit;
              existingItem.customer = customer;
              updatedCount++;
            } else {
              let newRecord = {
                id: Date.now() + Math.random(),
                name: name,
                total: total,
                priceIn: priceIn,
                profit: profit,
                method: method,
                dateTime: dateTime,
                customer: customer,
                paymentStatus: paymentStatus
              };
              newRecords.push(newRecord);
            }
          }

          if (newRecords.length > 0 || updatedCount > 0) {
            // Thêm các bản ghi mới vào mảng
            if (newRecords.length > 0) {
              salesDatabase.push(...newRecords);
            }

            // Tự động sắp xếp toàn bộ danh sách bán hàng theo thời gian mới nhất lên đầu
            salesDatabase.sort((a, b) => {
              let getTs = (dtStr) => {
                if (!dtStr) return 0;
                let parts = String(dtStr).split(' - ');
                if (parts.length >= 2) {
                  let [hh, min] = parts[0].split(':').map(n => parseInt(n, 10) || 0);
                  let [d, m, y] = parts[1].split('/').map(n => parseInt(n, 10) || 0);
                  return new Date(y, m - 1, d, hh, min).getTime();
                }
                let t = new Date(dtStr).getTime();
                return isNaN(t) ? 0 : t;
              };
              return getTs(b.dateTime) - getTs(a.dateTime);
            });

            saveSalesStorage();

            // Hiển thị lại bảng theo đúng chế độ lọc thời gian hiện tại
            renderSalesTable(salesDatabase);

            let scopeLabel = getCurrentSalesScopeLabel();
            let msg = '';
            if (updatedCount > 0 && newRecords.length > 0) {
              msg = `Đã nhập thêm ${newRecords.length} phiếu mới và cập nhật chính xác cho ${updatedCount} phiếu thuộc [${scopeLabel}]!`;
            } else if (updatedCount > 0) {
              msg = `Đã cập nhật chuẩn xác thông tin cho ${updatedCount} phiếu thuộc [${scopeLabel}] từ file Excel!`;
            } else {
              msg = `Đã nhập thành công ${newRecords.length} phiếu bán hàng thuộc [${scopeLabel}] từ file Excel!`;
            }
            alert(msg);
          } else {
            let scopeLabel = getCurrentSalesScopeLabel();
            alert(`Không tìm thấy dữ liệu hàng hóa nào phù hợp với phạm vi [${scopeLabel}] trong file Excel!`);
          }
        } catch (err) {
          console.error("Lỗi đọc file Excel:", err);
          alert("Có lỗi khi đọc file Excel: " + (err.message || "Vui lòng kiểm tra lại file!"));
        }
      };

      reader.readAsArrayBuffer(file);
    }
    window.handleImportSalesExcelFile = handleImportSalesExcelFile;

    /* ============================================================
       HELPER XUẤT EXCEL DÙNG SHEETJS XLSX (HOẶC FALLBACK CSV UTF-8)
       ============================================================ */
    function exportAoaToExcelOrCsv(headerArr, rowsArr, defaultFileName, sheetTitle) {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const fullFileName = `${defaultFileName}_${dd}_${mm}_${yyyy}`;

      if (typeof XLSX !== 'undefined') {
        try {
          const aoa = [headerArr, ...rowsArr];
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          XLSX.utils.book_append_sheet(wb, ws, sheetTitle || "Sheet1");
          XLSX.writeFile(wb, `${fullFileName}.xlsx`);
          return;
        } catch (err) {
          console.warn("Lỗi xuất file qua XLSX, chuyển sang CSV UTF-8:", err);
        }
      }

      // Fallback CSV UTF-8 kèm BOM
      let csvContent = "\uFEFF";
      csvContent += headerArr.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\n';
      rowsArr.forEach(row => {
        csvContent += row.map(c => `"${String(c !== undefined && c !== null ? c : '').replace(/"/g, '""')}"`).join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fullFileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    /* ============================================================
       1. CHỨC NĂNG EXCEL TAB PHẦN MỀM
       ============================================================ */
    function toggleSoftwareExcelActions() {
      const box = document.getElementById('swExcelActionsBox');
      const arrow = document.getElementById('swExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleSoftwareExcelActions = toggleSoftwareExcelActions;

    function triggerImportSoftwareExcel() {
      const fileInput = document.getElementById('swExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportSoftwareExcel = triggerImportSoftwareExcel;

    function exportSoftwareToExcel() {
      let scopeLabel = getCurrentSoftwareScopeLabel();
      let itemsToExport = softwareDatabase.filter(isSoftwareItemMatchingCurrentFilter);
      if (!Array.isArray(itemsToExport) || itemsToExport.length === 0) {
        alert(`Không có dữ liệu Phần Mềm nào thuộc [${scopeLabel}] để xuất Excel!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (swViewMode === 'day') {
        const dd = String(swFilterDate.getDate()).padStart(2, '0');
        const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = swFilterDate.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (swViewMode === 'month') {
        const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSoftwareMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (swViewMode === 'year') {
        timeSuffix = `Nam_${currentSoftwareYearFilter}`;
      }

      const headers = ["Mã Đơn", "Khách Hàng", "Thiết Bị / Phần Mềm", "Giá Bán", "Giá Vốn", "Tiền Lãi", "Giờ", "Ngày Tháng", "Năm", "Trạng Thái Thanh Toán"];
      const rows = itemsToExport.map(item => [
        item.id || '',
        item.customer || '',
        item.device || '',
        item.price || '0',
        item.cost || '0',
        item.profit || '0',
        item.time || '',
        item.dayMonth || '',
        item.year || '',
        item.paymentStatus || 'ĐÃ TRẢ'
      ]);
      exportAoaToExcelOrCsv(headers, rows, `KimChiMobile_PhanMem_${timeSuffix}`, "PhanMem");
      alert(`Đã xuất thành công ${itemsToExport.length} đơn Phần Mềm (${scopeLabel}) ra file Excel!`);
    }
    window.exportSoftwareToExcel = exportSoftwareToExcel;

    function clearAllSoftwareData() {
      let scopeLabel = getCurrentSoftwareScopeLabel();
      let itemsToDelete = softwareDatabase.filter(isSoftwareItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có đơn Phần Mềm nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      let confirmText = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} đơn Phần Mềm thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmText === null) return;
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok' || clean === 'đồng ý' || clean === 'dong y') {
        let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));

        // Xóa tài liệu phần mềm trên Firebase Firestore
        if (typeof db !== 'undefined' && db) {
          try {
            itemsToDelete.forEach(item => {
              if (item && item.id) {
                db.collection('software').doc(String(item.id)).delete().catch(console.error);
              }
            });
          } catch(e) {
            console.error("Lỗi xóa Firestore software:", e);
          }
        }

        // Cập nhật lại softwareDatabase: chỉ giữ lại các mục không thuộc phạm vi xóa
        softwareDatabase = softwareDatabase.filter(it => !deleteIds.has(String(it.id)));
        if (softwareDatabase.length === 0) {
          localStorage.setItem('KIMCHI_PHANMEM_CLEARED', 'true');
        }
        try { localStorage.setItem('KIMCHI_PHANMEM_DB', JSON.stringify(softwareDatabase)); } catch(e){}

        if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
        if (typeof renderSwCustomerFilterOptions === 'function') renderSwCustomerFilterOptions();
        if (typeof renderSoftwareDebtTable === 'function' && typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) {
          renderSoftwareDebtTable();
        }
        if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();

        alert(`Đã xóa thành công ${itemsToDelete.length} đơn Phần Mềm thuộc [${scopeLabel}]!`);
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllSoftwareData = clearAllSoftwareData;

    function handleImportSoftwareExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(e.target.result).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let cleanHeader = rows[0].map(h => String(h || '')
            .toLowerCase()
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim());
          let colIdxCustomer = -1, colIdxDevice = -1, colIdxPrice = -1, colIdxCost = -1, colIdxProfit = -1, colIdxTime = -1, colIdxStatus = -1;

          cleanHeader.forEach((col, idx) => {
            if (col.includes('thoi gian') || col.includes('ngay gio') || col.includes('date') || col.includes('time') || col === 'gio' || col === 'ngay') {
              colIdxTime = idx;
            } else if (col.includes('khach') || col.includes('customer') || col === 'tho' || col.includes('ten tho')) {
              colIdxCustomer = idx;
            } else if (col.includes('thiet bi') || col.includes('phan mem') || col.includes('device') || col.includes('ten may') || col.includes('noi dung') || (col.includes('dich vu') && !col.includes('phi'))) {
              colIdxDevice = idx;
            } else if (col.includes('phi') || col.includes('gia nhap') || col.includes('von') || col.includes('cost') || col.includes('chi phi')) {
              colIdxCost = idx;
            } else if (col.includes('lai') || col.includes('loi nhuan') || col.includes('profit') || col.includes('dop')) {
              colIdxProfit = idx;
            } else if (col.includes('bao gia') || col.includes('gia ban') || col.includes('tien') || col.includes('price') || col.includes('thu') || col === 'gia') {
              colIdxPrice = idx;
            } else if (col.includes('trang thai') || col.includes('thanh toan') || col.includes('status') || col.includes('tt')) {
              colIdxStatus = idx;
            }
          });

          // Fallback vị trí nếu không tìm thấy header
          if (colIdxCustomer === -1 && colIdxDevice === -1) {
            colIdxCustomer = 0; colIdxDevice = 1; colIdxPrice = 2; colIdxCost = 3; colIdxProfit = 4; colIdxStatus = 5; colIdxTime = 6;
          }

          let newRecords = [];
          let updatedCount = 0;
          const currentYear = String(new Date().getFullYear());

          // Danh sách dropdown hiện tại trong popup tạo đơn mới
          let currentCustomers = getSwDropdownItems('customer');
          let currentDevices = getSwDropdownItems('device');
          let hasNewCustomer = false;
          let hasNewDevice = false;

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let customer = colIdxCustomer !== -1 && row[colIdxCustomer] ? String(row[colIdxCustomer]).trim() : 'Khách lẻ';
            let device = colIdxDevice !== -1 && row[colIdxDevice] ? String(row[colIdxDevice]).trim() : '';

            // Bỏ qua dòng TỔNG CỘNG nếu có ở cuối bảng
            if (/tong\s*cong|total/i.test(customer.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) continue;

            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? String(row[colIdxPrice]).trim() : '0';
            let rawCost = colIdxCost !== -1 && row[colIdxCost] !== undefined ? String(row[colIdxCost]).trim() : '0';
            let rawProfit = colIdxProfit !== -1 && row[colIdxProfit] !== undefined ? String(row[colIdxProfit]).trim() : '';
            let rawTime = colIdxTime !== -1 && row[colIdxTime] !== undefined ? row[colIdxTime] : '';
            let rawStatus = colIdxStatus !== -1 && row[colIdxStatus] !== undefined ? String(row[colIdxStatus]).trim() : '';

            if (!device && !customer) continue;
            if (!device) device = 'Cài phần mềm';

            let custFormatted = toTitleCase(customer);
            let devFormatted = toTitleCase(device);

            // Tự động lưu Khách hàng và Tên máy vào danh sách popup tạo đơn mới (chưa có thì lưu, có rồi bỏ qua)
            if (custFormatted) {
              let custNorm = custFormatted.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              let existsCust = currentCustomers.some(c => c.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '') === custNorm);
              if (!existsCust) {
                currentCustomers.push(custFormatted);
                hasNewCustomer = true;
              }
            }

            if (devFormatted) {
              let devNorm = devFormatted.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              let existsDev = currentDevices.some(d => d.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '') === devNorm);
              if (!existsDev) {
                currentDevices.push(devFormatted);
                hasNewDevice = true;
              }
            }

            let priceNum = parsePriceNum(rawPrice);
            let costNum = parsePriceNum(rawCost);
            let profitNum = rawProfit ? parsePriceNum(rawProfit) : (priceNum - costNum);

            let priceStr = formatPriceStr(priceNum);
            let costStr = formatPriceStr(costNum);
            let profitStr = formatPriceStr(profitNum);

            // Xử lý ngày giờ
            let dtFormatted = formatImportDateTime(rawTime || rawDayMonth); // "HH:mm - DD/MM/YYYY"
            let timePart = "10:00";
            let dayMonthPart = "01-01";
            let yearPart = currentYear;

            let mDt = dtFormatted.match(/^(\d{1,2}):(\d{1,2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (mDt) {
              timePart = `${mDt[1].padStart(2, '0')}:${mDt[2].padStart(2, '0')}`;
              dayMonthPart = `${mDt[3].padStart(2, '0')}-${mDt[4].padStart(2, '0')}`;
              yearPart = mDt[5];
            } else if (rawDayMonth) {
              let rawStr = String(rawDayMonth).trim();
              let mParts = rawStr.split(/[-/]/);
              if (mParts.length >= 2) {
                dayMonthPart = `${mParts[0].padStart(2, '0')}-${mParts[1].padStart(2, '0')}`;
                if (mParts.length >= 3 && mParts[2].length === 4) {
                  yearPart = mParts[2];
                }
              }
            }
            if (rawYear && /^\d{4}$/.test(rawYear)) {
              yearPart = rawYear;
            }

            // Kiểm tra xem đơn Phần Mềm này có khớp với phạm vi thời gian đang chọn (Ngày/Tháng/Năm/Tất Cả) hay không
            let checkItem = { dayMonth: dayMonthPart, year: yearPart };
            if (!isSoftwareItemMatchingCurrentFilter(checkItem)) {
              continue;
            }

            // Xử lý thanh toán
            let statusClean = rawStatus.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            let paymentStatus = (statusClean.includes('no') || statusClean.includes('dai') || statusClean.includes('chua')) ? 'NỢ DAI' : 'ĐÃ TRẢ';

            // Kiểm tra trùng lặp
            let existing = softwareDatabase.find(s => 
              s.customer.toLowerCase().trim() === customer.toLowerCase() &&
              s.device.toLowerCase().trim() === device.toLowerCase() &&
              s.dayMonth === dayMonthPart &&
              s.year === yearPart &&
              s.time === timePart
            );

            if (existing) {
              existing.price = priceStr;
              existing.cost = costStr;
              existing.profit = profitStr;
              existing.paymentStatus = paymentStatus;
              updatedCount++;
            } else {
              newRecords.push({
                id: Date.now() + Math.random(),
                customer: custFormatted,
                device: devFormatted,
                price: priceStr,
                cost: costStr,
                profit: profitStr,
                dayMonth: dayMonthPart,
                year: yearPart,
                time: timePart,
                paymentStatus: paymentStatus,
                selected: false
              });
            }
          }

          // Lưu danh sách gợi ý vào popup tạo đơn mới nếu có mục mới
          if (hasNewCustomer) {
            saveSwDropdownItems('customer', currentCustomers);
          }
          if (hasNewDevice) {
            saveSwDropdownItems('device', currentDevices);
          }

          if (newRecords.length > 0 || updatedCount > 0) {
            if (newRecords.length > 0) softwareDatabase.push(...newRecords);
            // Bỏ cờ cleared nếu có
            localStorage.removeItem('KIMCHI_PHANMEM_CLEARED');
            saveSoftwareStorage();
            if (typeof setSoftwareMode === 'function') setSoftwareMode('all');
            else if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
            alert(`Đã nhập thành công ${newRecords.length} đơn Phần Mềm mới và cập nhật ${updatedCount} đơn!\n(Đã tự động đồng bộ danh sách Khách hàng và Tên máy vào popup tạo đơn mới)`);
          } else {
            alert("Không tìm thấy dữ liệu Phần Mềm hợp lệ trong file!");
          }
        } catch (err) {
          console.error("Lỗi đọc file Excel Phần Mềm:", err);
          alert("Lỗi khi đọc file: " + (err.message || "Vui lòng kiểm tra file Excel!"));
        }
      };
      reader.readAsArrayBuffer(file);
    }
    window.handleImportSoftwareExcelFile = handleImportSoftwareExcelFile;

    /* ============================================================
       2. CHỨC NĂNG EXCEL TAB SỬA CHỮA
       ============================================================ */
    function toggleRepairExcelActions() {
      const box = document.getElementById('repairExcelActionsBox');
      const arrow = document.getElementById('repairExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleRepairExcelActions = toggleRepairExcelActions;

    function triggerImportRepairExcel() {
      const fileInput = document.getElementById('repairExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportRepairExcel = triggerImportRepairExcel;

    function exportRepairToExcel() {
      let scopeLabel = getCurrentRepairScopeLabel();
      let itemsToExport = repairDatabase.filter(isRepairItemMatchingCurrentFilter);
      if (!Array.isArray(itemsToExport) || itemsToExport.length === 0) {
        alert(`Không có dữ liệu Sửa Chữa nào thuộc [${scopeLabel}] để xuất Excel!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (repairViewMode === 'day') {
        const dd = String(repairFilterDate.getDate()).padStart(2, '0');
        const mm = String(repairFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = repairFilterDate.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (repairViewMode === 'month') {
        const mm = String(currentRepairMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentRepairMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (repairViewMode === 'year') {
        timeSuffix = `Nam_${currentRepairYearFilter}`;
      }

      const headers = ["Mã Đơn", "Khách Hàng", "Tên Máy", "Tình Trạng / Lỗi", "Tiền Sửa", "Tiền Linh Kiện", "Lãi", "Ngày Nhận / Sửa", "Giờ", "Trạng Thái", "Hình Thức"];
      const rows = itemsToExport.map(item => [
        item.id || '',
        item.customer || '',
        item.device || '',
        item.issue || '',
        item.price || 0,
        item.cost || 0,
        item.profit || 0,
        item.dateFormatted || '',
        item.timeFormatted || '',
        item.status || 'Đã thanh toán',
        item.method || 'Tiền mặt'
      ]);
      exportAoaToExcelOrCsv(headers, rows, `KimChiMobile_SuaChua_${timeSuffix}`, "SuaChua");
      alert(`Đã xuất thành công ${itemsToExport.length} phiếu Sửa Chữa (${scopeLabel}) ra file Excel!`);
    }
    window.exportRepairToExcel = exportRepairToExcel;

    function clearAllRepairData() {
      let scopeLabel = getCurrentRepairScopeLabel();
      let itemsToDelete = repairDatabase.filter(isRepairItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có phiếu Sửa Chữa nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      let confirmText = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} phiếu Sửa Chữa thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmText === null) return;
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok' || clean === 'đồng ý' || clean === 'dong y') {
        let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));

        // Xóa tài liệu sửa chữa trên Firebase Firestore nếu có
        if (typeof db !== 'undefined' && db) {
          try {
            itemsToDelete.forEach(item => {
              if (item && item.id) {
                db.collection('repairs').doc(String(item.id)).delete().catch(console.error);
              }
            });
          } catch(e) {
            console.error("Lỗi xóa Firestore repairs:", e);
          }
        }

        // Cập nhật lại repairDatabase
        repairDatabase = repairDatabase.filter(it => !deleteIds.has(String(it.id)));
        if (repairDatabase.length === 0) {
          localStorage.setItem('KIMCHI_REPAIR_CLEARED', 'true');
        }
        saveRepairDb();
        if (typeof renderRepairTable === 'function') renderRepairTable();
        alert(`Đã xóa thành công ${itemsToDelete.length} phiếu Sửa Chữa thuộc [${scopeLabel}]!`);
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllRepairData = clearAllRepairData;

    function handleImportRepairExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(e.target.result).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let cleanHeader = rows[0].map(h => String(h || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
          let colIdxCustomer = -1, colIdxDevice = -1, colIdxIssue = -1, colIdxWarranty = -1, colIdxPrice = -1, colIdxCost = -1, colIdxProfit = -1, colIdxDate = -1, colIdxTime = -1, colIdxStatus = -1, colIdxMethod = -1;

          cleanHeader.forEach((col, idx) => {
            if (col.includes('khach') || col.includes('customer')) colIdxCustomer = idx;
            else if (col.includes('ten may') || (col.includes('may') && !col.includes('ngay')) || col.includes('device') || col.includes('model')) colIdxDevice = idx;
            else if (col.includes('tinh trang') || col.includes('loi') || col.includes('issue') || col.includes('noi dung') || col.includes('benh')) colIdxIssue = idx;
            else if (col.includes('bao hanh') || col.includes('warranty') || col === 'bh') colIdxWarranty = idx;
            else if (col.includes('bao gia') || col.includes('tien sua') || col.includes('gia sua') || col.includes('gia ban') || col.includes('tong') || (col.includes('gia') && !col.includes('nhap') && !col.includes('von'))) colIdxPrice = idx;
            else if (col.includes('phi dich vu') || col.includes('linh kien') || col.includes('von') || col.includes('gia nhap') || col.includes('cost')) colIdxCost = idx;
            else if (col.includes('lai') || col.includes('loi nhuan') || col.includes('profit')) colIdxProfit = idx;
            else if (col.includes('ngay') || col.includes('date')) colIdxDate = idx;
            else if (col.includes('gio') || col.includes('time')) colIdxTime = idx;
            else if (col.includes('trang thai') || col.includes('status') || (col.includes('thanh toan') && !col.includes('hinh thuc'))) colIdxStatus = idx;
            else if (col.includes('hinh thuc') || col.includes('phuong thuc') || col.includes('method') || col.includes('hinh thuc tt')) colIdxMethod = idx;
          });

          if (colIdxDevice === -1 && colIdxIssue === -1) {
            colIdxCustomer = 0; colIdxDevice = 1; colIdxIssue = 2; colIdxWarranty = 3;
            colIdxPrice = 4; colIdxCost = 5; colIdxProfit = 6; colIdxDate = 7; colIdxStatus = 8; colIdxMethod = 9;
          }

          let newRecords = [];
          let updatedCount = 0;

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let customer = colIdxCustomer !== -1 && row[colIdxCustomer] ? String(row[colIdxCustomer]).trim() : 'Khách lẻ';
            let device = colIdxDevice !== -1 && row[colIdxDevice] ? String(row[colIdxDevice]).trim() : '';
            let issue = colIdxIssue !== -1 && row[colIdxIssue] ? String(row[colIdxIssue]).trim() : 'Sửa chữa';
            let rawWarranty = colIdxWarranty !== -1 && row[colIdxWarranty] !== undefined ? String(row[colIdxWarranty]).trim() : '';
            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? String(row[colIdxPrice]).trim() : '0';
            let rawCost = colIdxCost !== -1 && row[colIdxCost] !== undefined ? String(row[colIdxCost]).trim() : '0';
            let rawProfit = colIdxProfit !== -1 && row[colIdxProfit] !== undefined ? String(row[colIdxProfit]).trim() : '';
            let rawDate = colIdxDate !== -1 && row[colIdxDate] !== undefined ? row[colIdxDate] : '';
            let rawTime = colIdxTime !== -1 && row[colIdxTime] !== undefined ? row[colIdxTime] : '';
            let rawStatus = colIdxStatus !== -1 && row[colIdxStatus] !== undefined ? String(row[colIdxStatus]).trim() : '';
            let rawMethod = colIdxMethod !== -1 && row[colIdxMethod] !== undefined ? String(row[colIdxMethod]).trim() : '';

            if (!device && !customer) continue;
            if (!device) device = 'Điện thoại';

            // Chuẩn hóa bảo hành
            let warranty = '—';
            if (rawWarranty && rawWarranty !== '—') {
              let wLower = rawWarranty.toLowerCase();
              if (wLower.includes('khong') || wLower.includes('không') || wLower === '0' || wLower === '0 bh' || wLower === 'kbh') {
                warranty = '0 Bảo Hành';
              } else {
                warranty = rawWarranty;
              }
            }

            let priceNum = parsePriceNum(rawPrice);
            let costNum = parsePriceNum(rawCost);
            let profitNum = rawProfit ? parsePriceNum(rawProfit) : (priceNum - costNum);

            let dtFormatted = formatImportDateTime(rawDate || rawTime);
            let dateFormatted = getCurrentDateStr();
            let timeFormatted = getCurrentTimeStr();

            let mDt = dtFormatted.match(/^(\d{1,2}:\d{1,2})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})$/);
            if (mDt) {
              timeFormatted = mDt[1];
              dateFormatted = mDt[2];
            }

            // Kiểm tra xem đơn Sửa Chữa có khớp với phạm vi thời gian đang chọn hay không
            let checkItem = { dateFormatted: dateFormatted };
            if (!isRepairItemMatchingCurrentFilter(checkItem)) {
              continue;
            }

            let statusClean = rawStatus.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            let status = (statusClean.includes('no') || statusClean.includes('chua')) ? 'Nợ' : 'Đã thanh toán';
            let method = normalizePaymentMethod(rawMethod);

            let existing = repairDatabase.find(r => 
              r.customer.toLowerCase().trim() === customer.toLowerCase() &&
              r.device.toLowerCase().trim() === device.toLowerCase() &&
              (r.issue || '').toLowerCase().trim() === issue.toLowerCase() &&
              r.dateFormatted === dateFormatted &&
              r.timeFormatted === timeFormatted
            );

            if (existing) {
              existing.issue = issue;
              existing.warranty = warranty;
              existing.price = priceNum;
              existing.cost = costNum;
              existing.profit = profitNum;
              existing.status = status;
              existing.method = method;
              updatedCount++;
            } else {
              newRecords.push({
                id: Date.now() + Math.random(),
                customer: toTitleCase(customer),
                device: toTitleCase(device),
                issue: issue,
                warranty: warranty,
                price: priceNum,
                cost: costNum,
                profit: profitNum,
                dateFormatted: dateFormatted,
                timeFormatted: timeFormatted,
                status: status,
                method: method
              });
            }
          }

          if (newRecords.length > 0 || updatedCount > 0) {
            if (newRecords.length > 0) repairDatabase.push(...newRecords);
            saveRepairDb();
            if (typeof renderRepairTable === 'function') renderRepairTable();
            alert(`Đã nhập thành công ${newRecords.length} phiếu Sửa Chữa mới và cập nhật ${updatedCount} phiếu!`);
          } else {
            alert("Không tìm thấy dữ liệu Sửa Chữa hợp lệ trong file!");
          }
        } catch (err) {
          console.error("Lỗi đọc file Excel Sửa Chữa:", err);
          alert("Lỗi khi đọc file: " + (err.message || "Vui lòng kiểm tra file Excel!"));
        }
      };
      reader.readAsArrayBuffer(file);
    }
    window.handleImportRepairExcelFile = handleImportRepairExcelFile;

    /* ============================================================
       3. CHỨC NĂNG EXCEL TAB BÁN MÁY
       ============================================================ */
    function togglePhoneExcelActions() {
      const box = document.getElementById('phoneExcelActionsBox');
      const arrow = document.getElementById('phoneExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.togglePhoneExcelActions = togglePhoneExcelActions;

    function triggerImportPhoneExcel() {
      const fileInput = document.getElementById('phoneExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportPhoneExcel = triggerImportPhoneExcel;

    function exportPhoneToExcel() {
      if (!Array.isArray(phoneDatabase) || phoneDatabase.length === 0) {
        alert("Chưa có dữ liệu Bán Máy để xuất Excel!");
        return;
      }
      const headers = ["Hãng", "Tên Máy", "Dung Lượng", "Màu Sắc", "IMEI", "Giá Bán", "Giá Nhập", "Tình Trạng", "Trạng Thái Pin", "Pin", "Xuất Xứ", "Ngày Nhập", "Ghi Chú"];
      const rows = phoneDatabase.map(p => [
        p.brand || 'IPHONE',
        p.name || '',
        p.storage || '',
        p.color || '',
        p.imei || '',
        p.price || '0',
        p.priceIn || '0',
        p.condition || 'Zin Đẹp 99%',
        p.pinStatus || 'Pin Zin',
        p.pin || '',
        p.origin || 'VN/A',
        p.date || '',
        p.note || ''
      ]);
      exportAoaToExcelOrCsv(headers, rows, "KimChiMobile_KhoMay", "KhoMay");
      alert(`Đã xuất thành công ${phoneDatabase.length} máy trong kho ra file Excel!`);
    }
    window.exportPhoneToExcel = exportPhoneToExcel;

    function clearAllPhoneData() {
      let confirmText = prompt('⚠️ CẢNH BÁO: Thao tác này sẽ xóa sạch toàn bộ danh sách Máy trong kho Bán Máy!\n\nVui lòng nhập chính xác: "tôi đồng ý xóa" để xác nhận:');
      if (confirmText === null) return;
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok' || clean === 'đồng ý' || clean === 'dong y') {
        phoneDatabase = [];
        localStorage.setItem('KIMCHI_PHONE_CLEARED', 'true');
        savePhoneStorage();
        if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
        alert('Đã xóa sạch toàn bộ máy trong kho Bán Máy thành công!');
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllPhoneData = clearAllPhoneData;

    function handleImportPhoneExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(e.target.result).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let cleanHeader = rows[0].map(h => String(h || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
          let colIdxBrand = -1, colIdxName = -1, colIdxStorage = -1, colIdxColor = -1, colIdxImei = -1, colIdxPrice = -1, colIdxPriceIn = -1, colIdxCondition = -1, colIdxPinStatus = -1, colIdxPin = -1, colIdxOrigin = -1, colIdxStatus = -1, colIdxDate = -1, colIdxSoldDate = -1, colIdxNote = -1;

          cleanHeader.forEach((col, idx) => {
            // Hãng: lấy 'hang', 'brand' nhưng loại trừ 'cua hang' hoặc 'con hang'
            if (col === 'hang' || col === 'brand' || (col.includes('hang') && !col.includes('cua hang') && !col.includes('con hang'))) {
              colIdxBrand = idx;
            }
            // Tên máy: lấy 'ten may', 'model', 'may' (loại trừ 'ngay', 'ma may', 'ban may')
            else if (col.includes('ten may') || (col.includes('may') && !col.includes('ngay') && !col.includes('ma may') && !col.includes('ban may')) || col.includes('model')) {
              colIdxName = idx;
            }
            // Dung lượng bộ nhớ (ROM): 'dung luong', 'bo nho', 'storage', 'rom', 'gb' (nhưng KHÔNG chứa 'pin')
            else if ((col.includes('dung luong') && !col.includes('pin')) || col.includes('bo nho') || col.includes('storage') || col.includes('rom') || (col.includes('gb') && !col.includes('pin'))) {
              colIdxStorage = idx;
            }
            // Màu sắc
            else if (col.includes('mau') || col.includes('color')) {
              colIdxColor = idx;
            }
            // IMEI / Serial
            else if (col.includes('imei') || col.includes('seri')) {
              colIdxImei = idx;
            }
            // Dung lượng pin / % Pin / mAh
            else if (col.includes('dung luong pin') || col.includes('phan tram pin') || col.includes('% pin') || col === '%' || col.includes('battery capacity') || col.includes('mah')) {
              colIdxPin = idx;
            }
            // Trạng thái pin / Loại pin / Cột "pin"
            else if (col === 'pin' || col.includes('loai pin') || col.includes('trang thai pin') || col.includes('tinh trang pin') || col.includes('battery status')) {
              colIdxPinStatus = idx;
            }
            // Giá bán (loại trừ giá nhập, vốn)
            else if (col.includes('gia ban') || col.includes('gia le') || (col.includes('gia') && !col.includes('nhap') && !col.includes('von')) || col.includes('price out')) {
              colIdxPrice = idx;
            }
            // Giá nhập / Giá vốn / Vốn
            else if (col.includes('gia nhap') || col.includes('von') || col.includes('price in') || col.includes('cost')) {
              colIdxPriceIn = idx;
            }
            // Tình trạng máy / Ngoại hình (loại trừ tình trạng pin)
            else if ((col.includes('tinh trang') && !col.includes('pin')) || col.includes('ngoai hinh') || col.includes('condition')) {
              colIdxCondition = idx;
            }
            // Quốc gia / Xuất xứ / Mã máy
            else if (col.includes('quoc gia') || col.includes('xuat xu') || col.includes('ma may') || col.includes('country') || col.includes('origin') || col === 'ma') {
              colIdxOrigin = idx;
            }
            // Trạng thái máy (Còn hàng, Đã bán, Chưa xử lý, Máy Xác)
            else if (col.includes('trang thai') || col.includes('status')) {
              colIdxStatus = idx;
            }
            // Ngày nhập (loại trừ ngày bán)
            else if (col.includes('ngay nhap') || (col.includes('ngay') && !col.includes('ban')) || col.includes('date in') || (col.includes('date') && !col.includes('sold'))) {
              colIdxDate = idx;
            }
            // Ngày bán
            else if (col.includes('ngay ban') || col.includes('sold date') || col.includes('date out')) {
              colIdxSoldDate = idx;
            }
            // Ghi chú
            else if (col.includes('ghi chu') || col.includes('note')) {
              colIdxNote = idx;
            }
          });

          if (colIdxName === -1 && colIdxImei === -1) {
            colIdxBrand = 1; colIdxName = 2; colIdxImei = 3; colIdxColor = 4; colIdxStorage = 5;
            colIdxPin = 6; colIdxPinStatus = 7; colIdxCondition = 8; colIdxOrigin = 9;
            colIdxPriceIn = 11; colIdxPrice = 12; colIdxStatus = 13; colIdxDate = 14; colIdxSoldDate = 15; colIdxNote = 16;
          }

          // Hàm phụ trợ xử lý chuẩn hóa dữ liệu nhập từ Excel
          const parseExcelPrice = (val) => {
            if (val === null || val === undefined || val === '') return '0';
            let str = String(val).trim();
            if (!str) return '0';
            let lower = str.toLowerCase();
            if (lower.includes('tr')) {
              let parts = lower.split('tr');
              let trPart = parseInt(parts[0].replace(/\D/g, ''), 10) || 0;
              let kPart = 0;
              if (parts[1]) {
                let sub = parts[1].replace(/\D/g, '');
                if (sub.length === 1) kPart = parseInt(sub, 10) * 100;
                else if (sub.length === 2) kPart = parseInt(sub, 10) * 10;
                else if (sub.length >= 3) kPart = parseInt(sub.slice(0, 3), 10);
              }
              return formatPriceStr(trPart * 1000 + kPart);
            }
            if (lower.includes('k')) {
              let numK = parseInt(lower.replace(/\D/g, ''), 10) || 0;
              return formatPriceStr(numK);
            }
            let clean = str.replace(/[^\d]/g, '');
            if (!clean) return '0';
            let num = parseInt(clean, 10);
            if (num >= 1000000 && num % 1000 === 0) {
              num = Math.round(num / 1000);
            }
            return formatPriceStr(num);
          };

          const cleanOriginCode = (str) => {
            if (!str) return 'VN/A';
            let s = String(str).trim();
            s = s.replace(/\(.*?\)/g, '').trim();
            let lower = s.toLowerCase().replace(/[\/\s]/g, '');
            if (lower === 'vna') return 'VN/A';
            if (lower === 'lla') return 'LL/A';
            if (lower === 'zaa') return 'ZA/A';
            if (lower === 'kha') return 'KH/A';
            if (lower === 'cha') return 'CH/A';
            if (lower === 'ja') return 'J/A';
            if (lower === 'ea') return 'E/A';
            let match = s.match(/^[A-Za-z0-9]+\/[A-Za-z0-9]+/);
            if (match) return match[0].toUpperCase();
            return s.toUpperCase() || 'VN/A';
          };

          const cleanPinStatus = (status) => {
            if (!status) return 'Pin Zin';
            let s = String(status).trim();
            let lower = s.toLowerCase();
            if (lower === 'zin') return 'Pin Zin';
            if (lower === 'moi' || lower === 'mới') return 'Pin Mới';
            if (lower === 'dung ok' || lower === 'dùng ok' || lower === 'ok') return 'Pin Dùng OK';
            if (lower === 'thay') return 'Pin Thay';
            if (!lower.startsWith('pin') && !lower.includes('pin')) {
              return 'Pin ' + toTitleCase(s);
            }
            return toTitleCase(s);
          };

          const cleanStorageStr = (str) => {
            if (!str) return '128';
            let s = String(str).trim();
            s = s.replace(/^(?:ram|rom)\s*/i, '').trim();
            s = s.replace(/\s*gb$/i, '').trim();
            return s || '128';
          };

          const cleanDeviceName = (name, brand) => {
            if (!name) return '';
            let s = String(name).trim();
            if ((brand && brand.toUpperCase() === 'IPHONE') || !brand) {
              s = s.replace(/^iphone\s+/i, '').trim();
            }
            return toTitleCase(s);
          };

          const cleanColorStr = (color) => {
            if (!color) return 'Trắng';
            return toTitleCase(String(color).trim());
          };

          const formatImportDate = (val) => {
            if (!val) return getCurrentDateStr();
            let s = String(val).trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
              let parts = s.split('-');
              return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return s;
          };

          let isReset = confirm("Bạn có muốn LÀM MỚI KHO THEO FILE EXCEL không?\n\n• Bấm OK: Làm mới kho chuẩn theo đúng file Excel (khuyên dùng để ra đúng 168 máy còn hàng)\n• Bấm Cancel: Giữ máy cũ và chỉ gộp thêm máy mới");
          if (isReset) {
            phoneDatabase = [];
            soldPhoneDatabase = [];
            mainXacDatabase = [];
          }

          let countPhone = 0, countSold = 0, countMainXac = 0;

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let rawBrand = colIdxBrand !== -1 && row[colIdxBrand] ? String(row[colIdxBrand]).trim() : '';
            let rawName = colIdxName !== -1 && row[colIdxName] ? String(row[colIdxName]).trim() : '';
            let imei = colIdxImei !== -1 && row[colIdxImei] ? String(row[colIdxImei]).trim() : '';
            if (!rawName && !imei) continue;

            let bUpper = rawBrand.toUpperCase().trim();
            let brand = bUpper;
            if (!brand) {
              if (isPhoneBrandIphone('', rawName)) brand = 'IPHONE';
              else if (/samsung/i.test(rawName)) brand = 'SAMSUNG';
              else if (/oppo/i.test(rawName)) brand = 'OPPO';
              else if (/realme/i.test(rawName)) brand = 'REALME';
              else if (/redmi/i.test(rawName)) brand = 'REDMI';
              else if (/poco/i.test(rawName)) brand = 'POCO';
              else if (/vivo/i.test(rawName)) brand = 'VIVO';
              else brand = 'KHÁC';
            } else {
              if (brand === 'APPLE') brand = 'IPHONE';
              if (brand === 'XIAOMI') brand = 'REDMI';
            }

            let name = cleanDeviceName(rawName, brand);
            let storage = colIdxStorage !== -1 && row[colIdxStorage] ? cleanStorageStr(row[colIdxStorage]) : '128';
            let color = colIdxColor !== -1 && row[colIdxColor] ? cleanColorStr(row[colIdxColor]) : 'Trắng';
            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? row[colIdxPrice] : '0';
            let rawPriceIn = colIdxPriceIn !== -1 && row[colIdxPriceIn] !== undefined ? row[colIdxPriceIn] : '0';
            let condition = colIdxCondition !== -1 && row[colIdxCondition] ? String(row[colIdxCondition]).trim() : 'Zin Đẹp 99%';
            
            let rawPin = colIdxPin !== -1 && row[colIdxPin] !== undefined ? String(row[colIdxPin]).trim() : '';
            let rawPinStatus = colIdxPinStatus !== -1 && row[colIdxPinStatus] !== undefined ? String(row[colIdxPinStatus]).trim() : '';

            // Tự động nhận diện nếu 2 cột Pin bị đảo ngược hoặc chỉ có 1 cột
            if ((/^(zin|mới|moi|dùng ok|dung ok|thay)/i.test(rawPin)) && (/(\d+%|\d+\s*mah|\b\d{2,3}\b)/i.test(rawPinStatus))) {
              let tmp = rawPin;
              rawPin = rawPinStatus;
              rawPinStatus = tmp;
            }

            let pinStatus = cleanPinStatus(rawPinStatus || 'Zin');
            let pin = formatPinByBrand(rawPin, brand, name);
            let origin = colIdxOrigin !== -1 && row[colIdxOrigin] ? cleanOriginCode(row[colIdxOrigin]) : 'VN/A';
            let rawDate = colIdxDate !== -1 && row[colIdxDate] ? formatImportDate(row[colIdxDate]) : getCurrentDateStr();
            let rawSoldDate = colIdxSoldDate !== -1 && row[colIdxSoldDate] ? formatImportDate(row[colIdxSoldDate]) : '';
            let note = colIdxNote !== -1 && row[colIdxNote] ? String(row[colIdxNote]).trim() : '';

            let priceStr = parseExcelPrice(rawPrice);
            let priceInStr = parseExcelPrice(rawPriceIn);

            let rawStatus = colIdxStatus !== -1 && row[colIdxStatus] ? String(row[colIdxStatus]).trim() : '';
            let cleanSt = rawStatus.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            if (cleanSt.includes('da ban')) {
              // 1. Phân luồng vào BẢO HÀNH (soldPhoneDatabase)
              let soldDateVal = rawSoldDate || rawDate || getCurrentDateStr();
              let soldItem = {
                id: Date.now() + Math.random(),
                brand: brand,
                name: name,
                storage: storage,
                color: color,
                imei: imei,
                price: priceStr,
                priceIn: priceInStr,
                condition: condition,
                pinStatus: pinStatus,
                pin: pin,
                origin: origin,
                date: rawDate,
                soldDate: soldDateVal,
                customer: 'Khách Lẻ',
                warranty: '1 Tháng',
                status: 'Đã bán',
                note: note
              };

              let existingSold = imei ? soldPhoneDatabase.find(p => p.imei && String(p.imei).trim().toLowerCase() === imei.toLowerCase()) : null;
              if (existingSold) {
                Object.assign(existingSold, soldItem, { id: existingSold.id });
              } else {
                soldPhoneDatabase.unshift(soldItem);
              }
              // Dọn dẹp máy khỏi 2 kho còn lại nếu có
              if (imei) {
                phoneDatabase = phoneDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
                mainXacDatabase = mainXacDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
              }
              countSold++;
            } else if (cleanSt.includes('chua xu ly') || cleanSt.includes('xac') || cleanSt.includes('main')) {
              // 2. Phân luồng vào MAIN - XÁC (mainXacDatabase)
              let mxStatus = cleanSt.includes('xac') ? 'Máy Xác' : 'Chưa Xử Lý';
              let mxStorage = storage ? (storage.startsWith('(') ? storage : `(${storage})`) : '';
              let mxName = (brand && brand !== 'IPHONE' && !name.toUpperCase().startsWith(brand.toUpperCase())) ? `${brand} ${name}` : name;
              let mxItem = {
                id: Date.now() + Math.random(),
                brand: brand,
                name: mxName,
                imei: imei,
                color: color,
                storage: mxStorage,
                condition: condition,
                pinStatus: pinStatus,
                pin: pin,
                origin: origin,
                status: mxStatus,
                priceIn: priceInStr || '0',
                price: priceStr || '0',
                note: note,
                date: rawDate
              };

              let existingMx = imei ? mainXacDatabase.find(p => p.imei && String(p.imei).trim().toLowerCase() === imei.toLowerCase()) : null;
              if (existingMx) {
                Object.assign(existingMx, mxItem, { id: existingMx.id });
              } else {
                mainXacDatabase.unshift(mxItem);
              }
              // Dọn dẹp máy khỏi 2 kho còn lại nếu có
              if (imei) {
                phoneDatabase = phoneDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
                soldPhoneDatabase = soldPhoneDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
              }
              countMainXac++;
            } else {
              // 3. Phân luồng vào BÁN MÁY (phoneDatabase)
              let phoneItem = {
                id: Date.now() + Math.random(),
                brand: brand,
                name: name,
                storage: storage,
                color: color,
                imei: imei,
                price: priceStr,
                priceIn: priceInStr,
                condition: condition,
                pinStatus: pinStatus,
                pin: pin,
                origin: origin,
                date: rawDate,
                status: 'Còn Hàng',
                note: note
              };

              let existingPhone = phoneDatabase.find(p => 
                (imei && p.imei && String(p.imei).trim().toLowerCase() === imei.toLowerCase()) ||
                (!imei && p.name.toLowerCase() === name.toLowerCase() && p.color.toLowerCase() === color.toLowerCase() && p.storage === storage)
              );

              if (existingPhone) {
                Object.assign(existingPhone, phoneItem, { id: existingPhone.id });
              } else {
                phoneDatabase.push(phoneItem);
              }
              // Dọn dẹp máy khỏi 2 kho còn lại nếu có
              if (imei) {
                soldPhoneDatabase = soldPhoneDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
                mainXacDatabase = mainXacDatabase.filter(p => !p.imei || String(p.imei).trim().toLowerCase() !== imei.toLowerCase());
              }
              countPhone++;
            }
          }

          if (countPhone > 0 || countSold > 0 || countMainXac > 0) {
            savePhoneStorage();
            if (typeof saveMainXacStorage === 'function') saveMainXacStorage();
            if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
            if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
            if (typeof renderMainXacGrid === 'function') renderMainXacGrid();
            alert(`🎉 ĐÃ NHẬP VÀ PHÂN LUỒNG THÀNH CÔNG:\n\n📱 Bán Máy (Còn hàng): ${countPhone} máy\n🛡️ Bảo Hành (Đã bán): ${countSold} máy\n🔧 Main - Xác (Chưa xử lý & Xác): ${countMainXac} máy`);
          } else {
            alert("Không tìm thấy dữ liệu máy hợp lệ trong file!");
          }
        } catch (err) {
          console.error("Lỗi đọc file Excel Bán Máy:", err);
          alert("Lỗi khi đọc file: " + (err.message || "Vui lòng kiểm tra file Excel!"));
        }
      };
      reader.readAsArrayBuffer(file);
    }
    window.handleImportPhoneExcelFile = handleImportPhoneExcelFile;

    /* ============================================================
       4. CHỨC NĂNG EXCEL TAB BÁN GÀ
       ============================================================ */
    function toggleBangaExcelActions() {
      const box = document.getElementById('bangaExcelActionsBox');
      const arrow = document.getElementById('bangaExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleBangaExcelActions = toggleBangaExcelActions;

    function triggerImportBangaExcel() {
      const fileInput = document.getElementById('bangaExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportBangaExcel = triggerImportBangaExcel;

    function exportBangaToExcel() {
      let scopeLabel = getCurrentBangaScopeLabel();
      let itemsToExport = bangaDatabase.filter(isBangaItemMatchingCurrentFilter);
      if (!Array.isArray(itemsToExport) || itemsToExport.length === 0) {
        alert(`Không có dữ liệu Bán Gà nào thuộc [${scopeLabel}] để xuất Excel!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (bangaViewMode === 'day') {
        const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentBangaDateFilter.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (bangaViewMode === 'month') {
        const mm = String(currentBangaMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentBangaMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (bangaViewMode === 'year') {
        timeSuffix = `Nam_${currentBangaYearFilter}`;
      }

      const headers = ["Mã Phiếu", "Tên Máy / Linh Kiện", "Giá Bán", "Giá Nhập", "Lãi", "Hình Thức", "Giờ - Ngày Bán", "Khách Hàng"];
      const rows = itemsToExport.map(item => [
        item.id || '',
        item.name || '',
        item.total || '0',
        item.priceIn || '0',
        item.profit || '0',
        item.method || 'Tiền mặt',
        item.dateTime || '',
        item.customer || 'Khách lẻ'
      ]);
      exportAoaToExcelOrCsv(headers, rows, `KimChiMobile_BanGa_${timeSuffix}`, "BanGa");
      alert(`Đã xuất thành công ${itemsToExport.length} phiếu Bán Gà (${scopeLabel}) ra file Excel!`);
    }
    window.exportBangaToExcel = exportBangaToExcel;

    function clearAllBangaData() {
      let scopeLabel = getCurrentBangaScopeLabel();
      let itemsToDelete = bangaDatabase.filter(isBangaItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có phiếu Bán Gà nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      let confirmText = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} phiếu Bán Gà thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmText === null) return;
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok' || clean === 'đồng ý' || clean === 'dong y') {
        let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));

        // Xóa tài liệu banga trên Firebase Firestore nếu có
        if (typeof db !== 'undefined' && db) {
          try {
            itemsToDelete.forEach(item => {
              if (item && item.id) {
                db.collection('banga').doc(String(item.id)).delete().catch(console.error);
              }
            });
          } catch(e) {
            console.error("Lỗi xóa Firestore banga:", e);
          }
        }

        // Cập nhật lại bangaDatabase
        bangaDatabase = bangaDatabase.filter(it => !deleteIds.has(String(it.id)));
        if (bangaDatabase.length === 0) {
          localStorage.setItem('KIMCHI_BANGA_CLEARED', 'true');
        }
        saveBangaStorage();
        if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
        alert(`Đã xóa thành công ${itemsToDelete.length} phiếu Bán Gà thuộc [${scopeLabel}]!`);
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllBangaData = clearAllBangaData;

    async function handleImportBangaExcelFile(event) {
      const files = Array.from(event.target.files || []);
      if (!files || files.length === 0) return;

      let totalNewRecords = [];
      let totalUpdatedCount = 0;
      let errorFiles = [];

      for (let file of files) {
        try {
          const buffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = err => reject(err);
            reader.readAsArrayBuffer(file);
          });

          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(buffer);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (workbook && workbook.SheetNames && workbook.SheetNames.length > 0) {
              rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
            }
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(buffer).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) continue;

          let cleanHeader = rows[0].map(h => String(h || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
          let colIdxDate = -1, colIdxCustomer = -1, colIdxName = -1, colIdxPrice = -1, colIdxPriceIn = -1, colIdxProfit = -1, colIdxMethod = -1, colIdxType = -1;

          cleanHeader.forEach((col, idx) => {
            if (col.includes('gio') || col.includes('ngay') || col.includes('thoi gian')) colIdxDate = idx;
            else if (col.includes('khach') || col.includes('customer')) colIdxCustomer = idx;
            else if (col === 'hang' || col === 'ten may' || col === 'ten hang' || col.includes('phu kien') || (col.includes('ten') && !col.includes('khach')) || col.includes('ga')) colIdxName = idx;
            else if (col.includes('gia nhap') || col.includes('nhap') || col.includes('von')) colIdxPriceIn = idx;
            else if (col.includes('lai') || col.includes('loi nhuan')) colIdxProfit = idx;
            else if (col.includes('tong tien') || col.includes('gia ban') || col.includes('tong') || (col.includes('ban') && !col.includes('ngay') && !col.includes('gio'))) colIdxPrice = idx;
            else if (col.includes('thanh toan') || col.includes('hinh thuc') || col.includes('method') || col.includes('httt')) colIdxMethod = idx;
            else if (col.includes('loai')) colIdxType = idx;
          });

          if (colIdxName === -1 && colIdxPrice === -1) {
            colIdxDate = 2; colIdxCustomer = 4; colIdxName = 7; colIdxType = 8; colIdxPrice = 10; colIdxPriceIn = 11; colIdxProfit = 12; colIdxMethod = 13;
          }

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let name = colIdxName !== -1 && row[colIdxName] ? String(row[colIdxName]).trim() : '';
            if (!name) continue;

            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? String(row[colIdxPrice]).trim() : '0';
            let rawPriceIn = colIdxPriceIn !== -1 && row[colIdxPriceIn] !== undefined ? String(row[colIdxPriceIn]).trim() : '0';
            let rawProfit = colIdxProfit !== -1 && row[colIdxProfit] !== undefined ? String(row[colIdxProfit]).trim() : '';
            let rawMethod = colIdxMethod !== -1 && row[colIdxMethod] !== undefined ? row[colIdxMethod] : '';
            let rawDate = colIdxDate !== -1 && row[colIdxDate] !== undefined ? row[colIdxDate] : '';
            let customer = colIdxCustomer !== -1 && row[colIdxCustomer] ? String(row[colIdxCustomer]).trim() : 'Khách lẻ';
            let rawType = colIdxType !== -1 && row[colIdxType] ? String(row[colIdxType]).trim() : '';

            name = toTitleCase(name);
            customer = customer ? toTitleCase(customer) : 'Khách lẻ';

            let totalNum = parsePriceNum(rawPrice);
            let priceInNum = parsePriceNum(rawPriceIn);
            let profitNum = rawProfit ? parsePriceNum(rawProfit) : (totalNum - priceInNum);

            let total = formatPriceStr(totalNum);
            let priceIn = formatPriceStr(priceInNum);
            let profit = profitNum < 0 ? `-${formatPriceStr(Math.abs(profitNum))}` : formatPriceStr(profitNum);
            let method = normalizePaymentMethod(rawMethod);
            let paymentStatus = (method === 'Nợ') ? 'Nợ Dai VL' : 'Đã Trả';
            let dateTime = formatImportDateTime(rawDate);

            let nonMachineRegex = /bán thẻ|thẻ nhớ|nạp|cầm đồ|thay lưng|sửa|míc|mic|ép kính|sim|bán màn|đớp|viettel|huy linh|rút tiền|bộ sạc|dây sạc|củ sạc|tai nghe|cường lực|ốp lưng|dán|pin|vỏ|camera|loa|hòa/i;
            let isMachine = false;
            if (rawType) {
              if (rawType.toLowerCase().includes('máy')) isMachine = true;
              else if (rawType.toLowerCase().includes('phu kien') || rawType.toLowerCase().includes('phụ kiện')) isMachine = false;
              else isMachine = !nonMachineRegex.test(name);
            } else {
              isMachine = !nonMachineRegex.test(name);
            }
            let accessory = isMachine ? 'Bán Máy' : (rawType && (rawType.toLowerCase().includes('phu kien') || rawType.toLowerCase().includes('phụ kiện')) ? 'Phụ kiện' : 'Khác');

            let existing = bangaDatabase.find(s => 
              s && s.dateTime === dateTime && 
              String(s.name || '').toLowerCase().trim() === name.toLowerCase().trim()
            );

            if (!existing) {
              existing = totalNewRecords.find(s =>
                s && s.dateTime === dateTime && 
                String(s.name || '').toLowerCase().trim() === name.toLowerCase().trim()
              );
            }

            if (existing) {
              existing.method = method;
              existing.paymentStatus = paymentStatus;
              existing.total = total;
              existing.priceIn = priceIn;
              existing.profit = profit;
              existing.customer = customer;
              existing.accessory = accessory;
              totalUpdatedCount++;
            } else {
              totalNewRecords.push({
                id: Date.now() + Math.random(),
                name: name,
                accessory: accessory,
                total: total,
                priceIn: priceIn,
                profit: profit,
                method: method,
                dateTime: dateTime,
                customer: customer,
                paymentStatus: paymentStatus
              });
            }
          }
        } catch (err) {
          console.error("Lỗi đọc file:", file.name, err);
          errorFiles.push(file.name);
        }
      }

      event.target.value = ''; // Reset để có thể chọn lại file

      if (totalNewRecords.length > 0 || totalUpdatedCount > 0) {
        if (totalNewRecords.length > 0) bangaDatabase.push(...totalNewRecords);

        // Sắp xếp mới nhất lên đầu
        bangaDatabase.sort((a, b) => {
          let getTs = (dtStr) => {
            if (!dtStr) return 0;
            let parts = String(dtStr).split(' - ');
            if (parts.length >= 2) {
              let [hh, min] = parts[0].split(':').map(n => parseInt(n, 10) || 0);
              let [d, m, y] = parts[1].split('/').map(n => parseInt(n, 10) || 0);
              return new Date(y, m - 1, d, hh, min).getTime();
            }
            let t = new Date(dtStr).getTime();
            return isNaN(t) ? 0 : t;
          };
          return getTs(b.dateTime) - getTs(a.dateTime);
        });

        saveBangaStorage();
        bangaViewMode = 'year';
        const bangaSel = document.getElementById('bangaModeSelect');
        if (bangaSel) bangaSel.value = 'year';
        const dayBox = document.getElementById('bangaDateFilterBox');
        const monthBox = document.getElementById('bangaMonthFilterBox');
        const yearBox = document.getElementById('bangaYearFilterBox');
        if (dayBox) dayBox.style.display = 'none';
        if (monthBox) monthBox.style.display = 'none';
        if (yearBox) yearBox.style.display = 'inline-flex';

        if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
        alert(`🎉 ĐÃ NHẬP THÀNH CÔNG ${totalNewRecords.length} PHIẾU BÁN GÀ MỚI (Cập nhật ${totalUpdatedCount} phiếu) từ ${files.length} file!\n(Đã tự động chuyển sang chế độ xem Năm để hiển thị toàn bộ phiếu vừa nhập)`);
      } else {
        if (errorFiles.length > 0) {
          alert(`Có lỗi khi đọc các file: ${errorFiles.join(', ')}`);
        } else {
          alert("Không tìm thấy dữ liệu Bán Gà hợp lệ trong các file đã chọn!");
        }
      }
    }
    window.handleImportBangaExcelFile = handleImportBangaExcelFile;

    /* ============================================================
       5. CHỨC NĂNG EXCEL TAB BẢO HÀNH
       ============================================================ */
    function toggleSoldPhoneExcelActions() {
      const box = document.getElementById('soldPhoneActionsBox');
      const arrow = document.getElementById('soldPhoneExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleSoldPhoneExcelActions = toggleSoldPhoneExcelActions;

    function triggerImportSoldPhoneExcel() {
      const fileInput = document.getElementById('soldPhoneExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportSoldPhoneExcel = triggerImportSoldPhoneExcel;

    function exportSoldPhoneToExcel() {
      let scopeLabel = getCurrentSoldPhoneScopeLabel();
      let itemsToExport = soldPhoneDatabase.filter(isSoldPhoneItemMatchingCurrentFilter);
      if (!Array.isArray(itemsToExport) || itemsToExport.length === 0) {
        alert(`Không có dữ liệu Bảo Hành nào thuộc [${scopeLabel}] để xuất Excel!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (soldPhoneViewMode === 'day') {
        const dd = String(currentSoldPhoneDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentSoldPhoneDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentSoldPhoneDateFilter.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (soldPhoneViewMode === 'month') {
        const mm = String(currentSoldPhoneMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentSoldPhoneMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (soldPhoneViewMode === 'year') {
        timeSuffix = `Nam_${currentSoldPhoneYearFilter}`;
      }

      const headers = ["Hãng", "Tên Máy", "Dung Lượng", "Màu Sắc", "IMEI", "Giá Bán", "Giá Nhập", "Lãi", "Hình Thức", "Giờ - Ngày Bán", "Khách Hàng", "Bảo Hành", "Quà Tặng", "Ghi Chú"];
      const rows = itemsToExport.map(p => [
        p.brand || 'IPHONE',
        p.name || '',
        p.storage || '',
        p.color || '',
        p.imei || '',
        p.price || p.total || '0',
        p.priceIn || '0',
        p.profit || '0',
        p.method || p.paymentMethod || 'Tiền mặt',
        p.dateTime || p.soldDate || p.date || '',
        p.customer || 'Khách lẻ',
        p.warranty || '12 tháng',
        p.giftStr || '',
        p.note || ''
      ]);
      exportAoaToExcelOrCsv(headers, rows, `KimChiMobile_BaoHanh_${timeSuffix}`, "BaoHanh");
      alert(`Đã xuất thành công ${itemsToExport.length} máy Bảo Hành (${scopeLabel}) ra file Excel!`);
    }
    window.exportSoldPhoneToExcel = exportSoldPhoneToExcel;

    function clearAllSoldPhoneData() {
      let scopeLabel = getCurrentSoldPhoneScopeLabel();
      let itemsToDelete = soldPhoneDatabase.filter(isSoldPhoneItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có phiếu Bảo Hành nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      let confirmText = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} máy Bảo Hành thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmText === null) return;
      let clean = confirmText.trim().toLowerCase();
      if (clean === 'tôi đồng ý xóa' || clean === 'toi dong y xoa' || clean === 'yes' || clean === 'ok' || clean === 'đồng ý' || clean === 'dong y') {
        let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));

        // Xóa trên Firebase Firestore nếu có
        if (typeof db !== 'undefined' && db) {
          try {
            itemsToDelete.forEach(item => {
              if (item && item.id) {
                db.collection('sold_phones').doc(String(item.id)).delete().catch(console.error);
              }
            });
          } catch(e) {
            console.error("Lỗi xóa Firestore sold_phones:", e);
          }
        }

        soldPhoneDatabase = soldPhoneDatabase.filter(it => !deleteIds.has(String(it.id)));
        if (soldPhoneDatabase.length === 0) {
          try { localStorage.setItem('KIMCHI_SOLD_PHONE_CLEARED', 'true'); } catch (e) {}
        }
        try { saveSoldPhoneStorage(); } catch (e) {}
        if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
        alert(`Đã xóa thành công ${itemsToDelete.length} máy Bảo Hành thuộc [${scopeLabel}]!`);
      } else {
        alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
      }
    }
    window.clearAllSoldPhoneData = clearAllSoldPhoneData;

    function handleImportSoldPhoneExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: '' });
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(e.target.result).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let cleanHeader = rows[0].map(h => String(h || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
          let colIdxBrand = -1, colIdxName = -1, colIdxStorage = -1, colIdxColor = -1, colIdxImei = -1, colIdxPrice = -1, colIdxPriceIn = -1, colIdxProfit = -1, colIdxMethod = -1, colIdxDate = -1, colIdxCustomer = -1, colIdxWarranty = -1, colIdxGift = -1, colIdxNote = -1;

          cleanHeader.forEach((col, idx) => {
            if (col === 'hang' || col === 'brand' || (col.includes('hang') && !col.includes('cua hang') && !col.includes('con hang'))) colIdxBrand = idx;
            else if (col.includes('ten may') || (col.includes('may') && !col.includes('ngay')) || col.includes('model')) colIdxName = idx;
            else if ((col.includes('dung luong') && !col.includes('pin')) || col.includes('bo nho') || col.includes('storage') || col.includes('rom') || (col.includes('gb') && !col.includes('pin'))) colIdxStorage = idx;
            else if (col.includes('mau') || col.includes('color')) colIdxColor = idx;
            else if (col.includes('imei') || col.includes('seri')) colIdxImei = idx;
            else if (col.includes('gia ban') || col.includes('gia le') || (col.includes('gia') && !col.includes('nhap') && !col.includes('von'))) colIdxPrice = idx;
            else if (col.includes('gia nhap') || col.includes('von') || col.includes('price in')) colIdxPriceIn = idx;
            else if (col.includes('lai') || col.includes('loi nhuan')) colIdxProfit = idx;
            else if (col.includes('hinh thuc') || col.includes('thanh toan') || col.includes('method')) colIdxMethod = idx;
            else if (col.includes('gio') || col.includes('ngay') || col.includes('date') || col.includes('time')) colIdxDate = idx;
            else if (col.includes('khach') || col.includes('customer')) colIdxCustomer = idx;
            else if (col.includes('bao hanh') || col.includes('warranty')) colIdxWarranty = idx;
            else if (col.includes('qua tang') || col.includes('gift') || col.includes('phu kien')) colIdxGift = idx;
            else if (col.includes('ghi chu') || col.includes('note')) colIdxNote = idx;
          });

          if (colIdxName === -1 && colIdxImei === -1) {
            colIdxBrand = 0; colIdxName = 1; colIdxStorage = 2; colIdxColor = 3; colIdxImei = 4; colIdxPrice = 5; colIdxPriceIn = 6; colIdxProfit = 7; colIdxMethod = 8; colIdxDate = 9; colIdxCustomer = 10;
          }

          let newRecords = [];
          let updatedCount = 0;

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let name = colIdxName !== -1 && row[colIdxName] ? String(row[colIdxName]).trim() : '';
            let imei = colIdxImei !== -1 && row[colIdxImei] ? String(row[colIdxImei]).trim() : '';
            if (!name && !imei) continue;

            let brand = colIdxBrand !== -1 && row[colIdxBrand] ? String(row[colIdxBrand]).trim().toUpperCase() : 'IPHONE';
            let storage = colIdxStorage !== -1 && row[colIdxStorage] ? String(row[colIdxStorage]).trim() : '128';
            let color = colIdxColor !== -1 && row[colIdxColor] ? String(row[colIdxColor]).trim() : 'Trắng';
            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? String(row[colIdxPrice]).trim() : '0';
            let rawPriceIn = colIdxPriceIn !== -1 && row[colIdxPriceIn] !== undefined ? String(row[colIdxPriceIn]).trim() : '0';
            let rawProfit = colIdxProfit !== -1 && row[colIdxProfit] !== undefined ? String(row[colIdxProfit]).trim() : '';
            let rawMethod = colIdxMethod !== -1 && row[colIdxMethod] !== undefined ? row[colIdxMethod] : 'Tiền mặt';
            let rawDate = colIdxDate !== -1 && row[colIdxDate] ? row[colIdxDate] : getCurrentVietnamDateTimeStr();
            let customer = colIdxCustomer !== -1 && row[colIdxCustomer] ? String(row[colIdxCustomer]).trim() : 'Khách lẻ';
            let warranty = colIdxWarranty !== -1 && row[colIdxWarranty] ? String(row[colIdxWarranty]).trim() : '12 tháng';
            let giftStr = colIdxGift !== -1 && row[colIdxGift] ? String(row[colIdxGift]).trim() : '';
            let note = colIdxNote !== -1 && row[colIdxNote] ? String(row[colIdxNote]).trim() : '';

            let priceNum = parsePriceNum(rawPrice);
            let priceInNum = parsePriceNum(rawPriceIn);
            let profitNum = rawProfit ? parsePriceNum(rawProfit) : (priceNum - priceInNum);

            let priceStr = formatPriceStr(priceNum);
            let priceInStr = formatPriceStr(priceInNum);
            let profitStr = formatPriceStr(profitNum);
            let method = normalizePaymentMethod(rawMethod);
            let dateTime = formatImportDateTime(rawDate);

            // Kiểm tra xem máy Bảo Hành này có khớp với phạm vi thời gian đang chọn hay không
            let checkItem = { dateTime: dateTime };
            if (!isSoldPhoneItemMatchingCurrentFilter(checkItem)) {
              continue;
            }

            // Kiểm tra trùng lặp
            let existing = soldPhoneDatabase.find(p => 
              (imei && p.imei && String(p.imei).toLowerCase().trim() === imei.toLowerCase()) ||
              (p.name.toLowerCase() === name.toLowerCase() && (p.dateTime === dateTime || p.date === dateTime) && !imei)
            );

            if (existing) {
              existing.price = priceStr;
              existing.total = priceStr;
              existing.priceIn = priceInStr;
              existing.profit = profitStr;
              existing.method = method;
              existing.paymentMethod = method;
              existing.customer = customer;
              existing.warranty = warranty;
              existing.giftStr = giftStr;
              existing.note = note;
              updatedCount++;
            } else {
              newRecords.push({
                id: Date.now() + Math.random(),
                brand: brand,
                name: name,
                storage: storage,
                color: color,
                imei: imei,
                price: priceStr,
                total: priceStr,
                priceIn: priceInStr,
                profit: profitStr,
                method: method,
                paymentMethod: method,
                dateTime: dateTime,
                soldDate: dateTime,
                customer: toTitleCase(customer),
                warranty: warranty,
                giftStr: giftStr,
                note: note
              });
            }
          }

          if (newRecords.length > 0 || updatedCount > 0) {
            if (newRecords.length > 0) soldPhoneDatabase.push(...newRecords);

            try {
              localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
            } catch (e) {}

            if (typeof setSoldPhoneMode === 'function') setSoldPhoneMode('all');
            else if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();

            alert(`Đã nhập thành công ${newRecords.length} máy Bảo Hành mới và cập nhật ${updatedCount} máy!`);
          } else {
            alert("Không tìm thấy dữ liệu Bảo Hành hợp lệ trong file!");
          }
        } catch (err) {
          console.error("Lỗi đọc file Excel Bảo Hành:", err);
          alert("Lỗi khi đọc file: " + (err.message || "Vui lòng kiểm tra file Excel!"));
        }
      };
      reader.readAsArrayBuffer(file);
    }
    window.handleImportSoldPhoneExcelFile = handleImportSoldPhoneExcelFile;

    /* ============================================================
       HÀM TỰ ĐỘNG KHÔI PHỤC MÁY ĐÃ BÁN LƯU LẠI VỀ MỤC BÁN MÁY
       Áp dụng khi xóa máy ở Bán Hàng, Bán Gà, và Bảo Hành
       ============================================================ */
    function restorePhoneToInventory(item) {
      if (!item) return false;

      let imei = item.imei || '';
      if (!imei && item.name) {
        let m = item.name.match(/\(([^)]+)\)\s*$/);
        if (m) imei = m[1].trim();
      }

      let originalPhone = null;
      if (imei && typeof soldPhoneDatabase !== 'undefined') {
        originalPhone = soldPhoneDatabase.find(sp => sp.imei === imei);
      }
      if (!originalPhone && item.id && typeof soldPhoneDatabase !== 'undefined') {
        originalPhone = soldPhoneDatabase.find(sp => String(sp.id) === String(item.id) || sp.id == item.id);
      }

      let brand = (originalPhone && originalPhone.brand) || item.brand || 'IPHONE';
      if (brand === '❤️❤️❤️' || brand === 'MÁY NGOÀI') brand = 'IPHONE';
      let name = (originalPhone && originalPhone.name) || item.phoneName || item.name || 'Điện thoại';
      name = name.replace(/^(?:<[^>]+>|❤️❤️❤️|MÁY NGOÀI|\s*[-–])+/gi, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
      let color = (originalPhone && originalPhone.color) || item.color || 'Trắng';
      let storage = (originalPhone && originalPhone.storage) || item.storage || '';
      storage = storage ? `(${storage.replace(/[()]/g, '')})` : '';
      let condition = (originalPhone && originalPhone.condition) || item.condition || 'Zin Đẹp 99%';
      let pinStatus = (originalPhone && originalPhone.pinStatus) || item.pinStatus || 'Pin Zin';
      let pin = (originalPhone && originalPhone.pin) || item.pin || '100%';
      let origin = (originalPhone && originalPhone.origin) || item.origin || 'VN/A';
      let price = item.total || item.price || (originalPhone && originalPhone.price) || '0';
      let priceIn = item.priceIn || (originalPhone && originalPhone.priceIn) || '0';
      let note = item.note || (originalPhone && originalPhone.note) || '';

      let restoredPhone = {
        id: Date.now() + Math.random(),
        brand: brand,
        name: name,
        color: color,
        storage: storage,
        imei: imei,
        price: price,
        condition: condition,
        pinStatus: pinStatus,
        pin: pin,
        origin: origin,
        priceIn: priceIn,
        status: 'Còn Hàng',
        note: note,
        date: getCurrentDateStr()
      };

      if (typeof phoneDatabase !== 'undefined') {
        phoneDatabase.unshift(restoredPhone);
        if (typeof savePhoneStorage === 'function') savePhoneStorage();
      }

      if (typeof soldPhoneDatabase !== 'undefined') {
        if (imei) {
          soldPhoneDatabase = soldPhoneDatabase.filter(sp => sp.imei !== imei);
        } else if (originalPhone) {
          soldPhoneDatabase = soldPhoneDatabase.filter(sp => sp !== originalPhone);
        }
        if (typeof savePhoneStorage === 'function') savePhoneStorage();
      }

      if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
      if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();

      return true;
    }
    window.restorePhoneToInventory = restorePhoneToInventory;

    function deleteSale(id) {
      const item = salesDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) return;

      let confirmText = prompt(`Bạn có chắc chắn muốn xóa phiếu "${item.name}" không?\nNếu là máy bán ra, hệ thống sẽ tự động lưu hoàn trả về mục BÁN MÁY.\nNhập 'ok' hoặc 'yes' để xác nhận:`);
      let normConfirm = (confirmText || '').trim().toLowerCase();
      if (normConfirm === 'ok' || normConfirm === 'yes') {
        if (typeof logActivity === 'function') {
          logActivity('DELETE', 'banhang', 'Bán hàng', `Xóa đơn bán hàng: ${item.name} - ${item.total}`, item, null, id);
        }

        let isPhone = item.imei || item.phoneName || (item.name && /\([0-9a-zA-Z\s]{2,}\)$/.test(item.name)) || (item.accessory && String(item.accessory).includes('Bán Máy'));
        if (isPhone) {
          restorePhoneToInventory(item);
        }

        salesDatabase = salesDatabase.filter(s => String(s.id) !== String(id) && s.id != id);
        saveSalesStorage();
        if (typeof db !== 'undefined' && db) {
          db.collection('sales').doc(String(id)).delete().catch(console.error);
        }
        renderSalesTable(salesDatabase);

        if (isPhone) {
          alert(`Đã xóa phiếu bán hàng và tự động lưu hoàn trả máy về mục BÁN MÁY thành công!`);
        } else {
          alert("Đã xóa phiếu bán hàng thành công!");
        }
      } else if (confirmText !== null) {
        alert("Thao tác xóa bị hủy. Bạn phải nhập 'ok' hoặc 'yes'.");
      }
    }

    function viewSale(id) {
      const item = salesDatabase.find(s => s.id === id);
      if (item) {
        alert(`Chi tiết phiếu:\n- Hàng: ${item.name}\n- Giá bán: ${item.total}\n- Lãi: ${item.profit}\n- Thanh toán: ${item.method}\n- Thời gian: ${item.dateTime}`);
      }
    }

    function deleteBangaSale(id) {
      const item = bangaDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) {
        alert("Không tìm thấy dữ liệu đơn bán gà này!");
        return;
      }

      let confirmText = prompt(`Bạn có chắc chắn muốn xóa đơn "${item.name}" và hoàn trả về Kho Bán Máy không?\nNhập 'ok' hoặc 'yes' để xác nhận:`);
      let normConfirm = (confirmText || '').trim().toLowerCase();
      if (normConfirm === 'ok' || normConfirm === 'yes') {
        bangaDatabase = bangaDatabase.filter(s => String(s.id) !== String(id) && s.id != id);
        saveBangaStorage();
        if (typeof db !== 'undefined' && db) {
          db.collection('banga').doc(String(id)).delete().catch(console.error);
        }
        if (typeof logActivity === 'function') {
          logActivity('DELETE', 'banga', 'Bán gà', `Xóa đơn bán gà: ${item.name} - ${item.total}`, item, null, id);
        }
        renderBangaTable(bangaDatabase);

        restorePhoneToInventory(item);

        alert("Đã xóa đơn gà đã bán và tự động lưu hoàn trả máy vào mục Bán Máy thành công!");
      } else if (confirmText !== null) {
        alert("Thao tác xóa bị hủy. Bạn phải nhập 'ok' hoặc 'yes'.");
      }
    }

    function viewBangaSale(id) {
      const item = bangaDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) {
        alert("Không tìm thấy thông tin đơn bán gà này!");
        return;
      }

      const details = getBangaPhoneDetails(item);
      const pinDisplay = details.pinStatus ? `${details.pinStatus} (${details.pin || '100%'})` : (details.pin || '100%');

      // TÍNH TOÁN BẢO HÀNH & SỐ NGÀY ĐÃ MUA
      const warrantyStr = details.warranty || item.warranty || '3 Tháng';

      let purchaseDate = new Date();
      if (item.dateTime) {
        let parts = item.dateTime.split(' - ');
        let datePart = parts.length > 1 ? parts[1].trim() : parts[0].trim();
        let dParts = datePart.split('/');
        if (dParts.length === 3) {
          let d = parseInt(dParts[0], 10);
          let m = parseInt(dParts[1], 10) - 1;
          let y = parseInt(dParts[2], 10);
          if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
            purchaseDate = new Date(y, m, d);
          }
        }
      }

      const now = new Date();
      const dPurchase = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());
      const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Đã mua bao ngày
      const diffMs = dNow.getTime() - dPurchase.getTime();
      const daysPassed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const daysBoughtText = `${daysPassed} ngày`;

      // Thời gian bảo hành còn lại
      let isNoWarranty = warrantyStr.includes('0') || warrantyStr.toLowerCase().includes('không');
      let remainingText = '';
      let remainingColor = '#10b981';

      if (isNoWarranty) {
        remainingText = 'Không bảo hành';
        remainingColor = 'var(--text-sub)';
      } else {
        let matchMonths = warrantyStr.match(/(\d+)\s*tháng/i);
        let matchDays = warrantyStr.match(/(\d+)\s*ngày/i);
        let expireDate = new Date(dPurchase);

        if (matchMonths) {
          expireDate.setMonth(expireDate.getMonth() + parseInt(matchMonths[1], 10));
        } else if (matchDays) {
          expireDate.setDate(expireDate.getDate() + parseInt(matchDays[1], 10));
        } else {
          expireDate.setMonth(expireDate.getMonth() + 3);
        }

        const remainingMs = expireDate.getTime() - dNow.getTime();
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

        const expD = String(expireDate.getDate()).padStart(2, '0');
        const expM = String(expireDate.getMonth() + 1).padStart(2, '0');
        const expY = expireDate.getFullYear();
        const expireDateFormatted = `${expD}/${expM}/${expY}`;

        if (remainingDays > 0) {
          remainingText = `${remainingDays} ngày (đến ${expireDateFormatted})`;
          remainingColor = '#10b981';
        } else if (remainingDays === 0) {
          remainingText = `Hết hạn hôm nay (${expireDateFormatted})`;
          remainingColor = '#f59e0b';
        } else {
          remainingText = `Đã hết hạn (${Math.abs(remainingDays)} ngày trước)`;
          remainingColor = '#f87171';
        }
      }

      const contentDiv = document.getElementById('viewPhoneDetailsContent');
      const viewModal = document.getElementById('viewPhoneModal');

      if (contentDiv && viewModal) {
        const titleSpan = viewModal.querySelector('.ticket-header span');
        if (titleSpan) titleSpan.innerText = '📱 CHI TIẾT ĐƠN BÁN GÀ';

        let titleName = '';
        if (details.isPhone) {
          if (details.brand && details.phoneName && 
              !details.phoneName.toLowerCase().startsWith(details.brand.toLowerCase()) &&
              !/^(?:iphone|samsung|oppo|xiaomi|redmi|vivo|realme|nokia|huawei|ipad|sony|vsmart|google|pixel)\b/i.test(details.phoneName)) {
            let bBrand = details.brand;
            if (bBrand === 'MÁY NGOÀI' || bBrand === '❤️❤️❤️' || bBrand === '❤️') {
              bBrand = '<span style="color: #ef4444; font-size: 1.15rem;">❤️❤️❤️</span>';
            }
            titleName = `${bBrand} - ${formatBrandDeviceName(details.phoneName)} ${details.storage ? `(${details.storage})` : ''}`;
          } else {
            titleName = `${formatBrandDeviceName(details.phoneName || item.name || '')} ${details.storage ? `(${details.storage})` : ''}`;
          }
        } else {
          titleName = formatBrandDeviceName(item.name || item.accessory || '');
        }

        let colorRow = details.color ? `<div class="view-info-item"><span class="view-info-label">- Màu sắc:</span> <span class="view-info-val"><span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${getHexColor(details.color)}; display: inline-block; margin-right: 6px;"></span>${details.color}</span></div>` : '';
        let imeiRow = details.imei ? `<div class="view-info-item"><span class="view-info-label">- IMEI:</span> <span class="view-info-val" style="color: var(--amber-color); font-weight: 800;">${details.imei}</span></div>` : '';

        contentDiv.innerHTML = `
          <div class="view-info-item"><span class="view-info-label">- ${details.isPhone ? 'Tên máy' : 'Tên hàng / Dịch vụ'}:</span> <span class="view-info-val" style="color: #fff; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">${titleName}</span></div>
          ${colorRow}
          ${imeiRow}
          <div class="view-info-item"><span class="view-info-label">- Tình trạng máy:</span> <span class="view-info-val" style="color: #60a5fa; font-weight: 800;">${details.condition}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Tình trạng pin:</span> <span class="view-info-val" style="color: var(--purple-accent); font-weight: 800;">${pinDisplay}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Mã nước:</span> <span class="view-info-val" style="color: #10b981; font-weight: 800;">${details.origin}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Giá bán:</span> <span class="view-info-val" style="color: #f87171; font-weight: 900;">${item.total}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Giá nhập:</span> <span class="view-info-val" style="color: #fff; font-weight: 800;">${item.priceIn}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Lãi:</span> <span class="view-info-val" style="color: var(--green-badge); font-weight: 900;">${item.profit}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Thanh toán:</span> <span class="view-info-val">${item.method || 'Tiền mặt'}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Thời gian bán:</span> <span class="view-info-val" style="color: #fef08a; font-weight: 800;">${item.dateTime}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Bảo hành:</span> <span class="view-info-val" style="color: #38bdf8; font-weight: 800;">${warrantyStr}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Đã mua:</span> <span class="view-info-val" style="color: #facc15; font-weight: 800;">${daysBoughtText}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Bảo Hành còn:</span> <span class="view-info-val" style="color: ${remainingColor}; font-weight: 800;">${remainingText}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Khách hàng:</span> <span class="view-info-val">${item.customer || 'Khách lẻ'}</span></div>
        `;
        viewModal.classList.add('active');
        viewModal.style.display = 'flex';
      } else {
        alert(`Chi tiết đơn Bán Gà:\n- Tên máy: ${details.brand} - ${details.phoneName} ${details.storage ? `(${details.storage})` : ''}\n- IMEI: ${details.imei}\n- Tình trạng: ${details.condition}\n- Pin: ${pinDisplay}\n- Màu sắc: ${details.color}\n- Mã nước: ${details.origin}\n- Giá bán: ${item.total}\n- Giá nhập: ${item.priceIn}\n- Lãi: ${item.profit}\n- Thanh toán: ${item.method}\n- Thời gian: ${item.dateTime}\n- Bảo hành: ${warrantyStr}\n- Đã mua: ${daysBoughtText}\n- Bảo Hành còn: ${remainingText}`);
      }
    }

    function editSale(id) {
      const item = salesDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) {
        alert("Không tìm thấy dữ liệu đơn bán hàng này!");
        return;
      }
      document.getElementById('editSaleId').value = item.id;
      document.getElementById('editSaleType').value = 'sales';
      document.getElementById('editSaleModalTitle').innerText = 'Sửa đơn bán hàng';
      document.getElementById('editSaleName').value = item.name || '';
      document.getElementById('editSalePriceOut').value = item.total || '';
      document.getElementById('editSalePriceIn').value = item.priceIn || '';
      let normMethodSales = (item.method && (item.method.toLowerCase().includes('chuyển') || item.method.toLowerCase().includes('ck') || item.method.toLowerCase().includes('bank'))) ? 'Chuyển khoản' : 'Tiền mặt';
      document.getElementById('editSaleMethod').value = normMethodSales;
      document.getElementById('editSaleDateTime').value = item.dateTime || '';
      const statusEl = document.getElementById('editSalePaymentStatus');
      if (statusEl) statusEl.value = item.paymentStatus || 'Đã Trả';
      const conditionRow = document.getElementById('editSaleConditionRow');
      if (conditionRow) conditionRow.style.display = 'none';
      const modal = document.getElementById('editSaleModal');
      if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    }

    function editBangaSale(id) {
      let item = bangaDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) {
        item = salesDatabase.find(s => String(s.id) === String(id) || s.id == id);
      }
      if (!item) {
        alert("Không tìm thấy dữ liệu đơn bán gà này!");
        return;
      }
      document.getElementById('editSaleId').value = item.id;
      document.getElementById('editSaleType').value = 'banga';
      document.getElementById('editSaleModalTitle').innerText = 'Sửa đơn bán gà';
      document.getElementById('editSaleName').value = item.name || '';
      document.getElementById('editSalePriceOut').value = item.total || '';
      document.getElementById('editSalePriceIn').value = item.priceIn || '';
      let normMethodBanga = (item.method && (item.method.toLowerCase().includes('chuyển') || item.method.toLowerCase().includes('ck') || item.method.toLowerCase().includes('bank'))) ? 'Chuyển khoản' : 'Tiền mặt';
      document.getElementById('editSaleMethod').value = normMethodBanga;
      document.getElementById('editSaleDateTime').value = item.dateTime || '';
      const statusBangaEl = document.getElementById('editSalePaymentStatus');
      if (statusBangaEl) statusBangaEl.value = item.paymentStatus || 'Đã Trả';

      const details = typeof getBangaPhoneDetails === 'function' ? getBangaPhoneDetails(item) : {};
      const conditionRow = document.getElementById('editSaleConditionRow');
      const conditionInput = document.getElementById('editSaleCondition');
      if (conditionRow && conditionInput) {
        conditionRow.style.display = 'block';
        conditionInput.value = item.condition || details.condition || '';
      }

      const modal = document.getElementById('editSaleModal');
      if (modal) {
        modal.style.zIndex = '100000';
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    }

    function closeEditSaleModal() {
      const modal = document.getElementById('editSaleModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }

    function deleteCurrentEditSale() {
      const id = document.getElementById('editSaleId').value;
      const type = document.getElementById('editSaleType').value;
      if (!id) return;

      if (type === 'banga') {
        let beforeLen = bangaDatabase.length;
        deleteBangaSale(id);
        if (bangaDatabase.length < beforeLen) {
          closeEditSaleModal();
        }
      } else if (type === 'soldPhone') {
        closeEditSaleModal();
        deleteSoldPhone(id);
      } else {
        let beforeLen = salesDatabase.length;
        deleteSale(Number(id) || id);
        if (salesDatabase.length < beforeLen) {
          closeEditSaleModal();
        }
      }
    }

    function saveEditedSale(e) {
      e.preventDefault();
      const id = document.getElementById('editSaleId').value;
      const type = document.getElementById('editSaleType').value;
      const name = document.getElementById('editSaleName').value.trim();
      const priceOutStr = document.getElementById('editSalePriceOut').value.trim();
      const priceInStr = document.getElementById('editSalePriceIn').value.trim();
      const method = document.getElementById('editSaleMethod').value;
      const dateTime = document.getElementById('editSaleDateTime').value.trim();
      const paymentStatus = document.getElementById('editSalePaymentStatus') ? document.getElementById('editSalePaymentStatus').value : 'Đã Trả';

      const priceOutNum = parsePriceNum(priceOutStr);
      const priceInNum = parsePriceNum(priceInStr);
      const profitNum = priceOutNum - priceInNum;

      const formattedTotal = formatPriceStr(priceOutNum);
      const formattedIn = formatPriceStr(priceInNum);
      const formattedProfit = formatPriceStr(profitNum);

      if (type === 'sales') {
        const item = salesDatabase.find(s => String(s.id) === String(id) || s.id == id);
        if (item) {
          const oldData = JSON.parse(JSON.stringify(item));
          item.name = name;
          item.total = formattedTotal;
          item.priceIn = formattedIn;
          item.profit = formattedProfit;
          item.method = method;
          item.paymentStatus = paymentStatus;
          if (dateTime) item.dateTime = dateTime;

          // Cập nhật lại cờ thiếu thông tin (nếu điền đủ cả 3 thì hết nháy, nếu còn thiếu thì tiếp tục nháy)
          item.isMissingInfo = isMissingRequiredSalesInfo(name, formattedTotal, formattedIn);

          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'banhang', 'Bán hàng', `Sửa đơn bán hàng: ${name} - ${formattedTotal}`, oldData, item, id);
          }
          saveSalesStorage();
          renderSalesTable(salesDatabase);
        }
      } else if (type === 'banga') {
        const item = bangaDatabase.find(s => String(s.id) === String(id) || s.id == id);
        if (item) {
          const oldData = JSON.parse(JSON.stringify(item));
          item.name = name;
          item.total = formattedTotal;
          item.priceIn = formattedIn;
          item.profit = formattedProfit;
          item.method = method;
          item.paymentStatus = paymentStatus;
          if (dateTime) item.dateTime = dateTime;

          // Cập nhật lại cờ thiếu thông tin
          item.isMissingInfo = isMissingRequiredSalesInfo(name, formattedTotal, formattedIn);
          const conditionInput = document.getElementById('editSaleCondition');
          if (conditionInput && conditionInput.value.trim()) {
            item.condition = conditionInput.value.trim();
          }
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'banga', 'Bán gà', `Sửa đơn bán gà: ${name} - ${formattedTotal}`, oldData, item, id);
          }
          saveBangaStorage();
          renderBangaTable(bangaDatabase);
        }
      } else if (type === 'soldPhone') {
        const item = soldPhoneDatabase.find(s => String(s.id) === String(id) || s.id == id);
        if (item) {
          item.name = name;
          item.price = formattedTotal;
          item.total = formattedTotal;
          item.priceIn = formattedIn;
          item.profit = formattedProfit;
          item.method = method;
          if (dateTime) {
            item.dateTime = dateTime;
            item.soldDateTime = dateTime;
          }
          const conditionInput = document.getElementById('editSaleCondition');
          if (conditionInput && conditionInput.value.trim()) {
            item.condition = conditionInput.value.trim();
          }
          savePhoneStorage();
          renderSoldPhoneTable();
        }
      }
      closeEditSaleModal();
    }

    function handleSearchSales(input) {
      renderSalesTable(salesDatabase);
    }

    function clearBangaSearch(btn) {
      const parentBox = btn.closest('.search-box-bm');
      const input = parentBox.querySelector('input');
      input.value = '';
      btn.style.display = 'none';
      input.focus();
      renderBangaTable(bangaDatabase);
    }

    function handleSearchBanga(input) {
      const q = input.value.trim().toLowerCase();
      const parentBox = input.closest('.search-box-bm');
      const clearBtn = parentBox.querySelector('.btn-clear-search');
      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
      renderBangaTable(bangaDatabase);
    }

    // Dữ liệu Kho Bán Máy & Bảo Hành: Khởi tạo an toàn kèm đồng bộ Firebase Firestore
    let phoneDatabase = [];
    try {
      const pRaw = localStorage.getItem('KIMCHI_PHONE_DB');
      if (pRaw) {
        phoneDatabase = JSON.parse(pRaw) || [];
      } else if (Array.isArray(window.SEED_PHONES_DATA) && window.SEED_PHONES_DATA.length > 0) {
        phoneDatabase = JSON.parse(JSON.stringify(window.SEED_PHONES_DATA));
      }
    } catch(e) {}

    let soldPhoneDatabase = [];
    try {
      const spRaw = localStorage.getItem('KIMCHI_SOLD_PHONE_DB');
      if (spRaw) {
        soldPhoneDatabase = JSON.parse(spRaw) || [];
      } else if (Array.isArray(window.SEED_SOLD_DATA) && window.SEED_SOLD_DATA.length > 0) {
        soldPhoneDatabase = JSON.parse(JSON.stringify(window.SEED_SOLD_DATA));
      }
    } catch(e) {}
    let currentBrandFilter = "ALL";
    let currentPriceFilter = "ALL";
    let soldPhoneViewMode = 'year'; // Lọc theo : Ngày , Tháng , Năm , Tất Cả , mặc định chọn theo Năm
    let currentSoldPhoneDateFilter = getVietnamDate();
    let currentSoldPhoneMonthFilter = { month: currentSoldPhoneDateFilter.getMonth(), year: currentSoldPhoneDateFilter.getFullYear() };
    let currentSoldPhoneYearFilter = currentSoldPhoneDateFilter.getFullYear();
    let currentSoldPhoneWarrantyFilter = "CON"; // lọc theo Bảo Hành : Mặc định là Còn BH , Hết BH , Tất Cả
    let currentSoldPhoneBrandFilter = "ALL"; // lọc theo hãng : các hãng đã bán , mặc định chọn Tất Cả
    let isSoldPhonePricesHidden = false; // nút ẩn là ẩn toàn bộ giá và doanh thu

    function toggleSoldPhoneHidePrices() {
      isSoldPhonePricesHidden = !isSoldPhonePricesHidden;
      updateSoldPhoneHidePricesButton();
      renderSoldPhoneTable();
    }
    window.toggleSoldPhoneHidePrices = toggleSoldPhoneHidePrices;

    function updateSoldPhoneHidePricesButton() {
      const btn = document.getElementById('btnToggleSoldPhoneHidePrices');
      const icon = document.getElementById('soldPhoneHidePriceEyeIcon');
      if (!btn || !icon) return;
      if (isSoldPhonePricesHidden) {
        btn.classList.add('active');
        btn.style.color = '#f87171';
        btn.style.borderColor = '#ef4444';
        btn.title = "Đang ẩn giá và doanh thu (Bấm để hiện lại)";
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      } else {
        btn.classList.remove('active');
        btn.style.color = '#94a3b8';
        btn.style.borderColor = '#334155';
        btn.title = "Bấm để ẩn toàn bộ giá và doanh thu";
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      }
    }
    window.updateSoldPhoneHidePricesButton = updateSoldPhoneHidePricesButton;

    function handleSoldPhoneBrandFilterChange(select) {
      currentSoldPhoneBrandFilter = select ? select.value : 'ALL';
      renderSoldPhoneTable();
    }
    window.handleSoldPhoneBrandFilterChange = handleSoldPhoneBrandFilterChange;

    function populateSoldPhoneBrandDropdown() {
      const select = document.getElementById('soldPhoneBrandFilter');
      if (!select) return;
      const currentVal = select.value || currentSoldPhoneBrandFilter || 'ALL';
      const brandsSet = new Set();
      soldPhoneDatabase.forEach(p => {
        if (p.brand && p.brand.trim() && p.brand.trim() !== '❤️❤️❤️' && p.brand.trim() !== 'MÁY NGOÀI') {
          brandsSet.add(p.brand.trim().toUpperCase());
        }
      });
      const sortedBrands = Array.from(brandsSet).sort();
      let html = `<option value="ALL">Tất Cả</option>`;
      sortedBrands.forEach(b => {
        html += `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`;
      });
      select.innerHTML = html;
      select.value = brandsSet.has(currentVal.toUpperCase()) || currentVal === 'ALL' ? currentVal : 'ALL';
    }
    window.populateSoldPhoneBrandDropdown = populateSoldPhoneBrandDropdown;

    function setSoldPhoneMode(mode) {
      soldPhoneViewMode = mode;
      const selMode = document.getElementById('soldPhoneModeSelect');
      if (selMode) selMode.value = mode;
      const btnDay = document.getElementById('soldPhoneModeDayBtn');
      const btnMonth = document.getElementById('soldPhoneModeMonthBtn');
      const btnYear = document.getElementById('soldPhoneModeYearBtn');
      const dayBox = document.getElementById('soldPhoneDateFilterBox');
      const monthBox = document.getElementById('soldPhoneMonthFilterBox');
      const yearBox = document.getElementById('soldPhoneYearFilterBox');

      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnYear) btnYear.classList.toggle('active', mode === 'year');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderSoldPhoneTable();
    }
    window.setSoldPhoneMode = setSoldPhoneMode;

    function changeSoldPhoneFilterDate(delta) {
      currentSoldPhoneDateFilter.setDate(currentSoldPhoneDateFilter.getDate() + delta);
      const dd = String(currentSoldPhoneDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentSoldPhoneDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentSoldPhoneDateFilter.getFullYear();
      const el = document.getElementById('filterSoldPhoneDateDisplay');
      if (el) el.innerText = `${dd}/${mm}/${yyyy}`;
      renderSoldPhoneTable();
    }
    window.changeSoldPhoneFilterDate = changeSoldPhoneFilterDate;

    function changeSoldPhoneFilterMonth(delta) {
      currentSoldPhoneMonthFilter.month += delta;
      if (currentSoldPhoneMonthFilter.month > 11) {
        currentSoldPhoneMonthFilter.month = 0;
        currentSoldPhoneMonthFilter.year++;
      } else if (currentSoldPhoneMonthFilter.month < 0) {
        currentSoldPhoneMonthFilter.month = 11;
        currentSoldPhoneMonthFilter.year--;
      }
      const mm = String(currentSoldPhoneMonthFilter.month + 1).padStart(2, '0');
      const el = document.getElementById('filterSoldPhoneMonthDisplay');
      if (el) el.innerText = `${mm}/${currentSoldPhoneMonthFilter.year}`;
      renderSoldPhoneTable();
    }
    window.changeSoldPhoneFilterMonth = changeSoldPhoneFilterMonth;

    function changeSoldPhoneFilterYear(delta) {
      currentSoldPhoneYearFilter += delta;
      const el = document.getElementById('filterSoldPhoneYearDisplay');
      if (el) el.innerText = String(currentSoldPhoneYearFilter);
      renderSoldPhoneTable();
    }
    window.changeSoldPhoneFilterYear = changeSoldPhoneFilterYear;

    function calcModalProfit() {
      const pIn = parsePriceNum(document.getElementById('mPriceIn').value);
      const pOut = parsePriceNum(document.getElementById('mPriceOut').value);
      const profitEl = document.getElementById('mProfit');
      const profitDisplayEl = document.getElementById('mProfitDisplay');
      if (pOut > 0) {
        let profit = pOut - pIn;
        const profitStr = (profit < 0 ? '-' : '') + formatPriceStr(Math.abs(profit));
        if (profitEl) profitEl.value = profitStr;
        if (profitDisplayEl) {
          profitDisplayEl.innerText = profitStr;
          profitDisplayEl.style.color = profit >= 0 ? 'var(--green-badge)' : '#f87171';
        }
      } else {
        if (profitEl) profitEl.value = '';
        if (profitDisplayEl) {
          profitDisplayEl.innerText = '0';
          profitDisplayEl.style.color = 'var(--green-badge)';
        }
      }
    }

    function savePhoneStorage(itemToSync) {
      try { localStorage.setItem('KIMCHI_PHONE_DB', JSON.stringify(phoneDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('phones').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          phoneDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('phones').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
    }

    function saveSoldPhoneStorage(itemToSync) {
      try { localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('sold_phones').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          soldPhoneDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('sold_phones').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
    }

    function filterBrand(brandName, btn) {
      currentBrandFilter = brandName;
      document.querySelectorAll('.brand-tabs-horizontal .brand-btn-h').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      const addBtnWrapper = document.getElementById('addPhoneBtnWrapper');
      if (addBtnWrapper) addBtnWrapper.style.display = 'flex';

      const actionBtn = document.getElementById('btnTopActionPhone');
      if (actionBtn) {
        if (brandName === 'ALL') {
          actionBtn.innerText = 'CHUYỂN GIAO DIỆN';
          actionBtn.onclick = function() { togglePhoneViewMode(); };
          actionBtn.title = 'Chuyển giao diện: Dạng hàng ngang / Dạng lưới ô';
        } else {
          actionBtn.innerText = '+ THÊM MÁY MỚI';
          actionBtn.onclick = function() { openPhoneModal(); };
          actionBtn.title = 'Thêm máy mới vào kho';
        }
      }

      renderDropdownDatalist('pinPct');
      renderPhoneGrid();
    }

    function loadCustomBrands() {
      try {
        let stored = localStorage.getItem('KIMCHI_CUSTOM_BRANDS');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function saveCustomBrands(brands) {
      try {
        localStorage.setItem('KIMCHI_CUSTOM_BRANDS', JSON.stringify(brands));
      } catch (e) {}
      if (typeof db !== 'undefined' && db) {
        db.collection('settings').doc('custom_brands').set({ list: brands }).catch(console.error);
      }
    }

    function renderCustomBrandTabs() {
      const container = document.getElementById('brandTabsContainer');
      if (!container) return;

      const addBtn = container.querySelector('.brand-btn-add');
      if (!addBtn) return;

      // Xóa các nút custom đã render trước đó để tránh trùng lặp
      container.querySelectorAll('.brand-btn-custom').forEach(b => b.remove());

      const customBrands = loadCustomBrands();
      customBrands.forEach(brand => {
        const btn = document.createElement('button');
        btn.className = 'brand-btn-h brand-btn-custom';
        if (currentBrandFilter === brand) btn.classList.add('active');
        btn.innerText = brand;
        btn.onclick = function() { filterBrand(brand, btn); };
        container.insertBefore(btn, addBtn);
      });
    }

    function addNewBrand() {
      let brand = prompt("Nhập tên hãng điện thoại mới:");
      if (brand && brand.trim() !== "") {
        let cleanBrand = brand.trim().toUpperCase();
        let customBrands = loadCustomBrands();
        if (!customBrands.includes(cleanBrand)) {
          customBrands.push(cleanBrand);
          saveCustomBrands(customBrands);
        }
        renderCustomBrandTabs();
        const container = document.getElementById('brandTabsContainer');
        const targetBtn = Array.from(container.querySelectorAll('.brand-btn-h')).find(b => b.innerText.trim() === cleanBrand);
        filterBrand(cleanBrand, targetBtn);
      }
    }

    let isPhonePricesHidden = false;

    function toggleHidePhonePrices() {
      isPhonePricesHidden = !isPhonePricesHidden;
      updateHidePricesButton();
      renderPhoneGrid();
    }
    window.toggleHidePhonePrices = toggleHidePhonePrices;

    function updateHidePricesButton() {
      const btn = document.getElementById('btnToggleHidePrices');
      const icon = document.getElementById('hidePriceEyeIcon');
      if (!btn || !icon) return;
      if (isPhonePricesHidden) {
        btn.classList.add('active');
        btn.title = "Đang ẩn giá tiền (Bấm để hiện giá tiền)";
        icon.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      } else {
        btn.classList.remove('active');
        btn.title = "Bấm để ẩn toàn bộ giá tiền thành *****";
        icon.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      }
    }
    window.updateHidePricesButton = updateHidePricesButton;

    function openPhoneModal(editId = null) {
      renderAllDropdowns();
      document.getElementById('mEditId').value = '';
      document.getElementById('phoneModalTitle').innerText = "Thêm Thông Tin Máy Mới";
      document.getElementById('mName').value = '';
      document.getElementById('mImei').value = '';
      document.getElementById('mColor').value = '';
      document.getElementById('mStorage').value = '';
      document.getElementById('mCondition').value = '';
      document.getElementById('mPinStatus').value = '';
      document.getElementById('mPinPct').value = '';
      document.getElementById('mOrigin').value = '';
      document.getElementById('mPriceIn').value = '';
      document.getElementById('mPriceOut').value = '';
      if (document.getElementById('mProfit')) document.getElementById('mProfit').value = '';
      const profitDisplayEl = document.getElementById('mProfitDisplay');
      if (profitDisplayEl) {
        profitDisplayEl.innerText = '0';
        profitDisplayEl.style.color = 'var(--green-badge)';
      }
      const statusEl = document.getElementById('mStatus');
      if (statusEl) statusEl.value = 'Còn Hàng';
      document.getElementById('mNote').value = '';
      document.getElementById('mDateVal').value = getCurrentDateStr();

      if (editId) {
        const p = phoneDatabase.find(item => item.id === editId);
        if (p) {
          document.getElementById('phoneModalTitle').innerText = "Sửa Thông Tin Máy";
          document.getElementById('mEditId').value = p.id;
          document.getElementById('mName').value = p.name || '';
          document.getElementById('mColor').value = p.color || '';
          document.getElementById('mImei').value = p.imei || '';
          document.getElementById('mStorage').value = toTitleCase((p.storage || '').replace(/[()]/g, ''));
          document.getElementById('mCondition').value = p.condition || '';
          document.getElementById('mPinStatus').value = p.pinStatus || '';
          document.getElementById('mPinPct').value = formatPinByBrand(p.pin, p.brand, p.name);
          document.getElementById('mOrigin').value = p.origin || '';
          document.getElementById('mPriceIn').value = p.priceIn || '';
          document.getElementById('mPriceOut').value = p.price || '';
          if (statusEl) statusEl.value = p.status || 'Còn Hàng';
          document.getElementById('mNote').value = p.note || '';
          document.getElementById('mDateVal').value = p.date || getCurrentDateStr();
          calcModalProfit();
        }
      } else {
        const isIp = (currentBrandFilter === 'IPHONE');
        document.getElementById('mPinPct').value = isIp ? '100%' : (currentBrandFilter !== 'ALL' ? '5.000 mAh' : '');
        document.getElementById('mPinPct').placeholder = isIp ? '100%' : '5.000 mAh';
      }

      document.getElementById('phoneModal').classList.add('active');
    }

    function closePhoneModal() {
      document.getElementById('phoneModal').classList.remove('active');
    }

    function saveNewPhone(e) {
      e.preventDefault();
      const editId = document.getElementById('mEditId').value;
      const existingP = editId ? phoneDatabase.find(x => x.id == editId) : null;
      let resolvedBrand = existingP ? (existingP.brand || (currentBrandFilter === 'ALL' ? 'IPHONE' : currentBrandFilter)) : (currentBrandFilter === 'ALL' ? 'IPHONE' : currentBrandFilter);
      if (resolvedBrand === 'OPPO & REALME' || resolvedBrand === 'OPPO - REALME') {
        resolvedBrand = /realme/i.test(document.getElementById('mName').value) ? 'REALME' : 'OPPO';
      } else if (resolvedBrand === 'REDMI & POCO' || resolvedBrand === 'REDMI - POCO') {
        resolvedBrand = /poco/i.test(document.getElementById('mName').value) ? 'POCO' : 'REDMI';
      }
      const brand = resolvedBrand;
      const name = toTitleCase(document.getElementById('mName').value.trim());
      const color = toTitleCase(document.getElementById('mColor').value.trim());
      const imei = document.getElementById('mImei').value.trim();
      const storage = formatStorageValue(toTitleCase(document.getElementById('mStorage').value.trim()));
      const condition = toTitleCase(document.getElementById('mCondition').value.trim());
      const pinStatus = toTitleCase(document.getElementById('mPinStatus').value.trim());
      
      let pinPctRaw = document.getElementById('mPinPct').value.trim();
      const pinPct = formatPinByBrand(pinPctRaw, brand, name);

      const origin = document.getElementById('mOrigin').value.trim().toUpperCase();
      const priceOut = document.getElementById('mPriceOut').value.trim();
      const priceIn = document.getElementById('mPriceIn').value.trim();
      const status = document.getElementById('mStatus') ? document.getElementById('mStatus').value : 'Còn Hàng';
      const note = toTitleCase(document.getElementById('mNote').value.trim());
      const dateIn = document.getElementById('mDateVal').value.trim();

      const originStr = origin || 'VN/A';

      if (editId) {
        const p = phoneDatabase.find(item => item.id == editId);
        if (p) {
          const oldData = JSON.parse(JSON.stringify(p));
          p.brand = brand;
          p.name = name;
          p.color = color;
          p.storage = storage ? `(${storage})` : '';
          p.imei = imei;
          p.price = priceOut;
          p.condition = condition;
          p.pinStatus = pinStatus;
          p.pin = pinPct;
          p.origin = originStr;
          p.priceIn = priceIn || '0';
          p.status = status;
          p.note = note;
          p.date = dateIn;
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'banmay', 'Bán máy', `Sửa thông tin máy: ${brand} ${name} (${imei || 'Không IMEI'}) - Giá: ${priceOut}`, oldData, p, p.id);
          }
        }
      } else {
        const newItem = {
          id: Date.now() + Math.random(),
          brand,
          name,
          color,
          storage: storage ? `(${storage})` : '',
          imei,
          price: priceOut,
          condition,
          pinStatus,
          pin: pinPct,
          origin: originStr,
          priceIn: priceIn || '0',
          status: status || 'Còn Hàng',
          note,
          date: dateIn || getCurrentDateStr()
        };
        phoneDatabase.unshift(newItem);
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'banmay', 'Bán máy', `Nhập máy mới: ${brand} ${name} ${newItem.storage} (${imei || 'Không IMEI'}) - Vốn: ${newItem.priceIn}`, null, newItem, newItem.id);
        }
      }

      savePhoneStorage();
      closePhoneModal();
      renderPhoneGrid();
    }

    function viewPhone(id, fromSold = false) {
      let p = null;
      if (fromSold) {
        p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      }
      if (!p) {
        const soldTab = document.getElementById('tab-sold-phones') || document.getElementById('tab-baohanh');
        if (soldTab && (soldTab.classList.contains('active') || soldTab.style.display !== 'none')) {
          p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
          if (p) fromSold = true;
        }
      }
      if (!p) {
        p = phoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      }
      if (!p) {
        p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
        if (p) fromSold = true;
      }
      if (!p) return;

      const isSold = fromSold || 
                     soldPhoneDatabase.some(item => String(item.id) === String(p.id) || item.id == p.id) ||
                     Boolean(p.soldDate || p.soldDateTime || (p.dateTime && p.customer) || (p.status && p.status.toLowerCase().includes('bán')));

      let pinType = p.pinStatus || 'Pin Zin';
      let pinVal = formatPinByBrand(p.pin, p.brand, p.name);
      let originVal = p.origin || 'VN/A';
      let pinOriginStr = `${pinType} : ${pinVal} - ${originVal}`;

      let cleanStorage = formatStorageDisplay((p.storage || '').replace(/[()]/g, ''));

      // Xử lý riêng cho máy ngoài kho: thay chữ "Máy Ngoài", "Ngoài Kho" bằng 1 trái tim màu đỏ ❤️
      let isExternal = (p.brand === 'MÁY NGOÀI' || p.brand === '❤️❤️❤️' || p.brand === '❤️' || 
                        (p.status && p.status.toLowerCase().includes('ngoài')) || 
                        (p.note && p.note.toLowerCase().includes('ngoài')));

      let brandDisplay = p.brand || '';
      if (brandDisplay === 'MÁY NGOÀI' || brandDisplay === '❤️❤️❤️' || brandDisplay === '❤️' || !brandDisplay) {
        brandDisplay = '<span style="color: #ef4444; font-size: 1.15rem;">❤️</span>';
      }

      let pName = formatBrandDeviceName(p.name || '');
      let fullName = `${brandDisplay} - ${pName} ${cleanStorage ? `(${cleanStorage})` : ''}`.trim();
      if (fullName.startsWith('- ')) fullName = fullName.substring(2);
      fullName = formatBrandDeviceName(fullName);

      let noteDisplay = (p.note || 'Không có')
        .replace(/ngoài kho/gi, '<span style="color: #ef4444;">❤️</span>')
        .replace(/máy ngoài/gi, '<span style="color: #ef4444;">❤️</span>');

      const contentDiv = document.getElementById('viewPhoneDetailsContent');
      const viewModal = document.getElementById('viewPhoneModal');

      if (viewModal) {
        const titleSpan = viewModal.querySelector('.ticket-header span');
        if (titleSpan) titleSpan.innerText = '📱 CHI TIẾT MÁY';
      }

      // TÍNH TOÁN BẢO HÀNH & SỐ NGÀY ĐÃ MUA (KHI MÁY ĐÃ BÁN / BẢO HÀNH)
      let dateRow = '';
      let warrantyRows = '';
      let statusRow = '';

      if (isSold) {
        let purchaseDate = new Date();
        let rawDateStr = p.soldDate || p.soldDateTime || p.dateTime || p.date || '';
        if (rawDateStr) {
          let datePart = rawDateStr;
          if (datePart.includes(' - ')) {
            let parts = datePart.split(' - ');
            datePart = parts.length > 1 ? parts[1].trim() : parts[0].trim();
          } else if (datePart.includes(' ')) {
            let parts = datePart.trim().split(/\s+/);
            let found = parts.find(x => x.includes('/') || (x.includes('-') && x.length >= 8));
            if (found) datePart = found;
          }

          if (datePart.includes('/')) {
            let dParts = datePart.split('/');
            if (dParts.length === 3) {
              let d = parseInt(dParts[0], 10);
              let m = parseInt(dParts[1], 10) - 1;
              let y = parseInt(dParts[2], 10);
              if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                purchaseDate = new Date(y, m, d);
              }
            }
          } else if (datePart.includes('-')) {
            let dParts = datePart.split('-');
            if (dParts.length === 3) {
              if (dParts[0].length === 4) {
                let y = parseInt(dParts[0], 10);
                let m = parseInt(dParts[1], 10) - 1;
                let d = parseInt(dParts[2], 10);
                if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                  purchaseDate = new Date(y, m, d);
                }
              } else {
                let d = parseInt(dParts[0], 10);
                let m = parseInt(dParts[1], 10) - 1;
                let y = parseInt(dParts[2], 10);
                if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                  purchaseDate = new Date(y, m, d);
                }
              }
            }
          }
        }

        const pdD = String(purchaseDate.getDate()).padStart(2, '0');
        const pdM = String(purchaseDate.getMonth() + 1).padStart(2, '0');
        const pdY = purchaseDate.getFullYear();
        const formattedSaleDate = `${pdD}/${pdM}/${pdY}`;

        const now = new Date();
        const dPurchase = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), purchaseDate.getDate());
        const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffMs = dNow.getTime() - dPurchase.getTime();
        const daysPassed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        const daysBoughtText = `${daysPassed} ngày`;

        const warrantyStr = p.warranty || '3 Tháng';
        let isNoWarranty = warrantyStr.includes('0') || warrantyStr.toLowerCase().includes('không');
        let remainingText = '';
        let remainingColor = '#10b981';

        if (isNoWarranty) {
          remainingText = 'Không bảo hành';
          remainingColor = '#94a3b8';
        } else {
          let matchMonths = warrantyStr.match(/(\d+)\s*tháng/i);
          let matchDays = warrantyStr.match(/(\d+)\s*ngày/i);
          let expireDate = new Date(dPurchase);

          if (matchMonths) {
            expireDate.setMonth(expireDate.getMonth() + parseInt(matchMonths[1], 10));
          } else if (matchDays) {
            expireDate.setDate(expireDate.getDate() + parseInt(matchDays[1], 10));
          } else {
            expireDate.setMonth(expireDate.getMonth() + 3);
          }

          const remainingMs = expireDate.getTime() - dNow.getTime();
          const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

          const expD = String(expireDate.getDate()).padStart(2, '0');
          const expM = String(expireDate.getMonth() + 1).padStart(2, '0');
          const expY = expireDate.getFullYear();
          const expireDateFormatted = `${expD}/${expM}/${expY}`;

          if (remainingDays > 0) {
            remainingText = `${remainingDays} ngày (đến ${expireDateFormatted})`;
            remainingColor = '#10b981';
          } else if (remainingDays === 0) {
            remainingText = `Hết hạn hôm nay (${expireDateFormatted})`;
            remainingColor = '#f59e0b';
          } else {
            remainingText = `Đã hết hạn (${Math.abs(remainingDays)} ngày trước)`;
            remainingColor = '#ef4444';
          }
        }

        dateRow = `
          <div class="view-info-item"><span class="view-info-label">- Ngày nhập:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.date || getCurrentDateStr()}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Ngày bán:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${formattedSaleDate}</span></div>
        `;
        warrantyRows = `
          <div class="view-info-item"><span class="view-info-label">- Đã mua:</span> <span class="view-info-val" style="color: #facc15; font-weight: 800;">${daysBoughtText}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Bảo hành:</span> <span class="view-info-val" style="color: #38bdf8; font-weight: 800;">${toTitleCase(warrantyStr)}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Còn bảo hành:</span> <span class="view-info-val" style="color: ${remainingColor}; font-weight: 800;">${remainingText}</span></div>
        `;
        statusRow = `<div class="view-info-item"><span class="view-info-label">- Trạng thái:</span> <span class="view-info-val" style="color: #ef4444; font-weight: 800;">Đã bán (Còn Cái Nịt)</span></div>`;
      } else {
        dateRow = `<div class="view-info-item"><span class="view-info-label">- Ngày nhập:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.date || getCurrentDateStr()}</span></div>`;
        warrantyRows = `
          <div class="view-info-item"><span class="view-info-label">- Bảo hành:</span> <span class="view-info-val" style="color: #38bdf8; font-weight: 800;">${toTitleCase(p.warranty || '3 Tháng')}</span></div>
        `;
        let statusDisplay = (p.status || (isExternal ? 'Đã Bán (❤️)' : 'Còn Hàng'))
          .replace(/ngoài kho/gi, '<span style="color: #ef4444;">❤️</span>')
          .replace(/máy ngoài/gi, '<span style="color: #ef4444;">❤️</span>');
        statusRow = `<div class="view-info-item"><span class="view-info-label">- Trạng thái:</span> <span class="view-info-val" style="color: #10b981; font-weight: 800;">${statusDisplay}</span></div>`;
      }

      // TÍNH TOÁN PHỤ KIỆN ĐÃ TẶNG
      let giftTotal = 0;
      let giftDetailStr = '';
      if (p.totalGiftMoney !== undefined && p.totalGiftMoney !== null && p.totalGiftMoney !== '') {
        giftTotal = parsePriceNum(p.totalGiftMoney);
      }
      if (p.giftStr) {
        let cleanGifts = p.giftStr.replace(/\[\s*Quà Tặng:\s*/i, '').replace(/\]/g, '').trim();
        giftDetailStr = cleanGifts;
        if (!giftTotal && cleanGifts) {
          let matches = cleanGifts.match(/:\s*([0-9.,kK]+)/g);
          if (matches) {
            matches.forEach(m => {
              let num = parsePriceNum(m.replace(':', '').trim());
              giftTotal += num;
            });
          }
        }
      }
      let giftRowHtml = `
        <div class="view-info-item">
          <span class="view-info-label">- Phụ Kiện Đã Tặng:</span> 
          <span class="view-info-val" style="color: #f59e0b; font-weight: 800;">= ${formatNumberDisplay(giftTotal)} ${giftDetailStr ? `<span style="font-size: 0.85rem; color: #94a3b8; font-weight: 600; margin-left: 6px;">(${giftDetailStr})</span>` : ''}</span>
        </div>
      `;

      let storageWithGB = cleanStorage;
      if (storageWithGB) {
        if (!/gb|tb/i.test(storageWithGB)) {
          storageWithGB = storageWithGB + 'GB';
        } else {
          storageWithGB = storageWithGB.toUpperCase();
        }
      }
      let deviceFullName = `${brandDisplay ? brandDisplay + ' - ' : ''}${pName}${storageWithGB ? ' - ' + storageWithGB : ''}`.trim();
      if (deviceFullName.startsWith('- ')) deviceFullName = deviceFullName.substring(2);
      deviceFullName = formatBrandDeviceName(deviceFullName);

      // CẬP NHẬT GIÁ BÁN LÊN THANH TIÊU ĐỀ TÍM
      const headerPriceEl = document.getElementById('viewPhoneHeaderPrice');
      let headerPrice = String(p.price || p.total || '').trim();
      if (headerPrice && !headerPrice.includes('.') && parseInt(headerPrice, 10) < 100 && parseInt(headerPrice, 10) > 0) {
        headerPrice = `${headerPrice}.000`;
      }
      if (headerPriceEl) {
        headerPriceEl.innerText = headerPrice;
      }
      // TÍNH TOÁN LÃI DỰ KIẾN
      let pSell = parsePriceNum(p.price || 0);
      let pIn = parsePriceNum(p.priceIn || 0);
      if (pSell > 0 && pSell < 100 && pIn >= 1000) {
        pSell = pSell * 1000;
      } else if (pIn > 0 && pIn < 100 && pSell >= 1000) {
        pIn = pIn * 1000;
      }
      let expectedProfitNum = pSell - pIn;
      let expectedProfitStr = formatPriceStr(expectedProfitNum) || (expectedProfitNum === 0 ? '0' : '0');

      contentDiv.innerHTML = `
        <div class="view-info-item"><span class="view-info-label">- Tên Máy :</span> <span class="view-info-val" style="display: inline-flex; align-items: center; gap: 4px; color: #ffffff; font-weight: 800;">${deviceFullName}</span></div>
        <div class="view-info-item">
          <span class="view-info-label">- Quốc Gia :</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${originVal}</span>
          <span style="margin: 0 10px; color: #64748b; font-weight: 800;">-</span>
          <span class="view-info-label">IMEI :</span> <span class="view-info-val" style="color: var(--amber-color); font-weight: 900;">${p.imei || 'Không có'}</span>
        </div>
        <div class="view-info-item">
          <span class="view-info-label">- Giá Nhập :</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.priceIn || '0'}</span>
          <span style="margin: 0 10px; color: #64748b; font-weight: 800;">-</span>
          <span class="view-info-label">Màu sắc:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.color || 'Không có'}</span>
        </div>
        <div class="view-info-item"><span class="view-info-label">- Tình trạng :</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.condition || 'Zin Đẹp'}</span></div>
        <div class="view-info-item"><span class="view-info-label">- Thông Tin Pin :</span> <span class="view-info-val" style="color: #ffffff; font-weight: 800;">${pinType} : ${pinVal}</span></div>
        <div class="view-info-item"><span class="view-info-label">- Lãi Dự Kiến :</span> <span class="view-info-val" style="color: #facc15; font-weight: 900;">${expectedProfitStr}</span></div>
        ${statusRow}
        ${isSold && giftTotal > 0 ? giftRowHtml : ''}
        ${warrantyRows}
        ${isSold && p.customer && p.customer !== 'Khách lẻ' ? `<div class="view-info-item"><span class="view-info-label">- Khách hàng:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${p.customer}</span></div>` : ''}
        <div class="view-info-item"><span class="view-info-label">- Ghi chú:</span> <span class="view-info-val" style="font-weight: 800; color: #ffffff;">${noteDisplay}</span></div>
        ${dateRow}
      `;

      // CẬP NHẬT 3 NÚT THAO TÁC Ở PHÍA CUỐI MODAL (BÁN, SỬA, XÓA)
      const btnSell = document.getElementById('viewModalBtnSell');
      const btnEdit = document.getElementById('viewModalBtnEdit');
      const btnDel = document.getElementById('viewModalBtnDel');

      const btnBuyBack = document.getElementById('viewModalBtnBuyBack');

      if (btnSell) {
        if (isSold) {
          btnSell.style.display = 'none';
        } else {
          btnSell.style.display = 'inline-flex';
          btnSell.onclick = function() {
            closeViewPhoneModal();
            openSellPhoneModal(p.id);
          };
        }
      }

      // NÚT MUA LẠI MÁY KHÁCH: HIỂN THỊ KHI MÁY ĐÃ BÁN / BẢO HÀNH
      if (btnBuyBack) {
        if (isSold) {
          btnBuyBack.style.display = 'inline-flex';
          btnBuyBack.onclick = function() {
            closeViewPhoneModal();
            openBuyBackPhoneModal(p);
          };
        } else {
          btnBuyBack.style.display = 'none';
        }
      }

      if (btnEdit) {
        btnEdit.onclick = function() {
          closeViewPhoneModal();
          if (isSold) {
            editSoldPhone(p.id);
          } else {
            editPhone(p.id);
          }
        };
      }

      if (btnDel) {
        btnDel.onclick = function() {
          closeViewPhoneModal();
          if (isSold) {
            deleteSoldPhone(p.id);
          } else {
            deletePhone(p.id);
          }
        };
      }

      if (viewModal) {
        viewModal.style.zIndex = '100000';
        viewModal.classList.add('active');
        viewModal.style.display = 'flex';
      }
    }
    window.viewPhone = viewPhone;

    function closeViewPhoneModal() {
      const m = document.getElementById('viewPhoneModal');
      if (m) {
        m.classList.remove('active');
        m.style.display = 'none';
      }
    }
    window.closeViewPhoneModal = closeViewPhoneModal;

    function editPhone(id) {
      openPhoneModal(id);
    }
    window.editPhone = editPhone;

    function deletePhone(id) {
      const p = phoneDatabase.find(item => item.id === id);
      const confirmWord = prompt("⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn máy này khỏi kho!\n\nNhập chữ \"yes\" để xác nhận xóa:");
      if (confirmWord !== null) {
        if (confirmWord.trim().toLowerCase() === "yes") {
          phoneDatabase = phoneDatabase.filter(item => String(item.id) !== String(id) && item.id != id);
          savePhoneStorage();
          if (typeof db !== 'undefined' && db && id) {
            db.collection('phones').doc(String(id)).delete().catch(console.error);
          }
          if (p && typeof logActivity === 'function') {
            logActivity('DELETE', 'banmay', 'Bán máy', `Xóa máy khỏi kho: ${p.brand} ${p.name} (${p.imei || 'Không IMEI'})`, p, null, id);
          }
          renderPhoneGrid();
          alert("Đã xóa máy khỏi kho thành công!");
        } else {
          alert("Xác nhận không đúng! Bạn cần gõ đúng chữ \"yes\" để xóa máy khỏi kho.");
        }
      }
    }

    function duplicatePhone(id) {
      const p = phoneDatabase.find(item => item.id === id);
      if (!p) return;
      const newPhone = JSON.parse(JSON.stringify(p));
      newPhone.id = Date.now();
      newPhone.imei = '';
      phoneDatabase.unshift(newPhone);
      savePhoneStorage();
      if (typeof logActivity === 'function') {
        logActivity('CREATE', 'banmay', 'Bán máy', `Nhân bản máy: ${newPhone.brand} ${newPhone.name}`, null, newPhone, newPhone.id);
      }
      renderPhoneGrid();
      showToast(`Đã nhân bản máy "${newPhone.brand} - ${newPhone.name}"! Hãy cập nhật số IMEI mới.`);
    }
    window.duplicatePhone = duplicatePhone;

    let currentSellingPhone = null;

    function openSellPhoneModal(id) {
      const p = phoneDatabase.find(item => item.id === id);
      if (!p) return;

      currentSellingPhone = p;
      document.getElementById('sellPhoneId').value = p.id;
      let cleanStorage = (p.storage || '').replace(/[()]/g, '');
      
      document.getElementById('sellPhoneSummaryTitle').innerText = `${p.brand} - ${p.name} ${cleanStorage ? `(${cleanStorage})` : ''}`;
      document.getElementById('sellPhoneSummaryImei').innerText = p.imei || 'Chưa có';

      let dotColor = getHexColor(p.color);
      let summaryDot = document.getElementById('sellPhoneSummaryDot');
      if (summaryDot) {
        summaryDot.style.backgroundColor = dotColor;
        summaryDot.style.boxShadow = `0 0 8px ${dotColor}66`;
      }

      let pinVal = formatPinByBrand(p.pin, p.brand, p.name);
      document.getElementById('sellPhoneSummaryDetails').innerText = `${p.condition || 'Zin Đẹp 99%'} - Pin : ${pinVal} - QG: ${p.origin || 'VN/A'} - Giá Nhập : ${p.priceIn || '0'}`;

      document.getElementById('sellCustomerName').value = '';
      document.getElementById('sellCustomerName').placeholder = 'Khách Lẻ';

      let defaultPrice = p.price || '';
      let priceInput = document.getElementById('sellPriceOut');
      priceInput.value = '';
      priceInput.placeholder = defaultPrice;
      priceInput.dataset.defaultPrice = defaultPrice;
      
      document.getElementById('sellTargetList').value = '';
      document.getElementById('sellPaymentMethod').value = '';
      document.getElementById('sellWarranty').value = '';
      
      ['giftSac', 'giftOp', 'giftCluc', 'giftKhac'].forEach(gid => {
        let inputEl = document.getElementById(gid);
        inputEl.value = '';
        inputEl.placeholder = '0';
      });

      document.getElementById('sellDateVal').value = getCurrentDateStr();

      calcSellProfit();
      checkGiftsEntered();
      document.getElementById('sellPhoneModal').classList.add('active');
    }

    function closeSellPhoneModal() {
      document.getElementById('sellPhoneModal').classList.remove('active');
    }

    function handleDefaultInputFocus(input) {
      // Khi bấm vào tự ẩn placeholder/nội dung mờ để người dùng nhập mới
      input.dataset.oldPlaceholder = input.placeholder;
      input.placeholder = '';
    }

    function handleDefaultInputBlur(input, fallbackPlaceholder) {
      if (!input.placeholder) {
        input.placeholder = input.dataset.oldPlaceholder || fallbackPlaceholder;
      }
    }

    function handlePriceOutFocus(input) {
      // Khi bấm vào tự ẩn giá mờ để nhập giá mới
      input.dataset.savedPlaceholder = input.placeholder;
      input.placeholder = '';
      if (input.value === input.dataset.defaultPrice) {
        input.value = '';
      }
      calcSellProfit();
    }

    function handlePriceOutBlur(input) {
      if (input.value.trim() === '') {
        input.placeholder = input.dataset.savedPlaceholder || input.dataset.defaultPrice || '0';
      }
      calcSellProfit();
    }

    function handleGiftFocus(input) {
      if (input.value === '0') {
        input.value = '';
      }
    }

    function handleGiftBlur(input) {
      if (input.value.trim() === '') {
        input.placeholder = '0';
      }
    }

    function handleGiftInput(input) {
      formatCurrencyInput(input);
      calcSellProfit();
      checkGiftsEntered();
    }

    function checkGiftsEntered() {
      const gSac = document.getElementById('giftSac').value.trim();
      const gOp = document.getElementById('giftOp').value.trim();
      const gCluc = document.getElementById('giftCluc').value.trim();
      const gKhac = document.getElementById('giftKhac').value.trim();
      const btnConfirm = document.getElementById('btnConfirmSellPhone');

      const hasAtLeastOne = (gSac !== '' || gOp !== '' || gCluc !== '' || gKhac !== '');

      if (hasAtLeastOne) {
        btnConfirm.classList.add('active');
      } else {
        btnConfirm.classList.remove('active');
      }
    }

    function calcSellProfit() {
      if (!currentSellingPhone) return;

      let priceInput = document.getElementById('sellPriceOut');
      let priceValStr = priceInput.value.trim() || priceInput.dataset.defaultPrice || currentSellingPhone.price || '0';
      let priceOutNum = parsePriceNum(priceValStr);
      let priceInNum = parsePriceNum(currentSellingPhone.priceIn);

      let gSac = parsePriceNum(document.getElementById('giftSac').value);
      let gOp = parsePriceNum(document.getElementById('giftOp').value);
      let gCluc = parsePriceNum(document.getElementById('giftCluc').value);
      let gKhac = parsePriceNum(document.getElementById('giftKhac').value);
      let totalGiftMoney = gSac + gOp + gCluc + gKhac;

      document.getElementById('sellTotalGiftMoney').value = totalGiftMoney > 0 ? formatPriceStr(totalGiftMoney) : '0';

      let profit = priceOutNum - priceInNum - totalGiftMoney;
      let profitFormatted = (profit < 0 ? '-' : '') + formatPriceStr(Math.abs(profit));
      document.getElementById('sellProfitVal').value = profitFormatted;
    }

    function confirmSellPhone(e) {
      e.preventDefault();
      const id = parseFloat(document.getElementById('sellPhoneId').value);
      const idx = phoneDatabase.findIndex(p => p.id === id);
      if (idx === -1) {
        alert('Không tìm thấy thông tin máy trong kho!');
        return;
      }

      const targetList = document.getElementById('sellTargetList').value;
      if (!targetList) {
        alert('Vui lòng chọn danh mục "Lưu Vào" (Bán Hàng hoặc Bán Gà)!');
        return;
      }

      const paymentMethod = document.getElementById('sellPaymentMethod').value;
      if (!paymentMethod) {
        alert('Vui lòng chọn hình thức "Thanh Toán" (Tiền Mặt hoặc Chuyển Khoản)!');
        return;
      }

      const warranty = document.getElementById('sellWarranty').value;
      if (!warranty) {
        alert('Vui lòng chọn gói "Bảo Hành"!');
        return;
      }

      const gSac = document.getElementById('giftSac').value.trim();
      const gOp = document.getElementById('giftOp').value.trim();
      const gCluc = document.getElementById('giftCluc').value.trim();
      const gKhac = document.getElementById('giftKhac').value.trim();
      if (!gSac && !gOp && !gCluc && !gKhac) {
        alert('Vui lòng nhập thông tin quà tặng vào ít nhất 1 trong 4 ô phụ kiện tặng kèm!');
        return;
      }

      const customerName = toTitleCase(document.getElementById('sellCustomerName').value.trim()) || 'Khách Lẻ';
      const priceInput = document.getElementById('sellPriceOut');
      const actualPriceOut = priceInput.value.trim() || priceInput.dataset.defaultPrice || currentSellingPhone.price || '0';
      const dateVal = document.getElementById('sellDateVal').value.trim() || getCurrentDateStr();
      const timeVal = getCurrentTimeStr();
      const fullDateTime = `${timeVal} - ${dateVal}`;

      let gifts = [];
      if (gSac) gifts.push(`Sạc: ${gSac}`);
      if (gOp) gifts.push(`Ốp: ${gOp}`);
      if (gCluc) gifts.push(`C.Lực: ${gCluc}`);
      if (gKhac) gifts.push(`Khác: ${gKhac}`);
      let giftStr = gifts.length > 0 ? ` [Quà Tặng: ${gifts.join(', ')}]` : '';

      let profitValStr = document.getElementById('sellProfitVal').value;

      let soldItem = phoneDatabase.splice(idx, 1)[0];

      let totalGiftMoney = parsePriceNum(document.getElementById('sellTotalGiftMoney') ? document.getElementById('sellTotalGiftMoney').value : 0);

      soldItem.price = actualPriceOut;
      soldItem.soldDate = dateVal;
      soldItem.customer = customerName;
      soldItem.warranty = warranty;
      soldItem.targetList = targetList;
      soldItem.giftStr = giftStr;
      soldItem.totalGiftMoney = totalGiftMoney;
      soldItem.soldDateTime = fullDateTime;
      soldItem.status = 'Đã bán (Còn Cái Nịt)';
      
      soldPhoneDatabase.unshift(soldItem);

      let cleanStorage = formatStorageDisplay((soldItem.storage || '').replace(/[()]/g, ''));
      let soldName = formatBrandDeviceName(soldItem.name || '');
      let displayName = `${soldItem.brand} - ${soldName} ${cleanStorage ? cleanStorage : ''} (${soldItem.imei})`.trim();

      let record = {
        id: Date.now() + Math.random(),
        name: displayName,
        brand: soldItem.brand,
        phoneName: soldItem.name,
        storage: cleanStorage,
        color: soldItem.color,
        imei: soldItem.imei,
        condition: soldItem.condition,
        pinStatus: soldItem.pinStatus,
        pin: soldItem.pin,
        origin: soldItem.origin,
        accessory: targetList === 'Bán Gà' ? 'Bán Máy' : undefined,
        total: actualPriceOut,
        priceIn: soldItem.priceIn || '0',
        profit: profitValStr,
        method: paymentMethod,
        dateTime: fullDateTime,
        customer: customerName
      };

      if (targetList === 'Bán Gà') {
        bangaDatabase.unshift(record);
        saveBangaStorage();
        renderBangaTable(bangaDatabase);
      } else {
        salesDatabase.unshift(record);
        saveSalesStorage();
        renderSalesTable(salesDatabase);
      }

      if (typeof logActivity === 'function') {
        logActivity('EDIT', 'banmay', 'Bán máy', `Bán máy: ${displayName} cho ${customerName} - Giá: ${actualPriceOut} (Lãi: ${profitValStr})`, null, soldItem, soldItem.id);
        logActivity('ADD', 'baohanh', 'Bảo hành', `Thêm máy vào sổ bảo hành: ${displayName} - Khách: ${customerName}`, null, soldItem, soldItem.id);
      }

      savePhoneStorage();
      closeSellPhoneModal();

      renderPhoneGrid();
      renderSoldPhoneTable();

      alert(`Đã xác nhận bán máy ${soldItem.name} (${soldItem.imei}) thành công!\n- Lưu vào: ${targetList}\n- Thanh toán: ${paymentMethod}\n- Bảo hành: ${warranty}.`);
    }

    /* ============================================================
       XỬ LÝ BÁN MÁY NGOÀI KHO (CHUẨN FORM POPUP XÁC NHẬN BÁN MÁY)
       ============================================================ */
    function openExternalSellPhoneModal() {
      document.getElementById('extPhoneName').value = '';
      document.getElementById('extPhoneImei').value = '';
      document.getElementById('extPriceIn').value = '';
      document.getElementById('extCondition').value = '';
      document.getElementById('extCustomerName').value = '';
      document.getElementById('extPriceOut').value = '';
      document.getElementById('extTargetList').value = '';
      document.getElementById('extPaymentMethod').value = '';
      document.getElementById('extWarranty').value = '';
      ['extGiftSac', 'extGiftOp', 'extGiftCluc', 'extGiftKhac'].forEach(gid => {
        let el = document.getElementById(gid);
        if (el) {
          el.value = '';
          el.placeholder = '0';
        }
      });
      document.getElementById('extSellDateVal').value = getCurrentDateStr();
      calcExtSellProfit();
      checkExtGiftsEntered();
      const modal = document.getElementById('externalSellPhoneModal');
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    }

    function closeExternalSellPhoneModal() {
      const modal = document.getElementById('externalSellPhoneModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    function adjustExtSellDate(days) {
      const dateInput = document.getElementById('extSellDateVal');
      let parts = dateInput.value.split('/');
      if (parts.length === 3) {
        let d = new Date(parts[2], parts[1] - 1, parts[0]);
        d.setDate(d.getDate() + days);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        dateInput.value = `${day}/${month}/${year}`;
      } else {
        dateInput.value = getCurrentDateStr();
      }
    }

    function handleExtGiftFocus(input) {
      if (input.value === '0') input.value = '';
    }

    function handleExtGiftBlur(input) {
      if (input.value.trim() === '') input.placeholder = '0';
    }

    function handleExtGiftInput(input) {
      formatCurrencyInput(input);
      calcExtSellProfit();
      checkExtGiftsEntered();
    }

    function checkExtGiftsEntered() {
      const gSac = document.getElementById('extGiftSac') ? document.getElementById('extGiftSac').value.trim() : '';
      const gOp = document.getElementById('extGiftOp') ? document.getElementById('extGiftOp').value.trim() : '';
      const gCluc = document.getElementById('extGiftCluc') ? document.getElementById('extGiftCluc').value.trim() : '';
      const gKhac = document.getElementById('extGiftKhac') ? document.getElementById('extGiftKhac').value.trim() : '';
      const btnConfirm = document.getElementById('btnConfirmExtSellPhone');
      if (!btnConfirm) return;
      const hasAtLeastOne = (gSac !== '' || gOp !== '' || gCluc !== '' || gKhac !== '');
      if (hasAtLeastOne) {
        btnConfirm.classList.add('active');
      } else {
        btnConfirm.classList.remove('active');
      }
    }

    function calcExtSellProfit() {
      let priceOutNum = parsePriceNum(document.getElementById('extPriceOut') ? document.getElementById('extPriceOut').value : 0);
      let priceInNum = parsePriceNum(document.getElementById('extPriceIn') ? document.getElementById('extPriceIn').value : 0);

      let gSac = parsePriceNum(document.getElementById('extGiftSac') ? document.getElementById('extGiftSac').value : 0);
      let gOp = parsePriceNum(document.getElementById('extGiftOp') ? document.getElementById('extGiftOp').value : 0);
      let gCluc = parsePriceNum(document.getElementById('extGiftCluc') ? document.getElementById('extGiftCluc').value : 0);
      let gKhac = parsePriceNum(document.getElementById('extGiftKhac') ? document.getElementById('extGiftKhac').value : 0);
      let totalGiftMoney = gSac + gOp + gCluc + gKhac;

      const giftMoneyEl = document.getElementById('extSellTotalGiftMoney');
      if (giftMoneyEl) giftMoneyEl.value = totalGiftMoney > 0 ? formatPriceStr(totalGiftMoney) : '0';

      let profit = priceOutNum - priceInNum - totalGiftMoney;
      let profitFormatted = (profit < 0 ? '-' : '') + formatPriceStr(Math.abs(profit));
      const profitEl = document.getElementById('extSellProfitVal');
      if (profitEl) profitEl.value = profitFormatted;
    }

    function confirmExternalSellPhone(e) {
      e.preventDefault();
      const phoneName = document.getElementById('extPhoneName').value.trim();
      if (!phoneName) {
        alert('Vui lòng nhập tên máy!');
        document.getElementById('extPhoneName').focus();
        return;
      }
      const imei = document.getElementById('extPhoneImei').value.trim();
      if (!imei) {
        alert('Vui lòng nhập IMEI!');
        document.getElementById('extPhoneImei').focus();
        return;
      }
      const priceIn = document.getElementById('extPriceIn').value.trim();
      if (!priceIn) {
        alert('Vui lòng nhập giá nhập!');
        document.getElementById('extPriceIn').focus();
        return;
      }
      const priceOut = document.getElementById('extPriceOut').value.trim();
      if (!priceOut) {
        alert('Vui lòng nhập giá bán thực tế!');
        document.getElementById('extPriceOut').focus();
        return;
      }
      const targetList = document.getElementById('extTargetList').value;
      if (!targetList) {
        alert('Vui lòng chọn danh sách "Lưu Vào" (Bán Hàng hoặc Bán Gà)!');
        document.getElementById('extTargetList').focus();
        return;
      }
      const paymentMethod = document.getElementById('extPaymentMethod').value;
      if (!paymentMethod) {
        alert('Vui lòng chọn hình thức "Thanh Toán"!');
        document.getElementById('extPaymentMethod').focus();
        return;
      }
      const warranty = document.getElementById('extWarranty').value;
      if (!warranty) {
        alert('Vui lòng chọn gói "Bảo Hành"!');
        document.getElementById('extWarranty').focus();
        return;
      }
      const rawCustomer = document.getElementById('extCustomerName').value.trim();
      const customerName = rawCustomer ? toTitleCase(rawCustomer) : 'Khách Lẻ';
      const condition = document.getElementById('extCondition').value.trim() || 'Zin Đẹp 99%';
      const dateVal = document.getElementById('extSellDateVal').value.trim() || getCurrentDateStr();
      const timeVal = getCurrentTimeStr();
      const fullDateTime = `${timeVal} - ${dateVal}`;

      const gSac = document.getElementById('extGiftSac').value.trim();
      const gOp = document.getElementById('extGiftOp').value.trim();
      const gCluc = document.getElementById('extGiftCluc').value.trim();
      const gKhac = document.getElementById('extGiftKhac').value.trim();

      let gifts = [];
      if (gSac) gifts.push(`Sạc: ${gSac}`);
      if (gOp) gifts.push(`Ốp: ${gOp}`);
      if (gCluc) gifts.push(`C.Lực: ${gCluc}`);
      if (gKhac) gifts.push(`Khác: ${gKhac}`);
      let giftStr = gifts.length > 0 ? ` [Quà Tặng: ${gifts.join(', ')}]` : '';

      let profitValStr = document.getElementById('extSellProfitVal').value;

      // Tự động nhận diện thương hiệu từ tên máy
      let lowerPhone = phoneName.toLowerCase();
      let detectedBrand = '❤️❤️❤️'; // Mặc định khi không ghi hãng gì thì chèn 3 trái tim màu đỏ
      if (lowerPhone.includes('iphone') || lowerPhone.includes('ipad') || lowerPhone.includes('apple')) {
        detectedBrand = 'IPHONE';
      } else if (lowerPhone.includes('samsung') || lowerPhone.includes('galaxy')) {
        detectedBrand = 'SAMSUNG';
      } else if (lowerPhone.includes('oppo')) {
        detectedBrand = 'OPPO';
      } else if (lowerPhone.includes('xiaomi') || lowerPhone.includes('redmi') || lowerPhone.includes('poco')) {
        detectedBrand = 'XIAOMI';
      } else if (lowerPhone.includes('realme')) {
        detectedBrand = 'REALME';
      } else if (lowerPhone.includes('vivo')) {
        detectedBrand = 'VIVO';
      }

      // Trích xuất dung lượng nếu có trong tên máy (ví dụ 64gb, 128gb, 256gb, 512gb, 1tb)
      let storageMatch = phoneName.match(/(\d+\s*(gb|tb))/i);
      let detectedStorage = storageMatch ? storageMatch[1].toUpperCase() : '';

      // 1. TỰ ĐỘNG MẶC ĐỊNH LƯU VÀO TAB BẢO HÀNH (MÁY ĐÃ BÁN & BẢO HÀNH)
      let soldItem = {
        id: Date.now() + Math.random(),
        brand: detectedBrand,
        name: phoneName,
        color: '',
        storage: detectedStorage,
        imei: imei,
        price: priceOut,
        total: priceOut,
        priceIn: priceIn,
        profit: profitValStr,
        condition: condition,
        pinStatus: '',
        pin: '',
        origin: '',
        status: 'Đã Bán (❤️)',
        note: 'Bán máy ❤️',
        soldDate: dateVal,
        date: dateVal,
        dateTime: fullDateTime,
        soldDateTime: fullDateTime,
        customer: customerName,
        warranty: warranty,
        method: paymentMethod,
        paymentMethod: paymentMethod,
        targetList: targetList,
        giftStr: giftStr,
        totalGiftMoney: parsePriceNum(document.getElementById('extSellTotalGiftMoney') ? document.getElementById('extSellTotalGiftMoney').value : 0)
      };

      soldPhoneDatabase.unshift(soldItem);
      savePhoneStorage();

      // 2. LƯU VÀO BÁN HÀNG HOẶC BÁN GÀ THEO LỰA CHỌN
      let prefixBrand = (detectedBrand === '❤️❤️❤️' || detectedBrand === 'MÁY NGOÀI' || !detectedBrand) ? '❤️❤️❤️ - ' : `${detectedBrand} - `;
      let displayName = `${prefixBrand}${phoneName}${imei ? ' (' + imei + ')' : ''}`;
      let record = {
        id: Date.now() + Math.random(),
        name: displayName,
        brand: detectedBrand,
        phoneName: phoneName,
        storage: detectedStorage,
        color: '',
        imei: imei,
        condition: condition,
        pinStatus: '',
        pin: '',
        origin: '',
        accessory: targetList === 'Bán Gà' ? 'Bán Máy (Ngoài Kho)' : undefined,
        total: priceOut,
        priceIn: priceIn,
        profit: profitValStr,
        method: paymentMethod,
        paymentMethod: paymentMethod,
        paymentStatus: 'Đã Trả',
        dateTime: fullDateTime,
        date: dateVal,
        customer: customerName,
        warranty: warranty,
        note: 'Bán máy ❤️'
      };

      if (targetList === 'Bán Gà') {
        bangaDatabase.unshift(record);
        saveBangaStorage();
        renderBangaTable(bangaDatabase);
      } else {
        salesDatabase.unshift(record);
        saveSalesStorage();
        renderSalesTable(salesDatabase);
      }

      closeExternalSellPhoneModal();
      renderSoldPhoneTable();

      alert(`Đã xác nhận bán máy ngoài kho "${displayName}" thành công!\n- Đã lưu vào: ${targetList}\n- Tự động lưu vào: BẢO HÀNH\n- Thanh toán: ${paymentMethod}\n- Gói bảo hành: ${warranty}`);
    }

    function editSoldPhone(id) {
      let item = soldPhoneDatabase.find(s => String(s.id) === String(id) || s.id == id);
      if (!item) {
        alert("Không tìm thấy dữ liệu máy đã bán này!");
        return;
      }
      document.getElementById('editSaleId').value = item.id;
      document.getElementById('editSaleType').value = 'soldPhone';
      document.getElementById('editSaleModalTitle').innerText = 'Sửa thông tin máy đã bán';
      
      let cleanStorage = (item.storage || '').replace(/[()]/g, '');
      let defaultName = `${item.brand ? item.brand + ' - ' : ''}${item.name || ''} ${cleanStorage ? cleanStorage : ''}`.trim();
      document.getElementById('editSaleName').value = defaultName;
      document.getElementById('editSalePriceOut').value = item.price || item.total || '';
      document.getElementById('editSalePriceIn').value = item.priceIn || '';
      document.getElementById('editSaleMethod').value = item.method || 'Tiền Mặt';
      document.getElementById('editSaleDateTime').value = item.dateTime || item.soldDateTime || (item.soldDate ? `${getCurrentTimeStr()} - ${item.soldDate}` : item.date || '');

      const conditionRow = document.getElementById('editSaleConditionRow');
      const conditionInput = document.getElementById('editSaleCondition');
      if (conditionRow && conditionInput) {
        conditionRow.style.display = 'block';
        conditionInput.value = item.condition || '';
      }
      
      const modal = document.getElementById('editSaleModal');
      if (modal) {
        modal.style.zIndex = '100000';
        modal.classList.add('active');
        modal.style.display = 'flex';
      }
    }

    function cloneSoldPhone(id) {
      const p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      if (!p) return;
      
      let newImei = prompt("Nhập IMEI 4 số cho máy nhân bản mới:", p.imei);
      if (newImei !== null && newImei.trim() !== "") {
        let cleanImei = newImei.replace(/\D/g, '').slice(0, 4);
        if (cleanImei.length < 4) {
          alert("IMEI phải có đủ 4 chữ số!");
          return;
        }

        let clonedItem = JSON.parse(JSON.stringify(p));
        clonedItem.id = Date.now() + Math.random();
        clonedItem.imei = cleanImei;
        clonedItem.date = getCurrentDateStr();
        delete clonedItem.soldDate;
        delete clonedItem.soldDateTime;
        delete clonedItem.customer;
        delete clonedItem.warranty;

        phoneDatabase.unshift(clonedItem);
        savePhoneStorage();
        renderPhoneGrid();
        alert(`Đã nhân bản máy thành công về Kho Máy!`);
        switchMainTab('banmay');
      }
    }

    let currentBuyBackItem = null;

    function deleteSoldPhone(id) {
      const p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      if (!p) {
        alert("Không tìm thấy dữ liệu máy trong danh sách đã bán & bảo hành!");
        return;
      }
      currentBuyBackItem = p;
      openBuyBackPhoneModal(p);
    }

    function getPhoneGiftTotal(p) {
      if (!p) return 0;
      let giftTotal = 0;
      if (p.totalGiftMoney !== undefined && p.totalGiftMoney !== null && p.totalGiftMoney !== '') {
        giftTotal = parsePriceNum(p.totalGiftMoney);
      }
      if (!giftTotal && p.giftCost !== undefined && p.giftCost !== null && p.giftCost !== '') {
        giftTotal = parsePriceNum(p.giftCost);
      }
      if (p.giftStr) {
        let cleanGifts = String(p.giftStr).replace(/\[\s*Quà Tặng:\s*/i, '').replace(/\]/g, '').trim();
        if (!giftTotal && cleanGifts) {
          let matches = cleanGifts.match(/:\s*([0-9.,kK]+)/g);
          if (matches) {
            matches.forEach(m => {
              let num = parsePriceNum(m.replace(':', '').trim());
              giftTotal += num;
            });
          }
        }
      }
      // Tra cứu thêm trong salesDatabase và bangaDatabase nếu có IMEI
      if (!giftTotal && p.imei) {
        if (typeof salesDatabase !== 'undefined' && Array.isArray(salesDatabase)) {
          let s = salesDatabase.find(x => x.imei === p.imei || (x.name && x.name.includes(p.imei)));
          if (s) {
            if (s.totalGiftMoney) giftTotal = parsePriceNum(s.totalGiftMoney);
            else if (s.giftCost) giftTotal = parsePriceNum(s.giftCost);
            else if (s.giftStr) {
              let matches = String(s.giftStr).match(/:\s*([0-9.,kK]+)/g);
              if (matches) matches.forEach(m => { giftTotal += parsePriceNum(m.replace(':', '').trim()); });
            }
          }
        }
        if (!giftTotal && typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
          let b = bangaDatabase.find(x => x.imei === p.imei || (x.name && x.name.includes(p.imei)));
          if (b) {
            if (b.totalGiftMoney) giftTotal = parsePriceNum(b.totalGiftMoney);
            else if (b.giftCost) giftTotal = parsePriceNum(b.giftCost);
            else if (b.giftStr) {
              let matches = String(b.giftStr).match(/:\s*([0-9.,kK]+)/g);
              if (matches) matches.forEach(m => { giftTotal += parsePriceNum(m.replace(':', '').trim()); });
            }
          }
        }
      }
      return giftTotal;
    }

    function getPhoneGiftDetailStr(p) {
      if (!p) return '';
      if (p.giftStr) {
        return String(p.giftStr).replace(/\[\s*Quà Tặng:\s*/i, '').replace(/\]/g, '').trim();
      }
      if (p.imei) {
        if (typeof salesDatabase !== 'undefined' && Array.isArray(salesDatabase)) {
          let s = salesDatabase.find(x => x.imei === p.imei || (x.name && x.name.includes(p.imei)));
          if (s && s.giftStr) return String(s.giftStr).replace(/\[\s*Quà Tặng:\s*/i, '').replace(/\]/g, '').trim();
        }
        if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
          let b = bangaDatabase.find(x => x.imei === p.imei || (x.name && x.name.includes(p.imei)));
          if (b && b.giftStr) return String(b.giftStr).replace(/\[\s*Quà Tặng:\s*/i, '').replace(/\]/g, '').trim();
        }
      }
      return '';
    }

    function openBuyBackPhoneModal(p) {
      if (!p) return;
      document.getElementById('bbSoldId').value = p.id;
      document.getElementById('bbName').value = p.name || '';
      document.getElementById('bbImei').value = p.imei || '';
      document.getElementById('bbColor').value = p.color || 'Trắng';

      let dotColor = getHexColor(p.color || 'Trắng');
      let colorDot = document.getElementById('bbColorDot');
      if (colorDot) {
        colorDot.style.backgroundColor = dotColor;
        colorDot.style.boxShadow = `0 0 8px ${dotColor}88`;
      }

      let rawStorage = (p.storage || '').replace(/[()]/g, '').trim();
      document.getElementById('bbStorage').value = rawStorage;
      document.getElementById('bbCondition').value = p.condition || 'Zin Đẹp 99%';
      document.getElementById('bbPinStatus').value = p.pinStatus || 'Pin Zin';
      document.getElementById('bbPin').value = p.pin || '';

      // Tìm thông tin giá bán và giá vốn từ máy hoặc đơn bán hàng
      let sellPrice = p.sellPrice || p.price || '0';
      let origCost = p.priceIn || p.originalCost || '0';
      let giftTotal = getPhoneGiftTotal(p);
      let giftDetail = getPhoneGiftDetailStr(p);

      // Tra cứu thêm trong salesDatabase nếu có IMEI
      if (p.imei && typeof salesDatabase !== 'undefined' && Array.isArray(salesDatabase)) {
        let saleRec = salesDatabase.find(s => s.imei === p.imei || (s.name && s.name.includes(p.imei)));
        if (saleRec) {
          if (saleRec.price) sellPrice = saleRec.price;
          if (saleRec.cost) origCost = saleRec.cost;
        }
      }

      document.getElementById('bbSellPrice').value = formatPriceStr(sellPrice);
      document.getElementById('bbOriginalCost').value = formatPriceStr(origCost);
      document.getElementById('bbGiftCost').value = formatPriceStr(giftTotal);
      document.getElementById('bbBuyBackPrice').value = '';
      document.getElementById('bbProfitDisplay').innerText = '0 đ';
      document.getElementById('bbNewCostDisplay').innerText = formatPriceStr(origCost) + ' đ';
      document.getElementById('bbNextSellPrice').value = '';
      const mobNextSell = document.getElementById('bbMobileNextSellPrice');
      if (mobNextSell) mobNextSell.value = '';
      if (document.getElementById('bbNote')) document.getElementById('bbNote').value = '';

      calcBuyBackCalculation();
      let modal = document.getElementById('buyBackPhoneModal');
      if (modal) {
        modal.classList.add('active');
        modal.classList.add('show');
      }
    }

    function syncMobileNextSellPrice(val) {
      const desktopInput = document.getElementById('bbNextSellPrice');
      if (desktopInput) desktopInput.value = val;
    }
    window.syncMobileNextSellPrice = syncMobileNextSellPrice;

    function closeBuyBackPhoneModal() {
      let modal = document.getElementById('buyBackPhoneModal');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('show');
      }
    }

    function calcBuyBackCalculation() {
      let sellPriceNum = parsePriceNum(document.getElementById('bbSellPrice').value);
      let origCostNum = parsePriceNum(document.getElementById('bbOriginalCost').value);
      let buyBackPriceNum = parsePriceNum(document.getElementById('bbBuyBackPrice').value);
      let giftCostNum = parsePriceNum(document.getElementById('bbGiftCost').value);

      if (buyBackPriceNum > 0) {
        // Tiền lời khi thu lại = Giá bán thực tế - Giá mua lại khách
        let profit = sellPriceNum - buyBackPriceNum;
        // Giá nhập mới hoàn kho = Giá vốn ban đầu - Tiền lời khi thu lại + Tiền phụ kiện tặng kèm
        let newCost = origCostNum - profit + giftCostNum;

        document.getElementById('bbProfitDisplay').innerText = (profit >= 0 ? '+' : '') + formatPriceStr(profit) + ' đ';
        document.getElementById('bbNewCostDisplay').innerText = formatPriceStr(newCost) + ' đ';

        let explEl = document.getElementById('bbFormulaExplanation');
        if (explEl) {
          let giftCalcStr = giftCostNum > 0 ? ` + <strong>${formatPriceStr(giftCostNum)}</strong> (Phụ kiện)` : '';
          explEl.innerHTML = `
            💡 <strong>Tính toán thực tế:</strong><br>
            • Tiền lời thu lại: <strong>${formatPriceStr(sellPriceNum)}</strong> (Giá bán) - <strong>${formatPriceStr(buyBackPriceNum)}</strong> (Giá mua lại) = <strong style="color:#34d399;">${formatPriceStr(profit)} đ</strong><br>
            • Giá nhập mới hoàn kho: <strong>${formatPriceStr(origCostNum)}</strong> (Giá vốn lúc nhập) - <strong>${formatPriceStr(profit)}</strong> (Lời)${giftCalcStr} = <strong style="color:#fbbf24;">${formatPriceStr(newCost)} đ</strong>.
          `;
        }
      } else {
        document.getElementById('bbProfitDisplay').innerText = '0 đ';
        let initialNewCost = origCostNum + giftCostNum;
        document.getElementById('bbNewCostDisplay').innerText = formatPriceStr(initialNewCost) + ' đ';
        let explEl = document.getElementById('bbFormulaExplanation');
        if (explEl) {
          explEl.innerHTML = `💡 <em>Giá Nhập Mới = Giá Vốn (Lúc Nhập) - Tiền Lời + Tiền Phụ Kiện</em>`;
        }
      }
    }

    function confirmBuyBackPhone(e) {
      if (e) e.preventDefault();
      let id = document.getElementById('bbSoldId').value;
      const p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      if (!p) {
        alert("Không tìm thấy dữ liệu máy!");
        return;
      }

      let sellPrice = document.getElementById('bbSellPrice').value;
      let origCost = document.getElementById('bbOriginalCost').value;
      let giftCost = document.getElementById('bbGiftCost').value;
      let buyBackPrice = document.getElementById('bbBuyBackPrice').value;
      let nextSellPrice = document.getElementById('bbNextSellPrice').value.trim();

      if (!buyBackPrice || parsePriceNum(buyBackPrice) <= 0) {
        alert("Vui lòng nhập Giá Mua Lại Khách!");
        document.getElementById('bbBuyBackPrice').focus();
        return;
      }

      if (!nextSellPrice || parsePriceNum(nextSellPrice) <= 0) {
        alert("Vui lòng nhập GIÁ BÁN ĐỀ XUẤT!");
        document.getElementById('bbNextSellPrice').focus();
        return;
      }

      let note = document.getElementById('bbNote') ? document.getElementById('bbNote').value : '';

      let sellPriceNum = parsePriceNum(sellPrice);
      let origCostNum = parsePriceNum(origCost);
      let giftCostNum = parsePriceNum(giftCost);
      let buyBackPriceNum = parsePriceNum(buyBackPrice);
      let profitNum = sellPriceNum - buyBackPriceNum;
      
      // Theo yêu cầu: Giá nhập = Giá mua lại của khách, Giá bán = Giá bán đề xuất
      let newCostNum = buyBackPriceNum;

      // Xóa khỏi soldPhoneDatabase
      soldPhoneDatabase = soldPhoneDatabase.filter(item => String(item.id) !== String(id) && item.id != id);

      // Tạo object hoàn kho về phoneDatabase (Mục Bán Máy)
      let restoredPhone = {
        id: Date.now() + Math.random(),
        brand: p.brand || (isPhoneBrandIphone('', p.name) ? 'IPHONE' : 'KHÁC'),
        name: document.getElementById('bbName').value.trim() || p.name,
        color: document.getElementById('bbColor').value.trim() || p.color || 'Trắng',
        storage: document.getElementById('bbStorage').value.trim() ? `(${document.getElementById('bbStorage').value.trim()})` : (p.storage || ''),
        imei: document.getElementById('bbImei').value.trim() || p.imei || '',
        price: formatPriceStr(nextSellPrice),
        condition: document.getElementById('bbCondition').value.trim() || p.condition || 'Zin Đẹp 99%',
        pinStatus: document.getElementById('bbPinStatus').value.trim() || p.pinStatus || 'Pin Zin',
        pin: document.getElementById('bbPin').value.trim() || p.pin || '',
        origin: p.origin || 'VN/A',
        priceIn: formatPriceStr(newCostNum),
        status: 'Còn Hàng',
        note: note || `Thu lại của khách ${p.customer || ''}`,
        date: getCurrentDateStr(),
        isBuyBack: true,
        buyBackData: {
          sellPrice: formatPriceStr(sellPriceNum),
          originalCost: formatPriceStr(origCostNum),
          giftCost: formatPriceStr(giftCost),
          buyBackPrice: formatPriceStr(buyBackPriceNum),
          profit: formatPriceStr(profitNum),
          newCost: formatPriceStr(newCostNum),
          buyBackDate: getCurrentDateStr(),
          customer: p.customer || 'Khách lẻ',
          note: note
        }
      };

      phoneDatabase.unshift(restoredPhone);
      savePhoneStorage();
      if (typeof renderPhoneGrid === 'function') renderPhoneGrid();
      if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();

      // Đồng bộ dọn dẹp đơn tương ứng trong Bán Hàng hoặc Bán Gà nếu có
      if (p.imei && typeof salesDatabase !== 'undefined' && typeof bangaDatabase !== 'undefined') {
        salesDatabase = salesDatabase.filter(s => s.imei !== p.imei && !(s.name && s.name.includes(p.imei)));
        bangaDatabase = bangaDatabase.filter(b => b.imei !== p.imei && !(b.name && b.name.includes(p.imei)));
        if (typeof saveSalesStorage === 'function') saveSalesStorage();
        if (typeof saveBangaStorage === 'function') saveBangaStorage();
        if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
        if (typeof renderBangaTable === 'function') renderBangaTable(bangaDatabase);
      }

      if (typeof logActivity === 'function') {
        logActivity('BUY_BACK', 'baohanh', 'Bảo hành', `Thu mua lại máy của khách & hoàn kho: ${restoredPhone.brand} ${restoredPhone.name} (${restoredPhone.imei}) - Giá mua lại: ${buyBackPrice} - Lời: ${profitNum} - Vốn mới: ${newCostNum}`, p, restoredPhone, restoredPhone.id);
      }

      closeBuyBackPhoneModal();
      alert(`Đã thu mua lại máy thành công!\nGiá nhập mới đã được khấu trừ tiền lời: ${formatPriceStr(newCostNum)}đ\nMáy đã được tự động đưa về Kho Bán Máy.`);
      switchMainTab('banmay');
    }

    function confirmDeleteOnlySoldPhone() {
      let id = document.getElementById('bbSoldId').value;
      const p = soldPhoneDatabase.find(item => String(item.id) === String(id) || item.id == id);
      if (!p) return;

      if (!confirm(`Bạn có chắc chắn muốn XÓA HẲN máy "${p.brand ? p.brand + ' ' : ''}${p.name || ''}" khỏi danh sách bảo hành (KHÔNG hoàn trả về kho bán máy)?`)) {
        return;
      }

      soldPhoneDatabase = soldPhoneDatabase.filter(item => String(item.id) !== String(id) && item.id != id);
      saveSoldPhoneStorage();
      if (typeof db !== 'undefined' && db && id) {
        db.collection('sold_phones').doc(String(id)).delete().catch(console.error);
      }
      if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();

      if (typeof logActivity === 'function') {
        logActivity('DELETE', 'baohanh', 'Bảo hành', `Xóa máy khỏi danh sách bảo hành: ${p.name} (${p.imei})`, p, null, id);
      }

      closeBuyBackPhoneModal();
      alert("Đã xóa máy khỏi danh sách bảo hành thành công!");
    }

    function openBuyBackExplanationModal(id) {
      let p = phoneDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (!p) return;
      let bb = p.buyBackData || {};
      let name = p.name || '';
      let imei = p.imei || '';
      let sellPrice = bb.sellPrice || p.price || '0';
      let originalCost = bb.originalCost || '0';
      let giftCost = bb.giftCost || '0';
      let buyBackPrice = bb.buyBackPrice || '0';
      let profit = bb.profit || '0';
      let newCost = bb.newCost || p.priceIn || '0';
      let buyBackDate = bb.buyBackDate || p.date || '';
      let customer = bb.customer || 'Khách lẻ';

      let contentEl = document.getElementById('buyBackExplanationContent');
      if (contentEl) {
        contentEl.innerHTML = `
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px;">
            <div style="font-size: 1.15rem; font-weight: 900; color: #60a5fa; margin-bottom: 4px;">
              ${escapeHtml(p.brand || '')} ${escapeHtml(name)} ${imei ? `<span style="color:#fbbf24; font-size:1rem; border:1px solid #b45309; padding:1px 6px; border-radius:4px; margin-left:6px;">IMEI: ${escapeHtml(imei)}</span>` : ''}
            </div>
            <div style="font-size: 0.88rem; color: #94a3b8;">
              Khách hàng trả lại: <strong style="color: #fff;">${escapeHtml(customer)}</strong> ${buyBackDate ? ` · Ngày thu lại: <strong style="color: #f59e0b;">${escapeHtml(buyBackDate)}</strong>` : ''}
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; margin-bottom: 16px;">
            <tbody>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 9px 0; color: #94a3b8;">1. Giá Bán Thực Tế lúc xuất:</td>
                <td style="padding: 9px 0; text-align: right; font-weight: 800; color: #10b981; font-size: 1.05rem;">${sellPrice} đ</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 9px 0; color: #94a3b8;">2. Giá Vốn Gốc ban đầu:</td>
                <td style="padding: 9px 0; text-align: right; font-weight: 800; color: #cbd5e1;">${originalCost} đ</td>
              </tr>
              ${giftCost && giftCost !== '0' ? `
              <tr style="border-bottom: 1px solid #1e293b;">
                <td style="padding: 9px 0; color: #94a3b8;">3. Phụ Kiện Tặng Kèm lúc bán:</td>
                <td style="padding: 9px 0; text-align: right; font-weight: 800; color: #f59e0b;">+${giftCost} đ</td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #334155; background: rgba(99, 102, 241, 0.1);">
                <td style="padding: 10px 8px; color: #a5b4fc; font-weight: 800;">4. Giá Mua Lại Từ Khách:</td>
                <td style="padding: 10px 8px; text-align: right; font-weight: 900; color: #fbbf24; font-size: 1.15rem;">${buyBackPrice} đ</td>
              </tr>
              <tr style="border-bottom: 1px solid #1e293b; background: rgba(16, 185, 129, 0.1);">
                <td style="padding: 10px 8px; color: #34d399; font-weight: 800;">5. Tiền Lời Khi Thu Lại:</td>
                <td style="padding: 10px 8px; text-align: right; font-weight: 900; color: #34d399; font-size: 1.15rem;">+${profit} đ</td>
              </tr>
              <tr style="background: rgba(245, 158, 11, 0.15);">
                <td style="padding: 12px 8px; color: #fcd34d; font-weight: 900; font-size: 1rem;">6. Giá Nhập Mới (Hoàn Kho):</td>
                <td style="padding: 12px 8px; text-align: right; font-weight: 900; color: #fbbf24; font-size: 1.25rem;">${newCost} đ</td>
              </tr>
            </tbody>
          </table>

          <div style="background: rgba(15, 23, 42, 0.85); border-left: 4px solid #10b981; border-radius: 6px; padding: 12px 14px; font-size: 0.88rem; color: #cbd5e1; line-height: 1.55;">
            📌 <strong>Giải thích cho Chú Shop:</strong><br>
            - Máy lúc bán giá <strong>${sellPrice} đ</strong>, thu lại của khách giá <strong>${buyBackPrice} đ</strong>, thu được tiền lời là <strong>${profit} đ</strong>.<br>
            - Giá nhập mới hoàn kho: <strong>${originalCost} đ</strong> (Vốn gốc) - <strong>${profit} đ</strong> (Lời thu lại)${giftCost && giftCost !== '0' ? ` + <strong>${giftCost} đ</strong> (Phụ kiện tặng kèm)` : ''} = <strong style="color:#fbbf24;">${newCost} đ</strong>.<br>
            - Con máy này hiện đã sẵn sàng trong kho với giá vốn mới là <strong>${newCost} đ</strong> để bán cho khách tiếp theo!
          </div>
        `;
      }
      let modal = document.getElementById('buyBackExplanationModal');
      if (modal) {
        modal.classList.add('active');
        modal.classList.add('show');
      }
    }

    function closeBuyBackExplanationModal() {
      let modal = document.getElementById('buyBackExplanationModal');
      if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('show');
      }
    }

    function normalizeQuery(text) {
      let t = (text || '').toLowerCase().trim();

      // Dấu + thành plus (ví dụ: 8+ -> 8 plus)
      t = t.replace(/\+/g, ' plus ');

      // Viết tắt ip -> iphone (ví dụ: ip8p -> iphone 8 plus, ip 11 -> iphone 11)
      t = t.replace(/\bip\s*([0-9]+|x|xs|xr|se)\b/gi, 'iphone $1');

      // Viết tắt dòng XS Max: xsm, xs m, xsmax, xmax
      t = t.replace(/\b(xs|x)\s*max\b/gi, 'xs max');
      t = t.replace(/\bxsmax\b/gi, 'xs max');
      t = t.replace(/\bxsm\b/gi, 'xs max');
      t = t.replace(/\bxs\s*m\b/gi, 'xs max');
      t = t.replace(/\bxmax\b/gi, 'xs max');
      t = t.replace(/\bx\s*max\b/gi, 'xs max');

      // Viết tắt dòng Plus: 8p, 8 p, 8plus, 7p, 7 p, 7plus, 6sp, 6s p, 6splus, 6p...
      t = t.replace(/\b(6s|6|7|8)\s*p\b/gi, '$1 plus');
      t = t.replace(/\b(6s|6|7|8)\s*plus\b/gi, '$1 plus');
      t = t.replace(/([0-9]+)\s*plus\b/gi, '$1 plus');

      // Viết tắt dòng Pro Max: 11prm, 11 prm, 11pm, 11 pm, 11promax...
      t = t.replace(/([0-9]+)\s*prm\b/gi, '$1 pro max');
      t = t.replace(/([0-9]+)\s*pm\b/gi, '$1 pro max');
      t = t.replace(/([0-9]+)\s*promax\b/gi, '$1 pro max');
      t = t.replace(/([0-9]+)\s*pro\s*max\b/gi, '$1 pro max');

      // Viết tắt dòng Pro: 11pr, 11 pr, 11pro
      t = t.replace(/([0-9]+)\s*pr\b/gi, '$1 pro');
      t = t.replace(/([0-9]+)\s*pro\b/gi, '$1 pro');

      // Viết tắt dòng Mini: 12mini, 13mini
      t = t.replace(/([0-9]+)\s*mini\b/gi, '$1 mini');

      // Các từ đơn lẻ viết tắt
      t = t.replace(/\bprm\b/gi, 'pro max');
      t = t.replace(/\bpm\b/gi, 'pro max');
      t = t.replace(/\bpromax\b/gi, 'pro max');
      t = t.replace(/\bpr\b/gi, 'pro');

      t = t.replace(/\s+/g, ' ').trim();
      return t;
    }

    let currentSuggestionIndex = -1;

    function getPhoneNameSuggestions(query) {
      if (!query || !query.trim()) return [];
      const qNorm = normalizeQuery(query.trim()).toLowerCase();

      let pool = phoneDatabase;
      if (currentBrandFilter && currentBrandFilter !== 'ALL') {
        const cbf = (currentBrandFilter || '').toUpperCase().trim();
        pool = pool.filter(p => {
          const pb = (p.brand || '').toUpperCase().trim();
          if (cbf === 'OPPO & REALME' || cbf === 'OPPO - REALME') {
            return pb === 'OPPO' || pb === 'REALME' || pb.includes('OPPO') || pb.includes('REALME');
          }
          if (cbf === 'REDMI & POCO' || cbf === 'REDMI - POCO') {
            return pb === 'REDMI' || pb === 'POCO' || pb === 'XIAOMI' || pb.includes('REDMI') || pb.includes('POCO') || pb.includes('XIAOMI');
          }
          if (cbf === 'IPHONE') {
            return pb === 'IPHONE' || pb === 'IPAD' || pb === 'APPLE';
          }
          return pb === cbf;
        });
      }

      const nameMap = new Map();
      pool.forEach(p => {
        let rawName = (p.name || '').trim();
        if (!rawName) return;

        // Dọn dẹp các ghi chú đuôi (như thất lạc, lỗi) để nhóm chính xác theo tên model chuẩn
        let cleanedName = rawName
          .replace(/\s*-\s*\(?(đang\s*)?thất\s*lạc\)?/gi, '')
          .replace(/\s*\([^)]*vân\s*tay[^)]*\)/gi, '')
          .replace(/\s*-\s*cất\s*trong\s*nhà/gi, '')
          .trim();

        let displayModel = formatBrandDeviceName(cleanedName || rawName);
        let key = displayModel.toLowerCase();

        let normModel = normalizeQuery(displayModel).toLowerCase();
        let normFullName = normalizeQuery(`${p.brand || ''} ${displayModel}`).toLowerCase();

        let isMatch = normModel.includes(qNorm) || 
                      normFullName.includes(qNorm) || 
                      rawName.toLowerCase().includes(qNorm);

        if (isMatch) {
          if (!nameMap.has(key)) {
            nameMap.set(key, { name: displayModel, count: 1, brand: p.brand || '' });
          } else {
            nameMap.get(key).count++;
          }
        }
      });

      const list = Array.from(nameMap.values());
      list.sort((a, b) => {
        let aLower = a.name.toLowerCase();
        let bLower = b.name.toLowerCase();

        let aExact = aLower === qNorm;
        let bExact = bLower === qNorm;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        let aStarts = aLower.startsWith(qNorm);
        let bStarts = bLower.startsWith(qNorm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        if (a.name.length !== b.name.length) {
          return a.name.length - b.name.length;
        }
        return a.name.localeCompare(b.name);
      });

      return list.slice(0, 10);
    }

    function highlightSuggestionMatch(text, query) {
      const safeText = escapeHtml(text);
      const qStr = (query || '').trim();
      if (!qStr) return safeText;
      const escapedQ = qStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return safeText.replace(new RegExp(`(${escapedQ})`, 'gi'), '<strong style="color: #38bdf8; font-weight: 900;">$1</strong>');
    }

    function renderPhoneSearchSuggestions(query) {
      const dropdown = document.getElementById('phoneSearchSuggestions');
      if (!dropdown) return;

      const suggestions = getPhoneNameSuggestions(query);
      currentSuggestionIndex = -1;

      if (!suggestions || suggestions.length === 0) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = suggestions.map((item, index) => {
        return `
          <div class="phone-suggestion-item" data-index="${index}" data-name="${escapeHtml(item.name)}" onclick="selectPhoneSearchSuggestion(this.getAttribute('data-name'))">
            <span class="suggestion-model-name">
              <span style="font-size: 1.05rem;">📱</span>
              <span>${highlightSuggestionMatch(item.name, query)}</span>
            </span>
            <span class="suggestion-count">${item.count} máy</span>
          </div>
        `;
      }).join('');

      dropdown.style.display = 'block';
    }

    function selectPhoneSearchSuggestion(name) {
      const input = document.getElementById('phoneSearchInput');
      if (!input) return;
      input.value = name;
      const clearBtn = document.getElementById('btnClearPhoneSearch');
      if (clearBtn) clearBtn.style.display = 'block';
      hidePhoneSearchSuggestions();
      renderPhoneGrid();
    }
    window.selectPhoneSearchSuggestion = selectPhoneSearchSuggestion;

    function hidePhoneSearchSuggestions() {
      const dropdown = document.getElementById('phoneSearchSuggestions');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
      currentSuggestionIndex = -1;
    }
    window.hidePhoneSearchSuggestions = hidePhoneSearchSuggestions;

    function handlePhoneSearchKeydown(e) {
      const dropdown = document.getElementById('phoneSearchSuggestions');
      if (!dropdown || dropdown.style.display === 'none') return;
      const items = dropdown.querySelectorAll('.phone-suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex + 1) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex - 1 + items.length) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'Enter') {
        if (currentSuggestionIndex >= 0 && currentSuggestionIndex < items.length) {
          e.preventDefault();
          items[currentSuggestionIndex].click();
        } else {
          hidePhoneSearchSuggestions();
        }
      } else if (e.key === 'Escape') {
        hidePhoneSearchSuggestions();
      }
    }
    window.handlePhoneSearchKeydown = handlePhoneSearchKeydown;

    function updateSuggestionHighlight(items) {
      items.forEach((it, idx) => {
        if (idx === currentSuggestionIndex) {
          it.classList.add('active');
          it.scrollIntoView({ block: 'nearest' });
        } else {
          it.classList.remove('active');
        }
      });
    }

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-box-bm')) {
        hidePhoneSearchSuggestions();
      }
    });

    function handlePhoneSearchInput(input) {
      const clearBtn = document.getElementById('btnClearPhoneSearch');
      if (input.value.trim() !== "") {
        clearBtn.style.display = 'block';
        renderPhoneSearchSuggestions(input.value);
      } else {
        clearBtn.style.display = 'none';
        hidePhoneSearchSuggestions();
      }
      renderPhoneGrid();
    }
    window.handlePhoneSearchInput = handlePhoneSearchInput;

    function clearPhoneSearch() {
      const input = document.getElementById('phoneSearchInput');
      input.value = '';
      document.getElementById('btnClearPhoneSearch').style.display = 'none';
      hidePhoneSearchSuggestions();
      input.focus();
      renderPhoneGrid();
    }
    window.clearPhoneSearch = clearPhoneSearch;

    function handlePhonePriceFilterChange(select) {
      currentPriceFilter = select.value || 'ALL';
      renderPhoneGrid();
    }
    window.handlePhonePriceFilterChange = handlePhonePriceFilterChange;

    let phoneViewMode = localStorage.getItem('kimchi_phone_view_mode') || 'grid';

    function togglePhoneViewMode() {
      phoneViewMode = (phoneViewMode === 'grid') ? 'table' : 'grid';
      localStorage.setItem('kimchi_phone_view_mode', phoneViewMode);
      updatePhoneViewModeBtn();
      renderPhoneGrid();
    }
    window.togglePhoneViewMode = togglePhoneViewMode;

    function updatePhoneViewModeBtn() {
      const btn = document.getElementById('btnPhoneViewModeToggle');
      if (!btn) return;
      if (phoneViewMode === 'table') {
        btn.classList.add('active');
        btn.title = "Đang xem dạng Hàng Ngang (Bấm để chuyển về Dạng Ô Lưới)";
      } else {
        btn.classList.remove('active');
        btn.title = "Đang xem dạng Ô Lưới (Bấm để chuyển sang Dạng Hàng Ngang)";
      }
    }
    window.updatePhoneViewModeBtn = updatePhoneViewModeBtn;

    function renderPhoneGrid() {
      const container = document.getElementById('phoneGridContainer');
      updatePhoneViewModeBtn();
      const rawSearch = document.getElementById('phoneSearchInput').value.trim();
      const normSearch = normalizeQuery(rawSearch);

      let filtered = phoneDatabase;
      if (currentBrandFilter !== 'ALL') {
        const cbf = (currentBrandFilter || '').toUpperCase().trim();
        filtered = filtered.filter(p => {
          const pb = (p.brand || '').toUpperCase().trim();
          if (cbf === 'OPPO & REALME' || cbf === 'OPPO - REALME') {
            return pb === 'OPPO' || pb === 'REALME' || pb.includes('OPPO') || pb.includes('REALME');
          }
          if (cbf === 'REDMI & POCO' || cbf === 'REDMI - POCO') {
            return pb === 'REDMI' || pb === 'POCO' || pb === 'XIAOMI' || pb.includes('REDMI') || pb.includes('POCO') || pb.includes('XIAOMI');
          }
          if (cbf === 'IPHONE') {
            return pb === 'IPHONE' || pb === 'IPAD' || pb === 'APPLE';
          }
          return pb === cbf;
        });
      }

      // LỌC THEO KHOẢNG GIÁ
      if (currentPriceFilter && currentPriceFilter !== 'ALL') {
        filtered = filtered.filter(p => {
          let pVal = parsePriceNum(p.price);
          if (pVal >= 100000) pVal = Math.round(pVal / 1000); // Chuẩn hóa nếu nhập đầy đủ tiền triệu

          if (currentPriceFilter === 'UNDER_1') {
            return pVal > 0 && pVal < 1000;
          } else if (currentPriceFilter === '1_2') {
            return pVal >= 1000 && pVal <= 2000;
          } else if (currentPriceFilter === '2_4') {
            return pVal > 2000 && pVal <= 4000;
          } else if (currentPriceFilter === '4_6') {
            return pVal > 4000 && pVal <= 6000;
          } else if (currentPriceFilter === '6_10') {
            return pVal > 6000 && pVal <= 10000;
          } else if (currentPriceFilter === 'OVER_10') {
            return pVal > 10000;
          }
          return true;
        });
      }

      if (normSearch) {
        const isExact4Digits = /^\d{4}$/.test(rawSearch);

        // Danh sách các hậu tố phân cấp dòng máy
        const KNOWN_MODIFIERS = ['max', 'pro', 'plus', 'mini', 'ultra', 'fe', 'lite'];

        const getModifiers = (str) => {
          const mods = [];
          for (let m of KNOWN_MODIFIERS) {
            let re = new RegExp(`\\b${m}\\b`, 'i');
            if (re.test(str)) {
              mods.push(m);
            }
          }
          return mods;
        };

        const removeModifiers = (str) => {
          let res = str;
          for (let m of KNOWN_MODIFIERS) {
            let re = new RegExp(`\\b${m}\\b`, 'gi');
            res = res.replace(re, ' ');
          }
          return res.replace(/\s+/g, ' ').trim();
        };

        const stripBrand = (str) => {
          return (str || '')
            .replace(/^(iphone|samsung|galaxy|oppo|realme|redmi|poco|vivo|xiaomi)\s+/gi, '')
            .replace(/\bgalaxy\b/gi, '')
            .trim();
        };

        let searchCore = stripBrand(normSearch);
        let queryMods = getModifiers(searchCore);
        let searchBase = removeModifiers(searchCore);
        let searchWords = searchBase ? searchBase.split(/\s+/).filter(Boolean) : [];

        filtered = filtered.filter(p => {
          let fullName = (p.name || '').toLowerCase().trim();
          let brandName = (p.brand || '').toLowerCase().trim();
          let imei = (p.imei || '').toLowerCase().trim();
          let storage = (p.storage || '').toLowerCase().replace(/[()]/g, '').replace(/gb$/i, '').trim();
          let color = (p.color || '').toLowerCase().trim();
          let condition = (p.condition || '').toLowerCase().trim();
          let note = (p.note || '').toLowerCase().trim();

          // 1. KHI GÕ ĐÚNG 4 SỐ: MẶC ĐỊNH TÌM THEO IMEI
          if (isExact4Digits) {
            return imei.includes(rawSearch);
          }

          // Chuẩn hóa tên máy
          let normPhoneName = normalizeQuery(fullName);
          let phoneCore = stripBrand(normPhoneName);
          let phoneMods = getModifiers(phoneCore);
          let phoneBase = removeModifiers(phoneCore);

          // 2. KIỂM TRA CHÍNH XÁC MODIFIER PHÂN CẤP:
          // - Gõ "11" -> CHỈ RA "11" thường (KHÔNG RA "11 Pro", "11 Pro Max")
          // - Gõ "11 pro" hoặc "11pr" -> CHỈ RA "11 Pro" (KHÔNG RA "11 Pro Max", "11" thường)
          // - Gõ "11 pro max" hoặc "11prm" hoặc "11pm" -> CHỈ RA "11 Pro Max"
          // - Gõ "8p" hoặc "8plus" hoặc "8 plus" -> CHỈ RA "8 PLUS"
          // - Gõ "xs" -> CHỈ RA "XS" thường (KHÔNG RA "XS Max")
          // - Gõ "xsm" hoặc "xsmax" hoặc "xs max" -> CHỈ RA "XS Max"
          for (let mod of KNOWN_MODIFIERS) {
            let pHas = phoneMods.includes(mod);
            let qHas = queryMods.includes(mod);
            if (pHas !== qHas) {
              return false;
            }
          }

          // 3. SO KHỚP PHẦN GỐC (BASE MODEL) & CÁC TỪ TÌM KIẾM:
          // Nếu từ khóa chỉ gồm thương hiệu (vd: "iphone" hoặc "samsung"):
          if (!searchCore) {
            return brandName.includes(normSearch) || fullName.includes(normSearch);
          }

          // Nếu từ khóa chỉ gồm modifier (vd: "pro", "plus", "max"):
          if (!searchBase) {
            return true;
          }

          let extraInfo = `${brandName} ${normPhoneName} ${phoneBase} ${storage} ${color} ${condition} ${note}`.toLowerCase();

          // Từng từ trong searchWords phải được thỏa mãn
          for (let w of searchWords) {
            let isModelKeyword = /^\d+$/.test(w) || /^(x|xs|xr|se)$/i.test(w);
            let exactBoundaryRegex = new RegExp(`\\b${w}\\b`, 'i');

            if (isModelKeyword) {
              // Khớp base model máy (vd: "8" khớp "8", "11" khớp "11", "xs" khớp "xs")
              let matchPhoneBase = exactBoundaryRegex.test(phoneBase);
              // Hoặc khớp dung lượng (vd: "64", "128", "256", "512", "32")
              let matchStorage = (storage === w || storage === w + 'gb');
              // Chỉ so khớp IMEI khi từ khóa đó là ĐÚNG 4 CHỮ SỐ (vd: gõ "11 7211")
              let matchImei = /^\d{4}$/.test(w) && imei.includes(w);

              if (!matchPhoneBase && !matchStorage && !matchImei) {
                return false;
              }
            } else {
              // Với các từ khác (như màu sắc, hãng, ghi chú...):
              if (!extraInfo.includes(w)) {
                return false;
              }
            }
          }

          return true;
        });

        // Sắp xếp ưu tiên: Máy khớp chính xác modifier lên đầu
        filtered.sort((a, b) => {
          let aCore = stripBrand(normalizeQuery((a.name || '').toLowerCase()));
          let bCore = stripBrand(normalizeQuery((b.name || '').toLowerCase()));
          let aMods = getModifiers(aCore);
          let bMods = getModifiers(bCore);

          // Nếu người dùng không tìm modifier: ưu tiên máy thường (ít modifier hơn) lên trước
          if (queryMods.length === 0) {
            return aMods.length - bMods.length;
          }
          // Nếu người dùng tìm modifier: ưu tiên máy có số modifier khớp chính xác nhất
          let aDiff = Math.abs(aMods.length - queryMods.length);
          let bDiff = Math.abs(bMods.length - queryMods.length);
          return aDiff - bDiff;
        });
      }

      // Cập nhật thống kê góc phải trên cùng (Nền vàng chữ trắng)
      let invCount = filtered.length;
      let invSum = 0;
      filtered.forEach(p => {
        let pVal = parsePriceNum(p.price);
        if (pVal >= 100000) pVal = Math.round(pVal / 1000);
        invSum += pVal;
      });

      const elInvCount = document.getElementById('phoneInventoryCountText');
      if (elInvCount) elInvCount.innerText = `${invCount} Máy`;

      const elInvTotal = document.getElementById('phoneInventoryTotalValText');
      if (elInvTotal) elInvTotal.innerText = isPhonePricesHidden ? '*****' : formatNumberDisplay(invSum);

      const elPhoneCountBottom = document.getElementById('phoneCountText');
      if (elPhoneCountBottom) elPhoneCountBottom.innerText = `Hiển thị ${filtered.length} máy phù hợp`;

      if (filtered.length === 0) {
        if (phoneViewMode === 'table') {
          container.className = 'phone-table-container';
          container.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: var(--text-sub); font-size: 0.95rem;">Không có máy nào phù hợp</div>`;
        } else {
          container.className = 'phone-grid';
          container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-sub);">Không có máy nào phù hợp</div>`;
        }
        return;
      }

      if (phoneViewMode === 'table') {
        container.className = 'phone-table-container';
        container.innerHTML = `
          <table class="phone-horizontal-table">
            <thead>
              <tr>
                <th style="text-align: left; padding-left: 18px;">TÊN MÁY</th>
                <th style="text-align: center;">DUNG LƯỢNG</th>
                <th style="text-align: center;">GIÁ BÁN</th>
                <th style="text-align: center;">MÀU SẮC</th>
                <th style="text-align: center;">THÔNG TIN PIN</th>
                <th style="text-align: right;">GIÁ NHẬP</th>
                <th style="text-align: right; padding-right: 18px;">LÃI</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(p => {
                let pName = formatBrandDeviceName(p.name || '');
                let rawStorage = formatStorageDisplay((p.storage || '').replace(/[()]/g, '')).trim();
                let storageWithGB = rawStorage.replace(/ggb$/i, 'GB').replace(/g$/i, 'GB');
                if (storageWithGB) {
                  if (!/gb|tb/i.test(storageWithGB)) {
                    storageWithGB += 'GB';
                  } else {
                    storageWithGB = storageWithGB.toUpperCase();
                  }
                }

                let displayPinStatus = p.pinStatus || 'Pin Thay';
                let displayPinPct = formatPinByBrand(p.pin, p.brand, p.name);
                let displayOrigin = p.origin || 'VN/A';
                let displayCondition = p.condition || 'Zin Đẹp 99%';
                let dotColor = getHexColor(p.color);

                // Ghép Dung Lượng Pin & Tình Trạng Pin thành 1 cột "THÔNG TIN PIN"
                // Mẫu: 82% - Zin | 100% - Dùng OK | 100% - Mới
                let rawPinStatus = (displayPinStatus || '').trim();
                let cleanStatus = rawPinStatus.replace(/^pin\s+/i, '').trim();
                if (!cleanStatus && rawPinStatus) cleanStatus = rawPinStatus;

                let cleanPct = (displayPinPct || '').trim();
                let pinInfoHtml = '';
                if (cleanPct && cleanStatus) {
                  pinInfoHtml = `<span style="color: #ffffff; font-weight: 800;">${escapeHtml(cleanPct)}</span><span style="color: #64748b; font-weight: 700; margin: 0 5px;">-</span><span style="color: #f59e0b; font-weight: 900;">${escapeHtml(cleanStatus)}</span>`;
                } else if (cleanPct) {
                  pinInfoHtml = `<span style="color: #ffffff; font-weight: 800;">${escapeHtml(cleanPct)}</span>`;
                } else if (cleanStatus) {
                  pinInfoHtml = `<span style="color: #f59e0b; font-weight: 900;">${escapeHtml(cleanStatus)}</span>`;
                } else {
                  pinInfoHtml = `<span style="color: #64748b;">—</span>`;
                }

                let pVal = parsePriceNum(p.price);
                if (pVal >= 100000) pVal = Math.round(pVal / 1000);
                let cVal = parsePriceNum(p.priceIn);
                if (cVal >= 100000) cVal = Math.round(cVal / 1000);
                let profitVal = (pVal && cVal) ? (pVal - cVal) : (pVal || 0);

                let formattedPrice = isPhonePricesHidden ? '*****' : formatNumberDisplay(p.price);
                let formattedCost = isPhonePricesHidden ? '*****' : formatNumberDisplay(p.priceIn);
                let formattedProfit = isPhonePricesHidden ? '*****' : formatNumberDisplay(profitVal);

                let condLower = (displayCondition || '').toLowerCase().trim();
                let isExcluded = condLower.includes('vỏ xấu') || condLower.includes('vo xau') || 
                                 condLower.includes('vỏ phẩy') || condLower.includes('vo phay');

                let isMoi100 = /mới\s*100%|100%\s*mới/i.test(displayCondition);
                let isLikeFCN = !isExcluded && (
                  /full\s*chức\s*năng/i.test(displayCondition) || 
                  /e\s*sim/i.test(displayCondition) || 
                  /zin\s*đẹp/i.test(displayCondition) || 
                  /lắp\s*sim/i.test(displayCondition) || 
                  /\bzin\s*phẩy\b/i.test(displayCondition)
                );

                let conditionBadgeHtml = '';
                if (isMoi100) {
                  conditionBadgeHtml = `<span class="badge-new-100">${escapeHtml(displayCondition)}</span>`;
                } else if (isLikeFCN) {
                  conditionBadgeHtml = `<span class="badge-fcn">${escapeHtml(displayCondition)}</span>`;
                } else {
                  conditionBadgeHtml = `<span style="color: #94a3b8; font-weight: 600;">${escapeHtml(displayCondition)}</span>`;
                }

                return `
                  <tr class="phone-table-row" ondblclick="viewPhone('${p.id}')" style="cursor: pointer;" title="Nhấp đúp chuột (nháy 2 lần) để xem chi tiết máy">
                    <td style="text-align: left; padding-left: 18px;">
                      <div style="display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;">
                        <span style="font-weight: 900; color: #10b981; font-size: 1.6rem;">${escapeHtml(pName)}</span>
                        ${p.imei ? `<span style="font-weight: 900; color: #ef4444; font-size: 1.5rem; letter-spacing: 0.5px;">${escapeHtml(p.imei)}</span>` : ''}
                      </div>
                      <div style="font-size: 1.08rem; color: #94a3b8; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                        <span>${escapeHtml(p.brand || '')} •</span>
                        ${conditionBadgeHtml}
                      </div>
                    </td>
                    <td style="text-align: center; font-weight: 900; color: #ffffff; font-size: 1.28rem;">
                      ${escapeHtml(storageWithGB || '—')}
                    </td>
                    <td style="text-align: center; font-weight: 900; color: #10b981; font-size: 1.7rem;">
                      ${escapeHtml(formattedPrice)}
                    </td>
                    <td style="text-align: center; color: #cbd5e1; font-weight: 700; font-size: 1.07rem;">
                      <span style="display: inline-flex; align-items: center; gap: 8px; justify-content: center;">
                        ${getColorDotHtml(p.color, 19)}
                        <span>${escapeHtml(p.color || 'Mặc định')}</span>
                      </span>
                    </td>
                    <td style="text-align: center; font-size: 1.2rem; white-space: nowrap;">
                      ${pinInfoHtml}
                    </td>
                    <td style="text-align: right; font-weight: 700; color: #94a3b8; font-size: 1.07rem;">
                      ${escapeHtml(formattedCost)}
                    </td>
                    <td style="text-align: right; font-weight: 800; color: #f59e0b; font-size: 1.07rem; padding-right: 18px;">
                      ${escapeHtml(formattedProfit)}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      } else {
        container.className = 'phone-grid';
        container.innerHTML = filtered.map(p => {
          let pName = formatBrandDeviceName(p.name || '');
          let rawStorage = formatStorageDisplay((p.storage || '').replace(/[()]/g, '')).trim();
          let storageDisplay = rawStorage.replace(/\s*g+b$/i, '').replace(/\s*g$/i, '').trim();

          let displayPinStatus = p.pinStatus || 'Pin Thay';
          let displayPinPct = formatPinByBrand(p.pin, p.brand, p.name);
          let displayOrigin = p.origin || 'VN/A';
          let displayCondition = p.condition || 'Zin Đẹp 99%';
          let dotColor = getHexColor(p.color);

          let isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
          let displayName = pName;
          let logoHtml = '';

          if (isDesktop) {
            let brandStr = (p.brand || '').trim();
            if (brandStr && brandStr !== 'MÁY NGOÀI' && brandStr !== '❤️❤️❤️') {
              let cleanBrand = brandStr.toUpperCase();
              let cleanNameUpper = displayName.toUpperCase();
              if (!cleanNameUpper.startsWith(cleanBrand)) {
                displayName = `${brandStr} - ${displayName}`;
              }
            } else if (brandStr === 'MÁY NGOÀI' || brandStr === '❤️❤️❤️') {
              let cleanNameUpper = displayName.toUpperCase();
              if (!cleanNameUpper.startsWith('❤️❤️❤️') && !cleanNameUpper.startsWith('MÁY NGOÀI')) {
                displayName = `${brandStr} - ${displayName}`;
              }
            }
            logoHtml = '';
          } else {
            logoHtml = getPhoneBrandLogoHtml(p.brand, p.name, 25);
            // Trên Mobile: Thay thế cụm PRO MAX thành PRM để tên máy không bị dài che khuất
            displayName = displayName.replace(/pro\s*max/gi, 'PRM');
          }

          return `
            <div class="phone-card" ondblclick="viewPhone('${p.id}')" title="Nhấp đúp chuột (nháy 2 lần) để xem chi tiết máy">
              <!-- HÀNG 1: TÊN MÁY + MÀU + DUNG LƯỢNG | GIÁ TIỀN Ở GIỮA | ĐÓNG KHUNG IMEI -->
              <div class="phone-card-header">
                <div class="phone-header-left">
                  ${logoHtml}
                  <span class="phone-card-name">${escapeHtml(displayName)}</span>
                  ${getColorDotHtml(p.color, 25)}
                  ${storageDisplay ? `<span class="phone-card-storage">${escapeHtml(storageDisplay)}</span>` : ''}
                </div>
                <div class="phone-header-center">
                  <span class="phone-card-price">${isPhonePricesHidden ? '*****' : (formatPriceStr(p.price) || '0')}</span>
                </div>
                <div class="phone-header-right">
                  <span class="phone-card-imei">${escapeHtml(p.imei)}</span>
                </div>
              </div>

              <!-- HÀNG 2: 4 THÔNG SỐ CÁCH NHAU BẰNG VẠCH DỌC -->
              <div class="phone-card-specs">
                <div class="phone-spec-col col-origin">${escapeHtml(displayOrigin)}</div>
                <div class="phone-spec-col col-condition">${escapeHtml(displayCondition)}</div>
                <div class="phone-spec-col col-pin-status">${escapeHtml(displayPinStatus)}</div>
                <div class="phone-spec-col col-pin-pct">${escapeHtml(displayPinPct)}</div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Toggle hiển thị 3 nút Bán, Sửa, Xóa khi click vào ô máy
    function togglePhoneCardActions(cardEl, e) {
      if (!cardEl) return;
      if (e && e.target && e.target.closest('.phone-card-actions-row')) return;

      const isOpen = cardEl.classList.contains('actions-open');
      document.querySelectorAll('.phone-card.actions-open').forEach(c => {
        if (c !== cardEl) c.classList.remove('actions-open');
      });
      if (isOpen) {
        cardEl.classList.remove('actions-open');
      } else {
        cardEl.classList.add('actions-open');
      }
    }
    window.togglePhoneCardActions = togglePhoneCardActions;

    // Đóng hàng nút khi click ra ngoài ô máy
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.phone-card')) {
        document.querySelectorAll('.phone-card.actions-open').forEach(c => c.classList.remove('actions-open'));
      }
    });

    function parseSoldPhoneDate(p) {
      if (!p) return null;
      let s = p.soldDate;
      if (!s && p.soldDateTime) {
        let parts = p.soldDateTime.split('-');
        if (parts.length > 1) s = parts[1].trim();
      }
      if (!s && p.dateTime) {
        let parts = p.dateTime.split('-');
        if (parts.length > 1) s = parts[1].trim();
      }
      if (!s && p.date) s = p.date;
      if (!s) return null;

      s = s.trim();
      if (s.includes('/')) {
        let parts = s.split('/');
        if (parts.length === 3) {
          return {
            d: parseInt(parts[0], 10),
            m: parseInt(parts[1], 10) - 1,
            y: parseInt(parts[2], 10)
          };
        }
      } else if (s.includes('-')) {
        let parts = s.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            return {
              d: parseInt(parts[2], 10),
              m: parseInt(parts[1], 10) - 1,
              y: parseInt(parts[0], 10)
            };
          } else {
            return {
              d: parseInt(parts[0], 10),
              m: parseInt(parts[1], 10) - 1,
              y: parseInt(parts[2], 10)
            };
          }
        }
      }
      return null;
    }

    function isPhoneUnderWarranty(p) {
      if (!p) return false;
      const warrantyStr = (p.warranty || '').trim();
      if (!warrantyStr || warrantyStr.includes('0') || warrantyStr.toLowerCase().includes('không')) {
        return false;
      }

      let pDate = parseSoldPhoneDate(p);
      if (!pDate) return true;

      let dPurchase = new Date(pDate.y, pDate.m, pDate.d);
      let dNow = (typeof getVietnamDate === 'function') ? getVietnamDate() : new Date();
      dPurchase.setHours(0, 0, 0, 0);
      dNow.setHours(0, 0, 0, 0);

      let expireDate = new Date(dPurchase);
      let matchMonths = warrantyStr.match(/(\d+)\s*tháng/i);
      let matchDays = warrantyStr.match(/(\d+)\s*ngày/i);

      if (matchMonths) {
        expireDate.setMonth(expireDate.getMonth() + parseInt(matchMonths[1], 10));
      } else if (matchDays) {
        expireDate.setDate(expireDate.getDate() + parseInt(matchDays[1], 10));
      } else {
        expireDate.setMonth(expireDate.getMonth() + 3);
      }

      return expireDate.getTime() >= dNow.getTime();
    }

    function getSoldPhoneNameSuggestions(query) {
      const qNorm = (query || '').trim().toLowerCase();
      const pool = soldPhoneDatabase || [];
      const nameMap = new Map();

      pool.forEach(p => {
        let rawName = (p.name || '').trim();
        if (!rawName) return;

        let cleanedName = rawName
          .replace(/\s*-\s*\(?(đang\s*)?thất\s*lạc\)?/gi, '')
          .replace(/\s*\([^)]*vân\s*tay[^)]*\)/gi, '')
          .replace(/\s*-\s*cất\s*trong\s*nhà/gi, '')
          .trim();

        let displayModel = formatBrandDeviceName(cleanedName || rawName);
        let key = displayModel.toLowerCase();
        let normModel = key;
        let normFullName = `${(p.brand || '').toLowerCase()} ${key}`;

        let isMatch = !qNorm || normModel.includes(qNorm) || normFullName.includes(qNorm) || rawName.toLowerCase().includes(qNorm);

        if (isMatch) {
          if (!nameMap.has(key)) {
            nameMap.set(key, { name: displayModel, count: 1, brand: p.brand || '' });
          } else {
            nameMap.get(key).count++;
          }
        }
      });

      const list = Array.from(nameMap.values());
      list.sort((a, b) => {
        if (qNorm) {
          let aLower = a.name.toLowerCase();
          let bLower = b.name.toLowerCase();
          let aExact = aLower === qNorm;
          let bExact = bLower === qNorm;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          let aStarts = aLower.startsWith(qNorm);
          let bStarts = bLower.startsWith(qNorm);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
        }
        return b.count - a.count;
      });

      return list.slice(0, 10);
    }

    let currentSoldSuggestionIndex = -1;

    function renderSoldPhoneSearchSuggestions(query) {
      const dropdown = document.getElementById('soldPhoneSearchSuggestions');
      if (!dropdown) return;

      const suggestions = getSoldPhoneNameSuggestions(query);
      currentSoldSuggestionIndex = -1;

      if (!suggestions || suggestions.length === 0) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = suggestions.map((item, index) => {
        return `
          <div class="phone-suggestion-item" data-index="${index}" data-name="${escapeHtml(item.name)}" onclick="selectSoldPhoneSearchSuggestion(this.getAttribute('data-name'))">
            <span class="suggestion-model-name">
              <span style="font-size: 1.05rem;">📱</span>
              <span>${highlightSuggestionMatch(item.name, query)}</span>
            </span>
            <span class="suggestion-count">${item.count} máy</span>
          </div>
        `;
      }).join('');

      dropdown.style.display = 'block';
    }

    function selectSoldPhoneSearchSuggestion(name) {
      const input = document.getElementById('soldPhoneSearchInput');
      if (!input) return;
      input.value = name;
      const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
      if (clearBtn) clearBtn.style.display = 'block';
      hideSoldPhoneSearchSuggestions();
      renderSoldPhoneTable();
    }
    window.selectSoldPhoneSearchSuggestion = selectSoldPhoneSearchSuggestion;

    function hideSoldPhoneSearchSuggestions() {
      const dropdown = document.getElementById('soldPhoneSearchSuggestions');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
      currentSoldSuggestionIndex = -1;
    }
    window.hideSoldPhoneSearchSuggestions = hideSoldPhoneSearchSuggestions;

    function handleSoldPhoneSearchKeydown(e) {
      const dropdown = document.getElementById('soldPhoneSearchSuggestions');
      if (!dropdown || dropdown.style.display === 'none') return;
      const items = dropdown.querySelectorAll('.phone-suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentSoldSuggestionIndex = (currentSoldSuggestionIndex + 1) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentSoldSuggestionIndex = (currentSoldSuggestionIndex - 1 + items.length) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'Enter') {
        if (currentSoldSuggestionIndex >= 0 && currentSoldSuggestionIndex < items.length) {
          e.preventDefault();
          items[currentSoldSuggestionIndex].click();
        } else {
          hideSoldPhoneSearchSuggestions();
        }
      } else if (e.key === 'Escape') {
        hideSoldPhoneSearchSuggestions();
      }
    }
    window.handleSoldPhoneSearchKeydown = handleSoldPhoneSearchKeydown;

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#tab-baohanh .search-box-bm')) {
        hideSoldPhoneSearchSuggestions();
      }
    });

    function handleSoldPhoneSearchInput(input) {
      const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
      if (clearBtn) {
        clearBtn.style.display = input.value.trim() !== "" ? 'block' : 'none';
      }
      renderSoldPhoneSearchSuggestions(input.value);
      renderSoldPhoneTable();
    }

    function clearSoldPhoneSearch() {
      const input = document.getElementById('soldPhoneSearchInput');
      if (input) {
        input.value = '';
        const clearBtn = document.getElementById('btnClearSoldPhoneSearch');
        if (clearBtn) clearBtn.style.display = 'none';
        hideSoldPhoneSearchSuggestions();
        input.focus();
        renderSoldPhoneTable();
      }
    }

    function handleSoldPhoneWarrantyFilterChange(select) {
      currentSoldPhoneWarrantyFilter = select.value || 'ALL';
      renderSoldPhoneTable();
    }

    function renderSoldPhoneTable() {
      const tbody = document.getElementById('soldPhoneTableBody');
      const searchInput = document.getElementById('soldPhoneSearchInput');
      const keyword = (searchInput ? searchInput.value.trim().toLowerCase() : '');

      populateSoldPhoneBrandDropdown();

      let filtered = soldPhoneDatabase.filter(p => {
        // 1. Lọc theo Từ khóa tìm kiếm
        if (keyword) {
          let brand = (p.brand || '').toLowerCase();
          let name = (p.name || '').toLowerCase();
          let imei = (p.imei || '').toLowerCase();
          let customer = (p.customer || '').toLowerCase();
          let storage = (p.storage || '').toLowerCase();
          let color = (p.color || '').toLowerCase();
          let method = (p.method || p.paymentMethod || '').toLowerCase();
          let note = (p.note || '').toLowerCase();
          let gift = (p.giftStr || '').toLowerCase();
          let fullStr = `${brand} ${name} ${imei} ${customer} ${storage} ${color} ${method} ${note} ${gift}`;
          if (!fullStr.includes(keyword)) return false;
        }

        // 2. Lọc theo Hãng: Các hãng đã bán, mặc định là Tất Cả
        if (currentSoldPhoneBrandFilter && currentSoldPhoneBrandFilter !== 'ALL') {
          let pBrand = (p.brand || '').trim().toUpperCase();
          if (pBrand !== currentSoldPhoneBrandFilter.toUpperCase()) return false;
        }

        // 3. Lọc theo Trạng thái Bảo Hành: Còn Bảo Hành / Hết Bảo Hành / Tất Cả
        if (currentSoldPhoneWarrantyFilter && currentSoldPhoneWarrantyFilter !== 'ALL') {
          let isUnderWarranty = isPhoneUnderWarranty(p);
          if (currentSoldPhoneWarrantyFilter === 'CON' && !isUnderWarranty) return false;
          if (currentSoldPhoneWarrantyFilter === 'HET' && isUnderWarranty) return false;
        }

        // 4. Lọc theo Chế độ xem: Nếu đang tìm kiếm thì tìm trên TOÀN BỘ danh sách bảo hành; Nếu không tìm kiếm thì lọc theo Ngày / Tháng / Năm / Tất Cả
        if (keyword) return true;
        if (soldPhoneViewMode === 'all') return true;

        let pDate = parseSoldPhoneDate(p);
        if (!pDate) return true; // Giữ lại nếu không rõ ngày

        if (soldPhoneViewMode === 'day') {
          return pDate.d === currentSoldPhoneDateFilter.getDate() &&
                 pDate.m === currentSoldPhoneDateFilter.getMonth() &&
                 pDate.y === currentSoldPhoneDateFilter.getFullYear();
        } else if (soldPhoneViewMode === 'month') {
          return pDate.m === currentSoldPhoneMonthFilter.month &&
                 pDate.y === currentSoldPhoneMonthFilter.year;
        } else if (soldPhoneViewMode === 'year') {
          return pDate.y === currentSoldPhoneYearFilter;
        }

        return true;
      });

      // Thống kê Doanh thu & Lợi nhuận
      let totalRevenue = 0;
      let totalProfit = 0;
      filtered.forEach(p => {
        let pOut = parsePriceNum(p.price || p.total);
        let pIn = parsePriceNum(p.priceIn);
        totalRevenue += pOut;
        totalProfit += (pOut - pIn);
      });

      // Tính Doanh thu & Lãi (Tháng & Ngày) cho Tab Bảo Hành theo dữ liệu chuẩn
      let dayRev = 0, dayPf = 0, monthRev = 0, monthPf = 0;
      soldPhoneDatabase.forEach(p => {
        let pDate = parseSoldPhoneDate(p);
        if (!pDate) return;
        let pOut = parsePriceNum(p.price || p.total);
        let pIn = parsePriceNum(p.priceIn);
        let pf = pOut - pIn;

        if (pDate.d === currentSoldPhoneDateFilter.getDate() &&
            pDate.m === currentSoldPhoneDateFilter.getMonth() &&
            pDate.y === currentSoldPhoneDateFilter.getFullYear()) {
          dayRev += pOut;
          dayPf += pf;
        }

        if (pDate.m === currentSoldPhoneMonthFilter.month &&
            pDate.y === currentSoldPhoneMonthFilter.year) {
          monthRev += pOut;
          monthPf += pf;
        }
      });

      const mRevEl = document.getElementById('soldPhoneMonthRevenueVal');
      if (mRevEl) mRevEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(monthRev);
      const dRevEl = document.getElementById('soldPhoneDayRevenueVal');
      if (dRevEl) dRevEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(dayRev);

      const mPfEl = document.getElementById('soldPhoneMonthProfitVal');
      if (mPfEl) mPfEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(monthPf);
      const dPfEl = document.getElementById('soldPhoneDayProfitVal');
      if (dPfEl) dPfEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(dayPf);

      // CẬP NHẬT ICON LÃI NGÀY MÁY ĐÃ BÁN: 0 - 999 MẶT KHÓC, >= 1000 MẶT CƯỜI
      const soldPhoneProfitEmojiEl = document.getElementById('soldPhoneProfitEmojiIcon');
      if (soldPhoneProfitEmojiEl) {
        let spDayProfitVal = parsePriceNum(dayPf);
        if (spDayProfitVal >= 1000) {
          soldPhoneProfitEmojiEl.src = 'img/icon_happy.png';
          soldPhoneProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(dayPf) + ' (Đạt từ 1.000 trở lên)';
        } else {
          soldPhoneProfitEmojiEl.src = 'img/icon_crying.png';
          soldPhoneProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(dayPf) + ' (Từ 0 - 999)';
        }
      }

      const countEl = document.getElementById('soldPhoneCountText');
      if (countEl) {
        countEl.innerText = `Đã Bán : ${filtered.length}`;
      }

      const dtEl = document.getElementById('soldPhoneDoanhThuVal');
      if (dtEl) dtEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(totalRevenue);

      const pfEl = document.getElementById('soldPhoneProfitVal');
      if (pfEl) pfEl.innerText = isSoldPhonePricesHidden ? '*****' : formatPriceStr(totalProfit);

      const pfLabel = document.getElementById('soldPhoneProfitLabel');
      if (pfLabel) {
        pfLabel.innerText = soldPhoneViewMode === 'month' ? 'Lãi Tháng:' : (soldPhoneViewMode === 'year' ? 'Lãi Năm:' : (soldPhoneViewMode === 'all' ? 'Tổng Lãi:' : 'Lãi Ngày:'));
      }

      const mobileCardsContainer = document.getElementById('soldPhoneCardsContainer');

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-sub);">Không tìm thấy máy phù hợp</td></tr>`;
        if (mobileCardsContainer) {
          mobileCardsContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-sub);">Không tìm thấy máy phù hợp</div>`;
        }
        return;
      }

      if (mobileCardsContainer) {
        mobileCardsContainer.innerHTML = filtered.map(p => {
          let brandDisplay = formatBrandDeviceName(p.brand || '');
          let pName = formatBrandDeviceName(p.name || '');
          // Bỏ tên hãng đi theo yêu cầu (ví dụ: IPHONE - SE - 2020 thì chỉ hiển thị SE - 2020)
          let brandAndName = pName;
          if (brandDisplay && brandDisplay !== 'MÁY NGOÀI' && brandDisplay !== '❤️❤️❤️') {
            const regex = new RegExp(`^${brandDisplay}\\s*[-–—:]*\\s*`, 'i');
            brandAndName = brandAndName.replace(regex, '');
          }
          brandAndName = formatBrandDeviceName(brandAndName);

          let rawStorage = formatStorageDisplay((p.storage || '').replace(/[()]/g, '')).trim();
          let storageDisplay = rawStorage.replace(/\s*g+b$/i, '').replace(/\s*g$/i, '').trim();

          let displayPinStatus = p.pinStatus || 'Pin Zin';
          let displayPinPct = formatPinByBrand(p.pin, p.brand, p.name);
          let displayOrigin = p.origin || 'VN/A';
          let displayCondition = p.condition || 'Zin Đẹp 99%';
          let formattedPrice = isSoldPhonePricesHidden ? '*****' : (formatPriceStr(p.price || p.total) || '0');

          return `
            <div class="phone-card sold-phone-card" ondblclick="viewPhone('${p.id}', true)" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<350){ viewPhone('${p.id}', true); } this._lastTap=now;" title="Nháy 2 lần để xem chi tiết máy">
              <!-- HÀNG 1: TÊN MÁY + MÀU + DUNG LƯỢNG | GIÁ TIỀN Ở GIỮA | ĐÓNG KHUNG IMEI -->
              <div class="phone-card-header">
                <div class="phone-header-left">
                  <span class="phone-card-name">${escapeHtml(brandAndName)}</span>
                  ${getColorDotHtml(p.color, 20)}
                  ${storageDisplay ? `<span class="phone-card-storage">${escapeHtml(storageDisplay)}</span>` : ''}
                </div>
                <div class="phone-header-center">
                  <span class="phone-card-price">${formattedPrice}</span>
                </div>
                <div class="phone-header-right">
                  <span class="phone-card-imei" style="border: 1px solid #ef4444; color: #ffffff;">${escapeHtml(p.imei)}</span>
                </div>
              </div>

              <!-- HÀNG 2: 4 THÔNG SỐ CÁCH NHAU BẰNG VẠCH DỌC -->
              <div class="phone-card-specs">
                <div class="phone-spec-col col-origin">${escapeHtml(displayOrigin)}</div>
                <div class="phone-spec-col col-condition">${escapeHtml(displayCondition)}</div>
                <div class="phone-spec-col col-pin-status">${escapeHtml(displayPinStatus)}</div>
                <div class="phone-spec-col col-pin-pct">${escapeHtml(displayPinPct)}</div>
              </div>
            </div>
          `;
        }).join('');
      }

      tbody.innerHTML = filtered.map(p => {
        let brandDisplay = (p.brand || '').trim();
        let pName = formatBrandDeviceName(p.name || '');
        let brandNamePart = pName;

        if (brandDisplay && brandDisplay !== 'MÁY NGOÀI' && brandDisplay !== '❤️❤️❤️') {
          let cleanBrand = brandDisplay.toUpperCase();
          let cleanNameUpper = brandNamePart.toUpperCase();
          if (!cleanNameUpper.startsWith(cleanBrand)) {
            brandNamePart = `${brandDisplay} - ${brandNamePart}`;
          }
        } else if (brandDisplay === 'MÁY NGOÀI' || brandDisplay === '❤️❤️❤️') {
          let cleanNameUpper = brandNamePart.toUpperCase();
          if (!cleanNameUpper.startsWith('❤️❤️❤️') && !cleanNameUpper.startsWith('MÁY NGOÀI')) {
            brandNamePart = `<span style="color: #ef4444; font-size: 1.27rem; letter-spacing: 1px;">❤️❤️❤️</span> - ${brandNamePart}`;
          }
        }
        brandNamePart = formatBrandDeviceName(brandNamePart);
        let cleanStorage = formatStorageDisplay((p.storage || '').replace(/[()]/g, '')).replace(/ggb$/i, 'GB').replace(/g$/i, 'GB');
        let dotHtml = getColorDotHtml(p.color, 25);
        let storagePart = cleanStorage ? `<span style="color: #eab308; font-weight: 700; font-size: 1.04rem;">${cleanStorage}</span>` : '';
        let imeiPart = p.imei ? `<span style="border: 1px solid #ef4444; color: #ffffff; font-weight: 900; font-size: 1.14rem; padding: 2px 6px; border-radius: 4px; display: inline-block; letter-spacing: 0.5px;">${p.imei}</span>` : '';

        let nameHtml = `
          <div style="display: inline-flex; align-items: center; justify-content: flex-start; gap: 7px; flex-wrap: nowrap; white-space: nowrap;">
            <span style="font-size: 1.20rem; font-weight: 800; white-space: nowrap;">${brandNamePart}</span>
            ${dotHtml}
            ${storagePart}
            ${imeiPart}
          </div>
        `;

        let profitVal = p.profit;
        if (!profitVal) {
          let pOut = parsePriceNum(p.price || p.total);
          let pIn = parsePriceNum(p.priceIn);
          let diff = pOut - pIn;
          profitVal = (diff < 0 ? '-' : '') + formatPriceStr(Math.abs(diff));
        }

        let displayPriceOut = isSoldPhonePricesHidden ? '*****' : (formatPriceStr(p.price || p.total) || '0');
        let displayPriceIn = isSoldPhonePricesHidden ? '*****' : formatPriceStr(p.priceIn || '0');
        let displayProfit = isSoldPhonePricesHidden ? '*****' : formatPriceStr(profitVal);

        let method = p.method || p.paymentMethod || 'Tiền Mặt';
        let methodColor = (method === 'Chuyển Khoản' || method === 'CK') ? '#38bdf8' : '#10b981';

        let dateDisplay = p.dateTime || p.soldDateTime || (p.soldDate ? `${getCurrentTimeStr()} - ${p.soldDate}` : p.date || getCurrentDateStr());

        return `
          <tr ondblclick="viewPhone('${p.id}', true)" style="cursor: pointer;" title="Nháy 2 lần để xem chi tiết máy">
            <td style="font-weight: 800; text-align: left; padding-left: 16px; vertical-align: middle;">
              ${nameHtml}
            </td>
            <td style="text-align: center; vertical-align: middle;">
              <span style="display: inline-block; background: #ec4899; color: #ffffff; font-weight: 900; font-size: 1.28rem; padding: 3px 11px; border-radius: 7px; border: 1.5px solid #f472b6; box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4); line-height: 1.2;">
                ${displayPriceOut}
              </span>
            </td>
            <td style="color: #ffffff; font-weight: 900; font-size: 1.155rem; text-align: center; vertical-align: middle;">${displayPriceIn}</td>
            <td style="font-weight: 900; color: #eab308; font-size: 1.155rem; text-align: center; vertical-align: middle;">${displayProfit}</td>
            <td style="text-align: center; vertical-align: middle;"><span style="font-weight: 800; font-size: 1.05rem; color: ${methodColor};">${method}</span></td>
            <td style="color: #ffffff; font-weight: 800; font-size: 1.05rem; text-align: center; vertical-align: middle;">${dateDisplay}</td>
            <td style="text-align: center; vertical-align: middle;">
              <div class="action-btn-group" style="justify-content: center;">
                <button type="button" class="action-btn-icon action-btn-view" onclick="viewPhone('${p.id}', true)" title="Xem chi tiết">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-edit" onclick="editSoldPhone('${p.id}')" title="Sửa thông tin">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-del" onclick="deleteSoldPhone('${p.id}')" title="Xóa lịch sử">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }

    /* ============================================================
       PHÂN HỆ QUẢN LÝ DỊCH VỤ PHẦN MỀM (CHUẨN 100% ẢNH MẪU)
       ============================================================ */
    let swDropdownConfigs = {
      customer: {
        listId: 'swCustomerList',
        storageKey: 'KIMCHI_SW_OPT_CUSTOMERS',
        defaults: ["A Huy", "Tấn Phát", "Kỳ Hường", "Khách Lẻ", "Thợ Nam", "Thợ Hải"]
      },
      device: {
        listId: 'swDeviceList',
        storageKey: 'KIMCHI_SW_OPT_DEVICES',
        defaults: ["Đã Thanh Toán"]
      },
      price: {
        listId: 'swPriceList',
        storageKey: 'KIMCHI_SW_OPT_PRICES',
        defaults: ["0", "50", "100", "150", "200", "250", "300", "350", "400", "500", "1000"]
      },
      fee: {
        listId: 'swFeeList',
        storageKey: 'KIMCHI_SW_OPT_FEES',
        defaults: ["0", "20", "30", "50", "100"]
      }
    };

    function isSwDaThanhToan(str) {
      if (!str) return false;
      let raw = String(str).trim().toLowerCase();
      if (raw.includes('đã thanh toán') || raw.includes('da thanh toan') || raw.includes('đã trả') || raw.includes('da tra') || raw.includes('thanh toán') || raw.includes('thanh toan')) {
        return true;
      }
      let s = raw.replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.includes('da thanh toan') || s.includes('da tra') || s.includes('thanh toan');
    }

    function getSwDropdownItems(type) {
      let cfg = swDropdownConfigs[type];
      if (!cfg) return [];
      let list = [];
      let stored = localStorage.getItem(cfg.storageKey);
      if (stored) {
        try { list = JSON.parse(stored); } catch(e){}
      }
      if (!Array.isArray(list) || list.length === 0) {
        list = [...cfg.defaults];
      }

      // Loại bỏ trùng lặp và khoảng trắng thừa (chuẩn hóa cả không dấu và viết hoa/thường)
      let cleanMap = new Map();
      list.forEach(item => {
        if (item !== null && item !== undefined) {
          let s = String(item).trim();
          if (!s) return;
          let normKey = s.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (!cleanMap.has(normKey)) {
            cleanMap.set(normKey, s);
          }
        }
      });
      let result = Array.from(cleanMap.values());

      // Phân loại sắp xếp
      if (type === 'price' || type === 'fee') {
        // Phần giá sắp xếp từ 0 đến 100000 theo thứ tự số học tăng dần
        result.sort((a, b) => {
          let numA = parsePriceNum(a);
          let numB = parsePriceNum(b);
          return numA - numB;
        });
      } else {
        // Riêng danh mục Tên máy: nếu chưa có "Đã Thanh Toán" thì bổ sung vào để đưa lên trên cùng
        if (type === 'device' && !result.some(x => isSwDaThanhToan(x))) {
          result.unshift('Đã Thanh Toán');
        }

        // Sắp xếp danh sách từ A-Z, riêng "Đã Thanh Toán" cho lên trên cùng
        result.sort((a, b) => {
          let isA = isSwDaThanhToan(a);
          let isB = isSwDaThanhToan(b);
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
          return a.localeCompare(b, 'vi', { sensitivity: 'base', numeric: true });
        });
      }

      return result;
    }

    function saveSwDropdownItems(type, items) {
      let cfg = swDropdownConfigs[type];
      if (!cfg) return;
      let cleanMap = new Map();
      (items || []).forEach(item => {
        if (item !== null && item !== undefined) {
          let s = String(item).trim();
          if (!s) return;
          let normKey = s.toLowerCase().replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (!cleanMap.has(normKey)) {
            cleanMap.set(normKey, s);
          }
        }
      });
      let sortedItems = Array.from(cleanMap.values());
      if (type === 'price' || type === 'fee') {
        sortedItems.sort((a, b) => parsePriceNum(a) - parsePriceNum(b));
      } else {
        sortedItems.sort((a, b) => {
          let isA = isSwDaThanhToan(a);
          let isB = isSwDaThanhToan(b);
          if (isA && !isB) return -1;
          if (!isA && isB) return 1;
          return a.localeCompare(b, 'vi', { sensitivity: 'base', numeric: true });
        });
      }
      localStorage.setItem(cfg.storageKey, JSON.stringify(sortedItems));
      renderSwDatalists();
      renderSwCustomerFilterOptions();
      renderSwDropdownMenu(type, '');
    }

    function renderSwDatalists() {
      Object.keys(swDropdownConfigs).forEach(type => {
        // Datalist browser giữ lại (empty) - custom dropdown đảm nhiệm
      });
    }

    function renderSwCustomerFilterOptions() {
      const select = document.getElementById('swCustomerFilter');
      if (!select) return;
      let currentVal = select.value || 'ALL';

      let candidateList = [];

      if (swViewMode === 'day') {
        const dd = String(swFilterDate.getDate()).padStart(2, '0');
        const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = String(swFilterDate.getFullYear());
        let targetDayMonth = `${dd}-${mm}`;
        candidateList = softwareDatabase.filter(item => {
          return item.dayMonth === targetDayMonth && (!item.year || String(item.year) === yyyy);
        });
      } else if (swViewMode === 'month') {
        const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
        const yyyy = String(currentSoftwareMonthFilter.year);
        candidateList = softwareDatabase.filter(item => {
          let itemParts = (item.dayMonth || '').split('-');
          let itemMonth = itemParts.length === 2 ? itemParts[1] : '';
          let itemYear = String(item.year || '2026');
          return itemMonth === mm && itemYear === yyyy;
        });
      } else if (swViewMode === 'year') {
        const yyyy = String(currentSoftwareYearFilter);
        candidateList = softwareDatabase.filter(item => {
          let itemYear = String(item.year || '2026');
          return itemYear === yyyy;
        });
      } else {
        // Chế độ 'all': Lấy tất cả khách hàng đã tạo đơn trong danh sách phần mềm
        candidateList = softwareDatabase;
      }

      // Trích xuất danh sách khách hàng duy nhất đã tạo trong phạm vi đã chọn
      let customerNames = candidateList
        .map(x => (x.customer || '').trim())
        .filter(Boolean);
      let uniqueCusts = Array.from(new Set(customerNames));

      // Sắp xếp tên khách A-Z
      uniqueCusts.sort((a, b) => a.localeCompare(b, 'vi'));

      let optionsHtml = `<option value="ALL">Tất cả khách hàng${uniqueCusts.length > 0 ? ` (${uniqueCusts.length})` : ''}</option>` +
        uniqueCusts.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
      select.innerHTML = optionsHtml;

      // Giữ lại giá trị đang chọn nếu khách đó vẫn có trong danh sách mới, ngược lại reset về ALL
      if (currentVal !== 'ALL' && uniqueCusts.includes(currentVal)) {
        select.value = currentVal;
        swFilterCustomer = currentVal;
      } else {
        select.value = 'ALL';
        swFilterCustomer = 'ALL';
      }
    }

    /* ============================================================
       CUSTOM DROPDOWN LOGIC CHO MODAL PHẦN MỀM
       ============================================================ */
    const SW_DROPDOWN_META = {
      customer: { inputId: 'swCustomerInput', menuId: 'swCustomerDropdownMenu' },
      device:   { inputId: 'swDeviceInput',   menuId: 'swDeviceDropdownMenu' },
      price:    { inputId: 'swPriceInput',    menuId: 'swPriceDropdownMenu' },
      fee:      { inputId: 'swFeeInput',      menuId: 'swFeeDropdownMenu' }
    };

    function renderSwDropdownMenu(type, keyword) {
      const meta = SW_DROPDOWN_META[type];
      if (!meta) return;
      const menu = document.getElementById(meta.menuId);
      if (!menu) return;
      const input = document.getElementById(meta.inputId);
      const currentVal = input ? input.value.trim() : '';
      let items = getSwDropdownItems(type);

      let filtered = items;
      if (keyword && typeof keyword === 'string' && keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        filtered = items.filter(v => v.toLowerCase().includes(kw));
      }

      if (filtered.length === 0) {
        if (window.innerWidth <= 768) {
          closeSwDropdown();
          return;
        }
        const cleanKw = keyword ? keyword.trim() : '';
        if (cleanKw) {
          const escaped = cleanKw.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
          menu.innerHTML = `
            <div style="padding: 10px 12px; text-align: center;">
              <div style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 6px;">Chưa có trong danh sách gợi ý</div>
              <button type="button" class="sw-btn-quick-add" data-type="${type}" data-val="${escaped}"
                style="background: #10b981; color: #000; border: none; border-radius: 6px; padding: 6px 12px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(16,185,129,0.3);">
                + Thêm "${cleanKw}" vào gợi ý
              </button>
            </div>`;
        } else {
          menu.innerHTML = `<div style="padding: 10px; color: #64748b; font-size: 0.85rem; text-align: center;">Không có mục nào</div>`;
        }
        return;
      }

      menu.innerHTML = filtered.map(v => {
        const isActive = v.trim().toLowerCase() === currentVal.toLowerCase();
        const escaped = v.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
        return `<div class="sw-dropdown-item${isActive ? ' active' : ''}" data-type="${type}" data-value="${escaped}">${v}${isActive ? '<span class="sw-check-mark">✓</span>' : ''}</div>`;
      }).join('');
    }

    function openSwDropdown(type) {
      if (window.innerWidth <= 768 && (type === 'price' || type === 'fee')) {
        return; // Trên mobile: chỉ nhập giá/phí, không mở dropdown chọn
      }
      closeAllSwDropdowns(type);
      const meta = SW_DROPDOWN_META[type];
      if (!meta) return;
      const menu = document.getElementById(meta.menuId);
      if (!menu) return;
      renderSwDropdownMenu(type, '');
      menu.classList.add('open');
      // Cuộn đến item đang active
      setTimeout(() => {
        const activeItem = menu.querySelector('.sw-dropdown-item.active');
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest' });
      }, 50);
    }

    // Event delegation: bắt mousedown trên TẤT CẢ sw-dropdown-item & nút thêm nhanh qua document
    document.addEventListener('mousedown', function(e) {
      const quickBtn = e.target.closest('.sw-btn-quick-add');
      if (quickBtn && quickBtn.dataset.type && quickBtn.dataset.val) {
        e.preventDefault();
        const type = quickBtn.dataset.type;
        const meta = SW_DROPDOWN_META[type];
        if (meta) {
          const input = document.getElementById(meta.inputId);
          if (input) input.value = quickBtn.dataset.val;
          addNewSwOption(type, meta.inputId, '', null);
        }
        return;
      }

      const item = e.target.closest('.sw-dropdown-item');
      if (item && item.dataset.type && item.dataset.value !== undefined) {
        e.preventDefault(); // Ngăn input blur
        selectSwDropdownItem(item.dataset.type, item.dataset.value);
      }
    });

    // Đóng dropdown khi click ra ngoài (dùng mousedown để đồng bộ thứ tự event)
    document.addEventListener('mousedown', function(e) {
      if (e.target.closest('.sw-dropdown-item')) return; // Item đã được xử lý ở trên
      const isInsideCol = e.target.closest('.sw-input-col');
      if (!isInsideCol) {
        closeAllSwDropdowns(null);
      }
    });

    function toggleSwDropdown(type) {
      const meta = SW_DROPDOWN_META[type];
      if (!meta) return;
      const menu = document.getElementById(meta.menuId);
      if (!menu) return;
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
      } else {
        openSwDropdown(type);
        const input = document.getElementById(meta.inputId);
        if (input) input.focus();
      }
    }

    function filterSwDropdown(type, keyword) {
      const meta = SW_DROPDOWN_META[type];
      if (!meta) return;
      const menu = document.getElementById(meta.menuId);
      if (!menu) return;
      if (menu.classList.contains('open')) {
        renderSwDropdownMenu(type, keyword);
      }
    }

    function handleSwDeviceChange(val) {
      const paySelect = document.getElementById('swFormPayment');
      if (!paySelect) return;
      if (isSwDaThanhToan(val)) {
        paySelect.value = 'ĐÃ TRẢ';
      }
    }

    function selectSwDropdownItem(type, value) {
      const meta = SW_DROPDOWN_META[type];
      if (!meta) return;
      const input = document.getElementById(meta.inputId);
      if (input) {
        input.value = value;
        if (type === 'price' || type === 'fee') {
          formatCurrencyInput(input);
        }
        if (type === 'device') {
          handleSwDeviceChange(value);
        }
        input.dispatchEvent(new Event('change'));
      }
      const menu = document.getElementById(meta.menuId);
      if (menu) menu.classList.remove('open');
    }

    function closeAllSwDropdowns(exceptType) {
      Object.keys(SW_DROPDOWN_META).forEach(type => {
        if (type === exceptType) return;
        const meta = SW_DROPDOWN_META[type];
        const menu = document.getElementById(meta.menuId);
        if (menu) menu.classList.remove('open');
      });
    }

    function addNewSwOption(type, inputId, promptText, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      const input = document.getElementById(inputId);
      let currentVal = input ? input.value.trim() : '';
      let clean = '';

      if (currentVal !== "") {
        // TỰ ĐỘNG LẤY NGAY GIÁ TRỊ ĐÃ GÕ TRONG Ô, KHÔNG BẮT GÕ LẠI!
        clean = currentVal;
      } else {
        // Nếu ô đang để trống mới mở prompt để nhập
        let val = prompt(promptText || 'Nhập tên mục mới:');
        if (val && val.trim() !== "") {
          clean = val.trim();
        }
      }

      if (clean !== "") {
        let items = getSwDropdownItems(type);
        let exists = items.some(x => x.toLowerCase() === clean.toLowerCase());
        if (!exists) {
          items.unshift(clean);
          saveSwDropdownItems(type, items);
          if (input) input.value = clean;
          renderSwDropdownMenu(type, '');
          alert(`✓ Đã thêm "${clean}" vào danh mục gợi ý thành công!`);
        } else {
          if (input) input.value = clean;
          renderSwDropdownMenu(type, '');
          alert(`Mục "${clean}" đã có sẵn trong danh mục gợi ý!`);
        }
      }
    }

    function editSwOption(type, inputId, promptText, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      let el = document.getElementById(inputId);
      let currentVal = el ? el.value.trim() : '';
      let items = getSwDropdownItems(type);

      if (!currentVal) {
        if (items.length === 0) {
          alert('Danh sách đang trống!');
          return;
        }
        let pick = prompt(`Nhập chính xác tên mục muốn sửa:\n(Hiện có: ${items.join(', ')})`);
        if (!pick || !pick.trim()) return;
        currentVal = pick.trim();
      }

      let val = prompt(promptText, currentVal);
      if (val !== null && val.trim() !== "") {
        let newVal = val.trim();
        let idx = items.findIndex(x => x.toLowerCase() === currentVal.toLowerCase());
        if (idx !== -1) {
          items[idx] = newVal;
        } else if (!items.some(x => x.toLowerCase() === newVal.toLowerCase())) {
          items.unshift(newVal);
        }
        saveSwDropdownItems(type, items);
        if (el) el.value = newVal;
        renderSwDropdownMenu(type, '');
      }
    }

    function deleteSwOption(type, inputId, event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      let el = document.getElementById(inputId);
      let currentVal = el ? el.value.trim() : '';
      let items = getSwDropdownItems(type);

      if (items.length === 0) {
        alert("Danh mục này hiện đang trống!");
        return;
      }

      let targetVal = currentVal;
      if (!targetVal) {
        let pick = prompt(`Nhập chính xác tên mục muốn xóa khỏi danh mục gợi ý:\n(Hiện có: ${items.join(', ')})`);
        if (!pick || !pick.trim()) return;
        targetVal = pick.trim();
      }

      if (confirm(`Bạn có chắc chắn muốn xóa "${targetVal}" khỏi danh mục gợi ý không?`)) {
        let newItems = items.filter(x => x.trim().toLowerCase() !== targetVal.toLowerCase());
        saveSwDropdownItems(type, newItems);
        if (el && el.value.trim().toLowerCase() === targetVal.toLowerCase()) {
          el.value = '';
        }
        closeAllSwDropdowns(null);
        renderSwDropdownMenu(type, '');
        alert(`Đã xóa "${targetVal}" khỏi danh mục thành công!`);
      }
    }

    // (DEFAULT_SOFTWARE_DATA & softwareDatabase đã được khởi tạo ở đầu file trước DOMContentLoaded)

    
    function getCustomerDebtDocKey(customerName) {
      if (!customerName) return '';
      try {
        const bytes = new TextEncoder().encode(customerName.trim());
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return 'kcm_' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch (e) {
        return 'kcm_' + encodeURIComponent(customerName.trim());
      }
    }
    window.getCustomerDebtDocKey = getCustomerDebtDocKey;

    function syncCustomerDebtsToCloud(targetCustomerName) {
      if (typeof db === 'undefined' || !db) return;
      try {
        let customersToSync = [];
        if (targetCustomerName) {
          customersToSync.push(targetCustomerName.trim());
        } else {
          // Lấy tất cả khách hàng có trong danh sách phần mềm
          let custSet = new Set();
          softwareDatabase.forEach(s => {
            let c = (s.customer || 'Khách lẻ').trim();
            if (c) custSet.add(c);
          });
          customersToSync = Array.from(custSet);
        }

        customersToSync.forEach(cName => {
          if (!cName) return;
          const docKey = getCustomerDebtDocKey(cName);
          if (!docKey) return;

          // Lọc các đơn thực sự còn nợ của khách hàng này
          let debts = softwareDatabase.filter(s => {
            let sCust = (s.customer || 'Khách lẻ').trim().toLowerCase();
            return sCust === cName.toLowerCase() && isSoftwareDebt(s);
          });

          // Sắp xếp ngày mới nhất lên đầu
          debts.sort((a, b) => {
            let parseDt = (item) => {
              let dateStr = (item.dayMonth || '') + '-' + (item.year || '2026');
              let [d, m, y] = dateStr.split('-').map(x => parseInt(x, 10) || 0);
              return new Date(y, (m || 1) - 1, d || 1).getTime();
            };
            return parseDt(b) - parseDt(a);
          });

          let totalDebt = debts.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);
          
          let debtPayload = {
            customer: cName,
            token: docKey,
            totalDebt: totalDebt,
            count: debts.length,
            updatedAt: new Date().toISOString(),
            debts: debts.map((item, idx) => ({
              stt: idx + 1,
              id: String(item.id),
              device: item.device || 'Đơn phần mềm',
              price: parsePriceNum(item.price) || 0,
              date: ((item.dayMonth || '') + (item.year ? ('-' + item.year) : '')).replace(/-/g, '/')
            }))
          };

          // Ghi đè trực tiếp tài liệu độc lập của khách hàng này
          db.collection('customer_debts').doc(docKey).set(debtPayload).catch(err => {
            console.error("Lỗi đồng bộ customer_debts cho khách " + cName + ":", err);
          });
        });
      } catch (err) {
        console.error("Lỗi syncCustomerDebtsToCloud:", err);
      }
    }
    window.syncCustomerDebtsToCloud = syncCustomerDebtsToCloud;

    function saveSoftwareStorage(itemOrListToSync) {
      if (softwareDatabase.length > 0) localStorage.removeItem('KIMCHI_PHANMEM_CLEARED');
      try { localStorage.setItem('KIMCHI_PHANMEM_DB', JSON.stringify(softwareDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        const syncDoc = (item) => {
          if (!item) return;
          const docKey = String(item.id);
          if (!docKey) return;
          db.collection('software').doc(docKey).set(item, { merge: true }).catch(err => {
            console.error("Lỗi đồng bộ Firestore doc software:", docKey, err);
          });
        };
        if (Array.isArray(itemOrListToSync)) {
          itemOrListToSync.forEach(syncDoc);
        } else if (itemOrListToSync) {
          syncDoc(itemOrListToSync);
        } else {
          softwareDatabase.forEach(syncDoc);
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
    }

    let swFilterDate = getVietnamDate();
    let swFilterCustomer = 'ALL';
    let swFilterStatus = 'ALL';
    let swIsAllMonths = false;

    function initSoftwareTimeSelectors() {
      const hSelect = document.getElementById('swFormHour');
      const mSelect = document.getElementById('swFormMin');
      if (hSelect && hSelect.options.length === 0) {
        for (let i = 0; i < 24; i++) {
          let str = String(i).padStart(2, '0');
          hSelect.innerHTML += `<option value="${str}">${str}</option>`;
        }
      }
      if (mSelect && mSelect.options.length === 0) {
        for (let i = 0; i < 60; i++) {
          let str = String(i).padStart(2, '0');
          mSelect.innerHTML += `<option value="${str}">${str}</option>`;
        }
      }
    }

    let swViewMode = 'day';
    let currentSoftwareMonthFilter = { month: swFilterDate.getMonth(), year: swFilterDate.getFullYear() };
    let currentSoftwareYearFilter = swFilterDate ? swFilterDate.getFullYear() : 2026;

    function setSoftwareMode(mode) {
      swViewMode = mode;
      const selMode = document.getElementById('swModeSelect');
      if (selMode) selMode.value = mode;
      const btnDay = document.getElementById('swModeDayBtn');
      const btnMonth = document.getElementById('swModeMonthBtn');
      const btnYear = document.getElementById('swModeYearBtn');
      const dayBox = document.getElementById('swDateFilterBox');
      const monthBox = document.getElementById('swMonthFilterBox');
      const yearBox = document.getElementById('swYearFilterBox');

      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnYear) btnYear.classList.toggle('active', mode === 'year');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderSwCustomerFilterOptions();
      renderSoftwareTable(softwareDatabase);
    }
    window.setSoftwareMode = setSoftwareMode;

    function changeSoftwareFilterDate(delta) {
      swFilterDate.setDate(swFilterDate.getDate() + delta);
      const dd = String(swFilterDate.getDate()).padStart(2, '0');
      const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
      const yyyy = swFilterDate.getFullYear();
      const el = document.getElementById('filterSoftwareDateDisplay');
      if (el) {
        if (el.tagName === 'INPUT') el.value = `${dd}/${mm}/${yyyy}`;
        else el.innerText = `${dd}/${mm}/${yyyy}`;
      }
      renderSwCustomerFilterOptions();
      renderSoftwareTable(softwareDatabase);
    }
    window.changeSoftwareFilterDate = changeSoftwareFilterDate;

    function changeSoftwareFilterMonth(delta) {
      currentSoftwareMonthFilter.month += delta;
      if (currentSoftwareMonthFilter.month > 11) {
        currentSoftwareMonthFilter.month = 0;
        currentSoftwareMonthFilter.year++;
      } else if (currentSoftwareMonthFilter.month < 0) {
        currentSoftwareMonthFilter.month = 11;
        currentSoftwareMonthFilter.year--;
      }
      const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
      const el = document.getElementById('filterSoftwareMonthDisplay');
      if (el) el.innerText = `${mm}/${currentSoftwareMonthFilter.year}`;
      renderSwCustomerFilterOptions();
      renderSoftwareTable(softwareDatabase);
    }
    window.changeSoftwareFilterMonth = changeSoftwareFilterMonth;

    function changeSoftwareFilterYear(delta) {
      currentSoftwareYearFilter += delta;
      const el = document.getElementById('filterSoftwareYearDisplay');
      if (el) el.innerText = String(currentSoftwareYearFilter);
      renderSwCustomerFilterOptions();
      renderSoftwareTable(softwareDatabase);
    }
    window.changeSoftwareFilterYear = changeSoftwareFilterYear;

    function handleSoftwareCustomerFilter(val) {
      swFilterCustomer = val;
      renderSoftwareTable(softwareDatabase);
    }

    function clearSoftwareCustomerFilter() {
      swFilterCustomer = 'ALL';
      const el = document.getElementById('swCustomerFilter');
      if (el) el.value = 'ALL';
      renderSoftwareTable(softwareDatabase);
    }

    function handleSoftwareStatusFilter(val) {
      swFilterStatus = val;
      renderSoftwareTable(softwareDatabase);
    }

    function isSoftwareDebt(item) {
      if (!item || !item.paymentStatus) return false;
      if ((parsePriceNum(item.price) || 0) <= 0) return false;
      let s = String(item.paymentStatus).trim().toUpperCase();
      let sClean = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return s.includes('NỢ') || sClean.includes('NO') || sClean.includes('DAI') || sClean.includes('CHUA');
    }
    window.isSoftwareDebt = isSoftwareDebt;

    function updateSoftwarePayButtonVisibility() {
      const btn = document.getElementById('swBtnPay');
      const checkAll = document.getElementById('swCheckAll');
      const debtItems = softwareDatabase.filter(x => isSoftwareDebt(x));
      const hasSelectedDebt = debtItems.some(x => x.selected);

      if (btn) {
        btn.style.display = hasSelectedDebt ? 'inline-flex' : 'none';
      }
      if (checkAll) {
        checkAll.checked = debtItems.length > 0 && debtItems.every(x => x.selected);
      }
    }

    function toggleSelectAllSoftware(masterCb) {
      let checked = masterCb.checked;
      softwareDatabase.forEach(item => {
        // Chỉ cho phép chọn/bỏ chọn các đơn NỢ DAI VL
        if (isSoftwareDebt(item)) {
          item.selected = checked;
        }
      });
      renderSoftwareTable(softwareDatabase);
      updateSoftwarePayButtonVisibility();
    }

    function toggleSelectSoftwareItem(id, cb) {
      const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (item) {
        item.selected = cb.checked;
      }
      updateSoftwarePayButtonVisibility();
    }

    function paySelectedDebts() {
      let selectedDebts = softwareDatabase.filter(x => x.selected && isSoftwareDebt(x));
      if (selectedDebts.length === 0) {
        alert("Vui lòng tích chọn ít nhất một đơn có trạng thái 'NỢ DAI VL' để thanh toán!");
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xác nhận thanh toán cho ${selectedDebts.length} đơn đã chọn không?`)) {
        selectedDebts.forEach(x => {
          x.paymentStatus = 'ĐÃ TRẢ';
          x.selected = false;
        });
        saveSoftwareStorage();
        renderSoftwareTable(softwareDatabase);
        updateSoftwarePayButtonVisibility();
        alert(`Đã cập nhật trạng thái "ĐÃ TRẢ" cho ${selectedDebts.length} đơn thành công!`);
      }
    }

    let swHideProfits = false;

    function toggleHideSoftwareColumns() {
      swHideProfits = !swHideProfits;
      const eyeBtn = document.getElementById('btnSwHide');
      const eyeIcon = document.getElementById('swEyeIcon');

      if (swHideProfits) {
        if (eyeBtn) {
          eyeBtn.classList.add('is-hidden');
          eyeBtn.title = 'Hiện số tiền lãi';
        }
        if (eyeIcon) {
          eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          `;
        }
        const dayEl = document.getElementById('swDayProfitText');
        if (dayEl) dayEl.innerText = '***';
        const monthEl = document.getElementById('swMonthProfitText');
        if (monthEl) monthEl.innerText = '***';
        const dayRevEl = document.getElementById('swDayRevenueText');
        if (dayRevEl) dayRevEl.innerText = '***';
        const monthRevEl = document.getElementById('swMonthRevenueText');
        if (monthRevEl) monthRevEl.innerText = '***';
      } else {
        if (eyeBtn) {
          eyeBtn.classList.remove('is-hidden');
          eyeBtn.title = 'Ẩn số tiền lãi';
        }
        if (eyeIcon) {
          eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          `;
        }
        updateSoftwareProfits();
      }
      renderSoftwareTable(softwareDatabase);
      if (typeof renderSoftwareDebtGrid === 'function' && document.getElementById('swDebtView')?.style.display !== 'none') {
        renderSoftwareDebtGrid();
      }
    }

    function markSoftwareAsPaidOnDblClick(id) {
      const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (!item) return;

      // Chỉ khi nợ dai vl mới chuyển sang đã trả, đã trả thì không có tác dụng
      if (isSoftwareDebt(item)) {
        const oldData = JSON.parse(JSON.stringify(item));
        item.paymentStatus = 'ĐÃ TRẢ';
        item.selected = false;
        saveSoftwareStorage(item);
        if (typeof logActivity === 'function') {
          logActivity('EDIT', 'phanmem', 'Phần mềm', `Thanh toán công nợ đơn phần mềm: ${item.customer} - ${item.device} sang ĐÃ TRẢ`, oldData, item, id);
        }
        renderSoftwareTable(softwareDatabase);
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
        if (typeof updateSoftwareProfits === 'function') updateSoftwareProfits();
        if (typeof renderSoftwareDebtTable === 'function' && typeof swIsDebtViewActive !== 'undefined' && swIsDebtViewActive) {
          renderSoftwareDebtTable();
        }
      }
    }
    window.markSoftwareAsPaidOnDblClick = markSoftwareAsPaidOnDblClick;

    function openSoftwareModal(editId = null) {
      renderSwDatalists();
      initSoftwareTimeSelectors();

      document.getElementById('swEditId').value = '';
      document.getElementById('swModalTitle').innerText = "TẠO ĐƠN PHẦN MỀM";
      const swBtn = document.getElementById('swSubmitBtn');
      if (swBtn) swBtn.innerText = "TẠO ĐƠN";
      document.getElementById('swCustomerInput').value = '';
      document.getElementById('swDeviceInput').value = '';
      document.getElementById('swPriceInput').value = '';
      document.getElementById('swFeeInput').value = '';

      const filterDateEl = document.getElementById('filterSoftwareDateDisplay');
      let defaultDateVal = '';
      if (filterDateEl) {
        defaultDateVal = (filterDateEl.value || filterDateEl.innerText || filterDateEl.textContent || '').trim();
      }
      if (!defaultDateVal || defaultDateVal === '--/--/----' || defaultDateVal.length < 8) {
        if (typeof swFilterDate !== 'undefined' && swFilterDate instanceof Date && !isNaN(swFilterDate.getTime())) {
          const dd = String(swFilterDate.getDate()).padStart(2, '0');
          const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
          const yyyy = swFilterDate.getFullYear();
          defaultDateVal = dd + '/' + mm + '/' + yyyy;
        } else {
          defaultDateVal = getCurrentDateStr();
        }
      }
      document.getElementById('swFormDate').value = defaultDateVal;

      const now = getVietnamDate();
      const hIn = document.getElementById('swFormHour');
      const mIn = document.getElementById('swFormMin');
      if (hIn) hIn.value = String(now.getHours()).padStart(2, '0');
      if (mIn) mIn.value = String(now.getMinutes()).padStart(2, '0');
      document.getElementById('swFormPayment').value = 'NỢ DAI VL';

      if (editId) {
        const item = softwareDatabase.find(x => String(x.id) === String(editId) || x.id == editId);
        if (item) {
          document.getElementById('swModalTitle').innerText = "SỬA ĐƠN PHẦN MỀM";
          const swEditBtn = document.getElementById('swSubmitBtn');
          if (swEditBtn) swEditBtn.innerText = "LƯU ĐƠN";
          document.getElementById('swEditId').value = item.id;
          document.getElementById('swCustomerInput').value = item.customer || '';
          document.getElementById('swDeviceInput').value = item.device || '';
          document.getElementById('swPriceInput').value = item.price || '';
          document.getElementById('swFeeInput').value = (item.cost && item.cost !== '0') ? item.cost : '';
          
          let parts = (item.dayMonth || '').split('-');
          if (parts.length === 2) {
            document.getElementById('swFormDate').value = `${parts[0]}/${parts[1]}/${item.year || '2026'}`;
          }
          if (item.time) {
            let t = item.time.split(':');
            if (t.length === 2) {
              if (hIn) hIn.value = t[0];
              if (mIn) mIn.value = t[1];
            }
          }
          let isPaid = (item.paymentStatus === 'ĐÃ TRẢ' || item.paymentStatus === 'ĐÃ THANH TOÁN');
          document.getElementById('swFormPayment').value = isPaid ? 'ĐÃ TRẢ' : 'NỢ DAI VL';
        }
      }

      document.getElementById('softwareModal').classList.add('active');
    }
    window.openSoftwareModal = openSoftwareModal;

    function closeSoftwareModal() {
      document.getElementById('softwareModal').classList.remove('active');
      closeAllSwDropdowns(null);
    }
    window.closeSoftwareModal = closeSoftwareModal;

    function saveSoftwareTicket(e) {
      e.preventDefault();
      const editId = document.getElementById('swEditId').value;
      let customer = (document.getElementById('swCustomerInput').value || '').trim();
      if (!customer) customer = 'Khách Lẻ';
      const device = (document.getElementById('swDeviceInput').value || '').trim();
      const price = (document.getElementById('swPriceInput').value || '').trim();
      const feeInputEl = document.getElementById('swFeeInput');
      const cost = feeInputEl ? feeInputEl.value.trim() : '0';
      const dateVal = document.getElementById('swFormDate').value.trim();
      const hourEl = document.getElementById('swFormHour');
      const minEl = document.getElementById('swFormMin');
      const nowTime = getVietnamDate();
      const hourVal = hourEl ? hourEl.value : String(nowTime.getHours()).padStart(2, '0');
      const minVal = minEl ? minEl.value : String(nowTime.getMinutes()).padStart(2, '0');
      const paymentStatus = document.getElementById('swFormPayment').value;

      let pNum = parseFloat(price.replace(/\D/g, '')) || 0;
      let cNum = parseFloat(cost.replace(/\D/g, '')) || 0;
      let profit = String(pNum - cNum);

      let cleanDate = dateVal.replace(/-/g, '/');
      let dParts = cleanDate.split('/');
      let ddStr, mmStr, yyyyStr;
      if (dParts.length === 3 && dParts[0].length === 4) {
        // Định dạng YYYY/MM/DD
        yyyyStr = dParts[0];
        mmStr = String(parseInt(dParts[1], 10)).padStart(2, '0');
        ddStr = String(parseInt(dParts[2], 10)).padStart(2, '0');
      } else {
        // Định dạng DD/MM/YYYY
        ddStr = dParts[0] ? String(parseInt(dParts[0], 10)).padStart(2, '0') : '01';
        mmStr = dParts[1] ? String(parseInt(dParts[1], 10)).padStart(2, '0') : '01';
        yyyyStr = (dParts.length >= 3 && dParts[2]) ? String(parseInt(dParts[2], 10)) : '2026';
      }
      let dayMonth = `${ddStr}-${mmStr}`;
      let year = yyyyStr;
      let time = `${hourVal}:${minVal}`;

      // Tự động lưu vào dropdown options nếu là mới
      let custs = getSwDropdownItems('customer');
      if (!custs.includes(customer)) { custs.unshift(customer); saveSwDropdownItems('customer', custs); }
      let devs = getSwDropdownItems('device');
      if (!devs.includes(device)) { devs.unshift(device); saveSwDropdownItems('device', devs); }

      let targetItem = null;
      if (editId) {
        const idx = softwareDatabase.findIndex(x => String(x.id) === String(editId) || x.id == editId);
        if (idx !== -1) {
          const oldData = JSON.parse(JSON.stringify(softwareDatabase[idx]));
          softwareDatabase[idx].customer = customer;
          softwareDatabase[idx].device = device;
          softwareDatabase[idx].price = price;
          softwareDatabase[idx].cost = cost;
          softwareDatabase[idx].profit = profit;
          softwareDatabase[idx].dayMonth = dayMonth;
          softwareDatabase[idx].year = year;
          softwareDatabase[idx].time = time;
          softwareDatabase[idx].paymentStatus = paymentStatus;
          targetItem = softwareDatabase[idx];
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'phanmem', 'Phần mềm', `Sửa đơn phần mềm: ${customer} - ${device} (Báo giá: ${price}, Đớp: ${profit})`, oldData, softwareDatabase[idx], softwareDatabase[idx].id);
          }
        }
      } else {
        const newItem = {
          id: 'sw_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
          customer,
          device,
          price,
          cost,
          profit,
          dayMonth,
          year,
          time,
          paymentStatus,
          selected: false
        };
        softwareDatabase.unshift(newItem);
        targetItem = newItem;
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'phanmem', 'Phần mềm', `Tạo đơn phần mềm: ${customer} - ${device} (Báo giá: ${price}, Đớp: ${profit})`, null, newItem, newItem.id);
        }
      }

      // ĐỒNG BỘ BỘ LỌC NGÀY VỀ NGÀY VỪA TẠO ĐƠN ĐỂ ĐƠN MỚI HIỂN THỊ NGAY LẬP TỨC
      swFilterDate = new Date(parseInt(year, 10), parseInt(mmStr, 10) - 1, parseInt(ddStr, 10));
      const disp = document.getElementById('filterSoftwareDateDisplay');
      if (disp) {
        disp.value = `${ddStr}/${mmStr}/${year}`;
      }
      swIsAllMonths = false;
      const allMonthsBtn = document.getElementById('swBtnAllMonths');
      if (allMonthsBtn) {
        allMonthsBtn.style.background = 'rgba(5, 150, 105, 0.08)';
        allMonthsBtn.style.color = '#34d399';
      }

      // Reset bộ lọc khách hàng và trạng thái để đơn mới luôn hiển thị
      swFilterCustomer = 'ALL';
      const custSelect = document.getElementById('swCustomerFilter');
      if (custSelect) custSelect.value = 'ALL';

      swFilterStatus = 'ALL';
      const statusSelect = document.getElementById('swStatusFilter');
      if (statusSelect) statusSelect.value = 'ALL';

      saveSoftwareStorage(targetItem);
      renderSwCustomerFilterOptions();
      closeSoftwareModal();
      renderSoftwareTable(softwareDatabase);
      updateSoftwarePayButtonVisibility();
    }
    window.saveSoftwareTicket = saveSoftwareTicket;

    function viewSoftwareTicket(id) {
      const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (!item) return;

      const viewModal = document.getElementById('viewPhoneModal');
      const contentDiv = document.getElementById('viewPhoneDetailsContent');

      if (contentDiv && viewModal) {
        const titleSpan = viewModal.querySelector('.ticket-header span');
        if (titleSpan) titleSpan.innerText = '💻 CHI TIẾT ĐƠN PHẦN MỀM';

        let isDebt = isSoftwareDebt(item);
        let statusBadge = isDebt
          ? `<span class="sw-badge-debt" style="cursor: default;">💀 NỢ DAI VL</span>`
          : `<span class="sw-badge-paid" style="cursor: default;">✔ ĐÃ TRẢ</span>`;

        contentDiv.innerHTML = `
          <div class="view-info-item"><span class="view-info-label">- Khách hàng / Thợ:</span> <span class="view-info-val" style="color: #f59e0b; font-weight: 800; font-size: 1.05rem;">${escapeHtml(item.customer || 'Khách lẻ')}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Tên máy / Thiết bị:</span> <span class="view-info-val" style="color: #fff; font-weight: 900; font-size: 1.05rem;">${escapeHtml(item.device || '')}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Báo giá / Số tiền:</span> <span class="view-info-val" style="color: #f87171; font-weight: 900; font-size: 1.15rem;">${formatPriceStr(item.price)}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Phí dịch vụ:</span> <span class="view-info-val" style="color: #cbd5e1; font-weight: 700;">${formatPriceStr(item.cost || '0')}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Lợi nhuận (Lãi):</span> <span class="view-info-val" style="color: var(--green-badge); font-weight: 900; font-size: 1.05rem;">${formatPriceStr(item.profit)}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Thời gian:</span> <span class="view-info-val" style="color: #ec4899; font-weight: 800;">${(() => {
            const dt = formatSoftwareItemDateTime(item);
            return dt.timeStr ? `${dt.dateStr} lúc ${dt.timeStr}` : dt.dateStr;
          })()}</span></div>
          <div class="view-info-item"><span class="view-info-label">- Trạng thái TT:</span> <span class="view-info-val">${statusBadge}</span></div>
        `;
        viewModal.classList.add('active');
        viewModal.style.display = 'flex';
      } else {
        alert(`CHI TIẾT ĐƠN PHẦN MỀM:\n- Khách hàng: ${item.customer}\n- Thiết bị: ${item.device}\n- Báo giá: ${formatPriceStr(item.price)}\n- Phí dịch vụ: ${formatPriceStr(item.cost)}\n- Lãi: ${formatPriceStr(item.profit)}\n- Thời gian: ${item.dayMonth}-${item.year || '2026'} lúc ${item.time}\n- Trạng thái: ${item.paymentStatus}`);
      }
    }
    window.viewSoftwareTicket = viewSoftwareTicket;

    function cloneSoftwareTicket(id) {
      const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (!item) return;

      let cloned = JSON.parse(JSON.stringify(item));
      cloned.id = 'sw_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const now = new Date();
      cloned.time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      cloned.selected = false;

      softwareDatabase.unshift(cloned);
      saveSoftwareStorage();
      renderSoftwareTable(softwareDatabase);
      alert(`Đã nhân bản đơn phần mềm cho máy "${cloned.device}" thành công!`);
    }
    window.cloneSoftwareTicket = cloneSoftwareTicket;

    function deleteSoftwareTicket(id) {
      let confirmText = prompt("Bạn có chắc chắn muốn xóa đơn phần mềm này không?\nNhập 'yes' để xác nhận xóa:");
      if (confirmText && confirmText.trim().toLowerCase() === 'yes') {
        const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
        softwareDatabase = softwareDatabase.filter(x => String(x.id) !== String(id) && x.id != id);
        saveSoftwareStorage();
        if (typeof db !== 'undefined' && db && id) {
          db.collection('software').doc(String(id)).delete().catch(console.error);
        }
        if (item && typeof logActivity === 'function') {
          logActivity('DELETE', 'phanmem', 'Phần mềm', `Xóa đơn phần mềm: ${item.customer} - ${item.device} (Báo giá: ${item.price})`, item, null, id);
        }
        renderSwCustomerFilterOptions();
        renderSoftwareTable(softwareDatabase);
        alert("Đã xóa đơn phần mềm thành công!");
      } else if (confirmText !== null) {
        alert("Thao tác xóa bị hủy. Bạn phải nhập chính xác chữ 'yes'.");
      }
    }
    window.deleteSoftwareTicket = deleteSoftwareTicket;

    let swIsDebtViewActive = false;
    let swDebtAmountFilter = 'ALL';
    let swDebtSearchTerm = '';
    let swHideDebtColumns = false;

    function updateSoftwareProfits() {
      const now = swFilterDate || new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = String(now.getFullYear());
      const targetDayMonth = `${dd}-${mm}`;

      let dayProfit = 0;
      let monthProfit = 0;
      let dayRevenue = 0;
      let monthRevenue = 0;

      softwareDatabase.forEach(item => {
        let p = parsePriceNum(item.profit) || 0;
        let rev = parsePriceNum(item.price) || 0;
        let itemYear = item.year || '2026';
        let itemParts = (item.dayMonth || '').split('-');
        let itemMonth = itemParts.length === 2 ? itemParts[1] : '';

        // Lãi & Doanh thu ngày
        if (item.dayMonth === targetDayMonth && itemYear === yyyy) {
          dayProfit += p;
          dayRevenue += rev;
        }

        // Lãi & Doanh thu tháng
        if (itemMonth === mm && itemYear === yyyy) {
          monthProfit += p;
          monthRevenue += rev;
        }
      });

      const dayEl = document.getElementById('swDayProfitText');
      if (dayEl) dayEl.innerText = swHideProfits ? '***' : formatPriceStr(dayProfit);

      // CẬP NHẬT ICON LÃI NGÀY PHẦN MỀM: 0 - 999 MẶT KHÓC, >= 1000 MẶT CƯỜI
      const swProfitEmojiEl = document.getElementById('swProfitEmojiIcon');
      if (swProfitEmojiEl) {
        let sDayProfitVal = parsePriceNum(dayProfit);
        if (sDayProfitVal >= 1000) {
          swProfitEmojiEl.src = 'img/icon_happy.png';
          swProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(dayProfit) + ' (Đạt từ 1.000 trở lên)';
        } else {
          swProfitEmojiEl.src = 'img/icon_crying.png';
          swProfitEmojiEl.title = 'Lãi ngày: ' + formatPriceStr(dayProfit) + ' (Từ 0 - 999)';
        }
      }
      const monthEl = document.getElementById('swMonthProfitText');
      if (monthEl) monthEl.innerText = swHideProfits ? '***' : formatPriceStr(monthProfit);

      const dayRevEl = document.getElementById('swDayRevenueText');
      if (dayRevEl) dayRevEl.innerText = swHideProfits ? '***' : formatPriceStr(dayRevenue);
      const monthRevEl = document.getElementById('swMonthRevenueText');
      if (monthRevEl) monthRevEl.innerText = swHideProfits ? '***' : formatPriceStr(monthRevenue);

      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }

    const SW_QUICK_LINKS = {
      tool: 'https://quynhbupbehp.github.io/driver/',
      testpoint: 'https://quynhbupbehp2026.github.io/testpoint/',
      rom: 'https://drive.google.com/drive/u/3/my-drive'
    };

    function openSwUrl(type) {
      const url = SW_QUICK_LINKS[type];
      if (url) {
        window.open(url, '_blank');
      }
    }

    function copySwUrl(type, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      const url = SW_QUICK_LINKS[type];
      const titles = {
        tool: 'Link Tool',
        testpoint: 'Link Testpoint',
        rom: 'Link ROM'
      };
      const title = titles[type] || 'Link';
      if (url) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            alert(`📋 Đã sao chép ${title} vào bộ nhớ tạm:\n${url}`);
          }).catch(() => {
            prompt(`Nhấn Ctrl+C để sao chép ${title}:`, url);
          });
        } else {
          prompt(`Nhấn Ctrl+C để sao chép ${title}:`, url);
        }
      }
    }

    /* ============================================================
       QUẢN LÝ TÀI KHOẢN TOOL / SERVER & GHI CHÚ PHẦN MỀM
       ============================================================ */
    const DEFAULT_SW_ACCOUNTS = [
      { name: 'THUÊ UNLOCKTOOL', user: 'https://file.unlocktool.net', pass: '875' },
      { name: 'TK iCloud Đểu', user: 'quynhbupbehp2026@icloud.com', pass: 'Huyen@95' },
      { name: 'TSM + EFT + AMT + UNI', user: 'yeutoitoichokeo@gmail.com', pass: 'Quynhchi@2019' },
      { name: 'https://portal.vietnix.vn/clientarea.php', user: 'yeutoitoichokeo@gmail.com', pass: 'Quynhchi@2019' },
      { name: 'github.io 190693', user: 'quynhbupmanghp34@gmail.com', pass: 'Matkhau1234' },
      { name: 'TK GMAIL ĐỂU', user: 'quynhbupbe2027', pass: 'Quynhchi@2019' },
      { name: 'Z3X PRO BOX', user: 'zsc_LcWZ9X1r', pass: '4WTRBqAr' },
      { name: 'Samsungtool.us', user: 'quynhbupehp2019', pass: 'Quynhchi@2019' },
      { name: 'Unlock Tool - DUYQUANG', user: 'ngochoang', pass: 'duyquang91' }
    ];

    function getSwAccounts() {
      try {
        const stored = localStorage.getItem('sw_tool_accounts');
        if (!stored) {
          saveSwAccounts(DEFAULT_SW_ACCOUNTS);
          return DEFAULT_SW_ACCOUNTS;
        }
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          saveSwAccounts(DEFAULT_SW_ACCOUNTS);
          return DEFAULT_SW_ACCOUNTS;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SW_ACCOUNTS;
      }
    }

    function saveSwAccounts(list) {
      localStorage.setItem('sw_tool_accounts', JSON.stringify(list));
    }

    function openSwAccountsModal() {
      const modal = document.getElementById('swAccountsModal');
      if (modal) {
        modal.style.display = 'flex';
        renderSwAccountsList();
      }
    }

    function closeSwAccountsModal() {
      const modal = document.getElementById('swAccountsModal');
      if (modal) modal.style.display = 'none';
      cancelSwAccountForm();
    }

    function toggleSwAccountForm() {
      const form = document.getElementById('swAccountForm');
      if (!form) return;
      if (form.style.display === 'none' || !form.style.display) {
        form.style.display = 'block';
        document.getElementById('swAccEditIndex').value = '-1';
        document.getElementById('swAccFormTitle').innerText = '➕ THÊM TÀI KHOẢN MỚI';
        document.getElementById('swAccNameInput').value = '';
        document.getElementById('swAccUserInput').value = '';
        document.getElementById('swAccPassInput').value = '';
        document.getElementById('swAccNameInput').focus();
      } else {
        form.style.display = 'none';
      }
    }

    function cancelSwAccountForm() {
      const form = document.getElementById('swAccountForm');
      if (form) form.style.display = 'none';
    }

    function editSwAccount(index) {
      const list = getSwAccounts();
      const acc = list[index];
      if (!acc) return;
      const form = document.getElementById('swAccountForm');
      if (form) {
        form.style.display = 'block';
        document.getElementById('swAccEditIndex').value = index;
        document.getElementById('swAccFormTitle').innerText = `✏️ CHỈNH SỬA: ${acc.name}`;
        document.getElementById('swAccNameInput').value = acc.name || '';
        document.getElementById('swAccUserInput').value = acc.user || '';
        document.getElementById('swAccPassInput').value = acc.pass || '';
        document.getElementById('swAccNameInput').focus();
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function renderSwAccountsList() {
      const listEl = document.getElementById('swAccountsList');
      if (!listEl) return;
      const list = getSwAccounts();
      const searchInput = document.getElementById('swAccSearchInput');
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      let filtered = list;
      if (query) {
        filtered = list.filter(acc =>
          (acc.name && acc.name.toLowerCase().includes(query)) ||
          (acc.user && acc.user.toLowerCase().includes(query)) ||
          (acc.pass && acc.pass.toLowerCase().includes(query))
        );
      }

      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 3rem 0; font-size: 0.95rem;">Không tìm thấy tài khoản nào phù hợp</div>`;
        return;
      }

      listEl.innerHTML = filtered.map((acc) => {
        const realIndex = list.indexOf(acc);
        return `
          <div class="sw-acc-card">
            <!-- HÀNG 1: TIÊU ĐỀ + ACTIONS -->
            <div class="sw-acc-section">
              <div class="sw-acc-meta">
                <div class="sw-acc-label sw-label-green">TIÊU ĐỀ</div>
                <div class="sw-acc-title" title="${escapeHtml(acc.name)}">${escapeHtml(acc.name)}</div>
              </div>
              <div class="sw-acc-actions">
                <button type="button" class="sw-acc-icon-btn" onclick="copyFullSwAccount(${realIndex})" title="Sao chép toàn bộ thông tin">
                  <svg viewBox="0 0 24 24" class="sw-acc-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button type="button" class="sw-acc-icon-btn" onclick="editSwAccount(${realIndex})" title="Chỉnh sửa tài khoản">
                  <svg viewBox="0 0 24 24" class="sw-acc-svg"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="sw-acc-icon-btn sw-btn-del" onclick="deleteSwAccount(${realIndex})" title="Xóa tài khoản">
                  <svg viewBox="0 0 24 24" class="sw-acc-svg"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>

            <div class="sw-acc-divider"></div>

            <!-- HÀNG 2: TÀI KHOẢN -->
            <div class="sw-acc-section">
              <div class="sw-acc-meta">
                <div class="sw-acc-label">TÀI KHOẢN</div>
                <div class="sw-acc-val" title="${escapeHtml(acc.user)}">${escapeHtml(acc.user)}</div>
              </div>
              <div class="sw-acc-actions">
                <button type="button" class="sw-acc-icon-btn" onclick="copyText('${escapeHtml(acc.user)}', 'Tài khoản')" title="Sao chép tài khoản">
                  <svg viewBox="0 0 24 24" class="sw-acc-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>

            <div class="sw-acc-divider"></div>

            <!-- HÀNG 3: MẬT KHẨU -->
            <div class="sw-acc-section">
              <div class="sw-acc-meta">
                <div class="sw-acc-label">MẬT KHẨU</div>
                <div class="sw-acc-val" title="${escapeHtml(acc.pass)}">${escapeHtml(acc.pass)}</div>
              </div>
              <div class="sw-acc-actions">
                <button type="button" class="sw-acc-icon-btn" onclick="copyText('${escapeHtml(acc.pass)}', 'Mật khẩu')" title="Sao chép mật khẩu">
                  <svg viewBox="0 0 24 24" class="sw-acc-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function showSwToast(msg) {
      showToast(msg, 2000);
    }

    function copyText(text, label) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showSwToast(`Đã sao chép ${label}!`);
        }).catch(() => {
          prompt(`Sao chép ${label}:`, text);
        });
      } else {
        prompt(`Sao chép ${label}:`, text);
      }
    }

    function copyFullSwAccount(index) {
      const list = getSwAccounts();
      const acc = list[index];
      if (!acc) return;
      const full = `Tiêu đề: ${acc.name}\nTài khoản: ${acc.user}\nMật khẩu: ${acc.pass}`;
      copyText(full, 'toàn bộ thông tin tài khoản');
    }

    function handleSaveSwAccount(e) {
      e.preventDefault();
      const name = document.getElementById('swAccNameInput').value.trim();
      const user = document.getElementById('swAccUserInput').value.trim();
      const pass = document.getElementById('swAccPassInput').value.trim();
      const editIndex = parseInt(document.getElementById('swAccEditIndex').value, 10);
      if (!name || !user || !pass) return;

      const list = getSwAccounts();
      if (editIndex >= 0 && editIndex < list.length) {
        list[editIndex] = { ...list[editIndex], name, user, pass, updatedAt: Date.now() };
        showSwToast('Đã cập nhật tài khoản!');
      } else {
        list.unshift({ name, user, pass, createdAt: Date.now() });
        showSwToast('Đã thêm tài khoản mới!');
      }
      saveSwAccounts(list);
      cancelSwAccountForm();
      renderSwAccountsList();
    }

    function deleteSwAccount(index) {
      const list = getSwAccounts();
      const acc = list[index];
      const name = acc ? acc.name : 'tài khoản này';
      if (confirm(`Bạn có chắc chắn muốn xóa "${name}" không?`)) {
        list.splice(index, 1);
        saveSwAccounts(list);
        renderSwAccountsList();
        showSwToast(`Đã xóa "${name}"!`);
      }
    }

    /* =========================================================
       QUẢN LÝ LINK WEB PHẦN MỀM (CHUẨN Y CHANG 100% ẢNH MẪU)
       ========================================================= */
    let currentSwLinkId = null;

    // Danh sách 12 link mẫu ban đầu chuẩn y chang 100% ảnh người dùng gửi
    const DEFAULT_SW_WEB_LINKS = [
      { id: 1, title: 'Boot Máy Chân Sạc Kém', content: 'https://www.youtube.com/shorts/4cTo9syjpmU' },
      { id: 2, title: 'Hóa Đơn', content: 'https://drive.google.com/drive/folders/1Z2AphM5VD2uVF2FZOcei_AZMWS94Sk-a?usp=drive_link' },
      { id: 3, title: 'Giá Nhập Linh Kiện', content: 'https://drive.google.com/drive/folders/1ESwRqBJIQYZJyN9M1WpF1QM_yaegLZu9?usp=drive_link' },
      { id: 4, title: 'Chỉnh sửa ảnh', content: 'https://docs.google.com/document/d/15sKt2icIBsO2A3dtStVNHeHRPOcM6n0MXNzJVEdKhik/edit?usp=drive_link' },
      { id: 5, title: 'Fix 2 sim dùng 4g', content: 'https://www.facebook.com/share/v/1DRSg6JZR6/?' },
      { id: 6, title: 'Báo Giá Android', content: 'https://byvn.net/ArKp' },
      { id: 7, title: 'Báo Giá iPhone', content: 'https://byvn.net/lO9c' },
      { id: 8, title: 'Tải Tool Mobile', content: 'https://app.mediafire.com/folder/ounjl1vy9e6v6' },
      { id: 9, title: 'quynhbupbe', content: 'https://quynhbupbehp2026.github.io/' },
      { id: 10, title: 'Check TK Xiaomi', content: 'https://i.mi.com/find/device/activation/lockStatus' },
      { id: 11, title: 'Check iCloud = IMEI (Link 2)', content: 'https://iunlocker.com/check_imei.php' },
      { id: 12, title: 'Check iCloud = IMEI (Link 1)', content: 'https://sickw.com/' }
    ];

    function getSwNotesList() {
      try {
        let raw = localStorage.getItem('sw_web_links_v1');
        if (!raw) {
          // Kiểm tra bản ghi cũ sw_notes_v2 nếu có để chuyển dữ liệu
          raw = localStorage.getItem('sw_notes_v2');
        }
        if (raw) {
          let parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}

      // Mặc định lưu bộ link mẫu y chang ảnh
      try {
        localStorage.setItem('sw_web_links_v1', JSON.stringify(DEFAULT_SW_WEB_LINKS));
      } catch (e) {}
      return [...DEFAULT_SW_WEB_LINKS];
    }

    function saveSwNotesList(list) {
      try {
        localStorage.setItem('sw_web_links_v1', JSON.stringify(list));
        localStorage.setItem('sw_notes_v2', JSON.stringify(list));
      } catch (e) {}
    }

    function openSwNotesModal() {
      const modal = document.getElementById('swNotesModal');
      if (!modal) return;
      resetSwNoteForm();
      const form = document.getElementById('swLinkForm');
      if (form) form.style.display = 'none';
      const searchInput = document.getElementById('swLinkSearchInput');
      if (searchInput) searchInput.value = '';
      renderSwNotesList();
      modal.style.display = 'flex';
    }
    window.openSwNotesModal = openSwNotesModal;
    window.openSwLinksModal = openSwNotesModal;

    function closeSwNotesModal() {
      const modal = document.getElementById('swNotesModal');
      if (modal) modal.style.display = 'none';
      resetSwNoteForm();
      const form = document.getElementById('swLinkForm');
      if (form) form.style.display = 'none';
    }
    window.closeSwNotesModal = closeSwNotesModal;

    function toggleSwLinkForm() {
      const form = document.getElementById('swLinkForm');
      if (!form) return;
      if (form.style.display === 'none' || !form.style.display) {
        resetSwNoteForm();
        form.style.display = 'block';
        const titleInput = document.getElementById('swNoteTitleInput');
        if (titleInput) titleInput.focus();
      } else {
        form.style.display = 'none';
        resetSwNoteForm();
      }
    }
    window.toggleSwLinkForm = toggleSwLinkForm;

    function resetSwNoteForm() {
      currentSwLinkId = null;
      const titleInput = document.getElementById('swNoteTitleInput');
      const contentInput = document.getElementById('swNotesContent');
      const btnSave = document.getElementById('btnSaveSwNote');
      const btnCancel = document.getElementById('btnCancelEditSwNote');
      const formTitle = document.getElementById('swLinkFormTitle');

      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
      if (btnSave) btnSave.innerHTML = '💾 LƯU';
      if (btnCancel) btnCancel.style.display = 'none';
      if (formTitle) formTitle.innerText = '➕ THÊM LIÊN KẾT WEB MỚI';
    }
    window.resetSwNoteForm = resetSwNoteForm;

    function handleSaveSwNoteSubmit(event) {
      if (event) event.preventDefault();
      const titleInput = document.getElementById('swNoteTitleInput');
      const contentInput = document.getElementById('swNotesContent');

      const titleVal = titleInput ? titleInput.value.trim() : '';
      let contentVal = contentInput ? contentInput.value.trim() : '';

      if (!titleVal) {
        alert('Vui lòng nhập TIÊU ĐỀ liên kết web!');
        if (titleInput) titleInput.focus();
        return;
      }
      if (!contentVal) {
        alert('Vui lòng nhập LINK WEB!');
        if (contentInput) contentInput.focus();
        return;
      }

      // Đảm bảo có giao thức http/https nếu người dùng gõ link dạng domain
      if (!/^https?:\/\//i.test(contentVal) && !contentVal.startsWith('/') && !contentVal.startsWith('#')) {
        contentVal = 'https://' + contentVal;
      }

      let list = getSwNotesList();

      if (currentSwLinkId) {
        let target = list.find(n => n.id === currentSwLinkId);
        if (target) {
          target.title = titleVal;
          target.content = contentVal;
        }
        showSwToast('Đã cập nhật link web thành công!');
      } else {
        const newLink = {
          id: Date.now(),
          title: titleVal,
          content: contentVal
        };
        list.unshift(newLink);
        showSwToast('Đã thêm link web mới thành công!');
      }

      saveSwNotesList(list);
      renderSwNotesList();
      resetSwNoteForm();

      const form = document.getElementById('swLinkForm');
      if (form) form.style.display = 'none';
    }
    window.handleSaveSwNoteSubmit = handleSaveSwNoteSubmit;

    function renderSwNotesList() {
      const container = document.getElementById('swNotesList');
      if (!container) return;

      const searchInput = document.getElementById('swLinkSearchInput');
      const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';

      let list = getSwNotesList();
      if (keyword) {
        list = list.filter(item => {
          const t = (item.title || '').toLowerCase();
          const c = (item.content || '').toLowerCase();
          return t.includes(keyword) || c.includes(keyword);
        });
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: #64748b; font-weight: 700; font-size: 0.95rem;">
            ${keyword ? 'Không tìm thấy liên kết phù hợp với từ khóa.' : 'Chưa có liên kết web nào. Bấm nút "+ Thêm" để tạo mới!'}
          </div>
        `;
        return;
      }

      // Icon Mở ngoài tab mới SVG
      const openSvg = `<svg viewBox="0 0 24 24" class="sw-link-svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
      // Icon Copy link SVG (2 ô chữ nhật chồng lên nhau)
      const copySvg = `<svg viewBox="0 0 24 24" class="sw-link-svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      // Icon Edit bút chì SVG
      const editSvg = `<svg viewBox="0 0 24 24" class="sw-link-svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
      // Icon Delete thùng rác SVG
      const delSvg = `<svg viewBox="0 0 24 24" class="sw-link-svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

      container.innerHTML = list.map(item => {
        const title = item.title || 'Không có tiêu đề';
        const url = item.content || '';

        return `
          <div class="sw-link-card">
            <!-- THẺ CHUẨN MẪU: TIÊU ĐỀ + 4 NÚT HÀNH ĐỘNG (MỞ TAB, COPY LINK, SỬA, XÓA) -->
            <div class="sw-link-section">
              <div class="sw-link-meta">
                <div class="sw-link-title" onclick="openSwUrl('${escapeHtml(url)}')" title="${escapeHtml(title)} - Bấm để mở link">
                  ${escapeHtml(title)}
                </div>
              </div>
              <div class="sw-link-actions">
                <button type="button" class="sw-link-icon-btn" onclick="copySingleSwNote('${item.id}')" title="Sao chép link web">
                  ${copySvg}
                </button>
                <button type="button" class="sw-link-icon-btn sw-btn-edit" onclick="editSwNote('${item.id}')" title="Sửa (Xem và đổi link web)">
                  ${editSvg}
                </button>
                <button type="button" class="sw-link-icon-btn sw-btn-del" onclick="deleteSwNote('${item.id}', event)" title="Xóa liên kết">
                  ${delSvg}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
    window.renderSwNotesList = renderSwNotesList;

    function copySwLinkTitle(id) {
      const list = getSwNotesList();
      const target = list.find(n => String(n.id) === String(id));
      if (!target || !target.title) return;
      copyText(target.title, `tiêu đề "${target.title}"`);
    }
    window.copySwLinkTitle = copySwLinkTitle;

    function copySingleSwNote(id) {
      const list = getSwNotesList();
      const target = list.find(n => String(n.id) === String(id));
      if (!target || !target.content) return;
      copyText(target.content, 'link web');
    }
    window.copySingleSwNote = copySingleSwNote;

    function openSwUrl(url) {
      if (!url) return;
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }
    window.openSwUrl = openSwUrl;

    function editSwNote(id) {
      const list = getSwNotesList();
      const target = list.find(n => String(n.id) === String(id));
      if (!target) return;

      currentSwLinkId = target.id;
      const form = document.getElementById('swLinkForm');
      const formTitle = document.getElementById('swLinkFormTitle');
      const titleInput = document.getElementById('swNoteTitleInput');
      const contentInput = document.getElementById('swNotesContent');
      const btnSave = document.getElementById('btnSaveSwNote');
      const btnCancel = document.getElementById('btnCancelEditSwNote');

      if (form) form.style.display = 'block';
      if (formTitle) formTitle.innerText = `✏️ CHỈNH SỬA: ${target.title}`;
      if (titleInput) {
        titleInput.value = target.title || '';
        titleInput.focus();
      }
      if (contentInput) {
        contentInput.value = target.content || '';
      }
      if (btnSave) btnSave.innerHTML = '💾 CẬP NHẬT';
      if (btnCancel) btnCancel.style.display = 'inline-flex';
    }
    window.editSwNote = editSwNote;

    function deleteSwNote(id, event) {
      if (event) event.stopPropagation();
      let list = getSwNotesList();
      const target = list.find(n => String(n.id) === String(id));
      if (!target) return;

      if (!confirm(`Bạn có chắc muốn xóa liên kết "${target.title || target.content}"?`)) return;

      list = list.filter(n => String(n.id) !== String(id));
      saveSwNotesList(list);

      if (String(currentSwLinkId) === String(id)) {
        resetSwNoteForm();
        const form = document.getElementById('swLinkForm');
        if (form) form.style.display = 'none';
      }
      renderSwNotesList();
      showSwToast(`Đã xóa liên kết "${target.title}"!`);
    }
    window.deleteSwNote = deleteSwNote;

    function switchSoftwareView(view) {
      if (view === 'list') {
        if (swIsDebtViewActive) {
          toggleSoftwareDebtView();
        }
      } else if (view === 'debt') {
        if (!swIsDebtViewActive) {
          toggleSoftwareDebtView();
        }
      }
    }

    function toggleSoftwareDebtView() {
      swIsDebtViewActive = !swIsDebtViewActive;
      const listView = document.getElementById('swListView');
      const debtView = document.getElementById('swDebtView');
      const btnCongNo = document.getElementById('swBtnCongNo');
      const titleBar = document.getElementById('swMainTitleBar');

      if (swIsDebtViewActive) {
        if (listView) listView.style.display = 'none';
        if (debtView) debtView.style.display = 'block';
        if (btnCongNo) {
          btnCongNo.classList.add('active');
          btnCongNo.innerText = 'PHẦN MỀM';
          btnCongNo.title = 'Bấm vào để quay lại tab danh sách phần mềm';
        }
        if (titleBar) {
          titleBar.classList.remove('active');
        }
        renderSoftwareDebtTable();
      } else {
        if (listView) listView.style.display = 'block';
        if (debtView) debtView.style.display = 'none';
        if (btnCongNo) {
          btnCongNo.classList.remove('active');
          btnCongNo.innerText = 'CÔNG NỢ';
          btnCongNo.title = 'Xem sổ công nợ phần mềm';
        }
        if (titleBar) {
          titleBar.classList.add('active');
        }
        renderSoftwareTable(softwareDatabase);
      }
    }

    function toggleHideSoftwareDebtColumns() {
      swHideDebtColumns = !swHideDebtColumns;
      alert(swHideDebtColumns ? 'Đã thu gọn cột' : 'Đã hiện đầy đủ cột');
    }

    let currentViewingDebtCustomer = '';

    function renderSoftwareDebtTable() {
      const grid = document.getElementById('swDebtCustomerGrid');
      if (!grid) return;

      const amtFilterEl = document.getElementById('swDebtAmountFilter');
      let rangeVal = amtFilterEl ? amtFilterEl.value : 'ALL';
      const searchEl = document.getElementById('swDebtSearchInput');
      let searchVal = searchEl ? (searchEl.value || '').trim().toLowerCase() : '';

      // Lấy toàn bộ đơn nợ phần mềm
      let debtList = softwareDatabase.filter(s => isSoftwareDebt(s));

      // Nhóm theo tên khách hàng
      let customerGroups = {};
      debtList.forEach(item => {
        let cust = (item.customer || 'Khách lẻ').trim();
        if (!customerGroups[cust]) {
          customerGroups[cust] = {
            customer: cust,
            items: [],
            totalAmount: 0
          };
        }
        let price = parsePriceNum(item.price) || 0;
        customerGroups[cust].items.push(item);
        customerGroups[cust].totalAmount += price;
      });

      let customerList = Object.values(customerGroups);

      // Lọc theo tìm kiếm
      if (searchVal) {
        customerList = customerList.filter(grp => {
          let custMatch = grp.customer.toLowerCase().includes(searchVal);
          let devMatch = grp.items.some(it => (it.device || '').toLowerCase().includes(searchVal));
          return custMatch || devMatch;
        });
      }

      // Lọc theo mức nợ
      if (rangeVal && rangeVal !== 'ALL') {
        customerList = customerList.filter(grp => checkDebtAmountMatch(grp.totalAmount, rangeVal));
      }

      // Thống kê góc trên bên phải
      let grandTotal = customerList.reduce((sum, grp) => sum + grp.totalAmount, 0);
      let totalTickets = customerList.reduce((sum, grp) => sum + grp.items.length, 0);

      const countEl = document.getElementById('swDebtCountVal');
      if (countEl) countEl.innerText = `${customerList.length} khách (${totalTickets} đơn)`;
      const totalEl = document.getElementById('swDebtTotalAmountVal');
      if (totalEl) totalEl.innerText = formatPriceStr(grandTotal);

      // Dọn dẹp khách hàng không còn nợ ra khỏi danh sách đã chọn
      let validCustNames = new Set(customerList.map(g => g.customer.trim().toLowerCase()));
      for (let c of selectedSoftwareDebtCustomers) {
        if (!validCustNames.has(c.toLowerCase())) selectedSoftwareDebtCustomers.delete(c);
      }
      updateSoftwareBatchPayButton();

      if (customerList.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; color: #94a3b8; font-weight: 700; font-size: 1rem;">Không có khách hàng nào đang nợ phần mềm phù hợp.</div>`;
        return;
      }

      grid.innerHTML = customerList.map(grp => {
        let isSelected = selectedSoftwareDebtCustomers.has(grp.customer);
        return `
          <div class="sw-debt-card ${isSelected ? 'selected' : ''}" data-customer="${escapeHtml(grp.customer)}" onclick="openCustomerDebtDetailsModal(this.getAttribute('data-customer'))" title="Bấm để xem chi tiết nợ của ${escapeHtml(grp.customer)}">
            <!-- BÊN TRÁI: Ô TÍCH (BÊN TRÁI) + TÊN KHÁCH (TRÊN) & ĐƠN NỢ (DƯỚI) -->
            <div class="sw-debt-card-left">
              <div class="sw-debt-card-name-row">
                <input type="checkbox" class="sw-debt-card-chk" data-customer="${escapeHtml(grp.customer)}" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation()" onchange="toggleSelectCustomerCard(this, this.getAttribute('data-customer'))" title="Tích chọn để thanh toán nợ của ${escapeHtml(grp.customer)}">
                <span class="sw-debt-card-name" title="${escapeHtml(grp.customer)}">${swHideProfits ? '**********' : escapeHtml(grp.customer)}</span>
              </div>
              <div class="sw-debt-card-count">${grp.items.length} đơn nợ</div>
            </div>

            <!-- BÊN PHẢI: SỐ TIỀN CẦN THANH TOÁN TO, MÀU TRẮNG -->
            <div class="sw-debt-card-amount">
              ${swHideProfits ? '***' : formatPriceStr(grp.totalAmount)}
            </div>
          </div>
        `;
      }).join('');
    }

    let selectedSoftwareDebtCustomers = new Set();

    function toggleSelectCustomerCard(chk, custName) {
      if (!custName) return;
      if (chk.checked) {
        selectedSoftwareDebtCustomers.add(custName);
      } else {
        selectedSoftwareDebtCustomers.delete(custName);
      }
      const card = chk.closest('.sw-debt-card');
      if (card) {
        if (chk.checked) card.classList.add('selected');
        else card.classList.remove('selected');
      }
      updateSoftwareBatchPayButton();
    }

    function updateSoftwareBatchPayButton() {
      const btn = document.getElementById('btnBatchPaySwDebt');
      if (!btn) return;

      let selectedDebts = softwareDatabase.filter(s => isSoftwareDebt(s) && selectedSoftwareDebtCustomers.has((s.customer || 'Khách lẻ').trim()));

      if (selectedSoftwareDebtCustomers.size > 0 && selectedDebts.length > 0) {
        let sum = selectedDebts.reduce((acc, it) => acc + (parsePriceNum(it.price) || 0), 0);
        btn.style.display = 'inline-flex';
        btn.innerHTML = `<span>💰 THANH TOÁN (${selectedSoftwareDebtCustomers.size} Khách · ${selectedDebts.length} Đơn) - Tổng: </span><span class="batch-pay-total-val">${formatPriceStr(sum)}</span>`;
      } else {
        btn.style.display = 'none';
      }
    }

    function openCustomerDebtDetailsModal(customerName) {
      if (!customerName) return;
      currentViewingDebtCustomer = customerName;
      const modal = document.getElementById('swCustomerDebtModal');
      const nameEl = document.getElementById('swDebtModalCustomerName');
      const countEl = document.getElementById('swDebtModalCustomerCount');
      const totalValEl = document.getElementById('swDebtModalCustomerTotalVal');
      const tbody = document.getElementById('swCustomerDebtModalTbody');
      if (!modal || !tbody) return;

      let debts = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === customerName.trim().toLowerCase());
      let total = debts.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);

      if (nameEl) nameEl.innerText = customerName;
      if (countEl) countEl.innerText = `(${debts.length} đơn nợ)`;
      if (totalValEl) totalValEl.innerText = formatPriceStr(total);

      if (debts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Khách hàng này hiện đã thanh toán hết nợ.</td></tr>`;
      } else {
        tbody.innerHTML = debts.map(item => `
          <tr>
            <td style="text-align: center; vertical-align: middle; width: 44px;">
              <input type="checkbox" class="sw-modal-debt-chk" data-id="${item.id}" onchange="updateCustomerDebtModalPayButton()" title="Tích chọn đơn này" style="width: 18px; height: 18px; accent-color: #10b981; cursor: pointer;">
            </td>
            <td style="font-weight: 900; color: #ffffff; vertical-align: middle;">${escapeHtml(item.device || 'Phần mềm')}</td>
            <td style="text-align: right; vertical-align: middle; color: #facc15; font-weight: 900; font-size: 1.05rem;">${formatPriceStr(item.price)}</td>
            <td style="text-align: center; vertical-align: middle; color: #94a3b8;">${item.dayMonth}-${item.year || '2026'}</td>
          </tr>
        `).join('');
      }

      updateCustomerDebtModalPayButton();
      modal.style.display = 'flex';
      modal.classList.add('active');
    }

    function toggleSelectAllModalDebts(masterCb) {
      const checked = masterCb.checked;
      const chks = document.querySelectorAll('.sw-modal-debt-chk');
      chks.forEach(c => c.checked = checked);
      updateCustomerDebtModalPayButton();
    }

    function toggleSelectAllModalDebtsBtn() {
      const masterChk = document.getElementById('swModalCheckAll');
      const allChks = Array.from(document.querySelectorAll('.sw-modal-debt-chk'));
      if (allChks.length === 0) return;
      const anyUnchecked = allChks.some(c => !c.checked);
      allChks.forEach(c => c.checked = anyUnchecked);
      if (masterChk) masterChk.checked = anyUnchecked;
      updateCustomerDebtModalPayButton();
    }

    function updateCustomerDebtModalPayButton() {
      const chks = Array.from(document.querySelectorAll('.sw-modal-debt-chk:checked'));
      const allChks = Array.from(document.querySelectorAll('.sw-modal-debt-chk'));
      const btn = document.getElementById('btnPayAllCustomerDebts');
      const masterChk = document.getElementById('swModalCheckAll');
      const selectAllBtn = document.getElementById('btnToggleSelectAllModalDebts');

      if (masterChk && allChks.length > 0) {
        masterChk.checked = (chks.length === allChks.length);
      }
      if (selectAllBtn) {
        selectAllBtn.innerHTML = (allChks.length > 0 && chks.length === allChks.length) ? '✕ Bỏ chọn tất cả' : '✓ Chọn tất cả';
      }

      if (!btn) return;

      if (chks.length > 0) {
        let checkedIds = new Set(chks.map(c => String(c.dataset.id)));
        let checkedDebts = softwareDatabase.filter(s => checkedIds.has(String(s.id)));
        let checkedSum = checkedDebts.reduce((sum, it) => sum + (parsePriceNum(it.price) || 0), 0);
        btn.innerHTML = `💰 Thanh toán các đơn đã chọn (${chks.length} đơn - ${formatPriceStr(checkedSum)})`;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 0 16px rgba(16, 185, 129, 0.75)';
        btn.style.animation = 'pulseGreenGlow 2s infinite';
      } else {
        btn.innerHTML = `💰 Tích chọn đơn để thanh toán`;
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
        btn.style.animation = 'none';
      }
    }

    function closeCustomerDebtDetailsModal() {
      const modal = document.getElementById('swCustomerDebtModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    function paySingleCustomerDebtItem(id) {
      const item = softwareDatabase.find(x => x.id === id);
      if (item) {
        if (confirm(`Xác nhận thanh toán nợ máy "${item.device}" cho khách "${item.customer}" - Số tiền: ${formatPriceStr(item.price)}?`)) {
          item.paymentStatus = 'ĐÃ TRẢ';
          saveSoftwareStorage(item);
          renderSoftwareDebtTable();
          renderSoftwareTable(softwareDatabase);
          if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
          if (typeof updateSoftwareProfits === 'function') updateSoftwareProfits();
          if (typeof updateSoftwarePayButtonVisibility === 'function') updateSoftwarePayButtonVisibility();

          if (currentViewingDebtCustomer) {
            let remain = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === currentViewingDebtCustomer.trim().toLowerCase());
            if (remain.length === 0) {
              closeCustomerDebtDetailsModal();
            } else {
              openCustomerDebtDetailsModal(currentViewingDebtCustomer);
            }
          }
        }
      }
    }

    function payAllDebtsOfCurrentCustomer() {
      if (!currentViewingDebtCustomer) return;
      const chks = Array.from(document.querySelectorAll('.sw-modal-debt-chk:checked'));
      let debtsToPay = [];

      if (chks.length > 0) {
        let checkedIds = new Set(chks.map(c => String(c.dataset.id)));
        debtsToPay = softwareDatabase.filter(s => checkedIds.has(String(s.id)));
      } else {
        debtsToPay = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === currentViewingDebtCustomer.trim().toLowerCase());
      }
      if (debtsToPay.length === 0) return;

      let total = debtsToPay.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);
      if (confirm(`Bạn có chắc chắn muốn thanh toán ${debtsToPay.length} đơn nợ của "${currentViewingDebtCustomer}"?\n- Tổng số đơn: ${debtsToPay.length}\n- Tổng tiền: ${formatPriceStr(total)}`)) {
        debtsToPay.forEach(d => {
          d.paymentStatus = 'ĐÃ TRẢ';
          d.selected = false;
        });
        saveSoftwareStorage(debtsToPay);
        let remain = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === currentViewingDebtCustomer.trim().toLowerCase());
        if (remain.length === 0) {
          closeCustomerDebtDetailsModal();
        } else {
          openCustomerDebtDetailsModal(currentViewingDebtCustomer);
        }
        renderSoftwareDebtTable();
        renderSoftwareTable(softwareDatabase);
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
        if (typeof updateSoftwareProfits === 'function') updateSoftwareProfits();
      }
    }

    /* ============================================================
       TẠO ẢNH ĐỐI SOÁT CÔNG NỢ CHI TIẾT & SAO CHÉP / TẢI ẢNH CHO KHÁCH HÀNG
       - Hỗ trợ hiển thị 1 cột (<= 25 đơn) hoặc 2 cột song song (> 25 đơn)
       - Xuất 1 ảnh duy nhất siêu nét (HD 2x DPR)
       - Nút 1-click sao chép ảnh vào Clipboard: dán Ctrl + V gửi ngay qua Zalo/Messenger
       ============================================================ */
    async function createCustomerDebtCanvas(customerName) {
      if (!customerName) return null;
      const debts = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === customerName.trim().toLowerCase());
      if (debts.length === 0) return null;

      const totalVal = debts.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);
      const isTwoCol = debts.length > 25;
      const count = debts.length;

      const W = isTwoCol ? 1000 : 660;
      const headerH = 210;
      const footerH = 100;
      const rowH = 34;
      const rowsPerCol = isTwoCol ? Math.ceil(count / 2) : count;
      const tableH = (rowsPerCol + 1) * rowH; // +1 cho header dòng bảng
      const H = headerH + tableH + footerH;

      const canvas = document.createElement('canvas');
      const dpr = 2; // Độ nét gấp đôi (2x Retina)
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      // 1. NỀN TOÀN BỘ ẢNH (GRADIENT DARK KIM CHI MOBILE)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#0b1120');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // VIỀN KHUNG NGOÀI SANG TRỌNG
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(12, 12, W - 24, H - 24);

      // DẢI MÀU VÀNG KIM TRÊN ĐỈNH
      const goldGrad = ctx.createLinearGradient(12, 12, W - 12, 12);
      goldGrad.addColorStop(0, '#f59e0b');
      goldGrad.addColorStop(0.5, '#fde047');
      goldGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(12, 12, W - 24, 5);

      // 2. HEADER: TIÊU ĐỀ THƯƠNG HIỆU
      ctx.textAlign = 'center';
      ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.fillText('KIM CHI MOBILE', W / 2, 46);

      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.letterSpacing = '1px';
      ctx.fillText('BẢNG ĐỐI SOÁT CÔNG NỢ CHI TIẾT', W / 2, 68);

      // 3. CARD THÔNG TIN KHÁCH HÀNG & TỔNG NỢ
      const cardX = 26;
      const cardY = 84;
      const cardW = W - 52;
      const cardH = 105;

      // Nền card
      ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Thông tin bên trái
      ctx.textAlign = 'left';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('KHÁCH HÀNG:', cardX + 18, cardY + 28);

      ctx.font = '900 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#fde047';
      const maxCustW = isTwoCol ? 420 : 250;
      let displayCust = customerName.toUpperCase();
      if (ctx.measureText(displayCust).width > maxCustW) {
        displayCust = displayCust.slice(0, 24) + '...';
      }
      ctx.fillText(displayCust, cardX + 18, cardY + 54);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Thời gian: ${timeStr}  ·  Tổng cộng: ${count} đơn nợ`, cardX + 18, cardY + 82);

      // Thông tin bên phải: TỔNG NỢ
      ctx.textAlign = 'right';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.fillText('TỔNG TIỀN NỢ PHẢI THANH TOÁN', cardX + cardW - 18, cardY + 28);

      ctx.font = '900 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(formatPriceStr(totalVal), cardX + cardW - 18, cardY + 62);

      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`(Tương đương: ${formatPriceStr(totalVal)}.000 đ)`, cardX + cardW - 18, cardY + 84);

      // 4. HÀM VẼ BẢNG CÔNG NỢ CON
      function renderDebtSubTable(items, startIdx, tX, tY, tW) {
        const colSTT_W = 40;
        const colDate_W = 95;
        const colPrice_W = 95;
        const colName_W = tW - colSTT_W - colDate_W - colPrice_W;

        // Header dòng bảng
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(tX, tY, tW, rowH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tX, tY, tW, rowH);

        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('STT', tX + colSTT_W / 2, tY + 21);

        ctx.textAlign = 'left';
        ctx.fillText('TÊN MÁY / DỊCH VỤ', tX + colSTT_W + 10, tY + 21);

        ctx.textAlign = 'center';
        ctx.fillText('NGÀY NỢ', tX + colSTT_W + colName_W + colDate_W / 2, tY + 21);

        ctx.textAlign = 'right';
        ctx.fillText('SỐ TIỀN', tX + tW - 12, tY + 21);

        // Các dòng dữ liệu
        items.forEach((item, idx) => {
          const currY = tY + (idx + 1) * rowH;
          // Nền xen kẽ
          ctx.fillStyle = (idx % 2 === 0) ? '#0f172a' : '#141e30';
          ctx.fillRect(tX, currY, tW, rowH);

          // Viền đáy mờ
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.moveTo(tX, currY + rowH);
          ctx.lineTo(tX + tW, currY + rowH);
          ctx.stroke();

          // STT
          ctx.textAlign = 'center';
          ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText(String(startIdx + idx + 1), tX + colSTT_W / 2, currY + 22);

          // Tên máy
          ctx.textAlign = 'left';
          ctx.font = '900 12.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#ffffff';
          let devName = item.device || 'Phần mềm';
          if (ctx.measureText(devName).width > colName_W - 14) {
            while (devName.length > 3 && ctx.measureText(devName + '...').width > colName_W - 14) {
              devName = devName.slice(0, -1);
            }
            devName += '...';
          }
          ctx.fillText(devName, tX + colSTT_W + 10, currY + 22);

          // Ngày nợ
          ctx.textAlign = 'center';
          ctx.font = '500 11.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#94a3b8';
          const dateStr = `${item.dayMonth || ''}-${item.year || '2026'}`;
          ctx.fillText(dateStr, tX + colSTT_W + colName_W + colDate_W / 2, currY + 22);

          // Số tiền
          ctx.textAlign = 'right';
          ctx.font = '900 13.5px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.fillText(formatPriceStr(item.price), tX + tW - 12, currY + 22);
        });

        // Viền quanh bảng con
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(tX, tY, tW, (items.length + 1) * rowH);
      }

      // 5. VẼ BẢNG: 1 CỘT HOẶC 2 CỘT
      const tableStartY = 205;
      if (!isTwoCol) {
        // 1 CỘT (<= 25 đơn)
        const tX = cardX;
        const tW = cardW;
        renderDebtSubTable(debts, 0, tX, tableStartY, tW);
      } else {
        // 2 CỘT (> 25 đơn nợ như Kỳ Hường 67 đơn)
        const half = Math.ceil(debts.length / 2);
        const col1Items = debts.slice(0, half);
        const col2Items = debts.slice(half);
        const gap = 18;
        const subW = (cardW - gap) / 2;

        renderDebtSubTable(col1Items, 0, cardX, tableStartY, subW);
        renderDebtSubTable(col2Items, half, cardX + subW + gap, tableStartY, subW);
      }

      // 6. FOOTER: LỜI CẢM ƠN & NHẮC NHỞ
      const footY = tableStartY + tableH + 28;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX, footY);
      ctx.lineTo(cardX + cardW, footY);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'italic 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Quý khách vui lòng kiểm tra lại bảng đối soát. Nếu có sai sót xin phản hồi để đối chiếu.', W / 2, footY + 25);

      ctx.font = '900 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('KIM CHI MOBILE XIN CHÂN THÀNH CẢM ƠN QUÝ KHÁCH!', W / 2, footY + 48);

      return canvas;
    }

    
            /* ============================================================
       TẠO & SAO CHÉP LINK XEM CÔNG NỢ TRỰC TIẾP CHO KHÁCH HÀNG (REAL-TIME LIVE LINK)
       - Mã hóa URL-Safe Base64 trực tiếp tên khách (kèm tiền tố kcm_)
       - Mở được 100% không phụ thuộc Firestore debt_shares
       - Đảm bảo an toàn, bảo mật, khách mở là xem ngay lập tức
       ============================================================ */
    async function copyCustomerDebtLiveLink() {
      const customerName = currentViewingDebtCustomer;
      if (!customerName) {
        showToast("Vui lòng mở danh sách nợ của khách hàng để lấy link!");
        return;
      }

      const btn = document.getElementById('btnCopyCustomerDebtLink');
      const originalText = btn ? btn.innerHTML : '🔗 COPY LINK THEO DÕI';
      if (btn) {
        btn.innerHTML = '⏳ Đang tạo link...';
        btn.style.opacity = '0.7';
      }

      try {
        // Tạo token an toàn bằng mã hóa UTF-8 sang Base64 URL-safe
        let token = '';
        try {
          const bytes = new TextEncoder().encode(customerName.trim());
          let binary = '';
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
          token = 'kcm_' + base64;
        } catch (encErr) {
          token = 'kcm_' + encodeURIComponent(customerName.trim());
        }

        // Tạo full URL gửi cho khách hàng
        // Chỉ dẫn thẳng tới congnu.html để không bị dính màn hình đăng nhập của index.html
        const customDebtDomain = localStorage.getItem('KIMCHI_CUSTOM_DEBT_DOMAIN') || 'https://thanhtoanno.vercel.app';
        // Đảm bảo dữ liệu khách hàng được ghi lên cloud ngay lập tức trước khi copy link
        if (typeof syncCustomerDebtsToCloud === 'function') {
          syncCustomerDebtsToCloud(customerName);
        }
        let liveUrl = '';
        if (customDebtDomain) {
          liveUrl = customDebtDomain.replace(/\/+$/, '') + '/congno.html?token=' + token;
        } else {
          const origin = window.location.origin;
          let pathname = window.location.pathname;
          let basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1);
          liveUrl = origin + basePath + 'congno.html?token=' + token;
        }

        // Copy vào Clipboard
        let copied = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(liveUrl);
            copied = true;
          } catch (clipErr) {
            console.warn("navigator.clipboard.writeText lỗi:", clipErr);
          }
        }
        
        if (!copied) {
          const ta = document.createElement('textarea');
          ta.value = liveUrl;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copied = true;
        }

        if (btn) {
          btn.innerHTML = '✅ ĐÃ COPY LINK!';
          btn.style.opacity = '1';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 3000);
        }

        // Thông báo Toast & Alert
        if (typeof showToast === 'function') {
          showToast("ĐÃ COPY LINK CÔNG NỢ KHÁCH " + customerName.toUpperCase() + "! Mở Zalo dán (Ctrl+V) gửi ngay.", 4000);
        }

        alert('🎉 ĐÃ SAO CHÉP LINK CÔNG NỢ THÀNH CÔNG!\n\n- Khách hàng: ' + customerName + '\n- Link xem: ' + liveUrl + '\n\n👉 Đã copy vào bộ nhớ tạm. Bạn chỉ cần mở Zalo/tin nhắn và nhấn Ctrl + V (hoặc Dán) để gửi cho khách.\n👉 Khách mở link sẽ thấy bảng đối soát tự động nhảy số khi bạn sửa/thêm/bớt!');
      } catch (err) {
        console.error("Lỗi tạo link công nợ:", err);
        if (btn) {
          btn.innerHTML = originalText;
          btn.style.opacity = '1';
        }
        if (typeof showToast === 'function') {
          showToast("Lỗi: " + err.message);
        } else {
          alert("Lỗi khi tạo link: " + err.message);
        }
      }
    }
    window.copyCustomerDebtLiveLink = copyCustomerDebtLiveLink;

    async function copyCustomerDebtImage() {
      const customerName = currentViewingDebtCustomer;
      if (!customerName) {
        showToast("Vui lòng chọn khách hàng để sao chép ảnh nợ!");
        return;
      }
      const btn = document.getElementById('btnCopyCustomerDebtImg');
      const originalText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = '⏳ Đang tạo ảnh...';
        btn.style.opacity = '0.7';
      }

      try {
        const canvas = await createCustomerDebtCanvas(customerName);
        if (!canvas) {
          if (btn) { btn.innerHTML = originalText; btn.style.opacity = '1'; }
          showToast("Không tìm thấy dữ liệu công nợ của khách hàng này!");
          return;
        }

        canvas.toBlob(async (blob) => {
          if (!blob) {
            if (btn) { btn.innerHTML = originalText; btn.style.opacity = '1'; }
            showToast("Lỗi khi kết xuất file ảnh công nợ!");
            return;
          }

          let copied = false;
          // Thử ghi trực tiếp vào clipboard dưới dạng image/png
          if (navigator.clipboard && window.ClipboardItem) {
            try {
              const item = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
              copied = true;
            } catch (clipErr) {
              console.warn("ClipboardItem write failed, falling back to download:", clipErr);
            }
          }

          if (copied) {
            if (btn) {
              btn.innerHTML = '✅ ĐÃ COPY ẢNH!';
              btn.style.opacity = '1';
              setTimeout(() => { if (btn) btn.innerHTML = originalText; }, 3000);
            }
            showToast(`✅ ĐÃ SAO CHÉP ẢNH CÔNG NỢ KHÁCH "${customerName.toUpperCase()}"!\nHãy mở Zalo/Messenger và nhấn Ctrl + V để dán và gửi ngay.`, 4500);
          } else {
            // Fallback: Tải file ảnh về máy
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = (customerName || 'Khach').replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
            const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
            a.download = `Cong_No_${safeName}_${dateStr}.png`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (btn) {
              btn.innerHTML = '📥 ĐÃ TẢI ẢNH!';
              btn.style.opacity = '1';
              setTimeout(() => { if (btn) btn.innerHTML = originalText; }, 3000);
            }
            showToast(`Hệ thống đã TỰ ĐỘNG TẢI ẢNH CÔNG NỢ về máy để bạn gửi Zalo cho khách "${customerName}"!`, 4500);
          }
        }, 'image/png');
      } catch (err) {
        console.error("Lỗi khi tạo ảnh công nợ:", err);
        if (btn) { btn.innerHTML = originalText; btn.style.opacity = '1'; }
        showToast("Có lỗi xảy ra: " + (err.message || err));
      }
    }

    async function downloadCustomerDebtImage() {
      const customerName = currentViewingDebtCustomer;
      if (!customerName) {
        showToast("Vui lòng mở danh sách nợ của khách hàng để tải ảnh!");
        return;
      }
      try {
        const canvas = await createCustomerDebtCanvas(customerName);
        if (!canvas) {
          showToast("Không tìm thấy dữ liệu công nợ để tạo ảnh!");
          return;
        }
        canvas.toBlob((blob) => {
          if (!blob) {
            showToast("Lỗi khi tạo file ảnh!");
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const safeName = (customerName || 'Khach').replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_');
          const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
          a.download = `Cong_No_${safeName}_${dateStr}.png`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast(`✅ Đã tải file ảnh công nợ khách "${customerName}" về máy thành công!`, 3000);
        }, 'image/png');
      } catch (err) {
        showToast("Lỗi khi tải ảnh: " + (err.message || err));
      }
    }

    function copyCustomerDebtText() {
      const customerName = currentViewingDebtCustomer;
      if (!customerName) return;
      const debts = softwareDatabase.filter(s => isSoftwareDebt(s) && (s.customer || 'Khách lẻ').trim().toLowerCase() === customerName.trim().toLowerCase());
      if (debts.length === 0) {
        showToast("Khách hàng này hiện không còn đơn nợ nào!");
        return;
      }
      const total = debts.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);
      const lines = [];
      lines.push(`📱 KIM CHI MOBILE - BẢNG ĐỐI SOÁT CÔNG NỢ CHI TIẾT`);
      lines.push(`👤 Khách hàng: ${customerName.toUpperCase()}`);
      lines.push(`📅 Thời gian: ${new Date().toLocaleDateString('vi-VN')}`);
      lines.push(`📦 Tổng số đơn: ${debts.length} đơn nợ`);
      lines.push(`💰 TỔNG NỢ: ${formatPriceStr(total)} (${formatPriceStr(total)}.000 đ)`);
      lines.push(`----------------------------------------`);
      debts.forEach((d, idx) => {
        lines.push(`${idx + 1}. ${d.device || 'Phần mềm'} : ${formatPriceStr(d.price)} (${d.dayMonth || ''}-${d.year || '2026'})`);
      });
      lines.push(`----------------------------------------`);
      lines.push(`Quý khách vui lòng kiểm tra và thanh toán. Trân trọng cảm ơn!`);

      const text = lines.join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`✅ Đã sao chép toàn bộ ${debts.length} đơn nợ dạng chữ! Có thể dán Zalo ngay.`, 3000);
        }).catch(() => {
          fallbackTextCopy(text, debts.length);
        });
      } else {
        fallbackTextCopy(text, debts.length);
      }
    }

    function fallbackTextCopy(text, count) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast(`✅ Đã sao chép toàn bộ ${count} đơn nợ dạng chữ! Có thể dán Zalo ngay.`, 3000);
      } catch (e) {
        showToast("Không thể sao chép văn bản tự động, vui lòng thử lại.");
      }
      document.body.removeChild(ta);
    }

    window.createCustomerDebtCanvas = createCustomerDebtCanvas;
    window.copyCustomerDebtImage = copyCustomerDebtImage;
    window.downloadCustomerDebtImage = downloadCustomerDebtImage;
    window.copyCustomerDebtText = copyCustomerDebtText;

    function collectSelectedSoftwareDebts() {
      if (selectedSoftwareDebtCustomers.size === 0) return;

      let selectedDebts = softwareDatabase.filter(s => isSoftwareDebt(s) && selectedSoftwareDebtCustomers.has((s.customer || 'Khách lẻ').trim()));
      if (selectedDebts.length === 0) return;

      currentBatchPaySection = 'software';
      currentBatchPayItems = selectedDebts.map(c => ({
        id: c.id,
        amount: parsePriceNum(c.price) || 0,
        name: `${c.customer || 'Khách lẻ'} - ${c.device || 'Máy'} (${c.dayMonth || ''})`
      }));

      const totalSum = currentBatchPayItems.reduce((s, it) => s + it.amount, 0);

      const descEl = document.getElementById('batchPayModalDesc');
      if (descEl) {
        descEl.innerHTML = `Bạn có chắc chắn muốn xác nhận <b>THANH TOÁN NỢ</b> cho <b>${selectedSoftwareDebtCustomers.size} khách hàng</b> (${selectedDebts.length} đơn nợ)?<br>Tổng số tiền: <b style="color: #facc15; font-size: 1.25rem;">${formatPriceStr(totalSum)}</b>`;
      }

      const boxEl = document.getElementById('batchPayModalSummaryBox');
      if (boxEl) {
        boxEl.innerHTML = currentBatchPayItems.map((it, idx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.88rem;">
            <span style="color: #fff; font-weight: 700;">${idx + 1}. ${escapeHtml(it.name)}</span>
            <span style="color: #facc15; font-weight: 900;">${formatPriceStr(it.amount)}</span>
          </div>
        `).join('');
      }

      const modal = document.getElementById('batchPayDebtModal');
      if (modal) modal.style.display = 'flex';
    }

    function filterDebtByCustomer(custName) {
      const searchEl = document.getElementById('swDebtSearchInput');
      if (searchEl) {
        searchEl.value = custName;
        renderSoftwareDebtTable();
      }
    }

    function renderSoftwareTable(database) {
      updateSoftwareProfits();

      const tbody = document.getElementById('softwareTableBody');
      if (!tbody) return;

      let filtered = database.filter(item => {
        // Lọc theo khách hàng
        if (swFilterCustomer !== 'ALL' && item.customer !== swFilterCustomer) {
          return false;
        }

        // Lọc theo trạng thái
        if (swFilterStatus !== 'ALL') {
          if (swFilterStatus === 'NỢ DAI' && item.paymentStatus !== 'NỢ DAI') return false;
          if (swFilterStatus === 'ĐÃ THANH TOÁN' && item.paymentStatus !== 'ĐÃ THANH TOÁN') return false;
          if (swFilterStatus === 'TIỀN MẶT' && item.paymentStatus !== 'TIỀN MẶT') return false;
          if (swFilterStatus === 'CHUYỂN KHOẢN' && item.paymentStatus !== 'CHUYỂN KHOẢN') return false;
        }

        // Lọc theo ngày / tháng / tất cả
        if (swViewMode === 'day') {
          const dd = String(swFilterDate.getDate()).padStart(2, '0');
          const mm = String(swFilterDate.getMonth() + 1).padStart(2, '0');
          const yyyy = String(swFilterDate.getFullYear());
          let targetDayMonth = `${dd}-${mm}`;
          let itemDayMonth = (item.dayMonth || '').replace(/\//g, '-');
          if (itemDayMonth !== targetDayMonth || (item.year && item.year !== yyyy)) {
            return false;
          }
        } else if (swViewMode === 'month') {
          const mm = String(currentSoftwareMonthFilter.month + 1).padStart(2, '0');
          const yyyy = String(currentSoftwareMonthFilter.year);
          let itemParts = (item.dayMonth || '').replace(/\//g, '-').split('-');
          let itemMonth = itemParts.length === 2 ? itemParts[1] : '';
          let itemYear = item.year || '2026';
          if (itemMonth !== mm || itemYear !== yyyy) {
            return false;
          }
        } else if (swViewMode === 'year') {
          const yyyy = String(currentSoftwareYearFilter);
          let itemYear = String(item.year || '2026');
          if (itemYear !== yyyy) {
            return false;
          }
        }

        return true;
      });

      let swDebtCount = 0;
      let swPaidCount = 0;
      filtered.forEach(i => {
        if (isSoftwareDebt(i)) {
          swDebtCount++;
        } else {
          swPaidCount++;
        }
      });
      const swCountEl = document.getElementById('softwareCountText');
      if (swCountEl) {
        swCountEl.innerHTML = `Tổng = <span style="color: #ffffff; font-weight: 800;">${filtered.length}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Thanh Toán = <span style="color: #10b981; font-weight: 800;">${swPaidCount}</span> &nbsp;&nbsp;-&nbsp;&nbsp; Nợ Dai = <span style="color: #ef4444; font-weight: 800;">${swDebtCount}</span>`;
      }

      let totalRev = 0;
      let totalCost = 0;
      let totalProfit = 0;
      filtered.forEach(i => {
        totalRev += parsePriceNum(i.price) || 0;
        totalCost += parsePriceNum(i.cost) || 0;
        totalProfit += parsePriceNum(i.profit) || 0;
      });
      if (swHideProfits) {
        document.getElementById('softwareSummaryStats').innerHTML = `DOANH THU : <span style="color: #ef4444; font-weight: 800;">***</span> &nbsp;&nbsp;-&nbsp;&nbsp; VỐN : <span style="color: #ffffff; font-weight: 800;">***</span> &nbsp;&nbsp;=&nbsp;&nbsp; LÃI : <span style="color: #10b981; font-weight: 800;">***</span>`;
      } else {
        document.getElementById('softwareSummaryStats').innerHTML = `DOANH THU : <span style="color: #ef4444; font-weight: 800;">${formatPriceStr(totalRev)}</span> &nbsp;&nbsp;-&nbsp;&nbsp; VỐN : <span style="color: #ffffff; font-weight: 800;">${formatPriceStr(totalCost)}</span> &nbsp;&nbsp;=&nbsp;&nbsp; LÃI : <span style="color: #10b981; font-weight: 800;">${formatPriceStr(totalProfit)}</span>`;
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2.5rem; color: var(--text-sub);">Không có đơn phần mềm nào phù hợp</td></tr>`;
        updateSoftwarePayButtonVisibility();
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        let isDebt = isSoftwareDebt(item);
        let safeId = String(item.id).replace(/'/g, "\\'");
        let statusBadgeHtml = isDebt
          ? `<span class="sw-badge-debt" ondblclick="markSoftwareAsPaidOnDblClick('${safeId}')" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<350){ markSoftwareAsPaidOnDblClick('${safeId}'); } this._lastTap=now;" title="Nháy đúp 2 lần để chuyển sang ĐÃ TRẢ" style="cursor: pointer; user-select: none;">💀 NỢ DAI VL</span>`
          : `<span class="sw-badge-paid" style="cursor: default; user-select: none;">✔ ĐÃ TRẢ <span style="font-size: 0.95rem; margin-left: 2px;">💰</span></span>`;

        return `
          <tr>
            <td class="sw-col-check" style="text-align: center;">
              ${isDebt ? `
                <span style="display: inline-flex; align-items: center; justify-content: center; font-size: 1.15rem; color: #ffffff; filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.45)); user-select: none;" title="Khách nợ dai VL">💀</span>
              ` : `
                <img src="images/customer_paid_smile.png"
                  style="width: 22px; height: 22px; display: inline-block; vertical-align: middle; user-select: none; filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.45));"
                  title="Khách đã trả tiền 😊" alt="Đã trả tiền">
              `}
            </td>
            <td class="sw-col-customer" ondblclick="viewSoftwareTicket('${safeId}')" ontouchend="let now=Date.now(); if(this._lastTap && now-this._lastTap<350){ viewSoftwareTicket('${safeId}'); } this._lastTap=now;" style="cursor: pointer;" title="Nháy đúp 2 lần để xem chi tiết đơn">
              <span style="color: #f59e0b; font-weight: 900; font-size: 1.25rem;">${swHideProfits ? '**********' : escapeHtml(item.customer)}</span>
            </td>
            <td class="sw-col-device">
              <span style="color: #ffffff; font-weight: 900; font-size: 1.30rem;">${escapeHtml(formatBrandDeviceName(item.device))}</span>
            </td>
            <td class="sw-col-price">
              <span style="color: #ef4444; font-weight: 900; font-size: 1.38rem;">${swHideProfits ? '***' : formatPriceStr(item.price)}</span>
            </td>
            <td class="sw-col-extra">
              <span style="color: #ffffff; font-weight: 800; font-size: 1.05rem;">${swHideProfits ? '***' : formatPriceStr(item.cost || '0')}</span>
            </td>
            <td class="sw-col-extra">
              <span style="color: #f59e0b; font-weight: 900; font-size: 1.16rem;">${swHideProfits ? '***' : formatPriceStr(item.profit)}</span>
            </td>
            <td class="sw-col-extra">
              ${statusBadgeHtml}
            </td>
            <td class="sw-col-extra">
              ${(() => {
                const dt = formatSoftwareItemDateTime(item);
                return `<div class="sw-time-display">
                  <span class="sw-d-date">${dt.dateStr}</span>
                  ${dt.timeStr ? `<span class="sw-d-time">${dt.timeStr}</span>` : ''}
                </div>`;
              })()}
            </td>
            <td class="sw-col-extra" style="text-align: center;">
              <div class="action-btn-group">
                <button type="button" class="action-btn-icon action-btn-view" onclick="viewSoftwareTicket('${safeId}')" title="Xem chi tiết">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-edit" onclick="openSoftwareModal('${safeId}')" title="Sửa đơn">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-del" onclick="deleteSoftwareTicket('${safeId}')" title="Xóa đơn">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
      updateSoftwarePayButtonVisibility();
    }

    function togglePaymentStatus(id) {
      markSoftwareAsPaidOnDblClick(id);
    }

    // =========================================================
    // JAVASCRIPT MODULE BÁO GIÁ & QUẢN LÝ LINH KIỆN (CHUẨN MẪU)
    // =========================================================
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function formatNumberDisplay(num) {
      if (num === null || num === undefined || num === '') return '0';
      return formatPriceStr(num) || '0';
    }

    function formatWarrantyDisplay(w) {
      if (!w || w === '—') return '—';
      const s = String(w).trim();
      const lower = s.toLowerCase();
      if (lower.includes('khong') || lower.includes('không') || lower === '0' || lower === '0 bh' || lower === 'kbh') {
        return '0 Bảo Hành';
      }
      return s;
    }


    const DEFAULT_PARTS_DATA = [
      { id: 1, brand: 'IPHONE', device: '11', type: 'Pin DL Cao (Jufuxing)', style: 'Pin DL Cao (Jufuxing)', priceSell: '400', priceCost: '190', profit: '210', qty: 3, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 2, brand: 'IPHONE', device: '11', type: 'Pin Rẻ (iPhone)', style: 'Pin Rẻ (iPhone)', priceSell: '300', priceCost: '130', profit: '170', qty: 2, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 3, brand: 'IPHONE', device: '11', type: 'Màn GX', style: 'Màn GX', priceSell: '550', priceCost: '260', profit: '290', qty: 4, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 4, brand: 'IPHONE', device: '11', type: 'Màn Zin iPhone', style: 'Màn Zin iPhone', priceSell: '900', priceCost: '510', profit: '390', qty: 1, status: 'Còn hàng', color: '—', date: '9/9/2026' },
      { id: 5, brand: 'IPHONE', device: '11 PRO', type: 'Màn Lô (Rẻ)', style: 'Màn Lô (Rẻ)', priceSell: '600', priceCost: '250', profit: '350', qty: 2, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 6, brand: 'IPHONE', device: '11 PRO', type: 'Màn Lô ( JK )', style: 'Màn Lô ( JK )', priceSell: '600', priceCost: '350', profit: '250', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 7, brand: 'IPHONE', device: '11 PRO', type: 'Pin DL Cao (Jufuxing)', style: 'Pin DL Cao (Jufuxing)', priceSell: '450', priceCost: '240', profit: '210', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 8, brand: 'IPHONE', device: '11 PRO', type: 'Màn GX', style: 'Màn GX', priceSell: '900', priceCost: '600', profit: '300', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 9, brand: 'IPHONE', device: '11 PRO', type: 'Pin Rẻ (iPhone)', style: 'Pin Rẻ (iPhone)', priceSell: '350', priceCost: '160', profit: '190', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 10, brand: 'IPHONE', device: '11 PRO MAX', type: 'Màn JK OLED (Dẻo)', style: 'Màn JK OLED (Dẻo)', priceSell: '1.000', priceCost: '740', profit: '260', qty: 3, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 11, brand: 'IPHONE', device: '11 PRO MAX', type: 'Màn GX', style: 'Màn GX', priceSell: '1.050', priceCost: '760', profit: '290', qty: 2, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 12, brand: 'IPHONE', device: '12 12 PRO', type: 'Màn Lô (Rẻ)', style: 'Màn Lô (Rẻ)', priceSell: '600', priceCost: '350', profit: '250', qty: 2, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 13, brand: 'IPHONE', device: '12 PRO MAX', type: 'Màn GX', style: 'Màn GX', priceSell: '1.400', priceCost: '1.020', profit: '380', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 14, brand: 'SAMSUNG', device: 'A05', type: 'Màn Zin', style: 'Màn Zin', priceSell: '450', priceCost: '185', profit: '265', qty: 2, status: 'Còn hàng', color: '—', date: '10/8/2026' },
      { id: 15, brand: 'SAMSUNG', device: 'A06 4G', type: 'Màn Oled', style: 'Màn Oled', priceSell: '450', priceCost: '200', profit: '250', qty: 1, status: 'Còn hàng', color: '—', date: '10/8/2026' }
    ];

    let partsDatabase = [];
    try {
      const storedParts = localStorage.getItem('kimchi_parts_database_v2');
      partsDatabase = storedParts ? JSON.parse(storedParts) : DEFAULT_PARTS_DATA;
    } catch(e) {
      partsDatabase = DEFAULT_PARTS_DATA;
    }

    let partsFilterKeyword = '';
    let partsFilterBrand = '';
    let partsFilterDevice = '';
    let partsFilterType = '';
    let partsFilterStatus = '';

    function savePartsStorage() {
      try {
        localStorage.setItem('kimchi_parts_database_v2', JSON.stringify(partsDatabase));
      } catch (e) {
        console.error('Lỗi lưu trữ partsDatabase:', e);
      }
    }

    let partsCurrentBrand = '';
    let partsCurrentType = '';
    let partsCurrentStyle = '';
    let partsHideCost = false;

    function selectPartsBrandTab(brand, btn) {
      partsCurrentBrand = brand || '';
      document.querySelectorAll('#bgBrandTabsContainer .bg-brand-tab').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');

      // Khi hãng ở mục TẤT CẢ (brand rỗng) thì nút THÊM MỚI tự ẩn đi, sang các hãng mới hiển thị
      const addBtnWrap = document.getElementById('partsAddBtnWrap');
      if (addBtnWrap) {
        addBtnWrap.style.display = (!partsCurrentBrand || partsCurrentBrand === 'ALL') ? 'none' : 'block';
      }

      renderPartsTypeTabs();
      renderPartsStyleTabs();
      renderPartsTable();
    }

    function selectPartsTypeTab(type, btn) {
      partsCurrentType = type || '';
      document.querySelectorAll('#bgTypeTabsContainer .bg-subfilter-tab').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderPartsStyleTabs();
      renderPartsTable();
    }

    function selectPartsStyleTab(style, btn) {
      partsCurrentStyle = style || '';
      document.querySelectorAll('#bgStyleTabsContainer .bg-subfilter-tab').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderPartsTable();
    }

    // Render thanh tab LINH KIỆN (Bao gồm MÀN, PIN, và bất cứ gì thêm vào database)
    function renderPartsTypeTabs() {
      const container = document.getElementById('bgTypeTabsContainer');
      if (!container) return;

      // Danh sách mặc định ưu tiên: MÀN, PIN
      const defaultTypes = ['MÀN', 'PIN'];
      const dbTypes = Array.from(new Set(
        partsDatabase
          .filter(x => !partsCurrentBrand || x.brand === partsCurrentBrand)
          .map(x => (x.type || '').trim())
          .filter(Boolean)
      ));

      // Hợp nhất danh sách không trùng lặp
      const allTypes = [...defaultTypes];
      dbTypes.forEach(t => {
        const upper = t.toUpperCase();
        if (!allTypes.some(d => d.toUpperCase() === upper)) {
          allTypes.push(t);
        }
      });

      let html = `<button type="button" class="bg-subfilter-tab ${!partsCurrentType ? 'active' : ''}" onclick="selectPartsTypeTab('', this)">LINH KIỆN</button>`;
      allTypes.forEach(t => {
        const isActive = (partsCurrentType && partsCurrentType.toUpperCase() === t.toUpperCase());
        html += `<button type="button" class="bg-subfilter-tab ${isActive ? 'active' : ''}" onclick="selectPartsTypeTab('${escapeHtml(t)}', this)">${escapeHtml(t.toUpperCase())}</button>`;
      });

      container.innerHTML = html;
    }

    // Render thanh tab KIỂU (ZIN, GX, JK, DẺO... tự động lấy theo dữ liệu)
    function renderPartsStyleTabs() {
      const container = document.getElementById('bgStyleTabsContainer');
      if (!container) return;

      const dbStyles = Array.from(new Set(
        partsDatabase
          .filter(x => {
            if (partsCurrentBrand && x.brand !== partsCurrentBrand) return false;
            if (partsCurrentType) {
              const itemTypeUpper = (x.type || '').toUpperCase();
              const curUpper = partsCurrentType.toUpperCase();
              if (!itemTypeUpper.includes(curUpper) && !curUpper.includes(itemTypeUpper)) return false;
            }
            return true;
          })
          .map(x => (x.style || '').trim())
          .filter(Boolean)
      ));

      const defaultStyles = ['ZIN'];
      const allStyles = [...defaultStyles];
      dbStyles.forEach(s => {
        const upper = s.toUpperCase();
        if (!allStyles.some(d => d.toUpperCase() === upper)) {
          allStyles.push(s);
        }
      });

      let html = `<button type="button" class="bg-subfilter-tab style-tab ${!partsCurrentStyle ? 'active' : ''}" onclick="selectPartsStyleTab('', this)">KIỂU</button>`;
      allStyles.forEach(s => {
        const isActive = (partsCurrentStyle && partsCurrentStyle.toUpperCase() === s.toUpperCase());
        html += `<button type="button" class="bg-subfilter-tab style-tab ${isActive ? 'active' : ''}" onclick="selectPartsStyleTab('${escapeHtml(s)}', this)">${escapeHtml(s.toUpperCase())}</button>`;
      });

      container.innerHTML = html;
    }

    function addNewBrandTab() {
      const name = prompt('Nhập tên Hãng mới (VD: XIAOMI, REALME...):');
      if (!name || !name.trim()) return;
      const clean = name.trim().toUpperCase();

      const container = document.getElementById('bgBrandTabsContainer');
      const addBtn = container.querySelector('.bg-brand-tab-btn-add');
      if (container && addBtn) {
        const newTab = document.createElement('button');
        newTab.type = 'button';
        newTab.className = 'bg-brand-tab';
        newTab.dataset.brand = clean;
        newTab.innerText = clean;
        newTab.onclick = function() { selectPartsBrandTab(clean, this); };
        container.insertBefore(newTab, addBtn);
        selectPartsBrandTab(clean, newTab);
      }
    }

    function togglePartsCostVisibility() {
      partsHideCost = !partsHideCost;
      const thCols = document.querySelectorAll('.bg-th-cost, .bg-th-profit');
      const tdCols = document.querySelectorAll('.bg-td-cost, .bg-td-profit');
      thCols.forEach(el => el.style.display = partsHideCost ? 'none' : '');
      tdCols.forEach(el => el.style.display = partsHideCost ? 'none' : '');

      const eyeBtn = document.getElementById('btnTogglePartsCostEye');
      if (eyeBtn) {
        eyeBtn.classList.toggle('active', partsHideCost);
        eyeBtn.style.color = partsHideCost ? '#f87171' : '#94a3b8';
      }
    }

    function togglePartsExcelMenu(e) {
      if (e) e.stopPropagation();
      const dd = document.getElementById('bgPartsExcelDropdown');
      if (dd) {
        dd.style.display = (dd.style.display === 'none' || dd.style.display === '') ? 'flex' : 'none';
      }
    }

    document.addEventListener('click', function(e) {
      const dd = document.getElementById('bgPartsExcelDropdown');
      if (dd && !e.target.closest('.bg-excel-menu-wrap')) {
        dd.style.display = 'none';
      }
    });

    function triggerImportPartsExcel() {
      const fileInput = document.getElementById('bgPartsExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
      togglePartsExcelMenu();
    }

    function handlePartsExcelFileImport(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.SheetNames[0];
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

          if (!rows || rows.length === 0) {
            alert('File Excel trống hoặc không đúng định dạng!');
            return;
          }

          let added = 0;
          rows.forEach((r, idx) => {
            const brand = (r['HÃNG'] || r['Hãng'] || r['brand'] || 'IPHONE').toString().trim().toUpperCase();
            const device = (r['THUỘC LOẠI MÁY'] || r['Thuộc loại máy'] || r['Tên máy'] || r['device'] || '').toString().trim();
            const type = (r['LOẠI LINH KIỆN'] || r['Loại linh kiện'] || r['Linh kiện'] || r['type'] || 'Màn hình').toString().trim();
            const priceSell = (r['GIÁ THAY KHÁCH'] || r['Giá thay khách'] || r['Giá bán'] || r['priceSell'] || '0').toString().trim();
            const priceCost = (r['GIÁ NHẬP'] || r['Giá nhập'] || r['Giá vốn'] || r['priceCost'] || '0').toString().trim();
            const qty = parseInt(r['SL'] || r['Số lượng'] || r['qty'] || 1, 10) || 0;
            const profit = (parseFloat(priceSell.replace(/\./g, '')) - parseFloat(priceCost.replace(/\./g, ''))).toString();
            const status = (r['TRẠNG THÁI'] || r['Trạng thái'] || (qty > 0 ? 'Còn hàng' : 'Hết hàng')).toString().trim();
            const color = (r['MÀU SẮC'] || r['Màu sắc'] || '—').toString().trim();
            const date = (r['NGÀY'] || r['Ngày'] || '10/8/2026').toString().trim();

            if (device) {
              partsDatabase.push({
                id: Date.now() + idx,
                brand, device, type, style: type, priceSell, priceCost, profit, qty, status, color, date
              });
              added++;
            }
          });

          savePartsStorage();
          renderPartsTable();
          alert(`✓ Đã nhập thành công ${added} dòng từ file Excel!`);
        } catch (err) {
          console.error('Lỗi đọc Excel:', err);
          alert('Có lỗi khi đọc file Excel: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    function clearAllPartsData() {
      togglePartsExcelMenu();
      if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn XÓA TOÀN BỘ danh sách báo giá linh kiện?')) {
        partsDatabase = [];
        savePartsStorage();
        renderPartsTable();
        alert('Đã xóa toàn bộ dữ liệu báo giá!');
      }
    }

    let partsCurrentPriceFilter = 'ALL';
    let partsCurrentStatusFilter = 'CON_HANG';
    let currentPartsSuggestionIndex = -1;

    function handlePartsStatusFilterChange(select) {
      partsCurrentStatusFilter = select.value || 'CON_HANG';
      renderPartsTable();
    }
    window.handlePartsStatusFilterChange = handlePartsStatusFilterChange;

    function handlePartsPriceFilterChange(select) {
      partsCurrentPriceFilter = select.value || 'ALL';
      renderPartsTable();
    }
    window.handlePartsPriceFilterChange = handlePartsPriceFilterChange;

    function getPartsNameSuggestions(query) {
      if (!query || !query.trim()) return [];
      const qNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(query.trim()).toLowerCase() : query.trim().toLowerCase();

      let pool = partsDatabase;
      if (partsCurrentBrand && partsCurrentBrand !== 'ALL') {
        const cbf = partsCurrentBrand.toUpperCase().trim();
        pool = pool.filter(p => (p.brand || '').toUpperCase().trim() === cbf);
      }

      const nameMap = new Map();
      pool.forEach(p => {
        let dev = (p.device || '').trim();
        let type = (p.type || '').trim();
        let style = (p.style || '').trim();

        let normDev = (typeof normalizeQuery === 'function') ? normalizeQuery(dev).toLowerCase() : dev.toLowerCase();
        let normType = (typeof normalizeQuery === 'function') ? normalizeQuery(type).toLowerCase() : type.toLowerCase();
        let normStyle = (typeof normalizeQuery === 'function') ? normalizeQuery(style).toLowerCase() : style.toLowerCase();

        // Gợi ý theo Tên Máy
        if (dev && (normDev.includes(qNorm) || dev.toLowerCase().includes(qNorm))) {
          let key = 'dev_' + dev.toLowerCase();
          if (!nameMap.has(key)) {
            nameMap.set(key, { name: dev, count: 1, type: '📱' });
          } else {
            nameMap.get(key).count++;
          }
        }

        // Gợi ý theo Loại Linh Kiện
        if (type && (normType.includes(qNorm) || type.toLowerCase().includes(qNorm))) {
          let key = 'type_' + type.toLowerCase();
          if (!nameMap.has(key)) {
            nameMap.set(key, { name: type, count: 1, type: '🔧' });
          } else {
            nameMap.get(key).count++;
          }
        }

        // Gợi ý theo Kiểu
        if (style && (normStyle.includes(qNorm) || style.toLowerCase().includes(qNorm))) {
          let key = 'style_' + style.toLowerCase();
          if (!nameMap.has(key)) {
            nameMap.set(key, { name: style, count: 1, type: '🏷️' });
          } else {
            nameMap.get(key).count++;
          }
        }
      });

      const list = Array.from(nameMap.values());
      list.sort((a, b) => {
        let aLower = a.name.toLowerCase();
        let bLower = b.name.toLowerCase();
        let aExact = aLower === qNorm;
        let bExact = bLower === qNorm;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        let aStarts = aLower.startsWith(qNorm);
        let bStarts = bLower.startsWith(qNorm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return a.name.length - b.name.length;
      });

      return list.slice(0, 10);
    }

    function renderPartsSearchSuggestions(query) {
      const dropdown = document.getElementById('partsSearchSuggestions');
      if (!dropdown) return;

      const suggestions = getPartsNameSuggestions(query);
      currentPartsSuggestionIndex = -1;

      if (!suggestions || suggestions.length === 0) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = suggestions.map((item, index) => {
        return `
          <div class="phone-suggestion-item" data-index="${index}" data-name="${escapeHtml(item.name)}" onclick="selectPartsSearchSuggestion(this.getAttribute('data-name'))">
            <span class="suggestion-model-name">
              <span style="font-size: 1.05rem;">${item.type || '📱'}</span>
              <span>${highlightSuggestionMatch(item.name, query)}</span>
            </span>
            <span class="suggestion-count">${item.count} dòng</span>
          </div>
        `;
      }).join('');

      dropdown.style.display = 'block';
    }

    function selectPartsSearchSuggestion(name) {
      const input = document.getElementById('bgSearchDeviceInput');
      if (!input) return;
      input.value = name;
      const clearBtn = document.getElementById('btnClearPartsSearch');
      if (clearBtn) clearBtn.style.display = 'block';
      hidePartsSearchSuggestions();
      partsFilterKeyword = name.trim().toLowerCase();
      renderPartsTable();
    }
    window.selectPartsSearchSuggestion = selectPartsSearchSuggestion;

    function hidePartsSearchSuggestions() {
      const dropdown = document.getElementById('partsSearchSuggestions');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
      currentPartsSuggestionIndex = -1;
    }
    window.hidePartsSearchSuggestions = hidePartsSearchSuggestions;

    function handlePartsSearchKeydown(e) {
      const dropdown = document.getElementById('partsSearchSuggestions');
      if (!dropdown || dropdown.style.display === 'none') return;
      const items = dropdown.querySelectorAll('.phone-suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentPartsSuggestionIndex = (currentPartsSuggestionIndex + 1) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentPartsSuggestionIndex = (currentPartsSuggestionIndex - 1 + items.length) % items.length;
        updateSuggestionHighlight(items);
      } else if (e.key === 'Enter') {
        if (currentPartsSuggestionIndex >= 0 && currentPartsSuggestionIndex < items.length) {
          e.preventDefault();
          items[currentPartsSuggestionIndex].click();
        } else {
          hidePartsSearchSuggestions();
        }
      } else if (e.key === 'Escape') {
        hidePartsSearchSuggestions();
      }
    }
    window.handlePartsSearchKeydown = handlePartsSearchKeydown;

    function clearPartsSearch() {
      const input = document.getElementById('bgSearchDeviceInput');
      if (input) input.value = '';
      const clearBtn = document.getElementById('btnClearPartsSearch');
      if (clearBtn) clearBtn.style.display = 'none';
      hidePartsSearchSuggestions();
      partsFilterKeyword = '';
      if (input) input.focus();
      renderPartsTable();
    }
    window.clearPartsSearch = clearPartsSearch;

    function handlePartsSearchFilter(val) {
      const clearBtn = document.getElementById('btnClearPartsSearch');
      if (val && val.trim() !== '') {
        if (clearBtn) clearBtn.style.display = 'block';
        renderPartsSearchSuggestions(val);
      } else {
        if (clearBtn) clearBtn.style.display = 'none';
        hidePartsSearchSuggestions();
      }
      partsFilterKeyword = (val || '').trim().toLowerCase();
      renderPartsTable();
    }

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#tab-baogia .search-box-bm')) {
        hidePartsSearchSuggestions();
      }
    });

    function exportPartsToExcel() {
      const dd = document.getElementById('bgPartsExcelDropdown');
      if (dd) dd.style.display = 'none';

      if (typeof XLSX === 'undefined') {
        alert('Thư viện XLSX chưa tải xong!');
        return;
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `bao-gia-linh-kien_${dateStr}.xlsx`;

      const exportData = partsDatabase.map((item, idx) => ({
        'STT': idx + 1,
        'HÃNG': item.brand || '',
        'THUỘC LOẠI MÁY': item.device || '',
        'LOẠI LINH KIỆN': item.type || '',
        'GIÁ THAY KHÁCH': item.priceSell || '',
        'SL': item.qty !== undefined ? item.qty : '',
        'TRẠNG THÁI': (parseInt(item.qty, 10) === 0 ? 'Hết hàng' : (item.status || 'Còn hàng')),
        'GIÁ NHẬP': item.priceCost || '',
        'LÃI': item.profit || '',
        'MÀU SẮC': item.color || '—',
        'NGÀY': item.date || '10/8/2026'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Báo Giá Linh Kiện');
      XLSX.writeFile(wb, filename);

    }

    function renderPartsTable() {
      const tbody = document.getElementById('bgPartsTableBody');
      if (!tbody) return;

      let filtered = partsDatabase.filter(item => {
        if (partsFilterKeyword) {
          const kw = partsFilterKeyword;
          const kwNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(kw).toLowerCase() : kw;

          const devStr = (item.device || '').toLowerCase();
          const devNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(devStr).toLowerCase() : devStr;

          const typeStr = (item.type || '').toLowerCase();
          const typeNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(typeStr).toLowerCase() : typeStr;

          const styleStr = (item.style || '').toLowerCase();
          const styleNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(styleStr).toLowerCase() : styleStr;

          const brandStr = (item.brand || '').toLowerCase();
          const brandNorm = (typeof normalizeQuery === 'function') ? normalizeQuery(brandStr).toLowerCase() : brandStr;

          const matchDevice = devStr.includes(kw) || devNorm.includes(kwNorm);
          const matchType = typeStr.includes(kw) || typeNorm.includes(kwNorm);
          const matchStyle = styleStr.includes(kw) || styleNorm.includes(kwNorm);
          const matchBrand = brandStr.includes(kw) || brandNorm.includes(kwNorm);

          if (!matchDevice && !matchType && !matchStyle && !matchBrand) return false;
        }

        if (partsCurrentBrand && item.brand !== partsCurrentBrand) return false;

        if (partsCurrentType) {
          const itemTypeUpper = (item.type || '').toUpperCase();
          const curTypeUpper = partsCurrentType.toUpperCase();
          if (!itemTypeUpper.includes(curTypeUpper) && !curTypeUpper.includes(itemTypeUpper)) return false;
        }

        if (partsCurrentStyle) {
          const itemStyleUpper = (item.style || '').toUpperCase();
          const curStyleUpper = partsCurrentStyle.toUpperCase();
          if (!itemStyleUpper.includes(curStyleUpper) && !curStyleUpper.includes(itemStyleUpper)) return false;
        }

        // LỌC THEO TÌNH TRẠNG (MẶC ĐỊNH: CÒN HÀNG, HẾT HÀNG KHI SL = 0)
        const itemQty = parseInt(item.qty, 10) || 0;
        if (partsCurrentStatusFilter === 'CON_HANG') {
          if (itemQty <= 0) return false;
        } else if (partsCurrentStatusFilter === 'HET_HANG') {
          if (itemQty > 0) return false;
        }

        // LỌC THEO KHOẢNG GIÁ BÁN (Y CHANG TAB BÁN MÁY)
        if (partsCurrentPriceFilter && partsCurrentPriceFilter !== 'ALL') {
          let pVal = 0;
          if (typeof parsePriceNum === 'function') {
            pVal = parsePriceNum(item.priceSell);
          } else {
            pVal = parseFloat((item.priceSell || '0').replace(/\./g, '')) || 0;
          }
          if (pVal >= 100000) pVal = Math.round(pVal / 1000);

          if (partsCurrentPriceFilter === 'UNDER_1') {
            return pVal > 0 && pVal < 1000;
          } else if (partsCurrentPriceFilter === '1_2') {
            return pVal >= 1000 && pVal <= 2000;
          } else if (partsCurrentPriceFilter === '2_4') {
            return pVal > 2000 && pVal <= 4000;
          } else if (partsCurrentPriceFilter === '4_6') {
            return pVal > 4000 && pVal <= 6000;
          } else if (partsCurrentPriceFilter === '6_10') {
            return pVal > 6000 && pVal <= 10000;
          } else if (partsCurrentPriceFilter === 'OVER_10') {
            return pVal > 10000;
          }
        }

        return true;
      });

      // SẮP XẾP THEO LINH KIỆN (A-Z)
      filtered.sort((a, b) => {
        const typeA = (a.type || '').trim().toLowerCase();
        const typeB = (b.type || '').trim().toLowerCase();
        if (typeA !== typeB) {
          return typeA.localeCompare(typeB, 'vi');
        }
        // Nếu cùng linh kiện, sắp xếp tiếp theo Tên Máy
        const devA = (a.device || '').trim().toLowerCase();
        const devB = (b.device || '').trim().toLowerCase();
        return devA.localeCompare(devB, 'vi');
      });

      // Tính tổng vốn: sum(Giá Nhập * SL)
      let totalCapital = 0;
      partsDatabase.forEach(i => {
        const costNum = parseFloat((i.priceCost || '0').replace(/\./g, '')) || 0;
        const q = parseInt(i.qty, 10) || 0;
        totalCapital += costNum * q;
      });
      const capEl = document.getElementById('partsCapitalTotalVal');
      if (capEl) {
        capEl.innerText = formatNumberDisplay(totalCapital);
      }

      // Cập nhật tổng số dòng
      const totalRowsEl = document.getElementById('bgTotalRowsCount');
      if (totalRowsEl) {
        totalRowsEl.innerText = filtered.length;
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Không có linh kiện nào phù hợp với bộ lọc</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        const qtyNum = parseInt(item.qty, 10) || 0;
        const isOut = (qtyNum === 0);
        
        // Icon thương hiệu cho TÊN MÁY
        const brandUpper = (item.brand || '').toUpperCase();
        let brandLogo = '';
        if (brandUpper.includes('APPLE') || brandUpper.includes('IPHONE') || brandUpper === 'IP') {
          brandLogo = `<span class="bg-brand-logo-icon" style="color: #f59e0b;" title="Apple"></span>`;
        } else if (brandUpper.includes('SAMSUNG')) {
          brandLogo = `<span class="bg-brand-logo-icon" style="color: #3b82f6; font-size: 0.9rem; font-weight: 900;" title="Samsung">S</span>`;
        } else {
          brandLogo = `<span class="bg-brand-logo-icon" style="color: #94a3b8; font-size: 0.9rem; font-weight: 900;">•</span>`;
        }

        // Chấm màu sắc (nếu có color)
        let colorDotHtml = '';
        if (item.color && item.color.trim() !== '') {
          const col = item.color.trim().toLowerCase();
          let bgCol = item.color.trim();
          if (col === 'trắng' || col === 'white') bgCol = '#ffffff';
          else if (col === 'đen' || col === 'black') bgCol = '#000000';
          else if (col === 'vàng' || col === 'gold') bgCol = '#fbbf24';
          else if (col === 'xanh' || col === 'blue') bgCol = '#3b82f6';
          else if (col === 'đỏ' || col === 'red') bgCol = '#ef4444';
          else if (col === 'tím' || col === 'purple') bgCol = '#a855f7';
          else if (col === 'hồng' || col === 'pink') bgCol = '#ec4899';
          else if (col === 'xám' || col === 'gray' || col === 'grey') bgCol = '#64748b';
          
          colorDotHtml = `<span class="bg-color-dot" style="background-color: ${escapeHtml(bgCol)};" title="Màu: ${escapeHtml(item.color)}"></span>`;
        }

        const lkText = escapeHtml((item.type || '').toUpperCase());
        const kieuText = escapeHtml((item.style || item.status || 'ZIN').toUpperCase());

        return `
          <tr class="${isOut ? 'out-of-stock' : ''}">
            <td style="text-align: left; padding-left: 18px;">
              <div class="bg-cell-devicename">
                ${brandLogo}
                <span class="bg-model-chip">${escapeHtml(item.device || '')}</span>
                ${colorDotHtml}
              </div>
            </td>
            <td style="text-align: center;">
              <span class="bg-cell-linhkien">${lkText}</span>
            </td>
            <td style="text-align: center;">
              <span class="bg-cell-kieu">${kieuText}</span>
            </td>
            <td style="text-align: center;">
              <span class="bg-cell-giaban">${formatPriceStr(item.priceSell)}</span>
            </td>
            <td style="text-align: center;">
              <span class="bg-cell-sl">${qtyNum}</span>
            </td>
            <td style="text-align: center;">
              <div class="bg-actions-cell">
                <button type="button" class="bg-action-btn sell" onclick="sellPartsItem(${item.id})" title="Bán linh kiện này">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </button>
                <button type="button" class="bg-action-btn edit" onclick="openPartsModal(${item.id})" title="Sửa">
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button type="button" class="bg-action-btn clone" onclick="clonePartsItem(${item.id})" title="Tạo bản sao (nhân bản)">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button type="button" class="bg-action-btn del" onclick="deletePartsItem(${item.id})" title="Xóa">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
            <td class="bg-td-cost" style="text-align: center; ${partsHideCost ? 'display: none;' : ''}">
              <span class="bg-cell-gianhap">${formatPriceStr(item.priceCost)}</span>
            </td>
            <td class="bg-td-profit" style="text-align: center; ${partsHideCost ? 'display: none;' : ''}">
              <span class="bg-cell-lai">${formatPriceStr(item.profit)}</span>
            </td>
          </tr>
        `;
      }).join('');
    }

    function openPartsModal(editId = null, isClone = false) {
      const modal = document.getElementById('partsModal');
      if (!modal) return;

      try {
        renderPartsDatalists();
      } catch (err) {
        console.warn('Lỗi render datalist:', err);
      }

      if (editId) {
        const item = partsDatabase.find(x => String(x.id) === String(editId));
        if (item) {
          if (isClone) {
            document.getElementById('partsModalTitle').innerText = 'TẠO BẢN SAO LINH KIỆN';
            document.getElementById('partsEditId').value = '';
          } else {
            document.getElementById('partsModalTitle').innerText = 'SỬA THÔNG TIN LINH KIỆN';
            document.getElementById('partsEditId').value = item.id;
          }
          document.getElementById('partsFormBrand').value = item.brand || '';
          document.getElementById('partsFormDevice').value = item.device || '';
          document.getElementById('partsFormType').value = item.type || '';
          document.getElementById('partsFormStyle').value = item.style || '';
          document.getElementById('partsFormPriceSell').value = item.priceSell || '';
          document.getElementById('partsFormPriceCost').value = item.priceCost || '';
          document.getElementById('partsFormQty').value = item.qty !== undefined ? item.qty : '1';
          document.getElementById('partsFormColor').value = item.color || '';
          calcPartsModalProfit();
        }
      } else {
        document.getElementById('partsModalTitle').innerText = 'THÊM LINH KIỆN MỚI';
        document.getElementById('partsEditId').value = '';

        // Tự động điền Hãng đang chọn (nếu ở tab hãng cụ thể), mặc định IPHONE nếu ở Tất Cả
        let currentBrandVal = (typeof partsCurrentBrand !== 'undefined' && partsCurrentBrand && partsCurrentBrand !== 'ALL') ? partsCurrentBrand : 'IPHONE';

        // Tự động điền Linh Kiện đang chọn, mặc định MÀN HÌNH nếu chọn Tất Cả
        let currentTypeVal = (typeof partsCurrentType !== 'undefined' && partsCurrentType && partsCurrentType !== 'ALL' && partsCurrentType !== 'LINH KIỆN') ? partsCurrentType : 'MÀN HÌNH';

        // Tự động điền Kiểu đang chọn, mặc định ZIN nếu chọn Tất Cả
        let currentStyleVal = (typeof partsCurrentStyle !== 'undefined' && partsCurrentStyle && partsCurrentStyle !== 'ALL' && partsCurrentStyle !== 'KIỂU') ? partsCurrentStyle : 'ZIN';

        document.getElementById('partsFormBrand').value = currentBrandVal;
        document.getElementById('partsFormDevice').value = '';
        document.getElementById('partsFormType').value = currentTypeVal;
        document.getElementById('partsFormStyle').value = currentStyleVal;
        document.getElementById('partsFormPriceSell').value = '';
        document.getElementById('partsFormPriceCost').value = '';
        document.getElementById('partsFormQty').value = '1';
        document.getElementById('partsFormColor').value = '';
        document.getElementById('partsFormProfitDisplay').innerText = '0';
      }

      modal.classList.add('active');
      modal.style.display = 'flex';
    }

    function closePartsModal() {
      const modal = document.getElementById('partsModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }

    function adjustPartsModalQty(delta) {
      const qtyInput = document.getElementById('partsFormQty');
      if (!qtyInput) return;
      let val = parseInt(qtyInput.value, 10) || 0;
      val = Math.max(0, val + delta);
      qtyInput.value = val;
    }

    function calcPartsModalProfit() {
      const pSellInput = document.getElementById('partsFormPriceSell');
      const pCostInput = document.getElementById('partsFormPriceCost');
      const profitDisplay = document.getElementById('partsFormProfitDisplay');
      if (!pSellInput || !pCostInput || !profitDisplay) return;

      let sellVal = parseFloat(pSellInput.value.replace(/\./g, '')) || 0;
      let costVal = parseFloat(pCostInput.value.replace(/\./g, '')) || 0;
      let profit = sellVal - costVal;

      profitDisplay.innerText = formatNumberDisplay(profit);
    }

    function savePartsItem(e) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }

      try {
        const editIdStr = document.getElementById('partsEditId') ? document.getElementById('partsEditId').value : '';
        const brand = (document.getElementById('partsFormBrand') ? document.getElementById('partsFormBrand').value : '').trim().toUpperCase();
        const device = (document.getElementById('partsFormDevice') ? document.getElementById('partsFormDevice').value : '').trim();
        const type = (document.getElementById('partsFormType') ? document.getElementById('partsFormType').value : '').trim().toUpperCase();
        const style = (document.getElementById('partsFormStyle') ? document.getElementById('partsFormStyle').value : '').trim();
        const priceSell = (document.getElementById('partsFormPriceSell') ? document.getElementById('partsFormPriceSell').value : '').trim();
        const priceCost = (document.getElementById('partsFormPriceCost') ? document.getElementById('partsFormPriceCost').value : '').trim();
        const qty = parseInt(document.getElementById('partsFormQty') ? document.getElementById('partsFormQty').value : '1', 10) || 0;
        const color = (document.getElementById('partsFormColor') ? document.getElementById('partsFormColor').value : '').trim();

        let sellVal = parseFloat(priceSell.replace(/\./g, '')) || 0;
        let costVal = parseFloat(priceCost.replace(/\./g, '')) || 0;
        let profit = (typeof formatNumberDisplay === 'function') ? formatNumberDisplay(sellVal - costVal) : (sellVal - costVal);

        if (!brand || !device || !type || !priceSell || !priceCost) {
          alert('Vui lòng điền đầy đủ các thông tin: Hãng, Tên máy, Linh kiện, Giá bán, Giá nhập!');
          return;
        }

        if (editIdStr) {
          const editId = parseInt(editIdStr, 10);
          const idx = partsDatabase.findIndex(x => x.id === editId);
          if (idx !== -1) {
            const oldData = JSON.parse(JSON.stringify(partsDatabase[idx]));
            partsDatabase[idx] = {
              ...partsDatabase[idx],
              brand, device, type, style, priceSell, priceCost, profit, qty, color
            };
            if (typeof logActivity === 'function') {
              try {
                logActivity('EDIT', 'linhkien', 'Linh kiện', `Sửa linh kiện: ${brand} ${device} (${type}) - Bán: ${priceSell}`, oldData, partsDatabase[idx], editId);
              } catch(err) {}
            }
          }
        } else {
          const newItem = {
            id: Date.now(),
            brand, device, type, style, priceSell, priceCost, profit, qty, color
          };
          partsDatabase.unshift(newItem);
          if (typeof logActivity === 'function') {
            try {
              logActivity('ADD', 'linhkien', 'Linh kiện', `Thêm linh kiện: ${brand} ${device} (${type}) - Bán: ${priceSell}`, null, newItem, newItem.id);
            } catch(err) {}
          }
        }

        savePartsStorage();
        if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
        if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();
        if (typeof renderPartsDatalists === 'function') renderPartsDatalists();
        if (typeof renderPartsTable === 'function') renderPartsTable();
        closePartsModal();
      } catch (err) {
        console.error('Lỗi khi lưu linh kiện:', err);
        alert('Có lỗi xảy ra khi lưu: ' + err.message);
      }
    }

    function clonePartsItem(id) {
      openPartsModal(id, true);
    }

    function sellPartsItem(id) {
      const item = partsDatabase.find(x => String(x.id) === String(id));
      if (!item) return;

      const qty = parseInt(item.qty, 10) || 0;
      if (qty <= 0) {
        if (!confirm('Linh kiện này hiện đang HẾT HÀNG (SL: 0). Bạn có muốn tiếp tục tạo đơn?')) {
          return;
        }
      }

      // Mở modal tạo đơn sửa chữa hoặc phiếu bán hàng
      if (typeof openRepairModal === 'function') {
        openRepairModal();
        const rDev = document.getElementById('rFormDevice');
        const rIssue = document.getElementById('rFormIssue');
        const rPrice = document.getElementById('rFormPrice');
        const rCost = document.getElementById('rFormCost');
        if (rDev) rDev.value = `${item.brand || ''} ${item.device || ''}`.trim();
        if (rIssue) rIssue.value = `Thay ${item.type || 'Linh kiện'} (${item.style || 'Zin'})`;
        if (rPrice) rPrice.value = formatPriceStr(item.priceSell);
        if (rCost) rCost.value = formatPriceStr(item.priceCost);
        if (typeof updateRepairFormProfit === 'function') updateRepairFormProfit();
      } else if (typeof openTicketModal === 'function') {
        openTicketModal();
        const tName = document.getElementById('tItemName');
        const tPriceOut = document.getElementById('tPriceOut');
        const tPriceIn = document.getElementById('tPriceIn');
        if (tName) tName.value = `${item.device} - ${item.type} (${item.style || 'ZIN'})`;
        if (tPriceOut) tPriceOut.value = formatPriceStr(item.priceSell);
        if (tPriceIn) tPriceIn.value = formatPriceStr(item.priceCost);
      }
    }

    function deletePartsItem(id) {
      const item = partsDatabase.find(x => String(x.id) === String(id));
      if (!item) return;

      if (confirm(`Bạn có chắc chắn muốn xóa linh kiện "${item.device} - ${item.type}" khỏi danh sách?`)) {
        partsDatabase = partsDatabase.filter(x => String(x.id) !== String(id));
        savePartsStorage();
        if (typeof logActivity === 'function') {
          try {
            logActivity('DELETE', 'linhkien', 'Linh kiện', `Xóa linh kiện: ${item.brand || ''} ${item.device} (${item.type})`, item, null, id);
          } catch(e) {}
        }
        if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
        if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();
        if (typeof renderPartsDatalists === 'function') renderPartsDatalists();
        if (typeof renderPartsTable === 'function') renderPartsTable();
      }
    }

    function getPartsCustomKey(type) {
      return 'KIMCHI_PARTS_CUSTOM_' + (type || 'COMMON').toUpperCase();
    }

    function getPartsCustomOptions(type) {
      try {
        const stored = localStorage.getItem(getPartsCustomKey(type));
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    function savePartsCustomOptions(type, list) {
      try {
        localStorage.setItem(getPartsCustomKey(type), JSON.stringify(list || []));
      } catch (e) {}
    }

    function getPartsOptionField(type) {
      if (type === 'brand') return 'brand';
      if (type === 'device') return 'device';
      if (type === 'type') return 'type';
      if (type === 'style') return 'style';
      return null;
    }

    function getPartsLabelName(type) {
      if (type === 'brand') return 'Hãng';
      if (type === 'device') return 'Tên máy';
      if (type === 'type') return 'Loại linh kiện';
      if (type === 'style') return 'Kiểu';
      return 'mục';
    }

    function getAllPartsOptionsForType(type) {
      const field = getPartsOptionField(type);
      let set = new Set();
      if (type === 'brand') {
        ['IPHONE', 'SAMSUNG', 'OPPO', 'XIAOMI', 'REALME', 'VIVO', 'IPAD'].forEach(b => set.add(b));
      } else if (type === 'type') {
        ['MÀN HÌNH', 'PIN', 'LƯNG', 'KÍNH', 'CÁP SẠC', 'CAMERA', 'VỎ'].forEach(t => set.add(t));
      } else if (type === 'style') {
        ['ZIN', 'GX', 'JK', 'OLED', 'LÔ - RẺ', 'DẺO', 'BÓC MÁY'].forEach(s => set.add(s));
      }
      if (field && Array.isArray(partsDatabase)) {
        partsDatabase.forEach(item => {
          if (item && item[field]) set.add(String(item[field]).trim());
        });
      }
      const customs = getPartsCustomOptions(type);
      customs.forEach(c => {
        if (c && String(c).trim()) set.add(String(c).trim());
      });
      return Array.from(set).filter(Boolean);
    }

    function addNewPartsOption(type, inputId, promptText) {
      const input = document.getElementById(inputId);
      const currentVal = input ? input.value.trim() : '';
      let clean = '';

      if (currentVal !== '') {
        clean = currentVal;
      } else {
        let val = prompt(promptText || `Thêm ${getPartsLabelName(type)} mới:`);
        if (val && val.trim()) clean = val.trim();
      }

      if (clean) {
        if (input) input.value = clean;
        let customs = getPartsCustomOptions(type);
        if (!customs.some(x => x.toLowerCase() === clean.toLowerCase())) {
          customs.push(clean);
          savePartsCustomOptions(type, customs);
        }
        renderPartsDatalists();
        if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
        if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();
        alert(`✓ Đã thêm "${clean}" thành công!`);
      }
    }

    function editPartsOption(type, inputId, promptText) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const currentVal = input.value.trim();
      let val = prompt(promptText || `Sửa ${getPartsLabelName(type)}:`, currentVal);
      if (val !== null && val.trim()) {
        const newVal = val.trim();
        input.value = newVal;

        let customs = getPartsCustomOptions(type);
        const customIdx = customs.findIndex(x => x.toLowerCase() === currentVal.toLowerCase());
        if (customIdx !== -1) {
          customs[customIdx] = newVal;
        } else {
          customs.push(newVal);
        }
        savePartsCustomOptions(type, customs);

        const field = getPartsOptionField(type);
        if (field && Array.isArray(partsDatabase)) {
          let count = 0;
          partsDatabase.forEach(item => {
            if (item && item[field] && String(item[field]).toLowerCase() === currentVal.toLowerCase()) {
              item[field] = newVal;
              count++;
            }
          });
          if (count > 0) {
            savePartsStorage();
            if (typeof renderPartsTable === 'function') renderPartsTable();
          }
        }

        renderPartsDatalists();
        if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
        if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();
        alert(`✓ Đã đổi thành "${newVal}" thành công!`);
      }
    }

    function deletePartsOption(type, inputId) {
      const input = document.getElementById(inputId);
      const label = getPartsLabelName(type);
      const allOptions = getAllPartsOptionsForType(type);

      let targetVal = input ? input.value.trim() : '';

      if (!targetVal) {
        let pick = prompt(`Nhập chính xác ${label} muốn xóa khỏi danh mục:\n(Hiện có: ${allOptions.join(', ')})`);
        if (!pick || !pick.trim()) return;
        targetVal = pick.trim();
      }

      const cleanLower = targetVal.toLowerCase();
      const matched = allOptions.find(o => o.toLowerCase() === cleanLower) || targetVal;

      if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn "${matched}" khỏi danh mục gợi ý ${label} không?`)) {
        return;
      }

      // 1. Xóa khỏi danh sách custom tùy chỉnh
      let customs = getPartsCustomOptions(type);
      customs = customs.filter(x => x.toLowerCase() !== cleanLower);
      savePartsCustomOptions(type, customs);

      // 2. Xóa hoặc làm rỗng trường này trong partsDatabase nếu có linh kiện đang dùng
      const field = getPartsOptionField(type);
      let updatedCount = 0;
      if (field && Array.isArray(partsDatabase)) {
        partsDatabase.forEach(item => {
          if (item && item[field] && String(item[field]).toLowerCase() === cleanLower) {
            item[field] = '';
            updatedCount++;
          }
        });
        if (updatedCount > 0) {
          savePartsStorage();
          if (typeof renderPartsTable === 'function') renderPartsTable();
        }
      }

      // 3. Xóa giá trị trong ô nhập nếu đang hiển thị
      if (input && input.value.trim().toLowerCase() === cleanLower) {
        input.value = '';
        if (typeof closeUniversalSmartDropdown === 'function') closeUniversalSmartDropdown();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
      }

      // 4. Cập nhật lại datalists và bộ lọc giao diện
      renderPartsDatalists();
      if (typeof renderPartsTypeTabs === 'function') renderPartsTypeTabs();
      if (typeof renderPartsStyleTabs === 'function') renderPartsStyleTabs();

      alert(`✓ Đã xóa "${matched}" khỏi danh mục ${label} thành công!`);
    }

    function renderPartsDatalists() {
      const brands = getAllPartsOptionsForType('brand');
      const devices = getAllPartsOptionsForType('device');
      const types = getAllPartsOptionsForType('type');
      const styles = getAllPartsOptionsForType('style');

      const dlBrand = document.getElementById('partsBrandDatalist');
      if (dlBrand) {
        dlBrand.innerHTML = brands.map(b => `<option value="${escapeHtml(b)}"></option>`).join('');
      }

      const dlDevice = document.getElementById('partsDeviceDatalist');
      if (dlDevice) {
        dlDevice.innerHTML = devices.map(d => `<option value="${escapeHtml(d)}"></option>`).join('');
      }

      const dlType = document.getElementById('partsTypeDatalist');
      if (dlType) {
        dlType.innerHTML = types.map(t => `<option value="${escapeHtml(t)}"></option>`).join('');
      }

      const dlStyle = document.getElementById('partsStyleDatalist');
      if (dlStyle) {
        dlStyle.innerHTML = styles.map(s => `<option value="${escapeHtml(s)}"></option>`).join('');
      }
    }

    // Gắn vào window để gọi từ onclick trong HTML
    window.openPartsModal = openPartsModal;
    window.closePartsModal = closePartsModal;
    window.adjustPartsModalQty = adjustPartsModalQty;
    window.calcPartsModalProfit = calcPartsModalProfit;
    window.savePartsItem = savePartsItem;
    window.clonePartsItem = clonePartsItem;
    window.sellPartsItem = sellPartsItem;
    window.deletePartsItem = deletePartsItem;
    window.selectPartsBrandTab = selectPartsBrandTab;
    window.selectPartsTypeTab = selectPartsTypeTab;
    window.selectPartsStyleTab = selectPartsStyleTab;
    window.renderPartsTypeTabs = renderPartsTypeTabs;
    window.renderPartsStyleTabs = renderPartsStyleTabs;
    window.addNewBrandTab = addNewBrandTab;
    window.togglePartsCostVisibility = togglePartsCostVisibility;
    window.handlePartsSearchFilter = handlePartsSearchFilter;
    window.clearPartsSearch = clearPartsSearch;
    window.handlePartsSearchKeydown = handlePartsSearchKeydown;
    window.selectPartsSearchSuggestion = selectPartsSearchSuggestion;
    window.hidePartsSearchSuggestions = hidePartsSearchSuggestions;
    window.handlePartsPriceFilterChange = handlePartsPriceFilterChange;
    window.handlePartsStatusFilterChange = handlePartsStatusFilterChange;
    if (typeof toggleQuoteExcelExportMenu !== 'undefined') window.toggleQuoteExcelExportMenu = toggleQuoteExcelExportMenu;
    if (typeof triggerQuoteExcelImport !== 'undefined') window.triggerQuoteExcelImport = triggerQuoteExcelImport;
    if (typeof handleQuoteExcelImport !== 'undefined') window.handleQuoteExcelImport = handleQuoteExcelImport;
    if (typeof exportPartsExcel !== 'undefined') window.exportPartsExcel = exportPartsExcel;
    if (typeof clearAllPartsQuotes !== 'undefined') window.clearAllPartsQuotes = clearAllPartsQuotes;
    window.addNewPartsOption = addNewPartsOption;
    window.editPartsOption = editPartsOption;
    window.deletePartsOption = deletePartsOption;
    window.renderPartsTable = renderPartsTable;

    /* ========================================================== */
    /* LOGIC SUB-TABS SỬA CHỮA & MÌNH NỢ (CHUẨN 100% 4 ẢNH)      */
    /* ========================================================== */

    // Sub-tab switcher
    let currentRepairSubTab = 'suachua';
    function switchRepairSubTab(tab) {
      currentRepairSubTab = tab;
      const btnRep = document.getElementById('btnSubtabRepair');
      const btnDebt = document.getElementById('btnSubtabDebt');
      const viewRep = document.getElementById('subtab-repair-list');
      const viewDebt = document.getElementById('subtab-repair-debt');

      if (btnRep) btnRep.classList.toggle('active', tab === 'suachua');
      if (btnDebt) btnDebt.classList.toggle('active', tab === 'minhno');
      if (viewRep) viewRep.classList.toggle('active', tab === 'suachua');
      if (viewDebt) viewDebt.classList.toggle('active', tab === 'minhno');

      if (tab === 'suachua') {
        renderRepairTable();
      } else {
        renderMyDebtTable();
      }
    }

    // ==========================================
    // 1. DỮ LIỆU & LOGIC SỬA CHỮA (ẢNH 1 & 2)
    // ==========================================
    const DEFAULT_REPAIR_DATA = [
      {
        id: 1,
        customer: 'Khách lẻ',
        device: 'iPhone 11',
        issue: 'Thay Màn Hình',
        warranty: '3 tháng',
        price: 500,
        cost: 220,
        profit: 280,
        dateFormatted: '24/10/2026',
        timeFormatted: '17:52',
        status: 'Đã thanh toán',
        method: 'Tiền mặt'
      }
    ];

    // Dữ liệu Sửa Chữa: Khởi tạo an toàn kèm đồng bộ Firebase Firestore
    let repairDatabase = [];
    try {
      const repRaw = localStorage.getItem('KIMCHI_REPAIR_DB');
      if (repRaw) {
        repairDatabase = JSON.parse(repRaw) || [];
      } else if (Array.isArray(window.SEED_REPAIRS_DATA) && window.SEED_REPAIRS_DATA.length > 0) {
        repairDatabase = JSON.parse(JSON.stringify(window.SEED_REPAIRS_DATA));
      } else {
        repairDatabase = DEFAULT_REPAIR_DATA;
      }
    } catch(e) {
      repairDatabase = DEFAULT_REPAIR_DATA;
    }

    function saveRepairDb(itemToSync) {
      try { localStorage.setItem('KIMCHI_REPAIR_DB', JSON.stringify(repairDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('repairs').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          repairDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('repairs').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
      if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
    }
    const saveRepairStorage = saveRepairDb;

    let repairFilterDate = getVietnamDate();
    let repairIsAllMonth = false;
    let repairHidePaid = false;

    function openRepairDatePicker() {
      const picker = document.getElementById('repairHiddenDatePicker');
      if (picker) {
        const yyyy = repairFilterDate.getFullYear();
        const mm = String(repairFilterDate.getMonth() + 1).padStart(2, '0');
        const dd = String(repairFilterDate.getDate()).padStart(2, '0');
        picker.value = `${yyyy}-${mm}-${dd}`;
        picker.showPicker ? picker.showPicker() : picker.click();
      }
    }

    function handleRepairDatePicked(val) {
      if (!val) return;
      const parts = val.split('-');
      if (parts.length === 3) {
        repairFilterDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        updateRepairDateDisplay();
        renderRepairTable();
      }
    }

    let repairViewMode = 'day';
    let currentRepairMonthFilter = { month: repairFilterDate.getMonth(), year: repairFilterDate.getFullYear() };
    let currentRepairYearFilter = repairFilterDate.getFullYear();

    function setRepairMode(mode) {
      repairViewMode = mode;
      const selMode = document.getElementById('repairModeSelect');
      if (selMode) selMode.value = mode;
      const btnDay = document.getElementById('repairModeDayBtn');
      const btnMonth = document.getElementById('repairModeMonthBtn');
      const btnYear = document.getElementById('repairModeYearBtn');
      const dayBox = document.getElementById('repairDateFilterBox');
      const monthBox = document.getElementById('repairMonthFilterBox');
      const yearBox = document.getElementById('repairYearFilterBox');

      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnYear) btnYear.classList.toggle('active', mode === 'year');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderRepairTable();
    }
    window.setRepairMode = setRepairMode;

    function changeRepairFilterDate(delta) {
      repairFilterDate.setDate(repairFilterDate.getDate() + delta);
      updateRepairDateDisplay();
      renderRepairTable();
    }
    window.changeRepairFilterDate = changeRepairFilterDate;

    function changeRepairFilterMonth(delta) {
      currentRepairMonthFilter.month += delta;
      if (currentRepairMonthFilter.month > 11) {
        currentRepairMonthFilter.month = 0;
        currentRepairMonthFilter.year++;
      } else if (currentRepairMonthFilter.month < 0) {
        currentRepairMonthFilter.month = 11;
        currentRepairMonthFilter.year--;
      }
      const mm = String(currentRepairMonthFilter.month + 1).padStart(2, '0');
      const el = document.getElementById('filterRepairMonthDisplay');
      if (el) el.innerText = `${mm}/${currentRepairMonthFilter.year}`;
      renderRepairTable();
    }
    window.changeRepairFilterMonth = changeRepairFilterMonth;

    function changeRepairFilterYear(delta) {
      currentRepairYearFilter += delta;
      const el = document.getElementById('filterRepairYearDisplay');
      if (el) el.innerText = String(currentRepairYearFilter);
      renderRepairTable();
    }
    window.changeRepairFilterYear = changeRepairFilterYear;

    function updateRepairDateDisplay() {
      const disp = document.getElementById('filterRepairDateDisplay');
      if (disp) {
        const dd = String(repairFilterDate.getDate()).padStart(2, '0');
        const mm = String(repairFilterDate.getMonth() + 1).padStart(2, '0');
        const yyyy = repairFilterDate.getFullYear();
        disp.innerText = `${dd}/${mm}/${yyyy}`;
      }
    }

    function toggleRepairHidePaid() {
      repairHidePaid = !repairHidePaid;
      const btn = document.getElementById('btnRepairToggleHide');
      if (btn) {
        btn.style.color = repairHidePaid ? '#f59e0b' : '#94a3b8';
      }
      renderRepairTable();
    }

    function handleRepairSearchInput(val) {
      const btnClear = document.getElementById('btnClearRepairSearch');
      if (btnClear) {
        btnClear.style.display = (val && val.trim()) ? 'block' : 'none';
      }
      renderRepairTable();
    }

    function clearRepairSearch() {
      const inp = document.getElementById('repairSearchInput');
      if (inp) inp.value = '';
      const btnClear = document.getElementById('btnClearRepairSearch');
      if (btnClear) btnClear.style.display = 'none';
      renderRepairTable();
    }

    function updateRepairPayButtonVisibility() {
      const btnPay = document.getElementById('btnRepairBatchPay');
      const selected = document.querySelectorAll('.repair-item-chk:checked');
      if (btnPay) {
        btnPay.style.display = (selected && selected.length > 0) ? 'inline-flex' : 'none';
      }
    }

    function renderRepairTable() {
      const tbody = document.getElementById('repairTableBody');
      if (!tbody) return;

      const filterStatus = document.getElementById('repairFilterStatus') ? document.getElementById('repairFilterStatus').value : 'ALL';
      const searchVal = document.getElementById('repairSearchInput') ? document.getElementById('repairSearchInput').value.trim().toLowerCase() : '';

      const targetDD = String(repairFilterDate.getDate()).padStart(2, '0');
      const targetMM = String(repairFilterDate.getMonth() + 1).padStart(2, '0');
      const targetYYYY = String(repairFilterDate.getFullYear());
      const targetDateStr = `${targetDD}/${targetMM}/${targetYYYY}`;

      const filterMonthMM = String(currentRepairMonthFilter.month + 1).padStart(2, '0');
      const filterMonthYYYY = String(currentRepairMonthFilter.year);
      const targetMonthStr = `/${filterMonthMM}/${filterMonthYYYY}`;

      let filtered = repairDatabase.filter(item => {
        // Tìm kiếm: khi tìm thì lọc theo toàn bộ máy đã sửa chữa, không phải lọc theo ngày hiện tại
        if (searchVal) {
          const matchStr = `${item.customer} ${item.device} ${item.issue} ${item.warranty || ''}`.toLowerCase();
          if (!matchStr.includes(searchVal)) return false;
        } else {
          // Lọc ngày hoặc tháng hoặc năm khi KHÔNG tìm kiếm
          if (repairViewMode === 'day') {
            if (item.dateFormatted && item.dateFormatted !== targetDateStr) return false;
          } else if (repairViewMode === 'month') {
            if (item.dateFormatted && !item.dateFormatted.endsWith(targetMonthStr)) return false;
          } else if (repairViewMode === 'year') {
            if (item.dateFormatted && !item.dateFormatted.endsWith('/' + currentRepairYearFilter)) return false;
          }
        }

        // Lọc trạng thái
        if (filterStatus !== 'ALL') {
          if (item.status !== filterStatus) return false;
        }

        // Ẩn đơn đã thanh toán
        if (repairHidePaid && item.status === 'Đã thanh toán') {
          return false;
        }

        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2.5rem; color: #64748b; font-weight: 700;">Không có đơn sửa chữa nào phù hợp.</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map((item, index) => {
          // Định dạng ngày hiển thị: "26/10/2026 17:24"
          let fullDateStr = '26/10/2026';
          if (item.dateFormatted) {
            const dp = item.dateFormatted.replace(/-/g, '/').split('/');
            if (dp.length === 3) {
              fullDateStr = `${dp[0].padStart(2, '0')}/${dp[1].padStart(2, '0')}/${dp[2]}`;
            } else {
              fullDateStr = item.dateFormatted;
            }
          }
          const timePart = item.timeFormatted || '00:00';
          const isWhiteRow = (index % 2 === 0);
          const rowColor = isWhiteRow ? '#ffffff' : '#4ade80';
          const fwDevice = isWhiteRow ? '900' : '800';
          const fwIssue = isWhiteRow ? '900' : '700';
          const fwNum = isWhiteRow ? '900' : '800';

          return `
            <tr>
              <td style="color: ${rowColor}; font-weight: ${fwDevice}; font-size: 1.21rem;">${escapeHtml(formatBrandDeviceName(item.device))}</td>
              <td style="color: ${rowColor}; font-weight: ${fwIssue}; font-size: 1.21rem;">${escapeHtml(item.issue || '—')}</td>
              <td style="text-align: center; font-weight: 900; color: ${rowColor}; font-size: 1.21rem;">${formatNumberDisplay(item.price)}</td>
              <td style="text-align: center; font-weight: ${fwNum}; color: ${rowColor}; font-size: 1.10rem;">${formatNumberDisplay(item.cost)}</td>
              <td style="text-align: center; font-weight: ${fwNum}; color: ${rowColor}; font-size: 1.10rem;">${formatNumberDisplay(item.profit)}</td>
              <td style="text-align: center; font-weight: ${fwNum}; color: ${rowColor}; font-size: 1.10rem;">${escapeHtml(formatWarrantyDisplay(item.warranty))}</td>
              <td style="text-align: center;" class="cell-repair-time">
                <span class="date-part" style="color: #38bdf8; font-weight: 800; font-size: 1.10rem;">${fullDateStr}</span>
              </td>
              <td class="repair-col-actions">
                <div class="action-btn-group" style="justify-content: center; gap: 4px;">
                  <button type="button" class="action-btn-icon action-btn-edit" onclick="editRepairItem(${item.id})" title="Sửa đơn">
                    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button type="button" class="action-btn-icon action-btn-del" onclick="deleteRepairItem(${item.id})" title="Xóa đơn">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </td>
              <td class="repair-col-payment" style="text-align: center; vertical-align: middle;">
                <span class="${(item.status === 'Nợ' || item.paymentStatus === 'Nợ Dai VL') ? 'badge-payment-debt' : 'badge-payment-paid'}" style="cursor: default; user-select: none; white-space: nowrap; ${(item.status === 'Nợ' || item.paymentStatus === 'Nợ Dai VL') ? '' : 'color: #ffffff !important;'}">
                  ${(item.status === 'Nợ' || item.paymentStatus === 'Nợ Dai VL') ? '💀 NỢ DAI VL' : '✔ ĐÃ TRẢ <span style="font-size: 0.95rem; margin-left: 2px;">💰</span>'}
                </span>
              </td>
            </tr>
          `;
        }).join('');
      }

      // Cập nhật thống kê Footer sửa chữa
      let sumTM = 0, countTM = 0;
      let sumCK = 0, countCK = 0;
      let sumNo = 0, countNo = 0;
      let sumTotal = 0, countTotal = filtered.length;
      let sumCost = 0;
      let sumProfit = 0;

      filtered.forEach(it => {
        const pr = Number(it.price) || 0;
        const cs = Number(it.cost) || 0;
        const pf = pr - cs; // Chuẩn hóa: Lãi luôn bằng Báo giá - Vốn
        it.profit = pf;
        sumTotal += pr;
        sumCost += cs;
        sumProfit += pf;

        if (it.status === 'Nợ') {
          sumNo += pr;
          countNo++;
        } else {
          if (it.method === 'Chuyển khoản') {
            sumCK += pr;
            countCK++;
          } else {
            sumTM += pr;
            countTM++;
          }
        }
      });

      const elTM = document.getElementById('rSumTM');
      if (elTM) elTM.innerText = formatNumberDisplay(sumTM);
      const elCountTM = document.getElementById('rCountTM');
      if (elCountTM) elCountTM.innerText = countTM;

      const elCK = document.getElementById('rSumCK');
      if (elCK) elCK.innerText = formatNumberDisplay(sumCK);
      const elCountCK = document.getElementById('rCountCK');
      if (elCountCK) elCountCK.innerText = countCK;

      const elNo = document.getElementById('rSumNo');
      if (elNo) elNo.innerText = formatNumberDisplay(sumNo);
      const elCountNo = document.getElementById('rCountNo');
      if (elCountNo) elCountNo.innerText = countNo;

      const elTot = document.getElementById('rSumTotal');
      if (elTot) elTot.innerText = formatNumberDisplay(sumTotal);
      const elCountTot = document.getElementById('rCountTotal');
      if (elCountTot) elCountTot.innerText = countTotal;

      const elCost = document.getElementById('rSumCost');
      if (elCost) elCost.innerText = formatNumberDisplay(sumCost);

      const elPf = document.getElementById('rSumProfit');
      if (elPf) elPf.innerText = formatNumberDisplay(sumProfit);

      // Cập nhật ô Lợi Nhuận trên góc tạo đơn mới (Lãi Ngày / Lãi Tháng)
      const profitLabel = document.getElementById('repairProfitHeaderLabel');
      const profitVal = document.getElementById('repairProfitHeaderVal');
      if (profitLabel) {
        profitLabel.innerText = repairViewMode === 'month' ? 'Lãi Tháng:' : (repairViewMode === 'day' ? 'Lãi Ngày:' : (repairViewMode === 'year' ? 'Lãi Năm:' : 'Tổng Lãi:'));
      }
      if (profitVal) {
        profitVal.innerText = formatNumberDisplay(sumProfit);
      }

      // TÍNH TOÁN DOANH THU & LÃI (NGÀY, THÁNG, NĂM) CHO 2 BADGE TRÊN ĐẦU
      let repairDayRev = 0;
      let repairDayProf = 0;
      let repairMonthRev = 0;
      let repairMonthProf = 0;
      let repairYearRev = 0;
      let repairYearProf = 0;

      const targetMonthNum = currentRepairMonthFilter.month;
      const targetYearNum = currentRepairMonthFilter.year;

      repairDatabase.forEach(item => {
        const pr = Number(item.price) || 0;
        const cs = Number(item.cost) || 0;
        const pf = pr - cs;
        item.profit = pf;
        const dStr = (item.dateFormatted || '').trim();

        if (dStr === targetDateStr) {
          repairDayRev += pr;
          repairDayProf += pf;
        }

        const dp = dStr.split('/');
        if (dp.length === 3) {
          const m = parseInt(dp[1], 10) - 1;
          const y = parseInt(dp[2], 10);
          if (m === targetMonthNum && y === targetYearNum) {
            repairMonthRev += pr;
            repairMonthProf += pf;
          }
          if (y === currentRepairYearFilter) {
            repairYearRev += pr;
            repairYearProf += pf;
          }
        }
      });

      const rMRevEl = document.getElementById('repairMonthRevenueVal');
      const rDRevEl = document.getElementById('repairDayRevenueVal');
      const rMProfEl = document.getElementById('repairMonthProfitVal');
      const rDProfEl = document.getElementById('repairDayProfitVal');
      const revBadge = document.getElementById('repairRevenueBadge');
      const profBadge = document.getElementById('repairProfitBadge');

      if (repairViewMode === 'year') {
        if (rMRevEl) {
          rMRevEl.innerText = formatNumberDisplay(repairYearRev);
          rMRevEl.title = `Doanh thu Năm ${currentRepairYearFilter}`;
        }
        if (rDRevEl) {
          rDRevEl.innerText = formatNumberDisplay(repairDayRev);
          rDRevEl.title = 'Doanh thu Ngày';
        }
        if (revBadge) {
          revBadge.title = `Bên trái: Doanh thu Năm ${currentRepairYearFilter} | Bên phải: Doanh thu Ngày`;
        }

        if (rMProfEl) {
          rMProfEl.innerText = formatNumberDisplay(repairYearProf);
          rMProfEl.title = `Lãi Năm ${currentRepairYearFilter}`;
        }
        if (rDProfEl) {
          rDProfEl.innerText = formatNumberDisplay(repairDayProf);
          rDProfEl.title = 'Lãi Ngày';
        }
        if (profBadge) {
          profBadge.title = `Bên trái: Lãi Năm ${currentRepairYearFilter} | Bên phải: Lãi Ngày`;
        }
      } else if (repairViewMode === 'day') {
        if (rMRevEl) {
          rMRevEl.innerText = formatNumberDisplay(repairMonthRev);
          rMRevEl.title = `Doanh thu Tháng ${targetMonthNum + 1}/${targetYearNum}`;
        }
        if (rDRevEl) {
          rDRevEl.innerText = formatNumberDisplay(repairDayRev);
          rDRevEl.title = `Doanh thu Ngày ${targetDateStr}`;
        }
        if (revBadge) {
          revBadge.title = `Bên trái: Doanh thu Tháng ${targetMonthNum + 1}/${targetYearNum} | Bên phải: Doanh thu Ngày ${targetDateStr}`;
        }

        if (rMProfEl) {
          rMProfEl.innerText = formatNumberDisplay(repairMonthProf);
          rMProfEl.title = `Lãi Tháng ${targetMonthNum + 1}/${targetYearNum}`;
        }
        if (rDProfEl) {
          rDProfEl.innerText = formatNumberDisplay(repairDayProf);
          rDProfEl.title = `Lãi Ngày ${targetDateStr}`;
        }
        if (profBadge) {
          profBadge.title = `Bên trái: Lãi Tháng ${targetMonthNum + 1}/${targetYearNum} | Bên phải: Lãi Ngày ${targetDateStr}`;
        }
      } else {
        if (rMRevEl) {
          rMRevEl.innerText = formatNumberDisplay(repairMonthRev);
          rMRevEl.title = `Doanh thu Tháng ${targetMonthNum + 1}/${targetYearNum}`;
        }
        if (rDRevEl) {
          rDRevEl.innerText = formatNumberDisplay(repairDayRev);
          rDRevEl.title = 'Doanh thu Ngày';
        }
        if (revBadge) {
          revBadge.title = `Bên trái: Doanh thu Tháng ${targetMonthNum + 1}/${targetYearNum} | Bên phải: Doanh thu Ngày`;
        }

        if (rMProfEl) {
          rMProfEl.innerText = formatNumberDisplay(repairMonthProf);
          rMProfEl.title = `Lãi Tháng ${targetMonthNum + 1}/${targetYearNum}`;
        }
        if (rDProfEl) {
          rDProfEl.innerText = formatNumberDisplay(repairDayProf);
          rDProfEl.title = 'Lãi Ngày';
        }
        if (profBadge) {
          profBadge.title = `Bên trái: Lãi Tháng ${targetMonthNum + 1}/${targetYearNum} | Bên phải: Lãi Ngày`;
        }
      }

      // CẬP NHẬT ICON LÃI NGÀY SỬA CHỮA: 0 - 999 MẶT KHÓC, >= 1000 MẶT CƯỜI
      const repairProfitEmojiEl = document.getElementById('repairProfitEmojiIcon');
      if (repairProfitEmojiEl) {
        let rDayProfitVal = parsePriceNum(repairDayProf);
        if (rDayProfitVal >= 1000) {
          repairProfitEmojiEl.src = 'img/icon_happy.png';
          repairProfitEmojiEl.title = 'Lãi ngày: ' + formatNumberDisplay(repairDayProf) + ' (Đạt từ 1.000 trở lên)';
        } else {
          repairProfitEmojiEl.src = 'img/icon_crying.png';
          repairProfitEmojiEl.title = 'Lãi ngày: ' + formatNumberDisplay(repairDayProf) + ' (Từ 0 - 999)';
        }
      }

      updateRepairPayButtonVisibility();
      if (typeof updateSidebarOverallProfits === 'function') {
        updateSidebarOverallProfits();
      }
    }

    function toggleRepairPaymentStatus(id) {
      const item = repairDatabase.find(x => x.id === id);
      if (item) {
        if (item.status === 'Nợ' || item.paymentStatus === 'Nợ Dai VL') {
          item.status = 'Đã thanh toán';
          item.paymentStatus = 'Đã Trả';
        } else {
          item.status = 'Nợ';
          item.paymentStatus = 'Nợ Dai VL';
        }
        saveRepairStorage();
        renderRepairTable();
        if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
      }
    }

    function toggleSelectAllRepair(masterChk) {
      const chks = document.querySelectorAll('.repair-item-chk');
      chks.forEach(c => c.checked = masterChk.checked);
      updateRepairPayButtonVisibility();
    }

    function batchPaySelectedRepairs() {
      const selected = Array.from(document.querySelectorAll('.repair-item-chk:checked')).map(c => Number(c.value));
      if (selected.length === 0) {
        alert('Vui lòng tích chọn ít nhất 1 đơn cần thanh toán!');
        return;
      }
      if (confirm(`Bạn muốn đánh dấu ĐÃ THANH TOÁN cho ${selected.length} đơn đã chọn?`)) {
        repairDatabase.forEach(item => {
          if (selected.includes(item.id)) {
            item.status = 'Đã thanh toán';
          }
        });
        saveRepairDb();
        renderRepairTable();
        const master = document.getElementById('repairSelectAll');
        if (master) master.checked = false;
        updateRepairPayButtonVisibility();
      }
    }

    function togglePayRepairItem(id) {
      const item = repairDatabase.find(x => String(x.id) === String(id));
      if (item) {
        const oldData = JSON.parse(JSON.stringify(item));
        item.status = (item.status === 'Đã thanh toán') ? 'Nợ' : 'Đã thanh toán';
        saveRepairDb();
        if (typeof logActivity === 'function') {
          logActivity('EDIT', 'suachua', 'Sửa chữa', `Đổi trạng thái thanh toán sửa chữa: ${item.customer} - ${item.device} sang ${item.status}`, oldData, item, id);
        }
        renderRepairTable();
      }
    }

    function viewRepairItem(id) {
      const item = repairDatabase.find(x => String(x.id) === String(id));
      if (!item) return;
      alert(`CHI TIẾT ĐƠN SỬA CHỮA:\n- Khách: ${item.customer}\n- Máy: ${item.device}\n- Tình trạng: ${item.issue}\n- Báo giá: ${formatNumberDisplay(item.price)}\n- Vốn: ${formatNumberDisplay(item.cost)}\n- Lãi: ${formatNumberDisplay(item.profit)}\n- Ngày giờ: ${item.dateFormatted} ${item.timeFormatted}\n- Trạng thái: ${item.status}\n- Hình thức: ${item.method}`);
    }

    function copyRepairItem(id) {
      const item = repairDatabase.find(x => String(x.id) === String(id));
      if (!item) return;
      const newItem = {
        ...item,
        id: Date.now(),
        device: item.device + ' (Copy)'
      };
      repairDatabase.unshift(newItem);
      saveRepairDb();
      renderRepairTable();
    }

    function deleteRepairItem(id) {
      const item = repairDatabase.find(x => String(x.id) === String(id));
      if (!item) return;
      let confirmText = prompt(`Bạn có chắc muốn xóa đơn sửa chữa "${item.device}" của ${item.customer} không?\nNhập 'yes' để xác nhận xóa:`);
      if (confirmText && confirmText.trim().toLowerCase() === 'yes') {
        repairDatabase = repairDatabase.filter(x => String(x.id) !== String(id));
        if (typeof db !== 'undefined' && db && id) {
          db.collection('repairs').doc(String(id)).delete().catch(console.error);
        }

        // Tự động xóa đơn bán hàng liên kết (nếu có đơn chuyển khoản đồng bộ sang bán hàng)
        const prevSalesLen = salesDatabase.length;
        salesDatabase = salesDatabase.filter(s => String(s.repairId) !== String(id));
        if (salesDatabase.length !== prevSalesLen) {
          saveSalesStorage();
          if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
        }

        if (typeof logActivity === 'function') {
          logActivity('DELETE', 'suachua', 'Sửa chữa', `Xóa phiếu sửa chữa: ${item.customer} - ${item.device} (${item.issue})`, item, null, id);
        }
        renderRepairTable();
        alert('Đã xóa đơn sửa chữa thành công!');
      } else if (confirmText !== null) {
        alert("Thao tác xóa bị hủy. Bạn phải nhập chính xác chữ 'yes'.");
      }
    }

    // ==========================================
    // QUẢN LÝ DANH MỤC GỢI Ý SỬA CHỮA (ẢNH 2)
    // ==========================================
    const repairDropdownConfigs = {
      customer: {
        listId: 'rCustomerDatalist',
        storageKey: 'KIMCHI_REPAIR_CUSTOMERS',
        defaults: ['Khách lẻ', 'Anh Tuấn', 'Chị Hương']
      },
      device: {
        listId: 'rDeviceDatalist',
        storageKey: 'KIMCHI_REPAIR_DEVICES',
        defaults: ['iPhone 12 PRO MAX', 'iPhone 11', 'iPhone 13 Pro', 'Samsung Galaxy S22']
      },
      issue: {
        listId: 'rIssueDatalist',
        storageKey: 'KIMCHI_REPAIR_ISSUES',
        defaults: ['Thay Màn Hình', 'Thay Pin', 'Ép Kính', 'Sửa Nguồn', 'Thay Chân Sạc']
      },
      warranty: {
        listId: 'rWarrantyDatalist',
        storageKey: 'KIMCHI_REPAIR_WARRANTIES',
        defaults: ['—', '1 tháng', '3 tháng', '6 tháng', '12 tháng']
      }
    };

    function getRepairDropdownItems(type) {
      const cfg = repairDropdownConfigs[type];
      if (!cfg) return [];
      try {
        const saved = localStorage.getItem(cfg.storageKey);
        if (saved !== null) {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) return list;
        }
      } catch (e) {}
      return [...cfg.defaults];
    }

    function saveRepairDropdownItems(type, items) {
      const cfg = repairDropdownConfigs[type];
      if (!cfg) return;
      localStorage.setItem(cfg.storageKey, JSON.stringify(items));
      renderRepairDropdownDatalist(type);
    }

    function renderRepairDropdownDatalist(type) {
      const cfg = repairDropdownConfigs[type];
      if (!cfg) return;
      const datalist = document.getElementById(cfg.listId);
      if (!datalist) return;
      const items = getRepairDropdownItems(type);
      datalist.innerHTML = items.map(v => `<option value="${escapeHtml(v)}">`).join('');
    }

    function renderAllRepairDropdowns() {
      Object.keys(repairDropdownConfigs).forEach(type => renderRepairDropdownDatalist(type));
    }

    function addNewRepairOption(type, inputId, promptText) {
      const input = document.getElementById(inputId);
      const currentVal = input ? input.value.trim() : '';
      let clean = '';

      if (currentVal !== '') {
        clean = currentVal;
      } else {
        const val = prompt(promptText || 'Thêm mục mới:', '');
        if (val && val.trim()) clean = val.trim();
      }

      if (clean !== '') {
        if (input) input.value = clean;
        if (repairDropdownConfigs[type]) {
          let items = getRepairDropdownItems(type);
          let exists = items.some(x => x.toLowerCase().trim() === clean.toLowerCase().trim());
          if (!exists) {
            items.unshift(clean);
            saveRepairDropdownItems(type, items);
            alert(`✓ Đã thêm "${clean}" vào danh sách gợi ý thành công!`);
          } else {
            alert(`Mục "${clean}" đã có sẵn trong danh sách!`);
          }
        }
      }
    }

    function editRepairOption(type, inputId, promptText) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const currentVal = input.value.trim();
      const val = prompt(promptText, currentVal);
      if (val !== null && val.trim()) {
        const newVal = val.trim();
        input.value = newVal;

        if (repairDropdownConfigs[type]) {
          let items = getRepairDropdownItems(type);
          const idx = items.findIndex(x => x.toLowerCase().trim() === currentVal.toLowerCase());
          if (idx !== -1) {
            items[idx] = newVal;
          } else if (!items.some(x => x.toLowerCase().trim() === newVal.toLowerCase())) {
            items.unshift(newVal);
          }
          saveRepairDropdownItems(type, items);
          alert(`✓ Đã cập nhật thành "${newVal}"!`);
        }
      }
    }

    function deleteRepairOption(type, inputId) {
      const input = document.getElementById(inputId);
      const currentVal = input ? input.value.trim() : '';

      if (!repairDropdownConfigs[type]) {
        if (input) input.value = '';
        return;
      }

      let items = getRepairDropdownItems(type);
      if (items.length === 0) {
        alert('Danh sách đang trống!');
        return;
      }

      let targetVal = currentVal;
      if (!targetVal) {
        let pick = prompt(`Nhập chính xác tên mục muốn xóa khỏi danh mục:\n(Hiện có: ${items.join(', ')})`);
        if (!pick || !pick.trim()) return;
        targetVal = pick.trim();
      }

      let cleanTarget = targetVal.toLowerCase().trim();
      let matchIdx = items.findIndex(x => x.toLowerCase().trim() === cleanTarget);

      if (matchIdx === -1) {
        alert(`Không tìm thấy "${targetVal}" trong danh mục gợi ý!`);
        return;
      }

      let actualName = items[matchIdx];
      if (confirm(`Bạn có chắc chắn muốn xóa "${actualName}" khỏi danh sách gợi ý không?`)) {
        items = items.filter((_, idx) => idx !== matchIdx);
        saveRepairDropdownItems(type, items);
        if (input && input.value.trim().toLowerCase() === cleanTarget) {
          input.value = '';
        }
        alert(`Đã xóa "${actualName}" khỏi danh sách thành công!`);
      }
    }

    function clearRepairInput(inputId) {
      const input = document.getElementById(inputId);
      if (input) input.value = '';
      if (typeof updateRepairFormProfit === 'function') updateRepairFormProfit();
    }

    // Tự động kiểm tra và gợi ý thêm vào danh mục nếu người dùng gõ từ mới
    function suggestAddRepairOptionIfNew(type, input) {
      if (!input || !repairDropdownConfigs[type]) return;
      const val = input.value.trim();
      if (!val) return;
      const items = getRepairDropdownItems(type);
      const exists = items.some(x => x.toLowerCase().trim() === val.toLowerCase());
      if (!exists) {
        items.unshift(val);
        saveRepairDropdownItems(type, items);
      }
    }

    window.addNewRepairOption = addNewRepairOption;
    window.editRepairOption = editRepairOption;
    window.deleteRepairOption = deleteRepairOption;
    window.clearRepairInput = clearRepairInput;
    window.suggestAddRepairOptionIfNew = suggestAddRepairOptionIfNew;

    function updateRepairFormProfit() {
      const pInp = document.getElementById('rFormPrice');
      const cInp = document.getElementById('rFormCost');
      const disp = document.getElementById('rFormProfitDisplay');
      if (!disp) return;
      const p = parseRawNumber(pInp ? pInp.value : 0);
      const c = parseRawNumber(cInp ? cInp.value : 0);
      if (p || c) {
        disp.innerText = formatNumberDisplay(p - c);
      } else {
        disp.innerText = '';
      }
    }

    // Modal Sửa Chữa (Ảnh 2)
    function initRepairTimeSelectors() {
      const selHour = document.getElementById('rFormHour');
      const selMin = document.getElementById('rFormMinute');
      if (selHour && selHour.children.length === 0) {
        for (let i = 0; i < 24; i++) {
          const val = String(i).padStart(2, '0');
          selHour.innerHTML += `<option value="${val}">${val}</option>`;
        }
      }
      if (selMin && selMin.children.length === 0) {
        for (let i = 0; i < 60; i++) {
          const val = String(i).padStart(2, '0');
          selMin.innerHTML += `<option value="${val}">${val}</option>`;
        }
      }
    }

    function openRepairModal(editId = null) {
      try {
        if (typeof initRepairTimeSelectors === 'function') initRepairTimeSelectors();
        if (typeof renderAllRepairDropdowns === 'function') renderAllRepairDropdowns();
      } catch (e) {
        console.warn('Lỗi tiền xử lý modal sửa chữa:', e);
      }

      const modal = document.getElementById('repairModal');
      const form = document.getElementById('repairForm');
      const title = document.getElementById('repairModalTitle');
      const btnSubmit = document.getElementById('rBtnSubmit');

      if (!modal) {
        console.error('Không tìm thấy element repairModal!');
        return;
      }
      if (form) form.reset();
      const editIdEl = document.getElementById('repairEditId');
      if (editIdEl) editIdEl.value = '';

      try {
        const now = (typeof getVietnamDate === 'function') ? getVietnamDate() : new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const curHour = String(now.getHours()).padStart(2, '0');
        const curMin = String(now.getMinutes()).padStart(2, '0');

        if (document.getElementById('rFormDate')) document.getElementById('rFormDate').value = `${yyyy}-${mm}-${dd}`;
        if (document.getElementById('rFormHour')) document.getElementById('rFormHour').value = curHour;
        if (document.getElementById('rFormMinute')) document.getElementById('rFormMinute').value = curMin;
      } catch (e) {}

      if (editId !== null && editId !== undefined && editId !== '') {
        const item = (typeof repairDatabase !== 'undefined' && Array.isArray(repairDatabase)) ? repairDatabase.find(x => String(x.id) === String(editId)) : null;
        if (item) {
          if (title) title.innerText = 'CẬP NHẬT ĐƠN SỬA CHỮA';
          if (btnSubmit) btnSubmit.innerHTML = 'LƯU ĐƠN';
          if (editIdEl) editIdEl.value = item.id;
          if (document.getElementById('rFormCustomer')) document.getElementById('rFormCustomer').value = item.customer || '';
          if (document.getElementById('rFormDevice')) document.getElementById('rFormDevice').value = item.device || '';
          if (document.getElementById('rFormIssue')) document.getElementById('rFormIssue').value = item.issue || '';
          if (document.getElementById('rFormWarranty')) document.getElementById('rFormWarranty').value = item.warranty || '';
          if (document.getElementById('rFormPrice')) document.getElementById('rFormPrice').value = formatNumberDisplay(item.price);
          if (document.getElementById('rFormCost')) document.getElementById('rFormCost').value = formatNumberDisplay(item.cost);
          if (document.getElementById('rFormPaymentStatus')) document.getElementById('rFormPaymentStatus').value = item.status || 'Đã thanh toán';
          if (document.getElementById('rFormPaymentMethod')) document.getElementById('rFormPaymentMethod').value = item.method || 'Tiền mặt';

          if (item.dateFormatted && document.getElementById('rFormDate')) {
            const dp = item.dateFormatted.split('/');
            if (dp.length === 3) {
              document.getElementById('rFormDate').value = `${dp[2]}-${dp[1]}-${dp[0]}`;
            }
          }
          if (item.timeFormatted) {
            const tp = item.timeFormatted.split(':');
            if (tp.length === 2) {
              if (document.getElementById('rFormHour')) document.getElementById('rFormHour').value = tp[0];
              if (document.getElementById('rFormMinute')) document.getElementById('rFormMinute').value = tp[1];
            }
          }
          if (typeof updateRepairFormProfit === 'function') updateRepairFormProfit();
        }
      } else {
        if (title) title.innerText = 'TẠO ĐƠN SỬA CHỮA';
        if (btnSubmit) btnSubmit.innerHTML = 'TẠO ĐƠN';
        if (document.getElementById('rFormCustomer')) document.getElementById('rFormCustomer').value = 'Khách lẻ';
        if (document.getElementById('rFormWarranty')) document.getElementById('rFormWarranty').value = '';
        if (document.getElementById('rFormPaymentStatus')) document.getElementById('rFormPaymentStatus').value = 'Đã thanh toán';
        if (document.getElementById('rFormPaymentMethod')) document.getElementById('rFormPaymentMethod').value = 'Tiền mặt';
        const disp = document.getElementById('rFormProfitDisplay');
        if (disp) disp.innerText = '';
      }

      modal.style.zIndex = '99999';
      modal.classList.add('active');
      modal.style.display = 'flex';
    }

    function openRepairModalWithPrefill(data) {
      openRepairModal();
      if (!data) return;
      if (data.sourceDeviceIndex !== undefined) {
        window._pendingSourceDeviceIndex = data.sourceDeviceIndex;
      }
      if (document.getElementById('rFormIssue') && data.issue) {
        document.getElementById('rFormIssue').value = data.issue;
      }
      if (document.getElementById('rFormWarranty') && !document.getElementById('rFormWarranty').value) {
        document.getElementById('rFormWarranty').value = data.warranty || '0 Bảo Hành';
      }

      // Thiết lập giá trị hiện mờ (ghost placeholder / default value)
      // Khi bấm vào ô nhập, giá trị sẽ biến mất để điền mới. Nếu ko ghi gì thì mặc định là giá đó.
      const setupGhostInput = (inputId, defaultVal) => {
        const inp = document.getElementById(inputId);
        if (!inp) return;
        const formattedDefault = (defaultVal !== undefined && defaultVal !== null && defaultVal !== '') ? (typeof defaultVal === 'number' && typeof formatNumberDisplay === 'function' ? formatNumberDisplay(defaultVal) : String(defaultVal)) : '';
        inp.dataset.defaultGhostVal = formattedDefault;
        inp.value = formattedDefault;
        inp.style.color = '#94a3b8'; // Hiện mờ (màu xám / mờ)
        inp.style.opacity = '0.75';

        inp.onfocus = function() {
          if (this.value === this.dataset.defaultGhostVal) {
            this.value = '';
          }
          this.style.color = '#fff';
          this.style.opacity = '1';
        };

        inp.onblur = function() {
          if (!this.value.trim() && this.dataset.defaultGhostVal) {
            this.value = this.dataset.defaultGhostVal;
            this.style.color = '#94a3b8';
            this.style.opacity = '0.75';
          } else {
            this.style.color = '#fff';
            this.style.opacity = '1';
          }
          if (typeof updateRepairFormProfit === 'function') updateRepairFormProfit();
        };
      };

      if (data.device) setupGhostInput('rFormDevice', data.device);
      if (data.price !== undefined) setupGhostInput('rFormPrice', data.price);
      if (data.cost !== undefined) setupGhostInput('rFormCost', data.cost);
      if (typeof updateRepairFormProfit === 'function') updateRepairFormProfit();
    }

    function editRepairItem(id) {
      openRepairModal(id);
    }

    function closeRepairModal() {
      const modal = document.getElementById('repairModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
      window._pendingSourceDeviceIndex = undefined;
    }

    // Gắn vào window để gọi từ các sự kiện onclick trên HTML
    window.openRepairModal = openRepairModal;
    window.openRepairModalWithPrefill = openRepairModalWithPrefill;
    window.editRepairItem = editRepairItem;
    window.closeRepairModal = closeRepairModal;

    function saveRepairItem(e) {
      if (e) e.preventDefault();
      const editId = document.getElementById('repairEditId').value;
      const customer = document.getElementById('rFormCustomer').value.trim();
      const device = document.getElementById('rFormDevice').value.trim();
      const issue = document.getElementById('rFormIssue').value.trim();
      const warranty = document.getElementById('rFormWarranty').value.trim();
      const priceRaw = parseRawNumber(document.getElementById('rFormPrice').value);
      const costRaw = parseRawNumber(document.getElementById('rFormCost').value);
      const profit = priceRaw - costRaw;

      const dateVal = document.getElementById('rFormDate').value; // yyyy-mm-dd
      let dateFormatted = getCurrentDateStr();
      if (dateVal) {
        const dp = dateVal.split('-');
        if (dp.length === 3) {
          dateFormatted = `${dp[2]}/${dp[1]}/${dp[0]}`;
        }
      }

      const hVal = document.getElementById('rFormHour').value || '00';
      const mVal = document.getElementById('rFormMinute').value || '00';
      const timeFormatted = `${hVal}:${mVal}`;

      const status = document.getElementById('rFormPaymentStatus').value || 'Đã thanh toán';
      const method = document.getElementById('rFormPaymentMethod').value || 'Tiền mặt';

      if (!customer || !device || !issue || !warranty || isNaN(priceRaw) || isNaN(costRaw)) {
        alert('Vui lòng nhập đầy đủ các trường bắt buộc: Khách hàng, Tên máy, Tình trạng, Bảo hành, Báo giá và Vốn!');
        return;
      }

      let newItem = null;
      if (editId) {
        const item = repairDatabase.find(x => String(x.id) === String(editId));
        if (item) {
          const oldData = JSON.parse(JSON.stringify(item));
          item.customer = customer;
          item.device = device;
          item.issue = issue;
          item.warranty = warranty;
          item.price = priceRaw;
          item.cost = costRaw;
          item.profit = profit;
          item.dateFormatted = dateFormatted;
          item.timeFormatted = timeFormatted;
          item.status = status;
          item.method = method;
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'suachua', 'Sửa chữa', `Sửa phiếu sửa chữa: ${customer} - ${device} (${issue}) - Tổng: ${priceRaw}`, oldData, item, item.id);
          }
        }
      } else {
        newItem = {
          id: Date.now(),
          customer,
          device,
          issue,
          warranty,
          price: priceRaw,
          cost: costRaw,
          profit,
          dateFormatted,
          timeFormatted,
          status,
          method
        };
        repairDatabase.unshift(newItem);
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'suachua', 'Sửa chữa', `Tiếp nhận sửa chữa: ${customer} - ${device} (${issue}) - Tổng: ${priceRaw}`, null, newItem, newItem.id);
        }
      }

      // Tự động lưu khách hàng, tên máy, tình trạng vào danh mục gợi ý nếu chưa có
      ['customer', 'device', 'issue'].forEach(t => {
        let val = (t === 'customer' ? customer : (t === 'device' ? device : issue));
        if (val) {
          let items = getRepairDropdownItems(t);
          if (!items.includes(val)) {
            items.unshift(val);
            saveRepairDropdownItems(t, items);
          }
        }
      });

      saveRepairDb();

      // ============================================================
      // ĐỒNG BỘ SANG BÁN HÀNG NẾU HÌNH THỨC LÀ CHUYỂN KHOẢN
      // - Tên hiển thị cột hàng hóa: "Tên máy - đã sửa" (device - issue)
      // - Giá bán và giá nhập bằng nhau, lãi luôn bằng 0
      // - Hình thức = Chuyển khoản
      // ============================================================
      const isTransfer = (method || '').toLowerCase().trim().includes('chuyển khoản') ||
                         (method || '').toLowerCase().trim().includes('chuyển tiền') ||
                         (method || '').toLowerCase().trim() === 'ck';

      const targetRepairId = editId ? String(editId) : String(newItem.id);

      if (isTransfer) {
        let cleanDev = (device || 'Máy').replace(/^iphone\s+/i, '').trim();
        if (!cleanDev) cleanDev = device || 'Máy';
        const salesName = `Sửa - ${cleanDev}`;

        let existingSales = salesDatabase.find(s => String(s.repairId) === targetRepairId);
        if (existingSales) {
          existingSales.name = salesName;
          existingSales.total = formatPriceStr(priceRaw);
          existingSales.priceIn = formatPriceStr(priceRaw);
          existingSales.profit = '0';
          existingSales.method = 'Chuyển khoản';
          existingSales.dateTime = `${timeFormatted} - ${dateFormatted}`;
          existingSales.customer = customer || 'Khách lẻ';
          existingSales.paymentStatus = 'Đã Trả';
        } else {
          const salesRecord = {
            id: Date.now() + 1,
            name: salesName,
            total: formatPriceStr(priceRaw),
            priceIn: formatPriceStr(priceRaw),
            profit: '0',
            method: 'Chuyển khoản',
            dateTime: `${timeFormatted} - ${dateFormatted}`,
            customer: customer || 'Khách lẻ',
            paymentStatus: 'Đã Trả',
            isMissingInfo: false,
            isChecked: false,
            repairId: targetRepairId
          };
          salesDatabase.unshift(salesRecord);
        }
        saveSalesStorage();
        if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
      } else if (editId) {
        // Nếu sửa từ Chuyển khoản sang Tiền mặt thì gỡ bỏ đơn bán hàng tương ứng
        const prevSalesLen = salesDatabase.length;
        salesDatabase = salesDatabase.filter(s => String(s.repairId) !== targetRepairId);
        if (salesDatabase.length !== prevSalesLen) {
          saveSalesStorage();
          if (typeof renderSalesTable === 'function') renderSalesTable(salesDatabase);
        }
      }

      // Tự động đồng bộ ngày xem của bộ lọc sửa chữa về đúng ngày của đơn vừa tạo để hiển thị ngay lập tức
      if (dateVal) {
        const dp = dateVal.split('-');
        if (dp.length === 3) {
          repairFilterDate = new Date(parseInt(dp[0]), parseInt(dp[1]) - 1, parseInt(dp[2]));
          updateRepairDateDisplay();
        }
      }

      // Giảm số lượng linh kiện đi 1 nếu tạo đơn từ báo giá
      if (window._pendingSourceDeviceIndex !== undefined && window._pendingSourceDeviceIndex !== null) {
        try {
          const idx = window._pendingSourceDeviceIndex;
          const bgFrame = document.getElementById('baogiaFrame');
          if (bgFrame && bgFrame.contentWindow && typeof bgFrame.contentWindow.decrementDeviceQty === 'function') {
            bgFrame.contentWindow.decrementDeviceQty(idx);
          } else if (bgFrame && bgFrame.contentWindow && Array.isArray(bgFrame.contentWindow.devices)) {
            const dev = bgFrame.contentWindow.devices[idx];
            if (dev) {
              const curQ = parseInt(dev.qty) || 0;
              dev.qty = Math.max(0, curQ - 1);
              if (typeof bgFrame.contentWindow.saveAllToCloud === 'function') bgFrame.contentWindow.saveAllToCloud();
              if (typeof bgFrame.contentWindow.renderTable === 'function') bgFrame.contentWindow.renderTable();
            }
          }
        } catch (err) {
          console.warn('Lỗi khi giảm số lượng linh kiện báo giá:', err);
        }
        window._pendingSourceDeviceIndex = undefined;
      }

      closeRepairModal();
      renderRepairTable();
      alert('Đã lưu đơn sửa chữa thành công!' + (isTransfer ? '\n(Đã tự động đồng bộ đơn sang danh sách Bán Hàng - Chuyển khoản)' : ''));
    }

    // ==========================================
    // 2. DỮ LIỆU & LOGIC MÌNH NỢ (ẢNH 3 & 4)
    // ==========================================
    const DEFAULT_MY_DEBT_DATA = [
      { id: 2, creditor: 'Hiệp Bùi', date: '14/10/2026', itemType: 'Face ID XSM', amount: 200, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 3, creditor: 'Hiệp Bùi', date: '10/10/2026', itemType: '8 Plus', amount: 200, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 4, creditor: 'Hiệp Bùi', date: '08/10/2026', itemType: 'S6 Lite', amount: 350, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 5, creditor: 'Hiệp Bùi', date: '08/10/2026', itemType: '8P WIFI', amount: 200, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 6, creditor: 'Hiệp Bùi', date: '17/09/2026', itemType: 'A23 Nguồn', amount: 150, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 7, creditor: 'Hiệp Bùi', date: '17/09/2026', itemType: 'Cảm XS', amount: 400, shop: 'Kim Chi Mobile', status: 'Đang nợ' },
      { id: 8, creditor: 'Hiệp Bùi', date: '16/09/2026', itemType: '7 Plus', amount: 150, shop: 'Kim Chi Mobile', status: 'Đang nợ' }
    ];

    let myDebtDatabase = [];
    try {
      const savedDebt = localStorage.getItem('KIMCHI_MY_DEBT_DB');
      if (savedDebt) {
        myDebtDatabase = JSON.parse(savedDebt);
        if (myDebtDatabase.some(x => x.itemType === 'Kính X' || x.itemType === '7P Chập')) {
          myDebtDatabase = myDebtDatabase.filter(x => x.itemType !== 'Kính X' && x.itemType !== '7P Chập');
          localStorage.setItem('KIMCHI_MY_DEBT_DB', JSON.stringify(myDebtDatabase));
        }
      } else {
        myDebtDatabase = DEFAULT_MY_DEBT_DATA;
      }
    } catch (e) {
      myDebtDatabase = DEFAULT_MY_DEBT_DATA;
    }

    function saveMyDebtDb() {
      try {
        localStorage.setItem('KIMCHI_MY_DEBT_DB', JSON.stringify(myDebtDatabase));
      } catch (e) {
        console.error('Lỗi lưu myDebtDatabase:', e);
      }
    }

    let debtHidePaid = false;

    function resetDebtFilters() {
      if (document.getElementById('debtSearchInput')) document.getElementById('debtSearchInput').value = '';
      debtHidePaid = false;
      const btn = document.getElementById('btnDebtToggleHide');
      if (btn) btn.innerHTML = '👁 Ẩn';
      renderMyDebtTable();
    }

    function toggleDebtHide() {
      debtHidePaid = !debtHidePaid;
      const btn = document.getElementById('btnDebtToggleHide');
      if (btn) btn.innerHTML = debtHidePaid ? '👁 Hiện' : '👁 Ẩn';
      renderMyDebtTable();
    }

    function reloadDebtData() {
      try {
        const savedDebt = localStorage.getItem('KIMCHI_MY_DEBT_DB');
        myDebtDatabase = savedDebt ? JSON.parse(savedDebt) : DEFAULT_MY_DEBT_DATA;
      } catch (e) {
        myDebtDatabase = DEFAULT_MY_DEBT_DATA;
      }
      renderMyDebtTable();
    }

    function renderMyDebtTable() {
      const tbody = document.getElementById('myDebtTableBody');
      if (!tbody) return;

      const searchVal = document.getElementById('debtSearchInput') ? document.getElementById('debtSearchInput').value.trim().toLowerCase() : '';

      let filtered = myDebtDatabase.filter(item => {
        // Ẩn khoản đã trả nếu bật chế độ ẩn
        if (debtHidePaid && item.status === 'Đã trả') return false;

        // Tìm kiếm người / loại
        if (searchVal) {
          const matchStr = `${item.creditor} ${item.itemType} ${item.shop || ''}`.toLowerCase();
          if (!matchStr.includes(searchVal)) return false;
        }

        return true;
      });

      // Cập nhật số phiếu & Tổng nợ (Row 1 & Row 2 góc trên)
      const countEl = document.getElementById('debtCountText');
      if (countEl) {
        countEl.innerText = `${filtered.length} phiếu`;
      }

      let totalDebt = 0;
      filtered.forEach(item => {
        if (item.status === 'Đang nợ') {
          totalDebt += parsePriceNum(item.amount);
        }
      });
      const totalDebtEl = document.getElementById('debtTotalAmountVal');
      if (totalDebtEl) {
        totalDebtEl.innerText = formatPriceStr(totalDebt);
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: #64748b; font-weight: 700;">Không có khoản nợ nào phù hợp.</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(item => {
          const isPending = item.status === 'Đang nợ';
          const statusBadge = isPending 
            ? `<span style="color: #f59e0b; font-weight: 800; font-size: 0.95rem;">Đang nợ</span>` 
            : `<span style="color: #10b981; font-weight: 800; font-size: 0.95rem;">Đã trả</span>`;

          return `
            <tr>
              <td style="color: #ffffff; font-weight: 800; padding-left: 16px;">${escapeHtml(item.creditor)}</td>
              <td style="color: #ffffff; font-weight: 700;">${escapeHtml(formatBrandDeviceName(item.itemType))}</td>
              <td style="text-align: center; color: #ffffff; font-weight: 900; font-size: 1.15rem;">${formatNumberDisplay(item.amount)}</td>
              <td style="text-align: center; color: #94a3b8; font-weight: 600;">${escapeHtml(item.date)}</td>
              <td style="text-align: center;">${statusBadge}</td>
              <td style="text-align: center;">
                <div class="action-btn-group" style="justify-content: center;">
                  <button type="button" class="action-btn-icon action-btn-edit" onclick="editMyDebtItem(${item.id})" title="Sửa">
                    <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button type="button" class="action-btn-icon action-btn-del" onclick="deleteMyDebtItem(${item.id})" title="Xóa">
                    <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    function markDebtAsPaid(id) {
      const item = myDebtDatabase.find(x => x.id === id);
      if (item) {
        item.status = (item.status === 'Đang nợ') ? 'Đã trả' : 'Đang nợ';
        saveMyDebtDb();
        renderMyDebtTable();
      }
    }

    function copyMyDebtItem(id) {
      const item = myDebtDatabase.find(x => x.id === id);
      if (!item) return;
      const newItem = {
        ...item,
        id: Date.now(),
        itemType: item.itemType + ' (Copy)'
      };
      myDebtDatabase.unshift(newItem);
      saveMyDebtDb();
      renderMyDebtTable();
    }

    function deleteMyDebtItem(id) {
      const item = myDebtDatabase.find(x => x.id === id);
      if (!item) return;
      const ans = prompt(`Nhập chữ "yes" để xác nhận xóa khoản nợ "${item.itemType}" cho ${item.creditor}:`);
      if (ans && ans.trim().toLowerCase() === 'yes') {
        if (typeof logActivity === 'function') {
          logActivity('DELETE', 'congno_mine', 'Mình nợ', `Xóa khoản mình nợ: ${item.creditor} - ${item.itemType} (${formatPriceStr(item.amount)})`, item, null, id);
        }
        myDebtDatabase = myDebtDatabase.filter(x => x.id !== id);
        saveMyDebtDb();
        renderMyDebtTable();
      }
    }

    // Modal Mình Nợ (Ảnh 4)
    function openMyDebtModal(editId = null) {
      const modal = document.getElementById('myDebtModal');
      const form = document.getElementById('myDebtForm');
      const title = document.getElementById('myDebtModalTitle');
      const btnSubmit = document.getElementById('debtBtnSubmit');

      if (!modal || !form) return;
      form.reset();
      document.getElementById('debtEditId').value = '';

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      document.getElementById('debtFormDate').value = `${yyyy}-${mm}-${dd}`;

      if (editId) {
        const item = myDebtDatabase.find(x => x.id === editId);
        if (item) {
          title.innerText = 'Sửa khoản mình nợ';
          btnSubmit.innerHTML = '<span>✔</span> Lưu thay đổi';
          document.getElementById('debtEditId').value = item.id;
          document.getElementById('debtFormShop').value = item.shop || 'Kim Chi Mobile';
          document.getElementById('debtFormCreditor').value = item.creditor || '';
          document.getElementById('debtFormItemType').value = item.itemType || '';
          document.getElementById('debtFormAmount').value = formatNumberDisplay(item.amount);
          document.getElementById('debtFormNote').value = item.note || '';

          if (item.date) {
            const dp = item.date.split('/');
            if (dp.length === 3) {
              document.getElementById('debtFormDate').value = `${dp[2]}-${dp[1]}-${dp[0]}`;
            }
          }
        }
      } else {
        title.innerText = 'Thêm khoản mình nợ';
        btnSubmit.innerHTML = '<span>+</span> Lưu khoản nợ';
        document.getElementById('debtFormShop').value = 'Kim Chi Mobile';
        document.getElementById('debtFormCreditor').value = 'Hiệp Bùi';
      }

      modal.classList.add('active');
      modal.style.display = 'flex';
    }

    function editMyDebtItem(id) {
      openMyDebtModal(id);
    }

    function closeMyDebtModal() {
      const modal = document.getElementById('myDebtModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }

    function saveMyDebtItem(e) {
      e.preventDefault();
      const editId = document.getElementById('debtEditId').value;
      const shop = document.getElementById('debtFormShop').value;
      const creditor = document.getElementById('debtFormCreditor').value.trim();
      const itemType = document.getElementById('debtFormItemType').value.trim();
      const amount = parseRawNumber(document.getElementById('debtFormAmount').value);
      const note = document.getElementById('debtFormNote').value.trim();

      const dateVal = document.getElementById('debtFormDate').value; // yyyy-mm-dd
      let dateFormatted = '23/10/2026';
      if (dateVal) {
        const dp = dateVal.split('-');
        dateFormatted = `${dp[2]}/${dp[1]}/${dp[0]}`;
      }

      if (!creditor || !itemType || !amount) {
        alert('Vui lòng điền Người mình nợ, Loại món nợ và Số tiền nợ!');
        return;
      }

      if (editId) {
        const item = myDebtDatabase.find(x => x.id === Number(editId));
        if (item) {
          const oldData = JSON.parse(JSON.stringify(item));
          item.shop = shop;
          item.creditor = creditor;
          item.itemType = itemType;
          item.amount = amount;
          item.note = note;
          item.date = dateFormatted;
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'congno_mine', 'Mình nợ', `Sửa khoản mình nợ: ${creditor} - ${itemType} (${formatPriceStr(amount)})`, oldData, item, item.id);
          }
        }
      } else {
        const newItem = {
          id: Date.now(),
          shop,
          creditor,
          itemType,
          amount,
          note,
          date: dateFormatted,
          status: 'Đang nợ'
        };
        myDebtDatabase.unshift(newItem);
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'congno_mine', 'Mình nợ', `Thêm khoản mình nợ: ${creditor} - ${itemType} (${formatPriceStr(amount)})`, null, newItem, newItem.id);
        }
      }

      saveMyDebtDb();
      closeMyDebtModal();
      renderMyDebtTable();
    }

    function addNewDebtOption(field, inputId, promptText) {
      const input = document.getElementById(inputId);
      const currentVal = input ? input.value.trim() : '';
      let clean = '';

      if (currentVal !== '') {
        clean = currentVal;
      } else {
        const val = prompt(promptText || 'Thêm mục mới:', '');
        if (val && val.trim()) clean = val.trim();
      }

      if (clean) {
        if (input) input.value = clean;
        alert(`✓ Đã thêm "${clean}" thành công!`);
      }
    }

    function editDebtOption(field, inputId, promptText) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const val = prompt(promptText, input.value);
      if (val !== null) input.value = val.trim();
    }

    function clearDebtInput(inputId) {
      const input = document.getElementById(inputId);
      if (input) input.value = '';
    }

    // Tự động thêm nút X màu đỏ để xóa tìm kiếm cho TẤT CẢ các ô tìm kiếm trên toàn trang web
    function initUniversalSearchClearButtons() {
      const selectors = [
        '#repairSearchInput',
        '#swDebtSearchInput',
        '#phoneSearchInput',
        '#soldPhoneSearchInput',
        '#partsSearchInput',
        '#debtSearchInput',
        '.search-sales-input',
        '#tab-banhang .search-sales-input',
        '#tab-banga .search-input-field',
        'input[type="text"][placeholder*="Tìm"]',
        'input[type="text"][placeholder*="tìm"]',
        'input[type="text"][placeholder*="TÌM"]',
        'input.search-input-field'
      ];

      const inputs = document.querySelectorAll(selectors.join(','));
      inputs.forEach(inp => {
        if (!inp) return;
        const parent = inp.parentElement;
        if (!parent) return;

        const comp = window.getComputedStyle(parent);
        if (comp.position === 'static') {
          parent.style.position = 'relative';
        }

        let btn = parent.querySelector('.btn-clear-search, #btnClearRepairSearch, #btnClearPhoneSearch, .universal-clear-btn');
        if (!btn) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'universal-clear-btn';
          btn.innerHTML = '✕';
          btn.title = 'Xóa tìm kiếm';
          parent.appendChild(btn);
        }

        btn.style.cssText = 'position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #ef4444 !important; font-size: 1.1rem; font-weight: 900; cursor: pointer; padding: 0 4px; line-height: 1; z-index: 10; display: none;';

        inp.style.paddingRight = '28px';

        const updateBtnVisibility = () => {
          if (inp.value && inp.value.trim().length > 0) {
            btn.style.display = 'block';
          } else {
            btn.style.display = 'none';
          }
        };

        if (!inp.dataset.hasClearListener) {
          inp.dataset.hasClearListener = 'true';
          inp.addEventListener('input', updateBtnVisibility);
          inp.addEventListener('keyup', updateBtnVisibility);
          inp.addEventListener('change', updateBtnVisibility);

          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            inp.value = '';
            btn.style.display = 'none';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
            inp.dispatchEvent(new Event('change', { bubbles: true }));
            inp.focus();
          });
        }

        updateBtnVisibility();
      });
    }

    // Tự động khởi chạy datalists và khách hàng cho phần mềm khi tải trang
    window.addEventListener('DOMContentLoaded', () => {
      // Đảm bảo danh sách tên máy trong mục tạo đơn phần mềm chỉ để lại duy nhất "Đã Thanh Toán"
      try {
        localStorage.setItem('KIMCHI_SW_OPT_DEVICES', JSON.stringify(["Đã Thanh Toán"]));
      } catch(e){}
      renderSwDatalists();
      renderSwCustomerFilterOptions();
      initSoftwareTimeSelectors();
      renderSoftwareTable(softwareDatabase);

      // Khởi chạy tab Báo Giá
      renderPartsDatalists();
      renderPartsTypeTabs();
      renderPartsStyleTabs();
      renderPartsTable();

      // Khởi chạy tab Sửa Chữa & Mình Nợ
      updateRepairDateDisplay();
      initRepairTimeSelectors();
      renderRepairTable();
      renderMyDebtTable();

      // Khởi chạy nút X đỏ trên toàn bộ trang web
      initUniversalSearchClearButtons();
    });

    // =========================================================
    // MODULE SỔ CÔNG NỢ TẬP TRUNG (5 PHẦN THEO YÊU CẦU)
    // =========================================================
    let currentDebtSection = 'all';
    let otherDebtDatabase = JSON.parse(localStorage.getItem('KIMCHI_OTHER_DEBT_DB')) || [
      { id: 1, target: 'Anh Tuấn Linh Kiện', reason: 'Nhập màn hình chưa thanh toán hết', amount: 500, date: '22/10/2026' }
    ];

    function saveOtherDebtDb() {
      localStorage.setItem('KIMCHI_OTHER_DEBT_DB', JSON.stringify(otherDebtDatabase));
    }

    function switchDebtSection(sec, btn) {
      currentDebtSection = sec;
      const tabGroup = document.querySelector('#tab-congno .brand-tabs-horizontal');
      if (tabGroup) {
        tabGroup.querySelectorAll('.brand-btn-h').forEach(b => b.classList.remove('active'));
      }
      if (btn) btn.classList.add('active');

      // Chỉ hiển thị 2 ô tóm tắt tổng quan (Nợ Phải Thu & Mình Nợ) ở mục TẤT CẢ
      const summaryPills = document.getElementById('debtGeneralSummaryPills');
      if (summaryPills) {
        summaryPills.style.display = (sec === 'all') ? 'flex' : 'none';
      }

      // Hiển thị Khoản nợ (Row 1) & Tổng số nợ (Row 2) khi ở mục NỢ KHÁC
      const otherCountBox = document.getElementById('debtOtherCountBox');
      const otherTotalBox = document.getElementById('debtOtherTotalBox');
      if (otherCountBox) otherCountBox.style.display = (sec === 'other') ? 'flex' : 'none';
      if (otherTotalBox) otherTotalBox.style.display = (sec === 'other') ? 'flex' : 'none';

      // Hiển thị Số phiếu (Row 1) & Tổng Nợ = (Row 2) khi ở mục MÌNH NỢ
      const mineCountBox = document.getElementById('debtMineCountBox');
      const mineTotalBox = document.getElementById('debtMineTotalBox');
      if (mineCountBox) mineCountBox.style.display = (sec === 'mine') ? 'flex' : 'none';
      if (mineTotalBox) mineTotalBox.style.display = (sec === 'mine') ? 'flex' : 'none';

      const secIds = ['debtSecAll', 'debtSecSoftware', 'debtSecCustomer', 'debtSecOther', 'debtSecMine'];
      secIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      if (sec === 'all') {
        const el = document.getElementById('debtSecAll');
        if (el) el.style.display = 'block';
        renderAllDebtSummaryTable();
      } else if (sec === 'software') {
        const el = document.getElementById('debtSecSoftware');
        if (el) el.style.display = 'block';
        renderDebtSoftwareList();
      } else if (sec === 'customer') {
        const el = document.getElementById('debtSecCustomer');
        if (el) el.style.display = 'block';
        renderDebtCustomerList();
      } else if (sec === 'other') {
        const el = document.getElementById('debtSecOther');
        if (el) el.style.display = 'block';
        renderDebtOtherList();
      } else if (sec === 'mine') {
        const el = document.getElementById('debtSecMine');
        if (el) el.style.display = 'block';
        renderMyDebtTable();
      }
      setTimeout(initUniversalSearchClearButtons, 30);
    }

    // HÀM TỔNG HỢP TOÀN BỘ CÔNG NỢ KHÁCH HÀNG: BÁN HÀNG, SỬA CHỮA, BÁN MÁY, BÁN GÀ
    function getCustomerDebtsList() {
      let list = [];
      let handledImeis = new Set();

      // 1. Nợ từ salesDatabase (Bán Hàng hoặc Bán Máy lưu vào Bán Hàng)
      if (Array.isArray(salesDatabase)) {
        salesDatabase.forEach(s => {
          let isDebt = (s.paymentStatus === 'NỢ DAI VL' || s.paymentStatus === 'Nợ Dai VL' || s.paymentStatus === 'NỢ DAI' || s.method === 'Nợ' || s.method === 'nợ');
          if (isDebt) {
            let isPhone = !!(s.imei || (s.accessory === 'Bán Máy') || (s.accessory === 'Bán Máy (Ngoài Kho)') || (s.brand && s.brand !== '❤️❤️❤️') || (s.name && (s.name.includes('iPhone') || s.name.includes('Samsung') || s.name.includes('iPad'))));
            if (s.imei) handledImeis.add(String(s.imei).trim());

            list.push({
              sourceId: s.id,
              sourceType: isPhone ? 'banmay' : 'banhang',
              sourceLabel: isPhone ? 'Bán Máy' : 'Bán Hàng',
              sourceBadge: isPhone
                ? '<span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 9px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; white-space: nowrap;">📱 Bán Máy</span>'
                : '<span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 9px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; white-space: nowrap;">🛒 Bán Hàng</span>',
              customer: s.customer || 'Khách lẻ',
              desc: s.name || s.phoneName || s.accessory || 'Hàng hóa',
              imei: s.imei || '',
              amount: parsePriceNum(s.total),
              date: s.dateTime || '',
              rawItem: s
            });
          }
        });
      }

      // 2. Nợ từ bangaDatabase (Bán Gà hoặc Bán Máy lưu vào Bán Gà)
      if (typeof bangaDatabase !== 'undefined' && Array.isArray(bangaDatabase)) {
        bangaDatabase.forEach(bg => {
          let isDebt = (bg.paymentStatus === 'NỢ DAI VL' || bg.paymentStatus === 'Nợ Dai VL' || bg.paymentStatus === 'NỢ DAI' || bg.method === 'Nợ' || bg.method === 'nợ');
          if (isDebt) {
            if (bg.imei) handledImeis.add(String(bg.imei).trim());
            let isPhone = (bg.accessory === 'Bán Máy' || bg.accessory === 'Bán Máy (Ngoài Kho)');

            list.push({
              sourceId: bg.id,
              sourceType: 'banga',
              sourceLabel: isPhone ? 'Bán Gà (Máy)' : 'Bán Gà',
              sourceBadge: '<span style="background: rgba(236, 72, 153, 0.15); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.4); padding: 4px 9px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; white-space: nowrap;">🐓 Bán Gà</span>',
              customer: bg.customer || 'Khách lẻ',
              desc: bg.name || bg.phoneName || 'Bán gà',
              imei: bg.imei || '',
              amount: parsePriceNum(bg.total),
              date: bg.dateTime || '',
              rawItem: bg
            });
          }
        });
      }

      // 3. Nợ từ repairDatabase (Sửa Chữa)
      let repList = [];
      if (typeof repairDatabase !== 'undefined' && Array.isArray(repairDatabase)) {
        repList = repairDatabase;
      } else {
        try {
          repList = JSON.parse(localStorage.getItem('KIMCHI_REPAIR_DB')) || [];
        } catch(e) { repList = []; }
      }
      repList.forEach(r => {
        let isDebt = (r.status === 'Nợ' || r.paymentStatus === 'Nợ Dai VL' || r.paymentStatus === 'NỢ DAI VL' || r.paymentStatus === 'NỢ DAI' || r.method === 'Nợ' || r.method === 'nợ');
        if (isDebt) {
          list.push({
            sourceId: r.id,
            sourceType: 'repair',
            sourceLabel: 'Sửa Chữa',
            sourceBadge: '<span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 4px 9px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; white-space: nowrap;">🔧 Sửa Chữa</span>',
            customer: r.customer || 'Khách lẻ',
            desc: `${r.device || 'Thiết bị'}${r.issue ? ' - ' + r.issue : ''}`,
            imei: r.imei || '',
            amount: parsePriceNum(r.price),
            date: r.dateFormatted ? `${r.timeFormatted ? r.timeFormatted + ' ' : ''}${r.dateFormatted}` : (r.date || ''),
            rawItem: r
          });
        }
      });

      // 4. Nợ từ soldPhoneDatabase (Bán Máy nếu chưa có trong danh sách trên)
      if (typeof soldPhoneDatabase !== 'undefined' && Array.isArray(soldPhoneDatabase)) {
        soldPhoneDatabase.forEach(p => {
          let isDebt = (p.paymentStatus === 'Nợ Dai VL' || p.paymentStatus === 'NỢ DAI VL' || p.paymentStatus === 'NỢ DAI' || p.paymentMethod === 'Nợ' || p.method === 'Nợ' || p.method === 'nợ');
          let pImei = p.imei ? String(p.imei).trim() : '';
          if (isDebt && (!pImei || !handledImeis.has(pImei))) {
            list.push({
              sourceId: p.id,
              sourceType: 'banmay_phone',
              sourceLabel: 'Bán Máy',
              sourceBadge: '<span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 9px; border-radius: 6px; font-weight: 800; font-size: 0.82rem; white-space: nowrap;">📱 Bán Máy</span>',
              customer: p.customer || 'Khách lẻ',
              desc: `${p.brand ? p.brand + ' - ' : ''}${p.name || ''} ${p.storage || ''} ${p.imei ? '(' + p.imei + ')' : ''}`,
              imei: p.imei || '',
              amount: parsePriceNum(p.price || p.total),
              date: p.dateTime || p.soldDateTime || p.date || '',
              rawItem: p
            });
          }
        });
      }

      return list;
    }

    function renderDebtDashboard() {
      // 1. Tính Tổng Nợ Phải Thu: nợ phần mềm + toàn bộ nợ khách hàng (bán hàng, sửa chữa, bán máy, bán gà)
      let totalThu = 0;
      if (Array.isArray(softwareDatabase)) {
        softwareDatabase.forEach(s => {
          if (isSoftwareDebt(s)) totalThu += (parsePriceNum(s.price) || 0);
        });
      }
      const custDebts = getCustomerDebtsList();
      custDebts.forEach(c => {
        totalThu += (c.amount || 0);
      });

      // 2. Tính Mình Nợ: từ myDebtDatabase
      let totalTra = 0;
      if (Array.isArray(myDebtDatabase)) {
        myDebtDatabase.forEach(m => {
          if (m.status !== 'Đã trả') totalTra += (parsePriceNum(m.amount) || 0);
        });
      }

      const thuEl = document.getElementById('debtThuTotalVal');
      if (thuEl) thuEl.innerText = formatPriceStr(totalThu);
      const traEl = document.getElementById('debtTraTotalVal');
      if (traEl) traEl.innerText = formatPriceStr(totalTra);

      // Kích hoạt section hiện tại
      const matchingBtn = document.querySelector(`#btnDebtSub${currentDebtSection.charAt(0).toUpperCase() + currentDebtSection.slice(1)}`);
      switchDebtSection(currentDebtSection, matchingBtn);
    }

    function renderAllDebtSummaryTable() {
      const tbody = document.getElementById('debtAllTableBody');
      if (!tbody) return;

      let allRows = [];

      // Nợ phần mềm
      if (Array.isArray(softwareDatabase)) {
        softwareDatabase.forEach(s => {
          if (isSoftwareDebt(s)) {
            allRows.push({
              type: 'Phần Mềm',
              typeBadge: '<span style="background: rgba(124, 58, 237, 0.2); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.35); padding: 3px 8px; border-radius: 6px; font-weight: 800;">Phần Mềm</span>',
              target: s.customer || 'Khách lẻ',
              desc: s.device || 'Đơn phần mềm',
              amount: parsePriceNum(s.price),
              date: (s.dayMonth || '') + '-' + (s.year || '2026'),
              kind: '<span style="color: #10b981; font-weight: 900; font-size: 1.02rem;">Phải Thu</span>'
            });
          }
        });
      }

      // Toàn bộ nợ khách hàng (Bán Hàng, Sửa Chữa, Bán Máy, Bán Gà)
      const custDebts = getCustomerDebtsList();
      custDebts.forEach(c => {
        allRows.push({
          type: c.sourceLabel,
          typeBadge: c.sourceBadge,
          target: c.customer || 'Khách lẻ',
          desc: c.desc || 'Công nợ khách hàng',
          amount: c.amount || 0,
          date: c.date || '',
          kind: '<span style="color: #10b981; font-weight: 900; font-size: 1.02rem;">Phải Thu</span>'
        });
      });

      // Mình nợ
      if (Array.isArray(myDebtDatabase)) {
        myDebtDatabase.forEach(m => {
          if (m.status !== 'Đã trả') {
            allRows.push({
              type: 'Mình Nợ',
              typeBadge: '<span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.35); padding: 3px 8px; border-radius: 6px; font-weight: 800;">Mình Nợ</span>',
              target: m.creditor || 'Chủ nợ',
              desc: m.itemType || m.note || 'Khoản vay/nhập',
              amount: parsePriceNum(m.amount),
              date: m.date || '',
              kind: '<span style="color: #ef4444; font-weight: 900; font-size: 1.02rem;">Phải Trả</span>'
            });
          }
        });
      }

      // Nợ khác
      if (Array.isArray(otherDebtDatabase)) {
        otherDebtDatabase.forEach(o => {
          allRows.push({
            type: 'Nợ Khác',
            typeBadge: '<span style="background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.35); padding: 3px 8px; border-radius: 6px; font-weight: 800;">Nợ Khác</span>',
            target: o.target || 'Đối tác',
            desc: o.reason || 'Khoản nợ ngoài',
            amount: parsePriceNum(o.amount),
            date: o.date || '',
            kind: '<span style="color: #fbbf24; font-weight: 900; font-size: 1.02rem;">Đối Tác</span>'
          });
        });
      }

      if (allRows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">Không có khoản công nợ nào đang tồn đọng.</td></tr>`;
        return;
      }

      tbody.innerHTML = allRows.map(r => `
        <tr>
          <td>${r.typeBadge}</td>
          <td style="font-weight: 900; color: #ffffff; font-size: 1.05rem;">${escapeHtml(r.target)}</td>
          <td style="color: #f1f5f9; font-weight: 800; font-size: 1.02rem;">${escapeHtml(formatBrandDeviceName(r.desc))}</td>
          <td style="text-align: right;"><span style="color: #facc15; font-weight: 900; font-size: 1.28rem;">${formatPriceStr(r.amount)}</span></td>
          <td style="text-align: center; color: #e2e8f0; font-weight: 800; font-size: 1.02rem;">${escapeHtml(r.date)}</td>
          <td style="text-align: center; font-size: 1.02rem; font-weight: 900;">${r.kind}</td>
        </tr>
      `).join('');
    }

    // TRẠNG THÁI BỘ LỌC CHO CÁC PHÂN HỆ CÔNG NỢ
    let debtSubFilters = {
      software: { search: '', range: 'ALL' },
      customer: { search: '', range: 'ALL' },
      other: { search: '', range: 'ALL' }
    };

    function handleDebtSearch(section, val) {
      if (!debtSubFilters[section]) debtSubFilters[section] = { search: '', range: 'ALL' };
      debtSubFilters[section].search = (val || '').trim().toLowerCase();
      refreshDebtSubSection(section);
    }

    function setDebtRangeFilter(section, range) {
      if (!debtSubFilters[section]) debtSubFilters[section] = { search: '', range: 'ALL' };
      debtSubFilters[section].range = range;

      const sel = document.getElementById(`debtRangeSelect_${section}`);
      if (sel) sel.value = range;

      refreshDebtSubSection(section);
    }

    function refreshDebtSubSection(section) {
      if (section === 'software') renderDebtSoftwareList();
      else if (section === 'customer') renderDebtCustomerList();
      else if (section === 'other') renderDebtOtherList();
    }

    function checkDebtAmountMatch(amount, range) {
      if (!range || range === 'ALL') return true;
      let num = parsePriceNum(amount);
      if (range === 'UNDER_1M') return num < 1000;
      if (range === '1M_3M') return num >= 1000 && num <= 3000;
      if (range === '3M_5M') return num > 3000 && num <= 5000;
      if (range === '5M_10M') return num > 5000 && num <= 10000;
      if (range === 'OVER_10M') return num > 10000;
      if (range === 'OVER_5M') return num > 5000;
      return true;
    }

    // 1. TAB NỢ PHẦN MỀM
    function renderDebtSoftwareList() {
      const tbody = document.getElementById('debtSoftwareTableBody');
      if (!tbody) return;

      let list = softwareDatabase.filter(s => isSoftwareDebt(s));

      const sFilter = debtSubFilters.software || { search: '', range: 'ALL' };
      if (sFilter.search) {
        list = list.filter(item => {
          let cust = (item.customer || '').toLowerCase();
          let dev = (item.device || '').toLowerCase();
          return cust.includes(sFilter.search) || dev.includes(sFilter.search);
        });
      }
      if (sFilter.range && sFilter.range !== 'ALL') {
        list = list.filter(item => checkDebtAmountMatch(item.price, sFilter.range));
      }

      // Thống kê số lượng khoản nợ và tổng số nợ
      let totalAmount = list.reduce((sum, item) => sum + (parsePriceNum(item.price) || 0), 0);
      const countEl = document.getElementById('debtSoftwareCountVal');
      if (countEl) countEl.innerText = `${list.length} khoản`;
      const totalEl = document.getElementById('debtSoftwareTotalAmountVal');
      if (totalEl) totalEl.innerText = formatPriceStr(totalAmount);

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Không có khoản nợ phần mềm nào phù hợp.</td></tr>`;
        updateBatchPayVisibility('software');
        return;
      }

      tbody.innerHTML = list.map(item => `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="sw-checkbox chk-debt-item chk-debt-software" value="${item.id}" data-amount="${parsePriceNum(item.price)}" data-name="${escapeHtml(item.customer)}" onchange="updateBatchPayVisibility('software')">
          </td>
          <td style="font-weight: 800; color: #f59e0b;">${escapeHtml(item.customer)}</td>
          <td style="font-weight: 900; color: #fff;">${escapeHtml(formatBrandDeviceName(item.device))}</td>
          <td style="text-align: right;"><span style="color: #facc15; font-weight: 900; font-size: 1.15rem;">${formatPriceStr(parsePriceNum(item.price))}</span></td>
          <td style="text-align: center; color: #94a3b8;">${item.dayMonth}-${item.year || '2026'}</td>
          <td style="text-align: center;"><span class="badge-debt-active">💀 NỢ DAI VL</span></td>
          <td style="text-align: center;">
            <div class="action-btn-group" style="justify-content: center;">
              <button type="button" class="action-btn-icon action-btn-edit" onclick="editDebtSoftwareItem(${item.id})" title="Sửa">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="action-btn-icon action-btn-del" onclick="deleteDebtSoftwareItem(${item.id})" title="Xóa">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      updateBatchPayVisibility('software');
    }

    function editDebtSoftwareItem(id) {
      if (typeof openSoftwareModal === 'function') openSoftwareModal(id);
    }

    function deleteDebtSoftwareItem(id) {
      if (!confirm('Bạn có chắc muốn xóa khoản nợ phần mềm này không?')) return;
      const item = softwareDatabase.find(x => String(x.id) === String(id) || x.id == id);
      softwareDatabase = softwareDatabase.filter(x => String(x.id) !== String(id) && x.id != id);
      saveSoftwareStorage();
      if (typeof db !== 'undefined' && db && id) {
        db.collection('software').doc(String(id)).delete().catch(console.error);
      }
      if (item && typeof logActivity === 'function') {
        logActivity('DELETE', 'phanmem', 'Phần mềm', `Xóa khoản nợ phần mềm: ${item.customer || 'Khách lẻ'} - ${item.device || ''} (Số nợ: ${item.price})`, item, null, id);
      }
      if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
      if (typeof renderDebtSoftwareList === 'function') renderDebtSoftwareList();
      if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
      if (typeof showToast === 'function') showToast("Đã xóa khoản nợ phần mềm thành công!");
    }
    window.deleteDebtSoftwareItem = deleteDebtSoftwareItem;

    /* ============================================================
       QUẢN LÝ CÔNG NỢ PHẦN MỀM: XUẤT EXCEL, NHẬP EXCEL, XÓA ĐÃ CHỌN
       ============================================================ */
    function exportDebtSoftwareToExcel() {
      let list = softwareDatabase.filter(s => isSoftwareDebt(s));
      const sFilter = debtSubFilters.software || { search: '', range: 'ALL' };
      if (sFilter.search) {
        list = list.filter(item => {
          let cust = (item.customer || '').toLowerCase();
          let dev = (item.device || '').toLowerCase();
          return cust.includes(sFilter.search) || dev.includes(sFilter.search);
        });
      }
      if (sFilter.range && sFilter.range !== 'ALL') {
        list = list.filter(item => checkDebtAmountMatch(item.price, sFilter.range));
      }

      if (!Array.isArray(list) || list.length === 0) {
        alert("Không có khoản nợ phần mềm nào để xuất Excel!");
        return;
      }

      const headers = ["STT", "Khách Hàng", "Tên Máy / Nội Dung", "Số Nợ", "Phí Dịch Vụ", "Ngày Nợ", "Năm", "Trạng Thái"];
      const rows = list.map((item, idx) => [
        idx + 1,
        item.customer || 'Khách lẻ',
        item.device || '',
        item.price || '0',
        item.cost || '0',
        item.dayMonth || '',
        item.year || '2026',
        item.paymentStatus || 'NỢ DAI VL'
      ]);

      exportAoaToExcelOrCsv(headers, rows, 'KimChiMobile_CongNo_PhanMem', 'CongNo_PhanMem');
      if (typeof showToast === 'function') {
        showToast(`Đã xuất thành công ${list.length} khoản nợ phần mềm ra file Excel!`);
      } else {
        alert(`Đã xuất thành công ${list.length} khoản nợ phần mềm ra file Excel!`);
      }
    }
    window.exportDebtSoftwareToExcel = exportDebtSoftwareToExcel;

    function toggleDebtSoftwareTools() {
      const box = document.getElementById('debtSoftwareToolsBox');
      const btn = document.getElementById('btnToggleDebtSoftwareTools');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || !box.style.display);
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (btn) {
          btn.style.background = 'rgba(239, 68, 68, 0.4)';
          btn.style.boxShadow = '0 0 18px rgba(239, 68, 68, 0.9)';
        }
      } else {
        box.style.display = 'none';
        if (btn) {
          btn.style.background = 'rgba(239, 68, 68, 0.18)';
          btn.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.4)';
        }
      }
    }
    window.toggleDebtSoftwareTools = toggleDebtSoftwareTools;

    function triggerImportDebtSoftwareExcel() {
      const fileInput = document.getElementById('debtSoftwareExcelFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
    window.triggerImportDebtSoftwareExcel = triggerImportDebtSoftwareExcel;

    // Helper chuẩn hóa ngày từ Excel (chuỗi "YYYY-MM-DD", "DD/MM/YYYY", Date object, hoặc Serial)
    function parseExcelDateToDMY(raw) {
      const vnNow = getVietnamDate();
      const defDay = String(vnNow.getDate()).padStart(2, '0');
      const defMonth = String(vnNow.getMonth() + 1).padStart(2, '0');
      const defYear = String(vnNow.getFullYear());

      if (!raw) return { dayMonth: `${defDay}-${defMonth}`, year: defYear };

      if (raw instanceof Date && !isNaN(raw.getTime())) {
        const d = String(raw.getDate()).padStart(2, '0');
        const m = String(raw.getMonth() + 1).padStart(2, '0');
        const y = String(raw.getFullYear());
        return { dayMonth: `${d}-${m}`, year: y };
      }

      if (typeof raw === 'number' && !isNaN(raw) && raw > 20000 && raw < 90000) {
        try {
          const dObj = new Date(Math.round((raw - 25569) * 86400 * 1000));
          if (!isNaN(dObj.getTime())) {
            const d = String(dObj.getDate()).padStart(2, '0');
            const m = String(dObj.getMonth() + 1).padStart(2, '0');
            const y = String(dObj.getFullYear());
            return { dayMonth: `${d}-${m}`, year: y };
          }
        } catch(e){}
      }

      let s = String(raw).trim();
      let mYMD = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (mYMD) {
        let y = mYMD[1];
        let m = mYMD[2].padStart(2, '0');
        let d = mYMD[3].padStart(2, '0');
        return { dayMonth: `${d}-${m}`, year: y };
      }

      let mDMY = s.match(/^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{4}))?/);
      if (mDMY) {
        let d = mDMY[1].padStart(2, '0');
        let m = mDMY[2].padStart(2, '0');
        let y = mDMY[3] || defYear;
        return { dayMonth: `${d}-${m}`, year: y };
      }

      return { dayMonth: `${defDay}-${defMonth}`, year: defYear };
    }

    function handleImportDebtSoftwareExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          let rows = [];
          if (typeof XLSX !== 'undefined') {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
              alert("File Excel không có trang tính nào!");
              return;
            }
            // Ưu tiên sheet có chứa chữ "công nợ" hoặc sheet đầu tiên
            let sheetName = workbook.SheetNames[0];
            const foundDebtSheet = workbook.SheetNames.find(sn => /cong\s*no|so\s*cong\s*no/i.test(sn.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
            if (foundDebtSheet) sheetName = foundDebtSheet;

            rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: '' });
          } else {
            const textDecoder = new TextDecoder('utf-8');
            const lines = textDecoder.decode(e.target.result).split(/\r?\n/).filter(line => line.trim().length > 0);
            rows = lines.map(line => line.split(/[,;\t]/).map(c => c.replace(/^"|"$/g, '').trim()));
          }

          if (!rows || rows.length <= 1) {
            alert("File Excel không có dữ liệu để nhập!");
            return;
          }

          let cleanHeader = rows[0].map(h => String(h || '')
            .toLowerCase()
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim());

          let colIdxCustomer = -1, colIdxDevice = -1, colIdxPrice = -1, colIdxCost = -1, colIdxTime = -1;

          cleanHeader.forEach((col, idx) => {
            if (col === 'ngay' || col === 'gio' || col.includes('thoi gian') || col.includes('ngay gio') || col.includes('date') || col.includes('time')) {
              colIdxTime = idx;
            } else if (col === 'khach' || col.includes('khach hang') || col.includes('customer') || col === 'tho' || col.includes('ten tho')) {
              colIdxCustomer = idx;
            } else if (col === 'noi dung' || col.includes('thiet bi') || col.includes('phan mem') || col.includes('device') || col.includes('ten may') || (col.includes('dich vu') && !col.includes('phi'))) {
              colIdxDevice = idx;
            } else if (col.includes('phi') || col.includes('gia nhap') || col.includes('von') || col.includes('cost')) {
              colIdxCost = idx;
            } else if (col === 'so no' || col.includes('no') || col.includes('bao gia') || col.includes('gia ban') || col.includes('tien') || col.includes('price')) {
              if (colIdxPrice === -1) colIdxPrice = idx;
            }
          });

          // Fallback vị trí nếu không tìm thấy header
          if (colIdxCustomer === -1) colIdxCustomer = 0;
          if (colIdxDevice === -1) colIdxDevice = (rows[0].length >= 3 ? 2 : 1);
          if (colIdxPrice === -1) colIdxPrice = (rows[0].length >= 4 ? 3 : 2);
          if (colIdxTime === -1) colIdxTime = (rows[0].length >= 5 ? 4 : -1);

          let newRecords = [];

          for (let i = 1; i < rows.length; i++) {
            let row = rows[i];
            if (!row || row.length === 0 || row.every(c => String(c).trim() === '')) continue;

            let customer = colIdxCustomer !== -1 && row[colIdxCustomer] ? String(row[colIdxCustomer]).trim() : 'Khách lẻ';
            let device = colIdxDevice !== -1 && row[colIdxDevice] ? String(row[colIdxDevice]).trim() : '';

            // Bỏ qua dòng TỔNG CỘNG nếu có ở cuối bảng
            if (/tong\s*cong|total/i.test(customer.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) continue;

            let rawPrice = colIdxPrice !== -1 && row[colIdxPrice] !== undefined ? String(row[colIdxPrice]).trim() : '0';
            let rawCost = colIdxCost !== -1 && row[colIdxCost] !== undefined ? String(row[colIdxCost]).trim() : '0';
            let rawTime = colIdxTime !== -1 && row[colIdxTime] !== undefined ? row[colIdxTime] : '';

            let numPrice = parsePriceNum(rawPrice) || 0;
            if (numPrice <= 0) continue; // Chỉ nhận các đơn có số nợ > 0

            if (!device && !customer) continue;
            if (!device) device = 'Cài phần mềm';

            let { dayMonth, year } = parseExcelDateToDMY(rawTime);

            let numCost = parsePriceNum(rawCost) || 0;
            let profit = String(numPrice - numCost);
            let custFormatted = toTitleCase(customer);
            let devFormatted = toTitleCase(device);
            let priceStr = String(numPrice);
            let costStr = String(numCost);

            // Kiểm tra trùng lặp để GHI ĐÈ thay vì tạo thêm đơn trùng
            let existing = softwareDatabase.find(s => {
              let sameCust = (s.customer || '').toLowerCase().trim() === custFormatted.toLowerCase().trim();
              let sameDev = (s.device || '').toLowerCase().trim() === devFormatted.toLowerCase().trim();
              let sameDate = (s.dayMonth === dayMonth && (String(s.year || '2026') === String(year || '2026')));
              return sameCust && sameDev && sameDate;
            });

            if (existing) {
              existing.price = priceStr;
              existing.cost = costStr;
              existing.profit = profit;
              existing.paymentStatus = 'NỢ DAI VL';
              updatedRecords.push(existing);
            } else {
              newRecords.push({
                id: Date.now() + Math.floor(Math.random() * 100000) + i,
                customer: custFormatted,
                device: devFormatted,
                price: priceStr,
                cost: costStr,
                profit: profit,
                dayMonth: dayMonth,
                year: year,
                time: '00:00',
                paymentStatus: 'NỢ DAI VL',
                selected: false
              });
            }
          }

          if (newRecords.length === 0 && updatedRecords.length === 0) {
            alert("Không tìm thấy dòng nợ phần mềm hợp lệ nào (> 0đ) trong file Excel!");
            return;
          }

          if (newRecords.length > 0) {
            softwareDatabase = [...newRecords, ...softwareDatabase];
          }
          saveSoftwareStorage([...newRecords, ...updatedRecords]);
          renderSoftwareTable(softwareDatabase);
          renderDebtSoftwareList();
          renderDebtDashboard();

          let msg = "Nhập Excel thành công!";
          if (newRecords.length > 0 && updatedRecords.length > 0) {
            msg = `Đã thêm mới ${newRecords.length} khoản nợ và cập nhật (ghi đè) ${updatedRecords.length} khoản nợ đã có!`;
          } else if (newRecords.length > 0) {
            msg = `Đã nhập thành công ${newRecords.length} khoản nợ phần mềm mới từ file Excel!`;
          } else {
            msg = `Đã cập nhật (ghi đè) thành công ${updatedRecords.length} khoản nợ phần mềm đã có từ file Excel!`;
          }
          alert(msg);
        } catch (err) {
          console.error("Lỗi đọc file Excel nợ phần mềm:", err);
          alert("Có lỗi xảy ra khi xử lý file Excel: " + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    window.handleImportDebtSoftwareExcelFile = handleImportDebtSoftwareExcelFile;

    function deleteSelectedDebtSoftwareItems() {
      const chks = Array.from(document.querySelectorAll('.chk-debt-software:checked'));
      if (chks.length === 0) {
        alert("Vui lòng tick chọn ít nhất một khoản nợ phần mềm cần xóa!");
        return;
      }

      if (!confirm(`Bạn có chắc chắn muốn xóa ${chks.length} khoản nợ phần mềm đã chọn không?`)) return;

      const deleteIds = new Set(chks.map(c => String(c.value)));
      const itemsToDelete = softwareDatabase.filter(s => deleteIds.has(String(s.id)));

      softwareDatabase = softwareDatabase.filter(s => !deleteIds.has(String(s.id)));
      saveSoftwareStorage();

      if (typeof db !== 'undefined' && db) {
        itemsToDelete.forEach(it => {
          if (it && it.id) {
            db.collection('software').doc(String(it.id)).delete().catch(console.error);
          }
        });
      }

      if (typeof logActivity === 'function') {
        logActivity('DELETE', 'phanmem', 'Phần mềm', `Xóa hàng loạt ${itemsToDelete.length} khoản nợ phần mềm`, itemsToDelete, null, 'batch');
      }

      // Reset checkbox master
      const masterChk = document.getElementById('chkMasterDebtSoftware');
      if (masterChk) masterChk.checked = false;

      renderSoftwareTable(softwareDatabase);
      renderDebtSoftwareList();
      renderDebtDashboard();

      if (typeof showToast === 'function') {
        showToast(`Đã xóa thành công ${itemsToDelete.length} khoản nợ phần mềm!`);
      } else {
        alert(`Đã xóa thành công ${itemsToDelete.length} khoản nợ phần mềm!`);
      }
    }
    window.deleteSelectedDebtSoftwareItems = deleteSelectedDebtSoftwareItems;

    function payDebtSoftwareItem(id) {
      const item = softwareDatabase.find(x => x.id === id);
      if (item) {
        if (confirm(`Xác nhận thanh toán nợ cho "${item.customer || 'Khách lẻ'}"\n- Thiết bị: ${item.device || ''}\n- Số tiền nợ: ${formatPriceStr(item.price)}?`)) {
          item.paymentStatus = 'ĐÃ TRẢ';
          saveSoftwareStorage(item);
          if (typeof renderSoftwareDebtTable === 'function') renderSoftwareDebtTable();
          if (typeof renderSoftwareTable === 'function') renderSoftwareTable(softwareDatabase);
          if (typeof renderDebtDashboard === 'function') renderDebtDashboard();
          if (typeof updateSoftwareProfits === 'function') updateSoftwareProfits();
          if (typeof updateSoftwarePayButtonVisibility === 'function') updateSoftwarePayButtonVisibility();
        }
      }
    }

    // 2. TAB KHÁCH HÀNG NỢ TỔNG HỢP (BÁN HÀNG, SỬA CHỮA, BÁN MÁY, BÁN GÀ)
    function renderDebtCustomerList() {
      const tbody = document.getElementById('debtCustomerTableBody');
      if (!tbody) return;

      let list = getCustomerDebtsList();

      const cFilter = debtSubFilters.customer || { search: '', range: 'ALL' };
      if (cFilter.search) {
        list = list.filter(item => {
          let cust = (item.customer || '').toLowerCase();
          let desc = (item.desc || '').toLowerCase();
          let imei = (item.imei || '').toLowerCase();
          return cust.includes(cFilter.search) || desc.includes(cFilter.search) || imei.includes(cFilter.search);
        });
      }
      if (cFilter.range && cFilter.range !== 'ALL') {
        list = list.filter(item => checkDebtAmountMatch(item.amount, cFilter.range));
      }

      // Thống kê số lượng khoản nợ và tổng số nợ
      let totalAmount = list.reduce((sum, item) => sum + (item.amount || 0), 0);
      const countEl = document.getElementById('debtCustomerCountVal');
      if (countEl) countEl.innerText = `${list.length} khoản`;
      const totalEl = document.getElementById('debtCustomerTotalAmountVal');
      if (totalEl) totalEl.innerText = formatPriceStr(totalAmount);

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Không có khoản khách hàng nợ nào phù hợp.</td></tr>`;
        updateBatchPayVisibility('customer');
        return;
      }

      tbody.innerHTML = list.map(item => `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="sw-checkbox chk-debt-item chk-debt-customer" data-source-type="${item.sourceType}" data-source-id="${item.sourceId}" data-imei="${item.imei || ''}" data-amount="${item.amount || 0}" data-name="${escapeHtml(item.customer || 'Khách lẻ')}" value="${item.sourceType}_${item.sourceId}" onchange="updateBatchPayVisibility('customer')">
          </td>
          <td style="font-weight: 800; color: #38bdf8;">${escapeHtml(item.customer || 'Khách lẻ')}</td>
          <td style="text-align: center;">${item.sourceBadge}</td>
          <td style="color: #cbd5e1; font-weight: 700;">${escapeHtml(formatBrandDeviceName(item.desc))}</td>
          <td style="text-align: right;"><span style="color: #facc15; font-weight: 900; font-size: 1.15rem;">${formatPriceStr(item.amount)}</span></td>
          <td style="text-align: center; color: #94a3b8;">${escapeHtml(item.date)}</td>
          <td style="text-align: center;"><span class="badge-debt-active">💀 NỢ DAI VL</span></td>
          <td style="text-align: center;">
            <div class="action-btn-group" style="justify-content: center;">
              <button type="button" class="action-btn-icon action-btn-edit" onclick="editDebtCustomerItem('${item.sourceType}', '${item.sourceId}')" title="Sửa">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="action-btn-icon action-btn-del" onclick="deleteDebtCustomerItem('${item.sourceType}', '${item.sourceId}', '${item.imei || ''}')" title="Xóa">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      updateBatchPayVisibility('customer');
    }

    function editDebtCustomerItem(sourceType, sourceId) {
      if (sourceType === 'banhang' || sourceType === 'banmay') {
        if (typeof editSale === 'function') editSale(sourceId);
      } else if (sourceType === 'suachua') {
        if (typeof openRepairModal === 'function') openRepairModal(sourceId);
      } else if (sourceType === 'banga') {
        if (typeof editBangaSale === 'function') editBangaSale(sourceId);
      }
    }

    function deleteDebtCustomerItem(sourceType, sourceId, imei) {
      if (!confirm('Bạn có chắc muốn xóa khoản nợ khách hàng này không?')) return;
      if (sourceType === 'banhang' || sourceType === 'banmay') {
        salesDatabase = salesDatabase.filter(s => String(s.id) !== String(sourceId) && s.id != sourceId);
        saveSalesStorage();
        renderSalesTable(salesDatabase);
        if (imei && typeof soldPhoneDatabase !== 'undefined') {
          soldPhoneDatabase = soldPhoneDatabase.filter(p => !p.imei || String(p.imei).trim() !== String(imei).trim());
          savePhoneStorage();
          renderSoldPhoneTable();
        }
      } else if (sourceType === 'suachua') {
        repairDatabase = repairDatabase.filter(r => String(r.id) !== String(sourceId) && r.id != sourceId);
        saveRepairDb();
        renderRepairTable();
      } else if (sourceType === 'banga') {
        bangaDatabase = bangaDatabase.filter(b => String(b.id) !== String(sourceId) && b.id != sourceId);
        saveBangaStorage();
        renderBangaTable(bangaDatabase);
      }
      renderDebtDashboard();
    }

    // XỬ LÝ THANH TOÁN CHO KHÁCH HÀNG NỢ ĐA NGUỒN
    function payCustomerDebtItem(sourceType, sourceId, imei, skipRerender) {
      if (sourceType === 'banhang' || sourceType === 'banmay') {
        const item = salesDatabase.find(x => String(x.id) === String(sourceId) || x.id == sourceId);
        if (item) {
          item.paymentStatus = 'Đã Trả';
          if (item.method === 'Nợ' || item.method === 'nợ') item.method = 'Tiền mặt';
          saveSalesStorage();
          if (!skipRerender) renderSalesTable(salesDatabase);
        }
        if (imei && typeof soldPhoneDatabase !== 'undefined') {
          const sp = soldPhoneDatabase.find(p => p.imei && String(p.imei).trim() === String(imei).trim());
          if (sp) {
            sp.paymentStatus = 'Đã Trả';
            if (sp.method === 'Nợ' || sp.method === 'nợ') sp.method = 'Tiền mặt';
            if (sp.paymentMethod === 'Nợ' || sp.paymentMethod === 'nợ') sp.paymentMethod = 'Tiền mặt';
            savePhoneStorage();
            if (!skipRerender) renderSoldPhoneTable();
          }
        }
      } else if (sourceType === 'banga') {
        const item = bangaDatabase.find(x => String(x.id) === String(sourceId) || x.id == sourceId);
        if (item) {
          item.paymentStatus = 'Đã Trả';
          if (item.method === 'Nợ' || item.method === 'nợ') item.method = 'Tiền mặt';
          saveBangaStorage();
          if (!skipRerender) renderBangaTable(bangaDatabase);
        }
        if (imei && typeof soldPhoneDatabase !== 'undefined') {
          const sp = soldPhoneDatabase.find(p => p.imei && String(p.imei).trim() === String(imei).trim());
          if (sp) {
            sp.paymentStatus = 'Đã Trả';
            if (sp.method === 'Nợ' || sp.method === 'nợ') sp.method = 'Tiền mặt';
            if (sp.paymentMethod === 'Nợ' || sp.paymentMethod === 'nợ') sp.paymentMethod = 'Tiền mặt';
            savePhoneStorage();
            if (!skipRerender) renderSoldPhoneTable();
          }
        }
      } else if (sourceType === 'repair') {
        const item = repairDatabase.find(x => String(x.id) === String(sourceId) || x.id == sourceId);
        if (item) {
          item.status = 'Đã thanh toán';
          item.paymentStatus = 'Đã Trả';
          saveRepairDb();
          if (!skipRerender) renderRepairTable();
        }
      } else if (sourceType === 'banmay_phone') {
        const sp = soldPhoneDatabase.find(x => String(x.id) === String(sourceId) || x.id == sourceId);
        if (sp) {
          sp.paymentStatus = 'Đã Trả';
          if (sp.method === 'Nợ' || sp.method === 'nợ') sp.method = 'Tiền mặt';
          if (sp.paymentMethod === 'Nợ' || sp.paymentMethod === 'nợ') sp.paymentMethod = 'Tiền mặt';
          savePhoneStorage();
          if (!skipRerender) renderSoldPhoneTable();
        }
      }

      if (!skipRerender) renderDebtDashboard();
    }

    function payDebtSaleItem(id) {
      payCustomerDebtItem('banhang', id);
    }

    // 3. TAB NỢ KHÁC
    function renderDebtOtherList() {
      const tbody = document.getElementById('debtOtherTableBody');
      if (!tbody) return;

      let list = [...otherDebtDatabase];

      const oFilter = debtSubFilters.other || { search: '', range: 'ALL' };
      if (oFilter.search) {
        list = list.filter(item => {
          let tar = (item.target || '').toLowerCase();
          let rsn = (item.reason || '').toLowerCase();
          let phn = (item.phone || '').toLowerCase();
          let nt = (item.note || '').toLowerCase();
          return tar.includes(oFilter.search) || rsn.includes(oFilter.search) || phn.includes(oFilter.search) || nt.includes(oFilter.search);
        });
      }
      if (oFilter.range && oFilter.range !== 'ALL') {
        list = list.filter(item => checkDebtAmountMatch(item.amount, oFilter.range));
      }

      // Thống kê số lượng khoản nợ và tổng số nợ
      let totalAmount = list.reduce((sum, item) => sum + (parsePriceNum(item.amount) || 0), 0);
      const countEl = document.getElementById('debtOtherCountVal');
      if (countEl) countEl.innerText = `${list.length} khoản`;
      const totalEl = document.getElementById('debtOtherTotalAmountVal');
      if (totalEl) totalEl.innerText = formatPriceStr(totalAmount);

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Không có khoản nợ khác nào phù hợp.</td></tr>`;
        updateBatchPayVisibility('other');
        return;
      }

      tbody.innerHTML = list.map(item => `
        <tr>
          <td style="text-align: center;">
            <input type="checkbox" class="sw-checkbox chk-debt-item chk-debt-other" value="${item.id}" data-amount="${parsePriceNum(item.amount)}" data-name="${escapeHtml(item.target)}" onchange="updateBatchPayVisibility('other')">
          </td>
          <td style="font-weight: 800; color: #fff;">
            ${escapeHtml(item.target)}
            ${item.phone ? `<div style="font-size: 0.8rem; color: #94a3b8; font-weight: normal; margin-top: 2px;">📞 ${escapeHtml(item.phone)}</div>` : ''}
          </td>
          <td style="color: #cbd5e1;">
            ${escapeHtml(formatBrandDeviceName(item.reason))}
            ${item.note ? `<div style="font-size: 0.8rem; color: #94a3b8; font-style: italic; margin-top: 2px;">📝 ${escapeHtml(item.note)}</div>` : ''}
          </td>
          <td style="text-align: right;"><span style="color: #facc15; font-weight: 900; font-size: 1.15rem;">${formatPriceStr(item.amount)}</span></td>
          <td style="text-align: center; color: #94a3b8;">${escapeHtml(item.date)}</td>
          <td style="text-align: center;">
            <div class="action-btn-group" style="justify-content: center;">
              <button type="button" class="action-btn-icon action-btn-edit" onclick="editOtherDebtItem(${item.id})" title="Sửa">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="action-btn-icon action-btn-del" onclick="deleteOtherDebtItem(${item.id})" title="Xóa">
                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join('');

      updateBatchPayVisibility('other');
    }

    function payOtherDebtItem(id) {
      otherDebtDatabase = otherDebtDatabase.filter(x => x.id !== id);
      saveOtherDebtDb();
      renderDebtDashboard();
    }

    // ============================================================
    // LOGIC CHECKBOX VÀ THU NỢ HÀNG LOẠT (XÁC NHẬN BẤM OK LÀ XONG)
    // ============================================================
    let currentBatchPaySection = null;
    let currentBatchPayItems = [];

    function toggleSelectAllDebts(section, masterChk) {
      const chks = document.querySelectorAll(`.chk-debt-${section}`);
      chks.forEach(c => c.checked = masterChk.checked);
      updateBatchPayVisibility(section);
    }

    function updateBatchPayVisibility(section) {
      const chks = Array.from(document.querySelectorAll(`.chk-debt-${section}:checked`));
      const sectionCap = section.charAt(0).toUpperCase() + section.slice(1);
      const btn = document.getElementById(`btnBatchPay${sectionCap}`);
      const countSpan = document.getElementById(`batchCount${sectionCap}`);
      const totalSpan = document.getElementById(`batchTotal${sectionCap}`);

      if (btn) {
        if (chks.length > 0) {
          let sum = 0;
          chks.forEach(c => {
            sum += (Number(c.dataset.amount) || 0);
          });
          if (countSpan) countSpan.innerText = chks.length;
          if (totalSpan) totalSpan.innerText = formatPriceStr(sum);
          btn.style.display = 'inline-flex';
        } else {
          btn.style.display = 'none';
        }
      }

      // Cập nhật trạng thái master checkbox
      const allChks = document.querySelectorAll(`.chk-debt-${section}`);
      const masterChk = document.getElementById(`chkMasterDebt${sectionCap}`);
      if (masterChk && allChks.length > 0) {
        masterChk.checked = (chks.length === allChks.length);
      }
    }

    function openBatchPayDebtModal(section) {
      currentBatchPaySection = section;
      const chks = Array.from(document.querySelectorAll(`.chk-debt-${section}:checked`));
      if (chks.length === 0) return;

      currentBatchPayItems = chks.map(c => ({
        id: c.value,
        amount: Number(c.dataset.amount) || 0,
        name: c.dataset.name || 'Khách nợ',
        sourceType: c.dataset.sourceType,
        sourceId: c.dataset.sourceId,
        imei: c.dataset.imei
      }));

      const totalSum = currentBatchPayItems.reduce((s, it) => s + it.amount, 0);

      const descEl = document.getElementById('batchPayModalDesc');
      if (descEl) {
        descEl.innerHTML = `Bạn có chắc chắn muốn xác nhận <b>THU NỢ</b> cho <b>${currentBatchPayItems.length} khoản</b> đã chọn?<br>Tổng số tiền: <b style="color: #facc15; font-size: 1.2rem;">${formatPriceStr(totalSum)}</b>`;
      }

      const boxEl = document.getElementById('batchPayModalSummaryBox');
      if (boxEl) {
        boxEl.innerHTML = currentBatchPayItems.map((it, idx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.88rem;">
            <span style="color: #fff; font-weight: 700;">${idx + 1}. ${escapeHtml(it.name)}</span>
            <span style="color: #facc15; font-weight: 900;">${formatPriceStr(it.amount)}</span>
          </div>
        `).join('');
      }

      const modal = document.getElementById('batchPayDebtModal');
      if (modal) modal.style.display = 'flex';
    }

    function closeBatchPayDebtModal() {
      const modal = document.getElementById('batchPayDebtModal');
      if (modal) modal.style.display = 'none';
      currentBatchPayItems = [];
      currentBatchPaySection = null;
    }

    function executeBatchPayDebt() {
      if (!currentBatchPaySection || currentBatchPayItems.length === 0) {
        closeBatchPayDebtModal();
        return;
      }

      if (currentBatchPaySection === 'software') {
        currentBatchPayItems.forEach(it => {
          const item = softwareDatabase.find(x => String(x.id) === String(it.id));
          if (item) item.paymentStatus = 'ĐÃ TRẢ';
        });
        if (typeof selectedSoftwareDebtCustomers !== 'undefined') selectedSoftwareDebtCustomers.clear();
        saveSoftwareStorage();
        renderSoftwareTable(softwareDatabase);
      } else if (currentBatchPaySection === 'customer') {
        currentBatchPayItems.forEach(it => {
          payCustomerDebtItem(it.sourceType, it.sourceId, it.imei, true);
        });
        saveSalesStorage();
        saveBangaStorage();
        saveRepairDb();
        savePhoneStorage();
        renderSalesTable(salesDatabase);
        renderBangaTable(bangaDatabase);
        renderRepairTable();
        renderSoldPhoneTable();
      } else if (currentBatchPaySection === 'other') {
        const idsToPay = new Set(currentBatchPayItems.map(it => String(it.id)));
        otherDebtDatabase = otherDebtDatabase.filter(x => !idsToPay.has(String(x.id)));
        saveOtherDebtDb();
      }

      closeBatchPayDebtModal();
      renderDebtDashboard();
      if (typeof renderSoftwareDebtTable === 'function') renderSoftwareDebtTable();
    }


    function openOtherDebtModal(editId = null) {
      const modal = document.getElementById('otherDebtModal');
      if (!modal) return;
      const form = document.getElementById('otherDebtForm');
      if (form) form.reset();

      document.getElementById('otherDebtEditId').value = editId || '';

      if (editId) {
        const item = otherDebtDatabase.find(x => String(x.id) === String(editId));
        if (item) {
          document.getElementById('otherDebtModalTitle').innerText = 'Sửa nợ khác';
          document.getElementById('otherDebtSubmitBtn').innerHTML = '<span>💾</span> Cập nhật nợ';
          document.getElementById('otherDebtTarget').value = item.target || '';
          document.getElementById('otherDebtPhone').value = item.phone || '';
          document.getElementById('otherDebtReason').value = item.reason || '';
          document.getElementById('otherDebtAmount').value = formatPriceStr(item.amount) || '';
          if (item.date && item.date.includes('/')) {
            const p = item.date.split('/');
            if (p.length === 3) {
              document.getElementById('otherDebtDate').value = `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
            }
          } else if (item.date && item.date.includes('-')) {
            document.getElementById('otherDebtDate').value = item.date;
          }
          document.getElementById('otherDebtNote').value = item.note || '';
        }
      } else {
        document.getElementById('otherDebtModalTitle').innerText = 'Thêm nợ khác';
        document.getElementById('otherDebtSubmitBtn').innerHTML = '<span>+</span> Thêm nợ';
        const vn = getVietnamDate();
        const yyyy = vn.getFullYear();
        const mm = String(vn.getMonth() + 1).padStart(2, '0');
        const dd = String(vn.getDate()).padStart(2, '0');
        document.getElementById('otherDebtDate').value = `${yyyy}-${mm}-${dd}`;
      }

      modal.style.display = 'flex';
      modal.classList.add('active');
      setTimeout(() => {
        const targetInput = document.getElementById('otherDebtTarget');
        if (targetInput) targetInput.focus();
      }, 60);
    }

    function closeOtherDebtModal() {
      const modal = document.getElementById('otherDebtModal');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }

    // Giữ tương thích nếu có nơi gọi openOtherDebtPrompt & gắn vào window
    function openOtherDebtPrompt() {
      openOtherDebtModal();
    }
    window.openOtherDebtModal = openOtherDebtModal;
    window.closeOtherDebtModal = closeOtherDebtModal;
    window.openOtherDebtPrompt = openOtherDebtModal;
    window.editOtherDebtItem = editOtherDebtItem;
    window.deleteOtherDebtItem = deleteOtherDebtItem;
    window.saveOtherDebtForm = saveOtherDebtForm;

    function saveOtherDebtForm(event) {
      if (event) event.preventDefault();
      const target = (document.getElementById('otherDebtTarget').value || '').trim();
      const phone = (document.getElementById('otherDebtPhone').value || '').trim();
      const reason = (document.getElementById('otherDebtReason').value || '').trim();
      const amount = parsePriceNum(document.getElementById('otherDebtAmount').value);
      const dateVal = document.getElementById('otherDebtDate').value;
      const note = (document.getElementById('otherDebtNote').value || '').trim();

      if (!target) {
        alert('Vui lòng nhập tên đối tượng!');
        document.getElementById('otherDebtTarget').focus();
        return;
      }
      if (!reason) {
        alert('Vui lòng nhập nội dung nợ!');
        document.getElementById('otherDebtReason').focus();
        return;
      }
      if (amount <= 0) {
        alert('Vui lòng nhập số tiền nợ hợp lệ!');
        document.getElementById('otherDebtAmount').focus();
        return;
      }

      let dateFormatted = getCurrentDateStr();
      if (dateVal) {
        const dp = dateVal.split('-');
        if (dp.length === 3) {
          dateFormatted = `${dp[2]}/${dp[1]}/${dp[0]}`;
        }
      }

      const editId = document.getElementById('otherDebtEditId').value;
      if (editId) {
        const item = otherDebtDatabase.find(x => String(x.id) === String(editId));
        if (item) {
          const oldData = JSON.parse(JSON.stringify(item));
          item.target = target;
          item.phone = phone;
          item.reason = reason;
          item.amount = amount;
          item.date = dateFormatted;
          item.note = note;
          logActivity('EDIT', 'congno_other', 'Nợ khác', `Sửa nợ khác: ${target} - ${reason} (${formatPriceStr(amount)})`, oldData, item, item.id);
        }
      } else {
        const newItem = {
          id: Date.now(),
          target: target,
          phone: phone,
          reason: reason,
          amount: amount,
          date: dateFormatted,
          note: note
        };
        otherDebtDatabase.unshift(newItem);
        logActivity('ADD', 'congno_other', 'Nợ khác', `Thêm nợ khác: ${target} - ${reason} (${formatPriceStr(amount)})`, null, newItem, newItem.id);
      }

      saveOtherDebtDb();
      closeOtherDebtModal();
      renderDebtDashboard();
      if (typeof renderDebtOtherList === 'function') renderDebtOtherList();
    }

    function editOtherDebtItem(id) {
      openOtherDebtModal(id);
    }

    function deleteOtherDebtItem(id) {
      const item = otherDebtDatabase.find(x => x.id === id);
      if (confirm('Bạn có chắc muốn xóa khoản nợ này không?')) {
        if (item) {
          logActivity('DELETE', 'congno_other', 'Nợ khác', `Xóa nợ khác: ${item.target} - ${item.reason} (${formatPriceStr(item.amount)})`, item, null, id);
        }
        otherDebtDatabase = otherDebtDatabase.filter(x => x.id !== id);
        saveOtherDebtDb();
        renderDebtDashboard();
        if (typeof renderDebtOtherList === 'function') renderDebtOtherList();
      }
    }

    // =========================================================
    // MODULE NHẬT KÝ THAY ĐỔI & KHÔI PHỤC DỮ LIỆU
    // =========================================================
    let currentReportSubSection = 'finance';
    let activityLogDatabase = JSON.parse(localStorage.getItem('KIMCHI_ACTIVITY_LOG')) || [];
    if (Array.isArray(activityLogDatabase)) {
      activityLogDatabase = activityLogDatabase.filter(x => x && x.id !== 'log_init_1');
    } else {
      activityLogDatabase = [];
    }

    function saveActivityLogDb() {
      if (activityLogDatabase.length > 500) {
        activityLogDatabase = activityLogDatabase.slice(0, 500);
      }
      localStorage.setItem('KIMCHI_ACTIVITY_LOG', JSON.stringify(activityLogDatabase));
    }

    function logActivity(action, module, moduleName, description, oldData = null, newData = null, targetId = null) {
      const timeStr = typeof getCurrentTimeStr === 'function' ? getCurrentTimeStr() : '';
      const dateStr = typeof getCurrentDateStr === 'function' ? getCurrentDateStr() : '';
      const logItem = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        time: `${timeStr} - ${dateStr}`,
        action: action, // 'ADD', 'EDIT', 'DELETE'
        module: module,
        moduleName: moduleName,
        description: description,
        oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
        newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        targetId: targetId,
        isRestored: false,
        restoredTime: null
      };
      activityLogDatabase.unshift(logItem);
      saveActivityLogDb();
      if (currentReportSubSection === 'log') {
        renderActivityLogTable();
      }
    }

    function switchReportSection(sec, btn) {
      currentReportSubSection = sec;
      const tabGroup = document.getElementById('reportSubTabsGroup');
      if (tabGroup) {
        tabGroup.querySelectorAll('.brand-btn-h').forEach(b => b.classList.remove('active'));
      }
      if (btn) btn.classList.add('active');

      const secFinance = document.getElementById('repSecFinance');
      const secLog = document.getElementById('repSecLog');
      const secAccount = document.getElementById('repSecAccount');
      const monthPicker = document.getElementById('repMonthPickerWrap');

      if (monthPicker) {
        monthPicker.style.display = (sec === 'finance') ? 'flex' : 'none';
      }

      if (secFinance) secFinance.style.display = (sec === 'finance') ? 'block' : 'none';
      if (secLog) {
        secLog.style.display = (sec === 'log') ? 'block' : 'none';
        if (sec === 'log') renderActivityLogTable();
      }
      if (secAccount) {
        secAccount.style.display = (sec === 'account') ? 'block' : 'none';
        if (sec === 'account') renderSystemAccountsTable();
      }
    }

    let logFilterSearch = '';
    let logFilterAction = 'ALL';
    let logFilterModule = 'ALL';

    function setLogFilter(key, val) {
      if (key === 'search') logFilterSearch = (val || '').toLowerCase().trim();
      if (key === 'action') logFilterAction = val;
      if (key === 'module') logFilterModule = val;
      renderActivityLogTable();
    }

    function clearAllActivityLogs() {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử nhật ký không?')) {
        activityLogDatabase = [];
        saveActivityLogDb();
        renderActivityLogTable();
      }
    }

    function renderActivityLogTable() {
      const tbody = document.getElementById('activityLogTableBody');
      if (!tbody) return;

      let list = [...activityLogDatabase];

      if (logFilterSearch) {
        list = list.filter(item => {
          const desc = (item.description || '').toLowerCase();
          const mod = (item.moduleName || '').toLowerCase();
          const time = (item.time || '').toLowerCase();
          return desc.includes(logFilterSearch) || mod.includes(logFilterSearch) || time.includes(logFilterSearch);
        });
      }

      if (logFilterAction && logFilterAction !== 'ALL') {
        list = list.filter(item => item.action === logFilterAction);
      }

      if (logFilterModule && logFilterModule !== 'ALL') {
        list = list.filter(item => item.module === logFilterModule);
      }

      const countBadge = document.getElementById('activityLogCountVal');
      if (countBadge) countBadge.innerText = `${list.length} nhật ký`;

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: #94a3b8; font-weight: 700;">Chưa có bản ghi nhật ký nào phù hợp.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(item => {
        let actionBadge = '';
        if (item.action === 'ADD') {
          actionBadge = `<span style="background: rgba(16, 185, 129, 0.18); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">+ Thêm mới</span>`;
        } else if (item.action === 'EDIT') {
          actionBadge = `<span style="background: rgba(245, 158, 11, 0.18); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">✏️ Sửa</span>`;
        } else if (item.action === 'DELETE') {
          actionBadge = `<span style="background: rgba(239, 68, 68, 0.18); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">🗑️ Xóa</span>`;
        }

        const restoreBtn = item.isRestored
          ? `<div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
               <span style="color: #a855f7; font-weight: 800; font-size: 0.82rem; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); padding: 3px 8px; border-radius: 6px;">✓ Đã khôi phục</span>
               <button type="button" onclick="restoreActivityLog('${item.id}')" title="Khôi phục lại lần nữa" style="background: #1e293b; border: 1px solid #334155; color: #cbd5e1; border-radius: 6px; padding: 4px 8px; font-size: 0.78rem; cursor: pointer;">Lại</button>
             </div>`
          : `<button type="button" onclick="restoreActivityLog('${item.id}')"
               style="background: #0284c7; border: none; color: #fff; font-weight: 800; font-size: 0.82rem; padding: 6px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);">
               <span>🔄</span> Khôi phục
             </button>`;

        return `
          <tr>
            <td style="color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-align: center; white-space: nowrap;">${escapeHtml(item.time)}</td>
            <td style="font-weight: 800; color: #38bdf8; text-align: center; white-space: nowrap;">${escapeHtml(item.moduleName || '')}</td>
            <td style="text-align: center; white-space: nowrap;">${actionBadge}</td>
            <td style="color: #e2e8f0; font-size: 0.92rem; line-height: 1.4;">${escapeHtml(item.description)}</td>
            <td style="text-align: center; white-space: nowrap;">${restoreBtn}</td>
          </tr>
        `;
      }).join('');
    }

    function restoreActivityLog(logId) {
      const log = activityLogDatabase.find(x => x.id === logId);
      if (!log) {
        alert('Không tìm thấy thông tin nhật ký cần khôi phục!');
        return;
      }
      if (log.isRestored) {
        if (!confirm('Bản ghi này đã từng được khôi phục trước đây. Bạn có muốn khôi phục lại lần nữa không?')) {
          return;
        }
      } else {
        if (!confirm(`Bạn có chắc chắn muốn khôi phục thao tác: "${log.description}" không?`)) {
          return;
        }
      }

      const { action, module, oldData, newData, targetId } = log;

      try {
        if (action === 'DELETE') {
          if (!oldData) {
            alert('Không có dữ liệu gốc để khôi phục!');
            return;
          }
          if (module === 'banhang') {
            salesDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveSalesStorage();
            renderSalesTable(salesDatabase);
          } else if (module === 'banga') {
            bangaDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveBangaStorage();
            renderBangaTable(bangaDatabase);
          } else if (module === 'suachua') {
            repairDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveRepairDb();
            renderRepairTable();
          } else if (module === 'phanmem') {
            softwareDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveSoftwareStorage();
            renderSoftwareTable(softwareDatabase);
          } else if (module === 'banmay') {
            phoneDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            savePhoneStorage();
            renderPhoneGrid();
          } else if (module === 'congno_other') {
            otherDebtDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveOtherDebtDb();
            if (typeof renderDebtOtherList === 'function') renderDebtOtherList();
            renderDebtDashboard();
          } else if (module === 'congno_mine') {
            myDebtDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            saveMyDebtDb();
            if (typeof renderMyDebtTable === 'function') renderMyDebtTable();
            renderDebtDashboard();
          } else if (module === 'baohanh') {
            soldPhoneDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
            if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
          } else if (module === 'linhkien') {
            partsDatabase.unshift(JSON.parse(JSON.stringify(oldData)));
            if (typeof savePartsStorage === 'function') savePartsStorage();
            if (typeof renderPartsTable === 'function') renderPartsTable();
          }
        } else if (action === 'ADD') {
          if (module === 'banhang') {
            salesDatabase = salesDatabase.filter(x => String(x.id) !== String(targetId));
            saveSalesStorage();
            renderSalesTable(salesDatabase);
          } else if (module === 'banga') {
            bangaDatabase = bangaDatabase.filter(x => String(x.id) !== String(targetId));
            saveBangaStorage();
            renderBangaTable(bangaDatabase);
          } else if (module === 'suachua') {
            repairDatabase = repairDatabase.filter(x => String(x.id) !== String(targetId));
            saveRepairDb();
            renderRepairTable();
          } else if (module === 'phanmem') {
            softwareDatabase = softwareDatabase.filter(x => String(x.id) !== String(targetId));
            saveSoftwareStorage();
            renderSoftwareTable(softwareDatabase);
          } else if (module === 'banmay') {
            phoneDatabase = phoneDatabase.filter(x => String(x.id) !== String(targetId));
            savePhoneStorage();
            renderPhoneGrid();
          } else if (module === 'congno_other') {
            otherDebtDatabase = otherDebtDatabase.filter(x => String(x.id) !== String(targetId));
            saveOtherDebtDb();
            if (typeof renderDebtOtherList === 'function') renderDebtOtherList();
            renderDebtDashboard();
          } else if (module === 'congno_mine') {
            myDebtDatabase = myDebtDatabase.filter(x => String(x.id) !== String(targetId));
            saveMyDebtDb();
            if (typeof renderMyDebtTable === 'function') renderMyDebtTable();
            renderDebtDashboard();
          } else if (module === 'baohanh') {
            soldPhoneDatabase = soldPhoneDatabase.filter(x => String(x.id) !== String(targetId));
            localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase));
            if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable();
          } else if (module === 'linhkien') {
            partsDatabase = partsDatabase.filter(x => String(x.id) !== String(targetId));
            if (typeof savePartsStorage === 'function') savePartsStorage();
            if (typeof renderPartsTable === 'function') renderPartsTable();
          }
        } else if (action === 'EDIT') {
          if (!oldData) {
            alert('Không tìm thấy dữ liệu cũ trước khi sửa để hoàn tác!');
            return;
          }
          let targetList = null;
          let saveFn = null;
          let renderFn = null;
          if (module === 'banhang') { targetList = salesDatabase; saveFn = saveSalesStorage; renderFn = () => renderSalesTable(salesDatabase); }
          else if (module === 'banga') { targetList = bangaDatabase; saveFn = saveBangaStorage; renderFn = () => renderBangaTable(bangaDatabase); }
          else if (module === 'suachua') { targetList = repairDatabase; saveFn = saveRepairDb; renderFn = renderRepairTable; }
          else if (module === 'phanmem') { targetList = softwareDatabase; saveFn = saveSoftwareStorage; renderFn = () => renderSoftwareTable(softwareDatabase); }
          else if (module === 'banmay') { targetList = phoneDatabase; saveFn = savePhoneStorage; renderFn = renderPhoneGrid; }
          else if (module === 'congno_other') { targetList = otherDebtDatabase; saveFn = saveOtherDebtDb; renderFn = () => { if (typeof renderDebtOtherList === 'function') renderDebtOtherList(); renderDebtDashboard(); }; }
          else if (module === 'congno_mine') { targetList = myDebtDatabase; saveFn = saveMyDebtDb; renderFn = () => { if (typeof renderMyDebtTable === 'function') renderMyDebtTable(); renderDebtDashboard(); }; }
          else if (module === 'baohanh') { targetList = soldPhoneDatabase; saveFn = () => localStorage.setItem('KIMCHI_SOLD_PHONE_DB', JSON.stringify(soldPhoneDatabase)); renderFn = () => { if (typeof renderSoldPhoneTable === 'function') renderSoldPhoneTable(); }; }
          else if (module === 'linhkien') { targetList = partsDatabase; saveFn = savePartsStorage; renderFn = () => { if (typeof renderPartsTable === 'function') renderPartsTable(); }; }

          if (targetList) {
            const idx = targetList.findIndex(x => String(x.id) === String(targetId));
            if (idx !== -1) {
              targetList[idx] = JSON.parse(JSON.stringify(oldData));
            } else {
              targetList.unshift(JSON.parse(JSON.stringify(oldData)));
            }
            if (saveFn) saveFn();
            if (renderFn) renderFn();
          }
        }

        log.isRestored = true;
        log.restoredTime = (typeof getCurrentTimeStr === 'function' ? getCurrentTimeStr() : '') + ' - ' + (typeof getCurrentDateStr === 'function' ? getCurrentDateStr() : '');
        saveActivityLogDb();
        renderActivityLogTable();
        alert(`Đã khôi phục thành công!`);
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi khôi phục: ' + err.message);
      }
    }

    window.switchReportSection = switchReportSection;
    window.setLogFilter = setLogFilter;
    window.clearAllActivityLogs = clearAllActivityLogs;
    window.renderActivityLogTable = renderActivityLogTable;
    window.restoreActivityLog = restoreActivityLog;
    window.logActivity = logActivity;

    // =========================================================
    // MODULE BÁO CÁO TÀI CHÍNH
    // =========================================================
    let reportViewMode = 'month';
    let reportSelectedMonth = '10/2026';
    let reportFilterCustom = null;

    function parseVietnameseDate(dStr, defaultYear = '2026') {
      if (!dStr) return null;
      let m = dStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (m) {
        return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10), 12, 0, 0);
      }
      let m2 = dStr.match(/(\d{1,2})[\/\-](\d{1,2})/);
      if (m2) {
        return new Date(parseInt(defaultYear, 10), parseInt(m2[2], 10) - 1, parseInt(m2[1], 10), 12, 0, 0);
      }
      return null;
    }

    function formatYmdToDmy(ymd) {
      if (!ymd) return '';
      const p = ymd.split('-');
      if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
      return ymd;
    }

    function changeReportSelectedMonth(val) {
      reportSelectedMonth = val;
      setReportMode('month');
    }
    window.changeReportSelectedMonth = changeReportSelectedMonth;

    function setReportMode(mode) {
      reportViewMode = mode;
      reportFilterCustom = null;
      const btnDay = document.getElementById('repModeDayBtn');
      const btnMonth = document.getElementById('repModeMonthBtn');
      const btnAll = document.getElementById('repModeAllBtn');
      if (btnDay) btnDay.classList.toggle('active', mode === 'day');
      if (btnMonth) btnMonth.classList.toggle('active', mode === 'month');
      if (btnAll) btnAll.classList.toggle('active', mode === 'all');

      renderFinancialReports();
    }

    function handleSearchFinancialReport() {
      const fromEl = document.getElementById('repFilterFromDate');
      const toEl = document.getElementById('repFilterToDate');
      const kwEl = document.getElementById('repFilterKeyword');

      const fromVal = fromEl ? fromEl.value : '';
      const toVal = toEl ? toEl.value : '';
      const kwVal = kwEl ? kwEl.value.trim().toLowerCase() : '';

      if (!fromVal && !toVal && !kwVal) {
        alert('Vui lòng chọn ngày hoặc nhập từ khóa để tìm kiếm!');
        return;
      }

      const btnDay = document.getElementById('repModeDayBtn');
      const btnMonth = document.getElementById('repModeMonthBtn');
      const btnAll = document.getElementById('repModeAllBtn');
      if (btnDay) btnDay.classList.remove('active');
      if (btnMonth) btnMonth.classList.remove('active');
      if (btnAll) btnAll.classList.remove('active');

      reportViewMode = 'custom';
      reportFilterCustom = {
        fromDate: fromVal ? new Date(fromVal + 'T00:00:00') : null,
        toDate: toVal ? new Date(toVal + 'T23:59:59') : null,
        keyword: kwVal
      };

      const badge = document.getElementById('repFilterStatusBadge');
      if (badge) {
        let desc = 'Đang lọc: ';
        if (fromVal && toVal) desc += `Từ ${formatYmdToDmy(fromVal)} đến ${formatYmdToDmy(toVal)}`;
        else if (fromVal) desc += `Từ ngày ${formatYmdToDmy(fromVal)}`;
        else if (toVal) desc += `Đến ngày ${formatYmdToDmy(toVal)}`;
        if (kwVal) desc += (fromVal || toVal ? ` | Từ khóa: "${kwVal}"` : `Từ khóa: "${kwVal}"`);
        badge.innerText = desc;
      }

      renderFinancialReports();
    }

    function resetFinancialReportSearch() {
      const fromEl = document.getElementById('repFilterFromDate');
      const toEl = document.getElementById('repFilterToDate');
      const kwEl = document.getElementById('repFilterKeyword');
      if (fromEl) fromEl.value = '';
      if (toEl) toEl.value = '';
      if (kwEl) kwEl.value = '';
      setReportMode('day');
    }

    function renderFinancialReports() {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = String(now.getFullYear());
      const todayStr = `${dd}/${mm}/${yyyy}`;

      // Lấy tháng đang chọn từ menu sổ xuống
      const selBox = document.getElementById('repSelectMonth');
      if (selBox && selBox.value) {
        reportSelectedMonth = selBox.value;
      }
      let [selMm, selYyyy] = (reportSelectedMonth || `${mm}/${yyyy}`).split('/');
      if (!selMm || !selYyyy) {
        selMm = mm;
        selYyyy = yyyy;
      }

      // Tải chỉ tiêu kinh doanh được lưu hoặc mặc định
      let savedTargets = {};
      try {
        savedTargets = JSON.parse(localStorage.getItem('KIMCHI_FINANCIAL_TARGETS')) || {};
      } catch(e) { savedTargets = {}; }

      let items = [
        { key: 'banhang', name: '1. Bán Hàng & Phụ Kiện', rev: 0, cost: 0, profit: 0, target: savedTargets['banhang'] !== undefined ? savedTargets['banhang'] : 15000 },
        { key: 'phanmem', name: '2. Phần Mềm - QUYNH BUP BE', rev: 0, cost: 0, profit: 0, target: savedTargets['phanmem'] !== undefined ? savedTargets['phanmem'] : 30000 },
        { key: 'suachua', name: '3. Sửa Chữa Phần Cứng', rev: 0, cost: 0, profit: 0, target: savedTargets['suachua'] !== undefined ? savedTargets['suachua'] : 10000 },
        { key: 'banmay', name: '4. Bán Máy Điện Thoại', rev: 0, cost: 0, profit: 0, target: savedTargets['banmay'] !== undefined ? savedTargets['banmay'] : 5000 },
        { key: 'banga', name: '5. Bán Gà - Bán Mèo Giống....', rev: 0, cost: 0, profit: 0, target: savedTargets['banga'] !== undefined ? savedTargets['banga'] : 15000 }
      ];

      function checkMatch(dateStr, searchContent) {
        if (reportViewMode === 'custom' && reportFilterCustom) {
          if (reportFilterCustom.fromDate || reportFilterCustom.toDate) {
            const dObj = parseVietnameseDate(dateStr);
            if (dObj) {
              if (reportFilterCustom.fromDate && dObj < reportFilterCustom.fromDate) return false;
              if (reportFilterCustom.toDate && dObj > reportFilterCustom.toDate) return false;
            }
          }
          if (reportFilterCustom.keyword) {
            const text = (searchContent || '').toLowerCase();
            if (!text.includes(reportFilterCustom.keyword)) return false;
          }
          return true;
        }

        if (reportViewMode === 'day') {
          return dateStr ? dateStr.includes(todayStr) : false;
        } else if (reportViewMode === 'month') {
          return dateStr ? dateStr.includes(`/${selMm}/${selYyyy}`) : false;
        }
        return true;
      }

      // 1. Bán hàng
      salesDatabase.forEach(s => {
        if (checkMatch(s.dateTime, `${s.name || ''} ${s.customer || ''} ${s.notes || ''}`)) {
          const r = parsePriceNum(s.total);
          const c = parsePriceNum(s.priceIn);
          items[0].rev += r;
          items[0].cost += c;
          items[0].profit += (r - c);
        }
      });

      // 2. Phần mềm
      softwareDatabase.forEach(s => {
        const pDate = `${s.dayMonth ? s.dayMonth.replace('-', '/') : ''}/${s.year || yyyy}`;
        if (checkMatch(pDate, `${s.device || ''} ${s.customer || ''} ${s.service || ''}`)) {
          const r = parsePriceNum(s.price);
          const c = parsePriceNum(s.cost);
          items[1].rev += r;
          items[1].cost += c;
          items[1].profit += (r - c);
        }
      });

      // 3. Sửa chữa
      try {
        const repDb = JSON.parse(localStorage.getItem('KIMCHI_REPAIR_DB')) || [];
        repDb.forEach(s => {
          if (checkMatch(s.dateFormatted, `${s.device || ''} ${s.customer || ''} ${s.issue || ''}`)) {
            const r = parsePriceNum(s.price);
            const c = parsePriceNum(s.cost);
            items[2].rev += r;
            items[2].cost += c;
            items[2].profit += (r - c);
          }
        });
      } catch(e){}

      // 4. Bán máy
      try {
        const soldDb = JSON.parse(localStorage.getItem('KIMCHI_SOLD_PHONE_DB')) || [];
        soldDb.forEach(s => {
          if (checkMatch(s.dateTime, `${s.name || ''} ${s.customer || ''} ${s.imei || ''}`)) {
            const r = parsePriceNum(s.priceOut || s.total);
            const c = parsePriceNum(s.priceIn);
            items[3].rev += r;
            items[3].cost += c;
            items[3].profit += (r - c);
          }
        });
      } catch(e){}

      // 5. Bán gà
      bangaDatabase.forEach(s => {
        if (checkMatch(s.dateTime, `${s.name || ''} ${s.customer || ''}`)) {
          const r = parsePriceNum(s.total);
          const c = parsePriceNum(s.priceIn);
          items[4].rev += r;
          items[4].cost += c;
          items[4].profit += (r - c);
        }
      });

      let sumRev = 0, sumCost = 0, sumProf = 0;
      items.forEach(it => {
        sumRev += it.rev;
        sumCost += it.cost;
        sumProf += it.profit;
      });

      const elRev = document.getElementById('repTotalRevenueVal');
      if (elRev) elRev.innerText = formatPriceStr(sumRev);
      const elCost = document.getElementById('repTotalCostVal');
      if (elCost) elCost.innerText = formatPriceStr(sumCost);
      const elProf = document.getElementById('repTotalProfitVal');
      if (elProf) elProf.innerText = formatPriceStr(sumProf);

      const tbody = document.getElementById('reportSummaryTableBody');
      if (tbody) {
        tbody.innerHTML = items.map(it => {
          const diff = it.target - it.profit;
          const diffHtml = diff <= 0 
            ? `<span style="color: #10b981; font-weight: 900; font-size: 1.15rem;">0 (Đạt ✓)</span>`
            : `<span style="color: #f87171; font-weight: 900; font-size: 1.15rem;">${formatPriceStr(diff)}</span>`;
          return `
            <tr>
              <td style="font-weight: 800; color: #fff; font-size: 1.15rem; padding: 15px 12px;">${it.name}</td>
              <td style="text-align: right; color: #38bdf8; font-weight: 900; font-size: 1.15rem; padding: 15px 12px;">${formatPriceStr(it.rev)}</td>
              <td style="text-align: right; color: #cbd5e1; font-weight: 700; font-size: 1.15rem; padding: 15px 12px;">${formatPriceStr(it.cost)}</td>
              <td style="text-align: right; color: #10b981; font-weight: 900; font-size: 1.25rem; padding: 15px 12px;">${formatPriceStr(it.profit)}</td>
              <td style="text-align: right; color: #facc15; font-weight: 900; font-size: 1.25rem; padding: 15px 12px; cursor: pointer; user-select: none;" 
                  title="Nháy đúp để sửa chỉ tiêu" 
                  ondblclick="editFinancialTarget('${it.key}', this, ${it.target})">
                <span class="target-val-text">${formatPriceStr(it.target)}</span>
              </td>
              <td style="text-align: right; padding: 15px 12px;">${diffHtml}</td>
            </tr>
          `;
        }).join('');
      }
    }

    // Hàm chỉnh sửa chỉ tiêu bằng cách nháy đúp (double-click)
    window.editFinancialTarget = function(key, tdEl, currentVal) {
      if (tdEl.querySelector('input')) return; // Đang mở ô sửa
      const currentFormatted = formatPriceStr(currentVal);
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentFormatted;
      input.style.width = '120px';
      input.style.textAlign = 'right';
      input.style.fontSize = '1.25rem';
      input.style.fontWeight = '900';
      input.style.color = '#facc15';
      input.style.background = '#0f172a';
      input.style.border = '2px solid #facc15';
      input.style.borderRadius = '6px';
      input.style.padding = '4px 8px';
      input.style.outline = 'none';

      tdEl.innerHTML = '';
      tdEl.appendChild(input);
      input.focus();
      input.select();

      let isSaved = false;
      function saveEdit() {
        if (isSaved) return;
        isSaved = true;
        let valRaw = input.value.replace(/[^0-9]/g, '');
        let newTarget = parseInt(valRaw, 10);
        if (isNaN(newTarget) || newTarget < 0) {
          newTarget = currentVal;
        }
        let savedTargets = {};
        try {
          savedTargets = JSON.parse(localStorage.getItem('KIMCHI_FINANCIAL_TARGETS')) || {};
        } catch(e) { savedTargets = {}; }
        savedTargets[key] = newTarget;
        localStorage.setItem('KIMCHI_FINANCIAL_TARGETS', JSON.stringify(savedTargets));
        renderFinancialReport();
      }

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          saveEdit();
        } else if (e.key === 'Escape') {
          isSaved = true;
          renderFinancialReport();
        }
      });
      input.addEventListener('blur', saveEdit);
    };

    window.handleSearchFinancialReport = handleSearchFinancialReport;
    window.resetFinancialReportSearch = resetFinancialReportSearch;

    // =========================================================
    // MODULE QUẢN LÝ MAIN - XÁC (CHUẨN GIAO DIỆN MÁY ĐÃ BÁN & BẢO HÀNH)
    // =========================================================
    let mainXacDatabase = [];
    const isMainXacCleared = localStorage.getItem('KIMCHI_MAINXAC_CLEARED') === 'true';
    const mainXacRaw = localStorage.getItem('KIMCHI_MAIN_XAC_DB');
    if (isMainXacCleared) {
      mainXacDatabase = [];
    } else if (mainXacRaw !== null) {
      try { mainXacDatabase = JSON.parse(mainXacRaw) || []; } catch(e) { mainXacDatabase = []; }
    } else {
      mainXacDatabase = (window.SEED_MAINXAC_DATA && window.SEED_MAINXAC_DATA.length > 0) ? JSON.parse(JSON.stringify(window.SEED_MAINXAC_DATA)) : [];
      localStorage.setItem('KIMCHI_MAIN_XAC_DB', JSON.stringify(mainXacDatabase));
    }
    let currentMainXacSearchQuery = '';
    let currentMainXacBrandFilter = 'ALL';
    let currentMainXacStatusFilter = 'ALL';
    let mainXacViewMode = 'year';
    let currentMainXacDateFilter = getVietnamDate();
    let currentMainXacMonthFilter = { month: currentMainXacDateFilter.getMonth(), year: currentMainXacDateFilter.getFullYear() };
    let currentMainXacYearFilter = currentMainXacDateFilter.getFullYear();

    function setMainXacMode(mode) {
      mainXacViewMode = mode;
      const selMode = document.getElementById('mainXacModeSelect');
      if (selMode) selMode.value = mode;

      const dayBox = document.getElementById('mainXacDateFilterBox');
      const monthBox = document.getElementById('mainXacMonthFilterBox');
      const yearBox = document.getElementById('mainXacYearFilterBox');

      if (dayBox) dayBox.style.display = mode === 'day' ? 'inline-flex' : 'none';
      if (monthBox) monthBox.style.display = mode === 'month' ? 'inline-flex' : 'none';
      if (yearBox) yearBox.style.display = mode === 'year' ? 'inline-flex' : 'none';

      renderMainXacGrid();
    }
    window.setMainXacMode = setMainXacMode;

    function changeMainXacFilterDate(delta) {
      currentMainXacDateFilter.setDate(currentMainXacDateFilter.getDate() + delta);
      const dd = String(currentMainXacDateFilter.getDate()).padStart(2, '0');
      const mm = String(currentMainXacDateFilter.getMonth() + 1).padStart(2, '0');
      const yyyy = currentMainXacDateFilter.getFullYear();
      const el = document.getElementById('filterMainXacDateDisplay');
      if (el) el.innerText = `${dd}/${mm}/${yyyy}`;
      renderMainXacGrid();
    }
    window.changeMainXacFilterDate = changeMainXacFilterDate;

    function changeMainXacFilterMonth(delta) {
      currentMainXacMonthFilter.month += delta;
      if (currentMainXacMonthFilter.month > 11) {
        currentMainXacMonthFilter.month = 0;
        currentMainXacMonthFilter.year++;
      } else if (currentMainXacMonthFilter.month < 0) {
        currentMainXacMonthFilter.month = 11;
        currentMainXacMonthFilter.year--;
      }
      const mm = String(currentMainXacMonthFilter.month + 1).padStart(2, '0');
      const el = document.getElementById('filterMainXacMonthDisplay');
      if (el) el.innerText = `${mm}/${currentMainXacMonthFilter.year}`;
      renderMainXacGrid();
    }
    window.changeMainXacFilterMonth = changeMainXacFilterMonth;

    function changeMainXacFilterYear(delta) {
      currentMainXacYearFilter += delta;
      const el = document.getElementById('filterMainXacYearDisplay');
      if (el) el.innerText = String(currentMainXacYearFilter);
      renderMainXacGrid();
    }
    window.changeMainXacFilterYear = changeMainXacFilterYear;

    function toggleMainXacExcelActions() {
      const box = document.getElementById('mainXacActionsBox');
      const arrow = document.getElementById('mainXacExcelArrowIcon');
      if (!box) return;
      const isHidden = (box.style.display === 'none' || box.style.display === '');
      if (isHidden) {
        box.style.display = 'inline-flex';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }
    window.toggleMainXacExcelActions = toggleMainXacExcelActions;

    function clearAllMainXacData() {
      let scopeLabel = getCurrentMainXacScopeLabel();
      let itemsToDelete = mainXacDatabase.filter(isMainXacItemMatchingCurrentFilter);

      if (itemsToDelete.length === 0) {
        alert(`Không có mục Main - Xác nào thuộc [${scopeLabel}] để xóa!`);
        return;
      }

      const confirmWord = prompt(`⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${itemsToDelete.length} mục Main - Xác thuộc [${scopeLabel}]!\n\nVui lòng nhập: "đồng ý" (hoặc "ok") để xác nhận xóa:`);
      if (confirmWord !== null) {
        const clean = confirmWord.trim().toLowerCase();
        if (clean === "yes" || clean === "ok" || clean === "đồng ý" || clean === "dong y" || clean === "tôi đồng ý xóa" || clean === "toi dong y xoa") {
          let deleteIds = new Set(itemsToDelete.map(it => String(it.id)));

          // Xóa tài liệu trên Firebase Firestore nếu có
          if (typeof db !== 'undefined' && db) {
            try {
              itemsToDelete.forEach(item => {
                if (item && item.id) {
                  db.collection('mainxac').doc(String(item.id)).delete().catch(console.error);
                }
              });
            } catch(e) {
              console.error("Lỗi xóa Firestore mainxac:", e);
            }
          }

          mainXacDatabase = mainXacDatabase.filter(it => !deleteIds.has(String(it.id)));
          if (mainXacDatabase.length === 0) {
            localStorage.setItem('KIMCHI_MAINXAC_CLEARED', 'true');
          }
          saveMainXacStorage();
          renderMainXacGrid();
          alert(`Đã xóa thành công ${itemsToDelete.length} mục Main - Xác thuộc [${scopeLabel}]!`);
        } else {
          alert('Xác nhận không chính xác! Đã hủy thao tác xóa.');
        }
      }
    }
    window.clearAllMainXacData = clearAllMainXacData;

    function saveMainXacStorage(itemToSync) {
      try { localStorage.setItem('KIMCHI_MAIN_XAC_DB', JSON.stringify(mainXacDatabase)); } catch(e){}
      if (typeof db !== 'undefined' && db) {
        if (itemToSync && itemToSync.id) {
          db.collection('mainxac').doc(String(itemToSync.id)).set(itemToSync).catch(console.error);
        } else {
          mainXacDatabase.forEach(item => {
            if (item && item.id) {
              db.collection('mainxac').doc(String(item.id)).set(item).catch(console.error);
            }
          });
        }
      }
    }
    window.saveMainXacStorage = saveMainXacStorage;

    function handleMxStatusChange(status) {
      const isConHang = (status === 'Còn Hàng');
      const starIds = [
        'lblMxBrandStar',
        'lblMxImeiStar',
        'lblMxColorStar',
        'lblMxStorageStar',
        'lblMxConditionStar',
        'lblMxPinStatusStar',
        'lblMxPinPctStar',
        'lblMxOriginStar',
        'lblMxPriceInStar',
        'lblMxPriceOutStar'
      ];
      starIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isConHang ? 'inline' : 'none';
      });

      const inputs = [
        'mxBrand',
        'mxImei',
        'mxColor',
        'mxStorage',
        'mxCondition',
        'mxPinStatus',
        'mxPinPct',
        'mxOrigin',
        'mxPriceIn',
        'mxPriceOut'
      ];
      inputs.forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
          if (isConHang) {
            inp.setAttribute('required', 'required');
          } else {
            inp.removeAttribute('required');
          }
        }
      });
    }
    window.handleMxStatusChange = handleMxStatusChange;

    function openMainXacModal(editId = null) {
      renderAllDropdowns();
      const modal = document.getElementById('mainXacModal');
      const titleEl = document.getElementById('mainXacModalTitle');
      const editInput = document.getElementById('mxEditId');

      if (editId) {
        const item = mainXacDatabase.find(x => String(x.id) === String(editId) || x.id == editId);
        if (item) {
          if (titleEl) titleEl.innerText = "Sửa Thông Tin Máy";
          if (editInput) editInput.value = item.id;
          const brandEl = document.getElementById('mxBrand');
          if (brandEl) brandEl.value = (item.brand || '').toUpperCase();
          document.getElementById('mxName').value = item.name || '';
          document.getElementById('mxImei').value = item.imei || '';
          document.getElementById('mxColor').value = item.color || '';
          document.getElementById('mxStorage').value = (item.storage || '').replace(/[()]/g, '');
          document.getElementById('mxCondition').value = item.condition || '';
          document.getElementById('mxPinStatus').value = item.pinStatus || '';
          document.getElementById('mxPinPct').value = item.pin || '';
          document.getElementById('mxOrigin').value = item.origin || '';
          const stVal = (item.status === 'Còn Hàng') ? 'Còn Hàng' : 'Chưa Xử Lý';
          document.getElementById('mxStatus').value = stVal;
          document.getElementById('mxPriceIn').value = item.priceIn || '';
          document.getElementById('mxPriceOut').value = item.price && item.price !== '0' ? item.price : '';
          document.getElementById('mxNote').value = item.note || '';
          document.getElementById('mxDateVal').value = item.date || getCurrentDateStr();
          handleMxStatusChange(stVal);
          calcMainXacModalProfit();
        }
      } else {
        if (titleEl) titleEl.innerText = "Thêm Máy Xác";
        if (editInput) editInput.value = '';
        const brandEl = document.getElementById('mxBrand');
        if (brandEl) brandEl.value = '';
        document.getElementById('mxName').value = '';
        document.getElementById('mxImei').value = '';
        document.getElementById('mxColor').value = '';
        document.getElementById('mxStorage').value = '';
        document.getElementById('mxCondition').value = '';
        document.getElementById('mxPinStatus').value = '';
        document.getElementById('mxPinPct').value = '';
        document.getElementById('mxOrigin').value = '';
        document.getElementById('mxStatus').value = 'Chưa Xử Lý';
        document.getElementById('mxPriceIn').value = '';
        document.getElementById('mxPriceOut').value = '';
        document.getElementById('mxNote').value = '';
        document.getElementById('mxDateVal').value = getCurrentDateStr();
        handleMxStatusChange('Chưa Xử Lý');
        calcMainXacModalProfit();
      }

      if (modal) modal.classList.add('active');
    }
    window.openMainXacModal = openMainXacModal;

    function closeMainXacModal() {
      const modal = document.getElementById('mainXacModal');
      if (modal) modal.classList.remove('active');
    }
    window.closeMainXacModal = closeMainXacModal;

    function calcMainXacModalProfit() {
      const pIn = parsePriceNum(document.getElementById('mxPriceIn').value);
      const pOut = parsePriceNum(document.getElementById('mxPriceOut').value);
      const profitEl = document.getElementById('mxProfit');
      const profitDisplayEl = document.getElementById('mxProfitDisplay');
      if (pOut > 0) {
        let profit = pOut - pIn;
        const profitStr = (profit < 0 ? '-' : '') + formatPriceStr(Math.abs(profit));
        if (profitEl) profitEl.value = profitStr;
        if (profitDisplayEl) {
          profitDisplayEl.innerText = profitStr;
          profitDisplayEl.style.color = profit >= 0 ? 'var(--green-badge)' : '#f87171';
        }
      } else {
        if (profitEl) profitEl.value = '';
        if (profitDisplayEl) {
          profitDisplayEl.innerText = '0';
          profitDisplayEl.style.color = 'var(--green-badge)';
        }
      }
    }
    window.calcMainXacModalProfit = calcMainXacModalProfit;

    function adjustMainXacDate(step) {
      const input = document.getElementById('mxDateVal');
      if (!input) return;
      const cur = input.value || getCurrentDateStr();
      const parts = cur.split('/');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        d.setDate(d.getDate() + step);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        input.value = `${dd}/${mm}/${yyyy}`;
      }
    }
    window.adjustMainXacDate = adjustMainXacDate;

    function saveNewMainXac(e) {
      e.preventDefault();
      const editId = document.getElementById('mxEditId').value;
      const brandInput = document.getElementById('mxBrand');
      let brand = brandInput ? brandInput.value.trim().toUpperCase() : '';
      const name = toTitleCase(document.getElementById('mxName').value.trim());
      const imei = document.getElementById('mxImei').value.trim();
      const color = toTitleCase(document.getElementById('mxColor').value.trim());
      const storage = toTitleCase(document.getElementById('mxStorage').value.trim());
      const condition = toTitleCase(document.getElementById('mxCondition').value.trim());
      const pinStatus = toTitleCase(document.getElementById('mxPinStatus').value.trim());
      const pinPct = document.getElementById('mxPinPct').value.trim();
      const origin = document.getElementById('mxOrigin').value.trim().toUpperCase() || 'VN/A';
      const status = document.getElementById('mxStatus').value;
      const priceIn = document.getElementById('mxPriceIn').value.trim();
      let priceOut = document.getElementById('mxPriceOut').value.trim();
      if (!priceOut) priceOut = '0';
      const note = toTitleCase(document.getElementById('mxNote').value.trim());
      const dateIn = document.getElementById('mxDateVal').value.trim() || getCurrentDateStr();

      // Bắt buộc nhập Tên Máy
      if (!name) {
        alert("Vui lòng nhập Tên Máy!");
        document.getElementById('mxName').focus();
        return;
      }

      // Khi chuyển trạng thái từ Chưa Xử Lý sang Còn Hàng: Toàn bộ dữ liệu đều bắt buộc nhập (trừ ghi chú)
      if (status === 'Còn Hàng') {
        if (!brand) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Hãng!");
          if (brandInput) brandInput.focus();
          return;
        }
        if (!imei) {
          alert("Trạng thái Còn Hàng bắt buộc nhập 4 số đuôi IMEI!");
          document.getElementById('mxImei').focus();
          return;
        }
        if (!color) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Màu Sắc!");
          document.getElementById('mxColor').focus();
          return;
        }
        if (!storage) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Dung Lượng Máy!");
          document.getElementById('mxStorage').focus();
          return;
        }
        if (!condition) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Tình Trạng Máy!");
          document.getElementById('mxCondition').focus();
          return;
        }
        if (!pinStatus) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Tình Trạng Pin!");
          document.getElementById('mxPinStatus').focus();
          return;
        }
        if (!pinPct) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Dung Lượng Pin!");
          document.getElementById('mxPinPct').focus();
          return;
        }
        if (!origin) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Quốc Gia!");
          document.getElementById('mxOrigin').focus();
          return;
        }
        if (!priceIn) {
          alert("Trạng thái Còn Hàng bắt buộc nhập Giá Nhập!");
          document.getElementById('mxPriceIn').focus();
          return;
        }
        if (!priceOut || priceOut === '0') {
          alert("Trạng thái Còn Hàng bắt buộc nhập Giá Bán hợp lệ (khác 0)!");
          document.getElementById('mxPriceOut').focus();
          return;
        }

        // Ưu tiên hãng người dùng đã chọn / nhập, nếu chưa có thì tự động nhận diện từ tên
        let resolvedBrand = brand;
        if (!resolvedBrand) {
          if (typeof isPhoneBrandIphone === 'function' && isPhoneBrandIphone('', name)) resolvedBrand = 'IPHONE';
          else if (/samsung/i.test(name)) resolvedBrand = 'SAMSUNG';
          else if (/oppo/i.test(name)) resolvedBrand = 'OPPO';
          else if (/realme/i.test(name)) resolvedBrand = 'REALME';
          else if (/redmi/i.test(name)) resolvedBrand = 'REDMI';
          else if (/poco/i.test(name)) resolvedBrand = 'POCO';
          else if (/vivo/i.test(name)) resolvedBrand = 'VIVO';
          else resolvedBrand = 'KHÁC';
        }

        let formattedStorageVal = typeof formatStorageValue === 'function' ? formatStorageValue(storage) : storage;
        let formattedPinVal = typeof formatPinByBrand === 'function' ? formatPinByBrand(pinPct, resolvedBrand, name) : pinPct;

        const newPhoneItem = {
          id: Date.now() + Math.random(),
          brand: resolvedBrand,
          name: name,
          color: color,
          storage: formattedStorageVal ? `(${formattedStorageVal})` : '',
          imei: imei,
          price: priceOut,
          condition: condition,
          pinStatus: pinStatus,
          pin: formattedPinVal,
          origin: origin,
          priceIn: priceIn || '0',
          status: 'Còn Hàng',
          note: note,
          date: dateIn
        };

        // Thêm vào danh sách Bán Máy
        phoneDatabase.unshift(newPhoneItem);
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'banmay', 'Bán máy', `Chuyển từ Main Xác sang Bán Máy: ${resolvedBrand} ${name} (${imei}) - Giá: ${priceOut}`, null, newPhoneItem, newPhoneItem.id);
        }

        // Nếu là sửa từ main xác cũ, xóa mục đó khỏi main xác
        if (editId) {
          mainXacDatabase = mainXacDatabase.filter(x => String(x.id) !== String(editId) && x.id != editId);
          if (typeof db !== 'undefined' && db) {
            db.collection('mainxac').doc(String(editId)).delete().catch(console.error);
          }
        }

        savePhoneStorage();
        saveMainXacStorage();
        closeMainXacModal();
        renderMainXacGrid();
        if (typeof renderPhoneGrid === 'function') renderPhoneGrid();

        // Chuyển sang tab Bán Máy
        if (typeof switchMainTab === 'function') {
          const banMayBtn = document.querySelector("button[onclick*=\"'banmay'\"]");
          switchMainTab('banmay', banMayBtn);
        }

        alert("🎉 Đã chuyển máy thành công sang kho BÁN MÁY!");
        return;
      }

      // Trạng thái Chưa Xử Lý (lưu bình thường trong kho Main - Xác)
      let resolvedBrandForMainXac = brand;
      if (!resolvedBrandForMainXac) {
        if (typeof isPhoneBrandIphone === 'function' && isPhoneBrandIphone('', name)) resolvedBrandForMainXac = 'IPHONE';
        else if (/samsung/i.test(name)) resolvedBrandForMainXac = 'SAMSUNG';
        else if (/oppo/i.test(name)) resolvedBrandForMainXac = 'OPPO';
        else if (/realme/i.test(name)) resolvedBrandForMainXac = 'REALME';
        else if (/redmi/i.test(name)) resolvedBrandForMainXac = 'REDMI';
        else if (/poco/i.test(name)) resolvedBrandForMainXac = 'POCO';
        else if (/vivo/i.test(name)) resolvedBrandForMainXac = 'VIVO';
        else resolvedBrandForMainXac = '';
      }

      if (editId) {
        const item = mainXacDatabase.find(x => String(x.id) === String(editId) || x.id == editId);
        if (item) {
          item.brand = resolvedBrandForMainXac;
          item.name = name;
          item.imei = imei;
          item.color = color;
          item.storage = storage ? `(${storage})` : '';
          item.condition = condition;
          item.pinStatus = pinStatus;
          item.pin = pinPct;
          item.origin = origin;
          item.status = status;
          item.priceIn = priceIn || '0';
          item.price = priceOut;
          item.note = note;
          item.date = dateIn;
          if (typeof logActivity === 'function') {
            logActivity('EDIT', 'mainxac', 'Main - Xác', `Sửa thông tin main xác: ${resolvedBrandForMainXac ? resolvedBrandForMainXac + ' - ' : ''}${name} (${imei}) - Giá: ${priceOut}`);
          }
        }
      } else {
        const newItem = {
          id: Date.now() + Math.random(),
          brand: resolvedBrandForMainXac,
          name,
          imei,
          color,
          storage: storage ? `(${storage})` : '',
          condition,
          pinStatus,
          pin: pinPct,
          origin,
          status,
          priceIn: priceIn || '0',
          price: priceOut,
          note,
          date: dateIn
        };
        mainXacDatabase.unshift(newItem);
        if (typeof logActivity === 'function') {
          logActivity('ADD', 'mainxac', 'Main - Xác', `Nhập main xác mới: ${resolvedBrandForMainXac ? resolvedBrandForMainXac + ' - ' : ''}${name} (${imei}) - Vốn: ${newItem.priceIn}`);
        }
      }

      saveMainXacStorage();
      closeMainXacModal();
      renderMainXacGrid();
      alert("Đã lưu thông tin Main - Xác thành công!");
    }
    window.saveNewMainXac = saveNewMainXac;

    function viewMainXacDetail(id) {
      const item = mainXacDatabase.find(x => String(x.id) === String(id) || x.id == id);
      if (!item) return;
      alert(`👑 CHI TIẾT MAIN - XÁC:\n\n• Tên máy: ${item.name || ''}\n• Hãng: ${item.brand || 'Khác'}\n• IMEI: ${item.imei || '—'}\n• Màu sắc: ${item.color || '—'}\n• Dung lượng: ${item.storage || '—'}\n• Tình trạng: ${item.condition || '—'}\n• Trạng thái: ${item.status || 'Còn Hàng'}\n• Giá nhập: ${item.priceIn || '0'}\n• Giá bán: ${item.price || '0'}\n• Quốc gia: ${item.origin || 'VN/A'}\n• Ngày nhập: ${item.date || '—'}\n• Ghi chú: ${item.note || 'Không có'}`);
    }
    window.viewMainXacDetail = viewMainXacDetail;

    function deleteMainXac(id) {
      const item = mainXacDatabase.find(x => String(x.id) === String(id) || x.id == id);
      const confirmWord = prompt("⚠️ CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn mục Main - Xác này!\n\nNhập đúng chữ \"yes\" để xác nhận xóa:");
      if (confirmWord !== null) {
        if (confirmWord.trim().toLowerCase() === "yes") {
          mainXacDatabase = mainXacDatabase.filter(x => String(x.id) !== String(id) && x.id != id);
          if (typeof db !== 'undefined' && db && id) {
            db.collection('mainxac').doc(String(id)).delete().catch(console.error);
          }
          if (item && typeof logActivity === 'function') {
            logActivity('DELETE', 'mainxac', 'Main - Xác', `Xóa main xác: ${item.name} (${item.imei})`);
          }
          renderMainXacGrid();
          alert("Đã xóa khỏi danh sách Main - Xác!");
        } else {
          alert("Xác nhận không đúng! Bạn cần gõ đúng chữ \"yes\" để xóa.");
        }
      }
    }
    window.deleteMainXac = deleteMainXac;

    function handleMainXacSearchInput(input) {
      currentMainXacSearchQuery = (input.value || '').trim().toLowerCase();
      const clearBtn = document.getElementById('btnClearMainXacSearch');
      if (clearBtn) clearBtn.style.display = currentMainXacSearchQuery ? 'block' : 'none';
      renderMainXacGrid();
    }
    window.handleMainXacSearchInput = handleMainXacSearchInput;

    function clearMainXacSearch() {
      const input = document.getElementById('mainXacSearchInput');
      if (input) input.value = '';
      currentMainXacSearchQuery = '';
      const clearBtn = document.getElementById('btnClearMainXacSearch');
      if (clearBtn) clearBtn.style.display = 'none';
      renderMainXacGrid();
    }
    window.clearMainXacSearch = clearMainXacSearch;

    function handleMainXacBrandFilterChange(select) {
      currentMainXacBrandFilter = select.value;
      renderMainXacGrid();
    }
    window.handleMainXacBrandFilterChange = handleMainXacBrandFilterChange;

    function handleMainXacStatusFilterChange(select) {
      currentMainXacStatusFilter = select.value;
      renderMainXacGrid();
    }
    window.handleMainXacStatusFilterChange = handleMainXacStatusFilterChange;

    function renderMainXacGrid() {
      const tbody = document.getElementById('mainXacTableBody');
      if (!tbody) return;

      let filtered = mainXacDatabase.filter(item => {
        // Lọc theo Hãng
        if (currentMainXacBrandFilter !== 'ALL') {
          let itemBrand = (item.brand || '').trim().toUpperCase();
          if (!itemBrand) {
            let pName = (item.name || '').toUpperCase();
            if (typeof isPhoneBrandIphone === 'function' && isPhoneBrandIphone('', pName)) itemBrand = 'IPHONE';
            else if (/samsung/i.test(pName)) itemBrand = 'SAMSUNG';
            else if (/oppo/i.test(pName)) itemBrand = 'OPPO';
            else if (/realme/i.test(pName)) itemBrand = 'REALME';
            else if (/redmi/i.test(pName)) itemBrand = 'REDMI';
            else if (/poco/i.test(pName)) itemBrand = 'POCO';
            else if (/vivo/i.test(pName)) itemBrand = 'VIVO';
            else if (/xiaomi/i.test(pName)) itemBrand = 'XIAOMI';
            else itemBrand = 'KHÁC';
          }
          if (itemBrand !== currentMainXacBrandFilter) {
            return false;
          }
        }

        if (currentMainXacStatusFilter !== 'ALL' && item.status !== currentMainXacStatusFilter) {
          return false;
        }
        if (currentMainXacSearchQuery) {
          const matchStr = `${item.brand || ''} ${item.name || ''} ${item.imei || ''} ${item.storage || ''} ${item.color || ''} ${item.condition || ''} ${item.note || ''}`.toLowerCase();
          if (!matchStr.includes(currentMainXacSearchQuery)) return false;
        }

        // Lọc theo chế độ xem Ngày / Tháng / Năm / Tất cả
        if (mainXacViewMode === 'all') return true;

        let dStr = item.date || item.dateTime || '';
        let parts = dStr.split(' - ');
        let datePart = parts.length >= 2 ? parts[1].trim() : parts[0].trim();
        let dp = datePart.split(/[\/\-]/);
        if (dp.length >= 3) {
          let d = parseInt(dp[0], 10);
          let m = parseInt(dp[1], 10) - 1;
          let y = parseInt(dp[2], 10);
          if (mainXacViewMode === 'day') {
            return d === currentMainXacDateFilter.getDate() &&
                   m === currentMainXacDateFilter.getMonth() &&
                   y === currentMainXacDateFilter.getFullYear();
          } else if (mainXacViewMode === 'month') {
            return m === currentMainXacMonthFilter.month &&
                   y === currentMainXacMonthFilter.year;
          } else if (mainXacViewMode === 'year') {
            return y === currentMainXacYearFilter;
          }
        }
        return true;
      });

      // Thống kê Doanh thu, Vốn, Lãi
      let totalCost = 0;
      let totalPrice = 0;
      let totalProfit = 0;
      filtered.forEach(x => {
        let pIn = parsePriceNum(x.priceIn);
        let pOut = parsePriceNum(x.price);
        totalCost += pIn;
        totalPrice += pOut;
        totalProfit += (pOut > 0 ? (pOut - pIn) : 0);
      });

      // Cập nhật ô tổng số tiền giá nhập bên phải ô Main Xác (chỉ ghi số tiền, ví dụ: 1.234)
      const costEl = document.getElementById('mainXacTotalCostVal');
      const countTopEl = document.getElementById('mainXacTotalCountVal');
      if (costEl) costEl.innerText = formatPriceStr(totalCost);
      if (countTopEl) countTopEl.innerText = filtered.length;

      // Cập nhật Box đen trên cùng bên phải
      const profitEl = document.getElementById('mainXacTotalProfitVal');
      const avgPfEl = document.getElementById('mainXacAvgProfitVal');
      if (profitEl) profitEl.innerText = formatPriceStr(totalProfit);
      if (avgPfEl) avgPfEl.innerText = filtered.length > 0 ? formatPriceStr(Math.round(totalProfit / filtered.length)) : '0';

      // Cập nhật Badge đếm bên phải Action bar
      const badgeCountEl = document.getElementById('mainXacCountText');
      if (badgeCountEl) badgeCountEl.innerText = `Main Xác : ${filtered.length}`;

      // Cập nhật Footer stats
      const footCountEl = document.getElementById('mainXacFootCount');
      const footPriceEl = document.getElementById('mainXacFootPrice');
      const footCostEl = document.getElementById('mainXacFootCost');
      const footProfitEl = document.getElementById('mainXacFootProfit');
      const footCountTextEl = document.getElementById('mainXacFooterCountText');

      if (footCountEl) footCountEl.innerText = filtered.length;
      if (footPriceEl) footPriceEl.innerText = formatPriceStr(totalPrice);
      if (footCostEl) footCostEl.innerText = formatPriceStr(totalCost);
      if (footProfitEl) footProfitEl.innerText = formatPriceStr(totalProfit);
      if (footCountTextEl) footCountTextEl.innerText = `Hiển thị ${filtered.length} main - xác.`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-sub); font-size: 0.95rem;">Không tìm thấy mục Main - Xác nào phù hợp</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        let brandDisplay = formatBrandDeviceName(item.brand || '');
        let brandNamePart = '';
        let pName = formatBrandDeviceName(item.name || '');
        if (brandDisplay === 'MÁY NGOÀI' || brandDisplay === '❤️❤️❤️' || !brandDisplay) {
          brandNamePart = pName;
        } else {
          brandNamePart = `${brandDisplay} - ${pName}`;
        }
        brandNamePart = formatBrandDeviceName(brandNamePart);

        let cleanStorage = formatStorageDisplay((item.storage || '').replace(/[()]/g, ''));
        let dotHtml = getColorDotHtml(item.color || 'Đen', 28);
        let storagePart = cleanStorage ? `<span style="color: #eab308; font-weight: 700; font-size: 1.16rem;">${cleanStorage}</span>` : '';
        let imeiPart = item.imei ? `<span style="border: 1px solid #ef4444; color: #ffffff; font-weight: 900; font-size: 1.27rem; padding: 2px 7px; border-radius: 4px; display: inline-block; letter-spacing: 0.5px;">${item.imei}</span>` : '';

        let nameHtml = `
          <div style="display: inline-flex; align-items: center; justify-content: flex-start; gap: 8px; flex-wrap: nowrap; white-space: nowrap;">
            <span style="font-size: 1.27rem; font-weight: 800; white-space: nowrap;">${brandNamePart}</span>
            ${dotHtml}
            ${storagePart}
            ${imeiPart}
          </div>
        `;

        let stColor = '#10b981';
        if (item.status === 'Chưa Xử Lý') stColor = '#38bdf8';
        else if (item.status === 'Máy Xác') stColor = '#f59e0b';
        else if (item.status === 'Đã Rã Xác') stColor = '#a855f7';
        else if (item.status === 'Đã Bán') stColor = '#ef4444';

        let dateDisplay = item.date || item.dateTime || getCurrentDateStr();

        return `
          <tr>
            <td style="font-weight: 800; text-align: left; padding-left: 16px; vertical-align: middle;">
              ${nameHtml}
            </td>
            <td style="color: #ffffff; font-weight: 900; font-size: 1.05rem; text-align: center; vertical-align: middle;">${formatPriceStr(item.priceIn || '0')}</td>
            <td style="text-align: center; vertical-align: middle;"><span style="font-weight: 800; font-size: 1.05rem; color: ${stColor};">${item.status || 'Chưa Xử Lý'}</span></td>
            <td style="color: #ec4899; font-weight: 800; font-size: 1.05rem; text-align: center; vertical-align: middle;">${dateDisplay}</td>
            <td style="text-align: center; vertical-align: middle;">
              <div class="action-btn-group" style="justify-content: center;">
                <button type="button" class="action-btn-icon action-btn-view" onclick="viewMainXacDetail('${item.id}')" title="Xem chi tiết">
                  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-edit" onclick="openMainXacModal('${item.id}')" title="Sửa thông tin">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button type="button" class="action-btn-icon action-btn-del" onclick="deleteMainXac('${item.id}')" title="Xóa main - xác">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
    window.renderMainXacGrid = renderMainXacGrid;

    function exportMainXacToExcel() {
      let scopeLabel = getCurrentMainXacScopeLabel();
      let itemsToExport = mainXacDatabase.filter(isMainXacItemMatchingCurrentFilter);
      if (itemsToExport.length === 0) {
        alert(`Không có dữ liệu Main - Xác nào thuộc [${scopeLabel}] để xuất!`);
        return;
      }

      let timeSuffix = "TatCa";
      if (mainXacViewMode === 'day') {
        const dd = String(currentMainXacDateFilter.getDate()).padStart(2, '0');
        const mm = String(currentMainXacDateFilter.getMonth() + 1).padStart(2, '0');
        const yyyy = currentMainXacDateFilter.getFullYear();
        timeSuffix = `Ngay_${dd}_${mm}_${yyyy}`;
      } else if (mainXacViewMode === 'month') {
        const mm = String(currentMainXacMonthFilter.month + 1).padStart(2, '0');
        const yyyy = currentMainXacMonthFilter.year;
        timeSuffix = `Thang_${mm}_${yyyy}`;
      } else if (mainXacViewMode === 'year') {
        timeSuffix = `Nam_${currentMainXacYearFilter}`;
      }

      const data = itemsToExport.map((item, idx) => ({
        "STT": idx + 1,
        "Tên Máy / Main": item.name || '',
        "Dung Lượng": item.storage || '',
        "Màu Sắc": item.color || '',
        "IMEI": item.imei || '',
        "Tình Trạng": item.condition || '',
        "Tình Trạng Pin": item.pinStatus || '',
        "Dung Lượng Pin": item.pin || '',
        "Quốc Gia": item.origin || '',
        "Giá Nhập": item.priceIn || '',
        "Giá Bán": item.price || '',
        "Trạng Thái": item.status || 'Còn Hàng',
        "Ghi Chú": item.note || '',
        "Ngày Nhập": item.date || ''
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "MAIN_XAC");
      XLSX.writeFile(wb, `Danh_Sach_Main_Xac_${timeSuffix}.xlsx`);
      alert(`Đã xuất thành công ${itemsToExport.length} mục Main - Xác (${scopeLabel}) ra file Excel!`);
    }

    function triggerImportMainXacExcel() {
      const input = document.getElementById('mainXacExcelFileInput');
      if (input) input.click();
    }

    function handleImportMainXacExcelFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet);
          if (json && json.length > 0) {
            let count = 0;
            json.forEach(row => {
              const name = row["Tên Máy / Main"] || row["Tên Máy"] || row["Ten May"] || '';
              if (name) {
                let rawDate = row["Ngày Nhập"] || row["Ngay Nhap"] || getCurrentDateStr();
                let checkItem = { date: rawDate };
                if (!isMainXacItemMatchingCurrentFilter(checkItem)) {
                  return; // Bỏ qua nếu không thuộc phạm vi thời gian đang chọn
                }

                mainXacDatabase.unshift({
                  id: Date.now() + Math.random(),
                  name: toTitleCase(String(name).trim()),
                  storage: row["Dung Lượng"] || row["Dung Luong"] || '',
                  color: row["Màu Sắc"] || row["Mau Sac"] || 'Đen',
                  imei: String(row["IMEI"] || row["imei"] || '').slice(-4),
                  condition: row["Tình Trạng"] || row["Tinh Trang"] || 'Zin',
                  pinStatus: row["Tình Trạng Pin"] || '',
                  pin: row["Dung Lượng Pin"] || '100%',
                  origin: String(row["Quốc Gia"] || 'VN/A').toUpperCase(),
                  priceIn: String(row["Giá Nhập"] || row["Gia Nhap"] || '0'),
                  price: String(row["Giá Bán"] || row["Gia Ban"] || '0'),
                  status: row["Trạng Thái"] || 'Còn Hàng',
                  note: row["Ghi Chú"] || '',
                  date: rawDate
                });
                count++;
              }
            });
            saveMainXacStorage();
            renderMainXacGrid();
            let scopeLabel = getCurrentMainXacScopeLabel();
            alert(`Đã nhập thành công ${count} mục Main - Xác thuộc [${scopeLabel}] từ Excel!`);
          }
        } catch (err) {
          alert("Lỗi khi đọc file Excel: " + err.message);
        }
        event.target.value = '';
      };
      reader.readAsArrayBuffer(file);
    }

    window.openMainXacModal = openMainXacModal;
    window.closeMainXacModal = closeMainXacModal;
    window.saveNewMainXac = saveNewMainXac;
    window.calcMainXacModalProfit = calcMainXacModalProfit;
    window.adjustMainXacDate = adjustMainXacDate;
    window.deleteMainXac = deleteMainXac;
    window.handleMainXacSearchInput = handleMainXacSearchInput;
    window.clearMainXacSearch = clearMainXacSearch;
    window.handleMainXacStatusFilterChange = handleMainXacStatusFilterChange;
    window.exportMainXacToExcel = exportMainXacToExcel;
    window.triggerImportMainXacExcel = triggerImportMainXacExcel;
    window.handleImportMainXacExcelFile = handleImportMainXacExcelFile;

    function loadQuynhNotes() {
      const area = document.getElementById('quynhNotesArea');
      if (area) {
        area.value = localStorage.getItem('KIMCHI_QUYNH_NOTES') || '';
      }
    }

    function saveQuynhNotes() {
      const area = document.getElementById('quynhNotesArea');
      if (area) {
        localStorage.setItem('KIMCHI_QUYNH_NOTES', area.value);
        alert('Đã lưu ghi chú thành công!');
      }
    }

    // =========================================================
    // QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN MENU (CHUẨN WEB KIM CHI)
    // =========================================================
    // MENU ĐƯỢC VÀO PHẢN ÁNH CHÍNH XÁC CÁC MỤC THỰC TẾ TRÊN THANH ĐIỀU HƯỚNG CỦA WEB:
    const SYSTEM_MENU_COL1 = ['BÁN HÀNG', 'PHẦN MỀM', 'SỬA CHỮA', 'BÁN MÁY'];
    const SYSTEM_MENU_COL2 = ['BÁN GÀ', 'BẢO HÀNH', 'BÁO GIÁ SỬA', 'CÔNG NỢ'];
    const SYSTEM_MENU_COL3 = ['MAIN - XÁC', 'HỆ THỐNG', 'BÁO CÁO TÀI CHÍNH', 'NHẬT KÝ'];
    const ALL_SYSTEM_MENUS = [...SYSTEM_MENU_COL1, ...SYSTEM_MENU_COL2, ...SYSTEM_MENU_COL3];

    const DEFAULT_SYSTEM_ACCOUNTS = [
      {
        id: 'admin',
        name: 'ADMIN',
        username: 'admin',
        role: 'Owner · full',
        isOwner: true,
        store: 'Kim Chi Mobile',
        status: 'Active',
        allowedMenus: [...ALL_SYSTEM_MENUS]
      },
      {
        id: 'quynhbupbe',
        name: 'Quynh Búp Bê',
        username: 'quynhbupbe',
        role: 'Owner · full',
        isOwner: true,
        store: 'Kim Chi Mobile',
        status: 'Active',
        allowedMenus: [...ALL_SYSTEM_MENUS]
      },
      {
        id: 'huyenxinh',
        name: 'Huyền Xinh',
        username: 'huyenxinh',
        role: 'Staff',
        isOwner: false,
        store: 'Kiều Vy Mobile',
        status: 'Active',
        password: 'Huyen@95',
        allowedMenus: ['BÁN HÀNG', 'BÁN GÀ', 'BẢO HÀNH', 'BÁN MÁY']
      },
      {
        id: 'kieuvy',
        name: 'Kiều Vy Mobile',
        username: 'kieuvy',
        role: 'Staff',
        isOwner: false,
        store: 'Kiều Vy Mobile',
        status: 'Active',
        allowedMenus: ['BÁN HÀNG', 'PHẦN MỀM', 'SỬA CHỮA', 'BÁN MÁY', 'BÁO GIÁ SỬA']
      }
    ];

    let systemAccountsDb = DEFAULT_SYSTEM_ACCOUNTS;
    try {
      const stored = JSON.parse(localStorage.getItem('KIMCHI_SYSTEM_ACCOUNTS'));
      if (Array.isArray(stored) && stored.length > 0) {
        // Tự động loại bỏ Cao Bắc Mobile theo yêu cầu
        systemAccountsDb = stored.filter(a => a.id !== 'caobac' && a.username !== 'caobac' && !(a.name || '').includes('Cao Bắc'));
        
        // Chuẩn hóa allowedMenus theo các mục thực tế đang có trên web
        systemAccountsDb.forEach(acc => {
          if (Array.isArray(acc.allowedMenus)) {
            acc.allowedMenus = acc.allowedMenus.map(m => m === 'QUYNHBUPBE' ? 'MAIN - XÁC' : m);
          }
          if (acc.isOwner) {
            acc.allowedMenus = [...ALL_SYSTEM_MENUS];
          } else {
            acc.allowedMenus = (acc.allowedMenus || []).filter(m => ALL_SYSTEM_MENUS.includes(m));
            if (acc.allowedMenus.length === 0) {
              acc.allowedMenus = ['BÁN HÀNG', 'PHẦN MỀM', 'SỬA CHỮA', 'BÁO GIÁ SỬA'];
            }
          }
        });
      }
    } catch (err) {
      systemAccountsDb = DEFAULT_SYSTEM_ACCOUNTS;
    }

    function saveSystemAccountsDb() {
      localStorage.setItem('KIMCHI_SYSTEM_ACCOUNTS', JSON.stringify(systemAccountsDb));
    }
    saveSystemAccountsDb();

    function renderSystemAccountsTable() {
      const tbody = document.getElementById('accManagementTableBody');
      if (!tbody) return;

      tbody.innerHTML = systemAccountsDb.map(acc => {
        const renderCol = (menuList) => {
          return menuList.map(menuName => {
            const isChecked = (acc.allowedMenus || []).includes(menuName);
            const disabledAttr = acc.isOwner ? 'disabled' : '';
            return `
              <label class="acc-menu-item ${isChecked ? 'checked' : ''} ${acc.isOwner ? 'disabled' : ''}">
                <input type="checkbox"
                  class="acc-perm-cb-${acc.id}"
                  value="${escapeHtml(menuName)}"
                  ${isChecked ? 'checked' : ''}
                  ${disabledAttr}
                  onchange="handleAccCheckboxChange(this)">
                <span>${escapeHtml(menuName)}</span>
              </label>
            `;
          }).join('');
        };

        const roleBadgeHtml = acc.isOwner
          ? `<span class="acc-role-pill owner">Owner · full</span>`
          : `<span class="acc-role-pill staff">Staff</span>`;

        const statusClass = (acc.status === 'Active') ? 'active' : 'inactive';

        const actionBtnsHtml = acc.isOwner
          ? `
            <div class="acc-actions-cell">
              <span class="acc-full-badge">Menu: full</span>
              <button type="button" class="acc-btn-sub action-rename" onclick="openRenameAccountModal('${acc.id}')">✏️ Đổi tên</button>
              <button type="button" class="acc-btn-sub action-change-pass" onclick="openChangePasswordModal('${acc.id}')">🔒 Đổi mật khẩu</button>
              <button type="button" class="acc-btn-sub action-inactive" onclick="toggleAccStatus('${acc.id}')">${acc.status === 'Active' ? 'Inactive' : 'Active'}</button>
            </div>
          `
          : `
            <div class="acc-actions-cell">
              <button type="button" class="acc-btn-save-menu" onclick="saveStaffMenu('${acc.id}')">💾 Lưu menu</button>
              <button type="button" class="acc-btn-sub action-rename" onclick="openRenameAccountModal('${acc.id}')">✏️ Đổi tên</button>
              <button type="button" class="acc-btn-sub action-change-pass" onclick="openChangePasswordModal('${acc.id}')">🔒 Đổi mật khẩu</button>
              <button type="button" class="acc-btn-sub action-inactive" onclick="toggleAccStatus('${acc.id}')">${acc.status === 'Active' ? 'Inactive' : 'Active'}</button>
              <button type="button" class="acc-btn-sub action-delete-acc" onclick="deleteAccount('${acc.id}')">🗑️ Xóa tài khoản</button>
            </div>
          `;

        return `
          <tr>
            <td>
              <div class="acc-user-info">
                <div style="display: flex; align-items: center;">
                  <span class="acc-user-name">${escapeHtml(acc.name)}</span>
                  <button type="button" class="acc-inline-edit-btn" onclick="openRenameAccountModal('${acc.id}')" title="Đổi tên tài khoản">✏️</button>
                </div>
                <div class="acc-user-slug">@${escapeHtml(acc.username)}</div>
              </div>
            </td>
            <td>${roleBadgeHtml}</td>
            <td><span class="acc-store-name">${escapeHtml(acc.store)}</span></td>
            <td><span class="acc-status-tag ${statusClass}">${escapeHtml(acc.status)}</span></td>
            <td>
              <div class="acc-menu-grid">
                <div class="acc-menu-col">${renderCol(SYSTEM_MENU_COL1)}</div>
                <div class="acc-menu-col">${renderCol(SYSTEM_MENU_COL2)}</div>
                <div class="acc-menu-col">${renderCol(SYSTEM_MENU_COL3)}</div>
              </div>
            </td>
            <td>${actionBtnsHtml}</td>
          </tr>
        `;
      }).join('');
    }

    function handleAccCheckboxChange(checkbox) {
      const parentLabel = checkbox.closest('.acc-menu-item');
      if (parentLabel) {
        if (checkbox.checked) parentLabel.classList.add('checked');
        else parentLabel.classList.remove('checked');
      }
    }

    function saveStaffMenu(accId) {
      const acc = systemAccountsDb.find(a => a.id === accId);
      if (!acc) return;

      const cbs = document.querySelectorAll(`.acc-perm-cb-${accId}`);
      const selected = [];
      cbs.forEach(cb => {
        if (cb.checked) selected.push(cb.value);
      });

      acc.allowedMenus = selected;
      saveSystemAccountsDb();
      renderSystemAccountsTable();
      alert(`Đã lưu phân quyền menu cho tài khoản "${acc.name}" thành công!`);
    }

    function toggleAccStatus(accId) {
      const acc = systemAccountsDb.find(a => a.id === accId);
      if (!acc) return;
      if (acc.id === 'admin') {
        alert('Không thể vô hiệu hóa tài khoản quản trị viên chính (ADMIN)!');
        return;
      }
      acc.status = (acc.status === 'Active') ? 'Inactive' : 'Active';
      saveSystemAccountsDb();
      renderSystemAccountsTable();
      alert(`Đã chuyển trạng thái tài khoản "${acc.name}" thành: ${acc.status}`);
    }

    // --- ĐỔI TÊN TÀI KHOẢN ---
    function openRenameAccountModal(accId) {
      const acc = systemAccountsDb.find(a => a.id === accId);
      if (!acc) return;
      const modal = document.getElementById('accRenameModal');
      const targetId = document.getElementById('accRenameTargetId');
      const nameInput = document.getElementById('accRenameNameInput');
      const userInput = document.getElementById('accRenameUserInput');
      if (targetId) targetId.value = acc.id;
      if (nameInput) nameInput.value = acc.name;
      if (userInput) userInput.value = acc.username;
      if (modal) modal.style.display = 'flex';
    }

    function closeRenameAccountModal() {
      const modal = document.getElementById('accRenameModal');
      if (modal) modal.style.display = 'none';
    }

    function handleConfirmRenameAccount(e) {
      if (e) e.preventDefault();
      const targetId = document.getElementById('accRenameTargetId').value;
      const newName = document.getElementById('accRenameNameInput').value.trim();
      const newUser = document.getElementById('accRenameUserInput').value.trim();

      if (!newName || !newUser) {
        alert('Vui lòng nhập đầy đủ tên hiển thị và tên đăng nhập!');
        return;
      }

      // Kiểm tra username trùng với tài khoản khác
      const exists = systemAccountsDb.some(a => a.id !== targetId && a.username.toLowerCase() === newUser.toLowerCase());
      if (exists) {
        alert(`Tên đăng nhập "${newUser}" đã tồn tại. Vui lòng chọn tên khác!`);
        return;
      }

      const acc = systemAccountsDb.find(a => a.id === targetId);
      if (acc) {
        acc.name = newName;
        acc.username = newUser;
        saveSystemAccountsDb();
        renderSystemAccountsTable();
        alert(`Đã đổi tên tài khoản thành "${newName}" thành công!`);
      }
      closeRenameAccountModal();
    }

    // --- THÊM TÀI KHOẢN MỚI ---
    function openAddAccountModal() {
      const modal = document.getElementById('accAddModal');
      const nameInput = document.getElementById('accAddNameInput');
      const userInput = document.getElementById('accAddUserInput');
      const roleInput = document.getElementById('accAddRoleInput');
      const storeInput = document.getElementById('accAddStoreInput');
      const passInput = document.getElementById('accAddPassInput');

      if (nameInput) nameInput.value = '';
      if (userInput) userInput.value = '';
      if (roleInput) roleInput.value = 'Staff';
      if (storeInput) storeInput.value = 'Kim Chi Mobile';
      if (passInput) passInput.value = '123456';
      if (modal) modal.style.display = 'flex';
    }

    function closeAddAccountModal() {
      const modal = document.getElementById('accAddModal');
      if (modal) modal.style.display = 'none';
    }

    function handleConfirmAddAccount(e) {
      if (e) e.preventDefault();
      const newName = document.getElementById('accAddNameInput').value.trim();
      const newUser = document.getElementById('accAddUserInput').value.trim();
      const newRole = document.getElementById('accAddRoleInput').value;
      const newStore = document.getElementById('accAddStoreInput').value.trim() || 'Kim Chi Mobile';
      const newPass = document.getElementById('accAddPassInput').value.trim() || '123456';

      if (!newName || !newUser) {
        alert('Vui lòng nhập đầy đủ tên hiển thị và tên đăng nhập!');
        return;
      }

      // Kiểm tra username trùng
      const exists = systemAccountsDb.some(a => a.username.toLowerCase() === newUser.toLowerCase());
      if (exists) {
        alert(`Tên đăng nhập "${newUser}" đã tồn tại. Vui lòng chọn tên khác!`);
        return;
      }

      const isOwnerRole = (newRole === 'Owner · full');
      const newAcc = {
        id: 'acc_' + Date.now(),
        name: newName,
        username: newUser,
        role: newRole,
        isOwner: isOwnerRole,
        store: newStore,
        status: 'Active',
        password: newPass,
        allowedMenus: isOwnerRole ? [...ALL_SYSTEM_MENUS] : ['BÁN HÀNG', 'PHẦN MỀM', 'SỬA CHỮA', 'BÁO GIÁ SỬA']
      };

      systemAccountsDb.push(newAcc);
      saveSystemAccountsDb();
      renderSystemAccountsTable();
      closeAddAccountModal();
      alert(`Đã thêm tài khoản "${newName}" thành công! Mật khẩu mặc định: ${newPass}`);
    }

    // --- XÓA TÀI KHOẢN ---
    function deleteAccount(accId) {
      const acc = systemAccountsDb.find(a => a.id === accId);
      if (!acc) return;

      if (acc.id === 'admin' || acc.id === 'quynhbupbe' || acc.isOwner) {
        alert('Không thể xóa tài khoản Quản trị viên chính (Owner)!');
        return;
      }

      if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${acc.name}" (@${acc.username}) không?`)) {
        systemAccountsDb = systemAccountsDb.filter(a => a.id !== accId);
        saveSystemAccountsDb();
        renderSystemAccountsTable();
        alert(`Đã xóa tài khoản "${acc.name}" thành công!`);
      }
    }

    // --- ĐỔI MẬT KHẨU ---
    function openChangePasswordModal(accId) {
      const acc = systemAccountsDb.find(a => a.id === accId);
      if (!acc) return;
      const modal = document.getElementById('accChangePassModal');
      const targetId = document.getElementById('accChangePassTargetId');
      const targetUser = document.getElementById('accChangePassTargetUser');
      const inputVal = document.getElementById('accChangePassInputVal');
      if (targetId) targetId.value = acc.id;
      if (targetUser) targetUser.value = `${acc.name} (${acc.username})`;
      if (inputVal) inputVal.value = '';
      if (modal) modal.style.display = 'flex';
    }

    function closeChangePasswordModal() {
      const modal = document.getElementById('accChangePassModal');
      if (modal) modal.style.display = 'none';
    }

    function handleConfirmChangePassword(e) {
      if (e) e.preventDefault();
      const targetId = document.getElementById('accChangePassTargetId').value;
      const passVal = document.getElementById('accChangePassInputVal').value.trim();
      if (passVal.length < 4) {
        alert('Mật khẩu mới phải có ít nhất 4 ký tự!');
        return;
      }
      const acc = systemAccountsDb.find(a => a.id === targetId);
      if (acc) {
        acc.password = passVal;
        saveSystemAccountsDb();
        alert(`Đã đổi mật khẩu cho tài khoản "${acc.name}" thành công!`);
      } else {
        alert('Đã đổi mật khẩu thành công!');
      }
      closeChangePasswordModal();
    }

    window.renderSystemAccountsTable = renderSystemAccountsTable;
    window.saveStaffMenu = saveStaffMenu;
    window.toggleAccStatus = toggleAccStatus;
    window.openChangePasswordModal = openChangePasswordModal;
    window.closeChangePasswordModal = closeChangePasswordModal;
    window.handleConfirmChangePassword = handleConfirmChangePassword;
    window.handleAccCheckboxChange = handleAccCheckboxChange;
    window.openRenameAccountModal = openRenameAccountModal;
    window.closeRenameAccountModal = closeRenameAccountModal;
    window.handleConfirmRenameAccount = handleConfirmRenameAccount;
    window.openAddAccountModal = openAddAccountModal;
    window.closeAddAccountModal = closeAddAccountModal;
    window.handleConfirmAddAccount = handleConfirmAddAccount;
    window.deleteAccount = deleteAccount;

    // =========================================================
    // TÍNH NĂNG TÔ MÀU XANH HÀNG KHI BẤM VÀO DÒNG BẤT KỲ
    // BẤM DÒNG KHÁC TÔ DÒNG ĐÓ - BẤM RA KHOẢNG TRỐNG THÌ XÓA TÔ
    // =========================================================
    document.addEventListener('click', function (e) {
      // Bỏ qua nếu click bên trong modal overlay (popup)
      if (e.target.closest('.modal-overlay')) return;

      const clickedRow = e.target.closest('tbody tr');
      if (clickedRow) {
        // Bỏ qua dòng thông báo không có dữ liệu (chứa colspan)
        if (clickedRow.querySelector('td[colspan]')) return;

        // Xóa tô màu ở tất cả các dòng khác
        document.querySelectorAll('tbody tr.row-active-highlight').forEach(tr => {
          if (tr !== clickedRow) tr.classList.remove('row-active-highlight');
        });
        // Tô màu xanh dòng vừa bấm
        clickedRow.classList.add('row-active-highlight');
      } else {
        // Bấm ra khoảng trống bên ngoài (không thuộc bất kỳ tbody tr nào)
        document.querySelectorAll('tbody tr.row-active-highlight').forEach(tr => {
          tr.classList.remove('row-active-highlight');
        });
      }
    });

    // =========================================================
    // TỰ ĐỘNG CHUẨN HÓA mah / MAh / Mah / MAH THÀNH mAh
    // TRÊN TOÀN BỘ POPUP & Ô NHẬP LIỆU CỦA WEBSITE
    // =========================================================
    document.addEventListener('blur', function (e) {
      const el = e.target;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && (el.type === 'text' || el.type === 'search' || !el.type)) {
        if (el.value && /mah/i.test(el.value)) {
          el.value = normalizeMahText(el.value);
        }
      }
    }, true);

    document.addEventListener('change', function (e) {
      const el = e.target;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && (el.type === 'text' || el.type === 'search' || !el.type)) {
        if (el.value && /mah/i.test(el.value)) {
          el.value = normalizeMahText(el.value);
        }
      }
    }, true);

    document.addEventListener('input', function (e) {
      const el = e.target;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && (el.type === 'text' || el.type === 'search' || !el.type)) {
        if (el.value && /(?:\b(?:mah|MAh|Mah|MAH)\s|\b(?:mah|MAh|Mah|MAH)%)/i.test(el.value)) {
          let pos = el.selectionStart;
          let oldLen = el.value.length;
          el.value = normalizeMahText(el.value);
          let newLen = el.value.length;
          if (pos !== null) {
            try { el.setSelectionRange(pos + (newLen - oldLen), pos + (newLen - oldLen)); } catch(err) {}
          }
        }
      }
    }, true);

    // =========================================================
    // TỰ ĐỘNG LÀM MỚI TỨC THÌ CỤM LÃI ĐĂNG XUẤT (REALTIME HEARTBEAT)
    // Giúp cụm lãi đăng xuất luôn chính xác tức thì mà không cần F5
    // =========================================================
    (function initRealtimeSidebarProfitWatcher() {
      // 1. Cập nhật ngay khi người dùng chuyển lại tab trình duyệt
      window.addEventListener('focus', function () {
        if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
      });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && typeof updateSidebarOverallProfits === 'function') {
          updateSidebarOverallProfits();
        }
      });
      window.addEventListener('pageshow', function () {
        if (typeof updateSidebarOverallProfits === 'function') updateSidebarOverallProfits();
      });

      // 2. Heartbeat chu kỳ 3 giây nhẹ nhàng đồng bộ lại lãi tổng thể
      setInterval(function () {
        if (typeof updateSidebarOverallProfits === 'function') {
          updateSidebarOverallProfits();
        }
      }, 3000);
    })();