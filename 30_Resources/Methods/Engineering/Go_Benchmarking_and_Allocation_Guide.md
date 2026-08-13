---
tags:
  - type/method
  - topic/backend
  - topic/testing
  - topic/go
aliases:
  - Go Benchmarking and Allocation Guide
  - Hướng Dẫn Đo Đạc Hiệu Năng Benchmark Trong Go
  - Go Escape Analysis SOP
date: 2026-08-13
description: "SOP quy trình đo đạc hiệu năng Benchmarking (go test -benchmem), b.Loop() trên Go 1.24+, và phân tích bộ nhớ Heap/Stack bằng Escape Analysis (-gcflags=-m)."
---

# Go Benchmarking and Allocation Guide

Tài liệu này là một quy trình SOP (`type/method`) hướng dẫn chi tiết cách thiết lập file đo đạc hiệu năng (Benchmarking), phân tích lượng cấp phát bộ nhớ RAM (`allocs/op`, `B/op`), phòng chống tối ưu hóa sai lệch từ Compiler (Benchmark Sink), và kiểm tra Escape Analysis trên ngôn ngữ Go.

## TL;DR

Sử dụng gói `testing.B` cùng vòng lặp hiện đại `for b.Loop()` (Go 1.24+) để đo đạc thời gian thực thi. Chạy cờ CLI `go test -bench=. -benchmem` để đo đạc lượng RAM cấp phát trên Heap. Luôn khai báo một biến toàn cục `var sink` (Benchmark Sink) để gán kết quả đầu ra, ngăn Trình biên dịch Go (Compiler) áp dụng Dead Code Elimination làm sai lệch kết quả. Sử dụng `go build -gcflags="-m"` để kiểm tra Escape Analysis.

---

## Core Concept & Rules

### 1. Chuẩn Viết Hàm Benchmark (Go 1.24+ vs Go 1.23-)

- **Go 1.24+ Modern Loop (`b.Loop()`)**:
  - Cú pháp `for b.Loop()` tự động reset bộ đếm thời gian (`b.ResetTimer()`), ngăn các dòng lệnh khởi tạo (Setup code) ở đầu hàm bị tính nhầm vào thời gian đo đạc.
- **Go 1.23- Legacy Loop (`b.N`)**:
  - Cú pháp `for i := 0; i < b.N; i++` phải chú ý gọi `b.ResetTimer()` thủ công nếu có mã khởi tạo ban đầu.

---

### 2. Mẫu Thiết Kế Benchmark Sink (Phòng Chống Dead Code Elimination)

Nếu kết quả tính toán hoặc tạo dữ liệu trong vòng lặp Benchmark không được sử dụng ở đâu, Trình biên dịch Go (Compiler) sẽ tự động áp dụng **Dead Code Elimination** (loại bỏ mã rác) hoặc Staticcheck báo lỗi `SA4010: ineffectual append`.

**Giải pháp**: Khai báo biến toàn cục ở cấp Package và gán kết quả ở cuối vòng lặp:

```go
package main

import "testing"

// Benchmark Sink: Biến toàn cục giữ tham chiếu kết quả
var benchmarkSink []int

func BenchmarkExample(b *testing.B) {
	for b.Loop() {
		s := make([]int, 0, 100)
		for j := range 100 {
			s = append(s, j)
		}
		// Gán vào sink để compiler không xóa mã nguồn bên trong vòng lặp
		benchmarkSink = s
	}
}
```

---

### 3. Quy Trình Chạy CLI Đo Đạc Hiệu Năng

#### Lệnh 1: Đo đạc tốc độ & lượng cấp phát bộ nhớ

```bash
go test -bench=. -benchmem
```

- **`ns/op` (Nanoseconds per Operation)**: Thời gian trung bình thực thi 1 vòng lặp (càng nhỏ càng tốt).
- **`B/op` (Bytes per Operation)**: Tổng số bytes bộ nhớ xin cấp phát trên Heap cho 1 vòng lặp.
- **`allocs/op` (Allocations per Operation)**: Số lần xin cấp phát bộ nhớ từ Heap Allocator cho 1 vòng lặp (Pre-allocation đạt chuẩn sẽ đưa chỉ số này về $1 \text{ alloc/op}$).

#### Lệnh 2: Kiểm tra Escape Analysis (Stack vs Heap)

```bash
go build -gcflags="-m" main.go
```

Ví dụ output thực tế từ Trình biên dịch Go (Compiler):

```text
./main.go:16:6: can inline leaksMemory
./main.go:13:41: label escapes to heap
./main.go:17:19: make([]byte, 10000000) escapes to heap
```

- **`can inline`**: Function đủ nhỏ để Compiler thay thế lệnh gọi hàm bằng mã nguồn gốc (loại bỏ chi phí Function Call Overhead).
- **`escapes to heap` (Interface Boxing)**: Các biến truyền vào `fmt.Printf(a ...any)` bị ép kiểu sang Interface `any`, buộc phải đẩy xuống Heap.
- **`escapes to heap` (Size / Pointer Escape)**: Khối bộ nhớ quá lớn (như `make([]byte, 10_000_000)` = 10MB) vượt quá sức chứa Stack, hoặc con trỏ biến sống lâu hơn hàm (Return Pointer), buộc phải đẩy xuống Heap.

---

## Practical Implementation

Ví dụ đối chiếu hiệu năng thực tế từ case study của [[Go_Slice_Underlying_Mechanics]]:

```text
BenchmarkAppendNoAlloc-12     130    9263964 ns/op    41678261 B/op    38 allocs/op
BenchmarkAppendPrealloc-12    729    1591648 ns/op     8003584 B/op     1 allocs/op
```

---

## Related Notes

- [[Go_Slice_Underlying_Mechanics]] - Ứng dụng đo đạc hiệu năng trên Slice của Go.
- [[Stack_vs_Heap_Memory_Fundamentals]] - Nguyên lý phân tầng bộ nhớ Stack và Heap.
- [[Garbage_Collection_Fundamentals]] - Ảnh hưởng của `allocs/op` tới cơ chế dọn rác.
