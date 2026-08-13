---
tags:
  [
    type/guide,
    topic/architecture,
    topic/backend,
    layer/core-mechanics,
    status/todo,
  ]
date: 2026-08-10
description: "Huong dan chi tiet va toan dien tat ca cac kien truc va design pattern trong du an Ticket Booking theo 4-Layer Cognitive Stack trong 1 note duy nhat."
---

# Ticket Booking Architecture Master Guide

## TL;DR

Dự án Ticket Booking là một hệ thống backend xử lý đặt vé xem phim có độ phức tạp cao, giải quyết triệt để các bài toán **High Concurrency**, **Race Conditions**, **Eventual Consistency**, **Authentication Security** và **Fail-Safe Processing**. Tài liệu duy nhất này tổng hợp toàn bộ các kiến trúc & design pattern cốt lõi của dự án được phân tầng theo **4-Layer Cognitive Stack** kèm theo giải thích nguyên lý và mã nguồn thực tế.

---

## Layer 1: Core Mechanics & Memory

Tầng này đại diện cho **Cấu trúc bộ nhớ (Memory Layout)**, **Cơ chế thực thi của Runtime/Compiler (Engine Internals)**, **Xử lý I/O đĩa/mạng & Socket**, **Thuật toán mật mã tầng thấp** và các **Cấu trúc dữ liệu cốt lõi**. Dưới đây là 15 cơ chế Tầng 1 cốt lõi đang vận hành ngầm trong toàn bộ dự án:

### 1. Lock Hierarchy Sorting (Chống Deadlock ở tầng thuật toán)

- **Bản chất**: Trước khi khóa tài nguyên (ghế ngồi), mảng ID ghế luôn được sắp xếp theo thứ tự nhất định (`sortedSeatIds = [...dto.seatIds].sort()`).
- **Điểm cốt lõi**: Tránh hiện tượng **Deadlock** (khóa xoay vòng) khi hai request đồng thời đặt 2 ghế A và B nhưng xin khóa theo thứ tự ngược nhau. Đảm bảo tất cả các luồng luôn tranh chấp khóa theo đúng một thứ tự duy nhất.
- **Mã nguồn thực tế**:
  ```typescript
  // src/modules/booking/booking.service.ts
  async reserveSeats(userId: string, dto: ReserveSeatsDto) {
    // Sắp xếp mảng ID ghế theo thứ tự alphabet trước khi xin khóa
    const sortedSeatIds = [...dto.seatIds].sort();

    const lockResources = sortedSeatIds.map((seatId: string) =>
      REDIS_KEYS.showSeatLock(seatId),
    );

    const lock = await this.redlockService.acquireLock(lockResources, 2000);
    // ...
  }
  ```

### 2. PostgreSQL Statement Timeout Guard (`SET LOCAL statement_timeout`)

- **Bản chất**: Thiết lập giới hạn thời gian thực thi câu lệnh SQL ở tầng Session/Transaction trong PostgreSQL.
- **Điểm cốt lõi**: Khi một transaction giữ khóa row-level (`SELECT ... FOR UPDATE`), nếu câu lệnh bên trong transaction bị treo hoặc gặp sự cố nghẽn I/O, `SET LOCAL statement_timeout = 3000` ép PostgreSQL hủy lệnh và giải phóng lock sau $3000\text{ms}$. Từ khóa `LOCAL` đảm bảo timeout chỉ áp dụng cho transaction hiện tại, không ảnh hưởng đến các connection khác trong pool.
- **Mã nguồn thực tế**:
  ```typescript
  // src/modules/booking/booking.service.ts
  await tx.execute(sql`SET LOCAL statement_timeout = 3000`);
  ```

### 3. Redis Socket Leak & Unhandled Error Protection (`ioredis.on('error')`)

- **Bản chất**: Xử lý sự kiện lỗi socket ở tầng TCP trong thư viện Redis client.
- **Điểm cốt lõi**: `ioredis` kế thừa từ `EventEmitter`. Khi gặp sự cố phân giải DNS IPv4/IPv6 hoặc rớt mạng TCP, nếu không đăng ký hàm lắng nghe sự kiện `error`, Node/Bun runtime sẽ coi đó là unhandled exception khiến app crash hoặc rò rỉ socket TCP mở. Hàm listener rỗng (`this.redisClient.on("error", () => {})`) giữ cho connection pool tự động reconnect mà không làm ngắt ứng dụng.
- **Mã nguồn thực tế**:
  ```typescript
  // src/common/services/redlock.service.ts
  this.redisClient = new Redis(options);
  this.redisClient.on("error", (_err: unknown) => {
    void 0; // Ngăn chặn unhandled EventEmitter error làm crash app
  });
  ```

