---
tags: [type/concept, topic/tech, layer/architecture]
aliases: [CA, Kiến trúc sạch, Clean Architecture]
created_at: Saturday, May 23rd 2026, 7:37:45 pm +07:00
updated_at: Saturday, May 23rd 2026, 7:37:45 pm +07:00
description: "Hệ tư tưởng phân tầng kiến trúc để cô lập và bảo vệ Core Business Logic khỏi sự phụ thuộc công nghệ."
---

# Clean Architecture

## TL;DR

Clean Architecture (Kiến trúc Sạch) do Robert C. Martin (Uncle Bob) khởi xướng là hệ tư tưởng phân tầng hệ thống với triết lý cốt lõi: **"Business Logic là vua, Công nghệ chỉ là chi tiết"**. Nó tạo ra một vách ngăn kiên cố ngăn cách luật nghiệp vụ cốt lõi khỏi sự ảnh hưởng của database, web framework, thư viện bên thứ ba, cho phép bạn dễ dàng thay đổi công nghệ như thay áo mà không làm suy chuyển phần hồn của ứng dụng.

## Core Concept

- **Tại sao nó tồn tại?** Tránh thảm họa "dính chặt công nghệ" (Technology Lock-in). Khi business logic bị trộn lẫn với ORM (như Sequelize, Prisma) hoặc framework (như Express, NestJS), việc nâng cấp phiên bản, vá lỗi bảo mật, hay đổi database (từ SQL sang NoSQL) sẽ trở thành cơn ác mộng viết lại toàn bộ hệ thống từ đầu.
- **Giải quyết bài toán gì?** Đảm bảo 5 đặc tính độc lập cốt lõi:
  1. _Độc lập với Framework:_ Framework chỉ là công cụ vận chuyển, không được làm bá chủ cấu trúc thư mục của bạn.
  2. _Độc lập với UI:_ Web, Mobile, Console hay gRPC chỉ là các cổng giao tiếp. Đổi giao diện không được ảnh hưởng đến logic xử lý bên trong.
  3. _Độc lập với Database:_ Toàn bộ logic chạy bằng "In-Memory", database chỉ là kho chứa thứ cấp.
  4. _Độc lập với External Agency:_ Không quan tâm bên ngoài dùng SDK gì hay API bên thứ 3 nào.
  5. _Khả năng Unit Test tối thượng:_ Có thể viết test cho toàn bộ logic nghiệp vụ mà không cần bật database, không cần mở cổng port mạng, chạy cực nhanh trong 1 giây.
- **Nó có thay thế cái gì hay không?** Kế thừa và hợp nhất Onion Architecture, Hexagonal Architecture (Ports & Adapters) để quy chuẩn hóa. Nó khai tử kiến trúc 3 lớp (3-Tier: Presentation - Business - Data Access) kiểu cũ vốn lấy database làm trung tâm (DB Schema quyết định cấu trúc code).
- **Áp dụng vào những dự án nào?**
  - _Bắt buộc CÓ:_ Core product có độ phức tạp nghiệp vụ (domain logic) cao, dự án dài hạn (> 1 năm) dự kiến sẽ scale lớn, hoặc các sản phẩm có kế hoạch thay đổi hạ tầng kỹ thuật linh hoạt.
  - _Tuyệt đối KHÔNG:_ Các app CRUD đơn thuần, chỉ lấy data lên rồi hiển thị (an sinh xã hội cho data). Áp dụng Clean Architecture vào đây sẽ biến dự án thành đống "over-engineering" khổng lồ với hàng chục file Mapper, DTO, Adapter rác chạy lòng vòng vô nghĩa.

---

### Cơ chế hoạt động

#### Quy tắc phụ thuộc

> "Source code dependencies must point only inward, toward higher-level policies."

Các vòng tròn đồng tâm đại diện cho các vùng khác nhau của phần mềm. Quy tắc sắt đá là: **Code ở vòng trong không được phép biết bất kỳ thông tin nào về code ở vòng ngoài.** Không được import class, function, hay database schema của vòng ngoài vào vòng trong.

#### 4 Vòng tròn kinh điển

```mermaid
graph TD
    subgraph Frameworks & Drivers [Frameworks & Drivers: Web, DB, Devices, UI]
        subgraph Interface Adapters [Interface Adapters: Presenters, Controllers, Gateways]
            subgraph Use Cases [Use Cases: Application Business Rules]
                subgraph Entities [Entities: Enterprise Business Rules]
                end
            end
        end
    end
    style Entities fill:#ff9999,stroke:#333,stroke-width:2px
    style Use Cases fill:#ffcc99,stroke:#333,stroke-width:2px
    style Interface Adapters fill:#ffff99,stroke:#333,stroke-width:2px
    style Frameworks & Drivers fill:#99ccff,stroke:#333,stroke-width:2px
```

