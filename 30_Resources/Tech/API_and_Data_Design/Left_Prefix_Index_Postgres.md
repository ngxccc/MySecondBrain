---
tags: [type/concept, topic/tech, topic/database, layer/infrastructure]
date: 2026-06-07
aliases:
  [Nguyên lý Left-Prefix, Composite Index Left-Prefix, PostgreSQL Left-Prefix]
description: "Nguyên lý Left-Prefix của Composite Index trong PostgreSQL."
---

# Left-Prefix Index Principle in PostgreSQL

## TL;DR

Nguyên lý Left-Prefix (tiền tố bên trái) của chỉ mục hỗn hợp (Composite Index): Khi tạo chỉ mục trên nhiều cột `(col1, col2, col3)`, PostgreSQL có thể tái sử dụng chỉ mục này cho các truy vấn lọc bằng cột tiền tố bên trái đầu tiên (`col1`), giúp tiết kiệm việc tạo chỉ mục đơn lẻ dư thừa.

## Core Concept

- **Quy tắc hoạt động**:
  - Nếu bạn tạo một composite index trên `(userId, status, createdAt)`.
  - PostgreSQL hoàn toàn có thể sử dụng cột đầu tiên (`userId`) để tối ưu hóa các câu lệnh truy vấn chỉ lọc theo `userId`.
- **Ưu điểm**:
  - Tiết kiệm dung lượng lưu trữ trên đĩa và giảm tải CPU khi thực hiện WRITE (vì giảm số lượng index cần cập nhật).
- **Hạn chế**:
  - Chỉ mục hỗn hợp này **không thể** hỗ trợ tốt cho các truy vấn chỉ lọc theo cột giữa hoặc cuối (như `status` hoặc `createdAt`) mà không có cột đầu tiên (`userId`) trong điều kiện lọc.

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Hướng dẫn thiết lập Index: [[Database_Indexing_Guidelines]]
