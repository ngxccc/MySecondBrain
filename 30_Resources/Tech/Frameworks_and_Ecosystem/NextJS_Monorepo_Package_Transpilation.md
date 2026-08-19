---
tags: [type/concept, topic/tech, topic/frontend, topic/devops]
aliases: [Package Transpilation, transpilePackages, Monorepo Transpilation]
date: 2026-06-20
description: "Cơ chế biên dịch gói nội bộ (transpilePackages) và tối ưu hóa build trong Turborepo."
---

# Next.js Monorepo & Package Transpilation

## TL;DR

Khi xây dựng ứng dụng với kiến trúc Monorepo (sử dụng Turborepo/Yarn/Bun Workspaces), Next.js mặc định không biên dịch (transpile) mã nguồn bên trong `node_modules` hoặc các liên kết cục bộ (symlinked workspace packages). Điều này dẫn đến lỗi build/compile khi ứng dụng Next.js import trực tiếp mã nguồn TypeScript hoặc JSX chưa qua biên dịch từ các gói nội bộ (như `@nhatnang/database`, `@nhatnang/ui`). Để giải quyết, Next.js cung cấp cấu hình `transpilePackages` để buộc compiler (SWC/Turbopack) biên dịch các gói này trên luồng chạy chính. Bài viết này phân tích bản chất, cách cấu hình và so sánh giữa giải pháp transpilation on-the-fly với phương pháp biên dịch trước (Pre-building).

---

## Core Concept

### 1. Tại sao xảy ra lỗi Biên dịch khi Import gói nội bộ?

- **Cơ chế mặc định:** Trình đóng gói (bundler) của Next.js bỏ qua toàn bộ thư mục `node_modules` trong quá trình biên dịch vì giả định các thư viện bên thứ ba đã được xuất bản (publish) dưới dạng mã JavaScript tương thích cao (ES5/ES6 tiêu chuẩn).
- **Vấn đề trong Monorepo:** Các gói nội bộ dùng chung (internal packages) thường được liên kết qua cơ chế workspace (`"dependency": "workspace:*"`). Khi chạy, trình quản lý gói sẽ tạo các liên kết tượng trưng (symlinks) trỏ đến mã nguồn chưa biên dịch (raw TypeScript/JSX).
- **Kết quả:** Next.js coi các symlinks này như `node_modules` thông thường và bỏ qua chúng, dẫn đến lỗi cú pháp nghiêm trọng khi chạy ứng dụng (ví dụ: `Module parse failed: Unexpected token` hoặc `You may need an appropriate loader to handle this file type`).

### 2. Giải pháp JIT: `transpilePackages` là gì?

Cấu hình `transpilePackages` (thay thế cho thư viện cũ `next-transpile-modules` từ Next.js v13) là một mảng khai báo các gói cục bộ hoặc bên thứ ba mà Next.js cần biên dịch trực tiếp bằng SWC/Turbopack cùng với mã nguồn của ứng dụng chính.

- Khi ứng dụng build hoặc dev, trình biên dịch sẽ quét qua mã nguồn của các gói này, áp dụng các thiết lập transpile (như loại bỏ kiểu dữ liệu TypeScript, biên dịch JSX sang JS).

### 3. Giải pháp AOT: Pre-building

Thay vì bắt Next.js gánh toàn bộ trách nhiệm biên dịch mã nguồn của các gói khác tại runtime, ta có thể xây dựng quy trình biên dịch trước (Pre-build/Ahead-Of-Time) cho từng package:

- Sử dụng các công cụ biên dịch siêu tốc như **`tsup`** (dựa trên esbuild) để đóng gói mã nguồn của package thành định dạng JavaScript chuẩn (ESM/CJS) và tạo file khai báo kiểu `.d.ts`.
- Cấu hình trường `exports` trong `package.json` của package để trỏ trực tiếp đến các file build đã xuất ra trong thư mục `dist/` thay vì mã nguồn gốc.

### 4. So sánh hai giải pháp

| Tiêu chí                 | On-the-fly (`transpilePackages`)                                                                                                                                  | Pre-building (`tsup` + `exports`)                                                                                                    |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Trải nghiệm Dev (DX)** | **Cực tốt:** Sửa code ở package nội bộ sẽ kích hoạt Next.js Hot Module Replacement (HMR) / Fast Refresh ngay lập tức mà không cần chạy watcher ngầm.              | **Kém hơn:** Cần chạy watcher ngầm (`tsup --watch` hoặc `turbo dev`) để biên dịch lại file khi có thay đổi.                          |
| **Hiệu năng Compile**    | **Chậm dần khi quy mô tăng:** SWC/Turbopack phải gánh thêm phân tích cú pháp cho hàng ngàn file từ package, làm tăng thời gian cold-start và compile của Next.js. | **Rất nhanh:** Next.js chỉ việc đọc mã JS đã biên dịch sẵn trong `dist/`. Tối ưu hóa cực lớn cho CI/CD nhờ Turborepo Remote Caching. |
| **Độ phức tạp cấu hình** | **Thấp:** Chỉ cần thêm một dòng khai báo tên package vào `next.config.ts`.                                                                                        | **Trung bình-Cao:** Phải cấu hình build toolchain (`tsup.config.ts`), exports map, và script build trong từng package.               |
| **Độ độc lập**           | **Thấp:** Package bị phụ thuộc vào compiler của ứng dụng tiêu thụ (chỉ dùng được với Next.js).                                                                    | **Cao:** Package có thể được tiêu thụ bởi bất kỳ framework nào khác (Vite, Express, Node.js).                                        |

