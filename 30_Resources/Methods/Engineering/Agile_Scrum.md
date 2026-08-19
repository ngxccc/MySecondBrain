---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases: [Quy trình Agile Scrum, Agile Scrum Process]
date: 2026-06-23
description: "Quy trình quản lý và phát triển phần mềm linh hoạt thông qua các chu kỳ ngắn (Sprints) và cải tiến quy trình liên tục."
---

# Quy Trình Agile & Scrum Trong Dự Án

## TL;DR

Quy trình quản lý dự án linh hoạt (Agile) áp dụng khung làm việc Scrum nhằm tối ưu hóa năng suất phát triển phần mềm thông qua các chu kỳ phát triển ngắn (Sprints) và cải tiến liên tục.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Các dự án phát triển phần mềm có yêu cầu thay đổi liên tục, không thể xác định 100% nghiệp vụ từ đầu.
  - Các dự án yêu cầu bàn giao sản phẩm chạy được (working software) định kỳ để lấy phản hồi từ khách hàng hoặc mentor.
  - Các nhóm làm việc tự quản (self-organizing teams) muốn tối ưu hóa tốc độ và quy trình giao tiếp.
- **Điều kiện tiên quyết (Prerequisites):**
  - Phân chia rõ ràng các vai trò trong Scrum Team: Product Owner (PO), Scrum Master (SM), và Developers.
  - Có danh sách các yêu cầu (Product Backlog) được viết dưới dạng **User Story**.

### Lịch Sử & Tiến Hóa

Agile (chính thức hóa năm 2001 qua Agile Manifesto) ra đời như một cuộc cách mạng nhằm giải quyết triệt để sự kém linh hoạt, chi phí thay đổi cao và tình trạng đóng băng yêu cầu của các mô hình truyền thống trước đó (như [[Waterfall]], [[V_Model]], [[Spiral_Model]]). Thay vì tập trung vào quy trình và tài liệu, Agile/Scrum tập trung vào con người, sự thích ứng và bàn giao giá trị liên tục qua từng chu kỳ ngắn. Xem chi tiết lược sử tiến hóa tại [[SDLC_Methodologies_Evolution]].

### 3 Trụ Cột Cốt Lõi Của Scrum

Scrum vận hành dựa trên chủ nghĩa thực nghiệm với 3 trụ cột cốt lõi:

1. **Tính Minh Bạch (Transparency):** Mọi thông tin (tiến độ, lỗi, yêu cầu thay đổi) phải được hiển thị rõ ràng cho tất cả các thành viên và mentor.
2. **Tính Thanh Tra (Inspection):** Định kỳ kiểm tra sản phẩm và quy trình làm việc (thông qua các cuộc họp Daily, Review, Retro) để phát hiện sớm các sai lệch.
3. **Tính Thích Ứng (Adaptation):** Sẵn sàng thay đổi quy trình làm việc hoặc sản phẩm ngay khi phát hiện sai lệch để giảm thiểu rủi ro (ví dụ: thích ứng khi có Change Requirement - CR ở Day 12).

### 5 Giá Trị Của Scrum

Scrum Team cần cam kết thực hiện 5 giá trị cốt lõi để xây dựng lòng tin và sự hiệu quả:

1. **Cam Kết (Commitment):** Mỗi thành viên cá nhân cam kết đạt được các mục tiêu của Scrum Team và hỗ trợ lẫn nhau.
2. **Tập Trung (Focus):** Tập trung tối đa vào công việc của Sprint để đạt tiến độ tốt nhất hướng tới các mục tiêu.
3. **Cởi Mở (Openness):** Cởi mở chia sẻ về tiến độ công việc cũng như các khó khăn, thách thức gặp phải.
4. **Tôn Trọng (Respect):** Tôn trọng khả năng độc lập, chuyên môn và ý kiến của nhau.
5. **Dũng Cảm (Courage):** Dũng cảm đối mặt với thử thách, làm điều đúng đắn và giải quyết các vấn đề khó khăn.

### 3 Hiện Vật & 3 Cam Kết

Mỗi hiện vật trong Scrum đi kèm với một cam kết nhằm tăng tính minh bạch và cung cấp mục tiêu để đo lường tiến độ:

1. **Product Backlog** (Cam kết: **Product Goal - Mục tiêu Sản phẩm**)
   - Mô tả trạng thái tương lai của sản phẩm, đóng vai trò là mục tiêu dài hạn của Scrum Team.
2. **Sprint Backlog** (Cam kết: **Sprint Goal - Mục tiêu Sprint**)
   - Mục tiêu duy nhất của Sprint hiện tại, mang lại sự tập trung và định hướng cho Developers.
3. **Increment - Phần tăng trưởng** (Cam kết: **Definition of Done - Định nghĩa Hoàn thành**)
   - Mô tả chính thức và rõ ràng về trạng thái của sản phẩm khi nó đáp ứng đầy đủ các tiêu chuẩn chất lượng bắt buộc.

> **Phân biệt DoD (Definition of Done) và AC (Acceptance Criteria):**
>
> - **Definition of Done (DoD):** Là bộ quy chuẩn chất lượng **chung** áp dụng cho _mọi_ User Story/chức năng (ví dụ: code sạch, đã qua review chéo, đã kiểm thử không lỗi, đã deploy thành công). Do cả team thống nhất và tuân thủ.
> - **Acceptance Criteria (AC):** Là tiêu chí nghiệm thu **riêng** cho _từng_ User Story cụ thể (ví dụ: với Story "Đăng nhập", AC là đăng nhập thành công qua Google, báo lỗi khi nhập sai định dạng email). Do PO định nghĩa.
>   _Một User Story chỉ được coi là hoàn thành (Done) khi nó thỏa mãn cả AC riêng của nó và DoD chung của team._

