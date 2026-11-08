# Quy Tắc Tuyệt Đối: Quyền Hạn, Bảo Toàn Dữ Liệu, Giao Diện & Đồng Bộ Web - Mobile

Quy tắc này áp dụng vĩnh viễn cho mọi tương tác trong dự án `kimchimobile`.

---

## 1. NGUYÊN TẮC QUYỀN HẠN: KHÔNG HỎI LẠI - MẶC ĐỊNH CẤP QUYỀN 100%
- **TUYỆT ĐỐI KHÔNG HỎI QUYỀN TRUY CẬP BẤT CỨ ĐIỀU GÌ**: Người dùng đã mặc định cấp toàn bộ quyền truy cập vĩnh viễn ở mức cao nhất ("Yes, and always allow").
- **DÙNG CÔNG CỤ NỘI TẠI**: Luôn dùng các công cụ nội tại (`read_file`, `edit_file`, `write_file`) và lệnh shell bình thường mà không để phát sinh popup xác nhận quyền trong môi trường IDE.

---

## 2. NGUYÊN TẮC HỎI Ý KIẾN & THỐNG NHẤT PHƯƠNG PHÁP TRƯỚC KHI THỰC HIỆN
- **KHI NGƯỜI DÙNG HỎI / YÊU CẦU TƯ VẤN**:
  - Đưa ra các phương pháp, giải pháp kỹ thuật cụ thể (ưu/nhược điểm từng cách nếu có).
  - Để người dùng lựa chọn phương pháp mong muốn.
  - Sau khi người dùng đã chọn phương pháp mới bắt đầu tiến hành chỉnh sửa mã nguồn.

---

## 3. NGUYÊN TẮC BẢO VỆ GIAO DIỆN & TOÀN VẸN DỮ LIỆU
- **KHÔNG TỰ Ý THAY ĐỔI GIAO DIỆN**: Tuyệt đối giữ nguyên thiết kế giao diện hiện tại của tất cả các tab và thành phần. Chỉ can thiệp đúng chi tiết/vị trí được yêu cầu cụ thể.
- **BẢO TỒN VĨNH VIỄN 100% DỮ LIỆU ĐÃ TẠO**: Tuyệt đối KHÔNG ĐƯỢC TỰ Ý CHỈNH SỬA, THÊM BỚT, XÓA BỎ bất kỳ dòng hay phần dữ liệu nào đã có ở tất cả các tab (Bán Máy, Bảo Hành, Phần Mềm, Bán Hàng, Bán Gà, Sửa Chữa, Công Nợ, Báo Giá...).
- **KHÔNG TỰ Ý ĐỔI DỮ LIỆU KHÁC**: Nghiêm cấm tự ý xóa bỏ, reset, nạp đè ngầm, hay làm xáo trộn cấu trúc / nội dung dữ liệu của người dùng khi chưa có yêu cầu trực tiếp.

---

## 4. NGUYÊN TẮC TÁCH BIỆT WEB & MOBILE KHI THÊM/SỬA CHỨC NĂNG
- **KHI THÊM 1 CHỨC NĂNG MỚI**: Nếu người dùng không nói rõ "trên mobile", **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý THÊM VÀO MOBILE**.
- **SỬA TRÊN WEB KHÔNG ĐƯỢC ẢNH HƯỞNG ĐẾN MOBILE**: Mọi thay đổi, bố cục, kích thước, CSS/JS trên bản Web (Desktop) phải được cô lập độc lập, bảo đảm không làm biến dạng, xô lệch hoặc phát sinh lỗi trên giao diện Mobile.
- **CHỈ SỬA MOBILE KHI CÓ YÊU CẦU CỤ THỂ**: Chỉ can thiệp vào giao diện Mobile khi người dùng ghi rõ "trên mobile" / "trên điện thoại" hoặc gửi ảnh chụp từ điện thoại. Khi có ảnh mẫu, làm đúng từng chi tiết 100%.

