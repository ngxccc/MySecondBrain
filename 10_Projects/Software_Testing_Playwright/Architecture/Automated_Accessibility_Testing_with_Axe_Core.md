---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Automated accessibility testing integration with Axe-core, WCAG 2.1 AA compliance audits, and AOM validation in Playwright
---

# Automated Accessibility Testing with Axe Core

## TL;DR

Automated Accessibility Testing (Kiểm thử Khả năng Tiếp cận Tự động) là quy trình kiểm định giao diện web theo các tiêu chuẩn quốc tế **WCAG 2.1 (Web Content Accessibility Guidelines) Level AA** và **Section 508** dành cho người khiếm thị hoặc người khuyết tật. Thay vì kiểm thử thủ công từng phần tử, Playwright tích hợp thư viện tiêu chuẩn ngành **`@axe-core/playwright`** (của Deque Systems) để tự động phân tích toàn bộ cây DOM và Accessibility Object Model (AOM), phát hiện các lỗi nghiêm trọng như thiếu nhãn `aria-label`, độ tương phản màu không đạt chuẩn, hoặc phím Tab điều hướng bị kẹt.

## Architecture: Axe-Core Engine Injection & AOM Analysis

```text
┌─────────────────────────────────────────────────────────┐
│ Node.js Test Process                                    │
│ - Tạo AxeBuilder instance                               │
│ - Cấu hình bộ quy tắc: withTags(['wcag2a', 'wcag2aa'])  │
└────────────────────────────┬────────────────────────────┘
                             │
            (Chèn script axe.min.js qua CDP)
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ Browser DOM & Accessibility Tree (AOM)                  │
│ ├── 1. Quét tỷ lệ tương phản màu chữ / màu nền          │
│ ├── 2. Kiểm tra thuộc tính alt của thẻ <img>            │
│ ├── 3. Kiểm tra nhãn liên kết của <button> & <input>    │
│ └── 4. Kiểm tra cấu trúc phân cấp thẻ tiêu đề (h1-h6)   │
└────────────────────────────┬────────────────────────────┘
                             │
             (Trả về mảng vi phạm: Violations)
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ Assert: expect(results.violations).toEqual([])          │
│ - Nếu có lỗi: In chi tiết thẻ HTML vi phạm & hướng dẫn  │
└─────────────────────────────────────────────────────────┘
```

## 4 Common Accessibility Violations Detected

1. **Color Contrast (Độ tương phản màu kém):** Tỷ lệ tương phản giữa chữ và nền dưới chuẩn $4.5:1$ (làm người mắt kém hoặc dùng điện thoại ngoài nắng không đọc được).
2. **Missing Form Labels (Thiếu nhãn form):** Ô nhập liệu `<input>` không có `<label for="...">` hoặc `aria-label` tương ứng (trình đọc màn hình Screen Reader không thể đọc tên ô).
3. **Empty Buttons / Links (Nút bấm rỗng):** Nút chỉ chứa icon `<button><i class="icon-trash"></i></button>` mà không có nhãn văn bản ẩn (Screen Reader chỉ đọc là "Button" vô nghĩa).
4. **Duplicate IDs (Trùng lặp ID trong DOM):** Nhiều phần tử dùng chung `id="btn-submit"`, phá vỡ liên kết điều hướng bàn phím.

## Production 20/80 Axe-Core Code Pattern

```typescript
// tests/a11y/booking_a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Kiểm toán khả năng tiếp cận WCAG 2.1 AA trên trang chọn rạp", async ({
  page,
}) => {
  await page.goto("/theaters");
  await page.waitForLoadState("networkidle");

  // Khởi tạo Axe scanner và quét toàn bộ trang
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    // Bỏ qua một widget quảng cáo của bên thứ ba không thể can thiệp code
    .exclude(".third-party-ad-banner")
    .analyze();

  // Assert không có vi phạm nào
  expect(
    accessibilityScanResults.violations,
    `Phát hiện ${accessibilityScanResults.violations.length} lỗi Accessibility! Chi tiết: ${JSON.stringify(accessibilityScanResults.violations, null, 2)}`,
  ).toEqual([]);
});
```

## Related Notes

- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Page_Object_Model_and_Component_Architecture]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[000_Software_Testing_Playwright_MOC]]
