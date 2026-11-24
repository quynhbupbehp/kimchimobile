const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find "THEO DÕI DOANH THU" in index.html
let lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('THEO DÕI DOANH THU') || l.includes('theo-doi-doanh-thu') || l.includes('dailyStatsModal') || l.includes('revenueTrackingModal')) {
    console.log(`L${idx+1}: ${l.trim()}`);
  }
});

