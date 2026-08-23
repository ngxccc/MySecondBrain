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
    Custom Tag Helpers in ASP.NET Core,
    PageLinkTagHelper and TagBuilder,
    Pagination Math and Ceiling,
  ]
description: Phân tích cơ chế xây dựng Custom Tag Helper với TagBuilder, so sánh Tag Helper với HTML tĩnh và giải thuật phân trang trong SportsStore.
status: permanent
---

# Custom Tag Helpers and Pagination Mechanics

## TL;DR

- **Bản chất**: **Custom Tag Helper** là một class C# kế thừa từ `TagHelper`, cho phép lập trình viên can thiệp vào quá trình Razor Engine phân tích cú pháp để tự động sinh ra cấu trúc HTML phức tạp thông qua API `TagBuilder`.
- **Mục đích**: Thay thế việc viết mã HTML phân trang lặp lại bằng một thẻ ngắn gọn `<div page-model="@Model.PagingInfo" ...></div>`, giữ cho Razor View sạch sẽ và có tính tái sử dụng cao.
- **Điểm mấu chốt**: Công thức tính tổng số trang trong `PagingInfo` bắt buộc phải ép kiểu sang `decimal` trước khi chia: `(int)Math.Ceiling((decimal)TotalItems / ItemsPerPage)` để tránh lỗi làm tròn số nguyên (Integer Division Truncation) làm mất sản phẩm ở trang cuối cùng.

---

## 1. Tag Helpers vs Hardcoded HTML: Tại sao không viết thẻ `<a>` tĩnh?

So sánh giữa hai cách viết liên kết trong ASP.NET Core:

```razor
@* Cách 1: HTML tĩnh (Nguy hiểm) *@
<a href="/Home/Index?category=Soccer&productPage=2">Trang 2</a>

@* Cách 2: Tag Helper (Type-Safe & Khuyến nghị) *@
<a asp-controller="Home" asp-action="Index" asp-route-category="Soccer" asp-route-productPage="2">Trang 2</a>
```

### Lợi ích cốt lõi của Tag Helper:

1. **An toàn khi Refactor (Type-Safety & Route Decoupling)**:
   - Nếu trong `Program.cs` bạn đổi cấu trúc URL từ `/Home/Index?category=Soccer` sang URL đẹp dạng `/Products/Soccer/Page2`, toàn bộ Tag Helper sẽ tự động sinh lại link mới đúng chuẩn.
   - Nếu dùng HTML tĩnh, tất cả các thẻ `<a>` cũ sẽ biến thành link chết (**404 Not Found**) mà trình biên dịch không hề cảnh báo.
2. **Tự động mã hóa URL (URL Encoding)**: Tránh lỗi khi tên danh mục chứa dấu cách hoặc ký tự đặc biệt (ví dụ: `Thể thao dưới nước`).

---

## 2. Giải thuật phân trang & Lỗi chia số nguyên (Integer Division Bug)

Trong class `PagingInfo.cs`, thuộc tính `TotalPages` tính toán số trang:

```csharp
public class PagingInfo
{
    public int TotalItems { get; set; }     // Ví dụ: 11 sản phẩm
    public int ItemsPerPage { get; set; }   // 4 sản phẩm / trang

    // CÔNG THỨC CHUẨN:
    public int TotalPages => (int)Math.Ceiling((decimal)TotalItems / ItemsPerPage);
}
```

### Tại sao bắt buộc phải có `(decimal)`?

- **Nếu viết `TotalItems / ItemsPerPage` (Chia 2 số nguyên `int / int`)**:
  - C# sẽ thực hiện phép chia lấy phần nguyên: `11 / 4 = 2` (phần dư `0.75` bị vứt bỏ hoàn toàn trước khi hàm `Math.Ceiling` được gọi).
  - Kết quả: Hệ thống chỉ tạo **2 trang** $\rightarrow$ **3 sản phẩm cuối cùng bị biến mất**, người dùng không bao giờ xem được.
- **Khi ép kiểu `(decimal)TotalItems / ItemsPerPage`**:
  - Phép tính trở thành: `11m / 4 = 2.75m`.
  - Hàm `Math.Ceiling(2.75)` làm tròn lên thành `3` $\rightarrow$ Đảm bảo trang 3 chứa đủ 3 sản phẩm còn lại.

