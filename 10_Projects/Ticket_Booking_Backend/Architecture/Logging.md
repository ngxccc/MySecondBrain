# NestJS Logger vs console.log - Giải Pháp Ghi Log Chuyên Nghiệp

Trong phát triển ứng dụng NestJS chuyên nghiệp, chúng ta **luôn luôn sử dụng `Logger` của NestJS** thay vì sử dụng `console.log`. Đây không đơn thuần là thói quen viết code mà là một **quyết định kiến trúc quan trọng** tác động lớn đến khâu vận hành (DevOps), gỡ lỗi (Debugging), hiệu năng ứng dụng (Performance) và kiểm thử (Testing).

Dưới đây là các lý do cốt lõi giải thích sự khác biệt này:

---

## 1. So Sánh Tính Năng Cốt Lõi

| Tiêu chí                              | `console.log`                                                      | NestJS `Logger`                                                                                     |
| :------------------------------------ | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| **Định dạng mặc định**                | Chuỗi text thô không định dạng.                                    | Colored text (màu sắc phân biệt), Timestamp (thời gian thực), Process ID (PID), Log Level, Context. |
| **Ngữ cảnh (Context)**                | Phải viết thủ công vào chuỗi text.                                 | Tự động đi kèm tên Class phát ra log (Ví dụ: `[MailService]`).                                      |
| **Lọc cấp độ (Log Level)**            | Không hỗ trợ (phải viết code IF/ELSE).                             | Hỗ trợ cấu hình bật/tắt động (`log`, `error`, `warn`, `debug`, `verbose`).                          |
| **Tích hợp bên thứ 3**                | Không hỗ trợ.                                                      | Dễ dàng thay thế bằng **Winston**, **Pino**, **Sentry** thông qua Interface `LoggerService`.        |
| **Kiểm thử (Testing)**                | Khó tắt (gây rác log khi chạy tests).                              | Dễ dàng tắt hoặc mock bằng `Logger.overrideLogger(false)`.                                          |
| **Cấu trúc dữ liệu (Structured Log)** | Plain Text (Không thể parse tự động).                              | Hỗ trợ cấu trúc hóa JSON để đẩy lên ELK, Datadog, Loki.                                             |
| **Hiệu năng hệ thống (Blocking)**     | Đồng bộ (Synchronous) -> Gây block Single Thread khi chịu tải cao. | Hỗ trợ ghi không đồng bộ (Asynchronous) thông qua các custom stream (như Pino).                     |

---

## 2. Các Lý Do Kỹ Thuật Chi Tiết

### 2.1. Tính Năng Gắn Ngữ Cảnh (Context-Awareness)

Khi khởi tạo `new Logger(MailService.name)`, NestJS tự động đăng ký ngữ cảnh cho mọi bản ghi log từ class đó.

```typescript
// Trong MailService
this.logger.log("Email sent successfully");
// Đầu ra: [Nest] PID  - 15/07/2026, 8:00:00 AM     LOG [MailService] Email sent successfully
```

- **Lợi ích**: Khi đọc file log có hàng triệu dòng trong Production, bạn có thể lập tức lọc ra mọi log liên quan đến `MailService` chỉ bằng một cú pháp tìm kiếm nhanh, thay vì phải đoán xem dòng log đó từ đâu ra.

### 2.2. Khả Năng Mở Rộng & Thay Thế (Pluggability & Custom LoggerService)

Đây là lý do quan trọng nhất đối với môi trường Production lớn (Cloud, Docker, Kubernetes).
NestJS định nghĩa một bản thiết kế chung (Interface) có tên là `LoggerService`:

```typescript
export interface LoggerService {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  verbose?(message: any, ...optionalParams: any[]): any;
}
```

Bất kỳ thư viện log nào (như Winston hoặc Pino) chỉ cần viết một adapter triển khai (implement) Interface này là có thể ghi đè toàn bộ hệ thống log của NestJS:

```typescript
// Triển khai Winston Logger thích ứng với NestJS
import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

export class WinstonLoggerService implements LoggerService {
  private logger = winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }
  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
}
```

Ghi đè tại `main.ts` đúng 1 lần:

```typescript
const app = await NestFactory.create(AppModule);
app.useLogger(new WinstonLoggerService()); // Đè lại toàn bộ hệ thống
```

- **Hậu quả của `console.log`**: Nếu bạn viết `console.log()`, các dòng log này sẽ bỏ qua bộ cấu hình Logger của NestJS, ghi trực tiếp ra Console thô và không được đồng bộ về hệ thống giám sát.

### 2.3. Định Dạng JSON (Structured Logging) Cho Production

Trên Production, các công cụ giám sát (như ElasticSearch, Loki, Datadog) cần log ở định dạng **JSON structured** để đánh chỉ mục (index) và thực hiện các câu truy vấn phức tạp.

- **Đầu ra của Winston/Pino JSON**:

  ```json
  {
    "level": "info",
    "message": "Email sent successfully",
    "context": "MailService",
    "timestamp": "2026-07-15T08:00:00.000Z",
    "requestId": "req-abc-123"
  }
  ```

  Nhờ cấu trúc JSON, bạn có thể dễ dàng tạo bộ lọc: _"Hiển thị toàn bộ lỗi có `context = MailService` và `requestId = req-abc-123`"_.

- **Đầu ra của `console.log`**: Chỉ là một chuỗi chữ thường thô sơ không thể tự động bóc tách thành các trường khóa dữ liệu.

### 2.4. Khả năng truy vết chuỗi hành vi (Correlation ID / Trace ID)

Trong các ứng dụng Microservices hoặc Web API có tải lượng lớn, chúng ta cần trace (truy vết) toàn bộ luồng xử lý của một Request từ lúc vào hệ thống đến khi ra (gồm cả ghi DB, gửi Mail, gọi API khác).

- Bằng cách kết hợp `LoggerService` với **`AsyncLocalStorage`** (hoặc thư viện `nestjs-pino`), NestJS Logger có thể tự động đính kèm `requestId` (hoặc `traceId`) vào mọi dòng log được gọi ở bất cứ đâu trong luồng xử lý đó mà không cần truyền biến `requestId` thủ công qua từng hàm.
- `console.log` hoàn toàn không có khả năng tự động liên kết ngữ cảnh bất đồng bộ này.

### 2.5. Vấn Đề Hiệu Năng (Synchronous vs Asynchronous I/O)

- `console.log` trong Node.js là một hoạt động **đồng bộ (Synchronous)** khi ghi ra terminal. Dưới tải lượng cực lớn (hàng chục nghìn request mỗi giây), việc gọi `console.log` liên tục sẽ gây nghẽn Single-Thread của Node.js (blocking I/O), làm tăng thời gian phản hồi (latency) của API một cách đáng kể.
- Các thư viện chuyên dụng như **Pino** sử dụng cơ chế ghi không đồng bộ (Asynchronous Logging) và buffering tối ưu, giúp giải phóng hoàn toàn Single-Thread để xử lý request và tăng thông lượng (throughput) của hệ thống lên gấp nhiều lần.
