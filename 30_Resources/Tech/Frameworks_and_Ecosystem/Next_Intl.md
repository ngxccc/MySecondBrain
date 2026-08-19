---
tags: [type/concept, topic/frontend, topic/i18n]
date: 2026-06-20
aliases: [Next.js Internationalization, next-intl, Đa ngôn ngữ NextJS]
description: "Thư viện i18n hỗ trợ strict type-safety và Server Components."
---

# Next-Intl & Internationalization

## TL;DR

**next-intl** là giải pháp đa ngôn ngữ (i18n) chuẩn mực và tối ưu nhất cho Next.js App Router. Khác biệt cốt lõi là nó tận dụng **React Server Components (RSC)** để dịch thuật và nạp dữ liệu ngôn ngữ trực tiếp từ File System ở Server, đẩy về client mã HTML tĩnh (Zero Client-side Bundle Size). next-intl quản lý định tuyến đa ngôn ngữ thông qua dynamic segment `[locale]/`, middleware tự động chuyển hướng và tích hợp chặt chẽ với TypeScript để cung cấp **Strict Type-Safety** cho các translation keys.

---

## Core Concept

### 1. Cơ chế hoạt động dưới nền tảng

- **Routing & Middleware Interception:** Middleware của Next.js sẽ chặn các request. Nếu URL thiếu locale (ví dụ: `/portal`), middleware phân tích header `Accept-Language` của trình duyệt hoặc Cookie ngôn ngữ của người dùng để thực hiện chuyển hướng tự động (redirect) sang URL tương ứng (ví dụ: `/en/portal`).
- **Server-Side Translation:** Khi sử dụng `useTranslations` trong một Server Component, next-intl sẽ đọc file JSON ngôn ngữ trực tiếp từ ổ đĩa máy chủ ở thời điểm render. Mã nguồn tệp dịch JSON hoàn toàn **không bị gửi về client**, giúp giảm thiểu tối đa bundle size của trình duyệt và tối ưu điểm Core Web Vitals (SEO).
- **Cấu hình Request (`getRequestConfig`):** next-intl yêu cầu một file `request.ts` làm cầu nối để tải về các tệp ngôn ngữ một cách bất đồng bộ dựa trên segment locale hiện tại trên URL, đồng thời tích hợp logic kiểm duyệt đầu vào (validation) để tránh người dùng khai thác URL sai locale.

### 2. Tối ưu hóa SEO với `localePrefix: "as-needed"`

Trong file `routing.ts`, việc cấu hình `localePrefix: "as-needed"` giúp tối ưu hóa tối đa cấu trúc URL:

- Đường dẫn ngôn ngữ mặc định (ví dụ: tiếng Việt `vi`) sẽ được hiển thị phẳng dưới dạng gốc (ví dụ `/portal` thay vì `/vi/portal`).
- Chỉ khi người dùng chuyển sang ngôn ngữ phụ (ví dụ: tiếng Anh `en`), prefix mới được chèn vào URL (ví dụ `/en/portal`).
- Việc này giúp giữ nguyên cấu trúc URL tối ưu cho SEO tại thị trường nội địa chính của doanh nghiệp.

### 3. Strict Type-Safety với Translation Keys

Next-intl cho phép liên kết TypeScript trực tiếp với tệp ngôn ngữ JSON mặc định thông qua cấu hình `experimental.createMessagesDeclaration: "./messages/vi.json"` trong `next.config.ts`.

- Trình biên dịch sẽ tự động kiểm tra xem key dịch thuật (ví dụ `t("auth.loginError")`) có tồn tại và đúng cấu trúc trong file JSON hay không. Nếu bạn gõ sai chính tả key, TypeScript sẽ báo lỗi biên dịch lập tức.

---

## Practical Implementation

### 1. Nạp tệp ngôn ngữ và Validate an toàn

Trong dự án Hyundai Ecommerce, file nạp cấu hình ngôn ngữ được viết chặt chẽ nhằm tránh việc người dùng nhập thủ công locale bậy bạ lên URL gây lỗi ứng dụng:

```typescript
// apps/storefront/src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import type { Locale } from "next-intl";

const isValidLocale = (locale: unknown): locale is Locale => {
  return (
    typeof locale === "string" && routing.locales.includes(locale as Locale)
  );
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  // Fallback an toàn nếu người dùng cố tình hack/gõ URL sai locale
  const locale = isValidLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (
      (await import(`../../messages/${locale}.json`)) as {
        default: Record<string, string>;
      }
    ).default,
  };
});
```

