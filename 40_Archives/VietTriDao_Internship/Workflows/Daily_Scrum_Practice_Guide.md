---
tags: [project/viettridao, type/guide]
date: 2026-06-24
aliases: [Hướng dẫn thực hành Daily Scrum, Daily Scrum Practice Guide]
---

# 🏃 Hướng Dẫn Thực Hành Daily Scrum Cho Thành Viên

## TL;DR

Tài liệu hướng dẫn chi tiết cách tự học, chuẩn bị và thực hiện cuộc họp Daily Scrum hàng ngày. Giúp các thành viên trong nhóm nắm vững kỹ năng báo cáo tiến độ bằng tiếng Anh, cách quản lý khó khăn (blockers), quy trình viết biên bản họp (Meeting Minutes) và cập nhật bảng Kanban.

---

## 🎯 Mục Tiêu Của Daily Scrum

Daily Scrum **không phải là buổi báo cáo thành tích** cho Nhóm trưởng hay PO. Mục tiêu cốt lõi của nó là để **Developers tự đồng bộ hóa công việc**, phát hiện sớm các rủi ro chậm tiến độ (blockers) và lên kế hoạch làm việc hiệu quả nhất trong 24 giờ tiếp theo nhằm đạt được **Sprint Goal**.

---

## 📋 Quy Trình Thực Hành 4 Bước Hàng Ngày

### Bước 1: Chuẩn Bị Báo Cáo Standup (Trước giờ họp - Sáng sớm)

Trước khi vào họp Google Meet, mỗi thành viên phải dành ra 5 phút để soạn sẵn nội dung báo cáo bằng tiếng Anh (Personal Standup Report) và gửi vào Zalo Group của nhóm. Điều này giúp bạn có sẵn "kịch bản" để nói khi vào họp, tránh ngập ngừng làm mất thời gian.

**Cấu trúc 3 câu hỏi bắt buộc:**

1. **What I did yesterday:** Hôm qua tôi đã hoàn thành những task nào? (Nêu rõ mã Task/Issue).
2. **What I will do today:** Hôm nay tôi sẽ tập trung làm những task nào?
3. **Blockers (Khó khăn):** Tôi có gặp trở ngại nào khiến công việc bị tắc nghẽn hay không?

_Mẫu soạn thảo bằng tiếng Anh:_

> **DAILY STANDUP REPORT**
>
> - **Full Name:** Nguyen Van A
> - **Role:** Dev
> - **Date:** 2026-06-24
>
> 1. What I did yesterday:
>    - Finished draw Figma screen Login (Issue #12).
> 2. What I will do today:
>    - Code API `/api/auth/login` (Issue #15).
> 3. Blockers:
>    - None / OR: Waiting for Database schema approval from Team Lead.

---

### Bước 2: Vận Hành Cuộc Họp Google Meet (Tối đa 15 phút)

- **Đúng giờ:** Cả nhóm truy cập link Google Meet đúng giờ quy định đầu buổi sáng.
- **Vai trò Thư ký:** Nhóm trưởng chỉ định 1 thành viên làm Thư ký cuộc họp hôm nay (luân phiên thay đổi mỗi ngày để ai cũng được luyện tập viết biên bản).
- **Trực quan hóa:** Nhóm trưởng hoặc một thành viên chia sẻ màn hình bảng **GitHub Project Board (Kanban)** của nhóm.
- **Trình bày:** Lần lượt từng thành viên phát biểu nhanh gọn dựa trên báo cáo đã soạn ở Bước 1.
  - Vừa nói vừa thực hiện kéo thả thẻ task tương ứng của mình trên bảng Kanban từ cột **To do** sang **In Progress** (khi bắt đầu làm) hoặc sang **Done** (khi đã hoàn thành).
  - _Thời gian tối đa:_ **1 - 2 phút mỗi người**. Không giải thích dông dài, đi thẳng vào vấn đề.

---

### Bước 3: Phát Hiện & Xử Lý Khó Khăn (Blockers)

- **Nêu rõ Blocker:** Nếu gặp khó khăn (lỗi code không tự sửa được sau 30 phút tự tìm hiểu, đợi code/tài liệu của thành viên khác, thiếu yêu cầu nghiệp vụ...), bạn **phải báo cáo ngay lập tức** trong phần Blocker của mình.
- **Quy tắc 15 phút:** Cấm thảo luận chi tiết cách sửa lỗi hoặc giải quyết blocker ngay trong cuộc họp Daily Scrum vì sẽ làm lố thời gian của cả nhóm.
- **Họp riêng (Post-Scrum):** Nhóm trưởng ghi nhận blocker, cho cuộc họp kết thúc đúng hạn. Sau đó, điều phối các thành viên liên quan (ví dụ: Dev gặp lỗi + Tech Lead + Tester) ở lại họp riêng 5-10 phút để giải quyết dứt điểm blocker đó.

---

### Bước 4: Viết và Nộp Biên Bản Họp (Thư ký thực hiện)

- Trong lúc cả nhóm họp, Thư ký ghi chép lại toàn bộ diễn biến vào file biên bản họp bằng **tiếng Anh 100%**.
- Sử dụng đúng mẫu tiêu chuẩn Meeting Minutes (Tham khảo mẫu tại [[Prep_Guide_Day1#Mẫu 1]]).
- Nộp file biên bản lên thư mục chung của nhóm trên Google Drive trước **10:00 AM** hàng ngày để mentor tiến hành audit.

---

## 🗣️ Một Số Mẫu Câu Tiếng Anh Tiêu Chuẩn Khi Họp

### 1. Báo cáo việc đã làm (Yesterday)

- _Yesterday, I finished..._ (Hôm qua tôi đã làm xong...)
- _I completed the database design for..._ (Tôi đã hoàn thành thiết kế database cho...)
- _I have resolved the bug on screen A._ (Tôi đã sửa xong bug trên màn hình A.)

### 2. Báo cáo việc sẽ làm (Today)

- _Today, I will focus on..._ (Hôm nay tôi sẽ tập trung vào...)
- _I plan to write unit tests for the login API._ (Tôi dự định viết unit test cho API login.)
- _I will start drawing Figma mockups for the home page._ (Tôi sẽ bắt đầu vẽ giao diện Figma cho trang chủ.)

### 3. Báo cáo khó khăn (Blockers)

- _I am facing an issue with..._ (Tôi đang gặp lỗi với...)
- _I am blocked because I'm waiting for the API response format from the Backend team._ (Tôi đang bị nghẽn vì phải đợi định dạng API từ nhóm Backend.)
- _I need help from [Name] to solve the Git merge conflict._ (Tôi cần sự giúp đỡ của [Tên] để giải quyết xung đột Git merge.)
- _I have no blockers._ (Tôi không gặp khó khăn gì.)

---

## Related Notes

- [[000_VietTriDao_MOC]]
- [[Prep_Guide_Day1]]
- [[Agile_Scrum]]
- [[Agile_Management_via_GitHub]]
