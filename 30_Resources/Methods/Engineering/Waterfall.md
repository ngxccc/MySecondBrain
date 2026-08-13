---
tags: [type/method, topic/engineering, topic/productivity, layer/quality]
aliases: [Quy trình Waterfall, Mô hình thác nước, Waterfall Model]
date: 2026-07-08
description: "Quy trình phát triển phần mềm theo mô hình thác nước (Waterfall) là phương pháp quản lý dự án tuyến tính và tuần tự. Trong đó, mỗi giai đoạn của vòng đời phát triển phần mềm (SDLC) phải được hoàn t..."
---

# Quy Trình Phát Triển Phần Mềm Theo Mô Hình Waterfall

## TL;DR

Quy trình phát triển phần mềm theo mô hình thác nước (Waterfall) là phương pháp quản lý dự án tuyến tính và tuần tự. Trong đó, mỗi giai đoạn của vòng đời phát triển phần mềm (SDLC) phải được hoàn thành và nghiệm thu đầy đủ trước khi bắt đầu giai đoạn tiếp theo, không có sự chồng chéo giữa các bước.

---

## Context: When to use?

- **Trường hợp áp dụng:**
  - Dự án có yêu cầu nghiệp vụ rõ ràng, cố định và cực kỳ ít khả năng thay đổi từ đầu đến cuối.
  - Các hệ thống quan trọng yêu cầu độ an toàn và tính chuẩn xác cao (như y tế, ngân hàng, hàng không, quốc phòng).
  - Khách hàng có mong muốn xác định chính xác tổng ngân sách, phạm vi và thời gian bàn giao ngay từ khi ký hợp đồng.
  - Công nghệ sử dụng trong dự án đã chín muồi, quen thuộc và không có nhiều yếu tố rủi ro kỹ thuật chưa biết.
- **Điều kiện tiên quyết (Prerequisites):**
  - Tài liệu Đặc tả Yêu cầu Phần mềm (SRS - Software Requirement Specification) chi tiết và được các bên ký duyệt.
  - Các tài liệu thiết kế hệ thống (HLD, LLD) được xây dựng kỹ lưỡng trước khi bắt đầu lập trình.
  - Có quy trình kiểm soát thay đổi (Change Control Board - CCB) chặt chẽ nếu phát sinh yêu cầu mới.

### Lịch Sử & Tiến Hóa

Mô hình Waterfall là phương pháp SDLC đầu tiên (1970), đặt nền móng cho kỹ nghệ phần mềm. Tuy nhiên, tính chất tuyến tính và việc đóng băng yêu cầu từ sớm của nó đã bộc lộ nhiều hạn chế về mặt linh hoạt, dẫn đến sự ra đời của các mô hình cải tiến tiếp theo như [[V_Model]], [[Prototype_Model]], và sau này là [[Agile_Scrum]]. Xem chi tiết tại [[SDLC_Methodologies_Evolution]].

### Nguyên Tắc Cốt Lõi Của Waterfall

1. **Tuần Tự Tuyến Tính:** Phát triển đi theo một chiều từ trên xuống dưới như dòng thác. Không quay lại giai đoạn trước khi chưa kết thúc giai đoạn hiện tại.
2. **Ưu Tiên Tài Liệu (Document-driven):** Mọi quyết định, thiết kế và yêu cầu đều phải được ghi nhận chi tiết bằng văn bản làm căn cứ nghiệm thu.
3. **Phân Định Rõ Ràng Các Giai Đoạn:** Đầu ra của giai đoạn này là đầu vào bắt buộc của giai đoạn tiếp theo.

---

## Step-by-Step Guideline

### 1. Thu Thập & Phân Tích Yêu Cầu

- **Hành động:**
  - BA (Business Analyst) làm việc với khách hàng để làm rõ mọi yêu cầu chức năng và phi chức năng.
  - Tạo ra tài liệu đặc tả yêu cầu **SRS (Software Requirement Specification)**.
  - Khách hàng ký duyệt xác nhận tài liệu SRS để đóng băng (freeze) yêu cầu.

### 2. Thiết Kế Hệ Thống

- **Hành động:**
  - Kiến trúc sư phần mềm (Software Architect) và Tech Lead thiết kế kiến trúc hệ thống, cơ sở dữ liệu và cấu trúc phần mềm.
  - Sản xuất tài liệu **High-Level Design (HLD)** (kiến trúc tổng quan) và **Low-Level Design (LLD)** (thiết kế chi tiết class, DB schema, API specs).

### 3. Triển Khai & Lập Trình

- **Hành động:**
  - Developers dựa trên tài liệu LLD và HLD để tiến hành viết code.
  - Thực hiện viết Unit Test và kiểm thử cục bộ (White-box testing) trên từng module.

### 4. Kiểm Thử Hệ Thống

- **Hành động:**
  - Tích hợp tất cả các module và tiến hành kiểm thử toàn diện (System Test, Integration Test, UAT - User Acceptance Test).
  - QA/QC tìm và ghi nhận lỗi (bugs), chuyển về Developers sửa đổi cho đến khi đạt tiêu chuẩn chất lượng đã cam kết.

### 5. Bàn Giao & Triển Khai

- **Hành động:**
  - Triển khai sản phẩm lên môi trường Product (sản xuất) cho người dùng cuối sử dụng.
  - Bàn giao mã nguồn, tài liệu hướng dẫn sử dụng và vận hành cho khách hàng.

### 6. Bảo Trì & Vận Hành

- **Hành động:**
  - Tiếp nhận phản hồi từ người dùng thực tế, sửa các lỗi phát sinh (hotfix).
  - Thực hiện các nâng cấp nhỏ hoặc tối ưu hiệu năng hệ thống.

---

## Verification / Testing

- [ ] Tài liệu SRS đã được ký duyệt (approved & signed off) bởi khách hàng.
- [ ] Tài liệu thiết kế hệ thống HLD và LLD được kiểm duyệt và hoàn thành trước khi code.
- [ ] Toàn bộ mã nguồn đáp ứng tiêu chí chất lượng và đã hoàn thành kiểm thử tích hợp.
- [ ] Biên bản nghiệm thu UAT (User Acceptance Testing) được ký nhận.
- [ ] Dự án bàn giao kèm theo tài liệu vận hành và bàn giao mã nguồn đầy đủ.

---

**Related Notes:**

- [[SDLC_Methodologies_Evolution]]
- [[Agile_Scrum]]
- [[Standard_Project_Timeline_SOP]]
