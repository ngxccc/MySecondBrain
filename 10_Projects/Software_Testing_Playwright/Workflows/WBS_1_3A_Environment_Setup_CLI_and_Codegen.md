---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Step-by-step setup tutorial, TypeScript configuration, CLI execution flags, Codegen recording guide, and Definition of Done for WBS 1.3A
---

# WBS 1.3A: Environment Setup, CLI Commands, and Playwright Codegen

## Metadata

- **WBS Code:** `1.3A`
- **Task Name:** Quy trình cài đặt môi trường, TypeScript, Playwright CLI & Codegen
- **Assignee:** Ngô Gia Bảo (MSSV: 0306241090)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 2.1 & 2.2A Chương 2 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu hướng dẫn chi tiết quy trình thiết lập môi trường phát triển kiểm thử tự động với Node.js/Bun, khởi tạo dự án TypeScript với Playwright Test Engine, tổng hợp bảng tra cứu các cờ lệnh dòng lệnh (CLI Commands) cốt lõi và hướng dẫn vận hành công cụ sinh mã nguồn tự động thông minh (Playwright Codegen).

## Core Architectural Content to Document

### 1. Quy Trình Cài Đặt & Khởi Tạo Dự Án Mới

```bash
# Buoc 1: Khoi tao du an Playwright voi TypeScript
npm init playwright@latest

# Tuan thu cac thiet lap mac dinh:
# - Ngon ngu: TypeScript
# - Thu muc test: src/ (hoac tests/)
# - Cai dat trinh duyet Playwright Browsers: Yes
# - Cai dat GitHub Actions Workflow: Yes

# Buoc 2: Cai dat bo trinh duyet Chromium va cac thu vien he dieu hanh phu thuoc
npx playwright install --with-deps chromium

# Buoc 3: Cai dat cac goi ho tro nghiep vu
npm install dotenv zod @faker-js/faker --save-dev
```

### 2. Bảng Tra Cứu Cờ Lệnh Dòng Lệnh Cốt Lõi (Playwright CLI Commands)

| Lệnh CLI Thực Thi                         | Ý Nghĩa Kỹ Thuật & Tình Huống Sử Dụng                                  |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `npx playwright test`                     | Thực thi toàn bộ test suite ở chế độ không đầu (Headless mode).        |
| `npx playwright test --headed`            | Bật giao diện đồ họa trình duyệt để quan sát trực tiếp luồng thao tác. |
| `npx playwright test --project=api-tests` | Chỉ thực thi các bài test thuộc cấu hình dự án API (không mở browser). |
| `npx playwright test --project=chromium`  | Chỉ thực thi các bài test thuộc cấu hình Web UI trên Chromium.         |
| `npx playwright test -g "@smoke"`         | Lọc và chỉ chạy các bài test có chứa tag `@smoke` trong tiêu đề.       |
| `npx playwright test --workers=4`         | Giới hạn số lượng luồng thực thi song song (Worker Threads) là 4.      |
| `npx playwright test --retries=2`         | Tự động chạy lại tối đa 2 lần đối với các bài test bị thất bại.        |
| `npx playwright show-report`              | Khởi động máy chủ Web nội bộ để xem báo cáo kết quả kiểm thử HTML.     |

### 3. Hướng Dẫn Sử Dụng Playwright Codegen (Record & Playback)

- **Lệnh kích hoạt:**
  ```bash
  npx playwright codegen https://www.saucedemo.com
  ```
- **Cơ chế hoạt động:**
  1. Trình duyệt tự động mở trang web đích kèm theo cửa sổ tiện ích **Playwright Inspector**.
  2. Mọi thao tác tương tác của người dùng (Click, Gõ phím, Chọn dropdown) được phân tích qua cây Accessibility Tree và tự động chuyển đổi thành các bộ định vị chuẩn (`getByRole`, `getByPlaceholder`, `getByTestId`).
  3. Lập trình viên có thể chuyển đổi ngôn ngữ sinh mã trực tiếp (TypeScript, JavaScript, Python, C#, Java).
  4. Hỗ trợ giả lập thiết bị di động (Mobile Emulation) qua cờ `--device="iPhone 14"`.
  5. Hỗ trợ lưu phiên đăng nhập tự động qua cờ `--save-storage=auth.json`.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 2.1 & 2.2A Chương 2: Hướng dẫn cài đặt môi trường, bảng tổng hợp cờ lệnh CLI và hướng dẫn sử dụng Codegen.
  - [ ] Đính kèm tối thiểu 2 ảnh chụp màn hình minh họa thực tế: Cửa sổ terminal cài đặt thành công và giao diện Codegen đang ghi nhận thao tác.
  - [ ] Định dạng khối code rõ ràng, tô màu cú pháp.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[WBS_1_6_Multi_Project_Framework_Setup_and_CI]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
