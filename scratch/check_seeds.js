const fs = require('fs');
const code = fs.readFileSync('js/seed_data.js', 'utf8');
const counts = {};
const regex = /"status":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(code)) !== null) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('Seed statuses:', counts);

