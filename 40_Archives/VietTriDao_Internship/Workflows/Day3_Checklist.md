---
tags: [project/viettridao, type/checklist]
date: 2026-06-26
aliases:
  [
    Checklist Ngày 3 - Thiết kế giao diện và Nghiệp vụ,
    Day 3 UI Design and Business Analysis Checklist,
  ]
---

# 📋 Checklist Hoạt Động Ngày 3 (Thiết Kế & Nghiệp Vụ) - 26/06/2026

## TL;DR

Checklist ngày làm việc thứ 3 (Day 3) tập trung vào việc chọn mẫu giao diện và phát triển màn hình đăng nhập thử nghiệm (đối với Dev Fullstack/Frontend), thống nhất cấu trúc API và code thử chức năng CRUD (đối với Dev Backend), viết thử testcase mẫu (đối với Tester), và nghiên cứu nghiệp vụ chi tiết chuẩn bị slide trình bày (đối với BA). Đồng thời tự trả lời các câu hỏi ôn tập kiến thức chuyên môn.

---

## 📅 Quy Trình Bắt Buộc Đầu Buổi Sáng

- [ ] **Họp Daily Scrum (Đầu giờ sáng):**
  - [ ] Họp nhanh 10-15 phút để báo cáo tiến độ hôm qua, phân công việc hôm nay và nêu blockers.
  - [ ] Phân công 01 thành viên viết biên bản họp (Meeting Minutes) bằng **tiếng Anh 100%**.
  - [ ] Upload biên bản họp lên thư mục Google Drive chung của nhóm.
- [ ] **Quản lý Task trên GitHub & WBS:**
  - [ ] Cập nhật trạng thái các task của ngày hôm qua trên GitHub Kanban.
  - [ ] Mỗi thành viên (bao gồm cả nhóm trưởng) tự làm và cập nhật file WBS cá nhân (`MockProject_WorkBreakDown_TenThanhVien.xlsx`).
  - [ ] Sao chép/Backup toàn bộ sản phẩm đã làm được tính đến hết ngày hôm trước lên thư mục Google Drive cá nhân để mentor review.

---

## 🛠️ Nhiệm Vụ Chuyên Môn Trong Ngày

### 1. Nhóm DEV (Fullstack hoặc Frontend)

