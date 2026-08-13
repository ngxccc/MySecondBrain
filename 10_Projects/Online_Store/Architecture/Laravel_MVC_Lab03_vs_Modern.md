---
title: Laravel MVC Architecture - Lab 03 vs Modern Laravel Standards
tags: [laravel, mvc, controller, routing, blade, architecture, best-practices]
created: 2026-07-17
---

# Laravel MVC Architecture: So sánh Lab 03 với Chuẩn Modern Laravel (Laravel 8 -> 13)

## 1. Tóm tắt So sánh (Comparison Summary)

| Hạng mục                           | Lab 03 (Cách cũ trong bài thực hành)                                                | Modern Laravel (Chuẩn hiện tại trong dự án)                                                                                | Đánh giá & Khuyên dùng                                                                                        |
| :--------------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Layout System**                  | `@extends('layouts.app')` + `@yield('content')` + `@section(...)`                   | Blade Component Layout **`<x-layout>`** + `{{ $slot }}`                                                                    | **`<x-layout>` là chuẩn hiện đại**. Giúp code sạch, đóng gói tốt, dễ dùng Props & Attributes.                 |
| **Cú pháp Controller trong Route** | Cú pháp chuỗi cũ:<br>`Route::get('/', 'App\Http\Controllers\HomeController@index')` | Cú pháp Mảng (Tuple):<br>`Route::get('/', [HomeController::class, 'index'])`                                               | **Cú pháp Mảng `[Controller::class, 'method']` là BẮT BUỘC**. Cú pháp chuỗi cũ đã bị deprecated từ Laravel 8. |
| **Truyền dữ liệu sang View**       | Gom vào mảng `$viewData` và gửi qua `->with('viewData', $viewData)`                 | Truyền mảng thuộc tính `view('view', ['key' => 'val'])` hoặc truyền trực tiếp vào Component Props `<x-layout title="...">` | **Truyền Props/Array trực tiếp sạch hơn**, không cần bọc qua biến trung gian `$viewData`.                     |
| **Khai báo Route Names**           | `->name('home.index')` / `->name('home.about')`                                     | `->name('home')`, `->name('about')` hoặc `->name('home.index')`                                                            | **Đều chuẩn.** Tên dạng dot-notation hay dạng tên đơn đều tốt. Dự án hiện dùng `->name('home')`.              |

---

## 2. Phân tích chi tiết các điểm kỹ thuật

### 2.1. Cú pháp khai báo Route Controller

- **Lab 03**: `Route::get('/', 'App\Http\Controllers\HomeController@index')`
  - _Nhược điểm_: Phụ thuộc vào chuỗi String. Nếu gõ sai tên class hay namespace thì IDE không tự động phát hiện được, không refactor tự động được.
- **Modern Laravel**:

  ```php
  use App\Http\Controllers\HomeController;

  Route::get('/', [HomeController::class, 'index'])->name('home');
  ```

  - _Ưu điểm_: Sử dụng FQCN (Fully Qualified Class Name) qua `::class`. IDE hỗ trợ Autocomplete, Type Checking và Refactor an toàn.

### 2.2. Phương thức truyền dữ liệu từ Controller sang View

- **Lab 03**:

  ```php
  $viewData = [];
  $viewData["title"] = "Trang chủ - Online Store";
  return view('home.index')->with("viewData", $viewData);
  ```

  Trong View Blade phải gọi qua `$viewData["title"]`.

- **Modern Laravel**:

  ```php
  return view('welcome', [
      'title' => 'Trang chủ - Online Store'
  ]);
  ```

  Trong Blade Component Layout:

  ```blade
  <x-layout :title="$title">
      <!-- Content -->
  </x-layout>
  ```

  Hoặc gọi trực tiếp `<x-layout title="Trang chủ - Online Store">`.

---

## 3. Lộ trình Áp dụng (Implementation Roadmap) cho Dự án Online Store

### Bước 1: Sửa lỗi cú pháp trong `routes/web.php`

Hiện tại `routes/web.php` bị thiếu tên hàm `name` ở dòng route trang chủ: `->('home')`.

### Bước 2: Tạo Controller `HomeController`

Tạo `app/Http/Controllers/HomeController.php` để quản lý các trang thông tin chung (`index`, `about`):

```php
namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(): View
    {
        return view('welcome', [
            'title' => 'Online Store - Trang chủ'
        ]);
    }

    public function about(): View
    {
        return view('about', [
            'title' => 'Giới thiệu - Online Store'
        ]);
    }
}
```

### Bước 3: Cập nhật `routes/web.php` chuẩn Modern

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/products', fn() => view('products'))->name('products');
```

### Bước 4: Cập nhật Links trong `<x-layout>`

Trong `resources/views/components/layout.blade.php`, cập nhật link trang chủ:

```blade
<a href="{{ route('home') }}" wire:navigate>Home</a>
```

---

## Related Notes

- [[000_Online_Store_MOC]]
- [[Laravel_Blade_Layouts]]
- [[Laravel_Routing_Best_Practices]]
