---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-04
aliases: [Chiến lược thiết kế Enum CSDL, Database Enum Strategy]
---

# Chiến Lược Thiết Kế ENUM Hệ Thống Đặt Vé

## TL;DR

Tài liệu này đánh giá giải pháp chuyển đổi các trường trạng thái và danh mục tĩnh (như Vai trò, Trạng thái đơn, Trạng thái ghế, Trạng thái thanh toán, Phương thức thanh toán, Loại giảm giá, Phân loại phim) từ kiểu chuỗi tự do (`VARCHAR`) sang các kiểu dữ liệu liệt kê giới hạn dạng **PostgreSQL ENUM**. Đồng thời, tài liệu phân tích sâu sắc về các đánh đổi bảo mật, hiệu năng và khả năng nâng cấp hệ thống giữa native ENUMs của PostgreSQL và việc sử dụng ràng buộc ứng dụng (Zod) kết hợp `CHECK` constraint ở database, đồng thời khuyến nghị các trường hợp **không** được enum hóa.

---

## Core Concept & Rationale

Trong một ứng dụng đặt vé phim trực tuyến phức tạp, các thực thể quan trọng có chu kỳ sống (lifecycle) và danh mục tĩnh được mô tả qua trạng thái:

- **Người dùng (`users`)**: Vai trò (`user_role`), Trạng thái hoạt động (`user_status`).
- **Ghế suất chiếu (`show_seats`)**: Trạng thái đặt chỗ (`show_seat_status`).
- **Đơn hàng (`bookings`)**: Trạng thái thanh toán/giữ chỗ (`booking_status`).
- **Giao dịch (`payments`)**: Phương thức thanh toán (`payment_method`), Trạng thái cổng thanh toán (`payment_status`).
- **Phim (`movies`)**: Phân loại độ tuổi giới hạn (`movie_rating`).
- **Voucher khuyến mãi (`vouchers`)**: Loại giảm giá (`discount_type`).
- **Sự kiện outbox (`outbox_events`)**: Trạng thái truyền tải (`outbox_event_status`).

Sử dụng kiểu dữ liệu ràng buộc tĩnh giúp:

1. **Đảm bảo tính toàn vẹn dữ liệu (Data Integrity):** CSDL chặn hoàn toàn các giá trị không hợp lệ (ví dụ: gán nhầm status đơn hàng là `'failed'` thay vì `'cancelled'`).
2. **Tối ưu hóa dung lượng (Storage Optimization):** PostgreSQL lưu trữ nội bộ ENUM bằng mã số OID 4-byte cố định thay vì chuỗi ký tự độ dài thay đổi (giảm đáng kể kích thước bảng và chỉ mục khi bảng có hàng triệu dòng).

---

## Trade-offs: Postgres ENUM vs VARCHAR + CHECK + Zod

Mặc dù native ENUM mang lại hiệu quả cao về mặt lưu trữ, chúng ta phải cân nhắc kỹ lưỡng các đánh đổi dưới đây:

### 1. Bảng so sánh chi tiết

| Tiêu chí                         | Native PostgreSQL ENUM (`pgEnum`)                                                                           | VARCHAR + CHECK Constraint + Zod             |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| **Độ chặt chẽ ở DB**             | Rất cao (Ngăn chặn trực tiếp từ kiểu dữ liệu)                                                               | Cao (Ngăn chặn thông qua ràng buộc kiểm tra) |
| **Dung lượng lưu trữ**           | **Tối ưu:** 4 bytes cố định                                                                                 | Phụ thuộc độ dài chuỗi ký tự                 |
| **Khả năng thêm giá trị mới**    | Dễ dàng thông qua: `ALTER TYPE ... ADD VALUE`                                                               | Dễ dàng (Cập nhật check constraint)          |
| **Khả năng xóa/đổi tên giá trị** | **Phức tạp:** PostgreSQL không hỗ trợ xóa trực tiếp. Phải tạo kiểu mới, cast cột cũ và xóa kiểu cũ.         | Dễ dàng (Cập nhật check constraint)          |
| **Drizzle ORM & Migrations**     | Hỗ trợ tự động qua `pgEnum`. Tuy nhiên, các migration thay đổi lớn thường không thể chạy trong transaction. | Dễ quản lý, migration an toàn tuyệt đối.     |
| **Tính di động (Portability)**   | Kém (Kiểu ENUM mang tính đặc thù của Postgres)                                                              | Cao (Tương thích hầu hết các CSDL SQL khác)  |

### 2. Sự lựa chọn kiến trúc và Các trường hợp Khuyến nghị

