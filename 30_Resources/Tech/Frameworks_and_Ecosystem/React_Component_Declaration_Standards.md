---
tags: [type/concept, topic/tech, topic/frontend]
date: 2026-06-08
aliases:
  [
    React Component Declaration Standards,
    Quy tắc khai báo React Component,
    export function vs arrow function,
  ]
description: "Tiêu chuẩn khai báo React component (export function vs arrow function)."
---

# React Component Declaration Standards

## TL;DR

Quy tắc thống nhất cách khai báo React components: Ưu tiên **Traditional Functions (`export function`)** cho UI Components nhằm tối ưu hóa Component Identity, Fast Refresh (HMR), Generic props và Next.js Server Components. Sử dụng **Arrow Functions** cho Callbacks, Inline Event Handlers và Closures.

---

## Core Concepts

### 1. Traditional Functions

Luôn sử dụng cú pháp hàm truyền thống để định nghĩa UI Components vì các lý do sau:

- **Component Identity & DevTools:** React nội suy tên của component dựa trên thuộc tính `.name` của hàm. Hàm truyền thống tự động giữ lại tên này, giúp React DevTools hiển thị chính xác tên linh kiện thay vì hiển thị `Anonymous`, tối ưu hóa trải nghiệm gỡ lỗi.
- **Fast Refresh (HMR):** Cơ chế Hot Module Replacement yêu cầu component có định danh rõ ràng (Lexical Binding) để cập nhật code trực tiếp mà vẫn giữ nguyên State (Trạng thái) thay vì unmount toàn bộ cây UI.
- **Generic TSX Syntax:** Tránh được lỗi biên dịch của JSX khi khai báo Generic Type. Với Arrow function, bạn phải viết hack là `<T,>` để JSX không hiểu lầm `<T>` là thẻ HTML. Với hàm truyền thống, cú pháp viết tự nhiên: `function Select<T>(props: Props<T>)`.
- **Next.js Server Components (RSC):** Hỗ trợ viết các Server Components dạng bất đồng bộ một cách tự nhiên: `export default async function Component()`.
- **Hoisting & Top-Down Architecture:** Đưa component chính cần export lên đầu file, còn các helper component phụ trợ không cần export đặt ở cuối file nhờ vào tính chất Hoisting của hàm truyền thống.

### 2. Arrow Functions => {}`)

Chỉ sử dụng Arrow functions cho các ngữ cảnh bổ trợ:

- **Callbacks & Array Methods:** Truyền trực tiếp vào các hàm duyệt mảng như `.map()`, `.filter()`, `.reduce()`.
- **Inline Event Handlers:** Xử lý sự kiện nội tuyến trong JSX (ví dụ: `onClick={() => handleClick(id)}`).
- **Closures & High-Order Functions:** Các hàm lồng nhau bên trong component hoặc các pipeline cần bảo toàn ngữ cảnh `this` của scope cha.

### 3. Trường hợp ngoại lệ: `React.forwardRef`

Khi dùng `forwardRef`, bạn buộc phải bọc component trong một cuộc gọi hàm, điều này phá vỡ cấu trúc `export function` truyền thống và có nguy cơ trả về `ForwardRef(Anonymous)`.

- **Giải pháp 1:** Khai báo bằng Named Function Expression:

  ```typescript
  export const CustomInput = forwardRef(function CustomInput(props, ref) { ... });
  ```

- **Giải pháp 2:** Thiết lập thuộc tính `displayName` thủ công (khuyên dùng):

  ```typescript
  export const CustomInput = forwardRef<HTMLInputElement, Props>((props, ref) => { ... });
  CustomInput.displayName = "CustomInput";
  ```

---

## Concrete Examples

### 1. Khai báo Component thông thường và Generic Component

```tsx
// 1. Hoisting cho phép Export Component chính lên đầu file
export default function UserDashboard() {
  return (
    <div>
      <Header />
      <UserList />
    </div>
  );
}

// 2. Generic Component viết tự nhiên, không cần hack <T,>
function UserList<T>() {
  return <ul>...</ul>;
}

// 3. Sub-component phụ trợ đặt ở cuối file
function Header() {
  return <header>Dashboard Header</header>;
}
```

### 2. Định danh cho forwardRef

```tsx
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} className="border p-2" />;
  },
);

// Khôi phục định danh để tránh lỗi Anonymous trong DevTools
CustomInput.displayName = "CustomInput";
```

---

## Related Notes

- React Server Components: [[React_Server_Components]]
- Server Actions trong Next.js: [[NextJS_Server_Actions]]
- Bản đồ tri thức kỹ thuật: [[000_Tech_MOC]]
