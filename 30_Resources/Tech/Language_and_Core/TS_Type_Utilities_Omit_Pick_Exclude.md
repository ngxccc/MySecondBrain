---
tags: [type/concept, topic/typescript, language-core, layer/core-mechanics]
date: 2026-06-18
aliases: [TypeScript Type Utilities, So sánh Omit Pick Exclude]
description: "So sánh chi tiết bản chất và phân biệt các tiện ích kiểu Omit, Pick, Exclude."
---

# TypeScript Type Utilities: Omit, Pick, Exclude

## TL;DR

Các Utility Types của TypeScript được chia thành hai nhóm chính dựa trên kiểu dữ liệu đầu vào:

- **Object Types (Interface/Type):** Sử dụng `Pick` (lấy ra các thuộc tính) và `Omit` (loại bỏ các thuộc tính).
- **Union Types (Tập hợp các kiểu dữ liệu/String literals):** Sử dụng `Exclude` (loại bỏ phần tử khỏi Union) và `Extract` (giữ lại phần tử trong Union).

Sai lầm phổ biến nhất là sử dụng `Omit` lên một Union type, dẫn đến việc TypeScript hiểu sai mục đích và gây lỗi biên dịch.

## Core Concept

### 1. Phân nhóm Utility Types

| Utility Type        | Đầu vào (Input) | Tác vụ (Operation)             | Bản chất bên dưới              |
| :------------------ | :-------------- | :----------------------------- | :----------------------------- |
| **`Pick<T, K>`**    | Object Type `T` | **Lấy ra** các key `K`         | `{ [P in K]: T[P] }`           |
| **`Omit<T, K>`**    | Object Type `T` | **Loại bỏ** các key `K`        | `Pick<T, Exclude<keyof T, K>>` |
| **`Exclude<T, U>`** | Union Type `T`  | **Loại bỏ** các thành viên `U` | `T extends U ? never : T`      |
| **`Extract<T, U>`** | Union Type `T`  | **Lấy ra** các thành viên `U`  | `T extends U ? T : never`      |

### 2. Sự khác biệt cốt lõi giữa Omit và Exclude

- **`Omit`** nhận đầu vào là một cấu trúc Object (có các cặp key-value). Nó sử dụng `keyof T` để lấy danh sách key và loại bỏ key được chỉ định.
- **`Exclude`** hoạt động trên danh sách các kiểu dữ liệu độc lập (Union). Nó sử dụng cơ chế **Distributive Conditional Type** để duyệt qua từng phần tử của Union và loại bỏ phần tử khớp điều kiện.

## Practical Implementation

### Ví dụ 1: Sử dụng `Pick` và `Omit` trên Object Type

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "dealer";
  createdAt: Date;
}

// Lấy ra chỉ id và name để hiển thị danh sách rút gọn
type UserSummary = Pick<User, "id" | "name">;
// { id: string; name: string; }

// Loại bỏ thông tin hệ thống khi trả về profile cho client
type UserProfileDTO = Omit<User, "createdAt">;
// { id: string; name: string; email: string; role: "admin" | "user" | "dealer"; }
```

### Ví dụ 2: Sử dụng `Exclude` trên Union Type

```typescript
type PaymentMethod = "PAYOS" | "CASH" | "TRADE_CREDIT";

// Loại bỏ hình thức thanh toán "TRADE_CREDIT" cho người dùng thông thường
type PublicPaymentMethod = Exclude<PaymentMethod, "TRADE_CREDIT">;
// Kết quả: "PAYOS" | "CASH"
```

### Ví dụ 3: Tại sao `Omit` thất bại trên Union Type?

Nếu cố tình dùng `Omit` để loại bỏ hình thức thanh toán `"TRADE_CREDIT"` khỏi Union `PaymentMethod`:

```typescript
// SAI LẦM:
type WrongPaymentMethod = Omit<PaymentMethod, "TRADE_CREDIT">;
```

**Bản chất lỗi:**
`Omit` định nghĩa là `Pick<T, Exclude<keyof T, K>>`. Với `T = "PAYOS" | "CASH" | "TRADE_CREDIT"`, kiểu dữ liệu này là các string literals. Do đó `keyof T` sẽ trả về danh sách các thuộc tính của đối tượng toàn cục `String` (như `toString`, `length`, `valueOf`,...).
TypeScript sẽ tiến hành loại bỏ thuộc tính `"TRADE_CREDIT"` ra khỏi đối tượng `String` chứ không loại bỏ phần tử `"TRADE_CREDIT"` ra khỏi Union. Kết quả là kiểu `WrongPaymentMethod` không thể gán bằng `"PAYOS"` hay `"CASH"`.

---

**Related Notes:**

- Cơ chế duyệt Union tự động: [[TS_Distributive_Conditional_Types]]
- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
