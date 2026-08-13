---
tags:
  [
    type/concept,
    topic/tech,
    database/postgresql,
    architecture/decision,
    performance/query,
  ]
aliases:
  [PostgreSQL, PostgreSQL vs Other Databases, Why PostgreSQL, Database Decision]
date: 2026-06-20
---

# PostgreSQL: Lựa chọn Cơ sở dữ liệu và So sánh Kiến trúc

## TL;DR

> [!important] Lưu ý kiến trúc (Architecture Note)
> Dự án không có Hồ sơ Quyết định Kiến trúc (ADR) chính thức cho việc lựa chọn PostgreSQL ngay từ đầu (chỉ có [[docs/adr/0005-use-drizzle-orm-instead-of-prisma.md|ADR 0005]] quyết định sử dụng Drizzle ORM). Rationale lựa chọn PostgreSQL dưới đây được **phân tích suy ngược (reverse-engineered)** từ các mẫu hình thiết kế (usage patterns) thực tế trong codebase: sử dụng dữ liệu động `JSONB` cho sản phẩm/đa ngôn ngữ, tích hợp driver serverless Neon, thiết kế ưu tiên Postgres của Drizzle, và yêu cầu hiệu năng phân trang Cursor Pagination.

PostgreSQL đóng vai trò là cơ sở dữ liệu quan hệ (RDBMS) trung tâm của hệ thống Hyundai E-commerce thay vì các giải pháp khác như MySQL, MongoDB hay SQLite. Lựa chọn này đảm bảo sự cân bằng giữa tính toàn vẹn dữ liệu nghiêm ngặt (**ACID Compliance**), khả năng lưu trữ tài liệu linh hoạt bằng **JSONB** (cho thông số kỹ thuật xe/phụ tùng), và tối ưu hóa truy vấn nâng cao (thông qua **Partial Indexes** và **Composite Indexes**).

---

## Core Concept

### 1. Sự kết hợp giữa Serverless Neon & Drizzle ORM (Tối ưu hóa Cold-Start)

Dự án được xây dựng trên mô hình serverless (deploy trên Vercel/Edge). Vì vậy, thời gian khởi động lạnh (**cold-start**) là một chỉ số sống còn:

- **Neon PostgreSQL Serverless Driver:** Neon cung cấp driver kết nối qua WebSocket thay vì giao thức TCP truyền thống, cho phép thiết lập kết nối siêu tốc ở môi trường serverless/edge.
- **Drizzle ORM (Postgres-First):** Drizzle được thiết kế ban đầu để hỗ trợ tốt nhất cho PostgreSQL. Khác với Prisma (phải khởi chạy một file binary Rust nặng nề gây trễ cold-start lớn), Drizzle là thư viện JS/TS thuần túy, cho phép thực thi truy vấn trực tiếp đến Postgres chỉ trong vài mili-giây.

### 2. Kiểm soát SQL toàn diện cho phân trang con trỏ (Cursor Pagination)

Hệ thống thương mại điện tử Hyundai yêu cầu hiệu năng phân trang đạt $O(1)$ thông qua Cursor-based Pagination (định nghĩa tại [[docs/adr/0004-use-cursor-based-pagination-for-lists.md|ADR 0004]]):

- Cấu trúc phân trang này yêu cầu các truy vấn so sánh giá trị con trỏ dạng `where (created_at, id) > (cursor_date, cursor_id)` kết hợp sắp xếp `order by`.
- **PostgreSQL** hỗ trợ tối ưu cực tốt cho các phép so sánh bộ giá trị (Row Value Comparisons) và các Composite Index tương ứng. Sự ánh xạ 1-1 giữa Drizzle và SQL nguyên bản của Postgres giúp lập trình viên kiểm soát tuyệt đối sơ đồ thực thi truy vấn (Execution Plan).

### 3. Nghiệp vụ B2B phức tạp: Hạn mức tín dụng & Đơn hàng thanh toán từng phần

Mô hình B2B của Hyundai E-commerce đòi hỏi độ tin cậy giao dịch cực cao:

- **Hạn mức tín dụng (Credit Limits):** Việc kiểm tra và trừ hạn mức khi đặt hàng yêu cầu các giao dịch khóa dòng (**`SELECT ... FOR UPDATE`**) để tránh tình trạng Race Condition khi đại lý đặt nhiều đơn hàng cùng lúc.
- **Thanh toán nhiều đợt (Đặt cọc & Tất toán):** Luồng thanh toán được chia nhỏ thành nhiều giao dịch (Transactions). Postgres đảm bảo tính cô lập giao dịch tuyệt đối, cam kết dữ liệu số dư công nợ luôn đồng bộ.

### 4. Sức mạnh của JSONB (Lưu trữ specs linh hoạt & Hỗ trợ i18n)

Sản phẩm xe cộ và phụ tùng cơ khí có thông số kỹ thuật động (Specs) rất đa dạng:

