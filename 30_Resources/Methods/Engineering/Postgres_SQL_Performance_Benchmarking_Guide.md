---
tags:
  [
    type/method,
    topic/backend,
    topic/database,
    topic/sql,
    topic/career,
    layer/infrastructure,
  ]
date: 2026-08-07
aliases:
  [
    Postgres SQL Performance Benchmarking Guide,
    Hướng dẫn SQL Benchmark và EXPLAIN ANALYZE,
    PostgreSQL Performance Optimization,
  ]
description: "Hướng dẫn chuyên sâu về tối ưu hóa truy vấn PostgreSQL và đo đạc hiệu năng (Benchmarking) từ bản chất giải phẫu chỉ mục B+Tree, kỹ thuật đọc câu lệnh `EXPLAIN (ANALYZE, BUFFERS)`, phân trang Cursor..."
---

# Postgres SQL Performance & Benchmarking Guide

## TL;DR

Hướng dẫn chuyên sâu về tối ưu hóa truy vấn PostgreSQL và đo đạc hiệu năng (Benchmarking) từ bản chất giải phẫu chỉ mục B+Tree, kỹ thuật đọc câu lệnh `EXPLAIN (ANALYZE, BUFFERS)`, phân trang Cursor-based đến thực hành viết kịch bản `k6` Stress Test đo RPS và Latency ($p95/p99$) cho ứng dụng Backend.

---

## Core Concept & Rationales

### 1. Triết Lý Tối Ưu Dựa Trên Bằng Chứng

Không bao giờ đoán mò truy vấn SQL nhanh hay chậm. Mọi quyết định thêm Index hay sửa query phải dựa trên 2 bằng chứng:

- **Tầng Database**: Chỉ số `Execution Time` và số block `Shared Hit` (RAM) vs `Shared Read` (SSD) trong `EXPLAIN (ANALYZE, BUFFERS)`.
- **Tầng Application**: Chỉ số `RPS` (Request/sec) và `Latency p99` trong k6 Stress Test.

### 2. Nguyên Lý B+Tree Index & Page I/O

- Database lưu dữ liệu dưới dạng các **Page (mặc định 8KB)** trên đĩa SSD.
- Mục tiêu của Index B+Tree là thu hẹp số lượng Page phải nạp từ đĩa vào RAM (Buffer Cache).

---

## Practical Implementation

### Tài Liệu & Tool Tham Chiếu Chuẩn

1. **Use The Index, Luke! (Markus Winand)**: Trang web kinh điển về bản chất Indexing SQL.
2. **PostgreSQL Official Documentation (Performance Tips & EXPLAIN)**: Tài liệu chính thức của Postgres.
3. **k6 / Artillery**: Công cụ Stress Test viết bằng Go/JS cực nhẹ cho Localhost.

---

### ️ Bộ 4 Kỹ Thuật Tối Ưu SQL & Benchmarking

#### 1. Đọc & Soi `EXPLAIN `

Chạy lệnh trong PostgreSQL:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title, price FROM tickets WHERE status = 'AVAILABLE' AND event_id = 'evt-100';
```

- **Shared Hit**: Số block 8KB lấy từ RAM Buffer Cache (Rất nhanh).
- **Shared Read**: Số block 8KB phải đọc từ ổ cứng SSD (Rất chậm).
- **Red Flags (Dấu hiệu xấu)**:
  - `Seq Scan`: Quét toàn bộ bảng (thiếu Index).
  - `External Sort`: Sắp xếp ngốn đĩa tạm thay vì dùng Index Order.

#### 2. Quy Tắc Vàng Tạo Index B+Tree

- **Left-Prefix Rule (Tiền tố trái)**: Index Composite `(event_id, status)` hỗ trợ query `WHERE event_id = ?` hoặc `WHERE event_id = ? AND status = ?`, nhưng **KHÔNG** hỗ trợ `WHERE status = ?`.
- **Covering Index (Index Only Scan)**:
  ```sql
  CREATE INDEX idx_tickets_covering ON tickets (event_id, status) INCLUDE (title, price);
  ```
  Giúp Postgres lấy dữ liệu trực tiếp trên cây Index mà không cần nhảy về Heap Page đọc dữ liệu.

#### 3. Cursor-Based Pagination

- **Bẫy OFFSET**: `SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 50000;` $\rightarrow$ DB phải quét $50.020$ dòng rồi bỏ $50.000$ dòng.
- **Cursor Chuẩn**:
  ```sql
  SELECT * FROM orders WHERE id > 50000 ORDER BY id ASC LIMIT 20;
  ```
  Nhảy thẳng đến vị trí nhờ B+Tree Index với độ phức tạp $O(1)$.

#### 4. Kịch Bản k6 Benchmark Viết Cho Dự Án Backend

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "20s", target: 100 },
    { duration: "1m", target: 1000 }, // Giữ 1000 VUs
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<100"],
  },
};

export default function () {
  const res = http.get("http://localhost:3000/api/v1/tickets?eventId=evt-123");
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(0.1);
}
```

---

## Related Notes

- Lộ trình tổng thể Backend: [[Master_Backend_Engineering_SSOT]]
- Hướng dẫn System Design: [[System_Design_Architecture_Roadmap]]
- Hướng dẫn Stress Test Local: [[Local_Stress_Testing_Benchmark]]
- Tối ưu hóa Database Indexing: [[Database_Indexing_Guidelines]]
- Cấu trúc dữ liệu B+Tree: [[Index_BPlusTree]]
- Khóa bi quan Postgres: [[Postgres_Select_For_Update_Pessimistic_Locking]]
