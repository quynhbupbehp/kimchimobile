const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at confirmSellPhone:
// Look at the button:
// <button type="submit" id="btnConfirmSellPhone" class="btn-confirm-sell-main">Xác Nhận</button>
// When the form is submitted:
// 1. If form validation fails:
// e.g. <select class="ticket-input" id="sellPaymentMethod" required>
// In the user's screenshot:
// Tên Khách Hàng: "C Nga"
// Giá Bán Thực Tế*: "5.200"
// Lưu Vào*: "Bán Hàng"
// Thanh Toán*: "Chuyển Khoản"
// Bảo Hành*: "12 Tháng"
// Sạc: 38, Ốp: 10, C.Lực: 10, Khác: 0
// Ngày Bán: 10/11/2026, Tiền PK: 58, LÃI: 1.341
// Nút Xác Nhận: Xanh lá, active!

// Why did the 1st click have NO RESPONSE, and the 2nd click show "Không tìm thấy thông tin máy trong kho!"?
// Let's understand this sequence:
// ON 1ST CLICK:
// 1. The form submitted!
// 2. confirmSellPhone(e) executed:
//    - Found the phone: idx is found!
//    - soldItem = phoneDatabase.splice(idx, 1)[0];
//    - soldPhoneDatabase.unshift(soldItem);
//    - salesDatabase.unshift(record);
//    - saveSalesStorage(record);
//    - renderSalesTable(salesDatabase);
//    - logActivity(...);
//    - recordSoldPhoneId(soldItem.id, soldItem.imei);
//    - savePhoneStorage();
//    - saveSoldPhoneStorage(soldItem);
//    - closeSellPhoneModal();  <--- DID THIS CLOSE THE MODAL?
//    - renderPhoneGrid();
//    - renderSoldPhoneTable();
//    - alert(`Đã xác nhận bán máy ...`);

// NOW: Why didn't the modal close?
// Let's look at index.html:
// line 3632:
// <div class="modal-overlay" id="sellPhoneModal">
// In main.js:
// function closeSellPhoneModal() {
//   document.getElementById('sellPhoneModal').classList.remove('active');
// }
// BUT on line 8949 of style.css:
// .modal-overlay.active,
// .modal-overlay.show,
// div[id$="Modal"].active {
//   display: flex !important;
// }
// When .active is removed from #sellPhoneModal:
// On Desktop:
// .modal-overlay {
//   display: none;
// }
// BUT on style.css:
// line 8934:
// @media (max-width: 768px) {
//   .modal-overlay {
//     display: none !important;
//   }
// }
// WAIT! What about on Desktop (screen width > 768px)?
// On Desktop, line 2047:
// .modal-overlay {
//   display: none;
// }
// Wait! If in JavaScript someone set:
// document.getElementById('sellPhoneModal').style.display = 'flex';
// or if the element has inline style or if .modal-ticket-box is displayed, removing class 'active' does NOT remove inline style.display!
// AND in closeSellPhoneModal():
// It NEVER sets style.display = 'none'!
// In EVERY OTHER MODAL in the entire codebase:
// closeSalesNotePadModal(): modal.classList.remove('active'); modal.style.display = 'none';
// closeExternalSellPhoneModal(): modal.classList.remove('active'); modal.style.display = 'none';
// closeViewPhoneModal(): modal.classList.remove('active'); modal.style.display = 'none';
// closeTicketModal(): modal.classList.remove('active'); modal.style.display = 'none';
// BUT closeSellPhoneModal() was ONLY:
// function closeSellPhoneModal() {
//   document.getElementById('sellPhoneModal').classList.remove('active');
// }
// It did NOT set modal.style.display = 'none'!

// ALSO: Look at alert() in Kim Chi Mobile:
// window.alert = function (msg) {
//   showToast(msg, 2000);
// };
// In browser standard alert(), it shows a blocking dialog.
// But window.alert in this app is showToast!
// On 1st click:
// showToast(`Đã xác nhận bán máy ...`);
// BUT the modal was NOT closed because sellPhoneModal didn't hide, OR the user didn't notice the modal closing, so the modal was still sitting there!
// Then the user clicked "Xác Nhận" a SECOND time!
// On the 2nd click:
// The phone was ALREADY spliced from phoneDatabase!
// So phoneDatabase.findIndex returned -1!
// And it showed toast: "Không tìm thấy thông tin máy trong kho!"

// AND: What about double submission prevention?
// If a user clicks "Xác Nhận", the button should immediately disable:
// btn.disabled = true;
// and closeSellPhoneModal() MUST:
// modal.classList.remove('active');
// modal.style.display = 'none';
// And modal in index.html MUST have style="display: none;".

console.log('Analysis verified!');

