const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Target snippet in renderBangaTable:
// We want to count Phone and PK for:
// - Day (targetDateStr)
// - Month (targetMonth, targetYear)
// - Year (currentBangaYearFilter)
// - All

const targetOld = `    let parts = (i.dateTime || '').split(' - ');
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
  });`;

console.log('Old target found:', mainJs.includes(targetOld));

