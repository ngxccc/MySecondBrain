---
tags:
  [project/hyundai-ecommerce, type/audit, performance/v8, memory/optimization]
aliases: [V8 Performance Audit, Memory Audit, Hidden Class Audit]
date: 2026-06-20
---

# V8 Engine & Memory Performance Audit

## TL;DR

Tài liệu này thực hiện audit hệ thống mã nguồn dự án Hyundai E-commerce (phân vùng `storefront` và `database` package) dưới góc nhìn tối ưu hóa công cụ thực thi V8 (V8 JavaScript Engine) và quản lý bộ nhớ (Stack, Heap, Garbage Collection). Kết quả phân tích chỉ ra các điểm cần tối ưu hóa:

1. **Hidden Class Transitions (Thay đổi hình dáng đối tượng):** Khởi tạo đối tượng rỗng rồi gán thuộc tính động trong câu lệnh query builder tại `packages/database/src/services/user/user.service.ts` (dòng 120-126) và `packages/database/src/services/quotes/quotes.service.ts` (dòng 70-76).
2. **Garbage Collection Churn (Áp lực dọn rác):** Cấp phát và sao chép đối tượng liên tục trong vòng lặp của store quản lý giỏ hàng tại `apps/storefront/src/features/cart/hooks/use-cart.ts` (dòng 63-68 và 98-103).
3. **Toán tử `delete` làm suy giảm hiệu năng:** Sử dụng từ khóa `delete` trên đối tượng phụ `inputValues` trong `apps/storefront/src/features/cart/components/cart-template.tsx` (dòng 55).

---

## Core Concept

Để tối ưu hóa mã chạy trên V8 (hoặc JavaScriptCore của Bun), chúng ta cần tuân thủ các nguyên lý thiết kế bộ nhớ cấp thấp:

### 1. Giữ hình dạng đối tượng ổn định (Stable Object Shapes / Hidden Classes)

V8 sử dụng cơ chế **Hidden Classes (hoặc Shapes)** để tối ưu hóa truy cập thuộc tính qua **Inline Caching (IC)**.

- Khi một đối tượng được tạo ra với một tập hợp các thuộc tính cố định, V8 sẽ liên kết nó với một Hidden Class.
- Nếu ta gán thêm thuộc tính mới sau khi khởi tạo (Dynamic Property Assignment), V8 sẽ buộc phải thực hiện **Class Transition** (tạo ra một Hidden Class mới và chuyển đổi cấu trúc liên kết). Việc này phá hủy Inline Caching, khiến việc truy cập thuộc tính chậm đi hàng chục lần.

### 2. Tránh sử dụng toán tử `delete`

Toán tử `delete` trong JavaScript xóa một thuộc tính khỏi đối tượng. Khi gặp `delete`, V8 sẽ chuyển đổi đối tượng đó từ **Fast Mode** (dựa trên Hidden Classes) sang **Slow Mode** (Dictionary/Hash Map Mode). Đối tượng lúc này sẽ truy cập thuộc tính chậm hơn và khó tối ưu hóa JIT hơn.

### 3. Giảm thiểu Heap Churn để giảm áp lực cho Garbage Collector

- **Khi nào sử dụng `.map()` và `.filter()`?** các hàm này hoàn toàn bình thường và được khuyến khích sử dụng cho việc render UI (ví dụ trong JSX để render danh sách phần tử) hoặc các tác vụ biến đổi dữ liệu một lần (one-off transformations).
- **Vấn đề cần tránh:** Tránh lạm dụng chúng kết hợp với toán tử Spread `{ ...item }` trong các đường dẫn đột biến nóng (**hot mutation paths**) chạy với tần suất cực cao (ví dụ: kích hoạt cập nhật Zustand store và gọi API lưu server liên tục theo từng ký tự gõ phím khi người dùng đang nhập số lượng giỏ hàng). Việc này sẽ tạo ra hàng triệu đối tượng ngắn hạn trên Heap, kích hoạt cơ chế dọn rác phụ (**Minor GC / Scavenger**) liên tục, dẫn đến hiện tượng lag nhẹ (GC pauses) trên Main Thread.

---

## Detailed Findings & Optimized Code

### 1. Khắc phục Hidden Class Transitions trong Database Query Builder

**Địa điểm phát hiện:**

- `packages/database/src/services/user/user.service.ts` (dòng 120-126)
- `packages/database/src/services/quotes/quotes.service.ts` (dòng 70-76)

