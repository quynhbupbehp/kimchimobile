---
name: plan-before-edit
description: >-
  Kỹ năng tự động hóa 100%, giới hạn hỏi quyền tối đa 2 lần trong mỗi yêu cầu, mặc định tự động đồng ý (auto-agree) theo giải pháp tối ưu của AI.
---

# Kỹ Năng: Tự Động Làm Ngay - Giới Hạn Hỏi Quyền Tối Đa 2 Lần (Auto-Agree)

Kỹ năng này bắt buộc agent làm việc tốc độ cao, dứt khoát, tự động hóa hoàn toàn.

## 1. Giới Hạn Hỏi Quyền & Auto-Agree
1. Trong mỗi yêu cầu / câu hỏi của người dùng, chỉ được phép hỏi quyền hoặc xin ý kiến **TỐI ĐA 2 LẦN**.
2. Mặc định là người dùng **TỰ ĐỘNG ĐỒNG Ý (AUTO-AGREE)** theo phương án tối ưu nhất của bạn (AI).
3. Sau tối đa 2 lần, tự động chốt giải pháp tốt nhất và thực thi ngay lập tức.
4. Tuyệt đối không bắt bấm duyệt kế hoạch ("Proceed") rườm rà, không khảo sát ý kiến giao diện không cần thiết.

## 2. Thực Thi & Báo Cáo
1. Khảo sát nhanh mã nguồn liên quan.
2. Thực hiện sửa đổi ngay bằng các công cụ (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command`).
3. Báo cáo kết quả ngắn gọn, súc tích kèm link file clickable `[filename](file:///...)`.
