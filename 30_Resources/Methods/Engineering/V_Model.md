---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases: [Quy trình V-Model, Mô hình chữ V, V-Model]
date: 2026-07-08
description: "Mô hình V-Model (mô hình chữ V) là bản mở rộng kỷ luật của mô hình thác nước (Waterfall), trong đó mỗi giai đoạn phát triển (Verification) đều đi kèm với một giai đoạn kiểm thử tương ứng (Validatio..."
---

# Quy Trình Phát Triển Phần Mềm Theo Mô Hình V-Model

## TL;DR

Mô hình V-Model (mô hình chữ V) là bản mở rộng kỷ luật của mô hình thác nước (Waterfall), trong đó mỗi giai đoạn phát triển (Verification) đều đi kèm với một giai đoạn kiểm thử tương ứng (Validation). Quy trình này liên kết chặt chẽ thiết kế và kiểm thử ngay từ đầu để phát hiện lỗi sớm và đảm bảo chất lượng phần mềm cao nhất.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Dự án yêu cầu chất lượng cực kỳ nghiêm ngặt, tỷ lệ lỗi thấp nhất có thể (ví dụ: thiết bị y tế, phần mềm nhúng ô tô, hệ thống điều khiển tàu vũ trụ).
  - Yêu cầu nghiệp vụ rõ ràng, chi tiết, ổn định và không có sự thay đổi đột biến trong quá trình phát triển.
  - Dự án có đội ngũ kiểm thử (QA/QC) tham gia sớm cùng với đội ngũ phát triển ngay từ pha phân tích yêu cầu.
- **Điều kiện tiên quyết (Prerequisites):**
  - Tài liệu đặc tả yêu cầu (SRS) được đóng băng trước khi thực hiện thiết kế.
  - Đội ngũ QA/QC có đủ năng lực để lập kế hoạch kiểm thử (Test Plan) song song với quá trình phân tích thiết kế.

### Nguyên Tắc Cốt Lõi: Verification vs. Validation

V-Model chia quy trình thành hai nhánh song song nối nhau bởi pha Lập trình (Coding):

1. **Nhánh Xác Thực Thiết Kế (Verification - Nhánh trái):**
   - _Câu hỏi cốt lõi:_ "Chúng ta có đang xây dựng sản phẩm đúng cách?" (Are we building the product right?).
   - _Hành động:_ Đánh giá tĩnh (tài liệu, bản thiết kế, code review) mà không chạy chương trình.
2. **Nhánh Xác Thực Sản Phẩm (Validation - Nhánh phải):**
   - _Câu hỏi cốt lõi:_ "Chúng ta có đang xây dựng đúng sản phẩm khách hàng cần?" (Are we building the right product?).
   - _Hành động:_ Đánh giá động bằng cách chạy phần mềm trên các kịch bản kiểm thử (Test Cases) thực tế.

### Lịch Sử & Tiến Hóa

V-Model tiến hóa trực tiếp từ Waterfall vào những năm 1980 nhằm giải quyết điểm yếu lớn nhất của Waterfall là _"kiểm thử quá muộn"_. Bằng cách song song hóa việc lập kế hoạch kiểm thử ngay từ khâu thiết kế, V-Model giúp phát hiện lỗi sớm hơn rất nhiều. Xem chi tiết hành trình tiến hóa tại [[SDLC_Methodologies_Evolution]].

---

## Step-by-Step Guideline

Quy trình V-Model hoạt động theo cặp song song từ trên xuống dưới (đối xứng qua trục chữ V):

### 1. Phân Tích Yêu Cầu & Thiết Lập Kiểm Thử Chấp Nhận

- **Thiết kế (Nhánh trái):** BA phân tích yêu cầu của khách hàng và lập tài liệu đặc tả SRS.
- **Kiểm thử đối ứng (Nhánh phải):** QA/QC dựa trên SRS để soạn thảo kế hoạch và kịch bản **Kiểm thử Chấp nhận (Acceptance Test Plan/Cases)** nhằm nghiệm thu cuối cùng với khách hàng.

### 2. Thiết Kế Hệ Thống & Thiết Lập Kiểm Thử Hệ Thống

- **Thiết kế (Nhánh trái):** Kiến trúc sư thiết kế sơ đồ tổng thể, kiến trúc phần cứng, phần mềm và sơ đồ giao tiếp (HLD).
- **Kiểm thử đối ứng (Nhánh phải):** QA/QC dựa trên tài liệu HLD để xây dựng kế hoạch và kịch bản **Kiểm thử Hệ thống (System Test Plan/Cases)** nhằm kiểm tra khả năng tích hợp của toàn hệ thống.

### 3. Thiết Kế Chi Tiết & Thiết Lập Kiểm Thử Tích Hợp

- **Thiết kế (Nhánh trái):** Thiết kế chi tiết cấu trúc dữ liệu, các lớp (classes), API, cấu trúc cơ sở dữ liệu (LLD).
- **Kiểm thử đối ứng (Nhánh phải):** QA/QC dựa trên LLD thiết lập kế hoạch và kịch bản **Kiểm thử Tích hợp (Integration Test Plan/Cases)** để kiểm tra sự giao tiếp giữa các module.

### 4. Lập Trình & Kiểm Thử Đơn Vị

- **Lập trình (Đáy V):** Developers tiến hành viết code dựa trên tài liệu thiết kế chi tiết (LLD).
- **Kiểm thử đối ứng (Nhánh phải):** Developers viết và chạy **Unit Test** để xác thực các hàm, class riêng lẻ hoạt động chính xác trước khi tích hợp.

### 5. Thực Thi Nhánh Phải

- Sau khi Coding và Unit Test hoàn tất, dự án đi ngược lên nhánh phải để thực thi lần lượt:
  1. **Thực thi Integration Testing:** Kiểm tra liên kết giữa các module.
  2. **Thực thi System Testing:** Kiểm tra toàn bộ luồng nghiệp vụ của hệ thống trên môi trường kiểm thử.
  3. **Thực thi Acceptance Testing:** Khách hàng hoặc PO kiểm thử nghiệm thu cuối cùng để đưa sản phẩm vào hoạt động.

---

## Verification / Testing

- [ ] Tài liệu đặc tả yêu cầu SRS được phê duyệt và kèm theo tài liệu Acceptance Test Cases.
- [ ] Thiết kế kiến trúc (HLD) được phê duyệt và kèm theo tài liệu System Test Cases.
- [ ] Thiết kế chi tiết (LLD) được phê duyệt và kèm theo tài liệu Integration Test Cases.
- [ ] Lập trình hoàn tất và đạt độ phủ Unit Test (Unit Test Coverage) theo quy chuẩn dự án.
- [ ] Thực hiện đầy đủ 3 cấp độ kiểm thử nhánh phải (Integration, System, Acceptance) và nghiệm thu thành công.

---

**Related Notes:**

- [[SDLC_Methodologies_Evolution]]
- [[Waterfall]]
- [[Agile_Scrum]]
- [[Standard_Project_Timeline_SOP]]
