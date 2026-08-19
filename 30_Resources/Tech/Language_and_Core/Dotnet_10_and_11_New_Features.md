---
tags: [type/concept, topic/tech, status/permanent, layer/architecture]
date: 2026-07-16
aliases:
  [
    .NET 10 & 11 New Features,
    Tính năng mới .NET 10 và .NET 11,
    Dotnet 10 vs 9,
    C# 14 and C# 15 Features,
  ]
description: "So sánh các tính năng mới cốt lõi của .NET 10 (LTS) & .NET 11 (Preview) so với .NET 9."
---

# .NET 10 & .NET 11: So Sánh Tính Năng Cốt Lõi So Với .NET 9

## TL;DR

Tài liệu so sánh các điểm cải tiến lớn của **.NET 10** (LTS, phát hành 11/2025) và bản xem trước **.NET 11** (phát hành 11/2026) so với **.NET 9** (STS, phát hành 11/2024). Trọng tâm cải tiến bao gồm **C# 14 (Field-backed properties, Extension blocks)**, **C# 15 (Union types, Closed hierarchies, Collection expression arguments)**, cùng các cải tiến lớn về **Native AOT**, **EF Core 10/11**, và **ASP.NET Core 10/11**.

---

## Core Concept & Key Architectural Upgrades

### 1. Chu Kỳ Phát Hành & Lộ Trình Nâng Cấp

- **.NET 9 (STS - Short-Term Support)**: Phát hành 11/2024, thời gian hỗ trợ 18 tháng. Phiên bản này và phiên bản .NET 8 (LTS) sẽ chính thức **hết hạn hỗ trợ (End-of-Life - EOL) vào ngày 10/11/2026**.
- **.NET 10 (LTS - Long-Term Support)**: Phát hành 11/2025, được hỗ trợ 3 năm tới ngày **14/11/2028**. Đây là đích nâng cấp chính thức và khuyến nghị cho toàn bộ ứng dụng doanh nghiệp tải cao.
- **.NET 11 (STS - Short-Term Support)**: Dự kiến phát hành bản chính thức (GA) vào 11/2026. Hiện đang ở giai đoạn Preview (Preview 5 phát hành 06/2026).
- **Khuyến nghị thực tế:** Nhằm tránh rủi ro mất hỗ trợ bảo mật sau tháng 11/2026, các hệ thống chạy .NET 8 và .NET 9 cần lập kế hoạch di chuyển trực tiếp lên .NET 10 (LTS).

---

### 2. Sự Tiến Hóa của C# qua Các Phiên Bản

#### A. C# 14 vs C# 13 (.NET 9)

- **Field-backed properties (`field` keyword)**: Loại bỏ code boilerplate khi cần tùy biến thuộc tính tự sinh. C# 14 giới thiệu từ khóa ngữ cảnh `field` đại diện trực tiếp cho backing field tự sinh của compiler.
- **Extension Members (Extension Blocks)**: Mở rộng khả năng của "Extension Everything". Thay vì chỉ hỗ trợ extension method dạng tĩnh (static methods) truyền tham số `this`, C# 14 cho phép tạo các khối mở rộng (`extension`) hỗ trợ:
  - Extension properties (instance & static).
  - Extension indexers và operator overloading.
  - Định nghĩa nhiều thành phần mở rộng trong một khối tập trung.
- **Null-conditional assignment (`?.`)**: Hỗ trợ cú pháp gán giá trị có kiểm tra null ngầm định (ví dụ: `person?.Address = newAddress`).
- **Lambda Parameter Modifiers**: Cho phép thêm các modifier `ref`, `in`, `out` trực tiếp vào danh sách tham số của lambda expression mà không cần khai báo tường minh kiểu dữ liệu.

#### B. C# 15 vs C# 14 (.NET 10)

- **Union Types (`union`)**: Mô hình hóa kiểu dữ liệu có thể chứa một trong nhiều trường hợp cụ thể (case types). Rất hữu ích cho thiết kế domain (ví dụ: `union Result(Success, Error)`). Compiler hỗ trợ chuyển đổi ngầm định và kiểm tra tính đầy đủ (`exhaustive check`) khi sử dụng `switch`.
- **Closed Hierarchies (`closed` modifier)**: Khóa nhánh kế thừa trực hệ của một class/record trong phạm vi assembly hiện tại. Trình biên dịch hiểu rõ toàn bộ các lớp con và cho phép viết `switch` pattern matching toàn vẹn mà không cần nhánh mặc định (`default` arm).
- **Collection Expression Arguments (`with(...)`)**: Cho phép tùy biến khởi tạo collection trong cú pháp biểu thức collection `[...]` (như truyền dung lượng `capacity` hoặc bộ so sánh `comparer`).
- **Pointer/Memory Safety**: Giảm độ nghiêm ngặt của context `unsafe`. Các tác vụ khai báo con trỏ, lấy địa chỉ (`&`), hoặc `fixed`/`stackalloc` không còn yêu cầu bao bọc trong block `unsafe` nữa. Block `unsafe` chỉ bắt buộc khi thực hiện các phép toán dereference con trỏ (`*p`, `p->member`, `p[i]`).

