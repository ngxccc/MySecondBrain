---
tags:
  [
    type/concept,
    topic/tech,
    security/authentication,
    library/better-auth,
    framework/nextjs,
  ]
aliases: [Better Auth Session, Auth Flow, JWT Session Strategy, Cookies Auth]
date: 2026-06-20
---

# Better Auth Session Flow: JWT Strategy & Cookie Management

## TL;DR

Trong dự án hiện tại, **Better Auth** được cấu hình sử dụng chiến lược **`sessionStrategy: "jwt"`** [1, 2]. Thay vì sử dụng cặp token Access/Refresh kiểu OAuth2 truyền thống cho luồng email/password, Better Auth mã hóa toàn bộ thông tin phiên đăng nhập vào một mã **JWT** duy nhất [1, 3]. Token JWT này được lưu đồng thời trong cột `token` của bảng `session` ở database và trong cookie trình duyệt định dạng `HttpOnly` qua plugin `nextCookies()` [4, 5]. Cột `access_token` và `refresh_token` trong bảng `account` chỉ được dùng để lưu trữ thông tin nhận được từ các nhà cung cấp Social OAuth (như Google, GitHub), không tham gia vào luồng xác thực nội bộ của hệ thống [4, 5].

---

## Core Concept

### 1. Phân biệt Session Strategy: Database vs. JWT

Better Auth hỗ trợ hai mô hình quản lý phiên đăng nhập chính [1, 5]:

- **Database (Mặc định):** Cookie chỉ lưu trữ một ID ngẫu nhiên (`session_token`). Mỗi request gửi lên yêu cầu server truy vấn cơ sở dữ liệu để tìm bản ghi session tương ứng nhằm lấy thông tin user [4, 5].
- **JWT (Dự án đang dùng):**
  - Cấu hình qua `advanced: { sessionStrategy: "jwt" }` trong `auth.ts` [1, 2].
  - Session token lưu ở cookie trình duyệt chính là một **JWT tự chứa dữ liệu (self-contained)** đã được mã hóa/ký số [1, 3].
  - Cột `token` trong bảng `session` sẽ lưu trữ trực tiếp chuỗi JWT này [4, 5].
  - Khi client gọi request, Next.js Middleware hoặc Server API chỉ cần giải mã và xác thực chữ ký của JWT (stateless check) mà không cần truy vấn DB liên tục, giúp cải thiện hiệu năng và giảm độ trễ (latency) tối đa [1, 5].

### 2. Luồng Cookie qua Plugin `nextCookies()`

- **`nextCookies()`** là một plugin tích hợp của Better Auth giúp tối ưu hóa việc quản lý cookie trong môi trường Next.js App Router [4, 5].
- Nó tự động xử lý thiết lập các thuộc tính cookie bảo mật bao gồm:
  - **`HttpOnly`:** Ngăn chặn JavaScript ở phía client truy cập vào cookie, chống tấn công XSS [3, 4].
  - **`Secure`:** Chỉ truyền cookie qua giao thức HTTPS đã được mã hóa [3, 4].
  - **`SameSite=Lax/Strict`:** Giảm thiểu nguy cơ bị tấn công CSRF (Cross-Site Request Forgery) [3, 4].

---

## Access Token & Refresh Token Clarification

Hệ thống **không** sử dụng cơ chế Access Token (ngắn hạn) và Refresh Token (dài hạn) cho tài khoản Email/Password [4, 5].

### Vai trò thực sự của các cột trong bảng `account`

Bảng `account` trong database chứa các trường `access_token` và `refresh_token` [4, 5]. Các trường này **chỉ có giá trị** khi người dùng đăng nhập qua các nhà cung cấp Social OAuth (OAuth Providers - như Google, GitHub, Facebook) [4, 5]:

1. Người dùng click "Sign in with Google" [5].
2. Google xác thực thành công và trả về `access_token` (để gọi Google API) và `refresh_token` (để gia hạn access token của Google) [5].
3. Better Auth lưu trữ các token Google này vào bảng `account` của user để phục vụ cho các tác vụ tích hợp bên thứ ba sau này [4, 5].
4. Còn đối với phiên đăng nhập giữa Client và Server của chúng ta, Better Auth vẫn tạo ra và sử dụng duy nhất một mã JWT lưu trong cookie thiết bị của user (thời hạn 7 ngày theo cấu hình `jwt.expirationTime: "7d"`) [1, 5].

---

## Practical Implementation

### 1. Cấu hình Server-Side (`packages/database/src/auth.ts`)

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
    usePlural: true,
  }),
  advanced: {
    generateId: () => uuidv7(),
    sessionStrategy: "jwt", // Thiết lập chiến lược JWT
    jwt: {
      expirationTime: "7d", // Thời hạn hết hạn của phiên đăng nhập (JWT)
    },
  },
  plugins: [nextCookies()], // Tự động hóa thiết lập Cookie an toàn cho Next.js
});
```

### 2. Tiêu dùng phiên đăng nhập (Consuming Session)

Theo quyết định kiến trúc tại [[docs/adr/0001-session-management-strategy.md|ADR 0001]]:

- **Middleware (Route Protection):** Đọc cookie trực tiếp tại Edge để kiểm tra tính hợp lệ của JWT trước khi render trang.
- **Server Components:** Đọc session trực tiếp từ request header thông qua API của Better Auth:

  ```typescript
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  ```

- **Client Components:** Sử dụng React Hook được Better Auth hỗ trợ sẵn để lấy và cập nhật cache session:

  ```typescript
  import { authClient } from "@nhatnang/database/auth-client";
  const { data: session, isPending } = authClient.useSession();
  ```

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Quyết định kiến trúc quản lý phiên: [[docs/adr/0001-session-management-strategy.md|ADR 0001]]
- Tối ưu hóa render động với Next.js: [[NextJS_Dynamic_Opt_Out_Connection]]
- Thiết kế Schema database: [[docs/adr/0011-multilingual-database-schema-design.md|ADR 0011]]
