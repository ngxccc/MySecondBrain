---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, asynchronous socket flooding mechanics, and Definition of Done for WBS 2.2 - High-Contention Concurrency & Redis Redlock
---

# WBS 2.2: API Test Suite - High-Contention Concurrency and Redis Redlock

## Metadata

- **WBS Code:** `2.2`
- **Task Name:** API Ca 2: High-Contention Concurrency & Redis Redlock Race Condition Test
- **Assignee:** Trần Văn Ngọc (MSSV: 0306241131)
- **Task Weight:** `7.5%`
- **Deliverable Artifacts:** File mã nguồn `tests/api/concurrency.spec.ts`, Pull Request GitHub, Mục 3.2 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử API Ca 2: Kiểm thử điều kiện chạy đua (Race Condition) và tranh chấp tài nguyên cao độ (High-Contention Concurrency) trong hệ thống đặt vé. Áp dụng kỹ thuật Asynchronous Socket Flooding với `Promise.all()` để bắn đồng thời $N$ request giữ chỗ trên cùng một mã ghế duy nhất, kiểm chứng cơ chế khóa phân tán Redis Redlock / Pessimistic Locking ngăn ngừa $100\%$ hiện tượng đặt trùng vé (Double-booking).

## Core Architectural Content to Implement

### 1. Bản Chất Kỹ Thuật: Bài Toán Race Condition & Double-Booking

```text
Time (ms)   User 1 (Request 1)              User 2 (Request 2)              Database / Redis
---------   ------------------              ------------------              ----------------
  T0        SELECT status FROM seats (FREE)                                 Seat A12: FREE
  T1                                        SELECT status FROM seats (FREE) Seat A12: FREE
  T2        UPDATE seats SET status=HELD                                    Seat A12: HELD (User 1)
  T3                                        UPDATE seats SET status=HELD    Seat A12: HELD (User 2 - DOUBLE BOOKING!)
```

- **Lỗi Naive Check:** Nếu Backend chỉ kiểm tra trạng thái trước khi cập nhật mà không có cơ chế khóa (Locking), hai luồng xử lý song song sẽ cùng đọc thấy ghế đang rỗng và cùng ghi đè quyền sở hữu $\to$ Thảm họa Double-booking.
- **Cơ chế Khóa Phân Tán (Redis Redlock / DB Pessimistic Lock):**
  - Trước khi đọc hoặc ghi, tiến trình phải giành được khóa duy nhất trên Key `lock:seat:A12`.
  - Luồng đến trước giữ khóa $\to$ Thành công (`HTTP 200/201`).
  - Toàn bộ luồng đến sau không thể lấy khóa $\to$ Bị từ chối ngay lập tức (`HTTP 409 Conflict`).

### 2. Kỹ Thuật Asynchronous Socket Flooding Với `Promise.all()`

```typescript
// tests/api/concurrency.spec.ts
import { test, expect } from "@playwright/test";

test("Concurrent Seat Booking Race Condition Test", async ({ request }) => {
  const targetSeatId = "SEAT-VIP-A12";
  const totalConcurrentUsers = 10;

  // Tao mang 10 requests dong thoi voi 10 User Tokens khac nhau
  const requests = Array.from({ length: totalConcurrentUsers }, (_, i) => {
    return request.post(`/api/v1/seats/${targetSeatId}/hold`, {
      data: { userId: `user_${i + 1}`, holdDurationSeconds: 60 },
    });
  });

  // Ban dong thoi 10 requests vao cung 1 thoi diem qua Promise.all
  const responses = await Promise.all(requests);
  const statusCodes = responses.map((res) => res.status());

  // Kiem tra bat bien toan hoc:
  const successCount = statusCodes.filter(
    (code) => code === 200 || code === 201,
  ).length;
  const conflictCount = statusCodes.filter((code) => code === 409).length;

  expect(successCount).toBe(1); // Dung duy nhat 1 nguoi dat duoc ghe!
  expect(conflictCount).toBe(totalConcurrentUsers - 1); // 9 nguoi con lai nhan 409 Conflict
});
```

### 3. Các Điều Kiện Biên Bắt Buộc Kiểm Tra (Boundary Checks)

1. **Tính nguyên tử của giao dịch (Atomicity):** Số lượng bản ghi `Booking` được tạo ra trong cơ sở dữ liệu phải đúng bằng 1.
2. **Khôi phục trạng thái sau khi hết hạn Lock (TTL Expiration):** Khi User giữ ghế không thanh toán sau 60 giây, khóa Redis tự động giải phóng và ghế trở lại trạng thái `FREE` cho người khác đặt.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `tests/api/concurrency.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test tests/api/concurrency.spec.ts --project=api` pass $100\%$.
  - [ ] Xác nhận tỷ lệ Double-booking là $0.00\%$ trên tối thiểu 10 requests đồng thời.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-2.2-api-concurrency-redlock`.
  - [ ] Tạo Pull Request trên GitHub với mô tả chi tiết, phân tích log HTTP status codes và ảnh chụp kết quả test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.2 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Asynchronous_Socket_Flooding_and_Race_Condition_Testing]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
