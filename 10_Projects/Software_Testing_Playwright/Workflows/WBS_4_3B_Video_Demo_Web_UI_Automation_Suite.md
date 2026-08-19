---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Video recording script, technical standards, YouTube submission guidelines, and Definition of Done for WBS 4.3B - Video Demo Web UI Automation Suite
---

# WBS 4.3B: Video Demonstration - Web UI Automation Suite

## Metadata

- **WBS Code:** `4.3B`
- **Task Name:** Quay màn hình & Lồng tiếng Video Clip Demo 4 Ca Web UI Testing
- **Assignee:** Lê Minh Quân (MSSV: 0306241143)
- **Task Weight:** `3.5%`
- **Deliverable Artifacts:** File video Full HD, link YouTube trong file `67_Demo.txt` và nộp file video nén cho Trưởng nhóm.

## TL;DR

Tài liệu đặc tả kịch bản quay video màn hình và lồng tiếng thuyết minh chi tiết cho 4 ca kiểm thử tự động tầng giao diện Web (Web UI Automation Suite). Video ghi lại trực tiếp quá trình trình duyệt tự động thao tác trên trang SauceDemo, can thiệp mạng giả lập lỗi HTTP 500, mở Trace Viewer khám nghiệm độ trễ $5\text{s}$ và kiểm thử hồi quy trực quan Pixel-by-Pixel, nộp link YouTube trong file `67_Demo.txt`.

## Core Architectural Content to Implement

### 1. Kịch Bản Quay & Lời Thuyết Minh Chi Tiết (Video Script: 6 - 9 Phút)

```text
TIMELINE VIDEO DEMO WEB UI (Thời lượng: 6 - 9 Phút)
├── 00:00 - 01:00 | Phan 1: Gioi thieu kien truc phan lop POM, COM & Role-based Locators
├── 01:00 - 02:45 | Phan 2: UI Ca 1 - Luong mua hang E2E Checkout Flow tren SauceDemo (--headed)
├── 02:45 - 04:30 | Phan 3: UI Ca 2 - Network Mocking page.route() HTTP 500 & Locked-out User
├── 04:30 - 06:30 | Phan 4: UI Ca 3 - Post-Mortem Diagnostics voi Trace Viewer & Performance Glitch
├── 06:30 - 08:00 | Phan 5: UI Ca 4 - Visual Regression Testing (toHaveScreenshot & Dynamic Masking)
└── 08:00 - 08:30 | Phan 6: Tong ket bao cao HTML Report & Tich hop CI/CD Pipeline
```

- **Phần 1: Giới thiệu cấu trúc:** Trình bày cấu trúc thư mục `src/ui/components/` và `src/ui/pages/`, nhấn mạnh tính tách biệt giữa Locators và kịch bản test.
- **Phần 2: Demo Ca 1 (Checkout Flow):** Chạy lệnh `npx playwright test checkout.spec.ts --headed`, quay màn hình Chromium tự động đăng nhập, lọc giá, thêm 2 món vào giỏ, điền form thanh toán và xác nhận đặt hàng thành công.
- **Phần 3: Demo Ca 2 (Network Mocking):** Chạy lệnh `npx playwright test network_mock.spec.ts --headed`, chỉ ra thông báo lỗi khi đăng nhập `locked_out_user` và quan sát giao diện hiển thị Error Banner khi mạng bị can thiệp trả về HTTP 500.
- **Phần 4: Demo Ca 3 (Trace Viewer):** Chạy test `glitch_diagnostics.spec.ts`, sau đó mở Trace Viewer (`npx playwright show-trace`), kéo thanh trượt Filmstrip và mở tab Network chứng minh request bị treo đúng $5000\text{ms}$.
- **Phần 5: Demo Ca 4 (Visual Regression):** Chạy test `visual_regression.spec.ts`, giải thích cơ chế so khớp ảnh Snapshot và kỹ thuật Masking che các phần tử biến đổi động.

### 2. Quy Chuẩn Kỹ Thuật Video (Video & Audio Production Standards)

1. **Chất lượng hình ảnh:** Độ phân giải Full HD ($1920 \times 1080$), tốc độ 60fps. Trình duyệt chạy ở chế độ Headed với kích thước chuẩn Desktop ($1280 \times 720$ hoặc $1920 \times 1080$).
2. **Chất lượng âm thanh:** Lồng tiếng mạch lạc, giải thích rõ ràng từng thao tác đang diễn ra trên trình duyệt, không để khoảng lặng chết (Dead Air) quá lâu.
3. **Hiển thị giao diện:** Phóng to các khu vực thao tác quan trọng (giỏ hàng, popup lỗi, tab Network trong Trace Viewer).

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hoàn Tất Video Demo Web UI:**
  - [ ] Quay đầy đủ và sắc nét cả 4 ca kiểm thử Web UI theo đúng kịch bản ở Mục 1.
  - [ ] Thời lượng video trong khoảng $6 - 9$ phút.
  - [ ] Thể hiện rõ các cửa sổ trình duyệt chạy tự động, giao diện Trace Viewer và báo cáo HTML.
- [ ] **Đăng Tải & Xuất Bản:**
  - [ ] Đăng tải video lên YouTube ở chế độ **Không công khai (Unlisted)**.
  - [ ] Đặt tiêu đề chuẩn: `[KTPM_Nhom67] Demo 4 Ca Web UI Automation Testing voi Playwright`.
  - [ ] Cập nhật link YouTube vào file `67_Demo.txt` và dán vào cột Audit Evidence trên Google Sheets Master WBS.
- [ ] **Review & Bàn Giao:**
  - [ ] Gửi link video cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[WBS_3_1_UI_Checkout_Flow_POM_and_COM]]
- [[WBS_3_2_UI_Network_Mocking_and_Error_Handling]]
- [[WBS_3_3_UI_Post_Mortem_Trace_Viewer_Diagnostics]]
- [[WBS_3_4_UI_Visual_Regression_and_Data_Masking]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
