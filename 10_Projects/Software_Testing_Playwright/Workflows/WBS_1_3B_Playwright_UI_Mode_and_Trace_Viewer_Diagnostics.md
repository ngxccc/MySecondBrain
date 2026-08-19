---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep operational guide for Playwright UI Mode and Trace Viewer post-mortem diagnostics with Definition of Done for WBS 1.3B
---

# WBS 1.3B: Playwright UI Mode and Trace Viewer Diagnostics

## Metadata

- **WBS Code:** `1.3B`
- **Task Name:** Hướng dẫn chuyên sâu Playwright UI Mode & Trình gỡ lỗi Trace Viewer
- **Assignee:** Lê Minh Tài (MSSV: 0306241145)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 2.2B Chương 2 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu hướng dẫn chuyên sâu cách vận hành 2 công cụ đồ họa trực quan mạnh mẽ nhất của hệ sinh thái Playwright: **UI Mode** (môi trường gỡ lỗi và tương tác trực tiếp theo thời gian thực) và **Trace Viewer** (hệ thống điều tra và khám nghiệm sự cố hậu kỳ sau khi test bị fail trên máy chủ CI/CD).

## Core Architectural Content to Document

### 1. Giao Diện Tương Tác Thời Gian Thực (Playwright UI Mode)

```bash
# Khoi dong giao dien UI Mode
npx playwright test --ui
```

- **Các tính năng kỹ thuật nổi bật:**
  1. **Cây Test Suite Trực Quan:** Xem danh sách toàn bộ các file kiểm thử, trạng thái Pass/Fail, thời gian thực thi của từng bước kiểm thử.
  2. **Watch Mode (Chế độ tự động theo dõi):** Tự động phát hiện thay đổi trên mã nguồn và kích hoạt chạy lại bài test ngay lập tức mà không cần gõ lại lệnh.
  3. **Time-Travel Debugging (Tua ngược dòng thời gian):** Di chuột qua từng dòng lệnh kiểm thử để quan sát trạng thái giao diện DOM trước khi click (`Before`), trong khi click (`Action`), và sau khi click (`After`).
  4. **Locator Picker Tương Tác:** Nhấp chuột vào bất kỳ phần tử nào trên màn hình để Playwright tự động gợi ý bộ định vị tối ưu nhất.
  5. **Bảng Phân Tích Đa Luồng:** Cung cấp đồng thời tab `Console Logs`, `Network Waterfall` (thống kê toàn bộ API calls), `Source Code`, và `Call Log` chi tiết.

### 2. Trình Gỡ Lỗi Hậu Kỳ (Playwright Trace Viewer)

```bash
# Mo file trace.zip de phan tich su co
npx playwright show-trace test-results/glitch-test/trace.zip
```

- **Bản chất của Trace Viewer:** Là giải pháp ghi vết toàn diện ($100\%$ Audit Trail) giúp kỹ sư kiểm thử tái hiện chính xác nguyên nhân lỗi mà không cần chạy lại bài test.
- **Cấu hình thu thập Trace trong `playwright.config.ts`:**
  ```typescript
  use: {
    trace: 'on-first-retry', // Chi ghi trace khi bai test bi fail lan dau va chay lai
  }
  ```
- **4 Luồng Dữ Liệu Kiểm Toán Trong File `trace.zip`:**
  1. **Filmstrip Timeline:** Chuỗi ảnh chụp màn hình tuần tự theo từng mili-giây, cho phép kéo thanh trượt để quan sát toàn bộ chuyển động của trình duyệt.
  2. **Action Snapshots:** Ảnh chụp DOM dạng tương tác thực (có thể inspect phần tử trực tiếp trên snapshot).
  3. **Network Log (HAR):** Ghi nhận toàn bộ thông tin Header, Request Body, Response Status, và thời gian trễ của mọi API call.
  4. **Console & Source Stack:** Hiển thị chính xác dòng mã nguồn gây ra lỗi và thông điệp Exception từ trình duyệt.
- **Xem Trace trên Cloud:** Sử dụng dịch vụ [trace.playwright.dev](https://trace.playwright.dev) để kéo-thả file `.zip` phân tích trực tiếp trên trình duyệt mà không cần cài đặt Node.js.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 2.2B Chương 2: Phân tích chi tiết giao diện UI Mode và công cụ Trace Viewer.
  - [ ] Đính kèm tối thiểu 3 ảnh chụp màn hình minh họa sắc nét: Giao diện UI Mode tổng quan, tính năng Time-travel DOM snapshot, và giao diện Trace Viewer với Network Waterfall.
  - [ ] Hướng dẫn cách cấu hình thu thập trace trong file cấu hình.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
