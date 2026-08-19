---
tags:
  [type/concept, topic/concepts, layer/core-mechanics, topic/memory-management]
aliases:
  - Heap Memory Size Classes and Alignment
  - Ô Nhớ Tiêu Chuẩn Heap Allocator
  - Memory Alignment and Size Classes
date: 2026-08-13
description: "Nguyên lý Khoa học Máy tính cốt lõi về cơ chế phân chia Size Classes và Memory Alignment của Heap Allocator giúp triệt tiêu hiện tượng External Memory Fragmentation."
---

# Heap Memory Size Classes and Alignment

Tài liệu này là một ghi chép Layer 1 phân tích nguyên lý Khoa học Máy tính cốt lõi về cách các trình cấp phát bộ nhớ Heap (Heap Allocators như TCMalloc, jemalloc, glibc malloc, Go Heap Allocator) phân chia RAM thành các **Size Classes** tiêu chuẩn để phòng chống hiện tượng **Rò rỉ mảnh bộ nhớ ngoài (External Memory Fragmentation)**.

## TL;DR

Nếu Heap Allocator cấp phát RAM theo đúng từng số byte lẻ ngẫu nhiên do chương trình yêu cầu (ví dụ 17B, 53B, 103B), bộ nhớ RAM sẽ nhanh chóng bị băm nhỏ thành vô số lỗ hổng vụn vặt không thể tái sử dụng. Bằng cách định nghĩa trước danh sách **Size Classes tiêu chuẩn** (ví dụ 8B, 16B, 24B, 32B, 48B, 64B... 32KB) và làm tròn kích thước yêu cầu lên ô nhớ tiêu chuẩn gần nhất (**Memory Alignment / Size Class Roundup**), hệ thống triệt tiêu phân mảnh bộ nhớ và tối ưu tốc độ quản lý RAM.

---

## Core Concept & Rationales

### 1. Phân Mảnh Bộ Nhớ Ngoài (External Memory Fragmentation)

Khi một ứng dụng chạy liên tục và xin cấp phát / giải phóng các vùng nhớ có kích thước ngẫu nhiên trên Heap:

- Vùng nhớ 17 bytes được cấp phát, sau đó bị hủy -> Tạo ra lỗ hổng 17 bytes.
- Vùng nhớ 53 bytes được cấp phát, sau đó bị hủy -> Tạo ra lỗ hổng 53 bytes.

Mặc dù tổng số RAM trống trên hệ thống còn rất nhiều (ví dụ 10MB), nhưng nếu ứng dụng cần xin một khối bộ nhớ liên tục 100 bytes, Heap Allocator **không thể tìm thấy một lỗ hổng liên tục nào đủ 100 bytes**. Kết quả: Hệ thống báo lỗi hết bộ nhớ (Out of Memory) hoặc phải tốn CPU dồn đống bộ nhớ (Memory Compaction).

---

### 2. Nguyên Lý Size Classes & Memory Alignment

Để giải quyết vấn đề phân mảnh bộ nhớ, các trình cấp phát bộ nhớ hiện đại (dựa trên kiến trúc TCMalloc của Google):

1. **Định nghĩa sẵn các Size Classes cố định**:
   Heap Allocator chia bộ nhớ thành các bảng kích thước chuẩn (Span Classes), ví dụ:
   `8B, 16B, 24B, 32B, 48B, 64B, 80B, 96B, 112B, 128B, 256B, ...`

2. **Làm tròn dung lượng (Size Class Roundup)**:
   Khi ứng dụng yêu cầu cấp phát $N$ bytes:
   - Trình cấp phát không cấp phát đúng $N$ bytes.
   - Trình cấp phát gọi hàm làm tròn `roundupsize(N)` để tìm ô nhớ tiêu chuẩn $M \ge N$ nhỏ nhất trong bảng Size Classes.
   - Gán nguyên khối $M$ bytes đó cho ứng dụng.

3. **Đánh đổi Kỹ thuật (Engineering Trade-off)**:
   - **Tốn một lượng nhỏ RAM thừa bên trong (Internal Fragmentation)**: Ví dụ cần 104B nhưng nhận 112B (thừa 8B).
   - **Triệt tiêu hoàn toàn phân mảnh bên ngoài (External Fragmentation)**: Mọi ô nhớ bị hủy đều rơi đúng vào các Size Class tiêu chuẩn, sẵn sàng được tái sử dụng ngay lập tức cho các yêu cầu tiếp theo.

---

## Practical Implementation

Dưới đây là bảng minh họa cơ chế Roundup Size khi cấp phát mảng trên Heap trong Go Runtime (`src/runtime/sizeclasses.go`):

| Bytes yêu cầu gốc ($N$) | Size Class gần nhất được làm tròn ($M$) | Bytes thừa cho ứng dụng | Phần tử `int` (8B) khả dụng |
| :---------------------- | :-------------------------------------- | :---------------------- | :-------------------------- |
| 17 bytes                | 24 bytes                                | +7 bytes                | 3 phần tử (thay vì 2.125)   |
| 50 bytes                | 64 bytes                                | +14 bytes               | 8 phần tử (thay vì 6.25)    |
| 104 bytes               | 112 bytes                               | +8 bytes                | 14 phần tử (thay vì 13)     |
| 1000 bytes              | 1024 bytes                              | +24 bytes               | 128 phần tử (thay vì 125)   |

---

## Related Notes

- [[Stack_vs_Heap_Memory_Fundamentals]] - Phân tầng bộ nhớ Stack và Heap.
- [[Dynamic_Array_Exponential_Growth]] - Thuật toán tăng trưởng lũy thừa mảng động.
- [[Go_Slice_Underlying_Mechanics]] - Ứng dụng `runtime.roundupsize` trong Slice của Go.
