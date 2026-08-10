---
tags:
  - layer/core-mechanics
  - type/concept
  - topic/go
  - topic/memory-management
date: 2026-08-05
aliases:
  - Bản Chất Của Slice Trong Go
  - Go Slice Mechanics
  - Slice Header Architecture
description: "Slice trong Go không lưu trữ dữ liệu trực tiếp mà đóng vai trò như một cấu trúc Slice Header 24-byte (gồm con trỏ `ptr`, độ dài `len`, và sức chứa `cap`) trỏ vào một Mảng ngầm bên dưới (Underlying ..."
---

# Go Slice Underlying Mechanics

Tài liệu này là một ghi chép Layer 2 phân tích cấu trúc hoạt động bên dưới của Slice trong Go (Slice Header, Underlying Array, và Memory Reallocation), dựa trên nguyên lý khoa học máy tính cốt lõi về quản lý bộ nhớ Stack và Heap của [[Stack_vs_Heap_Memory_Fundamentals]], đồng thời liên quan trực tiếp đến cơ chế dọn rác của [[Garbage_Collection_Fundamentals]].

## TL;DR

Slice trong Go không lưu trữ dữ liệu trực tiếp mà đóng vai trò như một cấu trúc **Slice Header 24-byte** (gồm con trỏ `ptr`, độ dài `len`, và sức chứa `cap`) trỏ vào một **Mảng ngầm bên dưới (Underlying Array)** trong RAM. Việc chỉnh sửa dữ liệu thông qua Slice thực chất là biến đổi trực tiếp trên thanh RAM của mảng gốc, khiến mọi Slice khác cùng tham chiếu bị ảnh hưởng (Side Effect), cho đến khi hành động `append()` làm tràn `cap` buộc Go phải thực hiện cấp phát lại bộ nhớ (Memory Reallocation) sang mảng mới.

---

## Core Concept & Rationales

### 1. Cấu Trúc Slice Header

Trên hệ thống 64-bit, một Slice thực chất chỉ chiếm **24 bytes** bộ nhớ trên Stack dưới dạng một cấu trúc `struct`:

```go
type SliceHeader struct {
    Data uintptr // ptr: Con trỏ địa chỉ ô nhớ RAM của phần tử đầu tiên (8 bytes)
    Len  int     // len: Số lượng phần tử hiện tại được phép đọc/ghi (8 bytes)
    Cap  int     // cap: Sức chứa tối đa tính từ ptr đến hết mảng gốc (8 bytes)
}
```

- **`ptr` (Pointer)**: Xác định vị trí "cửa sổ" Slice bắt đầu mở ra ở đâu trong mảng ngầm.
- **`len` (Length)**: Giới hạn đọc/ghi an toàn. Truy cập ngoài chỉ số `len` sẽ kích hoạt `panic: index out of range`.
- **`cap` (Capacity)**: Sức chứa tối đa trước khi phải cấp phát lại bộ nhớ.

---

### 2. Mảng Ngầm & Tính Chất Tham Chiếu

- **Không tự chứa dữ liệu**: Slice chỉ mô tả một phân đoạn của mảng ngầm liên tục (Contiguous Memory Block).
- **Truyền tham trị nhưng mang hiệu ứng tham chiếu**: Khi truyền Slice vào hàm, Go chỉ sao chép 24-byte header. Do `ptr` vẫn trỏ tới cùng địa chỉ mảng gốc, các chỉnh sửa phần tử bên trong hàm sẽ **thay đổi mảng gốc trực tiếp** (Mutate underlying array).
- **Side Effects**: Nếu hai hoặc nhiều Slice (`sliceA`, `sliceB`) cùng tham chiếu vào một ô bộ nhớ chung, thay đổi ở `sliceA` sẽ lập tức xuất hiện ở `sliceB`.

---

### 3. Cơ Chế Tăng Trưởng

Khi gọi `append(slice, val)`:

1. **Trường hợp `len < cap`**: Go ghi phần tử mới vào ô trống tiếp theo của mảng gốc có sẵn mà không cấp phát lại bộ nhớ (**Zero Allocation**).
2. **Trường hợp `len == cap`**: Mảng gốc đã đầy. Go tự động thực hiện **Memory Reallocation**:
   - Tạo một mảng mới lớn hơn (thường gấp đôi dung lượng `cap` cũ).
   - Sao chép toàn bộ phần tử cũ sang mảng mới.
   - Cập nhật `ptr` của Slice mới trỏ sang mảng mới.
   - **Tách đứt liên kết**: Từ thời điểm này, Slice mới không còn chia sẻ mảng gốc với các Slice cũ nữa!

---

## Practical Implementation

Dưới đây là ví dụ mã nguồn minh họa 3 trạng thái cốt lõi: Shared Memory Mutation, Slice Header Fields, và Memory Reallocation sau `append()`:

```go
package main

import (
	"fmt"
	"unsafe"
)

func main() {
	// 1. Khởi tạo mảng gốc và sliceA
	array := [5]int{10, 20, 30, 40, 50}
	sliceA := array[0:3] // len: 3, cap: 5 [10, 20, 30]
	sliceB := array[1:4] // len: 3, cap: 4 [20, 30, 40]

	fmt.Printf("sliceA: %v, len: %d, cap: %d\n", sliceA, len(sliceA), cap(sliceA))
	fmt.Printf("sliceB: %v, len: %d, cap: %d\n", sliceB, len(sliceB), cap(sliceB))

	// 2. Mutate dữ liệu qua sliceA -> Ản hưởng mảng gốc và sliceB
	sliceA[1] = 99
	fmt.Println("\n--- After Mutating sliceA[1] = 99 ---")
	fmt.Printf("Array gốc: %v\n", array)   // [10 99 30 40 50]
	fmt.Printf("sliceB thấy: %v\n", sliceB) // [99 30 40]

	// 3. Append khi len == cap -> Kích hoạt Memory Reallocation (Tách đứt mảng gốc)
	fullSlice := array[:] // len: 5, cap: 5
	fmt.Printf("\nBefore Append Address: %p\n", unsafe.SliceData(fullSlice))

	fullSlice = append(fullSlice, 60) // Tràn cap -> Cấp phát mảng mới!
	fmt.Printf("After Append Address:  %p\n", unsafe.SliceData(fullSlice))

	// Thay đổi fullSlice lúc này KHÔNG còn làm đổi array gốc nữa
	fullSlice[0] = 888
	fmt.Printf("Array gốc vẫn giữ nguyên: %v\n", array[0]) // Vẫn là 10
}
```

---

## Related Notes

- [[Stack_vs_Heap_Memory_Fundamentals]] - Nguyên lý khoa học máy tính cốt lõi về phân tầng bộ nhớ Stack và Heap.
- [[Garbage_Collection_Fundamentals]] - Nguyên lý cốt lõi về cơ chế dọn rác tự động.
- [[Memory_Leaks_Core_Mechanics]] - Bản chất rò rỉ bộ nhớ ở mức độ nguyên lý nền tảng.
- [[Go_Learning_Roadmap]] - Lộ trình làm chủ ngôn ngữ Go và các cấu trúc dữ liệu cốt lõi.
- [[JS_Stack_vs_Heap_Memory]] - Mối liên hệ giữa Stack, Heap và Garbage Collection trong bộ nhớ.
- [[First_Principles_Thinking]] - Phương pháp tư duy từ nguyên lý gốc để bóc tách bản chất bộ nhớ.
