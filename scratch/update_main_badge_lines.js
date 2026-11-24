const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Normalize CRLF to LF temporarily or work line by line
const lines = mainJs.split(/\r?\n/);
let replacedCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("if (detected === 'IPHONE') {") && lines[i+1].includes("text = 'IPHONE';")) {
    lines.splice(i, 5,
      "  let customClass = '';",
      "  if (detected === 'IPHONE') {",
      "    text = 'IPHONE';",
      "    bg = '#ffffff !important';",
      "    color = '#ea580c !important';",
      "    border = '1px solid #fed7aa !important';",
      "    customClass = 'brand-text-badge-iphone';",
      "    extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';"
    );
    replacedCount++;
    break;
  }
}

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return `<span class="brand-text-badge" style="display: inline-block; background: ${bg};')) {
    lines[i] = lines[i].replace('class="brand-text-badge"', 'class="brand-text-badge ${customClass}"');
    replacedCount++;
    break;
  }
}

console.log('Replacements made:', replacedCount);
fs.writeFileSync('js/main.js', lines.join('\n'), 'utf8');