---

### 3. Nền Tảng Runtime & Frameworks

- **File-based Applications**: Cho phép biên dịch và chạy file `.cs` đơn lẻ trực tiếp bằng CLI (`dotnet run file.cs`) mà không cần file dự án `.csproj` hoặc solution, biến C# thành một ngôn ngữ scripting mạnh mẽ cho DevOps / Tooling.
- **Native AOT & Compiler Improvements**:
  - Tối ưu hóa kích thước file binary AOT, thời gian compile nhanh hơn.
  - JIT Compiler thông minh hơn nhờ cải tiến inlining, devirtualization và tối ưu hóa tập lệnh AVX.
- **ASP.NET Core 10/11**:
  - Tích hợp chuẩn OpenAPI 3.1 mặc định cho tài liệu hóa API.
  - Hỗ trợ tốt hơn Server-Sent Events (SSE) để truyền dữ liệu thời gian thực.
  - Tích hợp bảo mật Passkey / WebAuthn out-of-the-box.
- **EF Core 10/11**:
  - Hỗ trợ cú pháp LINQ trực quan cho các phép nối `LeftJoin` và `RightJoin` mà không cần thông qua `GroupJoin`.
  - Tối ưu hóa đáng kể performance biên dịch LINQ sang SQL.
  - Cải tiến tính năng cập nhật/xóa hàng loạt không qua theo dõi trạng thái (`ExecuteUpdateAsync` / `ExecuteDeleteAsync`).

---

## Practical Implementation & Configuration

### 1. Sử dụng Backing Field với Từ Khóa `field`

```csharp
public class User
{
    // Auto-property kết hợp logic kiểm tra qua từ khóa field
    public string Name
    {
        get => field;
        set => field = string.IsNullOrWhiteSpace(value)
            ? throw new ArgumentException("Tên không được để trống")
            : value.Trim();
    }
}
```

### 2. Định Nghĩa Khối Mở Rộng Extension Members

```csharp
using System;
using System.Drawing;

public static class PointExtensions
{
    // 1. Khối mở rộng cho kiểu dữ liệu (Static Extension)
    extension (Point)
    {
        public static Point Center => new Point(50, 50);

        // Nạp chồng toán tử (Extension Operator)
        public static Point operator +(Point left, Point right) =>
            new Point(left.X + right.X, left.Y + right.Y);
    }

    // 2. Khối mở rộng cho thực thể (Instance Extension)
    extension (Point p)
    {
        // Extension Property
        public bool IsAtOrigin => p.X == 0 && p.Y == 0;

        // Extension Method
        public double DistanceTo(Point other) =>
            Math.Sqrt(Math.Pow(p.X - other.X, 2) + Math.Pow(p.Y - other.Y, 2));
    }
}
```

### 3. Union Types & Closed Hierarchies

```csharp
// --- Closed Hierarchies ---
public closed class PaymentMethod;
public class CreditCard(string Number) : PaymentMethod;
public class BankTransfer(string AccountNumber) : PaymentMethod;
public class Cash : PaymentMethod;

// --- Union Types ---
public record class Success(string Message);
public record class Failure(string ErrorCode);
public union OperationResult(Success, Failure);

public class PaymentService
{
    // Compiler kiểm tra tính đầy đủ của switch mà không cần default arm
    public string ProcessPayment(PaymentMethod method) => method switch
    {
        CreditCard cc => $"Thanh toán qua thẻ: {cc.Number}",
        BankTransfer bt => $"Chuyển khoản ngân hàng: {bt.AccountNumber}",
        Cash => "Thanh toán bằng tiền mặt"
    };

    public void HandleResult(OperationResult result)
    {
        // Ép kiểu tường minh nhờ Union Type
        var msg = result switch
        {
            Success s => $"Thành công: {s.Message}",
            Failure f => $"Thất bại mã lỗi: {f.ErrorCode}"
        };
        Console.WriteLine(msg);
    }
}
```

### 4. Collection Expression Arguments

```csharp
// Khởi tạo List<T> có thiết lập trước Capacity
List<int> numbers = [with(capacity: 100), 1, 2, 3];

// Khởi tạo HashSet<T> bỏ qua phân biệt hoa thường
HashSet<string> uniqueNames = [with(StringComparer.OrdinalIgnoreCase), "An", "AN", "an"];
// uniqueNames chỉ chứa 1 phần tử là "An"
```

### 5. Nối Trực Tiếp LeftJoin/RightJoin Trong EF Core 10

```csharp
// Thay vì GroupJoin phức tạp, EF Core 10 hỗ trợ LeftJoin trực tiếp trong LINQ
var query = from u in dbContext.Users
            join o in dbContext.Orders on u.Id equals o.UserId into orderGroup
            from subOrder in orderGroup.DefaultIfEmpty() // Tự động dịch thành LEFT JOIN
            select new { u.Username, OrderDate = (DateTime?)subOrder.CreatedDate };
```

---

## Related Notes

- Bản đồ công nghệ của dự án: [[000_Tech_MOC]]
- So sánh các backend framework: [[Backend_Frameworks_Comparison]]
