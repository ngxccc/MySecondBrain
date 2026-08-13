# Hướng Dẫn Giải Thích Chi Tiết `docker-compose.yml` Dành Cho Phỏng Vấn (Phù hợp cho NestJS + Postgres + Redis)

Tài liệu này được thiết kế nhằm giúp bạn hiểu tường tận từng dòng cấu hình trong file `docker-compose.yml` của dự án Ticket Booking, từ những khái niệm cơ bản nhất cho đến các câu hỏi thường gặp khi đi phỏng vấn.

---

## I. TỔNG QUAN VỀ DOCKER & DOCKER COMPOSE

### 1. Docker là gì?

- **Định nghĩa ngắn gọn:** Docker là nền tảng ảo hóa ở cấp độ hệ điều hành (Containerization), cho phép đóng gói ứng dụng cùng toàn bộ môi trường chạy (dependencies, thư viện, cấu hình) thành một **Container** duy nhất.
- **Lợi ích:** Đảm bảo ứng dụng chạy đồng nhất trên mọi môi trường (Local, Staging, Production) - giải quyết triệt để lỗi kinh điển _"nhưng trên máy em vẫn chạy được mà"_.

### 2. Docker Compose là gì?

- **Định nghĩa ngắn gọn:** Là công cụ dùng để định nghĩa và khởi chạy **nhiều Container cùng một lúc** chỉ bằng một file cấu hình duy nhất là `docker-compose.yml`. Thay vì chạy nhiều lệnh `docker run` phức tạp, bạn chỉ cần dùng lệnh `docker compose up`.

---

## II. GIẢI THÍCH CHI TIẾT FILE `docker-compose.yml`

File cấu hình này định nghĩa 3 dịch vụ (services): **PostgreSQL (Database chính)**, **Redis (Cache & Lock)** và **Caddy (Web Server & Reverse Proxy tự động sinh SSL)**.

```yaml
services:
  postgres:
    image: postgres:18-alpine
    container_name: ticket-booking-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgrespassword}
      POSTGRES_DB: ${DB_DATABASE:-ticket_booking}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    command:
      [
        "postgres",
        "-c",
        "max_connections=500",
        "-c",
        "shared_buffers=256MB",
        "-c",
        "work_mem=16MB",
      ]
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${DB_USERNAME:-postgres} -d ${DB_DATABASE:-ticket_booking}",
        ]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - ticket-booking-net
    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 512M
        reservations:
          memory: 256M
```

### 1. Giải thích chi tiết phần `postgres` (Cơ sở dữ liệu)

- **`image: postgres:18-alpine`**
  - Sử dụng Image chính thức của PostgreSQL phiên bản 18 trên nhân Alpine Linux siêu tối giản giúp tiết kiệm dung lượng đĩa và hạn chế lỗ hổng bảo mật.
- **`container_name: ticket-booking-postgres`**
  - Đặt tên cố định cho Container để dễ quản lý và debug qua CLI.
- **`restart: unless-stopped`**
  - Tự động khởi động lại Container nếu bị crash hoặc Docker khởi động lại, trừ khi bạn chủ động dừng nó.
- **`environment`**
  - Thiết lập biến môi trường cho database. Cú pháp `${DB_USERNAME:-postgres}` đọc từ file `.env`, nếu không có sẽ dùng giá trị mặc định `postgres`.
- **`ports: - '5432:5432'`**
  - Ánh xạ cổng của container ra máy thật để có thể kết nối bằng các công cụ GUI như TablePlus, DBeaver.
- **`volumes: - pgdata:/var/lib/postgresql/data`**
  - Ánh xạ dữ liệu trong container ra volume `pgdata` trên máy thật để **lưu trữ dữ liệu vĩnh viễn**, tránh mất mát khi xóa container.
- **`command`**
  - Tối ưu hóa hiệu năng Postgres: cho phép 500 kết nối đồng thời (`max_connections=500`), dùng 256MB bộ đệm dùng chung (`shared_buffers=256MB`), và cấp 16MB bộ nhớ đệm cho mỗi truy vấn sort/join phức tạp (`work_mem=16MB`).
