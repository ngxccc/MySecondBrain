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
    EF Core Code-First Migrations Mechanics,
    Model Snapshot Diffing in EF Core,
    EFMigrationsHistory and Migrate,
  ]
description: Phân tích cơ chế quản lý phiên bản CSDL bằng Code-First Migrations, vai trò của Model Snapshot và quy trình Migrate tự động.
status: permanent
---

# EF Core Code-First Migrations and Snapshot Mechanics

## TL;DR

- **Bản chất**: Code-First Migrations là hệ thống quản lý phiên bản (Version Control tương tự Git) dành cho CSDL quan hệ, sử dụng kỹ thuật Reflection để so sánh Model C# hiện tại với một bản chụp lược đồ ngoại tuyến (`ApplicationDbContextModelSnapshot.cs`).
- **Mục đích**: Tự động sinh mã C# định nghĩa các bước nâng cấp (`Up()`) và hạ cấp (`Down()`) cấu trúc CSDL mà không làm mất dữ liệu hiện có (thay thế hoàn toàn phương pháp hủy/tạo lại nguy hiểm của `EnsureCreated()`).
- **Điểm mấu chốt**: EF Core sử dụng bảng lịch sử `__EFMigrationsHistory` bên trong SQL Server để theo dõi những migration nào đã được thực thi, cho phép kích hoạt `context.Database.Migrate()` tự động đồng bộ schema khi khởi động ứng dụng.

---

## 1. Hạn chế của `Database.EnsureCreated()`

Trong giai đoạn đầu phát triển (Lab 06), lập trình viên thường dùng `context.Database.EnsureCreated()`:

- **Cơ chế**: Kiểm tra xem CSDL đã tồn tại chưa; nếu chưa thì tạo toàn bộ bảng từ Model hiện tại.
- **Hạn chế**: Nếu CSDL đã tồn tại, `EnsureCreated()` **hoàn toàn không làm gì cả**. Khi bạn thêm thuộc tính `public string? Color { get; set; }` vào entity `Product`, CSDL sẽ không có cột `Color`.
- **Hậu quả**: Để cập nhật schema, bạn buộc phải xóa (Drop) toàn bộ CSDL và tạo lại từ đầu $\rightarrow$ **Mất sạch dữ liệu thực tế**, hoàn toàn không thể triển khai trên môi trường Production.

---

## 2. Cơ chế Offline Diffing qua Model Snapshot

Khi chạy lệnh CLI:

```bash
dotnet ef migrations add AddProductColor --project src/SportsStore.Infrastructure
```

EF Core **hoàn toàn không cần kết nối tới SQL Server** để biết bạn vừa thay đổi gì:

```
[ Model C# Hiện Tại ] (Product.cs có thêm thuộc tính Color)
         │
         ▼ (So sánh đối chiếu bằng Reflection)
[ ApplicationDbContextModelSnapshot.cs ] (Bản chụp cấu trúc của lần migration trước)
         │
         ▼ (Phát hiện điểm khác biệt: Thêm cột Color vào bảng Products)
Sinh ra File Migration:
`20260823032234_AddProductColor.cs`
   ├── Up():   migrationBuilder.AddColumn<string>(name: "Color", table: "Products", ...)
   └── Down(): migrationBuilder.DropColumn(name: "Color", table: "Products")
```

- **Vai trò của Snapshot**: File `ApplicationDbContextModelSnapshot.cs` là nguồn chân lý (SSOT) đại diện cho trạng thái schema mới nhất trong mã nguồn. Mỗi khi tạo migration mới, file snapshot này sẽ được tự động cập nhật để làm mốc so sánh cho lần tiếp theo.

---

## 3. Bảng `__EFMigrationsHistory` & Quy Trình Áp Dụng

Khi thực thi lệnh `dotnet ef database update` hoặc chạy hàm `context.Database.Migrate()`:

1. EF Core kết nối vào SQL Server và truy vấn bảng nội bộ `__EFMigrationsHistory`.
2. Lấy danh sách các Migration ID đã chạy trong DB và so sánh với danh sách các class Migration có trong mã nguồn.
3. Chỉ thực thi phương thức `Up()` của các migration **chưa từng được chạy** (Pending Migrations).
4. Ghi một dòng mới vào `__EFMigrationsHistory` sau khi hoàn tất mỗi migration.

```sql
-- Dữ liệu trong bảng __EFMigrationsHistory
MigrationId                      ProductVersion
-------------------------------- ----------------
20260823030036_InitialCreate     10.0.0
20260823032234_AddProductColor   10.0.0
```

---

## 4. Code References in Repository

### A. File Migration sinh ra từ CLI

Tệp: `src/SportsStore.Infrastructure/Migrations/20260823032234_AddProductColor.cs`

```csharp
using Microsoft.EntityFrameworkCore.Migrations;

namespace SportsStore.Infrastructure.Migrations
{
    public partial class AddProductColor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Products");
        }
    }
}
```

### B. Tự động áp dụng Migration khi khởi chạy ứng dụng

Tệp: `src/SportsStore.Infrastructure/SeedData.cs`

```csharp
public static class SeedData
{
    public static void EnsurePopulated(IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        ApplicationDbContext context = scope.ServiceProvider
            .GetRequiredService<ApplicationDbContext>();

        // Tự động áp dụng tất cả migrations đang chờ mà không cần chạy CLI thủ công
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }

        if (!context.Products.Any())
        {
            // Seed dữ liệu ban đầu an toàn sau khi schema đã đồng bộ
            context.Products.AddRange(/* 12 sản phẩm mẫu */);
            context.SaveChanges();
        }
    }
}
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[EF_Core_Query_Pipeline_IQueryable_vs_IEnumerable]]
- [[Database_Indexing_Guidelines]]
