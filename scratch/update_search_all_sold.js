const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// 1. Cập nhật getSoldPhoneNameSuggestions: Khi tìm kiếm gợi ý, quét toàn bộ máy đã bán (không bị giới hạn bởi bộ lọc Hãng)
const oldSuggestionsHead = `function getSoldPhoneNameSuggestions(query) {
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
  }`;

const newSuggestionsHead = `function getSoldPhoneNameSuggestions(query) {
  if (!query || !query.trim()) return [];
  const qNorm = (typeof normalizeQuery === 'function' ? normalizeQuery(query.trim()) : query.trim()).toLowerCase();

  // Khi tìm kiếm: quét trên toàn bộ máy đã bán
  let pool = soldPhoneDatabase || [];`;

// 2. Cập nhật renderSoldPhoneTable:
// Khi có từ khóa tìm kiếm (keyword):
//   - Tìm trên 100% tất cả máy đã bán từ trước đến nay (bỏ qua Ngày, Tháng, Năm, Hãng, Trạng thái Bảo Hành)
//   - Hỗ trợ tìm tách từ đa năng (tên máy, imei, khách hàng, màu sắc, dung lượng, ghi chú...)
// Khi không có từ khóa:
//   - Giữ nguyên bộ lọc Hãng, Trạng thái Bảo Hành và Ngày/Tháng/Năm/Tất Cả để hiển thị danh sách bên dưới

const oldFilterBlock = `  let filtered = soldPhoneDatabase.filter(p => {
    // 1. Lọc theo Từ khóa tìm kiếm
    if (keyword) {
      let brand = (p.brand || '').toLowerCase();
      let name = (p.name || '').toLowerCase();
      let imei = (p.imei || '').toLowerCase();
      let customer = (p.customer || '').toLowerCase();
      let storage = (p.storage || '').toLowerCase();
      let color = (p.color || '').toLowerCase();
      let method = (p.method || p.paymentMethod || '').toLowerCase();
      let note = (p.note || '').toLowerCase();
      let gift = (p.giftStr || '').toLowerCase();
      let fullStr = \`\${brand} \${name} \${imei} \${customer} \${storage} \${color} \${method} \${note} \${gift}\`;
      if (!fullStr.includes(keyword)) return false;
    }

    // 2. Lọc theo Hãng: Các hãng đã bán, mặc định là Tất Cả (nhận diện chuẩn 100%)
    if (currentSoldPhoneBrandFilter && currentSoldPhoneBrandFilter !== 'ALL') {
      let cFilter = currentSoldPhoneBrandFilter.toUpperCase().trim();
      let pBrand = (p.brand || '').trim().toUpperCase();
      let pDet = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(p.brand, p.name).toUpperCase() : pBrand;
      let match = (pBrand === cFilter || pDet === cFilter);
      if (cFilter === 'IPHONE' && (pBrand === 'IPAD' || pDet === 'IPAD')) match = true;
      if (!match) return false;
    }

    // 3. Lọc theo Trạng thái Bảo Hành: Còn Bảo Hành / Hết Bảo Hành / Tất Cả
    if (currentSoldPhoneWarrantyFilter && currentSoldPhoneWarrantyFilter !== 'ALL') {
      let isUnderWarranty = isPhoneUnderWarranty(p);
      if (currentSoldPhoneWarrantyFilter === 'CON' && !isUnderWarranty) return false;
      if (currentSoldPhoneWarrantyFilter === 'HET' && isUnderWarranty) return false;
    }

    // 4. Lọc theo Chế độ xem: Nếu đang tìm kiếm thì tìm trên TOÀN BỘ danh sách bảo hành; Nếu không tìm kiếm thì lọc theo Ngày / Tháng / Năm / Tất Cả
    if (keyword) return true;
    if (soldPhoneViewMode === 'all') return true;

    let pDate = parseSoldPhoneDate(p);
    if (!pDate) return true; // Giữ lại nếu không rõ ngày

    if (soldPhoneViewMode === 'day') {
      return pDate.d === currentSoldPhoneDateFilter.getDate() &&
        pDate.m === currentSoldPhoneDateFilter.getMonth() &&
        pDate.y === currentSoldPhoneDateFilter.getFullYear();
    } else if (soldPhoneViewMode === 'month') {
      return pDate.m === currentSoldPhoneMonthFilter.month &&
        pDate.y === currentSoldPhoneMonthFilter.year;
    } else if (soldPhoneViewMode === 'year') {
      return pDate.y === currentSoldPhoneYearFilter;
    }

    return true;
  });`;

