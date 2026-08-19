---
tags: [type/concept, topic/tech, topic/database, layer/infrastructure]
date: 2026-06-07
aliases: [Timestamp vs Timestamptz, Múi giờ Database, Thời gian UTC SQL]
description: "Phân biệt timestamp và timestamptz, quy tắc Enterprise bắt buộc."
---

# Timestamp vs Timestamptz in Database

## TL;DR

Phân biệt kiểu dữ liệu thời gian: `timestamp` (Without Time Zone) lưu trữ chuỗi thời gian tĩnh không đổi theo múi giờ, dễ gây lệch giờ. `timestamptz` (With Time Zone) lưu thời gian dưới dạng múi giờ chuẩn UTC tuyệt đối và tự động chuyển đổi phù hợp theo server/client truy vấn. Luật Enterprise: Luôn luôn dùng `timestamptz` cho `created_at` và `updated_at`.

## Core Concept

1. **`timestamp` (Without Time Zone)**:
   - Bản chất: Lưu trữ chính xác chuỗi ký tự ngày giờ được truyền vào mà không quan tâm múi giờ nào.
   - Ví dụ: Lưu `2026-04-27 19:15:00`, bất kể server query ở đâu (Mỹ hay Việt Nam), DB vẫn trả về đúng con số tĩnh này, dẫn đến sai lệch múi giờ thực tế khi xử lý logic ở ứng dụng.

2. **`timestamptz` (With Time Zone)**:
   - Bản chất: Lưu thời gian theo hệ quy chiếu tuyệt đối (**UTC**).
   - Cơ chế:
     - **Khi ghi (Insert/Update)**: Database tự động chuyển đổi thời gian local của server sang UTC để ghi nhận vào ổ đĩa.
     - **Khi đọc (Select)**: Driver DB tự động chuyển đổi ngược từ UTC sang múi giờ của client hoặc server đang thực hiện query.

## Enterprise Rule of Thumb

BẮT BUỘC sử dụng kiểu dữ liệu `timestamptz` cho tất cả các cột dấu thời gian hệ thống như `created_at` và `updated_at` để đảm bảo tính nhất quán trên các server phân tán địa lý.

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
