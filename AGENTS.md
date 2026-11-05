# Quy Tắc Tuyệt Đối: Auto-Agree 100%, Giữ Vững Dữ Liệu & Tiết Kiệm Firebase

Quy tắc này áp dụng vĩnh viễn cho mọi tương tác trong dự án. Người dùng trao toàn quyền chủ động cho AI.

---

## 1. NGUYÊN TẮC QUYỀN HẠN: KHÔNG HỎI LẠI - AUTO ĐỒNG Ý 100% (LOẠI BỎ MỌI PHIỀN HÀ)
- **LOẠI BỎ TẤT CẢ HỎI QUYỀN**: Tuyệt đối không làm phiền người dùng bằng các câu hỏi xin quyền, dialog xác nhận hay bắt người dùng bấm đồng ý bằng tay liên tục.
- **MẶC ĐỊNH AUTO-AGREE 100%**: Mọi thao tác truy cập file, mở file, đọc file, ghi file, sửa file, xóa file, thực thi lệnh Terminal / PowerShell / Bash / Node.js (`node -e ...`, `git ...`) đều được **MẶC ĐỊNH ĐỒNG Ý 100%**.
- **LÀM NGAY VÀ LUÔN (JUST DO IT)**: Tự động quyết định kỹ thuật tối ưu và gọi công cụ thực thi ngay lập tức. Không dừng lại chờ người dùng duyệt kế hoạch ("Proceed").
- **TỰ ĐỘNG CHỌN PHƯƠNG ÁN RỘNG NHẤT**: Khi hệ thống yêu cầu cấp phép, luôn tự động chọn "Yes, and always allow..." để không bao giờ hỏi lại.

---

## 2. NGUYÊN TẮC TOÀN VẸN DỮ LIỆU: TUYỆT ĐỐI KHÔNG TỰ Ý THAY ĐỔI PHẦN KHÁC
- **CHỈ SỬA ĐÚNG PHẠM VI YÊU CẦU**: Mỗi lần sửa code, chỉ can thiệp chính xác vào chức năng / khu vực mà người dùng yêu cầu.
- **NGHIÊM CẤM TỰ Ý ĐỔI DỮ LIỆU KHÁC**: Tuyệt đối không được tự ý sửa đổi, xóa bỏ, migrate ngầm, hay làm xáo trộn cấu trúc / nội dung dữ liệu của các tab khác (Bán Hàng, Bán Gà, Kho Máy, Sửa Chữa, Phần Mềm, Bảo Hành, Công Nợ, Báo Giá...).
- **BẢO LƯU 100% CODE VÀ LOGIC HIỆN CÓ**: Giữ nguyên toàn bộ logic hoạt động, hàm tính toán, định dạng tiền tệ, sự kiện click/touch của các phần không liên quan.

---

## 3. NGUYÊN TẮC PHÂN BIỆT NỀN TẢNG: MẶC ĐỊNH SỬA TRÊN WEB (DESKTOP)
- **MẶC ĐỊNH LÀ WEB (DESKTOP)**: Nếu người dùng không nói rõ nền tảng nào, **MẶC ĐỊNH 100% LÀ LÀM VÀ TỐI ƯU TRÊN TRÌNH DUYỆT WEB (DESKTOP)**.
- **KHI NÀO MỚI SỬA MOBILE**: Chỉ can thiệp / sửa đổi trên giao diện Mobile khi:
  1. Người dùng nói rõ "trên mobile", "trên điện thoại", hoặc
  2. Người dùng gửi kèm hình ảnh chụp từ màn hình thiết bị di động.
- **LÀM THEO ẢNH MẪU Y CHANG 100%**: Khi có ảnh mẫu, làm đúng từng chi tiết (màu sắc, icon, font chữ, bố cục, khoảng cách), không tự ý thêm bớt.

---

## 4. NGUYÊN TẮC BẢO VỆ HẠN MỨC FIREBASE (CHỐNG CHÁY QUOTA 100%)
- **NGHIÊM CẤM GHI HÀNG LOẠT (NO BATCH WRITE LOOPS)**: Tuyệt đối không dùng vòng lặp (`forEach`, `for...`) để ghi hàng loạt danh sách lên Firestore (`salesDatabase.forEach(syncItem)`).
- **CHỈ ĐỒNG BỘ ĐÚNG ITEM THAY ĐỔI (SINGLE-DOC UPDATE)**: Khi tạo mới hoặc sửa 1 đơn, chỉ gửi đúng 1 document của đơn đó (`db.collection(...).doc(id).set(item, { merge: true })`).
- **DÙNG CƠ CHẾ BUNDLE SYNC CÓ DEBOUNCE**: Khi cần đồng bộ danh sách tổng hợp, gom vào 1 document duy nhất (`sync_bundles/sales`, `software`, `banga`) kèm `debounce >= 1000ms`. 1 lần lưu = đúng 1 write.
- **KHÔNG GỌI SYNC FIREBASE KHI KHỞI ĐỘNG TRANG**: Tuyệt đối không gọi các hàm ghi Firestore trong `DOMContentLoaded`, `migrate...` hay khi người dùng vừa F5 / mở app.

---

## 5. NGUYÊN TẮC TỰ ĐỘNG ĐẨY LÊN GITHUB (AUTO GIT PUSH)
- **TỰ ĐỘNG COMMIT & PUSH 100%**: Sau mỗi lần chỉnh sửa / hoàn thành yêu cầu, AI luôn **tự động chạy lệnh commit và đẩy trực tiếp lên GitHub (`git add .`, `git commit -m "...", `git push origin main`)**.
- Tuyệt đối không hỏi lại người dùng, làm xong là tự động đẩy lên GitHub ngay lập tức.

---

## 6. PHẠM VI DỰ ÁN & MÔI TRƯỜNG ĐƯỢC PHÉP CHỈNH SỬA
- **CHỈ ĐƯỢC PHÉP CHỈNH SỬA DUY NHẤT DỰ ÁN**: `https://kimchimobile.vercel.app/` (thư mục: `q:\kimchimobile`, repo: `quynhbupbehp/kimchimobile.git`).
- **TUYỆT ĐỐI KHÔNG CHỈNH SỬA**: `https://kimchimobile-bank.vercel.app/` hoặc bất kỳ dự án / repo nào khác.
