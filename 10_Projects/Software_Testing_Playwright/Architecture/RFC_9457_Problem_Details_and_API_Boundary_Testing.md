---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: RFC 9457 Problem Details schema validation, False Positive mitigation in negative testing, and HTTP 429 Rate Limiting boundary assertions
---

# RFC 9457 Problem Details and API Boundary Testing

## TL;DR

RFC 9457 (Problem Details for HTTP APIs) là chuẩn đặc tả cấu trúc dữ liệu JSON thống nhất cho mọi phản hồi lỗi HTTP (`4xx`, `5xx`). Trong kiểm thử tự động API $20/80$, việc chỉ kiểm tra mã trạng thái (`status === 400`) tạo ra lỗ hổng **False Positive (Báo xanh giả tạo)** nghiêm trọng khi hệ thống lỗi ở tầng khác mà không phải do logic nghiệp vụ. Kiểm thử biên (Boundary Testing) bắt buộc phải xác thực cả mã trạng thái lẫn schema cấu trúc lỗi chi tiết (`invalidParams`, `title`, `detail`) và đo đạc ngưỡng kích hoạt Rate Limiter (`HTTP 429`).

## The False Positive Trap in HTTP Status Assertions

Một lỗi tư duy phổ biến trong kiểm thử API là chỉ viết assertion kiểm tra mã trạng thái:

```typescript
// Anti-pattern: Dễ bị lọt lỗi ngầm (False Positive)
const res = await request.post("/api/v1/bookings", {
  data: { seatRow: "Z99" },
});
expect(res.status()).toBe(400); // RẤT NGUY HIỂM!
```

### Tại sao assertion trên nguy hiểm?

1. **Lỗi khác gây ra mã 400:** Nếu một Middleware Authentication phía trước bị lỗi hoặc header `Content-Type` bị sai khiến NestJS ném ra `400 Bad Request` trước khi code validate `seatRow` kịp chạy, bài test **vẫn PASS** một cách mù quáng!
2. **Logic nghiệp vụ thực tế bị gãy:** Lập trình viên vô tình xóa mất validator `seatRow` ở backend, nhưng bài test vẫn xanh vì một lỗi `400` khác che mắt bộ test runner.

## Anatomy of RFC 9457 Problem Details Schema

Chuẩn RFC 9457 quy định cấu trúc lỗi tiêu chuẩn gồm các trường dữ liệu:

```json
{
  "type": "https://cinema.vn/errors/invalid-boundary-param",
  "title": "Unprocessable Entity or Bad Request",
  "status": 400,
  "detail": "Seat row parameter exceeds the theater boundary (A-M).",
  "instance": "/api/v1/bookings/err-uuid-991",
  "invalidParams": [
    {
      "name": "seatRow",
      "reason": "Value must be a single character between 'A' and 'M'."
    }
  ]
}
```

- **`type` (URI):** Định danh duy nhất phân loại loại lỗi.
- **`title` (String):** Tóm tắt ngắn gọn loại lỗi (dành cho con người đọc).
- **`status` (Number):** Mã HTTP status phản ánh lại header.
- **`detail` (String):** Giải thích chi tiết nguyên nhân cụ thể của lần lỗi này.
- **`invalidParams` (Array):** Chi tiết từng tham số bị vi phạm (cho phép Frontend hiển thị highlight đúng ô input).

## Rate Limiting & Throttler Testing (HTTP 429)

Khi kiểm tra khả năng chịu tải và cơ chế chống DDoS (Rate Limiting):

- Bắt buộc dùng `APIRequestContext` để gửi nhanh hàng loạt requests qua TCP socket pool trong $1 - 2$ giây mà không bị nghẽn RAM do Browser.
- Xác thực ngưỡng kích hoạt chính xác: $N$ requests đầu trả về `200/201`, request thứ $N+1$ trả về `429 Too Many Requests`.
- Kiểm tra các Headers bắt buộc: `Retry-After` (số giây phải chờ) và `X-RateLimit-Remaining: 0`.

## Production 20/80 Boundary & Negative Test Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("API Boundary & RFC 9457 Error Contract", () => {
  test("Phải từ chối và trả về lỗi chuẩn RFC 9457 khi seatRow vượt biên", async ({
    request,
  }) => {
    // 1. Boundary Input: seatRow là ký tự không hợp lệ 'Z'
    const res = await request.post("http://localhost:3000/api/v1/bookings", {
      data: { seatRow: "Z", seatNumber: 100, scheduleId: "sch-101" },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();

    // 2. Strict Schema Assertion (Triệt tiêu False Positive)
    expect(body).toMatchObject({
      status: 400,
      title: expect.any(String),
      detail: expect.stringContaining("seatRow"),
      invalidParams: expect.arrayContaining([
        expect.objectContaining({ name: "seatRow" }),
      ]),
    });
  });

  test("Phải kích hoạt HTTP 429 khi spam vượt ngưỡng Rate Limit", async ({
    request,
  }) => {
    const limit = 50;
    const spamPromises = Array.from({ length: limit + 5 }).map(() =>
      request.get("http://localhost:3000/api/v1/theaters"),
    );

    const responses = await Promise.all(spamPromises);
    const statuses = responses.map((r) => r.status());

    // Có ít nhất các request vượt ngưỡng bị chặn 429
    expect(statuses).toContain(429);

    const rateLimitedRes = responses.find((r) => r.status() === 429);
    expect(rateLimitedRes?.headers()).toHaveProperty("retry-after");
  });
});
```

## Related Notes

- [[APIRequestContext_vs_Browser_Engine]]
- [[Asynchronous_Socket_Flooding_and_Race_Condition_Testing]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[000_Software_Testing_Playwright_MOC]]
