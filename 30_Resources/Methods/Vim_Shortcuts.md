---
tags: [type/concept, topic/tech, dev-tools]
date: 2026-06-07
aliases: [Phím tắt Vim, Vim Shortcuts Cheat Sheet, Phím tắt nâng cao Vim]
description: "Các phím tắt và câu lệnh thay thế vùng nâng cao trong Vim."
---

# Vim Advanced Shortcuts & Commands

## TL;DR

Tập hợp các phím tắt nâng cao và câu lệnh dòng tương đối trong Vim giúp tăng tốc độ điều hướng con trỏ (Navigation), thay thế văn bản (Substitution) và viết code nhanh chóng mà không cần dùng chuột.

## Navigation & Screen Control

- **Cuộn màn hình**:
  - `Ctrl + e`: Cuộn màn hình xuống 1 dòng (giữ nguyên con trỏ).
  - `Ctrl + y`: Cuộn màn hình lên 1 dòng (giữ nguyên con trỏ).
  - `zz`: Đưa dòng hiện tại có con trỏ vào chính giữa màn hình (rất khuyên dùng để định vị lại mắt nhìn).
  - `zt` (Top): Đưa dòng hiện tại lên sát mép trên cùng màn hình.
  - `zb` (Bottom): Đưa dòng hiện tại xuống sát mép dưới cùng màn hình.
- **Cuộn trang bự**:
  - `Ctrl + d` (Down): Di chuyển xuống nửa trang màn hình.
  - `Ctrl + u` (Up): Di chuyển lên nửa trang màn hình.
  - `Ctrl + f` (Forward): Di chuyển xuống một trang đầy đủ.
  - `Ctrl + b` (Backward): Di chuyển lên một trang đầy đủ.

## Range-based Substitution

Cú pháp cơ bản: `:[khoảng_dòng]s/[từ_cũ]/[từ_mới]/g`

- `:s/cũ/mới/g`: Thay thế từ cũ thành mới trong **dòng hiện tại**.
- `:5,10s/cũ/mới/g`: Thay thế từ dòng 5 đến dòng 10.
- `:.,$s/cũ/mới/g`: Thay thế từ dòng hiện tại (`.`) đến cuối file (`$`).
- `:.,.+5s/cũ/mới/g`: Thay thế từ dòng hiện tại xuống thêm 5 dòng nữa.
- `:.-10,.s/cũ/mới/g`: Thay thế từ 10 dòng trước đó đến dòng hiện tại.

## Advanced Text Editing & IDE Shortcuts

- `gi`: Di chuyển thẳng tới phần hiện thực mã nguồn (Go to implementation).
- `gd`: Nhảy tới định nghĩa biến/hàm (Go to definition).
- `gh`: Xem kiểu dữ liệu hoặc thông báo lỗi tại con trỏ (Hover).
- `gq` (Visual mode selection): Tự động căn lề và wrap dòng cho văn bản, rất hữu dụng khi định dạng comment tài liệu.
- `gb`: Thêm con trỏ đa điểm (multi-cursor) tại từ tiếp theo trùng với từ dưới con trỏ hiện tại.
- `af` (Visual selection): Chọn mở rộng dần các block bao ngoài (ví dụ: bôi đen dần từ chuỗi trong dấu nháy ra ngoặc vuông, rồi ngoặc tròn).
- `cia` (Change Inner Argument): Thay đổi giá trị tham số hàm hiện tại nhưng giữ lại dấu phẩy phân cách.
- `daa` (Delete Around Argument): Xóa tham số hàm hiện tại kèm theo dấu phẩy của nó.

---

## Related Notes

- Hướng dẫn cấu trúc hệ thống: [[000_System_Structure]]
- Tổng hợp phương pháp: [[000_Methods_MOC]]
