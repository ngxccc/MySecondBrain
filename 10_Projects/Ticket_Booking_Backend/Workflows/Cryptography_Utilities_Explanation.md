---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Giai thich chi tiet tien ich ma hoa,
    Cryptography Utilities Explanation,
    Node.js scrypt timingSafeEqual,
    How password hashing works,
  ]
---

# Giải Thích Chi Tiết Tiện Ích Mã Hóa Mật Khẩu (Cryptography Utilities Explanation)

## TL;DR

Để làm việc hàng ngày, bạn **chỉ cần biết cách gọi** hai hàm `hashPassword(password)` và `comparePassword(password, hash)`. Tuy nhiên, để có **tư duy kỹ sư hệ thống (System Design/Security)**, hiểu rõ từng dòng code trong `crypto.util.ts` sẽ giúp bạn tự tin bảo vệ thiết kế bảo mật trước các đợt audit bảo mật và chuẩn bị tốt cho các câu hỏi phỏng vấn nâng cao.

---

## Giải Thích Chi Tiết Từng Dòng Code Trong `crypto.util.ts`

### 1. Khai báo và Chuyển đổi Bất đồng bộ (Async Utility Wrapper)

```typescript
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
```

- **`promisify(scrypt)`**:
  - Mặc định, hàm `scrypt` của Node.js sử dụng cơ chế gọi lại (Callback-based): `scrypt(password, salt, keylen, (err, derivedKey) => { ... })`.
  - Hàm `promisify` của Node.js giúp chuyển đổi hàm này thành một hàm trả về **Promise** (`scryptAsync`). Nhờ đó, chúng ta có thể sử dụng cú pháp `async/await` mượt mà, giữ cho code sạch sẽ và tránh tình trạng callback hell.

---

### 2. Hàm Mã Hóa Mật Khẩu (`hashPassword`)

Hàm này nhận mật khẩu thuần và tạo ra một chuỗi băm an toàn để lưu vào Database.

```typescript
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}
```

- **`randomBytes(16)`**: Sinh ra 16 bytes dữ liệu nhị phân ngẫu nhiên bảo mật cao (Cryptographically Secure Pseudo-Random Number Generator - CSPRNG).
- **`.toString("hex")`**: Chuyển đổi 16 bytes nhị phân thành chuỗi Hex có độ dài **32 ký tự**. Chuỗi Salt này sẽ được lưu cùng mật khẩu để dùng khi đối chiếu lúc đăng nhập.
- **`scryptAsync(password, salt, 64)`**:
  - Nhận vào `password`, `salt` đã sinh, và tham số **`64`** (đây là `keylen` - độ dài của khóa đầu ra).
  - Đầu ra sẽ là một khóa băm có độ dài **64 bytes** (tương đương 512 bits) - một độ dài khóa cực kỳ an toàn.
- **`as Buffer`**: Ép kiểu kết quả trả về của hàm `scryptAsync` thành kiểu `Buffer` để TypeScript hiểu được chúng ta đang thao tác với mảng byte nhị phân.
- **`return ${salt}:${derivedKey.toString("hex")}`**: Ghép chuỗi Salt (32 ký tự hex) và Khóa băm (128 ký tự hex) phân tách bằng dấu `:` tạo thành một chuỗi duy nhất dài 161 ký tự để lưu vào cột `passwordHash` của bảng `users`.

---

### 3. Hàm Đối Chiếu Mật Khẩu (`comparePassword`)

Hàm này đối chiếu mật khẩu người dùng nhập vào lúc đăng nhập với chuỗi hash đã lưu trong Database.

```typescript
export async function comparePassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");

  return timingSafeEqual(derivedKey, keyBuffer);
}
```

- **`storedHash.split(":")`**: Tách chuỗi lưu trong DB ra làm hai phần dựa vào dấu `:`. Lấy lại chuỗi `salt` gốc và chuỗi khóa băm mục tiêu (`key`).
- **`scryptAsync(password, salt, 64)`**: Thực hiện băm lại `password` do người dùng nhập vào bằng đúng chuỗi `salt` lấy từ DB, với cùng độ dài đầu ra là 64 bytes.
- **`Buffer.from(key, "hex")`**: Chuyển đổi chuỗi băm mục tiêu lấy từ DB từ dạng hex ngược lại thành đối tượng `Buffer` (mảng byte nhị phân).
- **`timingSafeEqual(derivedKey, keyBuffer)`**:
  - So sánh hai đối tượng `Buffer` nhị phân có cùng độ dài (64 bytes).
  - **Tại sao không dùng `===`?** Phép toán `===` sẽ dừng lại ngay khi phát hiện byte đầu tiên khác nhau (Short-circuit). Tin tặc có thể đo thời gian xử lý để đoán chuỗi băm. Hàm `timingSafeEqual` sẽ luôn chạy qua toàn bộ 64 bytes bất kể có khớp hay không để thời gian xử lý luôn luôn không đổi (Constant-time comparison), ngăn chặn hoàn toàn lỗ hổng bảo mật **Timing Attack**.

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Cẩm nang kiểm thử bảo mật & XSS: [[Security_Testing_and_XSS_Prevention]]
- Quy chuẩn lập trình Drizzle ORM: [[Drizzle_v1_RC4_Coding_Standards]]
