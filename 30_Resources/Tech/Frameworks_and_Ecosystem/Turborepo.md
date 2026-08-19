---
tags: [type/concept, topic/tech, topic/devops, layer/infrastructure]
aliases: [Monorepo, Turbo]
description: "Công cụ xây dựng hiệu suất cao cho các dự án Monorepo sử dụng JavaScript/TypeScript."
---

# Turborepo và Kiến trúc Monorepo

## TL;DR

Turborepo là một công cụ xây dựng (build system) hiệu suất cao cho các dự án Monorepo sử dụng JavaScript/TypeScript. Nó giúp chia sẻ code cực dễ dàng qua cơ chế workspace, quản lý luồng phụ thuộc task (Dependency Graph), và tối ưu tốc độ build cực hạn thông qua Caching.

## Core Concept

- **Tại sao nó tồn tại?** Quản lý nhiều apps và packages trong cùng một repo sinh ra vấn đề thời gian build quá lâu và khó quản lý thứ tự build của các module phụ thuộc nhau.
- **Giải quyết bài toán gì?** Khắc phục vấn đề build lại những phần code không thay đổi (Caching) và thực thi script song song một cách thông minh dựa trên graph.
- **Nó có thay thế cái gì hay không?** Thay thế các công cụ chạy lệnh đồng thời đơn giản (như `concurrently`, `npm-run-all`) hay Lerna cũ kĩ.
- **Áp dụng dụng vào những dự án nào?** Hyundai B2B E-commerce.
- **Cơ chế hoạt động (How it works under the hood).**
  - **Dependency Graph**: Đọc `turbo.json` để biết thằng nào phụ thuộc thằng nào (ví dụ: build database xong mới build admin).
  - **Caching**: Tạo mã băm (hash) cho toàn bộ source code của từng package. Lần build sau nếu hash không đổi, nó bỏ qua build và lôi từ Cache ra luôn, giúp CI/CD giảm từ vài phút xuống vài giây.
  - **Code Sharing**: Kết hợp với tính năng `workspace:*` của trình quản lý package (Bun/npm/yarn), cho phép các app `import` chéo logic của nhau một cách Type-Safe 100%.

## Practical Implementation

### 1. Cấu hình `turbo.json` thực tế

Dưới đây là file `turbo.json` mẫu chuẩn hóa theo schema v2 (sử dụng từ khóa `tasks` thay thế cho `pipeline` cũ):

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "check-types": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

_Giải thích các từ khóa:_

- **`tasks`**: Khai báo các task tương ứng với các lệnh npm scripts trong các package.
- **`dependsOn: ["^build"]`**: Yêu cầu build tất cả các dependencies của package này trước rồi mới build chính nó. Dấu `^` chỉ định package phụ thuộc ở lớp dưới.
- **`outputs`**: Khai báo thư mục/file được lưu vào bộ nhớ đệm (cache) khi task chạy thành công.
- **`cache: false`**: Tắt lưu cache (thường dùng cho môi trường dev chạy liên tục).
- **`persistent: true`**: Khai báo cho Turborepo biết đây là task chạy vô hạn (như dev server) để tránh việc dừng task đột ngột.

### 2. Cấu hình Bun/npm Workspaces

Để trình quản lý gói nhận diện các thư mục ứng dụng và thư viện dùng chung, file `package.json` tại thư mục gốc phải định nghĩa các workspaces:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

### 3. Cách chia sẻ code thông qua protocol `workspace:*`

Khi ứng dụng `apps/frontend` (React) muốn sử dụng thư viện dùng chung `packages/shared`, mày chỉ cần khai báo dependency trong `apps/frontend/package.json`:

```json
{
  "name": "frontend",
  "dependencies": {
    "@repo/shared": "workspace:*"
  }
}
```

Trình quản lý gói (Bun/npm/yarn) sẽ tự động tạo symlink trỏ trực tiếp `@repo/shared` về thư mục nguồn cục bộ, giúp cập nhật code tức thì khi dev.

### 4. Trade-offs & Phỏng vấn

- **Trade-offs**: Cấu hình ban đầu có thể phức tạp. Nếu cấu hình caching sai (`inputs`, `outputs`) có thể dẫn đến việc code cũ bị kẹt trong bộ nhớ đệm (stale cache).
- **Mẫu trả lời phỏng vấn (Flex)**: "Dự án của em có nhiều ứng dụng (Admin, Storefront) xài chung một Database schema và Types. Em dùng kiến trúc Monorepo với Turborepo để dễ dàng chia sẻ code qua protocol `workspace:*` giúp 100% Type-Safe ở mọi app. Điểm em thích nhất ở Turbo là khả năng định nghĩa Task Pipeline trong `turbo.json` giúp chạy các job song song theo đúng dependency graph, kết hợp với cơ chế Caching giúp bỏ qua việc build lại những package không bị thay đổi source code, từ đó tăng tốc độ CI/CD lên rất nhiều lần."

---

**Related Notes:**

- [[NextJS_Route_Groups_and_Nested_Layouts]]
- [[AST_ESLint]]
