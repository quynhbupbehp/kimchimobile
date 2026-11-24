const fs = require('fs');

function normalizeQuery(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// Mock banga data
const mockBanga = [
  { name: 'iPhone XS Max', accessory: 'Sạc 20W' },
  { name: 'iPhone XS', accessory: 'Cường lực' },
  { name: 'Bán Thẻ', accessory: 'Phụ kiện' },
  { name: 'iPhone 11', accessory: 'Sạc 20W' }
];

function getBangaSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = normalizeQuery(query.trim()).toLowerCase();

  const phoneMap = new Map();
  const accMap = new Map();

  mockBanga.forEach(item => {
    const phone = (item.name || '').trim();
    const acc = (item.accessory || '').trim();

    if (phone) {
      const pNorm = normalizeQuery(phone).toLowerCase();
      if (pNorm.includes(qNorm)) {
        phoneMap.set(phone, (phoneMap.get(phone) || 0) + 1);
      }
    }

    if (acc) {
      const aNorm = normalizeQuery(acc).toLowerCase();
      if (aNorm.includes(qNorm)) {
        accMap.set(acc, (accMap.get(acc) || 0) + 1);
      }
    }
  });

  const list = [];
  phoneMap.forEach((count, name) => {
    list.push({ type: 'phone', icon: '📱', label: 'Máy', name, count });
  });
  accMap.forEach((count, name) => {
    list.push({ type: 'accessory', icon: '🔌', label: 'Phụ kiện', name, count });
  });

  list.sort((a, b) => {
    let aLower = normalizeQuery(a.name).toLowerCase();
    let bLower = normalizeQuery(b.name).toLowerCase();
    let aExact = aLower === qNorm;
    let bExact = bLower === qNorm;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    let aStarts = aLower.startsWith(qNorm);
    let bStarts = bLower.startsWith(qNorm);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return b.count - a.count;
  });

  return list.slice(0, 10);
}

console.log('Query "xs":', getBangaSuggestions('xs'));
console.log('Query "sac":', getBangaSuggestions('sac'));

