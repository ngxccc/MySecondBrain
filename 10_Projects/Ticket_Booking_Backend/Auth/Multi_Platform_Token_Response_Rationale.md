---
tags: [type/concept, topic/security, status/permanent]
date: 2026-07-17
aliases: [Thiết kế API hai Token, Multi-Platform Dual-Token Response Rationale]
---

# Kiến Trúc Trả Về Hai Token Cho Nhiều Nền Tảng Và Phân Tích Bảo Mật

## TL;DR

Tài liệu này giải thích lý do kiến trúc lựa chọn trả về cả `accessToken` và `refreshToken` trực tiếp trong JSON response body cho mục đích hỗ trợ đa nền tảng (Web, Mobile). Đồng thời phân tích các giải pháp bảo mật nhiều lớp đã triển khai bao gồm xoay vòng token (RTR), băm Refresh Token, triệt tiêu rò rỉ và timing-safe verification.

---

## 1. Lý Do Thiết Kế Trả Về Cả Hai Token Qua JSON

Hệ thống đặt vé được định hướng thiết kế để phục vụ **nhiều nền tảng cùng lúc (Multi-Platform)** bao gồm: Web client (React/Next.js), Mobile App (iOS/Android native hoặc hybrid như React Native, Flutter), và các API client tích hợp từ bên thứ ba.

### Đánh giá các phương án truyền tải:

| Đặc tính                | Lưu qua HttpOnly Cookie                           | Trả về qua JSON Body (Hiện tại)               |
| :---------------------- | :------------------------------------------------ | :-------------------------------------------- |
| **Hỗ trợ Web Browser**  | Tốt nhất (Trình duyệt tự quản lý)                 | Tốt (Frontend tự lưu trữ)                     |
| **Hỗ trợ Mobile App**   | Kém (Mobile không tự động quản lý cookie/headers) | Tốt nhất (Dễ lưu vào Secure Store/Keychain)   |
| **Tích hợp bên thứ ba** | Phức tạp (CORS, SameSite rules)                   | Rất đơn giản (Chuẩn REST tiêu chuẩn)          |
| **Xử lý Cross-Domain**  | Khó khăn (Đòi hỏi domain/subdomain đồng bộ)       | Dễ dàng (Không bị giới hạn bởi cookie domain) |

**Kết luận:** Để duy trì một bộ API thống nhất, đơn giản và hỗ trợ đa nền tảng một cách tự nhiên nhất, chúng tôi chọn trả về cặp token trong JSON body.

---

## 2. Phân Tích Các Lớp Bảo Mật Đã Triển Khai (Security Audit)

Để bù đắp cho rủi ro rò rỉ token ở phía client (đặc biệt là tấn công XSS trên trình duyệt web khi lưu trữ trong `localStorage`), hệ thống đã triển khai các lớp bảo mật cực kỳ nghiêm ngặt cả ở mức cơ sở dữ liệu, mã hóa, và lọc dữ liệu đầu ra:

### Lớp 1: Xoay vòng Refresh Token (Refresh Token Rotation - RTR)

- **Chi tiết:** Khi client gửi Refresh Token cũ lên để đổi lấy Access Token mới, hệ thống ngay lập tức thực hiện truy vấn và **xóa bản ghi token cũ khỏi cơ sở dữ liệu** (`db.delete(refreshTokens)`).
- **Mục đích:** Đảm bảo mỗi Refresh Token chỉ được sử dụng đúng một lần duy nhất (Single-Use). Nếu kẻ tấn công đánh cắp được token cũ, token đó đã bị thu hồi/xóa khỏi DB và hoàn toàn vô tác dụng, đồng thời phát hiện bất thường nếu token đã được tái sử dụng.

### Lớp 2: Mã hóa một chiều Refresh Token (Token Hashing)

- **Chi tiết:** Chúng tôi không lưu trữ Refresh Token dưới dạng văn bản thô (plaintext) trong database. Thay vào đó, token thô (64 ký tự hex ngẫu nhiên được sinh từ CSPRNG `crypto.randomBytes(32)`) sẽ được băm bằng thuật toán **SHA-256** (`sha256(token)`) rồi mới lưu vào cột `token_hash` của bảng `refresh_tokens`.
- **Mục đích:** Chống rò rỉ token khi database bị hack. Kẻ tấn công có được dữ liệu băm SHA-256 cũng không thể dịch ngược ra refresh token thô để sử dụng.

### Lớp 3: Triệt tiêu rò rỉ dữ liệu nhạy cảm ở đầu ra (Zero Data Leakage)

- **Chi tiết:** Trong file cấu hình chính `src/main.ts`, chúng tôi cấu hình `validationError: { target: false, value: false }` cho `I18nValidationPipe` kết hợp định dạng Exception Filter gọn gàng.
- **Mục đích:** Loại bỏ hoàn toàn khả năng rò rỉ mật khẩu thô và cấu trúc request trong các lỗi kiểm tra đầu vào (validation errors), đảm bảo không ghi lại mật khẩu của người dùng vào log hệ thống hoặc trả về client.

### Lớp 4: Cơ chế băm mật khẩu cực kỳ an toàn (Scrypt & Timing-Safe Equal)

- **Chi tiết:**
  - Mật khẩu được băm bằng thuật toán **Scrypt** (sử dụng muối ngẫu nhiên 16-byte sinh từ CSPRNG).
  - Quá trình so khớp mật khẩu sử dụng hàm **`timingSafeEqual`** từ thư viện `node:crypto`.
- **Mục đích:** Ngăn ngừa tấn công brute-force mật khẩu thô và triệt tiêu hoàn toàn nguy cơ tấn công kênh kề qua thời gian đáp ứng (Timing Attacks).

---

## 3. Đối Chiếu Với Tiêu Chuẩn Bảo Mật Quốc Tế (OWASP & Industry Standards)

Dựa trên các nghiên cứu về tiêu chuẩn bảo mật của **OWASP ASVS (Application Security Verification Standard)** và các mô hình quản lý token của Auth0, Supabase:

1.  **OWASP ASVS V4.0.3 (Mục 3.5 - Token-Based Session Management):** Khuyến nghị rằng nếu token được lưu trữ ở phía client bên ngoài Cookie (như `localStorage`), hệ thống **bắt buộc phải triển khai cơ chế Xoay vòng Token (Rotation) và giới hạn thời gian sống (TTL) ngắn**. Cơ chế xoay vòng một lần (Single-Use RTR) của chúng tôi hoàn toàn thỏa mãn tiêu chuẩn này.
2.  **Chống rò rỉ DB:** Việc băm SHA-256 refresh token trong cơ sở dữ liệu thỏa mãn các khuyến nghị về mã hóa lưu trữ thông tin nhận dạng phiên làm việc bảo mật.

Hệ thống hiện tại đã đạt độ bảo mật thực tế **rất cao và an toàn**, sẵn sàng vận hành ổn định trên nhiều nền tảng client khác nhau.

## Related Notes

- [[000_Ticket_Booking_MOC]]
- [[Login_User_Workflow]]
