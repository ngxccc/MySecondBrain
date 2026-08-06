---
noteId: 1785417091595
---

What is the technical distinction between **Compilation Errors** and **Runtime Exceptions**?

---

- **Formula / Pattern**:
  - `Compilation Error`: `occur at compile time`
  - `Runtime Exception`: `occur at runtime` / `throw an exception`
- **Core Explanation**:
  - `Compilation Error` xảy ra khi trình biên dịch kiểm tra code trước khi chạy (cú pháp, thiếu namespace). `Runtime Exception` xảy ra khi ứng dụng đang thực thi (chia cho 0, null pointer).
- **Usage & Anchor Cues**:
  - `compile-time error` vs `runtime exception`.
- **Concrete Examples**:
  - _`A missing semicolon causes a compilation error.`_ (Thiếu dấu chấm phẩy gây ra lỗi biên dịch.)
  - _`A null pointer access throws a runtime exception.`_ (Truy cập null pointer bắn ra một ngoại lệ thời gian chạy.)
