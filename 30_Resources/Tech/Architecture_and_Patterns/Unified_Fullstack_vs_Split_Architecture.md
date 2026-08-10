---
title: Unified Fullstack Architecture vs Split Repository Architecture
tags: [type/concept, topic/tech, topic/architecture, layer/architecture]
created: 2026-06-20
description: "Phân tích so sánh chi tiết giữa mô hình Fullstack gộp (Next.js Monorepo) và mô hình chia tách repo Backend/Frontend."
---

# Unified Fullstack Architecture vs. Split Repository Architecture

## TL;DR

Kiến trúc Fullstack đồng nhất (Unified Fullstack - sử dụng Next.js App Router + Monorepo) gộp cả Frontend và Backend vào chung một codebase, trái ngược với kiến trúc chia tách (Split Architecture) chia thành 2 repository Backend (Node/Go/Java) và Frontend (React SPA) riêng biệt. Lựa chọn này mang lại lợi thế vượt trội về **End-to-End Type Safety** (Drizzle ORM truyền type trực tiếp lên UI), **tối ưu hóa hiệu năng render (zero network overhead từ Server Components đến DB)**, đơn giản hóa vận hành (DevOps/CORS) và tăng tốc độ phát triển (DX), đánh đổi lại bằng việc tăng độ phức tạp trong quản lý Monorepo và phụ thuộc công nghệ vào hệ sinh thái Next.js.

---

## Core Concept

### 1. Tại sao lại gộp chung thay vì tách riêng?

- **End-to-End Type Safety (Tính an toàn kiểu từ DB đến UI):**
  - _Kiến trúc tách biệt:_ Khi Backend thay đổi một cột trong DB hoặc định dạng JSON trả về của API, Frontend sẽ bị lỗi chạy (runtime error) trừ khi lập trình viên cập nhật thủ công các file định nghĩa kiểu dữ liệu (hoặc dùng các tool sinh code phức tạp từ Swagger/OpenAPI).
  - _Kiến trúc đồng nhất (Next.js/Drizzle):_ Database schema được định nghĩa bằng TypeScript. Các Server Actions hoặc Server Components import trực tiếp schema/DTO này. Nếu bạn đổi tên một trường trong DB, TypeScript compiler sẽ báo lỗi đỏ lòm ngay lập tức tại Component Frontend lúc compile. Không cần viết code API client, không sợ lệch kiểu dữ liệu.
- **Tối ưu hóa hiệu năng Render (Không hao tổn mạng giữa Server-to-Server):**
  - _Kiến trúc tách biệt:_ Khi render trang phía Server (SSR), máy chủ Frontend phải thực hiện các cuộc gọi HTTP REST API qua mạng đến máy chủ Backend để lấy dữ liệu. Việc này làm tăng độ trễ mạng (Network Latency) đáng kể trước khi có thể trả HTML về cho trình duyệt.
  - _Kiến trúc đồng nhất (Next.js RSC):_ React Server Components gọi trực tiếp tầng Service Layer (`DbOrderService`) để truy vấn cơ sở dữ liệu qua Connection Pool nội bộ. **Hao tổn mạng giữa FE và BE là bằng 0**, giúp tối ưu hóa tối đa chỉ số TTFB (Time to First Byte).
- **Đơn giản hóa DevOps và Vận hành:**
  - Không cần cấu hình CORS (Cross-Origin Resource Sharing) vì cả Frontend và Backend chạy chung trên một tên miền.
  - Chỉ cần bảo trì một đường ống CI/CD (Pipeline) duy nhất. Một lệnh deploy duy nhất sẽ đẩy toàn bộ ứng dụng lên sản phẩm, không sợ lệch phiên bản giữa Frontend và Backend.
- **Chia sẻ code validation cực kỳ dễ dàng:**
  - Chúng ta có thể dùng chung các schema **Zod** để kiểm tra tính hợp lệ của dữ liệu ở cả Client (React Hook Form hiển thị lỗi ngay khi gõ) và Server (Server Actions validate lại trước khi ghi vào Database), loại bỏ hoàn toàn việc viết lặp lại code kiểm tra ở hai phía.

### 2. Các Đánh đổi cần lưu ý

| Tiêu chí                 | Kiến trúc Fullstack đồng nhất (Next.js)                             | Kiến trúc chia tách (FE/BE rời)                                           |
| :----------------------- | :------------------------------------------------------------------ | :------------------------------------------------------------------------ |
| **Độ độc lập của Team**  | Thấp hơn (phù hợp với các team Fullstack nhỏ-vừa, tốc độ nhanh).    | Cao (phù hợp với doanh nghiệp lớn, team FE và BE tách biệt chuyên môn).   |
| **Phụ thuộc công nghệ**  | Cao (phụ thuộc chặt chẽ vào Next.js và hệ sinh thái React).         | Thấp (Backend có thể viết bằng Go, Java; Frontend bằng React, Vue tùy ý). |
| **Độ phức tạp Monorepo** | Cần quản lý cấu hình workspace chung (Turborepo, tsconfig, eslint). | Dễ quản lý ban đầu nhưng khó đồng bộ cấu hình, thư viện dùng chung.       |

---

## Practical Implementation

### 1. Sự khác biệt về luồng gọi dữ liệu

#### Cách 1: Kiến trúc chia tách truyền thống

```
[Browser] ──(1. Request HTML)──> [NextJS Node Server]
                                         │
                                 (2. HTTP GET /api/products) -> [Backend Go Server]
                                         │
                                   [PostgreSQL]
```

#### Cách 2: Kiến trúc gộp Next.js RSC

```
[Browser] ──(1. Request HTML)──> [NextJS Server Component] ──(2. DB Query)──> [PostgreSQL]
```

### 2. Sử dụng chung Zod Schema qua ranh giới

Schema định nghĩa dữ liệu đầu vào được lưu ở gói dùng chung (`@nhatnang/database` hoặc `@nhatnang/shared`) và import ở cả hai phía:

```typescript
// packages/shared/src/validators/auth.ts (Gói dùng chung)
import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
```

- Ở Frontend: Import dùng cho `react-hook-form` để validate tức thì.
- Ở Backend Server Action: Import dùng cho kiểm tra đầu vào trước khi SELECT DB.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Kiến trúc thư mục monorepo: [[Turborepo]]
- Ranh giới thực thi Client-Server: [[React_Server_Components]]
