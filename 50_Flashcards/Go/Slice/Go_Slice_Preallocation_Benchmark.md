---
noteId: 1786627528773
---

Tại sao kỹ thuật Pre-allocation `make([]T, 0, cap)` lại giúp giảm số lần cấp phát RAM từ 38 lần xuống còn đúng 1 lần duy nhất (`1 allocs/op`) khi append 1.000.000 phần tử?

---

- **Nguyên nhân**:
  - Khi không Pre-allocate (`make([]T, 0)`), mỗi khi mảng bị đầy (`len == cap`), Go phải gọi thuật toán `runtime.growslice` để xin Heap Allocator cấp một mảng mới lớn hơn và copy dữ liệu cũ sang (thực hiện đúng 38 lần từ 0 đến 1.000.000 phần tử).
  - Khi Pre-allocate (`make([]T, 0, 1_000_000)`), Go xin cấp phát sẵn một mảng ngầm đủ chứa 1.000.000 phần tử ngay ở lần đầu tiên.
- **Hiệu quả thực nghiệm**:
  - `allocs/op`: Giảm từ 38 allocs xuống còn **1 alloc** duy nhất.
  - Tốc độ thực thi: **Nhanh hơn gần 6 lần** (từ 9.26ms xuống 1.59ms).
