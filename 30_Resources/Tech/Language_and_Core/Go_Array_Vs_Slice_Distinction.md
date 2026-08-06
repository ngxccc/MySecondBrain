---
tags:
  - type/concept
  - topic/go
  - topic/memory-management
date: 2026-08-06
aliases:
  - Phân Biệt Mảng Và Slice Trong Go
  - Go Array vs Slice Distinction
  - Memory Semantics of Arrays and Slices
---

# Bản Chất Kiến Trúc Và Sự Phân Biệt Giữa Array Và Slice Trong Go

## TL;DR

In Go, an **Array (`[N]T`)** is a fixed-size value type allocated contiguously in memory, while a **Slice (`[]T`)** is a lightweight 24-byte header descriptor (`ptr`, `len`, `cap`) serving as a dynamic viewport over an underlying array. Go separates them to achieve both low-level memory control (C-like hardware predictability) and high-level dynamic flexibility (Python-like ease of use).

---

## Core Concept & Architectural Rationales

### 1. Memory Semantics: Value Type vs. Header Descriptor

- **Array (`[N]T`)**:
  - **Value Type**: Assigning or passing an array copies the **entire array** (all elements) into a new stack frame.
  - **Fixed Size**: Length is part of its type definition (`[5]int` is completely distinct from `[10]int`).
  - **Zero Allocation Overhead**: Ideal for stack allocation with predictable cache locality and zero GC pressure.

- **Slice (`[]T`)**:
  - **Header Descriptor**: Assigning or passing a slice copies only the 24-byte **slice header** (`ptr`, `len`, `cap`).
  - **Dynamic Viewport**: Length can grow dynamically via `append()`.
  - **Shared Memory**: Multiple slices can reference overlapping regions of the same underlying array.

---

### 2. Why Go Doesn't Unify Them Into a Single Type

Instead of creating a heavy unified object (like Java's `ArrayList` or Python's `list`), Go applies **separation of concerns**:

1. **Arrays handle raw storage**: Fixed-size memory buffer with hardware-friendly layout.

## Practical Implementation

---

## Practical Code Comparison

### Array Copying (Value Semantics - No Side Effects)

```go
package main

import "fmt"

func main() {
    arr1 := [3]int{10, 20, 30}
    arr2 := arr1 // Copies entire array (3 elements)

    arr2[0] = 99
    fmt.Println(arr1) // Output: [10 20 30] (arr1 is untouched)
    fmt.Println(arr2) // Output: [99 20 30]
}
```

### Slice Copying (Shared Memory - Side Effects)

```go
package main

import "fmt"

func main() {
    s1 := []int{10, 20, 30}
    s2 := s1 // Copies only 24-byte header pointing to same underlying array

    s2[0] = 99
    fmt.Println(s1) // Output: [99 20 30] (s1 sees the mutation!)
    fmt.Println(s2) // Output: [99 20 30]
}
```

---

## Related Notes

- [[Go_Slice_Underlying_Mechanics]] - Detailed breakdown of slice headers, ptr, len, and cap growth strategy.
- [[Go_Escape_Analysis_Mechanics]] - How memory escapes from stack to heap.
- [[English_Learner_Profile]] - Vocabulary tracker and progress milestones.
