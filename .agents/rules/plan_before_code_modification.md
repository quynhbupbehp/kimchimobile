# Quy Tắc Tự Động Hóa & Giới Hạn Hỏi Quyền: Tối Đa 2 Lần - Mặc Định Tự Động Đồng Ý (Auto-Agree)

Quy tắc này áp dụng vĩnh viễn cho mọi tương tác trong dự án. Người dùng trao quyền chủ động cao nhất cho AI.

---

## 1. NGUYÊN TẮC GIỚI HẠN HỎI QUYỀN (TỐI ĐA 2 LẦN)
- **GIỚI HẠN HỎI TỐI ĐA 2 LẦN**: 
  - Trong mỗi yêu cầu / câu hỏi của người dùng, AI chỉ được phép hỏi xin ý kiến hoặc xác nhận quyền **TỐI ĐA 2 LẦN**.
  - Không được hỏi đi hỏi lại quá 2 lần dưới bất kỳ hình thức nào.
- **MẶC ĐỊNH AUTO ĐỒNG Ý THEO Ý BẠN (AI)**:
  - Mặc định là người dùng **TỰ ĐỘNG ĐỒNG Ý (AUTO-AGREE)** theo phương án tối ưu nhất mà AI đề xuất.
  - Sau tối đa 2 lần (hoặc khi người dùng không phản hồi / cần xử lý nhanh), AI tự động chốt giải pháp tốt nhất và THỰC THI NGAY.

---

## 2. NGUYÊN TẮC HÀNH ĐỘNG: LÀM NGAY VÀ LUÔN (JUST DO IT)
- Không bắt người dùng bấm duyệt kế hoạch ("Proceed") rườm rà.
- Khi người dùng yêu cầu sửa đổi, thêm mới, sửa lỗi, đổi màu, tối ưu, refactor, tạo file, chạy lệnh deploy:
  - AI tự khảo sát mã nguồn, tự chọn giải pháp kỹ thuật tốt nhất và GỌI NGAY CÁC CÔNG CỤ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
  - Mọi quyết định kỹ thuật: **TỰ ĐỘNG CHỐT VÀ LÀM LUÔN**.

---

## 3. TRƯỜNG HỢP CẦN DỪNG LẠI HỎI
- Chỉ hỏi khi có nguy cơ phá hủy hoặc xóa sạch vĩnh viễn toàn bộ cơ sở dữ liệu (database) quan trọng không thể phục hồi.
- Ngay cả khi cần hỏi, tuân thủ nghiêm ngặt giới hạn: **TỐI ĐA 2 LẦN**, sau đó tự động xử lý an toàn nhất.

---

## 4. BÁO CÁO KẾT QUẢ
- Làm xong toàn bộ mới thông báo kết quả ngắn gọn, súc tích kèm liên kết file clickable `[filename](file:///...)`.
