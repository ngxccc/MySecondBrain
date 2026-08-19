---
title: NextJS Dynamic Opt Out and connection() API
tags: [type/concept, topic/tech, topic/frontend, topic/rendering]
created: 2026-06-20
description: "Cơ chế ngắt Prerender tĩnh và chuyển đổi sang Dynamic Rendering ở Next.js 15/16."
---

# NextJS Dynamic Opt Out and connection() API

## TL;DR

Trong Next.js 15/16 App Router, `connection()` (từ `next/server`) là một hàm báo hiệu (signaling API) dùng để chủ động ngắt quá trình Prerender tĩnh (Static Generation) tại thời điểm build. Khi gặp `await connection()`, Next.js sẽ hiểu rằng đoạn code/route này bắt buộc phải chạy ở runtime (dynamic) và dừng render tĩnh route đó mà không ném ra lỗi crash build. Thiết kế này giúp bảo vệ các API động (như truy vấn DB theo request, gọi headers, cookies) và là nền tảng cốt lõi của tính năng Partial Prerendering (PPR) để stream nội dung động.

---

## Core Concept

### 1. Tại sao xảy ra lỗi Prerender khi build?

Next.js App Router mặc định tối ưu hóa tĩnh (Static Optimization). Khi chạy `next build`, trình biên dịch sẽ cố gắng chạy thử (evaluate) tất cả các Server Components và GET Route Handlers để xuất ra file HTML tĩnh nhằm giảm TTFB (Time to First Byte).

Tuy nhiên, tại thời điểm build:

- Không có request thực tế từ client (không có IP, không có URL parameters, không có headers cụ thể).
- Nếu code gọi các hàm động như `headers()`, `cookies()`, hoặc thực hiện truy vấn cơ sở dữ liệu dựa trên thông tin người dùng, Next.js sẽ ném ra lỗi hoặc treo quá trình build vì các thông tin này trống rỗng.

### 2. Sự ra đời của `connection()` trong Next.js 15/16

`connection()` là **hàm nguyên bản (primitive)** tổng quát trong Next.js 15+ để chủ động kích hoạt chế độ dynamic rendering, thay vì chỉ là một giải pháp tình thế (workaround) cho riêng hàm `headers()`.

- **Cú pháp:** `import { connection } from "next/server";`
- **Cơ chế hoạt động:** Khi trình biên dịch tĩnh của Next.js (prerendering engine) chạy gặp `await connection()`, nó sẽ nhận được tín hiệu rõ ràng rằng _"quá trình render này bắt buộc phải là dynamic"_. Next.js sẽ kích hoạt ngoại lệ `NEXT_PRERENDER_INTERRUPTED`, ngắt prerender tĩnh một cách an toàn và hoãn (defer) việc render phần logic phía sau cho đến runtime.
- **Phạm vi bao phủ:** Nó bao quát và thay thế cho mọi API động khác như `headers()`, `cookies()`, `searchParams`, `unstable_noStore()`, hoặc bất kỳ truy vấn cơ sở dữ liệu động/gọi API bên thứ ba nào.

### 3. Đánh đổi: `force-dynamic` vs `connection()`

Trước đây, chúng ta thường dùng `export const dynamic = 'force-dynamic'` để giải quyết lỗi build. Dưới đây là bảng so sánh sự khác biệt:

| Đặc tính         | `force-dynamic`                                          | `connection()`                                                     |
| :--------------- | :------------------------------------------------------- | :----------------------------------------------------------------- |
| **Cơ chế**       | Cấu hình khai báo tĩnh ở đầu file.                       | Hàm thực thi động chạy bên trong code logic.                       |
| **Phạm vi**      | Chuyển toàn bộ route/page thành dynamic.                 | Chỉ chuyển phần code chạy sau nó thành dynamic.                    |
| **Hỗ trợ PPR**   | **Không.** Vô hiệu hóa hoàn toàn static shell của trang. | **Có.** Cho phép render trước static shell và stream phần dynamic. |
| **Độ linh hoạt** | Kém linh hoạt (bắt buộc cấu hình cứng).                  | Cao (có thể gọi lồng trong các hàm helper, services).              |

---

## Practical Implementation

### 1. Ứng dụng trong việc lấy Session an toàn

Trong file `session.ts` của dự án, `getCachedSession` sử dụng `connection()` để lấy header an toàn mà không làm hỏng quá trình build tĩnh:

```typescript
import { cache } from "react";
import { auth } from "@nhatnang/database/auth";
import { headers } from "next/headers";
import { connection } from "next/server";

export const getCachedSession = cache(async () => {
  // connection() báo cho Next.js biết hàm này cần request context thực tế ở runtime.
  // Tránh việc headers() ném lỗi khi build tĩnh.
  await connection();
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.warn("Get cached session error: ", error);
    return null;
  }
});
```

### 2. Ứng dụng trong API Route Handlers

Các API route kiểm tra trạng thái thanh toán hoặc generate link thanh toán (GET) bắt buộc phải dùng `connection()` ở dòng đầu tiên:

```typescript
import { connection } from "next/server";
import { NextResponse } from "next/server";
import { paymentService } from "@nhatnang/database/services";

export async function GET(request: Request) {
  // Ngắt prerender tĩnh ngay lập tức để lấy query params thực tế ở runtime
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    const status = await paymentService.verifyStatus(orderId);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

---

## Interview Prep

### Q1: Lỗi `NEXT_PRERENDER_INTERRUPTED` trong Next.js App Router nghĩa là gì và cách xử lý?

- **Trả lời:** Đây là ngoại lệ được ném ra khi Next.js cố gắng chạy static prerender một trang/API nhưng gặp phải các hàm động (như `headers()`, `cookies()`, hoặc `connection()`). Next.js bắt ngoại lệ này để chuyển trang đó sang Dynamic rendering. Để xử lý triệt để lỗi crash build, chúng ta cần đảm bảo các hàm động được gọi đúng vị trí, hoặc sử dụng `await connection()` để thông báo rõ ràng cho trình biên dịch bốc tách phần động.

### Q2: Tại sao Next.js 15+ lại khuyên dùng `connection()` thay vì `export const dynamic = 'force-dynamic'`?

- **Trả lời:** Vì `force-dynamic` là một cấu hình thô bạo làm mất hoàn toàn khả năng render tĩnh của trang. Trong khi đó, `connection()` hỗ trợ mô hình **Partial Prerendering (PPR)**. Next.js vẫn có thể tạo ra static HTML shell (ví dụ: khung xương Layout, Header, Footer tĩnh) và chỉ hoãn render phần dynamic (ví dụ: giỏ hàng hoặc thông tin cá nhân của user). Điều này giúp cải thiện đáng kể tốc độ tải trang ban đầu (FCP/TTFB).

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Next.js 16 Caching: [[NextJS_16_Cache_Components]]
- Nền tảng PPR Cloud: [[NextJS_PPR_Platform_Support]]
