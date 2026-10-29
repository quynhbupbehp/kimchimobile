# Quy Tắc: Cấp Quyền Duy Nhất 1 Lần Cho Mỗi Dự Án & Hỏi Khi Vướng Mắc

Quy tắc này bắt buộc áp dụng cho mọi thao tác chỉnh sửa mã nguồn hoặc thực thi lệnh trong thư mục làm việc.

## Các Yêu Cầu Bắt Buộc

1. **Hỏi Quyền Duy Nhất 1 Lần Cho Mỗi Dự Án (Single Authorization)**:
   - Trong mỗi dự án làm việc, chỉ hỏi xin xác nhận quyền của người dùng **DUY NHẤT 1 LẦN** (ở tác vụ đầu tiên).
   - Ngay sau khi đã được cấp quyền, dự án được xem là **ĐÃ ĐƯỢC PHÊ DUYỆT TOÀN QUYỀN**.
   - Mọi yêu cầu chỉnh sửa tiếp theo (dù lớn hay nhỏ) đều được **TỰ ĐỘNG THỰC HIỆN NGAY LẬP TỨC (100% AUTO-APPROVE)** bằng các công cụ chỉnh sửa code mà KHÔNG cần hỏi lại, không cần chờ bấm duyệt.

2. **Chủ Động Hỏi Ngay Khi Chưa Hiểu Hoặc Vướng Mắc (Clarify Immediately)**:
   - Trường hợp duy nhất dừng lại hỏi là khi yêu cầu của người dùng chưa rõ ràng, mơ hồ hoặc có nhiều hướng triển khai khác nhau.
   - Bắt buộc dùng `ask_question` để làm rõ ngay trước khi sửa code.
   - Nếu gặp lỗi kỹ thuật hoặc sự cố nghiêm trọng (blocker), báo cáo ngay cho người dùng.

3. **Báo Cáo Minh Bạch & Đầy Đủ**:
   - Sau khi hoàn thành việc chỉnh sửa code, báo cáo tóm tắt rõ ràng các thay đổi kèm liên kết file clickable `[filename](file:///...)`.
