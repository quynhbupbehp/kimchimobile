---
name: plan-before-edit
description: >-
  Kỹ năng tự động thực hiện ngay 100%, tuyệt đối không hỏi quyền hay bắt duyệt, tự động hóa toàn bộ quy trình chỉnh sửa và triển khai code.
---

# Kỹ Năng: Tự Động Làm Ngay 100% (Zero-Friction Execution)

Kỹ năng này bắt buộc agent làm việc tốc độ cao, dứt khoát, tự động hóa hoàn toàn và tuyệt đối không hỏi xin quyền gây mất thời gian của người dùng.

## 1. Hành Động Ngay Lập Tức
1. Khảo sát nhanh mã nguồn liên quan.
2. Thực hiện sửa đổi ngay bằng các công cụ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
3. Tuyệt đối không tạo Artifact kế hoạch bắt bấm duyệt ("Proceed"), không dùng `ask_question` khảo sát rườm rà.
4. Báo cáo kết quả ngắn gọn, súc tích kèm link file clickable `[filename](file:///...)`.
