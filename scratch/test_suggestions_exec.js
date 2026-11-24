const fs = require('fs');

const seedContent = fs.readFileSync('js/seed_data.js', 'utf8');
const window = {};
eval(seedContent);

const soldPhoneDatabase = window.SEED_SOLD_DATA;
let currentSoldPhoneBrandFilter = 'ALL';

function normalizeQuery(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function formatBrandDeviceName(str) {
  if (!str || typeof str !== 'string') return str || '';
  let res = str;
  res = res.replace(/(?<!\p{L})(\d{1,2})\s*GB(?!\p{L})/gui, '$1');
  res = res.replace(/(?<!\p{L})(iphone|Iphone)(?!\p{L})/gu, 'iPhone');
  res = res.replace(/(?<!\p{L})(ipad|Ipad)(?!\p{L})/gu, 'iPad');
  res = res.replace(/(?<!\p{L})se(?!\p{L})/gui, 'SE');
  return res;
}

function getSoldPhoneNameSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  let pool = soldPhoneDatabase || [];
  if (currentSoldPhoneBrandFilter && currentSoldPhoneBrandFilter !== 'ALL') {
    const cbf = (currentSoldPhoneBrandFilter || '').toUpperCase().trim();
    pool = pool.filter(p => {
      let pBrand = (p.brand || '').trim().toUpperCase();
      let pDet = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(p.brand, p.name).toUpperCase() : pBrand;
      let match = (pBrand === cbf || pDet === cbf);
      if (cbf === 'IPHONE' && (pBrand === 'IPAD' || pDet === 'IPAD')) match = true;
      return match;
    });
  }

  const nameMap = new Map();
  pool.forEach(p => {
    let rawName = (p.name || '').trim();
    if (!rawName) return;

    let cleanedName = rawName
      .replace(/\s*-\s*\(?(đang\s*)?thất\s*lạc\)?/gi, '')
      .replace(/\s*\([^)]*vân\s*tay[^)]*\)/gi, '')
      .replace(/\s*-\s*cất\s*trong\s*nhà/gi, '')
      .trim();

    let displayModel = formatBrandDeviceName(cleanedName || rawName);
    let key = displayModel.toLowerCase();

    let normModel = (typeof normalizeQuery === 'function' ? normalizeQuery(displayModel) : displayModel).toLowerCase();
    let normFullName = (typeof normalizeQuery === 'function' ? normalizeQuery(`${p.brand || ''} ${displayModel}`) : `${p.brand || ''} ${displayModel}`).toLowerCase();

    let isMatch = normModel.includes(qNorm) ||
      normFullName.includes(qNorm) ||
      rawName.toLowerCase().includes(qNorm);

    if (isMatch) {
      if (!nameMap.has(key)) {
        nameMap.set(key, { name: displayModel, count: 1, brand: p.brand || '' });
      } else {
        nameMap.get(key).count++;
      }
    }
  });

  const list = Array.from(nameMap.values());
  list.sort((a, b) => {
    let aLower = a.name.toLowerCase();
    let bLower = b.name.toLowerCase();
    let aExact = aLower === qNorm;
    let bExact = bLower === qNorm;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    let aStarts = aLower.startsWith(qNorm);
    let bStarts = bLower.startsWith(qNorm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    if (a.name.length !== b.name.length) {
      return a.name.length - b.name.length;
    }
    return a.name.localeCompare(b.name);
  });

  return list.slice(0, 10);
}

console.log('Suggestions for "xs":', getSoldPhoneNameSuggestions('xs'));
console.log('Suggestions for "XS":', getSoldPhoneNameSuggestions('XS'));
console.log('Suggestions for "14":', getSoldPhoneNameSuggestions('14'));

