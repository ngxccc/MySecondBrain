---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Task specification, experimental test slide synthesis, comparison matrix visuals, and Definition of Done for WBS 4.2B - Slide Deck Demo and Synthesis (Slides 15-26)
---

# WBS 4.2B: Slide Presentation Design - Demo and Synthesis

## Metadata

- **WBS Code:** `4.2B`
- **Task Name:** Thiết kế Slide Thực nghiệm Demo, So sánh & Tổng kết (Slide 15 $\to$ 26)
- **Assignee:** Trần Văn Ngọc (MSSV: 0306241131)
- **Task Weight:** `3.0%`
- **Deliverable Artifacts:** File slide thuyết trình `67_Slide.pptx` (Slide 15 đến 26) và bản xuất `67_Slide.pdf`.

## TL;DR

Tài liệu đặc tả kỹ thuật thiết kế nửa sau của bộ Slide thuyết trình chính thức (`67_Slide.pptx` từ Slide 15 đến Slide 26). Nhiệm vụ trọng tâm là trực quan hóa kết quả thực nghiệm của 8 ca kiểm thử tự động (4 ca API Automation và 4 ca Web UI Automation), sơ đồ tích hợp CI/CD Pipeline trên GitHub Actions, bảng ma trận đối sánh trực diện Playwright vs TestComplete/Selenium/Cypress, và tổng kết đúc kết kinh nghiệm kỹ thuật.

## Core Architectural Content to Implement

### 1. Cấu Trúc Khung Slide Chi Tiết (Slide 15 $\to$ 26)

```text
SLIDE DECK PHAN 2: THUC NGHIEM DEMO & TONG KET (Slide 15 -> 26)
├── 4. THUC NGHIEM BO KIEM THU TU DONG (DEMO) (Slide 15 - 23)
│   ├── Slide 15: So do kien truc kiem thu hai tang (Dual-Engine Framework: API & UI)
│   ├── Slide 16: API Ca 1 - Auth Lifecycle, JWT & Single-use Token Rotation
│   ├── Slide 17: API Ca 2 - High-Contention Concurrency & Redis Redlock (Promise.all Socket Flooding)
│   ├── Slide 18: API Ca 3 - Booking Transaction & Idempotency Key (UUID v4 Header)
│   ├── Slide 19: API Ca 4 - Chuan hoa ma loi RFC 9457 & Rate Limiting Throttler
│   ├── Slide 20: Web UI Ca 1 - Luong mua hang E2E Checkout POM & COM tren SauceDemo
│   ├── Slide 21: Web UI Ca 2 - Network Mocking page.route() HTTP 500 & Locked-out User
│   ├── Slide 22: Web UI Ca 3 & 4 - Trace Viewer Post-Mortem Diagnostics & Visual Regression Testing
│   └── Slide 23: Tich hop CI/CD Pipeline voi GitHub Actions Workflow
└── 5. DOI SANH CONG CU & TONG KET DO AN (Slide 24 - 26)
    ├── Slide 24: Ma tran doi soat 7 tieu chi: Playwright vs TestComplete, Selenium, Cypress
    ├── Slide 25: Duc ket bai hoc & Phong chong Anti-patterns trong SDET
    └── Slide 26: Ket luan muc do hoan thanh, Loi cam on & Phien hoi dap (Q&A)
```

### 2. Quy Chuẩn Trực Quan Hóa Bằng Chứng Thực Nghiệm (Audit Trail Slides)

1. **Hiển thị đoạn mã nguồn then chốt:**
   - Trích dẫn các dòng code quan trọng ($5 - 8$ dòng), tô màu cú pháp theo Dark Theme (`Promise.all()`, `page.route()`, `toHaveScreenshot()`, `zod`).
2. **Ảnh chụp kết quả thực thi ($100\%$ Pass):**
   - Đính kèm ảnh Terminal chạy pass toàn bộ test suite.
   - Đính kèm biểu đồ thời gian trễ $5\text{s}$ của Trace Viewer và ảnh phân tích sai khác Visual Diff.
3. **Bảng so sánh công cụ:**
   - Bảng ma trận đối sánh 4 công cụ với các điểm xanh nổi bật cho Playwright và các điểm đỏ giới hạn của TestComplete (chi phí bản quyền đắt đỏ, không hỗ trợ Linux Docker headless).

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hoàn Tất Slide 15 $\to$ 26:**
  - [ ] Đầy đủ 12 slides theo đúng cấu trúc khung ở Mục 1.
  - [ ] Trực quan hóa đầy đủ kết quả 8 ca kiểm thử (4 API + 4 UI).
  - [ ] Bảng ma trận so sánh đầy đủ 7 tiêu chí kỹ thuật.
- [ ] **Hợp Nhất Bộ Slide Toàn Diện:**
  - [ ] Ghép nối với Slide 1 $\to$ 14 của WBS 4.2A tạo thành file `67_Slide.pptx` hoàn chỉnh gồm $26$ slides chuẩn.
- [ ] **Bàn Giao & Nghiệm Thu:**
  - [ ] Trình chiếu thử nghiệm toàn bộ slide trên màn hình lớn để kiểm tra tỷ lệ hiển thị $16:9$.

## Related Notes

- [[WBS_4_2A_Slide_Deck_Theory_and_Tooling]]
- [[WBS_1_5A_Playwright_vs_TestComplete_Comparison]]
- [[WBS_1_5B_Playwright_vs_Selenium_and_Cypress_Comparison]]
- [[Group_Presentation_Deck_Structure_and_Guidelines]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
