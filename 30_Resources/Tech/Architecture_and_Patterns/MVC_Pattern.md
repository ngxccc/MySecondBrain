---
tags: [type/concept, topic/backend, topic/architecture, layer/architecture]
date: 2026-02-08
aliases: [Model-View-Controller, Classical MVC]
description: "Mô hình kinh điển và sự tiến hóa thành REST API hiện đại."
---

# MVC Pattern

## TL;DR

Mẫu kiến trúc kinh điển chia ứng dụng thành 3 phần: **Model** (Dữ liệu & Logic), **View** (Giao diện hiển thị), và **Controller** (Điều phối). MVC là nền tảng giải quyết triệt để vấn đề "Spaghetti Code" (trộn lẫn logic query DB vào file HTML).

## Core Concept

- **Model (Data & Rules):** Đại diện cho cấu trúc dữ liệu và quy tắc nghiệp vụ. Nơi duy nhất tương tác trực tiếp với Database.
- **View (Presentation):** Nơi hiển thị dữ liệu (HTML/UI) cho người dùng. Không được chứa logic tính toán phức tạp.
- **Controller (Traffic Cop):** Nhận request $\rightarrow$ Lấy/Cập nhật dữ liệu từ Model $\rightarrow$ Gắn dữ liệu vào View và trả về cho Client.
- **Sự tiến hóa thành REST API:** Trong kiến trúc Backend hiện đại (Headless Architecture), tầng **View** vật lý (file HTML/EJS) đã biến mất và được nhường lại cho Frontend (React/Vue). Lúc này, bước `res.json(...)` chính là cách Controller trả về View dưới định dạng dữ liệu thô.

## Practical Implementation

- **Trade-offs (Fat Controller Anti-pattern):** Lỗi phổ biến nhất của Fresher là nhét toàn bộ logic (tính tiền, check quyền, gửi email) vào Controller. Controller chuẩn phải "gầy" (chỉ điều phối luồng), logic nên đẩy xuống Model hoặc một tầng trung gian (Service Layer).
- **Code Snippet (Modern MVC - REST API):**

```typescript
// 1. Controller (src/controllers/users.controllers.ts)
// Nhiệm vụ: Nhận Request, gọi Model/Service, và cấu trúc View (JSON)
export const getProfileController = async (req: Request, res: Response) => {
  // Controller gọi Model (Ví dụ qua Mongoose/Drizzle)
  const user = await UserModel.findById(req.user_id);

  if (!user) throw new Error("User not found");

  // VIEW: Khối JSON này chính là "View" trong kiến trúc API hiện đại
  return res.json({
    message: "Success",
    data: { email: user.email, role: user.role },
  });
};
```

---

**Related Notes:**

- Biến thể hiện đại có thêm tầng xử lý logic: [[Layered_Architecture]]
- Cách tổ chức source code: [[Modular_Monolith_Architecture]]
- Tiêu chuẩn thiết kế API: [[REST_API_Design]]
