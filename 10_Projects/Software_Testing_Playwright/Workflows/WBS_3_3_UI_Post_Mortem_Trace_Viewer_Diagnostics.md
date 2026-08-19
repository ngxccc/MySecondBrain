---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, performance glitch diagnostics, Trace Viewer analysis, and Definition of Done for WBS 3.3
---

# WBS 3.3: Web UI Test Suite - Post-Mortem Diagnostics with Trace Viewer

## Metadata

- **WBS Code:** `3.3`
- **Task Name:** UI Ca 3: Post-Mortem Diagnostics với Trace Viewer & performance_glitch_user
- **Assignee:** Lê Minh Tài (MSSV: 0306241145)
- **Task Weight:** `6.0%`
- **Deliverable Artifacts:** File mã nguồn `src/ui/specs/glitch_diagnostics.spec.ts`, file dữ liệu `trace.zip`, Pull Request GitHub, Mục 3.7 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử tự động Web UI Ca 3: Kiểm thử và chẩn đoán sự cố nghẽn hiệu năng giao diện (Performance Bottleneck) thông qua tài khoản thử nghiệm `performance_glitch_user`. Sử dụng công cụ chẩn đoán hậu kỳ **Playwright Trace Viewer** để xuất file nén `trace.zip`, tái hiện chi tiết 4 luồng dữ liệu kiểm toán (Filmstrip, Network Waterfall, DOM Snapshot, Console Logs) nhằm tìm ra nguyên nhân gốc rễ (Root Cause Analysis).

## Core Architectural Content to Implement

### 1. Kịch Bản Kiểm Thử Lỗi Hiệu Năng (`performance_glitch_user`)

- **Bản chất sự cố:** Khi đăng nhập bằng tài khoản `performance_glitch_user`, hệ thống SauceDemo cố tình kích hoạt độ trễ mạng nhân tạo kéo dài đúng $5000\text{ms}$ ($5\text{s}$) trước khi hoàn tất tải trang Inventory.
- **Thách thức trong kiểm thử tự động:**
  - Các công cụ kiểm thử truyền thống (Selenium) nếu không cấu hình timeout phù hợp sẽ bị crash do lỗi `TimeoutException`.
  - Nếu lập trình viên dùng `sleep(6000)` để đối phó, bài test sẽ lãng phí tài nguyên và không ghi lại được bằng chứng điều tra.
- **Giải pháp của Playwright:**
  - Tận dụng cơ chế **Auto-waiting** và **Web-first Assertions** với ngưỡng timeout linh hoạt (`timeout: 10000`).
  - Ghi nhận toàn bộ dữ liệu thực thi vào file `trace.zip`.

### 2. Kỹ Thuật Lập Trình Thu Thập Trace Programmatic

```typescript
// src/ui/specs/glitch_diagnostics.spec.ts
import { test, expect } from "@playwright/test";

test("Diagnose Performance Glitch User with Trace Viewer", async ({
  browser,
}) => {
  const context = await browser.newContext();

  // Bat dau ghi trace toan dien
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  const page = await context.newPage();
  await page.goto("https://www.saucedemo.com");

  await page.getByPlaceholder("Username").fill("performance_glitch_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  // Cho trang san pham hien thi voi timeout du phong 10s (Auto-waiting)
  const inventoryList = page.locator(".inventory_list");
  await expect(inventoryList).toBeVisible({ timeout: 10000 });

  // Dung ghi trace va xuat file zip kiem toan
  await context.tracing.stop({
    path: "test-results/glitch_diagnostics_trace.zip",
  });
});
```

### 3. Quy Trình Khám Nghiệm Sự Cố Bằng Trace Viewer

```bash
# Khoi dong Trace Viewer de mo file zip vua xuat
npx playwright show-trace test-results/glitch_diagnostics_trace.zip
```

- **4 Bằng chứng kỹ thuật cần trích xuất vào Báo cáo:**
  1. **Filmstrip Video Tua Chậm:** Chứng minh màn hình trắng/treo trong khoảng thời gian từ $0.5\text{s} \to 5.2\text{s}$.
  2. **Network Waterfall HAR:** Chỉ ra chính xác thanh request `POST /login` hoặc `GET /inventory` có thời gian xử lý (Waiting Time / TTFB) kéo dài $5020\text{ms}$.
  3. **DOM Snapshot Before & After:** So sánh trạng thái DOM trước khi kích hoạt request và sau khi hoàn tất.
  4. **Call Log Timing:** Thống kê chi tiết thời gian Playwright tự động polling chờ phần tử.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `src/ui/specs/glitch_diagnostics.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test glitch_diagnostics.spec.ts --project=chromium` pass $100\%$.
  - [ ] Xuất thành công file `test-results/glitch_diagnostics_trace.zip`.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-3.3-ui-trace-diagnostics`.
  - [ ] Tạo Pull Request trên GitHub đính kèm ảnh chụp phân tích Network Waterfall và Filmstrip từ Trace Viewer.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.7 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [[SauceDemo_Ecosystem_and_Selection_Rationale]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
