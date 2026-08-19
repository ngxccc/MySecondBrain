---
tags: [type/concept, topic/tech, topic/database, layer/infrastructure]
date: 2026-06-07
aliases:
  [Bảng liên kết, Junction Table, Bridge Table, Join Table, Khóa chính phức hợp]
description: "Giải quyết quan hệ Nhiều-Nhiều bằng bảng liên kết và khóa chính phức hợp."
---

# Junction Table & Composite Primary Keys

## TL;DR

Bảng liên kết (Junction Table) giải quyết mối quan hệ **Nhiều-Nhiều (Many-to-Many)** trong cơ sở dữ liệu quan hệ bằng cách đứng ở giữa kết nối hai bảng chính. Sử dụng **Khóa chính phức hợp (Composite Primary Key)** trên hai cột khóa ngoại để loại bỏ trùng lặp dữ liệu ở mức vật lý mà không cần cột `id` độc lập.

## Core Concept

1. **Junction Table (Bảng liên kết)**:
   - Bản chất: Giải quyết mối quan hệ N-N. Ví dụ, một sản phẩm có thể ở nhiều nhà kho, một nhà kho có thể chứa nhiều sản phẩm. Ta tạo ra bảng ở giữa: `warehouse_stocks`.
   - Nhiệm vụ: Liên kết `product_id` và `warehouse_id`, đồng thời lưu trữ thông tin đi kèm (ví dụ: `quantity` tồn kho).

2. **Composite Primary Key (Khóa chính phức hợp)**:
   - Cách thiết lập: Không dùng UUID hay cột tự tăng (`id`) riêng lẻ. Thay vào đó, gộp chung hai khóa ngoại `(warehouse_id, product_id)` làm khóa chính.
   - Lợi ích: Ràng buộc tính duy nhất ở mức vật lý của DB. Không bao giờ cho phép xuất hiện hai hàng trùng lặp cặp khóa ngoại đó, chống Duplicate Data tuyệt đối.

## Concrete Example

```sql
CREATE TABLE warehouse_stocks (
    warehouse_id INT REFERENCES warehouses(id),
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 0,
    PRIMARY KEY (warehouse_id, product_id) -- Khóa chính phức hợp
);
```

## Related Notes

- Tổng quan thiết kế API & Dữ liệu: [[000_Tech_MOC]]
- Quy tắc đặt tên DB: [[DB_Naming]]
