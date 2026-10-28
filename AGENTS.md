# Quy Tắc: Cấp Quyền Duy Nhất 1 Lần Cho Mỗi Dự Án & Hỏi Khi Vướng Mắc

Quy tắc này bắt buộc áp dụng cho mọi yêu cầu chỉnh sửa, bổ sung, tái cấu trúc hoặc thực thi lệnh trong dự án.

---

## 1. NGUYÊN TẮC CỐT LÕI: HỎI QUYỀN DUY NHẤT 1 LẦN (ONCE-PER-PROJECT PERMISSION)

Mỗi dự án chỉ được hỏi/xin quyền người dùng **DUY NHẤT 1 LẦN**:

### A. Lần đầu tiên trong dự án:
- Nếu dự án mới bắt đầu và chưa từng được cấp quyền, agent có thể xin xác nhận quyền thực thi/chỉnh sửa mã nguồn cho dự án này (hoặc phê duyệt kế hoạch lần đầu tiên).
- Ngay khi người dùng đồng ý (hoặc đã xác nhận từ yêu cầu đầu tiên), dự án này được xem là **ĐÃ ĐƯỢC CẤP TOÀN QUYỀN (AUTHORIZED)**.

### B. Tất cả các tác vụ tiếp theo (Sau khi đã cấp quyền):
- **TỰ ĐỘNG THỰC HIỆN NGAY (100% AUTO-APPROVE)**:
  - Cho dù là tác vụ nhỏ (sửa CSS, giao diện, text, icon, fix bug) hay tác vụ lớn (thêm tính năng mới, tái cấu trúc nhiều file, thay đổi schema, logic tính toán):
  - Agent **KHÔNG ĐƯỢC HỎI LẠI QUYỀN**, không dừng lại chờ người dùng bấm duyệt, không tạo bộ đếm hẹn giờ gây phiền toái.
  - Tự động khảo sát mã nguồn, chọn phương án tối ưu nhất và gọi ngay các công cụ chỉnh sửa (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
  - Hoàn thành xong thì báo cáo kết quả chi tiết, rõ ràng kèm liên kết file clickable dạng `[filename](file:///...)`.

---

## 2. TRƯỜNG HỢP DUY NHẤT CẦN DỪNG LẠI HỎI (CLARIFY IMMEDIATELY)

Agent chỉ được phép dừng lại đặt câu hỏi khi:
1. **Yêu cầu mơ hồ hoặc chưa rõ ràng**: Thiếu dữ kiện, có nhiều cách hiểu hoặc nhiều phương án thiết kế khác nhau cần người dùng chọn lựa.
   - Bắt buộc hỏi ngay bằng công cụ `ask_question` với các phương án trắc nghiệm rõ ràng, có gợi ý `(Recommended)`.
   - Tuyệt đối không tự ý đoán mò khi yêu cầu chưa rõ.
2. **Gặp sự cố / Trở ngại nghiêm trọng (Blocker)**: Lỗi môi trường, xung đột code không thể tự giải quyết.

---

## Quy Trình Chuẩn (Standard Workflow):
```text
[Yêu cầu từ người dùng]
       │
       ▼
[Khảo sát mã nguồn] ──(Yêu cầu mơ hồ/chưa rõ?)──► [HỎI NGAY (ask_question)]
       │
       ▼
[Kiểm tra quyền dự án]
       ├────────────────────────────────────────┐
       ▼ (Chưa từng cấp quyền lần nào)          ▼ (Đã cấp quyền trước đó)
[Xin xác nhận quyền lần đầu duy nhất]    [TỰ ĐỘNG THỰC HIỆN NGAY]
       │                                        │
       ▼ (Người dùng duyệt)                     │ (Gọi tool sửa code trực tiếp)
[Trạng thái: ĐÃ CẤP QUYỀN]                      │
       │                                        │
       ▼                                        ▼
[Tiến hành sửa code & Báo cáo kết quả hoàn thiện ─┘]
```
