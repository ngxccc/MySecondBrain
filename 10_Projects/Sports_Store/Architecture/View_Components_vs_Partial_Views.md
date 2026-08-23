---
tags:
  [
    type/concept,
    topic/frontend,
    topic/web,
    topic/dotnet,
    topic/csharp,
    layer/architecture,
    project/sports-store,
  ]
date: 2026-08-23
aliases:
  [
    ViewComponent vs Partial View in ASP.NET Core,
    NavigationMenuViewComponent Mechanics,
    Mini-Controller Architecture,
  ]
description: Phân tích sự khác biệt bản chất giữa ViewComponent và Partial View, cùng cơ chế tự chủ dữ liệu của ViewComponent trong SportsStore.
status: permanent
---

# View Components vs Partial Views

## TL;DR

- **Bản chất**: **ViewComponent** là một **"Mini-Controller" độc lập**, bao gồm một lớp logic C# kế thừa `ViewComponent` có khả năng nhận tiêm phụ thuộc (Dependency Injection) và tự truy vấn dữ liệu, kết hợp với một View Razor (`Default.cshtml`). Ngược lại, **Partial View** (`_Partial.cshtml`) chỉ là một khối giao diện thụ động, hoàn toàn phụ thuộc vào Model do Controller cha truyền xuống.
- **Mục đích**: Tái sử dụng các thành phần giao diện phức tạp có logic riêng (như Sidebar danh mục `NavigationMenu`, widget giỏ hàng `CartSummary`) trên `_Layout.cshtml` mà không làm ô nhiễm hoặc trùng lặp mã nguồn ở các Controller chính (`HomeController`, `CartController`...).
- **Điểm mấu chốt**: ViewComponent không can thiệp vào Model Binding của Controller cha; nó được gọi trực tiếp trong Razor bằng `@await Component.InvokeAsync("Name")` và thực thi luồng lấy dữ liệu riêng biệt.

---

## 1. Deep Comparison: ViewComponent vs Partial View

```
[ Layout / View Cha ]
         │
         ├── Partial View (_Sidebar.cshtml):
         │   Thụ động ──> Bắt buộc HomeController phải query Category rồi truyền qua ViewData/Model.
         │                Nếu có thêm OrderController, nó cũng phải copy-paste code query Category!
         │
         └── ViewComponent (NavigationMenu):
             Độc lập ───> Tự inject IProductRepository -> Tự chạy LINQ Distinct Categories -> Tự render.
                          Bất kỳ View/Layout nào gọi cũng tự động có dữ liệu mà không cần Controller cha can thiệp.
```

### Bảng so sánh chi tiết

| Tiêu chí           | Partial View (`_Partial.cshtml`)                                          | View Component (`NavigationMenuViewComponent`)                          |
| :----------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| **Bản chất**       | Mảnh HTML/Razor thuần túy (Dumb UI template).                             | Mini-Controller có logic C# riêng (Smart UI component).                 |
| **Nguồn dữ liệu**  | Nhận dữ liệu từ Controller cha (Parent Controller).                       | **Tự lấy dữ liệu** thông qua Dependency Injection.                      |
| **Tính độc lập**   | Phụ thuộc chặt chẽ vào Model của View cha.                                | **Độc lập 100%**, có thể nhúng vào bất kỳ View/Layout nào.              |
| **Trùng lặp code** | Rất cao (Mọi Controller đều phải viết code lấy dữ liệu cho Partial View). | **Bằng 0** (Logic lấy dữ liệu được đóng gói gọn trong class Component). |
| **Cú pháp gọi**    | `<partial name="_Partial" />`                                             | `@await Component.InvokeAsync("ComponentName")`                         |

---

## 2. Thư mục & Quy ước đặt tên (Naming Conventions)

ASP.NET Core quy định cấu trúc nghiêm ngặt để Razor Engine tự động tìm thấy View của Component:

1. **Lớp Logic**: Đặt trong thư mục `Components/`, tên class kết thúc bằng hậu tố `ViewComponent` (ví dụ: `NavigationMenuViewComponent.cs`).
2. **View Giao diện**: Phải nằm chính xác tại đường dẫn:
   `Views/Shared/Components/<TênComponentBỏHậuTố>/Default.cshtml`
   (Ví dụ: `Views/Shared/Components/NavigationMenu/Default.cshtml`).

---

## 3. Code References in Repository

### A. Lớp Logic với Dependency Injection và LINQ

Tệp: `src/SportsStore.WebUI/Components/NavigationMenuViewComponent.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using SportsStore.Domain.Interfaces;

namespace SportsStore.WebUI.Components;

public class NavigationMenuViewComponent : ViewComponent
{
    private readonly IProductRepository _repository;

    // Tự động nhận IProductRepository qua DI Container
    public NavigationMenuViewComponent(IProductRepository repository)
    {
        _repository = repository;
    }

    public IViewComponentResult Invoke()
    {
        // Nhận category hiện tại từ URL Route để highlight trên UI
        ViewBag.SelectedCategory = RouteData?.Values["category"];

        // Tự chạy LINQ lấy danh sách danh mục duy nhất và sắp xếp
        var categories = _repository.Products
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(x => x);

        return View(categories);
    }
}
```

### B. View Giao diện của Component

Tệp: `src/SportsStore.WebUI/Views/Shared/Components/NavigationMenu/Default.cshtml`

```razor
@model IEnumerable<string>

<div class="d-grid gap-2">
    <a class="btn btn-outline-secondary @(ViewBag.SelectedCategory == null ? "btn-primary text-white" : "")"
       asp-action="Index"
       asp-controller="Home"
       asp-route-category="">
        Trang chủ
    </a>

    @foreach (string category in Model)
    {
        <a class="btn @(category == ViewBag.SelectedCategory as string ? "btn-primary" : "btn-outline-secondary")"
           asp-action="Index"
           asp-controller="Home"
           asp-route-category="@category"
           asp-route-productPage="1">
            @category
        </a>
    }
</div>
```

### C. Nhúng Component vào Layout chung

Tệp: `src/SportsStore.WebUI/Views/Shared/_Layout.cshtml`

```razor
<aside id="categories" class="col-3">
    @* Kích hoạt ViewComponent tự động chạy logic và render sidebar *@
    @await Component.InvokeAsync("NavigationMenu")
</aside>
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[Custom_Tag_Helpers_and_Pagination_Mechanics]]
- [[MVC_Pattern]]
