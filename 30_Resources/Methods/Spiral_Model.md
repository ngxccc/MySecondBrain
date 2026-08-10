---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases: [Quy trình xoắn ốc, Mô hình xoắn ốc, Spiral Model]
date: 2026-07-08
description: "Quy trình phát triển phần mềm theo mô hình xoắn ốc (Spiral Model) là phương pháp kết hợp tính lặp lại (iterative) của Prototype và tính kiểm soát tuần tự của Waterfall, với trọng tâm là quản lý và ..."
---

# Quy Trình Phát Triển Phần Mềm Theo Mô Hình Xoắn Ốc

## TL;DR

Quy trình phát triển phần mềm theo mô hình xoắn ốc (Spiral Model) là phương pháp kết hợp tính lặp lại (iterative) của Prototype và tính kiểm soát tuần tự của Waterfall, với trọng tâm là quản lý và giảm thiểu rủi ro (risk-driven). Quy trình được thực hiện theo các vòng lặp (loops) đồng tâm, mở rộng dần tương ứng với chi phí tích lũy tăng lên và sản phẩm hoàn thiện hơn.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Dự án quy mô lớn, phức tạp và có nhiều yếu tố không chắc chắn (high-risk projects) mà nếu thất bại sẽ gây thiệt hại nghiêm trọng.
  - Các dự án phát triển công nghệ mới hoặc kiến trúc hệ thống cực kỳ phức tạp chưa từng có tiền lệ.
  - Dự án có ngân sách lớn và yêu cầu một quy trình quản lý rủi ro chặt chẽ, chuyên nghiệp.
- **Điều kiện tiên quyết (Prerequisites):**
  - Có đội ngũ chuyên gia phân tích rủi ro giàu kinh nghiệm để nhận diện và xử lý các vấn đề kỹ thuật/vận hành sớm.
  - Khách hàng chấp nhận tính chất lặp và không có một mốc thời gian/ngân sách cố định cứng nhắc từ đầu dự án.

### 4 Góc Phần Tư Của Barry Boehm

Mỗi vòng lặp (loop) của mô hình xoắn ốc bắt buộc phải đi qua 4 góc phần tư theo chiều kim đồng hồ:

1. **Góc I: Xác định mục tiêu, các giải pháp thay thế và ràng buộc (Determine Objectives, Alternatives, and Constraints)**
2. **Góc II: Đánh giá rủi ro và các giải pháp thay thế (Identify and Resolve Risks)**
3. **Góc III: Phát triển và kiểm thử sản phẩm kế tiếp (Develop and Verify Next-Level Product)**
4. **Góc IV: Lập kế hoạch cho vòng lặp tiếp theo (Plan Next Phases)**

### Lịch Sử & Tiến Hóa

Spiral Model do Barry Boehm đề xuất năm 1986, là sự kết hợp nâng cao giữa tính lặp của Prototype và tính kiểm soát của Waterfall, xoay quanh cốt lõi là quản lý rủi ro hệ thống. Đây là tiền đề trực tiếp cho các mô hình phát triển gia tăng sau này. Xem chi tiết tại [[SDLC_Methodologies_Evolution]].

---

## Step-by-Step Guideline

Quy trình hoạt động lặp qua các vòng (mỗi vòng tạo ra một phiên bản hoàn thiện hơn của sản phẩm):

### Vòng lặp 1: Vòng lặp khái niệm

- **Góc I (Xác định):** Xác định mục tiêu của khái niệm sản phẩm, các ràng buộc về tài chính và công nghệ ban đầu.
- **Góc II (Phân tích rủi ro):** Nhận diện rủi ro lớn nhất (ví dụ: thị trường không đón nhận sản phẩm). Xây dựng một bản mẫu giấy (paper prototype) hoặc khảo sát thị trường để giải quyết rủi ro này.
- **Góc III (Phát triển):** Phát triển tài liệu định nghĩa khái niệm (Concept of Operations) và kiểm duyệt sơ bộ.
- **Góc IV (Lập kế hoạch):** Lập kế hoạch cho vòng tiếp theo (Thiết kế yêu cầu).

### Vòng lặp 2: Vòng lặp yêu cầu sản phẩm

- **Góc I (Xác định):** Xác định các yêu cầu chức năng chính của sản phẩm.
- **Góc II (Phân tích rủi ro):** Nhận diện rủi ro về mặt công nghệ (ví dụ: công nghệ DB được chọn có chịu tải nổi không). Thực hiện build một mock-up giao diện và benchmark DB để kiểm tra hiệu năng.
- **Góc III (Phát triển):** Viết tài liệu đặc tả yêu cầu (SRS) và tiến hành kiểm duyệt SRS.
- **Góc IV (Lập kế hoạch):** Lập kế hoạch cho vòng tiếp theo (Thiết kế hệ thống).

### Vòng lặp 3: Vòng lặp thiết kế

- **Góc I (Xác định):** Xác định các yêu cầu về kiến trúc hệ thống và thiết kế chi tiết.
- **Góc II (Phân tích rủi ro):** Đánh giá rủi ro liên kết hệ thống, lỗi bảo mật. Sử dụng các công cụ mô phỏng để giảm thiểu rủi ro này.
- **Góc III (Phát triển):** Thiết kế kiến trúc (HLD), thiết kế chi tiết (LLD), lập trình phiên bản thử nghiệm đầu tiên (Alpha release) và thực hiện Unit Test / Integration Test.
- **Góc IV (Lập kế hoạch):** Lập kế hoạch cho vòng tiếp theo (Phát triển toàn diện và vận hành).

### Vòng lặp 4: Vòng lặp hoàn thiện & Bàn giao

- **Góc I (Xác định):** Xác định tiêu chuẩn bàn giao và vận hành thực tế.
- **Góc II (Phân tích rủi ro):** Đánh giá rủi ro triển khai thực tế (dữ liệu lớn, downtime).
- **Góc III (Phát triển):** Hoàn thiện sản phẩm (Beta release), thực hiện System Test và Acceptance Test (UAT), sau đó deploy lên môi trường Production.
- **Góc IV (Lập kế hoạch):** Lập kế hoạch cho các vòng lặp bảo trì hoặc nâng cấp phiên bản tiếp theo.

---

## Verification / Testing

- [ ] Mỗi vòng lặp đều có biên bản Đánh giá Rủi ro (Risk Assessment Report) đi kèm giải pháp giảm thiểu rõ ràng.
- [ ] Các bản mẫu thử nghiệm (prototypes) được xây dựng thành công để chứng minh tính khả thi của công nghệ trước khi code diện rộng.
- [ ] Khách hàng tham gia đánh giá sản phẩm ở cuối mỗi vòng lặp trước khi bắt đầu lập kế hoạch cho vòng kế tiếp.
- [ ] Tài liệu thiết kế và code của mỗi phiên bản đều được verify và nghiệm thu đầy đủ theo tiêu chuẩn chất lượng của vòng lặp đó.

---

**Related Notes:**

- [[SDLC_Methodologies_Evolution]]
- [[Waterfall]]
- [[V_Model]]
- [[Prototype_Model]]
- [[Agile_Scrum]]
- [[Standard_Project_Timeline_SOP]]