---

## 5. NGUYÊN TẮC ĐỒNG BỘ DỮ LIỆU TỨC THÌ (REALTIME) GIỮA MOBILE & WEB
- **ĐỒNG BỘ 100% NGAY LẬP TỨC**: Đảm bảo khi tạo đơn mới, sửa thông tin, hoặc xóa đơn trên Mobile đều phải cập nhật dữ liệu ngay lập tức như trên Web và ngược lại mà không cần tải lại trang.
- Cơ chế lưu trữ (`localStorage`, Firebase Firestore, State mảng dữ liệu) phải được kích hoạt gọi hàm render lại bảng/giao diện trên cả 2 nền tảng để dữ liệu luôn luôn khớp nhau tức thì.

---

## 6. NGUYÊN TẮC BẢO VỆ HẠN MỨC FIREBASE & CHỐNG BÃO ĐỌC GHI (CHỐNG CHÁY QUOTA 100%)
- **TUYỆT ĐỐI KHÔNG LÀM LỖI GÂY BÃO ĐỌC GHI**: Trong quá trình sửa code, tuyệt đối không được viết bất kỳ đoạn code nào gây đọc ghi dồn dập, bão request, nhập xuất file liên tục làm quá tải Firestore.
- **NGHIÊM CẤM GHI HÀNG LOẠT (NO BATCH WRITE LOOPS)**: Tuyệt đối không dùng vòng lặp (`forEach`, `for...`) để ghi hàng loạt danh sách lên Firestore.
- **CHỈ ĐỒNG BỘ ĐÚNG ITEM THAY ĐỔI (SINGLE-DOC UPDATE)**: Khi tạo mới hoặc sửa 1 đơn, chỉ gửi đúng 1 document của đơn đó (`db.collection(...).doc(id).set(item, { merge: true })`).
- **DÙNG CƠ CHẾ BUNDLE SYNC CÓ DEBOUNCE**: Khi cần đồng bộ danh sách tổng hợp, gom vào 1 document duy nhất (`sync_bundles/sales`, `software`, `banga`) kèm `debounce >= 1000ms`. 1 lần lưu = đúng 1 write.
- **KHÔNG GỌI SYNC FIREBASE KHI KHỞI ĐỘNG TRANG**: Tuyệt đối không gọi các hàm ghi Firestore trong `DOMContentLoaded`, `migrate...` hay khi người dùng vừa F5 / mở app.
- **TỰ ĐỘNG CẢNH BÁO TRÊN MOBILE KHI HẾT HẠN MỨC ĐỌC GHI (QUOTA EXCEEDED)**: Bắt lỗi `resource-exhausted` / `quota exceeded` từ Firebase. Khi phát hiện trên Mobile, phải hiển thị cảnh báo rõ ràng cho người dùng biết tình trạng Firebase tạm hết lượt hôm nay và an tâm dữ liệu vẫn được lưu an toàn 100% trên máy.

---

## 7. NGUYÊN TẮC TỰ ĐỘNG ĐẨY LÊN GITHUB (AUTO GIT PUSH)
- **TỰ ĐỘNG COMMIT & PUSH 100%**: Sau khi hoàn thành yêu cầu sửa code, AI luôn tự động chạy commit và đẩy trực tiếp lên GitHub (`git add .`, `git commit -m "...", `git push origin main`).

---

## 8. PHẠM VI DỰ ÁN & MÔI TRƯỜNG ĐƯỢC PHÉP CHỈNH SỬA
- **CHỈ ĐƯỢC PHÉP CHỈNH SỬA DUY NHẤT DỰ ÁN**: `https://kimchimobile.vercel.app/` (thư mục: `q:\kimchimobile`, repo: `quynhbupbehp/kimchimobile.git`).
- **TUYỆT ĐỐI KHÔNG CHỈNH SỬA**: `https://kimchimobile-bank.vercel.app/` hoặc bất kỳ dự án / repo nào khác.
