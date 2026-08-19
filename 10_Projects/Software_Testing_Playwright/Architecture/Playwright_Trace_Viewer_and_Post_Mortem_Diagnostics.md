---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Playwright Trace Viewer architecture, post-mortem diagnostics, DOM snapshots, and CI/CD flaky test debugging strategy
---

# Playwright Trace Viewer and Post-Mortem Diagnostics

## TL;DR

Playwright Trace Viewer là công cụ điều tra lỗi hậu kỳ (Post-Mortem Diagnostics) $20/80$ số 1 cho các bài test chạy ngầm (Headless) trên môi trường CI/CD. Khác với các công cụ truyền thống chỉ chụp ảnh tĩnh tại thời điểm bài test đã sụp đổ, Trace Viewer thu thập đồng thời 4 luồng dữ liệu theo thời gian thực (DOM Snapshots từng hành động, Network Waterfall HAR, Screencast frames và Action Metadata). Nhờ đó, kỹ sư có thể "quay ngược thời gian", tương tác và soi inspect toàn bộ cây DOM trong quá khứ mà không cần chạy lại bài test.

## Static Screenshots vs Time-Travel Trace Diagnostics

```text
[Chụp ảnh màn hình khi lỗi: screenshot: 'only-on-failure']
┌─────────────────────────────────────────────────────────┐
│ 🔴 Ảnh tĩnh duy nhất lúc 00:30.000 (Timeout Error)      │
│ - Không biết 5 giây trước đó mạng có bị nghẽn không?   │
│ - Không biết nút bấm có đang bị spinner che không?      │
│ - Không xem được console.error của JavaScript.          │
└─────────────────────────────────────────────────────────┘

───────────────────────────────────────────────────────────

[Playwright Trace Viewer: trace: 'on-first-retry']
┌─────────────────────────────────────────────────────────┐
│ ⏱️  Action Timeline: 00:00 ──▶ 00:10 ──▶ 00:25 ──▶ 00:30│
│ 🌐 Network HAR: Chi tiết từng API request/response      │
│ 🔍 DOM Snapshots: Before / Action / After từng click     │
│ 🖥️  DevTools Explorer: Soi Inspect DOM trực tiếp ở quá khứ│
│ 📜 Console & Source: Lỗi JS browser + dòng code test    │
└─────────────────────────────────────────────────────────┘
```

## Under the Hood: 4 Core Data Streams Captured

Khi kích hoạt Tracing, Playwright gom toàn bộ dữ liệu vào một file lưu trữ `.zip` duy nhất (Trace Archive):

1. **Action Timeline & Call Metadata:**
   - Ghi nhận chính xác từng phương thức (`page.goto`, `locator.click`, `expect.toBeVisible`).
   - Thời gian thực thi (duration), tham số gửi qua CDP WebSocket và trạng thái Actionability Checks tại từng bước.
2. **DOM Snapshots (Before, Action, After):**
   - Playwright không lưu video mp4 thông thường mà trích xuất toàn bộ cấu trúc DOM, CSS snapshot tại 3 thời điểm: Trước khi thao tác, Lúc thao tác (có highlight điểm click đỏ) và Sau khi thao tác.
   - Kỹ sư có thể mở DevTools và dùng chuột soi (Inspect) từng thẻ HTML, kiểm tra class, aria-hidden hay css transform ở thời điểm đó.
3. **Network Waterfall (HAR Stream):**
   - Toàn bộ lưu lượng mạng (HTTP headers, payload, response body, WebSocket frames).
   - Xác định ngay lập tức nguyên nhân test fail là do frontend hay do backend trả về HTTP 500 / Timeout.
4. **Console Logs & Screencast Video:**
   - Thu thập toàn bộ log từ `console.log`, `console.warn`, `console.error` và Unhandled Promise Rejections trong Browser Process.

## CI/CD 20/80 Strategy: `trace: 'on-first-retry'`

Thu thập trace liên tục cho tất cả các bài test sẽ tiêu tốn dung lượng đĩa và làm chậm băng thông CI. Chiến lược $20/80$ chuẩn doanh nghiệp là chỉ ghi trace khi bài test bị lỗi ở lần chạy đầu và được kích hoạt chạy lại (Retry):

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    // 20/80 Strategy: Tiết kiệm tài nguyên CI, chỉ record khi có lỗi
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  reporter: [["html", { open: "never" }], ["list"]],
});
```

## Post-Mortem Inspection Workflow

Khi bài test trên GitHub Actions bị fail:

1. Tải file `trace.zip` từ mục CI Build Artifacts về máy local.
2. Mở Trace Viewer thông qua CLI mà không cần cài đặt thêm phần mềm:
   ```bash
   npx playwright show-trace trace.zip
   ```
3. Kéo thanh Timeline để xem trạng thái ứng dụng tại thời điểm xảy ra lỗi, kiểm tra Network tab xem có API nào bị chậm, và hover vào DOM snapshot để xác định element bị lệch tọa độ hoặc bị che khuất.

## Related Notes

- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Browser_Automation_IPC_Fundamentals]]
- [[Network_Interception_and_Mocking_Mechanics]]
- [[Page_Object_Model_and_Component_Architecture]]
- [[000_Software_Testing_Playwright_MOC]]
