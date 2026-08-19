---
tags:
  [
    type/concept,
    topic/tech,
    topic/architecture,
    topic/infrastructure,
    layer/infrastructure,
  ]
date: 2026-04-28
aliases: [Edge Functions, Cloudflare Workers]
description: "Đưa code ra các node CDN gần user nhất để giảm latency."
---

# Edge Computing

## TL;DR

Phiên bản "tốc độ cao" của Serverless. Đưa mã nguồn ra thực thi tại các trạm trung chuyển mạng (CDN) nằm ngay sát vị trí địa lý của user, giúp giảm độ trễ (ping) xuống mức tối thiểu (từ 200ms xuống còn ~10ms).

## Core Concept

- **Không dùng Container Node.js:** Thay vì khởi động nguyên một hệ điều hành ảo (Docker/Container) như Serverless truyền thống, Edge sử dụng **V8 Isolates** (cơ chế chạy tab của Google Chrome).
- **Phân phối toàn cầu:** Trình biên dịch băm nhỏ code (tree-shaking) thành file siêu nhẹ. File này được copy ra hàng trăm node CDN trên thế giới. User ở Việt Nam thì code chạy ở máy chủ Việt Nam/Singapore thay vì vòng sang Mỹ.

## Practical Implementation

- **Ưu điểm:** Khắc phục triệt để vấn đề "Cold Start" của Serverless. Thời gian khởi động gần như bằng 0 (chỉ mất vài mili-giây).
- **Trade-off (Giới hạn môi trường):** Đánh đổi lại tốc độ, Edge runtime bị lược bỏ các API nặng. Em KHÔNG THỂ dùng các hàm Node.js thuần tuý (như `fs` để đọc/ghi file ổ cứng) hoặc các thư viện yêu cầu native binaries.

---

**Related Notes:**

- Nguồn gốc kiến trúc: [[Serverless_Architecture]]
