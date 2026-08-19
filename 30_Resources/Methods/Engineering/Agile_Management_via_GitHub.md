---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases:
  [
    Quản lý dự án Agile bằng GitHub,
    Agile Management via GitHub,
    GitHub Project Board SOP,
  ]
date: 2026-06-24
description: "Hướng dẫn cấu hình và quy trình vận hành Kanban Board, Sprints bằng GitHub Projects & Issues."
---

# Quản Lý Dự Án Agile/Scrum Bằng GitHub Projects

## TL;DR

Hướng dẫn cấu hình và vận hành quy trình quản lý tiến độ, quản lý công việc (tasks) và theo dõi hiệu suất của thành viên bằng GitHub Projects và Issues thay thế cho hệ thống JIRA đắt đỏ.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Các dự án quy mô nhỏ, trung bình hoặc các đội nhóm muốn tích hợp trực tiếp quản lý task (Kanban) với kho lưu trữ mã nguồn (GitHub Repository).
  - Dự án làm theo mô hình Agile/Scrum nhưng không có ngân sách sử dụng các công cụ đắt đỏ như JIRA.
- **Điều kiện tiên quyết (Prerequisites):**
  - Có tài khoản GitHub và một Repository đã được khởi tạo cho dự án.
  - Phân chia rõ ràng vai trò Nhóm trưởng (Team Leader/Scrum Master) và các thành viên (Developers/Testers).

---

## Step-by-Step Guideline

### 1. Thiết Lập Bảng Kanban

- Tạo một Project mới (chọn mẫu Board) liên kết trực tiếp với Repository của dự án.
- Thiết lập 3 cột (Columns) cơ bản để quản lý dòng chảy công việc (Workflow):
  - **To do:** Chứa các task đang chờ thực hiện.
  - **In Progress:** Chứa các task đang được xử lý tích cực.
  - **Done:** Chứa các task đã hoàn thành và nghiệm thu.

### 2. Định Nghĩa Sprint

- Trong mô hình Scrum, dự án được chia làm nhiều chu kỳ ngắn bằng nhau gọi là **Sprint** (thông thường từ 1 đến 4 tuần).
- Trên GitHub, sử dụng tính năng **Milestones** để đại diện cho Sprint:
  - Tạo Milestone mới với tên dạng `Sprint1`, `Sprint2`...
  - Thiết lập ngày đến hạn (Due Date) chính xác tương ứng với deadline của Sprint đó.

### 3. Tạo và Phân Phối Task

- Mỗi công việc kỹ thuật hoặc nghiệp vụ (sau khi đã được làm Work Breakdown Structure - WBS) phải được cụ thể hóa thành 01 **Issue** trên GitHub:
  - **Tiêu đề:** Ngắn gọn, mô tả rõ hành động cần làm.
  - **Mô tả (Description):** Mô tả chi tiết yêu cầu, bối cảnh và tiêu chí nghiệm thu (Acceptance Criteria).
  - **Assignees:** Giao trực tiếp cho thành viên đảm nhận task.
  - **Milestone:** Gán vào đúng Sprint tương ứng (ví dụ: `Sprint1`).
  - **Labels:** Thêm nhãn `Task` ngay khi tạo mới để phân biệt với bug hoặc tài liệu.

### 4. Vận Hành Hàng Ngày

- **Quy tắc di chuyển trạng thái:**
  - Nhóm trưởng có trách nhiệm tạo task và đặt ở cột **To do**.
  - Khi bắt đầu làm việc, thành viên thực hiện kéo task sang cột **In Progress**.
  - Sau khi hoàn thành và bàn giao sản phẩm (mã nguồn lên Git, tài liệu lên Drive), thành viên kéo task sang cột **Done** và đóng (Close) issue trên GitHub.

### 5. Đánh Giá Hiệu Suất Tiến Độ

- Sau khi task được đóng và di chuyển sang cột **Done**, Nhóm trưởng tiến hành audit chất lượng và thời gian thực hiện để gắn các nhãn (Labels) đánh giá tiến độ sau:
  - `On-time`: Hoàn thành đúng hạn so với deadline ước lượng.
  - `Delayed`: Bị trễ hạn so với deadline ban đầu.
  - `Over-Progress`: Hoàn thành xuất sắc trước thời hạn đề ra.
- _Lưu ý quan trọng:_ Chỉ gán nhãn đánh giá tiến độ sau khi task đã hoàn tất hoàn toàn và nằm ở cột **Done**.

---

## Verification / Testing

- [ ] Dự án GitHub Projects được liên kết đúng với Repository.
- [ ] Bảng Kanban có đủ 3 cột: To do, In Progress, Done.
- [ ] Milestone (Sprint) được thiết lập ngày bắt đầu và kết thúc rõ ràng.
- [ ] Mọi Issue/Task đều có ít nhất 01 Assignee, gán Milestone và nhãn `Task`.
- [ ] Toàn bộ các issue đã đóng (closed) đều được đánh giá hiệu suất bằng nhãn `On-time`, `Delayed`, hoặc `Over-Progress`.

---

## Related Notes

- [[Agile_Scrum]]
- [[Standard_Project_Timeline_SOP]]
- [[STAR_Method_Tech]]

---

## Sources / References

- [GitHub Docs - About Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
- [GitHub Docs - About Milestones](https://docs.github.com/en/issues/tracking-your-work-with-issues/about-milestones)
