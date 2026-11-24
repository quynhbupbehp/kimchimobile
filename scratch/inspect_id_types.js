const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Check line 11213:
// const id = parseFloat(document.getElementById('sellPhoneId').value);
// const idx = phoneDatabase.findIndex(p => p.id === id);

// Notice: p.id can be a string like "1731252..." or a UUID or "sale_..." or number!
// If id in phoneDatabase is a string, p.id === id (when id is number from parseFloat) might fail or if id is string like "phone_123" parseFloat yields NaN!
console.log('Sample IDs in phoneDatabase if seeded or created:');
let re = /id:\s*['"]?[a-zA-Z0-9_.-]+['"]?/g;
let sampleMatches = [];
for (let i = 0; i < 5; i++) {
  let m = re.exec(mainJs);
  if (m) sampleMatches.push(m[0]);
}
console.log(sampleMatches);

