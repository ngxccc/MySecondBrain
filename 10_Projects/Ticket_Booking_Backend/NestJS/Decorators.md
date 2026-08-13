# NestJS Core & HTTP Decorators

Trong NestJS, **Decorators** là một tính năng cốt lõi (dựa trên TypeScript Decorators) được sử dụng để khai báo và định cấu hình các Endpoint, định tuyến (Routing) và trích xuất dữ liệu từ các Request HTTP một cách Declarative (khai báo).

---

## 1. HTTP Method Decorators (Định tuyến yêu cầu)

Các decorator này được gắn trên các phương thức của Controller để xác định HTTP Method và Path tương ứng mà phương thức đó sẽ xử lý.

| Decorator        | HTTP Method | Mục đích                                                         | Ví dụ                      |
| :--------------- | :---------- | :--------------------------------------------------------------- | :------------------------- |
| `@Get(path?)`    | `GET`       | Truy xuất/Lấy dữ liệu. Không thay đổi trạng thái server.         | `@Get('users')`            |
| `@Post(path?)`   | `POST`      | Tạo mới tài nguyên hoặc xử lý các hành động phức tạp (như Auth). | `@Post('register')`        |
| `@Put(path?)`    | `PUT`       | Cập nhật toàn bộ (thay thế) tài nguyên hiện có.                  | `@Put('profile')`          |
| `@Patch(path?)`  | `PATCH`     | Cập nhật một phần tài nguyên (chỉ các trường thay đổi).          | `@Patch('profile/avatar')` |
| `@Delete(path?)` | `DELETE`    | Xóa tài nguyên.                                                  | `@Delete('users/:id')`     |

### Ví dụ định tuyến cơ bản

```typescript
@Controller("users") // Base path: /users
export class UserController {
  @Get() // GET /users
  findAll() {
    return [];
  }

  @Post() // POST /users
  create() {
    return "User created";
  }
}
```

---

## 2. Request Payload Decorators (Trích xuất dữ liệu từ Request)

NestJS cung cấp một tập hợp các decorator để bạn dễ dàng lấy dữ liệu từ HTTP Request của client mà không cần truy cập trực tiếp vào đối tượng `req` của Express/Fastify.

| NestJS Decorator      | Đối tượng tương ứng trong Express      | Ví dụ cách dùng                                   | Giải thích                                                           |
| :-------------------- | :------------------------------------- | :------------------------------------------------ | :------------------------------------------------------------------- |
| **`@Query(key?)`**    | `req.query` hoặc `req.query[key]`      | `verifyEmail(@Query('token') token: string)`      | Lấy các tham số truy vấn trên URL sau dấu `?`                        |
| **`@Param(key?)`**    | `req.params` hoặc `req.params[key]`    | `findOne(@Param('id') id: string)`                | Lấy các tham số động được định nghĩa trên Route Path                 |
| **`@Body(key?)`**     | `req.body` hoặc `req.body[key]`        | `create(@Body() dto: CreateUserDto)`              | Lấy dữ liệu gửi lên trong phần thân (Body) của Request               |
| **`@Headers(name?)`** | `req.headers` hoặc `req.headers[name]` | `getAuth(@Headers('authorization') auth: string)` | Lấy các HTTP Headers                                                 |
| **`@Req()`**          | `req`                                  | `getProfile(@Req() req: Request)`                 | Lấy toàn bộ đối tượng Request của nền tảng bên dưới                  |
| **`@Res()`**          | `res`                                  | `downloadFile(@Res() res: Response)`              | Lấy đối tượng Response (hạn chế dùng trừ khi cần kiểm soát thủ công) |

---

## 3. Phân biệt chi tiết `@Query` và `@Param`

Đây là hai decorator rất dễ bị nhầm lẫn vì chúng đều lấy dữ liệu từ URL.

### 3.1. `@Param` (Route Parameters / Path Variables)

- **Bản chất**: Là một phần bắt buộc nằm trong cấu trúc của URL path.
- **Cách định nghĩa**: Định nghĩa bằng dấu hai chấm `:` trong route decorator.
- **Mục đích**: Dùng để xác định danh tính (Identify) của một tài nguyên cụ thể (như ID, UUID, Slug).
- **URL ví dụ**: `https://api.example.com/users/12345` (với `12345` là `id`).

```typescript
@Get(':id') // GET /users/:id
findOne(@Param('id') id: string) {
  // id sẽ có giá trị là "12345"
  return this.userService.findById(id);
}
```

### 3.2. `@Query` (Query Parameters / Search Params)

