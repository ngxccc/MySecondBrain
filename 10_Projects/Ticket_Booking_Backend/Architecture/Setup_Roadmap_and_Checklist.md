---
tags: [type/guide, status/permanent]
date: 2026-06-27
aliases: [Lộ trình thiết lập và Checklist, Setup Roadmap and Checklist]
---

# Setup Roadmap and Checklist

## TL;DR

This guide provides a complete roadmap, technical checklists, and a solo Kanban board for building a high-concurrency Ticket Booking / Flash Sale system using **NestJS, Bun, PostgreSQL (Drizzle ORM), and BullMQ**.

## Related Notes

- [[Architecture_and_Spec]]
- [[Auth_Schema_Design_Interview_Preparation]]
- [[zero-downtime-deploy]]

---

## 🗺️ Lộ Trình & Checklist Thiết Lập Chi Tiết (Ticket Booking Backend)

---

## 📋 Bảng Kanban Ngoại Tuyến (Solo Kanban)

### 📥 Backlog

- [ ] Triển khai ứng dụng (Render / Koyeb) sử dụng biến môi trường bảo mật.
- [ ] Tách nhỏ hệ thống thành Monorepo Microservices (Đăng ký + Thanh toán) qua RabbitMQ (Stage 6).

### 📋 To Do

- [ ] Xây dựng luồng Onboarding & Auth: Đăng ký (`POST /auth/register`), Đăng nhập sử dụng JWT, Zod Validation Pipe, Exception Filters, và ConfigService (Stage 1).
- [ ] Triển khai tải ảnh đại diện lên (Multer/FileInterceptor) và CRUD Shows/Seats bằng NestJS CLI (Stage 2).
- [ ] Viết mã transaction trong `BookingService` sử dụng Khóa bi quan (`SELECT ... FOR UPDATE`) để chặn race condition đặt trùng ghế (Stage 3).
- [ ] Cấu hình CacheModule/Redis để lưu danh sách ghế trống hiển thị tức thời cho người dùng (Stage 3).
- [ ] Cấu hình hàng đợi BullMQ để tự động hủy giữ chỗ sau 10 phút nếu chưa thanh toán (Stage 4).
- [ ] Thiết lập WebSocket Gateway / SSE để đẩy cập nhật thay đổi ghế theo thời gian thực (Stage 4).
- [ ] Thiết lập Health Check (Terminus), Rate Limiting (Throttler), Logger (Winston/Pino) (Stage 5).
- [ ] Viết E2E và Unit Test cho luồng đặt vé và hàng đợi (Stage 7).

### 🔄 In Progress

_Không có_

### ✅ Done

- [x] Thiết kế database schema (Seats, Shows, Bookings) bằng Drizzle ORM.
- [x] Cấu hình Docker multi-stage chạy bằng non-root user `bun` bảo mật.
- [x] Thiết lập quy chuẩn code format tự động bằng Husky & lint-staged.
- [x] Vá lỗ hổng bảo mật Multer (CVE-2026-5079 / CVE-2026-5038) qua resolutions.
- [x] Đồng bộ phiên bản Drizzle ORM & Kit lên `@rc4` ổn định.
- [x] Thêm script `check-types` và tích hợp vào quy trình CI (GitHub Actions).
- [x] Thiết lập quy tắc bảo vệ nhánh chính (GitHub Rulesets & Projects).

---

## 📅 Lộ Trình Triển Khai & Checklist Chi Tiết

### Phase 1: Init & Project Foundation (Môi Trường, Cơ Sở Dữ Liệu & CI/CD) - ĐÃ HOÀN THÀNH

- [x] **Khởi tạo mã nguồn NestJS & Bun**: Cấu hình ESLint/Prettier đồng bộ, bật chế độ `strict: true` trong `tsconfig.json`.
- [x] **Thiết lập Docker Môi Trường**: Tạo tệp `docker-compose.yml` (Postgres & Redis) và `Dockerfile` tối ưu hóa caching, chạy dưới quyền non-root `USER bun` để đảm bảo an toàn.
- [x] **Cấu hình Drizzle ORM & Kit**: Tạo schema cho các bảng `seats`, `shows`, `bookings`, `tickets` và thiết lập kết nối động hỗ trợ cả môi trường cục bộ lẫn Neon Postgres SSL.
- [x] **Vá lỗi bảo mật Multer**: Khắc phục lỗi DoS (CVE-2026-5079 và CVE-2026-5038) bằng việc ép phiên bản `multer@2.2.0` qua khối `resolutions` trong `package.json`.
- [x] **Đồng bộ phiên bản Drizzle**: Cập nhật Drizzle ORM và Drizzle Kit lên phiên bản `@rc4` ổn định (`1.0.0-rc.4-5d5b77c`) tránh xung đột sinh migration.
- [x] **Tự động hóa kiểm tra kiểu dữ liệu (CI)**: Thêm script `check-types` (`tsc --noEmit`) và tích hợp vào GitHub Actions CI workflow trước bước build.
- [x] **Cài đặt chất lượng Git & Nhánh**: Thiết lập Husky + lint-staged cho pre-commit và xây dựng quy tắc bảo vệ nhánh chính (GitHub Rulesets - cấm force push/delete và bắt buộc pass CI).

