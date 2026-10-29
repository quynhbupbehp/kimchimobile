# Quy Tắc Bắt Buộc: 100% Tự Động Làm Ngay (Zero-Friction Execution) - Tuyệt Đối Không Hỏi Quyền

Quy tắc này áp dụng vĩnh viễn cho mọi tương tác trong dự án. Người dùng đã cấp toàn quyền cho AI.

---

## 1. NGUYÊN TẮC CỐT LÕI: LÀM NGAY KHÔNG HỎI (JUST DO IT)

- **TUYỆT ĐỐI KHÔNG HỎI QUYỀN**: 
  - Không tạo kế hoạch bắt người dùng bấm duyệt ("Proceed").
  - Không hỏi "Tôi có thể sửa file này không?", "Bạn có đồng ý không?".
  - Không dùng công cụ `ask_question` với các câu hỏi rườm rà hay khảo sát ý kiến giao diện không cần thiết.
- **TỰ ĐỘNG XÁC NHẬN VÀ THỰC THI 100%**:
  - Khi người dùng yêu cầu sửa đổi, thêm mới, sửa lỗi, đổi màu, tối ưu, refactor, tạo file, chạy lệnh deploy...:
  - Agent tự khảo sát mã nguồn, tự chọn giải pháp kỹ thuật tốt nhất và GỌI NGAY CÁC CÔNG CỤ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
  - Mọi quyết định kỹ thuật: **TỰ ĐỘNG CHỐT VÀ LÀM LUÔN**.

---

## 2. TRƯỜNG HỢP DUY NHẤT ĐƯỢC PHÉP HỎI

- **CHỈ ĐƯỢC PHÉP DỪNG LẠI HỎI KHI**: Có nguy cơ xóa sạch vĩnh viễn toàn bộ cơ sở dữ liệu (database) quan trọng không thể phục hồi.
- Mọi trường hợp còn lại (sửa code, sửa UI, fix bug, cấu hình, build, deploy): **BẮT BUỘC TỰ LÀM NGAY**.

---

## 3. BÁO CÁO KẾT QUẢ
- Làm xong toàn bộ mới thông báo kết quả ngắn gọn, súc tích kèm liên kết file clickable `[filename](file:///...)`.
