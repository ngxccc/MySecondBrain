---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Protocol-level network interception, mock routing pipeline, and the CDP Fetch domain mechanics in Playwright
---

# Network Interception and Mocking Mechanics

## TL;DR

Network Interception (`page.route`) là cơ chế của Playwright cho phép can thiệp, biến đổi hoặc giả lập (Mock) các yêu cầu mạng trực tiếp tại **tầng giao thức trình duyệt (Protocol Level)** mà không cần dựng HTTP Proxy Server ngoài. Dựa trên domain **`Fetch`** của Chrome DevTools Protocol (CDP), Browser Engine sẽ tạm dừng (Pause) request ngay trong RAM trước khi gửi ra card mạng và nhận dữ liệu phản hồi giả lập tức thì từ Node.js.

## Why Protocol-Level Mocking Matters

1. **Kiểm thử biên & Lỗi hiểm (Edge-case Failure Injection):** Dễ dàng giả lập các sự cố hệ thống nghiêm trọng (HTTP 500 Server Error, Gateway Timeout 504, lỗi sập cổng thanh toán PayOS/VNPay) mà không cần can thiệp vào backend thật.
2. **Tăng tốc độ chạy test gấp 10 lần:** Chặn tải toàn bộ tài nguyên tĩnh không cần thiết (`.png`, `.jpg`, `.woff2`, video nền) giúp giảm $90\%$ thời gian tải trang và tiết kiệm băng thông CI/CD.
3. **Không cần Proxy trung gian:** Khác với Selenium phải cấu hình proxy ngoài (như BrowserMob Proxy) phức tạp và làm chậm kết nối, Playwright can thiệp nội tại ngay trong render process của browser.

## The CDP `Fetch` Domain Pipeline

Mọi thao tác `page.route` đều vận hành theo chuỗi lệnh CDP đồng bộ 4 bước:

```text
[Node.js Test Script]                      [Chromium Browser Engine]
         │                                             │
         │─── 1. SEND: {"method": "Fetch.enable"} ────▶│ (Kích hoạt bộ chặn mạng)
         │                                             │
         │                                             │ (Web app gọi fetch('/api/pay'))
         │                                             │ [Tạm dừng request tại RAM]
         │◀── 2. RECV: {"method": "Fetch.requestPaused"}│
         │                                             │
         │ (Chạy callback trong page.route)            │
         │                                             │
         │─── 3. SEND: Fetch.fulfillRequest ──────────▶│ (Bắn ngược status: 500, body)
         │       (hoặc Fetch.failRequest / continue)   │
         │                                             │
         ▼                                             ▼ (Trả data cho Web JS như server thật)
```

### 1. Kích hoạt bộ chặn (`Fetch.enable`)

Khi gọi `page.route('**/api/**', handler)`, Playwright gửi lệnh `Fetch.enable` qua WebSocket yêu cầu Chromium chặn tất cả URL khớp với pattern.

### 2. Tạm dừng yêu cầu (`Fetch.requestPaused`)

Khi mã JavaScript trong trang web gọi `fetch()` hoặc `axios.post()`, Chromium dừng request lại ngay trước khi mở socket TCP và đẩy một event `Fetch.requestPaused` kèm đầy đủ Headers/Body về cho Node.js.

### 3. Phản hồi chỉ thị từ Test Runner

Tùy vào hàm lập trình viên gọi trong callback:

- **`route.fulfill({ status, body })` $\to$ `Fetch.fulfillRequest`:** Trình duyệt trả data giả lập về cho Web App ngay tại RAM. Request **không bao giờ rời khỏi máy tính**.
- **`route.abort()` $\to$ `Fetch.failRequest`:** Hủy request với mã lỗi mạng (ví dụ `BlockedByClient`), ngăn chặn tải file nặng.
- **`route.continue({ headers })` $\to$ `Fetch.continueRequest`:** Cho phép request tiếp tục đi ra ngoài Internet, có thể sửa đổi Header (như chèn Bearer Token) trước khi gửi.

## Real-World 20/80 High-Yield Code Snippets

```typescript
// 1. Mock sập cổng thanh toán (Test UI hiện thông báo lỗi)
await page.route("**/api/v1/checkout", async (route) => {
  await route.fulfill({
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ error: "PAYMENT_GATEWAY_DOWN" }),
  });
});

// 2. Chặn toàn bộ ảnh để tăng tốc test suite trên CI
await page.route("**/*.{png,jpg,jpeg,svg,webp}", (route) => route.abort());

// 3. Chèn Authorization Header giả lập vào request thật
await page.route("**/api/**", async (route) => {
  const headers = {
    ...route.request().headers(),
    "X-Test-Id": "automation-run-101",
  };
  await route.continue({ headers });
});
```

## Related Notes

- [[Chrome_DevTools_Protocol_Mechanics]]
- [[Browser_Automation_IPC_Fundamentals]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[000_Software_Testing_Playwright_MOC]]
