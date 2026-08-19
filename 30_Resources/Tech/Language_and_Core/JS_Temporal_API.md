---
tags: [type/concept, topic/tech, topic/javascript, layer/core-mechanics]
date: 2026-06-24
aliases: [Temporal API, JS Temporal API, API xử lý thời gian mới của JavaScript]
description: "API xử lý ngày giờ thế hệ mới chính thức của JavaScript (ECMAScript 2026)."
---

# JS Temporal API

## TL;DR

Temporal API là API xử lý ngày giờ thế hệ mới chính thức của JavaScript (đạt Stage 4 và là một phần của ECMAScript 2026). Nó được thiết kế để thay thế hoàn toàn đối tượng `Date` cũ vốn nổi tiếng với thiết kế lỗi thời, đột biến (mutable) dễ gây bug, và tháng đánh số từ 0. Temporal cung cấp các thực thể bất biến (immutable), chia nhỏ kiểu dữ liệu chuyên biệt (PlainDate, ZonedDateTime, Duration) và hỗ trợ múi giờ IANA cấp độ một.

---

## Core Concept

### 1. Tại Sao Đối Tượng `Date` Cũ Lại Bị Chê?

- **Tính Đột Biến (Mutability):** Các phương thức của `Date` thay đổi trực tiếp giá trị của đối tượng gốc (ví dụ: `date.setMonth(5)`), dẫn đến các bug khó dò khi chia sẻ đối tượng ngày giờ giữa các hàm.
- **Tháng Đánh Số Từ 0 (0-indexed Months):** Trong `Date`, tháng 1 được biểu diễn bằng số `0`, gây khó hiểu và nhầm lẫn liên tục cho nhà phát triển.
- **Không Hỗ Trợ Múi Giờ (Poor Time Zone Support):** `Date` chỉ hiểu hai múi giờ là UTC và múi giờ cục bộ của thiết bị (Local). Nó không hỗ trợ việc tính toán múi giờ IANA cụ thể (như `Asia/Ho_Chi_Minh` vs `Europe/Paris`) hoặc tự động xử lý giờ mùa hè (DST - Daylight Saving Time).
- **Độ Chính Xác Thấp:** Chỉ hỗ trợ độ chính xác đến mili giây (milliseconds).

### 2. Các Cải Tiến Cốt Lõi Của Temporal API

- **Bất Biến (Immutable):** Tất cả các đối tượng Temporal là read-only. Bất kỳ phép tính toán cộng, trừ hay sửa đổi nào đều trả về một thực thể mới hoàn toàn.
- **Tháng Đánh Số Từ 1 (1-indexed Months):** Tháng 1 tương ứng với số `1`, tháng 12 tương ứng với số `12` – khớp 100% với tư duy thực tế của con người.
- **Độ Chính Xác Cao:** Hỗ trợ độ chính xác đến nano giây (nanoseconds).
- **Múi Giờ IANA Cấp Độ Một:** Hỗ trợ đầy đủ và an toàn tất cả các múi giờ thế giới và tự động điều chỉnh DST.
- **Phân Tách Kiểu Dữ Liệu Chuyên Biệt:** Thay vì một Class gánh vác mọi nhiệm vụ, Temporal chia làm nhiều thực thể khác nhau để tránh mập mờ nghiệp vụ.

---

## Practical Implementation

### 1. Bản Đồ Các Kiểu Dữ Liệu Trong Temporal

- **`Temporal.Instant`**: Biểu diễn một khoảnh khắc chính xác trên dòng thời gian (UTC), không quan tâm múi giờ cục bộ.
- **`Temporal.PlainDate`**: Chỉ lưu trữ Ngày/Tháng/Năm (không có Giờ và không có Múi giờ), rất thích hợp lưu trữ ngày sinh nhật, ngày lễ.
- **`Temporal.PlainTime`**: Chỉ lưu trữ Giờ/Phút/Giây/Nano giây (không có Ngày, không có Múi giờ).
- **`Temporal.PlainDateTime`**: Kết hợp của PlainDate và PlainTime.
- **`Temporal.ZonedDateTime`**: Một khoảnh khắc đầy đủ chứa cả Ngày, Giờ và Múi giờ cụ thể (DST-safe).
- **`Temporal.Duration`**: Biểu diễn một khoảng thời gian (ví dụ: 5 ngày, 3 giờ, 10 phút) dùng trong tính toán số học.

