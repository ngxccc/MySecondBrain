---
tags:
  - layer/core-mechanics
  [
    type/concept,
    topic/tech,
    language/typescript,
    system/types,
    programming/paradigm,
  ]
aliases:
  [Structural Typing, Type Erasure, Type Guards, Type Predicates, Duck Typing]
date: 2026-06-20
description: "Hệ thống kiểu cấu trúc (Structural Typing), cơ chế xóa bỏ kiểu (Type Erasure) và cách thu hẹp kiểu an toàn với Type Predicates."
---

# TS Type System: Structural Typing & Type Erasure

## TL;DR

TypeScript sử dụng hệ thống kiểu cấu trúc **Structural Type System** (kiểm tra kiểu dựa trên hình dáng/cấu trúc dữ liệu thay vì tên lớp khai báo), trái ngược hoàn toàn với hệ thống kiểu định danh **Nominal Type System** của Java/C#. Thêm vào đó, TypeScript áp dụng cơ chế xóa bỏ kiểu **Type Erasure** — toàn bộ kiểu tĩnh (interface, type) bị xóa bỏ 100% khi biên dịch sang JavaScript, nghĩa là kiểu dữ liệu không tồn tại ở runtime. Do đó, để kiểm tra và thu hẹp kiểu dữ liệu (type narrowing) khi chạy ứng dụng (ví dụ nhận dữ liệu từ API), lập trình viên bắt buộc phải tự viết **Type Guards** và **User-Defined Type Predicates** (`parameter is Type`).

---

## Core Concept

### 1. Structural Typing vs. Nominal Typing

- **Structural Typing (TypeScript):**
  - Định nghĩa: Khả năng tương thích kiểu được quyết định hoàn toàn bởi cấu trúc (thuộc tính và kiểu của thuộc tính) của đối tượng. Nếu đối tượng $A$ có đầy đủ các thuộc tính mà đối tượng $B$ yêu cầu, thì đối tượng $A$ được phép gán cho đối tượng $B$, bất kể chúng có tên khai báo khác nhau.
  - Phép so sánh trực quan: _"Nếu nó đi như một con vịt và kêu như một con vịt, thì nó là một con vịt"_.