- **`healthcheck`**
  - Sử dụng lệnh `pg_isready` để kiểm tra trạng thái sẵn sàng của cơ sở dữ liệu trước khi cho phép NestJS kết nối vào.
- **`deploy.resources` (Cấu hình giới hạn bộ nhớ & CPU cho Container):**
  - **`limits.cpus: '0.50'`**: Giới hạn Postgres chỉ được dùng tối đa **50% CPU** của máy thật.
  - **`limits.memory: 512M`**: Giới hạn tối đa **512MB RAM** (Hard limit). Nếu Postgres dùng quá mức này, container sẽ bị tắt ngay lập tức (Lỗi OOM - Out of Memory).
  - **`reservations.memory: 256M`**: Đảm bảo hệ điều hành luôn cam kết giữ tối thiểu **256MB RAM** riêng cho container Postgres chạy ổn định.
- **`networks: - ticket-booking-net`**
  - Kết nối Postgres vào mạng nội bộ để các container khác giao tiếp bảo mật.

---

````yaml
redis:
  image: redis:8-alpine
  container_name: ticket-booking-redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redisdata:/data
  command:
    [
      "redis-server",
      "--maxclients",
      "10000",
      "--appendonly",
      "yes",
      "--appendfsync",
      "everysec",
      "--maxmemory",
      "128mb",
      "--maxmemory-policy",
      "allkeys-lru",
    ]
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 5s
    timeout: 3s
    retries: 5
    start_period: 5s
  networks:
    - ticket-booking-net
  deploy:
    resources:
      limits:
        cpus: "0.25"
        memory: 128M
      reservations:
        memory: 32M

### 2. Giải thích chi tiết phần `redis` (Cache & Lock)

- **`image: redis:8-alpine`**: Sử dụng Redis phiên bản 8 trên nhân Alpine Linux siêu nhẹ.
- **`ports: - '6379:6379'`**: Ánh xạ cổng `6379` của Redis để kết nối từ bên ngoài.
- **`volumes: - redisdata:/data`**: Lưu trữ dữ liệu Redis bền vững thông qua volume `redisdata`.
- **`command`**: Tối ưu hóa Redis cho bài toán Đặt vé tải cao:
  - `--maxclients 10000`: Cho phép tối đa 10,000 kết nối đồng thời từ các NestJS instances.
  - `--appendonly yes` và `--appendfsync everysec`: Đồng bộ dữ liệu xuống đĩa mỗi giây một lần để bảo đảm an toàn dữ liệu mà vẫn duy trì tốc độ ghi cực nhanh trên RAM.
  - **`--maxmemory 128mb`**: Giới hạn Redis chỉ được chiếm tối đa **128MB RAM** cho bộ đệm dữ liệu.
  - **`--maxmemory-policy allkeys-lru`**: Thuật toán giải phóng bộ nhớ. Khi đầy RAM 128MB, Redis sẽ tự động xóa các key ít được sử dụng gần đây nhất (LRU) để nhường chỗ cho key mới, tránh bị tràn RAM gây crash dịch vụ.
- **`healthcheck`**: Chạy lệnh `redis-cli ping`. Nếu trả về `PONG`, Redis đang hoạt động tốt.
-- **`deploy.resources`**: Khống chế Redis chỉ sử dụng tối đa **25% CPU** và **128MB RAM** (`limits`), đồng thời cam kết tối thiểu cấp phát **32MB RAM** (`reservations`).

### 3. Giải thích chi tiết phần `caddy` (Web Server & Reverse Proxy)