- [ ] **Chọn Template Giao diện:**
  - [ ] Thống nhất chọn 01 giao diện mẫu phù hợp với nghiệp vụ "QUẢN LÝ VIỆN DƯỠNG LÃO TẠI MỸ" (Ví dụ: tham khảo các mẫu tại [sapo.vn](https://themes.sapo.vn/website-noi-bat)).
  - [ ] Đảm bảo mỗi nhóm chọn 1 giao diện mẫu khác nhau (không trùng lặp giữa các nhóm).
  - [ ] Thống nhất cả nhóm sẽ bám chặt theo giao diện này từ nay về sau để coding và testing.
- [ ] **Thực hành code màn hình Login:**
  - [ ] Tất cả DEV trong nhóm đều thực hiện code thử màn hình Login bất kỳ dựa trên framework đã chọn ở Day 2 và giao diện mẫu đã chọn ở trên.
  - [ ] Hoàn thành và chạy thử ngay trong ngày hôm nay.

### 2. Nhóm DEV (Chỉ làm Backend)

- [ ] **Định nghĩa API Response Template:**
  - [ ] Cả nhóm ngồi lại thảo luận, định nghĩa và thống nhất cấu trúc chuẩn của API trả về (mã HTTP status, format JSON phản hồi, cấu hình JSON gửi lên).
- [ ] **Thử nghiệm mã nguồn CRUD mẫu:**
  - [ ] Thực hiện code thử các phương thức cơ bản (POST, GET...) cho một tính năng CRUD mẫu bất kỳ.
  - [ ] Mục tiêu: Đảm bảo toàn bộ thành viên trong nhóm hiểu rõ và thống nhất cấu trúc framework đã chọn ở Day 2.

### 3. Nhóm DEV (AI)

- [ ] **Tự học và củng cố kiến thức:**
  - [ ] Tập trung tự học kỹ năng phân tích dữ liệu (Data Analysis).
  - [ ] Ôn tập lại các mảng kiến thức AI còn chưa vững.

### 4. Nhóm TESTER

- [ ] **Nghiên cứu & Viết testcase mẫu:**
  - [ ] Nghiên cứu kỹ mẫu file kiểm thử do mentor cung cấp: `[MockProject_Test Case_Sample.xlsx]`.
  - [ ] Thực hiện viết thử các testcase đầu tiên theo đúng cấu trúc của template mẫu (bắt buộc dùng đúng template này, không được chế biến).

### 5. Nhóm BA

- [ ] **Nghiên cứu Nghiệp vụ:**
  - [ ] Đọc và tìm hiểu tài liệu mô tả nghiệp vụ chi tiết trong file `[Quan ly vien duong lao_EN.rar]`.
- [ ] **Quản lý Q&A Nghiệp vụ:**
  - [ ] Nếu có câu hỏi hoặc điểm chưa rõ, ghi nhận vào file Q&A chung của toàn dự án (lưu ý: kiểm tra tránh trùng lặp câu hỏi đã có).
  - [ ] Khi có câu hỏi mới, BA hoặc TL phải lập tức thông báo cho Mentor để được giải đáp sớm nhất (không ngồi đợi thụ động).
- [ ] **Chuẩn bị Slide trình bày (Day 4):**
  - [ ] Thảo luận nhóm, chuẩn bị slide, vẽ hình tóm tắt nghiệp vụ, hoặc các sơ đồ/biểu đồ liên quan để chuẩn bị trình bày (knowledge transfer) nghiệp vụ cho DEV và Tester vào ngày mai (Day 4).

---

## ✍️ Câu Hỏi Tự Ôn Tập & Rút Kinh Nghiệm (DAY 2)

_Mỗi thành viên tự trả lời các câu hỏi sau để chuẩn bị cho các buổi phỏng vấn thử/thật:_

1. **Vấn đáp SQL:** Trả lời các câu hỏi trong file `[TraLoiVanDap2_SQL.doc]` mentor gửi kèm.
2. **Figma:** Mục đích sử dụng và cách sử dụng tool Figma là gì?
3. **Role & Tool:** Trong dự án, những vai trò nào cần phải nắm được SQL và Figma?
4. **Framework:** Framework là gì? Cấu trúc của một framework thông thường gồm những phần nào?
5. **Role & Code:** Ai là người chịu trách nhiệm tạo và thiết lập framework ban đầu trong dự án?
6. **Technical Leader:** Vai trò và các công việc cụ thể của một Technical Leader trong dự án là gì?

_Ghi chú: Nếu có câu hỏi nào chưa trả lời được, note lại để hỏi Mentor trong buổi họp toàn thể tiếp theo._

---

## 🕒 Quy Trình Cuối Ngày

- [ ] **Nhóm trưởng kiểm tra tiến độ:**
  - [ ] Review kết quả công việc cuối ngày của các thành viên. Nhắc nhở và đôn đốc các bạn chưa hoàn thành.
- [ ] **Cập nhật trạng thái GitHub & WBS:**
  - [ ] Cập nhật trạng thái các task tương ứng trên GitHub Kanban bảng dự án.
  - [ ] Điền thời gian thực tế hoàn thành (`Actual Effort`) vào file WBS cá nhân.
- [ ] **Báo cáo trễ hạn:**
  - [ ] Thành viên nào không hoàn thành kịp tiến độ phải chủ động báo cáo sớm cho nhóm trưởng theo đúng quy định.

---

## 🔗 Related Notes

- [[000_VietTriDao_MOC]] - Bản đồ dự án thực tập.
- [[Day2_Checklist]] - Checklist và kết quả hoạt động ngày 2.
- [[Coding_Standards]] - Hướng dẫn tiêu chuẩn lập trình và quy tắc đặt tên Git Branch.
- [[Tech_Stack_Decisions]] - Quyết định công nghệ chính thức của dự án.
