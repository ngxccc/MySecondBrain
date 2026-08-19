---
tags: [type/concept, topic/tech, topic/database, layer/infrastructure]
date: 2026-07-04
aliases:
  [Quy tắc thiết lập Index, Database Indexing Guidelines, Khi nào dùng Index]
description: "Hướng dẫn chi tiết khi nào dùng Index thường, Composite Index và Partial Index."
---

# Database Indexing Guidelines

## TL;DR

Quy tắc lựa chọn và thiết lập chỉ mục (Index) hiệu quả cho cơ sở dữ liệu quan hệ dựa trên tính chất chọn lọc (Selectivity), lực lượng (Cardinality) và tần suất truy vấn. Ưu tiên **Composite Index** (tuân thủ Left-Prefix) cho sắp xếp đa chiều, **Partial Index** cho dữ liệu động (loại bỏ các trạng thái tĩnh phổ biến), và tận dụng **Index Skip Scan (PostgreSQL 18+)** để tối ưu số lượng chỉ mục dư thừa dựa trên Lực lượng (Cardinality) của cột đầu tiên.

---

## Core Concepts & Decision Matrix

### 1. Chỉ số quyết định: Cardinality & Selectivity

- **Cardinality (Lực lượng):** Số lượng giá trị duy nhất (unique values) của một cột.
  - _Cardinality cao:_ UUID, Email, Phone, Slug, CreatedAt.
  - _Cardinality thấp:_ Boolean, Enum (status), Role (admin/user).
- **Selectivity (Độ chọn lọc):** Tỷ lệ phần trăm số dòng được trả về so với tổng số dòng của bảng.
  - Chỉ nên index khi câu lệnh query lọc ra **dưới 10-15%** tổng số dòng. Nếu vượt quá, database engine sẽ bỏ qua index để quét tuần tự (`Seq Scan`) vì quét tuần tự trực tiếp trên bộ nhớ đệm nhanh hơn.

### 2. Các loại Index & Nguyên tắc thiết lập

#### Normal Index & Chiều sắp xếp (ASC/DESC)

- Mặc định, khi khai báo index đơn giản, database (B-Tree) sẽ tự động tổ chức và sắp xếp các giá trị theo chiều **Tăng dần (ASC)**.
- Cấu trúc cây chỉ mục (B-Tree) có các liên kết hai chiều ở các nút lá (doubly linked list), cho phép database có thể đọc index từ trái qua phải (Tăng dần) hoặc ngược lại (Giảm dần) với tốc độ tương đương:
  - Truy vấn `ORDER BY score ASC` $\rightarrow$ Database chạy **Index Scan** (quét xuôi).
  - Truy vấn `ORDER BY score DESC` $\rightarrow$ Database chạy **Backward Index Scan** (quét ngược).
- **Kết luận:** Với index trên một cột đơn lẻ, việc định nghĩa chiều sắp xếp ASC hay DESC không quan trọng, database đều tối ưu được cho cả hai chiều sắp xếp.

#### Composite Index & PostgreSQL 18 Index Skip Scan

- **Khi nào sử dụng:** Khi cần lọc đồng thời nhiều cột (`WHERE col1 = ? AND col2 = ?`) hoặc lọc một cột và sắp xếp theo cột khác (`WHERE col1 = ? ORDER BY col2 DESC`).
- **Nguyên tắc Left-Prefix (Tiền tố bên trái):** Truy vấn có chứa cột đầu tiên (`col1`) của Composite Index `(col1, col2)` sẽ tự động tận dụng được chỉ mục này.
- **Tối ưu hóa Index Skip Scan (PostgreSQL 18+):** PostgreSQL 18 hỗ trợ tính năng **Index Skip Scan**, cho phép câu lệnh `WHERE` chỉ lọc theo cột thứ hai (`col2`) vẫn có thể sử dụng Composite Index `(col1, col2)` bằng cách "nhảy" (skip) qua các nhóm giá trị của `col1`.

