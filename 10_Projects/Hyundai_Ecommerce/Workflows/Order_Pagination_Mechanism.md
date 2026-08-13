---
tags:
  [
    type/concept,
    topic/tech,
    database/drizzle-orm,
    design-pattern/pagination,
    framework/nextjs,
  ]
aliases:
  [
    Order Pagination,
    Cursor Pagination,
    Bidirectional Cursor,
    Pagination Mechanism,
    Order Cursor,
  ]
date: 2026-06-21
---

# Order Pagination Mechanism: UUIDv7-Based Keyset Approach

## TL;DR

Để tối ưu hóa hiệu năng truy vấn danh sách đơn hàng lớn và đảm bảo hiển thị ổn định không bị trùng lặp/bỏ sót khi có dữ liệu mới phát sinh, dự án triển khai cơ chế **Phân trang bằng con trỏ hai chiều (Bidirectional Keyset Pagination)** tuân thủ theo [[docs/adr/0004-use-cursor-based-pagination-for-lists.md|ADR 0004]] [1, 2].

Hệ thống tận dụng đặc tính tuần tự thời gian của **UUIDv7** làm cột con trỏ đơn lẻ [3]. Việc sử dụng chuỗi ID UUIDv7 trực tiếp giúp loại bỏ hoàn toàn các lỗi lệch múi giờ (timezone mismatch) và hao hụt độ chính xác dưới mili-giây (sub-millisecond precision loss) giữa Postgres và JavaScript [3, 4].

Hệ thống cũng hỗ trợ tính năng nhảy nhanh về **Trang đầu (First Page)** và **Trang cuối (Last Page)** với độ phức tạp $O(1)$ mà không gây lệch số lượng phần tử hiển thị ở trang cuối và trang cận cuối [4].

---

## Core Concept

### 1. Phân trang Keyset dựa trên UUIDv7

- **UUIDv7** chứa 48 bit đầu tiên biểu diễn dấu thời gian Unix tính bằng mili-giây, giúp nó có khả năng tự động sắp xếp theo trình tự thời gian (chronological sorting) một cách tự nhiên qua các phép so sánh chuỗi/nhị phân [3].
- Thay vì ghép nối thời gian và ID (`createdAt_id`), chúng ta chỉ cần dùng trực tiếp cột `id` làm con trỏ duy nhất trên URL (`after`/`before` chứa chuỗi UUIDv7).
- Sắp xếp và so sánh theo ID là hoàn toàn đồng nhất với sắp xếp theo thời gian khởi tạo thực tế, đồng thời bảo vệ hệ thống khỏi các vấn đề sai lệch múi giờ.

### 2. Khắc phục lỗi hao hụt độ chính xác sub-millisecond

PostgreSQL lưu trữ kiểu dữ liệu `timestamp` hoặc `timestamp with time zone` với độ chính xác lên đến micro-giây (6 chữ số thập phân), trong khi JavaScript Date object chỉ hỗ trợ tối đa đến mili-giây (3 chữ số thập phân).

- Khi chuyển từ trang sau quay trở lại trang trước (`isGoingBack = true`), việc so sánh `createdAt > cursorDate` có thể bị khớp sai các bản ghi có cùng mili-giây nhưng lệch micro-giây, dẫn đến trùng lặp hoặc hiển thị thiếu số lượng bản ghi.
- Chuyển sang lọc và sắp xếp bằng chuỗi ID UUIDv7 loại bỏ hoàn toàn các so sánh thời gian dạng Date, đảm bảo tính chính xác và an toàn tuyệt đối cho ranh giới trang (page boundary).

### 3. Logic truy vấn phân trang hai chiều & Nhảy trang cực hạn

- **Đi tới (Forward Pagination - `after`):** Lấy các đơn hàng cũ hơn con trỏ:
  `id < cursorId` (sắp xếp `desc(id)`)
- **Đi lùi (Backward Pagination - `before`):** Lấy các đơn hàng mới hơn con trỏ:
  `id > cursorId` (sắp xếp `asc(id)`) và đảo ngược lại mảng kết quả trong ứng dụng.
