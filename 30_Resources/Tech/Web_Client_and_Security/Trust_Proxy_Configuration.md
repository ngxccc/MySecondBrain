---
tags: [type/concept, topic/tech, topic/security, layer/infrastructure]
date: 2026-07-09
aliases:
  [Trust Proxy Express, Trust Proxy NestJS, X-Forwarded-For Configuration]
description: "Cấu hình tin tưởng proxy trong Express & NestJS để lấy client IP chính xác."
---

# Cấu Hình Trust Proxy Trong Express & NestJS

## TL;DR

Khi ứng dụng NestJS/Express chạy phía sau một Reverse Proxy hoặc CDN (như Nginx, Cloudflare, AWS ALB), địa chỉ IP kết nối trực tiếp đến ứng dụng sẽ luôn là IP nội bộ của Proxy (`127.0.0.1`). Để đọc được IP thực tế của client, ứng dụng cần tin tưởng các header do proxy đính kèm (E.g. `X-Forwarded-For`) bằng cách thiết lập cấu hình `app.set("trust proxy", 1)`. Nếu không cấu hình, các tính năng bảo mật dựa trên IP như giới hạn tần suất yêu cầu (Rate Limiting/ThrottlerGuard) sẽ nhận diện sai và vô tình khóa truy cập của toàn bộ người dùng hệ thống.

---

## Core Concept

### 1. Cơ chế Chuyển tiếp IP qua Reverse Proxy

Trong môi trường Production tiêu chuẩn, client không kết nối trực tiếp đến Node.js server mà đi qua các lớp trung gian:

```text
[Người dùng thật] (IP: 115.79.x.x)
       │
       ▼ (Kết nối HTTPS)
[Cloudflare / Nginx / Load Balancer] (IP Proxy)
       │
       ▼ (Chuyển tiếp HTTP)
[NestJS / Node.js] (IP: 127.0.0.1)
```

Khi nhận được request từ client, Reverse Proxy sẽ chuyển tiếp request đó tới Node.js kèm theo các HTTP headers chứa thông tin của client thực tế:

- **`X-Forwarded-For`:** Danh sách chuỗi các IP mà request đã đi qua, IP đầu tiên chính là IP của người dùng thật (`Client, Proxy1, Proxy2...`).
- **`X-Real-IP`:** IP trực tiếp của client gửi request đến Proxy gần nhất.

### 2. Tại sao Express bỏ qua header này mặc định?

Theo mặc định, Express (và NestJS chạy trên nền Express) sẽ **không tin tưởng** các header chuyển tiếp này. Lý do là để ngăn chặn tấn công **IP Spoofing (Giả mạo IP)**.
Nếu hệ thống tin tưởng vô điều kiện, một hacker từ IP `2.2.2.2` có thể tự gửi request với header `X-Forwarded-For: 1.1.1.1` để đổ lỗi hoặc bypass giới hạn IP của người dùng có IP `1.1.1.1`. Do đó, Express chỉ đọc trường kết nối trực tiếp (`connection.remoteAddress`), dẫn đến việc `request.ip` luôn trả về IP của Proxy (ví dụ `127.0.0.1`).

### 3. Hậu quả đối với hệ thống Rate Limiting

Khi ứng dụng triển khai `ThrottlerGuard` (Lớp 2 của Defense in Depth) mà không bật `trust proxy`:

1. Hệ thống nhận diện mọi request đều đến từ IP `127.0.0.1`.
2. Khi một người dùng hoặc bot spam quá giới hạn cho phép (ví dụ: 5 lần/phút), hệ thống sẽ ghi nhận IP `127.0.0.1` đã vượt ngưỡng và chặn IP này.
3. Kết quả: **Tất cả những người dùng hợp lệ khác trên toàn hệ thống sẽ bị chặn cứng (HTTP 429)** do chung IP nhận diện với Proxy.

---

## Practical Implementation

### Cấu hình trong NestJS

Để kích hoạt, ta cần chuyển kiểu khởi tạo ứng dụng NestJS sang `NestExpressApplication` để truy cập trực tiếp vào các phương thức cấu hình Express bên dưới:

```typescript
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // WHY: Trust reverse proxy headers (e.g. X-Forwarded-For from Cloudflare/Nginx) so throttler correctly identifies client IPs behind WAF/CDN.
  app.set("trust proxy", 1);

  await app.listen(3000);
}
void bootstrap();
```

### Các giá trị cấu hình của `trust proxy`

Tùy thuộc vào số lượng proxy đứng trước ứng dụng, bạn có thể truyền các tham số khác nhau vào phương thức `app.set("trust proxy", ...)`:

| Giá trị cấu hình                     | Mô tả                                                                                               | Trường hợp sử dụng                                                                           |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **`1`** (hoặc `true`)                | Tin tưởng proxy đầu tiên gần nhất với máy chủ (chấp nhận header `X-Forwarded-For` từ hop đầu tiên). | Ứng dụng chạy trực tiếp sau 1 Nginx hoặc 1 Cloudflare Tunnel duy nhất.                       |
| **`number` (Ví dụ: `2`)**            | Tin tưởng `N` proxy đầu tiên tính từ máy chủ ứng dụng ngược lại phía client.                        | Hệ thống chạy qua cả Cloudflare và Nginx nội bộ (`Client -> Cloudflare -> Nginx -> NestJS`). |
| **`string` (Ví dụ: `"loopback"`)**   | Chỉ tin tưởng các địa chỉ nội bộ (`127.0.0.1`, `::1`).                                              | Ứng dụng chạy chung máy vật lý với Nginx.                                                    |
| **`string` (Ví dụ: `"10.0.0.0/8"`)** | Chỉ tin tưởng các proxy thuộc dải IP con này.                                                       | Ứng dụng chạy trong mạng nội bộ VPC (AWS/GCP).                                               |

---

## Related Notes

- [[000_Tech_MOC]]
- [[Multi_Layer_Rate_Limiting_DDoS_Prevention]]
