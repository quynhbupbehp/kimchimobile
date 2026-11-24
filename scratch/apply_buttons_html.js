const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Tab Bán Hàng: salesExcelActionsBox
const salesTarget = `<button type="button" class="btn-action-sales" onclick="exportSalesToExcel()"
                  title="Xuất danh sách Bán Hàng ra file Excel"
                  style="height: 36px; background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 0 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer; box-sizing: border-box;">
                  📤 Xuất
                </button>`;

const salesReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportSalesToExcel()"
                  title="Xuất danh sách Bán Hàng ra file Excel"
                  style="height: 36px; background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 0 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer; box-sizing: border-box;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicateSalesItems()"
                  title="Xóa các đơn bán hàng trùng lặp, chỉ giữ lại duy nhất 1 đơn"
                  style="height: 36px; background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.88rem; padding: 0 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer; box-sizing: border-box;">
                  🧹 Lọc Trùng
                </button>`;

// 2. Tab Sửa Chữa: repairExcelActionsBox
const repairTarget = `<button type="button" class="btn-action-sales" onclick="exportRepairToExcel()"
                  title="Xuất danh sách Sửa Chữa ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>`;

const repairReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportRepairToExcel()"
                  title="Xuất danh sách Sửa Chữa ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicateRepairItems()"
                  title="Xóa các đơn sửa chữa trùng lặp, chỉ giữ lại duy nhất 1 đơn"
                  style="background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer;">
                  🧹 Lọc Trùng
                </button>`;

// 3. Tab Bán Máy: phoneExcelActionsBox
const phoneTarget = `<button type="button" class="btn-action-sales" onclick="exportPhoneToExcel()"
                  title="Xuất danh sách Bán Máy ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>`;

const phoneReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportPhoneToExcel()"
                  title="Xuất danh sách Bán Máy ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicatePhoneItems()"
                  title="Xóa máy trùng lặp (cùng IMEI hoặc cùng tên, màu, dung lượng, giá), chỉ giữ lại duy nhất 1 máy"
                  style="background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer;">
                  🧹 Lọc Trùng
                </button>`;

// 4. Tab Bán Gà: bangaExcelActionsBox
const bangaTarget = `<button type="button" class="btn-action-sales" onclick="exportBangaToExcel()"
                  title="Xuất danh sách Bán Gà ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>`;

const bangaReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportBangaToExcel()"
                  title="Xuất danh sách Bán Gà ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicateBangaItems()"
                  title="Xóa các đơn bán gà trùng lặp, chỉ giữ lại duy nhất 1 đơn"
                  style="background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer;">
                  🧹 Lọc Trùng
                </button>`;

// 5. Tab Bảo Hành (Máy đã bán):
const soldTarget = `<button type="button" class="btn-action-sales" onclick="exportSoldPhoneToExcel()"
                  title="Xuất danh sách Bảo Hành ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>`;

const soldReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportSoldPhoneToExcel()"
                  title="Xuất danh sách Bảo Hành ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicateSoldPhoneItems()"
                  title="Xóa máy bảo hành trùng lặp, chỉ giữ lại duy nhất 1 máy"
                  style="background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.97rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer;">
                  🧹 Lọc Trùng
                </button>`;

// 6. Tab Main - Xác:
const mxTarget = `<button type="button" class="btn-action-sales" onclick="exportMainXacToExcel()"
                  title="Xuất danh sách Main Xác ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>`;

const mxReplacement = `<button type="button" class="btn-action-sales btn-export-excel-action" onclick="exportMainXacToExcel()"
                  title="Xuất danh sách Main Xác ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất
                </button>
                <button type="button" class="btn-action-sales" onclick="removeDuplicateMainXacItems()"
                  title="Xóa máy main xác trùng lặp, chỉ giữ lại duy nhất 1 máy"
                  style="background: #0f172a; border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(245,158,11,0.25); cursor: pointer;">
                  🧹 Lọc Trùng
                </button>`;

// Also tag tab Phần Mềm export button with class "btn-export-excel-action"
const swExportTarget = `onclick="exportSoftwareToExcel()"
                  title="Xuất danh sách Phần Mềm ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất`;

const swExportReplacement = `onclick="exportSoftwareToExcel()"
                  class="btn-action-sales btn-export-excel-action"
                  title="Xuất danh sách Phần Mềm ra file Excel"
                  style="background: #0f172a; border: 1.5px solid #38bdf8; color: #ffffff; font-weight: 800; font-size: 0.88rem; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(56,189,248,0.25); cursor: pointer;">
                  📤 Xuất`;

const normalize = s => s.replace(/\r\n/g, '\n');
let normHtml = normalize(html);

normHtml = normHtml.replace(normalize(salesTarget), normalize(salesReplacement));
normHtml = normHtml.replace(normalize(repairTarget), normalize(repairReplacement));
normHtml = normHtml.replace(normalize(phoneTarget), normalize(phoneReplacement));
normHtml = normHtml.replace(normalize(bangaTarget), normalize(bangaReplacement));
normHtml = normHtml.replace(normalize(soldTarget), normalize(soldReplacement));
normHtml = normHtml.replace(normalize(mxTarget), normalize(mxReplacement));
normHtml = normHtml.replace(normalize(swExportTarget), normalize(swExportReplacement));

fs.writeFileSync('index.html', normHtml, 'utf8');
console.log('Updated index.html buttons successfully!');

