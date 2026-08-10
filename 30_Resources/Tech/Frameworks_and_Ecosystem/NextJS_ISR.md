---
tags: [type/concept, topic/tech, topic/rendering]
aliases: [NextJS ISR, Incremental Static Regeneration, Tái tạo tĩnh theo chu kỳ]
date: 2026-06-12
description: "Cơ chế cập nhật và tái tạo các trang tĩnh ở runtime mà không cần rebuild toàn bộ site."
---

# NextJS ISR

## TL;DR

Incremental Static Regeneration (ISR) là cơ chế của Next.js cho phép tạo mới hoặc cập nhật các trang tĩnh (static pages) ở runtime mà không cần rebuild lại toàn bộ trang web. ISR tối ưu hóa TTFB và giảm tải server bằng cách phục vụ trang từ cache tĩnh và thực hiện tái tạo trang ở nền (background regeneration) khi cache hết hạn.

## Core Concept

- **Cơ chế hoạt động (Stale-While-Revalidate)**:
  - **Truy cập trong chu kỳ**: Người dùng nhận kết quả tĩnh từ cache lập tức.
  - **Kích hoạt Revalidation**: Khi chu kỳ kết thúc, request tiếp theo vẫn nhận được trang cũ (stale), đồng thời Next.js kích hoạt quá trình render tái tạo trang tĩnh ở nền.
  - **Cập nhật Cache**: Khi render nền hoàn tất thành công, trang mới sẽ ghi đè vào cache tĩnh để phục vụ cho các truy cập tiếp theo.
- **Phương pháp Làm mới Cache (Revalidation Methods)**:
  - **Time-based**: Làm mới định kỳ theo thời gian được chỉ định bằng cách khai báo `export const revalidate = <seconds>`.
  - **On-demand**: Làm mới lập tức dựa trên sự kiện (ví dụ: bài viết mới được thêm):
    - `revalidatePath('/route')`: Làm mới toàn bộ trang thuộc đường dẫn được chỉ định.
    - `revalidateTag('tag-name')`: Làm mới các fetch request được gán nhãn tương ứng.
- **Xử lý ngoại lệ (Error Handling)**:
  - Nếu xảy ra lỗi trong quá trình tái tạo trang ở nền, trang tĩnh cũ thành công gần nhất vẫn tiếp tục được phục vụ từ cache. Next.js sẽ thử tái tạo lại ở các request tiếp theo.
- **Hạn chế & Rào cản**:
  - Chỉ hoạt động trên môi trường chạy Node.js runtime (không chạy được trên Edge runtime hoặc chế độ Static Export).
  - Đối với cấu trúc đa instance (Multi-instance containers), cache mặc định là cục bộ cho từng instance. Cần sử dụng custom Cache Handler (như Redis) để đồng bộ hóa việc xóa cache.
  - Nếu trang có nhiều fetch request với các chu kỳ `revalidate` khác nhau, thời gian nhỏ nhất sẽ được áp dụng làm chu kỳ chung cho toàn bộ route.

## Practical Implementation

- **Khai báo Time-based Revalidation**:

  ```tsx
  // app/blog/page.tsx
  export const revalidate = 3600; // Tái tạo trang mỗi 1 giờ

  export default async function Page() {
    const res = await fetch("https://api.vercel.app/blog");
    const posts = await res.json();
    return (
      <main>
        <h1>Blog</h1>
        {/* Render posts */}
      </main>
    );
  }
  ```

- **Khai báo On-demand Revalidation bằng Server Actions**:

  ```ts
  // app/actions.ts
  "use server";

  import { revalidatePath, revalidateTag } from "next/cache";

  export async function handlePublishPost() {
    // Cách 1: Làm mới theo đường dẫn
    revalidatePath("/blog");

    // Cách 2: Làm mới theo tag gán cho API (Next.js 15+ hỗ trợ cấu hình hết hạn cache qua tham số thứ 2)
    revalidateTag("blog-posts", "default");
  }
  ```

- **Gán nhãn (Tagging) dữ liệu fetch**:
  ```ts
  const res = await fetch("https://api.vercel.app/blog", {
    next: { tags: ["blog-posts"] },
  });
  ```

---

**Related Notes:**

- [[NextJS_PPR_Platform_Support]]
- [[React_Server_Components]]
- [[000_Tech_MOC]]
