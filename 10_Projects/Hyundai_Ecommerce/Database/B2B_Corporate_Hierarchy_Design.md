---
tags: [type/concept, topic/tech, project/hyundai-ecommerce]
aliases: [B2B Corporate Hierarchy, Phân cấp Đại lý B2B, Dealer-Employee Link]
date: 2026-06-22
---

# B2B Corporate Hierarchy Design

## TL;DR

Thiết kế hệ thống phân cấp doanh nghiệp B2B (Corporate Account Hierarchy) cho các tài khoản đại lý (Dealer), liên kết nhân viên mua hàng (`DEALER_PURCHASER`) với chủ doanh nghiệp (`DEALER_APPROVER`) để ủy quyền hạn mức tín dụng và kiểm soát quyền truy cập đơn hàng an toàn.

## Core Concept

### Tại sao nó tồn tại & Giải quyết bài toán gì?

Trong mô hình thương mại điện tử B2B dành cho đại lý máy phát điện Hyundai, một doanh nghiệp đại lý có thể gồm:

1. **Chủ doanh nghiệp (`DEALER_APPROVER`):** Người sở hữu hạn mức tín dụng thương mại (Trade Credit), có quyền phê duyệt/từ chối các đơn đặt hàng bằng tín dụng của nhân viên.
2. **Nhân viên mua hàng (`DEALER_PURCHASER`):** Người trực tiếp lên đơn mua hàng nhưng không sở hữu hạn mức tín dụng riêng, mà phải sử dụng hạn mức tín dụng được ủy quyền từ chủ doanh nghiệp.

Thiết kế này giải quyết bài toán:

- Liên kết nhiều tài khoản nhân viên vào chung một tài khoản chủ đại lý để dùng chung hạn mức tín dụng.
- Phân định rõ ràng trách nhiệm: Nhân viên tạo đơn hàng chờ duyệt (`PENDING_APPROVAL`), chủ đại lý kiểm tra hạn mức và thực hiện phê duyệt đơn để trừ hạn mức và ghi nhận công nợ.
- Cô lập dữ liệu (Data Isolation): Đảm bảo chủ doanh nghiệp chỉ xem được đơn hàng của chính mình và nhân viên trực thuộc, tránh rò rỉ dữ liệu sang đại lý khác hoặc khách lẻ.

### Cơ chế hoạt động (How it works under the hood)

1. **Liên kết CSDL (`parentId` self-reference):**
   Cột `parentId` trong bảng `user` tự tham chiếu đến khóa chính `id` của chính bảng `user`. Tài khoản nhân viên sẽ lưu `parentId` là `id` của chủ doanh nghiệp sở hữu.
2. **Kế thừa thông tin doanh nghiệp:**
   Khi tạo tài khoản nhân viên thông qua Portal, nhân viên tự động kế thừa các thông tin pháp lý từ tài khoản cha như: `companyName`, `taxId`, `businessType`, `province`, `dealerTierId`.
3. **Ủy quyền Tín dụng thương mại (Credit Delegation):**
   - Khi nhân viên tạo đơn hàng bằng Trade Credit, hệ thống truy vấn tài khoản cha để kiểm tra hạn mức tín dụng khả dụng (`creditLimit - currentDebt`). Nếu đủ, đơn hàng được tạo với trạng thái phê duyệt là `PENDING_APPROVAL`.
   - Khi chủ doanh nghiệp bấm phê duyệt đơn hàng, hệ thống sẽ thực hiện khóa dòng (`SELECT FOR UPDATE`) tài khoản chủ doanh nghiệp để cập nhật tăng công nợ (`currentDebt`) của chủ doanh nghiệp an toàn, tránh race condition.
4. **Cô lập dữ liệu thông qua `parentId`:**
   Tại trang chi tiết đơn hàng (`portal/orders/[id]`), quyền xem đơn hàng của chủ doanh nghiệp được kiểm định trực tiếp bằng khoá ngoại:
   `isCompanyApprover = order.user.parentId === session.user.id`.

## Practical Implementation

### Trade-offs

- **Tăng tải truy vấn liên kết:** Phải thực hiện JOIN hoặc truy vấn thêm tài khoản cha khi xử lý các nghiệp vụ liên quan đến hạn mức hoặc quyền hạn của nhân viên.
- **Mất đồng bộ thông tin đại lý:** Nếu tài khoản cha thay đổi tên công ty hoặc tỉnh thành, cần có cơ chế đồng bộ hoặc quy định chỉ được phép sửa đổi tại tài khoản gốc.

### Code snippet / Architecture diagram

#### 1. Database Schema (`auth.schema.ts` & `relations.ts`)

```typescript
// auth.schema.ts
export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references((): AnyPgColumn => users.id, {
    onDelete: "set null",
  }),
  // ... các trường thông tin doanh nghiệp khác
});

// relations.ts
export const usersRelations = relations(users, ({ one, many }) => ({
  parent: one(users, {
    fields: [users.parentId],
    references: [users.id],
    relationName: "parent_child",
  }),
  employees: many(users, {
    relationName: "parent_child",
  }),
}));
```

#### 2. Phân quyền và Xác thực xem đơn hàng (`portal/orders/[id]/page.tsx`)

```typescript
const order = await orderService.getComplexOrder(orderId);

const isOwner = order.userId === session.user.id;
let isCompanyApprover = false;
let approverCompany: string | null = null;

if (session.user.role === "DEALER_APPROVER") {
  // Kiểm tra nếu chủ đại lý có parentId của nhân viên trùng khớp với ID của mình
  isCompanyApprover = order.user.parentId === session.user.id;
  if (isOwner || isCompanyApprover) {
    approverCompany = order.user.companyName;
  }
}

if (!isOwner && !isInternalAdmin && !isCompanyApprover) {
  redirect({ href: "/portal/profile", locale });
  return null;
}
```

---

**Related Notes:**

- [[000_Hyundai_MOC.md.md]]
- [[Database_Payment_Design]]
- [[Docs/Better_Auth_Session_Flow]]
