---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Video recording script, technical standards, YouTube submission guidelines, and Definition of Done for WBS 4.3A - Video Demo API Automation Suite
---

# WBS 4.3A: Video Demonstration - API Automation Suite

## Metadata

- **WBS Code:** `4.3A`
- **Task Name:** Quay màn hình & Lồng tiếng Video Clip Demo 4 Ca API Testing
- **Assignee:** Ngô Gia Bảo (MSSV: 0306241090)
- **Task Weight:** `3.5%`
- **Deliverable Artifacts:** File video Full HD, link YouTube trong file `67_Demo.txt` và nộp file video nén cho Trưởng nhóm.

## TL;DR

Tài liệu đặc tả kịch bản quay video màn hình và lồng tiếng thuyết minh chi tiết cho 4 ca kiểm thử tự động tầng API (API Automation Suite). Video đóng vai trò là bằng chứng thực nghiệm trực quan ($100\%$ Audit Trail) chứng minh mã nguồn chạy thực tế, không dùng mock giả mạo hoặc video cắt ghép, nộp trực tiếp qua đường dẫn YouTube trong file `67_Demo.txt`.

## Core Architectural Content to Implement

### 1. Kịch Bản Quay & Lời Thuyết Minh Chi Tiết (Video Script: 5 - 8 Phút)

```text
TIMELINE VIDEO DEMO API (Thời lượng: 5 - 8 Phút)
├── 00:00 - 00:45 | Phan 1: Gioi thieu khung kiem thu API (APIRequestContext, SOM & Zod Schema)
├── 00:45 - 02:00 | Phan 2: API Ca 1 - Auth Lifecycle, JWT & Single-use Refresh Token Rotation
├── 02:00 - 03:30 | Phan 3: API Ca 2 - High-Contention Concurrency & Redis Redlock Race Condition
├── 03:30 - 05:00 | Phan 4: API Ca 3 - Booking Transaction & Idempotency Key (UUID v4 Header)
├── 05:00 - 06:30 | Phan 5: API Ca 4 - Chuan hoa ma loi RFC 9457 & Rate Limiting Throttler
└── 06:30 - 07:00 | Phan 6: Tong ket ket qua chay pass toan bo test suite tren Terminal & CI/CD
```

- **Phần 1: Giới thiệu kiến trúc:** Mở file `playwright.config.ts`, giải thích cấu hình `api-tests` chạy ở tốc độ micro-giây không cần mở trình duyệt.
- **Phần 2: Demo Ca 1 (Auth):** Chạy lệnh `npx playwright test auth.spec.ts`, giải thích luồng lấy JWT Token và chứng minh request gửi lại Token cũ bị hệ thống chặn với mã `HTTP 403`.
- **Phần 3: Demo Ca 2 (Concurrency Redlock):** Chạy lệnh `npx playwright test concurrency_redlock.spec.ts`, quan sát Terminal bắn đồng thời 10 requests qua `Promise.all()`, giải thích log chỉ có đúng 1 request nhận `200/201` và 9 requests còn lại nhận `409 Conflict`.
- **Phần 4: Demo Ca 3 (Idempotency):** Chạy lệnh `npx playwright test booking_idempotency.spec.ts`, chứng minh gửi lại cùng `Idempotency-Key` không làm tăng số lượng vé trong cơ sở dữ liệu.
- **Phần 5: Demo Ca 4 (RFC 9457):** Chạy lệnh `npx playwright test rfc9457_throttling.spec.ts`, giải thích Schema Zod bắt lỗi Contract Drift và phản hồi `HTTP 429 Too Many Requests`.

### 2. Quy Chuẩn Kỹ Thuật Video (Video & Audio Production Standards)

1. **Chất lượng hình ảnh:** Độ phân giải chuẩn Full HD ($1920 \times 1080$), tỷ lệ khung hình $16:9$, tốc độ $\ge 30\text{fps}$ (khuyên dùng 60fps). Cửa sổ Terminal phóng to cỡ chữ (Font size $\ge 16\text{pt}$) để người xem đọc rõ từng dòng log.
2. **Chất lượng âm thanh:** Lồng tiếng giọng đọc rõ ràng, phát âm chuẩn các thuật ngữ kỹ thuật tiếng Anh (Playwright, WebSocket, JWT, Redlock, Idempotency, RFC 9457). Loại bỏ hoàn toàn tiếng ồn môi trường và tạp âm.
3. **Hiệu ứng trực quan:** Sử dụng công cụ làm nổi bật con trỏ chuột (Mouse Cursor Highlight) và phóng to (Zoom-in) vào các dòng lệnh hoặc kết quả kiểm thử quan trọng.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Hoàn Tất Video Demo API:**
  - [ ] Quay đầy đủ và rõ ràng cả 4 ca kiểm thử API theo kịch bản ở Mục 1.
  - [ ] Thời lượng video trong khoảng $5 - 8$ phút, không cắt xén gian lận kết quả test.
  - [ ] Terminal thể hiện kết quả chạy pass $100\%$.
- [ ] **Đăng Tải & Xuất Bản:**
  - [ ] Đăng tải video lên YouTube ở chế độ **Không công khai (Unlisted)**.
  - [ ] Đặt tiêu đề chuẩn: `[KTPM_Nhom67] Demo 4 Ca API Automation Testing voi Playwright`.
  - [ ] Cập nhật link YouTube vào file `67_Demo.txt` và dán vào cột Audit Evidence trên Google Sheets Master WBS.
- [ ] **Review & Bàn Giao:**
  - [ ] Gửi link video cho Trưởng nhóm nghiệm thu trước hạn chót.

## Related Notes

- [[WBS_2_1_API_Auth_Lifecycle_and_Token_Rotation]]
- [[WBS_2_2_API_Concurrency_and_Redis_Redlock_Testing]]
- [[WBS_2_3_API_Booking_Transaction_and_Idempotency]]
- [[WBS_2_4_API_RFC_9457_Schema_and_Rate_Limiting]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