- **Với các bảng có tần suất ghi và khối lượng cực lớn (`show_seats`, `outbox_events`)**:
  - **Quyết định:** Sử dụng **Native ENUM** để tối đa hóa hiệu năng lưu trữ và tăng tốc độ tìm kiếm chỉ mục (Index Seek).
- **Với các danh mục nghiệp vụ tĩnh hoàn toàn (`discount_type`, `movie_rating`)**:
  - **Quyết định:** Sử dụng **Native ENUM**. Phân loại độ tuổi điện ảnh (`G`, `PG`, `PG_13`, `R`, `NC_17`) và hình thức chiết khấu của rạp (`percentage`, `flat`) là các tiêu chuẩn cốt lõi cực kỳ tĩnh, gần như không bao giờ biến động.
- **Với danh mục cổng thanh toán (`payment_method`)**:
  - **Quyết định:** Khai báo kiểu **Native ENUM** (`MOMO`, `VNPAY`, `Credit_Card`, `ShopeePay`) để quản lý nghiêm ngặt các cổng thanh toán đang hoạt động. Việc thêm cổng mới sau này chỉ cần một lệnh chạy migration DDL `ALTER TYPE payment_method ADD VALUE 'ZALOPAY'` độc lập.

### ⚠️ Lưu ý Kiến trúc quan trọng: Những trường KHÔNG nên dùng ENUM

Để tránh việc ràng buộc cứng nhắc kiến trúc CSDL với sự phát triển tính năng ở tầng ứng dụng, các trường sau được khuyến nghị **giữ nguyên kiểu VARCHAR** kết hợp với validation logic ở code (Zod):

1. **Loại sự kiện `outbox_events.event_type`**:
   - _Lý do_: Khi hệ thống mở rộng, các developer sẽ liên tục bổ sung các sự kiện nghiệp vụ mới (ví dụ: `voucher.redeemed`, `combo.updated`, `user.registered`). Nếu dùng ENUM, mỗi lần code sinh sự kiện mới sẽ bắt buộc phải chạy lệnh DDL sửa đổi kiểu dữ liệu của CSDL trên bảng Outbox có tần suất ghi lớn. Việc này gây rủi ro downtime cao. Giữ `VARCHAR(255)` giúp duy trì tính độc lập.
2. **Mã ngôn ngữ dịch thuật `movie_translations.language_code`**:
   - _Lý do_: Việc mở rộng thị trường sang các quốc gia khác yêu cầu hỗ trợ thêm ngôn ngữ mới (ví dụ: `ja` cho tiếng Nhật, `ko` cho tiếng Hàn). Việc quản lý mã ngôn ngữ bằng `VARCHAR(10)` giúp hệ thống localization hoạt động hoàn toàn động, Admin có thể tự thêm bản dịch ngôn ngữ mới thông qua Dashboard mà không yêu cầu chỉnh sửa schema hay chạy lại migration CSDL.

---

## Practical Implementation

### 1. Drizzle ORM Schema Setup

Khai báo các kiểu ENUM mới và ánh xạ vào các bảng tương ứng trong NestJS / Drizzle:

```typescript
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

// 1. Khai báo ENUM Phân loại phim
export const movieRatingEnum = pgEnum("movie_rating", [
  "G",
  "PG",
  "PG_13",
  "R",
  "NC_17",
]);

// 2. Sử dụng trong bảng movies
export const movies = pgTable("movies", {
  id: uuid("id").primaryKey(),
  tmdbId: varchar("tmdb_id", { length: 50 }).unique(),
  imdbId: varchar("imdb_id", { length: 50 }).unique(),
  rating: movieRatingEnum("rating").notNull(),
});
```

### 2. Khai báo ràng buộc Zod ở tầng ứng dụng (Application Level validation)

Đảm bảo validation đầu vào API đồng bộ với ENUM của Database:

```typescript
import { z } from "zod";

// Khai báo Schema xác thực đầu vào bằng Zod
export const MovieRatingSchema = z.enum(["G", "PG", "PG_13", "R", "NC_17"]);
export type MovieRating = z.infer<typeof MovieRatingSchema>;
```

---

## Related Notes

- Bản đồ dự án (MOC): [[000_Ticket_Booking_MOC]]
- Sơ đồ cơ sở dữ liệu (DBML): [[Database_Schema.dbml]]
- Báo cáo kiểm định chỉ mục CSDL: [[Database_Index_Audit]]
- Chiến lược dịch thuật & Caching: [[Localization_and_Caching_Strategy]]
- Chiến lược tách Refresh Token: [[Refresh_Token_Separation_Strategy]]
