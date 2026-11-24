const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);
for (let i = 710; i <= 745; i++) {
  console.log(i + ': ' + JSON.stringify(lines[i-1]));
}

