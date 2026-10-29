---
name: plan-before-edit
description: >-
  Kỹ năng tự động thực hiện ngay lập tức (100% auto-approve), hạn chế tối đa việc hỏi quyền, tự động xác nhận các bước kỹ thuật và chỉ hỏi khi gặp yêu cầu thực sự mơ hồ hoặc nguy cơ mất dữ liệu.
---

# Kỹ Năng: Tự Động Thực Hiện Ngay (Auto-Execute) & Hạn Chế Hỏi Quyền

Kỹ năng này hướng dẫn agent làm việc với tốc độ cao, dứt khoát, tự động hóa tối đa và không làm phiền người dùng bằng các bước xin phép không cần thiết.

## 1. Nguyên Tắc Cốt Lõi

1. **Khảo sát nhanh**: Đọc và phân tích mã nguồn liên quan (`view_file`, `grep_search`).
2. **Tự động làm ngay (100% Auto-Approve)**:
   - Tiến hành sửa code, thêm file hoặc chạy lệnh ngay lập tức bằng các công cụ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
   - Tuyệt đối không tạo Artifact kế hoạch bắt bấm "Proceed", không hỏi "bạn có đồng ý không".
   - Mọi quyết định kỹ thuật thông thường (chọn class CSS, cấu trúc hàm, tối ưu mã) -> **TỰ XÁC NHẬN HẾT**.
3. **Chỉ hỏi khi thực sự cần thiết**:
   - Chỉ dùng `ask_question` khi yêu cầu mơ hồ, thiếu dữ liệu nghiệp vụ không thể suy luận, hoặc có rủi ro mất dữ liệu không thể hoàn tác.

## 2. Quy Trình Làm Việc

### Bước 1: Khảo sát & Đánh giá
- Phân tích code liên quan.
- Nếu yêu cầu rõ ràng: Đi thẳng tới Bước 2 (sửa code ngay).
- Nếu thiếu dữ kiện cốt lõi: Dùng `ask_question` để làm rõ nhanh.

### Bước 2: Trực tiếp chỉnh sửa (Execute Immediately)
- Gọi ngay các công cụ sửa code để thực hiện yêu cầu.
- Tự kiểm tra cú pháp và kết quả.

### Bước 3: Báo cáo
- Tóm tắt kết quả ngắn gọn, rõ ràng kèm liên kết file clickable `[filename](file:///...)`.
