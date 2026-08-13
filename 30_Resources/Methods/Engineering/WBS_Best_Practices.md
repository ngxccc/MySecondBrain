---
tags: [type/method, topic/project-management]
date: 2026-06-24
aliases: [Phương pháp phân rã công việc WBS, WBS Best Practices]
description: "Phương pháp phân rã công việc WBS chuẩn PMBOK (PMI) và cách phân rã task cá nhân."
---

# ️ Phương Pháp Phân Rã Công Việc WBS

## TL;DR

Tài liệu hướng dẫn chi tiết phương pháp phân rã công việc WBS theo tiêu chuẩn quản lý dự án quốc tế PMBOK (PMI). Cung cấp các quy tắc vàng như Quy tắc 100%, tính hướng sản phẩm (Deliverable-oriented), so sánh thực tế Đúng vs Sai trong phát triển phần mềm và cách chuyển đổi từ WBS dự án sang Task List cá nhân.

---

## Context: When to use?

Phương pháp WBS được sử dụng ngay tại thời điểm khởi động dự án (Day 1 - Kick-off) và trước mỗi đợt lập kế hoạch Sprint (Sprint Planning). Nó giúp bóc tách và định nghĩa rõ ràng phạm vi công việc bàn giao, làm cơ sở để phân chia trách nhiệm và ước lượng thời gian chính xác cho từng thành viên trong nhóm.

## Định Nghĩa & Nguyên Tắc Cốt Lõi

Theo tổ chức PMI (Project Management Institute), **WBS** là sự phân rã phân cấp hướng sản phẩm bàn giao (Deliverable-oriented) đối với toàn bộ phạm vi công việc mà dự án phải thực hiện.

Để xây dựng một WBS chuẩn chỉnh, cần tuân thủ nghiêm ngặt **3 nguyên tắc vàng** sau:

### A. Quy Tắc 100%

- **Nội dung:** Tổng số công việc ở các nhánh con ở mọi cấp độ phân rã phải bằng chính xác 100% công việc của nhánh cha.
- **Ý nghĩa:** Đảm bảo không bỏ sót bất kỳ phần việc nào của dự án (không thiếu), đồng thời không đưa vào bất kỳ công việc nào nằm ngoài phạm vi được duyệt (không thừa). Nếu một hạng mục không xuất hiện trong WBS, nó không thuộc phạm vi dự án.

### B. Hướng Kết Quả Bàn Giao

- **Nội dung:** WBS tập trung vào **"Cái gì" (Nouns - Danh từ)** được tạo ra sau khi hoàn thành, chứ không phải **"Làm thế nào" (Verbs - Động từ)** để tạo ra nó.
- **Ý nghĩa:** Giúp kiểm soát phạm vi (Scope) khách quan và dễ dàng nghiệm thu sản phẩm bàn giao (Deliverables) thay vì theo dõi hoạt động vụn vặt.

### C. Tính Loại Trừ Lẫn Nhau

- **Nội dung:** Các phần việc ở cùng một cấp phân rã không được trùng lặp phạm vi với nhau.
- **Ý nghĩa:** Tránh lãng phí tài nguyên làm việc chồng chéo, mập mờ trách nhiệm và sai sót khi tính toán chi phí hoặc ước lượng thời gian.

---

## 2. Phân Biệt WBS Dự Án vs WBS Cá Nhân (Activity/Task List)

Trong môi trường phát triển phần mềm Agile/Scrum:

1. **WBS Cấp Dự Án (Project WBS):** Do Project Manager lập, hướng kết quả đầu ra (dùng danh từ) để quản lý tiến độ tổng thể. Các phần tử cuối cùng trong WBS này được gọi là **Work Packages (Gói công việc)**.
2. **WBS Cá Nhân / Task List (Bảng Excel cá nhân):** Do lập trình viên tự lập để chia nhỏ các Work Packages thành các **Activities/Tasks** (dùng động từ hành động) có thời lượng ngắn (2-4 giờ) phục vụ công việc hàng ngày.

