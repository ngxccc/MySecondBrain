---
title: Laravel Routing Best Practices - Named Routes & URL Management
tags: [laravel, routing, named-routes, best-practices, web.php]
created: 2026-07-17
---

# Laravel Routing Best Practices: Named Routes (`->name()`) & URL Management

## TL;DR

Trong Laravel, việc khai báo `->name('alias')` cho Route được gọi là **Named Routes**. Đây là **Best Practice bắt buộc** trong mọi dự án Laravel thực tế.

- **KHÔNG NÊN**: Gọi route bằng URL cứng `/products` trong Blade hay Controller.
- **NÊN**: Gọi route qua alias `route('products')` hoặc `redirect()->route('products')`.

---

## 1. Tại sao phải đặt tên cho Route (`->name()`)?

### 1.1. Decoupling: Thay đổi URL không làm vỡ liên kết

Nếu trong Blade bạn dùng URL cứng:

```blade
<a href="/products">Sản phẩm</a>
```

Khi khách hàng yêu cầu đổi URL từ `/products` → `/danh-sach-san-pham`, bạn phải **tìm và sửa thủ công hàng chục file Blade**. Nếu sót 1 chỗ → lỗi 404!

Nếu dùng Named Route:

```blade
<a href="{{ route('products') }}">Sản phẩm</a>
```

Sau này chỉ cần đổi 1 dòng trong `routes/web.php`:

```php
Route::get('/danh-sach-san-pham', fn() => view('products'))->name('products');
```

Toàn bộ link trên website tự động cập nhật đúng mà **không cần sửa 1 dòng Blade nào**.

---

### 1.2. Dễ dàng Redirect trong Controller

```php
// Cách cũ (URL cứng) - Không khuyến khích:
return redirect('/about');

// Cách mới (Named Route) - An toàn & linh hoạt:
return redirect()->route('about');
```

---

### 1.3. Xử lý Tham số (Route Parameters) tự động

```php
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
```

Trong Blade:

```blade
<a href="{{ route('products.show', $product->id) }}">Chi tiết</a>
<!-- Tự động sinh URL: /products/15 -->
```

---

### 1.4. Kiểm tra Active Menu (Highlight Navbar)

```blade
<a href="{{ route('products') }}"
   class="{{ request()->routeIs('products') ? 'text-blue-600 font-bold' : 'text-gray-600' }}">
   Sản phẩm
</a>
```

---

## 2. Best Practice: Luôn đặt `->name()` cho mọi Route

### 2.1. Route mặc định của Laravel (Cần sửa)

File `routes/web.php` ban đầu thường có:

```php
Route::get('/', fn() => view('welcome'));
Route::get('/products', fn() => view('products'))->name('products');
Route::get('/about', fn() => view('about'))->name('about');
```

**Nên sửa thành:**

```php
Route::get('/', fn() => view('welcome'))->name('home');
Route::get('/products', fn() => view('products'))->name('products');
Route::get('/about', fn() => view('about'))->name('about');
```

### 2.2. Quy tắc ngón tay cái

> **Luôn đặt `->name()` cho mọi Route có tham gia hiển thị giao diện (GET) hoặc xử lý Form (POST/PUT/DELETE) mà bạn cần gọi từ View hoặc Controller.**

Ngoại lệ duy nhất: Route debug/test nội bộ không cần expose ra ngoài.

---

## 3. Bảng So sánh: Có `->name()` vs Không có

| Tiêu chí                      | Không có `->name()`                     | Có `->name()`                        |
| :---------------------------- | :-------------------------------------- | :----------------------------------- |
| **Gọi route trong Blade**     | `<a href="/products">` (URL cứng)       | `<a href="{{ route('products') }}">` |
| **Thay đổi URL**              | Phải sửa hàng chục file Blade           | Chỉ sửa 1 dòng `web.php`             |
| **Redirect trong Controller** | `redirect('/about')`                    | `redirect()->route('about')`         |
| **Active Menu**               | Khó kiểm tra, phải so sánh URL thủ công | `request()->routeIs('products')`     |
| **Route Parameters**          | Phải tự ghép chuỗi URL                  | `route('products.show', 10)` tự động |

---

## Related Notes

- [[000_Online_Store_MOC]]
- [[Laravel_Blade_Layouts]]