- **Bản chất**: Là các tham số tùy chọn nằm sau dấu chấm hỏi `?` trên URL, ngăn cách nhau bởi dấu `&`.
- **Cách định nghĩa**: Không cần định nghĩa trước trên route decorator, client tự gửi lên.
- **Mục đích**: Dùng để lọc (Filter), sắp xếp (Sort), phân trang (Pagination), hoặc gửi token xác thực tùy chọn.
- **URL ví dụ**: `https://api.example.com/users?role=admin&limit=10` hoặc `https://api.example.com/auth/verify-email?token=xyz`

```typescript
@Get() // GET /users?role=admin&limit=10
findAll(
  @Query('role') role: string,
  @Query('limit') limit: number
) {
  // role = "admin", limit = 10
  return this.userService.findFiltered(role, limit);
}
```

---

## 4. Best Practices & Lưu ý quan trọng

1. **Sử dụng DTO (Data Transfer Object) với `@Body`**:
   Luôn kết hợp `@Body()` với một Class DTO và sử dụng `class-validator` để validate dữ liệu đầu vào tự động thông qua NestJS `ValidationPipe`.

   ```typescript
   @Post()
   create(@Body() createUserDto: CreateUserDto) {
     return this.userService.create(createUserDto);
   }
   ```

2. **Hạn chế lạm dụng `@Res()`**:
   Khi bạn dùng `@Res()`, NestJS sẽ tắt cơ chế tự động xử lý Response của nó (như tự động set Status Code, tự động serialize JSON). Bạn sẽ phải tự gọi `res.send()` hoặc `res.json()`, điều này làm mất đi tính đồng bộ của NestJS và gây khó khăn khi viết Unit Test.
   - _Nếu cần set Status Code_: Dùng `@HttpCode(204)`.
   - _Nếu cần set Header_: Dùng `@Header('Cache-Control', 'none')`.

3. **Type Safety cho `@Query` và `@Param`**:
   Nên định nghĩa kiểu dữ liệu rõ ràng cho các tham số. NestJS có thể tự động convert kiểu dữ liệu (từ string sang number/boolean) nếu bạn bật tính năng `transform: true` trong `ValidationPipe` toàn cục:

   ```typescript
   // URL: /users/123 -> id sẽ tự động biến đổi thành kiểu number thay vì string
   @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number) {
     return this.userService.findById(id);
   }
   ```

---

## 5. Core Dependency Injection: `@Injectable()`

### 5.1. Khái niệm & Mục đích

`@Injectable()` là decorator cốt lõi của cơ chế **Dependency Injection (DI)** trong NestJS. Nó dùng để khai báo rằng một Class có thể được quản lý bởi **NestJS IoC Container** (Inversion of Control) và có thể được "inject" (nhúng) vào các Class khác (như Controller hoặc Service khác) thông qua Constructor.

### 5.2. Cách hoạt động

Khi một Class được đánh dấu là `@Injectable()`, NestJS sẽ:

1. Đăng ký Class này vào container quản lý.
2. Tự động tìm kiếm và khởi tạo các dependency (phụ thuộc) mà Class này yêu cầu trong Constructor của nó.
3. Chia sẻ (hoặc tạo mới) instance của Class này khi có Class khác yêu cầu sử dụng.

### 5.3. Ví dụ thực tế

```typescript
@Injectable()
export class MailService {
  sendVerificationEmail(email: string, token: string) {
    // Logic gửi email
  }
}

// Nhúng MailService vào AuthService
@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {} // Tự động inject qua constructor

  async register(dto: RegisterDto) {
    // ... logic đăng ký ...
    await this.mailService.sendVerificationEmail(dto.email, token);
  }
}
```

---

## 6. Queue Processing: `@Processor()`

### 6.1. Khái niệm & Mục đích

`@Processor()` là decorator được cung cấp bởi gói `@nestjs/bull` hoặc `@nestjs/bullmq`. Nó dùng để khai báo một Class là một **Queue Consumer / Worker**. Class này sẽ lắng nghe và xử lý các công việc (Jobs) được gửi vào một Hàng đợi (Queue) cụ thể trong Redis.

### 6.2. Cách hoạt động

Khi một Class được đánh dấu `@Processor('tên_hàng_đợi')`, nó:

1. Liên kết trực tiếp Class đó với hàng đợi có tên tương ứng trong cấu hình Redis.
2. Lắng nghe mọi tác vụ được đưa vào hàng đợi đó.
3. Khi phát hiện tác vụ, nó sẽ tự động chạy phương thức xử lý (thường kế thừa `WorkerHost` và triển khai phương thức `process()`).

### 6.3. Ví dụ thực tế

```typescript
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor("mail") // Lắng nghe hàng đợi tên là "mail"
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  // Phương thức này tự động chạy khi có Job mới trong hàng đợi "mail"
  async process(job: Job<{ email: string; token: string }>): Promise<void> {
    const { email, token } = job.data;
    await this.mailService.sendVerificationEmail(email, token);
  }
}
```

