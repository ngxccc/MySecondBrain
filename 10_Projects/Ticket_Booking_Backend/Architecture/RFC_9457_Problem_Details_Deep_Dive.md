---
title: RFC 9457 Problem Details Specification Deep Dive
tags:
  - type/concept
  - topic/tech
  - api-data-design
  - rfc9457
  - error-handling
date: 2026-07-25
---

# RFC 9457 Problem Details Specification Deep Dive

## TL;DR

**RFC 9457** (xuất bản tháng 06/2023, chính thức thay thế RFC 7807) là tiêu chuẩn quốc tế quy định định dạng JSON máy tính đọc được (`application/problem+json`) cho các phản hồi lỗi HTTP API. Chuẩn này giúp loại bỏ sự khác biệt format giữa các loại lỗi (Validation vs Business Logic), giúp Frontend/SDK Client dễ dàng parse và hiển thị thông báo lỗi nhất quán.

---

## Core Concept: Cấu Trúc RFC 9457

RFC 9457 quy định 5 trường cốt lõi (Core Members) và cho phép bổ sung các trường mở rộng (Extension Members):

```json
{
  "type": "https://api.ticketbooking.com/errors/validation-error",
  "title": "Bad Request",
  "status": 400,
  "detail": "Dữ liệu gửi lên không đáp ứng quy tắc kiểm tra",
  "instance": "/api/auth/register",
  "invalidParams": [
    {
      "name": "confirmPassword",
      "reason": "Mật khẩu xác nhận không trùng khớp"
    }
  ],
  "timestamp": "2026-07-25T00:55:00.000Z"
}
```

### 1. Chi Tiết Các Trường Cốt Lõi (Core Members)

| Trường         | Kiểu dữ liệu | Ý nghĩa & Quy chuẩn                                                                                                    |
| :------------- | :----------- | :--------------------------------------------------------------------------------------------------------------------- |
| **`type`**     | `URI`        | Định danh đường dẫn tài liệu mô tả loại lỗi. Nếu không có tài liệu riêng, dùng `"about:blank"` hoặc URI đường dẫn API. |
| **`title`**    | `String`     | Tóm tắt ngắn gọn tên loại lỗi theo chuẩn HTTP (ví dụ: `"Bad Request"`, `"Unauthorized"`, `"Forbidden"`).               |
| **`status`**   | `Number`     | Mã HTTP Status Code gốc (`400`, `401`, `403`, `404`, `500`).                                                           |
| **`detail`**   | `String`     | Câu thông báo lỗi cụ thể, rõ ràng dành riêng cho lần gọi API này (`"Mật khẩu hiện tại không chính xác"`).              |
| **`instance`** | `URI`        | Đường dẫn endpoint API xảy ra lỗi (`"/api/auth/change-password"`).                                                     |

### 2. Các Trường Mở Rộng (Extension Members)

RFC 9457 khuyến nghị mở rộng thêm các trường có giá trị nghiệp vụ:

- **`invalidParams`**: Mảng chứa danh sách các thuộc tính DTO bị lỗi (`name`, `reason`).
- **`timestamp`**: Thời điểm ISO-8601 phát sinh lỗi trên Server.
- **`code`**: Mã enum nội bộ (ví dụ: `"INVALID_CURRENT_PASSWORD"`) hỗ trợ Frontend switch-case đa ngôn ngữ.

### 3. Media Type Chuẩn

Header HTTP Response bắt buộc phải là:

```http
Content-Type: application/problem+json
```

---

## Concrete Examples: Ví Dụ Thực Tế Trong NestJS

### 1. Lỗi Validation DTO (HTTP 400 Bad Request)

```json
{
  "type": "https://api.ticketbooking.com/errors/bad-request",
  "title": "Bad Request",
  "status": 400,
  "detail": "Dữ liệu gửi lên không đúng định dạng",
  "instance": "/api/auth/register",
  "invalidParams": [
    {
      "name": "email",
      "reason": "Email không đúng định dạng"
    },
    {
      "name": "password",
      "reason": "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    }
  ],
  "timestamp": "2026-07-25T00:55:00.000Z"
}
```

### 2. Lỗi Mật Khẩu Đổi Không Đúng (HTTP 401 Unauthorized)

```json
{
  "type": "https://api.ticketbooking.com/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Mật khẩu hiện tại không chính xác",
  "instance": "/api/auth/change-password",
  "invalidParams": [],
  "timestamp": "2026-07-25T00:55:00.000Z"
}
```

---

## Related Notes

- [[Guards_and_CanActivate_Deep_Dive]]
- [[ExecutionContext_and_ArgumentsHost_Deep_Dive]]
- [[PostgreSQL_Locking_and_Concurrency_Deep_Dive]]
