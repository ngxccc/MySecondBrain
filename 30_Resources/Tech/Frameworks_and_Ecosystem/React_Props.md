---
tags: [type/concept, topic/tech, topic/frontend]
date: 2026-07-10
aliases: [React Props, Thuộc tính trong React]
description: "Thuộc tính truyền từ component cha xuống, mang tính chất bất biến (read-only)."
---

# React Props

## TL;DR

**React Props** (viết tắt của "properties") là một đối tượng JavaScript chứa các giá trị được truyền từ một component cha (parent) xuống các component con (child) của nó. Props mang tính chất bất biến (read-only/immutable) đối với component nhận, đóng vai trò như các tham số đầu vào cấu hình giao diện hoặc hành vi hiển thị cho component đó.

## Core Concept

- **Tại sao nó tồn tại & Giải quyết bài toán gì?**
  - Để xây dựng các ứng dụng quy mô lớn từ những thành phần giao diện nhỏ hơn, các component cần có khả năng tái sử dụng (reusability) và liên lạc dữ liệu với nhau. React Props giải quyết bài toán cấu hình hóa linh hoạt các component và thiết lập kênh truyền thông tin một chiều (one-way data flow) từ cha xuống con.
- **Nó có thay thế cái gì hay không?**
  - Props hoạt động tương tự như các tham số (arguments) được truyền vào một hàm JavaScript thông thường, nhưng được React chuẩn hóa thành một đối tượng duy nhất dạng key-value.
- **Cơ chế hoạt động (How it works under the hood)**
  - 1. **Biên dịch JSX**: Khi viết `<Button text="Click me" type="primary" />`, trình biên dịch (Babel/SWC) chuyển đổi thành `React.createElement(Button, { text: "Click me", type: "primary" })`.
  - 2. **Truyền tham số**: Đối tượng thuộc tính `{ text: "Click me", type: "primary" }` sẽ được truyền làm tham số đầu tiên của hàm `Button(props)`.
  - 3. **Tính chất Bất biến (Immutability)**: React thực hiện cơ chế đóng băng (freeze) đối tượng props ở môi trường development. Mọi hành vi sửa đổi trực tiếp (như `props.text = "New text"`) đều sẽ ném ra lỗi hoặc bị phớt lờ, nhằm bảo đảm tính nhất quán của dữ liệu.
  - 4. **Cập nhật một chiều**: Nếu dữ liệu nguồn ở parent component thay đổi (ví dụ do State thay đổi), parent component re-render sẽ truyền một đối tượng props mới xuống child component. React sẽ kích hoạt việc re-render child component đó với các giá trị props mới.

## Practical Implementation

- **Trade-offs (Điểm yếu, rủi ro khi dùng)**
  - _Props Drilling (Trôi Props)_: Khi cấu trúc cây component quá sâu, việc truyền dữ liệu từ các node cấp cao xuống node ở rất sâu bắt buộc phải đi qua các component trung gian không cần thiết. Điều này gây khó khăn cho việc bảo trì. Khi đó, cần chuyển sang giải pháp nâng cao như React Context API hoặc State Management libraries (Zustand, Redux).
  - _Thiếu kiểm soát kiểu dữ liệu ở JavaScript thuần_: JavaScript không bắt buộc định dạng của props truyền vào, dẫn đến lỗi runtime nếu truyền sai kiểu (như truyền array thay vì object). Cần khắc phục triệt để bằng cách áp dụng TypeScript để định nghĩa các interface chặt chẽ cho props.
- **Code snippet / Architecture diagram**

```typescript
import React from 'react';

// Định nghĩa kiểu dữ liệu cho props bằng TypeScript
interface UserCardProps {
  name: string;
  email: string;
  role?: 'admin' | 'user'; // Optional prop
  onStatusChange: (status: string) => void; // Callback function prop
}

// Component con nhận props và sử dụng
export function UserCard({ name, email, role = 'user', onStatusChange }: UserCardProps) {
  // WRONG: props.name = 'New Name'; (Báo lỗi compile-time / runtime vì props là read-only)

  return (
    <div className={`card card-${role}`}>
      <h3>{name}</h3>
      <p>Email: {email}</p>
      <button onClick={() => onStatusChange('active')}>Kích hoạt</button>
    </div>
  );
}

// Component cha truyền props xuống component con
export function App() {
  const handleStatus = (status: string) => {
    console.log(`User status updated to: ${status}`);
  };

  return (
    <UserCard
      name="Nguyễn Văn B"
      email="vanb@example.com"
      role="admin"
      onStatusChange={handleStatus}
    />
  );
}
```

---

**Related Notes:**

- [[React_State]]
- [[React_Component_Declaration_Standards]]