### 4. Database Connection Pooling & TCP Socket Reuse (`pg.Pool`)

- **Bản chất**: Cơ chế tái sử dụng kết nối TCP socket đến cơ sở dữ liệu PostgreSQL.
- **Điểm cốt lõi**: Việc khởi tạo một kết nối TCP + TLS Handshake mới tới PostgreSQL tốn khoảng $30-50\text{ms}$. `pg.Pool` duy trì sẵn một tập hợp các kết nối TCP socket trong RAM. Mỗi request HTTP chỉ việc mượn 1 socket từ pool, thực thi query và trả lại socket về pool mà không tốn chi phí handshaking.

### 5. Constant-Time Byte Comparison (`timingSafeEqual`)

- **Bản chất**: So sánh chuỗi byte với thời gian thực thi cố định ($O(N)$), ngăn chặn tấn công dò vết thời gian (**Side-Channel Timing Attack**).
- **Điểm cốt lõi**: Nếu dùng so sánh chuỗi thông thường (`===`), Engine sẽ dừng ngay khi gặp ký tự đầu tiên không khớp (Short-circuiting). Hacker có thể đo thời gian phản hồi CPU ở mức nanosecond để đoán từng ký tự của Hash password. `timingSafeEqual` ép CPU kiểm tra toàn bộ chuỗi byte bất kể đúng hay sai.
- **Mã nguồn thực tế**:
  ```typescript
  // src/common/utils/crypto.util.ts
  import { timingSafeEqual } from "node:crypto";

  export async function comparePassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    // Tránh timing attack khi so sánh hash password
    return timingSafeEqual(derivedKey, keyBuffer);
  }
  ```

### 6. CPU & Memory Hard Key Derivation (`scrypt`)

- **Bản chất**: Hàm băm mật khẩu mật mã học (Password KDF) chống tấn công Brute-Force bằng phần cứng chuyên dụng (ASIC/FPGA).
- **Điểm cốt lõi**: Khác với SHA-256 (rất nhẹ, ASIC có thể băm hàng tỷ lần/giây), `scrypt` yêu cầu dung lượng bộ nhớ RAM cố định và chu kỳ CPU cho mỗi lần tính toán hash (`hashPassword`), khiến chi phí mua phần cứng tấn công Brute-force trở nên đắt đỏ không khả thi.

### 7. OS Kernel Entropy Pool & CSPRNG (`randomBytes`)

- **Bản chất**: Tạo chuỗi ngẫu nhiên an toàn mật mã học qua hệ thống OS Kernel (`/dev/urandom` hoặc `getrandom()`).
- **Điểm cốt lõi**: Tuyệt đối không dùng `Math.random()` (thuật toán PRNG XorShift128+ có thể bị đoán trước chuỗi kết quả). `randomBytes(16)` rút trực tiếp độ nhiễu nhiệt (entropy) từ phần cứng Kernel OS để tạo Salt và Refresh Token.

### 8. PostgreSQL MVCC (Multi-Version Concurrency Control) & Tuple Visibility

- **Bản chất**: Cơ chế quản lý truy cập đồng thời của PostgreSQL.
- **Điểm cốt lõi**: Khi một lệnh `UPDATE` hoặc `DELETE` diễn ra (ví dụ cập nhật trạng thái ghế hoặc outbox event), PostgreSQL **không đè trực tiếp lên ô nhớ cũ**, mà tạo ra một **Tuple version mới** với các trường ẩn `xmin`/`xmax`. Đảm bảo các câu truy vấn `SELECT` đọc không bao giờ bị block bởi câu lệnh `WRITE`, đồng thời đòi hỏi tiến trình `VACUUM` chạy ngầm để dọn dẹp các dead tuples.

### 9. Bun Runtime & JSC Event Loop Execution Model

- **Bản chất**: Dự án sử dụng Bun làm runtime, chạy trên engine JavaScriptCore (JSC) thay vì V8.
- **Điểm cốt lõi**:
  - Kiến trúc Event Loop xử lý bất đồng bộ non-blocking với chi phí tạo microtask cực thấp.
  - Tối ưu hóa đọc ghi đĩa và mạng nhờ native I/O bindings viết bằng Zig/C++.

### 10. Generational Garbage Collection & Memory Allocation (Heap vs Stack)

