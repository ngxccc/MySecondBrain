---
tags: [type/concept, topic/tech, nextjs, serverless, backend]
aliases: [Next.js after(), next/server after(), after()]
description: "Cơ chế lập lịch tác vụ nền không chặn (non-blocking) sau khi response đã được gửi về client."
---

# Next.js after() API

## TL;DR

Next.js `after()` (import từ `next/server`) cho phép lập lịch thực thi các tác vụ nền (background tasks/side effects) như gửi mail, Telegram, hoặc ghi log/analytics **sau khi phản hồi HTTP (hoặc prerender) đã hoàn tất gửi về client**. Cơ chế này hoạt động non-blocking, cải thiện tối đa TTFB (Time to First Byte) và ngăn chặn tình trạng serverless function bị đóng băng (freeze) trước khi tác vụ nền hoàn thành.

## Core Concept

- **Tại sao nó tồn tại?** Trong môi trường Serverless (như Vercel/AWS Lambda), ngay khi hàm API trả về phản hồi, container runtime có thể bị đóng băng hoặc huỷ tức thì. Các Promise không được `await` (fire-and-forget) có nguy cơ cao bị ngắt giữa chừng. Trước đây, lập trình viên phải giữ kết nối HTTP lâu hơn để `await` toàn bộ tác vụ mạng, gây tăng độ trễ mạng (latency) của API.
- **Giải quyết bài toán gì?** `after()` giải quyết bài toán: Chạy tác vụ nền bất đồng bộ một cách an toàn mà không chặn phản hồi HTTP của người dùng, tận dụng cơ chế `waitUntil` ngầm để kéo dài thời gian sống của serverless instance cho tới khi tác vụ hoàn thành.
- **Nó có thay thế cái gì hay không?** Thay thế việc `await` các tác vụ không chặn (non-blocking tasks) trong API handler chính, hoặc thay thế các hàng đợi (Queue) cồng kềnh cho các tác vụ nền quy mô vừa và nhỏ.
- **Áp dụng vào những dự án nào?** Dự án Hyundai B2B E-commerce (ví dụ: gửi mail xác thực đăng ký tài khoản, gửi tin nhắn thông báo Telegram, lưu log nghiệp vụ).
- **Cơ chế hoạt động (How it works under the hood):**
  - Next.js sử dụng cơ chế `waitUntil(promise)` của nền tảng cloud (như Vercel) thông qua `RequestContextStorage` (AsyncLocalStorage).
  - Khi `after` được gọi, Next.js truy cập vào `RequestContext` (sử dụng symbol `@next/request-context`) để lấy hàm `waitUntil` của request hiện tại và đẩy promise của callback vào hàng đợi xử lý nền sau khi đóng kết nối HTTP.

## Practical Implementation

### 1. Sử dụng trong Route Handlers

Dưới đây là cách sử dụng `after()` để xử lý song song và bất đồng bộ hoàn toàn các tác vụ outbox:

```typescript
import { NextResponse, connection, after } from "next/server";
import { orderService } from "@nhatnang/database/services";

export async function POST(request: Request) {
  await connection();
  try {
    const pendingEvents = await orderService.fetchPendingOutboxEvents(10);

    if (pendingEvents.length === 0) {
      return NextResponse.json({ success: true, processedCount: 0 });
    }

    // Đẩy luồng xử lý song song vào background chạy sau khi phản hồi HTTP
    after(async () => {
      try {
        await Promise.all(
          pendingEvents.map(async (event) => {
            // Xử lý gửi Resend/Telegram song song và cập nhật DB...
          }),
        );
      } catch (error) {
        console.error("[process-outbox:after error]", error);
      }
    });

    // Phản hồi lập tức cho client (chỉ mất ~3ms)
    return NextResponse.json({
      success: true,
      message: "Outbox processing initiated in the background.",
      processedCount: pendingEvents.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Error" },
      { status: 500 },
    );
  }
}
```

### 2. Sử dụng request APIs bên trong `after`

#### A. Trong Route Handlers và Server Functions

Bạn có thể gọi trực tiếp `cookies()` và `headers()` bên trong `after()` callback:

```typescript
after(async () => {
  const userAgent = (await headers()).get("user-agent");
  const session = (await cookies()).get("session-id")?.value;
  // Ghi log hoạt động
});
```

#### B. Trong Server Components

**KHÔNG ĐƯỢC PHÉP** gọi `cookies()` hay `headers()` bên trong callback của `after()` (Next.js sẽ ném ra lỗi runtime). Bạn phải đọc các thông tin này trước ở rendering lifecycle rồi truyền giá trị vào `after()` qua closure:

```tsx
export default async function Page() {
  // 1. Đọc dữ liệu trước ( Rendering Lifecycle )
  const userAgent = (await headers()).get("user-agent") || "unknown";
  const sessionCookie =
    (await cookies()).get("session-id")?.value || "anonymous";

  // 2. Truyền vào after qua closure
  after(() => {
    logUserAction({ sessionCookie, userAgent });
  });

  return <h1>My Page</h1>;
}
```

### 3. Trade-offs & Phỏng vấn

- **Trade-offs**:
  - _Ưu điểm_: TTFB cực kỳ nhanh, tăng độ ổn định của các tác vụ không đồng bộ trên môi trường Serverless.
  - _Nhược điểm_: Khó khăn hơn trong việc giám sát lỗi (error tracking) do lỗi xảy ra ở background không được trả về trong response HTTP (cần tích hợp tốt Sentry/OpenTelemetry hoặc cơ chế lưu vết DB).
- **Mẫu trả lời phỏng vấn (Flex)**: "Trong môi trường serverless, việc thực thi các tác vụ nền như gửi mail hoặc webhook sau khi trả về response rất dễ gặp lỗi do container bị freeze ngay lập tức. Để giải quyết, em áp dụng API `after()` mới của Next.js kết hợp với cơ chế `waitUntil` của nền tảng cloud. API này cho phép phản hồi HTTP trả về cho user chỉ mất vài mili-giây, trong khi các tác vụ nặng hơn như bắn mail Resend hay Telegram được đảm bảo chạy nền ổn định và không làm chậm trải nghiệm của người dùng."

## Related Notes

- [[Outbox_Pattern]]: Mẫu thiết kế xử lý gửi tin nhắn tin cậy bằng bảng lưu vết.
- [[Serverless_Architecture]]: Kiến trúc điện toán không máy chủ và cơ chế freeze/thaw container.
- [[10_Projects/Hyundai_Ecommerce/Docs/V8_Performance_Audit.md|V8_Performance_Audit]]: Tối ưu hóa hiệu năng thực thi V8 Engine.
