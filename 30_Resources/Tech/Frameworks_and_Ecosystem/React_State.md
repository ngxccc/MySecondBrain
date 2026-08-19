---
tags: [type/concept, topic/tech, topic/frontend]
date: 2026-07-10
aliases: [React State, Trạng thái trong React]
description: "Trạng thái nội bộ của component, quản lý dữ liệu động thay đổi theo thời gian."
---

# React State

## TL;DR

**React State** là một đối tượng JavaScript nội bộ được quản lý bên trong một component để lưu giữ các thông tin/dữ liệu có thể thay đổi theo thời gian (như giá trị nhập từ input, kết quả API, trạng thái bật/tắt UI). Khi state thay đổi thông qua hàm cập nhật (setter function), React sẽ tự động kích hoạt quá trình render lại (re-render) component đó để cập nhật giao diện hiển thị đồng bộ với dữ liệu mới.

## Core Concept

- **Tại sao nó tồn tại & Giải quyết bài toán gì?**
  - Để xây dựng các ứng dụng giao diện động và tương tác, các thành phần UI cần khả năng lưu trữ dữ liệu động và phản hồi trực tiếp các hành động của người dùng (user events). React State giải quyết bài toán đồng bộ hóa tự động giữa dữ liệu (data) và giao diện hiển thị (UI). Nếu không có State, component chỉ hoạt động như một hàm thuần túy hiển thị dữ liệu tĩnh và không thể tự cập nhật giao diện của chính nó khi có tương tác.
- **Nó có thay thế cái gì hay không?**
  - Trong mô hình phát triển web truyền thống (Vanilla JS), lập trình viên phải tự quản lý biến toàn cục/cục bộ và thao tác trực tiếp trên DOM (ví dụ: `document.getElementById().innerText = newValue`) mỗi khi dữ liệu thay đổi. React State loại bỏ hoàn toàn việc thao tác DOM thủ công thông qua cơ chế Reactive Programming.
- **Cơ chế hoạt động (How it works under the hood)**
  - 1. **Đăng ký bộ nhớ**: Khi một functional component khai báo hook `useState` (ví dụ `const [count, setCount] = useState(0)`), React sẽ khởi tạo và gán một ô nhớ nội bộ trong cây Fiber tương ứng với component instance đó để lưu trữ giá trị state hiện tại.
  - 2. **Kích hoạt Scheduler (Setter)**: Khi hàm `setCount` được gọi, React nhận giá trị mới (hoặc callback tính toán) và đưa tác vụ cập nhật vào hàng đợi (batching updates) để xử lý bất đồng bộ nhằm tối ưu hiệu năng.
  - 3. **Re-rendering & Reconciliation**: React thực thi lại hàm component với tham số state mới nhất. Nó sinh ra một Virtual DOM tree mới, so sánh sự khác biệt (diffing algorithm) với Virtual DOM tree cũ và chỉ cập nhật những phần thay đổi thực sự lên Real DOM (Reconciliation).

## Practical Implementation

- **Trade-offs (Điểm yếu, rủi ro khi dùng)**
  - _Hiệu năng re-render_: Khi state của một component thay đổi, component đó cùng toàn bộ cây component con của nó sẽ bị re-render mặc định. Nếu thiết kế cây component không tốt hoặc đặt state quá cao (Lifting state up vô tội vạ) sẽ dẫn đến sụt giảm hiệu năng.
  - _Cập nhật bất đồng bộ (Asynchronous updates)_: Việc cập nhật state trong React là bất đồng bộ và được gộp lại (batching). Do đó, việc truy cập trực tiếp giá trị state ngay sau khi gọi hàm setter sẽ chỉ nhận được giá trị cũ.
  - _Mutable State Trap (Bẫy đột biến trực tiếp)_: React so sánh nông (shallow comparison) bằng toán tử `Object.is` để quyết định xem có cần re-render hay không. Nếu trực tiếp chỉnh sửa thuộc tính của một đối tượng state (ví dụ `state.count = 1`) mà không tạo một bản sao mới (immutable update), React sẽ không phát hiện ra thay đổi và không cập nhật lại UI.
- **Code snippet / Architecture diagram**

```javascript
import React, { useState } from "react";

export function Counter() {
  // 1. Khai báo state nguyên thủy
  const [count, setCount] = useState(0);

  // 2. Khai báo state đối tượng (Object)
  const [user, setUser] = useState({ name: "Nguyễn Văn A", age: 20 });

  const handleUpdateUser = () => {
    // WRONG: user.age = 21; setUser(user); (React sẽ không re-render vì tham chiếu của user không đổi)

    // RIGHT: Sử dụng spread operator để tạo đối tượng mới (Immutable update)
    setUser({
      ...user,
      age: user.age + 1,
    });
  };

  return (
    <div>
      <p>Số lần click: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng</button>

      <p>
        Thông tin: {user.name} - {user.age} tuổi
      </p>
      <button onClick={handleUpdateUser}>Tăng tuổi</button>
    </div>
  );
}
```

---

**Related Notes:**

- [[React_Props]]
- [[React_Component_Declaration_Standards]]
- [[JS_Immer_Immutable_State]]
