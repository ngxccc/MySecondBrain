---
title: Laravel Blade Layouts - Component Layouts (x-layout) vs Traditional Inheritance (@extends)
tags: [laravel, blade, frontend, architecture, layout, x-layout, components]
created: 2026-07-17
---

# Laravel Blade Layouts: Component-Based Layouts (`<x-layout>`) vs Traditional Inheritance (`@extends`)

## TL;DR

Từ Laravel 7 trở đi (và tiếp tục là chuẩn mực trong Laravel 10, 11, 12, 13), Laravel khuyến nghị sử dụng **Blade Component Layouts** (cú pháp thẻ HTML `<x-app-layout>` hoặc `<x-layout>`) thay thế cho cách tạo layout truyền thống **Template Inheritance** (`@extends`, `@yield`, `@section`).

- **Cũ (`@extends`)**: Dựa trên tư duy kế thừa template (Inheritance). View con khai báo nới rộng master layout và điền dữ liệu vào các vùng `@yield`.
- **Mới (`<x-layout>`)**: Dựa trên tư duy lắp ghép component (Composition). View con được bao bọc bởi thẻ Component Layout, nội dung chính tự động vào biến `$slot`, các vùng phụ dùng Named Slots (`<x-slot:header>`).

---

## 1. Tại sao cần chuyển đổi từ `@extends` sang `<x-layout>`?

Trước đây, Laravel Blade sử dụng tư duy kế thừa tương tự các template engine như Twig hay Smarty. Tuy nhiên, cùng với sự phát triển của các Frontend Component Frameworks (React, Vue, Svelte), tư duy **Component Composition** (Lắp ghép thành phần) tỏ ra vượt trội hơn hẳn.

### Tóm tắt lý do nâng cấp

1. **Phạm vi rõ ràng (Clear Scope)**: Component Layout có thẻ mở `<x-app-layout>` và thẻ đóng `</x-app-layout>`, giúp lập trình viên biết chính xác vùng nào nằm trong layout. Trong khi `@extends` nằm ở đầu file view con và các `@section` nằm phân tán không có thẻ bao bọc ngoài cùng.
2. **Truyền dữ liệu (Props & HTML Attributes) trực quan**: Có thể truyền Props trực tiếp như attribute HTML: `<x-app-layout title="Trang chủ" :user="$currentUser" class="bg-gray-50">`.
3. **Gắn liền với Component Class**: Layout Component có thể có 1 file Class PHP tương ứng (`App\View\Components\AppLayout`), giúp xử lý logic backend, load navigation menu, thông tin user hay giỏ hàng mà không cần cài đặt `View Composer` rườm rà.
4. **Cú pháp ngắn gọn & Hiện đại**: Hỗ trợ cú pháp `<x-slot:name>` sạch đẹp, dễ đọc.

---

## 2. So sánh Cú pháp & Mã nguồn (Side-by-Side Code Examples)

### 🔴 Cách Cũ: Template Inheritance (`@extends`, `@yield`, `@section`)

#### Layout Master (`resources/views/layouts/app.blade.php`)

```blade
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Online Store')</title>
    @yield('styles')
</head>
<body>
    <header>
        @include('partials.header')
    </header>

    <main class="container">
        @yield('content')
    </main>

    <footer>
        @include('partials.footer')
    </footer>

    @yield('scripts')
</body>
</html>
```

#### View Con (`resources/views/products/index.blade.php`)

```blade
@extends('layouts.app')

@section('title', 'Danh sách sản phẩm')

@section('styles')
    <link rel="stylesheet" href="/css/products.css">
@endsection

@section('content')
    <h1>Sản phẩm nổi bật</h1>
    <div class="product-grid">
        <!-- Danh sách sản phẩm -->
    </div>
@endsection

@section('scripts')
    <script src="/js/products.js"></script>
@endsection
```

---

### 🟢 Cách Mới: Component Layout (`<x-app-layout>` & Slots)

#### Layout Component (`resources/views/components/app-layout.blade.php`)

_(Hoặc nằm tại `resources/views/layouts/app.blade.php`, truy xuất qua `<x-layouts.app>`)_

```blade
@props([
    'title' => 'Online Store'
])

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    {{ $styles ?? '' }}
</head>
<body {{ $attributes->merge(['class' => 'font-sans antialiased']) }}>
    <x-header />

    <!-- Kiểm tra nếu có slot header riêng -->
    @if (isset($header))
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto py-6 px-4">
                {{ $header }}
            </div>
        </header>
    @endif

    <!-- $slot chứa toàn bộ nội dung chính của view con -->
    <main class="container mx-auto py-8">
        {{ $slot }}
    </main>

    <x-footer />

    {{ $scripts ?? '' }}
</body>
</html>
```

#### View Con (`resources/views/products/index.blade.php`)

