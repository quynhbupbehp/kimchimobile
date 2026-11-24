const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const target = `document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-box-bm')) {
    hidePhoneSearchSuggestions();
  }
});`;

const replacement = `document.addEventListener('click', function (e) {
  if (!e.target.closest('#tab-banmay .search-box-bm') && !e.target.closest('.banmay-top-bar .search-box-bm')) {
    hidePhoneSearchSuggestions();
  }
});`;

// Normalize \r\n to match
if (js.includes(target.replace(/\n/g, '\r\n'))) {
  js = js.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced successfully with CRLF');
} else if (js.includes(target)) {
  js = js.replace(target, replacement);
  fs.writeFileSync('js/main.js', js, 'utf8');
  console.log('Replaced successfully with LF');
} else {
  console.log('Target not found');
}

