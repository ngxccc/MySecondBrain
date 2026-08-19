---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep architectural breakdown of BrowserContext isolation, memory footprint optimization, storageState caching, and Definition of Done for WBS 1.2B
---

# WBS 1.2B: Browser Context Isolation and Memory Optimization

## Metadata

- **WBS Code:** `1.2B`
- **Task Name:** Cơ chế Browser Context Isolation & Tối ưu hóa Bộ nhớ RAM
- **Assignee:** Nguyễn Quốc Đương (MSSV: 0306241102)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 1.4 Chương 1 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kiến trúc bộ nhớ và cơ chế cô lập ngữ cảnh trình duyệt (Browser Context Isolation) của Playwright. Phân tích nguyên lý tạo môi trường ảo hóa trong RAM tương đương cửa sổ ẩn danh (Incognito), cho phép chạy song song hàng trăm ca kiểm thử độc lập mà không cần khởi động lại tiến trình trình duyệt vật lý, giúp tiết kiệm $90\%$ dung lượng RAM và rút ngắn thời gian thực thi.

## Core Architectural Content to Document

### 1. Phân Tầng Tiến Trình: Browser Process vs BrowserContext

```text
+----------------------------------------------------------------------------------------------------+
|                                      BROWSER PROCESS (OS Level)                                    |
|   (Khoi dong 1 lan duy nhat: ~1500ms, tieu ton ~150MB RAM, quan ly Renderer & Network Service)     |
+----------------------------------------------------------------------------------------------------+
       |                                      |                                      |
       v                                      v                                      v
+-----------------------------+ +-----------------------------+ +-----------------------------+
|    BrowserContext 1 (RAM)   | |    BrowserContext 2 (RAM)   | |    BrowserContext 3 (RAM)   |
| (Khoi tao: ~5ms, ~1MB RAM)  | | (Khoi tao: ~5ms, ~1MB RAM)  | | (Khoi tao: ~5ms, ~1MB RAM)  |
| - Cookies (User A)          | | - Cookies (User B)          | | - Cookies (Admin)           |
| - LocalStorage / Session    | | - LocalStorage / Session    | | - LocalStorage / Session    |
| - IndexedDB / Cache         | | - IndexedDB / Cache         | | - IndexedDB / Cache         |
+-----------------------------+ +-----------------------------+ +-----------------------------+
```

- **Browser Process (Tiến trình hệ điều hành):** Là tiến trình nhị phân của trình duyệt (Chromium, Firefox, WebKit). Quá trình khởi động tiến trình này rất nặng nề về CPU và bộ nhớ RAM.
- **BrowserContext (Không gian ngữ cảnh trong RAM):** Là một phiên làm việc cô lập hoàn toàn bên trong bộ nhớ của Browser Process hiện hữu.
  - Thời gian khởi tạo một BrowserContext mới chỉ mất khoảng $2\text{ms} - 10\text{ms}$.
  - Dung lượng RAM tiêu tốn cho mỗi context chỉ khoảng vài Megabytes.

### 2. Cơ Chế Cô Lập Trạng Thái Tuyệt Đối (State Isolation)

Mỗi `BrowserContext` sở hữu không gian lưu trữ dữ liệu hoàn toàn độc lập:

1. **Cookies:** Cookie của phiên làm việc trong Context 1 không thể nhìn thấy hoặc ghi đè từ Context 2.
2. **Web Storage:** `localStorage` và `sessionStorage` được khởi tạo mới hoàn toàn trống rỗng cho mỗi context.
3. **IndexedDB & Service Workers:** Được đóng gói riêng biệt, ngăn ngừa xung đột dữ liệu cache giữa các bài test.
4. **Quyền hạn (Permissions) & Định vị địa lý (Geolocation):** Có thể cấp quyền cho từng context riêng lẻ (ví dụ: Context 1 giả lập ở Tokyo, Context 2 giả lập ở New York).

### 3. Cơ Chế Quản Lý Phiên Xác Thực Nhanh (`storageState`)

- **Vấn đề:** Đăng nhập qua giao diện người dùng (nhập username, password, click login, chờ OTP) trong từng bài test làm tăng thời gian thực thi lên nhiều lần.
- **Giải pháp:**
  - Thực hiện đăng nhập một lần duy nhất trong giai đoạn Setup (hoặc qua API).
  - Xuất toàn bộ Cookies và LocalStorage ra file `storageState.json`.
  - Khởi tạo các `BrowserContext` tiếp theo với tùy chọn `storageState: 'auth.json'`, giúp trang web ở trạng thái đã đăng nhập sẵn ngay khi mở trình duyệt mà không cần chạy lại các bước đăng nhập.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 1.4 Chương 1: Phân tích kiến trúc BrowserContext, cơ chế cô lập bộ nhớ và kỹ thuật `storageState`.
  - [ ] Đính kèm sơ đồ cây phân cấp bộ nhớ Browser -> BrowserContext -> Page.
  - [ ] Bảng so sánh tài nguyên giữa việc tạo Browser mới và tạo BrowserContext mới.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Browser_Context_Isolation]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
