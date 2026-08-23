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
    Three-Tier Architecture in SportsStore,
    Dependency Inversion in ASP.NET Core,
    3-Tier DIP,
  ]
description: Phân tích kiến trúc 3 lớp N-Tier và nguyên lý Dependency Inversion trong dự án SportsStore, cô lập Domain khỏi Database.
status: permanent
---

# Three-Tier Architecture and Dependency Inversion

## TL;DR

- **Bản chất**: Phân tách hệ thống thành 3 tầng độc lập (`Domain`, `Infrastructure`, `WebUI`), trong đó `Domain` là trung tâm quy tắc nghiệp vụ không phụ thuộc vào bất kỳ framework hay cơ sở dữ liệu nào.
- **Mục đích**: Triệt tiêu sự phụ thuộc cứng (Tight Coupling) vào Entity Framework Core / SQL Server, cho phép kiểm thử Unit Test cô lập trên RAM bằng Mock Data mà không cần bật Database.
- **Điểm mấu chốt**: Áp dụng Dependency Inversion Principle (DIP): `Domain` định nghĩa interface (`IProductRepository`), `Infrastructure` triển khai interface (`EFProductRepository`), và `WebUI` chỉ giao tiếp qua interface.

---

## 1. Architectural Boundaries & Coupling Rules

Trong solution `SportsStore.slnx`, quy tắc định hướng phụ thuộc (Dependency Direction) được kiểm soát nghiêm ngặt:

```
[ SportsStore.WebUI ] (Presentation Layer - MVC Controllers, Views)
        │                      │
        ▼                      │
[ SportsStore.Domain ] ◄───────┘ (Data Access Layer - EF Core, SQL Server)
(Business Core Layer)       [ SportsStore.Infrastructure ]
```

### Tại sao Domain tuyệt đối không tham chiếu Infrastructure?

1. **Bảo toàn tính trừu tượng của Business Rules**:
   - Nghiệp vụ của cửa hàng (`Product`, `Cart`, quy tắc tính tổng tiền, giảm giá) là bất biến trước các thay đổi công nghệ lưu trữ.
   - Nếu `Domain` tham chiếu `Infrastructure` hoặc `Microsoft.EntityFrameworkCore`, nghiệp vụ sẽ bị dính chặt (Coupled) vào SQL Server. Khi đổi sang MongoDB hay PostgreSQL, toàn bộ `Domain` phải bị sửa đổi.
2. **Khả năng kiểm thử cô lập (Fast Unit Testing)**:
   - Khi `Domain` chỉ chứa POCO (Plain Old CLR Object) và Interfaces, việc Unit Test chỉ tốn vài mili-giây trên RAM thông qua Mock Data (`MockProductRepository`).
   - Nếu `Domain` phụ thuộc `DbContext`, mọi test case đều phải khởi chạy SQL Server / Docker container, làm chậm CI/CD pipeline và gây flaky test do dữ liệu ngoại vi.

---

## 2. Dependency Inversion in Practice

Thay vì Controller khởi tạo trực tiếp lớp truy cập dữ liệu (`new EFProductRepository()`), hệ thống đảo ngược phụ thuộc qua interface:

- **Hợp đồng (Contract)**: `SportsStore.Domain` sở hữu `IProductRepository`.
- **Thực thi thật (Production)**: `SportsStore.Infrastructure` triển khai `EFProductRepository` giao tiếp SQL Server qua `ApplicationDbContext`.
- **Thực thi giả (Testing/Mock)**: `SportsStore.Application` triển khai `MockProductRepository` trả về danh sách in-memory.

---

## 3. Code References in Repository

### A. Định nghĩa Entity & Interface tại `Domain`

Tệp: `src/SportsStore.Domain/Entities/Product.cs`

```csharp
namespace SportsStore.Domain.Entities;

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

Tệp: `src/SportsStore.Domain/Interfaces/IProductRepository.cs`

```csharp
namespace SportsStore.Domain.Interfaces;

public interface IProductRepository
{
    IQueryable<Product> Products { get; }
}
```

### B. Triển khai Mock Data phục vụ Test không cần DB

Tệp: `src/SportsStore.Application/Concrete/MockProductRepository.cs`

```csharp
namespace SportsStore.Application.Concrete;

public class MockProductRepository : IProductRepository
{
    public IQueryable<Product> Products => new List<Product>
    {
        new Product { Name = "Football", Price = 25, Category = "Soccer", Description = "FIFA size" },
        new Product { Name = "Surf board", Price = 179, Category = "Watersports", Description = "Ocean board" }
    }.AsQueryable();
}
```

### C. Triển khai CSDL thật tại `Infrastructure`

Tệp: `src/SportsStore.Infrastructure/EFProductRepository.cs`

```csharp
namespace SportsStore.Infrastructure;

public class EFProductRepository : IProductRepository
{
    private ApplicationDbContext _context;

    public EFProductRepository(ApplicationDbContext ctx)
    {
        _context = ctx;
    }

    public IQueryable<Product> Products => _context.Products;
}
```

### D. Tiêm phụ thuộc qua Constructor tại `WebUI`

Tệp: `src/SportsStore.WebUI/Controllers/HomeController.cs`

```csharp
public class HomeController : Controller
{
    private readonly IProductRepository _repository;

    public HomeController(IProductRepository repository)
    {
        _repository = repository;
    }

    public IActionResult Index(string? category, int productPage = 1)
    {
        var products = _repository.Products
            .Where(p => category == null || p.Category == category)
            .OrderBy(p => p.ProductID)
            .Skip((productPage - 1) * PageSize)
            .Take(PageSize);
        // ...
    }
}
```

---

## Related Notes

- [[Dependency_Injection_Lifecycles_and_DbContext_Concurrency]]
- [[Clean_Architecture]]
- [[SOLID_Principles]]
- [[Dependency_Injection]]
- [[Repository_Pattern_vs_Fat_Service]]
