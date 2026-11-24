const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const target1 = `oninput="filterSwDropdown('customer', this.value)"`;
const repl1 = `oninput="filterSwDropdown('customer', this.value); checkSoftwareFormValidity();"`;

const target2 = `oninput="filterSwDropdown('device', this.value); handleSwDeviceChange(this.value)"
                onchange="handleSwDeviceChange(this.value)"`;
const repl2 = `oninput="filterSwDropdown('device', this.value); handleSwDeviceChange(this.value); checkSoftwareFormValidity();"
                onchange="handleSwDeviceChange(this.value); checkSoftwareFormValidity();"`;

const target3 = `oninput="formatCurrencyInput(this); filterSwDropdown('price', this.value)"`;
const repl3 = `oninput="formatCurrencyInput(this); filterSwDropdown('price', this.value); checkSoftwareFormValidity();"`;

let normHtml = html.replace(/\r\n/g, '\n');
let normTarget2 = target2.replace(/\r\n/g, '\n');
let normRepl2 = repl2.replace(/\r\n/g, '\n');

normHtml = normHtml.replace(target1, repl1);
normHtml = normHtml.replace(normTarget2, normRepl2);
normHtml = normHtml.replace(target3, repl3);

if (html.includes('\r\n')) normHtml = normHtml.replace(/\n/g, '\r\n');
fs.writeFileSync('index.html', normHtml, 'utf8');
console.log('SUCCESS: Patched index.html with checkSoftwareFormValidity()');

