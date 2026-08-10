---
tags: [type/concept, topic/architecture, anti-pattern, layer/architecture]
date: 2026-05-01
aliases:
  [
    Circular Dependency,
    Cyclic Dependency,
    Phụ thuộc vòng tròn,
    Vòng lặp phụ thuộc,
    Dependency Cycle,
  ]
description: "Vòng lặp phụ thuộc tai hại giữa các module và cách giải quyết."
---

# Circular Dependency

## TL;DR

Circular Dependency (Phụ thuộc vòng tròn) xảy ra khi hai hoặc nhiều module phụ thuộc lẫn nhau trực tiếp hoặc gián tiếp, tạo thành chu kỳ trong dependency graph. Đây là anti-pattern nghiêm trọng, thường gây crash lúc khởi động và phá hủy khả năng maintain, test, scale codebase.

## Core Concept

- **Vấn đề cốt lõi:** Kiến trúc phần mềm tốt phải là Directed Acyclic Graph (DAG) – luồng phụ thuộc chỉ được phép một chiều. Circular Dependency phá vỡ nguyên tắc này, khiến module loader (Node.js, bundler, DI container) không thể xác định thứ tự khởi tạo.
- **Tight Coupling & Hậu quả:** Hai module dính chặt vào nhau, mất khả năng tái sử dụng độc lập, Unit Test khó viết và dễ sinh runtime error (undefined module hoặc initialization failure).
- **Nguyên tắc bị vi phạm:** Vi phạm nặng **Acyclic Dependencies Principle (ADP)** và **Stable Dependencies Principle (SDP)** – Shared/Common layer tuyệt đối không được phụ thuộc ngược lại Feature modules.

## Practical Implementation

- **Trade-offs & Rủi ro:** Trong Modular Monolith, circular dependency là ác mộng phổ biến nhất: `UserService` import `PostService` để đếm bài viết, còn `PostService` import ngược lại `UserService` để lấy info tác giả → app crash ngay lúc start. Ngoài ra còn làm chậm static analysis tools và khó refactor khi codebase scale.
- **Cách khắc phục chính:**
  1. **Extract common logic** ra module Shared/Common (ưu tiên, phải tuân thủ Shared Module Dependency Rule).
  2. **Dependency Injection** + Interface để đảo ngược chiều phụ thuộc.
  3. Sử dụng **Event Bus / Mediator** thay vì gọi trực tiếp.
  4. Áp dụng **Public Interface Pattern** để che giấu implementation nội bộ.

**Code Snippet:**

```typescript
// ❌ BAD - Circular Dependency
// user.service.ts
import { PostService } from "../posts/post.service";

export class UserService {
  constructor(private postService: PostService) {}
}

// post.service.ts
import { UserService } from "../users/user.service";

export class PostService {
  constructor(private userService: UserService) {}
}
```

```typescript
// ✅ GOOD - Break the cycle bằng Extraction + DI
// common/password-hasher.ts (Shared/Common)
export class PasswordHasher {
  static hash(password: string): string { ... }
}

// user.service.ts & post.service.ts đều depend vào Shared thay vì depend lẫn nhau
```

---

**Related Notes:**

- [[Shared_Module_Dependency_Rule]]
- [[Dependency_Injection]]
- [[Modular_Monolith_Architecture]]
- [[Public_Interface_Pattern]]
- [[Layered_Architecture]]
