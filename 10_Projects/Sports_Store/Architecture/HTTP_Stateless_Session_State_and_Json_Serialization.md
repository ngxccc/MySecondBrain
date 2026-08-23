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
    HTTP Stateless and Server Session Mechanics,
    JSON Serialization in SessionCart,
    JsonIgnore Circular Reference,
  ]
description: Phân tích bản chất HTTP Stateless, cơ chế lưu trữ Session trên RAM Server và kỹ thuật JSON Serialization tránh Circular Reference trong SportsStore.
status: permanent
---

# HTTP Stateless, Session State, and JSON Serialization

## TL;DR

- **Bản chất**: Giao thức HTTP vốn là **Stateless** (vô trạng thái); Server duy trì phiên làm việc bằng cách cấp phát một vùng nhớ trên RAM Server và gửi về trình duyệt một Cookie chứa `Session ID` duy nhất đóng vai trò "thẻ nhận diện".
- **Mục đích**: Lưu trữ trạng thái giỏ hàng (`Cart`) giữa các HTTP Request độc lập mà không lưu dữ liệu kinh doanh xuống máy Client.
- **Điểm mấu chốt**: `ISession` chỉ hỗ trợ lưu chuỗi ký tự (`string`/`byte[]`), do đó bắt buộc phải dùng `System.Text.Json` để ép phẳng (Serialize) cấu trúc đối tượng `Cart` trên Heap RAM thành JSON; đồng thời phải gắn `[JsonIgnore]` lên thuộc tính `Session` để triệt tiêu lỗi tham chiếu vòng (Circular Reference Crash).

---

## 1. HTTP Stateless & The Session Token Mechanics

Mỗi HTTP Request gửi từ trình duyệt lên Web Server là một sự kiện hoàn toàn cô lập:

```
[ BROWSER (Client) ]                                [ KESTREL SERVER (Backend) ]
       │                                                         │
       │─── 1. HTTP GET /Home/Index ────────────────────────────>│ Cấp phát Session ID: "xyz-789"
       │<── 2. Response + Set-Cookie: .AspNetCore.Session=xyz───│ Cấp phát vùng nhớ RAM cho "xyz-789"
       │                                                         │
       │─── 3. HTTP POST /Cart/AddToCart (Cookie: xyz-789) ─────>│ Đọc Cookie "xyz-789"
       │                                                         │ Tìm đúng vùng nhớ RAM -> Nạp CartLine
```

### Bản chất vị trí lưu trữ:

- **Dữ liệu thực sự**: Nằm tại **RAM của Web Server** (thông qua `AddDistributedMemoryCache()` trong `Program.cs`).
- **Client (Trình duyệt)**: **Không** lưu trữ bất kỳ dữ liệu giỏ hàng nào; Client chỉ giữ duy nhất một Cookie chứa `Session ID` đóng vai trò "chiếc thẻ gửi xe".
- **Hệ quả**: Nếu server khởi động lại (Restart) hoặc crash, toàn bộ RAM bị giải phóng dẫn đến giỏ hàng bị mất. Trong môi trường phân tán (Distributed System), `AddDistributedMemoryCache` sẽ được thay thế bằng **Redis Server** (`AddStackExchangeRedisCache`).

---

## 2. Serialization & The Circular Reference Trap

### Tại sao bắt buộc phải dùng `System.Text.Json`?

Interface `ISession` trong ASP.NET Core được thiết kế tối giản:

- Chỉ cung cấp: `SetString(key, string)`, `SetInt32(key, int)`, `Set(key, byte[])`.
- **Không có hàm `SetObject(key, object)`**.
- Do đó, đối tượng C# `Cart` (chứa `List<CartLine>`, `Product`, các hàm tính toán) trên Heap RAM bắt buộc phải được tuần tự hóa (Serialize) thành chuỗi văn bản JSON UTF-8 trước khi gọi `SetString()`.

### Hiểm họa khi thiếu `[JsonIgnore]` trong `SessionCart`

`SessionCart` kế thừa từ `Cart` và chứa thuộc tính `public ISession? Session { get; set; }`.

```
SessionCart (Object cần serialize)
   ├── Lines (Dữ liệu giỏ hàng) ──────────────> [Serialize thành công]
   └── Session (Hạ tầng Server)
          └── HttpContext
                 └── Features
                        └── Session (Trỏ ngược lại) ──> [CIRCULAR REFERENCE CRASH!]
```

- **Nguyên nhân**: `ISession` là một dịch vụ hạ tầng runtime, bên trong chứa tham chiếu lồng nhau tới `HttpContext`. Nếu không có `[JsonIgnore]`, `JsonSerializer` sẽ duyệt đệ quy vô tận và ném ngoại lệ:
  `System.Text.Json.JsonException: A possible object cycle was detected.`
- **Giải pháp**: Gắn `[JsonIgnore]` để chỉ thị cho Serializer chỉ lưu thuộc tính nghiệp vụ (`Lines`), bỏ qua hạ tầng (`Session`).

---

## 3. Code References in Repository

### A. Extension Methods cho ISession

Tệp: `src/SportsStore.WebUI/Infrastructure/SessionExtensions.cs`

```csharp
using System.Text.Json;

namespace SportsStore.WebUI.Infrastructure;

public static class SessionExtensions
{
    public static void SetJson(this ISession session, string key, object value)
    {
        session.SetString(key, JsonSerializer.Serialize(value));
    }

    public static T? GetJson<T>(this ISession session, string key)
    {
        var sessionData = session.GetString(key);
        return sessionData == null
            ? default
            : JsonSerializer.Deserialize<T>(sessionData);
    }
}
```

### B. SessionCart với thuộc tính JsonIgnore

Tệp: `src/SportsStore.WebUI/Models/SessionCart.cs`

```csharp
using System.Text.Json.Serialization;
using SportsStore.Domain;
using SportsStore.WebUI.Infrastructure;

namespace SportsStore.WebUI.Models;

public class SessionCart : Cart
{
    public static Cart GetCart(IServiceProvider services)
    {
        ISession? session = services.GetRequiredService<IHttpContextAccessor>()
            .HttpContext?.Session;
        SessionCart cart = session?.GetJson<SessionCart>("Cart") ?? new SessionCart();
        cart.Session = session;
        return cart;
    }

    [JsonIgnore] // Triệt tiêu lỗi Circular Reference khi Serialize
    public ISession? Session { get; set; }

    public override void AddItem(Product product, int quantity)
    {
        base.AddItem(product, quantity);
        Session?.SetJson("Cart", this);
    }

    public override void RemoveLine(Product product)
    {
        base.RemoveLine(product);
        Session?.SetJson("Cart", this);
    }

    public override void Clear()
    {
        base.Clear();
        Session?.SetJson("Cart", this);
    }
}
```

### C. Kích hoạt Session Middleware trong Pipeline

Tệp: `src/SportsStore.WebUI/Program.cs`

```csharp
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddScoped<Cart>(sp => SessionCart.GetCart(sp));

var app = builder.Build();

app.UseSession(); // Middleware quản lý Cookie Session cho mỗi Request
app.UseRouting();
```

---

## Related Notes

- [[Three_Tier_Architecture_and_Dependency_Inversion]]
- [[Dependency_Injection_Lifecycles_and_DbContext_Concurrency]]
- [[Memory_Leaks_Core_Mechanics]]
