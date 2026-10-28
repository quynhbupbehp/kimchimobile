---
name: plan-before-edit
description: >-
  Kỹ năng quản lý quy trình sửa code: mỗi dự án chỉ hỏi quyền duy nhất 1 lần, các lần tiếp theo tự động thực hiện ngay lập tức (100% auto-approve), và chủ động hỏi ngay khi có vướng mắc hoặc chưa rõ yêu cầu.
---

# Kỹ Năng Quy Trình Sửa Code: Hỏi Quyền Duy Nhất 1 Lần & Tự Động Thực Hiện

Kỹ năng này hướng dẫn agent thực hiện quy trình làm việc tốc độ cao, dứt khoát và chuẩn mực với mã nguồn dự án.

## 1. Nguyên Tắc Cốt Lõi

1. **Khảo sát trước khi sửa**: Luôn đọc và phân tích mã nguồn (`view_file`, `grep_search`) trước khi can thiệp.
2. **Hỏi quyền duy nhất 1 lần cho mỗi dự án (Single Authorization)**:
   - Trong mỗi dự án làm việc, chỉ hỏi xin xác nhận quyền của người dùng **DUY NHẤT 1 LẦN** (ở lượt đầu tiên).
   - Khi đã được cấp quyền, dự án được xem là **ĐÃ ĐƯỢC TOÀN QUYỀN (AUTHORIZED)**.
   - Mọi tác vụ tiếp theo (kể cả tác vụ nhỏ hay lớn) đều được **TỰ ĐỘNG THỰC HIỆN NGAY LẬP TỨC (100% AUTO-APPROVE)** mà không cần dừng lại xin duyệt hay hẹn giờ.
3. **Chủ động hỏi ngay khi chưa rõ (Clarify Immediately)**:
   - Khi yêu cầu mơ hồ, thiếu thông tin hoặc có nhiều phương án: dừng lại hỏi ngay bằng `ask_question`.

---

## 2. Quy Trình Thực Hiện Chi Tiết

### Bước 1: Khảo sát & Đánh Giá
- Khảo sát mã nguồn liên quan.
- **Nếu có điểm chưa rõ ràng / mơ hồ**: Gọi ngay `ask_question` để làm rõ với người dùng trước khi code.
- **Nếu yêu cầu đã rõ ràng**: Tiến hành bước tiếp theo.

---

### Bước 2: Kiểm Tra Quyền Dự Án
- **Nếu là lần đầu tiên tiếp nhận dự án**:
  - Tóm tắt phương án hoặc trình bày kế hoạch lần đầu tiên và xin xác nhận quyền thao tác trong dự án này.
  - Ngay khi người dùng đồng ý: Ghi nhận dự án đã được cấp quyền.
- **Nếu dự án đã được cấp quyền từ trước (các lượt tiếp theo)**:
  - **BỎ QUA KHÂU XIN QUYỀN**: Tuyệt đối không dừng lại hỏi quyền, không bắt người dùng bấm duyệt lặp lại.
  - Chuyển thẳng sang **Bước 3**.

---

### Bước 3: Thực Hiện Chỉnh Sửa Trực Tiếp (Direct Execution)
1. Sử dụng ngay các công cụ chỉnh sửa mã nguồn (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
2. Tự động kiểm tra tính đúng đắn và chuẩn xác của code sau khi sửa.
3. Báo cáo kết quả chi tiết, rõ ràng kèm liên kết file clickable `[filename](file:///...)`.