##### ️ Quy tắc loại bỏ Single Index dựa trên Cardinality của `col1`

| Cardinality của `col1`     | Ví dụ Composite Index `(col1, col2)`                 | Lọc chỉ theo `col2` dùng Index Skip Scan?                               | Có nên XÓA / BỎ Single Index trên `col2` không?      | Lý do kỹ thuật                                                                                                                                                      |
| :------------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **THẤP (Low Cardinality)** | `(status, expires_at)` hoặc `(status, locked_until)` | **CỰC KỲ NHANH** (Số giá trị $K$ nhỏ, ví dụ status chỉ có 3 trạng thái) | **NÊN XÓA / KHÔNG CẦN TẠO** Single Index trên `col2` | Trình truy vấn chỉ cần nhảy qua $K=3$ nhánh B-Tree đại diện. Loại bỏ Single Index `(col2)` giúp tiết kiệm 100% dung lượng đĩa và chi phí I/O khi `INSERT`/`UPDATE`. |
| **CAO (High Cardinality)** | `(user_id, created_at)`                              | **RẤT CHẬM** (Số giá trị $K$ lớn, ví dụ có 1 triệu `user_id` khác nhau) | **BẮT BUỘC GIỮ / TẠO MỚI** Single Index trên `col2`  | Trình truy vấn phải thực hiện 1 triệu lần B-Tree search để nhảy qua từng `user_id`, hiệu năng kém hơn cả `Seq Scan`. Do đó phải giữ Single Index `(created_at)`.    |

#### Partial Index

- **Khi nào sử dụng:** Khi chỉ truy vấn trên một tập con dữ liệu (ví dụ: chỉ tính toán doanh thu trên các đơn hàng không bị hủy `status != 'cancelled'`).
- **Ưu điểm:** Tiết kiệm dung lượng đĩa, tăng hiệu năng ghi (`INSERT`/`UPDATE`) vì database không cần cập nhật cây chỉ mục cho các trạng thái không được quét tới.

---

## Concrete Examples & Case Studies

### 1. Case Study: Sales Cache vs Stock Cache

- **Sales Cache (`totalSalesCache`):** Cần được index vì người dùng thường xuyên có nhu cầu sắp xếp sản phẩm theo lượng bán ra (`ORDER BY totalSalesCache DESC LIMIT 10`) để hiển thị "Top bán chạy".
- **Stock Cache (`totalStockCache`):** KHÔNG nên index. Truy vấn lọc hàng tồn kho (`WHERE totalStockCache > 0`) có độ chọn lọc cực kỳ thấp vì 95% sản phẩm hiển thị đều còn hàng. Chúng ta cũng hầu như không bao giờ có nhu cầu sắp xếp sản phẩm theo lượng tồn kho tăng/giảm dần.

### 2. Mẫu thiết lập tối ưu cho bảng Orders

```typescript
export const orders = snakeCase.table("order", {
  id: uuid().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  status: orderStatusEnum().notNull().default("pending"),
  createdAt: timestamp().defaultNow().notNull(),
});

// Thiết lập Index tối ưu:
export const ordersIndexes = (table) => [
  // Composite Index: Dùng cho cả (userId), (userId, status), hoặc phân trang theo createdAt
  index("order_user_status_created_idx").on(
    table.userId,
    table.status,
    table.createdAt,
  ),

  // Partial Index: Tối ưu cho dashboard analytics tính toán doanh thu (loại bỏ đơn hủy)
  index("order_active_metrics_idx")
    .on(table.createdAt)
    .where(sql`${table.status} != 'cancelled'`),
];
```

---

## Related Notes

- Nguyên lý Left-Prefix: [[Left_Prefix_Index_Postgres]]
- Tính năng PostgreSQL 18: [[Postgres_18_New_Features]]
- Báo cáo kiểm định chỉ mục dự án: [[Database_Index_Audit]]
- Bản đồ điều hướng trung tâm: [[000_Tech_MOC]]
