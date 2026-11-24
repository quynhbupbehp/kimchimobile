const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="salesSearchBoxWrapper"');
console.log('=== salesSearchBoxWrapper ===');
console.log(html.slice(sIdx - 50, sIdx + 1500));

const bangaIdx = html.indexOf('id="bangaMainTitleBar"');
console.log('=== banga search ===');
console.log(html.slice(bangaIdx - 50, bangaIdx + 1500));

