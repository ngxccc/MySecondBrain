---
tags: [type/concept, topic/javascript, topic/tech, layer/core-mechanics]
aliases: [Hidden Classes, Shapes, Inline Caching, JS Optimization]
date: 2026-06-20
description: "Trong JavaScript, các đối tượng (Objects) thực chất là các Hash Map động, khiến việc truy cập thuộc tính (property lookup) theo mặc định rất chậm do phải băm chuỗi. Để tối ưu hóa, các JS Engine hiệ..."
---

# JS Hidden Classes & Inline Caching

## TL;DR

Trong JavaScript, các đối tượng (Objects) thực chất là các Hash Map động, khiến việc truy cập thuộc tính (property lookup) theo mặc định rất chậm do phải băm chuỗi. Để tối ưu hóa, các JS Engine hiện đại (như V8 của Google, JavaScriptCore của Apple) tự động tạo ra các **Class ẩn (Hidden Classes / Shapes)** ngầm bên dưới để ánh xạ vị trí thuộc tính trong bộ nhớ tĩnh (offsets). Kết hợp với cơ chế **Inline Caching (IC)**, Engine có thể truy cập bộ nhớ trực tiếp không qua tìm kiếm Hash Map, đạt hiệu năng tương đương C++. Việc gán thuộc tính động hoặc gán sai thứ tự sẽ phá vỡ cơ chế này, bắt buộc Engine phải quay về chế độ tìm kiếm chậm (Dictionary Mode).

---

## Core Concept

### 1. Tại sao JavaScript động lại chậm?

Ở các ngôn ngữ biên dịch tĩnh (như C++, Java, Rust), kiểu dữ liệu và cấu trúc class được xác định trước khi chạy. Trình biên dịch biết rõ vị trí chính xác (offset) của từng thuộc tính trong bộ nhớ (ví dụ: `x` nằm ở byte 0, `y` nằm ở byte 8). Việc truy xuất thuộc tính chỉ là một lệnh CPU nhảy thẳng đến địa chỉ đó ($O(1)$ tức thời).

Trong JavaScript, thuộc tính có thể được thêm, bớt động tại runtime. Nếu không có tối ưu hóa, mỗi lần bạn viết `obj.x`, Engine phải tìm kiếm chuỗi khóa `"x"` trong Hash Map của object, điều này tốn rất nhiều chuỗi lệnh CPU (String Hashing, Hash Collision handling).

### 2. Giải pháp của JS Engine: Hidden Classes

Để đạt hiệu năng của ngôn ngữ tĩnh, JS Engine tạo ra các Class ẩn ngầm tại runtime:

- Mỗi khi một object được tạo ra, nó được gán cho một Class ẩn (V8 gọi là _Hidden Class_, JavaScriptCore gọi là _Shape_).
- Class ẩn này lưu giữ thông tin ánh xạ: tên thuộc tính $\rightarrow$ vị trí offset của nó trong bộ nhớ.
- Nếu hai object được tạo ra có chung chính xác các thuộc tính và theo cùng thứ tự, chúng sẽ **dùng chung một Class ẩn**.

### 3. Chuỗi chuyển đổi Class ẩn

Khi bạn gán thuộc tính động, Engine phải tính toán lại địa chỉ và tạo ra một chuỗi các Class ẩn chuyển tiếp:

```
const obj = {};        // (1) Tạo Class_0 (Rỗng)
obj.x = 1;            // (2) Chuyển tiếp: Class_0 -> Class_1 (Có 'x' ở offset 0)
obj.y = 2;            // (3) Chuyển tiếp: Class_1 -> Class_2 (Có 'x' ở offset 0, 'y' ở offset 8)
```

Nếu một object khác được gán theo thứ tự ngược lại (`obj.y = 2` trước `obj.x = 1`), V8 sẽ tạo ra một nhánh chuyển tiếp khác (`Class_3` và `Class_4`). Hai object này lúc này sẽ có hai Class ẩn hoàn toàn khác nhau, dù chúng chứa các thuộc tính giống hệt nhau.

### 4. Inline Caching là gì?

Inline Caching là kỹ thuật ghi nhớ kết quả của cuộc tìm kiếm thuộc tính trước đó trực tiếp tại điểm gọi mã (call site).

- Lần đầu tiên hàm `getX(obj)` chạy, V8 tìm kiếm vị trí của `x` và ghi nhớ: _"Nếu object truyền vào thuộc Class ẩn X, thì thuộc tính x nằm ở offset 0"_.
- Các lần chạy sau, V8 chỉ kiểm tra xem object mới có thuộc `Class X` hay không. Nếu đúng, nó nhảy thẳng tới offset 0 lấy dữ liệu.
- Nếu object truyền vào thuộc nhiều Class ẩn khác nhau (Polymorphic hoặc Megamorphic), Inline Caching sẽ thất bại, V8 phải quay lại tìm kiếm chậm trong Dictionary Mode.

---

## Practical Implementation

### So sánh Code Tối ưu và Không Tối ưu

#### 1. Code phản mẫu : Gán động và Sai thứ tự

