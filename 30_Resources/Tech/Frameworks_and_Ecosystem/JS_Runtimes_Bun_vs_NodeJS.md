---
tags:
  [
    type/concept,
    topic/tech,
    layer/core-mechanics,
    framework/nodejs,
    runtime/bun,
    engine/v8,
    engine/jsc,
  ]
aliases: [Bun vs Node.js, JS Runtimes, Event Loop Runtime, JSC vs V8]
date: 2026-06-20
description: "So sánh kiến trúc runtime Bun (JavaScriptCore + Zig) vs Node.js (V8 + Libuv) và cơ chế Event Loop cốt lõi."
---

# JS Runtime Architecture: Bun vs. Node.js

## TL;DR

Sự khác biệt cốt lõi về mặt kiến trúc giữa **Bun** và **Node.js** nằm ở công cụ thực thi JavaScript (JavaScript Engine) và thư viện quản lý vòng lặp sự kiện (Event Loop). Trong khi Node.js sử dụng **V8 Engine** (Google) kết hợp với thư viện bất đồng bộ **Libuv** (C-based), Bun lại lựa chọn **JavaScriptCore (JSC)** (Apple) kết hợp với hệ thống runtime tùy biến viết trực tiếp bằng ngôn ngữ **Zig**. Lựa chọn này giúp Bun loại bỏ các chi phí chuyển đổi ngữ cảnh (bridging overhead), tối ưu hóa tốc độ khởi động (startup time) và mang lại hiệu năng vượt trội, đổi lại bằng sự trưởng thành và tính ổn định lâu đời của hệ sinh thái Node.js.

---

## Core Concept

### 1. Kiến trúc Động cơ: JavaScriptCore vs. V8 Engine

Bất kỳ JavaScript Runtime nào cũng cần một Engine lõi để thông dịch và biên dịch mã JavaScript thành mã máy (Machine Code):

- **V8 Engine (Node.js):**
  - Biên dịch JIT (Just-In-Time) qua hai bộ biên dịch chính: _Ignition_ (Interpreter) và _TurboFan_ (Optimizing Compiler).
  - **Garbage Collection (GC):** Sử dụng bộ dọn rác **Orinoco** theo mô hình thế hệ (Generational GC). Chia bộ nhớ thành _New Space_ (các đối tượng sống ngắn, dọn dẹp bằng thuật toán Scavenge) và _Old Space_ (các đối tượng sống lâu, dọn dẹp bằng thuật toán Mark-Sweep-Compact). Cơ chế này được tối ưu hóa cực tốt cho các tác vụ máy chủ dài hạn (server-side).
- **JavaScriptCore (JSC) (Bun):**
  - Sử dụng cấu trúc biên dịch 3 tầng (LLInt - Low Level Interpreter, Baseline JIT, và DFG/FTL JIT) giúp tối ưu hóa thời gian khởi động (startup time) cực nhanh và tiêu thụ ít tài nguyên RAM hơn.
  - **Garbage Collection (GC):** Sử dụng bộ dọn rác phân cấp tối ưu hóa cho di động và trình duyệt (Safari). Bun đã tùy biến và tinh chỉnh lại các tham số dọn rác của JSC để phù hợp với môi trường máy chủ chạy liên tục, tránh hiện tượng dừng hệ thống ("Stop the World" lag).

### 2. Vòng lặp sự kiện: Custom Zig Event Loop vs. Libuv

Cả hai runtime đều hỗ trợ cơ chế lập trình bất đồng bộ đơn luồng (Single-threaded, Non-blocking I/O) theo chuẩn của JavaScript, nhưng cách triển khai ở tầng hệ thống lại hoàn toàn khác nhau:

- **Node.js (`libuv`):**
  - Dựa vào thư viện C-based **`libuv`** để tương tác với nhân hệ điều hành thông qua các cơ chế I/O Multiplexing (`epoll` trên Linux, `kqueue` trên macOS, `IOCP` trên Windows).
  - Mã nguồn Node.js viết bằng JavaScript và C++. Mỗi khi gọi một hàm I/O, V8 phải thực hiện bắc cầu (bridge) dữ liệu qua lại giữa môi trường JS và mã máy C++ của `libuv`, tạo ra chi phí trễ chuyển đổi ngữ cảnh (JS-to-C++ binding overhead).
- **Bun (Zig-native):**
  - Bun tự viết một thư viện chạy vòng lặp sự kiện trực tiếp bằng ngôn ngữ **Zig**.
  - Nhờ Zig có khả năng tương tác trực tiếp không tốn chi phí với nhân hệ điều hành (zero-overhead FFI) và gọi trực tiếp các system calls hệ thống. Bun tích hợp sâu hệ thống I/O trực tiếp vào bên trong các API của JavaScriptCore, loại bỏ hoàn toàn chi phí chuyển đổi ngữ cảnh binding của Node.js.

---

## Practical Implementation

### 1. Luồng chạy của JavaScript Event Loop

