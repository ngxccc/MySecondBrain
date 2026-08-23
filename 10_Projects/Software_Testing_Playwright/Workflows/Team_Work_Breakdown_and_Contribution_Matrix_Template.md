---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-14
description: Industry-standard 7-member WBS work breakdown, task assignment, RACI matrix, and auditable contribution calculation template for Playwright testing coursework
created_at: Tuesday, August 18th 2026, 6:25:30 am +07:00
updated_at: Tuesday, August 18th 2026, 9:04:45 am +07:00
---

# Team Work Breakdown and Contribution Matrix Template

## TL;DR

Tài liệu đóng vai trò là **Nguồn Chân Lý Duy Nhất (Single Source of Truth - SSOT)** quy định toàn bộ Kế hoạch nghiên cứu, Cấu trúc phân rã công việc (Work Breakdown Structure - WBS), Ma trận trách nhiệm và Bảng tính toán tỷ lệ đóng góp (Contribution Matrix) cho nhóm 7 thành viên thực hiện đồ án Kiểm thử tự động với Playwright. Tài liệu cung cấp đầy đủ liên kết Google Sheets Master WBS (Live), bảng đối chiếu ngoại tuyến 4 giai đoạn, công thức tính điểm tự động và 6 phần quy chế hoạt động nhóm phục vụ nghiệm thu và nộp file `67_Danh_gia.docx`.

## 1. Quy Chuẩn Đặt Tên File & Link Google Sheets Trực Tiếp

