---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-04
aliases: [Kiểm định Index CSDL, Database Index Audit]
---

# Báo Cáo Kiểm Định & Thiết Kế Index Hệ Thống Đặt Vé Tải Cao

## TL;DR

Tài liệu này tổng hợp kết quả audit hệ thống chỉ mục (index) trong CSDL PostgreSQL của ứng dụng đặt vé phim. Nhằm đảm bảo khả năng đáp ứng đồng thời cao (high concurrency) và độ trễ cực thấp trong các thời điểm Flash Sale, tài liệu đề xuất và thiết lập các chỉ mục đơn (Single Index) và chỉ mục tổ hợp (Composite Index) cho các bảng cốt lõi: `shows`, `bookings`, `tickets`, `payments`, `halls`, `movie_genres`, `seats`, `show_seats` và `outbox_events`.

---

## Core Concept & Rationale

Trong một hệ thống đặt vé phim trực tuyến, các mẫu truy vấn chính thường liên quan đến tìm kiếm theo phạm vi thời gian (showtime), tra cứu theo thực thể cha (foreign key), và lấy dữ liệu phân trang theo thời gian giảm dần (booking history).

Nếu không thiết lập chỉ mục đầy đủ và đúng cách:

1. **Table Scan:** Hệ thống buộc phải duyệt toàn bộ bảng (Seq Scan), dẫn đến thời gian phản hồi API tăng từ vài mili-giây lên vài giây khi dữ liệu lớn.
2. **Lock Contention:** Thời gian thực thi truy vấn dài sẽ giữ các transaction lock lâu hơn, gây nghẽn cổ chai nghiêm trọng tại database dưới tải cao.
3. **Outbox Bottleneck:** Tầng chuyển tiếp sự kiện (Transactional Outbox worker) liên tục quét bảng `outbox_events` tìm các dòng có `status = 'pending'`. Nếu không có index kết hợp thời gian tạo, worker sẽ gây quá tải CPU của CSDL.
4. **Worker Cleanup Bottleneck:** Các background worker (như BullMQ hay Cron) liên tục chạy để dọn dẹp các ghế bị khóa mềm hết hạn (`show_seats`) hoặc hủy các đơn đặt vé chưa thanh toán quá thời gian chờ (`bookings`). Nếu các bảng này chứa hàng triệu bản ghi và không được index, mỗi chu kỳ dọn dẹp sẽ thực hiện quét toàn bộ bảng và lock tài nguyên hệ thống.

---

## Index Audit & Design Strategy

Dưới đây là các quyết định thiết kế chỉ mục chi tiết dựa trên hành vi truy vấn thực tế của hệ thống:

### 1. Phân tích chi tiết các chỉ mục bổ sung

| Bảng                | Tên Index                             | Loại Index | Cột chỉ mục                  | Lý do & Tác vụ tối ưu hóa                                                                                                              |
| :------------------ | :------------------------------------ | :--------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **`outbox_events`** | `outbox_events_status_created_at_idx` | Composite  | `(status, created_at)`       | Tối ưu hóa truy vấn định kỳ của Outbox Relay: `WHERE status = 'pending' ORDER BY created_at ASC`.                                      |
| **`shows`**         | `shows_movie_id_start_time_idx`       | Composite  | `(movie_id, start_time)`     | Tối ưu hóa API duyệt danh sách suất chiếu của phim theo thời gian: `WHERE movie_id = ? AND start_time >= ?`.                           |
| **`shows`**         | `shows_hall_id_start_time_idx`        | Composite  | `(hall_id, start_time)`      | Tối ưu hóa tác vụ kiểm tra trùng lịch chiếu tại phòng chiếu: `WHERE hall_id = ? AND start_time >= ?`.                                  |
| **`bookings`**      | `bookings_user_id_created_at_idx`     | Composite  | `(user_id, created_at DESC)` | Tối ưu hóa API lịch sử đặt vé của người dùng (thường sắp xếp mới nhất lên đầu): `WHERE user_id = ? ORDER BY created_at DESC`.          |
| **`bookings`**      | `bookings_status_expires_at_idx`      | Composite  | `(status, expires_at)`       | Tối ưu hóa tác vụ dọn dẹp đơn đặt vé quá hạn chưa thanh toán: `WHERE status = 'pending_payment' AND expires_at < NOW()`.               |
| **`show_seats`**    | `show_seats_status_locked_until_idx`  | Composite  | `(status, locked_until)`     | Tối ưu hóa tác vụ dọn dẹp ghế khóa mềm hết hạn: `WHERE status = 'reserved' AND locked_until < NOW()`.                                  |
| **`bookings`**      | `bookings_show_id_idx`                | Single     | `(show_id)`                  | Tối ưu hóa việc đếm số lượng vé/ghế đã đặt của một suất chiếu.                                                                         |
| **`bookings`**      | `bookings_voucher_id_idx`             | Single     | `(voucher_id)`               | Tối ưu hóa việc truy vấn các đơn đặt hàng có áp dụng một voucher cụ thể (Khóa ngoại PostgreSQL không tự index).                        |
| **`halls`**         | `halls_cinema_id_idx`                 | Single     | `(cinema_id)`                | Tối ưu hóa truy vấn danh sách phòng chiếu thuộc chi nhánh rạp.                                                                         |
| **`seats`**         | `seats_seat_type_id_idx`              | Single     | `(seat_type_id)`             | Tối ưu hóa việc phân nhóm hoặc tra cứu ghế theo loại ghế (Khóa ngoại PostgreSQL không tự index).                                       |
| **`movie_genres`**  | `movie_genres_genre_id_idx`           | Single     | `(genre_id)`                 | Tối ưu hóa truy vấn lọc phim theo thể loại (do Primary Key dạng `(movie_id, genre_id)` chỉ tối ưu khi truy vấn theo `movie_id` trước). |
| **`tickets`**       | `tickets_show_seat_id_idx`            | Single     | `(show_seat_id)`             | Tra cứu nhanh thông tin vé từ ghế suất chiếu.                                                                                          |
| **`payments`**      | `payments_booking_id_idx`             | Single     | `(booking_id)`               | Tăng tốc độ kiểm tra trạng thái thanh toán từ callback của cổng thanh toán.                                                            |

