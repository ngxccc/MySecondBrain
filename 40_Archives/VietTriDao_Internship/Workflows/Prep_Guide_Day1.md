---
tags: [topic/learning, topic/productivity]
date: 2026-06-23
aliases: [Tài liệu chuẩn bị ngày 1, Day 1 Preparation Guide]
---

# 📝 Hướng Dẫn Chuẩn Bị Ngày 1 (Kick-off)

## TL;DR

Tài liệu nháp lưu giữ các mẫu biên bản họp tiếng Anh, quy trình Scrum, phương pháp phân rã công việc WBS và checklist chuẩn bị trước buổi kick-off.

---

## 📋 Checklist Chuẩn Bị Tối Nay

- [x] **Nghiên cứu quy trình Agile/Scrum:** Đọc kỹ các vai trò và cuộc họp cốt lõi.
- [x] **Nghiên cứu Tradeoffs & Tech Stack:** Chuẩn bị các lập luận lựa chọn công nghệ cho nhóm DEV.
- [ ] **Thực hành viết Meeting Minutes:** Nắm vững cấu trúc ghi chép bằng tiếng Anh.
- [ ] **Figma Quick-study:** Xem qua các video/tài liệu về Figma Auto Layout & Components.

---

## 🇬🇧 Mẫu Biên Bản Họp & Daily Scrum (English Templates)

### Mẫu 1: Meeting Minutes Template (Biên bản họp nhóm)

_Sử dụng mẫu này để viết tài liệu họp nhóm hàng ngày gửi cho Mentor._

```markdown
# MEETING MINUTES - [PROJECT NAME]

**Date & Time:** YYYY-MM-DD | 13:30 - 14:00
**Location:** Google Meet / Discord / Office
**Facilitator (Người dẫn dắt):** [Name]
**Secretary (Thư ký):** [Name]
**Attendees:** [Member 1], [Member 2], [Member 3], [Member 4]

## 1. Meeting Agenda (Nội dung họp)

- Kick-off and project introduction.
- Selecting the Team Leader.
- Workspace setup (GitHub, Google Drive).

## 2. Key Decisions (Quyết định chính)

- [Member A] was selected as the Team Leader.
- Agreed to use GitHub Projects for task management.
- Agreed to use ReactJS (FE) and ASP.NET Web API (BE) [Ví dụ].

## 3. Action Items (Phân công công việc)

| Task / User Story                      | Assigned To | Deadline   | Status |
| :------------------------------------- | :---------- | :--------- | :----- |
| Set up GitHub repository & Projects    | [Name]      | YYYY-MM-DD | Todo   |
| Prepare Figma mockup for Login screen  | [Name]      | YYYY-MM-DD | Todo   |
| Draw Entity Relationship Diagram (ERD) | [Name]      | YYYY-MM-DD | Todo   |

## 4. Next Meeting

- **Date & Time:** YYYY-MM-DD | 13:30
- **Agenda:** Discuss technology stack and draw Figma sketches.
```

### Mẫu 2: Daily Standup Template (Báo cáo hàng ngày)

_Gửi vào group chat trước 05:40 sáng hàng ngày._

```markdown
**DAILY STANDUP REPORT**

- **Full Name:** [Your Name]
- **Role:** [Dev / Tester / BA]
- **Date:** YYYY-MM-DD

1. What I did yesterday:
   - [Ví dụ: Designed the Database Schema for the Patient Profile module.]
2. What I will do today:
   - [Ví dụ: Write SQL scripts to initialize tables and relationships.]
3. Blockers (Khó khăn):
   - [Ví dụ: None / Waiting for API Document update from DEV team.]
```

---

## 🔄 Tóm Tắt Quy Trình Agile/Scrum

Quy trình phát triển phần mềm lặp đi lặp lại theo từng chu kỳ ngắn gọi là **Sprint** (dự án này thường chia thành các Sprint 1 tuần).

- **3 Vai Trò Chính:**
  1. **Product Owner (PO):** Người định nghĩa yêu cầu (User Story) và quyết định tính năng nào quan trọng nhất cần làm trước. (Mentor đóng vai này).
  2. **Scrum Master (SM):** Người quản lý quy trình, giải quyết khó khăn (blocker) cho team để làm việc trơn tru. (Mentor đóng vai này).
  3. **Development Team:** Gồm BA, Dev, Tester hợp tác để phát triển sản phẩm. (Nhóm của mày).
- **3 Cuộc Họp Cốt Lõi:**
  1. **Sprint Planning (Họp Kế Hoạch):** Diễn ra đầu Sprint. Nhóm chọn các User Story từ Backlog để cam kết hoàn thành trong Sprint này và phân chia task (WBS).
  2. **Daily Scrum (Họp Hàng Ngày):** Họp nhanh 15 phút cập nhật tiến độ (3 câu hỏi standup).
  3. **Sprint Review & Retro (Họp Đánh Giá & Rút Kinh Nghiệm):** Diễn ra cuối Sprint. Demo sản phẩm cho Mentor (Review) và họp rút kinh nghiệm xem cái gì làm tốt, cái gì chưa tốt để cải tiến (Retro).

