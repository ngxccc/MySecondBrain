---
noteId: 1786627528809
---

Hiểm họa Sub-slice Memory Leak xảy ra trong hoàn cảnh nào và quy tắc khắc phục chuẩn (Memory Lifecycle Rule) là gì?

---

- **Hoàn cảnh xảy ra**:
  - Trích xuất một Sub-slice nhỏ từ một mảng gốc khổng lồ (`small := hugeArray[:10]`) và lưu `small` vào một biến sống lâu (Global Variable, Cache, Struct long-lived).
- **Hậu quả**:
  - Trường `small.Data` vẫn giữ con trỏ trỏ vào mảng gốc khổng lồ.
  - Garbage Collector (Mark-and-Sweep) thấy con trỏ còn tham chiếu nên **bị khóa RAM không thể giải phóng mảng gốc 10MB**.
- **Cách khắc phục**:
  - Dùng `copy(clean, huge[:10])` hoặc `bytes.Clone()` để tạo ra mảng ngầm độc lập mới cho Sub-slice sống lâu, giúp GC lập tức thu hồi mảng gốc khổng lồ.