const newFilterBlock = `  const normKeyword = (typeof normalizeQuery === 'function' ? normalizeQuery(keyword) : keyword).trim();
  const searchWords = normKeyword ? normKeyword.split(/\\s+/).filter(Boolean) : [];

  let filtered = soldPhoneDatabase.filter(p => {
    // KHI CÓ TỪ KHÓA TÌM KIẾM: TÌM XUYÊN SUỐT TRÊN TOÀN BỘ MÁY ĐÃ BÁN (BỎ QUA NGÀY/THÁNG/NĂM, HÃNG, TRẠNG THÁI BH)
    if (searchWords.length > 0) {
      let brand = (p.brand || '').toLowerCase();
      let name = (p.name || '').toLowerCase();
      let imei = (p.imei || '').toLowerCase();
      let customer = (p.customer || '').toLowerCase();
      let storage = (p.storage || '').toLowerCase();
      let color = (p.color || '').toLowerCase();
      let method = (p.method || p.paymentMethod || '').toLowerCase();
      let note = (p.note || '').toLowerCase();
      let gift = (p.giftStr || '').toLowerCase();
      let fullStr = \`\${brand} \${name} \${imei} \${customer} \${storage} \${color} \${method} \${note} \${gift}\`.toLowerCase();
      let normFullStr = (typeof normalizeQuery === 'function' ? normalizeQuery(fullStr) : fullStr).toLowerCase();

      // Tất cả các từ khóa gõ vào đều phải xuất hiện trong thông tin máy
      return searchWords.every(w => fullStr.includes(w) || normFullStr.includes(w));
    }

    // KHI KHÔNG CÓ TỪ KHÓA: ÁP DỤNG BỘ LỌC HÃNG, BẢO HÀNH VÀ NGÀY/THÁNG/NĂM ĐỂ HIỂN THỊ DANH SÁCH BÊN DƯỚI
    // 1. Lọc theo Hãng
    if (currentSoldPhoneBrandFilter && currentSoldPhoneBrandFilter !== 'ALL') {
      let cFilter = currentSoldPhoneBrandFilter.toUpperCase().trim();
      let pBrand = (p.brand || '').trim().toUpperCase();
      let pDet = (typeof detectPhoneBrand === 'function') ? detectPhoneBrand(p.brand, p.name).toUpperCase() : pBrand;
      let match = (pBrand === cFilter || pDet === cFilter);
      if (cFilter === 'IPHONE' && (pBrand === 'IPAD' || pDet === 'IPAD')) match = true;
      if (!match) return false;
    }

    // 2. Lọc theo Trạng thái Bảo Hành
    if (currentSoldPhoneWarrantyFilter && currentSoldPhoneWarrantyFilter !== 'ALL') {
      let isUnderWarranty = isPhoneUnderWarranty(p);
      if (currentSoldPhoneWarrantyFilter === 'CON' && !isUnderWarranty) return false;
      if (currentSoldPhoneWarrantyFilter === 'HET' && isUnderWarranty) return false;
    }

    // 3. Lọc theo Chế độ xem: Ngày / Tháng / Năm / Tất Cả
    if (soldPhoneViewMode === 'all') return true;

    let pDate = parseSoldPhoneDate(p);
    if (!pDate) return true; // Giữ lại nếu không rõ ngày

    if (soldPhoneViewMode === 'day') {
      return pDate.d === currentSoldPhoneDateFilter.getDate() &&
        pDate.m === currentSoldPhoneDateFilter.getMonth() &&
        pDate.y === currentSoldPhoneDateFilter.getFullYear();
    } else if (soldPhoneViewMode === 'month') {
      return pDate.m === currentSoldPhoneMonthFilter.month &&
        pDate.y === currentSoldPhoneMonthFilter.year;
    } else if (soldPhoneViewMode === 'year') {
      return pDate.y === currentSoldPhoneYearFilter;
    }

    return true;
  });`;

// Replace in mainJs
let successCount = 0;
if (mainJs.includes(oldSuggestionsHead)) {
  mainJs = mainJs.replace(oldSuggestionsHead, newSuggestionsHead);
  successCount++;
  console.log('1. Updated getSoldPhoneNameSuggestions successfully');
} else {
  console.error('Failed to find oldSuggestionsHead in js/main.js');
}

if (mainJs.includes(oldFilterBlock)) {
  mainJs = mainJs.replace(oldFilterBlock, newFilterBlock);
  successCount++;
  console.log('2. Updated renderSoldPhoneTable filter successfully');
} else {
  console.error('Failed to find oldFilterBlock in js/main.js');
}

if (successCount === 2) {
  fs.writeFileSync('js/main.js', mainJs, 'utf8');
  console.log('Successfully saved js/main.js');
}

