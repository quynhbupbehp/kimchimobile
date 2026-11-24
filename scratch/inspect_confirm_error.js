const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Look at confirmSellPhone:
// 1. In confirmSellPhone:
// const id = parseFloat(document.getElementById('sellPhoneId').value);
// const idx = phoneDatabase.findIndex(p => p.id === id);
// If p.id is string "1731...", String(p.id) === String(id) or p.id == id!
// 2. Button disabling:
// When the user clicks "Xác Nhận", the button does not disable!
// If the user clicks once, but modal doesn't immediately close (or if closeSellPhoneModal fails to hide because style.display was not reset),
// the phone has ALREADY been spliced from phoneDatabase!
// Then on the 2nd click:
// idx is -1!
// And it triggers: alert('Không tìm thấy thông tin máy trong kho!');
// 3. AND notice the toast at the top of the user's screenshot:
// "Không tìm thấy thông tin máy trong kho!"
// Why didn't the modal close or why didn't the user see the success alert on the 1st click?
// Look at line 11331:
// alert(`Đã xác nhận bán máy ${soldItem.name} (${soldItem.imei}) thành công!\n- Lưu vào: ${targetList}\n- Thanh toán: ${paymentMethod}\n- Bảo hành: ${warranty}.`);
// But wait! Where was closeSellPhoneModal() called?
// Line 11326: closeSellPhoneModal();
// Let's check closeSellPhoneModal:
// function closeSellPhoneModal() {
//   document.getElementById('sellPhoneModal').classList.remove('active');
// }
// Does closeSellPhoneModal set style.display = 'none'?
// In externalSellPhoneModal:
// function closeExternalSellPhoneModal() {
//   const modal = document.getElementById('externalSellPhoneModal');
//   if (modal) {
//     modal.style.display = 'none';
//     modal.classList.remove('active');
//   }
// }
// In openExternalSellPhoneModal:
// modal.style.display = 'flex';
// modal.classList.add('active');

// But in openSellPhoneModal / closeSellPhoneModal:
// open: document.getElementById('sellPhoneModal').classList.add('active');
// close: document.getElementById('sellPhoneModal').classList.remove('active');

// BUT in index.html:
// <div class="modal-overlay" id="sellPhoneModal"> (NO style="display: none;")
// AND in CSS on desktop:
// .modal-overlay { display: none; }
// .modal-overlay.active { display: flex !important; }
// BUT IF sellPhoneModal has inline style or if any code set style.display='flex' or if an unhandled error occurred in confirmSellPhone BEFORE closeSellPhoneModal!

