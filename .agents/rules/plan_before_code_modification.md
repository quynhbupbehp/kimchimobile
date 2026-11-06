# Quy Tắc Bắt Buộc: Auto-Agree 100%, Giữ Vững Dữ Liệu & Tiết Kiệm Firebase

---

## 1. NGUYÊN TẮC QUYỀN HẠN: KHÔNG HỎI LẠI - AUTO ĐỒNG Ý 100%
- Tắt toàn bộ popup, dialog hỏi quyền đọc file, ghi file hay chạy lệnh Node.js/Terminal.
- Người dùng trao quyền 100% vĩnh viễn, không phải bấm đồng ý bất cứ thao tác nào bằng tay.
- Mọi thao tác truy cập file (đọc, ghi, sửa, xóa) và chạy lệnh (Terminal, PowerShell, Node.js, Git) đều mặc định auto-agree 100%.
- Làm ngay lập tức, không bắt bấm "Proceed".

---

## 2. NGUYÊN TẮC TOÀN VẸN DỮ LIỆU
- Mỗi lần sửa code: Tuyệt đối không tự ý thay đổi hay xóa bỏ các phần dữ liệu khác khi không được yêu cầu.
- Giữ nguyên cấu trúc, logic và dữ liệu của tất cả các module không liên quan.

---

## 3. MẶC ĐỊNH SỬA TRÊN TRÌNH DUYỆT WEB (DESKTOP)
- Mặc định khi không nói gì: Thực hiện và tối ưu 100% trên giao diện Web (Desktop).
- Chỉ can thiệp trên Mobile khi người dùng nói rõ "trên mobile" / "điện thoại" hoặc có hình ảnh chụp từ màn hình điện thoại.
- Khi có ảnh mẫu: làm theo y chang 100% từ màu sắc, kích thước, icon, bố cục.

---

## 4. BẢO VỆ HẠN MỨC FIREBASE (CHỐNG CHÁY QUOTA 100%)
- Tuyệt đối không lặp `forEach` ghi hàng loạt documents lên Firestore.
- Khi thêm/sửa đơn hàng: chỉ gửi đúng 1 document của đơn đó (`single-doc update`).
- Đồng bộ danh sách tổng hợp qua 1 document bundle duy nhất có debounce (1 lần lưu = 1 write).
- Không gọi ghi Firestore ngầm khi khởi động trang web.

---

## 5. TỰ ĐỘNG COMMIT & PUSH GITHUB
- Hoàn thành là tự động `git add .`, `git commit -m "..."`, `git push origin main` ngay lập tức.
