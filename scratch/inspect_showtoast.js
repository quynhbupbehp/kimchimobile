const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Check line 3680 where alert is defined:
let alertDef = mainJs.indexOf('window.alert =');
console.log(mainJs.substring(alertDef - 200, alertDef + 800));
