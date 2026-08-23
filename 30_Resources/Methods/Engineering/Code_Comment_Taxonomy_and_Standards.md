---
tags:
  [
    type/method,
    topic/engineering,
    topic/programming/standards,
    topic/documentation,
    layer/architecture,
  ]
aliases:
  [Comment Taxonomy, Code Commenting Standards, Code Documentation Policy]
date: 2026-08-21
description: "Quy chuẩn phân cấp Comment trong mã nguồn (4-Tier Comment Taxonomy), phân biệt TSDoc cho Public API, // WHY: cho Invariants, và các loại comment cấm kỵ."
---

# Code Comment Taxonomy & Standards (SSOT)

## TL;DR

- **Bản chất**: Phân cấp và chuẩn hóa việc viết comment trong mã nguồn theo nguyên lý: _"Code tells you HOW, Comments tell you WHY"_.
- **Mục đích & Bài toán**: Xóa bỏ sự thiếu nhất quán (chỗ có comment, chỗ không), loại bỏ các comment rác (echoing code, dead code, excusing poor code) và bắt buộc ghi nhận các quyết định kỹ thuật / bất biến nghiệp vụ quan trọng.
- **Điểm mấu chốt**: Áp dụng **Bộ khung 4 tầng (4-Tier Taxonomy)**: TSDoc cho Public APIs, `// WHY:` cho Non-obvious Invariants / Safeguards, `// TODO(context):` cho Nợ kỹ thuật, và CẤM TUYỆT ĐỐI comment giải thích code hiển nhiên.

---

## Core Concept

### The 4-Tier Comment Taxonomy

```mermaid
flowchart TD
    Start[Định viết một Comment] --> Q1{Code có khó hiểu vì đặt tên xấu / hàm quá dài?}
    Q1 -- Có --> A1[REFACTOR LẠI CODE: Đổi tên biến, tách hàm con. KHÔNG VIẾT COMMENT]
    Q1 -- Không --> Q2{Là Public Utility / Helper / Decorator tái sử dụng nhiều nơi?}
    Q2 -- Có --> A2[VIẾT TSDoc: /** ... */ với intent, params, returns, invariants]
    Q2 -- Không --> Q3{Có Business Invariant / Bảo mật / Workaround / Fail-Open không hiển nhiên?}
    Q3 -- Có --> A3[VIẾT // WHY: Giải thích nguyên nhân hoặc rủi ro nếu xóa dòng này]
    Q3 -- Không --> Q4{Là việc cần làm dở / nợ kỹ thuật?}
    Q4 -- Có --> A4[VIẾT // TODO(ticket): Kèm ngữ cảnh giải thích]
    Q4 -- Không --> A5[KHÔNG VIẾT COMMENT: Để code tự chứng minh - Self-Documenting]
```

---

## Practical Implementation

### Tier 1: TSDoc / JSDoc (`/** ... */`) — Dành cho Public & Shared APIs

**Phạm vi**: Exported utilities (`utils/`), shared test helpers (`test/helpers/`, `test/factories/`, `test/mothers/`), custom decorators, pipes, guards, và các method Service phức tạp.  
**Mục đích**: Hiển thị tooltip gợi ý (IntelliSense) cho lập trình viên khác khi hover chuột vào hàm.

```ts
/**
 * Verifies PayOS Webhook HMAC-SHA256 signature using the checksum key.
 *
 * @param payload Raw webhook payload data
 * @param signature Received signature header
 * @returns true if signature is authentic; otherwise false
 *
 * @invariant INV-6 (Anti-Tampering): Prevents unauthorized payment confirmations
 */
export function verifyPayOSSignature(
  payload: unknown,
  signature: string,
): boolean {
  // ...
}
```

---

### Tier 2: `// WHY:` Comments — Dành cho Quyết định Kỹ thuật & Invariants

**Phạm vi**: Non-obvious architectural decisions, security safeguards, concurrency handling, resilience strategies, và third-party library workarounds.  
**Định dạng bắt buộc**: `// WHY: <Lý do kỹ thuật cụ thể>`.

```ts
// WHY: Split limit of 2 guards against colons inside a base-encoded key segment producing extra parts.
const [salt, key] = storedHash.split(":", 2);

// WHY: timingSafeEqual throws on length mismatch — guard prevents an uncaught TypeError.
if (derivedKey.length !== keyBuffer.length) {
  return false;
}

// WHY: Fail-open strategy if Redis rate-limiter is offline, prioritizing API availability over rate limiting.
return true;
```

---

### Tier 3: `// TODO(context):` Comments — Nợ Kỹ Thuật Có Địa Chỉ

**Quy tắc**: Tuyệt đối không viết `// TODO: fix this` chung chung mà thiếu ngữ cảnh. Phải nêu rõ lý do kỹ thuật hoặc ticket:

```ts
// TODO(auth-v2): Replace scrypt with Argon2id once native hardware acceleration is benchmarked in production.
```

---

### Tier 4: Banned Comments (Những loại comment CẤM TUYỆT ĐỐI)

| Loại Comment Bị Cấm                             | Ví dụ vi phạm                                                       | Cách khắc phục                                              |
| :---------------------------------------------- | :------------------------------------------------------------------ | :---------------------------------------------------------- |
| **Echoing Code** (Nói lại cái code đã thể hiện) | `// get user by id`<br>`const user = await getUser(id);`            | **Xóa**. Code đã tự giải thích.                             |
| **Comment chữa cháy cho code xấu**              | `// n: ticket count, s: show time`<br>`function calc(n, s) { ... }` | **Refactor**. Đổi tên biến thành `(ticketCount, showTime)`. |
| **Dead Code** (Code thừa bị comment lại)        | `// const oldPrice = basePrice * 1.2;`                              | **Xóa**. Git đã lưu lịch sử.                                |
| **Changelog / Author Tags**                     | `// Updated by Dev on 2026-08-20`                                   | **Xóa**. Dùng `git blame` và `git log`.                     |
| **Non-English Comments**                        | `// Lấy thông tin user từ database`                                 | **Chuyển ngữ sang tiếng Anh** hoặc xóa nếu hiển nhiên.      |

---

**Related Notes:**

- [[Master_Backend_Engineering_SSOT]]
- [[Clean_Architecture]]
- [[Database_Integration_Testing_Data_Seeding_Architecture]]
