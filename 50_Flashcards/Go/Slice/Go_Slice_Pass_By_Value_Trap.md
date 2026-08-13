---
noteId: 1786627528758
---

Tại sao việc gọi `append` làm tăng độ dài Slice bên trong một hàm lại KHÔNG làm thay đổi biến Slice ở ngoài hàm gọi (Pass-by-value Trap)?

---

- **Nguyên nhân**:
  - `SliceHeader` được truyền vào hàm dưới dạng **Bản sao giá trị (Pass-by-value)**.
  - Khi `append` thực thi bên trong hàm, nó chỉ ghi giá trị `len` mới vào bản sao `SliceHeader` local của hàm đó.
  - `SliceHeader` ở hàm ngoài vẫn giữ nguyên giá trị `len` cũ nên không nhìn thấy phần tử mới thêm vào.
- **Cách khắc phục**:
  - Trả về Slice mới từ hàm: `s = modify(s)`
  - Hoặc truyền con trỏ Slice: `func modify(s *[]int)`
