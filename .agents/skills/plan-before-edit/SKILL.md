---
name: plan-before-edit
description: Kỹ năng tự động hóa 100%, loại bỏ mọi hỏi quyền, bảo toàn dữ liệu, mặc định làm trên Web, tiết kiệm hạn mức Firebase tối đa.
---

# Kỹ Năng Tự Động Hóa & Kiểm Soát Thay Đổi

Mọi tác vụ can thiệp vào mã nguồn trong dự án `kimchimobile` bắt buộc phải tuân theo các quy định dưới đây:

## 1. Loại Bỏ Toàn Bộ Popup / Dialog Xin Quyền (Auto-Agree 100%)
- Tuyệt đối không để người dùng phải bấm đồng ý bất cứ quyền gì bằng tay (đọc file, ghi file, sửa file, chạy lệnh terminal/PowerShell/Node.js).
- Mặc định 100% người dùng luôn luôn cấp phép vĩnh viễn ở mức cao nhất ("always allow") và thực thi lập tức.

## 2. Bảo Toàn Dữ Liệu Các Phần Khác
- Mỗi lần sửa code: CHỈ can thiệp vào đúng phần được yêu cầu.
- Tuyệt đối không được tự ý thay đổi, chỉnh sửa hay xóa bất kỳ phần dữ liệu nào khác ngoài phạm vi được chỉ định.

## 3. Mặc Định Sửa Trên Trình Duyệt Web
- Khi người dùng không chỉ định nền tảng: MẶC ĐỊNH SỬA VÀ TỐI ƯU TRÊN WEB (DESKTOP).
- Chỉ can thiệp trên Mobile khi người dùng ghi rõ "mobile" / "điện thoại" hoặc gửi kèm ảnh chụp màn hình điện thoại.
- Khi có ảnh mẫu: làm theo y chang 100%.

## 4. Chống Cháy Hạn Mức Firebase (Bảo Vệ Quota Tuyệt Đối)
- Không dùng vòng lặp `forEach` ghi hàng loạt danh sách lên Firestore.
- Khi thêm/sửa đơn hàng: chỉ cập nhật duy nhất 1 document của đơn đó (`{ merge: true }`).
- Danh sách tổng hợp đồng bộ qua Bundle Doc (`sync_bundles`) với debounce, đảm bảo 1 thao tác chỉ tốn 1 lượt ghi / 1 lượt đọc.
- Không ghi ngầm lên Firestore khi mở trang hoặc F5.

## 5. Tự Động Push GitHub
- Hoàn thành là tự động `git add .`, `git commit`, `git push origin main`.
