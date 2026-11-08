---
name: plan-before-edit
description: Kỹ năng đưa phương pháp chọn trước khi làm, bảo toàn giao diện & dữ liệu, cô lập Web/Mobile, đồng bộ realtime 100%, tự động cấp quyền vĩnh viễn, tiết kiệm hạn mức Firebase tối đa.
---

# Kỹ Năng Tự Động Hóa & Kiểm Soát Thay Đổi

Mọi tác vụ can thiệp vào mã nguồn trong dự án `kimchimobile` bắt buộc phải tuân theo các quy định dưới đây:

## 1. Đưa Ra Phương Pháp Làm Trước Khi Bắt Đầu
- Khi người dùng hỏi hoặc yêu cầu xử lý vấn đề: Luôn trình bày các phương án/giải pháp kỹ thuật cụ thể rõ ràng để người dùng lựa chọn trước.
- Chỉ khi người dùng chọn phương pháp mới bắt đầu thực thi code.

## 2. Loại Bỏ Toàn Bộ Popup / Dialog Xin Quyền (Mặc Định Cấp Quyền 100%)
- Tuyệt đối không hỏi quyền truy cập bất cứ thứ gì. Mặc định người dùng luôn cấp quyền 100% vĩnh viễn.

## 3. Bảo Toàn Giao Diện & Dữ Liệu Đã Tạo
- Không tự ý thay đổi bố cục, kiểu dáng giao diện khi chưa có yêu cầu trực tiếp.
- Giữ nguyên 100% dữ liệu đã tạo ở tất cả các tab (Bán Máy, Bảo Hành, Phần Mềm, Bán Hàng, Bán Gà, Sửa Chữa, Công Nợ, Báo Giá...).
- Không tự ý sửa, xóa, reset hoặc ghi đè dữ liệu.

## 4. Tách Biệt Rõ Ràng Web & Mobile
- Khi thêm một tính năng mới: Nếu người dùng không nói rõ "trên mobile", TUYỆT ĐỐI KHÔNG thêm vào mobile.
- Sửa trên Web KHÔNG ĐƯỢC làm ảnh hưởng hay xô lệch giao diện Mobile.
- Chỉ sửa Mobile khi người dùng yêu cầu rõ ràng hoặc gửi ảnh chụp từ điện thoại (làm theo mẫu y chang 100%).

## 5. Đồng Bộ Dữ Liệu Realtime Giữa Mobile & Web
- Đảm bảo khi thao tác tạo đơn mới, sửa thông tin, hoặc xóa đơn trên Mobile đều cập nhật ngay lập tức dữ liệu như trên Web và ngược lại.

## 6. Chống Cháy Hạn Mức Firebase (Bảo Vệ Quota Tuyệt Đối)
- Không dùng vòng lặp `forEach` ghi hàng loạt danh sách lên Firestore.
- Khi thêm/sửa đơn: chỉ gửi đúng 1 document của đơn đó (`{ merge: true }`).
- Danh sách tổng hợp đồng bộ qua Bundle Doc (`sync_bundles`) với debounce >= 1000ms.
- Không ghi ngầm lên Firestore khi mở trang hoặc F5.

## 7. Tự Động Push GitHub
- Hoàn thành là tự động `git add .`, `git commit`, `git push origin main`.