- **JSONB (Binary JSON):** Postgres lưu trữ JSON ở định dạng nhị phân đã phân tích cú pháp. Khác với MySQL, Postgres hỗ trợ **GIN Index (Generalized Inverted Index)** trên các trường JSONB, giúp truy vấn lọc sản phẩm theo thuộc tính (Faceted Search) cực kỳ nhanh chóng.

---

## Comparison with Other Databases

| Tiêu chí           | PostgreSQL (RDBMS)             | MySQL (RDBMS)        | MongoDB (NoSQL)     | SQLite (Embedded)   |
| :----------------- | :----------------------------- | :------------------- | :------------------ | :------------------ |
| **Mô hình**        | Object-Relational              | Relational           | Document-based      | Serverless File     |
| **Tính ACID**      | Cực kỳ nghiêm ngặt             | Khá tốt (với InnoDB) | Có (nhưng giới hạn) | Khá tốt             |
| **JSON Support**   | Vượt trội (JSONB + GIN Index)  | Khá (JSON đơn giản)  | Mặc định (BSON)     | Rất hạn chế         |
| **Index Nâng cao** | Partial, Expression, GIN, GiST | Hạn chế              | Hạn chế             | Hạn chế             |
| **Tìm kiếm**       | Full-Text Search tích hợp tốt  | Hạn chế              | Khá                 | Hạn chế             |
| **Đồng thời**      | Rất tốt (MVCC)                 | Khá tốt              | Cực kỳ cao          | Hạn chế (Lock file) |

### 1. Tại sao không dùng MongoDB (NoSQL)?

- **Thiếu Referential Integrity:** MongoDB không có các ràng buộc khóa ngoại (foreign key constraints) ở mức database. Việc duy trì tính toàn vẹn tham chiếu giữa `user`, `order`, `payment` phải xử lý ở tầng ứng dụng, cực kỳ dễ gây bất đồng bộ dữ liệu (orphan records).
- **Truy vấn Aggregate phức tạp:** Việc tính toán doanh thu, công nợ, đối soát tài chính B2B trên MongoDB đòi hỏi các pipeline Aggregation rất phức tạp, tiêu tốn nhiều RAM và CPU hơn so với các câu lệnh SQL JOIN được tối ưu hóa.

### 2. Tại sao không dùng MySQL?

- **Thiếu các tính năng Index nâng cao:** Postgres hỗ trợ **Partial Index** (chỉ index các dòng thỏa mãn điều kiện, ví dụ: các đơn hàng ở trạng thái `PENDING` chưa thanh toán) [5], giúp tiết kiệm bộ nhớ và đẩy nhanh tốc độ ghi [5]. MySQL không hỗ trợ tốt tính năng này.
- **Khả năng mở rộng tính năng:** Postgres có hệ sinh thái extension phong phú (như `pg_trgm` cho tìm kiếm mờ, `postgis` cho tính toán địa lý/khoảng cách vận chuyển sau này) giúp hệ thống sẵn sàng cho các nhu cầu mở rộng trong tương lai mà không cần đổi công nghệ.

### 3. Tại sao không dùng SQLite?

- **Môi trường Multi-User:** SQLite là database dạng file, phù hợp cho ứng dụng di động, thiết bị nhúng hoặc môi trường kiểm thử (Testing) [6]. Nó không phù hợp cho hệ thống E-commerce chạy trên Production với hàng nghìn kết nối đồng thời từ khách hàng và admin (gây ra tình trạng database locked).

---

## Practical Implementation

Hệ thống của chúng ta sử dụng Drizzle ORM để khai báo các cấu trúc quan hệ chặt chẽ của PostgreSQL và tận dụng các tính năng nâng cao:

### 1. Khai báo schema quan hệ chặt chẽ với khóa ngoại (`auth.schema.ts`)

```typescript
import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Khóa ngoại đảm bảo toàn vẹn dữ liệu
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
```

### 2. Sử dụng Partial Index để tối ưu hóa truy vấn đơn hàng chưa thanh toán

```typescript
import { pgTable, uuid, text, pgIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const orders = pgTable(
  "order",
  {
    id: uuid("id").primaryKey(),
    status: text("status").notNull(), // 'PENDING', 'PAID', 'CANCELLED'
    userId: uuid("user_id").notNull(),
  },
  (table) => [
    // Lập chỉ mục bán phần (Partial Index) - Chỉ đánh chỉ mục các đơn hàng đang PENDING
    pgIndex("pending_orders_idx")
      .on(table.id)
      .where(sql`${table.status} = 'PENDING'`),
  ],
);
```

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Đánh chỉ mục bán phần: [[Partial_Index]]
- Lập chỉ mục B-Tree: [[Index_BPlusTree]]
- Đồng bộ đặt tên Database: [[DB_Naming]]
- Chiến lược phân trang: [[Cursor_Pagination]]
