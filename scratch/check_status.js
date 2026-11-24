const fs = require('fs');

const seed = fs.readFileSync('js/seed_data.js', 'utf8');
const statuses = new Set();
const regex = /"status":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(seed)) !== null) {
  statuses.add(m[1]);
}
console.log('Statuses in seed:', Array.from(statuses));

