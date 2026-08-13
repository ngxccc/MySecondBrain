---
title: Database Payment Design in Hyundai Ecommerce
tags: [type/concept, topic/database, project/hyundai-ecommerce]
created: 2026-06-20
---

# Database Payment Design in Hyundai Ecommerce

## TL;DR

Trong dự án Hyundai Ecommerce, hệ thống phân tách việc quản lý thanh toán thành 2 bảng: `payment` (lưu yêu cầu thanh toán tổng thể) và `payment_transaction` (lưu từng giao dịch/lần thử thanh toán thực tế). Cả hai bảng này đều tham chiếu trực tiếp đến khóa chính của bảng `orders` (Star Schema) thay vì phân cấp lồng nhau. Thiết kế này giúp hỗ trợ thanh toán nhiều đợt (Đặt cọc 20% & Thanh toán nợ 80%), lưu vết lịch sử giao dịch lỗi (Audit Trail), tối ưu hóa tốc độ xử lý Webhook từ cổng thanh toán (PayOS), và đơn giản hóa các câu lệnh truy vấn dữ liệu từ Aggregate Root (`orders`).

---

## Core Concept

### 1. Tại sao cần tách làm 2 bảng (`payments` và `payment_transactions`)?

- **Hỗ trợ thanh toán nhiều đợt (B2B Multi-step Payment / Split Payment):**
  Trong nghiệp vụ B2B, khách hàng mua máy phát điện thường không thanh toán 100% ngay lập tức mà thực hiện theo đợt (ví dụ: Đặt cọc 20% khi chốt đơn, thanh toán nợ 80% khi nhận hàng).
  - Bảng `payments` lưu thông tin tổng quan về nghĩa vụ thanh toán của đơn hàng (Tổng tiền cần trả, phương thức thanh toán dự kiến, trạng thái thanh toán tổng thể của đơn hàng).
  - Bảng `payment_transactions` lưu các giao dịch thực tế đi vào hệ thống. Một đơn hàng có thể có nhiều giao dịch thành công ứng với các đợt thanh toán khác nhau.
- **Lưu lịch sử giao dịch lỗi & Thử lại (Retry & Audit Trail):**
  Người dùng online rất hay gặp lỗi khi thanh toán (hết hạn link, lỗi số dư, hủy giao dịch giữa chừng).
  - Lần 1: Người dùng ấn thanh toán -> Giao dịch thất bại. Hệ thống tạo một bản ghi `payment_transaction` với trạng thái `FAILED`.
  - Lần 2: Người dùng chọn thanh toán lại -> Thành công. Hệ thống tạo thêm một bản ghi `payment_transaction` trạng thái `SUCCESS`.
  - Việc tách bảng giúp hệ thống lưu giữ toàn bộ vết giao dịch để đối soát với ngân hàng/cổng thanh toán khi có tranh chấp, mà không làm trùng lặp thông tin yêu cầu thanh toán tổng thể hay ghi đè mất dữ liệu lịch sử.
- **Đảm bảo tính bất biến (Idempotency):**
  Các bản ghi `payment_transaction` đóng vai trò như các dòng tiền thực tế đi vào tài khoản, mang tính chất bất biến (không thay đổi số tiền hay mã giao dịch sau khi thành công) để đảm bảo tính an toàn cho hệ thống kế toán.

### 2. Tại sao cả hai bảng đều tham chiếu trực tiếp đến `orders.id`?

- **Đơn hàng (`orders`) là Aggregate Root:**
  Mọi luồng dữ liệu của thanh toán, vận chuyển hay chi tiết sản phẩm đều xoay quanh đơn hàng. Việc liên kết phẳng trực tiếp vào `orders.id` giúp Drizzle ORM có thể dễ dàng truy vấn toàn bộ thông tin chỉ với 1 câu lệnh ngắn mà không cần JOIN bắc cầu qua nhiều tầng lớp (`orders` -> `payments` -> `payment_transactions`).
