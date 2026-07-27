---
tags: [type/project, status/active]
priority: High
deadline: 2026-07-27
stack: [NestJS, PostgreSQL, Redis, Socket.io, BullMQ, Docker, TypeScript ^6.0.3]
created_at: 2026-06-27
---

# Ticket Booking Backend

## Objective (SMART Goal)

- **Goal:** Xây dựng hệ thống Backend đặt vé (Ticket Booking/Flash Sale) bằng NestJS, PostgreSQL và Redis tập trung vào giải quyết bài toán đồng thời (Concurrency) và chịu tải cao.
- **Outcome:**
  1. Tránh hoàn toàn việc bán vượt số vé hiện có (Overselling) dưới tải lớn qua Redis Distributed Lock (Redlock).
  2. Đảm bảo 100% các sự kiện hậu đặt vé (gửi email xác nhận, tạo hóa đơn PDF) được xử lý thành công nhờ triển khai **Transactional Outbox Pattern** kết hợp với **BullMQ** (tránh mất mát message khi worker hoặc DB bị sập).
  3. Đóng gói toàn bộ hệ thống bằng Docker Compose và có tài liệu Load Testing bằng k6 chứng minh khả năng chịu tải (mục tiêu vượt qua stress test với 1,000 người dùng đồng thời - CCU).

## Tech Stack & Tools

- **Backend:** NestJS (TypeScript), BullMQ (Message Queue)
- **Database:** PostgreSQL (lưu trữ thông tin vé, order và outbox events), Redis (lưu cache session, rate limit và quản lý Distributed Lock)
- **DevOps:** Docker, Docker Compose
- **Testing:** k6 / Autocannon (để thực hiện stress test và kiểm tra race condition)

## Roadmap / Milestones

- [ ] **Phase 1: Init & Redlock** (Deadline: 05/07/2026)
  - [ ] Khởi tạo NestJS project (`bun`) và Docker Compose (Postgres + Redis).
  - [ ] Thiết kế Database Schema và kết nối ORM (Drizzle ORM).
  - [ ] Xây dựng Domain Model cho Ticket & Order (không dùng decorators).
  - [ ] Triển khai `RedlockService` (Distributed Lock) và tích hợp Pessimistic Locking (`SELECT ... FOR UPDATE`).
- [ ] **Phase 2: Outbox & BullMQ** (Deadline: 12/07/2026)
  - [ ] Tạo bảng `outbox_events` trong PostgreSQL.
  - [ ] Tích hợp ghi nhận sự kiện `order.created` trong cùng transaction DB khi lưu Order.
  - [ ] Cấu hình BullMQ và viết `NotificationProcessor` background consumer.
  - [ ] Triển khai `OutboxRelayer` (Cron Job) quét outbox đẩy event lên BullMQ.
- [ ] **Phase 3: Real-time & LoadTest** (Deadline: 20/07/2026)
  - [ ] Viết WebSocket Gateway thông báo số lượng vé còn lại real-time.
  - [ ] Scale WebSockets sử dụng Redis Pub/Sub adapter.
  - [ ] Viết script test chịu tải bằng k6 giả lập 1,000 CCU.
- [ ] **Phase 4: Polish & Docs** (Deadline: 27/07/2026)
  - [ ] Tối ưu hóa database indexes trên bảng `outbox_events` và `orders`.
  - [ ] Lập báo cáo hiệu năng stress test k6 và tổng hợp bullet points kinh nghiệm đưa vào CV.

## Work Log / Decisions

- **[27/06]:** Khởi tạo dự án. Lựa chọn phương án làm dự án Ticket Booking thay vì Chat app do độ khó của bài toán đồng thời và quản lý nhất quán dữ liệu cao hơn. Quyết định áp dụng kết hợp [[Outbox_Pattern]] và BullMQ để giải quyết vấn đề gửi email/tạo PDF tin cậy.
- **[27/06]:** Hoàn thành chuẩn bị tài liệu (MOC, Architecture, Setup Roadmap, Checklist) - Đang chờ người dùng phê duyệt trước khi tạo thư mục code thực tế.

## Related Resources

### Architecture & Specs

