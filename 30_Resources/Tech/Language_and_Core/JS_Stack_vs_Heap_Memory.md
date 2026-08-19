---
tags:
  [
    type/concept,
    topic/tech,
    layer/core-mechanics,
    topic/javascript,
    topic/memory-management,
  ]
aliases: [Stack vs Heap Memory, JS Stack vs Heap, Stack and Heap]
date: 2026-08-09
description: "Mô hình phân tầng bộ nhớ Stack (LIFO) và Heap (Dynamic Allocation) trong JavaScript."
---

# JS Stack vs Heap Memory

Tài liệu này là một ghi chép Layer 2 mô tả chi tiết cách JavaScript (V8 Engine) triển khai phân tầng bộ nhớ Stack và Heap, dựa trên nguyên lý khoa học máy tính cốt lõi của [[Stack_vs_Heap_Memory_Fundamentals]].

## TL;DR

Bộ nhớ trong JavaScript được chia làm hai vùng chính: **Stack** và **Heap**. Stack lưu trữ các kiểu dữ liệu nguyên thủy (Primitive Values) và con trỏ tham chiếu (Reference Pointers) với cơ chế LIFO tĩnh ở cấp độ phần cứng. Heap lưu trữ các cấu trúc dữ liệu động có kích thước không cố định như Object, Array và Closure. Đăng ký và giải phóng bộ nhớ Stack xảy ra tự động khi kết thúc Stack Frame, trong khi bộ nhớ Heap cần được dọn dẹp bởi Garbage Collector [[JS_Generational_Garbage_Collection]] để phòng ngừa hiện tượng rò rỉ bộ nhớ [[JS_Memory_Leaks_and_Mitigation]].

---

## Core Concept

### 1. Stack Memory

- **Đặc điểm:** Lưu trữ các kiểu dữ liệu nguyên thủy (Number, String, Boolean, null, undefined, Symbol, BigInt) và con trỏ tham chiếu (Reference Pointers) trỏ đến vị trí bộ nhớ trên Heap.
- **Cơ chế hoạt động:** Gán trực tiếp giá trị vào ô nhớ. Khi một hàm được thực thi, một Stack Frame (khung ngăn xếp) chứa ngữ cảnh thực thi (Execution Context) và biến cục bộ được đẩy vào Stack. Khi hàm kết thúc, toàn bộ Stack Frame được thu hồi lập tức ở cấp độ CPU mà không tốn chi phí rác.

### 2. Heap Memory

- **Đặc điểm:** Lưu trữ các đối tượng phức tạp có thể thay đổi kích thước linh hoạt trong runtime (Object, Array, Function, Closure).
- **Cơ chế hoạt động:** Hệ thống cấp phát vùng nhớ trống trên Heap và trả về một địa chỉ ô nhớ. Biến khai báo trên Stack chỉ lưu trữ địa chỉ con trỏ này. Do bộ nhớ Heap cấp phát động, nó không tự động hủy khi hàm kết thúc mà cần bộ dọn rác [[JS_Generational_Garbage_Collection]] quét qua để giải phóng các vùng nhớ không còn truy cập được, tránh nguy cơ phát sinh [[JS_Memory_Leaks_and_Mitigation]].

---

## Practical Implementation

### So sánh Đặc tính Kỹ thuật giữa Stack và Heap

| Tiêu chí               | Stack Memory                         | Heap Memory                                 |
| :--------------------- | :----------------------------------- | :------------------------------------------ |
| **Loại dữ liệu**       | Primitives & Con trỏ tham chiếu      | Objects, Arrays, Functions, Closures        |
| **Kích thước**         | Nhỏ, cố định tại thời điểm cấp phát  | Lớn, linh hoạt phình to ở runtime           |
| **Tốc độ truy cập**    | Cực nhanh (LIFO phần cứng CPU)       | Chậm hơn (phải tra cứu qua địa chỉ con trỏ) |
| **Quản lý giải phóng** | Tự động hủy khi Stack Frame kết thúc | Không đồng bộ bởi Garbage Collector         |

---

## Related Notes

- [[Stack_vs_Heap_Memory_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về phân tầng bộ nhớ Stack và Heap.
- [[Garbage_Collection_Fundamentals]] - Nguyên lý cốt lõi về cơ chế dọn rác bộ nhớ tự động.
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nền tảng.
- [[JS_Generational_Garbage_Collection]]
- [[JS_Memory_Leaks_and_Mitigation]]
- [[JS_Runtimes_Bun_vs_NodeJS]]
- [[000_Tech_MOC]]
