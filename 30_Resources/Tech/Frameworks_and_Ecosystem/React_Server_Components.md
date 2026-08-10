---
tags:
  [
    type/concept,
    topic/tech,
    react,
    frontend,
    framework/nextjs,
    layer/infrastructure,
  ]
date: 2026-06-20
aliases:
  [RSC, React Server Components vs Client Components, RSC vs Client Components]
description: "Cơ chế render UI trên server, gửi payload tĩnh về client."
---

# React Server Components vs. Client Components

## TL;DR

Trong mô hình Next.js App Router, **React Server Components (RSC)** (mặc định) chạy hoàn toàn trên server để render ra HTML tĩnh và một cấu trúc dữ liệu gọi là RSC Payload, không gửi code JavaScript của component đó về trình duyệt (Zero Bundle Size). Ngược lại, **Client Components** (sử dụng chỉ thị `'use client'`) được render trước ở server (Pre-rendering) rồi gửi JS về client để thực hiện cơ chế **Hydration**, cho phép sử dụng hooks (`useState`, `useEffect`), lắng nghe sự kiện (`onClick`) và truy cập các Web API của trình duyệt.

---

## Core Concept

### 1. Phân biệt thuộc tính kỹ thuật

| Đặc tính             | Server Components (RSC)                                 | Client Components (`'use client'`)                           |
| :------------------- | :------------------------------------------------------ | :----------------------------------------------------------- |
| **Nơi thực thi**     | Chỉ chạy trên Server.                                   | Chạy trên cả Server (Pre-render) và Client (Hydrate).        |
| **JS gửi về Client** | **0 KB (Zero Bundle Size).**                            | Có (bao gồm code của component và các dependency).           |
| **State & Effects**  | Không hỗ trợ (`useState`, `useEffect` bị cấm).          | Hỗ trợ đầy đủ các React Hooks và Custom Hooks.               |
| **Browser APIs**     | Không hỗ trợ (lỗi nếu gọi `window`, `document`).        | Hỗ trợ đầy đủ (sau khi component đã hydrated ở client).      |
| **Data Fetching**    | Gọi trực tiếp Database ORM, đọc file hệ thống, gọi API. | Gọi API qua HTTP client (`fetch`, `axios`) từ trình duyệt.   |
| **Bảo mật**          | Cao (chứa API keys, DB password an toàn).               | Thấp (mọi thứ truyền xuống client đều có thể bị dịch ngược). |

### 2. Ranh giới Client-Server & Quy tắc thiết kế

#### Quy tắc 1: Không thể import Server Component vào Client Component

- **Lý do:** Vì Client Component chạy ở môi trường trình duyệt, trình duyệt không thể thực thi code của Server Component (như gọi trực tiếp cơ sở dữ liệu hay đọc file).
- **Giải pháp (Pattern):** Truyền Server Component dưới dạng `children` hoặc một `prop` khác từ một Server Component cha bên ngoài.

```typescript
// ❌ SAI: Import trực tiếp Server Component vào Client Component
'use client';
import MyServerComponent from './MyServerComponent'; // LỖI biên dịch!

// ✓ ĐÚNG: Nhận Server Component dưới dạng children
'use client';
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <div className="client-wrapper">{children}</div>;
}
```

#### Quy tắc 2: Dữ liệu truyền qua ranh giới phải tuần tự hóa được

Khi truyền dữ liệu (props) từ một Server Component sang một Client Component, các props đó bắt buộc phải **Serializable** (có thể chuyển thành chuỗi JSON/RSC Payload).

- **Dữ liệu hợp lệ:** Primitives (string, number, boolean, null, undefined), plain objects và arrays chứa primitives.
- **Dữ liệu không hợp lệ:** Functions, Class Instances (ví dụ đối tượng Drizzle Model phức tạp), Database Connections, Date objects (Date truyền từ server sang client cần được convert thành `.toISOString()` hoặc epoch timestamp trước khi truyền).

### 3. React 19 Streaming & `use()` Hook

Trong React 19 và Next.js 15+, một mô hình tối ưu mới được giới thiệu:

1. Server Component khởi tạo một Promise bất đồng bộ (ví dụ: truy vấn DB hoặc fetch API chậm).
2. Server Component truyền trực tiếp đối tượng **Promise** này làm prop cho Client Component.
3. Client Component sử dụng hook **`use(promise)`** của React 19 để giải nén dữ liệu ngay tại thời điểm render client, kết hợp với thẻ `<Suspense>` ở ngoài để tạo hiệu ứng skeleton loading mượt mà.

