---
title: Postgres SELECT FOR UPDATE (Pessimistic Locking)
tags:
  [
    type/concept,
    topic/tech,
    layer/infrastructure,
    database/postgres,
    concurrency/locking,
  ]
aliases: [SELECT FOR UPDATE, Row-Level Locking, Pessimistic Locking]
date: 2026-06-08
description: "Cơ chế Row-Level Exclusive Lock trong PostgreSQL chống tranh chấp đồng thời (TOCTOU / Race Condition)."
---

# Postgres SELECT FOR UPDATE

## TL;DR

`SELECT ... FOR UPDATE` trong PostgreSQL thiết lập **Row-Level Exclusive Lock (Khóa độc quyền cấp dòng)** lên các bản ghi được chọn trong một Database Transaction. Nó ngăn chặn các transaction khác thực hiện `UPDATE`, `DELETE`, hoặc `SELECT ... FOR UPDATE` trên cùng các dòng đó cho đến khi transaction giữ khóa kết thúc (`COMMIT` hoặc `ROLLBACK`). Phương pháp này giải quyết triệt để rủi ro tranh chấp dữ liệu đồng thời (**Race Condition / TOCTOU**) khi nhiều tiến trình thao tác trên cùng một bản ghi.

## Core Concept

### 1. Cơ chế hoạt động của Row-Level Exclusive Lock

Khi một câu lệnh `SELECT ... FOR UPDATE` được thực thi bên trong một transaction:

- **Bản ghi bị khóa**: Chỉ những bản ghi (rows) thỏa mãn điều kiện `WHERE` và thực sự được trả về mới bị đặt khóa độc quyền.
- **Phạm vi tác động đối với các Transaction khác**:
  - ❌ **`UPDATE` / `DELETE`**: Bị chặn và bắt buộc phải **chờ (WAIT)** cho tới khi transaction giữ khóa hoàn tất.
  - ❌ **`SELECT ... FOR UPDATE` / `FOR SHARE`**: Bị chặn và bắt buộc phải chờ.
  - ✅ **Plain `SELECT` (Đọc thông thường)**: **Không bị chặn** nhờ cơ chế **MVCC (Multi-Version Concurrency Control)** của PostgreSQL. Trình truy vấn đọc phiên bản dữ liệu nhất quán trước khi bị khóa mà không bị treo.
  - ✅ **Bản ghi khác**: Các bản ghi khác trong cùng bảng hoàn toàn không bị ảnh hưởng.

### 2. Chu kỳ sống của Lock

Khóa được giữ trong suốt thời gian giao dịch diễn ra và tự động giải phóng khi:

- Transaction thực thi `COMMIT` thành công.
- Transaction thực thi `ROLLBACK` khi gặp sự cố.

### 3. Giải quyết bài toán TOCTOU

Lỗi TOCTOU xảy ra khi khoảng thời gian giữa lúc **Check** (kiểm tra trạng thái) và **Use** (cập nhật trạng thái) bị một request khác can thiệp. Việc dùng `.for("update")` đặt khóa ngay từ bước **Check** giúp đảm bảo trạng thái dữ liệu không bị thay đổi bất ngờ trước bước **Use**.

## Practical Implementation

### Ví dụ 1: Câu lệnh SQL thuần

```sql
BEGIN;

-- Khóa dòng người dùng có email chỉ định để kiểm tra
SELECT id, status, verification_expires_at
FROM users
WHERE email = 'user@example.com'
FOR UPDATE;

-- Thực hiện cập nhật an toàn
UPDATE users
SET verification_token = 'new_token_hash', updated_at = NOW()
WHERE email = 'user@example.com';

COMMIT;
```

### Ví dụ 2: Sử dụng Drizzle ORM trong NestJS

```typescript
await this.db.transaction(async (tx) => {
  // 1. Lock dòng user ngay khi đọc dữ liệu để ngăn ngừa TOCTOU & Race Condition
  const [user] = await tx
    .select()
    .from(users)
    .where(eq(users.email, dto.email))
    .for("update");

  // 2. Anti-enumeration check
  if (!user || user.status !== "pending_verification") {
    return;
  }

  // 3. Cooldown check (60s)
  if (user.verificationExpiresAt) {
    const tokenCreatedAt =
      user.verificationExpiresAt.getTime() - 24 * 60 * 60 * 1000;
    if (Date.now() - tokenCreatedAt < 60000) {
      return;
    }
  }

  // 4. Update an toàn khi dòng đang bị giữ khóa
  await tx
    .update(users)
    .set({
      verificationToken,
      verificationExpiresAt,
    })
    .where(eq(users.id, user.id));
});
```

## Related Notes

- [[000_Tech_MOC]]
- [[Database_Indexing_Guidelines]]
- [[Outbox_Pattern]]
