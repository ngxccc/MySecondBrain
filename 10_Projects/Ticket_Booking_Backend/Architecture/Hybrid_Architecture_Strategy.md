---
tags: [type/concept, topic/tech, status/permanent]
date: 2026-07-05
aliases:
  [
    Kiến trúc Đa giao thức REST GraphQL WebSockets,
    Hybrid Architecture Strategy,
    Multi-Protocol Architecture NestJS,
  ]
---

# Chiến Lược Kiến Trúc Đa Giao Thức (Hybrid Architecture: REST + GraphQL + WebSockets)

## TL;DR

Tài liệu này trình bày thiết kế kiến trúc đa giao thức (Multi-Protocol / Hybrid Architecture) cho hệ thống Đặt vé xem phim (Ticket Booking) bằng NestJS. Kiến trúc cho phép phân chia giao thức linh hoạt theo từng module nghiệp vụ chuyên biệt: **REST API** (Auth & Payments), **GraphQL** (Duyệt phim & Catalog), và **WebSockets** (Sơ đồ chọn ghế real-time) mà vẫn dùng chung 100% Core Business Services và Drizzle Data Layer bên dưới.

---

## Sơ Đồ Kiến Trúc Hệ Thống (ASCII Box Diagram)

```text
 ┌────────────────────────┐
 │                        │
 │  Web / Mobile Client   │
 │                        │
 └────────────────────────┘
              │
              │
              ├──────────────────────────┬───────────────────────────┐
              │                          │                           │
              ▼                          ▼                           ▼
 ┌────────────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
 │                        │     │                 │     │                         │
 │     REST API Layer     │     │  GraphQL Layer  ├──┐  │ WebSocket Gateway Layer ├────────────────────────┐
 │                        │     │                 │  │  │                         │                        │
 └────────────────────────┘     └─────────────────┘  │  └─────────────────────────┘                        │
              │                                      │                                                     │
              │                                      │                                                     │
              ├──────────────────────────┐           └───────────────┐                                     │
              │                          │                           │                                     │
              ▼                          ▼                           ▼                                     ▼
 ┌────────────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐     ┌────────────────────────────────────┐
 │                        │     │                 │     │                         │     │                                    │
 │      Auth Module       │     │ Payments Module │     │ Movies & Catalog Module │     │ Seat Booking & Real-time Seat Grid │
 │                        │     │                 │     │                         │     │                                    │
 └────────────┬───────────┘     └────────┬────────┘     └────────────┬────────────┘     └──────────────────┬─────────────────┘
              │                          │                           │                                     │
              │                          │                           │                                     │
              ├──────────────────────────┴───────────────────────────┴─────────────────────────────────────┘
              │
              ▼
 ┌────────────────────────┐
 │                        │
 │ Core Business Services │
 │                        │
 └────────────────────────┘
              │
              │
              ├──────────────────────────┐
              │                          │
              │                          │
              ▼                          ▼
 ╭────────────────────────╮     ╭─────────────────╮
 │                        │     │                 │
 │       PostgreSQL       │     │  Redis & BullMQ │
 │                        │     │                 │
 │                        │     │                 │
 ╰────────────────────────╯     ╰─────────────────╯
```

---

## Core Concept & Module Protocol Breakdown

### 1. REST API Layer

- **Modules:** `AuthModule`, `PaymentsModule`, `AdminModule`.
- **Lý do áp dụng:**
  - **Auth & Payments** yêu cầu độ bảo mật cao, dễ dàng tích hợp Webhook từ các cổng thanh toán (VNPay, ZaloPay, Stripe) - vốn 100% sử dụng HTTP POST Callbacks.
  - Tận dụng cơ chế Caching và Rate-Limiting tốt ở tầng Reverse Proxy (Caddy / Nginx).

### 2. GraphQL Layer

- **Modules:** `MoviesModule`, `CinemasModule`, `ShowsModule`.
- **Lý do áp dụng:**
  - Trang chủ và danh mục sản phẩm phục vụ nhiều thiết bị khác nhau (Web, Mobile App, Smart TV).
  - Tránh **Over-fetching** và **Under-fetching**: Client chủ động query đúng các trường dữ liệu cần hiển thị (ví dụ: chỉ lấy `title` và `posterUrl` trên mobile, nhưng lấy thêm `cast`, `trailer` trên desktop).

### 3. WebSocket Gateway Layer

- **Modules:** `BookingsModule` (Sơ đồ ghế giữ chỗ real-time).
- **Lý do áp dụng:**
  - Thao tác chọn ghế cần tương tác hai chiều real-time độ trễ cực thấp (<100ms). Khi User A vừa click ghế E5, toàn bộ các user khác đang xem sơ đồ cùng phòng lập tức nhận event cập nhật.
  - Kết hợp với **Redis Pub/Sub Adapter** giúp mở rộng (scale) sơ đồ real-time khi chịu tải hàng ngàn kết nối đồng thời.

---

## Triển Khai Trong NestJS (Implementation Strategy)

NestJS tách biệt hoàn toàn giữa Transport Layer (Controller / Resolver / Gateway) và Domain Logic Layer (Services). Do đó, cùng 1 Service có thể phục vụ cả 3 giao thức:

```typescript
// Core Service dùng chung
@Injectable()
export class SeatsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: DrizzleDB) {}

  async reserveSeat(showId: string, seatId: string, userId: string) {
    // Business Logic & Distributed Lock
  }
}

// 1. REST Controller (HTTP POST)
@Controller("seats")
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Post("reserve")
  reserve(@Body() dto: ReserveSeatDto) {
    return this.seatsService.reserveSeat(dto.showId, dto.seatId, dto.userId);
  }
}

// 2. WebSocket Gateway (Real-time Event)
@WebSocketGateway({ namespace: "seats" })
export class SeatsGateway {
  constructor(private readonly seatsService: SeatsService) {}

  @SubscribeMessage("select_seat")
  async handleSelectSeat(@MessageBody() data: any) {
    await this.seatsService.reserveSeat(data.showId, data.seatId, data.userId);
    this.server.emit("seat_updated", data);
  }
}
```

---

## Related Notes & MOC Backlinks

- Thư mục MOC: [[000_Ticket_Booking_MOC]]
- Đặc tả kiến trúc hệ thống: [[Architecture_and_Spec]]
- Phân tách Auth WBS: [[Auth_WBS_Deconstruction]]
