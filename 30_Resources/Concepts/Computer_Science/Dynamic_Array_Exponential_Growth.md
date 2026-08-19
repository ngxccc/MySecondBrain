---
tags:
  [type/concept, topic/concepts, layer/core-mechanics, topic/memory-management]
aliases:
  - Dynamic Array Exponential Growth
  - Thuật Toán Tăng Trưởng Lũy Thừa Mảng Động
  - Amortized O(1) Dynamic Array Growth
date: 2026-08-13
description: "Nguyên lý Khoa học Máy tính cốt lõi về thuật toán tăng trưởng lũy thừa của Mảng động (Dynamic Arrays) giúp đạt độ phức tạp khấu trắc Amortized O(1) thay vì O(N^2)."
---

# Dynamic Array Exponential Growth

Tài liệu này là một ghi chép Layer 1 phân tích nguyên lý Khoa học Máy tính cốt lõi về thuật toán tăng trưởng lũy thừa của Mảng động (Dynamic Arrays như C++ `std::vector`, Java `ArrayList`, Python `list`, Rust `Vec`, Go `slice`), giải thích lý do tại sao việc nhân sức chứa giúp đưa độ phức tạp của thao tác chèn cuối về mức khấu trắc Amortized $O(1)$.

## TL;DR

Nếu mảng động tăng sức chứa theo kiểu tuyến tính ($+1$ phần tử mỗi lần cấp phát), việc thêm $N$ phần tử sẽ yêu cầu $\frac{N(N+1)}{2}$ lượt copy bộ nhớ với độ phức tạp $O(N^2)$. Bằng cách áp dụng **Thuật toán Tăng trưởng Lũy thừa (Exponential Growth Algorithm)** với hệ số nhân (từ $1.25\times$ đến $2.0\times$), tổng số lần xin RAM giảm xuống $O(\log N)$ lần và đưa chi phí trung bình của mỗi thao tác `append` về **Amortized $O(1)$**.

---

## Core Concept & Rationales

### 1. Thảm Họa Tăng Trưởng Tuyến Tính ($O(N^2)$)

Trong một mảng động (Dynamic Array), khi mảng hiện tại bị đầy, trình quản lý bộ nhớ không thể mở rộng trực tiếp ô nhớ cũ nếu các ô nhớ tiếp theo trên RAM đã bị đối tượng khác chiếm giữ. Trình quản lý bộ nhớ buộc phải:

1. Cấp phát một vùng nhớ mới lớn hơn trên Heap.
2. Copy toàn bộ dữ liệu từ mảng cũ sang mảng mới.
3. Hủy bỏ mảng cũ.

Nếu mỗi lần tràn capacity, hệ thống chỉ tăng thêm 1 phần tử ($+1$):

- Phần tử 1: Copy 0 phần tử.
- Phần tử 2: Copy 1 phần tử.
- ...
- Phần tử $N$: Copy $N-1$ phần tử.

Tổng số lượt copy dữ liệu dưới RAM là:
$$T(N) = 1 + 2 + 3 + \dots + (N-1) = \frac{N(N-1)}{2} \in O(N^2)$$

Với $N = 1.000.000$, hệ thống phải thực hiện gần **500 tỷ lượt copy bộ nhớ**, khiến ứng dụng bị đóng băng hoàn toàn.

---

### 2. Nguyên Lý Khấu Trắc Amortized $O(1)$ Qua Tăng Trưởng Lũy Thừa

Bằng cách nhân sức chứa theo tỷ lệ lũy thừa (ví dụ hệ số nhân $k = 2.0$ hoặc $k = 1.5$):

- Mảng không tăng từng đơn vị mà nhân đôi sức chứa: $1 \to 2 \to 4 \to 8 \to 16 \to \dots \to 2^k$.
- Số lần phải xin RAM trên Heap giảm từ $N$ lần xuống chỉ còn $\log_k N$ lần.

#### Phân tích chi phí khấu trắc (Amortized Cost):

Tổng chi phí copy bộ nhớ để chèn $N$ phần tử là:
$$\sum_{i=0}^{\log_k N} k^i = \frac{k^{\log_k N + 1} - 1}{k - 1} \approx \frac{k \cdot N}{k - 1} \in O(N)$$

Chia trung bình chi phí cho $N$ phần tử:
$$\text{Amortized Cost per Insert} = \frac{O(N)}{N} = O(1)$$

Thao tác `append` đạt hiệu năng cực cao ở mức trung bình **Amortized $O(1)$**.

---

## Practical Implementation

Dưới đây là so sánh hệ số tăng trưởng (Growth Factor) của mảng động trên các ngôn ngữ lập trình phổ biến:

| Ngôn ngữ / Library       | Cấu trúc dữ liệu      | Growth Factor ($k$)                                     | Ghi chú thiết kế                                                    |
| :----------------------- | :-------------------- | :------------------------------------------------------ | :------------------------------------------------------------------ |
| **C++ Standard Library** | `std::vector`         | $2.0\times$ (GCC) / $1.5\times$ (MSVC)                  | MSVC dùng $1.5\times$ để tái sử dụng lại các vùng nhớ cũ trên Heap. |
| **Java**                 | `java.util.ArrayList` | $1.5\times$ (`oldCap + (oldCap >> 1)`)                  | Tối ưu cân bằng giữa RAM và tốc độ copy.                            |
| **Python**               | `PyListObject`        | $\sim 1.125\times + 6$ (`newsize + (newsize >> 3) + 6`) | Tăng trưởng mịn để tiết kiệm RAM trên hệ thống nhúng/scripting.     |
| **Rust**                 | `std::vec::Vec`       | $2.0\times$                                             | Ưu tiên tốc độ tối đa, nhân đôi capacity mỗi khi tràn.              |
| **Go**                   | `runtime.slice`       | $2.0\times$ (cap < 256) $\to 1.25\times + 192$          | Chuyển tiếp mượt (Smooth Transition) loại bỏ điểm gẫy đột ngột.     |

---

## Related Notes

- [[Stack_vs_Heap_Memory_Fundamentals]] - Phân tầng bộ nhớ Stack và Heap trong khoa học máy tính.
- [[Heap_Memory_Size_Classes_and_Alignment]] - Cơ chế phân chia ô nhớ tiêu chuẩn để tránh phân mảnh RAM.
- [[Go_Slice_Underlying_Mechanics]] - Ứng dụng thuật toán tăng trưởng mượt trên Slice của Go.