---

## Practical Implementation

### 1. Cách thiết kế Form cập nhật thông tin trong dự án

Trang chi tiết tài khoản (`/portal/profile`) là một **Server Component** để đọc thông tin người dùng từ cơ sở dữ liệu một cách bảo mật, sau đó map thành DTO sạch và truyền xuống **Client Component** (`ProfileForm`) để quản lý form tương tác:

```typescript
// apps/storefront/app/[locale]/(portal)/portal/profile/page.tsx (Server Component)
import { getCachedSession } from "@/shared/lib/session";
import { userService } from "@nhatnang/database/services";
import ProfileForm from "@/features/portal/components/profile-form";

export default async function ProfilePage() {
  const session = await getCachedSession();
  if (!session) return <div>Unauthorized</div>;

  // Lấy dữ liệu an toàn trên Server
  const user = await userService.getB2BProfile(session.user.id);

  // Map thành Serializable DTO trước khi truyền qua ranh giới Client-Server
  const initialData = {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    companyName: user.companyName ?? "",
  };

  return <ProfileForm initialData={initialData} />;
}
```

```typescript
// apps/storefront/src/features/portal/components/profile-form.tsx (Client Component)
'use client';

import { useForm } from "react-hook-form";

export default function ProfileForm({ initialData }: { initialData: any }) {
  // Quản lý trạng thái tương tác và submit form ở Client
  const { register, handleSubmit } = useForm({ defaultValues: initialData });

  const onSubmit = async (data: any) => {
    // Gọi Server Action để cập nhật dữ liệu
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <button type="submit">Cập nhật</button>
    </form>
  );
}
```

---

## Interview Prep

### Q1: Có phải Client Component chỉ được chạy trên trình duyệt không?

- **Trả lời:** Không. Đây là hiểu lầm cực kỳ phổ biến. Client Component trong Next.js App Router vẫn được chạy trên Server ở lần tải trang đầu tiên (Pre-rendering) để tạo ra HTML tĩnh gửi về cho trình duyệt. Sau đó, file JavaScript của component mới được tải về client để thực hiện quá trình **Hydration** (ghép nối các trình lắng nghe sự kiện và kích hoạt React state). Chỉ có code bên trong các hook như `useEffect` hoặc các đoạn kiểm tra `typeof window !== 'undefined'` mới thực sự chỉ chạy trên Client.

### Q2: Tại sao chúng ta không nên dùng `'use client'` cho mọi Component để code cho tiện?

- **Trả lời:** Việc lạm dụng `'use client'` sẽ làm mất đi tất cả lợi thế của App Router:
  1. **Bundle Size tăng vọt:** Mọi thư viện cài thêm (như Drizzle ORM, Zod, date-fns) import trong Client Component đều bị đóng gói gửi về trình duyệt.
  2. **Tốc độ tải trang chậm hơn:** Server không thể tối ưu render tĩnh hoặc stream nội dung tốt, làm tăng TTFB.
  3. **Lộ thông tin bảo mật:** Các API key hoặc biến môi trường bí mật có nguy cơ bị lộ ra client.
     _Quy tắc vàng:_ Luôn để component là Server Component mặc định, chỉ chuyển sang Client Component ở các tầng lá (Leaf Components) chứa tương tác trực tiếp của người dùng.

### Q3: Làm thế nào để giải quyết lỗi "Cannot serialize Date object" khi truyền dữ liệu từ Server sang Client?

- **Trả lời:** Có 3 cách khắc phục phổ biến:
  1. Chuyển đổi đối tượng `Date` thành string ISO hoặc timestamp số nguyên trên Server trước khi truyền làm prop: `createdAt: order.createdAt.toISOString()`.
  2. Sử dụng tầng Data Transfer Object (DTO) để lọc và chuẩn hóa dữ liệu trước khi chuyển giao.
  3. Sử dụng các thư viện hỗ trợ truyền tải nâng cao (như Superjson) nếu được cấu hình trên framework, nhưng cách thủ công chuyển đổi kiểu dữ liệu (Data Mapping) vẫn là tối ưu và tường minh nhất.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Cơ chế Dynamic Opt-out: [[NextJS_Dynamic_Opt_Out_Connection]]
- Next.js Server Actions: [[NextJS_Server_Actions]]
