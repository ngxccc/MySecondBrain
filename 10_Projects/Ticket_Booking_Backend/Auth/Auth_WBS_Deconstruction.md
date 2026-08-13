---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Chiến lược phân tách Đăng ký & Đăng nhập WBS,
    Auth WBS Deconstruction Strategy,
    Herbert Simon Chunking Auth,
  ]
---

# Chiến Lược Phân Tách Chức Năng Đăng Ký & Đăng Nhập theo Herbert Simon & WBS

## TL;DR

Tài liệu này hướng dẫn cách áp dụng phương pháp phân rã nhận thức **Deconstruction & Chunking** của Giáo sư Herbert A. Simon kết hợp với mô hình **Work Breakdown Structure (WBS)** 4 cấp độ để chia nhỏ hai chức năng phức tạp: **Đăng ký (Register)** và **Đăng nhập (Login)** thành các đơn vị công việc nguyên tử (Atomic Tasks) có thể lập trình và kiểm thử độc lập trong 15-45 phút, giúp tối ưu hóa tải nhận thức (Working Memory) và kiểm soát chất lượng phần mềm.

---

## Core Concept & Theoretical Foundation

### 1. Triết lý Herbert Simon (Cognitive Deconstruction)

- **Giới hạn bộ nhớ làm việc (Working Memory Limits - Miller's Law):** Bộ nhớ ngắn hạn con người chỉ xử lý đồng thời từ 5-9 đơn vị thông tin độc lập (7±2 items). Việc thiết kế/code toàn bộ luồng Auth cùng lúc dễ gây quá tải nhận thức và tạo ra lỗi ẩn (edge-case bugs).
- **Cơ chế Chunking (Gom nhóm thông tin):** Gom nhóm các thao tác xử lý nhỏ rời rạc thành một "khối" (chunk) có ý nghĩa lớn hơn.
- **Thực hành có chủ đích (Deliberate Practice Loop):** Tập trung 100% tài nguyên xử lý vào đúng 1 chunk duy nhất, sau đó tiến hành kiểm thử xác minh (Self-verification) trước khi chuyển sang chunk tiếp theo.

### 2. Cấu trúc Phân rã WBS (4 Cấp độ trong Software Engineering)

- **Level 1 (Module):** Authentication & Authorization
- **Level 2 (Feature):** Register / Login
- **Level 3 (Component Layer):** Payload Validation | Business Logic & Crypto | Data Access Layer (DAL) | Token/Session Management | Security & Rate Limiting
- **Level 4 (Atomic Task):** Đơn vị viết code nhỏ nhất có thể hoàn thành và Unit Test độc lập trong 15-45 phút.

---

## 1. Phân Rã Chức Năng Đăng Ký (Register WBS)

Chi tiết phân tích thiết kế, sơ đồ phân rã WBS (Mermaid) và kế hoạch triển khai được lưu trữ độc lập tại: [[Register_User_Existence_Creation_Workflow]]

---

## 2. Phân Rã Chức Năng Đăng Nhập (Login WBS)

Chi tiết phân tích thiết kế, sơ đồ phân rã WBS (Mermaid) và kế hoạch triển khai được lưu trữ độc lập tại: [[Login_User_Workflow]]

---

## 3. Phân Rã Chức Năng Quên Mật Khẩu (Forget Password WBS)

Chi tiết phân tích thiết kế, sơ đồ phân rã WBS (Mermaid) và kế hoạch triển khai được lưu trữ độc lập tại: [[Forget_Password_Workflow]]

---

## Quy Trình Thực Thi & Kiểm Thử Độc Lập

1. **Một thời điểm - Một Chunk:** Chỉ tập trung viết code và test duy nhất 1 Task ở Cấp 4 (Level 4).
2. **Xác minh độc lập (Self-Verification):** Mọi Chunk sau khi làm xong đều phải có test case bao phủ (Unit Test hoặc Postman call) trước khi chuyển sang Chunk tiếp theo.
3. **Ghép nối tuần tự (Chunk Assembly):** Dùng các Interfaces / Dependency Injection để ghép nối các Chunk đã hoàn thành thành luồng hoàn chỉnh.

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Luồng Quên & Đặt lại mật khẩu: [[Forget_Password_Workflow]]
- Thiết kế Auth Schema & Tách Refresh Token: [[Refresh_Token_Separation_Strategy]]
- Herbert Simon Learning Method: `30_Resources/Concepts/Learning_and_Linguistics/Herbert_Simon_Learning_Method.md`
