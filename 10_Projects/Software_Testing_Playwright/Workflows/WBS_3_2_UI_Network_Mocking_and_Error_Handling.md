---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, CDP network interception, error boundary testing, and Definition of Done for WBS 3.2
---

# WBS 3.2: Web UI Test Suite - Network Mocking and Error Handling

## Metadata

- **WBS Code:** `3.2`
- **Task Name:** UI Ca 2: Network Mocking page.route() HTTP 500 & Locked-out User
- **Assignee:** Ngô Gia Bảo (MSSV: 0306241090)
- **Task Weight:** `6.0%`
- **Deliverable Artifacts:** File mã nguồn `src/ui/specs/network_mock.spec.ts`, Pull Request GitHub, Mục 3.6 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử tự động Web UI Ca 2: Kiểm thử tính bền vững và khả năng chịu lỗi của giao diện người dùng (UI Fault Tolerance & Graceful Degradation). Kịch bản bao gồm kiểm tra phản hồi khi người dùng bị khóa tài khoản (`locked_out_user`) và kỹ thuật can thiệp tầng mạng ở cấp độ CDP (`page.route()`) để giả lập lỗi máy chủ HTTP 500 Internal Server Error và mạng chập chờn.

## Core Architectural Content to Implement

### 1. Kịch Bản 1: Kiểm Thử Tài Khoản Bị Khóa (Locked-Out User)

- **Mục tiêu:** Đảm bảo hệ thống phát hiện chính xác người dùng bị vô hiệu hóa quyền truy cập và hiển thị cảnh báo trực quan rõ ràng.
- **Quy trình thực hiện:**
  1. Điều hướng đến `https://www.saucedemo.com`.
  2. Nhập thông tin tài khoản bị khóa: `username: locked_out_user`, `password: secret_sauce`.
  3. Nhấp nút `Login`.
  4. Xác thực thông báo lỗi hiển thị chính xác: `Epic sadface: Sorry, this user has been locked out.`.
  5. Xác thực các trường nhập liệu xuất hiện thuộc tính viền đỏ cảnh báo lỗi và biểu tượng `svg.error_icon`.

### 2. Kịch Bản 2: Can Thiệp Tầng Mạng Giả Lập Lỗi HTTP 500 (`page.route()`)

```text
+-------------------+                                                                +-------------------+
|  Browser Engine   | ----> HTTP GET /api/v1/products -----------------------------> |  Backend Server   |
|  (Chromium DOM)   |                                                                |  (Bi Playwright   |
+-------------------+                                                                |   chan truoc khi  |
        ^                                                                            |   toi server!)    |
        |                                                                            +-------------------+
        |                                                                                      |
        +=================== HTTP 500 Internal Server Error <==================================+
                             (Playwright page.route() fulfill truc tiep tu RAM)
```

- **Mã nguồn thực thi mẫu:**
  ```typescript
  test("UI Graceful Degradation on HTTP 500 Server Error", async ({ page }) => {
    // Can thiep vao request mang truoc khi no roi khoi trinh duyet
    await page.route("**/api/v1/inventory", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Database Connection Failed" }),
      });
    });

    await page.goto("/inventory.html");

    // Xac thuc giao dien khong bi "trang man hinh" ma hien thi Error Banner
    const errorBanner = page.getByRole("alert");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(
      "Unable to load products. Please try again later.",
    );
  });
  ```

### 3. Kịch Bản 3: Giả Lập Mạng Chậm (Network Latency & Loading State)

- Sử dụng `route.fulfill({ delay: 3000, ... })` để tạo độ trễ mạng giả lập.
- Kiểm tra hiệu ứng Loading Skeleton / Spinner hiển thị mượt mà trong khi chờ dữ liệu.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `src/ui/specs/network_mock.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test network_mock.spec.ts --project=chromium` pass $100\%$.
  - [ ] Kiểm chứng đầy đủ cả 2 kịch bản: Locked-out user và `page.route()` HTTP 500.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-3.2-ui-network-mock`.
  - [ ] Tạo Pull Request trên GitHub với mô tả chi tiết và ảnh chụp màn hình test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.6 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Network_Interception_and_Mocking_Mechanics]]
- [[SauceDemo_Ecosystem_and_Selection_Rationale]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
