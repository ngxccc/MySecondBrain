---
tags: [type/concept, topic/tech, status/permanent, layer/infrastructure]
date: 2026-07-04
aliases:
  [PostgreSQL 18 Features, Cập nhật PostgreSQL 18, Postgres 18 Stable Features]
description: "Tổng hợp các tính năng mới và cải tiến kiến trúc nhân (Meson build, AIO, Failover Slots, Radix Tree Vacuum) của PostgreSQL 18."
---

# ️ PostgreSQL 18: Tính Năng & Cải Tiến Kiến Trúc

## TL;DR

PostgreSQL 18 (phiên bản chính thức phát hành cuối năm 2025, đạt trạng thái GA ổn định trong năm 2026) mang lại những đột phá kiến trúc quan trọng cho các hệ thống doanh nghiệp tải cao. Các điểm cải tiến trọng tâm bao gồm: **B-Tree Index Skip Scan**, **Biến phiên chuẩn SQL (SQL-standard Session Variables)**, **DDL Logical Replication**, **Tối ưu hóa Scaling kết nối nội tại (Core Connection Scaling)**, **Tiến trình chuyển đổi 64-bit Transaction ID (64-bit XID)** và **Mã hóa Dữ liệu Tự động (Transparent Data Encryption - TDE)**.

---

## Core Concept & Key Architectural Upgrades

### 1. B-Tree Index Skip Scan

- **Bản chất:** Cho phép bộ lập trình truy vấn (Query Planner) duyệt qua B-Tree Index bằng cơ chế nhảy qua (skip) các giá trị trùng lặp của cột tiền tố mà không phải quét toàn bộ chỉ mục.
- **Tác động thực tế (Production Impact):**
  - Tăng tốc vượt bậc cho các câu lệnh `SELECT DISTINCT` trên bảng dữ liệu lớn.
  - Cho phép truy vấn tận dụng Composite Index `(colA, colB)` ngay cả khi câu lệnh `WHERE` chỉ lọc theo `colB` (bằng cách Skip qua các nhóm giá trị của `colA`).

### 2. Biến Phiên Chuẩn SQL

- **Bản chất:** Hỗ trợ chính thức cú pháp biến phiên theo chuẩn ANSI SQL (`CREATE VARIABLE`, `LET`) để thay thế việc lạm dụng các tham số cấu hình tùy chỉnh (`SET app.user_id = ...`).
- **Tác động thực tế:** Cho phép lưu trữ và truy xuất các biến ngữ cảnh người dùng, Tenant ID trong các ứng dụng Multi-tenant hoặc Row-Level Security (RLS) với độ an toàn kiểu dữ liệu (strict typing) và hiệu năng cao hơn.

### 3. DDL Logical Replication

- **Bản chất:** Hỗ trợ sao chép tự động các câu lệnh định nghĩa dữ liệu DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`) trực tiếp qua luồng Logical Replication.
- **Tác động thực tế:** Loại bỏ hoàn toàn sự phụ thuộc vào các công cụ bên ngoài (như pglogical hoặc trigger phức tạp) khi thực hiện nâng cấp schema trên các cụm CSDL phân tán hoặc zero-downtime migrations.

### 4. Tối ưu hóa Scaling Kết nối Nội tại

- **Bản chất:** Cải tiến cấu trúc quản lý danh sách backend processes và bộ nhớ dùng chung (Shared Memory Lock-Free structures) trong nhân PostgreSQL.
- **Tác động thực tế:** Giảm thiểu hiện tượng tranh chấp khóa (Lock Contention) khi hệ thống duy trì hàng nghìn kết nối đồng thời từ ứng dụng NestJS / Node.js, giúp tăng thông lượng xử lý giao dịch.

### 5. Tiến trình Chuyển đổi 64-bit Transaction ID

- **Bản chất:** Bước tiến chuyển đổi định danh giao dịch từ 32-bit (~4 tỷ transactions) sang 64-bit (`FullTransactionId`).
- **Tác động thực tế:** Triệt tiêu hoàn toàn rủi ro **Transaction ID Wraparound**, giảm đáng kể tần suất và chi phí I/O của quá trình Autovacuum Freeze đối với các bảng cực lớn.

### 6. Mã hóa Dữ liệu Tự động

- **Bản chất:** Hạ tầng mã hóa dữ liệu ở cấp độ Cluster / Tablespace trực tiếp trong nhân PostgreSQL với cơ chế quản lý Master Key linh hoạt.
- **Tác động thực tế:** Đảm bảo dữ liệu vật lý (Data Files), WAL và Temporary Files được mã hóa an toàn trên đĩa cứng mà không cần thay đổi ứng dụng, đáp ứng các tiêu chuẩn PCI-DSS / HIPAA.

---

## Practical Implementation & Configuration

### 1. Tận dụng B-Tree Index Skip Scan trong SQL

```sql
-- PostgreSQL 18 tự động áp dụng Index Skip Scan trên Composite Index (movie_id, status)
EXPLAIN ANALYZE
SELECT DISTINCT status
FROM show_seats;
-- Trình lập lịch sẽ thực hiện: Index Skip Scan on show_seats_movie_id_status_idx
```

### 2. Sử dụng Biến Phiên Chuẩn SQL

```sql
-- Khai báo biến phiên có kiểu dữ liệu UUID
CREATE VARIABLE current_tenant_id UUID;

-- Gán giá trị ở đầu session
LET current_tenant_id = '018f4e2b-7c1a-7000-8000-000000000001';

-- Sử dụng trực tiếp trong câu truy vấn hoặc Row-Level Security (RLS) policy
SELECT * FROM bookings WHERE tenant_id = current_tenant_id;
```

### 3. Cấu hình DDL Logical Replication

```sql
-- Trên nút Publisher: Bật sao chép DDL cho publication
ALTER PUBLICATION app_pub SET (publish_ddl = true);
```

### 4. Giám sát XID 64-bit và Tranh chấp Kết nối

```sql
-- Kiểm tra trạng thái XID 64-bit và tuổi frozen của các bảng lớn
SELECT relname,
       pg_size_pretty(pg_total_relation_size(oid)) AS size,
       age(relfrozenxid) AS xid_age
FROM pg_class
WHERE relkind = 'r'
ORDER BY age(relfrozenxid) DESC
LIMIT 5;
```

---

## Related Notes

- Bản đồ kiến trúc dữ liệu (MOC): [[000_Tech_MOC]]
- Bản đồ dự án Đặt vé (MOC): [[000_Ticket_Booking_MOC]]
- Hướng dẫn đánh chỉ mục CSDL: [[Database_Indexing_Guidelines]]
- Nguyên lý Left-Prefix Index: [[Left_Prefix_Index_Postgres]]
- Bản chất Index B+Tree & Disk I/O: [[Index_BPlusTree]]
- Chuẩn hóa Timestamp trong CSDL: [[Timestamp_vs_Timestamptz]]