```javascript
// Phản mẫu 1: Gán động khiến V8 phải tạo chuỗi chuyển tiếp Class ẩn liên tục
const user1 = {};
user1.name = "Ngoc";
user1.age = 22;

// Phản mẫu 2: Khác biệt về thứ tự gán thuộc tính phá vỡ Inline Caching
function createUser(name, age, isContractor) {
  const user = {};
  if (isContractor) {
    user.isContractor = true;
    user.name = name;
    user.age = age;
  } else {
    user.name = name;
    user.age = age;
    user.isContractor = false;
  }
  return user; // Trả về hai object có Class ẩn khác nhau (phá vỡ IC)
}
```

#### 2. Code chuẩn tối ưu hiệu năng cao

Khởi tạo toàn bộ thuộc tính ngay trong cấu trúc khai báo ban đầu hoặc sử dụng một Class Constructor thống nhất:

```typescript
// Tốt nhất: Khởi tạo đầy đủ thuộc tính và đồng nhất thứ tự từ đầu
interface User {
  name: string;
  age: number;
  isContractor: boolean;
}

function createUser(name: string, age: number, isContractor: boolean): User {
  // V8 chỉ tạo duy nhất 1 Class ẩn dùng chung cho mọi User
  return {
    name,
    age,
    isContractor,
  };
}
```

### 3. Runnable Benchmark

Bạn có thể lưu đoạn code sau thành file `benchmark.js` và chạy trực tiếp bằng lệnh `bun benchmark.js` hoặc `node benchmark.js` để tự kiểm chứng sự chênh lệch hiệu năng:

```javascript
const iterations = 10000000; // 10 triệu vòng lặp

// Case 1: Đối tượng có cấu trúc ổn định (Stable Object Shape)
console.time(" Stable Shape (Optimized)");
for (let i = 0; i < iterations; i++) {
  const obj = { x: i, y: i + 1 };
  const z = obj.x + obj.y;
}
console.timeEnd(" Stable Shape (Optimized)");

// Case 2: Đối tượng gán thuộc tính động (Dynamic Shape / Class Transition)
console.time(" Dynamic Shape (Unoptimized)");
for (let i = 0; i < iterations; i++) {
  const obj = {};
  obj.x = i;
  obj.y = i + 1;
  const z = obj.x + obj.y;
}
console.timeEnd(" Dynamic Shape (Unoptimized)");
```

- **Kết quả thực tế:** Case 1 (Stable Shape) thường chạy nhanh hơn **2 đến 5 lần** so với Case 2 do được JIT Compiler biên dịch trực tiếp và truy cập offset bộ nhớ tĩnh không qua chuyển đổi Class ẩn liên tục.

---

## Interview Prep

### Q1: Tại sao việc gán thuộc tính động trong JavaScript lại làm giảm hiệu năng thực thi của Engine?

- **Trả lời:** JavaScript là ngôn ngữ động, để truy cập thuộc tính nhanh như ngôn ngữ tĩnh, các Engine (V8, JSC) sử dụng cơ chế Class ẩn (Hidden Class/Shape). Khi ta gán thuộc tính động, Engine phải thực hiện chuỗi chuyển đổi Class ẩn (Class Transition) và tính toán lại các offset bộ nhớ tĩnh. Nếu thứ tự gán thuộc tính khác nhau, Engine sẽ tạo ra nhiều Class ẩn khác nhau, phá vỡ bộ đệm Inline Caching (IC) và buộc Engine phải quay về chế độ tìm kiếm Hash Map (Dictionary Mode) chậm chạp.

### Q2: Em làm thế nào để viết code JavaScript tối ưu hóa hiệu năng chạy cho Node.js/Bun Backend?

- **Trả lời:** Em luôn tuân thủ nguyên tắc giữ cho cấu trúc đối tượng ổn định (stable object shapes):
  1. Khởi tạo toàn bộ thuộc tính của đối tượng ngay trong biểu thức khai báo `{}` hoặc thông qua Constructor của Class.
  2. Không bao giờ xóa thuộc tính (`delete obj.x`) vì hành động này lập tức đưa đối tượng về Dictionary Mode.
  3. Đảm bảo thứ tự các thuộc tính luôn đồng nhất khi khởi tạo để các đối tượng dùng chung một Class ẩn, tối ưu hóa tối đa bộ đệm Inline Caching.

### Q3: Inline Caching hoạt động ra sao và mối liên hệ của nó với Hidden Classes?

- **Trả lời:** Inline Caching (IC) ghi nhớ vị trí ô nhớ của thuộc tính trực tiếp tại nơi gọi mã dựa trên Class ẩn của đối tượng. Khi ta truy cập thuộc tính của một đối tượng có cùng Class ẩn nhiều lần, IC giúp bỏ qua bước tìm kiếm trong Hash Map và nhảy thẳng tới ô nhớ chứa giá trị. Nếu đối tượng có cấu trúc thay đổi liên tục, IC sẽ bị vô hiệu hóa (Megamorphic state), làm giảm hiệu năng chạy mã đáng kể.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Quản lý bộ nhớ: [[JS_Stack_vs_Heap_Memory]]
- Sự khác biệt Runtime: [[JS_Runtimes_Bun_vs_NodeJS]]