---

## 🌿 Phân Rã Công Việc (Work Breakdown Structure - WBS)

_Xem thêm hướng dẫn chi tiết tại phương pháp: [[WBS_Best_Practices]]_

Khi nhận một **User Story** (Yêu cầu của khách hàng), không được code ngay mà phải phân rã thành các task kỹ thuật nhỏ:

- **Quy tắc:** Mỗi task chỉ nên kéo dài từ **2 đến 4 tiếng**. Nếu task ước lượng > 8 tiếng, bắt buộc phải chia nhỏ tiếp.
- **Ví dụ phân rã một User Story:**
  > _"Là một bệnh nhân, tôi muốn có thể đăng nhập vào hệ thống bằng Email và Mật khẩu để xem bệnh án."_
  - **Task 1 (BA):** Viết đặc tả chi tiết (Acceptance Criteria) cho Login (1.5h).
  - **Task 2 (UI/UX):** Vẽ wireframe và UI chi tiết cho màn hình Login trên Figma (2h).
  - **Task 3 (Database):** Thiết kế bảng `users` chứa `email`, `password_hash`, `role` (1.5h).
  - **Task 4 (Back-end):** Viết API `/api/auth/login` thực hiện xác thực và trả về JWT token (3h).
  - **Task 5 (Front-end):** Code giao diện Form Login bằng React, thực hiện gọi API và lưu Token vào LocalStorage (3h).
  - **Task 6 (Tester):** Viết Testcase và thực hiện kiểm thử thành công/thất bại (2h).

---

## ⚖️ So Sánh Công Nghệ & Tradeoffs (Đề Xuất Cho DEV)

_Mày nên thảo luận với nhóm để chọn một Tech Stack phổ biến, dễ làm, nhiều tài liệu để code cho nhanh trong 1 tháng._

### 1. Front-end Framework: ReactJS vs NextJS vs Vanilla HTML/JS

- **Vanilla HTML/CSS/JS:**
  - _Ưu điểm:_ Không cần cài đặt phức tạp, chạy trực tiếp trên trình duyệt, nhẹ.
  - _Nhược điểm:_ Khó tái sử dụng component (giao diện lặp lại), code dễ bị rối khi dự án lớn lên.
- **ReactJS (Khuyên dùng):**
  - _Ưu điểm:_ Component hóa cao, cộng đồng cực lớn, nhiều UI thư viện hỗ trợ (Ant Design, Tailwind CSS), dễ tuyển người làm.
  - _Nhược điểm:_ Cần setup môi trường (NodeJS, Vite), tốn thời gian cấu hình ban đầu.
- **NextJS:**
  - _Ưu điểm:_ Tối ưu hóa SEO tốt, có sẵn Routing.
  - _Nhược điểm:_ Quá nặng và phức tạp cho một dự án thực tập ngắn hạn 1 tháng.

### 2. Back-end API: Node.js (Express) vs ASP.NET Core vs Java Spring Boot

- **Node.js (Express/NestJS) (Khuyên dùng nếu nhóm mạnh JavaScript):**
  - _Ưu điểm:_ Viết bằng JavaScript/TypeScript (đồng bộ ngôn ngữ với FE), khởi tạo cực nhanh, tài liệu nhiều.
  - _Nhược điểm:_ Quản lý bất đồng bộ (Async/Await) cần cẩn thận để tránh lỗi.
- **ASP.NET Core (C#) (Khuyên dùng nếu học trường CNTT dạy Microsoft):**
  - _Ưu điểm:_ Hiệu năng cao, kiến trúc chuẩn MVC/Clean Architecture, thư viện Swagger tự động sinh API doc rất mạnh.
  - _Nhược điểm:_ Cần cài Visual Studio/Rider nặng, học tập dốc hơn Node.js một chút.
- **Java Spring Boot:**
  - _Ưu điểm:_ Rất phổ biến ở doanh nghiệp lớn, kiến trúc chặt chẽ.
  - _Nhược điểm:_ Boilerplate code quá nhiều, khởi tạo dự án mất thời gian cho dự án ngắn hạn.

### 3. Database: PostgreSQL vs MySQL vs MS SQL Server

- **PostgreSQL (Khuyên dùng):**
  - _Ưu điểm:_ Hệ quản trị CSDL quan hệ mạnh mẽ nhất, miễn phí, hỗ trợ tốt JSON/NoSQL nếu cần, bảo mật cao.
  - _Nhược điểm:_ Quản trị phức tạp hơn MySQL một chút.
- **MySQL:**
  - _Ưu điểm:_ Cực kỳ dễ dùng, phổ biến nhất, nhẹ, cài đặt nhanh.
  - _Nhược điểm:_ Thiếu một số tính năng nâng cao so với PostgreSQL.
- **MS SQL Server:**
  - _Ưu điểm:_ Tích hợp cực tốt với ASP.NET Core.
  - _Nhược điểm:_ Bản đầy đủ tốn phí, nặng, chạy trên macOS/Linux phức tạp hơn.
