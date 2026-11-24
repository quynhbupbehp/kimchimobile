global.window = {};
const fs = require('fs');
eval(fs.readFileSync('js/seed_data.js', 'utf8'));
const list = window.SEED_SOLD_DATA || [];
console.log('Total sold:', list.length);
['11', 'xs', '14 pro max', 'poco', 'samsung'].forEach(kw => {
  const matches = list.filter(p => {
    let fullStr = ((p.brand||'') + ' ' + (p.name||'') + ' ' + (p.imei||'') + ' ' + (p.customer||'') + ' ' + (p.storage||'') + ' ' + (p.color||'') + ' ' + (p.note||'')).toLowerCase();
    return fullStr.includes(kw);
  });
  console.log('kw:', kw, '=> matches:', matches.length);
});

