---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep technical comparison between Playwright, Selenium 4, and Cypress with Definition of Done for WBS 1.5B
---

# WBS 1.5B: Playwright vs Selenium and Cypress Comparison

## Metadata

- **WBS Code:** `1.5B`
- **Task Name:** So sánh đối sánh Playwright vs Selenium 4 & Cypress (HTTP vs CDP, Multi-tab)
- **Assignee:** Nguyễn Quốc Đương (MSSV: 0306241102)
- **Task Weight:** `2.0%`
- **Deliverable Artifacts:** Mục 4.1B Chương 4 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả nội dung so sánh kỹ thuật giữa Playwright và 2 công cụ mã nguồn mở phổ biến nhất thế giới hiện nay: **Selenium 4** và **Cypress**. Phân tích sâu các khía cạnh kiến trúc: Giao thức điều khiển (HTTP vs In-Browser vs CDP), năng lực xử lý đa tab / đa domain (Multi-Tab & Cross-Origin), và khả năng chạy song song độc lập.

## Core Architectural Content to Document

### 1. Phân Tích 3 Trường Phái Kiến Trúc Thực Thi

```text
1. SELENIUM (Ngoai vi qua HTTP Proxy):
   Test Code ---> HTTP Request ---> Chromedriver Proxy ---> Trinh duyet (Do tre cao, khong State)

2. CYPRESS (Bên trong trinh duyet - In-Browser Iframe):
   Trinh duyet [ Iframe Test Code <---> Iframe App ] (Bi gioi han boi Sandbox trinh duyet, khong da tab that)

3. PLAYWRIGHT (Truc tiep qua WebSocket CDP):
   Test Code <==== WebSocket (Full-Duplex) ====> Loi trinh duyet (Khong bi Sandbox, da tab, toc do cuc cao)
```

- **Selenium 4 (W3C WebDriver):** Tiếp tục duy trì mô hình gửi request HTTP qua tiến trình Driver trung gian. Dù Selenium 4 đã bổ sung hỗ trợ CDP hạn chế, kiến trúc cốt lõi vẫn phụ thuộc vào chuẩn W3C HTTP.
- **Cypress (In-Browser Execution):** Mã kiểm thử chạy trực tiếp bên trong một iframe của trình duyệt. Mô hình này giúp Cypress tương tác nhanh với DOM nhưng lại tạo ra các giới hạn kỹ thuật không thể khắc phục:
  - Không hỗ trợ mở nhiều tab hoặc nhiều cửa sổ trình duyệt cùng lúc.
  - Xung đột nghiêm trọng khi chuyển đổi giữa các tên miền khác nhau (Cross-Origin Navigation / OAuth Single Sign-On).
- **Playwright (Out-of-Process WebSocket):** Mã kiểm thử chạy bên ngoài nhưng kết nối trực tiếp vào lõi trình duyệt qua WebSocket, sở hữu toàn quyền điều khiển mà không bị giới hạn bởi bảo mật Sandbox của JavaScript trong trình duyệt.

### 2. Ma Trận So Sánh Kỹ Thuật 3 Công Cụ

| Tiêu Chí Kỹ Thuật                 | Playwright                                               | Selenium 4                                | Cypress                                                |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Cơ chế thực thi**               | Out-of-process qua WebSocket CDP                         | Out-of-process qua HTTP WebDriver         | In-browser bên trong Iframe                            |
| **Hỗ trợ Đa Tab & Đa Domain**     | **Hoàn hảo** (Mở không giới hạn qua `context.newPage()`) | Hỗ trợ (Chuyển đổi Window Handle)         | **Bị giới hạn nghiêm ngặt** (Không hỗ trợ đa tab thật) |
| **Kiểm thử API Native**           | **Có sẵn** (`APIRequestContext`)                         | **Không có** (Cần thư viện phụ trợ)       | Có sẵn (`cy.request`)                                  |
| **Thực thi Song Song (Parallel)** | **Native Multi-Worker miễn phí**                         | Cần cài đặt Selenium Grid phức tạp        | Phải trả phí cho Cypress Cloud Dashboard               |
| **Tốc độ khởi tạo môi trường**    | Siêu nhanh ($< 10\text{ms}$ qua `BrowserContext`)        | Chậm ($> 1500\text{ms}$ mở Browser mới)   | Nhanh trên 1 tab                                       |
| **Ngôn ngữ hỗ trợ**               | TS, JS, Python, Java, C#                                 | Đa dạng nhất (Java, Python, C#, JS, Ruby) | Chỉ hỗ trợ JavaScript / TypeScript                     |

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 4.1B Chương 4: Bảng so sánh 3 công cụ Playwright, Selenium 4 và Cypress.
  - [ ] Phân tích rõ các hạn chế cốt tử của Cypress (In-Browser Sandbox) và Selenium (HTTP Overhead).
  - [ ] Đính kèm sơ đồ 3 trường phái kiến trúc thực thi.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Playwright_vs_Selenium_and_Puppeteer_Comparison]]
- [[Playwright_vs_Cypress_Architectural_Comparison]]
- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