---

## 3. Cơ chế hoạt động của `PageLinkTagHelper`

Khi Razor Engine gặp thẻ HTML:

```html
<div page-model="@Model.PagingInfo" page-action="Index" class="btn-group"></div>
```

1. **Nhận diện Target**: Thuộc tính `[HtmlTargetElement("div", Attributes = "page-model")]` kích hoạt class `PageLinkTagHelper`.
2. **Nhận Dependency**: `IUrlHelperFactory` được inject để hỗ trợ sinh URL an toàn theo Routing của hệ thống.
3. **Sinh DOM bằng `TagBuilder`**:
   - Vòng lặp `for (int i = 1; i <= PageModel.TotalPages; i++)` chạy từ trang 1 đến trang cuối.
   - Tạo thẻ `<a>` bằng `new TagBuilder("a")`.
   - Gán thuộc tính `href` thông qua `urlHelper.Action(PageAction, new { productPage = i })`.
   - Gán CSS Bootstrap (nếu `i == CurrentPage` thì gán `btn-primary`, ngược lại `btn-outline-secondary`).
   - Nhét toàn bộ các thẻ con vào bên trong thẻ `<div>` cha thông qua `output.Content.AppendHtml(result.InnerHtml)`.

---

## 4. Code References in Repository

### A. ViewModel Phân trang

Tệp: `src/SportsStore.WebUI/Models/PagingInfo.cs`

```csharp
namespace SportsStore.WebUI.Models;

public class PagingInfo
{
    public int TotalItems { get; set; }
    public int ItemsPerPage { get; set; }
    public int CurrentPage { get; set; }

    public int TotalPages =>
        (int)Math.Ceiling((decimal)TotalItems / ItemsPerPage);
}
```

### B. Lớp Custom Tag Helper

Tệp: `src/SportsStore.WebUI/Infrastructure/PageLinkTagHelper.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using SportsStore.WebUI.Models;

namespace SportsStore.WebUI.Infrastructure;

[HtmlTargetElement("div", Attributes = "page-model")]
public class PageLinkTagHelper : TagHelper
{
    private readonly IUrlHelperFactory _urlHelperFactory;

    public PageLinkTagHelper(IUrlHelperFactory helperFactory)
    {
        _urlHelperFactory = helperFactory;
    }

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    public PagingInfo? PageModel { get; set; }
    public string? PageAction { get; set; }
    public bool PageClassesEnabled { get; set; } = false;
    public string PageClass { get; set; } = string.Empty;
    public string PageClassNormal { get; set; } = string.Empty;
    public string PageClassSelected { get; set; } = string.Empty;

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        if (ViewContext != null && PageModel != null)
        {
            IUrlHelper urlHelper = _urlHelperFactory.GetUrlHelper(ViewContext);
            TagBuilder result = new("div");

            for (int i = 1; i <= PageModel.TotalPages; i++)
            {
                TagBuilder tag = new("a");
                tag.Attributes["href"] = urlHelper.Action(PageAction, new { productPage = i });

                if (PageClassesEnabled)
                {
                    tag.AddCssClass(PageClass);
                    tag.AddCssClass(i == PageModel.CurrentPage ? PageClassSelected : PageClassNormal);
                }

                tag.InnerHtml.Append(i.ToString());
                result.InnerHtml.AppendHtml(tag);
            }

            output.Content.AppendHtml(result.InnerHtml);
        }
    }
}
```

### C. Kích hoạt trong _ViewImports và sử dụng trên View

Tệp: `src/SportsStore.WebUI/Views/_ViewImports.cshtml`

```razor
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, SportsStore.WebUI
```

Tệp: `src/SportsStore.WebUI/Views/Home/Index.cshtml`

```razor
<div page-model="@Model.PagingInfo"
     page-action="Index"
     page-classes-enabled="true"
     page-class="btn"
     page-class-normal="btn-outline-secondary"
     page-class-selected="btn-primary"
     class="btn-group m-1">
</div>
```

---

## Related Notes

- [[View_Components_vs_Partial_Views]]
- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[EF_Core_Query_Pipeline_IQueryable_vs_IEnumerable]]
