---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-04
aliases:
  [
    PostgreSQL 18 Interview Guide,
    Phỏng vấn PostgreSQL 18,
    PostgreSQL 18 Architecture Rationale,
  ]
---

# Hướng Dẫn Phỏng Vấn: Lý Do Lựa Chọn PostgreSQL 18 Cho Hệ Thống Đặt Vé Tải Cao

## TL;DR

Tài liệu này cung cấp kịch bản trả lời phỏng vấn chuyên sâu và lý do kiến trúc thuyết phục cho câu hỏi: **"Tại sao hệ thống Đặt vé Phim Tải cao lại lựa chọn PostgreSQL 18 thay vì các phiên bản cũ hơn như PostgreSQL 17, 16 hay 15?"**. Tài liệu đối chiếu trực tiếp từng giới hạn của các phiên bản cũ với giải pháp vượt trội của PostgreSQL 18, liên kết chặt chẽ với các thách thức kỹ thuật thực tế: chống phình đĩa (Index Bloat), tối ưu hóa ghi tải cao (High Write Throughput), triệt tiêu rủi ro Wraparound và bảo mật phân quyền Row-Level Security (RLS).

---

## Core Concept & Version-by-Version Comparison

### 1. Phân tích Giới hạn theo Phiên bản (PostgreSQL 15 $\rightarrow$ 16 $\rightarrow$ 17 $\rightarrow$ 18)

| Phiên bản         | Các điểm nghẽn & Giới hạn kỹ thuật nổi bật                                                                                                                                                                             | Giải pháp khắc phục triệt để trên PostgreSQL 18                                                                                                                                                                                                                                          |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL 15** | - Thiếu hoàn toàn các hàm SQL/JSON chuẩn.<br>- Quản lý bộ nhớ Autovacuum dạng mảng phẳng ngốn dung lượng RAM cực lớn.<br>- Phải tạo nhiều chỉ mục đơn lẻ gây phình đĩa (Index Bloat).                                  | - **Index Skip Scan**: Tự động tận dụng Composite Index mà không cần tạo thêm Single Index rác.<br>- **Radix Tree Vacuum**: Giảm 90% RAM khi autovacuum dọn dẹp bảng hàng chục triệu bản ghi.                                                                                            |
| **PostgreSQL 16** | - Chưa hỗ trợ biến phiên chuẩn SQL (phải hack qua `SET app.var = ...`).<br>- DDL Logical Replication chưa được hỗ trợ (chỉ replicate DML).<br>- Rủi ro Transaction ID Wraparound vẫn hiện hữu khi nạp dữ liệu ghi lớn. | - **SQL Session Variables (`CREATE VARIABLE`)**: Khai báo biến phiên có strict typing cho RLS / Multi-tenant.<br>- **DDL Logical Replication**: Tự động sao chép thay đổi schema qua luồng Logical mà không cần tool ngoài.<br>- **64-bit XID**: Triệt tiêu hoàn toàn nỗi sợ Wraparound. |
| **PostgreSQL 17** | - Mặc dù đã có `JSON_TABLE` và Failover Slot sync, nhưng vẫn **chưa có Index Skip Scan**.<br>- Vẫn tốn chi phí Lock Contention khi hệ thống duy trì hàng nghìn kết nối đồng thời từ NestJS.                            | - **Core Connection Scaling**: Cấu trúc bộ nhớ dùng chung dạng Lock-Free trong nhân giúp mở rộng hàng nghìn kết nối đồng thời.<br>- **Transparent Data Encryption (TDE)**: Mã hóa dữ liệu tự động ở cấp độ Cluster/Tablespace.                                                           |

---

### 2. Ma trận Giải bài toán Nghiệp vụ Đặt vé Tải cao (Ticket Booking Domain Impact)

Dưới đây là cách liên kết các tính năng mới của PostgreSQL 18 với các thách thức nghiệp vụ cụ thể trong dự án:

#### Thách thức 1: Tần suất ghi và cập nhật cực lớn ở các bảng `show_seats` & `outbox_events`

- **Bài toán nghiệp vụ:** Trong thời điểm Flash Sale ra mắt phim HOT, hàng chục ngàn người dùng đồng thời click đặt ghế. Bảng `show_seats` bị `UPDATE` liên tục (chuyển trạng thái từ `available` $\rightarrow$ `reserved` $\rightarrow$ `booked`), tạo ra hàng triệu Dead Tuples mỗi giờ.
- **Giải pháp của PG 18:**
  - **Radix Tree Vacuum**: Cơ chế lưu trữ Dead Tuples bằng Radix Tree giúp Autovacuum dọn dẹp và đóng băng dữ liệu (Tuple Freezing) với bộ nhớ RAM cực thấp, không làm treo server hay ngốn CPU trong giờ cao điểm.
  - **64-bit Transaction ID (64-bit XID)**: Xóa bỏ hoàn toàn nguy cơ CSDL phải dừng hoạt động khẩn cấp do chạm ngưỡng 2 tỷ transaction ID (Wraparound).

