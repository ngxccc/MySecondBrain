---
tags: [type/concept, topic/tech, layer/architecture]
aliases: [SOLID, 5 nguyên lý thiết kế hướng đối tượng, SOLID Principles]
created_at: Saturday, May 23rd 2026, 7:35:12 pm +07:00
updated_at: Saturday, May 23rd 2026, 7:35:12 pm +07:00
description: "Bộ 5 nguyên lý vàng thiết kế hướng đối tượng giúp code modular, linh hoạt và dễ bảo trì."
---

# SOLID Principles

## TL;DR

SOLID là bộ 5 nguyên lý thiết kế hướng đối tượng (OOD) kinh điển được đúc kết bởi Robert C. Martin (Uncle Bob). Nó đóng vai trò là "kim chỉ nam" tối thượng giúp kỹ sư phần mềm biến những mớ code rối rắm, dễ đổ vỡ thành một hệ thống linh hoạt, modular, dễ mở rộng và có khả năng chống chọi cực tốt trước những đợt thay đổi requirement liên tục từ khách hàng.

## Core Concept

- **Tại sao nó tồn tại?** Trị tận gốc 4 "căn bệnh ung thư" của phần mềm:
  - _Rigidity (Cứng nhắc):_ Hệ thống quá khó để thay đổi. Một sửa đổi nhỏ cũng kéo theo một chuỗi phản ứng dây chuyền buộc phải sửa ở hàng tá class khác.
  - _Fragility (Dễ vỡ):_ Mỗi khi sửa code ở một module, các phần khác hoàn toàn không liên quan lại lăn đùng ra oẳng một cách bí ẩn.
  - _Immobility (Bất động):_ Không thể tái sử dụng các module hiện có vì chúng bị dính chặt (tight-coupling) vào các thành phần khác.
  - _Viscosity (Nhớt nháp):_ Lười biếng trong thiết kế. Việc làm sai (đắp vá bừa bãi) luôn dễ dàng hơn làm đúng (refactor tử tế).
- **Giải quyết bài toán gì?** Thiết lập ranh giới (Boundaries) rõ ràng giữa các thành phần. Đảm bảo tính liên kết cao (High Cohesion) trong nội bộ module và tính phụ thuộc lỏng lẻo (Loose Coupling) giữa các module với nhau. Code trở nên "pluggable" — dễ dàng cắm rút và thay thế linh kiện như chơi LEGO.
- **Nó có thay thế cái gì hay không?** Không thay thế các Design Patterns mà là "nền móng" để các Design Patterns dựa vào đó sinh ra. Nó tiễn tư duy code "chạy được là ăn mừng" ra chuồng gà, thay bằng tư duy kỹ nghệ (Engineering) có tầm nhìn dài hạn.
- **Áp dụng vào những dự án nào?**
  - _Bắt buộc CÓ:_ Dự án có lifespan > 6 tháng, hệ thống core product, thư viện/SDK dùng chung, hoặc bất kỳ hệ thống nào muốn triển khai Clean Architecture một cách chuẩn chỉ.
  - _Tuyệt đối KHÔNG:_ Script chạy tự động một lần (One-off scripting), MVP/Prototype cực nhỏ cần hoàn thiện trong 2-3 ngày để validate thị trường rồi vứt đi. Đừng lọt hố "Premature Abstraction" (Trừu tượng hóa quá sớm) ở những dự án mì ăn liền.

---

### Bóc tách 5 nguyên lý

#### 1. S - Single Responsibility Principle

> "A class should have one, and only one, reason to change."

- **Bản chất:** Một class/module chỉ nên chịu trách nhiệm cho duy nhất một nhóm tác nhân (Actor). Đừng tạo ra các "God Class" ôm đồm vừa xử lý logic, vừa query DB, vừa gửi Mail và validate UI. Hãy phân rã chúng ra.

#### 2. O - Open/Closed Principle

> "Software entities should be open for extension, but closed for modification."

- **Bản chất:** Khi cần thêm tính năng mới, ta chỉ viết thêm code mới (kế thừa, implement interface, polymorphism) chứ tuyệt đối không chọc ngoáy, sửa đổi code cũ đã chạy ổn định. Giúp triệt tiêu rủi ro làm hỏng những gì đang chạy tốt.

#### 3. L - Liskov Substitution Principle

> "Subtypes must be substitutable for their base types."