- **Nominal Typing (Java, C#, C++):**
  - Định nghĩa: Khả năng tương thích kiểu được quyết định bởi tên khai báo (Class/Interface name) và quan hệ thừa kế tường minh. Dù hai Class có các thuộc tính giống hệt nhau 100%, chúng vẫn không thể gán cho nhau nếu không có quan hệ kế thừa trực tiếp.

### 2. Sự biến mất của Kiểu ở Runtime: Type Erasure

TypeScript chỉ hoạt động như một lớp xác thực tĩnh (Static Analysis) trong quá trình viết code và build:

- Khi biên dịch (transpile) sang JavaScript, trình biên dịch `tsc` thực hiện **Type Erasure**: xóa sạch toàn bộ từ khóa `interface`, `type`, `as`, `generic` `<T>`, và các khai báo kiểu `: string`, `: number`.
- **Hậu quả:** Ở runtime, trình duyệt hoặc môi trường Bun/Node.js chỉ chạy mã JavaScript thuần. Do đó, các câu lệnh dạng `if (user instanceof UserInterface)` sẽ ném ra lỗi Runtime Error vì `UserInterface` không hề tồn tại trong bộ nhớ.

### 3. Giải pháp Runtime: Type Guards & Type Predicates

Vì kiểu dữ liệu biến mất ở runtime, để kiểm tra dữ liệu thực tế (nhất là khi nhận dữ liệu thô từ HTTP API hoặc database), ta phải dùng các kỹ thuật kiểm tra kiểu chạy (Runtime Type Checking):

- **Type Guards:** Sử dụng các toán tử của JavaScript như `typeof` (cho kiểu nguyên thủy) và `instanceof` (cho Class thực sự khởi tạo bằng `new`).
- **Type Predicates (User-Defined Type Guards):**
  - Là các hàm kiểm tra tự viết có kiểu trả về dạng đặc biệt: `parameterName is Type`.
  - Nó báo cho TypeScript Compiler biết: _"Nếu hàm này trả về true, thì biến truyền vào chắc chắn thuộc kiểu dữ liệu này ở các dòng code tiếp theo"_, giúp trình biên dịch tự động thu hẹp kiểu (Type Narrowing) một cách an toàn.

---

## Practical Implementation

### 1. Minh họa Type Erasure

#### Mã nguồn TypeScript

```typescript
interface Dealer {
  id: string;
  tier: "GOLD" | "SILVER";
}

function processDealer(dealer: Dealer) {
  console.log(dealer.tier);
}
```

#### Mã JavaScript thực thi sau khi Compile

Toàn bộ `interface` và đặc tả kiểu dữ liệu bị **xóa sạch**:

```javascript
function processDealer(dealer) {
  console.log(dealer.tier);
}
```

### 2. Viết Custom Type Guard để Validate dữ liệu từ API

Dự án Hyundai B2B cần phân biệt giữa tài khoản `Contractor` và `Dealer` từ API trả về để áp dụng chiết khấu:

```typescript
interface Contractor {
  id: string;
  companyName: string;
  taxCode: string;
}

interface Dealer {
  id: string;
  tier: "GOLD" | "SILVER";
  discountRate: number;
}

// Hàm kiểm tra kiểu tự định nghĩa (Type Predicate)
function isDealer(user: Contractor | Dealer): user is Dealer {
  // Kiểm tra sự tồn tại của thuộc tính đặc trưng ở runtime
  return "tier" in user && "discountRate" in user;
}

function calculateOrderTotal(user: Contractor | Dealer, basePrice: number) {
  if (isDealer(user)) {
    // Trong block này, TypeScript tự động hiểu 'user' là 'Dealer'
    return basePrice * (1 - user.discountRate);
  }

  // Ngoài block này, TypeScript hiểu 'user' là 'Contractor'
  console.log(`Calculating price for company: ${user.companyName}`);
  return basePrice;
}
```

---

## Interview Prep

### Q1: Sự khác biệt giữa Structural Typing của TypeScript và Nominal Typing của Java/C# là gì?

- **Trả lời:**
  - Nominal Typing (Java/C#) so sánh kiểu dựa trên tên lớp khai báo và quan hệ kế thừa rõ ràng. Hai class giống hệt nhau về thuộc tính nhưng khác tên thì không thể gán cho nhau.
  - Structural Typing (TypeScript) so sánh kiểu dựa trên hình dáng và thuộc tính của dữ liệu. Nếu đối tượng truyền vào có đủ các thuộc tính mà nơi gọi yêu cầu, TypeScript sẽ chấp nhận mà không cần quan tâm tên hay nguồn gốc của đối tượng đó.

### Q2: Type Erasure là gì và nó ảnh hưởng thế nào đến việc viết mã TypeScript?

- **Trả lời:** Type Erasure là cơ chế xóa bỏ toàn bộ cú pháp liên quan đến kiểu tĩnh (interface, type annotations, generics) của TypeScript khi biên dịch sang JavaScript. Vì kiểu dữ liệu không hề tồn tại ở runtime, chúng ta không thể dùng toán tử `instanceof` cho `interface` hoặc `type`. Điều này bắt buộc ta phải tự viết các hàm kiểm tra kiểu ở runtime (Type Guards) bằng các toán tử JavaScript thực tế như `typeof`, `"prop" in object`, hoặc tạo hàm trả về kiểu **Type Predicate** (`arg is Type`) để hướng dẫn TypeScript compiler thu hẹp kiểu an toàn.

### Q3: Em hãy ánh xạ hệ thống kiểu của TypeScript sang hệ thống kiểu của ngôn ngữ Go và Java?

- **Trả lời:**
  - **Java:** Sử dụng hệ thống kiểu tĩnh định danh (**Nominal Typing**). Mọi lớp muốn tương thích với nhau phải kế thừa hoặc implement chung một Interface một cách tường minh tại thời điểm compile.
  - **Go (Golang):** Rất tương đồng với TypeScript vì Go sử dụng cơ chế **Duck Typing** cho Interface. Một struct trong Go không cần khai báo từ khóa kế thừa hay implement một interface nào cả. Chỉ cần struct đó định nghĩa đầy đủ các phương thức (methods) mà interface yêu cầu, Go compiler sẽ tự động coi struct đó là thực thể hợp lệ của interface đó. Điều này tương tự như việc so sánh hình dáng (Shape) của Structural Typing trong TypeScript.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Cơ chế Runtime: [[JS_Runtimes_Bun_vs_NodeJS]]
- Tối ưu hóa bộ nhớ: [[JS_Stack_vs_Heap_Memory]]
