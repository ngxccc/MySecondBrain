---
tags: [type/concept, topic/tech, topic/frontend, layer/infrastructure]
date: 2026-06-20
aliases:
  [
    Server Actions,
    Next.js Server Actions,
    RPC Pattern,
    useActionState,
    useTransition,
  ]
description: "Kỹ thuật mutate data trực tiếp từ server bằng RPC ngầm."
---

# Next.js Server Actions & React 19 Integration

## TL;DR

**Server Actions** (được giới thiệu từ Next.js 14 và tối ưu hóa trong React 19) là cơ chế thiết lập các hàm xử lý bất đồng bộ (async functions) chạy hoàn toàn trên Server nhưng có thể được gọi (trigger) trực tiếp từ phía Client (như submit `<form>` hoặc click button) thông qua cơ chế **RPC (Remote Procedure Call)**. Server Actions thay thế hoàn toàn việc viết REST/GraphQL API thủ công cho các thao tác thay đổi dữ liệu (Mutations), đồng thời tích hợp chặt chẽ với các hook của React 19 (`useActionState`, `useFormStatus`, `useTransition`) để quản lý loading state và xử lý lỗi chuyên nghiệp.

---

## Core Concept

### 1. Bản chất bên dưới

Mặc dù cú pháp trông giống như gọi một hàm local bình thường từ Client, trình biên dịch của Next.js (compiler) thực chất hoạt động như sau:

1. **Biên dịch:** Khi gặp chỉ thị `"use server"` ở đầu file hoặc đầu hàm, Next.js tự động bóc tách hàm đó ra và tạo một API endpoint POST ẩn dạng HTTP RPC.
2. **Giao tiếp:** Khi Client kích hoạt hành động (ví dụ bấm submit), Next.js sẽ gửi một HTTP POST request lên server với header `Next-Action: <Action-ID>` chứa ID băm của hàm đó, kèm theo body dạng `multipart/form-data` hoặc `application/json` (chứa các tham số truyền vào).
3. **Thực thi:** Server nhận request, giải nén tham số, thực thi hàm trong môi trường Node.js (nơi có thể truy cập DB trực tiếp) và trả kết quả về dưới dạng serialized payload (chuỗi văn bản đặc biệt của React).

### 2. Sự tiến hóa tích hợp React 19

React 19 chính thức stable các API hỗ trợ quản lý vòng đời của Server Actions (Actions Lifecycle):

- **`useActionState` (thay thế cho `useFormState` cũ):** Quản lý trạng thái trả về của Action (ví dụ: thông báo lỗi, thông báo thành công) và tự động nhận diện trạng thái đang thực thi (pending).
  `const [state, formAction, isPending] = useActionState(actionFn, initialState);`
- **`useFormStatus`:** Đọc trạng thái pending của form cha gần nhất từ bất kỳ component con nào nằm sâu bên trong (rất tiện để hiển thị nút submit Loading mà không cần truyền prop).
  `const { pending, data, method, action } = useFormStatus();`
- **`useTransition` / `isPending`:** Cho phép gọi các Server Actions thủ công (không thông qua form, ví dụ click một button tăng lượt like) mà vẫn kiểm soát được trạng thái loading mượt mà để tránh treo UI.

### 3. Vấn đề Bảo mật & CSRF Protection

Do Server Actions tự động tạo ra endpoint POST, chúng tiềm ẩn nguy cơ bị tấn công **CSRF (Cross-Site Request Forgery)**.

- **Giải pháp mặc định của Next.js:** Next.js tích hợp sẵn tính năng bảo mật kiểm tra tiêu đề **`Origin`** và so sánh nó với host của server. Nếu request gửi từ một website lạ (ví dụ trang web lừa đảo cố tình trigger action thông qua form), Next.js sẽ tự động từ chối request ngay lập tức.
- **Bảo vệ Token/Session:** Vì chạy trên server, Server Actions tự động kế thừa Cookies của domain gốc, giúp việc xác thực Session (ví dụ qua **Better Auth**) hoạt động tự động thông qua việc đọc headers.

---

## Practical Implementation

