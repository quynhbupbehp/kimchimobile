const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Find tab ban may / ban hang revenue calculation or where accessories (PK) vs phones (máy) are distinguished
// Let's search for "phụ kiện" or "PK" or "phoneDatabase" in sales/banga context
let lines = mainJs.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('phụ kiện') || l.includes('Phụ kiện') || l.includes('Phụ Kiện') || l.includes('PK') || l.includes('accessory')) {
    if (idx > 5400 && idx < 6200) {
      console.log(`L${idx+1}: ${l}`);
    }
  }
});