- **Tối ưu hóa hiệu năng xử lý Webhook:**
  Các cổng thanh toán (như PayOS) khi gửi Webhook báo thành công chỉ truyền về mã đơn hàng (`orderId` hoặc `orderCode`) mà hoàn toàn không biết mã yêu cầu thanh toán (`paymentId`) của chúng ta. Nếu thiết kế phân cấp, hệ thống sẽ phải mất thêm 1 câu lệnh SELECT tìm `paymentId` trước khi INSERT transaction mới. Ràng buộc trực tiếp tới `orderId` giúp hệ thống thực hiện ghi nhận giao dịch ngay lập tức, tránh nghẽn cổ chai (bottleneck) khi có hàng ngàn giao dịch đồng thời.

---

### 3. Vấn đề Retry vs. Expiration Lifecycle (Độ độc lập của trạng thái)

- **Khi giao dịch thất bại (Transaction FAILED) thì đơn hàng có bị huỷ không?**
  Không. Trạng thái thất bại chỉ áp dụng cho chính `payment_transaction` cụ thể đó (ví dụ: người dùng hủy liên kết thanh toán PayOS trong `cancelOrderPaymentLinkAction`). Việc này giữ cho bảng `payment` tổng thể và `orders` vẫn ở trạng thái `PENDING` và `UNPAID`. Người dùng có thể quay lại lịch sử mua hàng để nhấn "Thanh toán lại" và tạo một transaction mới.
- **Vai trò của Cron Job (15-minute Expiration Worker):**
  Cron job chạy ngầm sẽ kiểm tra đơn hàng có `status = 'PENDING'` và `paymentStatus = 'UNPAID'` có `createdAt` vượt quá 15 phút.
  - Nếu hết 15 phút mà không có giao dịch nào thành công: Cron job sẽ chuyển `order.status = 'CANCELLED'`, đồng thời đánh dấu `payment.status = 'FAILED'` và toàn bộ các `payment_transactions` còn đang `PENDING` của đơn hàng đó thành `FAILED`. Lúc này đơn hàng bị hủy vĩnh viễn và người dùng không thể tạo link thanh toán mới.
  - Nếu người dùng đã thanh toán cọc thành công (ví dụ ở phút thứ 10): Trạng thái đơn hàng đổi thành `DEPOSIT_PAID` (không còn là `UNPAID`). Khi đó, Cron job sẽ bỏ qua đơn hàng này, đảm bảo đơn hàng không bị hủy nhầm.

## Practical Implementation

### 1. Kịch bản thanh toán Đặt cọc 20% - Trả nợ 80%

Giả sử đơn hàng có ID `order-abc` trị giá **10,000,000 VND**.

- **Bảng `payment` (1 bản ghi tổng):**
  - `id`: `pay-111`
  - `orderId`: `order-abc`
  - `amount`: `10000000.00`
  - `status`: `PENDING`

- **Bảng `payment_transaction` (Các giao dịch thực tế):**
  - **Lần 1 (Đặt cọc 20% thành công):**
    - `id`: `tx-001`
    - `orderId`: `order-abc`
    - `amount`: `2000000.00`
    - `transactionType`: `DEPOSIT`
    - `status`: `SUCCESS`
  - **Lần 2 (Thanh toán 80% còn lại thành công):**
    - `id`: `tx-002`
    - `orderId`: `order-abc`
    - `amount`: `8000000.00`
    - `transactionType`: `REMAINDER`
    - `status`: `SUCCESS`

  _(Sau khi `tx-002` thành công, hệ thống đối soát thấy tổng tiền các transaction SUCCESS đã đạt 10,000,000 VND và tự động cập nhật trạng thái bảng `payment` thành `COMPLETED` và `order.paymentStatus` thành `FULLY_PAID`)._

### 2. Truy vấn dữ liệu phẳng trực quan bằng Drizzle ORM

```typescript
const orderDetails = await db.query.orders.findFirst({
  where: eq(orders.id, "order-abc"),
  with: {
    payments: true, // Lấy thông tin thanh toán tổng quan
    transactions: true, // Lấy danh sách lịch sử giao dịch thực tế
  },
});

console.log("Tổng tiền cần thanh toán:", orderDetails.payments[0].amount);
console.log("Số lần giao dịch thực tế:", orderDetails.transactions.length);
```

---

## Related Notes

- `[[000_Hyundai_MOC]]` - Bản đồ học tập và quản lý dự án Hyundai Ecommerce.
- `[[000_System_Structure]]` - Quy tắc quản lý thư mục kiến thức PARA.
