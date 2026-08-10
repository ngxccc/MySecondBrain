---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases: [Quy trình bản mẫu, Mô hình bản mẫu, Prototype Model, Prototyping]
date: 2026-07-08
description: "Quy trình phát triển phần mềm theo mô hình bản mẫu (Prototype Model) là phương pháp xây dựng một phiên bản thử nghiệm sớm (prototype) của sản phẩm để trình diễn, thu thập phản hồi và làm rõ yêu cầu..."
---

# Quy Trình Phát Triển Phần Mềm Theo Mô Hình Bản Mẫu

## TL;DR

Quy trình phát triển phần mềm theo mô hình bản mẫu (Prototype Model) là phương pháp xây dựng một phiên bản thử nghiệm sớm (prototype) của sản phẩm để trình diễn, thu thập phản hồi và làm rõ yêu cầu của khách hàng trước khi tiến hành phát triển hệ thống hoàn chỉnh. Mô hình này tập trung giảm thiểu rủi ro hiểu sai nghiệp vụ và tăng tính trực quan cho người dùng.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Khách hàng không thể định nghĩa rõ ràng hoặc chưa hiểu hết các yêu cầu nghiệp vụ của mình (chỉ có ý tưởng chung chung).
  - Hệ thống yêu cầu nhiều sự tương tác phức tạp từ người dùng cuối (như giao diện quản trị phức tạp, app dịch vụ mới lạ).
  - Cần chứng minh tính khả thi của một giải pháp công nghệ mới (Proof of Concept - PoC).
- **Điều kiện tiên quyết (Prerequisites):**
  - Khách hàng và end-users sẵn sàng tham gia đánh giá và phản hồi liên tục.
  - Team phát triển có khả năng xây dựng giao diện hoặc chức năng mô phỏng nhanh (rapid prototyping tools).

### 2 Hướng Tiếp Cận Bản Mẫu Chính

1. **Bản mẫu bỏ đi (Throwaway Prototyping):** Xây dựng nhanh một bản mẫu chỉ để làm rõ yêu cầu, sau đó bỏ đi và viết lại mã nguồn sản phẩm thực tế từ đầu trên nền tảng thiết kế chuẩn.
2. **Bản mẫu tiến hóa (Evolutionary Prototyping):** Xây dựng bản mẫu với kiến trúc có thể mở rộng, sau đó tinh chỉnh và phát triển trực tiếp bản mẫu này thành sản phẩm cuối cùng.

### Lịch Sử & Tiến Hóa

Prototype Model được phát triển để giải quyết nhược điểm _"khách hàng không xác định rõ yêu cầu từ đầu"_ của Waterfall. Bằng cách cho phép xây dựng nhanh các bản mẫu thô để lấy ý kiến trực quan từ người dùng, mô hình này mở ra tư duy phát triển lặp (iterative) định hình nên Agile hiện đại. Xem chi tiết tại [[SDLC_Methodologies_Evolution]].

---

## Step-by-Step Guideline

Quy trình vận hành qua các bước lặp lại liên tục cho đến khi đạt được sự đồng thuận:

### 1. Thu Thập Yêu Cầu Cơ Bản

- **Hành động:**
  - PO và BA gặp gỡ khách hàng để lấy các yêu cầu cơ bản nhất về mục tiêu dự án và các tính năng chính mong muốn.
  - Chưa cần đi sâu vào chi tiết kỹ thuật hay các trường hợp biên.

### 2. Thiết Kế Nhanh

- **Hành động:**
  - Tập trung thiết kế giao diện (UI/UX) và các luồng đi chính của người dùng (user flow).
  - Bỏ qua các phần thiết kế cơ sở dữ liệu phức tạp hoặc hạ tầng mạng. Chỉ thiết kế những gì trực quan hiển thị ra ngoài cho người dùng thấy.

### 3. Xây Dựng Bản Mẫu

- **Hành động:**
  - Sử dụng các công cụ vẽ mock-up động hoặc lập trình nhanh (như Figma, code mockup với dữ liệu giả lập - mock data) để tạo ra bản mẫu chạy được phần thô.
  - Ưu tiên tốc độ hoàn thành bản mẫu hơn là chất lượng code hay tính bảo mật.

### 4. Đánh Giá Từ Khách Hàng

- **Hành động:**
  - Trình diễn bản mẫu cho khách hàng và người dùng cuối trải nghiệm trực tiếp.
  - Thu thập các phản hồi về tính dễ dùng, các tính năng bị thiếu, hoặc những phần hoạt động chưa đúng mong đợi.

### 5. Tinh Chỉnh Bản Mẫu

- **Hành động:**
  - Dựa trên danh sách phản hồi thu được, BA cập nhật tài liệu yêu cầu và Developers sửa đổi bản mẫu.
  - Quay lại bước 4 để kiểm duyệt tiếp cho đến khi khách hàng hoàn toàn hài lòng và ký duyệt bản mẫu.

### 6. Phát Triển & Vận Hành Hệ Thống Thật

- **Hành động:**
  - Dựa trên bản mẫu đã được duyệt để tiến hành phân tích thiết kế chi tiết (như Waterfall hoặc Agile) và lập trình sản phẩm thực tế với đầy đủ các tiêu chuẩn chất lượng (hiệu năng, bảo mật, cơ sở dữ liệu thực).

---

## Verification / Testing

- [ ] Bản mẫu thô được xây dựng đáp ứng được các luồng nghiệp vụ cơ bản ban đầu.
- [ ] Biên bản ghi nhận phản hồi (Feedback Log) từ người dùng được cập nhật sau mỗi đợt đánh giá.
- [ ] Bản mẫu cuối cùng nhận được sự đồng thuận và ký duyệt nghiệm thu (Sign-off) từ khách hàng.
- [ ] Xác định rõ hướng tiếp cận tiếp theo là bỏ đi (Throwaway) hay tiến hóa (Evolutionary) trước khi viết code sản phẩm thật.

---

**Related Notes:**

- [[SDLC_Methodologies_Evolution]]
- [[Waterfall]]
- [[V_Model]]
- [[Agile_Scrum]]
- [[Standard_Project_Timeline_SOP]]
