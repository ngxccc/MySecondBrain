---
tags:
  [
    type/concept,
    topic/tech,
    architecture-patterns,
    system-design,
    layer/architecture,
  ]
date: 2026-06-07
aliases:
  [
    Thiết kế hệ thống Newsfeed,
    Pull vs Push Model,
    Hybrid Fan-out Newsfeed,
    Fan-out on Read/Write,
  ]
description: "Thiết kế hệ thống Newsfeed tải cao bằng kiến trúc Hybrid Fan-out (Push + Pull)."
---

# Newsfeed System Design: Hybrid Fan-out Architecture

## TL;DR

Thiết kế hệ thống Newsfeed (mạng xã hội giống Twitter/Facebook) đối mặt với thách thức phân phối bài viết lớn. Giải pháp tối ưu là sử dụng kiến trúc **Hybrid Fan-out** kết hợp giữa **Push Model (Fan-out on Write)** cho người dùng bình thường và **Pull Model (Fan-out on Read)** cho người dùng nổi tiếng (KOLs/Celebrities), giúp cân bằng tải trọng ghi và đọc dữ liệu.

## Pull vs Push Model Comparison

1. **Pull Model (Fan-out on Read)**:
   - **Cách hoạt động**: Khi người dùng tải Newsfeed, hệ thống sẽ thực hiện truy vấn DB để lấy tất cả bài viết của những người họ đang theo dõi, gộp lại và sắp xếp theo thời gian.
   - **Ưu điểm**: Ghi rất nhanh (chỉ cần chèn bài viết vào DB).
   - **Nhược điểm**: Đọc cực kỳ chậm và tốn CPU của DB khi danh sách follow lớn và user liên tục refresh.

2. **Push Model (Fan-out on Write)**:
   - **Cách hoạt động**: Khi một người dùng đăng bài, hệ thống chạy background worker để chủ động copy ID bài viết đó và đẩy vào dòng thời gian (Inbox/Redis ZSET) của tất cả những người theo dõi họ. Khi người dùng mở app, hệ thống chỉ cần đọc trực tiếp từ Redis.
   - **Ưu điểm**: Đọc cực kỳ nhanh ($O(1)$ hoặc $O(log(N))$).
   - **Nhược điểm**: Ghi chậm khi người nổi tiếng (ví dụ: Ronaldo có 100M+ followers) đăng bài, khiến hàng đợi worker bị quá tải (write bottleneck).

## Hybrid Fan-out Solution

Hệ thống sử dụng các tiêu chí động để quyết định cách xử lý:

- **Người dùng thường (Followers < 10,000)**: Áp dụng **Push Model**. Bài viết mới sẽ được Worker push trực tiếp vào Redis Timeline của các followers.
- **KOLs / Celebrities (Followers >= 10,000)**: Áp dụng **Pull Model**. Bài viết mới của KOLs chỉ được ghi vào bảng chính của DB và không đẩy vào Redis Timeline của followers.
- **Khi người dùng đọc Newsfeed (Logic gộp)**:
  1. Lấy danh sách ID bài viết từ Redis Timeline cá nhân (chứa các bài viết được Push từ người dùng thường).
  2. Truy vấn danh sách KOLs mà người dùng này theo dõi, sau đó Pull 20 bài viết mới nhất của các KOLs đó trực tiếp từ DB.
  3. Gộp 2 nguồn dữ liệu lại, sắp xếp theo thời gian mới nhất và trả về cho Client.

## Implementation Phases

- **Phase 1 - Data Layer**: Định nghĩa Zod Schema cho `Cursor Pagination` (Frontend bắt buộc gửi `limit` và `cursor` thay vì `page` truyền thống để truy vấn ổn định $O(1)$).
- **Phase 2 - Cache Layer**: Sử dụng Redis Sorted Sets (ZSET) với các lệnh `ZADD`, `ZREVRANGE` để lưu trữ timeline. Giới hạn độ dài timeline tối đa 800 bài viết mỗi user (`ZREMRANGEBYRANK`) để tiết kiệm RAM.
- **Phase 3 - Worker Layer**: Khi có sự kiện `TWEET_CREATED`, Worker kiểm tra số lượng follower của tác giả: nếu là User thường thì chạy luồng Fan-out và `ZADD` vào Redis Timeline của followers.
- **Phase 4 - API Layer**: Đọc top 20 bài viết từ Redis Timeline, kết hợp Pull bài viết mới của KOLs đang follow, gộp lại và truy vấn MongoDB bằng `$in` để lấy thông tin chi tiết bài viết.

---

## Related Notes

- SOP Stress Test Local: [[Local_Stress_Testing_Benchmark]]
- Bản thiết kế MOC Kiến trúc: [[000_Tech_MOC]]
