const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

// Check line 8949:
// .modal-overlay.active,
// .modal-overlay.show,
// div[id$="Modal"].active {
//   display: flex !important;
// }

// What about when .active is removed?
// Line 2047:
// .modal-overlay {
//   display: none;
// }
// BUT on line 8934:
// .modal-overlay {
//   display: none !important;
// }
// Wait! What if #sellPhoneModal inline style or active class had display: flex set or didn't close?
// Let's check closeSellPhoneModal in mainJs:
// function closeSellPhoneModal() {
//   document.getElementById('sellPhoneModal').classList.remove('active');
// }
// Does it set style.display = 'none'? NO!
// If any other code sets modal.style.display = 'flex', removing class 'active' will NOT hide it!

