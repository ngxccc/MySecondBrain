---
tags: [type/concept, topic/tech, language/typescript, layer/core-mechanics]
date: 2026-06-24
aliases: [TypeScript Decorators, Decorators trong TypeScript]
description: "Phương pháp trang trí trong TypeScript chuẩn ES (Stage 3) vs cũ (experimentalDecorators)."
---

# TS Decorators

## TL;DR

Decorator là một tính năng siêu lập trình (meta-programming) cho phép can thiệp, quan sát và thay đổi hành vi của Lớp (Class), Phương thức (Method), Thuộc tính (Property), hoặc Accessor tại runtime. Bài viết này phân tích bản chất, so sánh sự khác biệt sống còn giữa Decorator cũ (`experimentalDecorators` - Stage 2) và Decorator mới tiêu chuẩn (ES Decorators - Stage 3, từ TS 5.0+), đồng thời giải thích tại sao các framework như NestJS/TypeORM vẫn phải tiếp tục duy trì phiên bản cũ.

---

## Core Concept

### 1. Bản Chất Của Decorator

Decorator thực chất là các **hàm bậc cao (higher-order functions)**. Khi được áp dụng bằng ký hiệu `@decoratorName` phía trước một phần tử của Class, trình biên dịch TypeScript sẽ bọc phần tử đó lại bằng hàm decorator để theo dõi hoặc thay thế hành vi của phần tử đó trước khi nó thực sự được khởi tạo hoặc thực thi.

### 2. Sự Khác Biệt Giữa 2 Thế Hệ Decorator

Sự tiến hóa của ECMAScript dẫn đến sự phân chia sâu sắc giữa 2 phiên bản Decorator trong hệ sinh thái TypeScript:

| Đặc tính                   | `experimentalDecorators` (Legacy - Stage 2)                                       | TS 5.0+ Standard (Modern - Stage 3)                                                                  |
| :------------------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Compiler Flag**          | Bắt buộc bật `"experimentalDecorators": true` trong `tsconfig.json`.              | Chạy mặc định không cần bật flag.                                                                    |
| **Chữ ký Hàm (Signature)** | Nhận dạng theo vị trí: `(target, propertyKey, descriptor)`                        | Nhận dạng hướng ngữ cảnh: `(value, context)`                                                         |
| **Đối tượng Context**      | Không có (chỉ có property descriptor truyền thống).                               | Có `DecoratorContext` chứa loại phần tử (`kind`), tên (`name`), và hook khởi tạo (`addInitializer`). |
| **Parameter Decorators**   | **Hỗ trợ** (Trang trí tham số của hàm/constructor).                               | **Không hỗ trợ** (Bị loại bỏ trong đặc tả Stage 3).                                                  |
| **Mục đích sử dụng**       | Dành cho các framework cũ hoặc IOC/DI truyền thống (NestJS, Angular cũ, TypeORM). | Cú pháp JavaScript tiêu chuẩn, chạy trực tiếp trên các runtime hiện đại mà không cần compiler.       |

---

## Practical Implementation

### 1. Cấu hình Compiler

Tùy vào việc mày muốn sử dụng phiên bản Decorator nào, mày cần cấu hình `tsconfig.json` tương ứng:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",

    // Bật nếu sử dụng Decorator cũ (như NestJS, TypeORM, Inversify)
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

### 2. Cách Viết Decorator Theo Chuẩn Mới

Hàm Decorator theo chuẩn mới nhận vào 2 tham số: `value` (giá trị cần trang trí) và `context` (ngữ cảnh của phần tử đó).

#### Ví dụ: Tạo `@Logged` cho Phương thức

```typescript
function Logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  const methodName = String(context.name);

  // Trả về một hàm mới thay thế phương thức gốc
  return function (this: This, ...args: Args): Return {
    console.log(
      `[LOG] Bắt đầu gọi phương thức: ${methodName} với tham số:`,
      args,
    );
    const result = target.call(this, ...args);
    console.log(
      `[LOG] Kết thúc phương thức: ${methodName}, Kết quả trả về:`,
      result,
    );
    return result;
  };
}

class UserService {
  @Logged
  getUserById(id: number) {
    return { id, name: "Thành viên A" };
  }
}

const service = new UserService();
service.getUserById(10);
// Output console:
// [LOG] Bắt đầu gọi phương thức: getUserById với tham số: [10]
// [LOG] Kết thúc phương thức: getUserById, Kết quả trả về: { id: 10, name: 'Thành viên A' }
```

---

### 3. Cách Viết Decorator Theo Chuẩn Cũ

Hệ thống cũ can thiệp trực tiếp vào `PropertyDescriptor` của phương thức.

#### Ví dụ: Tạo `@ReadOnly` cho Thuộc tính

```typescript
function ReadOnly(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  descriptor.writable = false;
  return descriptor;
}

class Configuration {
  @ReadOnly
  getApiKey() {
    return "API-KEY-SECRET-12345";
  }
}
```

#### Tại sao NestJS/TypeORM bắt buộc phải dùng chuẩn cũ?

1. **Parameter Decorators (Trang trí tham số):** NestJS phụ thuộc hoàn toàn vào trang trí tham số để thực hiện Dependency Injection (ví dụ: `constructor(@InjectRepository(User) private userRepo: Repository<User>)`). Tiêu chuẩn mới (Stage 3) hiện tại **không hỗ trợ** trang trí tham số.
2. **Metadata Emission:** NestJS cần flag `"emitDecoratorMetadata": true` của hệ thống cũ để tự động suy luận ra kiểu dữ liệu của class lúc runtime phục vụ cơ chế tự động inject instance (IoC Container).

---

### 4. Mẫu Câu Hỏi Phỏng Vấn

**Q: Sự khác biệt lớn nhất giữa Decorator mặc định của TS 5.0+ và Decorator cũ (experimentalDecorators) là gì? Trong NestJS bạn sẽ chọn loại nào?**

**A:**

- Sự khác biệt lớn nhất nằm ở chữ ký hàm và khả năng tương thích. Decorator cũ (Stage 2) nhận đối số `(target, key, descriptor)` và cho phép trang trí tham số của hàm (parameter decorators). Decorator mới của TS 5.0 (Stage 3) là chuẩn ECMAScript chính thức, nhận đối số `(value, context)` giúp bảo vệ ngữ cảnh tốt hơn nhưng lại **không hỗ trợ parameter decorators**.
- Vì vậy, trong **NestJS**, em bắt buộc phải cấu hình `"experimentalDecorators": true` và `"emitDecoratorMetadata": true` để NestJS có thể thực hiện Dependency Injection thông qua các parameter decorator ở constructor và suy luận kiểu dữ liệu phục vụ IoC Container lúc runtime.

---

## Related Notes

- [[000_Tech_MOC]]
- [[Dependency_Injection]]
- [[SOLID_Principles]]
- [[JS_Stack_vs_Heap_Memory]]
