---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Hybrid authentication strategy, storageState JSON anatomy, and pre-navigation context state injection in Playwright
---

# Hybrid Auth and Storage State Injection

## TL;DR

Hybrid State Injection là chiến lược tối ưu kiểm thử $20/80$ bằng cách thực hiện xác thực (Authentication) qua **HTTP API** (tốn $< 20\text{ms}$) thay vì đăng nhập qua UI Form (tốn $3000\text{ms}$). Trạng thái phiên làm việc (Cookies và LocalStorage) được trích xuất thành file JSON `storageState` và **nạp thẳng (Inject)** vào RAM của `BrowserContext` **trước khi tải trang**, giúp hàng trăm bài test UI kiểm tra tính năng nội bộ mà không cần lặp lại thao tác đăng nhập.

## The Naive UI Login Anti-pattern vs Hybrid Injection

Trong một dự án thực tế với $100$ bài test kiểm thử các tính năng sau đăng nhập (quản lý rạp, đặt vé, đổi thông tin cá nhân):

```text
[Cách làm ngây thơ (Anti-pattern): Đăng nhập qua UI lặp lại]
Test 1: Mở Browser ──▶ Điền Email/Pass ──▶ Bấm Login ──▶ Đợi Reload ──▶ Test Đổi Mật Khẩu (3.5s)
Test 2: Mở Browser ──▶ Điền Email/Pass ──▶ Bấm Login ──▶ Đợi Reload ──▶ Test Xem Lịch Sử (3.5s)
...
Test 100: Mở Browser ──▶ Điền Email/Pass ──▶ Bấm Login ──▶ Đợi Reload ──▶ Test Hủy Vé (3.5s)
===> Tổng thời gian lãng phí cho thao tác Login: 350 giây (~6 phút)

─────────────────────────────────────────────────────────────────────────────

[Giải pháp 20/80: Hybrid Auth + Storage State Injection]
Setup Project: Gửi 1 API POST /auth/login (10ms) ──▶ Lưu storageState.json
Test 1..100: Khởi tạo Context với storageState đã nạp sẵn ──▶ Vào thẳng trang cần test (0.2s)
===> Tiết kiệm 95% thời gian chạy CI/CD và triệt tiêu lỗi Flaky do Form Login mạng chậm.
```

## Anatomy of `storageState.json`

File `storageState` được cấu trúc thành 2 khối dữ liệu phiên làm việc cốt lõi:

```json
{
  "cookies": [
    {
      "name": "connect.sid",
      "value": "s%3A7aBc...xyz",
      "domain": "localhost",
      "path": "/",
      "expires": 1755129600,
      "httpOnly": true,
      "secure": false,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "http://localhost:3000",
      "localStorage": [
        {
          "name": "access_token",
          "value": "eyJhbGciOiJIUzI1NiIsIn..."
        },
        {
          "name": "user_profile",
          "value": "{\"id\":\"usr-101\",\"role\":\"ADMIN\"}"
        }
      ]
    }
  ]
}
```

> **Lưu ý:** `sessionStorage` mặc định **không được lưu** trong `storageState` vì bản chất `sessionStorage` gắn chặt với vòng đời của 1 tab duy nhất và bị hủy khi tab đóng.

## Cơ Chế Pre-Navigation State Hydration

Thời điểm nạp trạng thái đóng vai trò quyết định tính ổn định của bài test:

1. **Nạp TRƯỚC khi điều hướng (`Pre-navigation`):** Khi gọi `browser.newContext({ storageState: 'admin.json' })`, Playwright sử dụng lệnh CDP `Network.setCookies` và thiết lập bộ nhớ `localStorage` **ngay tại thời điểm cấp phát RAM cho Context**, trước khi bất kỳ lệnh `page.goto()` nào được kích hoạt.
2. **Hậu quả nếu nạp SAU khi điều hướng:**
   - Request HTTP tải HTML đầu tiên sẽ thiếu Cookie xác thực (`Cookie: session=...`).
   - Mã JavaScript Frontend (như React/Next.js Auth Guard) khi vừa mount sẽ kiểm tra: `if (!localStorage.getItem('access_token')) router.push('/login')` $\to$ Trình duyệt lập tức bị chuyển hướng đá văng về trang Login trước khi test script kịp inject token.

## Production Setup Pattern (Playwright Projects Dependency)

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  projects: [
    // 1. Chạy bước Setup xác thực trước
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    // 2. Các bài test UI phụ thuộc vào bước setup và nạp sẵn auth state
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
      dependencies: ["setup"],
    },
  ],
});
```

```typescript
// tests/auth.setup.ts
import { test as setup } from "@playwright/test";

setup("Authenticate as Admin via API", async ({ request }) => {
  await request.post("http://localhost:3000/api/v1/auth/login", {
    data: { email: "admin@cinema.vn", password: "SecretPassword123" },
  });
  await request.storageState({ path: "playwright/.auth/admin.json" });
});
```

## Related Notes

- [[Browser_Context_Isolation]]
- [[APIRequestContext_vs_Browser_Engine]]
- [[Network_Interception_and_Mocking_Mechanics]]
- [[000_Software_Testing_Playwright_MOC]]
