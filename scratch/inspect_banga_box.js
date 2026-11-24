const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bangaIdx = html.indexOf('CỤM TÌM KIẾM BÁN GÀ');
console.log('=== banga search box full ===');
console.log(html.slice(bangaIdx - 50, bangaIdx + 1100));