---

## Step-by-Step Guideline

### 1. Chuẩn Bị & Quản Lý Product Backlog

- **Người thực hiện:** Product Owner (PO).
- **Hành động:**
  - PO thu thập yêu cầu từ khách hàng và phân rã thành các **User Story** theo mẫu: _"Là [vai trò], tôi muốn [chức năng] để [lợi ích]."_
  - Sắp xếp thứ tự ưu tiên cho các User Story từ cao xuống thấp.

### 1.5. Cải Tiến Product Backlog

- **Thời điểm:** Diễn ra định kỳ trong suốt Sprint (thường là giữa Sprint hoặc trước Sprint Planning).
- **Hành động:**
  - Cả team cùng PO rà soát lại Product Backlog, làm rõ nghiệp vụ và chi tiết hóa các User Story sắp thực hiện ở Sprint tiếp theo.
  - Developers tiến hành ước lượng kích thước công việc (Story Point) cho các story để chuẩn bị tốt nhất cho buổi Sprint Planning.

### 2. Họp Kế Hoạch Sprint

- **Thời điểm:** Đầu mỗi Sprint (chu kỳ từ 1 đến 4 tuần, thông thường là 1 tuần cho dự án ngắn hạn).
- **Hành động:**
  1. Cả team họp cùng PO để chọn ra các User Story ưu tiên hàng đầu mà team cam kết sẽ hoàn thành trong Sprint này (đưa vào **Sprint Backlog**) và xác định **Sprint Goal**.
  2. Developers thực hiện phân rã các User Story được chọn thành các task kỹ thuật cụ thể (WBS - Work Breakdown Structure) với thời gian hoàn thành từ 2 - 4 tiếng mỗi task.

### 3. Thực Hiện Sprint & Họp Hàng Ngày

- **Thời điểm:** Hàng ngày trong suốt Sprint, thường họp nhanh tối đa 15 phút vào cùng một giờ cố định.
- **Hành động:**
  - _Lưu ý từ Scrum Guide 2020:_ Scrum Guide đã chính thức lược bỏ cấu trúc bắt buộc "3 câu hỏi" truyền thống nhằm tăng tính chủ động cho Developers. Mục tiêu chính là kiểm tra tiến độ hướng tới **Sprint Goal** và cập nhật **Sprint Backlog**.
  - Tuy nhiên, với các nhóm mới bắt đầu, cấu trúc 3 câu hỏi vẫn là công cụ đơn giản nhất để cập nhật:
    1. _Hôm qua tôi đã làm gì để giúp team đạt Sprint Goal?_
    2. _Hôm nay tôi sẽ làm gì để giúp team đạt Sprint Goal?_
    3. _Tôi có gặp khó khăn hay trở ngại gì không?_ (Blockers)
  - Scrum Master ghi nhận các khó khăn (blockers) để tìm phương án giải quyết sớm nhất, đảm bảo team không bị tắc nghẽn.

### 4. Họp Đánh Giá Sprint

- **Thời điểm:** Cuối Sprint.
- **Hành động:**
  1. Developers thực hiện **Demo** các tính năng đã hoàn thành và chạy được trực quan trước PO và khách hàng (hoặc Mentor).
  2. PO nghiệm thu sản phẩm dựa trên tiêu chí chấp nhận (Acceptance Criteria) riêng của từng User Story và Định nghĩa Hoàn thành (DoD) chung của team. Các User Story chưa hoàn thành sẽ được đẩy ngược lại Product Backlog để làm sau.

### 5. Họp Rút Kinh Nghiệm Sprint

- **Thời điểm:** Cuối Sprint, ngay sau Sprint Review.
- **Hành động:**
  - Cả team nhìn nhận lại quá trình làm việc của Sprint vừa qua để chỉ ra:
    - **What went well:** Cái gì làm tốt và cần phát huy?
    - **What didn't go well:** Cái gì làm chưa tốt và cần cải thiện?
    - **Action Items:** Các hành động cải tiến cụ thể cho Sprint tiếp theo.

---

## Verification / Testing

- [ ] Product Backlog có đầy đủ User Stories, Product Goal rõ ràng và được sắp xếp thứ tự ưu tiên.
- [ ] Hoạt động Backlog Refinement được thực hiện đều đặn trước mỗi đợt Planning.
- [ ] Sprint Backlog có Sprint Goal cụ thể, được thiết lập và phân chia task cụ thể trên bảng Kanban (GitHub Projects, Jira hoặc Trello).
- [ ] Có bộ Định nghĩa Hoàn thành (Definition of Done - DoD) chung được cả team thống nhất.
- [ ] Báo cáo Daily Standup được thực hiện đầy đủ hàng ngày hướng tới Sprint Goal.
- [ ] Tổ chức đầy đủ cuộc họp Sprint Review và Sprint Retrospective kèm biên bản họp (Meeting Minutes).

---

**Related Notes:**

- [[SDLC_Methodologies_Evolution]]
- [[Standard_Project_Timeline_SOP]]

## Sources / References

- [Scrum.org - The Scrum Guide (Official 2020 Edition)](https://scrumguides.org/scrum-guide.html)
- [Atlassian Agile Coach - Scrum Work Management](https://www.atlassian.com/agile/scrum)