Dù chạy trên Bun hay Node.js, thứ tự ưu tiên xử lý các tác vụ trong JavaScript Event Loop vẫn tuân thủ nghiêm ngặt đặc tả ECMA/HTML:

```
[Call Stack] ──(Khi stack trống)──> [Microtask Queue] (Promise.then, queueMicrotask)
                                            │
                                    (Khi Microtask Queue trống)
                                            │
                                            ▼
                                     [Macrotask Queue] (setTimeout, I/O Events, setImmediate)
```

**Thứ tự ưu tiên cốt lõi:**

1. **Call Stack:** Thực thi toàn bộ mã đồng bộ (Synchronous code).
2. **Microtask Queue:** Ngay khi Call Stack trống, chạy _tất cả_ các tác vụ trong Microtask Queue cho đến khi hàng đợi này trống hoàn toàn (bao gồm cả các microtask mới được chèn thêm trong lúc chạy).
3. **Macrotask Queue:** Event Loop sẽ lấy _một_ tác vụ từ Macrotask Queue ra thực thi, sau đó lập tức quay lại kiểm tra và dọn dẹp Microtask Queue trước khi lấy tác vụ macrotask tiếp theo.

### 2. Sự khác biệt về API và Tốc độ Khởi động trong Thực tế

Trong khi Node.js phải import các module cồng kềnh như `fs/promises`, Bun tích hợp sẵn các hàm tối ưu hóa viết bằng Zig:

```typescript
// Node.js: Đọc file bất đồng bộ qua Libuv thread pool
import fs from "node:fs/promises";
const data = await fs.readFile("large_file.txt", "utf-8");

// Bun: Đọc file tối ưu hóa tốc độ cao qua Zig system calls
const data = await Bun.file("large_file.txt").text();
```

---

## Interview Prep

### Q1: Tại sao Bun lại có tốc độ khởi động và hiệu năng I/O nhanh hơn hẳn Node.js?

- **Trả lời:** Có hai lý do kiến trúc cốt lõi:
  1. **Lựa chọn Engine:** Bun sử dụng JavaScriptCore (JSC) vốn được tối ưu hóa cho thời gian khởi động nhanh và ít chiếm RAM hơn V8 Engine của Node.js.
  2. **Tối ưu hóa tầng Runtime (Zig vs Libuv):** Node.js sử dụng Libuv (viết bằng C) và có chi phí binding rất lớn khi truyền dữ liệu qua lại giữa ranh giới JS (V8) và C++ (Libuv). Bun được viết bằng Zig, tích hợp trực tiếp I/O vào JavaScriptCore, loại bỏ hoàn toàn chi phí bắc cầu binding này, cho phép gọi trực tiếp các system calls của hệ điều hành với độ trễ gần như bằng không.

### Q2: Cơ chế Garbage Collection của JavaScriptCore (Bun) khác gì với V8 (Node.js)? Điều này ảnh hưởng gì đến ứng dụng Server?

- **Trả lời:**
  - V8 của Node.js sử dụng bộ dọn rác phân thế hệ (Generational GC - Orinoco) cực kỳ trưởng thành và tối ưu cho các tác vụ server dài hạn, nơi các biến được sinh ra và giải phóng liên tục.
  - JSC của Bun sử dụng bộ dọn rác vốn tối ưu cho client/browser (ưu tiên khởi động nhanh và tiết kiệm RAM). Khi chạy tác vụ server dài hạn, JSC GC có thể gây ra hiện tượng phân mảnh bộ nhớ nếu không được tinh chỉnh. Tuy nhiên, đội ngũ phát triển Bun đã viết lại các thuật toán lập lịch dọn rác (GC scheduling) để buộc JSC thực hiện thu gom rác ngoài các pha xử lý request chính của Event Loop, giúp giảm thiểu độ trễ phản hồi (latency spikes).

### Q3: Thứ tự ưu tiên của Microtask và Macrotask trong Event Loop là gì? Hãy cho biết kết quả in ra của đoạn code sau trên cả Bun và Node.js?

```typescript
console.log("Start");
setTimeout(() => console.log("Macrotask"), 0);
Promise.resolve().then(() => console.log("Microtask"));
console.log("End");
```

- **Trả lời:** Kết quả in ra trên cả Bun và Node.js là hoàn toàn giống nhau:

  ```
  Start
  End
  Microtask
  Macrotask
  ```

  - **Giải thích:**
    1. Mã đồng bộ chạy trước: In ra `Start` và `End`. Hàm `setTimeout` đẩy callback vào Macrotask Queue. `Promise.then` đẩy callback vào Microtask Queue.
    2. Sau khi Call Stack trống, Event Loop ưu tiên dọn sạch Microtask Queue trước: In ra `Microtask`.
    3. Cuối cùng, Event Loop lấy tác vụ tiếp theo từ Macrotask Queue: In ra `Macrotask`.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- So sánh Monorepo vs Multi-repo: [[Unified_Fullstack_vs_Split_Architecture]]
- Cấu hình biên dịch monorepo: [[NextJS_Monorepo_Package_Transpilation]]
