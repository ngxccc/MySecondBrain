---
tags:
  [type/concept, topic/concepts, layer/core-mechanics, topic/memory-management]
aliases:
  [Garbage Collection Fundamentals, Cơ chế Dọn rác Bộ nhớ Gốc, GC Fundamentals]
date: 2026-08-09
description: "Nguyên lý khoa học máy tính cốt lõi của Garbage Collection: Lisp 1959, Reference Counting vs Tracing GC, Generational Hypothesis và Tri-color Marking."
---

# Garbage Collection Fundamentals

## TL;DR

Garbage Collection (GC) là cơ chế quản lý bộ nhớ tự động được sáng chế bởi John McCarthy vào năm 1959 cho ngôn ngữ Lisp. GC giải phóng nhà phát triển khỏi việc gọi `malloc`/`free` thủ công bằng cách tự động thu hồi các ô nhớ không còn truy cập được trên Heap. Hai họ thuật toán chính bao gồm **Reference Counting** (Đếm tham chiếu) và **Tracing GC** (Duyệt đồ thị đối tượng từ GC Roots). Hiểu rõ các nguyên lý tổng quát như Generational Hypothesis, Stop-the-World pauses và Tri-color Marking là nền tảng để đánh giá cơ chế GC của bất kỳ ngôn ngữ nào (Java, Go, C#, Python, JavaScript).

---

## Core Concept

### 1. Lịch sử & Mục đích Cốt lõi

- **Nguồn gốc:** Sáng chế năm 1959 bởi John McCarthy trong ngôn ngữ Lisp, đi trước JavaScript (1995) 36 năm.
- **Vấn đề giải quyết:** Loại bỏ lỗi Memory Leak (quên giải phóng) và Dangling Pointers (dùng ô nhớ đã giải phóng) trong lập trình thủ công (như C/C++).
- **Chi phí đánh đổi:** Tiêu tốn CPU runtime để quét bộ nhớ và gây ra các khoảng tạm dừng ứng dụng (Stop-the-World pauses).

### 2. Hai Họ Thuật toán Quản lý Bộ nhớ Tự động Cốt lõi

1. **Reference Counting (Đếm tham chiếu):**
   - Đếm số lượng con trỏ đang trỏ đến mỗi đối tượng. Khi số đếm về 0, giải phóng ô nhớ lập tức.
   - _Ưu điểm:_ Giải phóng ngay lập tức, không Stop-the-World.
   - _Nhược điểm:_ Không tự giải phóng được các tham chiếu vòng (Circular References) nếu không có bộ quét hỗ trợ.
2. **Tracing GC (Duyệt đồ thị tham chiếu):**
   - Bắt đầu từ các điểm gốc **GC Roots** (biến toàn cục, Stack Frames, registers), duyệt qua đồ thị tham chiếu để đánh dấu các đối tượng reachable. Giải phóng toàn bộ đối tượng unreachable.
   - _Thuật toán tiêu biểu:_ Mark-Sweep, Mark-Compact, Copying Collector.

### 3. Các Nguyên lý Tối ưu Hóa GC Nâng cao

- **Generational Hypothesis (Giả thuyết thế hệ):** Hầu hết các đối tượng đều "chết trẻ". Bộ nhớ được chia làm Young Generation (dùng thuật toán Copying nhanh) và Old Generation (dùng thuật toán Mark-Sweep-Compact).
- **Tri-color Marking (Đánh dấu ba màu):** Phân loại đối tượng thành Trắng (chưa duyệt/rác), Xám (đang duyệt) và Đen (đã duyệt và sống). Thuật toán này cho phép GC chạy song song (Concurrent) với luồng chương trình chính.

---

## Practical Implementation

### So sánh Chiến lược GC giữa các Ngôn ngữ & Engine

| Ngôn ngữ / Runtime         | Cơ chế GC áp dụng                    | Đặc điểm nổi bật                                                                      |
| :------------------------- | :----------------------------------- | :------------------------------------------------------------------------------------ |
| **Java (JVM G1GC/ZGC)**    | Generational Tracing GC              | Chia Region, tối ưu Stop-the-World cực nhỏ cho ứng dụng dung lượng RAM lớn.           |
| **JavaScript (V8 Engine)** | Generational Tracing GC (Orinoco)    | New Space (Scavenger) + Old Space (Mark-Sweep-Compact), Incremental Marking.          |
| **Go (Go Runtime)**        | Concurrent Tri-color Mark-Sweep      | Không phân thế hệ (Non-generational), ưu tiên Latency thấp trên microservices.        |
| **Python (CPython)**       | Reference Counting + Generational GC | Dùng Reference Counting chính, kết hợp Generational GC để xử lý tham chiếu vòng.      |
| **Rust (Rustc)**           | No GC (Ownership & Lifetimes)        | Biên dịch tự động chèn code giải phóng bộ nhớ tại compile-time, không tốn chi phí GC. |

---

## Related Notes

- [[Memory_Leaks_Core_Mechanics]]
- [[Stack_vs_Heap_Memory_Fundamentals]]
- [[JS_Generational_Garbage_Collection]]
- [[JS_Memory_Leaks_and_Mitigation]]
- [[000_Concepts_MOC]]