---

## Practical Implementation

### 1. Cấu hình `transpilePackages` và `optimizePackageImports`

Dự án Hyundai E-commerce áp dụng giải pháp JIT (`transpilePackages`) cho cả 3 gói nội bộ dùng chung, đồng thời kết hợp `optimizePackageImports` để tối ưu hóa hiệu năng build và HMR đối với các thư viện giao diện lớn:

```typescript
// apps/storefront/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bắt buộc Next.js SWC/Turbopack biên dịch mã nguồn của 3 package nội bộ này
  transpilePackages: ["@nhatnang/database", "@nhatnang/shared", "@nhatnang/ui"],

  experimental: {
    // Bỏ qua việc transpile/load toàn bộ thư viện, chỉ transpile các module thực sự được import
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
      "@radix-ui/react-select",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "react-hook-form",
    ],
  },
};

export default nextConfig;
```

- **Vai trò song song:** Trong khi `transpilePackages` đảm bảo _mã nguồn chưa compile_ của các gói nội bộ được biên dịch đúng cách, `optimizePackageImports` lại tối ưu bằng cách đảm bảo Next.js chỉ nạp và xử lý các hàm/component riêng lẻ được sử dụng từ các thư viện giao diện lớn (như Radix UI, Lucide) thay vì biên dịch toàn bộ thư viện đó. Điều này giúp giảm đáng kể thời gian khởi động môi trường dev và giữ bộ nhớ đệm (HMR cache) ở mức tối thiểu.

### 2. Cấu hình TSConfig để hỗ trợ Type-Safety

Để VS Code và trình biên dịch TypeScript hiểu và gợi ý kiểu dữ liệu (Auto-complete) cho các gói này khi chúng ta đang dev, cấu hình `moduleResolution` bắt buộc phải là `"bundler"` hoặc `"node"`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "paths": {
      "@nhatnang/database/*": ["../../packages/database/src/*"],
      "@nhatnang/shared/*": ["../../packages/shared/src/*"],
      "@nhatnang/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

### 3. Cấu hình thay thế cho `@nhatnang/shared`

Nếu chuyển sang mô hình Pre-build để tối ưu hiệu suất build của Next.js 16:

```typescript
// packages/shared/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true, // Tạo file khai báo kiểu dữ liệu .d.ts
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

Cấu hình xuất bản trong `packages/shared/package.json`:

```json
{
  "name": "@nhatnang/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  }
}
```

---

## Interview Prep

### Q1: Tại sao chúng ta cần `transpilePackages` trong Monorepo Next.js? Nếu không cấu hình thì bị lỗi gì?

- **Trả lời:** Theo mặc định, Next.js bỏ qua việc compile các tệp bên trong thư mục `node_modules` (và các package liên kết qua workspace symlinks) để tối ưu hiệu năng build. Nếu các package nội bộ này chứa mã nguồn TypeScript thô hoặc JSX chưa compile, Next.js sẽ ném ra lỗi cú pháp (`Module parse failed` hoặc `Unexpected token`) khi chạy dev/build do không hiểu được cú pháp TypeScript/JSX. Khai báo `transpilePackages` yêu cầu Next.js Compiler chạy SWC biên dịch trực tiếp các gói này cùng với dự án.

### Q2: So sánh hiệu năng build giữa `transpilePackages` và việc build trước package bằng `tsup`? Bạn sẽ chọn giải pháp nào khi dự án phình to?

- **Trả lời:**
  - `transpilePackages` mang lại trải nghiệm dev rất tốt vì hỗ trợ HMR/Fast Refresh tức thì mà không cần chạy watcher phụ. Tuy nhiên, nó tăng tải cho compiler của Next.js khi phải phân tích cú pháp và biên dịch thêm nhiều file từ các package khác, đặc biệt là khi dùng với Turbopack trong Next.js 16.
  - Nếu dự án phình to với hàng chục package dùng chung, tôi sẽ chuyển sang phương pháp **Pre-building** dùng `tsup` hoặc `unbuild`. Tuy yêu cầu dev phải chạy thêm watcher (`turbo dev`), nó giải phóng Next.js khỏi việc compile mã nguồn của các package kia, cải thiện đáng kể tốc độ HMR và thời gian build trên CI/CD thông qua cơ chế lưu đệm (Caching) của Turborepo.

### Q3: Turbopack trong Next.js 16 ảnh hưởng như thế nào đến việc xử lý các package nội bộ này?

- **Trả lời:** Turbopack được tối ưu hóa bằng Rust và có cơ chế xử lý đồ thị phụ thuộc (dependency graph) cực kỳ nhanh. Khi kết hợp với `transpilePackages`, Turbopack biên dịch các gói nội bộ này nhanh hơn Webpack rất nhiều lần. Tuy nhiên, do là một trình đóng gói mới, Turbopack đòi hỏi cấu hình phân giải module (`moduleResolution: "bundler"`) và export maps trong các package nội bộ phải cực kỳ nghiêm ngặt và chuẩn ESM để tránh gặp lỗi resolving.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- So sánh Monorepo vs Multi-repo: [[Unified_Fullstack_vs_Split_Architecture]]
- Công cụ build Monorepo: [[Turborepo]]
