---
tags:
  [
    type/concept,
    topic/tech,
    language/javascript,
    library/state-management,
    performance/memory,
  ]
aliases: [Immer, ImmerJS, Copy-on-Write, Structural Sharing, Immutable State]
date: 2026-06-20
description: "Quản lý trạng thái bất biến (Immutable State) thông qua cơ chế Copy-on-Write (COW) và ES6 Proxy, giải pháp tối ưu cho Zustand/Redux stores."
---

# Immer.js: Copy-on-Write & Immutable State Management

## TL;DR

**Immer** là một thư viện JavaScript giúp đơn giản hóa việc quản lý trạng thái bất biến (Immutable State). Nó cho phép lập trình viên viết mã đột biến trực tiếp (mutable mutation) tự nhiên trên một đối tượng nháp (`draft`), sau đó tự động chuyển đổi thành trạng thái mới bất biến thông qua cơ chế **Copy-on-Write (COW)** sử dụng ES6 **Proxy**. Immer đảm bảo tối ưu hóa bộ nhớ thông qua **Structural Sharing (Chia sẻ cấu trúc)** và loại bỏ hoàn toàn các rủi ro lỗi khi sử dụng các toán tử spread lồng nhau (`...`) phức tạp.

---

## Core Concept

### 1. Cơ chế hoạt động: Copy-on-Write & Proxy

Immer hoạt động thông qua một hàm trung tâm là `produce(baseState, recipe)`:

- **Draft State (Bản nháp):** Khi bắt đầu, Immer tạo ra một đối tượng `Proxy` bao bọc lấy `baseState` gốc. Bản nháp `draft` này sẽ hứng toàn bộ các thao tác ghi (mutations) của bạn.
- **Đánh chặn (Interception):** Khi bạn thực hiện thay đổi trên `draft`, ES6 `Proxy` sẽ đánh chặn các thao tác đó.
- **Sao chép lười biếng (Lazy Cloning / Copy-on-Write):** Immer **không** clone toàn bộ object tree ngay lập tức. Chỉ khi bạn bắt đầu ghi đè/thay đổi thuộc tính của một node cụ thể, Immer mới thực hiện sao chép nông (shallow copy) node đó.
- **Đóng băng kết quả (Finalization):** Khi hàm kết thúc, Immer duyệt qua cây và lắp ghép các phần đã clone mới với các phần không đổi (chia sẻ tham chiếu cũ) để tạo ra `nextState` hoàn chỉnh và gọi `Object.freeze()` để bảo vệ nó.

```
[baseState] ── Proxy (draft) ── Mutate Node A ── [nextState]
  ├─ Node A ──────────────────── Cloned Node A ────┤ (Đã đổi tham chiếu)
  └─ Node B (Không đổi) ───────────────────────────┴─ (Dùng lại tham chiếu cũ)
```

### 2. Structural Sharing

Đây là tính năng cốt lõi giúp các thư viện như React hoạt động hiệu quả:

- Nhờ chỉ sao chép các nút bị đột biến, các phần dữ liệu không thay đổi vẫn giữ nguyên địa chỉ ô nhớ (tham chiếu).
- React có thể thực hiện kiểm tra so sánh nông (`prevProp !== nextProp`) ở tốc độ $O(1)$ cực nhanh, bỏ qua việc render lại (re-render) các component có dữ liệu không đổi.

---

## Practical Implementation

### 1. So sánh: Toán tử Spread thủ công vs. Immer `produce`

Khi ta cần cập nhật sâu một trạng thái lồng nhau (ví dụ: cập nhật số lượng của một sản phẩm trong giỏ hàng):

#### Cách viết Spread thủ công

```typescript
const updateCartItemQty = (
  cart: Cart,
  productId: string,
  qty: number,
): Cart => {
  return {
    ...cart,
    items: cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: qty } : item,
    ),
  };
};
```

#### Cách viết sử dụng Immer

```typescript
import { produce } from "immer";

const updateCartItemQty = (
  cart: Cart,
  productId: string,
  qty: number,
): Cart => {
  return produce(cart, (draft) => {
    const item = draft.items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = qty; // Đột biến trực tiếp an toàn
    }
  });
};
```

### 2. Tích hợp Immer trực tiếp trong Zustand Store

Hệ thống E-commerce hiện tại của chúng ta sử dụng Immer để tối ưu hóa cập nhật giỏ hàng trong `apps/storefront/src/features/cart/hooks/use-cart.ts`:

```typescript
import { produce } from "immer";

export const useCartStore = create<CartState>()(
  persist((set, get) => ({
    items: [],
    addItem: async (item, quantity) => {
      set(
        produce((state: CartState) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existingItem) {
            existingItem.quantity = Math.min(
              existingItem.quantity + quantity,
              item.totalStock,
            );
          } else {
            state.items.push(createCartItem(item, quantity));
          }
        }),
      );
    },
  })),
);
```

> [!note] Bối cảnh dự án (Project Context)
> Hiện tại trong monorepo, `use-cart.ts` là Zustand store duy nhất được kích hoạt (vì phân vùng `apps/admin` đã chủ động không sử dụng Zustand để giữ cấu trúc tinh gọn). Các ứng viên tương lai phù hợp cho việc tích hợp Immer là bất kỳ Zustand store mới nào được tạo ra có cấu trúc dữ liệu phức tạp, lồng sâu hoặc có tần suất đột biến cao.

---

## Interview Prep

### Q1: Immer JS hoạt động dưới runtime như thế nào để đảm bảo tính bất biến của dữ liệu?

- **Trả lời:** Immer hoạt động dựa trên cơ chế Copy-on-Write (COW) và ES6 Proxy. Khi chạy hàm `produce`, Immer tạo ra một đối tượng Proxy đại diện cho trạng thái gốc (gọi là `draft`). Khi ta đột biến `draft`, các Proxy trap sẽ đánh chặn hành động ghi và chỉ thực hiện sao chép nông (shallow copy) các đối tượng thực sự bị thay đổi. Khi kết thúc, Immer ghép các bản sao nông này với các phần dữ liệu cũ không thay đổi (structural sharing) để trả về một trạng thái mới hoàn toàn độc lập và đóng băng nó bằng `Object.freeze()`.

### Q2: Sử dụng Immer có ảnh hưởng gì tới hiệu năng so với việc tự viết toán tử spread `...` thủ công?

- **Trả lời:**
  - **Về mặt CPU/Memory:** Immer có một phần nhỏ chi phí runtime (overhead) để khởi tạo Proxy và theo dõi các thay đổi. Với các trạng thái nhỏ và nông, viết spread thủ công sẽ nhanh hơn. Tuy nhiên, với các đối tượng lớn và lồng sâu, Immer thực sự tối ưu hơn nhờ cơ chế sao chép lười (lazy cloning) và ngăn ngừa các lỗi re-render không cần thiết của React do vô tình làm thay đổi tham chiếu của các nhánh không bị biến đổi.
  - **Về mặt DX (Developer Experience):** Immer giúp giảm thiểu lượng code boilerplate, làm code dễ đọc, dễ bảo trì hơn rất nhiều và loại bỏ hoàn toàn các bug liên quan đến việc quên sao chép các thuộc tính lồng sâu.

---

## Related Notes

- Bản đồ tri thức: [[000_Tech_MOC]]
- Đánh giá hiệu năng thực tế dự án: [[10_Projects/Hyundai_Ecommerce/Docs/V8_Performance_Audit.md|V8_Performance_Audit]]
- Cơ chế dọn rác bộ nhớ: [[JS_Generational_Garbage_Collection]]
