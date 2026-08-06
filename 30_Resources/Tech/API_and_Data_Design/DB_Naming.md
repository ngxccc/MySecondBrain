---
tags: [type/concept, topic/tech, api-data-design]
date: 2026-08-06
aliases: [Đặt tên Database, DB Naming, Database Naming Conventions]
---

# DB Naming Conventions

## TL;DR

Quy tắc đặt tên nhất quán giữa cơ sở dữ liệu (Database) và mã nguồn (TypeScript): Tên bảng vật lý trong DB và tên biến ORM/TypeScript đại diện đều dùng **Số nhiều (Plural)** (ví dụ: `users`, `categories`, `orders`, `sessions`). Định nghĩa bảng bằng helper `snakeCase.table` của Drizzle ORM để đảm bảo tự động chuẩn hóa snake_case và đồng bộ 1:1 từ mã nguồn tới cơ sở dữ liệu.

---

## Rules & Rationales

### 1. Tên bảng vật lý trong DB & Tên biến TypeScript: SỐ NHIỀU (Plural)

- **Quy tắc:** Đặt tên bảng vật lý SQL và tên biến ORM/TypeScript đại diện đều là danh từ số nhiều (ví dụ: `users`, `categories`, `products`, `orders`).
- **Lý do (Rationale):**
  - **Bản chất tập hợp (Collection/Set):** Một bảng cơ sở dữ liệu đại diện cho một tập hợp gồm nhiều bản ghi (Rows), không phải một thực thể đơn lẻ.
  - **Chuẩn mặc định ngành (Industry Standard):** Hầu hết các Framework và ORM hiện đại (Ruby on Rails, Laravel, Django, Prisma, Drizzle ORM) đều mặc định dùng số nhiều cho tên bảng.
  - **Đồng bộ 1:1:** Giúp tên biến code TypeScript và tên bảng vật lý SQL khớp nhau hoàn toàn (`users` $\rightarrow$ `"users"`), tránh nhầm lẫn khi debug hoặc viết SQL query.

- **Ví dụ Drizzle ORM (sử dụng `snakeCase.table`):**

  ```typescript
  import { baseEntity } from "./helpers.schema";
  import { snakeCase, text, varchar } from "drizzle-orm/pg-core";

  // Tên biến TS: users (số nhiều)
  // Tên bảng vật lý SQL: "users" (số nhiều, tự động snake_case qua snakeCase.table)
  export const users = snakeCase.table("users", {
    ...baseEntity,
    email: varchar({ length: 255 }).notNull(),
    fullName: varchar({ length: 255 }).notNull(),
  });

  // Với danh từ có đuôi bất quy tắc (category -> categories)
  export const categories = snakeCase.table("categories", {
    ...baseEntity,
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
  });
  ```

---

### 2. Tên cột (Columns) & Khóa ngoại (Foreign Keys): SỐ ÍT (Singular)

- **Quy tắc:**
  - Tên cột đại diện cho thuộc tính của một bản ghi đơn lẻ $\rightarrow$ dùng **số ít** (`email`, `fullName`, `status`, `createdAt`).
  - Khóa ngoại (Foreign Key) tuân theo công thức **`<entity_singular>_id`** (ví dụ: `user_id`, `show_id`, `cinema_id`, `booking_id`).

- **Lý do (Rationale):**
  - Mỗi dòng (Row) chỉ chứa dữ liệu của một thực thể cụ thể. Cột `user_id` chỉ tới `id` của đúng một `user`.

- **Ví dụ (Drizzle Foreign Key):**

  ```typescript
  export const refreshTokens = snakeCase.table("refresh_tokens", {
    ...baseEntity,
    // Khóa ngoại dùng số ít: userId (map sang DB là user_id)
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar({ length: 255 }).notNull(),
  });
  ```

---

## ❓ Xử Lý Danh Từ Bất Quy Tắc (`category` $\rightarrow$ `categories`, `person` $\rightarrow$ `people`)

Nhiều người e ngại dùng Số Nhiều vì các từ tiếng Anh bất quy tắc. Tuy nhiên, trong thực tế phát triển phần mềm hiện đại, đây **không phải là vấn đề** vì các lý do sau:

### 1. Đã được Khai Báo Tường Minh (Explicit Declaration) trong TypeScript

Trong các ORM hiện đại như **Drizzle ORM** hay **Prisma**, lập trình viên **trực tiếp viết chuỗi tên bảng** vào file schema:

```typescript
export const categories = snakeCase.table("categories", { ... });
export const people = snakeCase.table("people", { ... });
```

Vì chuỗi tên bảng `"categories"` hay `"people"` được viết rõ ràng trong mã nguồn, **hoàn toàn không có ma thuật suy đoán chuỗi ngầm (Implicit String Reflection Magic)** $\rightarrow$ Không bao giờ xảy ra bug đoán sai tên bảng hay nhầm lẫn chính tả.

### 2. Bộ Thư Viện Pluralize Chuẩn TrONG Framework Auto-Mapping

Đối với các Framework tự động map tên Model ra tên bảng (như Rails hay Laravel), bộ thư viện mã nguồn mở `ActiveSupport::Inflector` / `pluralize` đã có sẵn từ điển đầy đủ cho tất cả các từ bất quy tắc (`category` $\rightarrow$ `categories`, `person` $\rightarrow$ `people`, `child` $\rightarrow$ `children`, `status` $\rightarrow$ `statuses`).

### 3. Tính Đọc Hiểu Tự Nhiên Ngữ Nghĩa (Semantic Readability)

Trong truy vấn SQL hoặc ORM code, tên bảng số nhiều đọc lên cực kỳ tự nhiên:

- `SELECT * FROM categories;` $\rightarrow$ _"Lấy tất cả các danh mục"_
- `await db.select().from(people);` $\rightarrow$ _"Chọn dữ liệu từ tập hợp con người"_

---

**Related Notes:**

- Hướng dẫn cấu trúc hệ thống: [[000_System_Structure]]
- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
