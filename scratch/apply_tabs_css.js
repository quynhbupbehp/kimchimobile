const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const tabsCss = `
/* ============================================================
   SỔ TAY GHI CHÚ BÁN HÀNG MULTI-TAB (HUYỀN, QUỲNH, +...)
   ============================================================ */
.sales-notepad-tabs-bar {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  border-bottom: 2px solid #334155;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 0;
  scrollbar-width: thin;
}
.sales-notepad-tabs-bar::-webkit-scrollbar {
  height: 4px;
}
.sales-notepad-tabs-bar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
.sales-note-tab-btn {
  position: relative;
  border: 1px solid #334155;
  border-bottom: none;
  background: #1e293b;
  color: #f59e0b;
  font-weight: 800;
  font-size: 0.88rem;
  padding: 8px 18px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.15s ease;
  user-select: none;
  white-space: nowrap;
}
.sales-note-tab-btn:hover {
  background: #334155;
  color: #fbbf24;
}
.sales-note-tab-btn.active {
  background: #d97706;
  border-color: #d97706;
  color: #ffffff;
  font-weight: 900;
  box-shadow: 0 -2px 10px rgba(217, 119, 6, 0.35);
  margin-bottom: -2px;
  padding-bottom: 9px;
  z-index: 2;
}
.sales-note-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #d97706;
}
.sales-note-tab-btn .tab-delete-x {
  margin-left: 8px;
  font-size: 0.75rem;
  opacity: 0.6;
  padding: 2px 4px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.sales-note-tab-btn .tab-delete-x:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.3);
  color: #ef4444;
}
.sales-note-tab-add-btn {
  background: #1e293b;
  border: 1px dashed #f59e0b;
  color: #f59e0b;
  font-weight: 900;
  font-size: 1.1rem;
  line-height: 1;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.sales-note-tab-add-btn:hover {
  background: #f59e0b;
  color: #0b111e;
  transform: scale(1.05);
}
`;

css += tabsCss;
fs.writeFileSync('css/style.css', css, 'utf8');
console.log('Appended styles to css/style.css successfully!');