```yaml
caddy:
  image: caddy:2-alpine
  container_name: ticket-booking-caddy
  restart: unless-stopped
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./Caddyfile:/etc/caddy/Caddyfile
    - caddy_data:/data
    - caddy_config:/config
  networks:
    - ticket-booking-net
  deploy:
    resources:
      limits:
        cpus: "0.15"
        memory: 128M
      reservations:
        memory: 64M
  depends_on:
    - postgres
    - redis
````

-- **`image: caddy:2-alpine`**: Sử dụng Caddy Web Server phiên bản 2 trên nền Alpine Linux siêu nhẹ.
-- **`ports: - '80:80'` và `- '443:443'`**: Ánh xạ cổng HTTP (80) và HTTPS (443) ra ngoài máy ảo để nhận traffic công cộng.
-- **`volumes`**:
+- `./Caddyfile:/etc/caddy/Caddyfile`: Mount file cấu hình định tuyến của Caddy từ máy thật vào container.
+- `caddy_data:/data` và `caddy_config:/config`: Lưu trữ dữ liệu chứng chỉ Let's Encrypt đã cấp xuống đĩa của máy thật để tránh bị xin cấp lại (rate limit) khi khởi động lại container.
-- **`deploy.resources`**: Giới hạn Caddy dùng tối đa **15% CPU** và **128MB RAM**, cam kết tối thiểu **64MB RAM** chạy ổn định.
-- **`depends_on`**: Đảm bảo Postgres và Redis khởi chạy trước Caddy.

---

---

### 3. Phần Định Nghĩa Toàn Cục (`volumes` & `networks`)

```yaml
volumes:
  pgdata:
  redisdata:

networks:
  ticket-booking-net:
    driver: bridge
