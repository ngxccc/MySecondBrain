---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Deep architectural comparison between Playwright (Out-of-process CDP) and Cypress (In-browser Iframe)
---

# Playwright vs Cypress Architectural Comparison

## TL;DR

Playwright và Cypress là hai framework kiểm thử mã nguồn mở phổ biến nhất cho ứng dụng Web hiện đại, nhưng được xây dựng trên hai nền tảng kiến trúc hoàn toàn đối lập: **In-Browser Execution** (Cypress chạy code test trực tiếp bên trong một `<iframe>` của trình duyệt) và **Out-of-Process Automation** (Playwright chạy code test ở một tiến trình Node.js độc lập và điều khiển Browser Engine qua Chrome DevTools Protocol / WebSocket). Sự khác biệt kiến trúc này quyết định khả năng kiểm thử đa tab (Multi-Tab), hỗ trợ đa ngôn ngữ và hiệu năng tối ưu hóa bộ nhớ trong môi trường CI/CD.

## Architectural Model Comparison

```text
[Cypress: In-Browser Iframe Architecture]
┌─────────────────────────────────────────────────────────┐
│ Browser Window (Single Tab)                             │
│ ┌─────────────────────────┐   ┌───────────────────────┐ │
│ │ Cypress Test Runner     │   │ Target Application    │ │
│ │ (Iframe 1 - JS Runtime) │◀──┤ (Iframe 2 - DOM)      │ │
│ └─────────────────────────┘   └───────────────────────┘ │
└─────────────────────────────────────────────────────────┘
* Hạn chế: Bị giam cầm trong 1 Tab, chịu sự kiểm soát của Same-Origin Policy.

───────────────────────────────────────────────────────────

[Playwright: Out-of-Process CDP Architecture]
┌─────────────────────────┐        WebSocket (JSON-RPC)
│ Node.js Test Process    ├──────────────────────────────────┐
│ (Python / Java / TS)    │                                  │
└─────────────────────────┘                                  ▼
                                                  ┌─────────────────────┐
                                                  │ Browser Process     │
                                                  │ ┌─────────────────┐ │
                                                  │ │ BrowserContext1 │ │
                                                  │ │ (Tab 1 / Tab 2) │ │
                                                  │ ├─────────────────┤ │
                                                  │ │ BrowserContext2 │ │
                                                  │ │ (Isolated Tab)  │ │
                                                  │ └─────────────────┘ │
                                                  └─────────────────────┘
* Ưu thế: Kiểm soát toàn bộ Browser, mở nhiều Tab/Window, vượt qua ranh giới Domain.
```

## Deep Dive 1: The Multi-Tab & Same-Origin Barrier

Trong các kịch bản thực tế (như thanh toán qua bên thứ ba: VNPAY, Momo, OAuth Google Login), trình duyệt sẽ mở một Tab mới hoặc chuyển hướng (Redirect) sang một Domain khác:

- **Cypress (Bị giới hạn kiến trúc):**  
  Do code test nằm trong `<iframe>` của Tab 1, nó bị ràng buộc bởi cơ chế bảo mật **Same-Origin Policy** và mô hình phân tách tiến trình (**Process-per-tab model**) của trình duyệt. Mã JavaScript trong Tab 1 **hoàn toàn không có quyền hạn** chạm tới DOM của Tab 2. Để test được, Cypress buộc lập trình viên phải "hack" giao diện bằng cách xóa thuộc tính `target="_blank"` của thẻ `<a>` để ép mở trong cùng một tab.
- **Playwright (Xử lý tự nhiên qua CDP Target Domain):**  
  Playwright đứng ở cấp độ Hệ điều hành (OS-level). Thông qua sự kiện `Target.targetCreated` của CDP, ngay khi có Tab mới hay Popup xuất hiện, Playwright tự động bắt lấy và đính kèm (attach) session điều khiển:
  ```typescript
  // Playwright xử lý Multi-Tab mượt mà
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("button", { name: "Thanh toán qua VNPAY" }).click(),
  ]);
  await popup.getByLabel("Mã OTP").fill("123456");
  await popup.getByRole("button", { name: "Xác nhận" }).click();
  await expect(page.getByText("Đã thanh toán thành công")).toBeVisible();
  ```

## Deep Dive 2: Language Agnosticism & JSON-RPC Protocol

- **Cypress (100% JavaScript / TypeScript):**  
  Vì code test chạy trực tiếp trong trình duyệt (nơi chỉ có JavaScript Engine thực thi được), Cypress không thể hỗ trợ các ngôn ngữ backend khác như Python, Java hay C#.
- **Playwright (Đa ngôn ngữ: TS, Python, Java, C# .NET):**  
  Tầng Client của Playwright chỉ đóng vai trò gửi các thông điệp JSON-RPC qua WebSocket. Do đó, Microsoft có thể phát triển các SDK chính thức cho Python (`pytest-playwright`), Java (`Playwright for Java`), C# (.NET) giao tiếp chung với một Playwright Driver ngầm.

## Deep Dive 3: Memory Footprint & Parallelism (Browser Context vs Browser Instance)

Khi chạy song song 10 bài test độc lập:

| Tiêu Chí                    | Playwright                                                                       | Cypress                                                                        |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Cơ chế Song song**        | Cấp phát 10 `BrowserContext` (Incognito Sandbox) trên cùng **1 Browser Process** | Khởi chạy nhiều tiến trình Browser Process độc lập hoặc chạy tuần tự trong tab |
| **Thời gian khởi tạo**      | ~5-10 mili-giây / context                                                        | ~2-3 giây / browser reload                                                     |
| **Tiêu tốn RAM**            | Rất nhẹ (~150MB cho Browser + 10MB/Context)                                      | Nặng (~300MB - 500MB cho từng Browser Instance)                                |
| **Tiết kiệm tài nguyên CI** | Giảm tới **70% - 80% RAM & CPU** trên CI Runners                                 | Dễ gây nghẽn bộ nhớ (Out-Of-Memory) trên Docker CI                             |

## Production Trade-off Summary Matrix

| Khía Cạnh                             | Playwright                                 | Cypress                                         |
| ------------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| **Mô hình Kiến trúc**                 | Out-of-Process (CDP / WebSocket)           | In-Browser (`<iframe>` injection)               |
| **Kiểm thử Multi-Tab / Popups**       | Hỗ trợ tự nhiên, đầy đủ                    | Không hỗ trợ (phải dùng workaround)             |
| **Kiểm thử Đa Domain (Cross-Origin)** | Tự do chuyển đổi giữa các domain           | Cần dùng lệnh `cy.origin()` phức tạp            |
| **Kiểm thử Tầng API**                 | Tích hợp sẵn `APIRequestContext` cực nhanh | Cần dùng `cy.request()` chậm hơn                |
| **Hỗ trợ Trình duyệt**                | Chromium, Firefox, WebKit (Safari Engine)  | Chromium, Firefox, Electron (WebKit thử nghiệm) |
| **Tốc độ & Độ ổn định**               | Vượt trội nhờ Auto-waiting & CDP Push      | Tốt nhưng dễ lag khi bộ nhớ Iframe phình to     |

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[Browser_Context_Isolation]]
- [[Playwright_vs_TestComplete_Architectural_Comparison]]
- [[000_Software_Testing_Playwright_MOC]]
