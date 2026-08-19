---
tags: [type/concept, topic/testing, topic/devops]
date: 2026-08-18
aliases:
  [Smoke Testing Strategy, Baseline Verification, Smoke Suite Architecture]
description: Chiến lược kiểm thử Smoke Testing trong kiến trúc Playwright Multi-Project để xác thực trạng thái sẵn sàng của hạ tầng Web UI và Backend API trước khi kích hoạt bộ test hồi quy chuyên sâu.
---

# Smoke Testing Strategy and Baseline Verification

## TL;DR

Kiểm thử Smoke Testing (Smoke Verification Suite) tại `tests/smoke/smoke.spec.ts` là chốt chặn kiểm thử tối thiểu (Minimum Sanity Gate) trong khung kiểm thử Playwright Multi-Project. Suite này được thiết kế để chạy siêu tốc (< 2 giây), xác thực tính sẵn sàng của cả 2 mục tiêu kiểm thử (SauceDemo Web UI và NestJS Backend API) trước khi hệ thống kích hoạt các bộ test hồi quy phức tạp và tốn kém tài nguyên.

---

## Core Concept and Fail-Fast Principle

Trong kim tự tháp kiểm thử và quy trình CI/CD chuyên nghiệp:

- **Nguyên lý Fail-Fast:** Nếu máy chủ Backend đang sập hoặc trang Web UI không thể truy cập, việc cố gắng thực thi hàng chục ca kiểm thử End-to-End phức tạp (như quy trình checkout đa bước hoặc kiểm thử Redlock phân tán) là vô nghĩa và gây lãng phí tài nguyên tính toán.
- **Vai trò của Smoke Suite:** Đóng vai trò là chốt chặn kiểm toán đầu tiên (Healthcheck & Sanity Check), trả về kết quả đạt/không đạt ngay trong vài giây đầu tiên của quy trình CI/CD.

---

## Dual-Engine Smoke Architecture

Hệ thống kiểm thử Đồ án môn học áp dụng mô hình Dual-Engine, do đó Smoke Suite kiểm tra đồng thời cả 2 tầng hạ tầng:

```mermaid
flowchart TD
    A[Kích hoạt Smoke Verification Suite] --> B[SMOKE-01: Web UI Healthcheck]
    A --> C[SMOKE-02: Backend API Healthcheck]
    A --> D[SMOKE-03: Environment Integrity]

    B -->|GET https://www.saucedemo.com| E{Web UI Sẵn sàng?}
    C -->|GET https://ticket-booking-amqv.onrender.com/| F{Backend Sẵn sàng?}
    D -->|Verify process.env| G{Biến môi trường hợp lệ?}

    E -- Có (HTTP 200) --> H[Passed]
    F -- Có (HTTP 200, status: ok) --> H
    G -- Có (Non-empty URLs) --> H

    H --> I[Kích hoạt Full Test Suite (API & E2E)]
    E -- Không --> J[Fail-Fast & Hủy Pipeline]
    F -- Không --> J
    G -- Không --> J
```

---

## Smoke Test Cases Breakdown

Tại file `tests/smoke/smoke.spec.ts`, bộ kiểm thử được chia thành 3 ca kiểm thử nguyên tử:

### 1. SMOKE-01: Xác thực tính sẵn sàng của Web UI (SauceDemo)

- **Mục tiêu:** Điều hướng đến trang chủ SauceDemo, kiểm tra mã phản hồi HTTP, tiêu đề trang (`Swag Labs`) và sự hiện diện của container đăng nhập (`[data-test="login-button"]`).
- **Mục đích:** Đảm bảo DOM đã render và sẵn sàng tương tác cho các bài test E2E.

### 2. SMOKE-02: Xác thực tính sẵn sàng của Backend API (NestJS Render)

- **Mục tiêu:** Gửi request `GET /` trực tiếp tới endpoint Healthcheck của Backend trên Render (`https://ticket-booking-amqv.onrender.com/`).
- **Xác minh (Assertions):**
  - Mã trạng thái HTTP trả về là `200 OK`.
  - Cấu trúc dữ liệu JSON trả về khớp chính xác với `{ status: "ok" }`.
- **Mục đích:** Xác nhận Backend, kết nối PostgreSQL (Neon) và Redis (Upstash) đang hoạt động ổn định.

### 3. SMOKE-03: Kiểm toán cấu hình biến môi trường

- **Mục tiêu:** Kiểm tra sự tồn tại và tính hợp lệ của các biến `WEB_BASE_URL` và `API_BASE_URL`.
- **Mục đích:** Ngăn chặn tình trạng chạy test nhầm môi trường hoặc thiếu biến cấu hình trên GitHub Actions runner.

---

## Execution Command

Các thành viên có thể kích hoạt riêng bộ Smoke Suite bằng lệnh:

```bash
# Chạy riêng dự án smoke
bun run test:smoke

# Hoặc dùng Playwright CLI trực tiếp
bunx playwright test --project=smoke
```

---

## Related Notes

- [[Software_Testing_Coursework_Technical_Spec]] - Đặc tả kỹ thuật đồ án kiểm thử phần mềm
- [[Playwright_Custom_API_Fixtures]] - Kiến trúc Custom Test Fixtures cho API
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]] - Ma trận phân rã công việc WBS 7 thành viên
- [[SauceDemo_Ecosystem_and_Selection_Rationale]] - Hệ sinh thái SauceDemo và lý do lựa chọn
