---
tags: [type/concept, topic/tech, pattern/architecture, layer/architecture]
aliases:
  [
    Repository vs Fat Service,
    Repository Pattern vs Transaction Script,
    Direct ORM,
  ]
description: "So sánh giữa Repository Pattern và Fat Service (Direct ORM) trong thiết kế tầng dữ liệu."
---

# Repository Pattern vs Fat Service

## TL;DR

So sánh hai trường phái thiết kế tầng truy cập dữ liệu (Data Access Layer): **Repository Pattern** tạo ra một lớp trừu tượng (abstraction) che giấu Database/ORM để phục vụ Domain Logic độc lập, trong khi **Fat Service (Direct ORM / Transaction Script)** nhúng trực tiếp truy vấn ORM vào lớp Service để giảm thiểu code thừa (boilerplate) và tận dụng tối đa sức mạnh của các ORM hiện đại (như Drizzle hay Prisma).

## Core Concept

- **Tại sao nó tồn tại & Giải quyết bài toán gì?**
  Khi phát triển ứng dụng Backend, việc thiết kế cách thức lớp Logic nghiệp vụ (Service/Domain) tương tác với lớp lưu trữ dữ liệu (Database) là vô cùng quan trọng.
  - **Repository Pattern** ra đời nhằm giải quyết sự phụ thuộc cứng (tight coupling) của Business Logic vào các truy vấn SQL hoặc thư viện ORM cụ thể. Nó tạo ra một lớp "hợp đồng" (Interface) hoạt động như một collection trong bộ nhớ của các Domain Object.
  - **Fat Service (Direct ORM)** ra đời để giải quyết vấn đề "lạm dụng trừu tượng" (over-abstraction) và hạn chế lượng code lặp đi lặp lại vô nghĩa (boilerplate) khi viết các lớp Repository đơn giản chỉ để gọi các hàm CRUD 1-1 của ORM.

- **Cơ chế hoạt động (How it works under the hood)**
  - **Repository Pattern**:
    `Client (Controller) -> Service -> Repository Interface -> Repository Implementation (ORM/SQL) -> Database`
    Lớp Service chỉ biết đến các phương thức định nghĩa trong Interface (ví dụ: `save(user: User)`). Lớp Implementation chịu trách nhiệm dịch nó thành câu truy vấn ORM hoặc SQL thực tế.
  - **Fat Service**:
    `Client (Controller) -> Service (Direct ORM Queries) -> Database`
    Lớp Service trực tiếp import instance của DB/ORM (ví dụ: `this.db` của Drizzle) và viết các câu lệnh `select()`, `insert()`, `update()`, `delete()` ngay trong lòng các hàm nghiệp vụ.

## Practical Implementation

- **Trade-offs (So sánh và Đánh đổi)**:

  | Tiêu chí                      | Repository Pattern                                                                  | Fat Service (Direct ORM)                                                    |
  | :---------------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
  | **Độ phức tạp (Boilerplate)** | **Cao**: Phải viết Interface, class cụ thể, DTO mapping.                            | **Thấp**: Viết truy vấn trực tiếp trong Service.                            |
  | **Sự phụ thuộc (Coupling)**   | **Thấp**: Độc lập với DB/ORM công nghệ (Persistence Ignorance).                     | **Cao**: Service bị gắn chặt vào ORM cụ thể (như Drizzle).                  |
  | **Khả năng Unit Test**        | **Rất dễ**: Chỉ cần mock Repository Interface bằng mock đơn giản.                   | **Trung bình**: Cần mock Database Connection hoặc API của ORM.              |
  | **Tối ưu hiệu năng Query**    | **Khó**: Khó tận dụng các tính năng đặc thù của ORM như Lazy loading, Dynamic Join. | **Rất dễ**: Tự do tối ưu truy vấn, sử dụng các hàm tối ưu trực tiếp từ ORM. |
  | **Phù hợp nhất**              | Hệ thống lớn, Domain Model phức tạp (DDD), dùng nhiều nguồn DB.                     | Hệ thống CRUD-heavy, vừa và nhỏ, sử dụng ORM mạnh mẽ (Prisma, Drizzle).     |

- **Code Snippet (TypeScript & Drizzle ORM)**:

  ### Cách 1: Triển khai với Repository Pattern (Clean Architecture)

  ```typescript
  // 1. Domain Entity
  export interface User {
    id: string;
    email: string;
    currentDebt: number;
  }

  // 2. Repository Interface (Domain/Application Layer)
  export interface UserRepository {
    findById(id: string): Promise<User | null>;
    updateDebt(id: string, amount: number): Promise<void>;
  }

  // 3. Repository Implementation (Infrastructure Layer)
  import { db } from "../db";
  import { users } from "../schema";
  import { eq } from "drizzle-orm";

  export class DrizzleUserRepository implements UserRepository {
    async findById(id: string): Promise<User | null> {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return row
        ? {
            id: row.id,
            email: row.email,
            currentDebt: parseFloat(row.currentDebt),
          }
        : null;
    }

    async updateDebt(id: string, amount: number): Promise<void> {
      await db
        .update(users)
        .set({ currentDebt: String(amount) })
        .where(eq(users.id, id));
    }
  }

  // 4. Service Layer (Chỉ biết Interface)
  export class UserService {
    constructor(private userRepo: UserRepository) {}

    async incrementDebt(id: string, orderTotal: number) {
      const user = await this.userRepo.findById(id);
      if (!user) throw new Error("User not found");
      await this.userRepo.updateDebt(id, user.currentDebt + orderTotal);
    }
  }
  ```

  ### Cách 2: Triển khai với Fat Service Pattern (Direct ORM)

  ```typescript
  import { eq } from "drizzle-orm";
  import { users } from "../schema";
  import { type PgDatabase } from "drizzle-orm/pg-core";

  export class UserService {
    // Inject trực tiếp Drizzle Database instance qua Constructor
    constructor(private db: PgDatabase<any, any>) {}

    async incrementDebt(id: string, orderTotal: number) {
      // Viết trực tiếp query trong service để giảm boilerplate
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      if (!user) throw new Error("User not found");

      const currentDebt = parseFloat(user.currentDebt || "0");

      await this.db
        .update(users)
        .set({ currentDebt: String(currentDebt + orderTotal) })
        .where(eq(users.id, id));
    }
  }
  ```

---

**Related Notes:**

- Kiến trúc phân tầng kinh điển: [[Layered_Architecture]]
- Tách biệt nghiệp vụ cốt lõi: [[Clean_Architecture]]
- Kỹ thuật giảm coupling: [[Dependency_Injection]]
- Quản lý giao dịch khi dùng Direct ORM: [[Outbox_Pattern]]
