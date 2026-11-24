const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Check tab ban hang stats
// let's search for salesMonthRevenueVal or salesDayRevenueVal
let idx = mainJs.indexOf('salesMonthRevenueVal');
if (idx !== -1) {
  console.log(mainJs.substring(idx - 200, idx + 800));
}

