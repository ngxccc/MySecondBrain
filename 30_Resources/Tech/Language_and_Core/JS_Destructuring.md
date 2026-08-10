---
tags: [type/concept, topic/tech, language-core, layer/core-mechanics]
date: 2026-06-07
aliases: [Bóc tách dữ liệu JS, Destructuring Assignment, ES6 Destructuring]
description: "Kỹ thuật bóc tách dữ liệu mảng và đối tượng trong ES6."
---

# JS Destructuring Assignment

## TL;DR

Destructuring Assignment (bóc tách dữ liệu) trong ES6 giúp trích xuất dữ liệu từ Mảng hoặc Đối tượng vào các biến riêng biệt một cách ngắn gọn. **Array Destructuring** dựa trên **thứ tự vị trí (Index)**, còn **Object Destructuring** dựa trên **tên thuộc tính (Key)**.

## Array vs Object Destructuring

### 1. Array Destructuring

- **Quy tắc**: Bóc tách các phần tử của mảng theo đúng **thứ tự vị trí** (index).
- **Đặc điểm**: Tên biến khai báo có thể tự do đặt tên theo ý muốn.
- **Ví dụ**:

  ```javascript
  const coordinates = [10.5, 106.8];
  // Bóc tách theo vị trí index 0 và 1
  const [lat, lng] = coordinates;
  console.log(lat); // 10.5
  ```

### 2. Object Destructuring

- **Quy tắc**: Bóc tách thuộc tính của đối tượng theo đúng **tên thuộc tính (Key)**.
- **Đặc điểm**: Thứ tự khai báo các biến không quan trọng, nhưng tên biến phải khớp với tên key của đối tượng (hoặc dùng cú pháp alias `key: newName`).
- **Ví dụ**:

  ```javascript
  const user = { name: "ngxc", age: 25 };
  // Bóc tách theo key 'name' và 'age'
  const { age, name } = user;
  console.log(name); // "ngxc"
  ```

---

## Related Notes

- Tổng quan tri thức kỹ thuật: [[000_Tech_MOC]]
