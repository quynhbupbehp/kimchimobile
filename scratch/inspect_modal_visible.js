const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// Also check: When the button is clicked, what if double click happens?
// If a user clicks rapidly, or if the form is submitting:
// 1st click:
// runs confirmSellPhone(e)
// - splices item from phoneDatabase
// - unshifts to soldPhoneDatabase
// - saves phoneDatabase, saves soldPhoneDatabase
// - unshifts to salesDatabase / bangaDatabase
// - calls closeSellPhoneModal()
// BUT if the button is NOT disabled, or if user clicked before modal finished hiding:
// 2nd click runs:
// const idx = phoneDatabase.findIndex(p => p.id === id);
// since it was already spliced, idx === -1!
// => alert('Không tìm thấy thông tin máy trong kho!');

// BUT WAIT! The user says:
// "tab bán máy
// bấm xác nhận 1 lần không phản hồi
// bấm lần 2 báo như vậy"

// "Bấm xác nhận 1 lần KHÔNG PHẢN HỒI" -> Why did the 1st click have NO RESPONSE?
// Did it succeed silently? Or did it error out?
// Let's check:
// In the screenshot:
// At the top, there is a toast:
// "Không tìm thấy thông tin máy trong kho!" (with a green checkmark icon inside toast!)
// And the modal "Xác Nhận Bán Máy" with SAMSUNG - A17 (8/128GB) 9051 is STILL OPEN ON SCREEN!
// Why is it STILL OPEN on screen?!
// Because when the 1st click ran, closeSellPhoneModal() DID NOT HIDE THE MODAL!
// Why did closeSellPhoneModal() not hide the modal?
// Look at closeSellPhoneModal():
// function closeSellPhoneModal() {
//   document.getElementById('sellPhoneModal').classList.remove('active');
// }
// If on line 8949 of style.css:
// .modal-overlay.active,
// .modal-overlay.show,
// div[id$="Modal"].active {
//   display: flex !important;
// }
// When .active is removed, what CSS rule applies to #sellPhoneModal?
// On line 2047:
// .modal-overlay {
//   position: fixed; ...
//   display: none;
// }
// BUT on line 8951 of style.css:
// div[id$="Modal"].active { display: flex !important; }
// Wait! What if #sellPhoneModal has inline style or if .modal-overlay was overridden?
// In index.html line 3632:
// <div class="modal-overlay" id="sellPhoneModal">
// In openSellPhoneModal(id):
// document.getElementById('sellPhoneModal').classList.add('active');
// document.getElementById('sellPhoneModal').style.display = 'flex'; (not even set!)
// If closeSellPhoneModal() is called:
// document.getElementById('sellPhoneModal').classList.remove('active');
// If .modal-overlay doesn't have display: none !important or if style.display was set to flex by some other code, it STAYS VISIBLE!

console.log('Checked why modal remained visible!');

