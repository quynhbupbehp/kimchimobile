const fs = require('fs');

function normalizeQuery(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// Mock sales data
const mockSales = [
  { customer: 'Anh Tuấn', name: 'Ốp lưng iPhone 14' },
  { customer: 'Chị Lan', name: 'Cường lực KingKong' },
  { customer: 'Anh Tuấn', name: 'Củ sạc 20W Anker' },
  { customer: 'Khách Lẻ', name: 'Ốp lưng iPhone 13' }
];

function getSalesSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = normalizeQuery(query.trim()).toLowerCase();

  const custMap = new Map();
  const prodMap = new Map();

  mockSales.forEach(item => {
    const cust = (item.customer || '').trim();
    const prod = (item.name || '').trim();

    if (cust) {
      const cNorm = normalizeQuery(cust).toLowerCase();
      if (cNorm.includes(qNorm)) {
        custMap.set(cust, (custMap.get(cust) || 0) + 1);
      }
    }

    if (prod) {
      const pNorm = normalizeQuery(prod).toLowerCase();
      if (pNorm.includes(qNorm)) {
        prodMap.set(prod, (prodMap.get(prod) || 0) + 1);
      }
    }
  });

  const list = [];
  custMap.forEach((count, name) => {
    list.push({ type: 'customer', icon: '👤', label: 'Khách', name, count });
  });
  prodMap.forEach((count, name) => {
    list.push({ type: 'product', icon: '📦', label: 'Hàng', name, count });
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

console.log('Query "tuan":', getSalesSuggestions('tuan'));
console.log('Query "op":', getSalesSuggestions('op'));