```blade
<x-app-layout title="Danh sách sản phẩm" class="bg-gray-100">
    <x-slot:styles>
        <link rel="stylesheet" href="/css/products.css">
    </x-slot:styles>

    <x-slot:header>
        <h1 class="text-2xl font-bold">Sản phẩm nổi bật</h1>
    </x-slot:header>

    <!-- Tất cả phần này tự động vào biến $slot mặc định -->
    <div class="product-grid">
        @foreach($products as $product)
            <x-product-card :product="$product" />
        @endforeach
    </div>

    <x-slot:scripts>
        <script src="/js/products.js"></script>
    </x-slot:scripts>
</x-app-layout>
```

---

## 3. Các tính năng nâng cao của Blade Component Layouts

### 3.1. Tích hợp PHP Component Class (Backend Data Injection)

Khi tạo Component bằng Artisan command:

```bash
php artisan make:component AppLayout
```

Laravel sẽ tạo file class `app/View/Components/AppLayout.php` và file view `resources/views/components/app-layout.blade.php`.

```php
namespace App\View\Components;

use Illuminate\View\Component;
use App\Services\CartService;

class AppLayout extends Component
{
    public int $cartCount;

    // Dependency Injection trực tiếp vào Constructor của Layout!
    public function __construct(CartService $cartService, public string $title = 'Online Store')
    {
        $this->cartCount = $cartService->getItemCount();
    }

    public function render()
    {
        return view('components.app-layout');
    }
}
```

> **WHY:** Không còn cần phải dùng `View::share()` hay `View::composer()` trong `AppServiceProvider` chỉ để truyền dữ liệu toàn cục (như số lượng giỏ hàng, user profile) vào Layout nữa!

### 3.2. Nested Layouts (Lồng Layouts)

Lồng một Layout Admin vào bên trong Main Shell Layout trở nên cực kỳ tự nhiên:

```blade
<!-- resources/views/components/admin-layout.blade.php -->
<x-app-layout :title="$title">
    <div class="flex">
        <aside class="w-64 bg-gray-800 text-white min-h-screen">
            <x-admin-sidebar />
        </aside>
        <div class="flex-1 p-6">
            {{ $slot }}
        </div>
    </div>
</x-app-layout>
```

Và ở View con Admin:

```blade
<x-admin-layout title="Quản lý Đơn hàng">
    <h2>Danh sách đơn hàng cần xử lý</h2>
</x-admin-layout>
```

---

## 4. Bảng So Sánh Tổng Quan (Comparison Matrix)

| Tiêu chí                     | Cũ: `@extends` / `@yield`                               | Mới: `<x-layout>` / `$slot`                                            |
| :--------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------------- |
| **Triết lý thiết kế**        | Template Inheritance (Kế thừa)                          | Component Composition (Lắp ghép)                                       |
| **Cú pháp chèn nội dung**    | `@yield('content')`                                     | Biến mặc định `{{ $slot }}`                                            |
| **Cú pháp vùng phụ**         | `@section('scripts') ... @endsection`                   | `<x-slot:scripts> ... </x-slot:scripts>`                               |
| **Truyền Props / Variables** | Rườm rà qua array ở `@extends('app', ['key' => 'val'])` | Trực quan dạng HTML Attribute: `<x-layout title="Home" :count="$n">`   |
| **Attribute Forwarding**     | Không hỗ trợ `$attributes`                              | Hỗ trợ `$attributes->merge(['class' => '...'])` tuyệt vời cho Tailwind |
| **Backend Logic**            | Phụ thuộc View Composers                                | Tích hợp sẵn PHP Class (`app/View/Components/...`)                     |
| **Lồng Layout (Nesting)**    | Phức tạp, dễ rối thứ tự `@section`                      | Đơn giản, tự nhiên như lồng HTML tags                                  |

---

## 5. Hướng dẫn Refactor từ Cũ sang Mới (Migration Checklist)

1. **Bước 1**: Chuyển file master layout từ `resources/views/layouts/app.blade.php` thành `resources/views/components/app-layout.blade.php` (hoặc giữ nguyên vị trí và gọi qua `<x-layouts.app>`).
2. **Bước 2**: Thay các vị trí `@yield('content')` chính thành `{{ $slot }}`.
3. **Bước 3**: Thay các `@yield('name')` phụ thành `{{ $name ?? '' }}`.
4. **Bước 4**: Ở các file view con:
   - Thay `@extends('layouts.app')` và `@section('content') ... @endsection` bằng thẻ bao bọc `<x-app-layout>` ... `</x-app-layout>`.
   - Thay `@section('header')` bằng `<x-slot:header>`.
   - Chuyển biến truyền vào `@extends` thành thuộc tính của thẻ `<x-app-layout title="...">`.

---

## Related Notes

- [[000_Online_Store_MOC]]
- [[Laravel_13_Core_Features]]
