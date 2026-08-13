---
tags: [type/concept, topic/concepts, psychology-mental-models, status/permanent]
date: 2026-06-24
aliases: [Phương pháp Kanban, Kanban Methodology, Kanban Board Concept]
description: "Phương pháp và bảng Kanban quản lý dòng công việc trực quan theo mô hình Kéo (Pull)."
---

# Phương Pháp & Bảng Kanban Trong Quản Trị Dự Án

## TL;DR

Tài liệu phân tích cốt lõi về phương pháp Kanban—hệ thống quản lý dòng công việc (workflow) trực quan theo mô hình "Kéo" (Pull system) bắt nguồn từ Toyota. Giúp tối ưu hóa hiệu suất làm việc nhóm bằng cách trực quan hóa quy trình, giới hạn lượng việc đang làm (WIP Limit), giảm thời gian phản hồi (Cycle Time) và loại bỏ các điểm nghẽn (bottlenecks).

---

## Application Context & Maslow Alignment

- **Phân tầng Maslow phù hợp**: **Tầng 2 (Safety - Kiểm soát công việc, giảm quá tải & stress)** và **Tầng 4 (Esteem - Tối ưu hiệu suất & minh bạch hóa thành quả)**.
- **Điều kiện tiên quyết**: Áp dụng được ở mọi tầng lớp và giai đoạn làm việc. Giới hạn WIP (Work in Progress Limit) giúp giảm thiểu hiện tượng quá tải nhận thức và ngắt cơn sóng Amygdala Hijack do bối rối vì quá nhiều task dồn dập.
- **Đối tượng áp dụng**: Cá nhân tự quản lý công việc, Đội ngũ kỹ sư phần mềm, Quản lý dự án, Tổ chức vận hành tinh gọn.

---

## Core Concept: Kanban là gì?

**Kanban** (看板 - có nghĩa là "bảng trực quan" hoặc "thẻ báo hiệu" trong tiếng Nhật) ban đầu được phát triển bởi Taiichi Ohno tại hãng xe hơi **Toyota** vào cuối những năm 1940. Đây là công cụ phục vụ sản xuất tinh gọn (Lean Manufacturing) nhằm tối ưu hóa dây chuyền sản xuất theo triết lý **Just-in-Time (JIT)**: chỉ sản xuất những gì cần thiết, khi cần thiết và với số lượng cần thiết.

Năm 2004, **David J. Anderson** đã áp dụng thành công các nguyên lý của Kanban vào ngành công nghiệp phần mềm và các công việc tri thức (Knowledge Work).

### 4 Nguyên Lý Quản Lý Thay Đổi

Khác với Scrum (thường yêu cầu thay đổi cấu trúc vai trò ngay lập tức), Kanban tiếp cận theo hướng tiến hóa tự nhiên:

1. **Bắt đầu từ những gì bạn đang làm (Start with what you do now):** Giữ nguyên quy trình, vai trò và trách nhiệm hiện tại.
2. **Thống nhất theo đuổi sự cải tiến mang tính tiến hóa (Agree to pursue evolutionary change):** Thay đổi nhỏ, liên tục và tích lũy sẽ ít bị kháng cự và mang lại hiệu quả bền vững lâu dài.
3. **Tôn trọng các quy trình, vai trò, trách nhiệm & chức danh hiện tại (Respect the current process, roles, responsibilities & titles):** Tránh gây xáo trộn tổ chức ngay lập tức mà để quy trình tự phát triển tự nhiên dựa trên thực tế.
4. **Khuyến khích tinh thần lãnh đạo ở mọi cấp độ (Encourage acts of leadership at all levels):** Bất kỳ thành viên nào trong nhóm cũng có thể đề xuất cải tiến quy trình (Kaizen).

---

## Practical Implementation

Áp dụng Kanban vào thực tế quản trị dự án phần mềm thông qua **6 thực hành cốt lõi** và các thành phần cấu tạo bảng sau:

### 6 Thực Hành Cốt Lõi

### 1. Trực Quan Hóa Quy Trình

- Sử dụng bảng vật lý hoặc kỹ thuật số (**Kanban Board**) được chia thành các cột đại diện cho các trạng thái của công việc (ví dụ: `To do`, `In Progress`, `Review`, `Testing`, `Done`).
- Mỗi công việc được viết trên một thẻ (**Kanban Card**) chứa thông tin mô tả, người làm và deadline. Trực quan hóa giúp toàn đội thấy rõ trạng thái của từng công việc trong nháy mắt.

### 2. Giới Hạn Công Việc Đang Làm

- Đây là thực hành quan trọng nhất của Kanban. Mỗi cột trên bảng Kanban (trừ cột Done) sẽ được thiết lập một con số giới hạn tối đa (**WIP Limit**) số thẻ được phép nằm ở cột đó tại một thời điểm.
- _Ví dụ:_ Cột `In Progress` có WIP Limit = 3. Nếu đã có 3 task đang làm, các thành viên không được phép kéo thêm task mới từ `To do` sang, trừ khi có ít nhất 1 task trong `In Progress` được hoàn thành và kéo sang cột tiếp theo.
- **Ý nghĩa:** Ép cả nhóm phải tập trung hoàn thành dứt điểm các công việc cũ trước khi bắt đầu công việc mới (**"Stop starting, start finishing"**), loại bỏ tổn hao do chuyển ngữ cảnh (context switching) và đa nhiệm (multitasking).