- **Bản chất**: Cơ chế quản lý bộ nhớ của JavaScriptCore Engine trong Bun:
  - **Stack Memory**: Lưu trữ các biến nguyên thủy và con trỏ stack frame của hàm đang thực thi. Chi phí giải phóng bằng 0 khi hàm kết thúc.
  - **Heap Memory (Nursery / Young Gen)**: Các DTO ngắn hạn (`ReserveSeatsDto`) được khởi tạo liên tục trên Young Generation. Bộ dọn rác (Scavenger Garbage Collector) quét và giải phóng các object sống ngắn hạn này trong vài microgiây.
  - **Old Generation**: Các Singleton Services (`BookingService`, `RedlockService`) sống xuyên suốt lifecycle ứng dụng được đẩy sang Old Gen để tránh bị scan lãng phí.

### 11. B+ Tree Index Page Locks & Buffer Pool (PostgreSQL Storage Engine)

- **Bản chất**: Cơ chế đọc ghi đĩa cứng của PostgreSQL khi thực thi `SELECT ... FOR UPDATE`:
  - Dữ liệu bảng `show_seats` và index được tổ chức dưới dạng **B+ Tree** lưu trên các Data Page $8\text{KB}$.
  - Khi thực thi `SELECT ... FOR UPDATE`, PostgreSQL nạp Page chứa bản ghi từ Đĩa vào **Buffer Pool trong RAM**, sau đó gán khóa row-level lock (`ExclusiveLock`) trên tuple header. Ngăn các Transaction khác sửa đổi ô nhớ chứa dòng dữ liệu này.

### 12. Hidden Classes (Shapes) & Inline Caching Optimization

- **Bản chất**: Tối ưu hóa truy cập thuộc tính object của JSC/V8 Engine:
  - Khi DTO (`ReserveSeatsDto`) được khởi tạo với cấu trúc cố định, Engine tạo ra một **Shape/Structure (Hidden Class)** lưu offset bộ nhớ của từng thuộc tính (`showId`, `seatIds`).
  - **Inline Caching (IC)** giúp bỏ qua bước tra cứu hash table, truy cập trực tiếp địa chỉ RAM của trường `seatIds` với tốc độ tiệm cận ngôn ngữ C/C++.

### 13. Buffer Allocation & Memory Pooling trong Crypto Utilities

- **Bản chất**: Quản lý bộ nhớ khi tính toán chữ ký số HMAC-SHA256 (`node:crypto`):
  - Sử dụng C++ Native ArrayBuffer pooling bên dưới Node/Bun crypto binding để thực hiện phép băm SHA-256.
  - Tránh việc phân bổ và giải phóng ô nhớ liên tục gây phân mảnh bộ nhớ (Memory Fragmentation).

### 14. Lock Retry Jitter & Clock Drift Mitigation

- **Bản chất**: Giải thuật chống nghẽn thoi mạng (Thundering Herd Problem) khi retry Redlock:
  - Trong `RedlockService`, cấu hình `retryJitter: 50`, `retryDelay: 200`, `driftFactor: 0.01`. Trộn ngẫu nhiên thời gian chờ retry để các request không cùng lúc đập vào Redis server tại cùng một millisecond.

### 15. TypeScript Reflect-Metadata & Decorator Reflection

- **Bản chất**: NestJS nạp thông tin type metadata vào ô nhớ runtime qua `reflect-metadata` để `class-validator` kiểm tra DTO tại thời điểm thực thi.

---

## Layer 2: Architecture & Clean Code

Tầng này tập trung vào tổ chức mã nguồn, phân tầng trách nhiệm và áp dụng các Design Pattern chuẩn mực trong phát triển phần mềm.

### 16. Transactional Outbox Pattern

- **Bản chất**: Đảm bảo tính nhất quán dữ liệu giữa Database và Message Broker (BullMQ / Redis) mà không dùng Distributed Transactions (2PC). Triệt tiêu hoàn toàn bài toán Dual-Write Problem.
- **Điểm cốt lõi**:
  - Trong cùng một SQL Transaction (`tx`), khi tạo Đặt vé (Booking), sự kiện tương ứng (`outboxEvents`) được ghi trực tiếp vào bảng outbox trong Database.
  - Một worker bất đồng bộ (`OutboxService`) định kỳ quét bảng outbox, đẩy job vào BullMQ và cập nhật trạng thái sự kiện thành `PROCESSED`.
