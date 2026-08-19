---
tags: [type/method, topic/project-management, layer/quality]
status: permanent
date: 2026-08-18
description: Technical test specification, SOM architecture, and Definition of Done for WBS 2.1 - API Case 1 Auth Lifecycle & Token Rotation
---

# WBS 2.1: API Test Suite - Auth Lifecycle and Single-Use Token Rotation

## Metadata

- **WBS Code:** `2.1`
- **Task Name:** API Ca 1: Auth Lifecycle, JWT & Single-use Token Rotation
- **Assignee:** Nguyễn Quốc Đương (MSSV: 0306241102)
- **Task Weight:** `7.5%`
- **Deliverable Artifacts:** File mã nguồn `src/api/specs/auth.spec.ts`, `src/api/services/AuthService.ts`, Pull Request GitHub, Mục 3.1 Chương 3 trong `67_Bao_cao.docx` và các Slide tương ứng trong `67_Slide.pptx`.

## TL;DR

Tài liệu đặc tả kỹ thuật kịch bản kiểm thử tự động API Ca 1: Vòng đời xác thực tài khoản (Registration -> Login -> Token Issuance -> Refresh Token Rotation -> Revocation/Logout). Kiểm tra các biên bảo mật của JSON Web Token (JWT) bao gồm phát hiện tái sử dụng Token cũ (Token Reuse Detection), Token giả mạo chữ ký và Token hết hạn thông qua Service Object Model `AuthService`.

## Core Architectural Content to Implement

### 1. Luồng Nghiệp Vụ Xác Thực & Vòng Xoay Refresh Token (Rotation Flow)

```text
+---------------+      1. POST /auth/login       +---------------+
|  API Client   | -----------------------------> |  Auth Service |
|  (Playwright) | <----------------------------- |  (Backend API)|
+---------------+   Access Token (15m) + RT (7d) +---------------+
        |
        | 2. POST /auth/refresh (Gửi RT_1)
        v
+---------------+   Tra ve Access Token moi +    +---------------+
|  Auth Service | =============================> |  RT_2 moi     |
|               |    (Huy bo RT_1 vao Blacklist) |  (Rotated RT) |
+---------------+                                +---------------+
        |
        | 3. ATTACK SCENARIO: Gui lai RT_1 da cu (Token Reuse Attack)
        v
+---------------+   Phat hien vi pham bao mat:
|  Security Hub | -----------------------------> Tra ve HTTP 403 Forbidden
+---------------+                                Huy toan bo chuoi phien cua User do!
```

### 2. Danh Sách Các Trường Hợp Kiểm Thử Trọng Tâm (Test Scenarios)

1. **`TC-AUTH-01: Happy Path Login & JWT Structure`**
   - Gửi payload đăng nhập hợp lệ (`email`, `password`).
   - Kiểm tra HTTP Status `200 OK`.
   - Kiểm tra cấu trúc JWT trả về gồm 3 phần phân tách bằng dấu chấm (`header.payload.signature`), giải mã payload chứa đúng `userId`, `role`, và thời hạn `exp`.
2. **`TC-AUTH-02: Single-Use Refresh Token Rotation`**
   - Gửi Refresh Token lần 1 $\to$ Nhận cặp Token mới thành công (`HTTP 200`).
   - Gửi lại Refresh Token lần 1 đã sử dụng (Tấn công tái sử dụng) $\to$ Backend kích hoạt cơ chế phòng vệ, trả về `HTTP 403 Forbidden` hoặc `HTTP 401 Unauthorized` và vô hiệu hóa toàn bộ gia đình Token (Family Revocation).
3. **`TC-AUTH-03: Expired & Tampered Token Boundary`**
   - Gửi Access Token đã hết hạn $\to$ Kiểm tra nhận mã lỗi `HTTP 401 Unauthorized`.
   - Thay đổi 1 ký tự trong chữ ký Signature của Token $\to$ Kiểm tra nhận `HTTP 401 Unauthorized` (Invalid Signature).
4. **`TC-AUTH-04: Full Logout & Session Invalidation`**
   - Gọi endpoint `/auth/logout` $\to$ Kiểm tra Access Token và Refresh Token không thể sử dụng lại để truy cập các tài nguyên được bảo vệ.

### 3. Cấu Trúc Mã Nguồn Chuẩn Mực

```typescript
// src/api/services/AuthService.ts
export class AuthService {
  constructor(private request: APIRequestContext) {}

  async login(credentials: LoginDto): Promise<APIResponse> {
    return this.request.post("/api/v1/auth/login", { data: credentials });
  }

  async refreshToken(refreshToken: string): Promise<APIResponse> {
    return this.request.post("/api/v1/auth/refresh", {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
  }
}
```

---

## Acceptance Criteria & Definition of Done (DoD Checklist)

- [ ] **Mã Nguồn Kiểm Thử & Chạy Pass ($100\%$):**
  - [ ] Tạo file `src/api/services/AuthService.ts` và `src/api/specs/auth.spec.ts`.
  - [ ] Chạy lệnh `npx playwright test auth.spec.ts --project=api-tests` pass $100\%$ cả 4 test cases.
  - [ ] Không có lệnh chờ tĩnh `sleep()`, code viết sạch đẹp theo chuẩn TypeScript.
- [ ] **Bằng Chứng Git & Pull Request:**
  - [ ] Tạo nhánh `feat/wbs-2.1-api-auth-lifecycle`.
  - [ ] Tạo Pull Request trên GitHub với đầy đủ mô tả và ảnh chụp kết quả chạy test pass.
  - [ ] Cập nhật link PR vào cột Audit Evidence trên Google Sheets Master WBS.
- [ ] **Báo Cáo:**
  - [ ] Soạn thảo bản thảo Mục 3.1 Chương 3 cho Báo cáo Word (`67_Bao_cao.docx`).

## Related Notes

- [[Hybrid_Auth_and_Storage_State_Injection]]
- [[Service_Object_Model_and_API_Request_Chaining]]
- [[API_Test_Data_Lifecycle_and_State_Isolation]]
- [[Team_Work_Breakdown_and_Contribution_Matrix_Template]]