### Phase 2: Booking Core & Concurrency Control (Nghiệp Vụ Lõi & Khóa Bi Quan) - KẾ HOẠCH

- [ ] **Tạo dữ liệu thử nghiệm (Seed Scripts)**: Viết script seed database tự động tạo danh sách ghế, lịch chiếu phim/show diễn để phục vụ việc kiểm thử.
- [ ] **Viết Transaction Đặt Ghế với Khóa Bi Quan**:
  - [ ] Thực hiện truy vấn đọc trạng thái ghế kèm khóa dòng `SELECT ... FOR UPDATE` (sử dụng `.for('update')` trong Drizzle).
  - [ ] Kiểm tra nếu ghế đã bị giữ/đặt thì rollback transaction lập tức.
  - [ ] Cập nhật trạng thái ghế thành đã đặt/giữ và tạo bản ghi hóa đơn đặt vé trong cùng một transaction nguyên tố.
- [ ] **Xác thực dữ liệu bằng Zod**: Sử dụng Zod để kiểm tra tính hợp lệ của dữ liệu đầu vào (độ dài ID, định dạng, các trường bắt buộc) trước khi chuyển vào Service xử lý.

### Phase 3: Asynchronous Queues & Lifecycle (Hàng Đợi BullMQ & Redis) - KẾ HOẠCH

- [ ] **Tích hợp NestJS BullMQ**: Cấu hình module `@nestjs/bullmq` kết nối với dịch vụ Redis chạy trong Docker.
- [ ] **Hàng đợi Hủy Đặt Vé Tự Động (Timeout Queue)**:
  - [ ] Khi một người dùng giữ ghế thành công, đẩy một job trì hoãn (delayed job) 10 phút vào hàng đợi BullMQ.
  - [ ] Lập trình Worker tiêu thụ job: Sau 10 phút, nếu đơn đặt vé đó chưa được thanh toán thành công, tiến hành khôi phục trạng thái ghế về `available` và hủy đơn đặt chỗ.

### Phase 4: API Endpoints & Stress Testing (API & Kiểm Thử CCU) - KẾ HOẠCH

- [ ] **BookingController**: Thiết lập các route HTTP (`POST /bookings/reserve`, `POST /bookings/confirm`).
- [ ] **Stress Test Giả Lập Tải Cao**:
  - [ ] Viết kịch bản kiểm thử chịu tải bằng k6 hoặc Bun Test giả lập 500-1,000 CCU đặt cùng một số ghế trống tại cùng một thời điểm.
  - [ ] Đo lường độ trễ (Latency) dưới 150ms và tỷ lệ lỗi (Error Rate) phải bằng 0%.
  - [ ] Xác minh tính nhất quán: số ghế bị đặt thành công phải trùng khớp 100% với số vé được ghi nhận, không có hiện tượng bán vượt (overselling).

---

## 🚀 Lộ Trình Master NestJS Theo Workflow Người Dùng

Mỗi giai đoạn được thiết kế để bạn thực hành các tính năng sản phẩm cụ thể ứng với tài liệu chính thức từ **NestJS Docs**:

### Giai đoạn 1: Đăng Ký & Xác Thực Người Dùng (NestJS Fundamentals)

