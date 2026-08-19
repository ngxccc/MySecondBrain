---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Deep technical specification of Playwright APIRequestContext, Hybrid Auth, SOM, and RFC 9457 validation for WBS 1.4B
---

# WBS 1.4B: API Testing Capabilities and Design Patterns

## Metadata

- **WBS Code:** `1.4B`
- **Task Name:** Phân tích Năng lực API (APIRequestContext, Hybrid Auth, SOM)
- **Assignee:** Nguyễn Hoài Linh (MSSV: 0306241126)
- **Task Weight:** `2.5%`
- **Deliverable Artifacts:** Mục 2.4 Chương 2 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kiến trúc và năng lực tự động hóa kiểm thử API của Playwright: Khai thác engine HTTP độc lập `APIRequestContext` với tốc độ micro-giây, kỹ thuật xác thực lai (Hybrid Auth) kết hợp kiểm thử UI-API, mô hình Service Object Model (SOM) phục vụ xâu chuỗi request (Request Chaining), và phương pháp kiểm định hợp đồng dữ liệu lỗi theo chuẩn quốc tế RFC 9457 với Zod.

## Core Architectural Content to Document

### 1. Đối Tượng `APIRequestContext` Không Đầu (Headless HTTP Engine)

```typescript
// Thuc thi HTTP Request doc lap khong can mo Browser
import { test, expect } from "@playwright/test";

test("API Health Check", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.status).toBe("ok");
});
```

- **Tốc độ thực thi micro-giây:** Thực hiện các HTTP calls trực tiếp qua giao thức mạng, không tốn tài nguyên khởi động tiến trình Chromium hay phân tích cây DOM.
- **Quản lý phiên tự động:** Tự động duy trì Cookie Jar và nạp sẵn các cấu hình chung (`baseURL`, `extraHTTPHeaders`) được định nghĩa trong `playwright.config.ts`.

### 2. Kỹ Thuật Xác Thực Lai (Hybrid Auth & Storage State Injection)

```text
+-----------------------+
|  POST /api/v1/auth    | ----> Nhan JWT / Cookie trong 30ms ----> Luu file storageState.json
+-----------------------+                                                    |
                                                                             v
+-----------------------+                                    +-------------------------------+
|  UI Test 1: Checkout  | <--------------------------------- | Nap truc tiep vao Context RAM |
+-----------------------+     (Trang thai da dang nhap san)  +-------------------------------+
```

- **Bản chất:** Thay vì bắt trình duyệt mở form đăng nhập, gõ từng ký tự và chờ chuyển trang trên giao diện (mất $3000\text{ms} - 5000\text{ms}$), kịch bản gửi 1 HTTP Request trực tiếp đến endpoint xác thực (mất $30\text{ms}$).
- **Hiệu quả:** Rút ngắn hơn $80\%$ tổng thời gian chạy của toàn bộ bộ kiểm thử E2E.

### 3. Mô Hình Service Object Model (SOM) & Request Chaining

- **Service Object Model (SOM):** Tương tự POM ở tầng giao diện, SOM đóng gói các endpoint nghiệp vụ vào các class dịch vụ tái sử dụng (`AuthService`, `BookingService`, `SeatService`).
- **Request Chaining (Xâu chuỗi dữ liệu):** Sử dụng kết quả đầu ra của API trước làm tham số đầu vào cho API kế tiếp:
  $$\text{Login API} \xrightarrow{\text{Token}} \text{Hold Seat API} \xrightarrow{\text{SeatID}} \text{Payment API} \xrightarrow{\text{BookingID}} \text{Get Ticket API}$$

### 4. Kiểm Định Hợp Đồng Chuẩn Hóa Lỗi (RFC 9457 & Zod Schema Validation)

- **Nguy cơ Contract Drift:** Khi Backend thay đổi cấu trúc dữ liệu trả về mà không thông báo, hệ thống Frontend/Client sẽ bị đổ vỡ.
- **Giải pháp:** Sử dụng thư viện **Zod** để xác thực tính toàn vẹn của response lỗi chuẩn RFC 9457 Problem Details (`type`, `title`, `status`, `detail`, `instance`):
  ```typescript
  import { z } from "zod";

  export const ProblemDetailsSchema = z.object({
    type: z.string().url(),
    title: z.string(),
    status: z.number().int(),
    detail: z.string(),
    instance: z.string().optional(),
  });
  ```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Báo cáo Word (`67_Bao_cao.docx`):**
  - [ ] Soạn thảo đầy đủ Mục 2.4 Chương 2: Phân tích `APIRequestContext`, kỹ thuật Hybrid Auth, mô hình SOM và chuẩn RFC 9457.
  - [ ] Đính kèm sơ đồ luồng dữ liệu Hybrid Auth và code mẫu Zod Schema.
  - [ ] Phân tích ưu thế của việc tích hợp kiểm thử API trực tiếp trong Playwright so với việc dùng thêm thư viện ngoài như Axios/RestAssured.
- [ ] **Review & Bàn Giao:**
  - [ ] Nộp bản thảo Word và Slide cho Trưởng nhóm nghiệm thu đúng hạn.

## Related Notes

- [[APIRequestContext_vs_Browser_Engine]]
- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[Service_Object_Model_and_API_Request_Chaining]]
- [[RFC_9457_Problem_Details_and_API_Boundary_Testing]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