1. **Entities (Lòng đỏ):** Chứa các thực thể nghiệp vụ cốt lõi của doanh nghiệp (Enterprise-wide Business Rules). Nó là lớp sạch sẽ nhất, trần trụi nhất, không phụ thuộc vào bất cứ công cụ hay framework nào.
2. **Use Cases (Lòng trắng):** Chứa các kịch bản sử dụng cụ thể của ứng dụng (Application-specific Business Rules). Nó trực tiếp điều phối luồng dữ liệu đi qua các Entities để hoàn thành mục tiêu của người dùng.
3. **Interface Adapters (Vách ngăn):** Chuyển đổi dữ liệu từ cấu trúc tiện nhất cho Use Cases & Entities sang định dạng thuận tiện nhất cho Web/Database/UI. Đây là nơi ngự trị của Controllers, Presenters và định nghĩa Repositories (Interface/Ports).
4. **Frameworks & Drivers (Vỏ ngoài):** Lớp ngoài cùng bẩn nhất, chứa các công cụ cụ thể như PostgresDB, ExpressJS, Fastify, AWS SDK... Lớp này chỉ chứa code cấu hình, boilerplate và kết nối.

---

## Practical Implementation

- **Trade-offs:**
  - Chi phí thiết lập ban đầu (Initial overhead) cực lớn.
  - Đòi hỏi viết rất nhiều boilerplate code và ánh xạ dữ liệu (Data Mapping: Entity <-> DTO <-> DB Model) để giữ ranh giới sạch sẽ.
  - Ranh giới kiến trúc rất mỏng manh, chỉ cần một dev lơ là import sai thư viện của vòng ngoài vào Entities là toàn bộ kiến trúc lập tức bị "thủng lưới".

```typescript
// ==========================================
// TẦNG 1: ENTITIES (Enterprise Business Rules)
// ==========================================
export class BankAccount {
  constructor(
    public readonly id: string,
    private balance: number,
    public readonly ownerEmail: string,
  ) {}

  // Pure business rule - invariant validation, NO framework code, NO database knowledge
  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");
    if (amount > this.balance) throw new Error("Insufficient funds");

    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance;
  }
}

// ==========================================
// TẦNG 2: USE CASES (Application Business Rules)
// ==========================================
// DTOs for data boundary crossing
export interface WithdrawRequest {
  accountId: string;
  amount: number;
}

// Port (Interface) that must be implemented by Outer layers (DIP)
export interface IAccountRepository {
  findById(id: string): Promise<BankAccount | null>;
  update(account: BankAccount): Promise<void>;
}

export class WithdrawUseCase {
  // Inject repository interface, NOT concrete implementation
  constructor(private readonly accountRepo: IAccountRepository) {}

  public async execute(request: WithdrawRequest): Promise<number> {
    const account = await this.accountRepo.findById(request.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    // Domain entity handles pure business logic
    account.withdraw(request.amount);

    // Save changes back to infrastructure through the port
    await this.accountRepo.update(account);

    return account.getBalance();
  }
}

// ==========================================
// TẦNG 3: INTERFACE ADAPTERS (Controllers, Presenters)
// ==========================================
export class AccountController {
  constructor(private readonly withdrawUseCase: WithdrawUseCase) {}

  // Maps HTTP Request to Use Case Input DTO and coordinates flow
  public async handleWithdraw(
    req: { body: { accountId: string; amount: number } },
    res: any,
  ): Promise<void> {
    try {
      const { accountId, amount } = req.body;
      const newBalance = await this.withdrawUseCase.execute({
        accountId,
        amount,
      });

      // Presenter role - returns clean JSON format
      res.status(200).json({ success: true, balance: newBalance });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

// ==========================================
// TẦNG 4: FRAMEWORKS & DRIVERS (Infrastructure, DB, Web Express)
// ==========================================
// SQL Implementation of the Repository Port
export class PostgresAccountRepository implements IAccountRepository {
  // WHY: Keeps database details encapsulated. High level rules don't know Prisma/SQL exists.
  public async findById(id: string): Promise<BankAccount | null> {
    console.log(`[SQL Query] SELECT * FROM accounts WHERE id = '${id}'`);
    // Simulating DB hit and mapping Database model to Domain Entity
    return new BankAccount(id, 1000, "user@domain.com");
  }

  public async update(account: BankAccount): Promise<void> {
    console.log(
      `[SQL Query] UPDATE accounts SET balance = ${account.getBalance()} WHERE id = '${account.id}'`,
    );
  }
}
```

---

**Related Notes:**

- [[Interface_Driven_Design]]
- [[Test_Driven_Design]]
- [[SOLID_Principles]]
- [[Dependency_Injection]]
