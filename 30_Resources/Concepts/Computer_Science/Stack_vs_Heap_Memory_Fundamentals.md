---
tags:
  [type/concept, topic/concepts, layer/core-mechanics, topic/memory-management]
aliases:
  [
    Stack vs Heap Memory Fundamentals,
    Phân tầng Bộ nhớ Stack Heap Nguyên lý Gốc,
    Stack and Heap CS,
  ]
date: 2026-08-09
description: "Nguyên lý khoa học máy tính cốt lõi của bộ nhớ Stack (LIFO, CPU Stack Pointer) và Heap (Dynamic Memory Allocation, OS Virtual Memory)."
---

# Stack vs Heap Memory Fundamentals

## TL;DR

Stack và Heap là hai mô hình quản lý bộ nhớ RAM cơ bản ở cấp độ Hệ điều hành (OS) và Phần cứng CPU. **Stack** hoạt động theo cơ chế LIFO (Last In, First Out) được quản lý trực tiếp bởi thanh ghi CPU Stack Pointer, chuyên lưu trữ ngữ cảnh thực thi hàm và các dữ liệu cố định kích thước với tốc độ truy cập tối đa. **Heap** là vùng nhớ cấp phát động có dung lượng lớn, quản lý bởi OS Virtual Memory Manager hoặc Runtime Memory Allocator, dùng để lưu trữ các đối tượng có kích thước linh hoạt và tuổi thọ kéo dài ngoài phạm vi một hàm.

---

## Core Concept

### 1. Phân tầng Bộ nhớ ở Cấp độ Hệ thống (OS & CPU)

- **Stack Memory (Cấu trúc Ngăn xếp):**
  - **Cơ chế:** Quản lý bằng thanh ghi CPU (`RSP`/`ESP` trên x86/x64). Khi gọi một hàm, CPU đẩy một **Stack Frame** chứa địa chỉ trả về (Return Address), tham số và biến cục bộ vào Stack. Khi hàm kết thúc, CPU chỉ cần di chuyển con trỏ Stack Pointer lùi lại, giải phóng toàn bộ ô nhớ trong 1 chu kỳ xung nhịp (O(1)).
  - **Đặc điểm:** Tốc độ cực nhanh, địa chỉ liên tục (Contiguous), dung lượng bị giới hạn (thường từ 1MB đến 8MB tùy OS). Tràn Stack gây ra lỗi **Stack Overflow**.

- **Heap Memory (Vùng nhớ Cấp phát Động):**
  - **Cơ chế:** Được quản lý bởi trình cấp phát bộ nhớ (Memory Allocator như `malloc`, `jemalloc`, `mimalloc` hoặc GC Engine). Hệ thống tìm kiếm các khoảng không gian trống trên RAM ảo (Virtual Memory) để cấp phát.
  - **Đặc điểm:** Tốc độ chậm hơn do phải tra cứu bảng phân bổ bộ nhớ (Free List / Page Tables), địa chỉ không phân tán liên tục, dễ phân mảnh (Fragmentation), dung lượng chỉ bị giới hạn bởi RAM vật lý và Swap space.

---

## Practical Implementation

### So sánh Đặc tính Khoa học Máy tính giữa Stack và Heap

| Tiêu chí                   | Stack Memory                     | Heap Memory                                        |
| :------------------------- | :------------------------------- | :------------------------------------------------- |
| **Quản lý cấp phát**       | CPU phần cứng (Stack Pointer)    | OS Memory Allocator / Runtime GC                   |
| **Tốc độ truy cập**        | Tối đa (LIFO, CPU Cache Hit cao) | Chậm hơn (Tra cứu con trỏ pointer)                 |
| **Cấu trúc dữ liệu**       | Ngăn xếp tuyến tính liên tục     | Đồ thị/Cây phân mảnh động                          |
| **Tuổi thọ dữ liệu**       | Gắn liền với Scope của hàm       | Linh hoạt (kéo dài cho đến khi giải phóng/dọn rác) |
| **Lỗi hệ thống tiêu biểu** | Stack Overflow (Lặp vô tận)      | Out of Memory (OOM) / Memory Leaks                 |

---

## Related Notes

- [[Garbage_Collection_Fundamentals]]
- [[Memory_Leaks_Core_Mechanics]]
- [[JS_Stack_vs_Heap_Memory]]
- [[Go_Escape_Analysis_Mechanics]]
- [[000_Concepts_MOC]]