#### Thách thức 2: Chống phình đĩa (Index Bloat) & Tối ưu I/O Ghi với Index Skip Scan

- **Bài toán nghiệp vụ:** Các bảng `show_seats` và `bookings` có các chỉ mục tổ hợp như `show_seats(status, locked_until)` và `bookings(status, expires_at)`. Nếu ứng dụng có tác vụ quét dọn chỉ lọc theo cột thứ hai (`locked_until` hoặc `expires_at`), các phiên bản PG 15-17 buộc ta phải tạo thêm các Single Index độc lập, làm chậm các câu lệnh `INSERT/UPDATE` và làm tăng gấp đôi kích thước file chỉ mục trên đĩa.
- **Giải pháp của PG 18:** **Index Skip Scan** cho phép Postgres 18 duyệt qua B-Tree của chỉ mục tổ hợp bằng cách "nhảy" qua 3-4 giá trị ENUM của cột `status`. Chúng ta **loại bỏ được các Single Index dư thừa**, giúp tiết kiệm 30-50% dung lượng đĩa và giảm chi phí I/O ghi cho toàn bộ hệ thống.

#### Thách thức 3: Bảo mật Phân quyền Dữ liệu đa rạp / Khách hàng (Row-Level Security - RLS)

- **Bài toán nghiệp vụ:** Trong kiến trúc Multi-tenant hoặc khi áp dụng RLS để đảm bảo khách hàng chỉ xem được vé của chính mình, NestJS app phải truyền `userId` hoặc `tenantId` vào session trước khi query. Các phiên bản cũ phải dùng cú pháp hack `SET LOCAL app.current_user_id = '...'`.
- **Giải pháp của PG 18:** Sử dụng **Biến phiên chuẩn SQL (`CREATE VARIABLE current_user_id UUID; LET current_user_id = '...';`)**. Giúp ép kiểu dữ liệu chặt chẽ (Strict Type Safety), loại bỏ rủi ro SQL Injection và tăng tốc độ kiểm tra quyền ở tầng CSDL.

---

## Practical Implementation (Interview QA Scripts & Architecture Defense)

### Kịch bản Trả lời Phỏng vấn mẫu (Interview Answer Script)

**Q: "Tại sao dự án Ticket Booking của bạn lại sử dụng PostgreSQL 18 mà không dùng các bản đã rất ổn định như PG 16 hay PG 17?"**

> **Trả lời:**
> "Dự án Ticket Booking của chúng tôi sử dụng **PostgreSQL 18** vì đây là phiên bản mang lại những đột phá kiến trúc trực tiếp giải quyết 3 bài toán lớn nhất của hệ thống đặt vé tải cao:
>
> **Thứ nhất, bài toán tối ưu hóa I/O và ghi nạp tải cao ở bảng `show_seats`:**
> Bảng ghế suất chiếu bị `UPDATE` trạng thái liên tục trong thời điểm bán vé phim HOT. Trên PG 15-17, quá trình Autovacuum dọn dẹp hàng triệu Dead Tuples tiêu tốn lượng RAM rất lớn và có nguy cơ chạm ngưỡng XID Wraparound. PostgreSQL 18 giải quyết triệt để nhờ cấu trúc **Radix Tree Vacuum** (giảm 90% RAM autovacuum) và tiến trình **64-bit Transaction ID**, đảm bảo CSDL vận hành bền bỉ 24/7.
>
> **Thứ hai, chống phình chỉ mục (Index Bloat) bằng Index Skip Scan:**
> Chúng tôi có các Composite Index như `show_seats(status, locked_until)`. Nhờ tính năng **Index Skip Scan** của PG 18, các câu truy vấn dọn dẹp ghế quá hạn chỉ lọc theo `locked_until` vẫn tận dụng được chỉ mục tổ hợp này mà không cần tạo thêm Single Index riêng lẻ. Việc này giúp giảm 30-50% dung lượng đĩa và giảm chi phí I/O khi thực hiện các lệnh `INSERT/UPDATE`.
>
> **Thứ ba, bảo mật phân quyền an toàn với Biến phiên chuẩn SQL:**
> Thay vì dùng chuỗi hack cấu hình tùy chỉnh để truyền ngữ cảnh người dùng vào RLS như các phiên bản cũ, PG 18 hỗ trợ **SQL-standard Session Variables (`CREATE VARIABLE`)** có kiểu dữ liệu UUID chặt chẽ, giúp việc phân quyền dữ liệu ở tầng CSDL an toàn và đạt hiệu năng cao hơn."

---

## Related Notes

- Bản đồ dự án (MOC): [[000_Ticket_Booking_MOC]]
- Bản đồ kiến trúc dữ liệu: [[000_Tech_MOC]]
- Các tính năng chính của PostgreSQL 18: [[Postgres_18_New_Features]]
- Hướng dẫn thiết lập Index: [[Database_Indexing_Guidelines]]
- Báo cáo kiểm định Index dự án: [[Database_Index_Audit]]
