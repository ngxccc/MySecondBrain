---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Test data lifecycle management, cross-worker state contamination mitigation, and guaranteed fixture teardown architecture in Playwright API testing
---

# API Test Data Lifecycle and State Isolation

## TL;DR

State Contamination (Lẫn lộn và ô nhiễm dữ liệu) là nguyên nhân hàng đầu gây ra lỗi chập chờn (**Order-dependent Flaky Test**) khi chạy test song song trên CI/CD. Việc sử dụng dữ liệu tĩnh hardcode (Static Seed) dẫn đến tranh chấp tài nguyên giữa các Worker, trong khi việc viết code dọn dẹp (Cleanup) thủ công ở cuối hàm `test` sẽ bị bỏ qua khi `expect()` ném lỗi. Giải pháp $20/80$ chuẩn mực là kết hợp **Dynamic Data Factory** (tạo dữ liệu độc nhất theo UUID/Timestamp) và **Playwright Custom Fixtures Teardown** (`use()` pattern) để đảm bảo $100\%$ rác dữ liệu được dọn sạch kể cả khi bài test bị crash.

## The Hardcoded Seed Trap (Bẫy dữ liệu tĩnh)

Khi các bài test dùng chung các bản ghi tĩnh được nạp sẵn trong Database:

```text
[Worker 1: Chạy Test Xóa Suất Chiếu]         [Worker 2: Chạy Test Đặt Vé]
                │                                         │
                ├── DELETE /schedules/sch-01              │
                │   (Đã xóa sch-01 trong DB!)             ├── POST /bookings { scheduleId: 'sch-01' }
                │                                         │   ──▶ Trả về 404 Not Found (FAIL!)
                ▼                                         ▼
```

- **Hậu quả:** Test 2 bị FAIL ngẫu nhiên dù logic đặt vé hoàn toàn đúng. Khi chạy riêng lẻ ở local thì XANH (PASS), nhưng đẩy lên CI chạy song song đa luồng thì ĐỎ (FAIL).

## The "Dangling Garbage" Flaw (Lỗ hổng rác trôi nổi)

Viết code cleanup thủ công ở cuối bài test là một Anti-pattern nguy hiểm:

```typescript
// Anti-pattern: Dọn dẹp thủ công ở cuối test
test("Kiểm thử tạo đơn hàng", async ({ request }) => {
  const order = await createOrder(request); // 1. DB ĐÃ TẠO ĐƠN HÀNG THÀNH CÔNG

  expect(order.totalPrice).toBe(500000); // 2. GIẢ SỬ GIÁ TIỀN TÍNH SAI -> NÉM AssertionError!

  await deleteOrder(request, order.id); // 3. DÒNG NÀY VĨNH VIỄN KHÔNG ĐƯỢC CHẠY!
});
```

- Khi câu lệnh `expect()` bị vi phạm, Test Runner ném ra ngoại lệ `AssertionError` và **lập tức hủy luồng thực thi** của hàm test.
- Dòng `deleteOrder` bên dưới bị bỏ qua, để lại bản ghi rác vĩnh viễn trong Database, làm kẹt ghế rạp chiếu và làm gãy các bài test kế tiếp.

## Playwright Fixture Teardown Architecture

Playwright giải quyết triệt để bài toán này bằng từ khóa **`use()`** trong Custom Fixture. Cơ chế này hoạt động tương tự như khối `try...finally` ở cấp độ kiến trúc Framework:

```text
[Bắt đầu bài Test] ──▶ 1. Setup Data: Tạo dữ liệu động độc nhất
                             │
                             ▼
                        2. use(testData) ──▶ Nhường quyền kiểm soát cho hàm test chạy
                             │
                             ▼ (Test chạy Xong HOẶC Bị Crash / Assertion Fail)
                        3. Teardown: Luồng quay lại đây để dọn dẹp 100% rác trong DB
```

## Production 20/80 Auto-Cleanup Fixture Pattern

```typescript
import { test as base, expect, APIRequestContext } from "@playwright/test";
import { randomUUID } from "crypto";

interface TestMovie {
  id: string;
  title: string;
}

// 1. Mở rộng test runner với Custom Fixture có sẵn Teardown
export const test = base.extend<{ dynamicMovie: TestMovie }>({
  dynamicMovie: async ({ request }, use) => {
    // --- SETUP PHASE: Tạo dữ liệu động độc nhất ---
    const uniqueTitle = `Movie_${Date.now()}_${randomUUID().slice(0, 8)}`;
    const res = await request.post("http://localhost:3000/api/v1/movies", {
      data: { title: uniqueTitle, durationMin: 120 },
    });
    const movie = await res.json();

    // --- EXECUTE PHASE: Chuyển dữ liệu cho bài test ---
    await use(movie);

    // --- TEARDOWN PHASE: Đảm bảo luôn dọn dẹp kể cả khi test FAIL ---
    await request.delete(`http://localhost:3000/api/v1/movies/${movie.id}`);
  },
});

// 2. Sử dụng trong bài test (Code sạch, không cần tự viết cleanup)
test("Kiểm thử cập nhật thông tin phim", async ({ request, dynamicMovie }) => {
  const updateRes = await request.patch(
    `http://localhost:3000/api/v1/movies/${dynamicMovie.id}`,
    {
      data: { durationMin: 150 },
    },
  );
  expect(updateRes.status()).toBe(200);
});
```

## Related Notes

- [[APIRequestContext_vs_Browser_Engine]]
- [[Browser_Context_Isolation]]
- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[000_Software_Testing_Playwright_MOC]]
