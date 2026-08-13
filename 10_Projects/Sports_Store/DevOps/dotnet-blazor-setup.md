# Hướng dẫn Thiết lập Blazor Web App (.NET 9) qua CLI và Khắc phục Tương thích

Tài liệu này hướng dẫn cách khởi tạo, cấu hình tham chiếu, hạ cấp phiên bản từ .NET 10 xuống .NET 9, và chạy ứng dụng dưới dạng Self-Contained khi môi trường thiếu Runtime ASP.NET Core tương ứng.

---

## 1. Khởi tạo Dự án Blazor Web App mới

Sử dụng lệnh `dotnet new blazor` để tạo dự án Blazor Web App sử dụng Server-Side Rendering (Static SSR) làm mặc định:

```bash
# Backup thư mục WebUI cũ nếu có
mv src/SportsStore.WebUI src/SportsStore.WebUI.old

# Tạo mới dự án Blazor Web App trong thư mục src/SportsStore.WebUI
dotnet new blazor -o src/SportsStore.WebUI
```

---

## 2. Liên kết tham chiếu (Project References)

Liên kết dự án WebUI mới với các dự án Class Library khác trong giải pháp (Solution):

```bash
dotnet add src/SportsStore.WebUI/SportsStore.WebUI.csproj reference \
  src/SportsStore.Application/SportsStore.Application.csproj \
  src/SportsStore.Infrastructure/SportsStore.Infrastructure.csproj
```

---

## 3. Hạ cấp từ .NET 10 xuống .NET 9 (Downgrade Target Framework)

Khi máy của bạn cài đặt SDK .NET 10 nhưng môi trường khác (ví dụ: máy trường học) chỉ có .NET 9, bạn cần cấu hình và điều chỉnh mã nguồn để đảm bảo tính tương thích ngược.

### Bước 3.1: Cấu hình Target Framework trong `.csproj`

Mở file `src/SportsStore.WebUI/SportsStore.WebUI.csproj` và sửa giá trị `TargetFramework`:

```xml
<PropertyGroup>
  <TargetFramework>net9.0</TargetFramework>
  <!-- Thêm RollForward để cho phép chạy trên runtime mới hơn (ví dụ .NET 10) nếu máy thiếu .NET 9 -->
  <RollForward>Major</RollForward>
</PropertyGroup>
```

### Bước 3.2: Loại bỏ tính năng .NET 10 trong `App.razor`

Mở `src/SportsStore.WebUI/Components/App.razor` và loại bỏ component `<ResourcePreloader />` (chỉ hỗ trợ từ .NET 10):

```razor
<!-- Xóa dòng này -->
<ResourcePreloader />
```

### Bước 3.3: Sửa lỗi biên dịch `Routes.razor`

Trong .NET 10, component `Router` hỗ trợ thuộc tính `NotFoundPage`. Đối với .NET 9, bạn cần chuyển về cách sử dụng thẻ con `<NotFound>` truyền thống.

Mở `src/SportsStore.WebUI/Components/Routes.razor` và sửa đổi như sau:

**Trước (phong cách .NET 10):**

```razor
<Router AppAssembly="typeof(Program).Assembly" NotFoundPage="typeof(Pages.NotFound)">
    <Found Context="routeData">
        <RouteView RouteData="routeData" DefaultLayout="typeof(Layout.MainLayout)" />
        <FocusOnNavigate RouteData="routeData" Selector="h1" />
    </Found>
</Router>
```

**Sau (tương thích .NET 9):**

```razor
<Router AppAssembly="typeof(Program).Assembly">
    <Found Context="routeData">
        <RouteView RouteData="routeData" DefaultLayout="typeof(Layout.MainLayout)" />
        <FocusOnNavigate RouteData="routeData" Selector="h1" />
    </Found>
    <NotFound>
        <LayoutView Layout="typeof(Layout.MainLayout)">
            <p role="alert">Sorry, there's nothing at this address.</p>
        </LayoutView>
    </NotFound>
</Router>
```

### Bước 3.4: Sửa middleware trong `Program.cs`

Trong .NET 9, phương thức `UseStatusCodePagesWithReExecute` không hỗ trợ tham số đặt tên `createScopeForStatusCodePages`.

Mở `src/SportsStore.WebUI/Program.cs` và sửa:

**Trước:**

```csharp
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
```

**Sau:**

```csharp
app.UseStatusCodePagesWithReExecute("/not-found");
```

---

## 4. Cách build và chạy ứng dụng khi thiếu Runtime ASP.NET Core

Nếu máy chạy chỉ cài đặt SDK .NET 10 (nhưng thiếu ASP.NET Core 9.0 Runtime) và báo lỗi:

> _Framework: 'Microsoft.AspNetCore.App', version '9.0.0' (x64) ... No frameworks were found._

Bạn có thể xuất bản ứng dụng dưới dạng **Self-Contained** (Độc lập). Giải pháp này sẽ đóng gói kèm toàn bộ Runtime ASP.NET Core vào bản build để chạy trực tiếp mà không phụ thuộc vào Runtime của máy chủ.

### Xuất bản ứng dụng

```bash
dotnet publish src/SportsStore.WebUI/SportsStore.WebUI.csproj -r linux-x64 --self-contained -c Debug
```

### Chạy trực tiếp file thực thi đã đóng gói

```bash
# Di chuyển vào thư mục publish
cd src/SportsStore.WebUI/bin/Debug/net9.0/linux-x64/publish/

# Thiết lập cổng lắng nghe và chạy ứng dụng
ASPNETCORE_URLS="http://localhost:5294" ./SportsStore.WebUI
```