- **Trang đầu (First Page - Reset):** Xóa toàn bộ con trỏ `after`/`before`/`last` trên URL để quay về trang đầu mặc định (mới nhất).
- **Trang cuối (Last Page - `last=true`):** Truy vấn trực tiếp các đơn hàng cũ nhất bằng cách tính toán số lượng phần tử của trang cuối (`targetLimit`) để tránh lệch ranh giới:
  - Hệ thống đếm tổng số bản ghi trong DB (`totalCount`) để tìm phần dư: `rem = totalCount % limit`.
  - Nếu phần dư bằng 0, kích thước trang cuối (`targetLimit`) là `limit`. Nếu khác 0, kích thước là `rem`.
  - Database thực hiện sắp xếp tăng dần và giới hạn `targetLimit + 1` để lấy đúng số lượng đơn hàng cũ nhất.
  - Sau đó ứng dụng đảo ngược lại để hiển thị giảm dần theo thời gian.
  - `nextCursor` được đặt là `undefined` (do không có đơn hàng nào cũ hơn trang cuối này).
  - `prevCursor` được đặt là ID của phần tử đầu tiên nếu `hasMore` (để quay lại trang cận cuối).

---

## Practical Implementation

### Giai đoạn 1: Lấy danh sách ID trang hiện tại (Core SQL Select)

Sử dụng Core Select để viết các biểu thức so sánh lớn hơn/nhỏ hơn đơn giản và an toàn kiểu tĩnh:

```typescript
// packages/database/src/services/order/order.service.ts
const isGoingBack = !!options?.before || !!options?.last;
const cursorId = options?.after ?? options?.before;

const clauses: (SQL | undefined)[] = [eq(orders.userId, userId)];

if (cursorId) {
  clauses.push(isGoingBack ? gt(orders.id, cursorId) : lt(orders.id, cursorId));
}

let targetLimit = limit;
if (options?.last) {
  const [countResult] = await this.db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, userId));
  const totalCount = Number(countResult?.count ?? 0);
  const rem = totalCount % limit;
  targetLimit = rem === 0 && totalCount > 0 ? limit : rem;
}

const orderRows = await this.db
  .select({ id: orders.id })
  .from(orders)
  .where(and(...clauses))
  .orderBy(isGoingBack ? asc(orders.id) : desc(orders.id))
  .limit(targetLimit + 1); // Truy vấn dôi ra 1 bản ghi để check hasMore
```

### Giai đoạn 2: Hydrate mối quan hệ lồng nhau & Tính toán Con trỏ mới

Nạp dữ liệu liên quan qua Relational API theo danh sách ID thu được từ Giai đoạn 1, sau đó tính toán con trỏ thông minh dựa trên việc nhảy trang đầu hay cuối:

```typescript
// Sắp xếp lại trong bộ nhớ để giữ nguyên thứ tự sắp xếp của SQL gốc
const rowsMap = new Map(hydratedRows.map((row) => [row.id, row]));
const finalOrders = orderIds
  .map((id) => rowsMap.get(id))
  .filter((row): row is (typeof hydratedRows)[number] => !!row);

let nextCursor: string | undefined;
let prevCursor: string | undefined;

if (finalOrders.length > 0) {
  const firstItem = finalOrders[0]!;
  const lastItem = finalOrders[finalOrders.length - 1]!;

  if (options?.last) {
    nextCursor = undefined;
    prevCursor = hasMore ? firstItem.id : undefined;
  } else {
    nextCursor =
      (hasMore && !isGoingBack) || isGoingBack ? lastItem.id : undefined;

    prevCursor =
      (isGoingBack && hasMore) || (!isGoingBack && options?.after)
        ? firstItem.id
        : undefined;
  }
}
```

---

## Related Notes

- Quyết định kiến trúc phân trang: [[docs/adr/0004-use-cursor-based-pagination-for-lists.md|ADR 0004]]
- Thiết kế hệ thống thanh toán: [[Database_Payment_Design]]
- Bản đồ tri thức dự án: [[000_Hyundai_MOC.md.md]]
