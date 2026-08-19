---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Overview of SauceLabs ecosystem, SauceDemo application architecture, built-in SDET test personas, and technical selection rationales
---

# SauceDemo Ecosystem and Selection Rationale

## TL;DR

SauceDemo (Swag Labs) là ứng dụng Web thương mại điện tử mẫu chuẩn công nghiệp do **SauceLabs** (nhà cung cấp hạ tầng kiểm thử đám mây hàng đầu thế giới) phát triển chuyên biệt cho cộng đồng SDET và tự động hóa kiểm thử. Khác với các ứng dụng web thông thường, SauceDemo được thiết kế sẵn các tài khoản thử nghiệm chứa các lỗi nhân tạo có chủ đích (lỗi gián đoạn mạng $5000\text{ms}$, lỗi tài khoản bị khóa, lỗi hình ảnh hỏng, lỗi lệch CSS). Việc lựa chọn SauceDemo thay vì tự dựng frontend giúp nhóm tập trung $100\%$ nguồn lực vào kỹ nghệ kiểm thử chuyên sâu (POM, COM, Auto-waiting, Trace Viewer, Visual Regression) mà không lãng phí thời gian bảo trì hạ tầng giao diện.

## Overview: SauceLabs & The Swag Labs Benchmark

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        HỆ SINH THÁI SAUCELABS                          │
│ - Nhà cung cấp hạ tầng Cloud Testing (Selenium, Appium, Playwright)    │
│ - Trụ sở: San Francisco, California, Hoa Kỳ                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                       (Phát triển ứng dụng mẫu)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               SAUCEDEMO (SWAG LABS - https://www.saucedemo.com/)       │
│ - Single Page Application (SPA) xây dựng trên nền tảng React           │
│ - Tích hợp đầy đủ luồng nghiệp vụ E-Commerce:                          │
│   Auth ──▶ Catalog & Filter ──▶ Cart Badge ──▶ Multi-Step Checkout     │
└────────────────────────────────────────────────────────────────────────┘
```

## Built-In SDET Personas (Cơ Chế Lỗi Có Chủ Đích)

Điểm đắt giá nhất của SauceDemo đối với một đồ án kiểm thử phần mềm là hệ thống **Deterministic User Personas** được gài sẵn lỗi để kiểm tra năng lực của bộ test:

| Test Persona (Tài Khoản)      | Mật Khẩu       | Cơ Chế Lỗi Hệ Thống (Failure Modes)                          | Kịch Bản SDET Kiểm Thử Tương Ứng                                                          |
| ----------------------------- | -------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| **`standard_user`**           | `secret_sauce` | Không có lỗi (Luồng chuẩn mực)                               | Kiểm thử Happy Path E2E Checkout Flow với POM & COM                                       |
| **`locked_out_user`**         | `secret_sauce` | Bị khóa tài khoản ở cấp hệ thống                             | Kiểm thử Negative Auth & bắt thông báo lỗi `Epic sadface`                                 |
| **`problem_user`**            | `secret_sauce` | Hình ảnh bị gãy link (`/static/media/sl-404...`) và form lỗi | Kiểm thử khả năng phát hiện lỗi giao diện & Network Broken Images                         |
| **`performance_glitch_user`** | `secret_sauce` | Bị nghẽn mạng $5000\text{ms}$ khi load dữ liệu               | **Chứng minh cơ chế Auto-waiting của Playwright** (vượt qua test mà không cần hard sleep) |
| **`error_user`**              | `secret_sauce` | Ném ngoại lệ JavaScript Runtime khi bấm nút                  | Kiểm thử khả năng bắt Console Error Logs trong Trace Viewer                               |
| **`visual_user`**             | `secret_sauce` | Giao diện bị lệch CSS, nút bấm bị méo                        | **Kiểm thử Visual Regression Testing** (`toHaveScreenshot` xuất ảnh Diff đỏ)              |

## Comparative Decision Matrix: Tại Sao Chọn SauceDemo?

```text
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│ Tiêu Chí So Sánh          │ Tự Dựng Frontend Mới      │ Sử Dụng SauceDemo (Chọn)  │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ Thời gian chuẩn bị        │ Tốn 1-2 tuần code React   │ **0 giây** (Có sẵn Cloud) │
│ Chi phí bảo trì hạ tầng   │ Phải tự host, dễ lỗi port │ **$0 (SauceLabs duy trì)**│
│ Mức độ chuẩn hóa quốc tế  │ Nghiệp vụ tự chế cục bộ   │ **Chuẩn mực toàn cầu**    │
│ Kịch bản lỗi nhân tạo     │ Phải tự code bẫy lỗi      │ **Có sẵn 6 User Personas**│
│ Rủi ro trước Hội đồng     │ Dễ bị soi lỗi code UI     │ **Tập trung 100% vào SDET**│
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### So sánh với các nguồn mẫu khác:

1. **So với TodoMVC:** TodoMVC quá đơn giản (chỉ có 1 ô input thêm việc cần làm), không có luồng tính toán thuế, phân trang, lọc giá, giỏ hàng hay thanh toán đa bước.
2. **So với Website thực tế (Amazon, Shopee, Tiki):** Các trang thực tế có hàng rào chống bot (Cloudflare WAF, CAPTCHA, thay đổi giá ngẫu nhiên), khiến bài test bị gãy liên tục do yếu tố ngoại cảnh ngoài tầm kiểm soát.
3. **So với The Internet (Herokuapp):** Chỉ gồm các trang HTML rời rạc cho từng element đơn lẻ, không tạo thành một luồng nghiệp vụ kinh doanh hoàn chỉnh.

## Strategic Alignment with Coursework Assessment

Việc lựa chọn SauceDemo kết hợp với Backend `ticket-booking` tạo nên một cấu trúc đồ án mẫu mực:

- **Tầng API (Backend `ticket-booking`):** Chứng minh năng lực kiểm thử kiến trúc phân tán cấp cao (Redis Redlock, Concurrency Race Condition, RFC 9457).
- **Tầng Web UI (Frontend `SauceDemo`):** Chứng minh năng lực kiểm thử tự động hóa giao diện chuẩn mực (Page Object Model, Component Object Model, Trace Viewer Post-Mortem, Visual Regression Testing với `visual_user`, và Auto-waiting với `performance_glitch_user`).

## Related Notes

- [[Page_Object_Model_and_Component_Architecture]]
- [[Playwright_Auto_Waiting_and_Actionability_Checks]]
- [[Playwright_Trace_Viewer_and_Post_Mortem_Diagnostics]]
- [[Visual_Regression_Testing_and_Dynamic_Data_Masking]]
- [[000_Software_Testing_Playwright_MOC]]
