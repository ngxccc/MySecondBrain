---
tags: [type/concept, topic/programming/standards]
date: 2026-06-25
aliases: [Tiêu chuẩn Lập trình Nhóm 6, Coding Standards Group 6]
---

# 📝 Tiêu chuẩn Lập trình (Coding Standards) - Nhóm 6

## TL;DR

Tài liệu định nghĩa các quy tắc lập trình, cách đặt tên, định dạng code và quy trình làm việc Git Branch cho dự án quản lý viện dưỡng lão của Nhóm 6. Giúp tối ưu tính nhất quán, khả năng đọc hiểu và bảo trì mã nguồn trong suốt quá trình phát triển nhóm 16 người.

---

## Tiêu chuẩn Định dạng & Đặt tên

### 1. Quy tắc Chung

- **Ngôn ngữ:** Tất cả cách đặt tên (thư mục, file, class, function, variable, constant) và mọi comment trong mã nguồn bắt buộc phải viết bằng **Tiếng Anh**.
- **Độ dài dòng:** Khuyến khích giữ độ dài dòng dưới **180 - 200 ký tự** để tránh thanh cuộn ngang.
- **Thụt lề (Indentation):** Sử dụng **4 khoảng trắng (4 spaces)** cho việc thụt đầu dòng (đã cấu hình tự động trong VS Code settings).
- **Dấu ngoặc nhọn `{}`:** Sử dụng phong cách Egyptian/K&R (dấu mở ngoặc nhọn nằm trên cùng dòng với câu lệnh điều kiện).

### 2. Quy ước Đặt tên (Naming Conventions)

- **Directory / File:** Đặt tên dạng `camelCase` (ví dụ: `userService.ts`, `authController.ts`, `shoppingCart.ts`).
- **Class:** Đặt tên dạng `PascalCase` (ví dụ: `UserService`, `OrderController`).
- **Function / Method:** Đặt tên dạng `camelCase` (ví dụ: `calculateTotal()`, `findUserById()`).
- **Variable:** Đặt tên dạng `camelCase` (ví dụ: `studentName`, `totalPrice`, `isLoggedIn`). _Tránh các tên biến viết tắt vô nghĩa như `a`, `tmp`, `x`._
- **Constant:** Đặt tên dạng `UPPER_CASE` (ví dụ: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`).

---

## Cấu trúc Code & Comment mẫu

### 1. Tránh code trùng lặp (DRY)

Thay vì nhân bản các logic tính toán giống nhau, hãy tối ưu thành hàm có tham số.

- **Code tốt:**

  ```typescript
  function applyDiscount(price: number, discountPercent: number): number {
    return price - price * discountPercent;
  }

  const studentPrice = applyDiscount(100, 0.1);
  const teacherPrice = applyDiscount(100, 0.1);
  ```

### 2. Định dạng Comment chuẩn tiếng Anh

- **Comment đơn dòng:** Sử dụng `//` giải thích các logic xử lý phức tạp.
- **Comment JSDoc cho hàm:** Dùng `/** ... */` mô tả tham số và kiểu trả về.

  ```typescript
  /**
   * Calculate the discounted price.
   *
   * @param price Original price.
   * @param discount Discount percentage (e.g. 0.1 for 10%).
   * @returns Final price after discount.
   */
  function applyDiscount(price: number, discount: number): number {
    return price - price * discount;
  }
  ```

---

## Quy trình Git Branch & Constants dùng chung

### 1. Quy tắc đặt tên Branch

Đặt tên branch luôn viết thường, cách nhau bằng dấu gạch ngang và phân loại cụ thể:

- `feature/<tên-chức-năng>`: Cho các tính năng mới (ví dụ: `feature/login`, `feature/caregiver-schedule`).
- `bugfix/<tên-lỗi>`: Cho các lỗi cần vá (ví dụ: `bugfix/payment-retry`).
- `refactor/<tên-module>`: Cho tối ưu hóa code (ví dụ: `refactor/auth-middleware`).
- `docs/<tên-tài-liệu>`: Cập nhật tài liệu (ví dụ: `docs/readme-setup`).

### 2. Tổ chức Constants dùng chung

Tất cả các hằng số dùng chung của hệ thống (User Role, HTTP Status, API Routes) được tập trung tại thư mục `src/constants/` và sử dụng cờ `as const` để đảm bảo tính Read-only:

```typescript
export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  MODERATOR: "MODERATOR",
} as const;
```

---

## Related Notes

- Bản đồ nội dung dự án thực tập: [[000_VietTriDao_MOC]]
- Báo cáo quyết định công nghệ: [[Tech_Stack_Decisions]]
