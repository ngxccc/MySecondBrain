---
tags:
  [
    type/concept,
    topic/backend,
    layer/architecture,
    pattern/architectural,
    framework/express,
  ]
date: 2026-02-08
aliases: [N-Tier Architecture, Monolithic Architecture]
description: "Kiến trúc N-Tier truyền thống chia theo Technical Concerns."
---

# Layered Architecture

## TL;DR

Cách tổ chức code bằng cách chia cắt ứng dụng theo chiều ngang dựa trên vai trò kỹ thuật (Technical Concerns): Controller (Giao tiếp HTTP), Service (Xử lý nghiệp vụ), Model (Dữ liệu). Kiến trúc "nhập môn" dễ setup nhất cho các dự án vừa và nhỏ.

## Core Concept

- **Separation of Concerns (SoC):** Mỗi tầng chỉ làm đúng nhiệm vụ của mình. Controller không tính toán nghiệp vụ, Model không xử lý HTTP Request.
- **Unidirectional Data Flow (Dòng chảy một chiều):** Request đi theo thứ tự chuẩn: **Controller $\rightarrow$ Service $\rightarrow$ Model**.
- **Phân chia trách nhiệm:**
  - _Presentation Layer (Controller):_ "Lễ tân". Nhận request, validate input (bằng DTO/Zod), gọi Service, và trả về JSON.
  - _Business Logic Layer (Service):_ "Bộ não". Chứa 100% logic if/else nghiệp vụ, gọi API bên thứ 3, xử lý dữ liệu.
  - _Data Access Layer (Model/Repository):_ "Thủ kho". Nơi duy nhất được phép chọc vào Database để thực thi thao tác CRUD.

## Practical Implementation

- **Trade-offs (Giới hạn khi Scale):** Khi dự án phình to (hàng chục entities), việc gom code theo "Kỹ thuật" (nhét hết mọi service vào folder `services`) sẽ sinh ra "God Service" (file dài hàng ngàn dòng) và lỗi "Circular Dependency" (Service A gọi Service B và ngược lại gây crash app).
- **Rule of Thumb:** Tuyệt đối cấm "nhảy cóc" (Ví dụ: Controller gọi thẳng `User.find()` mà bỏ qua tầng Service), vì nó sẽ phá vỡ tính nhất quán của dữ liệu.
- **Code Snippet (Express.js Flow):**

```typescript
// 1. Controller (Skinny)
export const registerController = async (req: Request, res: Response) => {
  const registerDto = req.body; // Giả định đã pass validation middleware
  const user = await usersService.register(registerDto);
  return res.json({ message: "Success", data: user });
};

// 2. Service (Fat - Nơi chứa não)
class UsersService {
  async register({ email, password }: RegisterDto) {
    // HACK: Chỉ Service mới được quyền check business rule
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email exists");

    const hashedPassword = await hashPassword(password);
    return await User.create({ email, password: hashedPassword });
  }
}
```

---

**Related Notes:**

- Giải pháp thay thế khi dự án phình to: [[Modular_Monolith_Architecture]]
- Cách đóng gói dữ liệu giữa các tầng: [[Data_Transfer_Object_DTO]]
