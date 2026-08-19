---
tags:
  [
    type/concept,
    topic/tech,
    topic/frontend,
    topic/rendering,
    layer/infrastructure,
  ]
aliases:
  [NextJS 16 Cache Components, NextJS 16 Caching, use cache, Cache Components]
date: 2026-06-20
description: "Mô hình Caching component-level mới của Next.js 16 dùng chỉ thị 'use cache' và cacheLife."
---

# Next.js 16 Cache Components & 'use cache'

## TL;DR

Trong Next.js 16, **Cache Components** (kích hoạt bằng cấu hình `cacheComponents: true` trong `next.config.ts`) chuyển đổi toàn bộ kiến trúc caching của App Router từ mô hình cấp mạng `fetch()` (Request-level cache) sang mô hình cấp hàm/component (Component-level cache) thông qua chỉ thị **`"use cache"`**. Cơ chế này cho phép cache kết quả truy vấn database trực tiếp (ORM), tự động hóa việc tạo cache key dựa trên đối số truyền vào, và cung cấp các chế độ cache riêng tư (`"use cache: private"`) hoặc lưu trữ ngoài (`"use cache: remote"`). Nó cũng là nền tảng mặc định giúp kích hoạt chế độ **Partial Prerendering (PPR)**.

---

## Core Concept

### 1. Tại sao cần Cache Components thay thế cho Fetch Caching?

- Ở các phiên bản Next.js trước, hệ thống ghi đè (monkey-patch) hàm `fetch` toàn cục để lưu cache. Điều này gây khó khăn khi cần cache dữ liệu không qua giao thức HTTP (như query SQL trực tiếp từ Drizzle ORM, gọi SDK Redis/Cloudinary) và dễ gây xung đột khi lồng ghép cache.
- Mô hình mới giải quyết triệt để bằng chỉ thị `"use cache"`, cho phép cache trực tiếp bất kỳ hàm bất đồng bộ (async function) hoặc Component nào một cách tường minh và an toàn.

### 2. Các biến thể của chỉ thị `"use cache"`

- **`"use cache"` (Public):** Cache được chia sẻ cho toàn bộ người dùng hệ thống. Thích hợp cho danh mục sản phẩm, cấu hình cửa hàng.
- **`"use cache: private"` (Personalized):** Cache riêng biệt cho từng người dùng cụ thể. Next.js tự động nhận diện ID phiên đăng nhập (Session) để phân chia luồng cache, thích hợp cho thông tin giỏ hàng, hồ sơ cá nhân.
- **`"use cache: remote`" (Distributed):** Lưu trữ cache trên các máy chủ cache ngoài (như Redis) để không bị mất cache khi rebuild dự án hoặc restart server.

### 3. Sự phối hợp giữa `"use cache"`, `connection()` và PPR

Trong Next.js 16, khi bật `cacheComponents: true`, cơ chế **Partial Prerendering (PPR)** sẽ được kích hoạt mặc định:

- **Static Shell:** Các component tĩnh hoặc các component có chỉ thị `"use cache"` sẽ được biên dịch trước lúc build và xuất ra thành tệp HTML tĩnh tải siêu nhanh.
- **Dynamic Hole:** Khi trình biên dịch tĩnh gặp một component động sử dụng các API động (như `connection()`, `headers()`, `cookies()`) mà **không có** chỉ thị `"use cache"`, nó sẽ hoãn (defer) việc render phần đó lại và biến nó thành một "hố động" (Dynamic Hole).
- **Streaming:** Lúc chạy thực tế (runtime), máy chủ sẽ lập tức gửi Static Shell về cho client trước, sau đó stream tiếp kết quả của Dynamic Hole ngay khi server xử lý xong thông qua React Suspense.

---

## Practical Implementation

### 1. Caching kết quả truy vấn Database và cấu hình Cache Life

- **Nguyên tắc:** `cacheLife` và `cacheTag` phải được import từ **`next/cache`** (không phải `next/navigation`).

```typescript
// packages/database/src/services/product/product.service.ts
import { cacheLife } from "next/cache";

export async function getTopSellingProducts() {
  "use cache"; // Cache toàn bộ kết quả của hàm này
  cacheLife("hours"); // Sử dụng profile cache thời hạn 1 giờ

  return await db.select().from(products).limit(10);
}
```

### 2. Caching theo thẻ và Hard Purge

```typescript
import { cacheLife, cacheTag } from "next/cache";

export async function getProductCatalogMetadata() {
  "use cache";
  cacheLife("days");
  cacheTag("catalog-metadata");

  return await db.select().from(products);
}

// Revalidate ở Server Action (ví dụ khi Admin cập nhật sản phẩm)
import { revalidateTag } from "next/cache";

export async function updateProductAdminAction() {
  "use server";
  // 1. Logic cập nhật DB...

  // 2. Revalidate cache
  // Chế độ Stale-While-Revalidate (Mặc định)
  revalidateTag("catalog-metadata", "default");

  // Chế độ Hard Purge (Hết hạn ngay lập tức)
  // revalidateTag("catalog-metadata", { expire: 0 });
}
```

---

## Interview Prep

### Q1: Chỉ thị `"use cache"` trong Next.js 16 khác gì so với hàm `unstable_cache` ở các phiên bản trước?

- **Trả lời:** `unstable_cache` là một hàm bọc bên ngoài logic (wrapper function), yêu cầu bạn phải truyền mảng các khóa cache (cache keys) thủ công rất dễ sai sót. Còn `"use cache"` là một chỉ thị dạng tuyên bố (declarative directive). Khi khai báo bên trong hàm, Next.js Compiler sẽ tự động phân tích và serialize toàn bộ các tham số truyền vào của hàm cũng như các biến đóng (closure variables) từ scope cha để tự động sinh ra cache key an toàn 100%.

### Q2: Cơ chế hoạt động phối hợp giữa `"use cache"` và `connection()` trong Next.js 16 là gì?

- **Trả lời:** Chúng đại diện cho hai đầu đối lập của luồng tối ưu hóa render:
  - `connection()` là một API chỉ thị **Dynamic Opt-out**: thông báo cho Next.js ngắt quá trình render tĩnh tại thời điểm build vì phần code này cần request context thực tế ở runtime (Dynamic Hole).
  - `"use cache"` là một chỉ thị **Static Opt-in**: thông báo cho Next.js bất kể ngữ cảnh xung quanh là động hay tĩnh, kết quả của hàm/component này phải được cache lại (Static Shell).
  - Khi chạy PPR, Next.js sẽ render tĩnh phần chứa `"use cache"`, chừa lại phần chứa `connection()` để stream sau.

### Q3: Tham số truyền vào hàm sử dụng `"use cache"` cần lưu ý điều gì về mặt kỹ thuật?

- **Trả lời:** Tất cả các tham số truyền vào hàm có `"use cache"` bắt buộc phải là **Serializable** (có thể tuần tự hóa thành JSON). Nếu bạn cố tình truyền một hàm callback, một Class instance phức tạp hoặc một Database Connection vào hàm này, trình biên dịch sẽ báo lỗi vì Next.js không thể chuyển đổi chúng thành cache key.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Cơ chế ngắt Prerender: [[NextJS_Dynamic_Opt_Out_Connection]]
- Kế thừa Layout và Route Groups: [[NextJS_Route_Groups_and_Nested_Layouts]]
