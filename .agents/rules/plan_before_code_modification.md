# Quy Tắc Bắt Buộc: Quyền Hạn, Bảo Toàn Dữ Liệu, Giao Diện & Đồng Bộ Web - Mobile

---

## 1. NGUYÊN TẮC HỎI Ý KIẾN & THỐNG NHẤT PHƯƠNG PHÁP TRƯỚC KHI BẮT ĐẦU
- Khi người dùng hỏi hoặc yêu cầu xử lý vấn đề: Luôn đưa ra các phương pháp/giải pháp kỹ thuật cụ thể rõ ràng để người dùng lựa chọn trước.
- Chỉ khi người dùng chọn phương pháp mới bắt đầu thực thi code.

---

## 2. NGUYÊN TẮC QUYỀN HẠN: KHÔNG HỎI LẠI - MẶC ĐỊNH CẤP QUYỀN 100%
- Tuyệt đối không được phép hỏi quyền truy cập bất cứ thứ gì. Mặc định người dùng luôn luôn cấp toàn bộ quyền truy cập 100% vĩnh viễn ở mức cao nhất.
- Luôn dùng các công cụ nội tại (`read_file`, `edit_file`, `write_file`) và lệnh shell bình thường mà không để phát sinh popup xác nhận quyền trong môi trường IDE.

---

## 3. NGUYÊN TẮC BẢO TOÀN GIAO DIỆN & DỮ LIỆU ĐÃ TẠO
- Tuyệt đối KHÔNG ĐƯỢC TỰ Ý THAY ĐỔI GIAO DIỆN, bố cục của bất kỳ tab hay phần nào khi chưa có yêu cầu trực tiếp.
- Tuyệt đối KHÔNG ĐƯỢC TỰ Ý SỬA, THÊM BỚT, XÓA DỮ LIỆU ĐÃ TẠO ở tất cả các tab (Bán Máy, Bảo Hành, Phần Mềm, Bán Hàng, Bán Gà, Sửa Chữa, Công Nợ, Báo Giá...).
- Nghiêm cấm tự ý reset, xóa bỏ hoặc ghi đè dữ liệu.

---

## 4. NGUYÊN TẮC TÁCH BIỆT WEB & MOBILE KHI THÊM/SỬA CHỨC NĂNG
- Khi thêm một chức năng mới: Nếu người dùng không nói rõ "trên mobile", TUYỆT ĐỐI KHÔNG ĐƯỢC THÊM VÀO MOBILE.
- Sửa trên Web TUYỆT ĐỐI KHÔNG ĐƯỢC ẢNH HƯỞNG ĐẾN MOBILE. Mọi thay đổi về CSS, giao diện, logic trên Web (Desktop) phải được cô lập độc lập, bảo đảm không làm biến dạng, xô lệch hoặc phát sinh lỗi trên giao diện Mobile.
- Chỉ can thiệp vào giao diện Mobile khi người dùng ghi rõ "trên mobile" / "trên điện thoại" hoặc gửi ảnh chụp từ màn hình điện thoại (khi có ảnh mẫu, làm theo y chang 100%).

---

## 5. NGUYÊN TẮC ĐỒNG BỘ DỮ LIỆU REALTIME GIỮA MOBILE & WEB
- Đảm bảo khi thao tác tạo đơn mới, sửa thông tin, hoặc xóa đơn trên Mobile đều cập nhật ngay lập tức dữ liệu như trên Web và ngược lại.
- Dữ liệu giữa Web và Mobile phải luôn đồng nhất tức thì.

---

## 6. BẢO VỆ HẠN MỨC FIREBASE (CHỐNG CHÁY QUOTA 100%)
- Tuyệt đối không lặp `forEach` ghi hàng loạt documents lên Firestore.
- Khi thêm/sửa đơn hàng: chỉ gửi đúng 1 document của đơn đó (`single-doc update`).
- Đồng bộ danh sách tổng hợp qua 1 document bundle duy nhất có debounce (1 lần lưu = 1 write).
- Không gọi ghi Firestore ngầm khi khởi động trang web.

---

## 7. TỰ ĐỘNG COMMIT & PUSH GITHUB
- Hoàn thành là tự động `git add .`, `git commit -m "..."`, `git push origin main` ngay lập tức.
