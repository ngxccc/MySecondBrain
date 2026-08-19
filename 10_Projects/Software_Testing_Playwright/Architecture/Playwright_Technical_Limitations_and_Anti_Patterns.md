---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Critical technical limitations, unsupported use cases, and major SDET anti-patterns in Playwright test suites
---

# Playwright Technical Limitations and Anti Patterns

## TL;DR

Mặc dù Playwright là framework kiểm thử tự động hàng đầu cho Web và REST API, nó sở hữu những ranh giới kỹ thuật rõ ràng không thể vượt qua: không hỗ trợ ứng dụng Native Desktop, không kiểm thử được ứng dụng Native Mobile trên thiết bị thật, và không chạy trên trình duyệt Safari thực thụ của Apple. Việc nhận diện đúng các giới hạn này cùng với việc loại bỏ 4 Anti-patterns phổ biến (Hard Sleep, Brittle Locators, UI Login Redundancy, State Leakage) là yếu tố quyết định để xây dựng một hệ thống kiểm thử tự động $20/80$ chuẩn doanh nghiệp.

## 4 Major Technical Limitations (Where NOT to use Playwright)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                 RANH GIỚI KỸ THUẬT CỦA PLAYWRIGHT                       │
├────────────────────────────────┬────────────────────────────────────────┤
│ ❌ 1. Native Mobile Apps (.apk/.ipa) │ Không thể tương tác với Android/iOS UI │
│    & Real Device Hardware      │ (Cần Appium / Maestro / XCUITest).     │
├────────────────────────────────┼────────────────────────────────────────┤
│ ❌ 2. Native Desktop Apps       │ Không có driver can thiệp vào HWND,    │
│    (WinForms, WPF, Cocoa, Qt)  │ Win32 UI Automation (Cần TestComplete).│
├────────────────────────────────┼────────────────────────────────────────┤
│ ⚠️ 3. Real Safari Browser      │ Chỉ hỗ trợ WebKit engine mã nguồn mở   │
│    (macOS / iOS Safari)        │ biên dịch trên Linux/Windows.          │
├────────────────────────────────┼────────────────────────────────────────┤
│ ⚠️ 4. Browser Extensions       │ Hỗ trợ hạn chế trên Chromium, không    │
│    in Headless Mode            │ hỗ trợ trên Firefox/WebKit headless.   │
└────────────────────────────────┴────────────────────────────────────────┘
```

### Deep Dive: Device Emulation vs Real Mobile Testing

Tính năng `devices['iPhone 14']` của Playwright chỉ là **Giả lập giao diện (Device Emulation)** trên máy tính:

- Cơ chế: Thay đổi chuỗi `User-Agent`, điều chỉnh độ phân giải màn hình (`Viewport`), và bật cờ nhận diện cảm ứng (`hasTouch: true`) trên nhân Chromium máy tính.
- Hạn chế: Không thể kiểm thử hiệu năng CPU/GPU di động, cảm biến GPS, Camera thật, quét vân tay Biometrics (FaceID), hay các lỗi hiển thị riêng biệt của Safari iOS (do Safari iOS dùng JavaScriptCore và WebKit độc quyền của Apple).

## 4 Critical SDET Anti-Patterns in Playwright

### 1. Anti-Pattern: Hard Sleep (`page.waitForTimeout`)

- **Sai lầm:** Dùng `await page.waitForTimeout(5000)` để chờ phản hồi từ server hoặc animation.
- **Tác hại:**
  1. _Lãng phí thời gian CI:_ Nếu element sẵn sàng sau 100ms, bạn vẫn lãng phí 4900ms. Với 500 bài test, thời gian CI tăng thêm hàng chục phút.
  2. _Vẫn gây Flaky Test:_ Nếu mạng trên CI lag quá 5000ms, bài test vẫn sụp đổ.
- **Giải pháp $20/80$:** Sử dụng **Web-First Assertions** (`await expect(locator).toBeVisible()`). Cơ chế này tự động Polling liên tục mỗi 100ms và giải phóng ngay khi điều kiện thỏa mãn.

```typescript
// ❌ ANTI-PATTERN: Chờ cứng 3 giây
await page.getByRole("button", { name: "Thanh toán" }).click();
await page.waitForTimeout(3000);
expect(await page.getByText("Thành công").isVisible()).toBeTruthy();

// ✅ CHUẨN SDET: Web-First Assertion tự động polling
await page.getByRole("button", { name: "Thanh toán" }).click();
await expect(page.getByText("Thành công")).toBeVisible({ timeout: 5000 });
```

### 2. Anti-Pattern: Brittle Selectors (CSS / XPath phụ thuộc cấu trúc DOM)

- **Sai lầm:** Sử dụng selector theo cây phân cấp DOM như `div > div.flex > button.btn-primary` hoặc XPath tuyệt đối `/html/body/div[1]/button`.
- **Tác hại:** Gãy test ngay khi đội ngũ Frontend đổi class Tailwind hoặc bọc thêm thẻ `<div>`.
- **Giải pháp:** Sử dụng chuẩn **Role-based Locators** (`page.getByRole`, `page.getByLabel`, `page.getByTestId`).

### 3. Anti-Pattern: UI-Based Login Redundancy

- **Sai lầm:** Bắt mọi bài test UI phải mở form `/login`, điền email, mật khẩu và bấm Submit.
- **Tác hại:** Tăng thời gian thực thi lên gấp 5 lần và làm bài test phụ thuộc vào độ ổn định của trang login.
- **Giải pháp:** Áp dụng **Hybrid Auth & `storageState` Injection** để bypass UI login qua API.

### 4. Anti-Pattern: Test Interdependence & State Leakage

- **Sai lầm:** Bài test B phụ thuộc vào dữ liệu được tạo bởi bài test A (chạy tuần tự).
- **Tác hại:** Khi chạy song song trên CI hoặc khi bài test A fail, toàn bộ các bài test phía sau sẽ fail theo hình thức domino.
- **Giải pháp:** Đảm bảo **Test Isolation 100%**: Mỗi bài test tự tạo dữ liệu động (Data Factory) và dọn dẹp qua Fixture Teardown (`use()`).

## Related Notes

- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Playwright_vs_TestComplete_Architectural_Comparison]]
- [[Playwright_vs_Cypress_Architectural_Comparison]]
- [[000_Software_Testing_Playwright_MOC]]