- **Mã nguồn thực tế**:
  ```typescript
  // 1. Ghi dữ liệu nghiệp vụ và outbox event trong cùng DB Transaction
  await this.db.transaction(async (tx) => {
    const [newBooking] = await tx.insert(bookings).values({ ... }).returning();

    await tx.insert(outboxEvents).values({
      eventType: OUTBOX_EVENT_TYPE.BOOKING_CREATED,
      payload: { bookingId: newBooking.id, userId },
      status: "PENDING",
    });
  });

  // 2. Outbox Worker quét và phát tin nhắn sang BullMQ Queue
  // src/modules/outbox/outbox.service.ts
  async processOutbox() {
    const events = await this.db
      .select()
      .from(outboxEvents)
      .where(eq(outboxEvents.status, "PENDING"))
      .limit(10);

    for (const event of events) {
      await this.mailQueue.add(EVENT_TO_JOB_MAP[event.eventType], event.payload);
      await this.db.update(outboxEvents).set({ status: "PROCESSED" }).where(eq(outboxEvents.id, event.id));
    }
  }
  ```

### 17. Refresh Token Rotation & Hashed Storage

- **Bản chất**: Mô hình bảo mật nâng cao cho hệ thống Authentication dựa trên JWT.
- **Điểm cốt lõi**:
  - Server **không lưu trực tiếp Refresh Token thô** vào Database mà chỉ lưu bản băm SHA-256 (`tokenHash = sha256(refreshToken)`) kèm thông tin thiết bị (`deviceName`) và IP (`ipAddress`). Nếu DB bị lộ, hacker không thể dùng hash này để mạo danh.
  - Mỗi khi gia hạn Access Token, Refresh Token cũ bị vô hiệu hóa và xoay vòng (Rotate) sang mã mới. Ngăn chặn kỹ thuật tấn công Token Replay Attack.
- **Mã nguồn thực tế**:
  ```typescript
  // src/modules/auth/auth.service.ts
  private async createTokenSession(userId: string, email: string, role: string, metadata?: ClientMetadata) {
    const refreshToken = randomBytes(32).toString("hex");
    const tokenHash = sha256(refreshToken);

    await this.db.insert(refreshTokens).values({
      userId,
      tokenHash, // Chỉ lưu bản băm SHA-256
      expiresAt: getExpiryDate("7d"),
      deviceName: metadata?.deviceName,
      ipAddress: metadata?.ipAddress,
    });

    return { accessToken, refreshToken };
  }
  ```

### 18. NestJS Modular Architecture & Building Blocks

- **Bản chất**: Phân tầng Controller - Service - Module với Dependency Injection.
- **Điểm cốt lõi**: Custom Decorators (`@CurrentUser`, `@Match`), `LoggingInterceptor` bắt thời gian thực thi request và `JwtAuthGuard`/`ThrottlerGuard` ở tầng bảo mật đầu vào.

---

## Layer 3: System Infrastructure & Concurrency

Tầng này giải quyết các bài toán hệ thống distributed, xử lý đồng thời (concurrency control), cơ sở dữ liệu và hàng đợi xử lý ngầm.

### 19. Two-Phase Concurrency Control (RAM Lock + DB Pessimistic Lock)

- **Bản chất**: Cơ chế phòng thủ 2 lớp giải quyết triệt để bài toán giữ chỗ/đặt vé trùng (Overbooking):
  - **Lớp 1 - RAM Layer Lock (Redlock / Redis)**: Xin khóa phân tán trên Redis cluster bằng Redlock trong $2000\text{ms}$. Nếu 10.000 người cùng bấm đặt ghế, chỉ 1 request lấy được Redlock đi tiếp xuống DB; 9.999 request còn lại bị chặn ngay tại RAM layer.
  - **Lớp 2 - DB Layer Lock (Pessimistic Locking)**: Request vượt qua Pha 1 mở SQL Transaction và truy vấn ghế bằng `SELECT ... FOR UPDATE`. Đảm bảo mức độ cô lập ACID ở tầng cơ sở dữ liệu.
- **Mã nguồn thực tế**:
  ```typescript
  // src/modules/booking/booking.service.ts
  async reserveSeats(userId: string, dto: ReserveSeatsDto) {
    // PHA 1: Redlock giữ khóa RAM
    const lockResources = dto.seatIds.map((id) => `lock:seat:${id}`);
    const lock = await this.redlockService.acquireLock(lockResources, 2000);

    try {
      // PHA 2: DB Pessimistic Lock trong SQL Transaction
      return await this.db.transaction(async (tx) => {
        const selectedSeats = await tx
          .select()
          .from(showSeats)
          .where(inArray(showSeats.id, dto.seatIds))
          .for("update"); // Lock dòng dữ liệu dưới Postgres

        // Kiểm tra và cập nhật trạng thái...
      });
    } finally {
      await this.redlockService.releaseLock(lock);
    }
  }
  ```

