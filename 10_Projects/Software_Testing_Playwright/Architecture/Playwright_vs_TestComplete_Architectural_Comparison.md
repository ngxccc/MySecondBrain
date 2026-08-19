---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Multi-dimensional architectural comparison between Playwright (Code-first Open-source) and TestComplete (Commercial Low-code)
---

# Playwright vs TestComplete Architectural Comparison

## TL;DR

Playwright và TestComplete đại diện cho hai triết lý kiểm thử tự động đối nghịch: **Code-first Developer-centric** (Mã nguồn mở hướng tới kỹ sư phần mềm) và **Low-code / Scriptless Enterprise-centric** (Nền tảng thương mại đóng gói sẵn hướng tới Manual QA). Playwright thống trị các ứng dụng Web/API hiện đại nhờ giao thức Chrome DevTools Protocol (CDP) trực tiếp, khả năng mở rộng không giới hạn trên Linux Docker CI/CD và chi phí bản quyền $0$. Ngược lại, TestComplete duy trì vị thế trong các doanh nghiệp truyền thống nhờ khả năng điều khiển các ứng dụng Windows Native Desktop (WinForms, WPF, Delphi) và giao diện kéo thả Record-and-Replay.

## Multi-Dimensional Comparison Matrix

| Tiêu Chí So Sánh              | Playwright (Microsoft)                                | TestComplete (SmartBear)                                        |
| ----------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| **Triết lý Cốt lõi**          | Code-first, Modularity, Developer-friendly            | Low-code, Keyword-driven, Record & Replay                       |
| **Giao thức Tương tác**       | CDP / WebSocket trực tiếp tới Browser Engine          | OS API Hooking (Win32, UI Automation) & Browser Extensions      |
| **Phạm vi Nền tảng**          | Web (Chromium, Firefox, WebKit), Mobile Web, REST API | Web, Mobile (iOS, Android), **Windows Native Desktop**          |
| **Kiểm soát Phiên bản (Git)** | TypeScript/JS plain-text, Git diff rõ ràng            | Monolithic XML (`NameMapping.tcNM`), dễ hỏng khi merge conflict |
| **Môi trường CI/CD**          | Native Linux Docker Containers (nhẹ, nhanh, headless) | Yêu cầu Windows OS, license server, GUI session phức tạp        |
| **Chi phí Bản quyền (TCO)**   | $0 (Mã nguồn mở Apache 2.0)                           | Đắt đỏ (hàng ngàn USD/node/năm)                                 |
| **Rào cản Kỹ thuật**          | Yêu cầu tư duy lập trình (Async, POM, TypeScript)     | Thấp, phù hợp cho Manual QA không biết code                     |

## Deep Dive 1: Git Collaboration & The Monolithic XML Conflict

Khác biệt lớn nhất trong quy trình làm việc nhóm (Team Collaboration):

```text
[Playwright: Mã nguồn Plain-Text Phân Tán]
src/pages/booking.page.ts
src/tests/booking.spec.ts
===> Khi 2 kỹ sư cùng sửa code: Git diff từng dòng, resolve conflict như code ứng dụng.

─────────────────────────────────────────────────────────────────────────────

[TestComplete: Kho Đối tượng Tập trung Name Mapping]
ProjectRoot/NameMapping/NameMapping.tcNM (File XML nguyên khối khổng lồ)
===> Khi 2 kỹ sư cùng ghi hình thêm phần tử mới:
     Git Merge Conflict làm hỏng cấu trúc thẻ XML và GUID reference!
     Dự án có nguy cơ mất toàn bộ cây định danh đối tượng (Object Repository).
```

## Deep Dive 2: OS-Level Windows Hooking vs Browser CDP Engine

Lý do Playwright không thể kiểm thử ứng dụng Desktop cũ không nằm ở ngôn ngữ lập trình, mà nằm ở **Tầng Giao tiếp Kiến trúc (Communication Layer)**:

```text
[Playwright Communication Architecture]
Node.js Test Runner ──(WebSocket / CDP)──▶ [Browser Process: Blink / Gecko / WebKit]
                                                    │
                                           (Chỉ hiểu DOM / HTML)
                                                    ❌
                                    (Không thể chạm tới Windows OS)

─────────────────────────────────────────────────────────────────────────────

[TestComplete Communication Architecture]
TestComplete Engine ──(Win32 Hooks / COM / UI Automation)──▶ [Windows OS Kernel]
                                                                     │
                                                   ┌─────────────────┴─────────────────┐
                                                   ▼                                   ▼
                                       [WinForms / WPF Desktop App]           [Web Browser Window]
```

- **Playwright:** Không có driver kết nối với Windows Window Handles (`HWND`) hay .NET CLR. Nó chỉ được sinh ra để điều khiển các Browser Engine chạy HTML/CSS/JS.
- **TestComplete:** Nhúng các hook cấp hệ điều hành (OS-level hooks), đọc trực tiếp bộ nhớ process của Windows để nhận diện các control native (.NET button, DataGridView, C++ menu).

## Deep Dive 3: Total Cost of Ownership (TCO) & Decision Framework

### Khi nào Doanh nghiệp NÊN chọn TestComplete?

1. **Ứng dụng Native Desktop Cũ:** Hệ thống cốt lõi là các phần mềm WinForms, WPF, C++ Desktop không có giao diện Web.
2. **Cơ cấu Nhân sự Manual QA:** Đội ngũ kiểm thử gồm các chuyên gia nghiệp vụ (Domain Experts) hoặc Manual QA không có nền tảng lập trình, cần bàn giao dự án nhanh bằng Record & Replay.
3. **Ngân sách Doanh nghiệp Dồi dào:** Chấp nhận chi trả chi phí bản quyền hàng năm để đổi lấy sự hỗ trợ chính hãng (Enterprise SLA Support).

### Khi nào Doanh nghiệp BẮT BUỘC chọn Playwright?

1. **Ứng dụng Web / Cloud-Native Hiện đại:** Hệ thống xây dựng trên React, Next.js, Vue, Microservices.
2. **Quy trình DevOps / CI-CD Tốc độ cao:** Cần chạy hàng trăm bài test song song trên các cụm Docker Linux giá rẻ trên GitHub Actions / GitLab CI.
3. **Văn hóa Kỹ thuật Code-first (SDET):** Đội ngũ coi Test Suite là tài sản phần mềm chất lượng cao, quản lý bằng Git Flow, Code Review và Clean Architecture (POM/COM/SOM).

## Related Notes

- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[Page_Object_Model_and_Component_Architecture]]
- [[Service_Object_Model_and_API_Request_Chaining]]
- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [[000_Software_Testing_Playwright_MOC]]
