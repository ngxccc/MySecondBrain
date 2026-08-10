---
tags:
  [
    type/concept,
    topic/concepts,
    layer/core-mechanics,
    domain/computer-science,
    system/memory,
  ]
aliases:
  [
    Memory Leaks Core Mechanics,
    Rò rỉ Bộ nhớ Nguyên lý Gốc,
    Memory Leak Fundamentals,
  ]
date: 2026-08-09
description: "Nguyên lý khoa học máy tính cốt lõi của Memory Leak: Khái niệm Unreachable vs Unintended Retention từ GC Roots trên môi trường Unmanaged và Managed."
---

# Memory Leaks Core Mechanics

## TL;DR

Memory Leak (rò rỉ bộ nhớ) là hiện tượng bộ nhớ đã cấp phát trên Heap không còn được sử dụng trong logic nghiệp vụ nhưng hệ thống không thể thu hồi. Trong môi trường **Unmanaged** (C/C++), rò rỉ xảy ra khi lập trình viên quên gọi hàm giải phóng (`free`/`delete`). Trong môi trường **Managed** (Java, Go, C#, JavaScript), rò rỉ xảy ra khi đối tượng rác vẫn vô tình bị giữ lại trong đồ thị tham chiếu bắt nguồn từ **GC Roots**, khiến bộ dọn rác (Garbage Collector) coi nó là "còn khả năng truy cập" (Reachable).

---

## Core Concept

### 1. Phân biệt Bản chất Rò rỉ Bộ nhớ theo Môi trường Runtime

1. **Môi trường Unmanaged Memory (C, C++, Assembly):**
   - **Nguyên nhân:** Địa chỉ con trỏ trỏ đến ô nhớ trên Heap bị ghi đè hoặc biến scope bị hủy mà không gọi lệnh thu hồi bộ nhớ.
   - **Hậu quả:** Ô nhớ đó bị thất lạc vĩnh viễn trên RAM cho đến khi process bị dừng.

2. **Môi trường Managed Memory (Java, Go, C#, JavaScript, Python):**
   - **Nguyên nhân:** Đối tượng không còn dùng nữa nhưng vẫn bị giữ tham chiếu (Unintended Retention) bởi một đối tượng sống lâu hơn nằm trong đồ thị **GC Roots** (ví dụ: Biến toàn cục, Cache không dọn dẹp, Event Listener/Subscription treo).
   - **Hậu quả:** GC duyệt đồ thị thấy đối tượng vẫn Reachable nên không thể tiến hành giải phóng ô nhớ.

### 2. Các Khái niệm Đo lường Bộ nhớ Cốt lõi

- **Shallow Size:** Dung lượng bộ nhớ mà chính bản thân đối tượng đó chiếm giữ (không tính các đối tượng mà nó trỏ tới).
- **Retained Size:** Dung lượng bộ nhớ sẽ được giải phóng nếu đối tượng đó bị hủy (bao gồm chính nó và toàn bộ cây đối tượng phụ thuộc chỉ do nó trỏ tới).
- **GC Roots:** Điểm gốc của đồ thị tham chiếu bộ nhớ, bao gồm biến toàn cục (Global Variables), ngữ cảnh ngăn xếp hiện tại (Stack Frames), và các tham chiếu native của CPU/Runtime.

---

## Practical Implementation

### Các Pattern Gây Rò rỉ Bộ nhớ Kinh điển Trong Lập trình

| Pattern gây rò rỉ                  | Bản chất kỹ thuật                                                                            | Giải pháp phòng ngừa tổng quát                                                      |
| :--------------------------------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **Unbounded Cache**                | Lưu trữ đối tượng vào Map/Array toàn cục mà không có cơ chế dọn dẹp (TTL / Eviction Policy). | Dùng WeakReference / `WeakMap` / `WeakSet` hoặc triển khai LRU Cache.               |
| **Dangling Listeners / Observers** | Đăng ký Event Listener / Publisher-Subscriber nhưng quên hủy đăng ký (Unsubscribe).          | Luôn triển khai hàm Cleanup/Dispose để gỡ bỏ Event Listener khi Lifecycle kết thúc. |
| **Long-Lived Closures**            | Closure giữ tham chiếu đến ngữ cảnh lexical chứa các biến kích thước lớn.                    | Gán `null` cho các biến rác dung lượng lớn sau khi sử dụng xong.                    |

---

## Related Notes

- [[Garbage_Collection_Fundamentals]]
- [[Stack_vs_Heap_Memory_Fundamentals]]
- [[JS_Memory_Leaks_and_Mitigation]]
- [[000_Concepts_MOC]]