#### Hiện trạng mã nguồn (`user.service.ts`):

```typescript
const whereConditions: Record<string, { eq: string }> = {};
if (filters?.role) {
  whereConditions["role"] = { eq: filters.role }; // Transition sang shape mới
}
if (filters?.businessType) {
  whereConditions["businessType"] = { eq: filters.businessType }; // Transition tiếp tục
}
```

#### Giải pháp tối ưu:

Khởi tạo đối tượng với đầy đủ thuộc tính ngay từ đầu bằng Object Literal (hoặc trả về `undefined`), giữ nguyên duy nhất một Hidden Class cố định và loại bỏ hoàn toàn việc cấp phát mảng của `Object.keys()`:

```typescript
const whereConditions =
  filters?.role || filters?.businessType
    ? {
        ...(filters.role ? { role: { eq: filters.role } } : {}),
        ...(filters.businessType
          ? { businessType: { eq: filters.businessType } }
          : {}),
      }
    : undefined;
```

---

### 2. Giảm Heap Allocation trong Zustand Store

**Địa điểm phát hiện:** `apps/storefront/src/features/cart/hooks/use-cart.ts` (dòng 63-68 và 98-103)

#### Hiện trạng mã nguồn:

```typescript
items: state.items.map((i) =>
  i.productId === item.productId
    ? { ...i, quantity: finalQty } // Cấp phát đối tượng mới trên Heap
    : i,
),
```

#### Giải pháp tối ưu:

Tích hợp middleware **Immer** (`produce` từ thư viện `immer`) để đột biến trực tiếp thuộc tính mà không cần nhân bản toàn bộ đối tượng:

```typescript
import { produce } from "immer";

// Trong Zustand action:
set(
  produce((state) => {
    const item = state.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = finalQty; // Đột biến trực tiếp (Immer tự quản lý bất biến ngầm)
    }
  }),
);
```

---

### 3. Loại bỏ toán tử `delete` trong React Component

**Địa điểm phát hiện:** `apps/storefront/src/features/cart/components/cart-template.tsx` (dòng 55)

#### Hiện trạng mã nguồn:

```typescript
setInputValues((prev) => {
  const copy = { ...prev };
  delete copy[productId]; // Đưa đối tượng sang Dictionary Mode
  return copy;
});
```

#### Giải pháp tối ưu:

Sử dụng Rest Destructuring để tạo ra đối tượng sạch mới tại chỗ mà không dùng đến `delete`:

```typescript
setInputValues((prev) => {
  const { [productId]: _, ...rest } = prev;
  return rest;
});
```

---

## Interview Prep (Câu hỏi phỏng vấn thực tế)

### Q1: Tại sao việc gán thuộc tính động (Dynamic Property Assignment) lại ảnh hưởng xấu đến hiệu năng V8?

- **Trả lời:** V8 không biết trước cấu trúc lớp của các đối tượng động ở compile-time, nên nó sử dụng **Hidden Classes** để ánh xạ vị trí các thuộc tính trong bộ nhớ (offset). Khi ta gán thêm một thuộc tính mới vào đối tượng sau khi nó đã được tạo, V8 bắt buộc phải thực hiện **Class Transition** để tạo ra một Hidden Class mới trỏ đến offset mới. Nếu hành động này diễn ra lặp đi lặp lại trong các vòng lặp lớn, V8 sẽ tiêu tốn tài nguyên CPU để chuyển đổi lớp liên tục và làm mất tác dụng của bộ đệm **Inline Caching (IC)** dùng để tối ưu hóa việc truy cập thuộc tính nhanh.

### Q2: Tại sao nên tránh toán tử `delete` trong JS hiệu năng cao?

- **Trả lời:** Khi ta sử dụng toán tử `delete` để xóa thuộc tính của một đối tượng, V8 sẽ coi đối tượng đó là không ổn định và chuyển nó từ dạng tối ưu **Fast Mode** sang dạng **Slow Mode (Dictionary Mode)**. Ở chế độ này, đối tượng được quản lý như một bảng băm (Hash Map) thông thường, mọi hành động đọc/ghi thuộc tính đều phải thực hiện tra cứu hash table thay vì truy cập trực tiếp bằng offset bộ nhớ trực tiếp.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Quản lý bộ nhớ Stack/Heap: [[JS_Stack_vs_Heap_Memory]]
- Hệ thống kiểu dữ liệu: [[TS_Type_System_Structural_Type_Erasure]]
