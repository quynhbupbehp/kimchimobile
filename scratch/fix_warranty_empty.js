const fs = require('fs');

let bg = fs.readFileSync('baogia.html', 'utf8');
bg = bg.replace("warranty: '0 Bảo Hành'", "warranty: ''");
fs.writeFileSync('baogia.html', bg, 'utf8');
console.log('Updated baogia.html warranty');

let js = fs.readFileSync('js/main.js', 'utf8');
js = js.replace("document.getElementById('rFormWarranty').value = data.warranty || '0 Bảo Hành';", "document.getElementById('rFormWarranty').value = data.warranty || '';");
fs.writeFileSync('js/main.js', js, 'utf8');
console.log('Updated js/main.js warranty');

