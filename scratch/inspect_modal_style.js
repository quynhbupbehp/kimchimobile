const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at confirmSellPhone:
// When confirmSellPhone is clicked the 1st time:
// 1. soldItem is spliced from phoneDatabase!
//    let soldItem = phoneDatabase.splice(idx, 1)[0];
// 2. But if alert() was replaced by showToast (which does NOT block thread and doesn't show a blocking modal popup),
//    AND if closeSellPhoneModal() ONLY removes 'active' class:
//    document.getElementById('sellPhoneModal').classList.remove('active');
//    Wait! Does #sellPhoneModal have style="display: none"?
//    Let's check in index.html how sellPhoneModal is styled when not active!

let html = fs.readFileSync('index.html', 'utf8');
let sellPhoneModalIdx = html.indexOf('id="sellPhoneModal"');
console.log('sellPhoneModal HTML snippet:', html.substring(sellPhoneModalIdx, sellPhoneModalIdx + 200));

