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
aliases: [Lambda, Cloud Functions]
description: "Hạ tầng thực thi auto-scale, không lưu state (Stateless)."
---

# Serverless Architecture

## TL;DR

Mô hình điện toán đám mây nơi nhà cung cấp (AWS, Vercel) tự động quản lý việc cấp phát máy chủ. Hệ thống chỉ chạy (và tính tiền) khi có request từ user, không duy trì server 24/7.

## Core Concept

- **Cơ chế:** Thay vì thuê nguyên một chiếc xe (VPS) để không ngoài bãi, Serverless giống như việc gọi Grab. Có khách (request) thì xe tự chạy tới (spin-up container).
- **Auto-scaling:** Tính năng mạnh nhất. Nếu traffic tăng từ 10 lên 10,000 requests/s, hạ tầng tự động nhân bản hàm xử lý lên 10,000 bản sao song song.
- **Stateless:** Các hàm không lưu trữ trạng thái. Xong việc là bị tiêu hủy. Mọi dữ liệu phải lưu vào Database bên ngoài.

## Practical Implementation

- **Trade-off (Cold Start):** Nếu một hàm lâu không được gọi, nó sẽ bị "ngủ đông". Request tiếp theo đánh thức nó dậy sẽ mất thời gian khởi động môi trường (khoảng 500ms - 2s), gây lag nhẹ cho user đầu tiên.
- **Tử huyệt Database:** Dễ làm sập Database truyền thống do mở quá nhiều kết nối TCP cùng lúc. (Xem thêm cách giải quyết ở note Connection Pooling).

---

**Related Notes:**

- Nâng cấp tốc độ khởi động: [[Edge_Computing]]
- Giải quyết lỗi sập DB: [[Serverless_Connection_Pooling]]
