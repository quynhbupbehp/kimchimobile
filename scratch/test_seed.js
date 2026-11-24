const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');

// Find SEED_SOLD_DATA
const seedMatch = js.match(/window\.SEED_SOLD_DATA\s*=\s*(\[[\s\S]*?\]);\s*\n/);
if (seedMatch) {
  try {
    const seedData = JSON.parse(seedMatch[1]);
    console.log('Total seed sold records:', seedData.length);
    const xsRecords = seedData.filter(x => (x.name || '').toLowerCase().includes('xs'));
    console.log('XS records in seed sold data:', xsRecords.map(x => ({ brand: x.brand, name: x.name })));
  } catch(e) {
    console.log('Error parsing SEED_SOLD_DATA:', e.message);
  }
} else {
  console.log('SEED_SOLD_DATA regex not matched');
}

