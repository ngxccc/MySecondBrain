---
tags:
  [
    type/concept,
    topic/database,
    topic/dotnet,
    topic/csharp,
    topic/efcore,
    layer/infrastructure,
    project/sports-store,
  ]
date: 2026-08-23
aliases:
  [
    IQueryable vs IEnumerable in EF Core,
    Server-side vs Client-side Evaluation,
    LINQ SQL Translation Mechanics,
  ]
description: Phân tích cơ chế chuyển đổi LINQ sang SQL của IQueryable, so sánh với IEnumerable và phân tích thảm họa Memory Explosion khi query dữ liệu lớn.
status: permanent
---

# EF Core Query Pipeline: IQueryable vs IEnumerable

## TL;DR

- **Bản chất**: `IQueryable<T>` lưu trữ cây biểu thức (`Expression Tree`), được Entity Framework Core phân tích cú pháp và dịch thành câu lệnh SQL tối ưu chạy trực tiếp trên **SQL Server Engine** (Server-side Evaluation). `IEnumerable<T>` đại diện cho danh sách đối tượng trong bộ nhớ, ép buộc thực thi truy vấn ngay lập tức và kéo toàn bộ dữ liệu về **RAM của Web Server** (Client-side Evaluation).
- **Mục đích**: Tận dụng chỉ mục (Indexes) và sức mạnh tính toán của SQL Server để chỉ truyền tải một lượng nhỏ dữ liệu cần thiết qua đường truyền mạng.
- **Điểm mấu chốt**: Đổi `IQueryable` sang `IEnumerable` trước khi gọi `.Where()`, `.Skip()`, `.Take()` sẽ ép EF Core tải toàn bộ bảng (ví dụ 1.000.000 bản ghi) về RAM của Web Server, gây nghẽn băng thông mạng, sập CPU và tràn bộ nhớ (`OutOfMemoryException`).

---

## 1. LINQ Execution Pipeline: Server-Side vs Client-Side

Khi viết truy vấn trong C#, luồng thực thi phụ thuộc hoàn toàn vào kiểu trả về của Repository:

```
[ Code C# LINQ Query ]
         │
         ├── Với IQueryable<Product>:
         │   Dịch Expression Tree ──> [ SQL: SELECT TOP(4) ... WHERE Category = 'Soccer' ]
         │                            Chỉ chạy trên SQL Server Engine
         │                            SQL Server chỉ trả về ĐÚNG 4 DÒNG (~1 KB mạng)
         │
         └── Với IEnumerable<Product>:
             Ép thực thi sớm (Eager) ──> [ SQL: SELECT * FROM Products ] (Không có WHERE/TOP!)
                                         Kéo TOÀN BỘ 1.000.000 DÒNG về RAM Web Server (~500 MB mạng)
                                         Web Server dùng CPU duyệt từng dòng trên RAM để lọc
```

---

## 2. Thảm họa 1.000.000 Bản Ghi (Memory & Performance Disaster)

Giả sử bảng `Products` có 1.000.000 sản phẩm và bạn muốn lấy 4 sản phẩm thuộc danh mục "Bóng đá" ở trang 2:

### Trường hợp A: Sử dụng `IQueryable<Product>` (Chuẩn mực)

```csharp
var products = _context.Products
    .Where(p => p.Category == "Soccer")
    .OrderBy(p => p.ProductID)
    .Skip(4)
    .Take(4)
    .ToList();
```

- **Câu lệnh SQL sinh ra bởi EF Core:**
  ```sql
  SELECT [p].[ProductID], [p].[Category], [p].[Description], [p].[Name], [p].[Price]
  FROM [Products] AS [p]
  WHERE [p].[Category] = N'Soccer'
  ORDER BY [p].[ProductID]
  OFFSET 4 ROWS FETCH NEXT 4 ROWS ONLY;
  ```
- **Hiệu năng**: SQL Server sử dụng Index trên cột `Category` và `ProductID`, xử lý trong **1 - 2 mili-giây**, chỉ gửi 4 bản ghi qua mạng. RAM Web Server chỉ tốn vài KB.

### Trường hợp B: Vô tình ép kiểu sang `IEnumerable<Product>` (Thảm họa)

```csharp
IEnumerable<Product> allProducts = _context.Products.AsEnumerable(); // HOẶC .ToList()

var products = allProducts
    .Where(p => p.Category == "Soccer") // Lọc TRÊN RAM SERVER!
    .OrderBy(p => p.ProductID)
    .Skip(4)
    .Take(4);
```

- **Câu lệnh SQL sinh ra:**
  ```sql
  SELECT [p].[ProductID], [p].[Category], [p].[Description], [p].[Name], [p].[Price]
  FROM [Products] AS [p];
  ```
- **Hậu quả nghiêm trọng**:
  1. **Nghẽn băng thông mạng (Network Saturation)**: 1 triệu dòng dữ liệu (hàng trăm Megabytes) bị kéo ồ ạt từ database server sang web server.
  2. **Tràn bộ nhớ RAM (Memory Spike / OOM)**: Web Server phải cấp phát hàng triệu đối tượng C# `Product` trên Heap RAM, kích hoạt Garbage Collector (GC) chạy toàn phần (Full GC Stop-the-world).
  3. **Tê liệt CPU**: Web Server phải dùng CPU để duyệt tuần tự (O(N)) qua 1 triệu phần tử chỉ để lấy ra 4 cái.

---

## 3. Code References in Repository

### A. Định nghĩa IQueryable tại tầng Domain

Tệp: `src/SportsStore.Domain/Interfaces/IProductRepository.cs`

```csharp
namespace SportsStore.Domain.Interfaces;

public interface IProductRepository
{
    // Bắt buộc dùng IQueryable để hoãn thực thi (Deferred Execution)
    // cho phép Controller ghép thêm các biểu thức Where, OrderBy, Skip, Take
    IQueryable<Product> Products { get; }
}
```

### B. Triển khai IQueryable trả về DbSet tại Infrastructure

Tệp: `src/SportsStore.Infrastructure/EFProductRepository.cs`

```csharp
public class EFProductRepository : IProductRepository
{
    private ApplicationDbContext _context;

    public EFProductRepository(ApplicationDbContext ctx)
    {
        _context = ctx;
    }

    // _context.Products có kiểu DbSet<Product>, kế thừa trực tiếp từ IQueryable
    public IQueryable<Product> Products => _context.Products;
}
```

### C. Ghép nối biểu thức LINQ tại Controller

Tệp: `src/SportsStore.WebUI/Controllers/HomeController.cs`

```csharp
public IActionResult Index(string? category, int productPage = 1)
{
    // Biểu thức lọc và phân trang được chuyển giao toàn bộ cho EF Core dịch sang SQL
    var products = _repository.Products
        .Where(p => category == null || p.Category == category)
        .OrderBy(p => p.ProductID)
        .Skip((productPage - 1) * PageSize)
        .Take(PageSize);

    return View(new ProductsListViewModel
    {
        Products = products,
        PagingInfo = new PagingInfo
        {
            CurrentPage = productPage,
            ItemsPerPage = PageSize,
            TotalItems = category == null
                ? _repository.Products.Count()
                : _repository.Products.Where(e => e.Category == category).Count()
        },
        CurrentCategory = category
    });
}
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[EF_Core_Code_First_Migrations_and_Snapshot_Mechanics]]
- [[Memory_Leaks_Core_Mechanics]]
- [[N_Plus_1_Query_Problem]]
