---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Luồng thực thi NestJS Request Lifecycle,
    NestJS Execution Workflow and Lifecycle,
    NestJS Request Flow Order,
  ]
---

# Luồng Thực Thi Chi Tiết Của Một Module Trong NestJS (Request Lifecycle)

## TL;DR

Tài liệu này giải thích chi tiết luồng luân chuyển của một HTTP Request khi đi qua hệ thống NestJS: từ khi Client gửi dữ liệu đến khi nhận về Response. Luồng thực thi tuân theo thứ tự nghiêm ngặt 8 bước: **Incoming Request -> Middleware -> Guards -> Interceptors (Pre) -> Pipes (DTO Validation) -> Controller -> Service (DB Operations) -> Interceptors (Post) -> Exception Filters -> Client Response**.

---

## Sơ Đồ Luồng Thực Thi Chi Tiết (NestJS Request Lifecycle Diagram)

```mermaid
graph TD
    Client[1. Client Request] -->|1. Gửi HTTP Request kèm Headers & Payload| Middleware[2. Middleware / CORS / Body Parser]
    Middleware -->|2. Sau khi Parse Body & Header| Guards[3. Guards / Auth Check]
    Guards -->|3. Hợp lệ Token & Permissions| InterceptorPre[4. Interceptors - Pre Controller]
    InterceptorPre -->|4. Trước khi vào Controller| Pipes[5. Pipes / DTO Validation]
    Pipes -->|5. Payload hợp lệ DTO| Controller[6. Controller Handler]
    Controller -->|6. Chuyển DTO tới Service| Service[7. Service / Business Logic]
    Service -->|7a. Thực hiện SQL Query| Database[(PostgreSQL via Drizzle ORM)]
    Database -->|7b. Trả về Records / Rows| Service
    Service -->|7c. Trả về Dữ liệu nghiệp vụ| Controller
    Controller -->|8. Chuyển kết quả sang Interceptor| InterceptorPost[8. Interceptors - Post Controller]
    InterceptorPost -->|9. Chuẩn hóa JSON Response| Response[Client HTTP Response]

    Guards -- Lỗi Auth 401/403 --> ExceptionFilter[Exception Filter / Error Handler]
    Pipes -- Lỗi Validate DTO 400 --> ExceptionFilter
    Service -- Lỗi Nghiệp vụ 500/409 --> ExceptionFilter
    ExceptionFilter -->|Trả về JSON Lỗi| Response
```

---

## Chi Tiết Thứ Tự 8 Bước Luân Chuyển Trong Module NestJS

### Bước 1: Client gửi Request

Client (Web, Mobile, Postman) gửi một HTTP Request (ví dụ: `POST /auth/login` kèm theo payload JSON `{ email, password }`).

### Bước 2: Middleware Layer (Tầng Middleware)

- **Nhiệm vụ:** Xử lý thô các yêu cầu mạng trước khi đi vào hệ thống NestJS.
- **Ví dụ phổ biến:** CORS, Body Parser (`express.json()`), Cookie Parser, Logging Middleware.

### Bước 3: Guards Layer (Tầng Bảo vệ & Phân quyền)

- **Nhiệm vụ:** Kiểm tra xem Client có đủ quyền để truy cập Router Handler hay không.
- **Ví dụ phổ biến:** `JwtAuthGuard` (xác thực Token), `RolesGuard` (phân quyền Admin/User).
- **Kết quả:** Nếu không hợp lệ -> Ném lỗi `401 Unauthorized` hoặc `403 Forbidden` ngay lập tức và dừng luồng.

### Bước 4: Interceptors - Pre Controller (Tầng Can thiệp trước)

- **Nhiệm vụ:** Can thiệp vào luồng xử lý trước khi Controller nhận request.
- **Ví dụ phổ biến:** Logging thời gian bắt đầu request, Cache Interceptor (nếu có cache sẵn -> trả về luôn không cần chạy Controller).

### Bước 5: Pipes Layer (Tầng Transform & Validate DTO)

- **Nhiệm vụ:**
  1. Biến đổi dữ liệu (Transform: ví dụ chuyển chuỗi `"123"` thành `number 123`).
  2. Xác minh dữ liệu đầu vào (Validation: sử dụng `ValidationPipe` với `class-validator` / `zod`).
- **Kết quả:** Nếu payload sai DTO -> Ném lỗi `400 Bad Request` chứa chi tiết các trường bị sai.

### Bước 6: Controller (Tầng Định tuyến API)

- **Nhiệm vụ:** Định nghĩa Endpoint (`@Post('login')`), nhận DTO hợp lệ từ Pipes và chuyển dữ liệu tới Service xử lý.
- **Quy tắc:** Controller **không chứa logic nghiệp vụ**, chỉ làm nhiệm vụ điều phối.

### Bước 7: Service & Database Layer (Tầng Logic Nghiệp vụ & Dữ liệu)

- **Nhiệm vụ:**
  1. Thực hiện tính toán, kiểm tra nghiệp vụ (Check email tồn tại, so sánh Hash Password).
  2. Tương tác với Database thông qua `DrizzleDB` (`DATABASE_CONNECTION`).
  3. Trả về kết quả cho Controller.

### Bước 8: Interceptors - Post Controller & Response (Tầng Chuyển đổi dữ liệu trả về)

- **Nhiệm vụ:** Chuẩn hóa cấu trúc Response trả về (Response Formatting) hoặc tính toán tổng thời gian thực thi (Execution Time).
- **Ví dụ trả về:** Trả về HTTP 200 OK với Payload `{ accessToken, refreshToken }`.

---

## Tầng Xử Lý Lỗi Trung Tâm (Exception Filters)

Nếu tại bất kỳ bước nào (Guard, Pipe, Service) xảy ra Exception/Error:

- Luồng thực thi bình thường dừng lại ngay lập tức.
- Exception nhảy sang **Exception Filter** (`HttpExceptionFilter`).
- Format lại lỗi thành JSON chuẩn dạng:

  ```json
  {
    "statusCode": 400,
    "message": [
      "Email không đúng định dạng",
      "Mật khẩu phải có ít nhất 8 ký tự"
    ],
    "error": "Bad Request",
    "timestamp": "2026-07-05T10:00:00.000Z"
  }
  ```

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Chiến lược phân tách Auth WBS: [[Auth_WBS_Deconstruction]]
- Đặc tả kiến trúc hệ thống: [[Architecture_and_Spec]]
- Kiến trúc đa giao thức Hybrid: [[Hybrid_Architecture_Strategy]]
