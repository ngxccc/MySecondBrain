---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, POM & COM architecture, and Definition of Done for WBS 3.1 - Full E2E Checkout Flow on SauceDemo
---

# WBS 3.1: Web UI Test Suite - Full E2E Checkout Flow with POM & COM

## Metadata

- **WBS Code:** `3.1`
- **Task Name:** UI Ca 1: Full E2E Checkout Flow với POM & COM trên SauceDemo
- **Assignee:** Lê Minh Quân (MSSV: 0306241143)
- **Task Weight:** `7.0%`
- **Deliverable Artifacts:** File mã nguồn `tests/e2e/checkout.spec.ts`, các lớp POM & COM trong `pages/`, Pull Request GitHub, Mục 3.5 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử tự động Web UI Ca 1: Luồng mua hàng hoàn chỉnh từ đầu đến cuối (End-to-End E-Commerce Checkout Flow) trên hệ sinh thái SauceDemo chuẩn công nghiệp. Triển khai theo mô hình hướng đối tượng phân lớp kép Page Object Model (POM) và Component Object Model (COM), triệt tiêu $100\%$ các bộ định vị thô trong file kịch bản kiểm thử.

## Core Architectural Content to Implement

### 1. Luồng Nghiệp Vụ Mua Hàng E2E (Full Checkout Flow)

```text
[LoginPage]           1. Dang nhap voi standard_user / secret_sauce
     |
     v
[InventoryPage]       2. Loc san pham (Price: Low to High) -> Them 2 mon hang vao gio
     |
     v
[NavbarComponent]     3. Kiem tra Shopping Cart Badge hien thi dung so luong "2"
     |
     v
[CartPage]            4. Kiem tra danh sach items -> Click nut "Checkout"
     |
     v
[CheckoutPage]        5. Dien First Name, Last Name, Zip Code -> Click "Continue"
     |
     v
[CheckoutPage]        6. Xac thuc bang tinh: Item total ($23.98) + Tax ($1.92) = Total ($25.90)
     |
     v
[CheckoutFinish]      7. Click "Finish" -> Xac thuc thong bao thanh cong: "Thank you for your order!"
```

### 2. Thiết Kế Kiến Trúc Phân Lớp POM & COM

1. **`pages/components/NavbarComponent.ts` (COM):**
   - Đóng gói nút Menu, nút Reset App State, biểu tượng giỏ hàng và số lượng Badge hiển thị.
2. **`pages/LoginPage.ts` (POM):**
   - Đóng gói ô nhập `username`, `password`, nút `login-button`, thông báo lỗi `error-message-container`.
3. **`pages/InventoryPage.ts` (POM):**
   - Đóng gói danh sách sản phẩm, dropdown sắp xếp (`product_sort_container`), các nút `Add to cart` động theo tên sản phẩm.
4. **`pages/CartPage.ts` (POM):**
   - Đóng gói danh sách các item trong giỏ, nút `Remove`, nút `Continue Shopping`, và nút `Checkout`.
5. **`pages/CheckoutPage.ts` (POM):**
   - Đóng gói form nhập liệu bước 1, bảng đối soát giá tiền bước 2 (Subtotal, Tax, Final Total), và nút `Finish`.

### 3. Cấu Trúc Kịch Bản Kiểm Thử Sạch (`tests/e2e/checkout.spec.ts`)

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
test("E2E Full Checkout Flow on SauceDemo", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.navigate();
  await loginPage.login("standard_user", "secret_sauce");

  await inventoryPage.sortByPriceAscending();
  await inventoryPage.addItemToCart("Sauce Labs Backpack");
  await inventoryPage.addItemToCart("Sauce Labs Bike Light");
  await expect(inventoryPage.navbar.cartBadge).toHaveText("2");

  await inventoryPage.navbar.openCart();
  await cartPage.proceedToCheckout();

  await checkoutPage.fillCustomerInfo("John", "Doe", "700000");
  await checkoutPage.continueCheckout();

  await checkoutPage.verifySummaryPrices();
  await checkoutPage.finishCheckout();
  await expect(checkoutPage.completeHeader).toHaveText(
    "Thank you for your order!",
  );
});
```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo đầy đủ các file Page/Component Objects trong `pages/` và file `tests/e2e/checkout.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test tests/e2e/checkout.spec.ts --project=chromium` pass $100\%$.
  - [ ] Áp dụng $100\%$ Role-based Locators (`getByRole`, `getByText`, `getByPlaceholder`).
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-3.1-ui-checkout-pom`.
  - [ ] Tạo Pull Request trên GitHub với mô tả chi tiết, ảnh chụp màn hình chạy test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.5 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Page_Object_Model_and_Component_Architecture]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[SauceDemo_Ecosystem_and_Selection_Rationale]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