```

- **`volumes`**: Khai báo danh sách các Volume độc lập được quản lý bởi Docker Engine nhằm lưu trữ dữ liệu vĩnh viễn (Persistent Data).
- **`networks`**: Khai báo mạng ảo nội bộ tên là `ticket-booking-net` sử dụng driver `bridge`. Các container trong mạng này có thể tự tìm thấy nhau qua tên dịch vụ (ví dụ: host kết nối là `postgres` hoặc `redis`) và được cô lập khỏi môi trường mạng bên ngoài để bảo mật.

---

## III. CÁC CÂU HỎI PHỎNG VẤN THƯỜNG GẶP (FAQ & TRẢ LỜI MẪU)

### Q1: Tại sao em lại chọn Docker Compose cho dự án này thay vì cài trực tiếp Postgres/Redis lên máy?

- **Trả lời mẫu:**
  > "Dạ, việc dùng Docker Compose giúp em giải quyết vấn đề **nhất quán môi trường**. Nếu cài trực tiếp, mỗi thành viên trong team có thể cài một phiên bản Postgres khác nhau (ví dụ bản 15, bản 16), dẫn đến lỗi không tương thích. Với Docker Compose, chỉ cần chạy một lệnh duy nhất là toàn bộ team đều chạy chung Postgres 18 và Redis 8 giống hệt nhau.
  > Ngoài ra, nó giúp máy local sạch sẽ, không bị rác cổng hay xung đột dịch vụ, và khi không cần dùng nữa em chỉ cần xóa container đi là xong."

### Q2: Sự khác biệt giữa `ports: - '5432:5432'` và việc không khai báo ports mà chỉ dùng `networks` là gì?

- **Trả lời mẫu:**
  > "Dạ, phần `ports` dùng để **publish** cổng từ bên trong Container ra ngoài máy Host (máy thật của mình). Nhờ đó các tool bên ngoài như TablePlus mới truy cập được database.
  > Còn nếu không khai báo `ports` mà chỉ khai báo `networks`, thì **chỉ có các Container ở trong cùng một mạng ảo** mới kết nối được với nhau (ví dụ ứng dụng NestJS chạy trong docker kết nối tới Postgres). Đây là một thực hành bảo mật rất tốt trên Production để tránh expose (lộ) database ra môi trường internet."

### Q3: Em thiết lập `healthcheck` trong docker-compose nhằm mục đích gì?

- **Trả lời mẫu:**
  > "Dạ, Container ở trạng thái 'Running' chỉ nghĩa là tiến trình Docker đã chạy, chứ chưa chắc hệ điều hành Postgres bên trong đã khởi động xong và sẵn sàng nhận kết nối.
  > Em dùng `healthcheck` để NestJS App hoặc các dịch vụ phụ thuộc biết chính xác khi nào Postgres/Redis đã **thực sự sẵn sàng**. Trong các file compose nâng cao hoặc công cụ orchestration, mình có thể cấu hình `depends_on: postgres: condition: service_healthy` để ứng dụng chỉ khởi động sau khi DB đã sẵn sàng hoàn toàn, tránh lỗi crash kết nối lúc khởi chạy."

### Q4: Giải thích lý do em sử dụng ảnh (image) dạng `-alpine`?

- **Trả lời mẫu:**
  > "Dạ, các image Alpine Linux được xây dựng trên một bản phân phối Linux siêu tối giản.
  > Việc này mang lại 3 lợi ích lớn:
  >
  > 1. **Dung lượng nhỏ:** Giúp kéo/đẩy image từ Docker Hub rất nhanh, tiết kiệm băng thông và bộ nhớ ổ đĩa.
  > 2. **Hiệu năng:** Khởi động container cực nhanh do không phải chạy các tiến trình chạy ngầm dư thừa.
  > 3. **Bảo mật:** Ít thư viện dư thừa đồng nghĩa với việc giảm thiểu tối đa các lỗ hổng bảo mật (vulnerabilities) mà hacker có thể khai thác."

### Q5: Tại sao em lại giới hạn tài nguyên RAM/CPU (limits/reservations) cho các container và cấu hình thêm maxmemory cho Redis?

- **Trả lời mẫu:**
  > "Dạ, đây là các tối ưu hóa phục vụ việc kiểm thử tải (Load Testing), bảo vệ hệ điều hành và chạy trên môi trường VPS cấu hình thấp (chẳng hạn Azure VM B1s chỉ có 1GB RAM):
  >
  > 1. **Khống chế và cam kết tài nguyên (Limits/Reservations):** Em giới hạn cứng cho Postgres tối đa là 512MB RAM, Redis là 128MB RAM, NestJS (chạy ngoài compose qua docker run) là 256MB RAM và Caddy là 128MB RAM. Điều này ngăn chặn tình huống một trong các dịch vụ bị rò rỉ bộ nhớ hoặc quá tải làm treo hoàn toàn hệ điều hành của VPS.
  > 2. **Chống quá tải phần cứng (OOM):** Khai báo `reservations` (ví dụ Postgres tối thiểu 256MB RAM) đảm bảo hệ điều hành luôn ưu tiên cấp đủ RAM chạy database ổn định. Đối với Redis, việc kết hợp cấu hình Docker limits `128M` cùng cấu hình nội bộ `--maxmemory 128mb` và cơ chế đào thải key `allkeys-lru` đảm bảo cache tự động dọn dẹp khi đầy mà không lo bị hệ điều hành tắt tiến trình đột ngột."

---

## IV. BÍ QUYẾT TRẢ LỜI PHỎNG VẤN ĐỂ GÂY ẤN TƯỢNG (PRO-TIPS)

1. **Đừng học vẹt:** Hãy hiểu bản chất rằng Docker chỉ là một cách đóng gói phần mềm.
2. **Sử dụng thuật ngữ chuyên môn một cách tự nhiên:** Nói các từ như _Containerization_, _Data Persistence_ (Bền vững dữ liệu), _Network Isolation_ (Cô lập mạng), _Ephemeral_ (Tạm thời), _Overhead_ (Chi phí tài nguyên hao phí), _Resource Limitation_ (Giới hạn tài nguyên), _Eviction Policy_ (Chính sách đào thải dữ liệu).
3. **Tự tin thừa nhận giới hạn nhưng nhấn mạnh tư duy:** Nếu người ta hỏi một câu khó về Docker mà bạn chưa biết (ví dụ cấu hình Docker Swarm hay Kubernetes), hãy trả lời:
   > _"Dạ, ở môi trường local của dự án này, em tập trung dùng Docker Compose để cấu hình môi trường nhất quán cho Team Dev và tối ưu hiệu năng cơ bản cho Postgres/Redis. Về phần vận hành lớn quy mô Production như Kubernetes hay Docker Swarm thì em chưa có cơ hội trực tiếp triển khai thực tế, nhưng em nắm rõ tư duy container hóa và sẵn sàng tìm hiểu rất nhanh nếu dự án yêu cầu."_