- **Luồng Người Dùng (User Workflow):** Đăng ký thông tin -> Lưu trữ -> Đăng nhập bằng JWT -> Truy cập thông tin cá nhân.
- **NestJS Concept cần Master:**
  - **Controllers:** Định tuyến route, `@Get()`, `@Post()`, `@Request()`, `@Res()`.
  - **Providers & Dependency Injection:** Khai báo `@Injectable()`, cơ chế Constructor DI, phân biệt Scope (`Default`, `Request`, `Transient`).
  - **Modules:** Gom nhóm chức năng bằng `@Module()`, cách sử dụng `exports` và module `@Global()`.
  - **Pipes (Validation):** Sử dụng Zod Validation Pipe kết hợp thư viện `zod` để ràng buộc DTO đầu vào.
  - **Exception Filters:** Viết Custom Exception Filter để định dạng cấu trúc JSON lỗi trả về.
  - **Guards (Authorization):** `@UseGuards()`, kết xuất JWT Token và lưu vào request context.
  - **Configuration:** Sử dụng `@nestjs/config` và `ConfigService` để xác thực cấu hình môi trường qua Zod.

### Giai đoạn 2: Quản Lý Hồ Sơ & Thông Tin Vé (CRUD, DB & CLI)

- **Luồng Người Dùng (User Workflow):** Upload ảnh đại diện -> Xem danh sách và tìm kiếm phim/lịch chiếu.
- **NestJS Concept cần Master:**
  - **NestJS CLI:** Đẩy nhanh tốc độ bằng câu lệnh sinh mã: `nest g resource <name>`.
  - **Interceptors:** Xử lý format Response bằng Custom Interceptor, dùng `ClassSerializerInterceptor` ẩn thông tin nhạy cảm, tích hợp `FileInterceptor` (Multer) để upload tệp tin.
  - **Database Integration:** Tích hợp cơ sở dữ liệu quan hệ qua Drizzle ORM sử dụng Dynamic Config Service để cấu hình SSL động.
  - **Custom Decorators:** Tự thiết kế các Decorator tiện ích như `@CurrentUser()`.

### Giai đoạn 3: Đặt Ghế & Chống Đặt Trùng (Locking, Caching & Lifecycle)

- **Luồng Người Dùng (User Workflow):** Hàng nghìn người cùng click đặt 1 ghế (Flash Sale), chỉ 1 người thành công.
- **NestJS Concept cần Master:**
  - **Request Lifecycle:** Hiểu sâu thứ tự chạy: Middleware ➡️ Guards ➡️ Interceptors (Pre) ➡️ Pipes ➡️ Handler ➡️ Interceptors (Post) ➡️ Exception Filters.
  - **Concurrency Control:** Khóa dòng bi quan (Pessimistic Locking `SELECT ... FOR UPDATE` bằng Drizzle) trong Transaction của Service.
  - **Caching Module:** Sử dụng `@nestjs/cache-manager` với Redis, cấu hình Cache tự động trên Controller hoặc ghi thủ công trong Service.
  - **Dynamic Modules:** Tạo module cấu hình động sử dụng `forRootAsync()` hay `register()`.

### Giai đoạn 4: Hủy Đặt Vé & Sự Kiện Real-time (Queues, Tasks & WebSockets)

- **Luồng Người Dùng (User Workflow):** Giữ chỗ trong 10 phút, tự hủy nếu không thanh toán, người dùng khác thấy ghế chuyển sang màu xanh (available) ngay lập tức.
- **NestJS Concept cần Master:**
  - **Task Scheduling (Cron Jobs):** Sử dụng `@nestjs/schedule` và `@Cron()` quét dọn rác định kỳ.
  - **Message Queues (BullMQ):** Tích hợp `@nestjs/bullmq` tạo các Delayed Jobs tự hủy vé sau 10 phút.
  - **WebSockets Gateways:** Sử dụng `@WebSocketGateway()` đẩy dữ liệu thời gian thực qua Socket.io/ws.
  - **Server-Sent Events (SSE):** Sử dụng `@Sse()` kết hợp RxJS `Observable` để đẩy dữ liệu thời gian thực một chiều.

### Giai đoạn 5: Giám Sát, Bảo Mật & Tối Ưu Hệ Thống (Production Readiness)

- **Luồng Kỹ Thuật (Operations Workflow):** Giám sát tình trạng ứng dụng, chống DDoS/Spam API, ghi log chi tiết.
- **NestJS Concept cần Master:**
  - **Terminus (Health Checks):** API `/health` kiểm tra Database, Disk, RAM.
  - **Throttler (Rate Limiting):** Sử dụng `@nestjs/throttler` bảo vệ API.
  - **Logger Service:** Thay thế logger mặc định bằng Winston hoặc Pino dạng Structured Logging.
  - **Security Best Practices:** Tích hợp Helmet middleware, CORS options, CSRF protection.

