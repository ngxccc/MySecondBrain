---
tags: [type/concept, topic/tech, topic/architecture, layer/architecture]
date: 2026-06-07
aliases:
  [
    Dependency Injection WinForms,
    C# DI UI Components,
    ActivatorUtilities WinForms,
  ]
description: "Kỹ thuật Dependency Injection cho Dumb, Root và Smart Child Components trong C# WinForms."
---

# WinForms Component Design with Dependency Injection

## TL;DR

Quy tắc áp dụng Dependency Injection (DI) vào thiết kế các UI component trong C# Windows Forms. Phân loại cấu trúc component thành 3 nhóm: **Dumb Component** (dùng `new`), **Root Component** (khởi tạo qua Service Provider) và **Smart Child Component** (dùng `ActivatorUtilities.CreateInstance` kết hợp cả Service và State).

## Component Classifications

### 1. Dumb Component

- **Bản chất**: Chỉ nhận dữ liệu từ Control cha truyền xuống và hiển thị lên giao diện, không tự thực hiện logic kết nối Database/API.
- **Cách tạo**: Dùng từ khóa `new` thuần túy.
- **Ví dụ**:

  ```csharp
  // Khởi tạo trực tiếp bằng tham số truyền vào
  var editor = new UC_ProductSizeEditor(sizeName, price);
  pnl.Controls.Add(editor);
  ```

### 2. Root Component

- **Bản chất**: Các component lớn (như các Panel màn hình quản trị được gắn cố định trên Sidebar). Khi mở lên nó tự lấy Service từ DI container để fetch dữ liệu mà không cần dữ liệu truyền vào từ trước.
- **Cách tạo**: Khởi tạo thông qua DI Container.
- **Ví dụ**:

  ```csharp
  // Lấy trực tiếp từ ServiceProvider
  var manageProductsPanel = _serviceProvider.GetRequiredService<UC_ManageProducts>();
  ```

### 3. Smart Child Component

- **Bản chất**: Component vừa cần dữ liệu động (State như `productId` khi người dùng click vào một hàng cụ thể), vừa cần các Service chọc DB để lấy thông tin chi tiết.
- **Cách tạo**: Sử dụng `ActivatorUtilities.CreateInstance` làm cỗ máy lai tạo để tự động inject các Service từ container đồng thời nạp vào các tham số tùy biến thủ công.
- **Ví dụ**:

  ```csharp
  // Cung cấp thêm tham số productId, các Service khác tự động được inject
  var sizePanel = ActivatorUtilities.CreateInstance<UC_ManageProductSizes>(_serviceProvider, productId);
  ```

---

## Related Notes

- Đa luồng an toàn trong WinForms: [[CSharp_WinForms_Thread_Invoke]]
- Tối ưu hóa Layout WinForms: [[WinForms_Layout_Optimization]]
- Tổng quan kiến trúc & mẫu thiết kế: [[000_Tech_MOC]]