### 2. Tránh vòng lặp Redirect bằng cách sử dụng Custom Link

- **Nguyên tắc:** Tuyệt đối cấm sử dụng `Link` mặc định từ `next/link`.
- **Lý do:** `next/link` gốc không tự động nhận biết prefix locale. Nếu bạn đang ở ngôn ngữ tiếng Anh `/en/portal` và bấm `<Link href="/profile">`, trình duyệt sẽ cố gắng truy cập `/profile` -> server nhận request thấy thiếu prefix -> Middleware chặn và gửi lệnh Redirect 307 về `/en/profile` -> Gây ra **vòng lặp redirect**, tốn thêm RTT (Round-trip time) và làm UX giật lag.
- **Giải pháp:** Bắt buộc sử dụng custom `Link` được sinh ra từ `createNavigation(routing)` trong file `routing.ts`:

```typescript
// apps/storefront/src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
  localeDetection: false,
});

// Sinh ra Link, redirect, useRouter thông minh tự nhận biết locale segment
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3. Đồng bộ vs Bất đồng bộ trong Dịch thuật

- **Đồng bộ (`useTranslations`):** Dùng trực tiếp trong phần render UI của RSC hoặc Client Component.
- **Bất đồng bộ (`getTranslations`):** Bắt buộc phải dùng ở các hàm bất đồng bộ bên ngoài phần render UI như hàm cấu hình SEO `generateMetadata` hoặc Route Handlers (API).

```typescript
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

// 1. Dùng trong UI (RSC) -> Hook Đồng bộ (Sync)
export default function HomePage() {
  const t = useTranslations("HomePage");
  return <h1>{t("title")}</h1>;
}

// 2. Dùng trong cấu hình SEO -> Gọi Async
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title") };
}
```

---

## Interview Prep

### Q1: Điểm khác biệt lớn nhất giữa next-intl trong App Router và react-i18next trong các ứng dụng SPA ?

- **Trả lời:** Ở các ứng dụng SPA truyền thống, toàn bộ tệp JSON chứa các câu dịch thuật phải được gửi về trình duyệt của người dùng để JavaScript thực hiện dịch thuật ngay tại client. Việc này làm tăng bundle size và tốn CPU. Với next-intl kết hợp React Server Components (RSC) trong Next.js App Router, tệp JSON được đọc và biên dịch trực tiếp từ ổ đĩa máy chủ. HTML trả về trình duyệt đã được điền sẵn ngôn ngữ, trình duyệt nhận về và hiển thị ngay lập tức với **0 KB JS dịch thuật**.

### Q2: Tại sao việc quên dùng Custom Link của next-intl lại có thể gây ảnh hưởng xấu tới hiệu năng và SEO?

- **Trả lời:** Khi dùng `next/link` gốc, các liên kết sẽ bị mất tiền tố locale (ví dụ `/en/`). Khi người dùng click, trình duyệt gửi request về máy chủ, Next.js Middleware phát hiện thiếu prefix và trả về mã chuyển hướng 302/307 để bắt client tải lại trang với URL đúng `/en/profile`. Vòng lặp chuyển hướng này làm tăng gấp đôi số lần bắt tay kết nối mạng (RTT), làm chậm tốc độ tải trang của người dùng và làm các công cụ tìm kiếm (Google Bot) phải mất công dò quét qua link chuyển hướng trung gian, làm giảm thứ hạng SEO của website.

### Q3: Cơ chế "fallback" an toàn trong file request.ts của bạn giải quyết lỗi bảo mật nào?

- **Trả lời:** Nó giải quyết lỗi khai thác tệp tin hệ thống (Path Traversal/IDOR). Nếu chúng ta import trực tiếp dynamic path mà không lọc: `await import(../../messages/${locale}.json)`, một kẻ tấn công có thể thay đổi biến `locale` trên URL thành `../../config` hoặc một đường dẫn nhạy cảm khác để cố tình đọc trộm cấu hình hệ thống. Việc validate biến `locale` bằng hàm `isValidLocale` (so khớp cứng với mảng `routing.locales` cho phép trước) đảm bảo hệ thống chỉ import đúng các file ngôn ngữ hợp lệ.

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Cơ chế Dynamic Rendering: [[NextJS_Dynamic_Opt_Out_Connection]]
- React Server Components: [[React_Server_Components]]