---

## 7. Custom Token & Queue Injection: `@Inject()` & `@InjectQueue()`

Thông thường, NestJS sử dụng cơ chế **Class-based Injection** để tự động nhận diện dependency qua kiểu dữ liệu của biến truyền vào constructor (ví dụ: `constructor(private mailService: MailService)`).

Tuy nhiên, trong một số trường hợp, NestJS cần nhúng các dependency không phải là Class (như một kết nối database, các cấu hình hằng số, các SDK bên ngoài, hoặc một hàng đợi cụ thể). Lúc này, chúng ta cần dùng `@Inject()` và `@InjectQueue()`.

### 7.1. `@Inject(TOKEN)`

#### Khái niệm & Mục đích

`@Inject()` là decorator cốt lõi của NestJS dùng để tiêm các **Custom Providers** được khai báo bằng một **Token** (có thể là một `string`, `symbol`, hoặc cấu hình custom) thay vì một Class.

#### Khi nào dùng?

Khi đăng ký provider trong module dưới dạng `useValue`, `useFactory`, hoặc `useClass` nhưng gắn kèm với một chuỗi định danh (string token) thay vì class tên. Để tránh gõ sai chuỗi ký tự (typo), chúng ta thường tạo ra một hằng số được export:

```typescript
// Trong file db.module.ts hoặc file constants
export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

// Đăng ký Provider
const connectionProvider = {
  provide: DATABASE_CONNECTION, // token là "DATABASE_CONNECTION"
  useFactory: () => createDatabaseConnection(),
};
```

#### Tại sao đã có hằng số `DATABASE_CONNECTION` được export mà vẫn bắt buộc phải viết `@Inject(DATABASE_CONNECTION)` trong Constructor?

Đây là điểm mấu chốt giữa **TypeScript Type (kiểu dữ liệu lúc viết code)** và **NestJS Runtime Resolution (giải quyết phụ thuộc lúc ứng dụng chạy)**:

1. **TypeScript Interface/Type bị xóa sạch khi compile (Type Erasure)**:
   Khi viết code, bạn khai báo kiểu dữ liệu cho biến DB để được gợi ý code (IntelliSense):

   ```typescript
   private readonly dbConnection: Connection
   ```

   Tuy nhiên, khi biên dịch sang JavaScript, kiểu dữ liệu `Connection` (hoặc `DrizzleDB`) sẽ bị xóa hoàn toàn. Lúc chạy ứng dụng (Runtime), NestJS không có cách nào biết được thuộc tính này cần kiểu gì để tự động inject.

2. **NestJS tìm dependency dựa trên Token**:
   Vì NestJS lưu kết nối Database trong Container dưới tên Token là chuỗi `"DATABASE_CONNECTION"`, chúng ta phải dùng `@Inject(DATABASE_CONNECTION)` để bảo với NestJS tại thời điểm chạy:
   _"Hãy tìm trong Container xem có Provider nào đăng ký dưới Token `"DATABASE_CONNECTION"` (giá trị của hằng số `DATABASE_CONNECTION`) thì lấy giá trị của nó nhét vào đây."_

```typescript
@Injectable()
export class UserService {
  constructor(
    // Bắt buộc phải có @Inject để NestJS Map đúng Token ở Runtime
    @Inject(DATABASE_CONNECTION) private readonly dbConnection: Connection,
  ) {}
}
```

---

### 7.2. `@InjectQueue(name)`

#### Khái niệm & Mục đích

`@InjectQueue()` là decorator được cung cấp bởi gói BullMQ (`@nestjs/bullmq`). Nó được thiết kế đặc thù để **nhúng thực thể Hàng đợi (Queue)** vào trong một Service.

#### Bản chất hoạt động

Về bản chất, `@InjectQueue('mail')` là một hàm tiện ích bọc lại của `@Inject()`. Nó tự động tạo ra token đặc thù cho hàng đợi tên là `"mail"` (tương đương với `@Inject(getQueueToken('mail'))`).

#### Cách hoạt động & Ví dụ:

Sau khi đăng ký `BullModule.registerQueue({ name: 'mail' })` ở Module, ta có thể inject hàng đợi này vào Service để thêm công việc (add jobs) vào Redis:

```typescript
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class AuthService {
  constructor(
    // Nhúng hàng đợi "mail" để tương tác
    @InjectQueue("mail") private readonly mailQueue: Queue,
  ) {}

  async register(email: string) {
    // ... xử lý lưu DB ...

    // Đẩy job gửi mail bất đồng bộ vào Redis
    await this.mailQueue.add("sendVerification", {
      email,
      token: "random-activation-token",
    });
  }
}
```
