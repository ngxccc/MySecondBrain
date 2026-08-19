---
tags: [type/concept, topic/tech, layer/core-mechanics, topic/database]
date: 2026-06-09
aliases: [Index và B+Tree, B+Tree Index, B-Tree vs B+Tree]
description: "Bản chất của Index, cấu trúc B+Tree và lý do tại sao Disk I/O quyết định kiến trúc Database."
---

# Index và B+Tree

## TL;DR

Index là cấu trúc dữ liệu phụ trợ giúp database chuyển đổi từ duyệt tuần tự Full Table Scan $O(N)$ sang tìm kiếm cây phân cấp $O(\log N)$. Cấu trúc **B+Tree** được thiết kế để tối ưu hóa hiệu năng trên ổ cứng nhờ mở rộng độ rộng của cây (fan-out) nhằm giảm tối đa số lần Disk I/O, đồng thời sử dụng Doubly Linked List để liên kết các Leaf Node nhằm tối ưu hóa các truy vấn khoảng (Range Queries).

---

## Core Concept

### 1. Tại sao nó tồn tại?

- **Disk I/O Bottleneck**: Tốc độ đọc/ghi từ ổ đĩa vật lý (HDD/SSD) chậm hơn RAM hàng ngàn đến hàng triệu lần.
- **Đơn vị đọc ghi dạng Page**: Ổ cứng không đọc từng byte riêng lẻ mà đọc theo khối (Block/Page), thường từ 4KB đến 16KB.
- **Hạn chế của Full Table Scan**: Nếu không có chỉ mục, database buộc phải duyệt từ đầu đến cuối toàn bộ bảng, nạp hàng loạt các pages vào RAM, làm sụt giảm nghiêm trọng hiệu năng hệ thống khi lượng dữ liệu lớn.

### 2. Giải quyết bài toán gì?

- Tìm kiếm cực nhanh với số lần Disk I/O tối thiểu (chỉ cần đọc 3-4 pages là định vị được hàng dữ liệu trong số hàng trăm triệu dòng).
- Hỗ trợ sắp xếp (`ORDER BY`) và lọc khoảng (`BETWEEN`, `>`, `<`) hiệu quả mà không cần quét lại toàn bộ cây hoặc sắp xếp trong RAM.

### 3. Sự tiến hóa & Thay thế cấu trúc cũ

- **Thay thế Binary Search Tree (BST)**: BST có độ phức tạp lý thuyết là $O(\log_2 N)$. Tuy nhiên, trên ổ cứng, do mỗi node trong BST chỉ chứa đúng 1 key nên chiều cao cây rất lớn. Việc đi xuống mỗi node tương ứng với 1 lần đọc Page mới $\rightarrow$ lãng phí 99.9% dung lượng của Page 4KB/16KB đã nạp và phát sinh quá nhiều Disk I/O.
- **Thay thế Sorted Array**: Sorted Array cho phép tìm kiếm nhị phân cực nhanh ($O(\log N)$) nhưng chi phí ghi dữ liệu (`INSERT`/`DELETE`) có độ phức tạp lên tới $O(N)$ vì phải dịch chuyển toàn bộ phần tử phía sau trên đĩa.
- **B+Tree là giải pháp kết hợp**: Chia mảng sắp xếp thành các Page nhỏ độc lập (Leaf Nodes) nối với nhau qua Linked List để thao tác Insert/Delete diễn ra cục bộ ($O(\log N)$), đồng thời dựng thêm các tầng chỉ dẫn phía trên (Internal Nodes) để tìm kiếm nhanh.

### 4. Cơ chế hoạt động

Cấu trúc B+Tree phân cấp thành 3 loại Node chính:

1. **Root Node**: Nút gốc cao nhất, thường được nạp và giữ cố định trên RAM do tần suất truy cập liên tục.
2. **Internal Nodes (Nút chỉ mục trung gian)**:
   - Chỉ chứa **Key chỉ mục** và con trỏ trỏ tới các nút cấp dưới.
   - **KHÔNG chứa dữ liệu thực tế (Data/ROWID)**. Nhờ đó, mỗi nút internal có thể nhét được hàng ngàn Key (Fan-out lớn), giúp giảm chiều cao của toàn bộ cây chỉ còn 3 đến 4 tầng đối với hàng trăm triệu bản ghi.
3. **Leaf Nodes (Nút lá)**:
   - Nơi lưu trữ **Key đã sắp xếp** cùng với **ROWID / ctid / Pointer** trỏ về vị trí hàng dữ liệu gốc trên đĩa.

---

## Practical Implementation

### Trade-offs

- **Tốn Disk Space**: Tốn thêm dung lượng ổ đĩa để lưu trữ các tệp chỉ mục riêng biệt.
- **Tác động tiêu cực lên DML**: Làm giảm tốc độ các câu lệnh ghi (`INSERT`, `UPDATE`, `DELETE`) do database buộc phải tái cấu trúc và phân tách các page (Page Split) trên cây B+Tree tương ứng mỗi lần dữ liệu biến động.

### Drizzle ORM Schema Indexing Example

Minh họa khai báo Index tối ưu trong Drizzle ORM cho trường hợp sử dụng biểu thức chuyển đổi kiểu từ JSONB:

```typescript
// packages/database/src/schemas/product.schema.ts
export const products = snakeCase.table(
  "product",
  {
    id: uuid().primaryKey(),
    specs: jsonb().$type<TProductSpecs>().default({}),
  },
  (table) => [
    // Index optimized for dynamic fields inside JSONB specs column using case expression and regex cast
    index("product_power_idx").on(
      sql`(CASE WHEN ${table.specs}->>'power' ~ '^\\s*\\d+(\\.\\d+)?\\s*$' THEN (${table.specs}->>'power')::numeric ELSE NULL END)`,
    ),
  ],
);
```

---

**Related Notes:**

- [[000_Tech_MOC]]
- [[Database_Indexing_Guidelines]]
