---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Service Object Model architectural pattern, API client layer encapsulation, and robust multi-step API request chaining in Playwright
---

# Service Object Model and API Request Chaining

## TL;DR

Service Object Model (SOM) là mô hình thiết kế $20/80$ dành cho tầng API Testing (tương tự Page Object Model của tầng UI), đóng vai trò gom cụm toàn bộ các lời gọi HTTP thô và cấu trúc Header/Endpoint theo từng Domain nghiệp vụ (`AuthService`, `BookingService`, `TheaterService`). Kỹ thuật này triệt tiêu hoàn toàn sự phân tán của URL rải rác trong các bài test, đồng thời kết hợp với **API Request Chaining** (chuỗi yêu cầu phụ thuộc) để chuyển tiếp trạng thái dữ liệu (State Propagation: Token $\to$ Schedule $\to$ Ticket) một cách an toàn và ngăn chặn lỗi sụp đổ dây chuyền (**Cascading Failures**).

## The Scattered API Calls Anti-pattern vs SOM

Khi viết test gọi trực tiếp `request.post('/api/v1/...')` trong từng file test:

```text
[Không Dùng SOM: Gọi HTTP Rải Rác]
Test 1: request.post('http://localhost:3000/api/v1/schedules', { ... })
Test 2: request.post('http://localhost:3000/api/v1/schedules', { ... })
...
Test 30: request.post('http://localhost:3000/api/v1/schedules', { ... })
===> Khi đổi endpoint thành /api/v2/showtimes: Phải sửa thủ công ở 30 file!

─────────────────────────────────────────────────────────────────────────────

[Dùng Service Object Model (SOM)]
Class ScheduleService {
  async create(dto) { return this.request.post('/api/v2/showtimes', { data: dto }); }
}
===> Khi đổi endpoint hoặc Header: Sửa DUY NHẤT 1 dòng trong ScheduleService.ts!
```

## Architecture of Service Object Model (SOM)

Một kiến trúc SOM chuẩn gồm 3 lớp:

1. **Lớp Base API Client:** Quản lý `APIRequestContext`, xử lý Base URL, tự động gắn Header xác thực (`Authorization: Bearer ...`), logging khi fail.
2. **Lớp Domain Services:** Đại diện cho từng tài nguyên (`AuthService`, `MovieService`, `BookingService`), chứa các hàm nghiệp vụ có định kiểu TypeScript (DTO).
3. **Lớp Test Script:** Chỉ tập trung vào kịch bản kiểm thử và assertions, không quan tâm chi tiết kỹ thuật HTTP bên dưới.

## API Request Chaining & State Propagation Pipeline

Trong các kịch bản kiểm thử tích hợp (End-to-End API Flow), đầu ra của bước trước là đầu vào của bước sau:

```text
[1. AuthService.login()] ──▶ Trích xuất: accessToken
          │
          ▼
[2. MovieService.create(token)] ──▶ Trích xuất: movieId
          │
          ▼
[3. ScheduleService.create(movieId, token)] ──▶ Trích xuất: scheduleId
          │
          ▼
[4. BookingService.reserve(scheduleId, token)] ──▶ Assert: HTTP 201 & Ticket ID
```

### Xử lý lỗi sụp đổ dây chuyền (Cascading Failure):

- **Nguy cơ:** Nếu Bước 2 bị lỗi nhưng không dừng lại, Bước 3 sẽ nhận `movieId = undefined` $\to$ ném ra lỗi `400 Bad Request` hoặc `TypeError` khó hiểu, làm sai lệch nguyên nhân gốc của lỗi (Root Cause).
- **Giải pháp:** Từng phương thức trong SOM phải áp dụng cơ chế **Fail-Fast Assertion**: Kiểm tra và validate status/schema ngay tại thời điểm thực hiện trước khi trích xuất dữ liệu trả về cho bước tiếp theo.

## Production 20/80 SOM Code Pattern

```typescript
// services/booking.service.ts
import { APIRequestContext, expect } from "@playwright/test";

export interface ReserveSeatDto {
  scheduleId: string;
  seatId: string;
}

export class BookingService {
  constructor(private request: APIRequestContext) {}

  async reserveSeat(dto: ReserveSeatDto, token: string) {
    const res = await this.request.post(
      "http://localhost:3000/api/v1/bookings",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: dto,
      },
    );

    // Fail-fast assertion: Ngăn chặn lỗi dây chuyền
    expect(res.status(), `Lỗi đặt ghế tại schedule ${dto.scheduleId}`).toBe(
      201,
    );
    return res.json();
  }
}
```

```typescript
// tests/integration/booking_flow.spec.ts
import { test, expect } from "@playwright/test";
import { AuthService } from "../../services/auth.service";
import { BookingService } from "../../services/booking.service";
import { ScheduleService } from "../../services/schedule.service";

test("Luồng đặt vé xem phim End-to-End qua API", async ({ request }) => {
  const auth = new AuthService(request);
  const scheduleService = new ScheduleService(request);
  const bookingService = new BookingService(request);

  // 1. Chaining có kiểm soát
  const { token } = await auth.login("customer@cinema.vn", "Pass123");
  const { scheduleId } = await scheduleService.createQuickSchedule(token);
  const booking = await bookingService.reserveSeat(
    { scheduleId, seatId: "seat-VIP-01" },
    token,
  );

  // 2. Assert kết quả cuối cùng
  expect(booking).toMatchObject({
    ticketId: expect.any(String),
    status: "CONFIRMED",
  });
});
```

## Related Notes

- [[APIRequestContext_vs_Browser_Engine]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Automated_JSON_Schema_and_Contract_Drift_Validation]]
- [[000_Software_Testing_Playwright_MOC]]