### Giai đoạn 6: Chia Nhỏ Hệ Thống & Scale Lớn (Microservices & CQRS)

- **Luồng Người Dùng (User Workflow):** Đặt vé thành công sẽ gửi tin nhắn bất đồng bộ sang Payment Service qua Message Broker.
- **NestJS Concept cần Master:**
  - **NestJS Microservices Module:** Khởi tạo ứng dụng microservice qua `NestFactory.createMicroservice()`.
  - **Transport Strategies:** Kết nối qua TCP, Redis Pub/Sub, RabbitMQ, gRPC, hoặc Kafka.
  - **Message & Event Patterns:** Sử dụng `@MessagePattern()` và `@EventPattern()`.
  - **CQRS:** Tách biệt luồng ghi và đọc dữ liệu qua `@nestjs/cqrs`.
  - **NestJS Monorepo Workspaces:** Cấu hình monorepo dùng chung Entities/DTO.

### Giai đoạn 7: Kiểm Thử Phần Mềm (Testing & Quality Assurance)

- **Quy Trình Kiểm Thử (Testing Workflow):** Chạy kiểm thử tự động bảo vệ logic trước khi Deploy.
- **NestJS Concept cần Master:**
  - **Unit Testing:** `@nestjs/testing` tạo module mock, dùng Jest mock các Service/DB Provider.
  - **E2E Testing:** Dùng `supertest` giả lập HTTP request gửi tới Test DB (Dockerized Postgres).

---

## 📈 Cách Đo Lường & Đánh Giá Mức Độ "Master"

| Cấp Độ                | Chỉ Số Đánh Giá (Key Metrics)                                                                                                                  | Chức Năng Đã Hoàn Thành                                                                                    |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Cơ Bản (Junior)**   | Hiểu rõ cơ chế DI, viết được CRUD cơ bản có Validation đầu vào chuẩn chỉ, cấu hình môi trường động sạch sẽ.                                    | Đăng ký, Đăng nhập JWT, CRUD rạp chiếu và lịch chiếu phim.                                                 |
| **Trung Cấp (Mid)**   | Tự viết được Decorator/Interceptor, tối ưu hóa truy vấn DB (Drizzle), xử lý tệp tin tải lên an toàn, viết được Unit Test cơ bản.               | Tải avatar lên S3/local, kiểm soát transaction thanh toán, bọc chuẩn hóa JSON trả về.                      |
| **Nâng Cao (Senior)** | Xử lý tốt race condition dưới CCU cao (khóa bi quan), cài đặt queue BullMQ chạy ổn định, cấu hình được WebSockets/SSE cập nhật thời gian thực. | Hệ thống đặt ghế Flash Sale không bị trùng lặp, tự giải phóng ghế sau 10 phút, gửi email thông báo ngầm.   |
| **Master (Expert)**   | Thiết kế được hệ thống Microservices đồng bộ/bất đồng bộ (RabbitMQ/gRPC), tách biệt kiến trúc bằng CQRS, đạt 80%+ Test Coverage.               | Hệ thống đặt vé tách rời dịch vụ thanh toán chạy độc lập giao tiếp qua RabbitMQ, cấu trúc Monorepo tối ưu. |

---

## 🧠 Technical Challenges & CV Bullets

Dự án này giúp làm nổi bật các kỹ năng kỹ thuật sâu sắc cho vị trí Backend Developer trên CV:

- **Concurrency & Race Condition:** Giải quyết bài toán tranh chấp tài nguyên (đặt trùng ghế) bằng việc khóa dòng bi quan (`SELECT ... FOR UPDATE`) kết hợp hàng đợi xử lý bất đồng bộ.
  - _CV Bullet:_ _"Xây dựng cơ chế giao dịch an toàn (Transaction) tích hợp khóa bi quan (Pessimistic Locking) bằng Drizzle ORM, giải quyết triệt để lỗi đặt trùng ghế (double-booking) khi hệ thống chịu tải cao."_
- **Asynchronous Timeout Workers:** Quản lý vòng đời giữ chỗ tự động qua Redis & BullMQ.
  - _CV Bullet:_ _"Triển khai hàng đợi trì hoãn (Delayed Job Queue) bằng BullMQ & Redis để tự động hóa vòng đời đặt vé, giải phóng ghế giữ chỗ chưa thanh toán sau 10 phút với độ trễ xử lý dưới 50ms."_
