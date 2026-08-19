---
title: NextJS Route Groups and Nested Layouts
tags:
  [
    type/concept,
    topic/tech,
    topic/frontend,
    topic/rendering,
    topic/infrastructure,
  ]
aliases:
  [Route Groups, Next.js DYNAMIC_SERVER_USAGE, Nested Layouts, Kế thừa Layout]
date: 2026-06-20
description: "Bản chất của Route Groups và cơ chế kế thừa layout (Nested Layouts) trong Next.js App Router."
---

# Next.js Route Groups & Nested Layouts Inheritance

## TL;DR

**Route Groups** (thư mục có dấu ngoặc đơn `(group)`) trong Next.js App Router cho phép tổ chức cấu trúc file dự án và gom nhóm các route để chia sẻ chung Layout mà **không làm thay đổi cấu trúc URL đường dẫn**. Cơ chế này giải quyết hai bài toán lớn: (1) thiết lập các giao diện khác nhau cho từng phân khu (như trang mua sắm công cộng vs. trang quản trị nội bộ), và (2) cô lập các hàm động (như `headers()`, `cookies()`, check Auth session) vào một Layout con để tránh làm mất đi khả năng tối ưu hóa tĩnh (Static Site Generation - SSG) của Root Layout và ngăn ngừa lỗi build `DYNAMIC_SERVER_USAGE` trên Vercel.

---

## Core Concept

### 1. Bản chất của Route Groups

Thông thường, Next.js App Router ánh xạ trực tiếp cấu trúc thư mục thành URL (File-based Routing). Tuy nhiên, nếu tên thư mục được bọc trong dấu ngoặc đơn `(tên)`, trình biên dịch Next.js sẽ bỏ qua tên thư mục đó khi tạo URL segment.

- **Ví dụ:** Thư mục `app/(shop)/checkout/page.tsx` sẽ có URL là `/checkout` chứ không phải `/(shop)/checkout`.

### 2. Cơ chế kế thừa Layout

Next.js App Router thiết kế Layout lồng nhau (Nested Layouts) theo dạng vỏ hành:

1. **Root Layout (`app/layout.tsx`):** Chứa các cấu hình toàn cục bắt buộc như thẻ `<html>`, `<body>`, và các Provider (React Context, Theme Providers).
2. **Sub-Layouts (Layout con):** Các layout được định nghĩa bên trong Route Groups.

Khi người dùng điều hướng giữa các trang nằm trong cùng một Route Group (ví dụ: chuyển từ `/portal/debt` sang `/portal/profile` trong nhóm `(portal)`):

- **State Preservation (Lưu giữ trạng thái):** Next.js chỉ render lại (re-render) Component `page.tsx` thay đổi, giữ nguyên trạng thái (State) và DOM của Sub-Layout đó (không bị re-mount). Thanh Sidebar hay bộ lọc không bị mất trạng thái cuộn hay dữ liệu đang nhập.
- **Tối ưu hóa:** Tránh việc re-render lại toàn bộ trang, giúp trải nghiệm chuyển trang nhanh tương đương ứng dụng Single Page Application (SPA).

### 3. Cô lập Logic động để bảo vệ Static HTML

Next.js phân loại các trang dựa trên việc chúng gọi hàm động (Dynamic APIs) hay không.

- **Lỗi `DYNAMIC_SERVER_USAGE` trên Vercel:** Nếu bạn kiểm tra phiên đăng nhập (Session Check) bằng `headers()` hoặc `cookies()` ngay tại Root Layout (`app/layout.tsx`), Next.js sẽ biến **tất cả** các trang trong dự án thành Dynamic. Khi deploy lên Vercel, các trang tĩnh (như trang 404, trang Login, Landing page) sẽ cố gắng build tĩnh nhưng thất bại do xung đột môi trường build Serverless, ném ra lỗi `DYNAMIC_SERVER_USAGE`.
- **Giải pháp với Route Groups:** Tách biệt hoàn toàn: Trang công cộng (Login, 404) nằm ở ngoài hoặc ở Route Group tĩnh; Trang nội bộ cần bảo mật (Dashboard, Portal) gom vào Route Group `(protected)` với một `layout.tsx` riêng để check session. Khi đó, các trang public vẫn được build thành HTML tĩnh siêu nhanh, chỉ các trang dashboard mới được xử lý động.

