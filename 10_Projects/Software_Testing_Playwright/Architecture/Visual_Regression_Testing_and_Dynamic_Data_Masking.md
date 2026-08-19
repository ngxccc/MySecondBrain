---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Pixel-level visual regression testing, perceptual diffing algorithms, and dynamic data masking in Playwright
---

# Visual Regression Testing and Dynamic Data Masking

## TL;DR

Visual Regression Testing (Kiểm thử Hồi quy Giao diện Trực quan) là kỹ thuật chụp ảnh màn hình giao diện thực tế và so sánh từng pixel với một ảnh mẫu chuẩn (**Golden Master Baseline**). Playwright tích hợp sẵn cơ chế này qua hàm `expect(page).toHaveScreenshot()`, sử dụng thuật toán so khớp thị giác (Perceptual Diffing) để phát hiện các lỗi vỡ layout, lệch CSS, đổi font chữ mà các bài test chức năng truyền thống không thể phát hiện. Để ngăn chặn tình trạng gãy test do dữ liệu thay đổi liên tục (đồng hồ đếm ngược, mã vé, avatar ngẫu nhiên), kỹ thuật **Dynamic Data Masking** (che vùng động) là bắt buộc.

## Visual Diffing Architecture: Golden Master vs Actual

```text
[1. Lần chạy đầu tiên: Sinh Baseline Master Snapshot]
page.goto('/ticket/101') ──▶ Chụp ảnh ──▶ Lưu file: ticket-page-linux.png (Master)

─────────────────────────────────────────────────────────────────────────────

[2. Lần chạy sau trên CI: So sánh thị giác từng Pixel]
page.goto('/ticket/101') ──▶ Chụp ảnh Actual
                                   │
                                   ▼
        ┌─────────────────────────────────────────────────────┐
        │ Thuật toán So sánh (Perceptual Diffing Engine)      │
        │ - So sánh màu sắc, tọa độ từng pixel                │
        │ - Tính toán tỷ lệ lệch: Diff Ratio                  │
        └─────────────────────────────────────────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   Diff Ratio <= maxDiffPixelRatio           Diff Ratio > maxDiffPixelRatio
           [PASS ✅]                        [FAIL ❌: Xuất Diff Image đỏ]
```

## The Dynamic Content Flakiness & Masking Strategy

### Thách thức trong thực tế:

Khi kiểm thử màn hình Đặt vé xem phim:

- Suất chiếu có đồng hồ đếm ngược: `09:59` $\to$ `09:58` (Pixel luôn thay đổi mỗi giây).
- Mã vé ngẫu nhiên: `TICKET-84920` (Mỗi lần test sinh 1 mã khác nhau).
- Ảnh đại diện người dùng hoặc banner quảng cáo xoay vòng.
  $\to$ Nếu so sánh toàn bộ màn hình, bài test sẽ **FAIL 100%** dù giao diện không hề bị lỗi!

### Giải pháp Masking:

Playwright cung cấp tùy chọn `mask: [Locator[]]`. Engine sẽ tự động phủ một lớp hộp màu tím/đen lên các phần tử động trước khi chụp và so sánh pixel:

```text
┌─────────────────────────────────────────────────────────┐
│                     VÉ XEM PHIM                         │
│ Phim: Avengers Endgame                                  │
│ Thời gian giữ vé còn: [██████████████] ◄── Đã được Mask │
│ Mã đặt vé:            [██████████████] ◄── Đã được Mask │
│ Ghế: VIP - A12                                          │
│ Tổng tiền: 120.000 VNĐ                                  │
└─────────────────────────────────────────────────────────┘
* Chỉ so sánh layout khung viền, font chữ và các thông tin cố định.
```

## Production 20/80 Visual Testing Pattern

```typescript
// tests/visual/ticket_visual.spec.ts
import { test, expect } from "@playwright/test";

test("Kiểm tra hồi quy giao diện vé xem phim đã thanh toán", async ({
  page,
}) => {
  await page.goto("/tickets/detail/ticket-demo");

  // Đợi hình ảnh poster và font chữ tải hoàn tất
  await page.waitForLoadState("networkidle");

  // Định vị các phần tử chứa dữ liệu biến động
  const countdownTimer = page.getByTestId("countdown-timer");
  const dynamicBarcode = page.getByTestId("ticket-barcode");
  const userAvatar = page.getByRole("img", { name: "User Avatar" });

  // Thực hiện Visual Comparison với Masking và ngưỡng dung sai
  await expect(page).toHaveScreenshot("confirmed-ticket-layout.png", {
    mask: [countdownTimer, dynamicBarcode, userAvatar],
    maxDiffPixelRatio: 0.02, // Cho phép sai lệch tối đa 2% pixel do khử răng cưa font
    animations: "disabled", // Tắt CSS animations / transitions để chống flaky
  });
});
```

## Related Notes

- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Playwright_Hard_Technical_Boundaries_and_Non_Goals]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[000_Software_Testing_Playwright_MOC]]