- Lộ trình thiết lập và checklist chi tiết: [[Setup_Roadmap_and_Checklist]]
- Quy chuẩn & Mẫu viết tài liệu Workflow (SSOT): [[Workflow_Documentation_Standard]]
- Template Bảng WBS Phân Cấp Mẫu (L1 -> L4): [[WBS_Table_Template]]
- Đặc tả thiết kế hệ thống chi tiết: [[Architecture_and_Spec]]
- Chiến lược kiến trúc đa giao thức Hybrid: [[Hybrid_Architecture_Strategy]]
- Luồng thực thi chi tiết NestJS Request Lifecycle: [[NestJS_Execution_Workflow_and_Lifecycle]]
- Phân tích chuyên sâu NestJS Guards & Interface CanActivate: [[Guards_and_CanActivate_Deep_Dive]]
- Phân tích cơ chế ExecutionContext & ArgumentsHost: [[ExecutionContext_and_ArgumentsHost_Deep_Dive]]
- Chuẩn hóa Error Response theo RFC 9457: [[RFC_9457_Problem_Details_Deep_Dive]]
- Quy trình & Sơ đồ vận hành GlobalExceptionFilter: [[Global_Exception_Filter_Workflow]]
- Cơ chế Locking & Concurrency Control (FOR UPDATE, SKIP LOCKED): [[PostgreSQL_Locking_and_Concurrency_Deep_Dive]]

### Auth Strategy & Security

- Phân tách Auth WBS (Register & Login): [[Auth_WBS_Deconstruction]]
- Chiến lược tách Refresh Token: [[Refresh_Token_Separation_Strategy]]
- Phỏng vấn Auth Schema Design: [[Auth_Schema_Design_Interview_Preparation]]
- Quá trình Quên & Đặt lại mật khẩu: [[Forget_Password_Workflow]]
- Luồng Đổi mật khẩu người dùng: [[Change_Password_Workflow]]
- Luồng Đăng xuất toàn bộ phiên: [[Logout_All_User_Sessions_Workflow]]
- Luồng Lấy thông tin hồ sơ người dùng hiện tại (GET /api/users/me): [[Get_Current_User_Profile_Workflow]]
### Database & Data Models

- Sơ đồ cơ sở dữ liệu (DBML): [[Database_Schema.dbml]]
- Kiểm định Index CSDL: [[Database_Index_Audit]]
- Chiến lược thiết kế Enum CSDL: [[Database_Enum_Strategy]]
- Phỏng vấn PostgreSQL 18: [[Postgres_18_Interview_Preparation]]
- Quy chuẩn lập trình Drizzle ORM v1.0.0-rc.4: [[Drizzle_v1_RC4_Coding_Standards]]
- Khái niệm Entity & Kiểm thử kết nối Database: [[Database_Entities_and_Connection_Testing]]

### Workflows & Domain Features

- Luồng tích hợp dữ liệu phim (TMDB): [[Movie_Sync_Workflow]]
- Chiến lược dịch thuật & Caching: [[Localization_and_Caching_Strategy]]
- Chiến lược đa ngôn ngữ i18n hệ thống: [[Multi_Language_i18n_Strategy]]
- Giải thích cơ chế Custom Validator Match: [[Custom_Validation_Constraint_Match]]
- Thiết kế cấu trúc Họ Tên người dùng: [[Name_Format_Design_Decision]]
- Hướng dẫn kiểm thử bảo mật scrypt và XSS: [[Security_Testing_and_XSS_Prevention]]
- Giải thích chi tiết tiện ích mã hóa mật khẩu: [[Cryptography_Utilities_Explanation]]
- Mẫu thiết kế Transactional Outbox: [[Outbox_Pattern]]
- Nguyên lý thiết kế mã nguồn sạch: [[Clean_Architecture]]

### Testing & Automation

- Tích hợp Apidog trong dự án OMP: [[OMP_Apidog_Setup]]
- Hướng dẫn dùng Apidog MCP Server: [[Apidog_MCP]]
- Thiết kế kịch bản kiểm thử trong Apidog: [[API_Testing_Scenarios_in_Apidog]]

### DevOps & Infrastructure

- So sánh Nginx vs Caddy: [[nginx-vs-caddy]]
- Hướng dẫn thiết lập HTTPS: [[https-setup-guide]]
- Triển khai Zero-Downtime: [[zero-downtime-deploy]]
- Giải thích Docker Compose: [[docker-compose-explained]]
- Hướng dẫn triển khai Azure: [[azure-deploy-guide]]
