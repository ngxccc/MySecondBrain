---
tags: [type/concept, topic/tech, layer/architecture]
aliases: [IDD, Contract-First Design, Contract-Driven Development]
created_at: Saturday, May 23rd 2026, 6:20:30 pm +07:00
updated_at: Saturday, May 23rd 2026, 7:19:54 pm +07:00
description: "Thiết kế dựa trên giao diện (contract-first) giúp các lớp lỏng lẻo và phát triển song song."
---

# Interface-Driven Design

## TL;DR

IDD (Interface-Driven Design) là hệ tư tưởng "chốt kèo trên giấy trước, code thật sau". Nó ép kỹ sư phải định nghĩa rành mạch các bản hợp đồng (Interface/Contract) quy định input/output giữa các module trước khi cắm đầu vào viết logic, giúp các team (Front-end, Back-end, Microservices) có thể làm việc song song mà không phải mốc mỏ chờ nhau.

## Core Concept

- **Tại sao nó tồn tại?** Trị tận gốc căn bệnh "code bám dính" (tight-coupling) khi các class phụ thuộc trực tiếp vào implementation của nhau. Ngăn chặn thói quen làm việc theo kiểu "waterfall cục bộ" (ông A phải code xong class X thì ông B mới có cái để code class Y).
- **Giải quyết bài toán gì?** Đảm bảo nguyên lý Dependency Inversion (chữ D trong SOLID): High-level modules và Low-level modules đều phải phụ thuộc vào Abstraction. Đồng thời phá bỏ nút thắt cổ chai (bottleneck) trong giao tiếp team — chỉ cần chốt Swagger/Interface là Front-end có thể tự mock data chạy trước, Back-end cứ từ từ tà tà mà code.
- **Nó có thay thế cái gì hay không?** Tiễn tư duy "Implementation-First" (vừa nghĩ vừa gõ logic lộn xộn) ra chuồng gà. Xóa sổ thói quen giao tiếp API/method bằng mồm hoặc qua mấy file docs Word/Excel lỗi thời.
- **Áp dụng dụng vào những dự án nào?**
  - _Bắt buộc CÓ:_ Kiến trúc Microservices, dự án có Front-end/Back-end tách biệt, dự án chia nhiều team làm chung một codebase, hoặc khi build open-source Libraries/SDKs.
  - _Tuyệt đối KHÔNG:_ Các đoạn script vứt đi chạy một lần (cron jobs nhỏ), dự án MVP 1 thành viên tự lo từ A-Z cần go-to-market tốc độ bàn thờ.
- **Cơ chế hoạt động (How it works under the hood).**
  - Tạo ra một vách ngăn (boundary) vô hình giữa các layer. Khi Layer A muốn gọi Layer B, nó không gọi thẳng thằng `PostgresDB` mà gọi thằng `IDatabase`.
  - Nhờ vậy, lúc testing hoặc đổi công nghệ, bạn có thể swap nóng (dependency injection) cái ruột bên trong từ `PostgresDB` sang `RedisCache` hoặc `MockDB` mà hệ thống không hề bị vỡ rạn.

## Practical Implementation

- **Trade-offs:** Dễ lọt hố over-engineering (Premature Abstraction) — đẻ ra hàng chục cái Interface rác cho những class chỉ có duy nhất 1 implementation trọn đời. Ngoài ra, việc chốt contract ban đầu đòi hỏi Senior phải có tầm nhìn, chốt sai mà sau này sửa là "cook" cả bầy vì phải update lại toàn bộ hệ thống mock/test của các team liên quan.

```typescript
// Contract/Boundary Definition
export interface ISocialGraphRepository {
  getFollowers(userId: string): Promise<string[]>;
}

// Implementation A: The real deal for Production
export class Neo4jSocialGraph implements ISocialGraphRepository {
  // WHY: Using Neo4j here over Postgres because deep graph traversal (friends of friends) causes exponential join explosion in SQL.
  // Time Complexity: O(log N) for traversal / Space: O(V + E)
  public async getFollowers(userId: string): Promise<string[]> {
    // ... Neo4j cypher query logic ...
    return ["user_2", "user_3"];
  }
}

// Implementation B: The Mock for local testing / TDD
export class MockSocialGraph implements ISocialGraphRepository {
  public async getFollowers(userId: string): Promise<string[]> {
    return ["mock_user_a", "mock_user_b"];
  }
}

// Core Domain Logic - depends ONLY on Abstraction
export class RecommendFriendService {
  constructor(private readonly graphRepo: ISocialGraphRepository) {}

  // PERF: Consider paginating the result if the user has > 10,000 followers to avoid Node.js Event Loop block.
  public async generateSuggestions(userId: string): Promise<string[]> {
    const followers = await this.graphRepo.getFollowers(userId);
    return followers.filter((id) => id.startsWith("user_"));
  }
}
```

**Related Notes:**

- [[Test_Driven_Design]]
- [[Clean_Architecture]]
- [[Dependency_Injection]]
- [[SOLID_Principles]]