Toàn bộ dữ liệu phân công công việc, cập nhật tiến độ theo thời gian thực và tự động tính điểm thành viên được quản lý trực tiếp tại:  
👉 **Google Sheets Master WBS (Live):** [Bảng Phân Công & Theo Dõi Tiến Độ Đồ Án Playwright](https://docs.google.com/spreadsheets/d/1jc5ae9wDK6p7h40i_gdDkzsnAYVMor-UWrUUTGSdZRo/edit?usp=sharing)

Để đảm bảo tính chuyên nghiệp, dễ tìm kiếm trên Google Drive và thuận tiện khi chia sẻ link quyền xem (View-only) cho Giảng viên hướng dẫn khi được yêu cầu:

```text
Cú pháp chuẩn:
[MãLớp]_[STT_Nhóm]_Software_Testing_Playwright_WBS_Contribution_Matrix

Ví dụ thực tế:
- KTPM_Nhom03_Playwright_WBS_Contribution_Matrix
- SE301_Nhom07_Software_Testing_WBS_Matrix
- STT05_KiemThuPhanMem_Playwright_WBS_Contribution_Matrix
```

## 2. Bảng Dữ Liệu Phân Công & Đánh Giá Mẫu (Master WBS Table)

Dữ liệu đồng bộ trực tiếp từ file Google Sheets quản lý dự án:

|  Mã WBS  | Giai Đoạn & Hạng Mục Công Việc                                               | Tiêu Chí Nghiệm Thu                                                | Trọng Số Task (%) | Người Phụ Trách   | Bằng Chứng Kiểm Toán                                                       | Trạng Thái  | Tỷ Lệ Hoàn Thành (%) | Điểm Đóng Góp Thực Tế (%) | Deadline |
| :------: | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ | :---------------: | ----------------- | -------------------------------------------------------------------------- | :---------: | :------------------: | :-----------------------: | :------: |
|  **1**   | **THEORY & TOOL OVERVIEW**                                                   |                                                                    |      **25%**      |                   |                                                                            |             |                      |                           |          |
|   1.1A   | Tổng quan Playwright, Lịch sử & Triết lý Code-first                          | Soạn Mục 1.1 Chương 1 Báo cáo Word                                 |       2.0%        | Lê Minh Quân      |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.1B   | Kiến trúc kết nối WebSocket CDP vs HTTP WebDriver                            | Soạn Mục 1.2 Chương 1 Báo cáo Word                                 |       2.0%        | Trần Văn Ngọc     |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.2A   | Cơ chế Auto-waiting 5 bước & Actionability Checks                            | Soạn Mục 1.3 Chương 1 Báo cáo Word                                 |       2.5%        | Đặng Duy Lam      |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.2B   | Cơ chế Browser Context Isolation & Tối ưu hóa Bộ nhớ RAM                     | Soạn Mục 1.4 Chương 1 Báo cáo Word                                 |       2.5%        | Nguyễn Quốc Đương |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.3A   | Quy trình cài đặt môi trường, TypeScript, Playwright CLI & Codegen           | Soạn Mục 2.1 & 2.2A Chương 2 Báo cáo Word                          |       2.5%        | Ngô Gia Bảo       |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.3B   | Hướng dẫn chuyên sâu Playwright UI Mode & Trình gỡ lỗi Trace Viewer          | Soạn Mục 2.2B Chương 2 Báo cáo Word                                |       2.5%        | Lê Minh Tài       |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.4A   | Phân tích Năng lực Web UI (POM, Role-based Locators, page.route())           | Soạn Mục 2.3 Chương 2 Báo cáo Word                                 |       2.5%        | Lê Minh Quân      |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.4B   | Phân tích Năng lực API (APIRequestContext, Hybrid Auth, SOM)                 | Soạn Mục 2.4 Chương 2 Báo cáo Word                                 |       2.5%        | Nguyễn Hoài Linh  |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.5A   | So sánh đối sánh Playwright vs TestComplete (Kiến trúc & Chi phí TCO)        | Soạn Mục 4.1A Chương 4 Báo cáo Word                                |       2.0%        | Ngô Gia Bảo       |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.5B   | So sánh đối sánh Playwright vs Selenium 4 & Cypress (HTTP vs CDP, Multi-tab) | Soạn Mục 4.1B Chương 4 Báo cáo Word                                |       2.0%        | Nguyễn Quốc Đương |                                                                            |    To Do    |                      |           0.00%           |          |
|   1.6    | Thiết lập Khung kiểm thử Multi-Project & GitHub Actions CI Pipeline          | Cấu hình playwright.config.ts, chạy pass base command              |       2.0%        | Trần Văn Ngọc     | [PR #1](https://github.com/shin-client/software-testing-playwright/pull/1) | In Progress |        95.0%         |           1.90%           |          |
|  **2**   | **API AUTOMATION SUITE**                                                     |                                                                    |      **30%**      |                   |                                                                            |             |                      |                           |          |
|   2.1    | API Ca 1: Auth Lifecycle, JWT & Single-use Token Rotation                    | Code auth.spec.ts & SOM AuthService, pass test                     |       7.5%        | Nguyễn Quốc Đương |                                                                            |    To Do    |                      |           0.00%           |          |
|   2.2    | API Ca 2: High-Contention Concurrency & Redis Redlock Race Condition Test    | Code concurrency.spec.ts (Promise.all), pass test                  |       7.5%        | Trần Văn Ngọc     |                                                                            |    To Do    |                      |           0.00%           |          |
|   2.3    | API Case 3: Booking Transaction & Idempotency Boundary Verification          | Code booking.spec.ts (Idempotency-Key), pass test                  |       7.5%        | Đặng Duy Lam      |                                                                            |    To Do    |                      |           0.00%           |          |
|   2.4    | API Case 4: RFC 9457 Problem Details Schema Validation & Rate Limiting       | Code error.spec.ts (Zod Schema), pass test                         |       7.5%        | Nguyễn Hoài Linh  |                                                                            |    To Do    |                      |           0.00%           |          |
|  **3**   | **WEB UI AUTOMATION SUITE**                                                  |                                                                    |      **25%**      |                   |                                                                            |             |                      |                           |          |
|   3.1    | UI Ca 1: Full E2E Checkout Flow với POM & COM trên SauceDemo                 | Code checkout.spec.ts & 5 Page Objects, pass test                  |       7.0%        | Lê Minh Quân      |                                                                            |    To Do    |                      |           0.00%           |          |
|   3.2    | UI Ca 2: Network Mocking page.route() HTTP 500 & Locked-out User             | Code network.spec.ts (CDP Interception), pass test                 |       6.0%        | Ngô Gia Bảo       |                                                                            |    To Do    |                      |           0.00%           |          |
|   3.3    | UI Ca 3: Post-Mortem Diagnostics với Trace Viewer & performance_glitch_user  | Code glitch.spec.ts & xuất trace.zip, pass test                    |       6.0%        | Lê Minh Tài       |                                                                            |    To Do    |                      |           0.00%           |          |
|   3.4    | UI Ca 4: Visual Regression Testing & Dynamic Data Masking                    | Code visual.spec.ts (toHaveScreenshot), pass test                  |       6.0%        | Lê Minh Tài       |                                                                            |    To Do    |                      |           0.00%           |          |
|  **4**   | **SUBMISSION DELIVERABLES**                                                  |                                                                    |      **20%**      |                   |                                                                            |             |                      |                           |          |
|   4.1A   | Biên soạn & Format Báo cáo môn học Chương 1 & 2 (67_Bao_cao.docx)            | Hợp nhất toàn bộ nội dung từ WBS 1.0 & 2.0, canh lề chuẩn format   |       3.5%        | Đặng Duy Lam      |                                                                            |    To Do    |                      |           0.00%           |          |
|   4.1B   | Biên soạn & Format Báo cáo môn học Chương 3 & 4 (67_Bao_cao.docx)            | Hợp nhất toàn bộ nội dung từ WBS 3.0 & 4.0, canh lề chuẩn format   |       3.5%        | Nguyễn Hoài Linh  |                                                                            |    To Do    |                      |           0.00%           |          |
|   4.2A   | Thiết kế Slide Mở đầu, Cơ sở lý thuyết & Tooling (Slide 1 → 14)              | Thiết kế slide lý thuyết & ảnh chụp toolings sắc nét               |       3.0%        | Nguyễn Quốc Đương |                                                                            |    To Do    |                      |           0.00%           |          |
|   4.2B   | Thiết kế Slide Thực nghiệm Demo, So sánh & Tổng kết (Slide 15 → 26)          | Thiết kế slide kết quả 8 ca test, ma trận so sánh & kết luận đồ án |       3.0%        | Trần Văn Ngọc     |                                                                            |    To Do    |                      |           0.00%           |          |
|   4.3A   | Quay màn hình & Lồng tiếng Video Clip Demo 4 Ca API Testing                  | Video Full HD màn hình chạy test API, log terminal & giải thích    |       3.5%        | Ngô Gia Bảo       |                                                                            |    To Do    |                      |           0.00%           |          |
|   4.3B   | Quay màn hình & Lồng tiếng Video Clip Demo 4 Ca Web UI Testing               | Video Full HD màn hình chạy test UI, mở Trace Viewer & giải thích  |       3.5%        | Lê Minh Quân      |                                                                            |    To Do    |                      |           0.00%           |          |
| **TỔNG** | **Toàn Bộ Dự Án**                                                            |                                                                    |     **100%**      |                   |                                                                            |             |                      |         **0.00%**         |          |

## 3. Bảng Tổng Hợp Điểm Số Cá Nhân 7 Thành Viên (Summary Dashboard)

Dữ liệu đồng bộ trực tiếp từ Tab `THÔNG TIN THÀNH VIÊN` trên Google Sheets:

|   STT    | Họ và Tên                    | MSSV       | Các Hạng Mục Phụ Trách                  | Tổng Trọng Số (%) | Đóng Góp Thực Tế (%) |
| :------: | ---------------------------- | ---------- | --------------------------------------- | :---------------: | :------------------: |
|    1     | **Trần Văn Ngọc** _(Leader)_ | 0306241131 | WBS 1.1B, 1.6, 2.2, 4.2B                |     **14.5%**     |        1.90%         |
|    2     | **Ngô Gia Bảo**              | 0306241090 | WBS 1.3A, 1.5A, 3.2, 4.3A               |     **14.0%**     |        0.00%         |
|    3     | **Nguyễn Quốc Đương**        | 0306241102 | WBS 1.2B, 1.5B, 2.1, 4.2A               |     **15.0%**     |        0.00%         |
|    4     | **Đặng Duy Lam**             | 0306241125 | WBS 1.2A, 2.3, 4.1A                     |     **13.5%**     |        0.00%         |
|    5     | **Nguyễn Hoài Linh**         | 0306241126 | WBS 1.4B, 2.4, 4.1B                     |     **13.5%**     |        0.00%         |
|    6     | **Lê Minh Quân**             | 0306241143 | WBS 1.1A, 1.4A, 3.1, 4.3B               |     **15.0%**     |        0.00%         |
|    7     | **Lê Minh Tài**              | 0306241145 | WBS 1.3B, 3.3, 3.4                      |     **14.5%**     |        0.00%         |
| **TỔNG** | **Cả Nhóm**                  |            | **25 Gói công việc (100% Đơn chủ trì)** |    **100.0%**     |      **1.90%**       |

## 4. Hướng Dẫn Thiết Lập Công Thức Trên Google Sheets

### A. Công thức tính Điểm Đóng Góp Từng Task (Cột I bên Master WBS)

```excel
=D6 * H6
```

_(Trong đó D6 là Trọng số Task %, H6 là Tỷ lệ hoàn thành %)._

### B. Cài đặt Dropdown Menu Trạng Thái (Cột G)

- Vào menu: `Data -> Data Validation -> Dropdown`.
- Nhập các giá trị: `To Do` (Màu xám), `In Progress` (Màu vàng), `In Review` (Màu xanh dương), `Done` (Màu xanh lá), `Blocked` (Màu đỏ).

### C. Công thức tính Tổng Điểm Đóng Góp của từng cá nhân (Sheet Thành Viên)

```excel
=SUMIF('Master WBS'!$E:$E, TRIM(B5), 'Master WBS'!$I:$I)
```

## 5. Hướng Dẫn Sử Dụng Bảng Quản Lý & Nội Quy Hoạt Động Nhóm (Guidelines)

### PHẦN 1: MỤC ĐÍCH & NGUYÊN TẮC HOẠT ĐỘNG

1. **Mục đích:** Đảm bảo tính minh bạch, công bằng và có bằng chứng xác thực ($100\%$ Audit Trail) trong toàn bộ quá trình thực hiện đồ án môn học Kiểm thử phần mềm.
2. **Nguyên tắc đóng góp:** Đánh giá điểm số dựa trên **Sản phẩm đầu ra thực tế (Deliverables & Git Evidence)**, không đánh giá dựa trên cảm tính.
3. **Quy định soạn bản thảo Báo cáo \& Slide (Bắt buộc cho mọi Task):** Thành viên phụ trách phần nào có trách nhiệm tự soạn thảo toàn bộ **Nội dung thô / Bản thảo Word** và **Bản thảo Slide** của phần đó (tóm tắt gạch đầu dòng các luận điểm chính, sơ đồ luồng, bảng đối soát, hình chụp kết quả test thực tế) và nộp đúng hạn để người phụ trách WBS 4.1 (Báo cáo) và WBS 4.2 (Slide) tổng hợp.

---

### PHẦN 2: LÀM RÕ CÁC THUẬT NGỮ & CHỈ SỐ ĐO LƯỜNG (BẢNG 10 CỘT)

| Tên Cột                                            | Định Nghĩa & Ý Nghĩa Kỹ Thuật                                                                                                                            | Trách Nhiệm Của Thành Viên                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Mã WBS (Work Breakdown Structure)**              | Mã số phân rã công việc chuẩn quốc tế (1.1, 2.1...). Dùng để định danh gói công việc, đặt tên nhánh Git (`feat/wbs-2.1-...`) và đối chiếu trong báo cáo. | Giữ nguyên, dùng mã này khi commit code hoặc tạo Pull Request.    |
| **Giai Đoạn & Hạng Mục Công Việc**                 | Tên giai đoạn lớn (1.0 Research, 2.0 API, 3.0 Web UI, 4.0 Deliverables) và tên gói công việc cụ thể cần thực hiện.                                       | Đọc kỹ để nắm phạm vi công việc được giao.                        |
| **Tiêu Chí Nghiệm Thu (DoD - Definition of Done)** | Điều kiện bắt buộc phải đạt được để task được tính là hoàn thành ($100\%$). Ví dụ: Test chạy pass, không lỗi linter, đúng format Word/Slide.             | Bắt buộc phải hoàn thành đủ các tiêu chí này trước khi nộp task.  |
| **Trọng Số Task (%)**                              | Tỷ lệ phần trăm đại diện cho độ khó và khối lượng của task đó trên thang điểm $100\%$ của toàn bộ đồ án (Leader thiết lập).                              | Dùng để tính toán điểm số đóng góp thực tế.                       |
| **Người Phụ Trách (Assignee)**                     | Thành viên chịu trách nhiệm thực hiện và hoàn thành task.                                                                                                | Thành viên có tên tại cột này là người trực tiếp làm và nộp task. |
| **Bằng Chứng Kiểm Toán (Audit Evidence)**          | Đường dẫn file mã nguồn cụ thể (`tests/api/...`, `tests/e2e/...`, `pages/...`) hoặc link Pull Request / Commit GitHub / File tài liệu bản thảo.          | Dán link PR / File vào đây khi hoàn thành để Leader nghiệm thu.   |
| **Trạng Thái (Status)**                            | Tình trạng tiến độ hiện tại qua Dropdown menu: `To Do` (Chưa làm), `In Progress` (Đang làm), `In Review` (Chờ duyệt), `Done` (Đã xong).                  | Thành viên chủ động chuyển trạng thái tương ứng với tiến độ thật. |
| **Tỷ Lệ Hoàn Thành (%)**                           | Tiến độ thực tế của task (từ $0\% \to 100\%$, ví dụ $25\%$, $50\%$, $75\%$). Leader sẽ chốt $100\%$ sau khi test pass.                                   | Thành viên tự cập nhật định kỳ trước mỗi buổi họp nhóm.           |
| **Điểm Đóng Góp Thực Tế (%)**                      | Điểm số thực tế mà task đóng góp vào quỹ điểm đồ án. Công thức tự động: $\text{Điểm Đóng Góp} = \text{Trọng Số Task} \times \text{Tỷ Lệ Hoàn Thành}$.    | Tự động tính toán bằng công thức, không được sửa thủ công.        |
| **Hạn Chót (Deadline)**                            | Ngày và giờ cuối cùng ($23:59$) bắt buộc phải hoàn thành và nộp Pull Request / Tài liệu để Leader tổng duyệt.                                            | Bắt buộc nộp trước thời hạn này để không bị trừ điểm trễ hạn.     |

---

### PHẦN 3: HƯỚNG DẪN THAO TÁC HÀNG NGÀY CHO THÀNH VIÊN

Mỗi thành viên khi làm việc bắt buộc phải tuân thủ 4 bước cập nhật trên Sheet `Master WBS`:

1. **Bước 1 (Khi bắt đầu làm task):**
   - Chuyển cột **Trạng Thái (Status)** từ `To Do` sang `In Progress`.
2. **Bước 2 (Trong quá trình làm):**
   - Ước lượng và cập nhật cột **Tỷ Lệ Hoàn Thành (%)** (ví dụ: $25\%$, $50\%$, $75\%$).
3. **Bước 3 (Khi code/tài liệu đã xong):**
   - Tạo Pull Request trên GitHub (đối với code) hoặc đưa link file bản thảo (đối với docx/pptx).
   - Dán đường dẫn link PR / file vào cột **Bằng Chứng Kiểm Toán (Audit Evidence)**.
   - Chuyển trạng thái sang `In Review` và thông báo cho Trưởng nhóm.
4. **Bước 4 (Nghiệm thu):**
   - Sau khi Trưởng nhóm kiểm tra, chạy thử code pass hoặc duyệt tài liệu, Trưởng nhóm sẽ chuyển trạng thái sang `Done` và chốt tỷ lệ $100\%$.

---

### PHẦN 4: QUY CHUẨN KỸ THUẬT & QUY TRÌNH LÀM VIỆC VỚI GIT

1. **Luật cấm Push trực tiếp:** Tuyệt đối không thành viên nào được phép commit hoặc push code trực tiếp lên nhánh `main`.
2. **Quy tắc tạo nhánh (Branch Naming):**
   - Cú pháp: `feat/wbs-<mã_wbs>-<tên_ngắn_task>`
   - Ví dụ: `feat/wbs-2.1-auth-lifecycle`, `feat/wbs-3.1-ui-checkout-pom`
3. **Quy tắc Pull Request (PR):**
   - Mỗi task chỉ gắn với 1 PR.
   - Nội dung PR phải mô tả rõ các test case đã pass và đính kèm ảnh chụp kết quả chạy test.
   - Cần có ít nhất 1 Review và Approval từ Trưởng nhóm mới được merge vào nhánh `main`.

---

### PHẦN 5: NỘI QUY KỶ LUẬT, DEADLINE & CHẾ TÀI XỬ LÝ

1. **Quy định về Deadline:**
   - Hạn chót cụ thể: Ngày hạn chót của từng task được ghi rõ tại cột **Hạn Chót (Deadline)** trên Sheet `Master WBS`.
   - Hạn chót là $23:59$ của ngày ghi trên bảng. Mọi Pull Request hoặc tài liệu nộp sau thời điểm này đều bị tính là Trễ hạn.
   - **Thời gian Buffer:** Toàn bộ đồ án sẽ kết thúc trước ngày Giảng viên yêu cầu nộp chính thức **03 ngày** để Trưởng nhóm tổng hợp, chạy lại toàn bộ test suite và đóng gói file zip.
2. **Chế tài trễ hạn (Late Penalty):**
   - **Trễ hạn dưới 24 giờ:** Trừ $10\%$ tỷ lệ hoàn thành tối đa của task đó (cao nhất chỉ đạt $90\%$).
   - **Trễ hạn từ 24 - 48 giờ:** Trừ $30\%$ tỷ lệ hoàn thành của task đó.
   - **Trễ hạn trên 48 giờ không có lý do chính đáng:** Trưởng nhóm có toàn quyền thu hồi task chuyển giao cho thành viên khác. Thành viên vi phạm nhận **$0\%$** cho task đó.
   - Nếu gặp khó khăn kỹ thuật (lỗi môi trường, bug khó, việc đột xuất), thành viên **BẮT BUỘC** phải thông báo cho Trưởng nhóm trước deadline tối thiểu 24 giờ để được hỗ trợ.
3. **Quy định về Bỏ nhóm / Free-Rider (Ngồi không hưởng điểm):**
   - Không có bất kỳ đóng góp nào trên GitHub / Tài liệu $\to$ Nhận đánh giá **$0\%$ Đóng Góp Thực Tế** trong file nộp cho Giảng viên (`STT nhom_Danh gia.docx`).
4. **Cam kết trách nhiệm:**
   - Mọi thắc mắc hoặc khó khăn kỹ thuật phải báo cáo ngay cho Trưởng nhóm trước deadline tối thiểu 24 giờ để được hỗ trợ, không được im lặng đến sát hạn nộp mới báo không làm được.

## Related Notes

- [[WBS_Best_Practices]]
- [[Agile_Management_via_GitHub]]
- [[000_Software_Testing_Playwright_MOC]]
