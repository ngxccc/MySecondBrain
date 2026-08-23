---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, RFC 9457 Problem Details Zod validation, Rate Limiting verification, and Definition of Done for WBS 2.4
---

# WBS 2.4: API Test Suite - RFC 9457 Problem Details and Rate Limiting

## Metadata

- **WBS Code:** `2.4`
- **Task Name:** API Case 4: RFC 9457 Problem Details Schema Validation & Rate Limiting
- **Assignee:** Nguyễn Hoài Linh (MSSV: 0306241126)
- **Task Weight:** `7.5%`
- **Deliverable Artifacts:** File mã nguồn `tests/api/rfc9457_throttling.spec.ts`, `schemas/rfc9457.schema.ts`, Pull Request GitHub, Mục 3.4 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử API Ca 4: Kiểm định tính toàn vẹn của hợp đồng dữ liệu lỗi theo chuẩn quốc tế RFC 9457 (Problem Details for HTTP APIs) bằng thư viện Zod, kết hợp kiểm thử cơ chế bảo vệ hệ thống chống tấn công từ chối dịch vụ thông qua bộ điều tiết lưu lượng (Rate Limiting / Throttling) và xác thực các HTTP Headers kiểm soát tốc độ (`Retry-After`, `X-RateLimit-*`).

## Core Architectural Content to Implement

### 1. Chuẩn Hóa Phản Hồi Lỗi Quốc Tế: RFC 9457 Problem Details

Khi API gặp sự cố (4xx / 5xx), response bắt buộc phải tuân theo cấu trúc JSON chuẩn `application/problem+json` gồm các trường:

1. **`type` (URI):** Địa chỉ URL định danh loại lỗi (ví dụ: `https://api.example.com/errors/rate-limit-exceeded`).
2. **`title` (String):** Tiêu đề ngắn gọn, dễ hiểu của nhóm lỗi (ví dụ: `Too Many Requests`).
3. **`status` (Number):** Mã trạng thái HTTP tương ứng (ví dụ: `429`).
4. **`detail` (String):** Mô tả chi tiết nguyên nhân cụ thể dẫn đến lỗi của request hiện tại.
5. **`instance` (URI - Optional):** Định danh duy nhất của lượt gọi API để tra cứu log hệ thống (Request ID / Trace ID).
6. **`invalid_params` (Array - Optional):** Danh sách các trường dữ liệu không hợp lệ nếu là lỗi `422 Unprocessable Entity`.

### 2. Kỹ Thuật Kiểm Định Hợp Đồng Bằng Zod (Contract Drift Prevention)

```typescript
// schemas/rfc9457.schema.ts
import { z } from "zod";

export const ProblemDetailsSchema = z.object({
  type: z.string().url(),
  title: z.string().min(1),
  status: z.number().int().min(400).max(599),
  detail: z.string().min(1),
  instance: z.string().optional(),
  invalid_params: z
    .array(
      z.object({
        name: z.string(),
        reason: z.string(),
      }),
    )
    .optional(),
});
```

### 3. Kỹ Thuật Kiểm Thử Rate Limiting & Throttling

```typescript
// tests/api/rfc9457_throttling.spec.ts
import { test, expect } from "@playwright/test";
import { ProblemDetailsSchema } from "../../schemas/rfc9457.schema";

test("API Rate Limiting & RFC 9457 Validation", async ({ request }) => {
  const quotaLimit = 10;

  // Gui 10 requests hop le lien tiep trong han muc
  for (let i = 0; i < quotaLimit; i++) {
    const res = await request.get("/api/v1/tickets");
    expect(res.status()).toBe(200);
  }

  // Request thu 11 vuot quota -> Bat buoc nhan HTTP 429
  const throttledRes = await request.get("/api/v1/tickets");
  expect(throttledRes.status()).toBe(429);

  // Kiem tra cac Headers dieu tiet
  expect(throttledRes.headers()["retry-after"]).toBeDefined();
  expect(throttledRes.headers()["x-ratelimit-remaining"]).toBe("0");

  // Kiem dinh Schema RFC 9457 bang Zod (Chong Contract Drift)
  const body = await throttledRes.json();
  const validation = ProblemDetailsSchema.safeParse(body);
  expect(validation.success).toBe(true);
});
```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `schemas/rfc9457.schema.ts` và `tests/api/rfc9457_throttling.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test tests/api/rfc9457_throttling.spec.ts --project=api` pass $100\%$.
  - [ ] Xác nhận toàn bộ response lỗi 4xx/5xx đều pass qua bộ lọc Zod validation.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-2.4-api-rfc9457-throttling`.
  - [ ] Tạo Pull Request trên GitHub với đầy đủ mô tả, log JSON RFC 9457 và ảnh chụp test pass.
  - [ ] Cập nhật link PR vào Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.4 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[Automated_JSON_Schema_and_Contract_Drift_Validation]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
