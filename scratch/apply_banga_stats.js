const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

const targetOld = `  // Tính toán Doanh thu & Lãi (Ngày & Tháng & Năm & Tất cả) cho 2 box trên đầu chuẩn mẫu Bán Hàng / Sửa Chữa
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
  let targetDateStr = \`\${dd}/\${mm}/\${yyyy}\`;
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
      mRevEl.title = \`Doanh thu Năm \${currentBangaYearFilter}\`;
    }
    if (dRevEl) {
      dRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayRev);
      dRevEl.title = 'Doanh thu Ngày';
    }
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaYearProf);
      mProfEl.title = \`Lãi Năm \${currentBangaYearFilter}\`;
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
      mRevEl.title = \`Doanh thu Tháng \${targetMonth + 1}/\${targetYear}\`;
    }
    if (dRevEl) {
      dRevEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayRev);
      dRevEl.title = 'Doanh thu Ngày';
    }
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaMonthProf);
      mProfEl.title = \`Lãi Tháng \${targetMonth + 1}/\${targetYear}\`;
    }
    if (dProfEl) {
      dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
      dProfEl.title = 'Lãi Ngày';
    }
  }`;

const newSnippet = `  // Tính toán Doanh thu, Lãi và Số lượng PK / Máy đã bán (Ngày & Tháng & Năm & Tất cả)
  let bangaDayRev = 0;
  let bangaDayProf = 0;
  let bangaMonthRev = 0;
  let bangaMonthProf = 0;
  let bangaYearRev = 0;
  let bangaYearProf = 0;
  let bangaAllRev = 0;
  let bangaAllProf = 0;

  let bangaDayPhoneCount = 0;
  let bangaDayPkCount = 0;
  let bangaMonthPhoneCount = 0;
  let bangaMonthPkCount = 0;
  let bangaYearPhoneCount = 0;
  let bangaYearPkCount = 0;
  let bangaAllPhoneCount = 0;
  let bangaAllPkCount = 0;

  const dd = String(currentBangaDateFilter.getDate()).padStart(2, '0');
  const mm = String(currentBangaDateFilter.getMonth() + 1).padStart(2, '0');
  const yyyy = currentBangaDateFilter.getFullYear();
  let targetDateStr = \`\${dd}/\${mm}/\${yyyy}\`;
  let targetMonth = bangaViewMode === 'month' ? currentBangaMonthFilter.month : currentBangaDateFilter.getMonth();
  let targetYear = (bangaViewMode === 'month' ? currentBangaMonthFilter.year : (bangaViewMode === 'year' ? currentBangaYearFilter : currentBangaDateFilter.getFullYear()));

  items.forEach(i => {
    let rev = parsePriceNum(i.total);
    let prof = parsePriceNum(i.profit);
    bangaAllRev += rev;
    bangaAllProf += prof;

    let isItemPhone = false;
    if (typeof getBangaPhoneDetails === 'function') {
      let d = getBangaPhoneDetails(i);
      isItemPhone = !!(d && d.isPhone);
    }
    if (isItemPhone) {
      bangaAllPhoneCount++;
    } else {
      bangaAllPkCount++;
    }

    let parts = (i.dateTime || '').split(' - ');
    if (parts.length >= 2) {
      let datePart = parts[1].trim();

      if (datePart === targetDateStr) {
        bangaDayRev += rev;
        bangaDayProf += prof;
        if (isItemPhone) bangaDayPhoneCount++;
        else bangaDayPkCount++;
      }

      let dp = datePart.split('/');
      if (dp.length === 3) {
        let m = parseInt(dp[1], 10) - 1;
        let y = parseInt(dp[2], 10);
        if (m === targetMonth && y === targetYear) {
          bangaMonthRev += rev;
          bangaMonthProf += prof;
          if (isItemPhone) bangaMonthPhoneCount++;
          else bangaMonthPkCount++;
        }
        if (y === currentBangaYearFilter) {
          bangaYearRev += rev;
          bangaYearProf += prof;
          if (isItemPhone) bangaYearPhoneCount++;
          else bangaYearPkCount++;
        }
      }
    }
  });

  // Cập nhật Box bên trái (Bên trái: PK đã bán, Bên phải: Máy đã bán theo chế độ xem Ngày/Tháng/Năm/Tất cả)
  const mRevEl = document.getElementById('bangaMonthRevenueVal');
  const dRevEl = document.getElementById('bangaDayRevenueVal');
  const mProfEl = document.getElementById('bangaMonthProfitVal');
  const dProfEl = document.getElementById('bangaDayProfitVal');

  let curPkCount = bangaDayPkCount;
  let curPhoneCount = bangaDayPhoneCount;
  let periodTitle = \`Ngày \${targetDateStr}\`;

  if (bangaViewMode === 'year') {
    curPkCount = bangaYearPkCount;
    curPhoneCount = bangaYearPhoneCount;
    periodTitle = \`Năm \${currentBangaYearFilter}\`;
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaYearProf);
      mProfEl.title = \`Lãi Năm \${currentBangaYearFilter}\`;
    }
    if (dProfEl) {
      dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
      dProfEl.title = 'Lãi Ngày';
    }
  } else if (bangaViewMode === 'all') {
    curPkCount = bangaAllPkCount;
    curPhoneCount = bangaAllPhoneCount;
    periodTitle = 'Tất cả';
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaAllProf);
      mProfEl.title = 'Tổng Lãi Tất cả';
    }
    if (dProfEl) {
      dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
      dProfEl.title = 'Lãi Ngày';
    }
  } else if (bangaViewMode === 'month') {
    curPkCount = bangaMonthPkCount;
    curPhoneCount = bangaMonthPhoneCount;
    periodTitle = \`Tháng \${targetMonth + 1}/\${targetYear}\`;
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaMonthProf);
      mProfEl.title = \`Lãi Tháng \${targetMonth + 1}/\${targetYear}\`;
    }
    if (dProfEl) {
      dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
      dProfEl.title = 'Lãi Ngày';
    }
  } else {
    // bangaViewMode === 'day'
    curPkCount = bangaDayPkCount;
    curPhoneCount = bangaDayPhoneCount;
    periodTitle = \`Ngày \${targetDateStr}\`;
    if (mProfEl) {
      mProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaMonthProf);
      mProfEl.title = \`Lãi Tháng \${targetMonth + 1}/\${targetYear}\`;
    }
    if (dProfEl) {
      dProfEl.innerText = isBangaSensitiveHidden ? '***' : formatPriceStr(bangaDayProf);
      dProfEl.title = 'Lãi Ngày';
    }
  }

  if (mRevEl) {
    mRevEl.innerText = isBangaSensitiveHidden ? '***' : \`PK : \${curPkCount}\`;
    mRevEl.title = \`Phụ kiện đã bán (\${periodTitle})\`;
  }
  if (dRevEl) {
    dRevEl.innerText = isBangaSensitiveHidden ? '***' : \`Máy : \${curPhoneCount}\`;
    dRevEl.title = \`Máy đã bán (\${periodTitle})\`;
  }`;

const normalize = str => str.replace(/\r\n/g, '\n');
const normMain = normalize(mainJs);
const normTarget = normalize(targetOld);

if (normMain.includes(normTarget)) {
  const updated = normMain.replace(normTarget, normalize(newSnippet));
  fs.writeFileSync('js/main.js', updated, 'utf8');
  console.log('Updated js/main.js successfully!');
} else {
  console.error('Target not found in js/main.js');
}

