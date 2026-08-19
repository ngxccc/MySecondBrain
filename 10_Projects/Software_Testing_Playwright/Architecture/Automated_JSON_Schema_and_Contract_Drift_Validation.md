---
tags: [type/concept, topic/testing, layer/quality]
status: permanent
date: 2026-08-14
description: Automated JSON Schema validation, API Contract Drift prevention, and Zod/AJV integration in Playwright API test suites
---

# Automated JSON Schema and Contract Drift Validation

## TL;DR

Contract Drift (Rách vỡ hợp đồng ngầm) là hiện tượng Backend thay đổi kiểu dữ liệu (Type Drift) hoặc xóa mất trường dữ liệu bắt buộc nhưng vẫn trả về HTTP Status `200 OK`. Các bài test kiểm tra thủ công (`toHaveProperty`) sẽ bị **False Positive (Báo xanh mù quáng)** trước lỗi này. Giải pháp $20/80$ chuẩn mực là tích hợp **Schema Validation Engine (Zod / AJV JSON Schema)** trực tiếp vào Playwright để kiểm định toàn bộ cấu trúc dữ liệu, ràng buộc kiểu và enum chỉ trong một dòng lệnh duy nhất.

## The Contract Drift Nightmare (Cơn ác mộng rách vỡ hợp đồng)

Trong một hệ thống Microservices hoặc Fullstack Web/Mobile:

```text
[Backend Refactor Code] ──▶ Đổi ticketId: 101 (number) -> "tc-101" (string)
                        ──▶ Vô tình xóa trường isPaid: true
                        ──▶ Trả về HTTP 200 OK

[Manual Assertions Test]:
expect(res.status()).toBe(200);
expect(data).toHaveProperty('ticketId');  ──▶ VẪN PASS MÙ QUÁNG!

[Môi Trường Production]:
Frontend Web/App gọi: if (ticket.isPaid)  ──▶ Nhận undefined -> Lỗi thanh toán!
Frontend Web/App gọi: ticketId.toFixed()  ──▶ TypeError: Crash toàn bộ UI!
```

- **Hậu quả:** Bộ test tự động không bảo vệ được ứng dụng khỏi các lỗi hồi quy kiểu dữ liệu (Type Regression), đẩy mã lỗi nghiêm trọng lên người dùng cuối.

## Schema Validation Engine vs Manual Assertions

| Tiêu Chí                                  | Manual Property Assertions                   | Zod / JSON Schema Validation                       |
| :---------------------------------------- | :------------------------------------------- | :------------------------------------------------- |
| **Độ bao phủ kiểu (Type Coverage)**       | Rất thấp (chỉ check tồn tại tên key)         | $100\%$ (kiểm tra type, format, nullability, enum) |
| **Phát hiện thiếu trường (Missing Keys)** | Phải viết $N$ dòng `toHaveProperty` thủ công | Tự động phát hiện thiếu bất kỳ trường bắt buộc nào |
| **Bảo trì khi Schema thay đổi**           | Phải sửa hàng chục dòng assert rải rác       | Chỉ cần cập nhật duy nhất 1 Schema Model tập trung |
| **Tốc độ thực thi**                       | Nhanh nhưng lộn xộn                          | Cực nhanh ($< 1\text{ms}$ parse memory)            |

## Production 20/80 Zod Schema Test Pattern

```typescript
import { test, expect } from "@playwright/test";
import { z } from "zod";

// 1. Định nghĩa Hợp đồng dữ liệu nghiêm ngặt (Strict Contract Schema)
const TicketResponseSchema = z.object({
  ticketId: z.number().int().positive(),
  seatNumber: z.number().int().min(1).max(100),
  price: z.number().nonnegative(),
  isPaid: z.boolean(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  issuedAt: z.string().datetime(),
});

type TicketResponse = z.infer<typeof TicketResponseSchema>;

test("Kiểm thử cấu trúc hợp đồng dữ liệu vé xem phim", async ({ request }) => {
  const res = await request.get("http://localhost:3000/api/v1/tickets/tc-101");
  expect(res.status()).toBe(200);

  const rawJson = await res.json();

  // 2. Một dòng lệnh duy nhất kiểm định toàn bộ hợp đồng API
  const parseResult = TicketResponseSchema.safeParse(rawJson);

  // 3. Nếu có bất kỳ sai lệch nào (Type Drift / Missing Key) -> FAIL NGAY LẬP TỨC!
  if (!parseResult.success) {
    console.error("Schema Contract Violated:", parseResult.error.format());
  }

  expect(parseResult.success).toBe(true);
});
```

## Reusing Backend DTO Schemas (Fullstack Sharing)

Trong kiến trúc TypeScript Monorepo (Turborepo) hoặc NestJS + Playwright:

- Đội ngũ kỹ thuật có thể chia sẻ trực tiếp các file schema Zod / DTO từ thư mục backend sang thư mục test của Playwright.
- Khi backend cập nhật DTO, TypeScript Compiler và bộ test Playwright sẽ **báo lỗi ngay tại thời điểm Compile (Build-time)** trước khi cần chạy test!

## Related Notes

- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[APIRequestContext_vs_Browser_Engine]]
- [[000_Software_Testing_Playwright_MOC]]
