const fs = require('fs');

let js = fs.readFileSync('js/main.js', 'utf8');

const oldTarget = `  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#000000';
    color = '#ffffff';
    border = '1px solid #475569';
  }`;

const newReplacement = `  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff';
    color = '#ea580c';
    border = '1px solid #fed7aa';
  }`;

if (js.includes(oldTarget)) {
  js = js.replace(oldTarget, newReplacement);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced IPHONE badge colors in LF mode');
} else if (js.includes(oldTarget.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldTarget.replace(/\n/g, '\r\n'), newReplacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced IPHONE badge colors in CRLF mode');
} else {
  console.log('oldTarget not found in main.js');
}

