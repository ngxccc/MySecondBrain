---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, Pixel-by-Pixel visual regression testing, dynamic element masking, and Definition of Done for WBS 3.4
---

# WBS 3.4: Web UI Test Suite - Visual Regression Testing and Dynamic Data Masking

## Metadata

- **WBS Code:** `3.4`
- **Task Name:** UI Ca 4: Visual Regression Testing & Dynamic Data Masking
- **Assignee:** Lê Minh Tài (MSSV: 0306241145)
- **Task Weight:** `6.0%`
- **Deliverable Artifacts:** File mã nguồn `tests/e2e/visual_regression.spec.ts`, các file ảnh Golden Snapshots, Pull Request GitHub, Mục 3.8 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử tự động Web UI Ca 4: Kiểm thử hồi quy trực quan (Visual Regression Testing) thông qua kỹ thuật so khớp điểm ảnh (Pixel-by-Pixel Comparison) với hàm `toHaveScreenshot()`. Triển khai kỹ thuật che dữ liệu động (Dynamic Data Masking) để loại bỏ hoàn toàn các cảnh báo sai lệch giả (False Positives) do thời gian thực hoặc dữ liệu ngẫu nhiên tạo ra.

## Core Architectural Content to Implement

### 1. Bản Chất Kỹ Thuật Của Visual Regression Testing

- **Functional Testing vs Visual Testing:**
  - _Functional Testing:_ Chỉ kiểm tra phần tử có tồn tại trong DOM và có chứa chuỗi text hay không. Không thể phát hiện lỗi vỡ layout, tràn văn bản (Text Overflow), lệch vị trí CSS hoặc xung đột màu sắc.
  - _Visual Regression Testing:_ Chụp ảnh màn hình thực tế và so sánh với ảnh chuẩn mẫu (Golden Reference Snapshot). Tự động tô đỏ các pixel bị sai lệch để cảnh báo lập trình viên.
- **Thuật toán so sánh ảnh:** Sử dụng thuật toán Pixelmatch để tính toán tỷ lệ sai khác giữa hai ma trận ảnh.

### 2. Kỹ Thuật Che Dữ Liệu Động (Dynamic Data Masking)

```text
[ GIAO DIEN THUC TE ]                        [ KHI SO SANH ANH SNAPSHOT ]
+------------------------------------+       +------------------------------------+
|  Welcome, John Doe                 |       |  Welcome, John Doe                 |
|  Current Time: 14:32:05 (DYNAMIC!) | ----> |  Current Time: [ CHE HOP DONG ]    |
|  Total Balance: $1,250.00          |       |  Total Balance: $1,250.00          |
+------------------------------------+       +------------------------------------+
  (Du lieu gio thay doi lien tuc              (Che phan tu gio bang mau hong,
   se lam test fail neu khong mask!)           loai bo 100% loi False-Positive!)
```

### 3. Mã Nguồn Kiểm Thử Mẫu (`tests/e2e/visual_regression.spec.ts`)

```typescript
// tests/e2e/visual_regression.spec.ts
import { test, expect } from "@playwright/test";

test("Visual Regression on SauceDemo Inventory with Masking", async ({
  page,
}) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  // Cho danh sach san pham hien thi on dinh
  await expect(page.locator(".inventory_list")).toBeVisible();

  // So khop anh toan trang voi Dynamic Masking
  await expect(page).toHaveScreenshot("inventory-landing.png", {
    // Che cac vung anh san pham dong va badge de tranh false positive
    mask: [
      page.locator(".inventory_item_img"),
      page.locator(".shopping_cart_badge"),
    ],
    maxDiffPixelRatio: 0.02, // Cho phep sai lech mau toi da 2% pixel
    animations: "disabled", // Vo hieu hoa animation de anh chup on dinh tuyet doi
  });
});
```

### 4. Quy Trình Cập Nhật Golden Snapshots

```bash
# Tao moi hoac cap nhat anh Golden Snapshots khi giao dien co chu dich thay doi
npx playwright test tests/e2e/visual_regression.spec.ts --update-snapshots
```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `tests/e2e/visual_regression.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test tests/e2e/visual_regression.spec.ts --project=chromium` pass $100\%$.
  - [ ] Thư mục `__snapshots__` chứa ảnh Golden Snapshot chuẩn.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-3.4-ui-visual-regression`.
  - [ ] Tạo Pull Request trên GitHub đính kèm ảnh chụp so sánh visual diff (nếu có) và ảnh test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.8 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Visual_Regression_Testing_and_Dynamic_Data_Masking]]
- [[SauceDemo_Ecosystem_and_Selection_Rationale]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
