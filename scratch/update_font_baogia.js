const fs = require('fs');

let content = fs.readFileSync('baogia.html', 'utf8');

const target = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');

        body {
            background-color: #060913;
            color: #f3f4f6;
            font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
            font-size: 1.15rem;
            font-weight: 700;
        }`;

// Handle CRLF vs LF
const targetCRLF = target.replace(/\n/g, '\r\n');
const replacementCRLF = `*, *::before, *::after {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }

        body {
            background-color: #060913;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            font-size: 1.15rem;
            font-weight: 700;
        }

        input, select, textarea, button, span, div, p, label, a, table, th, td, h1, h2, h3 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }`.replace(/\n/g, '\r\n');

if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('baogia.html', content, 'utf8');
    console.log('Successfully updated font in baogia.html (CRLF)');
} else if (content.includes(target)) {
    content = content.replace(target, replacementCRLF.replace(/\r\n/g, '\n'));
    fs.writeFileSync('baogia.html', content, 'utf8');
    console.log('Successfully updated font in baogia.html (LF)');
} else {
    console.error('Target not found in baogia.html');
}