- **Bản chất:** Class con phải kế thừa và thực thi trọn vẹn hành vi của class cha mà không làm thay đổi tính đúng đắn của chương trình. Nếu class con ghi đè một method của cha và ném ra `NotImplementedException`, hoặc ép client phải kiểm tra `if (child instanceof ConcreteType)` thì bạn đã phá vỡ LSP.

#### 4. I - Interface Segregation Principle

> "Clients should not be forced to depend on methods they do not use."

- **Bản chất:** Thà đẻ ra nhiều interface nhỏ gọn, tập trung vào từng hành vi chuyên biệt (role interface) còn hơn ép client phụ thuộc vào một "Mega Interface" khổng lồ chứa hàng chục method dư thừa mà họ không thèm đụng tới.

#### 5. D - Dependency Inversion Principle

> "Depend upon abstractions, not concretions."

- **Bản chất:**
  1. Module cấp cao (High-level) không được phụ thuộc trực tiếp vào module cấp thấp (Low-level). Cả hai phải phụ thuộc vào Abstraction (Interface).
  2. Abstraction không được phụ thuộc vào chi tiết (Implementation). Chi tiết phải phụ thuộc vào Abstraction.

---

## Practical Implementation

- **Trade-offs:** Tăng độ phức tạp cấu trúc ban đầu của hệ thống. Tạo ra sự bùng nổ số lượng class, interface, file khiến dev mới vào dự án dễ bị chóng mặt khi trace code. Đòi hỏi sự kỷ luật và năng lực thiết kế hệ thống tốt từ đội ngũ phát triển.

```typescript
// ==========================================
// BAD WAY: tightly coupled, violations everywhere
// ==========================================
class ViolationOrderProcessor {
  // Violates SRP: Handles validation, database saving, and email notifications in one class
  // Violates DIP: Directly depends on concrete class PostgresDatabase and GmailService
  public processOrder(order: any) {
    if (order.amount <= 0) throw new Error("Invalid order amount");

    const db = new PostgresDatabase(); // Coupled!
    db.saveOrder(order);

    const mailer = new GmailService(); // Coupled!
    mailer.sendEmail(order.userEmail, "Order Processed successfully!");
  }
}

// ==========================================
// GOOD WAY: Pure SOLID
// ==========================================

// --- SRP & ISP: Small, highly cohesive Interfaces ---
export interface IOrderValidator {
  validate(order: Order): void;
}

export interface IOrderRepository {
  save(order: Order): Promise<void>;
}

export interface INotificationService {
  notify(recipient: string, message: string): Promise<void>;
}

// --- LSP compliant subclasses ---
export class Order {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly userEmail: string,
  ) {}
}

// --- Concrete Implementations (Details depending on Abstraction) ---
export class DomainOrderValidator implements IOrderValidator {
  public validate(order: Order): void {
    if (order.amount <= 0) {
      throw new Error("Order amount must be greater than zero.");
    }
  }
}

export class PostgresOrderRepository implements IOrderRepository {
  // WHY: Keeps database operations isolated from business flow.
  // Time Complexity: O(1) for insert query.
  public async save(order: Order): Promise<void> {
    console.log(`[Database] Saving order ${order.id} to Postgres...`);
  }
}

export class SESNotificationService implements INotificationService {
  public async notify(recipient: string, message: string): Promise<void> {
    console.log(`[SES Email] Sending to ${recipient}: ${message}`);
  }
}

// --- DIP: High-level module depends ONLY on interfaces ---
// --- OCP: We can swap DB or Notification system without changing this class ---
export class SolidOrderProcessor {
  constructor(
    private readonly validator: IOrderValidator,
    private readonly repository: IOrderRepository,
    private readonly notifier: INotificationService,
  ) {}

  // PERF: DB and Mail notifications are executed asynchronously to keep response times low
  public async process(order: Order): Promise<void> {
    this.validator.validate(order);

    await this.repository.save(order);

    // Non-blocking notification flow to avoid dragging API latency down
    this.notifier
      .notify(order.userEmail, `Your order ${order.id} has been processed!`)
      .catch((err) => console.error("Failed to send notification:", err));
  }
}
```

---

**Related Notes:**

- [[Interface_Driven_Design]]
- [[Test_Driven_Design]]
- [[Clean_Architecture]]
- [[Dependency_Injection]]
