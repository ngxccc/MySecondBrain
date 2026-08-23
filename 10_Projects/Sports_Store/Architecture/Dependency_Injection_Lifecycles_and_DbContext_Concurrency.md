---
tags:
  [
    type/concept,
    topic/architecture,
    topic/dotnet,
    topic/csharp,
    layer/core-mechanics,
    project/sports-store,
  ]
date: 2026-08-23
aliases:
  [
    Dependency Injection Lifecycles in ASP.NET Core,
    DbContext Concurrency and Thread Safety,
    Scoped vs Singleton vs Transient,
  ]
description: Phân tích bản chất vòng đời Dependency Injection (Scoped, Singleton, Transient) và cơ chế Concurrency của DbContext trong ASP.NET Core.
status: permanent
---

# Dependency Injection Lifecycles and DbContext Concurrency

## TL;DR

- **Bản chất**: `DbContext` trong Entity Framework Core **không thread-safe** và duy trì một bộ nhớ đệm `ChangeTracker` theo dõi trạng thái thực thể trong suốt vòng đời của nó.
- **Mục đích**: Sử dụng vòng đời `AddScoped` để gán mỗi HTTP Request một instance `DbContext` độc lập trên thread xử lý riêng, tự động giải phóng tài nguyên sau khi kết thúc request.
- **Điểm mấu chốt**: Đăng ký `AddSingleton` cho `DbContext` gây ra Race Condition làm crash server (`InvalidOperationException`) và rò rỉ bộ nhớ (Memory Leak); đăng ký `AddTransient` làm cạn kiệt Connection Pool của SQL Server.

---

## 1. Concurrency Mechanics & DI Service Lifecycles

Trong kiến trúc Web của ASP.NET Core (Kestrel Server), mỗi HTTP Request từ Client được xử lý trên một luồng (Thread) riêng biệt từ ThreadPool:

```
[ HTTP Request 1 (User A) ] ─── Thread 1 ───> [ DbContext Instance A ] (Scoped) ───> SQL Server
[ HTTP Request 2 (User B) ] ─── Thread 2 ───> [ DbContext Instance B ] (Scoped) ───> SQL Server
```

### So sánh 3 chế độ vòng đời (Lifecycles)

| Vòng đời           | Cơ chế cấp phát                                                                                       | Rủi ro với `DbContext`                                                                                                             | Trường hợp sử dụng chuẩn                                            |
| :----------------- | :---------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **`AddScoped`**    | Tạo 1 instance duy nhất cho mỗi phạm vi (Scope / HTTP Request). Tự động dispose khi request kết thúc. | **Không có rủi ro**. Thread-safe theo từng request, giải phóng RAM và kết nối DB đúng hạn.                                         | `DbContext`, `Repository`, `UnitOfWork`, `Cart` theo phiên.         |
| **`AddSingleton`** | Tạo 1 instance duy nhất tồn tại xuyên suốt vòng đời của toàn bộ ứng dụng (Application Lifecycle).     | **Thảm họa**: Crash hệ thống do xung đột đa luồng; Memory Leak do ChangeTracker phình to liên tục.                                 | Cache không đổi, Cấu hình read-only, Metrics collector.             |
| **`AddTransient`** | Tạo mới 1 instance mỗi khi có yêu cầu tiêm phụ thuộc (mỗi lần resolve).                               | **Suy giảm hiệu năng**: 1 Request gọi nhiều Service sẽ tạo nhiều `DbContext`, mở nhiều DB connection gây cạn kiệt Connection Pool. | Dịch vụ tính toán nhẹ, không lưu trạng thái (Stateless formatters). |

---

## 2. Failure Modes & Root Causes

### A. Race Condition & Server Crash với `AddSingleton`

`DbContext` được thiết kế tối ưu hóa hiệu năng nội tại mà không bao bọc bởi các khóa đồng bộ (Locks / Mutexes). Nếu hai thread đồng thời truy cập:

- **Hiện tượng**: Thread 1 đang thực thi `context.SaveChanges()` trong khi Thread 2 gọi `context.Products.ToList()`.
- **Hậu quả**: EF Core phát hiện trạng thái không hợp lệ và ném ngoại lệ làm dừng request:
  ```text
  System.InvalidOperationException: A second operation was started on this context instance
  before a previous operation completed. This is usually caused by different threads using
  the same instance of DbContext.
  ```

### B. Memory Leak do Change Tracker

`DbContext` lưu vết (track) mọi thực thể được đọc vào RAM để phát hiện thay đổi (`EntityEntryState`). Khi là `Singleton`:

- Hàng triệu dòng dữ liệu từ các câu query liên tục được nhét vào `ChangeTracker` mà không bao giờ bị dọn rác (Garbage Collector không thể thu hồi vì singleton giữ reference vĩnh viễn).
- Server sẽ cạn kiệt RAM và sập với lỗi `OutOfMemoryException`.

---

## 3. Code References in Repository

### A. Cấu hình Scoped DbContext và Repository

Tệp: `src/SportsStore.WebUI/Program.cs`

```csharp
// Đăng ký ApplicationDbContext ở mức Scoped (Mặc định của AddDbContext)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SportsStoreConnection"))
);

// Đăng ký Repository với Scope gắn liền vòng đời HTTP Request
builder.Services.AddScoped<IProductRepository, EFProductRepository>();

// Đăng ký SessionCart với Scope theo Request, tự động giải phóng sau phản hồi
builder.Services.AddScoped<Cart>(sp => SessionCart.GetCart(sp));
```

### B. Cấu hình DbContext trong Data Access Layer

Tệp: `src/SportsStore.Infrastructure/ApplicationDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using SportsStore.Domain.Entities;

namespace SportsStore.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Product> Products { get; set; }
}
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[Dependency_Injection]]
- [[Memory_Leaks_Core_Mechanics]]
- [[Stack_vs_Heap_Memory_Fundamentals]]
- [[Garbage_Collection_Fundamentals]]
