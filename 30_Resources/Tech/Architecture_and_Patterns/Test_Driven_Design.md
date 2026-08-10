---
tags: [type/concept, topic/tech, layer/quality]
aliases: [Test-Driven Development]
created_at: Saturday, May 23rd 2026, 6:23:01 pm +07:00
updated_at: Saturday, May 23rd 2026, 7:18:36 pm +07:00
description: "Quy trình viết test trước, code sau giúp định hình kiến trúc phần mềm sạch."
---

# Test-Driven Design

## TL;DR

TDD (Test-Driven Design) là hệ tư tưởng "viết test trước, code sau" hoạt động như một màng lọc kiến trúc, giúp định hình interface, decouple logic và triệt tiêu vĩnh viễn tình trạng "fix một chỗ, oẳng ba chỗ".

## Core Concept

- **Tại sao nó tồn tại?** Phá vỡ "Confirmation Bias" (code xong mới viết test để bao biện cho logic vừa đẻ ra). Ngăn chặn tình trạng viết test hời hợt, né edge cases và dẹp loạn các module bị dính chặt vào nhau (tight-coupling).
- **Giải quyết bài toán gì?** Thiết lập vòng lặp feedback tức thì (`Red -> Green -> Refactor`). Ép kỹ sư phải định nghĩa contract rành mạch (input, output, hành vi) trước khi nhảy vào implement chi tiết thuật toán.
- **Nó có thay thế cái gì hay không?** Tiễn quy trình "Code & Fix" truyền thống vào dĩ vãng. Thay thế tư duy thiết kế thác nước "Big Design Up Front" (vẽ UML rườm rà) bằng kiến trúc tiến hóa (Evolutionary Architecture) — hệ thống tự scale và hoàn thiện qua từng bài test.
- **Áp dụng dụng vào những dự án nào?** Phụ thuộc vào vòng đời và độ phức tạp của domain:
  - _Tuyệt đối KHÔNG:_ Dự án MVP, Outsource mì ăn liền (thay đổi requirement theo ngày) hoặc Frontend UI/Components.
  - _Bắt buộc CÓ:_ Core Product (lifespan > 2 năm), logic phức tạp. Tỏa sáng rực rỡ ở Backend (xử lý logic, API contract) và phần State Management của Frontend.
- **Cơ chế hoạt động (How it works under the hood).**
  - TDD là công cụ thực chiến của `Interface-Driven Design (IDD)`. Gọi một method chưa tồn tại ép bạn phải đẻ ra `Interface` của nó trước.
  - _Pragmatic TDD:_ Phân lô codebase. Áp dụng 100% TDD cho "Lòng đỏ" (Core Domain/Use Cases - thuần logic, không I/O). Bỏ qua TDD hoàn toàn cho "Lòng trắng" (Infrastructure/Database/UI - nơi logic mỏng nhưng thay đổi công nghệ liên tục) để né bẫy over-mocking.

## Practical Implementation

- **Trade-offs:** Đánh đổi tốc độ ship code ở giai đoạn đầu để lấy sự ổn định tuyệt đối về sau. Rủi ro ôm "nợ bảo trì test" khổng lồ nếu áp dụng sai lãnh thổ (chạy TDD cho các module giao tiếp I/O hoặc UI dễ biến động).

```typescript
import { describe, it, expect } from "bun:test";

// Contract Definition
export interface IPostRepository {
  getTrending(limit: number): Promise<PostEntity[]>;
}

// Unit Test Setup (Red -> Green)
describe("TimelineFeed Logic", () => {
  it("should fetch trending posts correctly", async () => {
    // Space/Time Complexity of mock setup: O(1) Time / O(N) Space
    const mockRepo: IPostRepository = {
      getTrending: async () => [
        { id: "1", content: "Pragmatic TDD strict mode" },
      ],
    };

    const feedService = new FeedService(mockRepo);
    const posts = await feedService.getFeed();

    expect(posts.length).toBeGreaterThan(0);
  });
});

// Implementation (Refactor)
export class FeedService {
  constructor(private readonly repo: IPostRepository) {}

  // PERF: Implement Redis caching layer here if RPS throughput exceeds infrastructure limits
  // Time Complexity: O(1) from service abstraction
  public async getFeed(): Promise<PostEntity[]> {
    return await this.repo.getTrending(50);
  }
}
```

**Related Notes:**

- [[Interface_Driven_Design]]
- [[Clean_Architecture]]