### 20. Idempotency Key Pattern with Fail-Open Fallback

- **Bản chất**: Đảm bảo người dùng bấm nút thanh toán/đặt vé nhiều lần do lag mạng thì hệ thống chỉ thực thi đúng 1 lần.
- **Điểm cốt lõi**:
  - Lưu kết quả xử lý vào Redis theo `idempotencyKey`. Nếu request trùng lặp đến, trả về ngay kết quả cached.
  - **Fail-Open Fallback**: Nếu kết nối Redis gặp sự cố tạm thời khi đọc Idempotency Key, hệ thống chủ động bỏ qua bước cache và cho phép luồng chạy tiếp vào DB để không ngắt trải nghiệm người dùng với lỗi 500.
- **Mã nguồn thực tế**:
  ```typescript
  if (idempotencyKey) {
    try {
      const cached = await redis.get(`idempotency:${userId}:${idempotencyKey}`);
      if (cached) return JSON.parse(cached);
    } catch {
      // FAIL-OPEN: Bỏ qua lỗi Redis read để request tiếp tục được xử lý
    }
  }
  ```

### 21. Distributed Rate Limiting via Redis

- **Bản chất**: Giới hạn số lượng request (Rate Limiting) trên hạ tầng ứng dụng chạy nhiều container (Cluster).
- **Điểm cốt lõi**: Kết hợp `@nestjs/throttler` và `@nest-lab/throttler-storage-redis`. Bộ đếm request được lưu tập trung trên Redis thay vì RAM local của từng container, chống DDoS và Brute-force hiệu quả trên toàn bộ cluster.

### 22. Delayed Job Queue Pattern (BullMQ & Redis)

- **Bản chất**: Quản lý tác vụ trì hoãn (tự động hủy giữ chỗ sau 10 phút nếu chưa thanh toán) mà không cần dùng Cron Polling liên tục gây cạn kiệt I/O Database.
- **Mã nguồn thực tế**:
  ```typescript
  // Đẩy delayed job hoãn 10 phút vào BullMQ
  await this.bookingQueue.add(
    BOOKING_JOBS.CANCEL_EXPIRED_BOOKING,
    { bookingId: booking.id },
    { delay: 10 * 60 * 1000 },
  );

  // Worker kích hoạt khi hết hạn
  @Processor(QUEUE_NAMES.BOOKING)
  export class BookingCancellationProcessor extends WorkerHost {
    async process(job: Job<{ bookingId: string }>) {
      // Kiểm tra DB và hủy đơn nếu trạng thái vẫn là PENDING
    }
  }
  ```

---

## Layer 4: Quality & Production Engineering

Tầng này tập trung vào khả năng vận hành sản phẩm, tiêu chuẩn hóa API, bảo mật và hạ tầng triển khai.

### 23. Strict Runtime Env Validation (`@t3-oss/env-core` + Zod)

- **Bản chất**: Kiểm tra và ép kiểu toàn bộ biến môi trường ngay tại thời điểm ứng dụng khởi chạy (**Fail-Fast at Startup**).
- **Điểm cốt lõi**: Nếu thiếu biến cấu hình (`PAYOS_CHECKSUM_KEY`) hoặc sai định dạng, app dừng khởi chạy ngay lập tức (`process.exit(1)`) kèm thông báo chi tiết, ngăn chặn crash ngầm trên Production.

### 24. Standardized RFC 9457 Problem Details Error Handling

- **Bản chất**: Chuẩn hóa toàn bộ cấu trúc lỗi HTTP trả về cho Client theo tiêu chuẩn quốc tế RFC 9457 (`Content-Type: application/problem+json`).
- **Điểm cốt lõi**: Trả về các trường thống nhất (`type`, `title`, `status`, `detail`, `instance`) giúp Frontend dễ dàng parse và hiển thị thông báo lỗi nhất quán.

### 25. Cryptographic Signature Verification (HMAC SHA256)

- **Bản chất**: Xử lý Webhook thanh toán từ cổng PayOS an toàn.
- **Điểm cốt lõi**: Sắp xếp mảng key theo alphabet, tự tính lại chữ ký HMAC-SHA256 với `PAYOS_CHECKSUM_KEY` và so sánh với chữ ký gửi đến để phòng chống tấn công giả mạo dữ liệu Webhook (Spoofing/MITM).

---

## Related Notes

- [[Clean_Architecture]]
- [[Layered_Architecture]]
- [[Postgres_SQL_Performance_Benchmarking_Guide]]
- [[Cognitive_Stack_Framework]]
