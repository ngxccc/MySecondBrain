---
tags: [type/concept, topic/architecture, pattern/design, layer/architecture]
date: 2026-04-28
aliases: [Module Facade, Boundary Interface]
description: "Cổng giao tiếp an toàn giữa các module (Facade)."
---

# Public Interface Pattern

## TL;DR

Kỹ thuật đóng gói (Encapsulation) ở cấp độ Architecture. Tạo ra một "Cổng giao tiếp" duy nhất cho một Module, giấu đi toàn bộ logic phức tạp và database schema bên trong. Các module khác chỉ được phép tương tác thông qua cổng này.

## Core Concept

- **Vấn đề (High Coupling):** Trong kiến trúc Modular Monolith, nếu Module `Orders` chọc thẳng vào `ProductRepository` để check tồn kho, hai module sẽ dính chặt vào nhau. Sửa database của Product sẽ làm crash Orders.
- **Giải pháp (Blackbox):** Chia Module thành 2 phần:
  - _Internal (Private):_ Chứa logic nghiệp vụ lõi, Entity, ORM/Database queries.
  - _Public (Facade):_ Lớp vỏ bọc bên ngoài. Chỉ expose ra các method an toàn (Ví dụ: `checkStock(id)`).
- **Barrel File (`index.ts`):** Đóng vai trò là chốt chặn bảo vệ (Gatekeeper). Tại thư mục gốc của module, ta chỉ `export` cái Public Interface và DTO. Tuyệt đối cấm export Internal Services.

## Practical Implementation

- **Trade-offs (Leaking Entities):** Cạm bẫy tử thần là hàm Public lại return về nguyên một Mongoose/Drizzle Schema Object. Khi đó, Module bên ngoài có thể gọi lệnh `.save()` và vô tình sửa luôn Database của Module nội bộ. Bắt buộc phải biến đổi dữ liệu thành plain object (Data Transfer Object - DTO) trước khi trả về.
- **Code Snippet (TypeScript thuần):**

```typescript
// 1. Vùng Public: src/modules/product/product.api.ts
import { ProductInternalService } from "./internal/product.service";

export const ProductPublicAPI = {
  // Chỉ phô ra những hàm an toàn, che giấu logic nội bộ
  async checkStock(productId: string, qty: number): Promise<boolean> {
    const product = await ProductInternalService.findById(productId);
    return product ? product.stock >= qty : false;
  },
};

// 2. Chốt chặn: src/modules/product/index.ts
export { ProductPublicAPI } from "./product.api";
// CẤM EXPORT: export * from './internal/...';

// 3. Module khác sử dụng: src/modules/orders/orders.service.ts
import { ProductPublicAPI } from "@/modules/product"; // Chỉ import từ cổng

const createOrder = async (item) => {
  const isAvailable = await ProductPublicAPI.checkStock(item.id, item.qty);
  if (!isAvailable) throw new Error("Out of stock");
};
```

---

**Related Notes:**

- Nền tảng áp dụng pattern này: [[Modular_Monolith_Architecture]]
- Cách đóng gói dữ liệu an toàn để trả về: [[Data_Transfer_Object_DTO]]
