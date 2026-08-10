---
tags:
  [
    type/concept,
    topic/tech,
    api-data-design,
    status/permanent,
    layer/architecture,
  ]
date: 2026-06-27
aliases: [Outbox Pattern, Transactional Outbox, Mẫu thiết kế Outbox]
description: "Mẫu thiết kế xử lý Dual-Write tin cậy bằng bảng Outbox và Worker."
---

# Outbox Pattern

## TL;DR

**Transactional Outbox Pattern** là giải pháp giải quyết triệt để bài toán **Dual-Write** (ghi dữ liệu vào DB và phát sự kiện ra hệ thống bên ngoài). Bằng cách lưu trữ các sự kiện cần phát đi trực tiếp vào một bảng `outbox` trong cùng một Transaction ghi dữ liệu chính, hệ thống đảm bảo tính nhất quán cuối cùng (Eventual Consistency) và đảm bảo thông điệp sẽ được gửi ít nhất một lần (At-least-once delivery) kể cả khi worker hoặc database bị sập đột ngột.

---

## Core Concept & Rationale

- **Bài toán Dual-Write (Lỗi ghi kép):**
  Trong một luồng nghiệp vụ như đặt vé thành công, ta cần thực hiện 2 thao tác:
  1. Cập nhật số lượng vé và tạo bản ghi đặt chỗ trong Database.
  2. Gửi message sang hàng đợi (Message Queue/BullMQ) để kích hoạt gửi email và tạo hóa đơn PDF.
     Nếu ta ghi DB thành công nhưng kết nối tới Redis/BullMQ bị mất, user đã mua được vé nhưng không nhận được thông báo. Nếu ta gửi message trước rồi mới ghi DB và DB bị rollback (do lỗi khóa dữ liệu), user sẽ nhận được email chúc mừng mua vé thành công nhưng thực tế vé không tồn tại (Overselling).

- **Giải pháp Outbox Pattern:**
  - **Atomic Transaction:** Thao tác chèn dữ liệu nghiệp vụ (ví dụ: `Booking`) và chèn dữ liệu sự kiện (ví dụ: `OutboxEvent`) được thực hiện trong **cùng một Transaction** của PostgreSQL. Nếu một trong hai thất bại, toàn bộ thao tác bị rollback.
  - **Message Relayer:** Một tiến trình quét nền (polling database hoặc CDC - Change Data Capture) định kỳ tìm các bản ghi có trạng thái `PENDING` trong bảng `outbox`, đẩy chúng lên Message Queue (BullMQ/Kafka) rồi cập nhật trạng thái thành `PROCESSED` (hoặc xóa đi).

---

## NestJS Implementation Sketch

### 1. Database Schema

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  ticket_id INT NOT NULL,
  quantity INT NOT NULL,
  status VARCHAR(20) NOT NULL
);

CREATE TABLE outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSED, FAILED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP
);
```

### 2. Transactional Business Logic

_Theo nguyên tắc [[Clean_Architecture]], Service này thuộc **Application Layer**, chịu trách nhiệm điều phối transaction và tách biệt hoàn toàn chi tiết lưu trữ khỏi Business Domain._

```typescript
import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { Order } from "./order.entity";
import { OutboxEvent } from "./outbox.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createOrder(userId: number, ticketId: number, quantity: number) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // 1. Lưu thông tin đơn đặt vé vào database
        const order = transactionalEntityManager.create(Order, {
          userId,
          ticketId,
          quantity,
          status: "PENDING_PAYMENT",
        });
        const savedOrder = await transactionalEntityManager.save(order);

        // 2. Ghi sự kiện nghiệp vụ vào bảng Outbox trong cùng Transaction
        const outboxEvent = transactionalEntityManager.create(OutboxEvent, {
          eventType: "order.created",
          payload: { orderId: savedOrder.id, userId, ticketId, quantity },
          status: "PENDING",
        });
        await transactionalEntityManager.save(outboxEvent);

        return savedOrder;
      },
    );
  }
}
```

### 3. Outbox Publisher

```typescript
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OutboxEvent } from "./outbox.entity";

@Injectable()
export class OutboxPublisher {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepo: Repository<OutboxEvent>,
    @InjectQueue("notification-queue")
    private readonly notificationQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async publishPendingEvents() {
    // 1. Quét các event chưa được xử lý
    const pendingEvents = await this.outboxRepo.find({
      where: { status: "PENDING" },
      take: 20,
    });

    for (const event of pendingEvents) {
      try {
        // 2. Đẩy sự kiện vào BullMQ
        await this.notificationQueue.add(event.eventType, event.payload, {
          jobId: event.id, // Sử dụng UUID làm jobId để đảm bảo Idempotent
        });

        // 3. Đánh dấu đã xử lý
        event.status = "PROCESSED";
        event.processedAt = new Date();
        await this.outboxRepo.save(event);
      } catch (error) {
        console.error(`Failed to publish outbox event ${event.id}:`, error);
      }
    }
  }
}
```

### 4. Background Consumer

```typescript
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor("notification-queue")
export class NotificationProcessor extends WorkerHost {
  async process(
    job: Job<{ orderId: number; userId: number }, void, string>,
  ): Promise<void> {
    const { orderId, userId } = job.data;

    switch (job.name) {
      case "order.created":
        // Xử lý gửi email xác nhận và xuất hóa đơn PDF
        await this.sendConfirmationEmail(userId, orderId);
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  private async sendConfirmationEmail(userId: number, orderId: number) {
    // Logic gửi email thông qua Mailer Service
  }
}
```

---

## Related Notes

- [[Clean_Architecture]] - Thiết kế cấu trúc thư mục đảm bảo tách biệt DB entities và Business entities.
- MOC dự án áp dụng: [[000_Ticket_Booking_MOC.md|Ticket Booking MOC]]
