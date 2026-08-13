---
tags: [project/viettridao, type/checklist]
date: 2026-06-25
aliases:
  [Checklist Ngày 2 - Chuẩn bị kỹ thuật, Day 2 Technical Preparation Checklist]
---

# 📋 Checklist Hoạt Động Ngày 2 (Chuẩn Bị Kỹ Thuật) - 25/06/2026

## TL;DR

Checklist chuẩn bị kỹ thuật và quy trình hoạt động cho ngày làm việc thứ 2 (Day 2) của dự án Viet Tri Dao. Các nhóm bắt đầu họp Daily Scrum, học Figma, làm bài tập SQL Server (đối với BA/Tester) và họp thống nhất công nghệ, IDE cùng file Coding Convention (đối với Dev).

---

## 📅 Quy Trình Bắt Buộc Đầu Buổi Sáng

- [x] **Họp Daily Scrum (Đầu giờ sáng):**
  - [x] Họp nhanh 10-15 phút để báo cáo tiến độ hôm qua, phân công việc hôm nay và nêu blockers.
  - [x] Phân công 01 thành viên viết biên bản họp (Meeting Minutes) bằng **tiếng Anh 100%**.
  - [x] Upload biên bản họp lên thư mục Google Drive chung của nhóm.
- [ ] **Quản lý Task trên GitHub & WBS:**
  - [ ] Cập nhật trạng thái các task của ngày hôm qua trên GitHub Kanban.
  - [ ] Mỗi thành viên tự làm và cập nhật file WBS cá nhân (`MockProject_WorkBreakDown_TenThanhVien.xlsx`). Điền cột `Task`, `Deadline`, và `Estimated Effort` cho các công việc trong ngày.
  - [ ] Backup toàn bộ sản phẩm của ngày 1 (nếu có) lên thư mục Google Drive cá nhân của mình ở chế độ Public.

---

## 🛠️ Nhiệm Vụ Chuyên Môn Trong Ngày

### 1. Tất cả các vai trò (DEV, TESTER, BA) - Tự học thiết kế

- [x] **Học kỹ năng vẽ FIGMA:**
  - [x] Chủ động tìm kiếm video hướng dẫn vẽ UI/UX trên Youtube.
  - [x] Thực hành các thao tác cơ bản: tạo frame, vẽ các element (button, input, card), sử dụng auto-layout và component.

### 2. Nhóm TESTER + BA - Ôn tập truy vấn SQL

- [x] **Thống nhất phiên bản SQL Server:**
  - [x] Cả nhóm (bao gồm DEV, TESTER, BA) thảo luận và thống nhất cài đặt cùng 01 phiên bản SQL Server để đồng bộ code sau này (Khuyên dùng bản **2019** để tối ưu dung lượng và hiệu năng).
- [ ] **Thực hành truy vấn SQL:**
  - [ ] Nghiên cứu tệp cơ sở dữ liệu mẫu `[SQLCoBan_DB_NghiepVu_1.xlsx]`.
  - [ ] Làm bài tập thực hành truy vấn trực tiếp trên SQL Server theo tài liệu `[SQLCoBan_ThucHanhSQL_DB1_PhanCoBan.doc]`.
  - [ ] Hoàn thành tối thiểu đến hết **câu 17** (bỏ qua câu 16 vì quá khó).

### 3. Nhóm DEV (Không phải AI) - Thảo luận & Thống nhất công nghệ

Họp nhóm DEV để thảo luận, thống nhất các tiêu chí kỹ thuật và lập **tài liệu Coding Convention** (`[Coding_Convention.xlsx]` hoặc file Word tương tự) bao gồm các nội dung sau:

- [x] **Lựa chọn Framework & Thư viện:**
  - [x] Thống nhất framework sử dụng (phải chọn công nghệ mà đa số thành viên trong nhóm làm được để tránh dự án phụ thuộc vào một cá nhân).
  - [x] Xác định rõ phiên bản (version) cụ thể của framework và thư viện chính.
- [x] **Quy ước đặt tên & Cấu trúc mã nguồn:**
  - [x] Quy ước cách đặt tên dự án (Project naming).
  - [x] Quy ước cấu trúc package (thư mục) trong mã nguồn.
  - [x] Quy ước đặt tên Class, Biến (Variable) và Method (CamelCase, PascalCase, snake_case...).
- [x] **Quy ước Comment & Hằng số (Constants):**
  - [x] Thống nhất quy tắc viết comment cho từng dòng (line), khối code (block) và hàm (method) bằng **tiếng Anh 100%**.
  - [x] Quy ước sử dụng các class Common để quản lý tập trung hằng số dùng chung (đường dẫn DB, tài khoản kết nối...).
- [x] **Môi trường lập trình (IDE):**
  - [x] Thống nhất IDE sử dụng (như VS Code, Visual Studio, IntelliJ...) và phiên bản cụ thể.
  - [x] Thống nhất các extension bổ trợ cần cài đặt chung.

### 4. Nhóm DEV (AI) - Ôn tập lập trình AI cơ bản

- [ ] **Hệ thống hóa kiến thức:**
  - [ ] Ôn tập các khái niệm cốt lõi về Machine Learning, Deep Learning, và lập trình Python cơ bản.
  - [ ] Sẵn sàng cho buổi phỏng vấn thử (Mock Interview) về kiến thức AI cơ bản do Mentor phụ trách trong ngày hôm nay.

---

## 🕒 Quy Trình Cuối Ngày

- [ ] **Kiểm tra tiến độ (Nhóm trưởng chủ trì):**
  - [ ] Review lại toàn bộ đầu việc của các thành viên. Nhắc nhở những bạn chưa hoàn thành.
- [ ] **Cập nhật trạng thái GitHub & WBS:**
  - [ ] Chuyển các task hoàn thành sang cột **Done** trên GitHub và đóng (Close) issue tương ứng.
  - [ ] Thực hiện quy trình 3 bước khi hoàn thành task (Báo Zalo -> Up sản phẩm lên Drive/GitHub -> Kéo task sang Done).
  - [ ] Cập nhật cột `Actual Effort (hour)` trong file WBS cá nhân.
- [ ] **Xử lý sự cố trễ hạn:**
  - [ ] Thành viên nào không kịp tiến độ phải gửi email báo cáo lý do cụ thể cho nhóm trưởng trước hạn chót ít nhất 1/4 thời lượng task.

---

## 🔗 Related Notes

- [[000_VietTriDao_MOC]] - Bản đồ dự án thực tập.
- [[Day1_Checklist]] - Checklist và kết quả hoạt động ngày 1.
- [[WBS_Best_Practices]] - SOP hướng dẫn phân rã và điền WBS cá nhân chuẩn chỉ.
- [[Agile_Management_via_GitHub]] - Quy trình kéo thả thẻ Kanban và đánh giá tiến độ task.
