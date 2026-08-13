---
tags: [type/concept, topic/tech]
date: 2026-06-25
aliases:
  [
    So sánh Backend Frameworks cho dự án Viện Dưỡng Lão,
    Backend Frameworks Comparison Team 16,
  ]
---

# 📊 So Sánh JS/TS Backend Frameworks Cho Team 16 Người

## TL;DR

Bản so sánh và đánh giá lựa chọn framework Backend chạy trên nền Node.js kết nối cơ sở dữ liệu **SQL Server (MSSQL)** cho dự án Quản lý viện dưỡng lão Việt Trí Đạo. Với quy mô nhóm phát triển lên tới **16 người**, trọng tâm đánh giá được đặt vào: tính nhất quán cấu trúc mã nguồn để code review, khả năng chia module làm việc song song giảm xung đột Git (Merge Conflicts), và mức độ hỗ trợ kết nối SQL Server thông qua các thư viện ORM/Query Builder.

---

## Core Concept

### 1. Phân Tích Sự Phù Hợp Cho Quy Mô Team 16 Người

Với 16 lập trình viên làm việc trên cùng một repository, các yếu tố kỹ thuật thuần túy (tốc độ xử lý) phải nhường chỗ cho khả năng quản lý code và làm việc nhóm:

- **Tính nhất quán của Codebase:** Cần một bộ khung ép buộc mọi người viết code theo cấu trúc giống nhau để dễ dàng chuyển giao nhiệm vụ và tối ưu hóa việc code review.
- **Tránh xung đột Git (Merge Conflicts):** Cần kiến trúc phân rã tốt (decoupled) để các nhóm nhỏ phát triển tính năng (Auth, Billing, eMAR, Vitals) không sửa chung vào các file định tuyến hoặc file cấu hình trung tâm.
- **Quản lý kết nối SQL Server:** Tận dụng tối đa các thư viện ORM để tự động đồng bộ hóa kiểu dữ liệu từ database, giảm thiểu lỗi gõ sai tên bảng/cột.

### 2. Ma Trận So Sánh Tính Năng

| Tiêu chí                       | NestJS (v11)                                        | Express.js (v5)                          | Fastify (v5)                           |
| :----------------------------- | :-------------------------------------------------- | :--------------------------------------- | :------------------------------------- |
| **Triết lý thiết kế**          | Opinionated (Ép buộc cấu trúc chuẩn)                | Unopinionated (Tự do tối đa)             | Plugin-encapsulated (Đóng gói plugin)  |
| **Kiểu lập trình**             | OOP / DI (Hướng đối tượng)                          | Functional / Procedural                  | Functional / Plugin-based              |
| **Khả năng làm việc nhóm**     | 🟢 **Xuất sắc** (Chia module độc lập)               | 🔴 **Tệ** (Dễ bị loạn cấu trúc)          | 🟡 **Trung bình** (Có cấu trúc plugin) |
| **Độ dễ học (Learning Curve)** | 🔴 **Khó** (Cần biết OOP/Decorator)                 | 🟢 **Dễ nhất** (Hầu như ai cũng biết)    | 🟡 **Dễ - Trung bình**                 |
| **Xử lý xung đột Git**         | 🟢 **Ít xảy ra** (Cấu trúc phân rã)                 | 🔴 **Thường xuyên** (Dễ conflict router) | 🔴 **Thường xuyên**                    |
| **Tích hợp SQL Server**        | 🟢 **Xuất sắc** (Sẵn module TypeORM/Prisma/Drizzle) | 🟡 **Khá** (Phải tự cấu hình tay)        | 🟡 **Khá** (Phải tự cấu hình tay)      |
| **Hiệu năng xử lý**            | 🟡 Tốt (Đủ cho hệ thống EMR)                        | 🟡 Trung bình                            | 🟢 **Cực nhanh** (~2-3x Express)       |

---

## Practical Implementation

### 1. Hướng Dẫn Tích Hợp SQL Server Cho Từng Lựa Chọn Framework

Dưới đây là cách khai báo cấu trúc router và kết nối SQL Server cơ bản để so sánh độ phức tạp khi lập trình thực tế:

#### A. NestJS kết hợp với Prisma ORM (Khuyến nghị cho dự án)

Tạo cấu trúc module độc lập cho phân hệ Cư dân (`Resident`). Code của từng người sẽ nằm trọn trong folder này.

