---
tags:
  - type/concept
  - topic/javascript
  - topic/typescript
  - topic/frontend
  - layer/core-mechanics
date: 2026-06-07
aliases:
  - Tree Shaking
  - Dead Code Elimination
  - Tối ưu hóa bundle JS
  - DCE
description: "Kỹ thuật phân tích tĩnh cấu trúc cây cú pháp trừu tượng (AST) dựa trên cú pháp tĩnh của ES Modules nhằm loại bỏ mã nguồn không được sử dụng khỏi bundle cuối cùng."
---

# Tree Shaking

## TL;DR

- **Bản chất**: Kỹ thuật tối ưu hóa mã nguồn trong quá trình đóng gói (Bundling / Compilation) dựa trên phân tích tĩnh (Static Analysis) cấu trúc cây cú pháp (AST) để định vị và loại bỏ hoàn toàn các hàm, biến, hoặc module không bao giờ được tham chiếu (Dead Code Elimination).
- **Mục đích**: Giảm thiểu tối đa dung lượng file JavaScript phân phối tới client (Client Bundle Size), rút ngắn thời gian tải mạng (Network Transfer) và thời gian phân tích/thực thi mã nguồn của JavaScript Engine (Parse & Compile Time).
- **Điểm mấu chốt**: Tree Shaking chỉ hoạt động hoàn hảo trên **ES Modules (ESM: `import` / `export`)** nhờ tính chất tĩnh bất biến (Static Structure); hoàn toàn bất lực trước tính năng nạp động (Dynamic Resolution) của CommonJS (`require()`).

---

## Core Concept

```mermaid
flowchart LR
    subgraph Source_Code [Mã nguồn Utility Library]
        F1[export function formatCurrency]
        F2[export function calculateVAT]
        F3[export function unusedHeavyChart]
    end

    subgraph Entry_Point [Ứng dụng App.ts]
        Import[import { formatCurrency } from './utils']
        Call[formatCurrency(1000)]
    end

    subgraph Bundler [Bundler AST Traversal: Webpack / Rollup / esbuild]
        AST[Build Module Dependency Graph]
        Shake[Shake Tree: Drop Unreachable Nodes]
    end

    subgraph Production_Bundle [Output Bundle]
        Out1[formatCurrency]
    end

    F1 --> Import --> AST --> Out1
    F2 -.->|Unused| Shake
    F3 -.->|Dead Code Dropped| Shake
```

### 1. Tại sao CommonJS không thể Tree Shake hiệu quả?

- **CommonJS (`require()`) mang tính động (Dynamic Evaluation)**:
  ```javascript
  // CommonJS cho phép nạp module phụ thuộc vào điều kiện runtime:
  if (isProduction) {
    const { report } = require("./prod-reporter");
  }
  ```
  Bundler không thể dự đoán được module nào sẽ được nạp khi chỉ phân tích code tĩnh trước thời gian chạy.
- **ES Modules (`import/export`) mang tính tĩnh (Static Declarations)**:
  ```javascript
  import { formatCurrency } from "./utils";
  ```
  Câu lệnh `import` bắt buộc phải nằm ở top-level, không thể nằm trong `if/else`, giúp Bundler duyệt đồ thị phụ thuộc (Dependency Graph) và xác định chắc chắn 100% hàm nào có người gọi trước khi chạy code.

### 2. Yếu tố phá hoại Tree Shaking: Side Effects

Nếu một module thực hiện các tác vụ thay đổi trạng thái toàn cục khi vừa được `import` (ví dụ: gán biến vào `window`, can thiệp prototype, hoặc khởi tạo polyfill), Bundler sẽ **không dám xóa module đó** vì sợ làm hỏng ứng dụng.

- **Giải pháp**: Khai báo cờ `"sideEffects": false` trong `package.json` để báo hiệu cho Bundler rằng toàn bộ file trong package thuần khiết (Pure Functions) và an toàn để xóa bỏ nếu không được gọi trực tiếp.

---

## Practical Implementation

### 1. Cấu hình `package.json` cho Thư viện (Library Authoring)

```json
{
  "name": "@company/shared-utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "sideEffects": ["*.css", "./src/polyfills.ts"]
}
```

### 2. Tránh Anti-pattern Barrel Files làm hỏng Tree Shaking

```typescript
// ❌ ANTI-PATTERN: Gộp toàn bộ export vào một index.ts khổng lồ có side-effects
export * from "./auth";
export * from "./heavy-chart"; // Nếu file này import thư viện 5MB, toàn bộ app có thể bị kéo theo

// ✅ BEST PRACTICE: Thiết kế Atomic Modular Exports hoặc Export độc lập
import { formatCurrency } from "@company/shared-utils/formatters";
```

### 3. Kiểm định kết quả Tree Shaking qua CLI (esbuild)

```bash
# Đóng gói và phân tích bundle để kiểm tra dead code đã bị loại bỏ:
esbuild src/index.ts --bundle --minify --format=esm --analyze
```

---

## Related Notes

- [[TS_Type_System_Structural_Type_Erasure]]
- [[JS_V8_Hidden_Classes_Inline_Caching]]
- [[NextJS_Monorepo_Package_Transpilation]]
- [[Turborepo]]
