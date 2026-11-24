const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Replace IPHONE styling inside getPhoneBrandBadgeHtml
const searchBlock = `  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff';
    color = '#ea580c';
    border = '1px solid #fed7aa';`;

const replaceBlock = `  let customClass = '';
  if (detected === 'IPHONE') {
    text = 'IPHONE';
    bg = '#ffffff !important';
    color = '#ea580c !important';
    border = '1px solid #fed7aa !important';
    customClass = 'brand-text-badge-iphone';
    extraStyle = 'background-color: #ffffff !important; color: #ea580c !important;';`;

if (mainJs.includes(searchBlock)) {
  mainJs = mainJs.replace(searchBlock, replaceBlock);
  mainJs = mainJs.replace(
    'return `<span class="brand-text-badge" style="display: inline-block; background: ${bg}; color: ${color}; font-weight: 900; font-size: 0.95rem; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px; line-height: 1.25; ${borderStyle} ${extraStyle}">${escapeHtml(text)}</span>`;',
    'return `<span class="brand-text-badge ${customClass}" style="display: inline-block; background: ${bg}; color: ${color}; font-weight: 900; font-size: 0.95rem; padding: 2px 8px; border-radius: 5px; letter-spacing: 0.5px; vertical-align: middle; margin-right: 6px; line-height: 1.25; ${borderStyle} ${extraStyle}">${escapeHtml(text)}</span>`;'
  );
  fs.writeFileSync('js/main.js', mainJs, 'utf8');
  console.log('Successfully updated js/main.js');
} else {
  console.error('searchBlock not found!');
}