```typescript
// resident.dto.ts - Định nghĩa dữ liệu đầu vào có Validation
import { IsString, IsInt } from "class-validator";

export class CreateResidentDto {
  @IsString()
  fullName: string;

  @IsInt()
  age: number;
}

// resident.service.ts - Xử lý nghiệp vụ chính kết nối SQL Server qua Prisma
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateResidentDto } from "./resident.dto";

@Injectable()
export class ResidentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateResidentDto) {
    // Tự động gợi ý kiểu dữ liệu dựa trên bảng SQL Server
    return this.prisma.resident.create({
      data: {
        fullName: dto.fullName,
        age: dto.age,
        status: "Active",
      },
    });
  }
}

// resident.controller.ts - Định nghĩa các API endpoints
import { Controller, Post, Body } from "@nestjs/common";
import { ResidentService } from "./resident.service";
import { CreateResidentDto } from "./resident.dto";

@Controller("residents")
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  create(@Body() dto: CreateResidentDto) {
    return this.residentService.create(dto);
  }
}
```

#### B. Express.js kết hợp với mssql (Native Driver)

Cần tự viết các câu lệnh SQL Server dạng chuỗi và tự quản lý kết nối thủ công.

```javascript
import express from "express";
import sql from "mssql";

const router = express.Router();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true, trustServerCertificate: true },
};

router.post("/residents", async (req, res) => {
  const { fullName, age } = req.body;
  if (!fullName || typeof age !== "number") {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input("fullName", sql.NVarChar, fullName)
      .input("age", sql.Int, age)
      .query(
        "INSERT INTO Residents (FullName, Age, Status) VALUES (@fullName, @age, 'Active'); SELECT SCOPE_IDENTITY() AS id;",
      );

    res.status(201).json({ success: true, id: result.recordset[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

#### C. Kết nối SQL Server sử dụng Drizzle ORM (TypeScript)

Drizzle ORM hỗ trợ SQL Server (MSSQL) thông qua driver `node-mssql`. Đây là một giải pháp rất mạnh mẽ nếu team muốn viết câu lệnh SQL-like linh hoạt (Query Builder) nhưng vẫn đảm bảo an toàn kiểu dữ liệu (Type-safety).

```typescript
import { drizzle } from "drizzle-orm/node-mssql";
import * as mssql from "mssql";
import { pgTable, serial, text, integer } from "drizzle-orm/mysql-core"; // Drizzle dùng cú pháp mapping tương tự cho MSSQL

// 1. Cấu hình kết nối SQL Server
const connectionString =
  process.env.DATABASE_URL ||
  "mssql://username:password@localhost:1433/database";

// 2. Khởi tạo client kết nối (Asynchronous Connection Pool)
const pool = await mssql.connect(connectionString);
const db = drizzle({ client: pool });

// 3. Thực hiện truy vấn (ví dụ lấy danh sách cư dân)
const allResidents = await db.execute("SELECT * FROM Residents");
```

### 2. Khuyến Nghị Lựa Chọn Cho Team 16 Người

1. **Lựa chọn tối ưu nhất: NestJS (TypeScript) + Prisma ORM + SQL Server**
   - _Lý do:_ Cực kỳ phù hợp cho team đông người. Việc bắt buộc viết code hướng đối tượng giúp code đồng bộ, dễ duyệt PR. Prisma hỗ trợ SQL Server rất mạnh mẽ, tự sinh ra kiểu dữ liệu giúp hạn chế lỗi runtime.
2. **Lựa chọn thay thế (Nếu trình độ team chưa đồng đều): Express.js (TypeScript) + Prisma ORM**
   - _Lý do:_ Giảm tải độ dốc học tập của NestJS nhưng vẫn giữ lại khả năng kiểm soát kiểu dữ liệu và mô hình hóa SQL Server thông qua Prisma. Team cần tự xây dựng một Boilerplate cấu trúc thư mục thật chuẩn chỉnh trước khi bắt đầu code.

---

## Related Notes

- [[Docs/Nursing_Home_System_Research]] — Nghiên cứu chi tiết nghiệp vụ lâm sàng và tài chính của hệ thống.
- [[Docs/Nursing_Home_System_Feasibility_Analysis]] — Phân tích khả thi sản phẩm và các module bản địa hóa tại Việt Nam (VietQR, Zalo Mini App).
