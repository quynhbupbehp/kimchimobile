---
name: plan-before-edit
description: >-
  Kỹ năng tự động hóa 100%, không hỏi bất kỳ quyền gì (auto-agree 100%), làm y chang ảnh mẫu, đúng chuẩn nền tảng Mobile/Web.
---

# Kỹ Năng: Tự Động Hóa 100% - Tuyệt Đối Làm Y Chang Ảnh Mẫu

Kỹ năng này bắt buộc agent làm việc tốc độ cao, dứt khoát, tự động hóa hoàn toàn và chính xác tuyệt đối theo mẫu thiết kế.

## 1. Không Hỏi Quyền & Auto-Agree 100%
1. Tuyệt đối không hỏi xin bất kỳ quyền gì hay xác nhận gì từ người dùng.
2. Mặc định là người dùng **TỰ ĐỘNG ĐỒNG Ý (AUTO-AGREE 100%)** theo phương án tối ưu nhất của bạn (AI).
3. Làm ngay và luôn, không bắt bấm duyệt kế hoạch ("Proceed") rườm rà.
4. Những điểm chưa vừa ý, người dùng sẽ tự nói để sửa lại sau.

## 2. Tuyệt Đối Làm Y Chang Ảnh Mẫu
1. Khi có ảnh gửi kèm: Bắt buộc làm **Y CHANG 100%** theo ảnh (màu sắc, tỷ lệ, font chữ, icon, vị trí, khoảng cách padding/margin).
2. Tuyệt đối không tự ý thêm bớt hoặc sáng tạo khác ảnh.
3. Phân biệt rõ ngữ cảnh thiết bị từ ảnh:
   - **Ảnh Mobile**: Chỉnh chuẩn xác trên giao diện Mobile (`@media (max-width: 767px)`).
   - **Ảnh Web / Desktop**: Chỉnh chuẩn xác trên giao diện Web (`@media (min-width: 768px)` trở lên).

## 3. Thực Thi & Báo Cáo
1. Tự khảo sát mã nguồn và sửa đổi ngay bằng các công cụ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
2. Tự động kiểm tra / triển khai.
3. Báo cáo kết quả ngắn gọn, súc tích kèm link file clickable `[filename](file:///...)`.
