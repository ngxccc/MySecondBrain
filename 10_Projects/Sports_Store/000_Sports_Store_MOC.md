---
tags:
  [
    type/moc,
    topic/architecture,
    topic/dotnet,
    topic/csharp,
    project/sports-store,
  ]
date: 2026-08-23
aliases: [SportsStore MOC, SportsStore Project Map of Content]
description: Map of Content điều hướng toàn bộ kiến trúc, CSDL, DevOps và nghiệp vụ của dự án SportsStore.
status: permanent
---

# SportsStore Project MOC (Map of Content)

## TL;DR

- **Mục đích**: Trung tâm điều phối và chỉ mục tri thức kỹ thuật cho dự án thương mại điện tử SportsStore xây dựng trên nền tảng .NET 10 / ASP.NET Core MVC.
- **Kiến trúc**: 3-Tier Architecture kết hợp Dependency Inversion Principle, Repository Pattern, ViewComponent, Custom Tag Helpers, Session Stateful Cart, và Entity Framework Core Code-First Migrations.
- **Mã nguồn**: `https://github.com/shin-client/sports-store`

---

## 1. Domain & Core Architecture

- [[POCO_Entities_in_Domain_Layer]] - Bản chất POCO (Plain Old CLR Object) và lý do cô lập Domain khỏi mọi framework.
- [[Three_Tier_Architecture_and_Dependency_Inversion]] - Phân tách 3 tầng (`Domain`, `Infrastructure`, `WebUI`), áp dụng DIP và cơ chế Mock Data testing.
- [[Dependency_Injection_Lifecycles_and_DbContext_Concurrency]] - Bản chất Scoped, Singleton, Transient; cơ chế Thread-safety của DbContext và phòng chống Race Condition, Memory Leak.

---

## 2. Web UI, State & Components

- [[HTTP_Stateless_Session_State_and_Json_Serialization]] - Bản chất HTTP Stateless, cơ chế Session Cookie vs Server RAM, và kỹ thuật JSON Serialization tránh Circular Reference với `[JsonIgnore]`.
- [[View_Components_vs_Partial_Views]] - Sự khác biệt giữa Mini-Controller độc lập (ViewComponent) và template thụ động (Partial View).
- [[Custom_Tag_Helpers_and_Pagination_Mechanics]] - Kỹ thuật xây dựng Custom Tag Helper với `TagBuilder`, toán làm tròn phân trang `Math.Ceiling` và Type-safe routing.

---

## 3. Database & Entity Framework Core

- [[EF_Core_Query_Pipeline_IQueryable_vs_IEnumerable]] - Cơ chế dịch biểu thức LINQ sang SQL, phân biệt Server-side vs Client-side evaluation và thảm họa Memory Explosion khi query dữ liệu lớn.
- [[EF_Core_Code_First_Migrations_and_Snapshot_Mechanics]] - Quản lý phiên bản schema CSDL, cơ chế Offline Diffing qua Model Snapshot và quy trình `Migrate()` tự động.

---

## 4. Infrastructure & DevOps

- [[dotnet-blazor-setup]] - Hướng dẫn thiết lập môi trường và cấu hình ban đầu.

---

## Related Notes

- [[000_Tech_MOC]]
- [[Clean_Architecture]]
- [[Repository_Pattern_vs_Fat_Service]]
- [[Database_Indexing_Guidelines]]
