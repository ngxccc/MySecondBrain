---
tags: [type/concept, topic/backend, pattern/api-design, layer/infrastructure]
date: 2026-04-28
aliases: [API Versioning, Backward Compatibility]
description: "Quản lý tương thích ngược (Backward Compatibility) bằng URI hoặc Header."
---

# API Versioning Strategies

## TL;DR

Các chiến lược quản lý nhiều phiên bản API chạy song song nhằm đảm bảo khả năng tương thích ngược (Backward Compatibility). Giúp hệ thống nâng cấp, thay đổi cấu trúc dữ liệu mà không làm crash các Client (đặc biệt là Mobile App) phiên bản cũ.

## Core Concept

- **URI Versioning (`/api/v1/users`):** Nhúng trực tiếp số version vào URL. Dễ nhìn, dễ test trên trình duyệt, dễ cấu hình Cache. Điểm trừ: Vi phạm nguyên tắc REST thuần túy vì URL không còn trỏ đến một tài nguyên duy nhất.
- **Header/Content Negotiation (`Accept: application/vnd.myapi.v2+json`):** Truyền version qua HTTP Header. Giữ cho URL cực kỳ sạch sẽ (`/api/users`). Điểm trừ: Khó debug nhanh (phải dùng tool can thiệp header), khó cấu hình CDN Cache.
- **Query Parameter (`/api/users?version=2`):** Nhanh, gọn nhưng thường chỉ dùng cho các thay đổi nhỏ giọt hoặc API public cấp thấp.

## Practical Implementation

- **Trade-offs (Chi phí duy trì):** Đừng lạm dụng việc tạo version mới cho mỗi thay đổi nhỏ. Việc duy trì song song v1, v2, v3 đồng nghĩa với việc em phải bảo trì gấp 3 lần lượng codebase (hoặc dính vào nợ kỹ thuật nếu code chồng chéo). Hãy cố gắng thiết kế API "cộng dồn" (chỉ thêm field mới, không xóa field cũ) để tránh phải bump version.
- **Code Snippet (Cấu trúc thư mục Next.js App Router theo URI Versioning):**

```text
src/
└── app/
    └── api/
        ├── v1/
        │   └── users/
        │       └── route.ts  # Trả về schema cũ (ví dụ có field: userName)
        └── v2/
            └── users/
                └── route.ts  # Trả về schema mới (ví dụ có field: full_name)
```

```typescript
// src/app/api/v2/users/route.ts
import { NextResponse } from "next/server";
import { UsersService } from "@/modules/users/users.service";

export async function GET(request: Request) {
  // HACK: Format data theo chuẩn v2 contract để không làm gãy Frontend mới
  const users = await UsersService.getAll();
  const v2Data = users.map((u) => ({
    id: u.id,
    full_name: u.fullName, // Field mới đổi tên ở v2
    created_timestamp: new Date(u.createdAt).getTime(),
  }));

  return NextResponse.json({ data: v2Data });
}
```

---

**Related Notes:**

- Nguyên lý thiết kế API chuẩn: [[REST_API_Design]]
- Cách tổ chức code để không bị trùng lặp giữa các version: [[Modular_Monolith_Architecture]]
