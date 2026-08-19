---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Real-time WebSocket and Server-Sent Events (SSE) interception, mock frame injection, and live streaming testing in Playwright
---

# Real Time WebSocket and SSE Mocking Mechanics

## TL;DR

Các ứng dụng hiện đại ngày càng phụ thuộc vào luồng dữ liệu thời gian thực (Real-time Streaming) như WebSocket hai chiều (Chat, Đặt ghế rạp phim thời gian thực) và Server-Sent Events (SSE - Đẩy thông báo, luồng AI Token Streaming). Trong khi cơ chế `page.route()` truyền thống chỉ chặn bắt được các request HTTP ngắn hạn một chiều, Playwright cung cấp API chuyên dụng **`page.routeWebSocket()`** cho phép can thiệp trực tiếp vào kết nối WebSocket ở cấp độ frame: chặn frame từ client, sửa đổi frame từ server, hoặc chủ động bắn các sự kiện nhân tạo (Synthetic Event Injection) để kiểm thử phản ứng của giao diện mà không cần phụ thuộc vào server thật.

## WebSocket Interception vs HTTP Mocking Architecture

```text
[HTTP Mocking: page.route()]
Browser ──(HTTP GET/POST Request)──▶ [Playwright Route Interceptor] ──▶ Mock Response JSON
* Hạn chế: Kết nối đóng ngay sau 1 chu kỳ Request-Response.

─────────────────────────────────────────────────────────────────────────────

[WebSocket Interception: page.routeWebSocket()]
┌──────────────────┐                               ┌──────────────────┐
│ Browser Window   │                               │ Backend Server   │
│ (Client App)     │                               │ (WS Gateway)     │
└────────┬─────────┘                               └────────▲─────────┘
         │                                                  │
         ▼                                                  ▼
   [ws.send(msg)]                                   [server.send(msg)]
         │                                                  │
         └─────────────────┐                      ┌─────────┘
                           ▼                      ▼
                    ┌────────────────────────────────────┐
                    │ Playwright WebSocketRoute          │
                    │ ├── 1. onMessage(): Chặn frame đi  │
                    │ ├── 2. route.send(): Bắn frame giả │
                    │ └── 3. route.close(): Giả lập rớt  │
                    └────────────────────────────────────┘
```

## Practical Scenario: Kiểm Thử Giữ Ghế Thời Gian Thực (Live Seat Holding)

### Bài toán:

Khi Người dùng A đang xem sơ đồ rạp, một Người dùng B ở nơi khác bấm giữ ghế `VIP-A12`. Backend phát đi thông báo WebSocket `{"event": "SEAT_LOCKED", "seatId": "VIP-A12"}`. Giao diện của Người dùng A phải lập tức đổi màu ghế `VIP-A12` sang màu xám và vô hiệu hóa nút bấm.

### Giải pháp dùng `page.routeWebSocket()`:

Bài test không cần mở 2 trình duyệt thật, chỉ cần dùng Playwright để "bơm" một frame WebSocket giả lập vào ứng dụng:

```typescript
// tests/e2e/live_seat_holding.spec.ts
import { test, expect } from "@playwright/test";

test("Giao diện cập nhật trạng thái ghế xám khi nhận event WebSocket SEAT_LOCKED", async ({
  page,
}) => {
  // 1. Chặn bắt kết nối WebSocket tới cổng socket của hệ thống rạp
  await page.routeWebSocket("**/socket.io/*", (ws) => {
    // Kết nối tới server thật nhưng lắng nghe và can thiệp
    const server = ws.connectToServer();

    // Giả lập sau 2 giây server phát tín hiệu có người khác vừa giữ ghế VIP-A12
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          event: "SEAT_LOCKED",
          payload: {
            seatId: "seat-VIP-A12",
            lockedBy: "another-user@gmail.com",
            expiresIn: 300,
          },
        }),
      );
    }, 2000);
  });

  // 2. Mở trang chọn ghế
  await page.goto("/schedules/sched-101/seats");

  const seatA12 = page.getByRole("button", { name: "Ghế VIP A12" });

  // Ban đầu ghế vẫn khả dụng
  await expect(seatA12).toBeEnabled();

  // Sau 2s nhận event WebSocket giả lập: Ghế tự động bị disabled và đổi class
  await expect(seatA12).toBeDisabled({ timeout: 5000 });
  await expect(seatA12).toHaveClass(/seat-locked/);
});
```

## Key Capabilities of WebSocketRoute API

1. **Synthetic Message Injection (`ws.send`):** Bơm các bản tin giả định (báo lỗi rớt mạng, thông báo khuyến mãi, đổi giá vé tức thì).
2. **Message Modification:** Chặn frame gửi từ client lên để sửa đổi payload trước khi chuyển tiếp tới server thật.
3. **Simulating Network Drops (`ws.close`):** Chủ động ngắt kết nối WebSocket bất thình lình với mã lỗi `1006 (Abnormal Closure)` để kiểm tra tính năng tự động kết nối lại (**Auto-reconnect with Exponential Backoff**) của Frontend.

## Related Notes

- [[Network_Interception_and_Mocking_Mechanics]]
- [[Asynchronous_Socket_Flooding_and_Race_Condition_Testing]]
- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[000_Software_Testing_Playwright_MOC]]
