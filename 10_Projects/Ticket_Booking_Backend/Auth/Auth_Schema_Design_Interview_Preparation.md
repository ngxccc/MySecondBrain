# Cẩm Nang Phỏng Vấn: Thiết Kế Auth Schema Cho Hệ Thống Đặt Vé

Tài liệu này ghi lại các bài học thiết kế, lý do đưa ra quyết định kiến trúc (Design Decisions), và các kiến thức cốt lõi về cơ sở dữ liệu dùng để chuẩn bị cho phỏng vấn hệ thống đặt vé xem phim/sự kiện tải cao.

---

## 1. Quyết định kiến trúc & Schema Design (Design Decisions)

### Quyết định 1: Chọn Mô Hình Unified User Schema (Bảng đơn) Thay Vì Phân Tách Nhiều Bảng

- **Lý do chọn:** Đối với hệ thống quy mô vừa và nhỏ, việc sử dụng 1 bảng `users` chứa cả thông tin đăng ký truyền thống (local) và các cột ID mạng xã hội (`google_id`, `facebook_id`) giúp tối giản hóa cấu trúc dữ liệu.
- **Điểm phỏng vấn cần nhấn mạnh:**
  - Giảm thiểu chi phí `JOIN` hoặc truy vấn con (subquery) khi thực hiện đăng nhập và lấy thông tin profile của người dùng.
  - Tối ưu hóa tài nguyên phần cứng bằng cách giữ số lượng bảng ít hơn, đơn giản hóa việc bảo trì mã nguồn (code maintenance).
  - **Quản lý JWT Refresh Token:** Để hỗ trợ luồng Refresh Token (Gia hạn / Thu hồi / Rotation) mà vẫn giữ kiến trúc Single-Table đơn giản, ta lưu trực tiếp `refreshTokenHash` vào bảng `users`. Khi user Logout hoặc đổi mật khẩu, ta chỉ việc xóa/cập nhật trường này về `null` thay vì phải duy trì cả một bảng Session phụ tốn tài nguyên truy vấn.
  - _Trade-off (Sự đánh đổi):_ Nếu sau này hệ thống mở rộng hỗ trợ thêm nhiều nhà cung cấp OAuth khác (Apple, Github, Discord...), chúng ta bắt buộc phải chạy migration để bổ sung thêm cột vào bảng chính thay vì chỉ chèn dữ liệu động như mô hình tách bảng (Separated Auth Providers).

### Quyết định 2: Loại Bỏ Bảng Địa Chỉ Người Dùng (`user-addresses`)

- **Lý do:** Đây là hệ thống đặt vé xem phim/sự kiện trực tuyến (Movie & Event Ticket Booking). Vé sau khi đặt thành công sẽ được xuất dưới dạng mã trực tuyến (QR code, SMS OTP).
- **Điểm phỏng vấn cần nhấn mạnh:**
  - Áp dụng triệt để nguyên lý **YAGNI (You Aren't Gonna Need It)**. Tránh việc thiết kế thừa thãi (Over-engineering), tập trung vào các trường dữ liệu thiết yếu phục vụ nghiệp vụ cốt lõi.
  - Thay vì lưu địa chỉ, bảng `users` cần ưu tiên trường `phoneNumber` để tích hợp với dịch vụ viễn thông (Twilio/Brandname SMS) nhằm gửi trực tiếp thông tin vé qua SMS.

---

## 2. Điểm Nhấn Tối Ưu Hóa Database (Database Performance Bullet Points)

### Sử Dụng Thư Viện UUIDv7 Làm Khóa Chính Phía Client

- **Lý do chọn:** Kể từ phiên bản `10.0.0` (sau khi RFC 9562 chuẩn hóa), thư viện tiêu chuẩn `uuid` trên npm đã chính thức hỗ trợ **UUIDv7** gốc. Việc dùng UUIDv7 mang lại tính chất **Time-sortable (Sắp xếp theo thời gian)**, giải quyết triệt để vấn đề phân mảnh trang (page fragmentation) trong PostgreSQL B-Tree Index khi lượng ghi tải lớn, đồng thời không tự cài đặt cơ chế sinh ID thủ công để dễ bảo trì.
- **Lợi ích phỏng vấn:**
  - Đảm bảo tính tin cậy tuyệt đối, tuân thủ đặc tả chuẩn RFC 9562 của IETF.
  - Tốc độ chèn ghi tương đương số tự tăng nhưng vẫn giữ được tính chất bảo mật của UUID.

### Timezone-Aware Timestamps (`timestamptz`)

- **Lý do:** Hệ thống luôn sử dụng `timestamp with time zone` cho các trường audit dữ liệu (`created_at`, `updated_at`) để tránh các xung đột lệch múi giờ giữa máy chủ ứng dụng, database và client ở các khu vực khác nhau.

---

## 3. Cấu Trúc File Modular Trong Drizzle ORM

Hệ thống tuân thủ cấu trúc thư mục modular sạch để chuẩn bị tích hợp với Drizzle Kit:

```text
src/database/schemas/
  ├── helpers.schema.ts   # baseEntity tích hợp uuidv7 từ thư viện uuid
  ├── auth.schema.ts      # Bảng Users (Email/Password + Social OAuth)
  ├── relations.ts        # Quản lý quan hệ (relations) tập trung của Drizzle
  └── index.ts            # Barrel file export toàn bộ bảng phục vụ Drizzle Kit
```
