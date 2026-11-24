const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const target1 = '<div class="unified-date-ctrls" id="bangaYearFilterBox">';
const replacement1 = '<div class="unified-date-ctrls" id="bangaYearFilterBox" style="display: none;">';

if (html.includes(target1)) {
  html = html.replace(target1, replacement1);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Replaced bangaYearFilterBox style successfully!');
} else {
  console.error('Target not found in index.html');
}

