---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Task specification, historical context, code-first philosophy, core concepts, and Definition of Done for WBS 1.1A
---

# WBS 1.1A: Playwright Overview and Code-First Philosophy

## Metadata

- **WBS Code:** `1.1A`
- **Task Name:** Tổng quan Playwright, Lịch sử & Triết lý Code-first
- **Assignee:** Lê Minh Quân (MSSV: 0306241143)
- **Task Weight:** `2.0%`
- **Deliverable Artifacts:** Mục 1.1 Chương 1 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật chi tiết hướng dẫn thành viên phụ trách biên soạn phần Tổng quan Playwright, nguồn gốc lịch sử phát triển từ đội ngũ phát triển Puppeteer tại Microsoft, triết lý thiết kế Code-first hiện đại cho SDET, và 8 khái niệm kiến trúc cốt lõi định hình năng lực tự động hóa kiểm thử.

## Core Architectural Content to Document

### 1. Lịch Sử Phát Triển & Bối Cảnh Ra Đời

- **Nguồn gốc:** Dự án Playwright được khởi xướng và duy trì bởi Microsoft từ năm 2020, được dẫn dắt bởi chính đội ngũ kỹ sư sáng lập dự án Puppeteer (Google).
- **Động lực thúc đẩy:** Giải quyết các giới hạn cốt tử của các công cụ kiểm thử thế hệ trước (Selenium HTTP overhead, Cypress single-tab/iframe limitations).
- **Mô hình cấp phép:** Mã nguồn mở $100\%$ theo giấy phép Apache 2.0, được Microsoft cam kết tài trợ và bảo trợ dài hạn.

### 2. Triết Lý Thiết Kế Code-First Trong Kiểm Thử Phần Mềm

- **Code-First vs Low-Code/Record-Playback:**
  - Triết lý Code-First coi toàn bộ kịch bản kiểm thử là mã nguồn hạng nhất (First-Class Code), tuân thủ đầy đủ các nguyên lý kỹ nghệ phần mềm (DRY, SOLID, Type Safety).
  - Khắc phục sự phụ thuộc vào các công cụ GUI đắt đỏ, dễ gãy (brittle) khi giao diện thay đổi.
  - Tích hợp liền mạch vào hệ thống Git, Code Review và CI/CD Automation.
- **Hỗ trợ đa ngôn ngữ:** Hỗ trợ chính thức TypeScript, JavaScript, Python, Java, và C# (.NET).

### 3. 8 Khái Niệm Cốt Lõi (Playwright Core Concepts)

```text
+------------------------------------------------------------------------+
|                   HE THONG KHAI NIEM COT LOI CUA PLAYWRIGHT            |
+------------------------------------------------------------------------+
| 1. Browser Hierarchy    : Browser ---> BrowserContext ---> Page        |
| 2. Locators             : Role-based, Lazy Evaluation, Strict Mode     |
| 3. Auto-waiting         : Tu dong kiem tra 5 dieu kien Actionability   |
| 4. Web-first Assertions : Tu dong Retry cho den khi dat ky vong        |
| 5. Network Interception : Can thiep & Mock API qua page.route()        |
| 6. APIRequestContext    : Kiem thu API khong can bat trinh duyet       |
| 7. Page Object Model    : Tach biet cau truc giao dien va luong test   |
| 8. Test Fixtures        : Co che Dependency Injection cung cap moi truong|
+------------------------------------------------------------------------+
```

1. **Browser Hierarchy (`Browser -> BrowserContext -> Page`):** Phân cấp tiến trình trình duyệt, không gian bộ nhớ cô lập và tab trang.
2. **Locators (Định vị thế hệ mới):** Định vị dựa trên cây Accessibility Tree (`getByRole`, `getByText`, `getByLabel`), cơ chế Lazy Evaluation không bắt trước DOM, Strict Mode chống bắt nhầm phần tử.
3. **Auto-waiting:** Cơ chế tự động thăm dò (polling) 5 điều kiện Actionability trước khi thực thi action.
4. **Web-first Assertions:** Tự động retry liên tục trong khung thời gian timeout quy định.
5. **Network Interception:** Can thiệp sâu vào tầng mạng qua `page.route()`.
6. **APIRequestContext:** Thực thi các HTTP request trực tiếp không cần khởi tạo trình duyệt đồ họa.
7. **Page Object Model & Component Object Model:** Đóng gói phần tử và hành vi giao diện vào các lớp tái sử dụng.
8. **Test Fixtures:** Quản lý vòng đời và Dependency Injection cho từng bài test.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 1.1 Chương 1: Giới thiệu Playwright, lịch sử hình thành, triết lý Code-first và 8 khái niệm cốt lõi.
  - [ ] Đính kèm sơ đồ cây 8 khái niệm cốt lõi.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[Playwright_Hard_Technical_Boundaries_and_Non_Goals]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
