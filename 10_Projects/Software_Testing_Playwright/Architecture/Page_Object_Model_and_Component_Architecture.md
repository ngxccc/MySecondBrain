---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Page Object Model (POM) and Component Object Model (COM) architectural patterns for maintainable UI automation in Playwright
---

# Page Object Model and Component Architecture

## TL;DR

Page Object Model (POM) và Component Object Model (COM) là các mô hình thiết kế $20/80$ cốt lõi trong UI Test Automation, đóng vai trò tạo lớp trừu tượng (Abstraction Layer) ngăn cách giữa giao diện DOM của ứng dụng và logic kịch bản kiểm thử. Thay vì rải rác các bộ định vị (`Locator`) và thao tác tương tác (`click`, `fill`) vào từng bài test, POM đóng gói trang hoàn chỉnh còn COM đóng gói các thành phần giao diện tái sử dụng (Navbar, Modal, Table Grid). Khi giao diện thay đổi cấu trúc hoặc nhãn, kỹ sư chỉ cần cập nhật tại duy nhất một file định nghĩa.

## The Scattered Locators Anti-pattern vs POM

Khi viết test gọi trực tiếp `page.getByRole(...)` trong từng file test:

```text
[Không Dùng POM: Locators Rải Rác]
Test 1: await page.getByRole('button', { name: 'Chọn ghế' }).click();
Test 2: await page.getByRole('button', { name: 'Chọn ghế' }).click();
...
Test 30: await page.getByRole('button', { name: 'Chọn ghế' }).click();
===> Khi Frontend đổi tên nút thành 'Tiếp tục chọn ghế': Phải sửa ở 30 file!

─────────────────────────────────────────────────────────────────────────────

[Dùng Page Object Model (POM)]
Class SeatSelectionPage {
  readonly selectSeatBtn: Locator;
  constructor(page: Page) {
    this.selectSeatBtn = page.getByRole('button', { name: 'Chọn ghế' });
  }
  async proceedToSeatSelection() { await this.selectSeatBtn.click(); }
}
===> Khi đổi tên nhãn hoặc Selector: Sửa DUY NHẤT 1 dòng trong SeatSelectionPage.ts!
```

## Component Object Model (COM): Composition over Inheritance

Trong các ứng dụng Single Page Application (SPA), nhiều thành phần UI xuất hiện lặp lại trên nhiều trang khác nhau (Header, Navbar, Notification Toast, Confirmation Modal).

Nếu nhồi nhét tất cả vào một `BasePage` hoặc copy-paste vào từng `Page`, codebase sẽ phình to và khó bảo trì. **COM** giải quyết bài toán này bằng cách đóng gói các widget/component thành các class độc lập nhận `Locator` hoặc `Page` làm phạm vi định vị (Scoped Locator).

```text
┌─────────────────────────────────────────────────────────┐
│                      BookingPage                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  NavbarComponent (Search, User Avatar, Cart Badge)  │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  SeatGridComponent (VIP Seats, Regular, Selected)   │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  PaymentModalComponent (Credit Card, QR, Confirm)   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Production 20/80 POM & COM Pattern

### 1. Component Class (Ví dụ: Payment Modal)

```typescript
// components/payment_modal.component.ts
import { Locator, Page, expect } from "@playwright/test";

export class PaymentModalComponent {
  readonly root: Locator;
  readonly cardInput: Locator;
  readonly confirmBtn: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("dialog", { name: "Xác nhận thanh toán" });
    this.cardInput = this.root.getByLabel("Số thẻ thanh toán");
    this.confirmBtn = this.root.getByRole("button", {
      name: "Thanh toán ngay",
    });
  }

  async payWithCard(cardNumber: string) {
    await expect(this.root).toBeVisible();
    await this.cardInput.fill(cardNumber);
    await this.confirmBtn.click();
  }
}
```

### 2. Page Class tích hợp Component (Composition)

```typescript
// pages/booking.page.ts
import { Page, Locator } from "@playwright/test";
import { PaymentModalComponent } from "../components/payment_modal.component";

export class BookingPage {
  readonly page: Page;
  readonly paymentModal: PaymentModalComponent;
  readonly reserveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentModal = new PaymentModalComponent(page);
    this.reserveBtn = page.getByRole("button", { name: "Giữ ghế này" });
  }

  async selectSeatAndPay(seatNumber: string, cardNumber: string) {
    await this.page.getByRole("button", { name: seatNumber }).click();
    await this.reserveBtn.click();
    await this.paymentModal.payWithCard(cardNumber);
  }
}
```

### 3. Test Script tinh gọn

```typescript
// tests/e2e/booking.spec.ts
import { test, expect } from "@playwright/test";
import { BookingPage } from "../../pages/booking.page";

test("Khách hàng chọn ghế và thanh toán thành công", async ({ page }) => {
  const bookingPage = new BookingPage(page);
  await page.goto("/schedules/sched-101");

  await bookingPage.selectSeatAndPay("Ghế VIP A12", "4111-2222-3333-4444");

  await expect(page.getByText("Thanh toán thành công")).toBeVisible();
});
```

## Related Notes

- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Service_Object_Model_and_API_Request_Chaining]]
- [[000_Software_Testing_Playwright_MOC]]
