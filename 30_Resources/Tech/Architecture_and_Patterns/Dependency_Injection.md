---
tags: [type/concept, topic/tech, topic/architecture, layer/architecture]
date: 2026-04-28
aliases: [DI, Inversion of Control, IoC]
description: "Kỹ thuật đảo ngược luồng điều khiển (IoC) để giảm tight-coupling và dễ test."
---

# Dependency Injection

## TL;DR

Kỹ thuật thiết kế trong đó một đối tượng nhận các phụ thuộc (dependencies) từ bên ngoài truyền vào thay vì tự mình khởi tạo chúng. Giúp code linh hoạt, giảm sự phụ thuộc cứng (Decoupling) và cực kỳ dễ viết Unit Test.

## Core Concept

- **Problem (Tight Coupling):** Nếu Class A tự tạo Instance của Class B (`const b = new B()`), Class A bị dính chặt vào Class B. Nếu Class B thay đổi, Class A phải sửa theo. Khó thay thế Class B bằng bản Mock khi Testing.
- **Solution (Inversion of Control):** Class A chỉ định nghĩa là "Tôi cần một thứ giống như B". Việc tạo ra B và đưa vào A là trách nhiệm của "Shipper" (tầng khởi tạo hoặc DI Container).
- **Hollywood Principle:** "Don't call us, we'll call you". Component không chủ động tìm kiếm phụ thuộc, nó chờ phụ thuộc được "bơm" vào.

## Practical Implementation

- **Constructor Injection:** Cách phổ biến nhất. Truyền dependency qua hàm khởi tạo.
- **Props/Parameter Injection:** Phổ biến trong React và Functional Programming.
- **Benefit for Testing:** Dễ dàng thay thế database thật bằng `MockDatabase` trong môi trường thử nghiệm mà không cần sửa một dòng code nào trong logic nghiệp vụ.

```typescript
//  BAD: Tight Coupling (Khó test, khó sửa)
class OrderController {
  private service = new OrderService(); // Dính chặt vào OrderService cụ thể
  async handle() {
    return this.service.create();
  }
}

//  GOOD: Dependency Injection (Linh hoạt)
class OrderController {
  // Nhận interface từ ngoài vào, không quan tâm nó được khởi tạo ra sao
  constructor(private readonly service: IOrderService) {}
  async handle() {
    return this.service.create();
  }
}

// Khi chạy thật: new OrderController(new RealOrderService())
// Khi chạy test: new OrderController(new MockOrderService())
```

---

**Related Notes:**

- Mục tiêu của DI: [[Dependency_Inversion_Principle_DIP]]
- Cách giao tiếp giữa các Module: [[Public_Interface_Pattern]]
- Quy tắc phụ thuộc shared: [[Shared_Module_Dependency_Rule]]
