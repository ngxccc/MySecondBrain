---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Task specification, experimental test case synthesis, comparison matrix formatting, and Definition of Done for WBS 4.1B - Report Compilation Chapters 3 and 4
---

# WBS 4.1B: Report Compilation - Chapters 3 and 4

## Metadata

- **WBS Code:** `4.1B`
- **Task Name:** Biên soạn & Format Báo cáo môn học Chương 3 & 4 (`67_Bao_cao.docx`)
- **Assignee:** Nguyễn Hoài Linh (MSSV: 0306241126)
- **Task Weight:** `3.5%`
- **Deliverable Artifacts:** File tài liệu Word `67_Bao_cao.docx` (Phần Chương 3, Chương 4, Kết Luận, Tài Liệu Tham Khảo và Phụ Lục).

## TL;DR

Tài liệu đặc tả nhiệm vụ tổng hợp, biên tập và chuẩn hóa định dạng học thuật cho nửa sau của cuốn Báo cáo đồ án môn học (`67_Bao_cao.docx`). Người phụ trách tiếp nhận các bản thảo thực nghiệm 8 ca kiểm thử (4 ca API và 4 ca Web UI) từ WBS $2.1 \to 2.4$ và WBS $3.1 \to 3.4$, các phân tích đối sánh công cụ từ WBS $1.5\text{A}$ và $1.5\text{B}$, tiến hành chuẩn hóa code blocks, bảng đối soát và danh mục tài liệu tham khảo theo chuẩn IEEE.

## Core Architectural Content to Implement

### 1. Phạm Vi Biên Soạn & Nguồn Dữ Liệu Đầu Vào

Người phụ trách WBS 4.1B có trách nhiệm đôn đốc thu thập và hợp nhất các phần sau:

- **Chương 3: Thực Nghiệm Xây Dựng Bộ Kiểm Thử Tự Động:**
  - Mục 3.1: API Ca 1 - Auth Lifecycle, JWT & Single-use Token Rotation (Thu thập từ WBS 2.1).
  - Mục 3.2: API Ca 2 - High-Contention Concurrency & Redis Redlock (Thu thập từ WBS 2.2).
  - Mục 3.3: API Ca 3 - Booking Transaction & Idempotency Key (Thu thập từ WBS 2.3).
  - Mục 3.4: API Ca 4 - Chuẩn Hóa Lỗi RFC 9457 & Rate Limiting Throttler (Thu thập từ WBS 2.4).
  - Mục 3.5: Web UI Ca 1 - Luồng Mua Hàng E2E Checkout POM & COM trên SauceDemo (Thu thập từ WBS 3.1).
  - Mục 3.6: Web UI Ca 2 - Network Mocking `page.route()` HTTP 500 & Locked-out User (Thu thập từ WBS 3.2).
  - Mục 3.7: Web UI Ca 3 - Chẩn Đoán Hậu Kỳ với Trace Viewer & Performance Glitch User (Thu thập từ WBS 3.3).
  - Mục 3.8: Web UI Ca 4 - Kiểm Thử Hồi Quy Trực Quan Visual Regression & Data Masking (Thu thập từ WBS 3.4).
- **Chương 4: Đánh Giá Đối Sánh & Tổng Kết Đồ Án:**
  - Mục 4.1: So sánh đối kháng trực diện Playwright vs TestComplete (Thu thập từ WBS 1.5A).
  - Mục 4.2: So sánh kỹ thuật Playwright vs Selenium 4 & Cypress (Thu thập từ WBS 1.5B).
  - Mục 4.3: Đúc kết bài học kinh nghiệm và phòng chống Anti-patterns trong SDET.
- **Phần Kết Luận & Tài Liệu Tham Khảo:**
  - Đánh giá mức độ hoàn thành mục tiêu đề tài.
  - Định dạng danh mục Tài liệu tham khảo chuẩn IEEE (Playwright Docs, Microsoft Learn, SmartBear Docs, RFC 9457).

### 2. Quy Chuẩn Định Dạng Khối Mã Nguồn & Bằng Chứng Test (Code & Evidence Formatting)

1. **Định dạng khối code (Code Blocks):**
   - Phông chữ: `Consolas` hoặc `Courier New`, cỡ chữ `10pt`.
   - Đóng khung viền xám đơn giản, nền màu xám nhạt (`#F4F4F4`), giãn dòng đơn `Single line`.
   - Có số dòng hoặc chú thích code rõ ràng, không paste code quá dài (chỉ trích dẫn các đoạn code quan trọng $10 - 20$ dòng).
2. **Hình ảnh bằng chứng thực nghiệm (Test Evidence):**
   - Đính kèm ảnh chụp màn hình Terminal chạy pass `$100\%` cho từng ca test.
   - Đính kèm ảnh chụp giao diện Trace Viewer, DOM Snapshot và Visual Diff.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hợp Nhất Đầy Đủ Nội Dung:**
  - [ ] Thu thập đầy đủ 100% bản thảo từ các thành viên phụ trách WBS 2.1-2.4, 3.1-3.4, 1.5A, 1.5B.
  - [ ] Đầy đủ 8 ca test thực nghiệm kèm code mẫu và ảnh chụp kết quả chạy pass.
- [ ] **Chuẩn Hóa Format Học Thuật & Khối Code:**
  - [ ] Toàn bộ code blocks được format đồng bộ theo chuẩn ở Mục 2.
  - [ ] Danh mục tài liệu tham khảo đúng định dạng IEEE.
- [ ] **Review & Hợp Nhất File Hoàn Chỉnh:**
  - [ ] Hợp nhất với phần Chương 1 & 2 của WBS 4.1A để tạo thành file `67_Bao_cao.docx` hoàn chỉnh nộp cho Trưởng nhóm nghiệm thu.

## Related Notes

- [[WBS_2_1_API_Auth_Lifecycle_and_Token_Rotation]]
- [[WBS_2_2_API_Concurrency_and_Redis_Redlock_Testing]]
- [[WBS_2_3_API_Booking_Transaction_and_Idempotency]]
- [[WBS_2_4_API_RFC_9457_Schema_and_Rate_Limiting]]
- [[WBS_3_1_UI_Checkout_Flow_POM_and_COM]]
- [[WBS_3_2_UI_Network_Mocking_and_Error_Handling]]
- [[WBS_3_3_UI_Post_Mortem_Trace_Viewer_Diagnostics]]
- [[WBS_3_4_UI_Visual_Regression_and_Data_Masking]]
- [[WBS_1_5A_Playwright_vs_TestComplete_Comparison]]
- [[WBS_1_5B_Playwright_vs_Selenium_and_Cypress_Comparison]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
