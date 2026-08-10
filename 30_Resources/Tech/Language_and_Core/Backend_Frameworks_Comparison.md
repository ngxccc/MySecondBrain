---
tags: [type/concept, topic/tech, layer/infrastructure]
date: 2026-06-24
aliases:
  [
    Backend Frameworks Comparison,
    So sánh Backend Frameworks,
    Node.js Bun Web Frameworks,
  ]
description: "So sánh toàn diện giữa NestJS, Express, Fastify và ElysiaJS về hiệu năng, DX, độ tương thích và trường hợp sử dụng phù hợp."
---

# JS/TS Backend Frameworks Comparison

## TL;DR

Bản so sánh toàn diện 4 framework backend JavaScript/TypeScript nổi bật nhất tính đến tháng 6 năm 2026: **NestJS (v11)**, **Express (v5)**, **Fastify (v5)**, và **ElysiaJS (v1.4)**. Báo cáo phân tích chi tiết hiệu năng (throughput/RPS), trải nghiệm lập trình (DX), độ trưởng thành hệ sinh thái, độ tương thích với runtime Bun và Node.js, nhằm đưa ra quyết định kiến trúc chính xác nhất cho từng loại quy mô dự án.

---

## Core Concept

### 1. Bản Đồ Tổng Quan Các Framework

- **NestJS (v11.1.27):** Framework hướng đối tượng (OOP), có cấu trúc chặt chẽ (opinionated), kế thừa triết lý Dependency Injection của Angular. Phù hợp nhất cho các dự án doanh nghiệp lớn (Enterprise) cần tính bảo trì cao.
- **Express (v5.2.1):** Phiên bản Express 5 stable đã chính thức thay thế Express 4 làm mặc định trên npm. Nó giữ nguyên tính tối giản (minimalist) và hệ sinh thái middleware khổng lồ, nhưng bổ sung xử lý Promise bất đồng bộ tự động.
- **Fastify (v5.8.5):** Framework tối ưu hiệu năng chạy trên Node.js, sử dụng hệ thống plugin độc lập (`avvio`) và biên dịch JSON Schema (`ajv`) thành hàm JavaScript để tối đa hóa tốc độ phản hồi.
- **ElysiaJS (v1.4.29):** Framework thiết kế tối ưu riêng cho Bun runtime. Elysia nổi tiếng với tốc độ siêu nhanh (Bun-native), cơ chế suy luận kiểu dữ liệu tĩnh hai đầu (End-to-End Type Safety qua Eden), và kiến trúc BETH Stack.

---

### 2. Ma Trận So Sánh Chi Tiết

| Tiêu chí              | NestJS (v11)                               | Express (v5)               | Fastify (v5)              | ElysiaJS (v1.4)              |
| :-------------------- | :----------------------------------------- | :------------------------- | :------------------------ | :--------------------------- |
| **Triết lý thiết kế** | Opinionated (OOP, DI)                      | Unopinionated (Middleware) | Plugin-encapsulated       | Bun-native, Type-safe        |
| **Hiệu năng (RPS)**   | Khá tốt (Chịu ảnh hưởng bởi DI/Reflection) | Trung bình (Baseline)      | Rất cao (~2-3x Express)   | Blazing Fast (~6-8x Express) |
| **Kiểu biên dịch**    | JIT/AOT Metadata                           | JIT JS                     | Compile JSON Schemas      | Static code analysis         |
| **TypeScript DX**     | Tuyệt vời (Decorator)                      | Trung bình (Thêm `@types`) | Tốt                       | Xuất sắc (Inference gốc)     |
| **Độ trưởng thành**   | Rất cao (~76k Stars)                       | Tuyệt đối (~69.2k Stars)   | Cao (OpenJS Foundation)   | Trung bình (Đang phát triển) |
| **Múi giờ & Date**    | Temporal API + Pipes                       | Phụ thuộc thư viện ngoài   | Phụ thuộc thư viện ngoài  | Tích hợp Standard Schema     |
| **Tương thích Bun**   | Tốt (~95% Node APIs)                       | 100%                       | 100% (Node emulation)     | 100% Native (Bun-first)      |
| **Tương thích Node**  | 100%                                       | 100%                       | 100%                      | Cần Node Adapter (chậm hơn)  |
| **Learning Curve**    | Dốc (Cần học DI, Module)                   | Dễ nhất                    | Trung bình (Plugin Scope) | Dễ (Ergonomic)               |

---

## Practical Implementation

### 1. So Sánh Mã Nguồn: Khai Báo Route & Validation

Dưới đây là cách 4 framework xử lý route cơ bản và kiểm tra dữ liệu đầu vào (Validation) để thấy sự khác biệt về mặt lập trình:

#### A. NestJS - Dựa vào Decorators & Class-Validator

```typescript
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { IsString, IsEmail } from "class-validator";

class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

@Controller("users")
export class UserController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return { status: "success", data: createUserDto };
  }
}
```

#### B. Express - Tối giản, Validation thủ công hoặc qua Middleware

```javascript
import express from "express";
const app = express();
app.use(express.json());

app.post("/users", (req, res, next) => {
  const { name, email } = req.body;
  if (!name || typeof name !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Validation failed" });
  }
  res.json({ status: "success", data: { name, email } });
});
```

#### C. Fastify - Schema-first

```typescript
import Fastify from "fastify";
const fastify = Fastify();

fastify.post(
  "/users",
  {
    schema: {
      body: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
    },
  },
  async (request, reply) => {
    return { status: "success", data: request.body };
  },
);
```

#### D. ElysiaJS - End-to-End Type Safety

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia()
  .post(
    "/users",
    ({ body }) => {
      return { status: "success", data: body };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .listen(3000);
```

---

### 2. Định Hướng Lựa Chọn Kiến Trúc Cho Dự Án

- **Chọn NestJS khi:**
  - Dự án doanh nghiệp lớn (Monolith/Microservices), yêu cầu cấu trúc code chuẩn chỉ và khả năng mở rộng lâu dài.
  - Đội ngũ phát triển có nhiều thành viên (opinionated structure giúp giảm thiểu xung đột style code).
  - Hệ thống chạy hoàn toàn trên Node.js hoặc muốn tối ưu hóa cold starts trên Bun Serverless.
- **Chọn Express khi:**
  - Dự án bảo trì (legacy projects) đã vận hành lâu năm.
  - Cần xây dựng ứng dụng nhỏ nhanh chóng (MVP) mà không cần quan tâm sâu đến hiệu năng chịu tải quá lớn.
  - Cần tận dụng các thư viện trung gian (middleware) khổng lồ đã tích lũy hơn 10 năm qua.
- **Chọn Fastify khi:**
  - Cần xây dựng REST API/Microservices hiệu năng cao trên hạ tầng Node.js truyền thống.
  - Cần hệ thống Schema Validation cực kỳ chặt chẽ và an toàn bảo mật (không chạy code động không an toàn).
  - Đội ngũ thích lập trình dạng module khép kín (encapsulated plugins).
- **Chọn ElysiaJS khi:**
  - Dự án sử dụng **Bun Runtime** làm nền tảng cốt lõi ngay từ đầu.
  - Cần phát triển dự án full-stack TypeScript có sự kết nối chặt chẽ giữa Front-end (Next.js/React) và Back-end thông qua Eden (giảm thiểu định nghĩa API thủ công).
  - Dự án real-time cần kết nối WebSocket hiệu năng siêu cao nhờ µWebSockets.

---

## Related Notes

- [[000_Tech_MOC]]
- [[JS_Runtimes_Bun_vs_NodeJS]]
- [[JS_Temporal_API]]
- [[TS_Decorators]]
