---
tags:
  [
    type/concept,
    topic/tech,
    layer/core-mechanics,
    engine/v8,
    language/javascript,
    system/memory,
  ]
aliases: [Generational Garbage Collection, V8 GC Orinoco, Minor and Major GC]
date: 2026-08-09
description: "Cơ chế dọn rác phân thế hệ (Generational GC) trong V8 Engine gồm Scavenger và Mark-Sweep-Compact."
---

# JS Generational Garbage Collection

Tài liệu này là một ghi chép Layer 2 mô tả chi tiết cách JavaScript (V8 Engine) triển khai cơ chế dọn rác phân thế hệ (Generational Garbage Collection), dựa trên nguyên lý khoa học máy tính cốt lõi của [[Garbage_Collection_Fundamentals]].

## TL;DR

Garbage Collector (GC) trong JavaScript Engine (như V8 Orinoco) áp dụng **Giả thuyết thế hệ (Generational Hypothesis)**: phần lớn các đối tượng đều chết trẻ. Vùng nhớ [[JS_Stack_vs_Heap_Memory|Heap]] được chia thành **New Space** (chứa đối tượng mới, dùng thuật toán Scavenger) và **Old Space** (chứa đối tượng sống lâu, dùng thuật toán Mark-Sweep-Compact). Cơ chế phân chia này giúp thu hồi các vùng nhớ không còn truy cập được để chống [[JS_Memory_Leaks_and_Mitigation|rò rỉ bộ nhớ]] trên các runtime hiện đại như [[JS_Runtimes_Bun_vs_NodeJS|Node.js và Bun]].

---

## Core Concept

### 1. Phân vùng New Space

- **Kích thước:** Nhỏ (1MB đến 64MB), lưu giữ các đối tượng vừa tạo.
- **Thuật toán:** Dùng **Scavenger** (Copying Collector) chia đôi vùng nhớ thành _From-Space_ và _To-Space_.
- **Hoạt động:** Khi chạy Minor GC, V8 quét các đối tượng sống ở _From-Space_ và chép sang _To-Space_. Sau 2 chu kỳ sống sót, đối tượng được thăng cấp (promote) lên Old Space. Quá trình di chuyển này giải quyết triệt để rủi ro phân mảnh bộ nhớ.

### 2. Phân vùng Old Space

- **Kích thước:** Lớn, chứa đối tượng sống qua nhiều chu kỳ Minor GC hoặc đối tượng có kích thước siêu lớn.
- **Thuật toán:** Dùng **Mark-Sweep-Compact** (Major GC).
  - **Marking:** Quét đồ thị đối tượng từ GC Roots (Global Variables, Stack Frames) để gắn nhãn đối tượng còn khả năng truy cập (reachable).
  - **Sweeping:** Giải phóng các ô nhớ chứa đối tượng không thể truy cập (unreachable).
  - **Compacting:** Dồn dập các vùng nhớ còn sống lại gần nhau để tối ưu không gian trống liên tục.

---

## Practical Implementation

### Kỹ thuật Tối ưu Hóa Orinoco trong V8

- **Incremental Marking:** Chia nhỏ quá trình đánh dấu thành các bước ngắn xen kẽ với luồng thực thi JavaScript chính, tránh đóng băng giao diện người dùng hoặc nghẽn server.
- **Concurrent & Parallel GC:** Chuyển các tác vụ quét và nén bộ nhớ sang các Worker Threads chạy ngầm song song với main thread.

---

## Related Notes

- [[Garbage_Collection_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về cơ chế dọn rác tự động.
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nền tảng.
- [[Stack_vs_Heap_Memory_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về phân tầng bộ nhớ Stack và Heap.
- [[JS_Stack_vs_Heap_Memory]]
- [[JS_Memory_Leaks_and_Mitigation]]
- [[JS_Runtimes_Bun_vs_NodeJS]]
- [[000_Tech_MOC]]
