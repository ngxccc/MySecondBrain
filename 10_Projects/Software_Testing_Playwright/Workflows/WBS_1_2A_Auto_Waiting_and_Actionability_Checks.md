---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep technical specification of Playwright 5-step actionability checks, anti-flaky mechanisms, and Definition of Done for WBS 1.2A
---

# WBS 1.2A: Auto-Waiting and Actionability Checks Mechanics

## Metadata

- **WBS Code:** `1.2A`
- **Task Name:** Cơ chế Auto-waiting 5 bước & Actionability Checks
- **Assignee:** Đặng Duy Lam (MSSV: 0306241125)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 1.3 Chương 1 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả cơ chế tự động đồng bộ hóa (Auto-waiting) và 5 bước kiểm tra khả năng hành động (Actionability Checks) của Playwright. Giải thích bản chất toán học và cơ chế nội tại loại bỏ hoàn toàn các lỗi kiểm thử không ổn định (Flaky Tests), triệt tiêu các lệnh chờ tĩnh (`sleep()`) gây lãng phí tài nguyên trong quy trình CI/CD.

## Core Architectural Content to Document

### 1. Vấn Đề Flaky Tests & Sự Bất Đồng Bộ Trong Single Page Applications (SPA)

- **Nguyên nhân cốt lõi gây Flaky Tests:**
  - Cây DOM thay đổi động do JavaScript Frameworks (React, Vue, Angular).
  - Độ trễ phản hồi từ mạng (Network Latency) và các hiệu ứng chuyển động CSS (CSS Transitions / Keyframe Animations).
  - Mã kiểm thử thực thi lệnh click/fill khi phần tử chưa sẵn sàng nhận tương tác, gây ra các ngoại lệ như `ElementNotInteractableException` hoặc `StaleElementReferenceException`.
- **Hạn chế của phương pháp truyền thống:**
  - Dùng `sleep(3000)`: Làm phình to thời gian chạy test suite gấp nhiều lần, nhưng vẫn có thể fail nếu mạng bị nghẽn quá $3000\text{ms}$.
  - Dùng `WebDriverWait`: Đòi hỏi lập trình viên phải tự phán đoán và viết mã kiểm tra từng trạng thái, dễ bỏ sót điều kiện che khuất (Overlay).

### 2. 5 Bước Kiểm Tra Actionability Checks Của Playwright

Trước khi thực hiện bất kỳ thao tác người dùng nào (Click, Fill, Check, Select), Playwright tự động thực hiện chuỗi 5 bước kiểm tra sau:

```text
+----------------------------------------------------------------------------------------------------+
|                         5 BUOC KIEM TRA ACTIONABILITY CHECKS TRUOC KHI CLICK                       |
+----------------------------------------------------------------------------------------------------+
| 1. Attached   : Phan tu da ton tai trong cay DOM cua Document chua?                                |
| 2. Visible    : Co kich thuoc hinh hoc > 0, khong bi display:none, visibility:hidden, opacity:0?   |
| 3. Stable     : Bounding box khong bi di chuyen qua 2 animation frames lien tiep?                  |
| 4. Enabled    : Thuoc tinh disabled cua the HTML la false?                                         |
| 5. Unobscured : Diem tam (Center point) co nhan su kien click, hay bi Modal / Backdrop che mat?    |
+----------------------------------------------------------------------------------------------------+
```

1. **Attached:** Phần tử phải được gắn vào DOM của trang web hoặc một iframe hợp lệ.
2. **Visible:** Phần tử phải có kích thước hình học không rỗng (`width > 0` và `height > 0`), không mang các thuộc tính CSS ẩn (`display: none`, `visibility: hidden`, hoặc `opacity: 0`).
3. **Stable:** Tọa độ của phần tử không bị biến đổi trong tối thiểu 2 khung hình chuyển động liên tiếp (`requestAnimationFrame`), đảm bảo phần tử đã hoàn tất hiệu ứng trượt/phóng to CSS.
4. **Enabled:** Phần tử không nằm trong trạng thái vô hiệu hóa (`disabled` attribute).
5. **Editable & Unobscured:** Tọa độ tâm của phần tử phải trực tiếp nhận sự kiện con trỏ (`pointer-events`), không bị các lớp phủ (Modal backdrop, Loading spinner, Sticky Header) che khuất khi gọi hàm `document.elementFromPoint(x, y)`.

### 3. Cơ Chế Web-First Assertions

- Các lệnh kiểm thử như `await expect(locator).toHaveText('Welcome')` hoặc `await expect(locator).toBeVisible()` không kiểm tra tức thì một lần duy nhất.
- Playwright tự động thiết lập vòng lặp thăm dò liên tục (Polling Loop) với chu kỳ $100\text{ms}$ cho đến khi biểu thức kỳ vọng trả về `true` hoặc chạm ngưỡng thời gian Timeout (mặc định $5000\text{ms}$).

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 1.3 Chương 1: Cơ chế Auto-waiting, chi tiết 5 bước Actionability Checks và Web-first Assertions.
  - [ ] Bảng so sánh giữa `sleep()` tĩnh, `WebDriverWait` thủ công và Auto-waiting của Playwright.
  - [ ] Đính kèm sơ đồ luồng kiểm tra Actionability.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Production_SDET_Anti_Patterns_and_Flaky_Test_Traps]]
- [[Role_Based_Locators_and_Accessibility_Tree]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