### 1. Thiết kế Action Đăng nhập an toàn với Zod

Trong dự án Hyundai Ecommerce, các Server Action được tổ chức tách biệt tại thư mục `actions/` và validate dữ liệu chặt chẽ:

```typescript
// apps/storefront/src/features/auth/actions/login.action.ts (Server Action)
"use server";

import { auth } from "@nhatnang/database/auth";
import { headers } from "next/headers";
import { LoginSchema } from "@nhatnang/shared/validators"; // Zod schema dùng chung

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Phân tích dữ liệu từ FormData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2. Validate dữ liệu bằng Zod ở Server
  const validated = LoginSchema.safeParse({ email, password });
  if (!validated.success) {
    return {
      success: false,
      error: "Dữ liệu đăng nhập không hợp lệ",
      fields: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. Thực thi nghiệp vụ xác thực (gọi Better Auth)
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(), // Truyền headers để Better Auth đọc cookies/IP
    });

    return { success: true, userId: result.user.id };
  } catch (error: any) {
    // Luôn trả về payload có cấu trúc cụ thể thay vì ném lỗi thô
    return {
      success: false,
      error: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
    };
  }
}
```

### 2. Sử dụng trong Component Form ở Client

```typescript
// apps/storefront/src/features/auth/components/login-form.tsx (Client Component)
'use client';

import { useActionState } from "react";
import { loginAction } from "../actions/login.action";

export default function LoginForm() {
  // useActionState của React 19 quản lý kết quả trả về và trạng thái pending
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label>Email</label>
        <input name="email" type="email" required />
      </div>
      <div>
        <label>Mật khẩu</label>
        <input name="password" type="password" required />
      </div>

      {state?.success === false && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Đang xử lý..." : "Đăng nhập"}
      </button>
    </form>
  );
}
```

---

## Interview Prep

### Q1: Server Actions hoạt động dưới nền tảng như thế nào?

- **Trả lời:** Khi trình duyệt kích hoạt Server Action, nó sẽ gửi một yêu cầu **HTTP POST** lên server. Yêu cầu này đi kèm một Header đặc biệt là `Next-Action` chứa mã băm định danh của Action đó. Dữ liệu gửi đi định dạng dưới dạng `multipart/form-data` (nếu dùng Form gốc) hoặc `application/json`. Phản hồi trả về của server là định dạng serialized text (React Server Component Payload) chứ không phải JSON thuần túy, giúp React cập nhật trực tiếp cây DOM ở client mà không cần reload trang.

### Q2: Tại sao chúng ta không nên ném lỗi thô bên trong Server Action ở môi trường Production?

- **Trả lời:** Khi chạy ở môi trường Production, để bảo vệ an ninh và tránh rò rỉ cấu trúc hệ thống (như SQL query lỗi, database password), Next.js sẽ tự động mã hóa mọi lỗi thô bị `throw` thành thông báo chung chung: _"An error occurred on the server; go to the server logs for details"_. Điều này làm giảm trải nghiệm người dùng vì họ không biết cụ thể lỗi gì (ví dụ: trùng email, sai mật khẩu).
  _Quy tắc chuẩn:_ Sử dụng khối `try/catch` bắt lỗi, ghi log ở server và trả về một đối tượng có cấu trúc dạng `{ success: false, error: "Thông báo lỗi thân thiện" }`.

### Q3: Server Actions giải quyết vấn đề bảo mật CSRF như thế nào?

- **Trả lời:** Next.js tự động kiểm tra tiêu đề **`Origin`** của mọi request gọi Server Action và so sánh nó với tiêu đề **`Host`** của server. Nếu hai giá trị này lệch nhau (tức là request được kích hoạt từ một trang web bên thứ ba giả mạo), Next.js sẽ từ chối xử lý và trả về lỗi `400 Bad Request` lập tức. Điều này giúp ngăn chặn hoàn toàn các cuộc tấn công CSRF thông dụng mà không cần cấu hình token CSRF thủ công.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Ranh giới Client-Server: [[React_Server_Components]]
- Cổng bảo mật xác thực: Better Auth (Sẽ tạo note sau)