---

## ️ 3. So Sánh Ví Dụ Đúng vs Sai Trong Thực Tế

### A. Cấp độ 1: WBS Dự Án

- ❌ **SAI (Phân rã theo giai đoạn/hoạt động hoặc vai trò):**
  - 1.0 Dự án Web E-commerce
    - 1.1 Khảo sát yêu cầu (BA làm)
    - 1.2 Thiết kế UI/UX (Designer làm)
    - 1.3 Lập trình (Dev làm)
    - 1.4 Kiểm thử (Tester làm)
  - _Tại sao sai:_ Đây là cách phân rã theo quy trình thác nước (Waterfall) hoặc phòng ban. Nó vi phạm nguyên tắc hướng kết quả đầu ra và rất khó nghiệm thu khi làm Agile.

- ✅ **ĐÚNG (Phân rã theo cấu phần sản phẩm - Deliverable-oriented):**
  - 1.0 Hệ thống Web E-commerce
    - 1.1 Cổng thanh toán (Payment Gateway)
      - 1.1.1 API Tích hợp Stripe
      - 1.1.2 Tài liệu đặc tả tích hợp
      - 1.1.3 Bộ Testcase thanh toán
    - 1.2 Giỏ hàng (Shopping Cart)
      - 1.2.1 Giao diện Giỏ hàng (UI Form)
      - 1.2.2 Cơ sở dữ liệu Giỏ hàng tạm thời (Database Redis)
    - 1.3 Quản lý dự án (Project Management)
      - 1.3.1 Biên bản họp (Meeting Minutes)
      - 1.3.2 Kế hoạch dự án (Project Plan)

---

### B. Cấp độ 2: WBS Cá Nhân / Task List

- ❌ **SAI (Đặt tên mơ hồ, độ mịn quá to):**
  - Task: _"Làm database"_ (Deadline: 3 ngày, Estimated: 24h)
  - Task: _"Viết code API"_ (Deadline: 5 ngày, Estimated: 40h)
  - _Tại sao sai:_ Tên task quá chung chung, thời lượng quá dài (> 8h), dễ gây rủi ro lập trình viên bị nghẽn (blocked) nhưng nhóm trưởng không nắm được tiến độ hàng ngày.

- ✅ **ĐÚNG (Động từ hành động, thời lượng 2-4h):**
  - Thay vì _"Làm database"_ (24h), hãy phân rã thành:
    - Task 1: _"Thiết kế sơ đồ quan hệ ERD cho bảng users và orders"_ (Estimated: 3.0h)
    - Task 2: _"Viết file SQL script khởi tạo tables và foreign keys"_ (Estimated: 2.0h)
    - Task 3: _"Tạo dữ liệu mẫu (Mock data) 50 dòng phục vụ test"_ (Estimated: 2.0h)

---

## Step-by-Step Guideline

1. **Bước 1: Xác định Gói công việc (Work Package) được giao:**
   - Xem kỹ các User Story/Issue được giao trên GitHub Project (ví dụ: _"Module Login"_).
2. **Bước 2: Phân rã thành các hành động kỹ thuật (Tasks):**
   - Bẻ nhỏ công việc thành các hành động từ 2-4 tiếng, bắt đầu bằng động từ hành động.
3. **Bước 3: Ước lượng Effort và thiết lập Deadline:**
   - Ước lượng số giờ thực hiện (`Estimated Effort`). Nếu task nào > 8h, bắt buộc quay lại Bước 2 chia nhỏ tiếp.
4. **Bước 4: Cập nhật thực tế hàng ngày (Actual Effort):**
   - Cuối ngày điền thời gian thực tế đã làm vào cột `Actual Effort`. So sánh sự chênh lệch để cải thiện khả năng ước lượng.

---

## Related Notes

- [[000_Methods_MOC]]
- [[Agile_Scrum]]
- [[Agile_Management_via_GitHub]]
- [[Prep_Guide_Day1]]
- [[Day1_Checklist]]
