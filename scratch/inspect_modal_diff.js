const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Check line in confirmSellPhone:
// closeSellPhoneModal();
// renderPhoneGrid();
// renderSoldPhoneTable();
// alert(`Đã xác nhận bán máy ...`);

// Wait! If confirmSellPhone was called, why would the modal remain on screen if user was able to click a second time?
// Let's check:
// 1. In openSellPhoneModal(id):
// document.getElementById('sellPhoneModal').classList.add('active');
// But in other modals, e.g. openExternalSellPhoneModal:
// modal.style.display = 'flex';
// modal.classList.add('active');
// And in closeExternalSellPhoneModal:
// modal.style.display = 'none';
// modal.classList.remove('active');

// If sellPhoneModal at any point had style="display: flex" or display inline, classList.remove('active') will NOT hide it if there is an inline style or if CSS specificity fails!
// Even worse: Look at index.html line 3632:
// <div class="modal-overlay" id="sellPhoneModal">
// In index.html, it DOES NOT have: style="display: none;"!
// When other modals are defined in index.html:
// <div class="modal-overlay" id="salesNotePadModal" style="z-index: 100000; display: none;" ...>
// <div class="modal-overlay" id="editSoldPhoneModal" style="display: none; z-index: 100000;" ...>
// <div class="modal-overlay" id="externalSellPhoneModal" style="display: none; z-index: 100000;" ...>

// Notice: In sellPhoneModal:
// <div class="modal-overlay" id="sellPhoneModal">
// It has NO display: none inline!
// And in closeSellPhoneModal:
// function closeSellPhoneModal() {
//   const modal = document.getElementById('sellPhoneModal');
//   if (modal) {
//     modal.classList.remove('active');
//     modal.style.display = 'none';
//   }
// }
console.log('Checked inline display difference!');