### 3. Quản Lý Dòng Chảy

- Theo dõi tốc độ di chuyển của các thẻ qua các cột.
- Khi một cột có số lượng thẻ chạm ngưỡng WIP Limit, đó là dấu hiệu của **Điểm nghẽn (Bottleneck)**. Cả nhóm cần tập trung nguồn lực (swarming) vào cột đó để giải quyết nghẽn, khơi thông dòng chảy công việc.

### 4. Quy Định Rõ Ràng Các Chính Sách

- Thiết lập các tiêu chuẩn đồng thuận chung để dịch chuyển task giữa các cột, ví dụ:
  - Thế nào là hoàn thành (Definition of Done - DoD)?
  - Khi nào một task đủ điều kiện để chuyển sang cột `Code Review` hoặc `Testing`?

### 5. Thiết Lập Các Vòng Lặp Phản Hồi

- Tổ chức các buổi họp định kỳ (như họp Kanban hàng ngày, họp đánh giá dịch vụ) để đánh giá hiệu suất dòng chảy và điều chỉnh các WIP Limit hoặc chính sách quy trình.

### 6. Cải Tiến Cộng Tác

- Sử dụng các số liệu thực tế đo lường được để phân tích hiệu suất và thực hiện các thử nghiệm cải tiến quy trình liên tục.

---

## Các Thành Phần Cấu Thành Bảng Kanban

1. **Kanban Cards (Thẻ Kanban):** Đại diện cho một đơn vị công việc (Task/User Story).
2. **Kanban Columns (Các cột):** Đại diện cho các bước trong chuỗi giá trị (Value Stream).
3. **WIP Limits (Giới hạn WIP):** Số lượng thẻ tối đa ở trên đầu mỗi cột.
4. **Commitment Point (Điểm cam kết):** Thời điểm task được tiếp nhận từ backlog và bắt đầu thực hiện.
5. **Delivery Point (Điểm bàn giao):** Thời điểm công việc hoàn tất hoàn toàn và chuyển tới tay khách hàng hoặc mentor.
6. **Swimlanes (Đường bơi):** Các hàng ngang phân chia công việc theo danh mục (Module, Mức độ ưu tiên như Khẩn cấp - Expedite, việc Thường - Standard).

---

## ️ So Sánh Kanban vs. Scrum

| Tiêu chí so sánh      | Scrum                                                      | Kanban                                          |
| :-------------------- | :--------------------------------------------------------- | :---------------------------------------------- |
| **Nhịp độ (Cadence)** | Theo các Sprint cố định (1-4 tuần)                         | Dòng chảy liên tục (Continuous Flow)            |
| **Vai trò (Roles)**   | Yêu cầu 3 vai trò bắt buộc: PO, SM, Developers             | Không bắt buộc vai trò mới                      |
| **Quản lý WIP**       | Giới hạn gián tiếp qua dung lượng cam kết của Sprint       | Giới hạn trực tiếp bằng WIP Limit trên từng cột |
| **Thay đổi yêu cầu**  | Hạn chế thay đổi trong Sprint Backlog khi Sprint đang chạy | Chấp nhận thay đổi bất kỳ lúc nào ở cột To do   |
| **Chỉ số đo lường**   | Velocity (tốc độ hoàn thành công việc)                     | Lead Time, Cycle Time, Throughput               |

---

## Các Chỉ Số Đo Lường Hiệu Suất Trong Kanban

- **Lead Time (Thời gian hoàn thành):** Khoảng thời gian từ lúc khách hàng yêu cầu (đưa vào backlog) đến lúc bàn giao thành công (Delivery Point).
- **Cycle Time (Thời gian chu kỳ):** Khoảng thời gian từ khi bắt đầu thực hiện công việc (Commitment Point) đến lúc hoàn thành (Delivery Point). Đây là chỉ số quan trọng để đánh giá năng lực thực tế của Dev team.
- **Throughput (Năng suất đầu ra):** Số lượng công việc hoàn thành trong một đơn vị thời gian (ví dụ: 10 tasks/tuần).

---

## Related Notes

- [[Agile_Scrum]]
- [[Agile_Management_via_GitHub]]
- [[Systems_Thinking]]

---

## Sources / References

- [Kanban University - What is the Kanban Method?](https://kanban.university/what-is-kanban/)
- [Atlassian Agile Coach - What is Kanban?](https://www.atlassian.com/agile/kanban)
- [David J. Anderson - "Kanban: Successful Evolutionary Change for Your Technology Business" (Book)](https://www.amazon.com/Kanban-Successful-Evolutionary-Technology-Business/dp/0984530500)
