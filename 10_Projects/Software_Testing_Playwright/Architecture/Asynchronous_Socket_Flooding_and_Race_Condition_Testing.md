---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Asynchronous socket flooding via Promise.all, Check-Then-Act TOCTOU race condition testing, and Redis Redlock validation in Playwright
---

# Asynchronous Socket Flooding and Race Condition Testing

## TL;DR

Asynchronous Socket Flooding là kỹ thuật kiểm thử $20/80$ tận dụng cơ chế Non-blocking I/O của Node.js kết hợp với `Promise.all()` trên `APIRequestContext` để bắn đồng loạt hàng chục/hàng trăm HTTP requests trong cùng một mili-giây. Kỹ thuật này dùng để tái hiện và bẻ gãy các lỗi tương tranh **Race Condition (Check-Then-Act / TOCTOU)** trên Backend, kiểm chứng tính đúng đắn của cơ chế khóa phân tán [[Redis_Redlock]] hoặc Database Pessimistic Locking (`SELECT FOR UPDATE`).

## The Check-Then-Act (TOCTOU) Concurrency Flaw

Trong hệ thống bán vé xem phim `ticket-booking`, bài toán sinh tử là ngăn chặn **Double Booking (Bán trùng 1 ghế VIP cho 2 người khác nhau)**.

Khi lập trình viên Backend viết code kiểm tra tuần tự ngây thơ:

```typescript
// Anti-pattern: Check-Then-Act Flaw
const seat = await db.findSeat(seatId); // 1. Check trạng thái ghế
if (seat.isBooked) {
  throw new ConflictException("Ghế đã bị đặt");
}
await db.bookSeat(seatId, userId); // 2. Act: Đặt ghế và trừ tiền
```

Khi có $10$ requests ập vào cùng lúc:

```text
Req 1 (User A): ─── findSeat(A10) -> isBooked=false ──[Pass IF]────────────────▶ bookSeat(A10, User A)
Req 2 (User B): ─── findSeat(A10) -> isBooked=false ──[Pass IF]────────▶ bookSeat(A10, User B)
...
Req 10 (User J): ── findSeat(A10) -> isBooked=false ──[Pass IF]─▶ bookSeat(A10, User J)
```

**Hậu quả:** Cả 10 requests đều đọc được trạng thái ghế còn trống tại thời điểm `Check`, do đó cả 10 đều vượt qua điều kiện `if` và cùng thực hiện `Act`. Ghế bị ghi đè bởi User cuối cùng hoặc tạo ra 10 vé trùng lặp trong khi cả 10 người đều bị trừ tiền tài khoản.

## Non-Blocking Socket Flooding Mechanics

Khi chạy `Promise.all()` kết hợp `request.post()`:

1. **Khởi tạo đồng thời:** Vòng lặp `Array.map` tạo ra $N$ Promises ngay trong một Event Loop tick.
2. **Bắn đồng loạt ở tầng OS:** Node.js mở $N$ TCP Sockets và đẩy liên tiếp các gói tin HTTP qua card mạng mà không chờ đợi bất kỳ response nào quay về.
3. **Thách thức Backend:** Máy chủ backend nhận được $N$ request trong khoảng sai lệch vài mili-giây, ép luồng xử lý của database và lock engine phải đối mặt với xung đột tương tranh thực tế.

## Validating Concurrency Defenses

Một hệ thống backend đạt chuẩn bắt buộc phải sử dụng một trong hai cơ chế phòng thủ:

- **Tầng Ứng Dụng (Distributed Cache):** Dùng [[Redis_Redlock]] (`SET seat:A10:lock "token" NX PX 5000`) để khóa tài nguyên trước khi chạm vào Database.
- **Tầng Cơ Sở Dữ Liệu (Pessimistic Lock):** Dùng [[Postgres_Select_For_Update_Pessimistic_Locking]] (`SELECT * FROM seats WHERE id = $1 FOR UPDATE`) để khóa dòng dữ liệu tại engine InnoDB/PostgreSQL.

## Production 20/80 Concurrency Test Pattern

```typescript
import { test, expect } from "@playwright/test";

test("Kiểm thử chống Overbooking (Race Condition) trên ghế VIP", async ({
  request,
}) => {
  const targetSeatId = "seat-vip-G12";
  const concurrentUsers = 10;

  // 1. Flooding: Bắn đồng thời 10 request đặt cùng 1 ghế
  const bookingPromises = Array.from({ length: concurrentUsers }).map(
    (_, index) =>
      request.post("http://localhost:3000/api/v1/bookings", {
        data: {
          seatId: targetSeatId,
          userId: `stress-test-user-${index}`,
        },
      }),
  );

  const responses = await Promise.all(bookingPromises);
  const statusCodes = responses.map((res) => res.status());

  // 2. Invariants Assertion (Tính bất biến bắt buộc):
  // - Duy nhất 1 người thành công (HTTP 201 Created)
  // - Đúng 9 người còn lại bị từ chối do xung đột (HTTP 409 Conflict)
  const successCount = statusCodes.filter((code) => code === 201).length;
  const conflictCount = statusCodes.filter((code) => code === 409).length;

  expect(successCount).toBe(1);
  expect(conflictCount).toBe(concurrentUsers - 1);
});
```

## Related Notes

- [[APIRequestContext_vs_Browser_Engine]]
- [[Redis_Redlock]]
- [[Postgres_Select_For_Update_Pessimistic_Locking]]
- [[000_Software_Testing_Playwright_MOC]]
