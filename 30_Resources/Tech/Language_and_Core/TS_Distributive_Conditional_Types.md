---
tags: [type/concept, topic/typescript, layer/core-mechanics]
date: 2026-04-28
aliases: [Distributive Conditionals, Disable Distribution]
description: "Cơ chế tự động xé lẻ Union Type trong các biểu thức Generic của TypeScript."
---

# TS Distributive Conditional Types

## TL;DR

Cơ chế tự động "xé lẻ" của TypeScript. Khi truyền một Union Type (`A | B`) vào một Generic Condition, TS sẽ tự động chạy vòng lặp phân phối (distribute) điều kiện cho từng phần tử bên trong Union thay vì so sánh nguyên một cục.

## Core Concept

- **Cơ chế Phân phối:** Thay vì xử lý `(A | B) extends U ? X : Y`, trình biên dịch sẽ tự động bung nó ra thành `(A extends U ? X : Y) | (B extends U ? X : Y)`.
- **Naked Type Parameter (Điều kiện kích hoạt):** Tính năng phân phối CHỈ hoạt động khi biến Generic `T` đứng "trần trụi". Nếu `T` bị bọc trong một cấu trúc khác (như `T[]`, `[T]`, `Promise<T>`), tính năng này lập tức bị tắt.
- **Nghịch lý tập rỗng (The Empty Set Paradox):** Trong toán học, `never` là một tập rỗng ($\emptyset$). Vì cơ chế phân phối hoạt động giống hàm `map()`, khi nó duyệt qua một tập rỗng, đoạn code điều kiện sẽ không bao giờ được chạy $\rightarrow$ Kết quả luôn trả về `never`.

## Practical Implementation

- **Tử huyệt "IsNever":** Lỗi kinh điển của các dev mới học TS là viết Utility Type `type IsNever<T> = T extends never ? true : false;`. Khi truyền `never` vào, nó không trả về `true` mà trả về `never`, làm gãy toàn bộ chuỗi Type Inference phía sau.
- **Tuyệt chiêu Đóng hộp (Tuple Wrapping):** Để ép TypeScript "tắt" cơ chế phân phối, ta phải tước bỏ trạng thái "Naked" của `T` bằng cách nhốt cả hai vế vào trong ngoặc vuông (Tuple). Lúc này, TS bắt buộc phải so sánh nguyên "cái hộp" với "cái hộp".
- **Code Snippet:**

```typescript
// 1. Phân phối mặc định (Distributive)
type ToArray<T> = T extends any ? T[] : never;
type DistResult = ToArray<string | number>;
// -> Kết quả: string[] | number[] (Bị xé lẻ)

// 2. Tắt phân phối bằng Tuple Wrapping (Non-Distributive)
type ToArrayFixed<T> = [T] extends [any] ? T[] : never;
type NonDistResult = ToArrayFixed<string | number>;
// -> Kết quả: (string | number)[] (Giữ nguyên cục)

// 3. Fix bug IsNever kinh điển
//  SAI: Trả về never do tập rỗng
type IsNeverWrong<T> = T extends never ? true : false;
//  ĐÚNG: So sánh nguyên hộp [never] vs [never]
type IsNever<T> = [T] extends [never] ? true : false;
```

---

**Related Notes:**

- Nguồn gốc của hành vi này: [[TS_Union_Types]]
- Bản chất của tập rỗng trong Type System: [[TS_Never_Type]]