### 2. Đánh giá Tối ưu hóa dưới PostgreSQL 18 (Index Skip Scan Audit)

Dưới cơ chế **Index Skip Scan (PostgreSQL 18+)**, khả năng tái sử dụng Composite Index `(colA, colB)` cho các câu truy vấn chỉ lọc theo `colB` được đánh giá dựa trên Lực lượng (Cardinality) của `colA`:

- **Chỉ mục `show_seats_status_locked_until_idx (status, locked_until)` & `bookings_status_expires_at_idx (status, expires_at)`**: Cột `status` có Cardinality cực thấp (chỉ 3-4 giá trị ENUM). Do đó, các truy vấn quét lọc chỉ theo `locked_until` hoặc `expires_at` sẽ tận dụng tự động cơ chế Index Skip Scan với chi phí cực thấp ($K \le 4$). **Kết luận:** KHÔNG CẦN tạo thêm Single Index riêng lẻ cho `locked_until` hay `expires_at`.
- **Chỉ mục `bookings_user_id_created_at_idx (user_id, created_at)`**: Cột `user_id` có Cardinality cực cao (hàng trăm ngàn người dùng). Nếu ứng dụng có câu truy vấn hot-path quét lọc báo cáo tổng hợp chỉ theo thời gian `created_at` mà không truyền `user_id`, Index Skip Scan sẽ không đạt hiệu quả do $K$ quá lớn. **Kết luận:** Vẫn cần duy trì hoặc bổ sung Single Index trên `created_at` nếu có truy vấn thống kê toàn hệ thống theo thời gian độc lập.

---

## Practical Implementation (SQL DDL)

Đoạn mã SQL DDL khởi tạo các chỉ mục tối ưu trên PostgreSQL:

```sql
-- 1. Tối ưu hóa Outbox Worker
CREATE INDEX outbox_events_status_created_at_idx ON outbox_events (status, created_at);

-- 2. Tối ưu hóa truy vấn suất chiếu (Shows)
CREATE INDEX shows_movie_id_start_time_idx ON shows (movie_id, start_time);
CREATE INDEX shows_hall_id_start_time_idx ON shows (hall_id, start_time);

-- 3. Tối ưu lịch sử đặt vé và tra cứu suất chiếu (Bookings)
CREATE INDEX bookings_user_id_created_at_idx ON bookings (user_id, created_at DESC);
CREATE INDEX bookings_show_id_idx ON bookings (show_id);

-- 4. Tối ưu dọn dẹp khóa ghế và đơn đặt vé hết hạn (Background Workers)
CREATE INDEX show_seats_status_locked_until_idx ON show_seats (status, locked_until);
CREATE INDEX bookings_status_expires_at_idx ON bookings (status, expires_at);

-- 5. Tối ưu hóa tra cứu khóa ngoại (Foreign Keys)
CREATE INDEX halls_cinema_id_idx ON halls (cinema_id);
CREATE INDEX movie_genres_genre_id_idx ON movie_genres (genre_id);
CREATE INDEX tickets_show_seat_id_idx ON tickets (show_seat_id);
CREATE INDEX payments_booking_id_idx ON payments (booking_id);
CREATE INDEX seats_seat_type_id_idx ON seats (seat_type_id);
CREATE INDEX bookings_voucher_id_idx ON bookings (voucher_id);
```

---

## Related Notes

- Bản đồ dự án (MOC): [[000_Ticket_Booking_MOC]]
- Sơ đồ cơ sở dữ liệu (DBML): [[Database_Schema.dbml]]
- Đặc tả thiết kế hệ thống: [[Architecture_and_Spec]]
- Chiến lược dịch thuật & Caching: [[Localization_and_Caching_Strategy]]
- Chiến lược tách Refresh Token: [[Refresh_Token_Separation_Strategy]]
