---
title: Laravel Blade Layout Components
tags: [type/concept, topic/tech, laravel, blade, mvc]
aliases: [Blade Components, Blade Layouts, Kế thừa Layout Laravel, x-layout]
date: 2026-07-13
description: "Laravel Blade Components (thông qua cú pháp thẻ `<x-component>`) cung cấp giải pháp hướng thành phần (Component-based approach) mạnh mẽ để thiết lập cấu trúc Layout kế thừa, thay thế cho các chỉ th..."
---

# Laravel Blade Layout Components

## TL;DR

**Laravel Blade Components** (thông qua cú pháp thẻ `<x-component>`) cung cấp giải pháp hướng thành phần (Component-based approach) mạnh mẽ để thiết lập cấu trúc Layout kế thừa, thay thế cho các chỉ thị kế thừa truyền thống như `@extends` và `@section`. Bằng cách tự động ánh xạ tệp từ `resources/views/components/` và sử dụng cơ chế nội dung động `{{ $slot }}`, Blade Components cho phép cô lập phần khung HTML Boilerplate (`<!DOCTYPE html>`, `<head>`, stylesheet, scripts) khỏi trang con. Điều này giúp loại bỏ hoàn toàn các khai báo CSS inline cồng kềnh, cải thiện khả năng bảo trì và tổ chức mã nguồn ứng dụng sạch sẽ hơn.

---

## Core Concept

### 1. Sự khác biệt giữa Component-based Layout và Inheritance-based Layout

Trong các phiên bản Laravel cũ, việc tạo bố cục trang dựa trên cơ chế kế thừa cổ điển:

- **Layout cha:** Định nghĩa khung HTML và chừa chỗ trống bằng `@yield('content')`.
- **Trang con:** Gọi `@extends('layouts.app')` và bọc nội dung trong cặp thẻ `@section('content') ... @endsection`.

Với Blade Components (Laravel 7+), cách tiếp cận chuyển sang mô hình Component tương tự React/Vue:

- **Layout cha:** Định nghĩa dưới dạng một Component chuẩn (`resources/views/components/layout.blade.php`) và định vị nơi hiển thị nội dung động bằng biến `{{ $slot }}`.
- **Trang con:** Chỉ cần bọc nội dung trực tiếp bên trong thẻ mở và thẻ đóng của Component đó: `<x-layout> ... </x-layout>`.

### 2. Cú pháp `<x-name>` và Tự động Ánh xạ

Laravel tự động quét thư mục `resources/views/components/` để đăng ký các component:

- Thẻ `<x-layout>` ánh xạ trực tiếp đến tệp `resources/views/components/layout.blade.php`.
- Tên component dạng CamelCase hoặc kebab-case sẽ được chuyển đổi tương ứng: ví dụ `<x-admin-navigation>` ánh xạ đến `components/admin-navigation.blade.php`.

### 3. Cơ chế Slot

- **Default Slot (`{{ $slot }}`):** Lưu trữ toàn bộ nội dung HTML được bọc trực tiếp bên trong thẻ component.
- **Named Slots (`<x-slot>`):** Dùng khi layout cần chèn nội dung vào nhiều vị trí khác nhau (ví dụ: title, meta tags, hoặc custom sidebar).
  - Khai báo ở trang con: `<x-slot:title>Trang chủ</x-slot:title>`.
  - Render ở layout cha: `{{ $title }}`.

### 4. Thuộc tính Component và Variables

Biến `$attributes` được Laravel tự động tạo ra để thu thập tất cả các thuộc tính HTML được truyền vào component mà không được khai báo là props. Điều này cực kỳ hữu ích để tùy biến `class` hoặc `id` động từ trang con:

- Sử dụng trong Component: `<body {{ $attributes->merge(['class' => 'default-bg']) }}>`.

---

## Practical Implementation

### 1. Thiết lập Layout Component chung

Loại bỏ hoàn toàn các khối CSS inline dư thừa, thay thế bằng liên kết tài nguyên động qua Vite plugin của Laravel:

```blade
<!-- resources/views/components/layout.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title ?? config('app.name', 'Laravel') }}</title>

        @fonts

        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] flex p-6 lg:p-8 items-center lg:justify-center min-h-screen flex-col">
        {{ $slot }}
    </body>
</html>
```

### 2. Sử dụng ở Trang con

Kế thừa lại layout cha một cách ngắn gọn và áp dụng các class `@utility` từ Tailwind CSS v4 thay vì inline CSS:

```blade
<!-- resources/views/welcome.blade.php -->
<x-layout>
    <header class="w-full lg:max-w-4xl max-w-[335px] text-sm mb-6 not-has-[nav]:hidden">
        @if (Route::has('login'))
            <nav class="flex items-center justify-end gap-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="nav-link-outline">
                        Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="nav-link-flat">
                        Log in
                    </a>

                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="nav-link-outline">
                            Register
                        </a>
                    @endif
                @endauth
            </nav>
        @endif
    </header>

    <div class="flex items-center justify-center w-full transition-opacity opacity-100 duration-750 lg:grow starting:opacity-0">
        <main class="flex max-w-[335px] w-full flex-col-reverse lg:max-w-4xl lg:flex-row">
            <div class="card-left">
                <h1 class="mb-1 font-medium">Let's get started</h1>
                <!-- ... content ... -->
            </div>
            <div class="card-right">
                <!-- Laravel Logo SVG -->
            </div>
        </main>
    </div>
</x-layout>
```

---

## Interview Prep

### Q1: Phân biệt sự khác nhau giữa Layout Inheritance và Component-based Layout (`<x-...>`)?

- **Trả lời:**
  - Kế thừa truyền thống (`@extends` / `@section` / `@yield`) tuân theo mô hình từ trên xuống, trang con phải định nghĩa rõ từng phân vùng động mà trang cha yêu cầu.
  - Component-based layout (`<x-layout>` / `{{ $slot }}`) tuân theo mô hình bao bọc (Wrapper), trang con bọc trực tiếp nội dung vào trong component cha tương tự React/Vue. Cách này giúp cấu trúc HTML rõ ràng hơn, dễ dàng đóng gói dữ liệu đầu vào (Props) và kế thừa linh hoạt hơn mà không cần khai báo quá nhiều thẻ chỉ thị Blade.

### Q2: Biến đặc biệt `$attributes` trong Blade Component có nhiệm vụ gì và cách sử dụng nó để merge class CSS?

- **Trả lời:** Biến `$attributes` thu thập tất cả các thuộc tính HTML được truyền vào component từ bên ngoài (chẳng hạn như `class`, `id`, `data-*`). Chúng ta có thể dùng phương thức `{{ $attributes->merge(['class' => 'class-default']) }}` để gộp các class mặc định của component với các class tùy biến truyền thêm từ bên ngoài mà không làm mất hoặc ghi đè đè lên nhau.

### Q3: Làm thế nào để truyền một biến tùy chỉnh từ trang con vào Layout Component?

- **Trả lời:** Có hai cách chính:
  1. **Dùng attribute thông thường:** `<x-layout title="Trang chủ">`. Ở component cha, biến `$title` sẽ tự động khả dụng.
  2. **Dùng Named Slot:**
     - Ở trang con: `<x-slot:title>Trang chủ</x-slot:title>`
     - Ở trang cha: `<title>{{ $title }}</title>`

---

## Related Notes

- Bản đồ tri thức lập trình: [[000_Tech_MOC]]
- Cấu trúc kế thừa layout trong Next.js: [[NextJS_Route_Groups_and_Nested_Layouts]]
