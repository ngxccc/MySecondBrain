---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep architectural breakdown, protocol mechanics, and Definition of Done for WBS 1.1B - WebSocket CDP vs HTTP WebDriver Architecture
---

# WBS 1.1B: WebSocket CDP vs HTTP WebDriver Architecture

## Metadata

- **WBS Code:** `1.1B`
- **Task Name:** Kiến trúc kết nối WebSocket CDP vs HTTP WebDriver
- **Assignee:** Trần Văn Ngọc (MSSV: 0306241131)
- **Task Weight:** `2.0%`
- **Deliverable Artifacts:** Mục 1.2 Chương 1 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kiến trúc kỹ thuật phân tích sự khác biệt bản chất giữa mô hình kết nối của Playwright (Single Persistent WebSocket Connection qua Chrome DevTools Protocol) và mô hình truyền thống của Selenium WebDriver (HTTP REST Stateless Request-Response), giải thích nguyên nhân gốc rễ giúp Playwright đạt hiệu năng thực thi vượt trội và khả năng bắt sự kiện thời gian thực.

## Core Architectural Content to Document

### 1. Phân Tích Kiến Trúc Kết Nối Truyền Thống: Selenium HTTP WebDriver

```text
+-------------------+      HTTP REST POST      +----------------------+      Driver IPC      +-------------------+
|  Selenium Test    | -----------------------> |  chromedriver.exe    | -------------------> |  Browser Process  |
|  Runner (Client)  | <----------------------- |  (HTTP Server Proxy) | <------------------- |  (Chromium Engine)|
+-------------------+      HTTP Response 200   +----------------------+      Native Events   +-------------------+
     (Moi thao tac click/find la 1 HTTP Request rieng biet gay ra do tre mang TCP Handshake lon)
```

- **Mô hình Proxy trung gian:** Mã kiểm thử không giao tiếp trực tiếp với trình duyệt mà phải đi qua một tiến trình máy chủ trung gian (`chromedriver`, `geckodriver`).
- **Giao thức HTTP Không Trạng Thái (Stateless):** Mỗi thao tác (click, fill, findElement) là một HTTP POST request độc lập, dẫn đến chi phí đóng gói/giải mã HTTP headers và độ trễ Round-Trip Time (RTT) rất lớn.
- **Polling thụ động:** Không có cơ chế nhận sự kiện đẩy từ trình duyệt; client phải liên tục gửi request polling để kiểm tra trạng thái DOM.

### 2. Phân Tích Kiến Trúc Hiện Đại: Playwright WebSocket CDP

```text
+-------------------+                        Single Persistent WebSocket Pipe                  +-------------------+
|  Playwright Node  | <======================================================================> |  Browser Process  |
|  Driver Process   |               JSON-RPC 2.0 (Bi-directional / Multiplexed)                |  (CDP / WebKit)   |
+-------------------+                                                                          +-------------------+
     (1 ket noi duy nhat, Push Notifications tuc thi, do tre micro-giay khong can HTTP Server)
```

- **Kết nối Hai Chiều Bền Vững (Single Persistent WebSocket):** Chỉ mở một kết nối WebSocket duy nhất cho toàn bộ phiên kiểm thử, loại bỏ $100\%$ chi phí TCP handshake và HTTP header overhead.
- **Đa Kênh Ghép Lồng (Multiplexed JSON-RPC 2.0):** Cho phép truyền đồng thời nhiều lệnh và luồng dữ liệu độc lập trên cùng một kết nối mà không bị nghẽn (Head-of-Line Blocking).
- **Cơ Chế Đẩy Sự Kiện Thời Gian Thực (Event-Driven Push Notifications):** Trình duyệt chủ động gửi thông báo (Network request finished, DOM mutation, Console message) về cho Playwright Driver ngay khi sự kiện phát sinh, phục vụ tính năng Network Mocking và Auto-waiting tức thì.

### 3. Bảng Đối Soát Thông Số Kỹ Thuật

| Tiêu Chí Kiến Trúc                | Selenium HTTP WebDriver                        | Playwright WebSocket CDP                          |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| **Giao thức vận chuyển**          | HTTP 1.1 REST (Stateless)                      | WebSocket RFC 6455 (Stateful, Full-duplex)        |
| **Tiến trình trung gian**         | Bắt buộc (`chromedriver`, `geckodriver`)       | Không cần (Giao tiếp trực tiếp qua Pipe/Socket)   |
| **Độ trễ mỗi thao tác**           | $10\text{ms} - 50\text{ms}$ (Do HTTP Overhead) | $< 1\text{ms}$ (Truyền tải Frame JSON qua Socket) |
| **Khả năng lắng nghe sự kiện**    | Polling thụ động qua HTTP                      | Lắng nghe chủ động qua CDP Event Stream           |
| **Kiểm soát tầng mạng (Network)** | Rất hạn chế (Cần BrowserMob Proxy)             | Toàn quyền can thiệp, sửa đổi và Mocking qua CDP  |

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 1.2 Chương 1: Kiến trúc kết nối WebSocket CDP so với HTTP WebDriver.
  - [ ] Đính kèm sơ đồ kiến trúc so sánh 2 mô hình (ASCII Art hoặc Vector Diagram).
  - [ ] Bảng đối soát 5 tiêu chí kỹ thuật rõ ràng.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Browser_Automation_IPC_Fundamentals]]
- [[Chrome_DevTools_Protocol_Mechanics]]
- [[WebDriver_vs_CDP_Architectural_Comparison]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
