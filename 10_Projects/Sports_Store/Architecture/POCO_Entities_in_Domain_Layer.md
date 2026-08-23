---
tags:
  [
    type/concept,
    topic/architecture,
    topic/dotnet,
    topic/csharp,
    layer/architecture,
    project/sports-store,
  ]
date: 2026-08-23
aliases:
  [
    POCO in CSharp and Domain Layer,
    Plain Old CLR Object,
    POCO vs Framework Entities,
  ]
description: Định nghĩa bản chất POCO (Plain Old CLR Object) và lý do sử dụng POCO trong tầng Domain của dự án SportsStore.
status: permanent
---

# POCO Entities in Domain Layer

## TL;DR

- **Bản chất**: **POCO** (**P**lain **O**ld **C**LR **O**bject) là một class C# "thuần túy" — chỉ chứa dữ liệu (properties) và logic nghiệp vụ cơ bản, hoàn toàn **không kế thừa** từ các class cơ sở của framework (như `EntityObject`, `ControllerBase`) và không phụ thuộc vào bất kỳ thư viện CSDL nào.
- **Mục đích**: Bảo vệ tầng `Domain` khỏi sự phụ thuộc vào hạ tầng (Database / UI), cho phép tạo dữ liệu giả (Mock Data) để kiểm thử Unit Test trực tiếp trên RAM.
- **Điểm mấu chốt**: Trong `SportsStore.Domain`, các class `Product`, `Cart`, `CartLine` là POCO thuần túy; Entity Framework Core tự động ánh xạ các POCO này vào bảng SQL Server mà không yêu cầu entity phải sửa đổi mã nguồn.

---

## 1. POCO là gì? (First-Principles Breakdown)

Thuật ngữ **POCO** bắt nguồn từ thế giới Java (**POJO** - Plain Old Java Object), đại diện cho triết lý thiết kế hướng đối tượng tối giản:

```
┌────────────────────────────────────────────────────────┐
│                   POCO Class (Thuần túy)               │
│  - Không kế thừa framework class: public class Product │
│  - Không dính DB namespaces: System.Data / EF Core     │
│  - Không dính UI namespaces: Microsoft.AspNetCore      │
│  - Chỉ chứa dữ liệu & Business Logic                   │
└────────────────────────────────────────────────────────┘
```

### So sánh POCO vs Non-POCO (Kỷ nguyên cũ)

| Tiêu chí                 | Non-POCO (Framework-Coupled)                     | POCO (Modern .NET Clean Design)                                   |
| :----------------------- | :----------------------------------------------- | :---------------------------------------------------------------- |
| **Kế thừa**              | Kế thừa từ class của ORM (ví dụ `EntityObject`). | Class C# độc lập, không kế thừa framework class.                  |
| **Tính phụ thuộc**       | Dính chặt vào thư viện ORM, không thể tách rời.  | Độc lập 100% (Pure C#), nằm trọn vẹn trong `Domain`.              |
| **Khả năng Test**        | Bắt buộc phải kết nối CSDL thật để chạy test.    | Khởi tạo bằng `new Product()` chạy trên RAM trong vài micro-giây. |
| **Khả năng tái sử dụng** | Chỉ chạy được trong ứng dụng gắn với ORM đó.     | Tái sử dụng được trên Web, Console, Mobile, Microservices.        |

---

## 2. Tại sao SportsStore bắt buộc dùng POCO trong Domain?

1. **Tuân thủ quy tắc kiến trúc Clean Architecture**:
   - `SportsStore.Domain` là hạt nhân của hệ thống. Nếu `Product.cs` là Non-POCO (chứa logic của EF Core), tầng Domain sẽ bị vấy bẩn bởi hạ tầng dữ liệu.
2. **Khả năng tạo Mock Data tức thì (Lab 02)**:
   - Vì `Product` là POCO, lớp `MockProductRepository` có thể dễ dàng khởi tạo danh sách sản phẩm mẫu bằng cú pháp `new List<Product> { ... }` mà không cần biết CSDL tồn tại.
3. **ORM Transparency (Tính trong suốt của EF Core)**:
   - Entity Framework Core là một "Data Mapper". Nó tự động phân tích các thuộc tính của POCO `Product` (như `ProductID`, `Name`, `Price`) và sinh ra bảng `Products` tương ứng trong SQL Server thông qua `ApplicationDbContext`.

---

## 3. Code References in Repository

### A. POCO Entity Product

Tệp: `src/SportsStore.Domain/Entities/Product.cs`

```csharp
namespace SportsStore.Domain.Entities;

/// <summary>
/// Lớp POCO đại diện cho một sản phẩm trong hệ thống.
/// Hoàn toàn không kế thừa bất kỳ class nào và không có using bên ngoài.
/// </summary>
public class Product
{
    public int ProductID { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public required string Category { get; set; }
    public string? Color { get; set; }
}
```

### B. POCO Entity Cart & CartLine với Nghiệp vụ thuần túy

Tệp: `src/SportsStore.Domain/Cart.cs`

```csharp
namespace SportsStore.Domain;

/// <summary>
/// POCO chứa toàn bộ quy tắc nghiệp vụ giỏ hàng (không phụ thuộc Web/Session/DB).
/// </summary>
public class Cart
{
    public List<CartLine> Lines { get; set; } = new();

    public virtual void AddItem(Product product, int quantity)
    {
        CartLine? line = Lines
            .FirstOrDefault(p => p.Product.ProductID == product.ProductID);

        if (line == null)
        {
            Lines.Add(new CartLine { Product = product, Quantity = quantity });
        }
        else
        {
            line.Quantity += quantity;
        }
    }

    public virtual void RemoveLine(Product product) =>
        Lines.RemoveAll(l => l.Product.ProductID == product.ProductID);

    public decimal ComputeTotalValue() =>
        Lines.Sum(e => e.Product.Price * e.Quantity);

    public virtual void Clear() => Lines.Clear();
}

public class CartLine
{
    public int CartLineID { get; set; }
    public Product Product { get; set; } = new();
    public int Quantity { get; set; }
}
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[Dependency_Injection_Lifecycles_and_DbContext_Concurrency]]
- [[Clean_Architecture]]
- [[SOLID_Principles]]