---

## Practical Implementation

### 1. Cấu trúc thư mục thực tế trong Hyundai Ecommerce

Trong dự án `storefront`, chúng ta phân tách hai khu vực lớn thông qua Route Groups:

```
apps/storefront/app/[locale]/
│
├── layout.tsx                <-- Root Layout (Chỉ chứa Providers, i18n, HTML/Body tĩnh)
│
├── (shop)/                   <-- Route Group dành cho trang mua sắm công cộng
│   ├── layout.tsx            <-- Layout chứa Header/Footer bán hàng
│   ├── page.tsx              <-- Trang chủ bán hàng (Tĩnh - SSG)
│   └── products/[slug]/      <-- Trang chi tiết sản phẩm
│
└── (portal)/portal/          <-- Route Group dành cho Đại lý quản lý công nợ (Bảo mật)
    ├── layout.tsx            <-- Layout chứa Sidebar Navigation và check B2B Session
    ├── debt/page.tsx         <-- Trang quản lý công nợ (Động - Dynamic)
    └── profile/page.tsx      <-- Trang thông tin cá nhân (Động - Dynamic)
```

### 2. Code mẫu cô lập Auth trong layout của Portal

Ở đây, Root Layout hoàn toàn không gọi `headers()` hay check Auth. Logic động được cô lập bên trong Layout của `(portal)`:

```typescript
// apps/storefront/app/[locale]/(portal)/portal/layout.tsx
import { redirect } from "@/shared/lib/session";
import { getCachedSession } from "@/shared/lib/session";
import PortalSidebar from "@/features/portal/components/portal-sidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth session an toàn trên server, chỉ ảnh hưởng đến các trang trong /portal
  const session = await getCachedSession();
  if (!session) {
    redirect("/auth/login"); // Điều hướng về login nếu chưa xác thực
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar user={session.user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

---

## Interview Prep

### Q1: Bản chất của Route Groups là gì và tại sao nó lại không hiển thị trên URL?

- **Trả lời:** Route Groups là một tính năng của Next.js App Router sử dụng quy ước đặt tên thư mục trong dấu ngoặc đơn `(tên_group)`. Trình biên dịch của Next.js bỏ qua tên thư mục này khi phân tích cây định tuyến (Router Tree) để ánh xạ thành URL. Mục đích duy nhất của nó là để gom nhóm các file mã nguồn nhằm chia sẻ chung Layout (hoặc Middleware cục bộ) mà không muốn làm xáo trộn cấu trúc đường dẫn URL đẹp của trang web.

### Q2: Nested Layouts trong Next.js App Router hoạt động như thế nào khi chuyển trang? Trạng thái của Layout có bị re-mount không?

- **Trả lời:** Next.js sử dụng cơ chế **Partial Rendering** (Render một phần). Khi người dùng chuyển đổi giữa hai trang cùng cấp trong một Route Group (ví dụ chuyển từ `/portal/debt` sang `/portal/profile`), Next.js chỉ render lại Component `page.tsx` tương ứng. Thư mục Layout chung (`layout.tsx` của `(portal)`) sẽ được giữ lại, DOM của nó không bị tạo lại (no re-mount) và các React State bên trong Layout đó sẽ được bảo toàn nguyên vẹn.

### Q3: Làm thế nào để giải quyết lỗi `DYNAMIC_SERVER_USAGE` trên Vercel khi sử dụng các hàm động như cookies() hoặc headers() ở layout?

- **Trả lời:** Nguyên nhân do Next.js cố gắng tối ưu hóa tĩnh toàn bộ ứng dụng lúc build, nhưng các hàm dynamic đó yêu cầu request context thực tế ở runtime. Để giải quyết, ta sử dụng **Route Groups** để cô lập hoàn toàn logic gọi các hàm động đó vào một Sub-Layout riêng dành cho khu vực cần bảo mật (ví dụ: bọc toàn bộ trang Dashboard vào nhóm `(dashboard)`). Root Layout bên ngoài được giữ hoàn toàn tĩnh (chỉ chứa Providers), cho phép Next.js build thành công các trang tĩnh độc lập.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Cơ chế Dynamic Opt-out: [[NextJS_Dynamic_Opt_Out_Connection]]
- Ranh giới Client-Server: [[React_Server_Components]]
