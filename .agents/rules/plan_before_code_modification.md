# Quy Tắc: Tự Động Thực Hiện Ngay (100% Auto-Approve) & Hạn Chế Tối Đa Hỏi Quyền

Quy tắc này bắt buộc áp dụng cho mọi yêu cầu chỉnh sửa, bổ sung, tối ưu hoặc thực thi lệnh trong dự án.

---

## 1. NGUYÊN TẮC CỐT LÕI: TỰ ĐỘNG LÀM NGAY (AUTO-EXECUTE)

- **Tự động thực hiện 100% (Zero-Friction Execution)**:
  - Khi nhận yêu cầu từ người dùng (sửa giao diện, fix bug, thêm tính năng, refactor, tạo file mới, chạy lệnh build/deploy...):
  - Agent **KHÔNG ĐƯỢC HỎI XIN QUYỀN**, KHÔNG tạo kế hoạch bắt người dùng bấm duyệt ("Proceed"), KHÔNG tạo bộ đếm thời gian gây phiền toái.
  - Tự động khảo sát mã nguồn, chọn phương án kỹ thuật tối ưu nhất và gọi ngay các công cụ chỉnh sửa (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
  - **Cái gì không cần thiết: TỰ ĐỘNG XÁC NHẬN HẾT**.

---

## 2. TRƯỜNG HỢP DUY NHẤT ĐƯỢC PHÉP HỎI (CLARIFY ONLY WHEN CRITICAL)

Agent chỉ được dừng lại hỏi người dùng khi và chỉ khi:
1. **Yêu cầu thực sự mơ hồ hoặc thiếu dữ liệu cốt lõi**: Không thể suy đoán hợp lý được, có nhiều lựa chọn nghiệp vụ hoàn toàn khác nhau cần người dùng quyết định.
   - Bắt buộc dùng công cụ `ask_question` với các phương án trắc nghiệm ngắn gọn, có gợi ý `(Recommended)`.
2. **Nguy cơ mất mát dữ liệu không thể phục hồi**: Thao tác xóa vĩnh viễn bảng dữ liệu hoặc cơ sở dữ liệu quan trọng.

---

## 3. BÁO CÁO KẾT QUẢ
- Sau khi thực hiện xong, báo cáo kết quả ngắn gọn, súc tích kèm liên kết file clickable dạng `[filename](file:///...)`.
