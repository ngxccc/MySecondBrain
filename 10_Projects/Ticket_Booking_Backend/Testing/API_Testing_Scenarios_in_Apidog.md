---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-16
aliases:
  [
    API Testing Scenarios in Apidog,
    Kich ban kiem thu API trong Apidog,
    Apidog Testing Cases,
  ]
---

# Hướng Dẫn Thiết Kế Kịch Bản Kiểm Thử API Trong Apidog (API Testing Scenarios in Apidog)

## TL;DR

Tài liệu này cung cấp hướng dẫn chi tiết về cách thiết kế, tổ chức và thực thi các kịch bản kiểm thử API (API Testing Scenarios) chuyên nghiệp trên nền tảng **Apidog**. Bài viết tập trung vào kiểm thử tích cực (Happy Path), kiểm thử tiêu cực (Negative/Boundary Testing thông qua DTO Validation), thiết lập chuỗi test liên hoàn (Scenario Testing), và cấu hình Assertions để tự động hóa quy trình kiểm định chất lượng API của dự án.

---

## 1. Các Tầng Kiểm Thử API Căn Bản

Khi kiểm thử một API Endpoint (ví dụ: `/api/v1/auth/register`), chúng ta cần phân rã kịch bản kiểm thử thành 3 tầng phòng ngự chính:

### 1.1. Tầng 1: Xác Thực Dữ Liệu Đầu Vào (DTO Validation / Boundary Checks)

Đảm bảo API từ chối các dữ liệu không hợp lệ trước khi xử lý sâu trong hệ thống. Tầng này tập trung kiểm thử các ràng buộc khai báo trên DTO (như `@IsEmail`, `@MinLength`, `@Matches` trong NestJS):

- **Email:** Test các chuỗi trống, chuỗi không đúng định dạng email.
- **Số điện thoại:** Test độ dài ký tự (phải đúng 10 số), kiểm tra các đầu số di động hợp lệ (Việt Nam: `03`, `05`, `07`, `08`, `09`), lọc các ký tự chữ hoặc ký tự đặc biệt.
- **Mật khẩu:** Test độ mạnh của mật khẩu (độ dài $\ge 8$ ký tự, phải chứa ít nhất 1 chữ in hoa và 1 chữ số).
- **Logic quan hệ:** Xác nhận mật khẩu (`confirmPassword`) bắt buộc phải trùng khớp với mật khẩu.
- **Các ràng buộc nghiệp vụ cơ bản:** Bắt buộc phải tích chọn đồng ý điều khoản (`agreeTerms = true`).

### 1.2. Tầng 2: Kiểm Thử Nghiệp Vụ (Business Logic / State Check)

Kiểm thử cách API xử lý các ràng buộc nghiệp vụ trong cơ sở dữ liệu hoặc logic lưu trữ:

- **Tính duy nhất (Uniqueness):** Gửi yêu cầu đăng ký với một email hoặc số điện thoại đã tồn tại trong database hệ thống $\rightarrow$ Server phải ném ra lỗi `ConflictException` (HTTP Status 409).
- **Ranh giới bảo mật:** Đảm bảo mật khẩu lưu trong database được băm (hashing) thông qua thuật toán an toàn (`scrypt`) và không bị lộ nguyên bản (plain text).

### 1.3. Tầng 3: Kiểm Thử Liên Hoàn (Scenario/Integration Testing)

API không hoạt động độc lập mà nằm trong một luồng nghiệp vụ khép kín. Chúng ta cần thiết kế kịch bản liên chuỗi (Chaining Requests):

```
Đăng ký tài khoản (Register)
      │
      ▼
Quét mã / Nhận token kích hoạt từ email
      │
      ▼
Kích hoạt tài khoản (Verify Email)
      │
      ▼
Đăng nhập hệ thống (Login) ──► Nhận JWT Access Token & Refresh Token
      │
      ▼
Gọi các API được bảo vệ (Ví dụ: Đặt vé xem phim) bằng Access Token
```

---

## 2. Thiết Lập Kịch Bản Kiểm Thử Trên Apidog

Apidog cung cấp một giao diện trực quan hỗ trợ thực hiện toàn bộ quy trình trên mà không cần chuyển đổi công cụ.

### 2.1. Cấu Hình Biến Môi Trường (Environment Variables)

Để kịch bản chạy linh hoạt trên các môi trường Local, Dev, hay Staging, hãy cấu hình các biến môi trường trong Apidog:

- `BASE_URL`: Địa chỉ máy chủ (ví dụ: `http://localhost:3000/api/v1`).
- `test_email`, `test_phone`, `test_password`: Thông tin giả lập để chạy thử.
- `auth_token`: Lưu trữ JWT token sau khi đăng nhập thành công.

### 2.2. Viết Assertions Tự Động (Kiểm Định Phản Hồi)

Apidog hỗ trợ viết kiểm định phản hồi nhanh thông qua tab **Post-processors** bằng hai cách:

#### Cách 1: Sử dụng Visual Assertions (Không cần code)

Bạn có thể thêm các dòng Assert nhanh trên giao diện:

- **Response HTTP Status Code** `equals` `201` (đối với POST request tạo mới) hoặc `200` (đối với GET/POST cập nhật).
- **JSON Expression** `$.success` `equals` `true` (kiểm tra định dạng ApiResponse chuẩn của hệ thống).

