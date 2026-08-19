---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, Idempotency-Key validation mechanics, and Definition of Done for WBS 2.3
---

# WBS 2.3: API Test Suite - Booking Transaction and Idempotency Verification

## Metadata

- **WBS Code:** `2.3`
- **Task Name:** API Case 3: Booking Transaction & Idempotency Boundary Verification
- **Assignee:** Đặng Duy Lam (MSSV: 0306241125)
- **Task Weight:** `7.5%`
- **Deliverable Artifacts:** File mã nguồn `src/api/specs/booking_idempotency.spec.ts`, Pull Request GitHub, Mục 3.3 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử API Ca 3: Kiểm thử giao dịch đặt vé thanh toán và xác thực tính bất biến Idempotency (chuẩn Header `Idempotency-Key` UUID v4). Đảm bảo hệ thống xử lý an toàn trước các sự cố mạng chập chờn hoặc người dùng nhấp đúp thao tác, bảo vệ tuyệt đối không trừ tiền trùng lặp và không tạo bản ghi rác trong cơ sở dữ liệu.

## Core Architectural Content to Implement

### 1. Bản Chất Kỹ Thuật Của Tính Bất Biến (Idempotency) Trong Giao Dịch

- **Định nghĩa toán học:** Một thao tác $f(x)$ được gọi là Idempotent nếu áp dụng nhiều lần liên tiếp không làm thay đổi trạng thái hệ thống so với áp dụng một lần duy nhất:
  $$f(f(x)) = f(x)$$
- **Vấn đề thực tế trong E-Commerce & Vé:**
  1. Client gửi request thanh toán nhưng mạng bị rớt trước khi nhận response $\to$ Client tự động retry gửi lại request.
  2. Người dùng nóng vội click 2 - 3 lần liên tiếp vào nút "Thanh Toán Ngay".
  3. Nếu không có cơ chế Idempotency, tài khoản khách hàng sẽ bị trừ tiền 2 lần và sinh ra 2 mã vé khác nhau cho 1 giao dịch.

### 2. Cơ Chế Header `Idempotency-Key` (UUID v4)

```text
+---------------+   Request 1: POST /booking (Key: K_1, Seat: A12)   +---------------+
|  Playwright   | -------------------------------------------------> | Backend / DB  |
|  Test Runner  | <------------------------------------------------- | (Tao Booking) |
+---------------+               Response: 201 Created (Booking ID: 99)|               |
        |                                                            +---------------+
        |                                                                    | Luu Cache (Key: K_1, Payload Hash, Resp: 99)
        | Request 2: POST /booking (Gửi lại y hệt Key: K_1)                  v
        +----------------------------------------------------------> +---------------+
                                                                     | Backend Redis |
        <----------------------------------------------------------- | (Doc tu Cache)|
                        Response: 200 OK (Booking ID: 99)            +---------------+
              (KHONG tao them ban ghi moi, KHONG tru tien lan 2!)
```

### 3. Danh Sách Các Ca Kiểm Thử Bắt Buộc (Test Scenarios)

1. **`TC-IDEMP-01: First Execution (Happy Path)`**
   - Tạo UUID v4 ngẫu nhiên cho `Idempotency-Key`.
   - Gửi request tạo booking $\to$ Kiểm tra nhận `HTTP 201 Created`, cơ sở dữ liệu tăng đúng 1 bản ghi.
2. **`TC-IDEMP-02: Duplicate Request with Identical Key & Payload`**
   - Gửi lại request với cùng `Idempotency-Key` và cùng body $\to$ Kiểm tra nhận `HTTP 200/201`, mã `bookingId` trả về giống hệt lần 1, cơ sở dữ liệu không đổi.
3. **`TC-IDEMP-03: Key Conflict with Mutated Payload (Tấn công tráo dữ liệu)`**
   - Sử dụng lại `Idempotency-Key` của lần 1 nhưng thay đổi nội dung payload (ví dụ đổi `amount` hoặc `seatId`) $\to$ Backend phát hiện chữ ký payload hash không khớp, từ chối với mã lỗi `HTTP 422 Unprocessable Entity` hoặc `HTTP 400 Bad Request`.
4. **`TC-IDEMP-04: Concurrency Race on Same Idempotency Key`**
   - Bắn đồng thời 5 requests với cùng 1 `Idempotency-Key` qua `Promise.all()` $\to$ Kiểm tra đúng duy nhất 1 booking được tạo ra và 5 responses đều trả về cùng 1 kết quả.

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `src/api/specs/booking_idempotency.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test booking_idempotency.spec.ts --project=api-tests` pass $100\%$.
  - [ ] Xác nhận kiểm tra đầy đủ cả 4 scenarios trên.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-2.3-api-booking-idempotency`.
  - [ ] Tạo Pull Request trên GitHub với mô tả chi tiết và ảnh chụp kết quả test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.3 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Service_Object_Model_and_API_Request_Chaining]]
- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
