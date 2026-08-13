---
noteId: 1786627528703
---

Cấu trúc bộ nhớ `SliceHeader` trong Go gồm những trường gì và chiếm tổng cộng bao nhiêu bytes RAM trên hệ thống 64-bit?

---

- **Cấu trúc 3 trường**:
  - `Data uintptr`: Con trỏ trỏ đến địa chỉ ô nhớ đầu tiên của mảng ngầm (Underlying Array) -> **8 bytes**.
  - `Len int`: Số lượng phần tử hiện tại đang chứa trong Slice -> **8 bytes**.
  - `Cap int`: Sức chứa tối đa của mảng ngầm tính từ vị trí `Data` -> **8 bytes**.
- **Tổng dung lượng**: **24 bytes**.
- **Tính chất**: Khi truyền Slice vào tham số hàm, Go luôn copy bản sao của 24 bytes `SliceHeader` này (**Pass-by-value**).