---

### 2. Các Ví Dụ Code Thực Tế

#### A. Lấy Thời Gian Hiện Tại

```javascript
// Lấy ngày hiện tại cục bộ (PlainDate)
const today = Temporal.Now.plainDateISO();
console.log(today.toString()); // "2026-06-24"

// Lấy khoảnh khắc hiện tại (UTC Instant)
const instant = Temporal.Now.instant();
console.log(instant.toString()); // "2026-06-24T12:00:00.123456789Z"

// Lấy thời gian hiện tại của một múi giờ cụ thể (ZonedDateTime)
const tokyoTime = Temporal.Now.zonedDateTimeISO("Asia/Tokyo");
console.log(tokyoTime.toString()); // "2026-06-24T21:00:00.123456789+09:00[Asia/Tokyo]"
```

#### B. Phép Toán Cộng Trừ & So Sánh Thời Gian

```javascript
const birthDay = Temporal.PlainDate.from("2026-06-24");

// Cộng thêm 3 tháng và 10 ngày (Trả về đối tượng mới, không sửa đối tượng cũ)
const futureDate = birthDay.add({ months: 3, days: 10 });
console.log(futureDate.toString()); // "2026-10-04"

// Tính toán khoảng cách giữa 2 ngày
const newYear = Temporal.PlainDate.from("2027-01-01");
const duration = birthDay.until(newYear);
console.log(duration.days); // Số ngày còn lại từ hôm nay đến năm mới

// So sánh
const compareResult = Temporal.PlainDate.compare(birthDay, futureDate); // Trả về -1 (ngày trước < ngày sau)
```

---

### 3. Bảng So Sánh Legacy `Date` vs `Temporal`

| Đặc tính                | Legacy `Date`                   | `Temporal`                                 |
| :---------------------- | :------------------------------ | :----------------------------------------- |
| **Tính đột biến**       | Mutable (Thay đổi tại chỗ)      | Immutable (Bất biến)                       |
| **Độ đánh số tháng**    | 0-indexed (Tháng 1 = 0)         | 1-indexed (Tháng 1 = 1)                    |
| **Hỗ trợ múi giờ**      | Rất tệ (Chỉ có Local và UTC)    | Tuyệt vời (Hỗ trợ IANA)                    |
| **Phép toán thời gian** | Phải tự tính toán qua timestamp | Có sẵn `.add()`, `.subtract()`, `.until()` |
| **Độ chính xác**        | Mili giây (ms)                  | Nano giây (ns)                             |

---

### 4. Mẫu Câu Hỏi Phỏng Vấn

**Q: Temporal API giải quyết những vấn đề gì của đối tượng Date truyền thống trong Javascript? Bạn sẽ sử dụng nó thế nào trong dự án hiện nay?**

**A:**

- Temporal giải quyết triệt để 3 vấn đề lớn của `Date`: tính đột biến (mutability) dễ gây side-effect, cơ chế đánh số tháng từ 0 thiếu tự nhiên, và sự thiếu hụt hỗ trợ múi giờ IANA/DST. Temporal mang lại thiết kế bất biến (immutability), tháng 1-indexed, độ chính xác nano giây và phân tách kiểu dữ liệu rất tường minh (như `PlainDate` cho ngày sinh nhật hay `ZonedDateTime` cho lịch hẹn).
- Hiện tại (năm 2026), mặc dù các trình duyệt hiện đại đã hỗ trợ gốc, đối với các dự án production phục vụ khách hàng trên diện rộng, em sẽ sử dụng kết hợp với thư viện polyfill `@js-temporal/polyfill` để đảm bảo ứng dụng chạy mượt mà trên cả các thiết bị hoặc môi trường Node.js/Bun cũ hơn.

---

## Related Notes

- [[000_Tech_MOC]]
- [[JS_Stack_vs_Heap_Memory]]
- [[TS_Decorators]]
- [[JS_Runtimes_Bun_vs_NodeJS]]
