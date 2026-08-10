---
tags: [type/method, topic/security, layer/infrastructure]
date: 2026-07-09
aliases:
  [Rate Limiting Strategies, DDoS Prevention, Defense in Depth Rate Limiting]
description: "Chiến lược rate limit đa lớp (IP/Email) và chống DDoS/Credential Stuffing."
---

# Chiến Lược Rate Limiting Đa Lớp & Phòng Chống DDoS

## TL;DR

Để bảo vệ các endpoint nhạy cảm (đặc biệt là Đăng ký/Đăng nhập) khỏi tấn công spam và brute-force phân tán (botnet), hệ thống cần áp dụng chiến lược phòng thủ đa lớp (Defense in Depth) kết hợp giới hạn thô IP ở tầng CDN/WAF và giới hạn tinh (Email/Account) ở tầng logic NestJS/Redis. Riêng luồng đăng ký phải chặn theo IP để tránh lỗi từ từ chối dịch vụ chiếm quyền (Account Pre-emption DoS).

---

## Core Concept

### 1. Giới hạn theo Địa chỉ IP vs. Theo Tài khoản (Target-based)

- **Chặn theo IP (Standard):**
  - _Ưu điểm:_ Ngăn chặn spam hàng loạt từ một nguồn (single-source). Tránh quá tải CPU máy chủ do các thuật toán băm mật khẩu nặng như `scrypt`/`bcrypt`.
  - _Nhược điểm:_ Bị vô hiệu hóa bởi botnet xoay vòng hàng ngàn proxy IP. Dẫn đến tấn công dò mật khẩu phân tán (Distributed Credential Stuffing) thành công.
- **Chặn theo Email/Tài khoản (Target-based):**
  - _Ưu điểm:_ Đếm số lần yêu cầu tác động lên một tài khoản (E.g. email `user@example.com`), chặn đứng brute-force phân tán (Distributed Credential Stuffing).
  - _Nhược điểm (Rủi ro Từ chối dịch vụ - DoS):_
    1. **Account Pre-emption DoS (trên `/register`):** Kẻ tấn công có thể spam đăng ký ảo bằng email của nạn nhân, khiến nạn nhân thật bị chặn (429) không thể tạo tài khoản.
    2. **Account Lockout DoS (trên `/login`):** Kẻ tấn công liên tục gửi đăng nhập sai cho email `victim@example.com` từ nhiều IP khác nhau. Nếu hệ thống áp dụng chặn cứng HTTP 429 theo email, người dùng thật sẽ bị khóa tài khoản vĩnh viễn và không thể đăng nhập.
  - _Giải pháp thiết kế chuẩn:_
    - **Luôn dùng IP làm bộ kiểm soát chính (Primary Tracker)** cho cả đăng ký và đăng nhập để chống spam máy chủ.
    - Chỉ áp dụng chặn theo Email khi có **thử thách bảo mật (CAPTCHA, MFA)** hoặc **Trì hoãn lũy tiến (Progressive Delay)** thay vì chặn cứng HTTP 429. Nếu dùng email-based throttler để đếm, trần giới hạn (limit ceiling) phải cao hơn đáng kể so với IP để tránh việc xoay IP khóa email.

### 2. Mô hình Phòng thủ Đa lớp

1. **Lớp 1: CDN / WAF (Cloudflare, AWS WAF, Nginx)**
   - Lọc thô lưu lượng truy cập dựa trên danh sách đen IP toàn cầu (IP Reputation).
   - Thực hiện JavaScript Challenge để loại bỏ bot không đầu (headless browsers/curl).
2. **Lớp 2: Application Controller (NestJS Throttler + Redis)**
   - Giới hạn tinh xảo dựa trên logic nghiệp vụ (email đối với login, IP đối với register).
   - Sử dụng Redis để đồng bộ số lượt đếm trên toàn bộ các replica của máy chủ ứng dụng.
3. **Lớp 3: Gia tăng rào cản bảo mật (CAPTCHA & Progressive Delay)**
   - Khi vượt ngưỡng giới hạn mềm, chuyển sang yêu cầu giải CAPTCHA (Turnstile/reCAPTCHA) hoặc kích hoạt cơ chế chờ tăng dần (Progressive Delay) để làm chậm tốc độ của bot tự động mà không làm ảnh hưởng tiêu cực đến người dùng thật.

### 3. Phát hiện và Chặn Bot ở Tầng CDN/WAF

Tuyến phòng thủ đầu tiên trước khi request đi vào server Node.js:

- **IP Reputation:** Sử dụng dịch vụ như Cloudflare WAF, AWS WAF để tự động chặn các IP nằm trong danh sách đen toàn cầu (Tor exit nodes, Hosting/Data center IPs, Open Proxies).
- **JavaScript Challenge / Managed Challenge:** Ép trình duyệt của client phải thực thi một đoạn mã JS ngầm để chứng minh đó là trình duyệt thật (không phải curl, postman, hay tool automation headless).
- **CAPTCHA vô hình (Invisible CAPTCHA):** Sử dụng các giải pháp như Cloudflare Turnstile hoặc Google reCAPTCHA v3 để chấm điểm hành vi (Behavioral Risk Score). Nếu điểm nghi vấn cao mới hiển thị CAPTCHA để xác thực.

### 4. Theo dõi Tỷ lệ Lỗi Hệ thống

- Theo dõi tổng số lượt đăng nhập thất bại trên toàn bộ hệ thống. Nếu đột ngột tăng vọt (ví dụ tăng 500% so với trung bình), hệ thống sẽ tự động chuyển sang chế độ phòng thủ nghiêm ngặt (ép tất cả user đăng nhập phải qua bước CAPTCHA hoặc tạm thời khóa tính năng đăng ký mới).

---

## Practical Implementation

### Cấu hình `CustomThrottlerGuard` phân tách theo luồng trong NestJS

```typescript
import { Injectable, type ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard, type ThrottlerLimitDetail } from "@nestjs/throttler";
import { I18nContext } from "nestjs-i18n";
import { HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  // Sử dụng tracker mặc định của ThrottlerGuard (chặn theo IP) để tránh các rủi ro Account Lockout DoS
  // (Do hệ thống chưa tích hợp CAPTCHA hoặc Progressive Delay để giảm ma sát an toàn cho tài khoản).
  // getTracker mặc định sẽ trả về request.ip
  protected override async throwThrottlingException(
    _context: ExecutionContext,
    _throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    const i18n = I18nContext.current()?.service;
    const lang = I18nContext.current()?.lang;

    const message = i18n
      ? await i18n.t("auth.TOO_MANY_REQUESTS", { lang })
      : "Too many requests. Please try again later";

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message,
        error: "Too Many Requests",
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
```

---

## Related Notes

- [[000_Tech_MOC]]
- [[Register_User_Existence_Creation_Workflow]]