#### Cách 2: Sử dụng Custom Script (JavaScript)

Nếu cần so sánh phức tạp hoặc kiểm tra Schema động:

```javascript
// Kiểm tra HTTP Status
pm.test("Status code is 201 Created", function () {
  pm.response.to.have.status(201);
});

// Parse dữ liệu Response JSON
const responseJson = pm.response.json();

// Kiểm định cấu trúc ApiResponse chuẩn
pm.test("Response matches API standard layout", function () {
  pm.expect(responseJson).to.have.property("success");
  pm.expect(responseJson.success).to.be.true;
  pm.expect(responseJson).to.have.property("data");
});
```

### 2.3. Trích Xuất Biến Tự Động (Extracting Variables)

Khi chạy luồng liên hoàn, ví dụ đăng nhập thành công và cần lấy JWT Token để gọi API đặt vé tiếp theo:
Trong API Đăng nhập, mở tab **Post-processors** $\rightarrow$ chọn **Extract Variable**:

- **Variable Name:** `access_token`
- **Source:** `Response JSON`
- **JSON Path Expression:** `$.data.accessToken` (hoặc cấu trúc tương ứng tùy thuộc vào response trả về).
- **Scope:** `Global` hoặc `Environment`.

---

## 3. Ví Dụ Kịch Bản Thực Tế (Concrete Examples)

Dưới đây là đặc tả bộ kịch bản kiểm thử API **Đăng ký tài khoản (Register API)** được cấu hình chi tiết trên Apidog:

### Request Spec: `POST /auth/register`

#### Payload 1: Đăng ký thành công (Happy Path)

```json
{
  "email": "customer@example.com",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0987654321",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "agreeTerms": true
}
```

- **Post-processor Assertions:**
  - HTTP Status Code: `201`
  - Response Body:

    ```json
    {
      "success": true,
      "data": null
    }
    ```

#### Payload 2: Lỗi DTO Validation (Email không hợp lệ)

```json
{
  "email": "invalid-email-format",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0987654321",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "agreeTerms": true
}
```

- **Post-processor Assertions:**
  - HTTP Status Code: `400` (Bad Request)
  - Response Message chứa: `"validation.isEmail"` hoặc nội dung tương ứng của hệ thống i18n.

#### Payload 3: Lỗi DTO Validation (Số điện thoại không đúng đầu số di động Việt Nam)

```json
{
  "email": "customer2@example.com",
  "fullName": "Nguyen Van A",
  "phoneNumber": "0243123456",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "agreeTerms": true
}
```

- **Phân tích:** Số điện thoại bắt đầu bằng `024` (Đầu số điện thoại cố định Hà Nội), vi phạm quy tắc chỉ chấp nhận đầu số di động di động (`03`, `05`, `07`, `08`, `09`).
- **Post-processor Assertions:**
  - HTTP Status Code: `400`
  - Response Message chứa lỗi vi phạm định dạng di động.

#### Payload 4: Lỗi Nghiệp Vụ (Trùng Email)

- **Thao tác:** Thực hiện gửi lại Payload 1 (đăng ký thành công lần trước) một lần nữa.
- **Post-processor Assertions:**
  - HTTP Status Code: `409` (Conflict)
  - Response Message chứa thông tin: `"auth.EMAIL_ALREADY_EXISTS"` hoặc thông báo bản dịch tiếng Việt tương đương `"Email này đã được sử dụng."`.

---

## 4. Tự Động Hóa Với Apidog Runner & CLI

### 4.1. Sử dụng tính năng "Automated Testing" trên giao diện

1. Chọn tab **Automated Testing** trong Apidog.
2. Tạo mới một **Test Scenario** (ví dụ: `Auth Flow Verification`).
3. Kéo thả các API Request theo thứ tự: `Register` $\rightarrow$ `Verify Email` $\rightarrow$ `Login` $\rightarrow$ `Get Profile`.
4. Bấm **Run** để hệ thống tự động thực hiện chuỗi test và xuất báo cáo kết quả chi tiết cho từng bước.

### 4.2. Chạy Tự Động Bằng Command Line (CI/CD Integration)

Apidog cho phép xuất cấu hình test scenario thành tệp cấu hình JSON và chạy thông qua **Apidog CLI**:

1. Cài đặt CLI:

   ```bash
   npm install -g apidog-cli
   ```

2. Thực thi kịch bản kiểm thử:

   ```bash
   apidog run ./test/api/collections/auth_flow_test_scenario.json -e ./test/api/environments/local_environment.json
   ```

   _Cờ `-e` chỉ định tệp cấu hình môi trường chứa biến `BASE_URL` cục bộ._

---

## Related Notes & MOC Backlinks

- Trang chủ dự án: [[000_Ticket_Booking_MOC]]
- Tích hợp Apidog trong dự án OMP: [[OMP_Apidog_Setup]]
- Hướng dẫn dùng Apidog MCP Server: [[Apidog_MCP]]
- Tìm hiểu các kịch bản kiểm thử bảo mật: [[Security_Testing_and_XSS_Prevention]]
- Xem cấu trúc logic kiểm thử Custom Validator Match: [[Custom_Validation_Constraint_Match]]
