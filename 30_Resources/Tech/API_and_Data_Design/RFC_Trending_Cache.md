---
tags: [type/concept, topic/tech, api-data-design, layer/infrastructure]
date: 2026-06-07
aliases:
  [RFC Caching Trending, Sorted Sets Redis Leaderboard, Realtime Ranking Cache]
description: "RFC đề xuất caching realtime leaderboard bằng Redis Sorted Sets (ZSET)."
---

# RFC: Realtime Leaderboard Caching System

## TL;DR

Tài liệu đề xuất (RFC) giải quyết bài toán Over-engineering và nghẽn CPU trên PostgreSQL khi tính toán bảng xếp hạng realtime bằng cách áp dụng bộ đệm Redis Sorted Sets (ZSET) với độ phức tạp $O(log(N))$ cho việc xếp hạng.

## Context & Problem

- Endpoint `/v1/creators/trending` tính toán xếp hạng Creator theo lượt view/interact bằng câu lệnh `COUNT` và `SORT` liên tục trong PostgreSQL.
- Hệ quả: CPU của Database chính bị quá tải (spike 100%) khi lượng tải truy cập đồng thời đạt mức 5,000 requests/giây.

## Proposed Solution

- **Tầng Cache đệm (Redis ZSET)**:
  - Sử dụng cấu trúc dữ liệu **Sorted Sets (ZSET)** của Redis để lưu danh sách Creator kèm theo điểm số.
  - Mỗi khi có tương tác mới, hệ thống gọi lệnh `ZINCRBY` để tăng điểm số realtime trực tiếp trên Redis.
  - Truy vấn top trending sử dụng `ZREVRANGE` hoặc `ZREVRANGEBYSCORE` với độ phức tạp cực thấp.

## Trade-offs

- **Ưu điểm (Pros)**: Tốc độ đọc đạt $O(1)$ đến $O(log(N) + M)$, giảm tải 90% truy vấn tính toán nặng cho Database PostgreSQL chính.
- **Nhược điểm (Cons)**: Chấp nhận bất đồng bộ dữ liệu (Eventual Consistency) trong vòng 5 giây giữa dữ liệu đệm Redis và PostgreSQL chính trong quá trình ghi ngược (write-behind).

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Thiết kế phân trang hiệu suất cao: [[Cursor_Pagination]]
